import React from "react"
import {Meta} from "@storybook/react"
import {Set} from "immutable"
import AnnotationGroup from "./AnnotationGroup"
import {AnnotationTree} from "../AnnotationSidebar/AnnotationSidebar"
import {Annotation} from "../types"

export default {
    title: "Annotations/AnnotationGroup",
    component: AnnotationGroup,
} as Meta

export const Example = () => {
    const ann = Annotation({
        data: {
            author: "Leo Ware",
            content: "that's a good point!",
            date: "4 hours ago",
            sections: [
                {header: "header 1", content: "content 1"},
                {header: "header 2", content: "content 2"},
                {header: "header 3", content: "content 3"},
            ]
        }
    })

    const tree = AnnotationTree({
        annotation: ann,
        depth: 0,
        children: Set.of(
            AnnotationTree({
                annotation: ann,
                depth: 1,
                children: Set.of(
                    AnnotationTree({
                        annotation: ann,
                        depth: 2,
                    }),
                    AnnotationTree({
                        annotation: ann,
                        depth: 2,
                        children: Set.of(
                            AnnotationTree({annotation: ann, depth: 3})
                        ),
                    }),
                ),
            }),
            AnnotationTree({annotation: ann, depth: 1})
        )
    })

    return <AnnotationGroup annotationTree={tree} />
}
