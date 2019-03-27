* 启动开发模式：npm run dev
* 打包客户端代码： npm run build:client
* 打包服务端代码： npm run build:server
* 启动服务： npm run start:server

可以像上边一样一个一个地输入命令，也可以直接使用 **npm run start**来一次性打包客户端与服务端代码，并启动服务


## 前言
这篇文章是我自己在搭建个人网站的过程中，用到了服务端渲染，看了一些教程，踩了一些坑。想把这个过程分享出来。
我会尽力把每个步骤讲明白，串联起每个知识点。同时也希望大家多敲代码多练习。

文中的示例代码来自于这个[仓库](https://github.com/neroneroffy/neroht)，也是我正在搭建的个人网站，大家可以一起交流一下。

本文中用到的技术
**React V16** | **React-Router v4** | **Redux** | **Redux-thunk** | **express**

## React 服务端渲染
服务端渲染的基本套路就是用户请求过来的时候，在服务端生成一个我们希望看到的网页内容的HTML字符串，返回给浏览器去展示。
浏览器拿到了这个HTML之后，渲染出页面，但是并没有事件交互，这时候浏览器发现HTML中加载了一些js文件（也就是浏览器端渲染的js），就直接去加载。
加载好并执行完以后，事件就会被绑定上了。这时候页面被浏览器端接管了。也就是到了我们熟悉的js渲染页面的过程。
### 需要实现的目标：
* React组件服务端渲染
* 路由的服务端渲染
* 保证服务端和浏览器的数据唯一
* css的服务端渲染（样式直出）

### 一般的渲染方式
* 服务端渲染：服务端生成html字符串，发送给浏览器进行渲染。
* 浏览器端渲染：服务端返回空的html文件，内部加载js完全由js与css，由js完成页面的渲染

### 优点与缺点
服务端渲染解决了首屏加载速度慢以及seo不友好的缺点（Google已经可以检索到浏览器渲染的网页，但不是所有搜索引擎都可以）
但增加了项目的复杂程度，提高维护成本。

如果非必须，尽量不要用服务端渲染

### 整体思路
需要两个端：服务端、浏览器端（浏览器渲染的部分）
第一： 打包浏览器端代码
第二： 打包服务端代码并启动服务
第三： 用户访问，服务端读取浏览器端打包好的index.html文件为字符串，将渲染好的组件、样式、数据塞入html字符串，返回给浏览器
第四： 浏览器直接渲染接收到的html内容，并且加载打包好的浏览器端js文件，进行事件绑定，初始化状态数据，完成同构

## React组件的服务端渲染

让我们来看一个最简单的React服务端渲染的过程。
要进行服务端渲染的话那必然得需要一个根组件，来负责生成HTML结构
```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.hydrate(<Container />, document.getElementById('root'));
```
`当然这里用ReactDOM.render也是可以的，只不过hydrate会尽量复用接收到的服务端返回的内容，
来补充事件绑定和浏览器端其他特有的过程`

引入浏览器端需要渲染的根组件，利用react的 **renderToString** API进行渲染
```
import { renderToString } from 'react-dom/server'
import Container from '../containers'
// 产生html
const content = renderToString(<Container/>)
const html = `
    <html>
      <body>${content}</body>
    </html>
`
res.send(html)
```
`在这里，renderToString也可以替换成renderToNodeStream，区别在于前者是同步地产生HTML，也就是如果生成HTML用了1000毫秒，
那么就会在1000毫秒之后才将内容返回给浏览器，显然耗时过长。而后者则是以流的形式，将渲染结果塞给response对象，就是出来多少就
返回给浏览器多少，可以相对减少耗时`

## 路由的服务端渲染
一般场景下，我们的应用不可能只有一个页面，肯定会有路由跳转。我们一般这么用：
```
import { BrowserRouter, Route } from 'react-router-dom'
const App = () => (
    <BrowserRouter>
        {/*...Routes*/}
    <BrowserRouter/>
)
```
但这是浏览器端渲染时候的用法。在做服务端渲染时，需要使用将**BrowserRouter** 替换为 **StaticRouter**
`区别在于，BrowserRouter 会通过HTML5 提供的 history API来保持页面与URL的同步，而StaticRouter
则不会改变URL`

```
import { createServer } from 'http'
import { StaticRouter } from 'react-router-dom'
createServer((req, res) => {
    const html = renderToString(
        <StaticRouter
            location={req.url}
            context={{}}
        >
            <Container />
        <StaticRouter/>)

})
```
这里，StaticRouter要接收两个属性:
* location: StaticRouter 会根据这个属性，自动匹配对应的React组件，所以才会实现刷新页面，服务端返回的对应路由的组与浏览器端保持一致
* context: 一般用来传递一些数据，相当于一个载体，之后讲到样式的服务端渲染的时候会用到

## Redux同构
数据的预获取以及脱水与注水我认为是服务端渲染的难点。

这是什么意思呢？也就是说首屏渲染的网页一般要去请求外部数据，我们希望在生成HTML之前，去获取到这个页面需要的所有数据，
然后塞到页面中去，这个过程，叫做“脱水”（Dehydrate），生成HTML返回给浏览器。浏览器拿到带着数据的HTML，
去请求浏览器端js，接管页面，用这个数据来初始化组件。这个过程叫“注水”（Hydrate）。完成服务端与浏览器端数据的统一。

为什么要这么做呢？试想一下，假设没有数据的预获取，直接返回一个没有数据，只有固定内容的HTML结构，会有什么结果呢？

第一：由于页面内没有有效信息，不利于SEO。

第二：由于返回的页面没有内容，但浏览器端JS接管页面后回去请求数据、渲染数据，页面会闪一下，用户体验不好。

我们使用Redux来管理状态，因为有服务端代码和浏览器端代码，那么就分别需要两个store来管理服务端和浏览器端的数据。

### 组件的配置
组件要在服务端渲染的时候去请求数据，可以在组件上挂载一个专门发异步请求的方法，这里叫做loadData，接收服务端的store作为参数，
然后store.dispatch去扩充服务端的store。

```
class Home extends React.Component {
    componentDidMount() {
        this.props.callApi()
    }
    render() {
        return <div>{this.props.state.name}</div>
    }
}
Home.loadData = store => {
  return store.dispatch(callApi())
}
const mapState = state => state
const mapDispatch = {callApi}
export default connect(mapState, mapDispatch)(Home)
```
### 路由的改造
因为服务端要根据路由判断当前渲染哪个组件，可以在这个时候发送异步请求。所以路由也需要配置一下来支持loadData方法。服务端渲染的时候，
路由的渲染可以使用react-router-config这个库，用法如下(重点关注在路由上挂载loadData方法):
```
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import Home from './Home'
export const routes = [
  {
    path: '/',
    component: Home,
    loadData: Home.loadData,
    exact: true,
  }
]
const Routers = <BrowserRouter>
    {renderRoutes(routes)}
<BrowserRouter/>
```
### 服务端获取数据
到了服务端，需要判断匹配的路由内的所有组件各自都有没有loadData方法，有就去调用，
传入服务端的store，去扩充服务端的store。*同时还要注意到，一个页面可能是由多个组件组成的，*会发各自的请求，也就意味着我们要等所有的请求都发完，再去返回HTML。
```
import express from 'express'
import serverRender from './render'
import { matchRoutes } from 'react-router-config'
import { routes } from '../routes'
import serverStore from "../store/serverStore"

const app = express()
app.get('*', (req, res) => {
  const context = {css: []}
  const store = serverStore()
  // 用matchRoutes方法获取匹配到的路由对应的组件数组
  const matchedRoutes = matchRoutes(routes, req.path)
  const promises = []
  for (const item of matchedRoutes) {
    if (item.route.loadData) {
      const promise = new Promise((resolve, reject) => {
        item.route.loadData(store).then(resolve).catch(resolve)
      })
      promises.push(promise)
    }
  }
  // 所有请求响应完毕，将被HTML内容发送给浏览器
  Promise.all(promises).then(() => {
    // 将生成html内容的逻辑封装成了一个函数，接收req, store, context
    res.send(serverRender(req, store, context))
  })
})
```

细心的同学可能注意到了上边我把每个loadData都包了一个promise。

```
const promise = new Promise((resolve, reject) => {
  item.route.loadData(store).then(resolve).catch(resolve)
  console.log(item.route.loadData(store));
})
promises.push(promise)

```
这是为了容错，一旦有一个请求出错，那么下边Promise.all方法则不会执行，所以包一层promise的目的是即使请求出错，也会resolve，不会影响到Promise.all方法，
也就是说只有请求出错的组件会没数据，而其他组件不会受影响。

### 注入数据

我们请求已经发出去了，并且在组件的loadData方法中也扩充了服务端的store，那么可以从服务端的数据取出来注入到要返回给浏览器的HTML中了。
来看 serverRender 方法

```
const serverRender = (req, store, context) => {
  // 读取客户端生成的HTML
  const template = fs.readFileSync(process.cwd() + '/public/static/index.html', 'utf8')
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <Container/>
      </StaticRouter>
    </Provider>
  )
  // 注入数据
  const initialState = `<script>
    window.context = {
      INITIAL_STATE: ${JSON.stringify(store.getState())}
    }
</script>`
  return template.replace('<!--app-->', content)
    .replace('<!--initial-state-->', initialState)
}
```

### 浏览器端用服务端获取到的数据初始化store
经过上边的过程，我们已经可以从window.context中拿到服务端预获取的数据了，此时需要做的事就是用这份数据去初始化浏览器端的store。保证两端数据的统一。

```
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const defaultStore = window.context && window.context.INITIAL_STATE
const clientStore = createStore(
  rootReducer,
  defaultStore,// 利用服务端的数据初始化浏览器端的store
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f=>f
  )
)
```
至此，服务端渲染的数据统一问题就解决了，再来回顾一下整个流程：

* 用户访问路由，服务端根据路由匹配出对应路由内的组件数组
* 循环数组，调用组件上挂载的loadData方法，发送请求，扩充服务端store
* 所有请求完成后，通过store.getState，获取到服务端预获取的数据，注入到window.context中
* 浏览器渲染返回的HTML，加载浏览器端js，从window.context中取数据来初始化浏览器端的store，渲染组件

这里还有个点，也就是当我们从路由进入到其他页面的时候，组件内的loadData方法并不会执行，它只会在刷新，服务端渲染路由的时候执行。
这时候会没有数据。所以我们还需要在componentDidMount中去发请求，来解决这个问题。因为componentDidMount不会在服务端渲染执行，
所以不用担心请求重复发送。

## 样式的服务端渲染

以上我们所做的事情只是让网页的内容经过了服务端的渲染，但是样式要在浏览器加载css后才会加上，u偶遇最开始返回的网页内容没有样式，页面依然会闪一下。
为了解决这个问题，我们需要让样式也一并在服务端渲染的时候返回。

首先，服务端渲染的时候，解析css文件，不能使用style-loader了，要使用isomorphic-style-loader。

```
{
    test: /\.css$/,
    use: [
        'isomorphic-style-loader',
        'css-loader',
        'postcss-loader'
    ],
}

```
我们想，如何在服务端获取到当前路由内的组件样式呢？回想一下，我们在做路由的服务端渲染时，用到了StaticRouter，它会接收一个context对象，
这个context对象可以作为一个载体来传递一些信息。我们就用它！

思路就是在渲染组件的时候，在组件内接收context对象，获取组件样式，放到context中，服务端拿到样式，插入到返回的HTML中的style标签。

来看看组件是如何读取样式的吧:

```
import style from './style/index.css'
class Index extends React.Component {
    componentWillMount() {
      if (this.props.staticContext) {
        const css = styles._getCss()
        this.props.staticContext.css.push(css)
      }
    }
}
```
在路由内的组件可以在props里接收到staticContext，也就是通过StaticRouter传递过来的context，
isomorphic-style-loader 提供了一个 **_getCss()** 方法，让我们能读取到css样式，然后放到staticContext里。
`不在路由之内的组件，可以通过父级组件，传递props的方法，或者用react-router的withRouter包裹一下`

在服务端，经过组件的渲染之后，context中已经有内容了，我们这时候把样式处理一下，返回给浏览器，就可以做到样式的服务端渲染了
```
const serverRender = (req, store) => {
  const context = {css: []}
  const template = fs.readFileSync(process.cwd() + '/public/static/index.html', 'utf8')
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <Container/>
      </StaticRouter>
    </Provider>
  )
  // 经过渲染之后，context.css内已经有了样式
  const cssStr = context.css.length ? context.css.join('\n') : ''
  const initialState = `<script>
    window.context = {
      INITIAL_STATE: ${JSON.stringify(store.getState())}
    }
</script>`
  return template.replace('<!--app-->', content)
    .replace('server-render-css', cssStr)
    .replace('<!--initial-state-->', initialState)
}
```

至此，服务端渲染就全部完成了。

## 总结

React的服务端渲染，最好的解决方案就是Next.js。如果你的应用没有SEO优化的需求，又或者不太注重首屏渲染的速度，那么尽量就不要用服务端渲染。
因为会让项目变得复杂。此外，除了服务端渲染，SEO优化的办法还有很多，比如预渲染（pre-render）。
