import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI, { Loading, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/reset.css'
import './assets/css/global.css'

import Print from './assets/js/print'
Vue.use(Print)

import VueDND from 'awe-dnd'

Vue.use(VueDND)
import animated from 'animate.css'
// import 'amfe-flexible'
//全局过滤器
import './assets/js/filter.js'
import './assets/js/directive'
Vue.use(ElementUI)
Vue.use(animated)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

let loading = null
let loadingRequestCount = 0
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
axios.interceptors.request.use(config => {
  if (config.params && !config.params.noloading) {
    loading = Loading.service({ lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(10, 10, 10, 0.7)' })
    loadingRequestCount++
  }
  if (config.url.substr(0, 4) === '/api') {
    config.url = 'https://hb.rgoo.com/api/api.php' + config.url.substr(4)
  }
  if (config.url.substr(0, 4) === '/apt') {
    config.url = 'https://hb.rgoo.com/api/api_table.php' + config.url.substr(4)
  }
  if (config.url.substr(0, 4) === '/app') {
    config.url = 'https://hb.rgoo.com/api/api_integral.php' + config.url.substr(4)
  }
  // if (config.url.substr(0, 4) === '/api') {
  //   config.url = 'https://sz.rgoo.com/api/api.php' + config.url.substr(4)
  // }
  // if (config.url.substr(0, 4) === '/apt') {
  //   config.url = 'http://sz.rgoo.com/api/api_table.php' + config.url.substr(4)
  // }
  // if (config.url.substr(0, 4) === '/app') {
  //   config.url = 'https://sz.rgoo.com/api/api_integral.php' + config.url.substr(4)
  // }
  return config
}, error => {
  setTimeout(() => {
    if (loading) {
      loading.close();
    }
    Message.error('请求失败')
  }, 15000)
  return Promise.reject(error)
})
axios.interceptors.response.use((response) => {
  if (loadingRequestCount) {
    loadingRequestCount--
  }
  if (loadingRequestCount === 0) {
    setTimeout(() => {
      if (loading) {
        loading.close();
      };//关闭loading
    }, 100);
  }
  return response;
}, error => {
  setTimeout(() => {
    if (loading) {
      loading.close();
    };
    Message.error('请求失败')
  }, 10000)
  return Promise.reject(error)
})

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
