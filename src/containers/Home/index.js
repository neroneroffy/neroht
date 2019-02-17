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
                <div className="container-center">
                    <div className="about-website">
                        <h1>关于本站</h1>
                        <p>
                            转行前端一年有余，出于个人爱好，将所学知识用于实际，以及总结的目的，搭建了这个并不复杂的个人网站。
                            目前只有简单的静态页。全部完成之后会在这上面分享一些自己的心得、技术和作品。也希望自己能通过在搭建网站的过程中来巩固之前所学的知识，以及通过在网站上总结，敦促自己学习。做过设计，喜欢没事做做图，
                            作品戳<a href="http://huaban.com/boards/32345086/" target="_blank">这里</a>。后续会尝试加入评论功能，希望和大家有所交流。
                        </p>
                        <p style={{ marginTop: 16 }}>
                            如果对我感兴趣，可以关注我的社区账号~
                        </p>
                        <div className="accounts">
                            <a href="https://segmentfault.com/u/capslock_5958bbd694e19" target="_blank">
                                <Icon type="github" />
                                <div>GitHub</div>
                            </a>
                            <a href="https://segmentfault.com/u/capslock_5958bbd694e19" target="_blank">
                                <span className="icon-segmentfault"></span>
                                <div>segmentFault</div>
                            </a>
                            <a href="https://twitter.com/capslocktao" target="_blank">
                                <Icon type="twitter" />
                                <div>Twitter</div>
                            </a>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    }
}
export default withStyle(Home, homeStyle)
