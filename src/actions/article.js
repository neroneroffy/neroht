/**
 * Author: NERO
 * Date: 2019/3/20 0020
 * Time: 22:29
 *
 */
import axios from 'axios'

const GET_ARTICLE_LIST = 'GET_ARTICLE_LIST'

const fetchArticleList = data => ({
  type: GET_ARTICLE_LIST,
  data
})
export const getArticleList = () => async dispatch => {
  try {
    const res = await axios.get('/api/article/list')
    if (res) {
      dispatch(fetchArticleList(res.data))
    }
  } catch (e) {}

}
