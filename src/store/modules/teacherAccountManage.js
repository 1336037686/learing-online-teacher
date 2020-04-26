import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  departmentList: [],
  departmentSelectList: [],
  teacherData: {
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
   * 查找院系记录转化为Select
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryDeparmentToSelectList({commit}) {
    await axios.get("/api/v1/department/query").then(response => {
      if(response.data.head.responseCode !== "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      let data = []
      response.data.body.data.forEach(function (e) {
        data.push({"label": e.name, "value": e.id})
      })
      commit("SET_DEPARTMENT_LIST", response.data.body.data)
      commit("SET_DEPARTMENT_SELECT_LIST", data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 条件查找教师账号记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryCondition({dispatch, state, commit}, data) {
    // 查找专业
    await dispatch("doQueryDeparmentToSelectList")
    // 查找教师账号
    await axios.post("/api/v1/teacher/condition", {"body": {"data": {"currentPage": data.currentPage, "name": data.name, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode !== "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      // 时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      // 转化专业信息
      for(let i = 0; i < list.length; i++) {
        list[i].startTime = moment(list[i].startTime).format('YYYY-MM-DD')
        state.departmentList.forEach(function (e) {
          if(list[i].department === e.id) {
            list[i]["departmentName"] = e.name
          }
        })
      }
      commit("SET_TEACHER_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 分页查找教师账号记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({dispatch, state, commit}, data) {
    // 查找专业
    await dispatch("doQueryDeparmentToSelectList")
    // 查找教师账号
    await axios.post("/api/v1/teacher/query", {"body": {"data": {"currentPage": data, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode !== "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      // 时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      // 转化专业信息
      for(let i = 0; i < list.length; i++) {
        list[i].startTime = moment(list[i].startTime).format('YYYY-MM-DD')
        state.departmentList.forEach(function (e) {
          if(list[i].department === e.id) {
            list[i]["departmentName"] = e.name
          }
        })
      }
      commit("SET_TEACHER_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存教师账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/teacher/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
   * 修改教师账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/teacher/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data.data}}).then(response => {
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
   * 删除教师账号记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/teacher/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{ "data": {"id" : data.id}}}}).then(response => {
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
