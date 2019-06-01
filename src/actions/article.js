/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:29
 *
 */
import axios from 'axios'
import { API_SERVER } from '../constants'

export const GET_ARTICLE_LIST_SUCCESS = 'GET_ARTICLE_LIST_SUCCESS'
const actionArticleList = data => ({
  type: GET_ARTICLE_LIST_SUCCESS,
  data
})
export const getArticleList = ({ page, size, tags }) => dispatch => {
  console.log('articleList 请求的url', API_SERVER)
  return axios.get(`${API_SERVER}/article/list`, {
    params: { page, size, tags }
  }).then(res => {
    dispatch(actionArticleList(res.data.data))
  }).catch(e => {
    console.log('err-message',e.message);
  })
}

export const GET_ARTICLE_DETAIL_SUCCESS = 'GET_ARTICLE_DETAIL_SUCCESS'
const actionArticleDetail = data => ({
  type: GET_ARTICLE_DETAIL_SUCCESS,
  data
})
export const getArticleDetail = id => dispatch => {
  return axios.get(`${API_SERVER}/article/detail`, {
    params: { id }
  }).then(res => {
    return dispatch(actionArticleDetail(res.data.data))
  }).catch(e => {
    // console.log(e);
  })
}

export const CLEAR_ARTICLE_DETAIL = 'CLEAR_ARTICLE_DETAIL'
export const clearArticleDetailData = () => dispatch => dispatch({
  type: CLEAR_ARTICLE_DETAIL,
})
