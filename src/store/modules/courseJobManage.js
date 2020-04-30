import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";
import da from "element-ui/src/locale/lang/da";
import moment from "moment";

const state = {
  courseJobData: [],
  saveLoding: false
}

const mutations = {
  SET_COURSE_JOB_DATE:(state, data) => {
    state.courseJobData = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 根据课程ID查看所有发布作业
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllByCourse({commit}, data) {
    await axios.get("/api/v1/courseJob/query/course/" + data).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      // 日期格式化
      for(let i = 0; i < response.data.body.data.length; i++) {
        response.data.body.data[i].startTimeOriginal = response.data.body.data[i].startTime
        response.data.body.data[i].endTimeOriginal = response.data.body.data[i].endTime
        response.data.body.data[i].startTime = moment(response.data.body.data[i].startTime).format('YYYY-MM-DD h:mm:ss')
        response.data.body.data[i].endTime = moment(response.data.body.data[i].endTime).format('YYYY-MM-DD h:mm:ss')
      }
      commit("SET_COURSE_JOB_DATE", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存作业信息
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/courseJob/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
    await axios.delete("/api/v1/courseJob/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAllByCourse", data.course);
  },

  /**
   * 修改作业信息
    * @param dispatch
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    await axios.put("/api/v1/courseJob/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if (response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message, desc: ''});
      } else {
        Notice.success({title: response.data.head.message, desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAllByCourse", data.course);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
