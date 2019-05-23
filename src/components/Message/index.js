/**
 * Author: NERO
 * Date: 2019/5/23 0023
 * Time: 23:08
 *
 */
import React from 'react'
import { Form, Input } from 'antd'
import { connect } from 'react-redux'
import styles from './style/index.less'
import withStyle from '../../utils/withStyle'

class MessageComponent extends React.Component {
  render() {
    return <div className="message">
      留言评论
    </div>
  }
}
const Message = Form.create()(withStyle(MessageComponent, styles))
Message.loadData = (store, articleId) => {
  console.log('留言评论的请求')
}
const mapStateToProps = state => {
  return {
    ...state
  }
}
export default connect(mapStateToProps, {})(Message)