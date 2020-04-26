import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  teacherInfo: {},
  saveLoding: false,
  size: 20,
}

const mutations = {
  SET_TEACHER_INFO :(state, data) => {
    state.teacherInfo = data
  },
  SET_TEACHER_DATA :(state, data) => {
    state.teacherData = data
  },
  SET_DEPARTMENT_SELECT_LIST:(state, data) => {
    state.departmentSelectList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  },
  SET_DEPARTMENT_LIST:(state, data) => {
    state.departmentList = data
  },
}

const actions = {

  /**
   * 按照教师ID查询教师基本信息
   */
  async doQueryTeacherInfoByTeacherId({dispatch, state, commit}) {
    console.log("========> " +"/api/v1/teacher/query/" + store.state.loginManage.id)
    await axios.get("/api/v1/teacher/query/" + store.state.loginManage.id).then(response => {
      if(response.data.head.responseCode !== "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      commit("SET_TEACHER_INFO", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },


  /**
   * 修改教师账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/teacher/update/info", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryTeacherInfoByTeacherId", data.currentPage)
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 修改密码
   * @param dispatch
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdatePassword({dispatch, commit}, data) {
    console.log(data)
    await axios.put("/api/v1/teacher/update/password", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
