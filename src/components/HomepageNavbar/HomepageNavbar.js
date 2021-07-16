import React from "react";
import AuthenticationNavbar from "../AuthenticationNavbar/AuthenticationNavbar.js"
import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';


function HomepageNavbar(props){

  const menuStyle = {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 999,
    height: '60px'
  }

  if(props.isLoading){
    return(
      <Menu style={menuStyle}>
    </Menu>
    )
  }

  return(
  <Menu style={menuStyle}>
    <Link to="/">
      <Menu.Item>
        <h2>Skepsi</h2>
      </Menu.Item>
    </Link>
    <AuthenticationNavbar />
  </Menu>
  )
}

export default HomepageNavbar;
