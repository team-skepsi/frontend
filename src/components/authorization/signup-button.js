import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "semantic-ui-react";
import { Link } from 'react-router-dom'

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Link to='/signup'>
      <Button>
        Signup
      </Button>
    </Link>
  );
};

export default SignupButton;
