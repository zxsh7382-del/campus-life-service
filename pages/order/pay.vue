<template>
  <view class="pay-page">
    <!-- 支付金额 -->
    <view class="pay-amount">
      <text class="amount-label">支付金额</text>
      <text class="amount-value">¥{{ $utils.formatPrice(amount) }}</text>
    </view>

    <!-- 支付方式 -->
    <view class="pay-methods">
      <text class="section-title">选择支付方式</text>
      <u-radio-group v-model="payType">
        <view class="method-item" v-for="item in methods" :key="item.value" @click="payType = item.value">
          <view class="method-left">
            <u-icon :name="item.icon" size="44" :color="item.color"></u-icon>
            <text class="method-name">{{ item.label }}</text>
          </view>
          <u-radio :name="item.value" shape="circle"></u-radio>
        </view>
      </u-radio-group>
    </view>

    <!-- 支付按钮 -->
    <u-button
      type="primary"
      text="确认支付"
      shape="circle"
      :loading="loading"
      @click="onPay"
    ></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      amount: 0,
      payType: 'wechat',
      loading: false,
      methods: [
        { label: '微信支付', value: 'wechat', icon: 'weixin-fill', color: '#07c160' },
        { label: '支付宝', value: 'alipay', icon: 'zhifubao-circle-fill', color: '#1677ff' },
        { label: '校园卡', value: 'card', icon: 'coupon', color: '#ff9800' }
      ]
    }
  },
  onLoad(options) {
    this.id = options.id
    this.loadOrder()
  },
  methods: {
    async loadOrder() {
      try {
        const res = await this.$api.orderApi.getDetail(this.id)
        this.amount = res.amount || 0
      } catch (_) {}
    },
    async onPay() {
      this.loading = true
      try {
        const res = await this.$api.orderApi.pay(this.id)
        // 模拟调起支付
        uni.showToast({ title: '支付成功', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({ url: `/pages/order/detail?id=${this.id}` })
        }, 800)
      } catch (_) {
        uni.showToast({ title: '支付失败，请重试', icon: 'none' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.pay-page {
  padding: 24rpx;
}
.pay-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}
.amount-label {
  font-size: 28rpx;
  color: #999;
}
.amount-value {
  font-size: 64rpx;
  font-weight: 700;
  color: #ff6b35;
  margin-top: 16rpx;
}
.pay-methods {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 60rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.method-item:last-child {
  border-bottom: none;
}
.method-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.method-name {
  font-size: 30rpx;
  color: #333;
}
</style>