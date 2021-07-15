import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Message, Divider } from 'semantic-ui-react';

import DeleteUserButton from '../DeleteUserButton/DeleteUserButton.js'

function ProfilePage(){
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("")

  useEffect(()=>{
    if(isAuthenticated){
      try{
        getAccessTokenSilently({
        })
        .then(token_data => setAccessToken(token_data))
      }
      catch{
        console.error("Silent Token error") // TODO:
      }
    }
  }, [])

  if (isLoading) {
    return <div>Loading ...</div> // TODO:
  }

  return (
    isAuthenticated && (
      <Message info size='tiny'>
        <Message.Content>
          <Message.Header>
          User Information
          </Message.Header>
          <Message.List>
            <Message.Item><b>Username:</b> {user["http://www.skepsi.com/username"]}</Message.Item>
            <Message.Item><b>Email:</b> {user.email}</Message.Item>
            <Message.Item><b>Login Count:</b> {user["http://www.skepsi.com/loginCount"]}</Message.Item>
            <Message.Item><b>User Id:</b> {user.sub}</Message.Item>
            <Message.Item><b>Roles:</b> {user["http://www.skepsi.com/roles"].join(',')}</Message.Item>
            <Message.Item style={{wordWrap: 'break-word'}}><b>Access Token:</b> {accessToken}</Message.Item>
          </Message.List>
          <Divider />
          <DeleteUserButton />
        </Message.Content>
      </Message>
    )
  )
}

export default ProfilePage
