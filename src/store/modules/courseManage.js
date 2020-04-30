//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  courseList: [],
  courseData: {
    pageInfo: {
      list: [],
      pages: 0,
      total: 0
    }
  },
  saveLoding: false,
  size: 20,
}

const mutations = {
  SET_COURSE_DATA :(state, data) => {
    state.courseData = data
  },
  SET_COURSE_LIST: (state, data) => {
    state.courseList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  },
}

const actions = {

  /**
   * 保存课程账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/course/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", {"currentPage": 1, "teacher": store.state.loginManage.id})
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 根据教师ID查找所有审核通过的课程信息记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllPass({dispatch, state, commit}) {
    await axios.get("/api/v1/course/query/teacher/" + store.state.loginManage.id).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      commit("SET_COURSE_LIST", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },


  /**
   * 根据教师ID分页查找课程信息记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({dispatch, state, commit}, data) {
    await axios.post("/api/v1/course/query/teacher", {"body": {"data": {"currentPage": data.currentPage, "size": state.size, "teacher": data.teacher}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      //数据转换
      let list = response.data.body.data.pageInfo.list
      for(let i = 0; i < list.length; i++) {
        list[i].time = moment(list[i].time).format('YYYY-MM-DD')
      }
      commit("SET_COURSE_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 按照条件查找课程信息记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryCondition({dispatch, state, commit}, data) {
    await axios.post("/api/v1/course/condition", {"body": {"data": {"currentPage": data.currentPage, "size": state.size, "name": data.name}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      //数据转换
      let list = response.data.body.data.pageInfo.list
      for(let i = 0; i < list.length; i++) {
        list[i].time = moment(list[i].time).format('YYYY-MM-DD')
      }
      commit("SET_COURSE_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },


  /**
   * 修改课程记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/course/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data.data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", {"currentPage": data.currentPage, "teacher": store.state.loginManage.id})
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 删除课程记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.delete("/api/v1/course/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data.data}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", {"currentPage": data.currentPage, "teacher": store.state.loginManage.id})
    commit("SET_SAVE_LODING", false)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
