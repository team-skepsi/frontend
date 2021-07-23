import React from 'react';
import styles from './TopicCardUpdated.module.css'
import "./TopicCardUpdated.css"
import { Reveal, Divider } from 'semantic-ui-react'

function TopicCardUpdated(){
  return(
    <div>
        <Reveal animated='fade'>
          <Reveal.Content visible style={{height: "400px", width: '240px'}}>
            <div className={[styles.topicCardWrapper, styles.displayCardWrapper].join(" ")}>
              <div className={styles.flexWrapper}>
                <div className={styles.topicTitleWrapper}>
                  <h2 className={styles.topicTitle}>COVID-19</h2>
                </div>
              </div>
            </div>
          </Reveal.Content>
          <Reveal.Content hidden>
            <div className={[styles.topicCardWrapper, styles.hiddenCardWrapper].join(" ")}>
              <div className={styles.flexWrapper}>
                <div className={styles.topicTitleWrapper}>
                  <h2 className={styles.topicTitle}>Hi</h2>
                </div>
              </div>
            </div>
          </Reveal.Content>

        </Reveal>
        <Divider />
        <div className={[styles.topicCardWrapper].join(" ")}>

            <div className={styles.hiddenTitleWrapper}>
              <h2 className={styles.hiddenTitle}>COVID-19</h2>
            </div>
        </div>

    </div>
  )
}

export default TopicCardUpdated
