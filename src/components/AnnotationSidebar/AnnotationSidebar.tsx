import React from "react"
import {Set, Map, List, RecordOf, Record} from "immutable"
import {Annotation, AnnotationType} from "../types"
import AnnotationGroup from "../AnnotationGroup/AnnotationGroup"

export type AnnotationTreeType = {
    depth: number,
    annotation: AnnotationType,
    children: Set<RecordOf<AnnotationTreeType>>,
}

export const AnnotationTree = Record({
    depth: 0,
    annotation: Annotation(),
    children: Set(),
} as AnnotationTreeType)

type AnnotationSidebarType = {
    annotations: Set<AnnotationType>
}

const AnnotationSidebar: React.FC<AnnotationSidebarType> = (props) => {

    const annotationsList = List(props.annotations).sort((a, b) => a.start - b.start)

    const idToAnnotation = Map(annotationsList.map(a => a._id).zip(annotationsList))

    const idToChildren = Map(
        annotationsList.map(a => a._id).zip(
            annotationsList
                .map(a => a.data.children)
                .map(children => Array.isArray(children)? Set(children): Set())
                .map(children => children.map(childId => idToAnnotation.get(childId)).filter(x => x))
        )
    ) as Map<number, Set<AnnotationType>>

    const idsOfAnnotationsWhichAreChildren = annotationsList
        .reduce((current, next) => current.concat(next.data.children || []), Set())

    const makeAnnotationTree = (annotation: AnnotationType, depth?: number): RecordOf<AnnotationTreeType> => AnnotationTree({
        depth: depth || 0,
        annotation: annotation,
        children: idToChildren.get(annotation._id, Set<AnnotationType>()).map((annotation: AnnotationType) => makeAnnotationTree(annotation, (depth || 0) + 1)),
    })

    return (
        <div className={"AnnotationSidebar"}>
            {props.annotations
                .filter(a => !idsOfAnnotationsWhichAreChildren.has(a._id))
                .map(a => makeAnnotationTree(a))
                .map(tree => <AnnotationGroup key={tree.annotation._id} annotationTree={tree} />)}
        </div>
    )
}

export default AnnotationSidebar
