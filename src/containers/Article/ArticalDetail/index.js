/**
 * Author: NERO
 * Date: 2019/3/19 0019
 * Time: 22:43
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import showdown from 'showdown'
import { getArticleDetail } from '../../../actions/article'
import withStyle from "../../../utils/withStyle";
import style from './index.less'
import './index.less'

const converter = new showdown.Converter();

class Index extends React.Component {

  componentDidMount() {
    const { params } = this.props.match
    const { detailData } = this.props
    this.props.getArticleDetail(params.id)
  }

  render() {
    const { detailData } = this.props
    let html = converter.makeHtml(detailData.content)
    if (html) {
      html = html.replace('/%%script%%/g', '<script').replace('/%%/script%%/g', '</script')
    }
    return <div className="artical-detail">
      <div className="top">
        <h1>{detailData.title}</h1>
        <div className="author">{detailData.author}</div>
      </div>
      <div className="md-content" dangerouslySetInnerHTML={{__html: html}}></div>
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
  getArticleDetail
}
const ArticalDetail = connect(mapState, mapDispatch)(withStyle(Index, style))
ArticalDetail.loadData = (store, id) => {
  return store.dispatch(getArticleDetail(id))
}
export default ArticalDetail
