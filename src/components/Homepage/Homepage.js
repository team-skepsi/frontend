import React, { useEffect, useState } from 'react'

// NAVIGATION
import TopicCards from '../TopicCards/TopicCards.js'

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
    <TopicCards />
    </div>
  )
}


export default Homepage;
