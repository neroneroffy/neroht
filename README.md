## React 服务端渲染

需要实现的目标：
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
引入客户端需要渲染的根组件，利用react的 **renderToString** API进行渲染
```
import { renderToString } from 'react-dom/server'
import Container from '../containers'
const content = renderToString(<Container/>)
const html = `
    <html>
      <body>${content}</body>
    </html>
`
res.send(html)
```