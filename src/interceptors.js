/**
 * Author: NERO
 * Date: 2019/4/28 0028
 * Time: 23:09
 *
 */
import axios from 'axios';
import clientStore from './store/clientStore'
import { message } from 'antd'
axios.interceptors.request.use((config)=>{
  const xAuthToken = localStorage.getItem('X-Auth-Token')
  if (xAuthToken) {
    config.headers['Authorization'] =`Bearer ${xAuthToken}`
  }
  clientStore.dispatch({
    type: "LOADING_BEGIN"
  })
  return config
});
axios.interceptors.response.use((config)=>{
  clientStore.dispatch({
    type: "LOADING_END"
  })
  return config
}, () => {
  message.error('请求失败');
  clientStore.dispatch({
    type: "LOADING_END"
  })
});
