/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:44
 *
 */
import { combineReducers } from 'redux'
import { article } from './article'
import { tags } from './tags'
import { message } from './message'

const rootReducer = combineReducers({
  article,
  tags,
  message,
})

export default rootReducer