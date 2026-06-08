// 网络请求封装 - 基于 uni.request 二次封装
// 统一处理请求拦截、响应格式化、Token注入、错误捕获

const BASE_URL = 'https://api.campus-life.example.com/v1'

// 请求拦截器队列
const requestInterceptors = []
// 响应拦截器队列
const responseInterceptors = []

let pendingRequests = 0
let loadingTimer = null

const request = (options = {}) => {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    showLoading = true,
    loadingText = '加载中...'
  } = options

  // 显示加载中
  if (showLoading) {
    pendingRequests++
    if (pendingRequests === 1) {
      loadingTimer = setTimeout(() => {
        uni.showLoading({ title: loadingText, mask: true })
      }, 300)
    }
  }

  // Token 注入
  const token = uni.getStorageSync('token')
  const defaultHeader = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: { ...defaultHeader, ...header },
      success: (res) => {
        const { statusCode, data: resData } = res

        if (statusCode === 200) {
          if (resData.code === 0 || resData.code === 200) {
            resolve(resData.data || resData)
          } else if (resData.code === 401) {
            // Token 过期，清除登录态
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            uni.reLaunch({ url: '/pages/user/login' })
            reject(new Error('登录已过期，请重新登录'))
          } else {
            uni.showToast({ title: resData.message || '请求失败', icon: 'none' })
            reject(new Error(resData.message || '请求失败'))
          }
        } else if (statusCode === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.reLaunch({ url: '/pages/user/login' })
          reject(new Error('登录已过期，请重新登录'))
        } else {
          uni.showToast({ title: `请求失败(${statusCode})`, icon: 'none' })
          reject(new Error(`HTTP ${statusCode}`))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请检查网络', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (showLoading) {
          pendingRequests--
          if (pendingRequests === 0) {
            clearTimeout(loadingTimer)
            uni.hideLoading()
          }
        }
      }
    })
  })
}

// 便捷方法
const get = (url, data, options) => request({ url, method: 'GET', data, ...options })
const post = (url, data, options) => request({ url, method: 'POST', data, ...options })
const put = (url, data, options) => request({ url, method: 'PUT', data, ...options })
const del = (url, data, options) => request({ url, method: 'DELETE', data, ...options })

export default { request, get, post, put, del }