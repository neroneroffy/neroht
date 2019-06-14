/**
 * Author: NERO
 * Date: 2019/5/23 0023
 * Time: 23:08
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, notification  } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './style/index.less'
import withStyle from '../../utils/withStyle'
import { postMessageData, getMessageData } from '../../actions/message'
import moment from 'moment'
import { PAGE, SIZE } from '../../constants'
import ScrollLoadPage from '../ScrollLoadPage'

const { TextArea } = Input;
const FormItem = Form.Item

class MessageComponent extends React.Component {
  state = {
    page: PAGE,
    size: SIZE
  }

  onLoadData = () => {
    this.setState({
      page: this.state.page + 1
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
  onSubmit = () => {
    const { postMessageData, form: { validateFields, resetFields }, match: { params: { id } }  } = this.props
    validateFields(async (err, values) => {
      if (err) return
      const { content, nickName, email } = values
      const res = await postMessageData({ content, nickName, email, articleId: id })
      if (res.result) {
        notification.success({ message: '留言成功', placement: 'bottomRight' })
        resetFields()
        this.props.clearMessageData()
        this.setState({
          page: 0
        }, this.onLoadMessageList)
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
          required={true}
        >
          {
            getFieldDecorator('email', {
              rules: [{require: true, message: '内容不能为空'}]
            })(<Input className="other-item" placeholder="不会被展示，便于接收回复通知"/>)
          }
        </FormItem>
        <div className="action">
          <Button
            type="primary"
            disabled={!getFieldValue('content') || !getFieldValue('nickName') || !getFieldValue('email')}
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
              loadMore={this.onLoadData}
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
{/*      {
        total > 10 &&
        <div className="pagination">
          <Pagination
            total={total}
            current={page + 1}
            simple={true}
          />
        </div>
      }*/}
    </div>
  }
}
const mapStateToProps = state => {
  const { message, globalLoading: { loading } } = state
  return {
    messageData: message.list,
    total: message.total,
    loading
  }
}

const Message = connect(mapStateToProps, {
  postMessageData,
  getMessageData,
})(Form.create()(withRouter(withStyle(MessageComponent, styles))))
Message.loadData = (store, articleId) => {
  return store.dispatch(getMessageData({ articleId, page: PAGE, size: SIZE }))
}

export default Message