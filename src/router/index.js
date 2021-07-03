import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'

// 注册路由
Vue.use(Router)

export default new Router({
  // 实现路由配置
  routes: [
    {
      // 配置跟路径
      path: '/',
      // 默认跳转推荐页
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      // 添加子路由
      children: [
        {
          // 根据restful语法，表示根据id获取每个歌手的详情
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
