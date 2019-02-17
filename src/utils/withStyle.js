import React, { Component } from 'react'

export default (DecoratedComponent, styles) => {
    return class NewComponent extends Component {
        componentWillMount() {
            if (this.props.staticContext) {
                const css = styles._getCss().replace('static/img', './img')
                this.props.staticContext.css.push(css)

            }

        }

        render() {
            return <DecoratedComponent {...this.props}/>
        }
    }
}
