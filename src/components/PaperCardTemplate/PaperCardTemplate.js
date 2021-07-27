import React from 'react';
import './PaperCardTemplate.css'
import styles from './PaperCardTemplate.module.css';

function PaperCardTemplate(props){
  return(
    <div className={styles.card}>
      <div className={styles.cardMainWrapper}>
      <div className={styles.cardTitleWrapper}>
        <p className={styles.topicTitle}>CS.AI</p>
        <h2 className={styles.paperTitle}>{props.paperData ? props.paperData.title : ""}</h2>
          <div className={styles.paperMetadataWrapper}>
            <p className={styles.paperMetadata}>
              <span className={styles.author}>{props.paperData ? props.paperData.authors: ""}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.createdDate}>{props.paperData ? props.paperData.createdDate : ""}</span>
            </p>
          </div>
        </div>
        <div className={styles.abstractWrapper}>
          <p className={styles.abstract}>
            {props.paperData ? props.paperData.abstract : ""}
          </p>
        </div>
      </div>
      <div className={styles.cardExtraWrapper}>
        <p className={styles.paperStatistics}>
          <span className={styles.dot}>•</span>
          <span className={styles.stat}>55</span> mins
          <span className={styles.dot}>•</span>
          <span className={styles.stat}>1500</span> views
          <span className={styles.dot}>•</span>
          <span className={styles.stat}>{props.paperData ? props.paperData.annotationCount : 0}</span> annotations
          <span className={styles.dot}>•</span>
        </p>
      </div>

  </div>

)
}

export default PaperCardTemplate;
