import React from "react";
import LoginButton from "../LoginButton/LoginButton.js"
import LogoutButton from "../LogoutButton/LogoutButton.js"
import SignupButton from "../SignupButton/SignupButton.js"
import styles from './AuthenticationNavbar.module.css'

import { Menu, Button, Icon } from "semantic-ui-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom'

function AuthenticationNavbar(){
  const { isAuthenticated, user } = useAuth0()

  if(isAuthenticated){
    return(
      <Menu.Menu position="right">
        <Menu.Item>
          <Link to="/user-info">
            <Button className={styles.userButton}>
              <Icon name="user" inverted/>{user["http://www.skepsi.com/username"]}
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <LogoutButton />
        </Menu.Item>
      </Menu.Menu>
    )
  }
  return(
    <Menu.Menu position="right">
      <Menu.Item>
        <SignupButton />
      </Menu.Item>
      <Menu.Item>
        <LoginButton />
      </Menu.Item>
    </Menu.Menu>
  )

}

export default AuthenticationNavbar;
