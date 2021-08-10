// https://codesandbox.io/s/dynamic-size-of-react-window-list-items-64o9p

import React, {useState, useRef, useCallback, useEffect} from "react"
import {AnnotationType, ContentNode, ContentNodeType} from "../types"
import SelectionManager from "../SelectionManager/SelectionManager"
import {List, Map} from "immutable"
import TopLevelContentBlock from "../TopLevelContentBlock/TopLevelContentBlock"
import {VariableSizeList} from "react-window"

import * as styles from "./ContentViewer.module.css"

type ContentViewerType = {
    root: ContentNodeType
    setActiveNode: (activeNode: ContentNodeType | null) => void
    setActiveNodeRef: (activeNodeRef: React.RefObject<HTMLDivElement> | null) => void
    setUserSelection: (selection: AnnotationType | null) => void
    setActiveAnnotationId: (val: number | ((id: number) => number)) => void
    setContentViewerOffset: (val: number) => void
    height: number
}

/*
Right now, this carries selection state and does its own annotation weaving. Presumably we will need to move state up
here when there is something up to move it to.
 */
const ContentViewer: React.FC<ContentViewerType> = (props) => {

    // which node is active is tracked locally using it's index
    const [activeIndex, setActiveIndex] = useState(NaN)

    // we keep track of how tall each TopLevelContentBlock is for windowing purposes
    // when they render, they will use the setSize callback to report their height
    const indexToHeight = useRef(Map<number, number>())

    // wrapping in useCallback guarantees that the same function will be used on each render
    const setSize = useCallback((index: number, size: number) => {
        indexToHeight.current = indexToHeight.current.set(index, size)
    }, [])

    const listRef = useRef<any>(null)

    // When we first render the list, we wont know how tall the children are because we haven't rendered them yet
    // this can lead to them all being drawn on top of each other. This function tells the list component to look at
    // all the children and do it again.
    const redraw = () => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0)
        }
    }

    // This forces a redraw when the list renders. After the render, an `onScroll` handler on the list component
    // ensures redraws happen as necessary.
    useEffect(redraw)

    // TODO(Leo): why doesn't this work?
    useEffect(() => {
        window.addEventListener("resize", redraw)
        return () => window.removeEventListener("resize", redraw)
    })

    let topLevelContentNodes = List<ContentNodeType>()
    if (typeof props.root.content === "string" || props.root.content === undefined){
        return <div>{props.root.content}</div>
    } else if (List.isList(props.root.content)) {
        topLevelContentNodes = props.root.content
    } else {
        topLevelContentNodes = List.of(props.root.content)
    }

    const setActiveNode = (index: number, r: React.RefObject<HTMLDivElement>) => {
        // lots of stuff happens when we switch active node
        setActiveIndex(index)
        props.setActiveNode(topLevelContentNodes.get(index, null))
        props.setActiveNodeRef(r)
    }

    // inside the windowing component, we only have access to the current index, we use this map to look up
    // which node that corresponds to
    const indexToContentNode = Map(topLevelContentNodes.map((c, i) => [i, c]))

    return (
        <div className={"ContentViewer"} id={"ContentViewer"} style={{position: "relative"}}>
            <SelectionManager selectionCallback={props.setUserSelection}>
                <VariableSizeList
                    // @ts-ignore
                    className={styles.List}
                    onScroll={({scrollOffset}) => {
                        props.setContentViewerOffset(scrollOffset)
                        redraw()
                    }}
                    ref={listRef}
                    // estimatedItemSize={100} // does this do anything?
                    itemSize={index => indexToHeight.current.get(index, 50)}
                    height={props.height}
                    itemCount={topLevelContentNodes.size}
                    width={"100%"}>
                    {({index, style}) => (
                        <div
                            // @ts-ignore
                            className={styles.ListEach}
                            style={style}>
                            <TopLevelContentBlock
                                index={index}
                                node={indexToContentNode.get(index, ContentNode())}
                                active={activeIndex === index}
                                setSize={setSize}
                                setActiveNodeRef={(r: React.RefObject<HTMLDivElement>) => setActiveNode(index, r)}
                                setActiveAnnotationId={props.setActiveAnnotationId}/>
                        </div>
                    )}
                </VariableSizeList>
            </SelectionManager>
        </div>
    )
}

export default ContentViewer
