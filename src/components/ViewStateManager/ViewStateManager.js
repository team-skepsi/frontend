import React, {useState} from "react"
import {DraggableCore} from "react-draggable"
import {Set} from "immutable"
import {Annotation} from "../types"
import {weaveMDAnnotations} from "../processing"

import ContentViewer from "../ContentViewer/ContentViewer"
import Cover from "../Cover/Cover.js"
import TooltipRefRelative from "../Tooltip/TooltipRefRelative"
import AnnotationSidebar from "../AnnotationSidebar/AnnotationSidebar"

import styles from './ViewStateManager.module.css'

/*
takes document, an object with a md property carrying a string, and annotations, a JSON of annotations with start, stop
and id, which are all integers or strings
 */
const ViewStateManager = (props) => {
    const [userSelection, setUserSelection] = useState(null)

    const [activeNode, setActiveNode] = useState(null)
    const [activeNodeRef, setActiveNodeRef] = useState(null)
    const [featureBarWidth, setFeatureBarWidth] = useState("35%")

    const {md, ...paperMetadata} = props.document

    const unwovenAnnotations = Set(props.annotations.map((annotation) => {
        const {start, stop, id, ...rest} = annotation
        return Annotation({
            start: parseInt(start),
            stop: parseInt(stop),
            _id: parseInt(annotation.id),
            data: Object.freeze(rest)
        })
    }))

    const [root, annotations] = weaveMDAnnotations(
        md,
        userSelection ? unwovenAnnotations.add(userSelection) : unwovenAnnotations
    )

    return (
        <div className={styles.main}>

            <div className={styles.menuStandin}/>

            <div className={styles.coverContainer}>
                <Cover paperMetadata={paperMetadata}/>
            </div>

            <div className={styles.mainContainer}>

                <div className={styles.paperContainer}>
                    <ContentViewer
                        root={root}
                        annotations={annotations}
                        activeNode={activeNode}
                        activeNodeRef={activeNodeRef}
                        setActiveNode={setActiveNode}
                        setActiveNodeRef={setActiveNodeRef}
                        setUserSelection={setUserSelection}
                    />
                </div>

                <DraggableCore
                    axis={"x"}
                    handle={".Knob-highlight-cursor"}
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
                        <AnnotationSidebar annotations={annotations}/>
                    </div>
                    </div>
                </DraggableCore>

            </div>
        </div>
    )
}

export default ViewStateManager
