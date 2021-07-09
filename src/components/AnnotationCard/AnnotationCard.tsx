import React, {useState} from "react"
import {AnnotationType} from "../types"
import "./AnnotationCard.css"

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
        <div className={`AnnotationCard AnnotationCard-top-${Boolean(props.top)} ${props.gray && "AnnotationCard-gray"}`}>
            <div className={"AnnotationCards-header"} onClick={() => setOpen(current => !current)}>
                <div className={"AnnotationCards-author"}>{props.annotation.data.author}</div>
                <div className={"AnnotationCards-date"}>{props.annotation.data.date}</div>
            </div>

            {open &&
                <>
                    <div className={"AnnotationCard-content"}>{data.content}</div>

                    <div className={"AnnotationCard-score-block-container"}>
                        {Array.isArray(props.annotation.data.sections) &&
                            props.annotation.data.sections.map(({header, content}, sectionIndex) => (
                                <div key={sectionIndex} className={`AnnotationCard-score-block AnnotationCard-score-block-${openSections[sectionIndex]? "open": "closed"}`}>
                                    <div
                                        className={`AnnotationCard-score-block-header AnnotationCard-score-block-header-${openSections[sectionIndex]? "open": "closed"}`}
                                        onClick={() => toggleSectionOpen(sectionIndex)}>
                                        {header}
                                    </div>
                                    {openSections[sectionIndex] &&
                                    <div className={"AnnotationCard-score-block-content"}>{content}</div>}
                                </div>
                            ))}
                    </div>

                    <div className={"AnnotationCard-children-container"}>{props.children}</div>
                </>}

        </div>
    )
}

export default AnnotationCard
