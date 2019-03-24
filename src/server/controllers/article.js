/**
 * Author: NERO
 * Date: 2019/3/24 0024
 * Time: 18:23
 *
 */
import SuccessModel from '../models/index'
import text from './markdown'
export const articleList = (req, res) => {
  const list = {
    result: true,
    data: [
      {
        id: 1,
        title: 'React 组件设计模式-组合组件',
        brief: `场景：希望减少上下级组件之间props的传递，同时想避免“提供者”和“消费者” 角色组件共同依赖一个Context对象。
            简单来说就是不用传做显式地传值，来达到组件之间相互通信的目的, 举例来说，某些界面中应该有Tabs这样的组件，由Tab和TabItem组成，点击每个TabItem，该TabItem会高亮，
那么Tab和TabItem自然要进行沟通。很自然的写法是像下面这样`,
        author: 'admin',
      }
    ]
  }
  res.end(JSON.stringify(list))
}

export const articleDetail = (req, res) => {
  const list = {
    result: true,
    data: text,
  }
  res.end(JSON.stringify(list))
}

