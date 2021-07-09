import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Homepage from '../pages/homepage.js';
import RoleSelection from '../authorization/signup/role-selection.js'
import SignupView from '../authorization/signup/signup-view.js'

function SignupRouter(){
    return(
      <Switch>
        <Route path='/signup'>
          <RoleSelection />
        </Route>
        <Route path={['/scientist-signup', '/user-signup', '/expert-signup']}>
          <SignupView />
        </Route>
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    )
  }

export default SignupRouter
