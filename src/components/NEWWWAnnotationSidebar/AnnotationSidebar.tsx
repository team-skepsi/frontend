import React, {useState} from "react"
import {List, Set, Map} from "immutable"
import AnnotationCard, {AnnotationCardType} from "../NEWWWAnnotationCard/AnnotationCard"
import {Annotation, AnnotationType} from "../types"
import {formatDate} from "../functions"

const annotationToAnnotationCard = (a: AnnotationType): AnnotationCardType => {
    return {
        id: a._id,
        author: a.data.author,
        date: a.data.date,
        text: a.data.content,
        scoreBlocks: a.data.scores
            ? a.data.scores.map(({score, explanation, category}: {score: number, explanation: string, category: string}) =>
                ({score, category, text: explanation}))
            : [],
        userCouldEdit: true,
    }
}

type AnnotationSidebarType = {
    annotations: Set<AnnotationType>
}

const AnnotationSidebar: React.FC<AnnotationSidebarType> = (props) => {

    const _annotationsList = List(props.annotations).sort((a, b) => (a.start - b.start) || (a._id - b._id))
    const [annotationsList, setAnnotationsList] = useState(_annotationsList)

    const addReply = (annotationId: number) => {
        // not super happy with this next line
        const withId = annotationsList.reduce((current, next) =>
            Math.max(current, next._id) + 1, Number.NEGATIVE_INFINITY)
        setAnnotationsList(
            annotationsList
                .flatMap((a) => (
                    a._id === annotationId
                        ? [
                            a.merge({data: {...a.data, children: [...a.data.children, withId]}}),
                            Annotation({
                                _id: withId,
                                data: {
                                    author: "Me",
                                    date: formatDate(new Date(Date.now())),
                                    children: [],
                                }
                            })
                        ]
                        : [a]
                ))
        )
    }

    const idToAnnotation = Map(annotationsList.map(a => a._id).zip(annotationsList))
    const idsOfAnnotationsWhichAreChildren = annotationsList.reduce((current, next) => current.concat(next.data.children || Set()), Set())
    const annotationCardsNotChildren = annotationsList
        .filter(a => !idsOfAnnotationsWhichAreChildren.has(a._id))
        .map(annotationToAnnotationCard)

    const completeTree = (a: AnnotationCardType): AnnotationCardType => {
        const childrenIds = a.id === undefined? undefined: idToAnnotation.get(a.id)?.data.children
        return {
            ...a,
            replies: Array.isArray(childrenIds)
                ? (childrenIds
                    .map(i => idToAnnotation.get(i), undefined)
                    .filter((a: AnnotationType | undefined) => a !== undefined) as AnnotationType[])
                    .map(annotationToAnnotationCard)
                    .map(completeTree)
                : []
        }
    }

    const overlayReplyCallbacks = (a: AnnotationCardType): AnnotationCardType => ({
        ...a,
        onReply: () => a.id && addReply(a.id),
        replies: a.replies && a.replies.map(overlayReplyCallbacks),
    })

    return (
        <div className={"AnnotationSidebar"}>
            {annotationCardsNotChildren.map(a =>
                <AnnotationCard {...overlayReplyCallbacks(completeTree(a))} />)}
        </div>
    )
}

export default AnnotationSidebar
