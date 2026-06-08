<template>
  <view class="login-page">
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">校园生活服务</text>
      <text class="app-slogan">一站式校园服务平台</text>
    </view>

    <view class="login-form">
      <u-form :model="form" ref="loginForm">
        <u-form-item>
          <u-input
            v-model="form.phone"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            prefixIcon="phone"
          />
        </u-form-item>
        <u-form-item>
          <u-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            prefixIcon="lock"
          />
        </u-form-item>
      </u-form>

      <view class="login-options">
        <text class="forgot-pwd" @click="onForgotPwd">忘记密码？</text>
      </view>

      <u-button
        type="primary"
        text="登 录"
        shape="circle"
        :loading="loading"
        @click="onLogin"
      ></u-button>

      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link-text" @click="toRegister">立即注册</text>
      </view>

      <!-- 快捷登录方式 -->
      <view class="quick-login">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">其他方式登录</text>
          <view class="divider-line"></view>
        </view>
        <view class="quick-icons">
          <view class="quick-item" @click="onWechatLogin">
            <u-icon name="weixin-fill" size="48" color="#07c160"></u-icon>
            <text>微信</text>
          </view>
          <view class="quick-item" @click="onPhoneLogin">
            <u-icon name="phone-fill" size="48" color="#3078f7"></u-icon>
            <text>手机号</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    async onLogin() {
      if (!this.form.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }
      if (!this.$utils.validatePhone(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.form.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }

      this.loading = true
      try {
        const res = await this.$api.userApi.login({
          phone: this.form.phone,
          password: this.form.password
        })
        this.$store.dispatch('user/login', {
          token: res.token,
          userInfo: res.userInfo
        })
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 500)
      } catch (e) {
        console.error('登录失败:', e)
      } finally {
        this.loading = false
      }
    },
    toRegister() {
      uni.navigateTo({ url: '/pages/user/register' })
    },
    onForgotPwd() {
      uni.showToast({ title: '请联系管理员重置密码', icon: 'none' })
    },
    onWechatLogin() {
      uni.showToast({ title: '微信登录开发中', icon: 'none' })
    },
    onPhoneLogin() {
      uni.showToast({ title: '一键登录开发中', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  padding: 60rpx 48rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}
.logo {
  width: 120rpx;
  height: 120rpx;
}
.app-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #333;
  margin-top: 20rpx;
}
.app-slogan {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.login-form {
  margin-top: 40rpx;
}

.login-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40rpx;
}
.forgot-pwd {
  font-size: 26rpx;
  color: #3078f7;
}

.register-link {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #999;
}
.link-text {
  color: #3078f7;
  margin-left: 8rpx;
}

.quick-login {
  margin-top: 100rpx;
}
.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}
.divider-line {
  flex: 1;
  height: 1rpx;
  background: #eee;
}
.divider-text {
  font-size: 24rpx;
  color: #ccc;
  margin: 0 24rpx;
}
.quick-icons {
  display: flex;
  justify-content: center;
  gap: 80rpx;
}
.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  gap: 12rpx;
}
</style>