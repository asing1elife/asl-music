// babel-polyfill用于转义ES6语法p
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// 将/router/index.js中export default new Router引入
import router from './router'
// 将/store/index.js引入
import store from './store'
// fastclick用于解决移动端点击300毫秒延迟的问题
import fastclick from 'fastclick'
// vue-lazyload用于实现局部内容懒加载
import vuelazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

// 将vue-lazyload注册到vue中
Vue.use(vuelazyload, {
  // 指定加载时的默认图片
  // require用于将图片替换为base64格式
  loading: require('common/images/default.png')
})

// 确保整个body之内的所有按钮的点击都没有300毫秒延迟
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
