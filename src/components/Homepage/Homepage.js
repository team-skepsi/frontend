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

import Navbar from '../Navbar/Navbar.js'

import TopicCardUpdated from '../TopicCardUpdated/TopicCardUpdated.js'

function Homepage(props) {
  return (
    <div className={styles.main}>

      <div style={{height: 0}}>
        <Navbar usesPageWrapper={true} />
      </div>
      <div className={styles.searchBackground}>

        <PaperSearch
          papers={props.papers}
          />
      </div>
    <div className={styles.homepageFeed}>
    <WelcomeMessage />
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
    <Divider />
    <TopicCardUpdated />
    </div>
    </div>
  )
}


export default Homepage;
