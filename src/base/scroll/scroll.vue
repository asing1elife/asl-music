<template>
  <div ref="wrapper">
    <!-- 预留一个插槽，用于装载需要被包括的内容 -->
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入better-scroll
  import BScroll from 'better-scroll'

  export default {
    props: {
      // 监听范围
      probeType: {
        type: Number,
        default: 1
      },
      // 允许点击
      click: {
        type: Boolean,
        default: true
      },
      // 存放数据, 防止组件刷新时数据丢失
      data: {
        type: Array,
        default: null
      },
      // 允许监听，默认不允许
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    // 页面初始化加载，类似于$(function () { ... })
    mounted () {
      // 确保页面加载完毕后在执行内部代码
      setTimeout(() => {
        // 初始化滚动条
        this._initScroll()
      }, 20)
    },
    methods: {
      // 初始化组件
      _initScroll () {
        // 判断组件是否被加载
        if (!this.$refs.wrapper) {
          return
        }

        // 利用better-scroll初始化滚动条组件
        this.scroll = new BScroll(this.$refs.wrapper, {
          // 监听范围
          probeType: this.probeType,
          // 允许点击
          click: this.click
        })

        // 判断是否允许监听
        if (this.listenScroll) {
          // 获取vue实例
          let me = this

          // 监听滚动
          this.scroll.on('scroll', (pos) => {
            // 将该滚动监听事件派发
            me.$emit('scroll', pos)
          })
        }
      },
      // 启用组件
      enable () {
        this.scroll && this.scroll.enable()
      },
      // 禁用组件
      disable () {
        this.scroll && this.scroll.disable()
      },
      // 刷新组件
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      // 滚动监听
      scrollTo () {
        // 使用apply将对外的scrollTo接收到的参数传入到插件真实的scrollTo方法中
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 滚动至节点
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    // 监听数据变化，防止每次调用组件都需要手动去判断是否需要刷新
    watch: {
      data () {
        setTimeout(() => {
          // 数据放生变化时，刷新组件
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
