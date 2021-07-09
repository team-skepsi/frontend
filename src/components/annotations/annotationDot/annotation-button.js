import React from 'react';
import { Button } from 'semantic-ui-react';

function AnnotationButton(props){

  return(
    <Button
      onClick={props.handleButtonClick}>
        {props.children}
    </Button>
  )
}

export default AnnotationButton
