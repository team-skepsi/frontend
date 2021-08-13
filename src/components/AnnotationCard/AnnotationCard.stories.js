import React from "react"
import AnnotationCard from "./AnnotationCard"
import {formatDate} from "../../utility/functions"

export default {
    title: "Annotations/AnnotationCard",
    component: AnnotationCard,
}

export const Example = () => {
    const props = {
        userCouldEdit: true,
        beingEdited: false,
        author: "Finn Macken",
        date: formatDate(new Date(Date.now())),
        text: "hi im a good point",
        scoreBlocks: [
            {
                category: "validity",
                score: 9,
                text: "100% agree!"
            },
            {
                category: "stuff",
                score: 6,
                text: "pretty obvious"
            }
        ],
        onReply: () => alert("create reply")
    }
    return <AnnotationCard {...props} />
}

export const NestedExample = () => {
    const props = {
        beingEdited: false,
        userCouldEdit: true,
        author: "Leo Ware",
        date: "11/1/2019",
        text: "hi im a good point",
        scoreBlocks: [
            {
                category: "validity",
                score: 9,
                text: "100% agree!"
            },
            {
                category: "importance",
                score: 6,
                text: "pretty obvious"
            }
        ],
        onReply: () => alert("create reply"),
        replies: [
            {
                beingEdited: false,
                userCouldEdit: true,
                author: "Leo Ware",
                date: "11/4/2019",
                text: "oh actually I was wrong it's a bad point",
                onReply: () => alert("create reply"),
            },
            {
                beingEdited: false,
                userCouldEdit: false,
                author: "Andre Vacha",
                date: "12/1/2019",
                text: "i agree",
                onReply: () => alert("create reply"),
                scoreBlocks: [
                    {
                        category: "validity",
                        score: 9,
                        text: "100% agree!"
                    },
                    {
                        category: "importance",
                        score: 6,
                        text: "pretty obvious"
                    }
                ],
            }
        ]
    }
    return <AnnotationCard {...props} />
}
