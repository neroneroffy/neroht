/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 18:12
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { getArticleList } from '../../actions/article'
import { Link } from 'react-router-dom'
import withStyle from '../../utils/withStyle'
import './style/index.less'
import style from './style/index.less'

class Index extends React.Component {
    state = {}
    componentDidMount() {
      const { getArticleList, articleList } = this.props
      if (!articleList.length) {
        getArticleList()
      }
    }
    render() {
      const { articleList } = this.props
      return <div id="article">
        <div className="banner">
          <div className="banner-inner">
            <span className="icon-website-symbol"></span>
          </div>
        </div>
        <div className="artical-inner">
          {
            articleList.map(v => <div className="article-item" key={v.id}>
              <Link to={`/article-detail/${v.id}`}>
                <div className="top">
                  <h2>{v.title}</h2>
                  <div className="right">
                    <span>{v.author}</span>
                    <span>{v.createTime}</span>
                  </div>
                </div>
                <div className="brief">{v.brief}</div>
              </Link>
            </div>)
          }
        </div>
      </div>
    }
}


const mapState = state => {
  const { article } = state
  return {
    articleList: article.list
  }
}
const mapDispatch = {
  getArticleList
}

const Article = connect(mapState, mapDispatch)(withStyle(Index, style))
Article.loadData = store => {
  return store.dispatch(getArticleList())
}

export default Article
