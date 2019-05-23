## 启动方式
* 启动开发模式：npm run dev
* 打包客户端代码： npm run build:client
* 打包服务端代码： npm run build:server
* 启动服务： npm run start:server
* 打包&&启动服务：npm run server

服务访问 localhost:8081
前端开发服务访问 localhost:9000

可以像上边一样一个一个地输入命令，也可以直接使用 **npm run start**来一次性打包客户端与服务端代码，并启动服务

### apiServer
本地启动了一个localhost:3000的node server，连接MySQL，来提供真实数据，代码暂时不便开放
src/constants/index.js  `API_SERVER`
* run dev时，`API_SERVER`应为`API_PREFIX`， 因为使用了webpack-dev-server的proxy直接将请求代理到node server
* run start时(正式SSR环境)，`API_SERVER`应为`API_HOST + API_PREFIX`， 因为SSR使用了express-http-proxy将请求代理到node server

### 若一个页面有多个网络请求
可以利用Promise.all，待全部请求完成后，服务端再将请求回的数据注入页面
```
Article.loadData = store => {
  const articleList  = store.dispatch(getArticleList({ page: PAGE, size: SIZE }))
  const tagList  = store.dispatch(getTagsList())
  const promises = [articleList, tagList]
  return Promise.all(promises)
}
```

### 详情页含id的请求
涉及到服务端刷新页面要根据id请求数据，服务端可以获取到路由参数：id，传入路由的loadData方法，
组件内根据这个id去请求数据，扩充服务端store
```
  for (const item of matchedRoutes) {
    const { id } =  item.match.params
    if (item.route.loadData) {
      const promise = new Promise((resolve, reject) => {
        if (id) {
          item.route.loadData(store, id).then(resolve).catch(resolve)
        } else {
          item.route.loadData(store).then(resolve).catch(resolve)
        }
      })
      promises.push(promise)
    }
  }
```
### 注入的文章数据内含有script标签，会导致页面错乱
可以在注入页面之前将‘<script’替换，页面显示时再替换回来
```
  // 注入
  const state = JSON.stringify(store.getState()).replace(/<script/g, '%%script%%').replace(/<\/script/g, '%%/script%%')
  const initialState = `
    window.context = {
      INITIAL_STATE: ${state}
    }
  `
  // 显示
  if (html) {
     html = html.replace('/%%script%%/g', '<script').replace('/%%/script%%/g', '</script')
  }
```