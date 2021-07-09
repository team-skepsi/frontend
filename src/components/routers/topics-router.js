import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Homepage from '../pages/homepage.js';
import PaperCards from '../navigation/paper-cards.js'
import { useQuery, gql } from "@apollo/client"

const GET_ALL_TOPIC_SLUGS = gql`
  query{
    allTopics{
     slug
     id
    }
  }
`

function TopicsRouter(){
  const {data, loading, error} = useQuery(GET_ALL_TOPIC_SLUGS)

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
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    )
  }
}

export default TopicsRouter
