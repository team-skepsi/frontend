import React from "react"
import {Set} from "immutable"
import {AnnotationTreeType} from "../AnnotationSidebar/AnnotationSidebar"
import AnnotationCard from "../AnnotationCard/AnnotationCard"

type AnnotationGroupType = {
    annotationTree: AnnotationTreeType
}

const AnnotationGroup: React.FC<AnnotationGroupType> = (props) => {
    return (
        <AnnotationCard
            annotation={props.annotationTree.annotation}
            top={!props.annotationTree.depth}
            closed={props.annotationTree.depth > 1}
            gray={props.annotationTree.depth % 2 === 1}>
            {Set.isSet(props.annotationTree.children) &&
                props.annotationTree.children.map((tree) => (
                    <AnnotationGroup key={tree.annotation._id} annotationTree={tree} />
                    ))}
        </AnnotationCard>
    )
}

export default AnnotationGroup
