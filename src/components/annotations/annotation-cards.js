import React from 'react';
import { Card, Icon, Label } from 'semantic-ui-react';

import './annotation-cards.css'

function AnnotationCards(props){
  if(props.annotationArray){
  return(
    <div>
    <Card.Group centered>
      {props.annotationArray.map((annotation, index) =>
        <Card
          className="annotationCard"
          id={annotation.id}
          tabIndex={index}
          key={annotation.id}
          style={{margin: '15px'}}
          onClick={props.handleChildCardClick}
          >
          <Card.Content>
            <Card.Header>
              <div style={{display: 'flex'}}>
              {props.state.blinded && 'Anonymous'}
              {!props.state.blinded && annotation.author.username} &nbsp;
              {annotation.position === "POSITIVE" &&
                <Icon name='check'>
                </Icon>
              }
              {annotation.position === "NEGATIVE" &&
                <Icon name='close'>
                </Icon>
              }
              <div style={{flex:2.5}}>
              </div>
              <Label style={{flex: 1}}>
                <Icon corner='right' name='reply'/> {annotation.childAnnotationCount}
              </Label>
              </div>
            </Card.Header>
            <Card.Meta>
              Today [Card ID: {annotation.id}]
            </Card.Meta>
            </Card.Content>
            <Card.Content>
              {annotation.quote}
            </Card.Content>
          <Card.Content extra style={{fontSize: '10px'}}>
            {annotation.content}
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
