import React, {useState} from "react"
import {AnnotationType, ContentNodeType} from "../types"
import SelectionManager from "../SelectionManager/SelectionManager"
import TexProvider from "../Tex/TexProvider"
import {List} from "immutable";
import TopLevelContentBlock from "./TopLevelContentBlock";

type ContentViewerType = {
    root: ContentNodeType
    setActiveNode: (activeNode: ContentNodeType | null) => void
    setActiveNodeRef: (activeNodeRef: React.Ref<null> | null) => void
    setUserSelection: (selection: AnnotationType | null) => void
}

/*
Right now, this carries selection state and does its own annotation weaving. Presumably we will need to move state up
here when there is something up to move it to.
 */
const ContentViewer: React.FC<ContentViewerType> = (props) => {

    // which node is active is tracked locally using it's index
    const [activeIndex, setActiveIndex] = useState(NaN)

    let topLevelContentNodes = List<ContentNodeType>()
    if (typeof props.root.content === "string" || props.root.content === undefined){
        return <div>{props.root.content}</div>
    } else if (List.isList(props.root.content)) {
        topLevelContentNodes = props.root.content
    } else {
        topLevelContentNodes = List.of(props.root.content)
    }

    const setActiveNode = (index: number, r: React.Ref<any>) => {
        // lots of stuff happens when we switch active node
        setActiveIndex(index)
        props.setActiveNode(topLevelContentNodes.get(index, null))
        props.setActiveNodeRef(r)
    }

    return (
        <div className={"ContentViewer"} id={"ContentViewer"} style={{position: "relative"}}>
            <SelectionManager selectionCallback={props.setUserSelection}>
                <TexProvider>
                    {topLevelContentNodes.map((c, i) => (
                        <TopLevelContentBlock
                            key={i}
                            active={activeIndex === i}
                            setActiveNodeRef={(r: React.Ref<null>) => setActiveNode(i, r)}
                            node={c} />
                    ))}
                </TexProvider>
            </SelectionManager>
        </div>
    )
}

export default ContentViewer
