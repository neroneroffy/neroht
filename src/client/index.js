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
const root = document.getElementById('root')
if (module.hot) {
    module.hot.accept(() => {
        const NextApp = require('../containers/index.js').default
        ReactDom.render(
            <AppContainer>
                <BrowserRouter>
                    <NextApp/>
                </BrowserRouter>
            </AppContainer>, root)
    })
}
ReactDom.hydrate(
    <AppContainer>
        <BrowserRouter>
            <Container/>
        </BrowserRouter>
    </AppContainer>, root)

