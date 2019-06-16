/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:29
 *
 */
import axios from 'axios'
import { API_SERVER } from '../constants'

export const GET_DESIGN_ARTICLE_LIST_SUCCESS = 'GET_DESIGN_ARTICLE_LIST_SUCCESS'
const actionDesignArticleList = data => ({
  type: GET_DESIGN_ARTICLE_LIST_SUCCESS,
  data
})
export const getDesignArticleList = (params) => (dispatch, getState) => {
  return axios.get(`${API_SERVER}/article/list`, { params }).then(res => {
    const { list } = getState().design
    const data = {
      list: list.concat(res.data.data.list),
      total: res.data.data.total
    }
    dispatch(actionDesignArticleList(data))
  }).catch(e => {
    console.log('err-message',e.message);
  })
}

export const GET_DESIGN_ARTICLE_DETAIL_SUCCESS = 'GET_DESIGN_ARTICLE_DETAIL_SUCCESS'
const actionDesignArticleDetail = data => ({
  type: GET_DESIGN_ARTICLE_DETAIL_SUCCESS,
  data
})
export const getDesignArticleDetail = id => dispatch => {
  return axios.get(`${API_SERVER}/article/detail`, {
    params: { id }
  }).then(res => {
    return dispatch(actionDesignArticleDetail(res.data.data))
  }).catch(e => {
    // console.log(e);
  })
}
export const CLEAR_DESIGN_ARTICLE_DETAIL = 'CLEAR_DESIGN_ARTICLE_DETAIL'
export const clearDesignArticleDetailData = () => dispatch => dispatch({
  type: CLEAR_DESIGN_ARTICLE_DETAIL,
})
export const CLEAR_DESIGN_ARTICLE_LIST = 'CLEAR_DESIGN_ARTICLE_LIST'
export const clearDesignArticleListData = () => dispatch => dispatch({
  type: CLEAR_DESIGN_ARTICLE_LIST,
})
