import React, {useEffect, useState} from 'react'
import './App.css'
import "semantic-ui-css/semantic.min.css";

// FONTS
import WebFont from 'webfontloader'

// AUTHORIZATION
// ANNOTATIONS
// import PageManager from './components/PageManager/PageManager.js'

// NAVIGATION
import HomepageNavbar from './components/navigation/homepage-navbar.js'

// ROUTERS
// import TopicsRouter from './components/routers/topics-router.js'
// import SignupRouter from './components/routers/signup-router.js'
// import SignupAndTopicsRouter from './components/routers/signup-and-topics-router.js'
import AnnotationDotRouter from './components/routers/annotation-dot-router.js'

import {useAuth0} from "@auth0/auth0-react";


import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"
import TexProvider from "./components/Tex/TexProvider";

// STYLES

function App() {

    const {isAuthenticated, getAccessTokenSilently, isLoading} = useAuth0()
    const [token, setToken] = useState("")

    useEffect(() => {
      WebFont.load({
        google: {
          families: ['Alegreya Sans: 300, 400, 500, 700, 800, 900']
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

    const client = new ApolloClient({
        uri: process.env.API_AUDIENCE,
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
                <AnnotationDotRouter />
            </div>
        </TexProvider>
    </ApolloProvider>
  );
}

export default App
