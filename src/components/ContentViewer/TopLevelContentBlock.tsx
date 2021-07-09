import React, {useRef} from "react"
import {Set} from "immutable"
import {ContentNodeType} from "../types"
import ContentBlock from "../ContentBlock/ContentBlock"
import {nodePrettyId} from "../functions";

type TopLevelContentBlockType = {
    node: ContentNodeType
    active: boolean
    setActiveNodeRef: (r: React.Ref<null>) => void
}

const excludedContentTypes = Set([
    "newline"
])

const TopLevelContentBlock: React.FC<TopLevelContentBlockType> = (props) => {

    const ref = useRef(null)

    return (
        <div
            id={nodePrettyId(props.node)}
            className={"TopLevelContentBlock"}
            ref={ref}
            style={{position: "relative", padding: "5px 0"}}

            // question of taste which event to use here
            onMouseUp={() => !excludedContentTypes.has(props.node.type) && props.setActiveNodeRef(ref)}
        >
            <ContentBlock node={props.node} />
        </div>
    )
}

export default TopLevelContentBlock
