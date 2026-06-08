// API 接口模块 - 按业务域拆分

import http from '@/utils/request.js'

// ==================== 用户模块 ====================
export const userApi = {
  // 登录
  login(data) {
    return http.post('/user/login', data, { showLoading: true, loadingText: '登录中...' })
  },
  // 注册
  register(data) {
    return http.post('/user/register', data, { showLoading: true, loadingText: '注册中...' })
  },
  // 发送验证码
  sendCode(phone) {
    return http.post('/user/send-code', { phone })
  },
  // 获取用户信息
  getUserInfo() {
    return http.get('/user/info')
  },
  // 更新用户信息
  updateUserInfo(data) {
    return http.put('/user/info', data)
  },
  // 上传头像
  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: 'https://api.campus-life.example.com/v1/user/avatar',
        filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => resolve(JSON.parse(res.data)),
        fail: reject
      })
    })
  }
}

// ==================== 服务模块 ====================
export const serviceApi = {
  // 获取服务分类
  getCategories() {
    return http.get('/service/categories')
  },
  // 获取服务列表
  getList(params) {
    return http.get('/service/list', params)
  },
  // 获取服务详情
  getDetail(id) {
    return http.get(`/service/detail/${id}`)
  },
  // 收藏/取消收藏
  toggleFavorite(serviceId) {
    return http.post('/service/favorite', { serviceId })
  },
  // 获取收藏列表
  getFavorites() {
    return http.get('/service/favorites')
  },
  // 提交预约
  submitReserve(data) {
    return http.post('/service/reserve', data, { showLoading: true, loadingText: '提交中...' })
  }
}

// ==================== 订单模块 ====================
export const orderApi = {
  // 获取订单列表
  getList(params) {
    return http.get('/order/list', params)
  },
  // 获取订单详情
  getDetail(id) {
    return http.get(`/order/detail/${id}`)
  },
  // 取消订单
  cancel(id, reason) {
    return http.post(`/order/cancel/${id}`, { reason })
  },
  // 确认完成
  confirm(id) {
    return http.post(`/order/confirm/${id}`)
  },
  // 提交评价
  submitReview(data) {
    return http.post('/order/review', data, { showLoading: true, loadingText: '提交中...' })
  },
  // 支付
  pay(orderId) {
    return http.post('/order/pay', { orderId }, { showLoading: true, loadingText: '支付中...' })
  }
}

// ==================== 消息模块 ====================
export const messageApi = {
  // 获取消息列表
  getList(params) {
    return http.get('/message/list', params)
  },
  // 获取未读数量
  getUnreadCount() {
    return http.get('/message/unread-count')
  },
  // 标记已读
  markRead(messageId) {
    return http.post('/message/read', { messageId })
  },
  // 全部已读
  markAllRead() {
    return http.post('/message/read-all')
  }
}

// ==================== 首页模块 ====================
export const homeApi = {
  // 获取轮播图
  getBanners() {
    return http.get('/home/banners')
  },
  // 获取热门服务
  getHotServices() {
    return http.get('/home/hot-services')
  },
  // 搜索服务
  search(keyword) {
    return http.get('/home/search', { keyword })
  }
}