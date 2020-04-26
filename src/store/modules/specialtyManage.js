import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  departmentList: [],
  specialtyData: {
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
  SET_SPECIALTY_DATA :(state, data) => {
    state.specialtyData = data
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
   * 查找所有院系记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryDepAll({commit}) {
    await axios.get("/api/v1/department/query").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_DEPARTMENT_LIST", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 分页查找学院专业记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({dispatch, state, commit}, data) {
    await dispatch("doQueryDepAll")
    await axios.post("/api/v1/specialty/query", {"body": {"data": {"currentPage": data, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      let list = response.data.body.data.pageInfo.list
      for(let i = 0; i < list.length; i++) {
        state.departmentList.forEach(function (e) {
          if(e.id == list[i].depId) {
            list[i]["departmentName"] = e.name
          }
        })
      }
      commit("SET_SPECIALTY_DATA", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存公告记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/specialty/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
   * 删除专业记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/specialty/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{ "data": {"id" : data.id}}}}).then(response => {
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

  /**
   * 修改专业记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/specialty/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data.data}}).then(response => {
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
