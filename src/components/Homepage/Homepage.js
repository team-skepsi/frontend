import React, { useEffect, useState } from 'react'

// NAVIGATION
import TopicCards from '../TopicCards/TopicCards.js'
import FeaturedPapers from '../FeaturedPapers/FeaturedPapers.js'

// USER PROFILES
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage.js'
import ProfileInfo from '../ProfileInfo/ProfileInfo.js'

// STYLES
import { Divider } from 'semantic-ui-react'

function Homepage(props) {
  return (
    <div>
    <WelcomeMessage />
    <ProfileInfo />
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
  )
}


export default Homepage;
