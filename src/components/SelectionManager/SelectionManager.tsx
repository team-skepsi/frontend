import React, {useRef} from 'react'
import {Annotation, AnnotationType} from '../types'
import './SelectionManager.css'

// class for elements which should not be selectable
export const NO_SELECT_CLASS = "SelectionManager-no-select"

/*
finds the length of the text in the range not counting any elements which match selector
 */
const rangeTrueLen = (node: DocumentFragment | Element, selector: string): number => {
    if (node.children.length){
        return Array.from(node.children)
            .filter(el => !el.matches(selector))
            .map(el => rangeTrueLen(el, selector))
            .reduce((current, next) => current + next, 0)
    } else {
        return node.textContent?.length || 0
    }
}

/*
uses window.getSelection() to get the user's current selection and generates a corresponding annotation, deleting the
selection when done
 */
const getSelectionRelativePosition = (referenceNode: HTMLDivElement) => {
    let selectionRange
    try {
        selectionRange = window.getSelection()?.getRangeAt(0)
    } catch (err){
        console.log(err)
        return null
    }

    if (selectionRange && !selectionRange.collapsed){

        const selectionLen = rangeTrueLen(selectionRange.cloneContents(), "." + NO_SELECT_CLASS)

        selectionRange.setEnd(selectionRange.startContainer, selectionRange.startOffset)
        selectionRange.setStartBefore(referenceNode)

        const offset = rangeTrueLen(selectionRange.cloneContents(), "." + NO_SELECT_CLASS)

        selectionRange.collapse()
        selectionRange.detach()


        if (selectionLen !== 0){
            return Annotation({_id: 0, start: offset, stop: offset + selectionLen, _user: true})
        }
    }

    return null
}

type SelectionManagerType = {
    selectionCallback: (annotation: AnnotationType | null) => void
}

/*
Wraps some text. When the text is selected, it creates an `Annotation` and feeds it to `selectionCallback`.
 */
const SelectionManager: React.FC<SelectionManagerType> = (props) => {
    const ref: React.Ref<HTMLDivElement> = useRef(null)
    const onMouseUp = () => {
        if (ref.current === null){
            throw Error("SelectionManager not rendered yet")
        }
        props.selectionCallback(getSelectionRelativePosition(ref.current))
    }
    const onMouseDown = () => props.selectionCallback(null)

    return (
        <div
            ref={ref}
            className={"SelectionManager"}
            id={"SelectionManager-reference"}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}>
            {props.children}
        </div>
    )
}

export default SelectionManager
