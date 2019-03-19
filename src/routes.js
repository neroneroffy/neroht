/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:11
 *
 */
import React, { Suspense } from 'react'
import App from './containers/index'
import Home from './containers/Home'
import Work from './containers/Work'
import Article from './containers/Article'
import ArticalDetail from './containers/Article/ArticalDetail'
import About from './containers/About'
// @TODO 懒加载开发
/*const About = React.lazy(() => import('./containers/About'))
const AboutLazy = () => <Suspense fallback={<div>加载中，请稍后...</div>}>
    <About/>
</Suspense>*/
export default [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/work',
        component: Work,
        exact: true,
    },
    {
        path: '/article',
        component: Article,
        exact: true,
    },
      {
        path: '/article/detail/:id',
        component: ArticalDetail,
        exact: true,
      },

  {
        path: '/about',
        component: About,
        exact: true,
    },
]
