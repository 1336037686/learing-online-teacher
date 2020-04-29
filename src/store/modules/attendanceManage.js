import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";
import moment from 'moment'

const state = {
  attendanceList: [],
  attendanceInfo: [],
  size: 20,
  saveLoding: false
}

const mutations = {
  SET_ATTENDANCE_LIST:(state, data) => {
    state.attendanceList = data
  },
  SET_ATTENDANCE_INFO:(state, data) => {
    state.attendanceInfo = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 根据课程ID查看所有签到信息
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllByCourse({commit}, data) {
    await axios.get("/api/v1/attendance/query/course/" + data).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      // 日期格式化
      for(let i = 0; i < response.data.body.data.length; i++) {
        response.data.body.data[i].startTime = moment(response.data.body.data[i].startTime).format('YYYY-MM-DD h:mm:ss')
        response.data.body.data[i].endTime = moment(response.data.body.data[i].endTime).format('YYYY-MM-DD h:mm:ss')
      }
      commit("SET_ATTENDANCE_LIST", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 根据签到ID查看签到基本信息
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doQueryInfoById({commit}, data) {
    await axios.get("/api/v1/attendance/query/info/" + data).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_ATTENDANCE_INFO", response.data.body.data.miss)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存签到
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/attendance/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode !== "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    });
    //重新查找
    await dispatch("doQueryAllByCourse", data.course);
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 删除选课学生
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    console.log(JSON.stringify(data))
    await axios.delete("/api/v1/attendance/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAllByCourse", data.course)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
