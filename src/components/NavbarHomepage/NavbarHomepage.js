import React from 'react';
import styles from './NavbarHomepage.module.css'

import LoginButton from "../LoginButton/LoginButton.js"
import LogoutButton from "../LogoutButton/LogoutButton.js"
import SignupButton from "../SignupButton/SignupButton.js"

import {Button, Icon, Popup} from "semantic-ui-react"
import {Link} from 'react-router-dom'

import {useAuth0} from "@auth0/auth0-react"


function NavbarHomepage(){
  const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0()

  return(
    <div>
      <div className={styles.whitespaceNavbar}>
        <div className={styles.leftNavbar}>
          <Link to="/">
            <div className={styles.skepsiWrapper}>
              <h1 className={styles.skepsiText}>Skepsi</h1>
            </div>
          </Link>
          <Link>
            <div className={styles.featuredAnnotationsWrapper}>
              <Popup
                style={{boxShadow: "none"}}
                size='small'
                trigger={
              <Link to='/featured-annotations'>
                <Icon name='fire' size='big' style={{color: 'gray'}}/>
              </Link>
              }>
              <h4 className={styles.popupText}>Featured Annotations</h4>
              </Popup>
              <Popup
                style={{boxShadow: "none"}}
                size='small'
                trigger={
                <Link to='/search'>
                  <Icon name='search' size='big' style={{color: 'gray'}}/>
                </Link>
              }>
              <h4 className={styles.popupText}>Search</h4>
              </Popup>
              <Popup
                style={{boxShadow: "none"}}
                size='small'
                trigger={
                <Link to='/about'>
                  <Icon name='question' size='big' style={{color: 'gray'}}/>
                </Link>
              }>
              <h4 className={styles.popupText}>Learn More</h4>
              </Popup>
            </div>
          </Link>
          {/*<div className={styles.featuredAnnotationsWrapper}>
            <Icon name='search' size='big' color='gray'/>
          </div>
          */}
        </div>
        <div className={styles.navbarFlex} />
        <div className={styles.rightNavbar}>
          {isAuthenticated &&
            <>
            <div>
              <Link to='/about'>
                <button className={styles.authButton} id={styles.pitchButton}>
                  <p className={styles.authButtonText}>Learn More</p>
                </button>
              </Link>
              <Link to="/user-info">
                  <button className={styles.authButton} id={styles.profileButton}>
                      <p className={styles.authButtonText}>Profile</p>
                  </button>
              </Link>
            </div>
            <div className={styles.authButtonText}>
              <button
                className={styles.authButton}
                id={styles.logoutButton}
                onClick = {() => logout({returnTo: window.location.origin})}>
                <p className={styles.authButtonText}>Log Out</p>
              </button>
            </div>
            </>
          }
          {!isAuthenticated &&
            <>
            <div>
              <Link to='/about'>
                <button className={styles.authButton} id={styles.pitchButton}>
                  <p className={styles.authButtonText}>Learn More</p>
                </button>
              </Link>
            </div>
            <div>
              <Link to='/signup'>
                <button className={styles.authButton} id={styles.signupButton}>
                  <p className={styles.authButtonText}>Sign Up</p>
                </button>
              </Link>
            </div>
            <div>
                <button
                  className={styles.authButton}
                  id={styles.loginButton}
                  onClick={() => loginWithRedirect()}>
                  <p className={styles.authButtonText}>Log In</p>
                </button>
            </div>
            </>
          }
        </div>
      </div>

    </div>)
}

export default NavbarHomepage;
