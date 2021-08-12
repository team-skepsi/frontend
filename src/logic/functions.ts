/*

A bunch of general purpose functions that work on the the types etc. specific to this project

 */

import {List, Set} from "immutable"
import {isAscending} from "../utility/functions"
import {ContentNodeType} from "./contentNode"
import {AnnotationType} from "./annotation"

export const nodeIdToPrettyId = (nodeId: number) => "pos-" + nodeId
export const nodePrettyId = (node: ContentNodeType) => nodeIdToPrettyId(node._id)

export const scrollToContentNode = (node: ContentNodeType) => {
    document.getElementById(nodePrettyId(node))?.scrollIntoView({behavior: "smooth", block: "center"})
}

// whether the annotation overlaps with the region designated by start and stop
export const isAnnotationSectionOverlap = (start: number, stop: number, a: AnnotationType) => (
    !(isAscending([a.start, a.stop, start, stop]) || isAscending([start, stop, a.start, a.stop]))
)

/*
Translates the annotation into the reference frame defined by start and stop
 */
export const translateAnnotation = (start: number, stop: number, a: AnnotationType) => {
    if (!isAnnotationSectionOverlap(start, stop, a)){
        throw Error(`no overlap between annotation ${[a.start, a.stop]} and section ${[start, stop]}`)
    }
    return a.merge({
        start: Math.max(0, a.start - start),
        stop: Math.min(stop - start, a.stop - start),
    })
}

/*
Takes a root node a returns a list of all the nodes in the underlying tree
 */
export const nodesInNode = (node: ContentNodeType): List<ContentNodeType> => {
    if (node.content === undefined || typeof node.content === "string"){
        return List([node])
    } else if (!List.isList(node.content)) {
        return List([node, node.content])
    } else {
        return List([node]).concat(
            node.content
                .map(n => nodesInNode(n))
                .reduce((a, b) => a.concat(b), List<ContentNodeType>())
        )
    }
}

/*
recursive map for document node functor
 */
export const nodeMap = (node: ContentNodeType, fn: (n: ContentNodeType) => ContentNodeType): ContentNodeType => {

    let content
    if (node.content === undefined || typeof node.content === "string"){
        content = node.content
    } else if (List.isList(node.content)) {
        content = node.content.map(n => nodeMap(n, fn))
    } else {
        content = nodeMap(node.content, fn)
    }

    return fn(node.merge({content: content}))
}

export const addSingleAnnotation = (root: ContentNodeType, annotation: AnnotationType): [ContentNodeType, AnnotationType] => {
    root = nodeMap(root, (node) => {
        if (typeof node.content === "string"){
            const start = node.startIndex
            const stop = node.startIndex + node.content.length

            if (isAnnotationSectionOverlap(start, stop, annotation)){
                node = node.merge({props: {
                        ...node.props,
                        annotations: (node.props.annotations || Set<AnnotationType>()).add(
                            translateAnnotation(start, stop, annotation)
                        )
                    }})
                annotation = annotation.merge({_node_id: annotation._node_id.push(node._id)})
            }
        }

        // returns the same node object, allowing memoization
        return node
    })

    return [root, annotation]
}
