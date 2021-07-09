import React, {useState} from "react"
import parse from "../mdParser"
import MDEditor from "./MDEditor"
import {mdToNode} from "../processing"
import ContentBlock from "../ContentBlock/ContentBlock"
import TexProvider from "../Tex/TexProvider"

export default {
    title: "MDEditor",
    component: MDEditor,
}

const style = {
    flex: 1,
    overflow: "auto",
    alignItems: "stretch",
}

const defaultText = `
# hi im a header

$$0.5 = {1 \\over 2}$$

normal **bold** *italic* \`inline code\` $\\pi = 3.1459...$ [facebook.com](https://facebook.com)

> blockquote

    code block

- unordered list

---

1. ordered list

![google logo](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

![dead image]()

`

export const Example = () => {

    const [md, setMD] = useState(defaultText)
    const [node, setNode] = useState(mdToNode(md))

    return (
        <div
            className={"MDEditor"}
            style={{
                display: "flex",
                flexDirection: "row",
            }}>

            <MDEditor value={md} style={style} rows={50} onMDChange={setMD} onNodeChange={setNode}/>
            <pre style={style}>{JSON.stringify(parse(md), null, 4)}</pre>
            <pre style={style}>{JSON.stringify(node && node.toJS(), null, 4)}</pre>
            <div style={style}>
                {node &&
                    <TexProvider>
                        <ContentBlock node={node}/>
                    </TexProvider>}
            </div>
        </div>
    )
}
