/**
 * Author: NERO
 * Date: 2019/5/23 0023
 * Time: 23:08
 *
 */
import React from 'react'
import { Form, Input } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './style/index.less'
import withStyle from '../../utils/withStyle'

class MessageComponent extends React.Component {
  render() {
    return <div className="message">
      留言评论
    </div>
  }
}
const mapStateToProps = state => {
  return {
    ...state
  }
}

const Message = connect(mapStateToProps, {})(Form.create()(withRouter(withStyle(MessageComponent, styles))))
Message.loadData = (store, articleId) => {
  console.log('留言评论的请求')
}

export default Message