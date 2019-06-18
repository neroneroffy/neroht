/**
 * Author: NERO
 * Date: 2019/5/23 0023
 * Time: 23:08
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, message } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './style/index.less'
import withStyle from '../../utils/withStyle'
import { postMessageData, clearMessageData } from '../../actions/message'
import moment from 'moment'
import { PAGE, SIZE } from '../../constants'
import ScrollLoadPage from '../ScrollLoadPage'

message.config({
  top: 80,
});
const { TextArea } = Input;
const FormItem = Form.Item

class MessageComponent extends React.Component {
  state = {
    page: PAGE,
    size: SIZE
  }

  onSubmit = () => {
    const { postMessageData, form: { validateFields, resetFields }, match: { params: { id } }  } = this.props
    validateFields(async (err, values) => {
      if (err) return
      const { content, nickName, email } = values
      const res = await postMessageData({ content, nickName, email, articleId: id })
      if (res.result) {
        message.success('留言成功');
        resetFields()
        this.props.clearMessageData()
        this.props.loadData(0)
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { messageData, total, loading } = this.props
    const { page } = this.state
    return <div className="message">
      <Form className="message-textarea">
        <FormItem
          label={"写下你的留言"}
          required={true}
        >
          {
            getFieldDecorator('content', {
              rules: [{require: true, message: '内容不能为空'}]
            })(<TextArea rows={4} />)
          }
        </FormItem>
        <FormItem
          label={"你的昵称"}
          required={true}
        >
          {
            getFieldDecorator('nickName', {
              rules: [{require: true, message: '内容不能为空'}]
            })(<Input className="other-item" placeholder="来个有内涵的名字"/>)
          }
        </FormItem>
        <FormItem
          label={"邮箱"}
        >
          {
            getFieldDecorator('email', {
              rules: [
                {type: 'email', message: '邮箱格式不正确'},
                ]
            })(<Input className="other-item" placeholder="不会被展示，便于接收回复通知"/>)
          }
        </FormItem>
        <div className="action">
          <Button
            type="primary"
            disabled={!getFieldValue('content') || !getFieldValue('nickName')}
            onClick={this.onSubmit}
          >提交</Button>
        </div>
      </Form>
      <div className="comment-list">
        {
          messageData.length === 0 ?
            <div className="empty">
              暂无数据
            </div>
            :
            <ScrollLoadPage
              loadMore={this.props.loadData}
              currentPage={page}
              hasMore={total > messageData.length}
              loading={loading}
            >
              {
                messageData.map(v => <div className="comment-item" key={v.createtime}>
                  <div className="comment-top">
                    <span className="nick-name">{v.nickName}</span>
                    <span className="time">{moment(v.createtime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                  <div className="content">{v.content}</div>
                  {
                    v.replyContent &&
                    <div className="reply">
                      <div className="comment-top reply-top">
                    <span className="nick-name">
                      Nero
                      <span className="role">管理员</span>
                      <span>回复：</span>
                    </span>
                        <span>{moment(v.replyTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </div>
                      <div className="reply-content">{v.replyContent}</div>
                    </div>
                  }
                </div>)
              }
            </ScrollLoadPage>
        }
      </div>
    </div>
  }
}
const mapStateToProps = state => {
  const { globalLoading: { loading } } = state
  return {
    loading
  }
}

const Message = connect(mapStateToProps, {
  postMessageData,
  clearMessageData,
})(Form.create()(withRouter(withStyle(MessageComponent, styles))))

export default Message