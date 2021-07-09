import React, { useReducer, useEffect, useRef, useState } from 'react';
import AnnotationPortalView from './annotation-portal-view.js'
import { Card, Icon, Portal, Segment, Label} from 'semantic-ui-react'
import './top-level-annotations.css'
import { useQuery, gql } from '@apollo/client'
import { useLocation } from 'react-router-dom'

function TopLevelAnnotations(){
  const GET_ALL_ANNOTATIONS = gql`
  query GetAllAnnotations($paperId:ID!){
  annotationsByPaperId(paperId: $paperId){
    id
    content
    position
    quote
    childAnnotationCount
    author{
      username
    }
    parent{
      id
    }
  }
}
`

  const testTopLevelAnnotations = [
    {
      author: 'Finn Macken',
      quote: "To be, or not to be: that is the question: \n Whether tis nobler in the mind to suffer The slings and arrows of outrageous fortune",
      content: 'Hamlet, Act III, Scene I',
      created_time: 'Today',
      position: 'negative',
      reputation: 99
    },
    {
      author: 'Andre Vacha',
      quote: "This above all: to thine own self be true, \n And it must follow, as the night the day, \n Thou canst not then be false to any man.",
      content: 'Julius Caesar, Act II, Scene II',
      created_time: 'Today',
      position: 'positive',
      reputation: 105,
    },
    {
      author: 'Leo Ware',
      quote: "Cowards die many times before their deaths; \n The valiant never taste of death but once.",
      content: 'Hamlet, Act III, Scene I',
      created_time: 'Today',
      position: 'negative',
      reputation: 1
    },
    {
      author: 'Junran Shi',
      quote: "Parting is such sweet sorrow, \n That I shall say good night till it be morrow",
      content: 'Romeo and Juliet, Act II, Scene II',
      created_time: 'Today',
      position: 'positive',
      reputation: 1000,

    },
    {
      author: 'Josh Macken',
      quote: "All the world's a stage, \n And all the men and women merely players",
      content: 'As You Like It, Act II, Scene VII',
      created_time: 'Today',
      position: 'negative',
      reputation: 75,

    },
    {
      author: 'Tessa Macken',
      quote: "The robbed that smiles, steals something from the thief",
      content: 'Othello, Act I, Scene III',
      created_time: 'Today',
      position: 'negative',
      reputation: 2045

    },
    {
      author: 'Claire Macken',
      quote: "Uneasy lies the head that wears the crown",
      content: 'King Henry IV, Act III, Scene I',
      created_time: 'Today',
      position: 'positive',
      reputation: 3

    },
  ]

  const location = useLocation()

  const { data: annotationData, loading} = useQuery(GET_ALL_ANNOTATIONS, {variables:{
    "paperId": parseInt(location.pathname.replace('/',''))
  }})

  // GETTING TOP LEVEL ANNOTATIONS FROM NETWORK REQUEST
  useEffect(()=>{
    var topLevelAnnotationList = []
    if(annotationData){
      for(var annotations of annotationData.annotationsByPaperId){
        if(annotations.parent===null){
        topLevelAnnotationList.push(annotations)
        }
      }
      dispatch({type:'updateTopLevelAnnotations', payload: topLevelAnnotationList})
    }
  }, [annotationData])

  const initialState = {
    coordinate: 0,
    openPortalList: [false, false, false], // these must always be false in the initialState, or the DOM can't render
    topLevelAnnotations: [],
    activeCards: [],
    activeAnnotations: [],
  }

  const portalWrapper = useRef(null)

  function reducer(state, action){
    switch(action.type){
      case 'closePortalList':
        let lengthOfPortalList = state.openPortalList.length
        let startingIndex = action.payload

        for (let i=startingIndex; i < lengthOfPortalList; i++){
          state.openPortalList.splice(i, 1, false)
        }
        return {...state}
      case 'closeAllPortals':
        let falseList = []
        for(let elements in state.openPortalList){
          falseList.push(false)
        }
        return {...state, openPortalList: falseList}
      case 'updateCoordinate':
        return {...state, coordinate: action.payload}
      case 'openPortalList':
        state.openPortalList.splice(parseInt(action.payload)+1, 1, true)
        return {...state} // need to use spread syntax so the state changes and React rerenders the page
      case 'updateTopLevelAnnotations':
        return {...state, topLevelAnnotations: action.payload}
      case 'updateActiveCards':
        if(action.payload.portalIndex==='top-level'){
          state.activeCards.splice(0, 1, parseInt(action.payload.cardId))
        }
        else{
          state.activeCards.splice(parseInt(action.payload.portalIndex)+1, 1, parseInt(action.payload.cardId))
        }
        return {...state}
      default:
        console.log("You made a mistake in the reducer request")
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [annotationArray, setAnnotationArray] = useState([])

  function getChildAnnotations(listOfAnnotations, parentIndex){
    let annotationList = []

    if(listOfAnnotations){
    for(var annotations of listOfAnnotations){
      if(annotations.parent !== null){
      if(parseInt(annotations.parent.id)===parentIndex){
        annotationList.push(annotations)
        }
      }
      }
    }
    return annotationList
  }

  // i have absolutely no idea why, but this useEffect doesn't trigger for
  // state change to the activeCards property. Instead, moved annotations to their
  // own useState and called the dependency array on the reducer state object,
  // which seems to work perfectly, but might create optimisation issues if the
  // reducer state grows too large/the annotation updating is too computationally
  // expensive
  useEffect(()=>{
    var activeAnnotationsList = []
    for(var index in state.activeCards){
    var childList = getChildAnnotations(annotationData.annotationsByPaperId, state.activeCards[index])
    activeAnnotationsList.push(childList)
    }
    setAnnotationArray(activeAnnotationsList)
  }, [state])


  // CHECKING GET_CHILD_ANNOTATIONS

  function handleCardClick(data){
    dispatch({type: 'closeAllPortals'})
    dispatch({type: 'openPortalList', payload:"-1"})
    dispatch({type:'updateCoordinate', payload: data.target.offsetParent.offsetTop})
    dispatch({type:'updateActiveCards', payload: {cardId: data.target.offsetParent.id, portalIndex: data.target.offsetParent.attributes.portalindex.value}})
  }

  function handleChildCardClick(data){
    if(data.target.offsetParent.offsetParent.attributes.portalindex.value){
    dispatch({type:'openPortalList', payload: data.target.offsetParent.offsetParent.attributes.portalindex.value})
    dispatch({type:'updateActiveCards', payload: {cardId: data.target.offsetParent.id, portalIndex: data.target.offsetParent.offsetParent.attributes.portalindex.value}})
    }
  }

  function handleChildClose(data){
    dispatch({type: 'closePortalList', payload: data.target.offsetParent.attributes.portalindex.value})
  }

  // LOGGING ANNOTATION DATA REQUEST
  useEffect(()=>{
    console.log('This is all of the annotation data:', annotationData)
  }, [annotationData])

  //STATE LOGGING FOR DEBUG
  useEffect(()=>{
    console.log('TOP LEVEL ANNOTATIONS STATE:', state)
  }, [state])

  // STATE LOGGING FOR DEBUG
  useEffect(()=>{
    console.log('ANNOTATION ARRAY STATE:', annotationArray)
  }, [annotationArray])

  if(loading){
    return(
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }
  if(annotationData){
  return(
    <div className="none">
    <div style={{overflowX:'scroll', width:'110%', position: 'relative', display: 'flex',}} ref={portalWrapper}>
      <div style={{flex: 0, position: 'relative'}}>
        {state.topLevelAnnotations.map((annotation, index) =>
          <Card
            className="annotationCard"
            id={parseInt(annotation.id)}
            tabIndex={index}
            key={parseInt(annotation.id)}
            style={{margin: '15px'}}
            onClick={handleCardClick}
            portalindex='top-level'
            >
            <Card.Content>
              <Card.Header>
                <div style={{display: 'flex'}}>
                  {annotation.author.username}&nbsp;
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
                Today    [Card ID: {annotation.id}]
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

      </div>
      {state.activeCards.map((portal, index)=>

          <Portal
            open={state.openPortalList[index]}
            mountNode={portalWrapper.current}
            closeOnDocumentClick={false}
            closeOnEscape={false}
            key={index}
            >
            <Segment raised
              style={{
                width: '40em',
                height: '50em',
                position: 'relative',
                marginRight: '20px',
                top: state.coordinate-15,
                flex: 0.5,
                }}
                key={index}
              portalindex={index}
              >
              <h2>Replies to Card {state.activeCards[index]}</h2>
              <AnnotationPortalView
                handleChildClose={handleChildClose}
                handleChildCardClick = {handleChildCardClick}
                childAnnotations = {testTopLevelAnnotations}
                annotationArray = {annotationArray[index]}
                />
            </Segment>
          </Portal>
      )}
    </div>
    </div>
  )
}
}
export default TopLevelAnnotations
