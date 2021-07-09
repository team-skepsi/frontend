import React from 'react';

function ButtonWrapper(){
  const portalWrapper = useRef(null)

  // PORTAL CONTROLS
  // can remove toggle when finished connecting components
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

  return(
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
          annotationList = {props.annotationList}
          />
        </Segment>
      </Portal>
  </div>
  )
}
