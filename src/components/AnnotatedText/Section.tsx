import React from "react"
import {Set} from "immutable"
import {AnnotationType} from "../types"

const highlightStyle = (annotations: Set<AnnotationType>): object => {
    const depth = annotations.size
    const colors = ["transparent", "yellow", "orange", "red", "purple"]
    return {backgroundColor: colors[Math.min(depth, colors.length)]}
}

type SectionType = {
    annotations: Set<AnnotationType>
    children: string
}

const Section: React.FC<SectionType> = (props) => {
    const annotationProps = props.annotations
        .map(a => {
            try {
                return a.data.sectionProps
            } catch (e) {
                return {}
            }
        })
        .reduce((a, b) => ({...a, ...b}), {style: {}})

    return (
        <span
            {...annotationProps}
            style={{
                ...annotationProps.style,
                ...highlightStyle(props.annotations),
                position: "relative",
            }}
            className={"Section"}>
            {props.children}
        </span>
    )
}

export default Section
