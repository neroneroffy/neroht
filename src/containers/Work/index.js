/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 17:37
 *
 */
import React from 'react'
import { Icon } from 'antd'
import './style/index.less'

class Work extends React.Component {
    render() {
        return <div id="work">
            <div className="banner">
                <div className="banner-inner">
                    <span className="icon-website-symbol"></span>
                </div>
            </div>
            <div className="work-inner">
                <Icon type="smile" theme="outlined" /> 还啥也没有呢
            </div>
        </div>
    }
}
export default Work
