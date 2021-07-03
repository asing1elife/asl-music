<template>
  <!-- 为该页面添加一个转场动画 -->
  <transition name="slide">
    <!-- 调用音乐列表组件 -->
    <!-- 将需要从父级传入的参数绑定在组件上 -->
    <!-- 需要注意的是在music-list的props中bgImage对应父级的bg-image -->
    <music-list :bg-image="bgImage" :songs="songs" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 引入mapGetters，这是vuex封装的获取mutations状态的语法糖
  import { mapGetters } from 'vuex'
  // 引入回执编码
  import { ERR_OK } from 'api/config'
  // 引入获取歌手详情的方法
  import { getSingerDetail } from 'api/singer'
  // 引入歌曲工厂方法
  import {createSong} from 'common/js/song'
  // 引入音乐列表组件
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        // 存放歌曲列表
        songs: []
      }
    },
    computed: {
      // 获取歌手名称
      title() {
        return this.singer.name
      },
      // 获取歌手头像
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        // 对应./store/getters中定义的singer
        'singer'
      ])
    },
    created () {
      // 获取歌手详情
      this._getDetail()
    },
    // 注册组件
    components: {
      MusicList
    },
    methods: {
      // 封装获取歌手详情方法
      _getDetail () {
        // 判断是否正确传入歌手信息
        // 虽然在进入歌手详情页的请求链接上有传入歌手id，但其实此处是通过vuex的mutation对歌手状态进行管理
        // 所以链接上的歌手id只是一个符合restful风格的请求规则，并不会直接使用
        if (!this.singer.id) {
          // 歌手信息未正确传入则直接返回到歌手列表界面
          this.$router.push('/singer')
          return
        }

        // 获取歌手详情
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            // 获取处理后的歌曲列表
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      // 处理歌手详情中的歌曲列表数据
      _normalizeSongs(list) {
        // 存放过滤后的歌曲列表
        let ret = []

        // 遍历歌曲列表
        list.forEach((item) => {
          // 获取歌曲信息
          let {musicData} = item

          // 数据有效性验证
          if (musicData.songid && musicData.albummid) {
            // 新建一个歌曲对象，并添加到数组中
            ret.push(createSong(musicData))
          }
        })

        // 将处理后的有效数据返回
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
