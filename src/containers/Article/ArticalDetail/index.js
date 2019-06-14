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
import Message from '../../../components/Message'
import { getArticleDetail, clearArticleDetailData } from '../../../actions/article'
import { getMessageData, clearMessageData } from '../../../actions/message'
import withStyle from "../../../utils/withStyle";
import Spin from '../../../components/Spin'
import ScrollToTop from '../../../components/ScrollToTop'
import style from './index.less'
import { PAGE, SIZE } from '../../../constants'
import './index.less'

const converter = new showdown.Converter();

class Index extends React.Component {
  state = {
    loading: false
  }
  async componentDidMount() {
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
  render() {
    const { detailData } = this.props
    const { loading } = this.state
    let html = converter.makeHtml(detailData.content)
    if (html) {
      html = html.replace('/%%script%%/g', '<script').replace('/%%/script%%/g', '</script')
    }
    return <div id="artical-detail">
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
              <Message/>
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
