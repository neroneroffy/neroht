/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:20
 *
 */
import React from 'react'
import girl from '../../assets/img/girl.jpg'
import './style/index.less'
class About extends React.Component {
    render() {
        return <div className="about">关于周海涛
            <span className="icon-home2"></span>
            <div>
                <img src={girl} alt=""/>
            </div>
        </div>
    }
}
export default About
