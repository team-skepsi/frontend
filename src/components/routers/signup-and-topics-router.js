import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { useQuery, gql } from "@apollo/client"

import Homepage from '../pages/homepage.js';
import PaperCards from '../navigation/paper-cards.js'
import RoleSelection from '../authorization/signup/role-selection.js'
import SignupView from '../authorization/signup/signup-view.js'
import TopLevelAnnotations from '../annotations/TopLevelAnnotations.js'

const GET_ALL_TOPIC_SLUGS = gql`
  query{
    allTopics{
     slug
     id
    }
  }
`

const GET_ALL_PAPERS = gql`
  query{
    allPapers{
      id
    }
  }
`

function SignupAndTopicsRouter(){
  const {data, loading, error} = useQuery(GET_ALL_TOPIC_SLUGS)
  const {data: paperData, loading: paperLoading} = useQuery(GET_ALL_PAPERS)

  useEffect(()=>{
    console.log(paperData)
  }, [paperData])

  if(loading){
    return(
      <div>
      </div>
    )
  }

  if(data){
    return(
      <Switch>
        {data.allTopics.map((topic, index)=>
          <Route key={topic.id} path={"/".concat(topic.slug)}>
            <PaperCards />
          </Route>
        )}
        <Route path='/signup'>
          <RoleSelection />
        </Route>
        <Route path={['/scientist-signup', '/user-signup', '/expert-signup']}>
          <SignupView />
        </Route>
        <Route path='/annotations'>
          <TopLevelAnnotations />
        </Route>
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    )
  }
}

export default SignupAndTopicsRouter
