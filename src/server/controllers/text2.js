/**
 * Author: NERO
 * Date: 2019/3/17 0017
 * Time: 16:55
 *
 */
const text = '## 前言\n' +
  '这篇文章是我自己在搭建个人网站的过程中，用到了服务端渲染，看了一些教程，踩了一些坑。想把这个过程分享出来。\n' +
  '我会尽力把每个步骤讲明白，将我理解的全部讲出来。\n' +
  '\n' +
  '文中的示例代码来自于这个[仓库](https://github.com/neroneroffy/neroht)，也是我正在搭建的个人网站，大家可以一起交流一下。示例代码因为简化，所以与仓库代码有些许出入。\n' +
  '\n' +
  '\n' +
  '本文中用到的技术\n' +
  '**React V16** | **React-Router v4** | **Redux** | **Redux-thunk** | **express**\n' +
  '\n' +
  '## React 服务端渲染\n' +
  '服务端渲染的基本套路就是用户请求过来的时候，在服务端生成一个我们希望看到的网页内容的HTML字符串，返回给浏览器去展示。\n' +
  '浏览器拿到了这个HTML之后，渲染出页面，但是并没有事件交互，这时候浏览器发现HTML中加载了一些js文件（也就是浏览器端渲染的js），就直接去加载。\n' +
  '加载好并执行完以后，事件就会被绑定上了。这时候页面被浏览器端接管了。也就是到了我们熟悉的js渲染页面的过程。\n' +
  '### 需要实现的目标：\n' +
  '* React组件服务端渲染\n' +
  '* 路由的服务端渲染\n' +
  '* 保证服务端和浏览器的数据唯一\n' +
  '* css的服务端渲染（样式直出）\n' +
  '\n' +
  '### 一般的渲染方式\n' +
  '* 服务端渲染：服务端生成html字符串，发送给浏览器进行渲染。\n' +
  '* 浏览器端渲染：服务端返回空的html文件，内部加载js，完全由js完成页面的渲染\n' +
  '\n' +
  '### 优点与缺点\n' +
  '服务端渲染解决了首屏加载速度慢以及seo不友好的缺点（Google已经可以检索到浏览器渲染的网页，但不是所有搜索引擎都可以）\n' +
  '但增加了项目的复杂程度，提高维护成本。\n' +
  '\n' +
  '如果非必须，尽量不要用服务端渲染\n' +
  '\n' +
  '### 整体思路\n' +
  '需要两个端：服务端、浏览器端（浏览器渲染的部分）\n' +
  '第一： 打包浏览器端代码\n' +
  '第二： 打包服务端代码并启动服务\n' +
  '第三： 用户访问，服务端读取浏览器端打包好的index.html文件为字符串，将渲染好的组件、样式、数据塞入html字符串，返回给浏览器\n' +
  '第四： 浏览器直接渲染接收到的html内容，并且加载打包好的浏览器端js文件，进行事件绑定，初始化状态数据，完成同构\n' +
  '\n' +
  '## React组件的服务端渲染\n' +
  '\n' +
  '让我们来看一个最简单的React服务端渲染的过程。\n' +
  '要进行服务端渲染的话那必然得需要一个根组件，来负责生成HTML结构\n' +
  '```\n' +
  'import React from \'react\';\n' +
  'import ReactDOM from \'react-dom\';\n' +
  '\n' +
  'ReactDOM.hydrate(<Container />, document.getElementById(\'root\'));\n' +
  '```\n' +
  '当然这里用ReactDOM.render也是可以的，只不过hydrate会尽量复用接收到的服务端返回的内容，\n' +
  '来补充事件绑定和浏览器端其他特有的过程\n' +
  '\n' +
  '引入浏览器端需要渲染的根组件，利用react的 **renderToString** API进行渲染\n' +
  '```\n' +
  'import { renderToString } from \'react-dom/server\'\n' +
  'import Container from \'../containers\'\n' +
  '// 产生html\n' +
  'const content = renderToString(<Container/>)\n' +
  'const html = `\n' +
  '    <html>\n' +
  '      <body>${content}</body>\n' +
  '    </html>\n' +
  '`\n' +
  'res.send(html)\n' +
  '```\n' +
  '在这里，renderToString也可以替换成renderToNodeStream，区别在于前者是同步地产生HTML，也就是如果生成HTML用了1000毫秒，\n' +
  '那么就会在1000毫秒之后才将内容返回给浏览器，显然耗时过长。而后者则是以流的形式，将渲染结果塞给response对象，就是出来多少就\n' +
  '返回给浏览器多少，可以相对减少耗时\n' +
  '\n' +
  '## 路由的服务端渲染\n' +
  '一般场景下，我们的应用不可能只有一个页面，肯定会有路由跳转。我们一般这么用：\n' +
  '```\n' +
  'import { BrowserRouter, Route } from \'react-router-dom\'\n' +
  'const App = () => (\n' +
  '    <BrowserRouter>\n' +
  '        {/*...Routes*/}\n' +
  '    <BrowserRouter/>\n' +
  ')\n' +
  '```\n' +
  '但这是浏览器端渲染时候的用法。在做服务端渲染时，需要使用将**BrowserRouter** 替换为 **StaticRouter**\n' +
  '区别在于，BrowserRouter 会通过HTML5 提供的 history API来保持页面与URL的同步，而StaticRouter\n' +
  '则不会改变URL\n' +
  '\n' +
  '```\n' +
  'import { createServer } from \'http\'\n' +
  'import { StaticRouter } from \'react-router-dom\'\n' +
  'createServer((req, res) => {\n' +
  '    const html = renderToString(\n' +
  '        <StaticRouter\n' +
  '            location={req.url}\n' +
  '            context={{}}\n' +
  '        >\n' +
  '            <Container />\n' +
  '        <StaticRouter/>)\n' +
  '\n' +
  '})\n' +
  '```\n' +
  '这里，StaticRouter要接收两个属性:\n' +
  '* location: StaticRouter 会根据这个属性，自动匹配对应的React组件，所以才会实现刷新页面，服务端返回的对应路由的组与浏览器端保持一致\n' +
  '* context: 一般用来传递一些数据，相当于一个载体，之后讲到样式的服务端渲染的时候会用到\n' +
  '\n' +
  '## Redux同构\n' +
  '数据的预获取以及脱水与注水我认为是服务端渲染的难点。\n' +
  '\n' +
  '这是什么意思呢？也就是说首屏渲染的网页一般要去请求外部数据，我们希望在生成HTML之前，去获取到这个页面需要的所有数据，\n' +
  '然后塞到页面中去，这个过程，叫做“脱水”（Dehydrate），生成HTML返回给浏览器。浏览器拿到带着数据的HTML，\n' +
  '去请求浏览器端js，接管页面，用这个数据来初始化组件。这个过程叫“注水”（Hydrate）。完成服务端与浏览器端数据的统一。\n' +
  '\n' +
  '为什么要这么做呢？试想一下，假设没有数据的预获取，直接返回一个没有数据，只有固定内容的HTML结构，会有什么结果呢？\n' +
  '\n' +
  '第一：由于页面内没有有效信息，不利于SEO。\n' +
  '\n' +
  '第二：由于返回的页面没有内容，但浏览器端JS接管页面后回去请求数据、渲染数据，页面会闪一下，用户体验不好。\n' +
  '\n' +
  '我们使用Redux来管理状态，因为有服务端代码和浏览器端代码，那么就分别需要两个store来管理服务端和浏览器端的数据。\n' +
  '\n' +
  '### 组件的配置\n' +
  '组件要在服务端渲染的时候去请求数据，可以在组件上挂载一个专门发异步请求的方法，这里叫做loadData，接收服务端的store作为参数，\n' +
  '然后store.dispatch去扩充服务端的store。\n' +
  '\n' +
  '```\n' +
  'class Home extends React.Component {\n' +
  '    componentDidMount() {\n' +
  '        this.props.callApi()\n' +
  '    }\n' +
  '    render() {\n' +
  '        return <div>{this.props.state.name}</div>\n' +
  '    }\n' +
  '}\n' +
  'Home.loadData = store => {\n' +
  '  return store.dispatch(callApi())\n' +
  '}\n' +
  'const mapState = state => state\n' +
  'const mapDispatch = {callApi}\n' +
  'export default connect(mapState, mapDispatch)(Home)\n' +
  '```\n' +
  '### 路由的改造\n' +
  '因为服务端要根据路由判断当前渲染哪个组件，可以在这个时候发送异步请求。所以路由也需要配置一下来支持loadData方法。服务端渲染的时候，\n' +
  '路由的渲染可以使用react-router-config这个库，用法如下(重点关注在路由上挂载loadData方法):\n' +
  '```\n' +
  'import { BrowserRouter } from \'react-router-dom\'\n' +
  'import { renderRoutes } from \'react-router-config\'\n' +
  'import Home from \'./Home\'\n' +
  'export const routes = [\n' +
  '  {\n' +
  '    path: \'/\',\n' +
  '    component: Home,\n' +
  '    loadData: Home.loadData,\n' +
  '    exact: true,\n' +
  '  }\n' +
  ']\n' +
  'const Routers = <BrowserRouter>\n' +
  '    {renderRoutes(routes)}\n' +
  '<BrowserRouter/>\n' +
  '```\n' +
  '### 服务端获取数据\n' +
  '到了服务端，需要判断匹配的路由内的所有组件各自都有没有loadData方法，有就去调用，\n' +
  '传入服务端的store，去扩充服务端的store。*同时还要注意到，一个页面可能是由多个组件组成的，*会发各自的请求，也就意味着我们要等所有的请求都发完，再去返回HTML。\n' +
  '```\n' +
  'import express from \'express\'\n' +
  'import serverRender from \'./render\'\n' +
  'import { matchRoutes } from \'react-router-config\'\n' +
  'import { routes } from \'../routes\'\n' +
  'import serverStore from "../store/serverStore"\n' +
  '\n' +
  'const app = express()\n' +
  'app.get(\'*\', (req, res) => {\n' +
  '  const context = {css: []}\n' +
  '  const store = serverStore()\n' +
  '  // 用matchRoutes方法获取匹配到的路由对应的组件数组\n' +
  '  const matchedRoutes = matchRoutes(routes, req.path)\n' +
  '  const promises = []\n' +
  '  for (const item of matchedRoutes) {\n' +
  '    if (item.route.loadData) {\n' +
  '      const promise = new Promise((resolve, reject) => {\n' +
  '        item.route.loadData(store).then(resolve).catch(resolve)\n' +
  '      })\n' +
  '      promises.push(promise)\n' +
  '    }\n' +
  '  }\n' +
  '  // 所有请求响应完毕，将被HTML内容发送给浏览器\n' +
  '  Promise.all(promises).then(() => {\n' +
  '    // 将生成html内容的逻辑封装成了一个函数，接收req, store, context\n' +
  '    res.send(serverRender(req, store, context))\n' +
  '  })\n' +
  '})\n' +
  '```\n' +
  '\n' +
  '细心的同学可能注意到了上边我把每个loadData都包了一个promise。\n' +
  '\n' +
  '```\n' +
  'const promise = new Promise((resolve, reject) => {\n' +
  '  item.route.loadData(store).then(resolve).catch(resolve)\n' +
  '  console.log(item.route.loadData(store));\n' +
  '})\n' +
  'promises.push(promise)\n' +
  '\n' +
  '```\n' +
  '这是为了容错，一旦有一个请求出错，那么下边Promise.all方法则不会执行，所以包一层promise的目的是即使请求出错，也会resolve，不会影响到Promise.all方法，\n' +
  '也就是说只有请求出错的组件会没数据，而其他组件不会受影响。\n' +
  '\n' +
  '### 注入数据\n' +
  '\n' +
  '我们请求已经发出去了，并且在组件的loadData方法中也扩充了服务端的store，那么可以从服务端的数据取出来注入到要返回给浏览器的HTML中了。\n' +
  '来看 serverRender 方法\n' +
  '\n' +
  '```\n' +
  'const serverRender = (req, store, context) => {\n' +
  '  // 读取客户端生成的HTML\n' +
  '  const template = fs.readFileSync(process.cwd() + \'/public/static/index.html\', \'utf8\')\n' +
  '  const content = renderToString(\n' +
  '    <Provider store={store}>\n' +
  '      <StaticRouter location={req.path} context={context}>\n' +
  '        <Container/>\n' +
  '      </StaticRouter>\n' +
  '    </Provider>\n' +
  '  )\n' +
  '  // 注入数据\n' +
  '  const initialState = `<script>\n' +
  '    window.context = {\n' +
  '      INITIAL_STATE: ${JSON.stringify(store.getState())}\n' +
  '    }\n' +
  '</script>`\n' +
  '  return template.replace(\'<!--app-->\', content)\n' +
  '    .replace(\'<!--initial-state-->\', initialState)\n' +
  '}\n' +
  '```\n' +
  '\n' +
  '### 浏览器端用服务端获取到的数据初始化store\n' +
  '经过上边的过程，我们已经可以从window.context中拿到服务端预获取的数据了，此时需要做的事就是用这份数据去初始化浏览器端的store。保证两端数据的统一。\n' +
  '\n' +
  '```\n' +
  'import { createStore, applyMiddleware, compose } from \'redux\'\n' +
  'import thunk from \'redux-thunk\'\n' +
  'import rootReducer from \'../reducers\'\n' +
  '\n' +
  'const defaultStore = window.context && window.context.INITIAL_STATE\n' +
  'const clientStore = createStore(\n' +
  '  rootReducer,\n' +
  '  defaultStore,// 利用服务端的数据初始化浏览器端的store\n' +
  '  compose(\n' +
  '    applyMiddleware(thunk),\n' +
  '    window.devToolsExtension ? window.devToolsExtension() : f=>f\n' +
  '  )\n' +
  ')\n' +
  '```\n' +
  '至此，服务端渲染的数据统一问题就解决了，再来回顾一下整个流程：\n' +
  '\n' +
  '* 用户访问路由，服务端根据路由匹配出对应路由内的组件数组\n' +
  '* 循环数组，调用组件上挂载的loadData方法，发送请求，扩充服务端store\n' +
  '* 所有请求完成后，通过store.getState，获取到服务端预获取的数据，注入到window.context中\n' +
  '* 浏览器渲染返回的HTML，加载浏览器端js，从window.context中取数据来初始化浏览器端的store，渲染组件\n' +
  '\n' +
  '这里还有个点，也就是当我们从路由进入到其他页面的时候，组件内的loadData方法并不会执行，它只会在刷新，服务端渲染路由的时候执行。\n' +
  '这时候会没有数据。所以我们还需要在componentDidMount中去发请求，来解决这个问题。因为componentDidMount不会在服务端渲染执行，\n' +
  '所以不用担心请求重复发送。\n' +
  '\n' +
  '## 样式的服务端渲染\n' +
  '\n' +
  '以上我们所做的事情只是让网页的内容经过了服务端的渲染，但是样式要在浏览器加载css后才会加上，所以最开始返回的网页内容没有样式，页面依然会闪一下。为了解决这个问题，我们需要让样式也一并在服务端渲染的时候返回。\n' +
  '\n' +
  '首先，服务端渲染的时候，解析css文件，不能使用style-loader了，要使用isomorphic-style-loader。\n' +
  '\n' +
  '```\n' +
  '{\n' +
  '    test: /\\.css$/,\n' +
  '    use: [\n' +
  '        \'isomorphic-style-loader\',\n' +
  '        \'css-loader\',\n' +
  '        \'postcss-loader\'\n' +
  '    ],\n' +
  '}\n' +
  '\n' +
  '```\n' +
  '但是，如何在服务端获取到当前路由内的组件样式呢？回想一下，我们在做路由的服务端渲染时，用到了StaticRouter，它会接收一个context对象，这个context对象可以作为一个载体来传递一些信息。我们就用它！\n' +
  '\n' +
  '思路就是在渲染组件的时候，在组件内接收context对象，获取组件样式，放到context中，服务端拿到样式，插入到返回的HTML中的style标签。\n' +
  '\n' +
  '来看看组件是如何读取样式的吧:\n' +
  '\n' +
  '```\n' +
  'import style from \'./style/index.css\'\n' +
  'class Index extends React.Component {\n' +
  '    componentWillMount() {\n' +
  '      if (this.props.staticContext) {\n' +
  '        const css = style._getCss()\n' +
  '        this.props.staticContext.css.push(css)\n' +
  '      }\n' +
  '    }\n' +
  '}\n' +
  '```\n' +
  '在路由内的组件可以在props里接收到staticContext，也就是通过StaticRouter传递过来的context，\n' +
  'isomorphic-style-loader 提供了一个 **_getCss()** 方法，让我们能读取到css样式，然后放到staticContext里。\n' +
  '`不在路由之内的组件，可以通过父级组件，传递props的方法，或者用react-router的withRouter包裹一下`\n' +
  '\n' +
  '其实这部分提取css的逻辑可以写成高阶组件，这样就可以做到复用了\n' +
  '\n' +
  '```\n' +
  'import React, { Component } from \'react\'\n' +
  '\n' +
  'export default (DecoratedComponent, styles) => {\n' +
  '  return class NewComponent extends Component {\n' +
  '    componentWillMount() {\n' +
  '      if (this.props.staticContext) {\n' +
  '        const css = styles._getCss()\n' +
  '        this.props.staticContext.css.push(css)\n' +
  '      }\n' +
  '    }\n' +
  '    render() {\n' +
  '      return <DecoratedComponent {...this.props}/>\n' +
  '    }\n' +
  '  }\n' +
  '}\n' +
  '```\n' +
  '\n' +
  '\n' +
  '在服务端，经过组件的渲染之后，context中已经有内容了，我们这时候把样式处理一下，返回给浏览器，就可以做到样式的服务端渲染了\n' +
  '```\n' +
  'const serverRender = (req, store) => {\n' +
  '  const context = {css: []}\n' +
  '  const template = fs.readFileSync(process.cwd() + \'/public/static/index.html\', \'utf8\')\n' +
  '  const content = renderToString(\n' +
  '    <Provider store={store}>\n' +
  '      <StaticRouter location={req.path} context={context}>\n' +
  '        <Container/>\n' +
  '      </StaticRouter>\n' +
  '    </Provider>\n' +
  '  )\n' +
  '  // 经过渲染之后，context.css内已经有了样式\n' +
  '  const cssStr = context.css.length ? context.css.join(\'\\n\') : \'\'\n' +
  '  const initialState = `<script>\n' +
  '    window.context = {\n' +
  '      INITIAL_STATE: ${JSON.stringify(store.getState())}\n' +
  '    }\n' +
  '</script>`\n' +
  '  return template.replace(\'<!--app-->\', content)\n' +
  '    .replace(\'server-render-css\', cssStr)\n' +
  '    .replace(\'<!--initial-state-->\', initialState)\n' +
  '}\n' +
  '```\n' +
  '\n' +
  '至此，服务端渲染就全部完成了。\n' +
  '\n' +
  '## 总结\n' +
  '\n' +
  'React的服务端渲染，最好的解决方案就是Next.js。如果你的应用没有SEO优化的需求，又或者不太注重首屏渲染的速度，那么尽量就不要用服务端渲染。\n' +
  '因为会让项目变得复杂。此外，除了服务端渲染，SEO优化的办法还有很多，比如预渲染（pre-render）。\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n' +
  '\n'

export default text