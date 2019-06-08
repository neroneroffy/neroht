/**
 * Author: NERO
 * Date: 2019/3/19 0019
 * Time: 22:43
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import showdown from 'showdown'
import Message from '../../../components/Message'
import { getArticleDetail, clearArticleDetailData } from '../../../actions/article'
import withStyle from "../../../utils/withStyle";
import Spin from '../../../components/Spin'
import ScrollToTop from '../../../components/ScrollToTop'
import style from './index.less'
import './index.less'

const converter = new showdown.Converter();

class Index extends React.Component {
  state = {
    loading: false
  }
  async componentDidMount() {
    const { params } = this.props.match
    const { clearArticleDetailData } = this.props

    clearArticleDetailData()
    this.setState({loading: true})
    await this.props.getArticleDetail(params.id)
    this.setState({loading: false})
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
                <div className="author">{detailData.author}</div>
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
  const { article } = state
  return {
    detailData: article.detailData
  }
}
const mapDispatch = {
  getArticleDetail,
  clearArticleDetailData,
}
const ArticalDetail = connect(mapState, mapDispatch)(withStyle(Index, style))
ArticalDetail.loadData = (store, id) => {
  return store.dispatch(getArticleDetail(id))
}
export default ArticalDetail
