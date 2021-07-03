<template>
  <!-- ref用于给元素或组件注册引用信息 -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <!-- 动态绑定active到class之上，只需要按照如下语法判断currentPageIndex是否等于当前index -->
      <div class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-trailing-spaces */

  // 引入better-scroll，用于解决移动端滚动场景需求
  import BScroll from 'better-scroll'
  // 引入通用DOM操作库中的addClass方法
  import { addClass } from 'common/js/dom'

  export default {
    data () {
      return {
        // 用于接收节点列表
        dots: [],
        // 用于指定当前页
        currentPageIndex: 0
      }
    },
    // 添加组件属性
    props: {
      // 循环
      loop: {
        type: Boolean,
        default: true
      },
      // 自动播放
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 轮播间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    // 在组件初始化时被调用
    mounted () {
      // 组件初始化后延长20毫秒执行内部代码，
      // 选择延迟20秒是因为浏览器刷新通常是17毫秒一次
      setTimeout(() => {
        // 设置轮播宽度
        this._setSliderWidth()

        // 初始化轮播节点
        this._initDots()

        // 初始化轮播组件
        this._initSlider()

        // 判断是否开启自动播放
        if (this.autoPlay) {
          // 调用自动播放方法
          this._play()
        }
      }, 20)

      // 监听窗口大小变化事件
      window.addEventListener('resize', () => {
        // 判断轮播是否已初始化
        if (!this.slider) {
          // 轮播未初始化则不进行任何操作
          return
        }

        // 在窗口大小变化时，重新定义轮播的宽度，以确保轮播滚动时不会乱
        this._setSliderWidth(true)
        // 刷新轮播，该方法由better-scroll提供
        this.slider.refresh()
      })
    },
    // 组件销毁时
    destroyed () {
      // 清空定时器，释放资源
      clearTimeout(this.timer)
    },
    methods: {
      // 因为轮播是横向滚动，所以需要先设置轮播的宽度
      _setSliderWidth: function (isResize) {
        // 获取轮播组的子元素
        this.children = this.$refs.sliderGroup.children

        // 轮播组的宽度
        let width = 0
        // 轮播容器的宽度
        let sliderWidth = this.$refs.slider.clientWidth

        // 遍历轮播子元素，依次指定宽度并添加class
        for (let i = 0; i < this.children.length; i++) {
          // 获取当前子元素
          let child = this.children[i]

          // 为当前元素添加class
          addClass(child, 'slider-item')
          // 为当前元素指定宽度，因为一次只显示一张图片，所以轮播元素的宽度直接等于轮播容器的宽度
          child.style.width = sliderWidth + 'px'

          // 累加轮播组宽度
          width += sliderWidth
        }

        // 如果允许循环轮播，则需要在左右预留两个轮播的宽度
        // 窗体大小变化时，轮播已加载，则不需要再重新预留宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        // 轮播组的宽度计算完毕后，回传到轮播组对象中
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化轮播节点
      _initDots () {
        // 初始化一个节点数组，长度和轮播子元素长度保持一致
        this.dots = new Array(this.children.length)
      },
      // 初始化轮播
      _initSlider () {
        // 初始化轮播组件时，首先传入需要绑定轮播组件的DOM对象
        this.slider = new BScroll(this.$refs.slider, {
          // 允许横向滚动
          scrollX: true,
          // 禁止纵向滚动
          scrollY: false,
          // 没有惯性
          momentum: false,
          // 轮播专用
          snap: true,
          // 循环轮播，与自定义轮播属性保持一致
          snapLoop: this.loop,
          snapThreshold: 0.3,
          // 轮播切换速度
          snapSpeed: 400
        })

        // 绑定滚动结束方法
        this.slider.on('scrollEnd', () => {
          // 获取滚动结束后，最新的当前页的索引
          let pageIndex = this.slider.getCurrentPage().pageX

          // 当处于循环模式时，pageIndex需要-1
          if (this.loop) {
            // 因为在循环模式下，会在左右多生成一对轮播
            pageIndex -= 1
          }

          // 将计算后的pageIndex回传给currentPageIndex
          this.currentPageIndex = pageIndex

          // 判断是否开启自动播放
          if (this.autoPlay) {
            // 防止手动滚动和自动播放冲突，所以在手动滚动结束后，清空自动播放
            clearInterval(this.timer)
            // 重启开启自动滚动
            // 因为自动播放使用的是setTimeout，所以再一次滚动结束后，需要再次启用下一次的计时
            this._play()
          }
        })
      },
      // 自动播放
      _play () {
        // 获取当前页的index，改方法由better-scroll提供
        let pageIndex = this.slider.getCurrentPage().pageX

        // 判断是否处于循环模式中
        if (this.loop) {
          // 在循环模式中，会在左右多生成一对轮播，所以表象的pageIndex需要+1
          pageIndex += 1
        }

        // 设置一个定时器，间隔为轮播组件属性中的间隔值
        this.timer = setInterval(() => {
          // 将计算后的pageIndex回传到slider的方法中，该方法又better-scroll提供
          // 第一个值为横向索引，即当前页面索引
          // 第二个值为纵向索引，因为该轮播不支持纵向滚动，所以为0
          // 第三个值为滚动速度，设为当前间隔的1/10即可
          this.slider.goToPage(pageIndex, 0, this.interval / 10)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
