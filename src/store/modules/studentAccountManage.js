//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  specialtyList: [],
  specialtySelectList: [],
  studentData: {
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
  SET_STUDENT_DATA :(state, data) => {
    state.studentData = data
  },
  SET_SPECIALTY_SELECT_LIST_DATA :(state, data) => {
    state.specialtySelectList = data
  },
  SET_SPECIALTY_LIST_DATA :(state, data) => {
    state.specialtyList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 查找所有专业记录转化为Select
   * @param commit
   * @returns {Promise<void>}
   */
  async doQuerySpecialtyToSelectList({commit}) {
    await axios.get("/api/v1/specialty/query").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      let data = []
      response.data.body.data.forEach(function (e) {
        data.push({"label": e.name, "value": e.id})
      })
      commit("SET_SPECIALTY_SELECT_LIST_DATA", data)
      commit("SET_SPECIALTY_LIST_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 分页查找学生账号记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryCondition({dispatch, state, commit}, data) {

    // 查找专业
    await dispatch("doQuerySpecialtyToSelectList")
    // 查找学生账号
    await axios.post("/api/v1/student/condition", {"body": {"data": {"currentPage": data.currentPage, "name": data.name, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      // 时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      // 转化专业信息
      for(let i = 0; i < list.length; i++) {
        list[i].startTime = moment(list[i].startTime).format('YYYY-MM-DD')
        state.specialtyList.forEach(function (e) {
          if(list[i].specialty == e.id) {
            list[i]["specialtyName"] = e.name
          }
        })
      }
      commit("SET_STUDENT_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 分页查找学生账号记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({dispatch, state, commit}, data) {
    // 查找专业
    await dispatch("doQuerySpecialtyToSelectList")
    // 查找学生账号
    await axios.post("/api/v1/student/query", {"body": {"data": {"currentPage": data, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      // 时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      // 转化专业信息
      for(let i = 0; i < list.length; i++) {
        list[i].startTime = moment(list[i].startTime).format('YYYY-MM-DD')
        state.specialtyList.forEach(function (e) {
          if(list[i].specialty == e.id) {
            list[i]["specialtyName"] = e.name
          }
        })
      }
      commit("SET_STUDENT_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存学生账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/student/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", 1)
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 修改学生账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/student/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data.data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", data.currentPage)
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 删除学生账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/student/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{ "data": {"id" : data.id}}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", data.currentPage)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
