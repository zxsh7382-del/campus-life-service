// main.js - 入口文件
import Vue from 'vue'
import App from './App'
// 引入 uView UI 主文件
import uView from "uni_modules/uview-ui"
// 引入 Vuex 状态管理
import store from './store'

// 标识为应用根组件（uni-app 必须）
App.mpType = 'app'

// 使用 uView 插件
Vue.use(uView)

// 关闭生产环境提示
Vue.config.productionTip = false

// 挂载全局工具
import utils from './utils'
Vue.prototype.$utils = utils

// 挂载全局 API
import * as api from './api'
Vue.prototype.$api = api

// 实例化 Vue 根实例
const app = new Vue({
  store,
  ...App
})

// 挂载到全局
app.$mount()