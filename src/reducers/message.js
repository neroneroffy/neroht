/**
 * Author: NERO
 * Date: 2019/6/1 0001
 * Time: 17:36
 *
 */
import * as ActionType from '../actions/message'

const initialState = {
  list: [],
  total: 0,
}
export function message(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_MESSAGE_DATA_SUCCESS:
      return {
        ...state,
        ...action.data,
      }
    case ActionType.CLEAR_MESSAGE_DATA:
      return {
        ...state,
        list: [],
        total: 0,
      }
    default:
      return state
  }
}
