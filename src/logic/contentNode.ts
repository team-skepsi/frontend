import {List, Record, RecordOf, Set} from "immutable"
import {RefObject} from "react"
import {AnnotationType} from "./annotation"

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
const ContentNode = Record(contentNodeDefaults,"ContentNode")

export default ContentNode
