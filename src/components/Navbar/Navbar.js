import React, { useState } from "react";
import AuthenticationNavbar from "../AuthenticationNavbar/AuthenticationNavbar.js"
import LoginButton from "../LoginButton/LoginButton.js"
import LogoutButton from "../LogoutButton/LogoutButton.js"
import SignupButton from "../SignupButton/SignupButton.js"

import { Menu, Icon, Dropdown, Sidebar, Label, Button } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import PaperSearch from '../PaperSearch/PaperSearch.js'
import styles from './Navbar.module.css'
import './Navbar.css'
import { useAuth0 } from "@auth0/auth0-react";


function Navbar(props){
  const [visible, setVisible] = useState(false)
  const { isAuthenticated, user } = useAuth0()
  // don't delete this, for some reason css modules don't work for this

  var menuStyle={}
  if(props.usesPageWrapper){
    menuStyle = {
      position: 'relative',
      boxShadow: "none",
      border: "0px solid black",
      width: '100%',
      top: 0,
      left: 0,
      zIndex: 1000,
      height: '60px',
      background: "rgba(255, 255, 255, 0.1)",
      pointerEvents: "none",
    }
  }
  else{
    menuStyle = {
      position: 'absolute',
      boxShadow: "none",
      border: "0px solid black",
      width: '100%',
      top: 0,
      left: 0,
      height: '60px',
      background: "rgba(255, 255, 255, 0.1)",
      // pointerEvents: "none",
    }
  }

  if(props.isLoading){
    return(
      <Menu style={menuStyle}>
    </Menu>
    )
  }

  return(
    <div>
    <Menu style={menuStyle} borderless>
      <Link to="/" style={{pointerEvents: 'none'}}>
        <Menu.Item borderless style={{pointerEvents: "none"}}>
          <Label id={styles.iconWrapper} style={{pointerEvents: 'none'}}>
          <h1 className={styles.skepsi} style={{pointerEvents: 'all'}}>ξ</h1>
          </Label>
        </Menu.Item>
      </Link>
        <Menu.Item borderless position='right'>
          <Label id={styles.iconWrapper} as={Button}>
            <Icon
              fitted
              name='bars'
              size='big'
              inverted
              style={{
                opacity: 1,
                pointerEvents: 'all'
              }}
              onClick={() => setVisible(prevVisible => !prevVisible)}
              />
           </Label>
          </Menu.Item>
          <Sidebar.Pushable id={styles.sidebarContainer}>
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            direction='right'
            vertical
            visible={visible}
            width='thin'
            id={styles.sidebar}
          >
          {isAuthenticated &&
            <React.Fragment>
              <Menu.Item>
                <Link to="/user-info" style={{pointerEvents: 'all'}}>
                  <Button className={styles.userButton}>
                  Profile
                  </Button>
                </Link>
              </Menu.Item>
              <Menu.Item >
                <div style={{pointerEvents: 'all'}}>
                  <LogoutButton />
                </div>
              </Menu.Item>
            </React.Fragment>
          }
          {!isAuthenticated &&
            <React.Fragment>
              <Menu.Item>
                <div style={{pointerEvents: 'all'}}>
                  <SignupButton />
                </div>
              </Menu.Item>
              <Menu.Item>
                <div style={{pointerEvents: 'all'}}>
                  <LoginButton />
                </div>
              </Menu.Item>
            </React.Fragment>
          }
          </Sidebar>
          <Sidebar.Pusher className={styles.sidebarPusher}>
          </Sidebar.Pusher>
          </Sidebar.Pushable>
      </Menu>
      </div>
  )
}

export default Navbar;
