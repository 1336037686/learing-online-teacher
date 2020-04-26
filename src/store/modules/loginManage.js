//人脸检测API
import axios from "axios";
import { Notice } from 'view-design';

const state = {
  id: '',
  userName: '',
  token: '',
  loginLoding: false
}

const mutations = {
  SET_DATA:(state, data) => {
    state.id = data.id
    state.userName = data.userName
    state.token = data.token
    // 保存基础信息到sessionStorage中
    sessionStorage.setItem("userInfo", JSON.stringify({"id": data.id, "userName": data.userName, "token": data.token}))
  },
  SET_LOGIN_LODING:(state, data) => {
    state.loginLoding = data
  }
}

const actions = {

  /**
   * 登陆
   * @param commit
   * @param data
   * @returns {Promise<void>}
   */
  async doLogin({dispatch, commit}, data) {
    commit("SET_LOGIN_LODING", true)
    await axios.post("/api/v1/teacher/login", {"body":{"data": data}}).then(response => {
      if(response.data.head.responseCode != "200") {
        Notice.error({title: response.data.head.message , desc: ''});
      } else {
        commit("SET_DATA", response.data.body.data)
        Notice.success({title: response.data.head.message , desc: ''});
      }
    }).catch(error => {
      console.log(error)
    })
    commit("SET_LOGIN_LODING", false)
  },

  /**
   * 退出
   * @param dispatch
   * @param commit
   * @returns {Promise<void>}
   */
  async doLogout({commit}) {
    commit("SET_DATA", {"userName": '', "token": '', "id": ''})
    sessionStorage.clear()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
