<template>
  <div class="recommend">
    <!-- 将推荐内容整体使用scroll组件把包裹，其内容的内容都会被自动添加到scroll组件的插槽中 -->
    <!-- 将歌单传入到组件的数据中进行存放，确保组件在有数据存在的情况下加载，否则组件将无法正常渲染 -->
    <!-- 为scroll组件添加一个ref引用，用于在代码中调用 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 提前准备一个容器用于填充scroll滚动条 -->
      <div>
        <!-- 此处做判断是为了确保当页面加载时，轮播上的数据是真实存在的 -->
        <!-- 如果在数据还没获取到之前就加载了组件，会导致组件内部的mouted方法在初始化组件宽度时无法顺利操作到组件 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <!-- 引用经过注册的轮播图组件 -->
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!-- 为图片绑定load事件，在图片加载成功后，执行一些内部操作，例如刷新滚动条组件  -->
                <!-- 因为fastclick的拦截默认点击操作会和better-scroll的轮播允许点击冲突，为图片添加.needsclick则可以让fastclick跳过对该元素的检测 -->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <!-- 图片的地址不能作为属性值直接赋值，必须通过v-bind的方式进行绑定，否则将无法解析图片地址 -->
                <!-- 将:src替换为v-lazy是因为此处使用了vue-lazyload创建来实现图片的懒加载，可实现当图片需要加载时才去获取图片 -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <!-- 因为返回的名称和描述的数据中存在转义字符，所以需要通过v-html对字符进行解析 -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 歌单列表数据获取到之前显示该容器，之后则隐藏 -->
      <div class="loading-container" v-show="!discList.length">
        <!-- 加入加载组件，在内容显示之前先显示正在加载信息 -->
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入自定义的轮播图组件
  import Slider from 'base/slider/slider'
  // 引入自定义的滚动条组件
  import Scroll from 'base/scroll/scroll'
  // 引入自定义的loading组件
  import Loading from 'base/loading/loading'
  // 引入getRecommend, getDiscList方法
  import { getRecommend, getDiscList } from 'api/recommend'
  // 引入语义化的回执成功数值
  import { ERR_OK } from 'api/config'

  export default {
    data () {
      return {
        // 定义推荐列表数组，用于接收请求到的数据
        recommends: [],
        // 定义歌单列表数组，用于接收请求到的数据
        discList: []
      }
    },
    created () {
      // 调用封装后获取推荐列表的方法
      this._getRecommend()
      // 调用封装后获取歌单列表的方法
      this._getDiscList()
    },
    methods: {
      // 对getRecommend方法做简单处理
      _getRecommend () {
        // getRecommend返回的是是Promise对象，其处理回调的方式是使用then()方法
        getRecommend().then((res) => {
          // 判断回执是否成功
          if (res.code === ERR_OK) {
            // 接收请求到的数据
            this.recommends = res.data.slider
          }
        })
      },
      // 对getDiscList方法做简单处理
      _getDiscList () {
        getDiscList().then((res) => {
          // 判断回执是否成功
          if (res.code === ERR_OK) {
            // 接收请求到的数据
            this.discList = res.data.list
          }
        })
      },
      // 图片加载成功后，执行内部操作
      loadImage () {
        // 为了防止每张图片加载时都刷新执行操作，所以需要在第一张图片加载后就将已加载的标识设为true
        if (!this.checkLoaded) {
          // 刷新滚动条组件
          this.$refs.scroll.refresh()
          // 标识修改
          this.checkLoaded = true
        }
      }
    },
    components: {
      // 注册轮播图组件
      Slider,
      // 注册滚动条组件
      Scroll,
      // 注册加载组件
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
