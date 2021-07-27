import React, { useEffect } from 'react';
import {Route, Switch} from 'react-router-dom'
import {gql, useQuery} from "@apollo/client"

import HomepageManager from '../HomepageManager/HomepageManager.js';
import PaperCards from '../PaperCards/PaperCards.js'
import RoleSelection from '../RoleSelection/RoleSelection.js'
import SignupView from '../SignupView/SignupView.js'
import PageManager from '../PageManager/PageManager.js'
import ProfilePage from '../ProfilePage/ProfilePage.js'
import Navbar from '../Navbar/Navbar.js'
import TopicInfoPage from '../TopicInfoPage/TopicInfoPage.js'
import PaperCardTemplate from '../PaperCardTemplate/PaperCardTemplate.js'

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

function Router() {
    const {data, loading, error} = useQuery(GET_ALL_TOPIC_SLUGS)
    const {data: paperData, loading: paperLoading, error: paperError} = useQuery(GET_ALL_PAPERS)

  if(loading || paperLoading){
    return(
      <div>
      </div>
    )
  }

  return (
        <Switch>
            {data && data.allTopics.map((topic) =>
                <Route key={topic.id} path={"/".concat(topic.slug)}>
                    <React.Fragment>
                      <PaperCards/>
                    </React.Fragment>
                </Route>
            )}

            {paperData &&
                paperData.allPapers.map((paper) =>
                    <Route key={paper.id} path={"/".concat(paper.id)}>
                        <PageManager />
                    </Route>
                )
            }
            <Route path="/homepage-test">
              <HomepageManager />
            </Route>

            <Route path="/topic-info">
              <TopicInfoPage />
            </Route>

            <Route path="/playground">
              <PaperCardTemplate />
            </Route>

            <Route path='/user-info'>
              <React.Fragment>
                <Navbar />
                <ProfilePage />
              </React.Fragment>
            </Route>
            <Route path='/signup'>
              <React.Fragment>
                <Navbar />
                <RoleSelection />
              </React.Fragment>
            </Route>
            <Route path={['/scientist-signup', '/user-signup', '/expert-signup']}>
                <React.Fragment>
                  <Navbar />
                  <SignupView/>
                </React.Fragment>
            </Route>
            <Route path="/">
                <React.Fragment>
                  <HomepageManager />
                </React.Fragment>
            </Route>
        </Switch>
    )
}

export default Router
