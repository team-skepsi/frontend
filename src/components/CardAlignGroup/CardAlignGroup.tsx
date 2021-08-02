import React, {useRef, useState} from "react"
import CardAlignGroupCore from "./CardAlignGroupCore"

type CardAlignGroupType = {
    keys?: number[]
    cards: React.ReactElement[]
    alignRefs: React.RefObject<HTMLDivElement>[]
    activeCardIndex: number
    margin?: number
}

const CardAlignGroup: React.FC<CardAlignGroupType> = (props) => {
    const [ref] = useState(useRef<null | HTMLDivElement>(null))

    const heights = props.alignRefs.map((r) =>
        r.current === null || ref.current === null? 30:
            r.current.getBoundingClientRect().y - ref.current.getBoundingClientRect().y
    )

    return (
        <div ref={ref}>
            <CardAlignGroupCore
                keys={props.keys}
                cards={props.cards}
                heights={heights}
                activeCardIndex={props.activeCardIndex}
                margin={props.margin}/>
        </div>
    )
}

export default CardAlignGroup
