/**
 * 通过面向对象的方式创建一个歌手类
 * 用于存放歌手的通用数据
 */
export default class Singer {
  constructor ({id, name}) {
    this.id = id
    this.name = name
    // 由于根据QQ音乐的头像获取规则，在回执数据中并没有直接返回图片链接
    // 根据其多张图片的对比可以得知其获取头像的规则是从同一的图片服务器中获取尾缀id不同的图片
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
