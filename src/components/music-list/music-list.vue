<template>
  <div class="music-list">
    <!-- 点击返回上一页 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- title可能是存在转义字符，所以使用v-html -->
    <h1 class="title" v-html="title"></h1>
    <!-- 使用bind绑定行内样式，具体样式信息在计算属性中得到 -->
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放歌曲</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 为了能让scroll组件正确计算列表高度，需要将列表数据传入 -->
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <!-- 调用歌曲列表组件，并传入歌曲列表数据 -->
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入滚动条组件
  import Scroll from 'base/scroll/scroll'
  // 引入加载组件
  import Loading from 'base/loading/loading'
  // 引入歌曲列表组件
  import SongList from 'base/song-list/song-list'
  // 引入样式修饰方法
  import { prefixStyle } from 'common/js/dom'
  import { mapActions } from 'vuex'

  // 顶栏高度
  const HEAD_HEIGHT = 42
  // 统一为transform添加前缀
  const TRANSFORM = prefixStyle('transform')

  export default {
    // 声明需要从父级接收的数据
    props: {
      // 背景图
      bgImage: {
        type: String,
        default: ''
      },
      // 歌曲列表
      songs: {
        type: Array,
        default: []
      },
      // 标题
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // 获取滚动条Y轴变化
        scrollY: 0
      }
    },
    computed: {
      // 在计算属性中对背景图片进行完整拼接
      bgStyle () {
        return `background-image: url(${this.bgImage})`
      }
    },
    created () {
      // better-scroll支持快速滚动
      this.probeType = 3
      // better-scroll监听滚动
      this.listenScroll = true
    },
    mounted () {
      // 记录背景高度
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 获取遮罩层的最小滚动距离
      this.minTranslateY = -this.imageHeight + HEAD_HEIGHT

      // 动态计算歌曲列表距离顶部的距离，也就是背景图的高度
      // 因为list是一个组件，所以需要先通过$el获取其DOM元素，才能获取其真实样式
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      // 监听滚动
      scroll (pos) {
        // 实时获取y轴坐标
        this.scrollY = pos.y
      },
      // 返回上一页
      back () {
        this.$router.back()
      },
      // 控制当列表滚动到顶栏或底部时，背景跟随产生动画效果
      _controlScrollTransform (newY) {
        let zIndex = 0
        let paddingTop = 70
        let height = 0
        let scale = 1
        let filter = 0.4
        let display = 'block'

        // 计算放大比例
        let percent = Math.abs(newY / this.imageHeight)

        // 当列表滚动的y轴坐标小于最小位移坐标时，修改背景图片的样式
        if (newY < this.minTranslateY) {
          // 提升z-index达到遮挡列表溢出
          zIndex = 10
          // 高度与顶栏保持一致
          paddingTop = 0
          height = HEAD_HEIGHT
          // 隐藏按钮
          display = 'none'
        } else {
          zIndex = 0
          paddingTop = 70
          height = 0
          // 显示按钮
          display = 'block'
        }

        // 当滚动的y轴坐标大于0时，表示列表已经在最大限度的往下拉
        if (newY > 0) {
          // 放大时整体效果不会列表遮挡
          zIndex = 10
          scale = 1 + percent
        } else {
          // 列表向上滚动时，增加背景遮罩的强度
          filter = Math.min(0.4 + percent, 1)
        }

        // 样式赋值
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.paddingTop = `${paddingTop}%`
        this.$refs.bgImage.style.height = `${height}px`
        this.$refs.bgImage.style[TRANSFORM] = `scale(${scale})`
        this.$refs.filter.style.opacity = filter
        this.$refs.playBtn.style.display = display
      },
      // 选择歌曲
      selectItem (song, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      }
    },
    watch: {
      // 监听y轴坐标变化
      scrollY (newY) {
        // 计算遮罩层的滚动范围
        let translateY = Math.max(this.minTranslateY, newY)

        // 根据y轴坐标变化控制遮罩层的位移
        this.$refs.layer.style[TRANSFORM] = `translate3d(0, ${translateY}px, 0)`

        // 控制当列表滚动到顶栏或底部时，背景跟随产生动画效果
        this._controlScrollTransform(newY)
      }
    },
    components: {
      Scroll,
      Loading,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        transition: all .3s
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
