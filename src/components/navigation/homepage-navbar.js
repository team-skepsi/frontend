import React from "react";
import AuthenticationNavbar from "./authentication-navbar.js"
import SkepsiNavbarItem from "./skepsi-navbar-item.js"
import { Menu } from "semantic-ui-react";

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
    <SkepsiNavbarItem />
    <AuthenticationNavbar />
  </Menu>
  )
}

export default HomepageNavbar;
