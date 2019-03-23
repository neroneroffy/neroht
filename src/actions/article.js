/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:29
 *
 */
import axios from 'axios'

export const GET_ARTICLE_LIST = 'GET_ARTICLE_LIST'

const fetchArticleList = data => ({
  type: GET_ARTICLE_LIST,
  data
})
export const getArticleList = () => dispatch => {
  return axios.get('http://127.0.0.1:8081/api/article/list').then(res => {
    dispatch(fetchArticleList(res.data.data))
  }).catch(e => {
    console.log(e);
  })
}
