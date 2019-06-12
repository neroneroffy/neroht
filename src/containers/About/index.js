/**
 * Author: Zhou Ht
 * Date: 2018/12/6 0006
 * Time: 23:20
 *
 */
import React from 'react'
import showdown from 'showdown'
import './style/index.less'
import { getAbout } from '../../actions/about'
import withStyle from '../../utils/withStyle'
import { connect } from 'react-redux'
import styles from './style/index.less'
import './style/index.less'

const converter = new showdown.Converter();

class AboutComponent extends React.Component {
    componentDidMount() {
        this.props.getAbout()
    }
    render() {
      const { info } = this.props
      let html = converter.makeHtml(info)
      return <div className="about">
          <div className="inner">
            <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
          </div>
      </div>
    }
}
const mapStateToProps = state => {
  return {
     info: state.about.information
  }
}

const About = connect(mapStateToProps, {
  getAbout,
})(withStyle(AboutComponent, styles))
About.loadData = store => {
  return store.dispatch(getAbout())
}
export default About
