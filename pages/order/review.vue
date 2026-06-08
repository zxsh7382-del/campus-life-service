<template>
  <view class="review-page">
    <!-- 服务信息 -->
    <view class="service-info" v-if="order">
      <image class="service-img" :src="order.serviceCover || '/static/logo.png'" mode="aspectFill"></image>
      <view class="service-text">
        <text class="service-name">{{ order.serviceName }}</text>
        <text class="service-time">{{ $utils.formatDate(order.createTime) }}</text>
      </view>
    </view>

    <!-- 星级评分 -->
    <view class="rating-section">
      <text class="section-title">服务评分</text>
      <view class="star-row">
        <u-rate v-model="form.rating" :count="5" active-color="#ff9800" size="48"></u-rate>
        <text class="rating-text">{{ ratingText }}</text>
      </view>
    </view>

    <!-- 文字评价 -->
    <view class="content-section">
      <text class="section-title">评价内容</text>
      <textarea
        class="review-input"
        v-model="form.content"
        placeholder="分享您的服务体验..."
        maxlength="500"
        :showConfirmBar="false"
      ></textarea>
      <text class="char-count">{{ form.content.length }}/500</text>
    </view>

    <!-- 图片上传 -->
    <view class="upload-section">
      <text class="section-title">上传图片（选填）</text>
      <view class="image-list">
        <view class="image-item" v-for="(img, idx) in form.images" :key="idx">
          <image class="upload-img" :src="img" mode="aspectFill"></image>
          <view class="delete-btn" @click="removeImage(idx)">
            <u-icon name="close" size="28" color="#fff"></u-icon>
          </view>
        </view>
        <view class="upload-btn" v-if="form.images.length < 6" @click="chooseImage">
          <u-icon name="plus" size="48" color="#ccc"></u-icon>
        </view>
      </view>
    </view>

    <!-- 提交 -->
    <u-button
      type="primary"
      text="提交评价"
      shape="circle"
      :loading="loading"
      @click="onSubmit"
    ></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      order: null,
      loading: false,
      form: {
        rating: 0,
        content: '',
        images: []
      }
    }
  },
  computed: {
    ratingText() {
      const map = ['', '非常差', '差', '一般', '好', '非常好']
      return map[this.form.rating] || ''
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
        this.order = res
      } catch (_) {}
    },
    chooseImage() {
      uni.chooseImage({
        count: 6 - this.form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.form.images.push(...res.tempFilePaths)
        }
      })
    },
    removeImage(index) {
      this.form.images.splice(index, 1)
    },
    async onSubmit() {
      if (this.form.rating === 0) {
        uni.showToast({ title: '请评分', icon: 'none' })
        return
      }
      if (!this.form.content.trim()) {
        uni.showToast({ title: '请输入评价内容', icon: 'none' })
        return
      }

      this.loading = true
      try {
        await this.$api.orderApi.submitReview({
          orderId: this.id,
          rating: this.form.rating,
          content: this.form.content,
          images: this.form.images
        })
        uni.showToast({ title: '评价成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      } catch (_) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.review-page {
  padding: 24rpx;
}
.service-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}
.service-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.service-text {
  flex: 1;
}
.service-name {
  font-size: 30rpx;
  color: #333;
}
.service-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
.rating-section,
.content-section,
.upload-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.star-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.rating-text {
  font-size: 28rpx;
  color: #ff9800;
}
.review-input {
  width: 100%;
  height: 200rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}
.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #ccc;
  margin-top: 12rpx;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.image-item {
  position: relative;
}
.upload-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
}
.delete-btn {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-btn {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  border: 2rpx dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}
</style>