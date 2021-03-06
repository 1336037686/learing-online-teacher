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
import StudentCheck from '@/views/StudentManage/check.vue'
import studentManage from '@/views/StudentManage/manage.vue'
import AttendanceManage from '@/views/AttendanceManage/index.vue'
import CourseJobManage from '@/views/CourseJobManage/manage.vue'
import CourseJobCheck from '@/views/CourseJobManage/check.vue'
import ExamManage from '@/views/ExamManage/manage.vue'
import ExamCheck from '@/views/ExamManage/check.vue'

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
        // 学生管理 申请审核
        {
          path: 'studentCheck',
          name: 'studentCheck',
          component: StudentCheck
        },
        // 学生管理 选课学生管理
        {
          path: 'studentManage',
          name: 'studentManage',
          component: studentManage
        },
        // 签到操作 AttendanceManage
        {
          path: 'attendance',
          name: 'AttendanceManage',
          component: AttendanceManage
        },
        // 作业管理 作业发布
        {
          path: 'courseJobManage',
          name: 'CourseJobManage',
          component: CourseJobManage
        },
        // 作业管理 作业批改
        {
          path: 'courseJobCheck',
          name: 'courseJobCheck',
          component: CourseJobCheck
        },
        // 试卷管理 试卷发布
        {
          path: 'examManage',
          name: 'ExamManage',
          component: ExamManage
        },
        // 试卷管理 试卷批改
        {
          path: 'examCheck',
          name: 'examCheck',
          component: ExamCheck
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
