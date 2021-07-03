// 引入经过封装的jsonp
import jsonp from 'common/js/jsonp'
// 引入通用参数和配置
import { commonParams, options } from './config'

/**
 * 将获取歌手列表的方法暴露给外部
 */
export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url, data, options)
}

/**
 * 获取歌手详细信息
 */
export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    // 获取100条
    num: 100,
    songstatus: 1
  })

  return jsonp(url, data, options)
}
