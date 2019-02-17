/**
 * Author: Zhou Ht
 * Date: 2018/12/15 0015
 * Time: 18:12
 *
 */
import React from 'react'
import {Icon} from "antd";
import './style/index.less'

class Article extends React.Component {
    render() {
        return <div id="article">
            <div className="banner">
                <div className="banner-inner">
                    <span className="icon-website-symbol"></span>
                </div>
            </div>
            <div className="artical-inner">
                <Icon type="smile" theme="outlined" /> 还啥也没有呢
            </div>

        </div>
    }
}
export default Article
