import React, {useContext, useState} from "react"
import {List, Set, Map, Seq} from "immutable"

import AnnotationCard, {AnnotationCardType} from "../AnnotationCard/AnnotationCard"
import CardAlignGroup from "../CardAlignGroup/CardAlignGroup"

import {UserContext} from "../../App"
import {formatDate, nodeIdToPrettyId} from "../functions"
import {AnnotationType} from "../types"

const annotationToAnnotationCard = (a: AnnotationType): AnnotationCardType => ({
    id: a._id,
    start: a.start,
    stop: a.stop,
    user: a._user,
    author: a.data.author ? a.data.author.username: "???",
    date: a.data.date || formatDate(new Date(Date.now())),
    text: a.data.content || "",
    scoreBlocks: a.data.scores
        ? a.data.scores.map(({scoreNumber, explanation, field, id}: {scoreNumber: number, id: number, explanation: string, field: string}) =>
            ({scoreNumber, category: field, id, text: explanation}))
        : [],
    userCouldEdit: true,
    beingEdited: a._user,
    annotation: a,
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
    activeAnnotationId: number
    setActiveAnnotationId: (id: number) => void
    nodeIdToRef: Map<number, React.RefObject<HTMLElement>>
    killActiveSelection: () => void
}

const AnnotationSidebar: React.FC<AnnotationSidebarType> = (props) => {

    const [replies, setReplies] = useState(List<ReplyType>())

    const user = useContext(UserContext)

    const createReply = (parentId: number) => {
        setReplies(replies => replies.push({
            parent: parentId,
            card: {
                author: user,
                date: formatDate(new Date(Date.now())),
                beingEdited: true,
                userCouldEdit: true,
                activeReply: true,
            }
        }))
    }

    const trees = Seq(annotationsToTreesOfAnnotationCards(props.annotations))
    const treeRefs: List<React.RefObject<HTMLDivElement>> = List(Array(trees.size).map(() => React.createRef()))

    const [_x, _set_x] = useState(0)
    const lookAgain = () => _set_x(Math.random())

    const cardElements = List(trees
        .map(tree => overlayReplies(tree, replies))
        .map(tree => overlayReplyCreationCallbacks(createReply, tree))
        .map((tree, i) => (
            <AnnotationCard
                nodeRef={treeRefs.get(i)}
                key={tree.id}
                active={tree.id === props.activeAnnotationId}
                onClick={() => props.setActiveAnnotationId(tree.id === undefined? NaN: tree.id)}
                onChange={() => lookAgain()}
                killActiveSelection={props.killActiveSelection}
                {...tree} />
            ))
    )

    const cards = List(trees
        .map(tree => tree.id)
        .zip(cardElements)
        .map(([id, card]) => ({key: id || 0, card: card}))
    )

    const alignRefs = List(trees
        .map(tree => tree.annotation?._node_id.get(0, NaN) || NaN)
        .map(id => document.getElementById(nodeIdToPrettyId(id)))
        .map(el => ({current: el}))
    )

    // const alignRefs = List(trees
    //     .map(tree => tree.annotation?._node_id.get(0, undefined) || undefined)
    //     .map(id => id === undefined? React.createRef<HTMLElement>(): props.nodeIdToRef.get(id, React.createRef<HTMLElement>()))
    // )

    const activeCardIndex = trees
        .map((x, i): [AnnotationCardType, number] => [x, i])
        .filter(([x]) => x.id === props.activeAnnotationId)
        .map(([_, i]) => i)
        .take(1)
        .get(0, NaN)

    return (
        <div className={"AnnotationSidebar"}>
            <CardAlignGroup
                cards={cards}
                // @ts-ignore
                alignRefs={alignRefs}
                lookAgain={_x}
                activeCardIndex={activeCardIndex}/>
        </div>
    )
}

export default AnnotationSidebar
