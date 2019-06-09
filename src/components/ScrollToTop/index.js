/**
 * Author: NERO
 * Date: 2019/6/6 0006
 * Time: 23:40
 *
 */
import React from 'react'
import {Icon} from "antd";
import './index.less'
import styles from './index.less'
import { withRouter } from 'react-router-dom'
import withStyle from '../../utils/withStyle'

class ScrollToTop extends React.Component {
  _isMounted = false
  state = {
    visible: false
  }
  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('scroll', this.scroll)
  }
  scroll = () => {
    if (document) {
      const totalHeight = document.body.scrollHeight;
      let scrolledHeight = document.body.scrollTop;
      if (totalHeight > 0 && scrolledHeight === 0) {
        scrolledHeight = document.documentElement.scrollTop;
      }
      const screenHeight = document.body.clientHeight;
      if (this._isMounted) {
        if (scrolledHeight > screenHeight && screenHeight !== 0) {
          this.setState({
            visible: true
          })
        } else {
          this.setState({
            visible: false
          })
        }
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('scroll', this.scroll)
  }

  backToTop = () => {
    if (document) {
      document.getElementById(this.props.element).scrollIntoView()
    }
  }
  render() {
    return <div className={"scroll-to-top"} style={this.state.visible ? {display: 'block'} : {display: 'none'}}>
      <Icon type="to-top" onClick={this.backToTop}/>

    </div>
  }
}

export default withRouter(withStyle(ScrollToTop, styles))