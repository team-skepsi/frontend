import React from "react";
import LoginButton from "../authorization/login-button.js"
import LogoutButton from "../authorization/logout-button.js"
import SignupButton from "../authorization/signup-button.js"

import { Menu } from "semantic-ui-react";
import { useAuth0 } from "@auth0/auth0-react";


function AuthenticationNavbar(){
  const { isAuthenticated } = useAuth0()

  if(isAuthenticated){
    return(
      <Menu.Menu position="right">
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
