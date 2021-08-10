import React, {useState} from "react"
import {VscInfo, VscSymbolRuler, VscFileMedia, VscBook, VscChevronLeft, VscChevronRight} from "react-icons/vsc"
import {IconContext} from "react-icons"

import TableContents from "../TableContents/TableContents"
import CitationViewer from "../CitationViewer/CitationViewer"
import ReferenceViewer from "../ReferenceViewer/ReferenceViewer"
import FigureViewer from "../FigureViewer/FigureViewer"

import styles from "./Tooltip.module.css"

const options = [
    [<VscInfo/>, CitationViewer],
    [<VscSymbolRuler/>, TableContents],
    [<VscFileMedia/>, FigureViewer],
    [<VscBook/>, ReferenceViewer],
]

export const KNOB_DRAG_HANDLE_CLASS = "KNOB_DRAG_HANDLE"

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

    // if we've been told to freeze, use the saved value, otherwise run the calculation and save the new value
    const [topPrev, setTopPrev] = useState(45)
    const getTop = () => {
        if (props.freeze){
            return topPrev
        } else {
            const val = (typeof props.top === "function" ? props.top() : props.top) || 45
            if (val !== topPrev){
                setTopPrev(val)
            }
            return val
        }
    }

    return (
        <div className={styles.main} style={{width: props.width}}>
            <div className={styles.dynamicPosition} style={{height: 150, top: getTop()}}>
                <IconContext.Provider value={{color: "#E3DBD4"}}>
                    <div className={styles.knob}>
                        <div className={styles.knobNav}>
                            <VscChevronLeft />
                        </div>

                        <div className={styles.knobMain}>
                            <div className={KNOB_DRAG_HANDLE_CLASS + " " + styles.knobHighlightCursor}>
                                <div className={styles.knobHighlightCursorInner}/>
                            </div>

                            <div className={styles.knobMainSpacer}/>

                            <div className={styles.knobMenuButtonsHairline}>
                                <div className={styles.knobMenuButtons}>
                                    {thumbnails.map((thumbnail, i) => (
                                        <IconContext.Provider
                                            key={i}
                                            value={i === featureComponentIndex?
                                                {color: "#837C7C", size: 16.5}:
                                                {color: "#E3DBD4", size: 16.5}}>
                                            <div
                                                className={`
                                                    ${styles.knobMenuButtonEachContainer}
                                                    ${i === featureComponentIndex? styles.knobMenuActive : null}
                                                `}
                                                key={i}
                                                onClick={makeClickCallback(i)}>
                                                {thumbnail}
                                            </div>
                                        </IconContext.Provider>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.knobNav}>
                            <VscChevronRight/>
                        </div>
                    </div>
                </IconContext.Provider>

                {!isNaN(featureComponentIndex) && components[featureComponentIndex] &&
                    <div className={styles.knobFeatureContainer}>
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
