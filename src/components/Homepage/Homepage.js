import React, { useEffect, useState } from 'react'

// NAVIGATION
import TopicCards from '../TopicCards/TopicCards.js'
import FeaturedPapers from '../FeaturedPapers/FeaturedPapers.js'

// USER PROFILES
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage.js'
import ProfileInfo from '../ProfileInfo/ProfileInfo.js'

// STYLES
import { Divider } from 'semantic-ui-react'

function Homepage() {
  return (
    <div>
    <WelcomeMessage />
    <ProfileInfo />
    <Divider />
    <h2 style={{fontFamily: "Roboto"}}>Topics</h2>
    <TopicCards />
    <Divider />
    <h2 style={{fontFamily: "Roboto"}}>Featured papers</h2>
    <FeaturedPapers />
    </div>
  )
}


export default Homepage;
