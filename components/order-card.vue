<template>
  <view class="order-card" @click="$emit('click')">
    <view class="order-header">
      <text class="order-no">订单号：{{ data.orderNo }}</text>
      <text class="order-status" :style="{ color: status.color }">{{ status.label }}</text>
    </view>
    <view class="order-body">
      <image class="order-img" :src="data.serviceCover || '/static/logo.png'" mode="aspectFill"></image>
      <view class="order-info">
        <text class="order-name">{{ data.serviceName }}</text>
        <text class="order-time">{{ $utils.formatDate(data.createTime) }}</text>
      </view>
    </view>
    <view class="order-footer">
      <text class="order-price">¥{{ $utils.formatPrice(data.amount || 0) }}</text>
      <view class="order-actions">
        <u-button v-if="data.status === 0" size="mini" type="warning" text="去支付" @click.stop="$emit('pay')"></u-button>
        <u-button v-if="data.status === 0" size="mini" type="default" text="取消" @click.stop="$emit('cancel')"></u-button>
        <u-button v-if="data.status === 1" size="mini" type="default" text="取消预约" @click.stop="$emit('cancel')"></u-button>
        <u-button v-if="data.status === 2" size="mini" type="primary" text="确认完成" @click.stop="$emit('confirm')"></u-button>
        <u-button v-if="data.status === 3 && !data.hasReview" size="mini" type="primary" text="去评价" @click.stop="$emit('review')"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: { type: Object, default: () => ({}) }
  },
  computed: {
    status() {
      return this.$utils.orderStatusMap[this.data.status] || { label: '未知', color: '#999' }
    }
  }
}
</script>

<style scoped>
.order-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.order-no {
  font-size: 24rpx;
  color: #999;
}
.order-status {
  font-size: 26rpx;
  font-weight: 600;
}
.order-body {
  display: flex;
  gap: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.order-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.order-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}
.order-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}
.order-price {
  font-size: 34rpx;
  font-weight: 700;
  color: #ff6b35;
}
.order-actions {
  display: flex;
  gap: 16rpx;
}
</style>