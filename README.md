## React 服务端渲染
服务端渲染的基本套路就是用户请求过来的时候，在服务端生成一个我们希望看到的网页内容的HTML字符串，返回给浏览器去展示。
浏览器拿到了这个HTML之后，但是这时候并没有事件交互，发现其中加载了一些js文件（也就是客户端渲染的js），那就直接去加载。
加载好并执行完以后，事件就会被绑定上了。这时候页面被客户端接管了。也就是到了我们熟悉的js渲染页面的过程。
### 需要实现的目标：
* React组件服务端渲染
* 路由的服务端渲染
* 服务端数据的预获取
* css的服务端渲染（样式直出）

### 一般的渲染方式
* 服务端渲染：服务端生成html字符串，发送给浏览器进行渲染。
* 客户端渲染：服务端返回空的html文件，内部加载js完全由js与css，由js完成页面的渲染

### 优点与缺点
服务端渲染解决了首屏加载速度慢以及seo不友好的痛点，其次可以提高网页性能
（Google已经可以检索到浏览器渲染的网页，但不是所有搜索引擎都可以）
但增加了项目的复杂成都，提高维护成本。

如果非必须，尽量不要用服务端渲染

### 整体思路
需要两个端：服务端、客户端（浏览器渲染的部分）
第一： 打包客户端代码
第二： 打包服务端代码并启动服务
第三： 用户访问，服务端读取客户端打包好的index.html文件为字符串，将渲染好的组件、样式、数据塞入html字符串，返回给浏览器
第四： 浏览器直接渲染接收到的html内容，并且加载打包好的客户端js文件，进行事件绑定，初始化状态数据，完成同构

### React组件的服务端渲染

让我们来看一个最简单的React服务端渲染的过程。
要进行服务端渲染的话那必然得需要一个根组件，来负责生成HTML结构
```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.hydrate(<Container />, document.getElementById('root'));
```
`当然这里用ReactDOM.render也是可以的，只不过hydrate会尽量复用接收到的服务端返回的内容，
来补充事件绑定和客户端其他特有的过程`

引入客户端需要渲染的根组件，利用react的 **renderToString** API进行渲染
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

### 路由的服务端渲染
一般场景下，我们的应用不可能只有一个页面，肯定会有路由跳转。我们一般这么用：
```
import { BrowserRouter, Route } from 'react-router-dom'
const App = () => (
    <BrowserRouter>
        {/*...Routes*/}
    <BrowserRouter/>
)
```
但这是客户端渲染时候的用法。在做服务端渲染时，需要使用将**BrowserRouter** 替换为 **StaticRouter**
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
* location: StaticRouter 会根据这个属性，自动匹配对应的React组件，所以才会实现刷新页面，服务端返回的对应路由的组与客户端保持一致
* context: 一般用来传递一些数据，相当于一个载体，之后讲到样式的服务端渲染的时候会用到

### 服务端数据的预获取
数据的预获取以及脱水与注水我认为是服务端渲染的难点。我们先来看一下数据的预获取。

这是什么意思呢？也就是说服务端在生成HTML还不够，我们希望在生成之前，去获取到这个页面需要的所有数据，塞到页面中去，再生成HTML，然后返回。

为什么要这么做呢？试想一下，假设没有数据的预获取，直接返回一个没有数据，只有固定内容的HTML结构，会有什么结果呢？

第一：由于页面内没有有效信息，不利于SEO。

第二：由于返回的页面没有内容，但客户端JS接管页面后回去请求数据，页面会闪一下，用户体验不好，没有做到页面直出。

那么如何实现呢？我们来想一下整个过程，用户访问，服务端根据访问路径匹配对应的路由组件，并渲染出来，返回给浏览器。整个过程我们想一下，可以在什么时机去获取数据呢？
在客户端js渲染的时候，我们一般在componentDidMount之内发请求。但服务端这个生命周期并不会执行。但componentWillMount会执行，但这不利于










