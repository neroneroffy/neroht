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
  backToTop = () => {
    if (document) {
      document.getElementById(this.props.element).scrollIntoView({behavior: "smooth"})
    }
  }
  render() {
    return <div className="scroll-to-top">
      <Icon type="to-top" onClick={this.backToTop}/>
      <div>回到顶部</div>
    </div>
  }
}

export default withRouter(withStyle(ScrollToTop, styles))