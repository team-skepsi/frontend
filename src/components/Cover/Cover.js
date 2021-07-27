import React, { useState, useRef } from 'react'
import styles from './Cover.module.css'
import ScoreMetadata from '../ScoreMetadata/ScoreMetadata.js'
import { Modal, Icon, Divider } from 'semantic-ui-react'

const Cover = (props) => {
    const [open, setOpen] = useState(false)
    const abstractTextRef = useRef()
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
                        <Divider className={styles.metadataDivider} style={{
                            marginLeft: '20px',
                            marginRight: '20px',
                          }}/>

                    </div>
                    <div className={styles.abstractToolboxBar}>
                      <div className={styles.flexBox} />
                        <div className={styles.buttonWrapper}
                          onClick={()=>{navigator.clipboard.writeText(abstractTextRef.current.innerText)}}>
                              <Icon bordered fitted name="linkify" color="white" style={{pointerEvents: 'none'}} />
                        </div>
                      <div className={styles.buttonWrapper}
                        onClick={()=>setOpen(true)}>
                            <Icon bordered fitted name="expand" color="white" style={{pointerEvents: 'none'}} />
                      </div>
                    </div>
                    <div className={styles.abstractWrapper}>
                    <div className={styles.abstract}>
                        <p className={styles.abstractText} ref={abstractTextRef}>{props.paperMetadata.abstract || "Abstract not found"}</p>
                    </div>
                    </div>
                </div>
            </div>

            <div className={styles.annotationWrapper}>
              <ScoreMetadata
                scores = { props.scores }
                />
            </div>
            <Modal
              onClose={()=>setOpen(false)}
              onOpen={()=>setOpen(true)}
              open={open}
              >
              <Modal.Header className={styles.modalHeader}>
                <h3 classname={styles.modalHeaderText}>
                  Paper Abstract</h3>
              </Modal.Header>
              <Modal.Content scrolling>
                <p className={styles.modalContentText}>{props.paperMetadata.abstract || "Abstract not found"}</p>
              </Modal.Content>
          </Modal>

        </div>
    )
}

export default Cover
