<template>
  <view class="empty-state">
    <u-icon :name="icon" :size="size" color="#ccc"></u-icon>
    <text class="empty-text">{{ text }}</text>
    <u-button v-if="showBtn" type="primary" size="mini" :text="btnText" @click="$emit('action')"></u-button>
  </view>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: 'file-text' },
    text: { type: String, default: '暂无数据' },
    size: { type: Number, default: 120 },
    showBtn: { type: Boolean, default: false },
    btnText: { type: String, default: '去逛逛' }
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}
.empty-text {
  color: #999;
  font-size: 28rpx;
  margin: 30rpx 0;
}
</style>