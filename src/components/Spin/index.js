/**
 * Author: NERO
 * Date: 2019/6/6 0006
 * Time: 20:33
 *
 */
import React from 'react'
import { Spin } from 'antd'
import './index.less'

const Index = ({text}) => <div className="spin-wrapper">
  <Spin/>
  { text && <p>{text}</p> }
</div>

export default Index