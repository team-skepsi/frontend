import React from 'react'
import './Cover.css'

const Cover = (props) => {
    if (!props.paperMetadata){
        return <div />
    }

    return (
        <div className={"Cover"}>
            <div className={'Cover-paper-wrapper'}>
                <div className={"Cover-parent"}>

                    <div className={"Cover-title-metadata-container"}>
                        <div className={"Cover-title-container"}>
                            <h1 className={"Cover-title"}>{props.paperMetadata.title || "TITLE"}</h1>
                        </div>

                        <div className={"Cover-metadata-container"}>
                            <div className={"Cover-metadata"}>
                                <div>
                                    <p className={"Cover-icon-text"}>{props.paperMetadata.authors || "AUTHOR"}</p>
                                </div>
                                <div>
                                    <p className={"Cover-icon-text"}>{props.paperMetadata.createdDate || "DATE"}</p>
                                </div>
                                <div>
                                    <p className={"Cover-icon-text"}>
                                        {props.paperMetadata.topic ? props.paperMetadata.topic.header : "HEADER"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'Cover-abstract'}>
                        <p className={'Cover-abstract-text'}>{props.paperMetadata.abstract || "Abstract not found"}</p>
                    </div>

                </div>
            </div>
            <div className={'Cover-annotation-wrapper'}/>
        </div>
    )
}

export default Cover
