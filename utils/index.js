// 通用工具函数

// 格式化日期
const formatDate = (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  if (!date) return ''
  const d = new Date(date)
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'H+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 手机号验证
const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 验证码格式验证
const validateCode = (code) => {
  return /^\d{4,6}$/.test(code)
}

// 本地存储封装
const storage = {
  get(key) {
    return uni.getStorageSync(key)
  },
  set(key, value) {
    uni.setStorageSync(key, value)
  },
  remove(key) {
    uni.removeStorageSync(key)
  },
  clear() {
    uni.clearStorageSync()
  }
}

// 防抖
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
const throttle = (fn, delay = 300) => {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

// 价格格式化（分转元）
const formatPrice = (price) => {
  return (price / 100).toFixed(2)
}

// 订单状态映射
const orderStatusMap = {
  0: { label: '待付款', color: '#ff6b35' },
  1: { label: '待服务', color: '#3078f7' },
  2: { label: '服务中', color: '#00c853' },
  3: { label: '已完成', color: '#999' },
  4: { label: '已取消', color: '#ccc' },
  5: { label: '退款中', color: '#ff9800' }
}

export default {
  formatDate,
  validatePhone,
  validateCode,
  storage,
  debounce,
  throttle,
  formatPrice,
  orderStatusMap
}