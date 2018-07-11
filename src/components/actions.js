export const ADD_POINT = 'ADD_POINT'
export const REMOVE_POINT = 'REMOVE_POINT'


export function addPoint(text) {
  return { type: ADD_POINT, payload: text }
}

export function removePoint(index) {
    return { type: REMOVE_POINT, payload: index }
}