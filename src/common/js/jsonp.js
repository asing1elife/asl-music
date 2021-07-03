// 引入原生的jsonp插件
import originJSONP from 'jsonp'

/**
 * 对原始的jsonp插件方法进行封装
 * @param url 请求链接
 * @param data 请求参数
 * @param option 请求配置项
 * @returns {Promise}
 */
export default function jsonp (url, data, option) {
  // 将请求链接和参数进行拼接
  // 判断请求链接中是否存在?符号，不存在则添加?符号，存在则添加&符号
  // 最后将处理好的url和data进行拼接
  // http://exampleUrl?&data=data&data=data....
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  // Promise是ES6的语法
  // =>箭头函数也是ES6的语法，表示继承父级的this
  // resolve表示成功
  // reject表示失败
  return new Promise((resolve, reject) => {
    // err=null表示方法成功
    originJSONP(url, option, (err, data) => {
      // 判断结果是否成功
      if (!err) {
        // 成功则解析数据
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 对数据列表进行参数转换处理
 * @param data 参数列表
 * @returns {string} 格式转换后的参数字符串
 */
function param(data) {
  // 接收参数
  let url = ''

  // 遍历数据列表
  for (let k in data) {
    // 判断数据是否为空，为空则返回空字符串，不为空则返回数据
    let value = data[k] !== undefined ? data[k] : ''

    // 使用ES6语法对参数列表进行拼接
    url += `&${k}=${encodeURIComponent(value)}`
  }

  // 参数列表不为空则需要截取掉第一个多余的&符号
  return url ? url.substring(1) : ''
}
