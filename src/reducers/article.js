/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:45
 *
 */
import * as ActionType from '../actions/article'

const initialState = {
  list: []
}
export function article(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_ARTICLE_LIST:
      return {
        ...state,
        list: action.data,
      }
    default:
      return state
  }
}