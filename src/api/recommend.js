// 引入经过封装的jsonp
import jsonp from 'common/js/jsonp'
// 引入axios，其是Vue官方推荐的实现ajax异步请求的库
import axios from 'axios'
// 引入通用参数和配置
import { commonParams, options } from './config'

/**
 * 将获取推荐信息的方法暴漏给外部
 */
export function getRecommend () {
  // 获取QQ音乐推荐轮播列表的请求
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // 通过assign方法对参数进行拼接，该方法是ES6语法
  // 首先引入commonParams通用参数
  // 再引入本次请求中独有的参数列表
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  // 将获取到的url和处理好的参数列表以及通用配置传入jsonp中，获取到一个Promise对象
  return jsonp(url, data, options)
}

/**
 * 将获取歌单列表的方法暴露给外部
 */
export function getDiscList () {
  // 由于QQ音乐获取歌单列表的接口做了header验证，因此不能直接访问
  // 通过路由代理并使用axios修改header信息后，发起异步请求，来实现欺骗服务器我们提供了合法的header信息
  // 所以此处直接访问在webpack.dev.conf.js中包装好的本地请求，来实现代理转发
  const url = '/api/getDiscList'

  // 准备参数列表
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  // 通过axios发起异步请求
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 此处的res.data是通过代理转发后去到服务器真是返回值后，在webpack.dev.conf.js中包装后值
    return Promise.resolve(res.data)
  })
}
