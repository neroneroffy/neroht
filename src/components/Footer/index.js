/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 17:20
 *
 */
import React from 'react'
import withStyle from '../../utils/withStyle'
import footerStyles from './style/index.less'
import './style/index.less'

class Footer extends React.Component {
  render() {
      return <div id="foot">
        <div className="inner">
          <span>京ICP备18056340号-1</span>
        </div>
      </div>
  }
}

export default withStyle(Footer, footerStyles)
