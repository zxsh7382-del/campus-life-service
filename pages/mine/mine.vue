<template>
  <view class="mine-page">
    <!-- 用户信息卡片 -->
    <view class="user-card" @click="toProfile">
      <image class="avatar" :src="avatar" mode="aspectFill"></image>
      <view class="user-info">
        <text class="nickname">{{ nickname }}</text>
        <text class="user-desc" v-if="isLogin">{{ (userInfo && userInfo.phone) || '' }}</text>
        <text class="user-desc" v-else>点击登录</text>
      </view>
      <u-icon name="arrow-right" size="28" color="#ccc"></u-icon>
    </view>

    <!-- 订单快捷入口 -->
    <view class="order-entries">
      <u-grid :col="4" :border="false">
        <u-grid-item v-for="item in orderEntries" :key="item.text" @click="onOrderEntry(item)">
          <u-icon :name="item.icon" size="44" :color="item.color"></u-icon>
          <text class="entry-text">{{ item.text }}</text>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <u-cell-group>
        <u-cell-item
          v-for="item in menuList"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          :icon-style="{ color: item.color }"
          @click="onMenuItem(item)"
        ></u-cell-item>
      </u-cell-group>
    </view>

    <!-- 设置与退出 -->
    <view class="menu-list">
      <u-cell-group>
        <u-cell-item title="意见反馈" icon="edit-pen" @click="onFeedback"></u-cell-item>
        <u-cell-item title="帮助中心" icon="question-circle" @click="onHelp"></u-cell-item>
        <u-cell-item title="设置" icon="setting" @click="onSetting"></u-cell-item>
      </u-cell-group>
    </view>

    <view class="logout-btn" v-if="isLogin">
      <u-button type="default" text="退出登录" shape="circle" @click="onLogout"></u-button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['isLogin', 'userInfo', 'avatar', 'nickname']),
    orderEntries() {
      return [
        { text: '待付款', icon: 'clock', color: '#ff9800', status: 0 },
        { text: '待服务', icon: 'checkmark-circle', color: '#3078f7', status: 1 },
        { text: '已完成', icon: 'checkmark', color: '#00c853', status: 3 },
        { text: '全部订单', icon: 'order', color: '#666', status: '' }
      ]
    },
    menuList() {
      const base = [
        { title: '我的收藏', icon: 'star', color: '#ff9800', url: '/pages/service/list?tab=favorites' },
        { title: '我的评价', icon: 'edit-pen', color: '#3078f7' },
        { title: '收货地址', icon: 'map', color: '#00c853' }
      ]
      return base
    }
  },
  methods: {
    toProfile() {
      if (!this.isLogin) {
        uni.navigateTo({ url: '/pages/user/login' })
        return
      }
      uni.showToast({ title: '个人信息编辑开发中', icon: 'none' })
    },
    onOrderEntry(item) {
      if (!this.isLogin) {
        uni.navigateTo({ url: '/pages/user/login' })
        return
      }
      if (item.status !== undefined) {
        this.$store.commit('order/SET_CURRENT_TAB',
          this.$store.getters['order/tabs'].findIndex(t => t.status === item.status)
        )
      } else {
        this.$store.commit('order/SET_CURRENT_TAB', 0)
      }
      uni.switchTab({ url: '/pages/order/list' })
    },
    onMenuItem(item) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
        return
      }
      uni.showToast({ title: `${item.title}开发中`, icon: 'none' })
    },
    onFeedback() {
      uni.showToast({ title: '意见反馈开发中', icon: 'none' })
    },
    onHelp() {
      uni.showToast({ title: '帮助中心开发中', icon: 'none' })
    },
    onSetting() {
      uni.showToast({ title: '设置开发中', icon: 'none' })
    },
    onLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch('user/logout')
            uni.showToast({ title: '已退出', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.mine-page {
  padding-bottom: 40rpx;
}
.user-card {
  display: flex;
  align-items: center;
  padding: 40rpx 24rpx;
  background: linear-gradient(135deg, #3078f7, #5b9cf5);
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  margin-left: 24rpx;
}
.nickname {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}
.user-desc {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 8rpx;
}
.order-entries {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 16rpx 0;
}
.entry-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}
.menu-list {
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.logout-btn {
  margin: 40rpx 20rpx;
}
</style>