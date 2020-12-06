import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id:'',
    username:"",
    nickname:"",
    article_number:'',
    isLogined:false
  },
  mutations: {
    minusArticleMutations(state,payload){
      state.article_number-=payload;
    },
    updateNicknameMutations(state,payload){
      state.nickname=payload;
    },
    //登录方法的信息
    loginedMutations(state,payload){
      state.id=payload.id;
      state.username=payload.username;
      state.nickname=payload.nickname;
      state.article_number=payload.article_number;
      state.isLogined=true;
    },
    loginoutMutations(state){
      state.id='';
      state.username='';
      state.nickname='';
      state.article_number='';
      state.isLogined=false;
    }
  },
  actions: {
  },
  modules: {
  }
})
