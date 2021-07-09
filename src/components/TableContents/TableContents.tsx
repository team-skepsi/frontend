import React from "react"
import {nodesInNode} from "../processing"
import {scrollToContentNode} from "../functions"
import ContentBlock from "../ContentBlock/ContentBlock"
import {ContentNodeType} from "../types"

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
