import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import styles from './SignupButton.module.css'

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Link to='/signup'>
      <Button className={styles.signupButton}>
        Signup
      </Button>
    </Link>
  );
};

export default SignupButton;
