/**
 * Author: NERO
 * Date: 2019/6/6 0006
 * Time: 21:08
 *
 */
import React from 'react'
import { Spin, Icon } from 'antd'
import './index.less'

class ScrollLoadPage extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.scroll)
  }
  scroll = () => {
    if (document) {
      const { hasMore, loading } = this.props
      const totalHeight = document.body.scrollHeight;
      let scrolledHeight = document.body.scrollTop;
      if (totalHeight > 0 && scrolledHeight === 0) {
        scrolledHeight = document.documentElement.scrollTop;
      }
      const screenHeight = document.body.clientHeight;
      if (scrolledHeight + screenHeight === totalHeight && screenHeight !== 0 && hasMore && !loading) {
        this.props.loadMore()
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll)
  }
  render() {
    const { children, loading, hasMore } = this.props
    return <div>
      {children}
      <div className="pagination-bottom">
        {
          hasMore ?
            <>
            { loading && <Spin/> }
            </>
            :
            <><Icon type="smile" rotate={180} style={{ marginRight: 8 }}/>我是有底线的</>
        }

      </div>
    </div>
  }
}
export default ScrollLoadPage