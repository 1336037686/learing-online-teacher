import axios from "axios";
import { Notice } from 'view-design';
import store from "../index";
import da from "element-ui/src/locale/lang/da";

const state = {
  studentData: [],
  size: 20,
  saveLoding: false
}

const mutations = {
  SET_STUDENT_DATE:(state, data) => {
    state.studentData = data
  },
  SET_SAVE_LODING:(state, data) => {
    state.saveLoding = data
  }
}

const actions = {

  /**
   * 根据课程ID查看所有选课学生
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllByCourse({commit}, data) {
    await axios.get("/api/v1/studentCourse/query/course/" + data + "/2").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_STUDENT_DATE", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 修改审核
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doUpdateCheckState({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.put("/api/v1/studentCourse/update", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
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
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 根据课程ID查看所有审核通过的选课学生
   * @param commit
   * @returns {Promise<void>}
   */
  async doQueryAllPassByCourse({commit}, data) {
    await axios.get("/api/v1/studentCourse/query/course/" + data + "/1").then(response => {
      if(response.data.head.responseCode != "200") this.$Notice.error({title: response.data.head.message , desc: ''});
      commit("SET_STUDENT_DATE", response.data.body.data)
    }).catch(error => {
      console.log(error)
    })
  },


  /**
   * 保存选课学生
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doSave({dispatch, commit}, data) {
    commit("SET_SAVE_LODING", true)
    await axios.post("/api/v1/studentCourse/save", {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}).then(response => {
      if(response.data.head.responseCode !== "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    });
    //重新查找
    await dispatch("doQueryAllPassByCourse", data.course);
    commit("SET_SAVE_LODING", false)
  },

  /**
   * 删除选课学生
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doRemove({dispatch, commit}, data) {
    await axios.delete("/api/v1/studentCourse/remove", {data: {"head": {"token": store.state.loginManage.token}, "body":{"data": data}}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    //重新查找
    await dispatch("doQueryAllPassByCourse", data.course)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
