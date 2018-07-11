import { ADD_POINT, REMOVE_POINT } from './actions.js'

const initialState = [];
  

function routeApp(state = initialState, action) {
  switch (action.type) {
    case ADD_POINT:
        return [
            ...state,
            action.payload
        ];
      case REMOVE_POINT:
        return state.slice(0, action.payload).concat(state.slice(action.payload + 1));
    default:
        return state;
  }
}

export default routeApp