<template>
  <view class="detail-page" v-if="order">
    <!-- 订单状态 -->
    <view class="status-bar" :style="{ background: statusBg }">
      <u-icon :name="statusIcon" size="56" color="#fff"></u-icon>
      <text class="status-text">{{ status.label }}</text>
      <text class="status-desc">{{ statusDesc }}</text>
    </view>

    <!-- 服务信息 -->
    <view class="info-card">
      <text class="card-label">服务信息</text>
      <view class="service-row" @click="toService">
        <image class="service-img" :src="order.serviceCover || '/static/logo.png'" mode="aspectFill"></image>
        <view class="service-info">
          <text class="service-name">{{ order.serviceName }}</text>
          <text class="service-price">¥{{ $utils.formatPrice(order.amount || 0) }}</text>
        </view>
        <u-icon name="arrow-right" size="28" color="#ccc"></u-icon>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card">
      <text class="card-label">订单信息</text>
      <view class="info-row">
        <text class="info-key">订单编号</text>
        <text class="info-val">{{ order.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="info-key">下单时间</text>
        <text class="info-val">{{ $utils.formatDate(order.createTime) }}</text>
      </view>
      <view class="info-row" v-if="order.reserveTime">
        <text class="info-key">预约时间</text>
        <text class="info-val">{{ $utils.formatDate(order.reserveTime) }}</text>
      </view>
      <view class="info-row" v-if="order.remark">
        <text class="info-key">备注</text>
        <text class="info-val">{{ order.remark }}</text>
      </view>
      <view class="info-row" v-if="order.cancelReason">
        <text class="info-key">取消原因</text>
        <text class="info-val cancel">{{ order.cancelReason }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="showActions">
      <u-button v-if="order.status === 0" type="warning" text="去支付" shape="circle" @click="toPay"></u-button>
      <u-button v-if="order.status === 0" type="default" text="取消订单" shape="circle" @click="onCancel"></u-button>
      <u-button v-if="order.status === 1" type="default" text="取消预约" shape="circle" @click="onCancel"></u-button>
      <u-button v-if="order.status === 2" type="primary" text="确认完成" shape="circle" @click="onConfirm"></u-button>
      <u-button v-if="order.status === 3 && !order.hasReview" type="primary" text="去评价" shape="circle" @click="toReview"></u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      order: null,
      id: ''
    }
  },
  computed: {
    status() {
      return this.$utils.orderStatusMap[this.order?.status] || { label: '未知', color: '#999' }
    },
    statusBg() {
      const map = { 0: '#ff9800', 1: '#3078f7', 2: '#00c853', 3: '#999', 4: '#ccc', 5: '#ff9800' }
      return map[this.order?.status] || '#999'
    },
    statusIcon() {
      const map = { 0: 'clock', 1: 'checkmark-circle', 2: 'play-circle', 3: 'checkmark', 4: 'close-circle', 5: 'refresh' }
      return map[this.order?.status] || 'info-circle'
    },
    statusDesc() {
      const map = { 0: '请尽快完成支付', 1: '请等待服务开始', 2: '服务进行中', 3: '感谢您的使用', 4: '订单已取消', 5: '退款处理中' }
      return map[this.order?.status] || ''
    },
    showActions() {
      return [0, 1, 2, 3].includes(this.order?.status)
    }
  },
  onLoad(options) {
    this.id = options.id
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      try {
        const res = await this.$api.orderApi.getDetail(this.id)
        this.order = res
      } catch (_) {}
    },
    toPay() {
      uni.navigateTo({ url: `/pages/order/pay?id=${this.id}` })
    },
    toReview() {
      uni.navigateTo({ url: `/pages/order/review?id=${this.id}` })
    },
    toService() {
      if (this.order?.serviceId) {
        uni.navigateTo({ url: `/pages/service/detail?id=${this.order.serviceId}` })
      }
    },
    onCancel() {
      uni.showModal({
        title: '取消订单',
        content: '确定取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$api.orderApi.cancel(this.id, '用户主动取消')
              uni.showToast({ title: '已取消', icon: 'success' })
              this.loadDetail()
            } catch (_) {}
          }
        }
      })
    },
    onConfirm() {
      uni.showModal({
        title: '确认完成',
        content: '确认该服务已完成？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$api.orderApi.confirm(this.id)
              uni.showToast({ title: '已确认', icon: 'success' })
              this.loadDetail()
            } catch (_) {}
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.status-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
}
.status-text {
  font-size: 36rpx;
  color: #fff;
  font-weight: 700;
  margin-top: 16rpx;
}
.status-desc {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 8rpx;
}
.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin: 20rpx;
}
.card-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.service-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.service-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.service-info {
  flex: 1;
}
.service-name {
  font-size: 30rpx;
  color: #333;
}
.service-price {
  font-size: 30rpx;
  color: #ff6b35;
  font-weight: 600;
  margin-top: 8rpx;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.info-row:last-child {
  border-bottom: none;
}
.info-key {
  font-size: 26rpx;
  color: #999;
}
.info-val {
  font-size: 26rpx;
  color: #333;
  max-width: 400rpx;
  text-align: right;
}
.info-val.cancel {
  color: #ff4d4f;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.06);
}
</style>