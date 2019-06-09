/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:13
 *
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon, Popover, Dropdown } from 'antd';
import './style/index.less'
import headerStyles from './style/index.less'
import withStyle from '../../utils/withStyle'

class Header extends React.Component {
    state = {
        current: '/',
    }
    componentWillMount() {
      const pathname = window.location.pathname
      this.setState({
            current: `/${pathname.split('/')[1]}`
        });
    }
    handleScroll = () => {
      if (window.scrollY > 570) {
          this.refs.header.style.background = "#160e0f";
      }else{
        this.refs.header.style.background = "rgba(22,14,15,0)";
      }
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    render() {
      console.log(this.state.current);
      const menu = direction => <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode={direction}
      >
        <Menu.Item key="/">
          <Link to='/'>首页</Link>
        </Menu.Item>
        <Menu.Item key="/article">
          <Link to='/article'>文章</Link>
        </Menu.Item>
        <Menu.Item key="/work">
          <Link to='/work'>作品</Link>
        </Menu.Item>
        <Menu.Item key="/about">
          <Link to='/about'>关于</Link>
        </Menu.Item>
      </Menu>
      return (<div id="header">
            <div className="header-height"></div>
            <div className="header-fixed" ref="header">
                <div className="inner">
                  <Link to='/'>
                    <div className="logo">
                        <span className="icon-logo"></span>
                    </div>
                  </Link>
                  <div className="menu">
                    <Dropdown placement="bottomRight" overlay={menu('inline')} trigger={["click"]}>
                      <span className="mobile">
                        <Icon type="dash" />
                      </span>
                    </Dropdown>
                    <span className="pc">
                      {menu('horizontal')}
                    </span>
                  </div>
                </div>
            </div>
        </div>)
    }
}

export default withStyle(Header, headerStyles)
