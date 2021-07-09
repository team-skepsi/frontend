import React, { useState, useEffect, useReducer } from 'react';
import AnnotationCards from './annotation-cards'
import { Container, Icon, Button, Message } from 'semantic-ui-react'

function AnnotationPortalView(props){

  const defaultAnnotations = []

  const [annotations, setAnnotations] = useState(defaultAnnotations)

  useEffect(()=>{
    setAnnotations(props.annotationArray)
  }, [props.annotationArray])

  // REDUCER STUFF
  var initialState = {
    blinded: false,
  }

  function reducer(state, action){
    switch(action.type){
      case 'toggleBlinding':
        return {...state, blinded: !state.blinded}
      default:
        console.error("You made a mistake in the reducer request")
        return {...state}
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)


  // SHUFFLE STUFF
  function shuffleArray(array){
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m){

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

  function handleShuffleClick(){
    // let shuffledArray = shuffle(props.annotationArray)
    // setAnnotations(shuffledArray)
    return null
  }

  // POSITION STUFF
  function handlePositiveClick(){
    let positiveAnnotations = []
    for(var annotation of props.annotationArray){
      if(annotation.position === 'POSITIVE'){
        positiveAnnotations.push(annotation)
      }
    }
    setAnnotations(positiveAnnotations)
  }

  function handleNegativeClick(){
    let negativeAnnotations = []
    for(var annotation of props.annotationArray){
      if(annotation.position === 'NEGATIVE'){
        negativeAnnotations.push(annotation)
      }
    }
    setAnnotations(negativeAnnotations)
  }

  function handleBlindClick(){
    dispatch({type: 'toggleBlinding'})
  }

  function handleRefreshClick(){
    setAnnotations(props.annotationArray)
  }

  // //DEBUG
  // useEffect(()=>{
  //   console.log('ANNOTATION ARRAY PROPS', props.annotationArray)
  // }, [props.annotationArray])

  if(props.annotationArray && props.annotationArray.length === 0){
    return(
      <div>
        <Container>
          <div style={{textAlign:'center', paddingBottom:'20px'}}>
          <Button onClick={handleShuffleClick} style={{display:'inline', margin:'0.5em'}}>
            <div>
            <Icon name='redo' />
            </div>
          </Button>
          <Button onClick={handlePositiveClick} style={{display:'inline', margin:'0.5em'}}>
            <div>
              <Icon name='check' />
            </div>
          </Button>
          <Button onClick={handleNegativeClick} style={{display:'inline', margin:'0.5em'}}>
            <div>
              <Icon name='close' />
            </div>
          </Button>
          <Button onClick={handleBlindClick} style={{display:'inline', margin:'0.5em'}}>
            {!state.blinded &&
              <div>
                <Icon name='eye' />
              </div>}
            {state.blinded &&
              <div>
                <Icon name='eye slash' />
              </div>}
          </Button>
          <Button
            onClick={handleRefreshClick}
            style={{display:'inline', margin: '0.5em'}}>
            <div>
              <Icon name='undo' />
            </div>
          </Button>
          <Button
            inverted
            color='red'
            onClick={props.handleChildClose}
            style={{display:'inline', margin:'2em'}}>
            <div>
              Exit
            </div>
          </Button>
          </div>
        </Container>
        <Container textAlign='center' style={{height: '37em', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60em', overflowX: 'hidden',overflowY: 'scroll'}}>
          <Message info>
            <Message.Header>
              <h3>
              There are no comments here yet. Start a conversation!
              </h3>
            </Message.Header>
          </Message>
          <br />
          <br />
          <br />
        </Container>
      </div>
    )
  }
  else{
    return(
    <div>
      <Container>
        <div style={{textAlign:'center', paddingBottom:'20px'}}>
        <Button onClick={handleShuffleClick} style={{display:'inline', margin:'0.5em'}}>
          <div>
          <Icon name='redo' />
          </div>
        </Button>
        <Button onClick={handlePositiveClick} style={{display:'inline', margin:'0.5em'}}>
          <div>
            <Icon name='check' />
          </div>
        </Button>
        <Button onClick={handleNegativeClick} style={{display:'inline', margin:'0.5em'}}>
          <div>
            <Icon name='close' />
          </div>
        </Button>
        <Button onClick={handleBlindClick} style={{display:'inline', margin:'0.5em'}}>
          {!state.blinded &&
            <div>
              <Icon name='eye' />
            </div>}
          {state.blinded &&
            <div>
              <Icon name='eye slash' />
            </div>}
        </Button>
        <Button
          onClick={handleRefreshClick}
          style={{display:'inline', margin: '0.5em'}}>
          <div>
            <Icon name='undo' />
          </div>
        </Button>
        <Button
          inverted
          color='red'
          onClick={props.handleChildClose}
          style={{display:'inline', margin:'2em'}}>
          <div>
            Exit
          </div>
        </Button>
        </div>
      </Container>
      <Container style={{height: '37em', width: '60em', overflowX: 'hidden',overflowY: 'scroll'}}>
        <AnnotationCards
          annotationArray = {annotations}
          handleShuffleClick={handleShuffleClick}
          handlePositiveClick={handlePositiveClick}
          handleNegativeClick={handleNegativeClick}
          handleBlindClick={handleBlindClick}
          state={state}
          handleChildCardClick = {props.handleChildCardClick}
         />
      </Container>
    </div>
  )}
  }

export default AnnotationPortalView;
