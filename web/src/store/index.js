import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const actions = {

}

const mutations = {
  changePage(state,value){
      state.page = value
  }
}

const state = {
  //存储的是当前浏览器展示哪个页面
  page: 0,

  //存储的是按拼音排序的人员列表
  personList:[],

  //存储的是当前人员列表中id的最大值
  maxId: 0
}

export default new Vuex.Store({
    actions,
    mutations,
    state
})