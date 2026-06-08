<template>
  <view class="home-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar" @click="toSearch">
      <u-icon name="search" size="32" color="#999"></u-icon>
      <text class="search-placeholder">搜索服务</text>
    </view>

    <!-- 轮播图 -->
    <u-swiper
      v-if="banners.length"
      :list="banners"
      height="320"
      radius="12"
      imgMode="aspectFill"
      @click="onBannerClick"
    ></u-swiper>

    <!-- 功能导航 -->
    <u-grid :col="4" :border="false">
      <u-grid-item v-for="item in navList" :key="item.text" @click="onNavClick(item)">
        <u-icon :name="item.icon" :size="item.size || 44" :color="item.color"></u-icon>
        <text class="grid-text">{{ item.text }}</text>
      </u-grid-item>
    </u-grid>

    <!-- 热门服务 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门服务</text>
        <text class="section-more" @click="toServiceList">更多</text>
      </view>
      <scroll-view scroll-x class="hot-scroll" v-if="hotServices.length">
        <view class="hot-list">
          <view
            class="hot-item"
            v-for="item in hotServices"
            :key="item.id"
            @click="toServiceDetail(item)"
          >
            <image class="hot-img" :src="item.cover || '/static/logo.png'" mode="aspectFill"></image>
            <text class="hot-name">{{ item.name }}</text>
            <text class="hot-price" v-if="item.price">¥{{ item.price / 100 }}</text>
            <text class="hot-price free" v-else>免费</text>
          </view>
        </view>
      </scroll-view>
      <empty-state v-else icon="file-text" text="暂无热门服务"></empty-state>
    </view>

    <!-- 推荐服务列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">为你推荐</text>
      </view>
      <service-card
        v-for="item in recommendList"
        :key="item.id"
        :data="item"
        @click="toServiceDetail(item)"
      ></service-card>
      <u-loadmore v-if="recommendList.length" :status="loadStatus" />
      <empty-state v-if="!recommendList.length && !loading" icon="file-text" text="暂无推荐服务"></empty-state>
    </view>
  </view>
</template>

<script>
import ServiceCard from '@/components/service-card.vue'
import EmptyState from '@/components/empty-state.vue'

export default {
  components: { ServiceCard, EmptyState },
  data() {
    return {
      banners: [],
      hotServices: [],
      recommendList: [],
      loading: false,
      page: 1,
      loadStatus: 'loadmore',
      navList: [
        { text: '服务大厅', icon: 'grid', color: '#3078f7', url: '/pages/service/list' },
        { text: '我的订单', icon: 'order', color: '#ff9800', url: '/pages/order/list' },
        { text: '消息中心', icon: 'bell', color: '#00c853', url: '/pages/message/list' },
        { text: '个人中心', icon: 'account', color: '#9c27b0', url: '/pages/mine/mine' }
      ]
    }
  },
  onLoad() {
    this.loadBanners()
    this.loadHotServices()
    this.loadRecommend()
  },
  onPullDownRefresh() {
    this.page = 1
    this.recommendList = []
    Promise.all([this.loadBanners(), this.loadHotServices(), this.loadRecommend()]).finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    if (this.loadStatus === 'loadmore') {
      this.page++
      this.loadRecommend()
    }
  },
  methods: {
    async loadBanners() {
      try {
        const res = await this.$api.homeApi.getBanners()
        this.banners = (res || []).map(item => ({
          image: item.image || item.url,
          title: item.title
        }))
      } catch (_) {}
    },
    async loadHotServices() {
      try {
        const res = await this.$api.homeApi.getHotServices()
        this.hotServices = res || []
      } catch (_) {}
    },
    async loadRecommend() {
      this.loading = true
      this.loadStatus = 'loading'
      try {
        const res = await this.$api.serviceApi.getList({ page: this.page, pageSize: 10 })
        const list = res.records || res.list || []
        if (this.page === 1) {
          this.recommendList = list
        } else {
          this.recommendList = [...this.recommendList, ...list]
        }
        this.loadStatus = list.length < 10 ? 'nomore' : 'loadmore'
      } catch (_) {
        this.loadStatus = 'loadmore'
      } finally {
        this.loading = false
      }
    },
    toSearch() {
      uni.navigateTo({ url: '/pages/service/list?focus=1' })
    },
    onBannerClick(index) {
      const item = this.banners[index]
      if (item?.serviceId) {
        this.toServiceDetail({ id: item.serviceId })
      }
    },
    onNavClick(item) {
      if (item.url) {
        uni[item.url.startsWith('/pages/index') ? 'switchTab' : 'navigateTo']({ url: item.url })
      }
    },
    toServiceList() {
      uni.navigateTo({ url: '/pages/service/list' })
    },
    toServiceDetail(item) {
      uni.navigateTo({ url: `/pages/service/detail?id=${item.id}` })
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 0 0 24rpx;
}
.search-bar {
  display: flex;
  align-items: center;
  margin: 16rpx 24rpx;
  padding: 18rpx 24rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
}
.search-placeholder {
  font-size: 28rpx;
  color: #999;
  margin-left: 12rpx;
}
.grid-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}
.section {
  margin-top: 24rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #333;
}
.section-more {
  font-size: 26rpx;
  color: #3078f7;
}
.hot-scroll {
  white-space: nowrap;
}
.hot-list {
  display: inline-flex;
  gap: 20rpx;
  padding: 0 24rpx;
}
.hot-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 160rpx;
}
.hot-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  background: #f5f5f5;
}
.hot-name {
  font-size: 26rpx;
  color: #333;
  margin-top: 10rpx;
  width: 140rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hot-price {
  font-size: 26rpx;
  color: #ff6b35;
  font-weight: 600;
  margin-top: 4rpx;
}
.hot-price.free {
  color: #00c853;
}
</style>