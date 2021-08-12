import React from "react"
import {scrollToContentNode, nodesInNode} from "../../logic/functions"
import ContentBlock from "../ContentBlock/ContentBlock"
import {ContentNodeType} from "../../logic/contentNode"

type TableContentsType = {
    content: ContentNodeType
}

const TableContents: React.FC<TableContentsType> = (props) => {
    return (
        <div style={{width: 200}}>
            {nodesInNode(props.content)
                .filter(n => n.type === "heading")
                .map((n, i) => (
                    <div
                        key={i}
                        onClick={() => scrollToContentNode(n)}>
                        <ContentBlock node={n.merge({type: "p"})} />
                    </div>
                ))}
        </div>
    )
}

export default TableContents
