// Vuex 全局状态管理

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// ==================== 用户模块 ====================
const user = {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : null,
    isLogin: !!uni.getStorageSync('token')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      state.isLogin = !!token
      if (token) {
        uni.setStorageSync('token', token)
      } else {
        uni.removeStorageSync('token')
      }
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      if (userInfo) {
        uni.setStorageSync('userInfo', JSON.stringify(userInfo))
      } else {
        uni.removeStorageSync('userInfo')
      }
    },
    LOGOUT(state) {
      state.token = ''
      state.userInfo = null
      state.isLogin = false
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  },
  actions: {
    login({ commit }, { token, userInfo }) {
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
    updateUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  getters: {
    token: state => state.token,
    userInfo: state => state.userInfo,
    isLogin: state => state.isLogin,
    userId: state => state.userInfo?.id || '',
    avatar: state => state.userInfo?.avatar || '/static/logo.png',
    nickname: state => state.userInfo?.nickname || '未登录'
  }
}

// ==================== 订单模块 ====================
const order = {
  namespaced: true,
  state: {
    currentTab: 0,
    tabs: [
      { label: '全部', status: '' },
      { label: '待付款', status: 0 },
      { label: '待服务', status: 1 },
      { label: '服务中', status: 2 },
      { label: '已完成', status: 3 }
    ],
    unpayCount: 0
  },
  mutations: {
    SET_CURRENT_TAB(state, index) {
      state.currentTab = index
    },
    SET_UNPAY_COUNT(state, count) {
      state.unpayCount = count
    }
  },
  actions: {},
  getters: {
    currentTab: state => state.currentTab,
    tabs: state => state.tabs,
    currentStatus: state => state.tabs[state.currentTab]?.status,
    unpayCount: state => state.unpayCount
  }
}

// ==================== 消息模块 ====================
const message = {
  namespaced: true,
  state: {
    unreadCount: 0
  },
  mutations: {
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count
    }
  },
  actions: {
    decrementUnread({ commit, state }) {
      if (state.unreadCount > 0) {
        commit('SET_UNREAD_COUNT', state.unreadCount - 1)
      }
    }
  },
  getters: {
    unreadCount: state => state.unreadCount
  }
}

const store = new Vuex.Store({
  modules: { user, order, message }
})

export default store