import React from 'react';
import { Message, Icon } from 'semantic-ui-react'
import { useAuth0 } from "@auth0/auth0-react";

function WelcomeMessage(){
  const { user, isAuthenticated, isLoading} = useAuth0()
  return(
    isAuthenticated && (
    <Message icon>
      <Icon name="flask" />
      <Message.Content>
        <Message.Header>
        <h2>Welcome to Skepsi, {user.nickname}!</h2>
        </Message.Header>
        <p>
          We're a community for academic criticism, organised around seminal papers. We leverage artificial intelligence and a group of experts to facilitate academic discussion, identify impactful papers, and overcome the issues degrading modern academic standards.
        </p>
      </Message.Content>
    </Message>
    )
  )
}

export default WelcomeMessage
