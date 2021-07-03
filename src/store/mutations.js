/** vuex所有的mutation */

// 引入mutations-types
import * as types from './mutation-types'

// 定义mutation，其内部是一些修改方法
const mutations = {
  // 修改设置歌手的状态
  // 第一个参数是状态值
  // 第二个参数为提交状态修改是传入的对象参数
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  // 播放状态
  [types.SET_PLAYING_STATE] (state, playing) {
    state.playing = playing
  },
  // 全屏
  [types.SET_FULL_SCREEN] (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  // 播放列表
  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },
  // 排序列表
  [types.SET_SEQUENCE_LIST] (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  // 播放模式
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  // 当前播放歌曲的索引
  [types.SET_CURRENT_INDEX] (state, currentIndex) {
    state.SET_CURRENT_INDEX = currentIndex
  }
}

// 暴露给外部
export default mutations
