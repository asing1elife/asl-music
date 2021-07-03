<template>
  <!-- 将滚动条放置在最外层 -->
  <!-- scroll组件加载的前置条件是其中真实存在数据，所以需要将列表的数组传入组件中 -->
  <!-- 将created中定义的listenScroll传给滚动组件 -->
  <!-- 定义@scroll事件用于监听滚动 -->
  <scroll ref="listview" class="listview" :data="data" :listenScroll="listenScroll" :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" ref="listGroup" class="list-group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 绑定一个touchstart事件，当触摸开始时触发该时间 -->
    <!-- .stop会调用stopPropagation() -->
    <!-- .prevent会调用preventDefault() -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!-- 将当前元素的索引存在data-index中 -->
        <li v-for="(item, index) in shortcutList" :data-index="index" :class="{current : currentIndex === index}"
            class="item">{{item}}
        </li>
      </ul>
    </div>
    <!-- 当fixedTitle真实存在值是才显示 -->
    <div class="list-fixed" ref="listFixed" v-show="fixedTitle">
      <!-- 在计算属性中通过currentIndex动态获取当前列表的标题 -->
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  // 引入滚动条组件用于实现列表滚动
  import Scroll from 'base/scroll/scroll'
  // 引入加载组件
  import Loading from 'base/loading/loading'
  // 引入getData方法
  import {getData} from 'common/js/dom'

  // 每个锚点的高度
  const ANCHOR_HEIGHT = 18
  // 标题高度
  const TITLE_HEIGHT = 30

  export default {
    created() {
      // 在此处创建一个touch对象是为了让本实例的方法能够相互调用该属性
      // 不将该属性放入到data()中是因为该属性只需要被调用，不需要被监听
      this.touch = {}
      // 监听滚动
      this.listenScroll = true
      // 存放每个字典数据列表的高度
      this.listHeight = []
      // 存放滚动规则
      this.probeType = 3
    },
    data() {
      return {
        // 用于获取滚动条实时滚动的坐标
        scrollY: -1,
        // 存放当前索引
        currentIndex: 0,
        // 列表顶部高度与滚动距离的差
        diff: -1
      }
    },
    props: {
      // 接收列表数据
      data: {
        type: Array,
        default: []
      }
    },
    // 计算属性
    computed: {
      // 在计算属性中对列表的标题进行处理
      shortcutList() {
        // 遍历列表内容
        return this.data.map((group) => {
          // 只需要标题，并且对标题进行截取
          return group.title.substr(0, 1)
        })
      },
      // 直接通过currentIndex获取到当前列表的标题并回传
      fixedTitle() {
        // 当列表到达顶部时不显示
        if (this.scrollY > 0) {
          return ''
        }

        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    // 注册组件
    components: {
      Scroll,
      Loading
    },
    watch: {
      // 监听data的变化
      data() {
        // DOM的渲染存在延迟，所以设置一个20毫秒的定时器
        setTimeout(() => {
          // 重新计算高度
          this._calculateHeight()
        }, 20)
      },
      // 监听列表y轴坐标变化
      scrollY(newY) {
        // 用一个常量保留当前高度列表
        const listHeight = this.listHeight

        // 当滚动到顶部时
        if (newY > 0) {
          this.currentIndex = 0
          return
        }

        // length-1是因为只判断在中间部分滚动，最后一个元素单独处理
        // 遍历高度列表，判断当前y轴坐标位于哪一个列表之间
        for (let i = 0; i < listHeight.length - 1; i++) {
          // 获取当前列表的顶部高度
          let nowHeight = listHeight[i]
          // 获取下一个列表的顶部高度
          let nextHeight = listHeight[i + 1]

          // newY取反是因为根据滚动的规则向下滚动为负值所以取反
          // 当前y轴坐标大于当前列表顶部高度，且小于下一个列表顶部高度时，说明当前坐标位于当前列表之中
          // -newY>=nowHeight是因为listHeight中的第一个元素就是位于顶部的，高度为0
          if (-newY >= nowHeight && -newY < nextHeight) {
            // 获取正确索引
            this.currentIndex = i
            // 获取列表顶部高度与滚动距离的差值
            this.diff = nextHeight + newY

            // 结束循环
            return
          }
        }

        // 当滚动到底部时
        this.currentIndex = listHeight.length - 2
      },
      // 监测diff变化
      diff(newVal) {
        // newVal是diff的实时值，当newVal>0且小于顶部标题的高度，该值才有意义
        // 用其实时值减去标题高度，就是顶部高度真的偏移量
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0

        // 判断偏移量是否产生变化，因为只有第二个列表的顶部标题触碰到fixedTitle才有意义，否则无需做多余的DOM操作
        if (fixedTop > 0) {
          return
        }

        // 将偏移量赋值给标题的DOM元素
        this.$refs.listFixed.style.top = fixedTop + 'px'
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        // 获取被触摸项的索引
        // 虽然该事件绑定在节点的父级上，但真实被触摸的必然是节点本身，所以通过e.target可以正确获取到节点
        let anchorIndex = getData(e.target, 'index')
        // 获取第一次触摸时的操作对象
        let firstTouch = e.touches[0]
        // 获取第一触摸时的Y轴坐标，并赋值到touch对象中
        this.touch.y1 = firstTouch.pageY
        // 记录当前锚点索引
        this.touch.anchorIndex = anchorIndex

        // 跳转到正确的列表节点
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        // 获取触摸移动时的操作对象
        let firstTouch = e.touches[0]
        // 获取触摸移动时的Y轴坐标，并赋值到touch对象中
        this.touch.y2 = firstTouch.pageY

        // 获取触摸开始直到移动时的偏移量后处于锚点的高度再向下取整，既可以获取到正确的锚点偏移量
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // 根据偏移量加上第一次触摸的的锚点的索引，即可得出当前的锚点的索引
        // 由于this.touch.anchorIndex是一个字符串，所以需要转换为数字
        let anchorIndex = Number(this.touch.anchorIndex) + delta

        // 跳转到正确的列表节点
        this._scrollTo(anchorIndex)
      },
      // 滚动条的滚动事件，该事件在scroll.vue中通过$emit被派发
      scroll(pos) {
        // 在滚动事件中将获取到的y轴坐标进行存放
        // pos.y的值由betterscroll提供
        this.scrollY = pos.y
      },
      // 选择歌手
      selectItem(item) {
        // 直接派发该事件
        // 此处选择派发事件而不是直接处理业务逻辑是因为listview.vue是基础组件，其只需要告知外部自己被点击了，并将被点击的对象传出去即可，具体业务逻辑留给外部处理
        this.$emit('select', item)
      },
      // 封装点击跳转方法
      _scrollTo(index) {
        // 当触摸到字典列表的空白区域时，不做任何反应
        if (index === null) {
          return
        }

        // 当滑动到字典列表外部时
        if (index < 0) {
          // index<0表明是顶部以外
          index = 0
        } else if (index > this.listHeight.length - 2) {
          // index>列表长度，表名是底部以外
          index = this.listHeight.length - 2
        }

        // 获取每个列表的顶部高度，只有将该值传给scrollY，在点击字典列表时，对应的字母才能高亮
        this.scrollY = -this.listHeight[index]

        // 当点击被点击时，列表跳转到对应标题的位置
        // 第二个参数用于指明滚动是否存在延迟
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算出列表当前滚动的高度
      _calculateHeight() {
        // 重置数据字典列表的初值
        this.listHeight = []
        // 获取歌手列表
        const list = this.$refs.listGroup

        // 已知第一个列表的顶部高度是0
        let height = 0
        // 直接将第一个已知高度存入
        this.listHeight.push(height)

        // 遍历列表获取其他高度
        for (let i = 0; i < list.length; i++) {
          // 获取当前列表
          let item = list[i]
          // 每个列表的高度需要累加之前列表的高度，才能得到其真实的顶部高度
          height += item.clientHeight

          // 将计算后的高度存入高度列表
          this.listHeight.push(height)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
