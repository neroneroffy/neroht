/**
 * Author: NERO
 * Date: 2019/3/23 0023
 * Time: 16:01
 *
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const serverStore = () => createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk)
  )
)

export default serverStore
