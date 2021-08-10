import React, {useEffect, useMemo, useRef, useState} from "react"
import {DraggableCore} from "react-draggable"
import {Set, Map} from "immutable"

import {Annotation, AnnotationType, ContentNodeType} from "../types"
import {mdToNode, nodeMap, nodesInNode, weaveNodeAnnotations} from "../processing"
import {KNOB_DRAG_HANDLE_CLASS} from "../Tooltip/Tooltip"

import ContentViewer from "../ContentViewer/ContentViewer"
import TooltipRefRelative from "../Tooltip/TooltipRefRelative"
import AnnotationSidebar from "../AnnotationSidebar/AnnotationSidebar"

import styles from './PaperViewer.module.css'

type PaperViewerType = {
    document: {
        md: string
    }
    annotations: {
        start: string
        stop: string
        id: string
    }[]
}

/*
takes document, an object with a md property carrying a string, and annotations, a JSON of annotations with start, stop
and id, which are all integers or strings
 */
const PaperViewer: React.FC<PaperViewerType> = (props) => {

    const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
    useEffect(() => {
        const callback = () => setViewportHeight(window.innerHeight)
        window.addEventListener("resize", callback)
        return () => window.removeEventListener("resize", callback)
    })

    const [userSelection, _setUserSelection] = useState<null | AnnotationType>(null)

    const setUserSelection = (val: (null | AnnotationType) | ((val: null | AnnotationType) => null | AnnotationType)) => {

        // special id so we can identity user annotations later (ids from db are guaranteed to be positive)
        const userSelectionId = -1
        if (val && "_activeHighlight" in val && val?._activeHighlight){
            val = val.merge({_id: userSelectionId})
        }

        // if we are told to set user selection to a nonnull, we want to update the active annotation to be it
        if (typeof val === "function"){
            const oldVal = val
            val = (current) => {
                const derived = oldVal(current)
                if (derived !== null){
                    setActiveAnnotationId(userSelectionId)
                }
                return derived
            }
        } else if (val !== null){
            setActiveAnnotationId(userSelectionId)
        }

        _setUserSelection(val)
    }

    const [activeNode, setActiveNode] = useState<null | ContentNodeType>(null)
    const [activeNodeRef, setActiveNodeRef] = useState<null | React.RefObject<HTMLDivElement>>(null)
    const [activeAnnotationId, _setActiveAnnotationId] = useState(NaN)

    const setActiveAnnotationId = (val: number | ((val: number) => number)) => {
        _setActiveAnnotationId(val)
        if (val !== -1){
            _setUserSelection(null)
        }
    }

    const [activeResize, setActiveResize] = useState(false)
    const [featureBarWidth, setFeatureBarWidth] = useState<string | number>("35%")

    const {md, ...paperMetadata} = props.document

    const [relatedToText, notRelatedToText] = useMemo(() => {
        const parsedAnnotations = Set(props.annotations.map((annotation) => {
            const {start, stop, id, ...rest} = annotation
            return Annotation({
                start: parseInt(start),
                stop: parseInt(stop),
                _id: parseInt(id),
                data: Object.freeze(rest)
            })
        }))
        return [
            parsedAnnotations.filter(a => !isNaN(a.start) && !isNaN(a.stop)),
            parsedAnnotations.filter(a => isNaN(a.start) || isNaN(a.stop))
        ]
    }, [props.annotations])

    const parsedMD = useMemo(() => mdToNode(md), [md])

    // memoize so it doesn't run on resize
    const [root, annotations, nodeIdToRef] = useMemo(() => {

        const [root, annotationsWovenRelated] = weaveNodeAnnotations(
            parsedMD,
            userSelection ? relatedToText.add(userSelection) : relatedToText
        )
        const annotations = annotationsWovenRelated.concat(notRelatedToText)

        // maps from node id to a ref to that node
        const nodeIdToRef = Map(nodesInNode(root).map((node) => [node._id, React.createRef<HTMLElement>()]))
        const rootWithRefs = nodeMap(root, node => node.merge({nodeRef: nodeIdToRef.get(node._id)}))

        return [rootWithRefs, annotations, nodeIdToRef]
    }, [userSelection, notRelatedToText, relatedToText, parsedMD])

    const draggableRef = useRef(null)

    // ContentViewer declares this as a dependency, so whenever it changes (i.e. whenever featureBarWidth changes by
    // more that a factor of n) ContentViewer knows it has to rerender and resize everything
    const contentViewerRenderSentinel = typeof featureBarWidth === "number"
        ? Math.round(featureBarWidth/30)
        : 0

    const [contentViewerOffset, setContentViewerOffset] = useState(0)

    return (
        <div className={styles.main}>

            <div className={styles.mainContainer}>

                <div className={styles.paperContainer} style={{position: 'relative'}}>
                    {
                        // again, avoid rendering on resize
                        useMemo(
                            () => (
                                <ContentViewer
                                    root={root}
                                    height={viewportHeight}
                                    setActiveNode={setActiveNode}
                                    setActiveNodeRef={setActiveNodeRef}
                                    setUserSelection={setUserSelection}
                                    setActiveAnnotationId={setActiveAnnotationId}
                                    setContentViewerOffset={setContentViewerOffset}
                                />
                            ),
                            [
                                root,
                                viewportHeight,
                                setActiveNode,
                                setActiveNodeRef,
                                setUserSelection,
                                setActiveAnnotationId,
                                contentViewerRenderSentinel,
                                activeResize,
                            ]
                        )
                    }
                </div>

                <DraggableCore
                    // @ts-ignore TODO(Leo): ts thinks axis is irrelevant?
                    axis={"x"}
                    handle={"." + KNOB_DRAG_HANDLE_CLASS}
                    // adjustment of half the width of the slider = 21px TODO(Leo): this doesn't work!
                    onDrag={e => setFeatureBarWidth("clientX" in e ? window.innerWidth - e.clientX : + 21)}
                    onStart={() => setActiveResize(true)}
                    onStop={() => setActiveResize(false)}
                    nodeRef={draggableRef}>
                    <div
                        ref={draggableRef}
                        className={styles.tooltipContainer}
                        style={{flexBasis: featureBarWidth}}>

                        <div className={styles.tooltipVertical}/>

                        <TooltipRefRelative
                            root={root}
                            annotations={annotations}
                            paperMetadata={paperMetadata}
                            activeNode={activeNode}
                            activeNodeRef={activeNodeRef}
                            width={featureBarWidth}
                            freeze={activeResize}>
                        </TooltipRefRelative>

                        {/* what is this for? did i put this here? --Leo */}
                        <div style={{
                            width: '80%',
                            position: 'relative',
                            left: '50px'
                        }}/>

                        <div className={styles.annotationSidebarContainer}>
                            <AnnotationSidebar
                                annotations={annotations}
                                activeAnnotationId={activeAnnotationId}
                                height={viewportHeight}
                                setActiveAnnotationId={setActiveAnnotationId}
                                nodeIdToRef={nodeIdToRef}
                                killActiveSelection={() => setUserSelection(null)}
                                contentViewerOffset={contentViewerOffset}/>
                        </div>
                    </div>
                </DraggableCore>
            </div>
        </div>
    )
}

export default PaperViewer
