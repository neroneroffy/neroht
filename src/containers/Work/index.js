/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 17:37
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import './style/index.less'
import { getDesignArticleList, clearDesignArticleListData } from "../../actions/design";
import { Link } from 'react-router-dom'
import moment from 'moment'
import style from './style/index.less'
import withStyle from '../../utils/withStyle'
import { PAGE, SIZE } from '../../constants'
import ScrollLoadPage from '../../components/ScrollLoadPage'
import { Helmet } from "react-helmet"
import ScrollToTop from '../../components/ScrollToTop'
import logo from '../../assets/img/logo3.png'

moment.locale('zh-cn');
const TYPE = 'design'

class WorkComponent extends React.Component {
  state = {
    page: PAGE,
    size: SIZE,
  }
  componentDidMount() {
    if (document) {
      document.body.scrollTop = 0
    }
    const { articleList } = this.props
    if (!articleList.length) {
      this.loadArticleList()
    }
  }
  loadArticleList = () => {
    const { getDesignArticleList } = this.props
    const { page, size } = this.state
    getDesignArticleList({ page, size, type: TYPE })
  }
  onLoadData = () => {
    this.setState({
      page: this.state.page + 1
    }, () => this.loadArticleList())
  }
  onRenderList = () => {
    const { articleList } = this.props
    const rows = Math.ceil(articleList.length / 3)
    let start = 0
    let end = 3
    return articleList.map(item => <div className="article-item" key={item.id}>
              <Link to={`/work/work-detail/${item.id}`}>
                <div className="top">
                  <div className="cover">
                    <img src={item.cover} alt="图片找不到了"/>
                  </div>
                  <div className="info">
                    <h2>{item.title}</h2>
                    <div className="right">
                      {/*<span>{v.author}</span>*/}
                      <span>{moment(item.createtime).fromNow()}</span>
                    </div>
                  </div>
                </div>
                <div className="brief">{item.brief}</div>
              </Link>
            </div>)
  }
  render() {
    const { articleList, total, loading } = this.props
    const { page } = this.state
    return <div id="work">
      <Helmet>
        <meta name="keywords" content="设计 ui设计 ps photoshop 平面设计 网页设计 前端"/>
        <meta name="description" content="NERO的个人网站，分享前端知识与设计作品"/>
        <title>设计作品</title>
      </Helmet>
      <ScrollToTop element={"work"}/>
     <div className="banner">
       <div className="inner">
         <img src={logo} alt=""/>
       </div>
     </div>
     <div className="work-inner">
       <ScrollLoadPage
         loadMore={this.onLoadData}
         currentPage={page}
         hasMore={total > articleList.length}
         loading={loading}
       >
         <div className="works-list">
           {this.onRenderList()}
         </div>
       </ScrollLoadPage>
     </div>
     </div>
    }
}

const mapState = state => {
  const { design, globalLoading: { loading } } = state
  return {
    articleList: design.list,
    total: design.total,
    loading,
  }
}
const mapDispatch = {
  getDesignArticleList,
  clearDesignArticleListData,
}
const Work = connect(mapState, mapDispatch)(withStyle(WorkComponent, style))
Work.loadData = store => {
    return store.dispatch(getDesignArticleList({ page: PAGE, size: SIZE, type: TYPE }))
}

export default Work
