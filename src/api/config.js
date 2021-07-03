// 定义请求中的通用参数
export const commonParams = {
  g_tk: 5381,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

// 定义请求中的通用配置
export const options = {
  param: 'jsonpCallback'
}

// 定义请求回执中表示成功的数值
export const ERR_OK = 0
