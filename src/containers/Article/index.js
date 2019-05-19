/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 18:12
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { getArticleList } from '../../actions/article'
import { getTagsList } from '../../actions/tags'
import { Pagination, Tag } from 'antd'
import { Link } from 'react-router-dom'
import withStyle from '../../utils/withStyle'
import './style/index.less'
import style from './style/index.less'
import moment from 'moment'
import { SPECIAL_CHARACTER_REG, PAGE, SIZE } from '../../constants'

class Index extends React.Component {
    state = {
      page: PAGE,
      size: SIZE,
    }
    componentDidMount() {
      const { getArticleList, articleList, getTagsList, tagsList } = this.props
      const { page, size } = this.state
      if (!tagsList) {
        getTagsList()
      }
      if (!articleList.length) {
        getArticleList({ page, size })
      }
    }
    changePage = currentPage => {
      this.setState({
        page: currentPage - 1
      })
    }
    render() {
      const { articleList, total } = this.props
      return <div id="article">
        <div className="banner">
          <div className="banner-inner">
            <span className="icon-website-symbol"></span>
          </div>
        </div>
        <div className="artical-inner">
          <div className="top">
            <h2>最新文章</h2>
          </div>
          {
            articleList.map(v => <div className="article-item" key={v.id}>
              <Link to={`/article/article-detail/${v.id}`}>
                <div className="top">
                  <h2>{v.title}</h2>
                  <div className="right">
                    <span>{v.author}</span>
                    <span>{moment(v.createtime).format('YYYY-MM-DD')}</span>
                  </div>
                </div>
                <div className="brief">{v.brief}</div>
              </Link>
            </div>)
          }
          <div className="pagination">
            <Pagination
              total={total}
              onChange={this.changePage}
              simple={true}
            />
          </div>
        </div>
      </div>
    }
}


const mapState = state => {
  const { article, tags } = state
  return {
    articleList: article.list,
    total: article.total,
    tagsList: tags.list,
  }
}
const mapDispatch = {
  getArticleList,
  getTagsList
}

const Article = connect(mapState, mapDispatch)(withStyle(Index, style))
Article.loadData = store => {
  const articleList  = store.dispatch(getArticleList({ page: PAGE, size: SIZE }))
  const tagList  = store.dispatch(getTagsList())
  const promises = [articleList, tagList]
  return Promise.all(promises)
}

export default Article
