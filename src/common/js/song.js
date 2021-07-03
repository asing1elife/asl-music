/**
 * 歌曲类
 */
export default class Song {
  /**
   * 歌曲类构造函数
   * @param id 歌曲id
   * @param mid 歌曲mid
   * @param singer 所属歌手
   * @param name 歌曲名称
   * @param album 所属专辑
   * @param duration 歌曲时长
   * @param image 歌曲封面
   * @param url 歌曲文件请求路径
   */
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

/**
 * 创建歌曲的工厂方法
 * @param musicData 歌曲原始数据
 */
export function createSong(musicData) {
  // 返回一个新的歌曲对象
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    // 过滤歌手信息
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 该链接无法直接从网站上拉取，QQ音乐对于歌曲地址提供多个源，这是其中一个
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

/**
 * 获取歌手信息
 * @param singer 歌手原始数据，是一个数组
 */
function filterSinger(singer) {
  // 准备接收多个歌手的名称
  let ret = []

  // 非空验证
  if (!singer) {
    return ''
  }

  // 遍历歌手数组
  singer.forEach((item) => {
    // 将歌手名称添加到名称数组中
    ret.push(item.name)
  })

  // 对数组中的元素使用/进行分割，最终返回一个字符串
  return ret.join('/')
}
