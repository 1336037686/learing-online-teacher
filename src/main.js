// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI, {Notice} from 'view-design';
import 'view-design/dist/styles/iview.css';
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

// 添加视频组件
Vue.use(VideoPlayer)
// Iview
Vue.use(ViewUI);

Vue.config.productionTip = false

// 路由白名单
let whiteList = ["/login", "/"]

// 默认地址
let defaultTo = "/admin/welcome"

//路由全局守卫, 登录权限判断
router.beforeEach((to, from, next)=> {
    // 白名单放行
    whiteList.forEach(function (e) {
      if(to.path == e) {
        next()
      }
    })

    //权限验证
    let userInfo = sessionStorage.getItem("userInfo")
    if(userInfo == null) {
      next("/")
    } else {
      userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      let userName = userInfo.userName
      let token = userInfo.token
      if(userName.trim() != "" && token.trim() != ""){
        // 如果用户已登陆,且跳转的是登陆界面,则直接定位到默认地址
        if(to.path == "/" || to.path == "/login") {
          next(defaultTo)
        } else {
          next()
        }
      } else {
        // Notice.error({title: "请先登陆" , desc: ''});
        next("/")
      }
    }
  }
);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
