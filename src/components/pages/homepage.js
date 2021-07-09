import React, { useEffect, useState } from 'react'

// NAVIGATION
import TopicCards from '../navigation/topic-cards.js'

// USER PROFILES
import WelcomeMessage from '../user_profiles/welcome-message.js'
import ProfileInfo from '../user_profiles/profile-info.js'

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
