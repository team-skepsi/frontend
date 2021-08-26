import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {gql, useQuery} from "@apollo/client"
import { Divider, Message } from 'semantic-ui-react'
import HomepageManager from '../HomepageManager/HomepageManager.js'
import PaperCards from '../PaperCards/PaperCards.js'
import RoleSelection from '../RoleSelection/RoleSelection.js'
import SignupView from '../SignupView/SignupView.js'
import PageManager from '../PageManager/PageManager.js'
import ProfilePage from '../ProfilePage/ProfilePage.js'
import NavbarHomepage from '../NavbarHomepage/NavbarHomepage.js'
// import PaperCardTemplate from '../PaperCardTemplate/PaperCardTemplate.js'
// import ScientistDomainPicker from '../ScientistDomainPicker/ScientistDomainPicker.js'
// import FeaturedAnnotations from '../FeaturedAnnotations/FeaturedAnnotations.js'
import HomepageUpdated from '../HomepageUpdated/HomepageUpdated.js'
import SkepsiIsBroken from '../SkepsiIsBroken/SkepsiIsBroken.js'
import HomepageFinal from '../HomepageFinal/HomepageFinal.js'

import AnnotationCardTemplate from '../AnnotationCardTemplate/AnnotationCardTemplate.js'
import SignupHook from '../SignupHook/SignupHook.js'
import PitchPage from '../PitchPage/PitchPage.js'
import FeaturedAnnotationsPage from '../FeaturedAnnotationsPage/FeaturedAnnotationsPage.js'

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

  if(paperLoading || loading){
    console.log("Loading")
    return(
      <div>
      </div>
    )
  }

  if(error || paperError){
    console.log(error)
    console.log(paperError)
    return(
      <div>
        <SkepsiIsBroken />
      </div>
    )
  }

    return (
        <Switch>
            {data && data.allTopics.map((topic) =>
                <Route key={topic.id} path={"/".concat(topic.slug)}>
                    <React.Fragment>
                        <PaperCards />
                    </React.Fragment>
                </Route>
            )}

            {paperData && paperData.allPapers.map((paper) =>
                <Route key={paper.id} path={"/".concat(paper.id)}>
                    <PageManager />
                </Route>
            )}

            <Route path="/homepage-test">
                <HomepageFinal />
            </Route>

            <Route path='/featured-annotations'>
              <FeaturedAnnotationsPage />
            </Route>

            <Route path="/playground">
                <div/>
                <SignupHook />
            </Route>

            <Route path="/about">
              <PitchPage />
            </Route>

            <Route path="/broken">
              <SkepsiIsBroken />
            </Route>

            <Route path='/user-info'>
                <React.Fragment>
                    <NavbarHomepage />
                    <ProfilePage />
                </React.Fragment>
            </Route>

            <Route path='/signup'>
                <React.Fragment>
                    <NavbarHomepage />
                    <RoleSelection />
                </React.Fragment>
            </Route>

            <Route path={['/scientist-signup', '/user-signup', '/expert-signup']}>
                <React.Fragment>
                    <NavbarHomepage />
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
