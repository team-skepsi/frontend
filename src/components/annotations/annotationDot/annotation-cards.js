import React, { useEffect } from 'react';
import { Card, Icon, Label } from 'semantic-ui-react';

import './annotation-cards.css'

function AnnotationCards(props){

  useEffect(() => {
    console.log("ANNOTATION LIST [ANNOTATION-CARDS]:", props.annotations)
  }, [props.annotations])


  if(props.annotations){
  return(
    <div>
    <Card.Group centered>
      {props.annotations.map((annotation, index) =>
        <Card
          className="annotationCard"
          id={annotation._id}
          tabIndex={index}
          key={annotation._id}
          style={{margin: '15px'}}
          onClick={props.handleChildCardClick}
          >
          <Card.Content>
            <Card.Header>
              <div style={{display: 'flex'}}>
              {props.state.blinded && 'Anonymous'}
              {!props.state.blinded && annotation.data.author.username} &nbsp;
              {annotation.data.position === "POSITIVE" &&
                <Icon name='check'>
                </Icon>
              }
              {annotation.data.position === "NEGATIVE" &&
                <Icon name='close'>
                </Icon>
              }
              <div style={{flex:2.5}}>
              </div>
              <Label style={{flex: 1}}>
                <Icon name='reply'/> {annotation.data.childAnnotationCount}
              </Label>
              </div>
            </Card.Header>
            <Card.Meta>
              Today [Card ID: {annotation._id}]
            </Card.Meta>
            </Card.Content>
            <Card.Content>
              {annotation.data.quote}
            </Card.Content>
          <Card.Content extra style={{fontSize: '10px'}}>
            {annotation.data.content}
          </Card.Content>
        </Card>
      )}
    </Card.Group>
    </div>
    )
  }
else{
  return(
    <div>
      <h2>Loading</h2>
    </div>
  )
}
}

export default AnnotationCards
