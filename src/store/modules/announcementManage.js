//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';
import moment from 'moment'
import store from "../index";

const state = {
  announcementData: {
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
  // SET_DATA:(state, data) => {
  //   state.user = data
  // }
  SET_ANNOUNCEMENT_DATA :(state, data) => {
    console.log(data)
    state.announcementData = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 分页查找公告记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({state, commit}, data) {
    await axios.post("/api/v1/announcement/query", {"body": {"data": {"currentPage": data, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      //时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      for(let i = 0; i < list.length; i++) {
        list[i].time = moment(list[i].time).format('YYYY-MM-DD')
      }
      commit("SET_ANNOUNCEMENT_DATA", response.data.body.data)
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
    await axios.post("/api/v1/announcement/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
   * 删除公告记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/announcement/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{ "data": {"id" : data.id}}}}).then(response => {
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
   * 分页条件查找公告记录
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryByCondition({state, commit}, data) {
    await axios.post("/api/v1/announcement/condition", {"body": {"data": {"startTime": data.startTime, "endTime": data.endTime, "selectContent": data.selectContent, "currentPage": data.currentPage, "size": state.size}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        this.$Notice.error({title: response.data.head.message , desc: ''});
        return;
      }
      //时间转换 yyyy-MM-dd
      let list = response.data.body.data.pageInfo.list
      for(let i = 0; i < list.length; i++) {
        list[i].time = moment(list[i].time).format('YYYY-MM-DD')
      }
      commit("SET_ANNOUNCEMENT_DATA", response.data.body.data)
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
