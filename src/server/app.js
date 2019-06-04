/**
 * Author: Zhou Haitao
 * Date: 2018/11/26 0026
 * Time: 23:43
 *
 */

import express from 'express'
const compression = require('compression')
import serverRender from './render'
import { matchRoutes } from 'react-router-config'
import routes from '../routes'
import serverStore from "../store/serverStore"
import proxy from 'express-http-proxy'

const isDev = process.env.NODE_ENV === 'development'
const app = express()

app.use(express.static('public'))
if (!isDev) {
  app.use(compression())
}

app.use('/api', proxy('http://127.0.0.1:3000', {
  proxyReqPathResolver: function (req) {
    // console.log('代理：', req.url);
    return '/api' + req.url
  }
}));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

app.get('*', (req, res) => {
  const context = {css: []}
  const store = serverStore()
  const matchedRoutes = matchRoutes(routes, req.path)
  const promises = []
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
    if (item.route.component.loadData) {
      const { loadData } = item.route.component
      const promise = new Promise((resolve, reject) => {
        if (id) {
          loadData(store, id).then(resolve).catch(resolve)
        } else {
          loadData(store).then(resolve).catch(resolve)
        }
      })
      promises.push(promise)
    }

  }
  Promise.all(promises).then(() => {
    res.send(serverRender(req, store, context))
  })
})
app.listen(8081, () => {
    console.log('server listening on port 8081')
})
