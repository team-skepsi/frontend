import React, {useState} from "react"
import {range, zip} from "../functions"

type CardAlignGroupCoreType = {
    keys?: number[]
    cards: React.ReactElement[]
    heights: number[]
    activeCardIndex: number
    margin?: number
}

const CardAlignGroupCore: React.FC<CardAlignGroupCoreType> = (props) => {

    // set defaults
    const keys = props.keys || []
    const margin = props.margin || 5
    const activeIndexPresort = props.activeCardIndex >= 0 && props.activeCardIndex < props.cards.length
        ? props.activeCardIndex
        : 0

    // generate refs to the card containers
    const [refs] = useState(props.cards.map(() => React.createRef<HTMLDivElement>()))

    const lengths = refs.map(r => r.current).includes(null)
        ? refs.map(() => 0)
        : refs.map(r => (r.current as HTMLDivElement).getBoundingClientRect().height)

    // sort cards
    const sorted = zip(
        props.heights,
        zip(
            props.cards,
            props.cards.map((_, i) => i === activeIndexPresort)
        )
    ).sort((a, b) => a[0] - b[0])

    const heights = sorted.map(x => x[0])
    const cards = sorted.map(x => x[1][0])
    const activeIndex = sorted.map(x => x[1][1]).indexOf(true)

    // gonna edit this guy until he has all the right heights to use
    const useHeights = [...heights]

    // expand cards above
    for (const i of range(activeIndex)){
        useHeights[i] = Math.max(
            (useHeights[i - 1] || 0) + lengths[i] + margin,
            heights[i]
        )
    }

    // set active card height
    useHeights[activeIndex] = heights[activeIndex]

    // nudge above cards back up as necessary
    for (const i of range(activeIndex).reverse()){
        useHeights[i] = Math.min(
            useHeights[i + 1] - margin - lengths[i],
            useHeights[i]
        )
    }

    // expand cards below
    for (const i of range(activeIndex + 1, cards.length)){
        useHeights[i] = Math.max(
            useHeights[i - 1] + lengths[i] + margin,
            heights[i]
        )
    }

    return (
        <div style={{position: "relative"}}>
            {cards.map((card, i) =>
                <div ref={refs[i]} key={keys[i]} style={{transition: "top 0.5s", position: "absolute", top: useHeights[i]}}>
                    {card}
                </div>
            )}
        </div>
    )
}

export default CardAlignGroupCore
