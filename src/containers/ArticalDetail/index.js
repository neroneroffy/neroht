/**
 * Author: NERO
 * Date: 2019/3/19 0019
 * Time: 22:43
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import showdown from 'showdown'
import moment from 'moment'
import Message from '../../components/Message/index'
import { getArticleDetail, clearArticleDetailData } from '../../actions/article'
import { getMessageData, clearMessageData } from '../../actions/message'
import withStyle from "../../utils/withStyle";
import Spin from '../../components/Spin/index'
import ScrollToTop from '../../components/ScrollToTop/index'
import style from './index.less'
import { PAGE, SIZE } from '../../constants/index'
import { Helmet } from "react-helmet"
import './index.less'
import {notification} from "antd";

const converter = new showdown.Converter();

class Index extends React.Component {
  state = {
    loading: false,
    page: PAGE,
    size: SIZE,
  }
  async componentDidMount() {
    if (document) {
      document.documentElement.scrollTop = 0
    }
    const { params } = this.props.match
    const { getArticleDetail, detailData, getMessageData, messageData } = this.props
    this.setState({loading: true})
    if (!detailData) {
      await getArticleDetail(params.id)
    }
    if (messageData.length === 0) {
      await getMessageData({ articleId: params.id, page: PAGE, size: SIZE })
    }
    this.setState({loading: false})
  }
  componentWillUnmount() {
    this.props.clearMessageData()
    this.props.clearArticleDetailData()

  }
  onLoadData = currentPage => {
    this.setState({
      page: currentPage === 0 ? 0 : this.state.page + 1
    }, this.onLoadMessageList)
  }
  onLoadMessageList = async () => {
    const { getMessageData, match: { params: { id } } } = this.props
    const { page, size } = this.state
    const res = await getMessageData({ articleId: id, page, size })
    if (!res.result) {
      notification.warn({ message: '请求留言列表失败，请稍后再试' })
    }
  }

  render() {
    const { detailData, messageData, total } = this.props
    const { loading } = this.state
    let html = converter.makeHtml(detailData.content)
    if (html) {
      html = html.replace('/%%script%%/g', '<script').replace('/%%/script%%/g', '</script')
    }
    return <div id="artical-detail">
      <Helmet>
        <meta
          name="keywords"
          content="前端 web前端 React Vue node.js
           Angular 前端开发 网站建设 IT咨询 个人网站 React服务端渲染 设计 ui设计 ps photoshop 平面设计 网页设计 前端"/>
        <meta name="description" content="NERO的个人网站，分享前端知识与设计作品"/>
        <title>文章详情</title>
      </Helmet>

      <ScrollToTop element={"artical-detail"}/>
      <div className="inner">
        {
          loading ?
            <div className="spining">
              <Spin text={"加载中"}/>
            </div>
            :
            <>
              <div className="top">
                <h1>{detailData.title}</h1>
                <div className="author">
                  {detailData.author}
                  <p>发布于 {moment(detailData.createtime).format('YYYY-MM-DD HH:MM:SS')}</p>
                </div>
              </div>
              <div className="md-content" dangerouslySetInnerHTML={{__html: html}}></div>
              <Message messageData={messageData} total={total} loadData={this.onLoadData}/>
            </>
        }
      </div>
    </div>
  }
}
const mapState = state => {
  const { article, message } = state
  return {
    detailData: article.detailData,
    messageData: message.list,
    total: message.total,
  }
}
const mapDispatch = {
  getArticleDetail,
  clearArticleDetailData,
  getMessageData,
  clearMessageData,
}
const ArticalDetail = connect(mapState, mapDispatch)(withStyle(Index, style))
ArticalDetail.loadData = (store, id) => {
  const getMessage = store.dispatch(getMessageData({ articleId: id, page: PAGE, size: SIZE }))
  const getDetail = store.dispatch(getArticleDetail(id))
  return Promise.all([getMessage, getDetail])
}
export default ArticalDetail
