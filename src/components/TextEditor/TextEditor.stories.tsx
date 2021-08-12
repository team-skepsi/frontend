import React, {useState} from "react"
import TextEditor from "./TextEditor"
import {Meta} from "@storybook/react"

export default {
    title: "Annotations/TextEditor",
    component: TextEditor,
} as Meta

export const Example = () => {
    const [value, setValue] = useState<string | undefined>("")
    return <TextEditor value={value} onChange={setValue} />
}
