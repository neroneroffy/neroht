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
import './style/index.less'

class Article extends React.Component {
    state = {
        articalList: [
          {
            id: 1,
            title: 'React 组件设计模式-组合组件',
            brief: `场景：希望减少上下级组件之间props的传递，同时想避免“提供者”和“消费者” 角色组件共同依赖一个Context对象。
            简单来说就是不用传做显式地传值，来达到组件之间相互通信的目的, 举例来说，某些界面中应该有Tabs这样的组件，由Tab和TabItem组成，点击每个TabItem，该TabItem会高亮，
那么Tab和TabItem自然要进行沟通。很自然的写法是像下面这样`,
            author: 'admin',
            createTime: '1552920822226'
          }
        ]
    }
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
            articleList.length === 0 ?
              <>loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading..loading...</> :
            articleList.map(v => <div key={v.email}>
              <Link to={`/article-detail/1`}>{v.email}</Link>
              </div>)
/*
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
*/
          }
        </div>
      </div>
    }
}

Article.loadData = store => {
  return store.dispatch(getArticleList())
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
export default connect(mapState, mapDispatch)(Article)
