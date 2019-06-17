/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:13
 *
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon, Drawer, Dropdown } from 'antd';
import './style/index.less'
import headerStyles from './style/index.less'
import logo from '../../assets/img/logo.png'
import withStyle from '../../utils/withStyle'

class Header extends React.Component {
    state = {
      current: '/',
      mobileMenuVisible: false,
    }
    componentDidMount() {
      const pathname = window.location.pathname
      if (pathname.includes('article-detail')) {
        this.setState({
          current: `/`
        });
        return
      }
      this.setState({
         current: `/${pathname.split('/')[1]}`
      });
    }
    clickLogo = () => {
      this.setState({
        mobileMenuVisible: false,
        current: '/',
      })

    }
    toggleMenu = () => {
      this.setState({
        mobileMenuVisible: !this.state.mobileMenuVisible,
      })
    }
    menuClose = () => {
      this.setState({
        mobileMenuVisible: false,
      })
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
    handleMobileClick = (e) => {
      this.toggleMenu()
      this.setState({
          current: e.key,
      });
    }
    render() {
      const { mobileMenuVisible } = this.state
      const menu = () => <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode={"horizontal"}
      >
{/*        <Menu.Item key="/">
          <Link to='/'>首页</Link>
        </Menu.Item>*/}
        <Menu.Item key="/">
          <Link to='/'>技术文章</Link>
        </Menu.Item>
        <Menu.Item key="/work">
          <Link to='/work'>设计</Link>
        </Menu.Item>
        <Menu.Item key="/about">
          <Link to='/about'>关于</Link>
        </Menu.Item>
      </Menu>
      const mobileMenu = () => <Menu
        onClick={this.handleMobileClick}
        selectedKeys={[this.state.current]}
      >
{/*        <Menu.Item key="/">
          <Link to='/'>首页</Link>
        </Menu.Item>*/}
        <Menu.Item key="/">
          <Link to='/'>文章</Link>
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
            <Link to='/' onClick={this.clickLogo}>
              <div className="logo">
                <img src={logo} alt="logo"/>
              </div>
            </Link>
            <div className="menu">
                <span className="mobile" onClick={this.toggleMenu}>
                  <Icon type="menu" />
                </span>
              <span className="pc">
                {menu()}
              </span>
            </div>
          </div>
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.menuClose}
          visible={mobileMenuVisible}
          className={"header-menu-drawer"}
          width={170}
        >
          {mobileMenu()}
        </Drawer>
        </div>)
    }
}

export default withStyle(Header, headerStyles)
