import React, {useRef} from "react"
import {Set} from "immutable"
import {ContentNodeType} from "../types"
import ContentBlock from "../ContentBlock/ContentBlock"
import {nodePrettyId} from "../functions"
import {nodesInNode} from "../processing"

import styles from "./TopLevelContentBlock.module.css"

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
    const numAnnotationsInKids = nodesInNode(props.node).reduce(
        (c, n) => c.concat(n.props.annotations?
            n.props.annotations.filter(a => !a._user).map(a => a._id) : Set()),
        Set()
    ).size

    const selectMe = () => !excludedContentTypes.has(props.node.type) && props.setActiveNodeRef(ref)

    return (
        <div
            id={nodePrettyId(props.node)}
            className={styles.main}
            ref={ref}
            onMouseUp={selectMe}
        >
            <ContentBlock node={props.node} />
            <div onClick={selectMe} className={styles.dotTarget}>
                {
                    numAnnotationsInKids === 0? <></> :
                        numAnnotationsInKids === 1? <div className={`${styles.dot} ${styles.dotSmall}`} /> :
                            [2, 3, 4].includes(numAnnotationsInKids)? <div className={`${styles.dot} ${styles.dotMed}`} /> :
                                <div className={`${styles.dot} ${styles.dotBig}`} />
                }
            </div>
        </div>
    )
}

export default TopLevelContentBlock
