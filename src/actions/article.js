/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:29
 *
 */
import axios from 'axios'

export const GET_ARTICLE_LIST = 'GET_ARTICLE_LIST'
const actionArticleList = data => ({
  type: GET_ARTICLE_LIST,
  data
})
export const getArticleList = () => dispatch => {
  return axios.get('http://127.0.0.1:8081/api/article/list').then(res => {
    dispatch(actionArticleList(res.data.data))
  }).catch(e => {
    // console.log(e);
  })
}

export const GET_ARTICLE_DETAIL = 'GET_ARTICLE_DETAIL'
const actionArticleDetail = data => ({
  type: GET_ARTICLE_DETAIL,
  data
})
export const getArticleDetail = id => dispatch => {
  return axios.get(`http://127.0.0.1:8081/api/article/detail?id=${id}`).then(res => {
    return dispatch(actionArticleDetail(res.data.data))
  }).catch(e => {
    // console.log(e);
  })
}

