import React, {useCallback, useMemo, useRef, useState} from "react"
import {DraggableCore} from "react-draggable"
import {Set, Map} from "immutable"
import {VscInfo, VscSymbolRuler, VscFileMedia, VscBook} from "react-icons/all"

import Annotation, {AnnotationType} from "../../logic/annotation"
import {ContentNodeType} from "../../logic/contentNode"
import {mdToNode, weaveNodeAnnotations} from "../../logic/processing"
import {nodeMap, nodesInNode} from "../../logic/functions"
import {addSingleAnnotation} from "../../logic/functions"

import ContentViewer from "../ContentViewer/ContentViewer"
import TooltipRefRelative from "../Tooltip/TooltipRefRelative"
import AnnotationSidebar from "../AnnotationSidebar/AnnotationSidebar"
import CitationViewer from "../CitationViewer/CitationViewer"
import TableContents from "../TableContents/TableContents"
import FigureViewer from "../FigureViewer/FigureViewer"
import ReferenceViewer from "../ReferenceViewer/ReferenceViewer"

import {KNOB_DRAG_HANDLE_CLASS} from "../Tooltip/Tooltip"
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
    const [userSelection, _setUserSelection] = useState<null | AnnotationType>(null)

    const setUserSelection = useCallback((val: (null | AnnotationType) | ((val: null | AnnotationType) => null | AnnotationType)) => {

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
    }, [_setUserSelection]) // TODO: possible bug here with missing dependency

    const [activeNode, setActiveNode] = useState<null | ContentNodeType>(null)
    const [activeNodeRef, setActiveNodeRef] = useState<null | React.RefObject<HTMLDivElement>>(null)
    const [activeAnnotationId, _setActiveAnnotationId] = useState(NaN)

    const setActiveAnnotationId = useCallback((val: number | ((val: number) => number)) => {
        _setActiveAnnotationId(val)
        if (val !== -1){
            _setUserSelection(null)
        }
    }, [_setActiveAnnotationId, _setUserSelection])

    const [activeResize, setActiveResize] = useState(false)
    const [featureBarWidth, setFeatureBarWidth] = useState<string | number>("35%")

    // memo means paperMetadata remains the same, preventing tooltip rendering on resize
    const {md, ...paperMetadata} = useMemo(() => props.document, [props.document])

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
        const related = (a: AnnotationType) => !isNaN(a.start) && !isNaN(a.stop) && a.start !== a.stop
        return [
            parsedAnnotations.filter(related),
            parsedAnnotations.filterNot(related)
        ]
    }, [props.annotations])

    const parsedMD = useMemo(() => mdToNode(md), [md])

    // memoize so it doesn't run on resize
    const [rootNoHighlight, annotationsNoHighlight, nodeIdToRef] = useMemo(() => {

        const [root, annotationsWovenRelated] = weaveNodeAnnotations(parsedMD, relatedToText)
        const annotations = annotationsWovenRelated.concat(notRelatedToText)

        // maps from node id to a ref to that node
        const nodeIdToRef = Map(nodesInNode(root).map((node) => [node._id, React.createRef<HTMLElement>()]))
        const rootWithRefs = nodeMap(root, node => node.merge({nodeRef: nodeIdToRef.get(node._id)}))

        return [rootWithRefs, annotations, nodeIdToRef]
    }, [notRelatedToText, relatedToText, parsedMD])

    // add the activeHighlight in if it exists
    const [root, annotations] = useMemo(() => {
        if (!userSelection){
            return [rootNoHighlight, annotationsNoHighlight]
        } else {
            const [root, annotation] = addSingleAnnotation(rootNoHighlight, userSelection)
            return [root, annotationsNoHighlight.add(annotation)]
        }
    }, [rootNoHighlight, annotationsNoHighlight, userSelection])

    const draggableRef = useRef(null)

    return (
        <div className={styles.main}>

            <div className={styles.mainContainer}>

                <div className={styles.paperContainer} style={{position: 'relative'}}>
                    {useMemo(() => (
                        // doesn't render on resize
                        <ContentViewer
                            root={root}
                            setActiveNode={setActiveNode}
                            setActiveNodeRef={setActiveNodeRef}
                            setUserSelection={setUserSelection}
                            setActiveAnnotationId={setActiveAnnotationId}
                        />
                        ),[root, setActiveNode, setActiveNodeRef, setUserSelection, setActiveAnnotationId]
                    )}
                </div>

                <DraggableCore
                    // @ts-ignore TODO(Leo): ts thinks axis is irrelevant?
                    axis={"x"}
                    handle={"." + KNOB_DRAG_HANDLE_CLASS}
                    // adjustment of half the width of the slider = 21px TODO(Leo): this doesn't work!
                    onDrag={useCallback(e => setFeatureBarWidth("clientX" in e ? window.innerWidth - e.clientX : + 21), [setFeatureBarWidth])}
                    onStart={useCallback(() => setActiveResize(true), [setActiveResize])}
                    onStop={useCallback(() => setActiveResize(false), [setActiveResize])}
                    nodeRef={draggableRef}>
                    <div
                        ref={draggableRef}
                        className={styles.tooltipContainer}
                        style={{flexBasis: featureBarWidth}}>

                        <div className={styles.tooltipVertical}/>

                        {useMemo(() => (
                            <TooltipRefRelative
                                activeNodeRef={activeNodeRef}
                                freeze={activeResize}
                                options={[
                                    [<VscInfo/>, <CitationViewer paperMetadata={paperMetadata}/>],
                                    [<VscSymbolRuler/>, <TableContents content={root}/>],
                                    [<VscFileMedia/>, <FigureViewer paperMetadata={paperMetadata}/>],
                                    [<VscBook/>, <ReferenceViewer paperMetadata={paperMetadata}/>],
                                ]}>
                            </TooltipRefRelative>
                        ), [activeNodeRef, activeResize, JSON.stringify(paperMetadata), root])}

                        {/* what is this for? did i put this here? --Leo */}
                        <div style={{
                            width: '80%',
                            position: 'relative',
                            left: '50px'
                        }}/>

                        {useMemo(() => (
                            // doesn't render on resize
                            <div className={styles.annotationSidebarContainer}>
                                <AnnotationSidebar
                                    annotations={annotations}
                                    activeAnnotationId={activeAnnotationId}
                                    setActiveAnnotationId={setActiveAnnotationId}
                                    nodeIdToRef={nodeIdToRef}
                                    killActiveSelection={() => setUserSelection(null)}/>
                            </div>
                            ), [annotations, activeAnnotationId, setActiveAnnotationId, nodeIdToRef, setUserSelection]
                        )}
                    </div>
                </DraggableCore>
            </div>
        </div>
    )
}

export default PaperViewer
