import React, {useState} from "react"
import {List, Set, Map} from "immutable"
import AnnotationCard, {AnnotationCardType} from "../AnnotationCard/AnnotationCard"
import {AnnotationType} from "../types"
import {formatDate} from "../functions"

const annotationToAnnotationCard = (a: AnnotationType): AnnotationCardType => ({
    id: a._id,
    activeAnnotation: a._user,
    author: a.data.author?.username || a._user? "me": "???",
    date: a.data.date || formatDate(new Date(Date.now())),
    text: a.data.content || "",
    scoreBlocks: a.data.scores
        ? a.data.scores.map(({scoreNumber, explanation, category, id}: {scoreNumber: number, id: number, explanation: string, category: string}) =>
            ({scoreNumber, category, id, text: explanation}))
        : [],
    userCouldEdit: true,
    beingEdited: a._user,
})

// takes a `Set` of `Annotation`s and constructs a `List` of `AnnotationCard` trees
export const annotationsToTreesOfAnnotationCards = (annotations: Set<AnnotationType>) => {

    const annotationsList = List(annotations)
        // .filter(a => a._user)
        .sort((a, b) => (a.start - b.start) || (a._id - b._id))

    const idToAnnotation = Map(annotationsList.map(a => a._id).zip(annotationsList))
    const idsOfAnnotationsWhichAreChildren = annotationsList.reduce((current, next) =>
        current.concat(next.data.children || Set()), Set())
    const annotationCardsNotChildren = annotationsList
        .filter(a => !idsOfAnnotationsWhichAreChildren.has(a._id))
        .map(annotationToAnnotationCard)

    // takes a top level `AnnotationCard` and recursively assembles the tree of replies beneath (returning a new card)
    const attachReplies = (a: AnnotationCardType): AnnotationCardType => {
        const childrenIds = a.id === undefined ? undefined: idToAnnotation.get(a.id)?.data.children
        return {
            ...a,
            replies: Array.isArray(childrenIds)
                ? (childrenIds
                    .map(i => idToAnnotation.get(i), undefined)
                    .filter((a: AnnotationType | undefined) => a !== undefined) as AnnotationType[])
                    .map(annotationToAnnotationCard)
                    .map(attachReplies) // recursive construction of subtrees
                : []
        }
    }

    return annotationCardsNotChildren.map(attachReplies)
}

type ReplyType = {
    parent: number
    card: AnnotationCardType
}

// takes a `List` of replies and a tree of `AnnotationCard`s and attaches the replies to the relevant cards
const overlayReplies = (tree: AnnotationCardType, replies: List<ReplyType>): AnnotationCardType => {

    const parentIdToCards = replies.reduce((current, next) => (
        current.set(next.parent, current.get(next.parent, List<AnnotationCardType>()).push(next.card))
    ), Map<number, List<AnnotationCardType>>())

    const _overlay = (tree: AnnotationCardType): AnnotationCardType => ({
        ...tree,
        replies: [
            ...(tree.replies || []).map(_overlay),
            ...(tree.id === undefined || isNaN(tree.id)? []:
                Array.from(parentIdToCards.get(tree.id, [])))
        ]
    })
    return _overlay(tree)
}

// recursively & immutably sets the `onReply` value of an AnnotationCard tree using the provided `createReply` callback
const overlayReplyCreationCallbacks = (createReply: (id: number) => void, a: AnnotationCardType): AnnotationCardType => ({
    ...a,
    onReply: () => (
        typeof a.id === "number" &&
        !isNaN(a.id) &&
        createReply(a.id)
    ),
    replies: a.replies && a.replies.map(a => overlayReplyCreationCallbacks(createReply, a)),
})

type AnnotationSidebarType = {
    annotations: Set<AnnotationType>
}

const AnnotationSidebar: React.FC<AnnotationSidebarType> = (props) => {

    const [replies, setReplies] = useState(List<ReplyType>())

    const createReply = (parentId: number) => {
        setReplies(replies => replies.push({
            parent: parentId,
            card: {
                author: "me",
                date: formatDate(new Date(Date.now())),
                beingEdited: true,
                userCouldEdit: true,
                activeReply: true,
            }
        }))
    }

    return (
        <div className={"AnnotationSidebar"}>
            {annotationsToTreesOfAnnotationCards(props.annotations)
                .map(tree => overlayReplies(tree, replies))
                .map(tree => overlayReplyCreationCallbacks(createReply, tree))
                .map(tree => <AnnotationCard key={tree.id} {...tree} />)
            }
        </div>
    )
}

export default AnnotationSidebar
