import React from "react"
import {List} from "immutable"
import {ContentNode, ContentNodeType} from "../types"

import * as _ContentComponents from "./ContentComponents"
import {astToNode} from "../processing";
import {SingleASTNode} from "simple-markdown";
const ContentComponents = Object.freeze(Object.create(_ContentComponents))

type ContentBlockType = {
    node: ContentNodeType
}

/*
Recursive component to render rich text from a `ContentNode`
 */
const ContentBlock: React.FC<ContentBlockType> = (props) => {

    let type = ContentComponents[props.node.type] || props.node.type
    if (props.node.type === "list"){
        type = props.node.props.ordered? "ol": "ul"
    }

    const content = props.node.type === "list"?
        List(props.node.props.items.flat() as SingleASTNode[])
            .map(astToNode)
            .map(node => ContentNode({type: "li", content: node, props: {start: node.props.start || 1}})) :
        props.node.content

    let children: JSX.Element | List<JSX.Element> | string | undefined
    if (content === undefined || typeof content === "string"){
        children = content
    } else if (List.isList(content)){
        children = content.map((n, i) => <ContentBlock key={i} node={n} />)
    } else {
        children = <ContentBlock node={content} />
    }

    return React.createElement(
        type,
        {...props.node.props, node: props.node},
        children
    )
}

export default ContentBlock
