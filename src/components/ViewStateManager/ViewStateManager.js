import React, {useState} from "react"

import PaperViewer from "../PaperViewer/PaperViewer"
import Navbar from "../Navbar/Navbar"
import Cover from "../Cover/Cover"
import {Dimmer, Loader} from 'semantic-ui-react'

import * as styles from "./ViewStateManager.module.css"

const ViewStateManager = (props) => {
    const {md, ...paperMetadata} = props.document

    const [scrollable, setScrollable] = useState(true)

    if (props.loading) {
        return (
            <div>
                <Dimmer active>
                    <Loader/>
                </Dimmer>
            </div>)
    }
    if (props.document) {
        return (
            <div className={styles.main} style={{overflow: scrollable? "auto": "hidden"}}>
                <div style={{height: 0}}>
                    <Navbar usesPageWrapper={true}/>
                </div>

                <div
                    className={styles.coverContainer + " " + styles.snapOn}
                    style={{
                        background: `url(${process.env.REACT_APP_API_AUDIENCE}media/media/Roma.jpg) center center`,
                        backgroundSize: "cover"
                    }}>
                    <Cover
                        paperMetadata={paperMetadata}
                        scores={props.scores}
                        loading={props.loading}
                    />
                </div>

                <div className={styles.snapOn}>
                    <PaperViewer
                        document={props.document}
                        annotations={props.annotations}
                        setScrollable={setScrollable}/>
                </div>

            </div>
        )
    }
}

export default ViewStateManager
