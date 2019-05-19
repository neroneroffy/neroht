/**
 * Author: Zhou Ht
 * Date: 2018/12/3 0003
 * Time: 23:12
 *
 */
import React from 'react'
import { renderRoutes } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import './Home/style/index.less'
import Header from '../components/Header'
import Footer from '../components/Footer'
import routes from '../routes'
import './style/index.less'
class Container extends React.Component {
    state = {
        num: 1
    }
    render() {
        return <div id="container-wrapper">
            <Header staticContext={this.props.staticContext}/>
            <div id="container">
                { renderRoutes(routes) }
            </div>
            <Footer staticContext={this.props.staticContext}/>
          </div>
    }
}

export default withRouter(Container)