/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:28
 *
 */
import React from 'react'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Container from '../containers'

const serverRender = (req, context) => {
    const template = fs.readFileSync(process.cwd() + '/public/static/index.html', 'utf8')
    const content = renderToString(
        <StaticRouter location={req.path} context={context}>
            <Container/>
        </StaticRouter>
    )
    const cssStr = context.css.length ? context.css.join('\n') : ''
    return template.replace('<!--app-->', content).replace('/*server-render-css*/', cssStr)
}

export default serverRender