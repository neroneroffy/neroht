import * as ActionType from "../actions/tags";

/**
 * Author: NERO
 * Date: 2019/6/6 0006
 * Time: 22:14
 *
 */
const initialState = {
  globalLoading: false,
}
export function globalLoading(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_BEGIN':
      return {
        ...state,
        loading: true,
      }
    case 'LOADING_END':
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
