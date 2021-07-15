import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = "skepsi.us.auth0.com";
  const clientId = "V1VsPEgl7mgPORdnpFApnJVWLvf4xkbe"

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname)
  }

  return(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.REACT_APP_API_AUDIENCE}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
