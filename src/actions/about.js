/**
 * Author: NERO
 * Date: 2019/5/19 0019
 * Time: 11:51
 *
 */
import axios from 'axios'
import {API_SERVER} from '../constants'

export const GET_ABOUT_DATA_SUCCESS = 'GET_ABOUT_DATA_SUCCESS'
const getAboutSuccess = data => ({
  type: GET_ABOUT_DATA_SUCCESS,
  data
})
export const getAbout = () => dispatch => {
  return axios.get(`${API_SERVER}/about/info`).then(res => {
    dispatch(getAboutSuccess(res.data.data))
  }).catch(e => {
    console.log('about 请求的错误', e);
  })
}
