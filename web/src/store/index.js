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
  page: 0,
  personList:[]
}

export default new Vuex.Store({
    actions,
    mutations,
    state
})