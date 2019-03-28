/**
 * Author: NERO
 * Date: 2019/3/24 0024
 * Time: 18:23
 *
 */
import text1 from './text1'
import text2 from './text2'
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
      },
      {
        id: 2,
        title: 'React 从入门到精通',
        brief: `服务端渲染的基本套路就是用户请求过来的时候，在服务端生成一个我们希望看到的网页内容的HTML字符串，返回给浏览器去展示。
浏览器拿到了这个HTML之后，渲染出页面，但是并没有事件交互，这时候浏览器发现HTML中加载了一些js文件（也就是浏览器端渲染的js），就直接去加载。
加载好并执行完以后，事件就会被绑定上了。这时候页面被浏览器端接管了。也就是到了我们熟悉的js渲染页面的过程。`,
        author: 'admin',
      },
    ]
  }
  res.end(JSON.stringify(list))
}

export const articleDetail = (req, res) => {
  const listMap = [
    {
      title: 'React 组件设计模式-组合组件',
      id: '1',
      author: 'admin',
      content: text1
    },
    {
      title: 'React 服务端渲染从入门到精通',
      id: '2',
      author: 'admin',
      content: text2
    }
  ]
  let data
  listMap.forEach(v => {
    if (v.id === req.query.id) {
      data = v
    }
  })
  const list = {
    result: true,
    data,
  }
  res.end(JSON.stringify(list))
}

