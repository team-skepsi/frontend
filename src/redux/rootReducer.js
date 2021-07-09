
const initialState = {
  token: ''
}


function rootReducer(state=initialState, action){
  switch(action.type){
    case 'updateClient':
      return {
        ...state,
        client: action.payload
      }
    default:
      return state
  }
}


export default rootReducer;
