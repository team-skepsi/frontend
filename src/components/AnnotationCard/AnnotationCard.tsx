import React, {useState} from "react"
import {AnnotationType} from "../types"
import styles from "./AnnotationCard.module.css"
import { Accordion } from 'semantic-ui-react'

type AnnotationCardType = {
    annotation: AnnotationType,
    top?: boolean
    closed?: boolean
    gray?: boolean
}

const AnnotationCard: React.FC<AnnotationCardType> = (props) => {
    const [open, setOpen] = useState(!props.closed)
    const {data} = props.annotation
    const [openSections, setOpenSections] = useState(Array.isArray(data.scores)? data.scores.map(() => false): [])
    const toggleSectionOpen = (index: number) => setOpenSections(current => current.map((val, i) => val === (i !== index)))

    return (
        <div className={`${styles.main} ${props.gray? styles.gray : null}`}>
            <div className={styles.header} onClick={() => setOpen(current => !current)}>
                <div className={styles.author}>{props.annotation.data.author ? props.annotation.data.author.username : ""}</div>
                <div className={styles.date}>{props.annotation.data.date ? props.annotation.data.date : "No Date Provided"}</div>
            </div>

            {open &&
                <>
                    <div className={styles.content}>{data.content}</div>

                    <div className={styles.scoreBlockContainer}>
                        {Array.isArray(props.annotation.data.scores) &&
                            props.annotation.data.scores.map((score, sectionIndex) => (
                                <div key={sectionIndex} className={`${styles.scoreBlock}`}>
                                    <div
                                        className={`${styles.scoreBlockHeader} ${openSections[sectionIndex]? styles.scoreBlockHeaderOpen : null}`}
                                        onClick={() => toggleSectionOpen(sectionIndex)}>
                                        <div className={styles.headerFlex}>
                                          <div className={styles.scoreField}>
                                            <p>{score.field}</p>
                                          </div>
                                          <div className={styles.scoreScore}>
                                            <p>{score.score}/10</p>
                                          </div>
                                        </div>
                                    </div>
                                    {openSections[sectionIndex] &&
                                    <div className={styles.scoreBlockContent}>{score.explanation? score.explanation : "No score"}</div>}
                                </div>
                            ))}
                    </div>

                    <div className={styles.childrenContainer}>{props.children}</div>
                </>}

        </div>
    )
}

export default AnnotationCard
