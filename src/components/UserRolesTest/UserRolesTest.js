import React, { useContext } from 'react';
import { UserContext } from '../../App.js'
import { Message } from 'semantic-ui-react'

function UserRolesTest(){
  const user = useContext(UserContext)

  return(
    <div>
      <Message>
        {String(user ? user["http://www.skepsi.com/roles"] : "") === "Expert" && "This user is an expert"}
        {String(user ? user["http://www.skepsi.com/roles"] : "") === "User" && "This user is a general user"}
        {String(user ? user["http://www.skepsi.com/roles"] : "") === "Scientist" && "This user is a scientist"}
      </Message>
    </div>
  )
}

export default UserRolesTest
