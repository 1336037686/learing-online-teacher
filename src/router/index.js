import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import LoginManage from '@/views/LoginManage/index.vue'
import WelcomeManage from '@/views/WelcomeManage/index.vue'
import PageNotFoundManage from '@/views/404Manage/index.vue'
import TeacherInfo from '@/views/TeacherInfo/index.vue'
import CourseCheckManage from '@/views/CourseCheckManage/index.vue'
import SectionManage from '@/views/SectionManage/index.vue'
import VideoManage from '@/views/VideoManage/index.vue'
import ResourceManage from '@/views/ResourceManage/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    //登陆
    {
      path: '/login',
      name: 'loginManage',
      component: LoginManage
    },
    {
      path: '/',
      name: 'loginManage',
      component: LoginManage
    },
    // 后台管理主页
    {
      path: '/admin',
      name: 'Layout',
      component: Layout,
      redirect: '/admin/welcome',
      children: [
        //欢迎界面
        {
          path: 'welcome',
          name: 'WelcomeManage',
          component: WelcomeManage
        },
        {
          path: 'info',
          name: 'TeacherInfo',
          component: TeacherInfo
        },
        //课程管理
        {
          path: 'course',
          name: 'CourseCheckManage',
          component: CourseCheckManage
        },
        // 章节管理
        {
          path: 'section',
          name: 'SectionManage',
          component: SectionManage
        },
        // 课时管理 VideoManage
        {
          path: 'video',
          name: 'VideoManage',
          component: VideoManage
        },
        // 资源管理 ResourceManage
        {
          path: 'resource',
          name: 'ResourceManage',
          component: ResourceManage
        },
        /*测试*/
        {
          path: 'loginManage',
          name: 'loginManage',
          component: LoginManage
        }
      ]
    },
    // 404 处理
    {
      path: '/404',
      name: 'PageNotFoundManage',
      component: PageNotFoundManage
    },
    // 404 处理, 此处需特别注意置于最底部
    {
      path: "*",
      redirect: "/404"
    }
  ]
})
