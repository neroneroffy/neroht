/**
 * Author: Zhou Ht
 * Date: 2018/11/28 0028
 * Time: 23:32
 *
 */
import React from 'react'
import ReactDom from 'react-dom'
import Container from '../containers'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import clientStore from '../store/clientStore'
import '../interceptors'

const root = document.getElementById('root')
if (module.hot) {
    module.hot.accept(() => {
        const NextApp = require('../containers/index.js').default
        ReactDom.render(
            <AppContainer>
              <Provider store={clientStore}>
                <BrowserRouter>
                  <NextApp/>
                </BrowserRouter>
              </Provider>
            </AppContainer>, root)
    })
}
ReactDom.hydrate(
    <AppContainer>
      <Provider store={clientStore}>
        <BrowserRouter>
            <Container/>
        </BrowserRouter>
      </Provider>
    </AppContainer>, root)

