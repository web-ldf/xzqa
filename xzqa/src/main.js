import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入mint-ui
import MintUI from 'mint-ui';
//导入mint-ui样式文件
import 'mint-ui/lib/style.min.css'
//使用mint-ui
Vue.use(MintUI);

//导入axios
import axios from 'axios';
//设置axios请求基础地址
axios.defaults.baseURL='http://127.0.0.1:5050';
//设置axios为全局对象
Vue.prototype.axios=axios;
//QS(QueryString)
import qs from 'qs'
//设置qs为全局对象
Vue.prototype.qs=qs;

//moment
import moment from 'moment';
Vue.prototype.moment=moment;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
