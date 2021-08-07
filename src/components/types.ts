import {List, Record, Set, RecordOf} from "immutable"
import {SingleASTNode} from "simple-markdown"
import {RefObject} from "react"

export const isAst = (thing: any): thing is SingleASTNode => thing && typeof thing.type === "string"

type _AnnotationType = {
    start: number
    stop: number
    data: {
        sectionProps?: object
        author?: {
            username?: string
        }
        date?: string
        content?: string
        [key: string]: any
    }

    _id: number
    _activeHighlight: boolean
    _first: boolean
    _text: string | undefined
    _node_id: List<number>
}

export type AnnotationType = RecordOf<_AnnotationType>

const annotationDefaults: _AnnotationType = {
    start: NaN,
    stop: NaN,
    data: Object.freeze({}),
    _id: NaN,
    _activeHighlight: false,
    _first: false,
    _text: undefined,
    _node_id: List<number>(),
}

export const Annotation = Record(annotationDefaults,"Annotation")

type _ContentNodeType = {
    _id: number
    type: string
    content?: ContentNodeType | List<ContentNodeType> | string
    startIndex: number
    nodeRef?: RefObject<HTMLElement>
    props: {
        annotations?: Set<AnnotationType>
        [key: string]: any
    }
}

export type ContentNodeType = RecordOf<_ContentNodeType>

const contentNodeDefaults: _ContentNodeType = Object.freeze({
    _id: NaN,
    type: 'div',
    content: undefined,
    startIndex: NaN,
    nodeRef: undefined,
    props: Object.freeze({}),
})

// format for storing rich text that gets rendered in the document viewer
export const ContentNode = Record(contentNodeDefaults,"ContentNode")
