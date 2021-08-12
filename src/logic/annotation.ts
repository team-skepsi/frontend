import {List, Record, RecordOf} from "immutable"

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
        children?: {
            id?: string
        }[]
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

const Annotation = Record(annotationDefaults,"Annotation")

export default Annotation
