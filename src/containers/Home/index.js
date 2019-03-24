/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:20
 *
 */
import React from 'react'
import './style/index.less'
import homeStyle from './style/index.less'
import withStyle from '../../utils/withStyle'
import showdown from 'showdown'
// import websiteSymbol from '../../assets/img/website-symbol.png'
import { Icon } from 'antd'



class Home extends React.Component {
    componentDidMount() {

    }
    render() {
        return <div id="home">

            <div className="banner">
                <div className="banner-inner">
                    <span className="icon-website-symbol"></span>
                </div>
            </div>

            <section className="content">
                <div className="container-center" ref="htmlContainer">
                </div>
            </section>

        </div>
    }
}
export default withStyle(Home, homeStyle)
