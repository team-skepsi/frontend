import React from "react"
import {mdToNode} from "../processing"
import {MDEditorType} from "./MDEditor"

const MDEditorCore: React.FC<MDEditorType> = (props) => {
    const {value, onMDChange, onNodeChange, ...rest} = props

    const onChange: React.ChangeEventHandler = (e) => {
        // @ts-ignore
        const md = e.target.value as string

        if (onMDChange){
            onMDChange(md)
        }
        if (onNodeChange){
            onNodeChange(mdToNode(md))
        }
    }

    return (
        <textarea {...rest} value={value} onChange={onChange} />
    )
}

export default MDEditorCore
