import React, {useState} from "react"
import {AnnotationType} from "../types"
import styles from "./AnnotationCard.module.css"

type AnnotationCardType = {
    annotation: AnnotationType,
    top?: boolean
    closed?: boolean
    gray?: boolean
}

const AnnotationCard: React.FC<AnnotationCardType> = (props) => {
    const [open, setOpen] = useState(!props.closed)
    const {data} = props.annotation
    const [openSections, setOpenSections] = useState(Array.isArray(data.sections)? data.sections.map(() => false): [])
    const toggleSectionOpen = (index: number) => setOpenSections(current => current.map((val, i) => val === (i !== index)))

    return (
        <div className={`${styles.main} ${props.gray? styles.gray : null}`}>
            <div className={styles.header} onClick={() => setOpen(current => !current)}>
                <div className={styles.author}>{props.annotation.data.author}</div>
                <div className={styles.date}>{props.annotation.data.date}</div>
            </div>

            {open &&
                <>
                    <div className={styles.content}>{data.content}</div>

                    <div className={styles.scoreBlockContainer}>
                        {Array.isArray(props.annotation.data.sections) &&
                            props.annotation.data.sections.map(({header, content}, sectionIndex) => (
                                <div key={sectionIndex} className={`${styles.scoreBlock}`}>
                                    <div
                                        className={`${styles.scoreBlockHeader} ${openSections[sectionIndex]? styles.scoreBlockHeaderOpen : null}`}
                                        onClick={() => toggleSectionOpen(sectionIndex)}>
                                        {header}
                                    </div>
                                    {openSections[sectionIndex] &&
                                    <div className={styles.scoreBlockContent}>{content}</div>}
                                </div>
                            ))}
                    </div>

                    <div className={styles.childrenContainer}>{props.children}</div>
                </>}

        </div>
    )
}

export default AnnotationCard
