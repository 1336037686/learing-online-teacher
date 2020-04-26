//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";

const state = {
  videoList: [],
  saveLoding: false
}

const mutations = {
  SET_VIDEO_LIST:(state, data) => {
    state.videoList = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 按照课程与章节ID查询课时视频
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAll({commit}, data) {
    console.log(JSON.stringify(data))
    await axios.get("/api/v1/video/query/course/" + data.course + "/" + data.section).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_VIDEO_LIST", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存课堂章节记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/video/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode !== "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    });
    //重新查找
    await dispatch("doQueryAll", {"course": data.course, "section": data.section});
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 删除课堂章节记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/video/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", {"course": data.course, "section": data.section})
  },

  /**
   * 修改课堂章节记录
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/video/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAll", {"course": data.course, "section": data.section})
    commit("SET_SAVE_LODING", false)
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
