<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 视图被加载一次后，会被缓存，下次访问就直接访问缓存，而不是重新通过路由获取视图 -->
    <keep-alive>
      <!-- 获取路由视图 -->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入组件
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    // 注册组件
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
