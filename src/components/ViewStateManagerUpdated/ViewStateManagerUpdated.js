import React, {useEffect, useRef} from "react"

import PaperViewer from "../PaperViewer/PaperViewer"
import Navbar from "../Navbar/Navbar"
import { Loader, Dimmer, Divider, Icon, Button } from 'semantic-ui-react'
import ScoreMetadata from '../ScoreMetadata/ScoreMetadata.js'
import { Link } from 'react-router-dom'
import NavbarHomepage from '../NavbarHomepage/NavbarHomepage.js'

import * as styles from "./ViewStateManagerUpdated.module.css"

const ViewStateManager = (props) => {
    const {md, ...paperMetadata} = props.document
    const ref = useRef(null)

    const scrollToTop = () => {
        if (ref.current){
            ref.current.scroll({top: 0, behavior: "smooth"})
        }
    }

    return (
        <div ref={ref} className={styles.main}>
          <div style={{height: "60px"}}>
              <NavbarHomepage />
          </div>
          <div className={styles.coverContainer}>
            <div className={styles.paperWrapper}>
              {/*}
              <div className={styles.backButtonWrapper}>
                <Button icon circular inverted>
                  <Link to={`/${props.document.topic.slug}`}>
                    <Icon name='angle left' color='black' fitted size='large' />
                  </Link>
                </Button>
              </div>
              */}
              <div style={{flex: 1}}></div>
              <div className={styles.paperContentWrapper}>
                <p className={styles.titleLabel}>{paperMetadata.journal || "JOURNAL"}</p>
                <div className={styles.paperTitleWrapper}>
                  <h1 className={styles.paperTitle} style={{color: "black"}}>{paperMetadata.title || "TITLE"}</h1>
                </div>
                <div className={styles.metadataWrapper}>

                  <div>
                    <p className={styles.metadata}>{paperMetadata.createdDate || "DATE"}</p>
                    <p className={styles.metadataSmall}>July 23rd</p>
                  </div>
                  <div>
                  <p className={styles.metadata}>{paperMetadata.topic ? paperMetadata.topic.header : "HEADER"}</p>
                  <p className={styles.metadataSmall}>Biomedical and Diagnostic Science</p>
                  </div>
                  <div>
                  <p className={styles.metadata}>{paperMetadata.authors || "AUTHOR"}</p>
                  <p className={styles.metadataSmall}>{paperMetadata.doi || ""}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.annotationWrapper}>
              <ScoreMetadata
                scores={props.scores}
                loading={props.loading}
                />
            </div>
            <div>
            </div>
          </div>

          <PaperViewer
            document={props.document}
            annotations={props.annotations}
            scrollToTop={scrollToTop}/>

        </div>
    )
}

export default ViewStateManager
