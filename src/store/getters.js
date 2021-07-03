/** vuex中state的映射 */

// 获取歌手的状态，并暴露给外部
export const singer = state => state.singer

// 播放状态
export const playing = state => state.playing

// 全屏
export const fullScreen = state => state.fullScreen

// 播放列表
export const playlist = state => state.playlist

// 排序列表
export const sequenceList = state => state.sequenceList

// 播放模式
export const mode = state => state.mode

// 当前播放歌曲的索引
export const currentIndex = state => state.currentIndex

// 当前播放歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
