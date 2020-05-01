import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";
import da from "element-ui/src/locale/lang/da";
import moment from "moment";

const state = {
  examData: [],
  studentExamData: [],
  missStudentExamData: [],
  saveLoding: false
}

const mutations = {
  SET_EXAM_DATE:(state, data) => {
    state.examData = data
  },
  SET_STUDENT_EXAM_DATE:(state, data) => {
    state.studentExamData = data
  },
  SET_MISS_STUDENT_EXAM_DATE:(state, data) => {
    state.missStudentExamData = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 根据课程ID查看所有发布试卷
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllByCourse({commit}, data) {
    await axios.get("/api/v1/exam/query/course/" + data).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      // 日期格式化
      for(let i = 0; i < response.data.body.data.length; i++) {
        response.data.body.data[i].startTimeOriginal = response.data.body.data[i].startTime
        response.data.body.data[i].endTimeOriginal = response.data.body.data[i].endTime
        response.data.body.data[i].startTime = moment(response.data.body.data[i].startTime).format('YYYY-MM-DD h:mm:ss')
        response.data.body.data[i].endTime = moment(response.data.body.data[i].endTime).format('YYYY-MM-DD h:mm:ss')
      }
      commit("SET_EXAM_DATE", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 保存试卷信息
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/exam/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
   * 删除试卷
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/exam/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}}).then(response => {
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
   * 修改试卷
    * @param dispatch
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdate({dispatch, commit}, data) {
    await axios.put("/api/v1/exam/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
  },

  // --------------------
  /**
   * 根据试卷ID查找学生提交试卷
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doQueryAllStudentExamByExamId({commit}, data) {
    await axios.get("/api/v1/exam/query/studentExamination/" + data).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      // 日期格式化
      for(let i = 0; i < response.data.body.data.length; i++) {
        response.data.body.data[i].timeOriginal = response.data.body.data[i].time
        response.data.body.data[i].time = moment(response.data.body.data[i].time).format('YYYY-MM-DD h:mm:ss')
      }
      console.log("======" + JSON.stringify(response.data.body.data))
      commit("SET_STUDENT_EXAM_DATE", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 批改学生试卷
   * @param dispatch
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdateStudentExam({dispatch, commit}, data) {
    await axios.put("/api/v1/exam/update/studentExamination", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if (response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message, desc: ''});
      } else {
        Notice.success({title: response.data.head.message, desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAllStudentExamByExamId", data.examination);
  },

  /**
   * 查找未提交试卷学员
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doQueryMissStudentExamByExamId({commit}, data) {
    await axios.get("/api/v1/exam/query/studentExamination/" + data.course + "/" + data.examination).then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_MISS_STUDENT_EXAM_DATE", response.data.body.data.miss)
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
