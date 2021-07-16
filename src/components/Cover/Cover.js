import React from 'react'
import styles from './Cover.module.css'
import ScoreMetadata from '../ScoreMetadata/ScoreMetadata.js'

const Cover = (props) => {
    if (!props.paperMetadata){
        return <div />
    }

    return (
        <div className={styles.main}>
            <div className={styles.paperWrapper}>
                <div className={styles.parent}>

                    <div className={styles.titleMetadataContainer}>
                        <div className={styles.titleContainer}>
                            <h1 className={styles.title}>{props.paperMetadata.title || "TITLE"}</h1>
                        </div>

                        <div className={styles.metadataContainer}>
                            <div className={styles.metaData}>
                                <div>
                                    <p className={styles.iconText}>{props.paperMetadata.authors || "AUTHOR"}</p>
                                </div>
                                <div>
                                    <p className={styles.iconText}>{props.paperMetadata.createdDate || "DATE"}</p>
                                </div>
                                <div>
                                    <p className={styles.iconText}>
                                        {props.paperMetadata.topic ? props.paperMetadata.topic.header : "HEADER"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.abstract}>
                        <p className={styles.abstractText}>{props.paperMetadata.abstract || "Abstract not found"}</p>
                    </div>

                </div>
            </div>
            <div className={styles.annotationWrapper}>
              <ScoreMetadata
                scores = { props.scores }
                />
            </div>

        </div>
    )
}

export default Cover
