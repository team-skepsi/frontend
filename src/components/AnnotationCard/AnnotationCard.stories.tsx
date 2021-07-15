import React from "react"
import {Meta} from "@storybook/react"
import AnnotationCard from "./AnnotationCard"
import {Annotation} from "../types"

import "../../App.css"

export default {
    title: "Annotations/AnnotationCard",
    component: AnnotationCard,
} as Meta

export const Default = () => {

    const ann = Annotation({
        data: {
            author: "Leo Ware",
            content: "hi im a good point",
            date: "4 hours ago",
            sections: [
                {header: "header 1", content: "content 1"},
                {header: "header 2", content: "content 2"},
                {header: "header 3", content: "content 3"},
                {header: "header 4", content: "content 4"},
                {header: "header 5", content: "content 5"},
            ]
        }
    })

    return <AnnotationCard annotation={ann}/>
}

export const Gray = () => {
    const ann = Annotation({
        data: {
            author: "Leo Ware",
            content: "hi im a good point",
            date: "4 hours ago",
            sections: [
                {header: "header 1", content: "content 1"},
                {header: "header 2", content: "content 2"},
                {header: "header 3", content: "content 3"},
                {header: "header 4", content: "content 4"},
                {header: "header 5", content: "content 5"},
            ]
        }
    })

    return <AnnotationCard annotation={ann} gray/>
}

export const StartsClosed = () => {
    const ann = Annotation({
        data: {
            author: "Leo Ware",
            content: "hi im a good point",
            date: "4 hours ago",
            sections: [
                {header: "header 1", content: "content 1"},
                {header: "header 2", content: "content 2"},
                {header: "header 3", content: "content 3"},
                {header: "header 4", content: "content 4"},
                {header: "header 5", content: "content 5"},
            ]
        }
    })

    return <AnnotationCard annotation={ann} closed/>
}
