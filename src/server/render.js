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
import { Provider } from 'react-redux'
import Container from '../containers'

const serverRender = (req, store, context) => {
  const template = fs.readFileSync(process.cwd() + '/public/static/index.html', 'utf8')
  const vendorCss = fs.readFileSync(process.cwd() + '/public/static/css/vendors.css', 'utf8')
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <Container/>
      </StaticRouter>
    </Provider>
  )
  const cssStr = context.css.length ? context.css.join('\n') : ''
  const state = JSON.stringify(store.getState()).replace(/<script/g, '%%script%%').replace(/<\/script/g, '%%/script%%')
  const initialState = `
    window.context = {
      INITIAL_STATE: ${state}
    }
`
  return template.replace('<!--app-->', content)
    .replace('server-render-css', cssStr + vendorCss)
    .replace('/*initial-state*/', initialState)
}

export default serverRender
