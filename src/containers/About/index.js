/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:20
 *
 */
import React from 'react'
import showdown from 'showdown'
import './style/index.less'
import { getAbout } from '../../actions/about'
import { getMessageData, clearMessageData } from '../../actions/message'
import withStyle from '../../utils/withStyle'
import Message from '../../components/Message'
import { connect } from 'react-redux'
import styles from './style/index.less'
import { PAGE, SIZE } from '../../constants'
import './style/index.less'
import {notification} from "antd";

const converter = new showdown.Converter();

class AboutComponent extends React.Component {
  state = {
    page: PAGE,
    size: SIZE,
  }
  async componentDidMount() {
    const { page, size } = this.state
    const { getMessageData, messageData } = this.props
    this.props.getAbout()
    if (messageData.length === 0) {
      await getMessageData({ page, size })
    }
  }
  componentWillUnmount() {
    this.props.clearMessageData()
  }

  onLoadData = currentPage => {
    this.setState({
      page: currentPage === 0 ? 0 : this.state.page + 1
    }, this.onLoadMessageList)
  }
  onLoadMessageList = async () => {
    const { getMessageData } = this.props
    const { page, size } = this.state
    const res = await getMessageData({ page, size })
    if (!res.result) {
      notification.warn({ message: '请求留言列表失败，请稍后再试' })
    }
  }

  render() {
      const { info, messageData, total } = this.props
      let html = converter.makeHtml(info)
      return <div className="about">
          <div className="inner">
            <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
            <Message messageData={messageData} total={total} loadData={this.onLoadData}/>
          </div>
      </div>
    }
}
const mapStateToProps = state => {
  const { article, message } = state
  return {
    detailData: article.detailData,
    messageData: message.list,
    total: message.total,
    info: state.about.information
  }
}

const About = connect(mapStateToProps, {
  getAbout,
  getMessageData,
  clearMessageData,
})(withStyle(AboutComponent, styles))
About.loadData = store => {
  const getMessage = store.dispatch(getMessageData({ page: PAGE, size: SIZE }))
  const getAboutData = store.dispatch(getAbout())
  return Promise.all([getAboutData, getMessage])
}
export default About
