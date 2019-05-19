/**
 * Author: NERO
 * Date: 2019/5/19 0019
 * Time: 12:08
 *
 */
import * as ActionType from '../actions/tags'

const initialState = {
  list: [],
}
export function tags(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_TAGS_LIST_SUCCESS:
      return {
        ...state,
        list: action.data,
      }
    default:
      return state
  }
}
