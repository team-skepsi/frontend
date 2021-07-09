import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {gql, useQuery} from "@apollo/client"

import Homepage from '../pages/homepage.js';
import PaperCards from '../navigation/paper-cards.js'
import RoleSelection from '../authorization/signup/role-selection.js'
import SignupView from '../authorization/signup/signup-view.js'
import PageManager from '../PageManager/PageManager.js'

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

function AnnotationDotRouter() {
    const {data, loading, error} = useQuery(GET_ALL_TOPIC_SLUGS)
    const {data: paperData, loading: paperLoading, error: paperError} = useQuery(GET_ALL_PAPERS)

  if(loading || paperLoading){
    return(
      <div>
      </div>
    )
  }

  useEffect(() => {
    console.log('TOPIC SLUG ERROR', error),
    console.log('PAPER ERROR', paperError)
  }, [error, paperError])

    return (
        <Switch>
            {data && data.allTopics.map((topic) =>
                <Route key={topic.id} path={"/".concat(topic.slug)}>
                    <PaperCards/>
                </Route>
            )}

            {paperData &&
                paperData.allPapers.map((paper) =>
                    <Route key={paper.id} path={"/".concat(paper.id)}>
                      <PageManager />
                    </Route>
                )
            }

            <Route path='/signup'>
                <RoleSelection />
            </Route>
            <Route path={['/scientist-signup', '/user-signup', '/expert-signup']}>
                <SignupView/>
            </Route>
            <Route path="/">
                <Homepage/>
            </Route>
        </Switch>
    )
}

export default AnnotationDotRouter
