<template>
  <view class="service-card" @click="$emit('click')">
    <image class="card-img" :src="data.cover || '/static/logo.png'" mode="aspectFill"></image>
    <view class="card-body">
      <view class="card-title">{{ data.name }}</view>
      <view class="card-desc">{{ data.description || data.desc || '' }}</view>
      <view class="card-footer">
        <text class="card-price" v-if="data.price">¥{{ data.price / 100 }}</text>
        <text class="card-price" v-else>免费</text>
        <view class="card-tag" v-if="data.categoryName">
          <text>{{ data.categoryName }}</text>
        </view>
      </view>
    </view>
    <view class="card-badge" v-if="data.isHot">
      <text>热门</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: { type: Object, default: () => ({}) }
  }
}
</script>

<style scoped>
.service-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
  position: relative;
}
.card-img {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}
.card-body {
  flex: 1;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.card-desc {
  font-size: 24rpx;
  color: #999;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-price {
  font-size: 34rpx;
  font-weight: 700;
  color: #ff6b35;
}
.card-tag {
  font-size: 22rpx;
  color: #3078f7;
  background: rgba(48,120,247,0.1);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.card-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b35, #ff9800);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 20rpx;
  border-radius: 0 16rpx 0 16rpx;
}
</style>