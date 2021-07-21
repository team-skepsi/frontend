import React from 'react';
import styles from './TopicCard.module.css'

const topicCardData = {
  title: "AMS von Neumann Symposium"
}

function TopicCard(){

  return(
    <div>
      <div className={styles.cardBox}>
        <div className={styles.titleContainer}>
          <h2>{topicCardData.title}</h2>
        </div>
      </div>
    </div>
  )
}

export default TopicCard
