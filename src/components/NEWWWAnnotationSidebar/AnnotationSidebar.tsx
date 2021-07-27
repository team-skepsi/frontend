import React, {useState} from "react"
import {List, Set, Map} from "immutable"
import AnnotationCard, {AnnotationCardType} from "../NEWWWAnnotationCard/AnnotationCard"
import {AnnotationType} from "../types"
import {formatDate} from "../functions"

const annotationToAnnotationCard = (a: AnnotationType): AnnotationCardType => ({
    id: a._id,
    activeAnnotation: a._user,
    author: a.data.author?.username || a._user? "me": "???",
    date: a.data.date || formatDate(new Date(Date.now())),
    text: a.data.content || "",
    scoreBlocks: a.data.scores
        ? a.data.scores.map(({score, explanation, category}: {score: number, explanation: string, category: string}) =>
            ({score, category, text: explanation}))
        : [],
    userCouldEdit: true,
    beingEdited: a._user,
})

type ReplyType = {
    parent: number
    card: AnnotationCardType
}

type AnnotationSidebarType = {
    annotations: Set<AnnotationType>
}

const AnnotationSidebar: React.FC<AnnotationSidebarType> = (props) => {

    // console.log(props.annotations.toJS())

    const annotationsList = List(props.annotations)
        // .filter(a => a._user)
        .sort((a, b) => (a.start - b.start) || (a._id - b._id))

    const idToAnnotation = Map(annotationsList.map(a => a._id).zip(annotationsList))
    const idsOfAnnotationsWhichAreChildren = annotationsList.reduce((current, next) =>
        current.concat(next.data.children || Set()), Set())

    // find the top level annotations and convert them into the AnnotationCard format
    const annotationCardsNotChildren = annotationsList
        .filter(a => !idsOfAnnotationsWhichAreChildren.has(a._id))
        .map(annotationToAnnotationCard)

    // takes a top level `AnnotationCard` and assemble the tree of replies beneath it (returning a new card)
    const completeTree = (a: AnnotationCardType): AnnotationCardType => {
        const childrenIds = a.id === undefined? undefined: idToAnnotation.get(a.id)?.data.children
        return {
            ...a,
            replies: Array.isArray(childrenIds)
                ? (childrenIds
                    .map(i => idToAnnotation.get(i), undefined)
                    .filter((a: AnnotationType | undefined) => a !== undefined) as AnnotationType[])
                    .map(annotationToAnnotationCard)
                    .map(completeTree) // recursive construction of subtrees
                : []
        }
    }

    // all the annotations we get from props are here
    const trees = annotationCardsNotChildren.map(completeTree)

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

    const overlayReplies = (tree: AnnotationCardType): AnnotationCardType => {

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

    const overlayReplyCallbacks = (a: AnnotationCardType): AnnotationCardType => ({
        ...a,
        onReply: () => (
            typeof a.id === "number" &&
            !isNaN(a.id) &&
            createReply(a.id)
        ),
        replies: a.replies && a.replies.map(overlayReplyCallbacks),
    })

    return (
        <div className={"AnnotationSidebar"}>
            {trees
                .map(overlayReplies)
                .map(overlayReplyCallbacks)
                .map((tree, i) => <AnnotationCard key={i} {...tree} />)
            }
        </div>
    )
}

export default AnnotationSidebar
