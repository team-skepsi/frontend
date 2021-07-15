import React from "react"
import {Meta} from "@storybook/react"
import {Set} from "immutable"
import AnnotationSidebar from "./AnnotationSidebar"
import {Annotation} from "../types"

import "../../App.css"

export default {
    title: "Annotations/AnnotationSidebar",
    component: AnnotationSidebar,
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

    const annotations = Set([
        ann.merge({_id: 0, data: {...ann.data, children: [1, 2, 3]}}),
        ann.merge({_id: 1, data: {...ann.data, children: []}}),
        ann.merge({_id: 2, data: {...ann.data, children: [4]}}),
        ann.merge({_id: 3, data: {...ann.data, children: []}}),
        ann.merge({_id: 4, data: {...ann.data, children: [5, 6]}}),
        ann.merge({_id: 5, data: {...ann.data, children: [7]}}),
        ann.merge({_id: 6, data: {...ann.data, children: []}}),
        ann.merge({_id: 7, data: {...ann.data, children: []}}),
        ann.merge({_id: 8, data: {...ann.data, children: [9]}}),
        ann.merge({_id: 9, data: {...ann.data, children: []}}),
    ])

    return <AnnotationSidebar annotations={annotations} />
}
