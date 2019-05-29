/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:11
 *
 */
import { multiLoadData } from './utils'
import React, { Suspense } from 'react'
import Home from './containers/Home'
import Work from './containers/Work'
import Article from './containers/Article'
import ArticalDetail from './containers/Article/ArticalDetail'
import About from './containers/About'
import Container from './containers/index'
import Message from './components/Message'

// @TODO 懒加载开发
/*const About = React.lazy(() => import('./containers/About'))
const AboutLazy = () => <Suspense fallback={<div>加载中，请稍后...</div>}>
    <About/>
</Suspense>*/

export default [
  {
    path: '/',
    component: Home,
    // loadData: Home.loadData,
    exact: true,
  },
  {
    path: '/article',
    component: Article,
    loadData: Article.loadData,
    exact: true,
  },
  {
    path: '/article/article-detail/:id',
    component: ArticalDetail,
    loadData: store => multiLoadData(store)(ArticalDetail, Message)
  },
  {
    path: '/work',
    component: Work,
  },
  {
    path: '/about',
    component: About,
  },
]
