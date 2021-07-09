import React, {useState} from "react"
import {VscInfo, VscSymbolRuler, VscFileMedia, VscBook, VscChevronLeft, VscChevronRight} from "react-icons/vsc"
import {IconContext} from "react-icons"

import TableContents from "../TableContents/TableContents"
import CitationViewer from "../CitationViewer/CitationViewer"
// import ReferenceViewer from "../ReferenceViewer/ReferenceViewer"

import "./Tooltip.css"

const options = [
    [<VscInfo/>, <div>Info Panel</div>],
    [<VscSymbolRuler/>, TableContents],
    [<VscFileMedia/>, CitationViewer],
    [<VscBook/>, "ReferenceViewer"],
]

const Tooltip = (props) => {

    const thumbnails = options.map(x => x[0])
    const components = options.map(x => x[1])

    const [featureComponentIndex, setFeatureComponentIndex] = useState(NaN)

    const makeClickCallback = (index) => () => {
        if (featureComponentIndex === index){
            setFeatureComponentIndex(NaN)
        } else {
            setFeatureComponentIndex(index)
        }
    }

    const knobStyles = {
        top: (typeof props.top === "function"? props.top() : props.top) || 45
    }

    return (
        <div className={"Tooltip"} style={{width: props.width}}>
            <div className={"Tooltip-dynamic-position"} style={{height: 150, ...knobStyles}}>
                <IconContext.Provider value={{color: "#E3DBD4"}}>
                    <div className={"Knob"}>
                        <div className={"Knob-nav Knob-nav-prev"}>
                            <VscChevronLeft />
                        </div>

                        <div className={"Knob-main"}>
                            <div className={"Knob-highlight-cursor"}>
                                <div className={"Knob-highlight-cursor-inner"}/>
                            </div>

                            <div className={"Knob-main-spacer"}/>

                            <div className={"Knob-menu-buttons-hairline"}>
                                <div className={"Knob-menu-buttons"}>
                                    {thumbnails.map((thumbnail, i) => (
                                        <IconContext.Provider
                                            key={i}
                                            value={i === featureComponentIndex?
                                                {color: "#837C7C", size: 16.5}:
                                                {color: "#E3DBD4", size: 16.5}}>
                                            <div
                                                className={
                                                    "Knob-menu-button-each-container " +
                                                    ((i === featureComponentIndex)? "Knob-menu-active":"")
                                                }
                                                key={i}
                                                onClick={makeClickCallback(i)}>
                                                {thumbnail}
                                            </div>
                                        </IconContext.Provider>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={"Knob-nav Knob-nav-next"}>
                            <VscChevronRight/>
                        </div>
                    </div>
                </IconContext.Provider>

                {!isNaN(featureComponentIndex) && components[featureComponentIndex] &&
                    <div className={"Knob-feature-container"}>
                        {typeof components[featureComponentIndex] !== "function"? components[featureComponentIndex]:
                            React.createElement(
                                components[featureComponentIndex],
                                {
                                    paperMetadata: props.paperMetadata,
                                    content: props.root,
                                    annotations: props.annotations,
                                    activeNode: props.activeNode,
                                    activeNodeRef: props.activeNodeRef,
                                }
                            )}
                    </div>}
            </div>
        </div>
    )
}

export default Tooltip
