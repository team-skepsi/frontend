import React, {useState} from "react"
import MDEditorCore from "./MDEditorCore"
import {ContentNodeType} from "../types"

export type MDEditorType = {
    value?: string
    onMDChange?: (md: string | null) => void
    onNodeChange?: (node: ContentNodeType | null) => void
    [key: string]: any
}

const MDEditor: React.FC<MDEditorType> = (props) => {
    const {onMDChange, onNodeChange, ...rest} = props
    const [md, setMD]: [string, any] = useState(props.value || "")

    return (
        <MDEditorCore
            {...rest}
            value={md}
            onMDChange={(md) => {
                setMD(md)
                if(onMDChange){
                    onMDChange(md)
                }
            }}
            onNodeChange={(node) => {
                if (onNodeChange){
                    onNodeChange(node)
                }
            }} />
    )
}

export default MDEditor
