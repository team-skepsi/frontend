import React from "react";
import LoginButton from "../LoginButton/LoginButton.js"
import LogoutButton from "../LogoutButton/LogoutButton.js"
import SignupButton from "../SignupButton/SignupButton.js"

import {Button, Menu} from "semantic-ui-react"
import {Link} from 'react-router-dom'
import styles from './Navbar.module.css'
import './Navbar.css'
import {useAuth0} from "@auth0/auth0-react"


function Navbar(props) {
    const {isAuthenticated, user} = useAuth0()
    // don't delete this, for some reason css modules don't work for this

    let menuStyle = {}
    if (props.usesPageWrapper) {
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
    } else {
        menuStyle = {
            position: 'absolute',
            boxShadow: "0px 2px rgb(0, 0, 0, .1)",
            border: "0px solid black",
            width: '100%',
            top: 0,
            left: 0,
            height: '60px',
            background: "rgba(255, 255, 255, 0.1)",
            // pointerEvents: "none",
        }
    }

    if (props.isLoading) {
        return (
            <Menu style={menuStyle}>
            </Menu>
        )
    }

    return (
        <div>
            <Menu style={menuStyle} borderless>
                <Link to="/" style={{pointerEvents: 'none'}}>
                    <Menu.Item style={{pointerEvents: "none"}}>
                        <Button compact color="black"
                                style={{padding: "10px", paddingTop: '5px', paddingBottom: '5px'}}>
                            <h1 className={styles.skepsi} style={{pointerEvents: 'all'}}>ξ</h1>
                        </Button>
                    </Menu.Item>
                </Link>
                {isAuthenticated &&
                <Menu.Menu position='right'>
                    <Menu.Item position='right'>
                        <Link to="/user-info" style={{pointerEvents: 'all'}}>
                            <Button className={styles.userButton}>
                                {user['http://www.skepsi.com/username']}
                            </Button>
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <div style={{pointerEvents: 'all'}}>
                            <LogoutButton/>
                        </div>
                    </Menu.Item>
                </Menu.Menu>
                }
                {!isAuthenticated &&
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <div style={{pointerEvents: 'all'}}>
                            <SignupButton/>
                        </div>
                    </Menu.Item>
                    <Menu.Item>
                        <div style={{pointerEvents: 'all'}}>
                            <LoginButton/>
                        </div>
                    </Menu.Item>
                </Menu.Menu>
                }
            </Menu>
        </div>
    )
}

export default Navbar
