import React, { useEffect, useReducer, useRef } from 'react';
import TopLevelAnnotations from './top-level-annotations.js'
import { useLocation } from 'react-router-dom'
import { Message, Divider, Label, Button, Portal, Segment} from 'semantic-ui-react'
import AnnotationButton from './annotation-button.js'

function AnnotationContainer(props){
  const location = useLocation()
  const portalWrapper = useRef(null)

  function reducer(state, action){
    switch(action.type){
      case 'portalOpen':
        return {...state, portalOpen: true}
      case 'portalClose':
        return {...state, portalOpen: false}
      case 'portalToggle':
        return {...state, portalOpen: !state.portalOpen}
      default:
        console.log("You made a mistake in the reducer request")
    }
  }

  const initialState = {
    portalOpen: false
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  function handleButtonClick(){
    dispatch({type: 'portalOpen'})
  }

  function handleClose(){
    dispatch({type: 'portalClose'})
  }

  const buttonList = [
    {
      text: "I\'m button number "
    },
    {
      text: "I\'m button number "
    },
    {
      text: "I\'m button number "
    },
    {
      text: "I\'m button number "
    },
    {
      text: "I\'m button number "
    },
    {
      text: "I\'m button number "
    }
  ]

  useEffect(() => {
    console.log('PAPER DATA', props.paperInfo)
  }, [props.paperInfo])

  useEffect(() => {
    console.log('###ANNOTATION LIST:', props.annotationList)
  }, [props.annotationList])

  if(!props.annotationList){
    return(
    <div>
      <AnnotationButton />
    </div>
    )
  }

  if(props.annotationList){
  return(
    <div>
      <div style={{display: 'flex'}} ref={portalWrapper}>
        <div>
            <div style={{
              padding: '20px',
            }}>
                <AnnotationButton handleButtonClick = {handleButtonClick}>
                I'm button number one
              </AnnotationButton>
            </div>
        </div>
        <div style={{flex: 0.25}}>

        </div>
        <Portal
          open={state.portalOpen}
          closeOnDocumentClick = {false}
          closeOnEscape = {false}
          mountNode = {portalWrapper.current}
          >
          <Segment
            style={{
            width: '300em',
            height: '50em',
            position: 'relative',
            marginRight: '20px',
            flex: 10,
            overflow: 'scroll'
            }}>
            <Button
              onClick={handleClose}>
              Exit
            </Button>
          <TopLevelAnnotations
            annotationList={props.annotationList}/>
          </Segment>
        </Portal>
    </div>
    </div>
    )
  }
}

export default AnnotationContainer

//
// <div>
//   <Message color='grey' size='large'>
//     <Message.Content>
//       <Message.Header>
//         {props.paperInfo.title} [ID: {props.paperInfo.id}]
//         <em>[Annotation Dot Version]</em>
//       </Message.Header>
//       <p>
//         {props.paperInfo.authors}
//       </p>
//       <Divider />
//       <Message.Content>
//         <em>
//           {props.paperInfo.citation}
//         </em>
//       </Message.Content>
//     </Message.Content>
//   </Message>
// </div>
//
