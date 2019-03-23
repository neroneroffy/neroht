/**
 * Author: Zhou Haitao
 * Date: 2018/11/26 0026
 * Time: 23:43
 *
 */

import express from 'express'
import serverRender from './render'
import { matchRoutes } from 'react-router-config'
import routes from '../routes'
import serverStore from "../store/serverStore";
const app = express()

app.use(express.static('public'))
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
})
app.get('/api/article/list', (req, res) => {
  const list = {
    result: true,
    data: [
      {
        email: '1053209711@qq.com',
        id: 1
      }
    ]
  }
  res.end(JSON.stringify(list))
})
app.get('*', (req, res) => {
  const context = {css: []}
  const store = serverStore()
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
  Promise.all(promises).then(() => {
    res.send(serverRender(req, store, context))
  })
})
app.listen(8081, () => {
    console.log('server listening on port 8081')
})
