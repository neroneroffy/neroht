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
import girl from '../../../assets/img/girl.jpg'
import withStyle from "../../../utils/withStyle";
import style from './index.less'
import './index.less'

const converter = new showdown.Converter();

class Index extends React.Component {
  componentDidMount() {
    const { params } = this.props.match
    this.props.getArticleDetail(params.id)

  }

  render() {
    const { detailData } = this.props
    const html = converter.makeHtml(detailData)

    return <div className="artical-detail">
      <div className="img-box">
        <img src={girl} alt=""/>
      </div>
      <div className="md-content" dangerouslySetInnerHTML={{__html: html}}>
      </div>
      <div className="img-bg"></div>
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
ArticalDetail.loadData = store => {
  return store.dispatch(getArticleDetail(1))
}
export default ArticalDetail
