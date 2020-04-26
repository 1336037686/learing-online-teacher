import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";

const state = {
  departmentList: [],
  departmentSelectList: [],
  saveLoding: false
}

const mutations = {
  SET_DEPARTMENT_LIST:(state, data) => {
    state.departmentList = data
  },
  SET_DEPARTMENT_SELECT_LIST:(state, data) => {
    state.departmentSelectList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 查找院系记录转化为Select
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryDeparmentToSelectList({commit}) {
    await axios.get("/api/v1/department/query").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      let data = []
      response.data.body.data.forEach(function (e) {
        data.push({"label": e.name, "value": e.id})
      })
      commit("SET_DEPARTMENT_SELECT_LIST", data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 查找所有院系记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({commit}) {
    await axios.get("/api/v1/department/query").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_DEPARTMENT_LIST", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
