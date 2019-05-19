/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:45
 *
 */
import * as ActionType from '../actions/article'

const initialState = {
  list: [],
  detailData: ''
}
export function article(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_ARTICLE_LIST_SUCCESS:
      return {
        ...state,
        ...action.data,
      }
    case ActionType.GET_ARTICLE_DETAIL_SUCCESS:
      return {
        ...state,
        detailData: action.data,
      }
    default:
      return state
  }
}
