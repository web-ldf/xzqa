import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Article from '../views/Article.vue'
import Me from '../views/Me.vue'
import ProFile from '../views/ProFile.vue'
import Posts from '../views/Posts.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import store from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path:'/article/:id',
    name:"Article",
    component:Article
  },
  {
    path:'/me',
    component:Me,
    //源数据
    meta: {
      //自己定义的名称（需要验证）
      requiresAuth:true
    }
  },
  {
    path:'/profile',
    component:ProFile,
    //源数据
    meta: {
      //自己定义的名称（需要验证）
      requiresAuth:true
    }
  },
  {
    path:'/posts',
    component:Posts,
    //源数据
    meta: {
      //自己定义的名称（需要验证）
      requiresAuth:true
    }
  },
  {
    path:'/register',
    component:Register
  },
  {
    path:'/login',
    component:Login
  }
  /* {
    path: '/about',
    name: 'About', */
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  //}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//to 去什么地方 from 从什么地方来 next是下一步需要完成什么
router.beforeEach((to,from,next)=>{
  if(to.matched.some(r=>r.meta.requiresAuth)){
     if(store.state.isLogined){
       next();
     }else{
       router.push({path:'/login',query:{path:to.fullPath}});
     }
  }else{
    next();
  }
})
export default router
