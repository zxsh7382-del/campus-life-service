<template>
  <view class="msg-item" :class="{ 'msg-unread': !data.isRead }" @click="$emit('click')">
    <view class="msg-icon" :class="iconClass">
      <u-icon :name="icon" size="36" :color="iconColor"></u-icon>
    </view>
    <view class="msg-body">
      <view class="msg-title">
        <text>{{ data.title }}</text>
        <text class="msg-time">{{ $utils.formatDate(data.createTime, 'MM-dd HH:mm') }}</text>
      </view>
      <view class="msg-content">{{ data.content }}</view>
    </view>
    <view class="msg-dot" v-if="!data.isRead"></view>
  </view>
</template>

<script>
export default {
  props: {
    data: { type: Object, default: () => ({}) }
  },
  computed: {
    typeConfig() {
      const map = {
        system: { icon: 'bell', color: '#3078f7', cls: 'msg-system' },
        order: { icon: 'order', color: '#00c853', cls: 'msg-order' },
        service: { icon: 'grid', color: '#ff9800', cls: 'msg-service' }
      }
      return map[this.data.type] || map.system
    },
    icon() { return this.typeConfig.icon },
    iconColor() { return this.typeConfig.color },
    iconClass() { return this.typeConfig.cls }
  }
}
</script>

<style scoped>
.msg-item {
  display: flex;
  align-items: flex-start;
  padding: 28rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
}
.msg-unread {
  background: #f8fbff;
}
.msg-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-system { background: rgba(48,120,247,0.1); }
.msg-order { background: rgba(0,200,83,0.1); }
.msg-service { background: rgba(255,152,0,0.1); }

.msg-body {
  flex: 1;
  margin-left: 20rpx;
  overflow: hidden;
  padding-right: 30rpx;
}
.msg-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}
.msg-time {
  font-size: 24rpx;
  color: #999;
  font-weight: 400;
}
.msg-content {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.msg-dot {
  position: absolute;
  top: 32rpx;
  right: 24rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #ff4d4f;
}
</style>