import React, {useMemo, useState} from "react"
import {DraggableCore} from "react-draggable"
import {Set} from "immutable"

import {Annotation} from "../types"
import {weaveMDAnnotations} from "../processing"
import {KNOB_DRAG_HANDLE_CLASS} from "../Tooltip/Tooltip"

import ContentViewer from "../ContentViewer/ContentViewer"
import TooltipRefRelative from "../Tooltip/TooltipRefRelative"
import AnnotationSidebar from "../AnnotationSidebar/AnnotationSidebar"

import styles from './PaperViewer.module.css'

/*
takes document, an object with a md property carrying a string, and annotations, a JSON of annotations with start, stop
and id, which are all integers or strings
 */
const PaperViewer = (props) => {
    const [userSelection, setUserSelection] = useState(null)

    const [activeNode, setActiveNode] = useState(null)
    const [activeNodeRef, setActiveNodeRef] = useState(null)
    const [activeAnnotationId, setActiveAnnotationId] = useState(NaN)

    const [featureBarWidth, setFeatureBarWidth] = useState("35%")

    const {md, ...paperMetadata} = props.document

    // memoize so it doesn't run on resize
    const [root, annotations] = useMemo(() => {
        const parsedAnnotations = Set(props.annotations.map((annotation) => {
            const {start, stop, id, ...rest} = annotation
            return Annotation({
                start: parseInt(start),
                stop: parseInt(stop),
                _id: parseInt(annotation.id),
                data: Object.freeze(rest)
            })
        }))

        const relatedToText = parsedAnnotations.filter(a => !isNaN(a.start) && !isNaN(a.stop))
        const notRelatedToText = parsedAnnotations.filter(a => isNaN(a.start) || isNaN(a.stop))

        const [root, annotationsWovenRelated] = weaveMDAnnotations(md,
            userSelection ? relatedToText.add(userSelection) : relatedToText)
        const annotations = annotationsWovenRelated.concat(notRelatedToText)

        return [root, annotations]
    }, [props.annotations, md, userSelection])

    return (
        <div className={styles.main}>

            <div className={styles.mainContainer}>

                <div className={styles.paperContainer} style={{position: 'relative'}}>
                    {
                        // again, avoid rendering on resize
                        useMemo(() => (
                            <ContentViewer
                                root={root}
                                annotations={annotations}
                                activeNode={activeNode}
                                activeNodeRef={activeNodeRef}
                                setActiveNode={setActiveNode}
                                setActiveNodeRef={setActiveNodeRef}
                                setUserSelection={setUserSelection}
                                setActiveAnnotationId={setActiveAnnotationId}
                            />
                        ), [root, annotations, activeNode, activeNodeRef, setActiveNode, setActiveNodeRef, setUserSelection, setActiveAnnotationId])
                    }
                </div>

                <DraggableCore
                    axis={"x"}
                    handle={"." + KNOB_DRAG_HANDLE_CLASS}
                    // adjustment of half the width of the slider = 21px
                    onDrag={e => setFeatureBarWidth(window.innerWidth - e.clientX + 21)}>
                    <div
                        className={styles.tooltipContainer}
                        style={{flexBasis: featureBarWidth}}>

                        <div className={styles.tooltipVertical}/>

                        <TooltipRefRelative
                            root={root}
                            annotations={annotations}
                            paperMetadata={paperMetadata}
                            activeNode={activeNode}
                            activeNodeRef={activeNodeRef}
                            width={featureBarWidth}>
                        </TooltipRefRelative>

                        <div style={{
                            width: '80%',
                            position: 'relative',
                            left: '50px'
                        }}/>

                        <div className={styles.annotationSidebarContainer}>
                            <AnnotationSidebar
                                annotations={annotations}
                                activeAnnotationId={activeAnnotationId}
                                setActiveAnnotationId={setActiveAnnotationId}/>
                        </div>
                    </div>
                </DraggableCore>
            </div>
        </div>
    )
}

export default PaperViewer
