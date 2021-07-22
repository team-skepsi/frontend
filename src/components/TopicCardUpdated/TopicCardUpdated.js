import React from 'react';
import styles from './TopicCardUpdated.module.css'
import "./TopicCardUpdated.css"

function TopicCardUpdated(){
  return(
    <div>
      <div className={[styles.topicCardWrapper, "animationWrapper"].join(" ")}>
        <iframe src="https://openprocessing.org/sketch/494102/embed/" width="inherit" height="inherit"></iframe>
        <div className={styles.flexWrapper}>
          <div className={styles.topicTitleWrapper}>
            <h2 className={styles.topicTitle}>COVID-19</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicCardUpdated
