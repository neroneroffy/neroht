/**
 * Author: NERO
 * Date: 2019/5/19 0019
 * Time: 11:51
 *
 */
import axios from 'axios'
import {API_SERVER} from '../constants'

export const GET_TAGS_LIST_SUCCESS = 'GET_TAGS_LIST_SUCCESS'
const actionTagsList = data => ({
  type: GET_TAGS_LIST_SUCCESS,
  data
})
export const getTagsList = () => dispatch => {
  return axios.get(`${API_SERVER}/tags/tagList`).then(res => {
    dispatch(actionTagsList(res.data.data))
  }).catch(e => {
    console.log('tags 请求的错误', e);
  })
}
