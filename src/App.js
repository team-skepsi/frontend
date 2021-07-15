import React, {useEffect, useState} from 'react'
import './App.css'
import "semantic-ui-css/semantic.min.css";

// FONTS
import WebFont from 'webfontloader'

// AUTHORIZATION
// ANNOTATIONS
// import PageManager from './components/PageManager/PageManager.js'

// NAVIGATION
import HomepageNavbar from './components/HomepageNavbar/HomepageNavbar.js'

// ROUTERS
// import TopicsRouter from './components/routers/topics-router.js'
// import SignupRouter from './components/routers/signup-router.js'
// import SignupAndTopicsRouter from './components/routers/signup-and-topics-router.js'
import Router from './components/Router/Router.js'

import {useAuth0} from "@auth0/auth0-react";


import {ApolloClient, HttpLink, ApolloProvider, InMemoryCache} from "@apollo/client"
import TexProvider from "./components/Tex/TexProvider";

import UserRolesTest from './components/UserRolesTest/UserRolesTest.js'

// STYLES

function App() {

    const {isAuthenticated, getAccessTokenSilently, isLoading} = useAuth0()
    const [token, setToken] = useState("")

    useEffect(() => {
      WebFont.load({
        google: {
          families: ['Roboto']
        },
        custom: {
          families: ['Computer Modern'],
          urls: ['https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/fonts.css']
        }
      })
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then(token_data => {
                    setToken(token_data)
                })
        }
    }, [isAuthenticated, getAccessTokenSilently])

    const URI_VARIABLE = process.env.REACT_APP_API_AUDIENCE

    const link = new HttpLink({
      uri: URI_VARIABLE
    })

    useEffect(() =>{
      console.log('HERE!',process.env.REACT_APP_API_AUDIENCE)
    }, [process.env.REACT_APP_API_AUDIENCE])

    const client = new ApolloClient({
        uri: process.env.REACT_APP_API_AUDIENCE,
        cache: new InMemoryCache(),
        headers: {
            authorization: isAuthenticated ? token : ""
        }
    })

    // throttles the entire site until the access token loads
    if (isLoading) {
        return <div/>
    }

  return (
    <ApolloProvider client={client}>
        <TexProvider>
            <div className="App">
                <HomepageNavbar loading={isLoading}/>
                <Router />
                <UserRolesTest />
            </div>
        </TexProvider>
    </ApolloProvider>
  );
}

export default App
