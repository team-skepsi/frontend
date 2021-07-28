import React from "react"

import PaperViewer from "../PaperViewer/PaperViewer"
import Navbar from "../Navbar/Navbar"
import Cover from "../Cover/Cover"

import * as styles from "./ViewStateManager.module.css"

const ViewStateManager = (props) => {
    const {md, ...paperMetadata} = props.document
    return (
        <div>
            <div style={{height: 0}}>
                <Navbar usesPageWrapper={true}/>
            </div>

            <div
                className={styles.coverContainer}
                style={{
                    background: `url(${process.env.REACT_APP_API_AUDIENCE}media/media/Roma.jpg) center center`,
                    backgroundSize: "cover"
                }}>
                <Cover
                    paperMetadata={paperMetadata}
                    scores={props.scores}/>
            </div>

            <PaperViewer document={props.document} annotations={props.annotations}/>
        </div>
    )
}

export default ViewStateManager
