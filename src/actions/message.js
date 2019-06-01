/**
 * Author: NERO
 * Date: 2019/6/1 0001
 * Time: 16:46
 *
 */
import axios from 'axios'
import { API_SERVER } from '../constants'

export const POST_MESSAGE_DATA_SUCCESS = 'POST_MESSAGE_DATA_SUCCESS'
const actionPostMessageData = () => ({
  type: POST_MESSAGE_DATA_SUCCESS,
})
export const postMessageData = body => dispatch => {
  return axios.post(`${API_SERVER}/comment/new`, body).then(res => {
    dispatch(actionPostMessageData(res.data.data))
    return Promise.resolve(res.data)
  }).catch(e => {
    return Promise.reject(e.message)
  })
}

export const GET_MESSAGE_DATA_SUCCESS = 'GET_MESSAGE_DATA_SUCCESS'
const actionMessageData = data => ({
  type: GET_MESSAGE_DATA_SUCCESS,
  data
})
export const getMessageData = params => dispatch => {
  return axios.get(`${API_SERVER}/comment/list`, { params }).then(res => {
    dispatch(actionMessageData(res.data.data))
    return Promise.resolve(res.data)
  }).catch(e => {
    return Promise.reject(e.message)
  })
}
export const CLEAR_MESSAGE_DATA = 'CLEAR_MESSAGE_DATA'
export const clearMessageData = () => dispatch => dispatch({
  type: CLEAR_MESSAGE_DATA,
})
