import React, { useContext } from 'react';
import { RoleContext } from '../../App.js'
import { Message } from 'semantic-ui-react'

function UserRolesTest(){
  const role = useContext(RoleContext)

  return(
    <div>
      <Message>
        {String(role) === "Expert" && "This user is an expert"}
        {String(role) === "User" && "This user is a general user"}
        {String(role) === "Scientist" && "This user is a scientist"}
      </Message>
    </div>
  )
}

export default UserRolesTest
