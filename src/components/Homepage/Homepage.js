import React, { useEffect, useState } from 'react'

// NAVIGATION
import PaperSearch from '../PaperSearch/PaperSearch.js'
import TopicCards from '../TopicCards/TopicCards.js'
import FeaturedPapers from '../FeaturedPapers/FeaturedPapers.js'

// USER PROFILES
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage.js'
import ProfileInfo from '../ProfileInfo/ProfileInfo.js'

// STYLES
import { Divider } from 'semantic-ui-react'
import styles from './Homepage.module.css'

function Homepage(props) {
  return (
    <div className={styles.main}>
      <div className={styles.menuStandin} />
      <div className={styles.searchBackground}>
        <PaperSearch
          papers={props.papers}
          />
      </div>
    <div className={styles.homepageFeed}>
    <WelcomeMessage />
    <Divider />

    <Divider />
    <h2 style={{fontFamily: "Roboto"}}>Topics</h2>
    <TopicCards
      topics={props.topics}
      />
    <Divider />
    <h2 style={{fontFamily: "Roboto"}}>Featured Papers</h2>
    <FeaturedPapers
      papers={props.papers}
      />
    </div>
    </div>
  )
}


export default Homepage;
