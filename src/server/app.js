/**
 * Author: Zhou Haitao
 * Date: 2018/11/26 0026
 * Time: 23:43
 *
 */

import express from 'express'
import serverRender from './render'
import { matchRoutes } from "react-router-config"
import routes from '../routes'
const app = express()

app.use(express.static('public'))
app.get('*', (req, res) => {
    // const matchedRoutes = matchRoutes(routes, req.path)
    const context = {
        css: []
    }
    const html = serverRender(req, context)
    res.send(html)
})

app.listen(8081, () => {
    console.log('server listening on port 8081')
})