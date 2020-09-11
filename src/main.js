import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/reset.css'
import './assets/css/global.css'

import VueDND from 'awe-dnd'

Vue.use(VueDND)
import animated from 'animate.css'
// import 'amfe-flexible'
//全局过滤器
import './assets/js/filter.js'
Vue.use(ElementUI)
Vue.use(animated)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

let loading = null
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
axios.interceptors.request.use(config => {
  loading = Loading.service({ lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
  if (config.url.substr(0, 4) === '/api') {
    config.url = 'https://hb.rgoo.com/api/api.php' + config.url.substr(4)
  }
  if (config.url.substr(0, 4) === '/apt') {
    config.url = 'http://hb.rgoo.com/api/api_table.php' + config.url.substr(4)
  }
  return config
})

axios.interceptors.response.use((response) => {
  loading.close();//关闭loading
  return response;
})

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
