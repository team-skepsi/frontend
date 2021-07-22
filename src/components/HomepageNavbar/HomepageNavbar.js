import React, { useState } from "react";
import AuthenticationNavbar from "../AuthenticationNavbar/AuthenticationNavbar.js"
import { Menu, Icon, Dropdown, Sidebar, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import PaperSearch from '../PaperSearch/PaperSearch.js'
import styles from './HomepageNavbar.module.css'
import './HomepageNavbar.css'


function HomepageNavbar(props){
  const [visible, setVisible] = useState(false)

  // don't delete this, for some reason css modules don't work for this
  const menuStyle = {
    position: 'fixed',
    boxShadow: "none",
    border: "0px solid black",
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 999,
    height: '60px',
    background: "rgba(255, 255, 255, 0.1)",
  }

  if(props.isLoading){
    return(
      <Menu style={menuStyle}>
    </Menu>
    )
  }

  return(
  <div>
    <Menu id={styles.navigationMenu} style={menuStyle} borderless>
      <Link to="/">
        <Menu.Item borderless>
          <Label id={styles.iconWrapper}>
          <h1 className={styles.skepsi}>ξ</h1>
          </Label>
        </Menu.Item>
      </Link>
        <Menu.Item borderless position='right'>
          <Label id={styles.iconWrapper}>
            <Icon
              fitted
              name='bars'
              size='big'
              inverted
              style={{
                opacity: 1,
              }}
              onClick={() => setVisible(true)}
              />
           </Label>
          </Menu.Item>
          <Sidebar.Pushable id={styles.sidebarContainer}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction='right'
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width='thin'
            id={styles.sidebar}
          >
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher className={styles.sidebarPusher}>
          </Sidebar.Pusher>
          </Sidebar.Pushable>

  </Menu>


</div>
  )
}

export default HomepageNavbar;


// /<Segment basic style={{
//     height: "400px",
//     width: '500px',
//     position: "relative",
//     zIndex: 100000,
//     border: '2px black solid',
//   }}>
// </Segment>
