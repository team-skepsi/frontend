import React from "react"
import {Meta} from "@storybook/react"
import AnnotationSidebar from "./AnnotationSidebar"
import {Set} from "immutable"
import {Annotation} from "../types"

export default {
    title: "toy/AnnotationSidebar",
    component: AnnotationSidebar,
} as Meta

export const Example = () => (
    <AnnotationSidebar annotations={
        Set([
            Annotation({
                _id: 0,
                data: {
                    author: "Leo Ware",
                    date: "1971-27-10",
                    content: "hello",
                    children: [],
                }
            }),
            Annotation({
                _id: 1,
                data: {
                    author: "Finn Macken",
                    date: "1971-11-1",
                    content: "world",
                    children: [],
                }
            }),
            Annotation({
                _id: 2,
                data: {
                    author: "Declan Ware",
                    date: "1971-12-11",
                    content: "foo",
                    children: [0, 1],
                }
            }),
        ])
    } />
)
