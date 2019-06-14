/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:45
 *
 */
import * as ActionType from '../actions/article'

const initialState = {
  list: [],
  total: 0,
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
    case ActionType.CLEAR_ARTICLE_LIST:
      return {
        ...state,
        list: [],
      }
    case ActionType.CLEAR_ARTICLE_DETAIL:
      return {
        ...state,
        detailData: '',
      }
    default:
      return state
  }
}
