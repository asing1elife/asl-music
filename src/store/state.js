/** vuex所有状态值 */
import { playMode } from 'common/js/config'

// 定义需要用到的状态常量
const state = {
  // 歌手对象
  singer: {},
  // 播放状态
  playing: false,
  // 全屏
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 排序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放歌曲的索引
  currentIndex: -1
}

// 将状态常量暴露给外部
export default state
