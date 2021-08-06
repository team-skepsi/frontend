import Heap from "heap"
import {List, Set, Map} from "immutable"
import {SingleASTNode} from "simple-markdown"
import {AnnotationType, ContentNode, ContentNodeType, isAst} from "./types"
import {isAscending} from "./functions"
import parse from "./mdParser"

/*
Translates the annotation into the reference frame defined by start and stop
 */
export const translateAnnotation = (start: number, stop: number, a: AnnotationType) => {
    if (isAscending([a.start, a.stop, start, stop]) || isAscending([start, stop, a.start, a.stop])){
        throw Error(`no overlap between annotation ${[a.start, a.stop]} and section ${[start, stop]}`)
    }
    return a.merge({
        start: Math.max(0, a.start - start),
        stop: Math.min(stop - start, a.stop - start),
    })
}

/*
Takes a list of lists of annotation types and marks each one as first the first time
 */
export const doMarkFirst = <T>(annotationGroups: List<[T, Set<AnnotationType>]>, key: (a: AnnotationType, n: T) => string): List<[T, Set<AnnotationType>]> => {
    let s = Set<string>()
    return annotationGroups.map(([item, annotations]) => {
        const newAnnotations = annotations.map((a) => {
            const k = key(a, item)
            if (s.has(k)) {
                return a.merge({_first: false})
            } else {
                s = s.add(k)
                return a.merge({_first: true})
            }
        })

        return [item, newAnnotations]
    })
}

/*
Takes the items, takes the annotations, makes the groups
 */
export const assignAnnotations = <T>(len: (item: T) => number, annotations: Set<AnnotationType>, items: List<T>): List<[T, Set<AnnotationType>]> => {
    const heap = new Heap<AnnotationType>((a: AnnotationType, b: AnnotationType) => a.stop - b.stop)
    let annotationsLeft = List(annotations).sort((a, b) => b.start - a.start)
    let pos = 0

    const annotationGroups = items.map((item) => {
        const itemLen = len(item)
        const nextPos = pos + itemLen

        while (heap.peek() && heap.peek().stop <= pos) {
            heap.pop()
        }

        while (annotationsLeft.last() && (annotationsLeft.last() as AnnotationType).start < nextPos) {
            heap.push(annotationsLeft.last())
            annotationsLeft = annotationsLeft.pop()
        }

        const withAnnotations = Set(heap.toArray()).map(a => translateAnnotation(pos, nextPos, a))
        pos = nextPos
        return withAnnotations
    })

    return items.zip(annotationGroups)
}

/*
Recursive type coercion of an ast tree
 */
export const astToNode = (astNode: SingleASTNode): ContentNodeType => {
    let {type, content, ...rest} = astNode

    // simple-markdown sometimes loads the nodes down with crap we don't want
    const props: {[key: string]: any} = {}
    for (const key in rest){
        if (rest.hasOwnProperty(key) && key[0] !== "_"){
            props[key] = rest[key]
        }
    }

    // recursive calls
    if (Array.isArray(content)) {
        content = List(content.map((c) => {
            if (isAst(c)){
                return astToNode(c)
            } else {
                throw Error("content array can only contain ast")
            }
        }))
    } else if (isAst(content)) {
        content = astToNode(content)
    }

    return ContentNode({
        type: type,
        content: content,
        props: props
    })
}

/*
Uses the Khan function to convert the function and wraps the result in a div
 */
export const mdToNode = (md: string) => astToNode(ContentNode({
    type: "div",
    content: List(parse(md)).map(astToNode),
}))

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

/*
Augments each nodes annotations with the annotations from each of it's children
 */
export const trickleUpAnnotations = (root: ContentNodeType) => {
    return nodeMap(root, (node) => {
        let newAnnotations = Set<AnnotationType>()

        if (List.isList(node.content)) {
            node.content.forEach((childNode) => {
                if (childNode.props.annotations){
                    newAnnotations = newAnnotations.concat(childNode.props.annotations)
                }
            })
        } else if (node.content !== undefined && typeof node.content !== "string" && node.content.props.annotations){
            newAnnotations = newAnnotations.concat(node.content.props.annotations)
        }
        const useAnnotations = (node.props.annotations || Set<AnnotationType>())
            .concat(newAnnotations.map(a => a.merge({start: NaN, stop: NaN})))
        return node.merge({props: {...node.props, annotations: useAnnotations}})
    })
}

/*
assigns unique ids to every node in a ContentNode tree
 */
export const idsForContentNode = (node: ContentNodeType) => {
    let i = 0
    return nodeMap(node, (n: ContentNodeType) => n.merge({_id: i++}))
}

/*
returns a list of annotations where each annotation knows which node ids it is associated with, both annotations and
nodes need to have unique ids supplied elsewhere for the result to make sense
 */
const getAnnotationNodeIds = (tuples: List<[ContentNodeType, Set<AnnotationType>]>, annotations: Set<AnnotationType>) => {
    const aIds: {[aId: number]: number[]} = {}
    annotations.forEach(a => aIds[a._id] = [])
    tuples.forEach(([node, nodeAnnotations]) => {
        nodeAnnotations.forEach((a) => aIds[a._id].push(node._id))
    })
    return annotations.map(a => a.merge({_node_id: List(aIds[a._id])}))
}

/*
chops up the nodes so every annotation knows its _text
 */
export const getAnnotationText = (node: ContentNodeType, annotations: Set<AnnotationType>) => {
    const uberString = nodesInNode(node)
        .filter(n => typeof n.content === "string")
        .reduce((val, next) => val + next.content, "")
    return annotations.map(a => a.merge({_text: uberString.substring(a.start, a.stop)}))
}

/*
tells each content node how many character precede it in the document
 */
const markStartIndex = (node: ContentNodeType) => {
    const _markStartIndex = (node: ContentNodeType, offset: number): [ContentNodeType, number] => {
        node = node.merge({startIndex: offset})

        const kids = List.isList(node.content)
            ? node.content
            : !(node.content === undefined || typeof node.content === "string")
                ? List.of(node.content)
                : null

        if (List.isList(kids)){
            node = node.merge({
                content: kids.map((each) => {
                    const [newKid, endOffset] = _markStartIndex(each, offset)
                    offset = endOffset
                    return newKid
                })
            })
        } else if (typeof node.content === "string") {
            offset += node.content.length
        }

        return [node, offset]
    }

    return _markStartIndex(node, 0)[0]
}


/*
tells the nodes which annotations they get, tells the annotations which text they get
 */
export const weaveNodeAnnotations = (node: ContentNodeType, annotations: Set<AnnotationType>): [ContentNodeType, Set<AnnotationType>] => {
    const nodeWithId = idsForContentNode(node)
    const annotationGroups = doMarkFirst(
        assignAnnotations(a => typeof a.content === "string"? a.content.length: 0, annotations, nodesInNode(nodeWithId)),
        (a, item) => a._id + item.type
    )
    const augmentedAnnotations = getAnnotationText(nodeWithId, getAnnotationNodeIds(annotationGroups, annotations))
    const annotationGroupsMap = Map(annotationGroups)
    const augmentedNodes = nodeMap(nodeWithId,n => n.merge({props: {...n.props, annotations: annotationGroupsMap.get(n)}}))
    return [markStartIndex(augmentedNodes), augmentedAnnotations]
}

/*
parses the markdown, returns tree which knows about annotations, annotations which know about tree
 */
export const weaveMDAnnotations = (md: string, annotations: Set<AnnotationType>): [ContentNodeType, Set<AnnotationType>] => {
    const node = mdToNode(md)
    return weaveNodeAnnotations(node, annotations)
}
