/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 18:12
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { getArticleList, clearArticleListData } from '../../actions/article'
import { getTagsList } from '../../actions/tags'
import { Tag, Icon } from 'antd'
import { Link } from 'react-router-dom'
import withStyle from '../../utils/withStyle'
import './style/index.less'
import style from './style/index.less'
import moment from 'moment'
import { PAGE, SIZE } from '../../constants'
import ScrollLoadPage from '../../components/ScrollLoadPage'
import ScrollToTop from '../../components/ScrollToTop'
import articleBg from '../../assets/img/artical.jpg'
import logo from '../../assets/img/logo3.png'
moment.locale('zh-cn');
const { CheckableTag } = Tag;
const TYPE = 'it'
class Index extends React.Component {
  state = {
    page: PAGE,
    size: SIZE,
    selectedTags: [],
  }
  componentDidMount() {
    const { articleList, getTagsList, tagsList } = this.props
    if (!tagsList.length) {
      getTagsList()
    }
    if (!articleList.length) {
      this.loadArticleList()
    }
  }
  loadArticleList = () => {
    const { getArticleList } = this.props
    const { page, size, selectedTags } = this.state
    getArticleList({ page, size, tags: selectedTags.join(','), type: TYPE })
  }
  onLoadData = () => {
    this.setState({
      page: this.state.page + 1
    }, () => this.loadArticleList())
  }
  onTagChange = id => {
    this.props.clearArticleListData()
    if (id === 'all') {
      this.setState({
        selectedTags: [],
        page: PAGE
      }, () => this.loadArticleList())
      return
    }
    let selectedTags = JSON.parse(JSON.stringify(this.state.selectedTags))
    if (!selectedTags.includes(id)) {
      selectedTags.push(id)
    } else {
      selectedTags = selectedTags.filter(v => v !== id)
    }
    this.setState({ selectedTags, page: PAGE }, () => this.loadArticleList())
  }

  render() {
    const { articleList, total, tagsList, loading } = this.props
    const { selectedTags, page } = this.state
      return <div id="article">
        <ScrollToTop element={"article"}/>
        <div className="banner">
          <div className="inner">
            <img src={logo} alt=""/>
          </div>
          <img src={articleBg} alt=""/>
        </div>
        <div className="inner">
          <div className="top">
            <h2>最新文章</h2>
            <div className="tags">
              标签：
              <CheckableTag
                checked={selectedTags.length === 0}
                onChange={() => this.onTagChange('all')}
              >全部</CheckableTag>
              {
                tagsList.map(v => <CheckableTag
                  key={v.id}
                  checked={selectedTags.includes(v.id)}
                  onChange={() => this.onTagChange(v.id)}
                >
                  { v.tagName }
                </CheckableTag>)
              }
            </div>
          </div>
          <ScrollLoadPage
            loadMore={this.onLoadData}
            currentPage={page}
            hasMore={total > articleList.length}
            loading={loading}
          >
            {
              articleList.map(v => <div className="article-item" key={v.id}>
                <Link to={`/article-detail/${v.id}`}>
                  <div className="top">
                    <h2>{v.title}</h2>
                    <div className="right">
                      {/*<span>{v.author}</span>*/}
                      <span>{moment(v.createtime).fromNow()}</span>
                    </div>
                  </div>
                  <div className="brief">{v.brief}</div>
                </Link>
              </div>)
            }
          </ScrollLoadPage>
        </div>
      </div>
    }
}


const mapState = state => {
  const { article, tags, globalLoading: { loading } } = state
  return {
    articleList: article.list,
    total: article.total,
    tagsList: tags.list,
    loading,
  }
}
const mapDispatch = {
  getArticleList,
  getTagsList,
  clearArticleListData,
}

const Article = connect(mapState, mapDispatch)(withStyle(Index, style))
Article.loadData = store => {
  const articleList  = store.dispatch(getArticleList({ page: PAGE, size: SIZE, type: TYPE }))
  const tagList  = store.dispatch(getTagsList())
  const promises = [articleList, tagList]
  return Promise.all(promises)
}

export default Article
