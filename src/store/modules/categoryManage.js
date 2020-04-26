//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";

const state = {
  categoryList: [],
  saveLoding: false
}

const mutations = {
  SET_CATEGORY_LIST:(state, data) => {
    state.categoryList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 查找所有课程类别记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({commit}) {
    await axios.get("/api/v1/category/query").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_CATEGORY_LIST", response.data.body.data)
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
