<template>
  <div class="singer">
    <!-- 因为引入组件时命名为ListView，所以此处对应标签是list-view -->
    <!-- 如果引入是组件命令为Listview, 此处对应标签应该是listview -->
    <!-- @select表示监听由list-view派发出来的select事件 -->
    <list-view @select="selectSinger" :data="singers"></list-view>
    <!-- 挂载在router/index.js中添加的子路由singer-detail -->
    <!-- 将子路由挂载放在父页面是因为实际上只是实现了一个子页面遮挡父页面的效果，页面并没有跳转到其他页面去 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入获取歌手列表的方法
  import { getSingerList } from 'api/singer'
  // 引入回执编码
  import { ERR_OK } from 'api/config'
  // 引入歌手对象
  import Singer from 'common/js/singer'
  // 引入歌手列表组件
  import ListView from 'base/listview/listview'
  // 引入mapMutations，只是vuex对于mutation的封装，可以简化其操作
  import { mapMutations } from 'vuex'

  // 定义常量
  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      // 获取歌手列表
      this._getSingerList()
    },
    components: {
      // 注册列表组件
      ListView
    },
    methods: {
      // 选择歌手，该方法实际上有listview.vue内部的selectItem通过$emit派发到外部
      selectSinger (singer) {
        // 实现路由跳转，到歌手详情页
        this.$router.push({
          path: `/singer/${singer.id}`
        })

        // 修改歌手状态
        // 实际上是调用了this.$store.commit('')方法
        this.setSinger(singer)
      },
      // 对获取歌手列表的方法进行简单封装
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // 对返回结果进行排序处理
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      // 由于从QQ音乐接口获取到的歌手列表数据与需要展现的数据在格式上存在出入，所以需要通过以下方法规范化数据
      _normalizeSinger (list) {
        // 定义热门歌手数据格式
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        // 遍历获取到的原始数据
        list.forEach((item, index) => {
          // 对当前数据进行有效筛选后，存入新创建的歌手对象中
          let singer = new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })

          // 判断索引是否已达到热门歌手显示长度
          if (index < HOT_SINGER_LEN) {
            // 将允许范围内的歌手对象，添加到热门歌手数组中
            map.hot.items.push(singer)
          }

          // 获取当前数据的字典数据
          const key = item.Findex

          // 判断该字典数据是否已存在
          if (!map[key]) {
            // 不存在则新增该字典数据
            map[key] = {
              title: key,
              // 存放所属与该字典数据的歌手数组
              items: []
            }
          }

          // 为当前字典数据的歌手数组添加数据
          map[key].items.push(singer)
        })

        // 存放热门对象
        let hot = []
        // 存在字典数据对象
        let ret = []

        // 对无序列表进行分类
        for (let key in map) {
          // 获取当前对象
          let val = map[key]

          // 判断当前对象的字典数据是否是字母
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            // 将热门对象存入热门数组
            hot.push(val)
          }
        }

        // 字典数据对象被分类后处于无序状态，需要进行排序
        ret.sort((a, b) => {
          // 按照字符的编码排序
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        // 将排序后的字典数据对象与热门对象拼接
        return hot.concat(ret)
      },
      // 将mutations-types中的状态值映射到该文件中，从而该文件可以把被映射过来的状态值当做一个方法直接提交对状态的修改
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
