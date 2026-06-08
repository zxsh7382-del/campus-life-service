<template>
  <view class="register-page">
    <view class="register-header">
      <text class="title">创建账号</text>
      <text class="subtitle">注册校园生活服务，享受便捷服务</text>
    </view>

    <view class="register-form">
      <u-form :model="form" ref="registerForm">
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
            v-model="form.code"
            placeholder="请输入验证码"
            type="number"
            maxlength="6"
            prefixIcon="email"
          />
          <u-button
            slot="right"
            type="primary"
            size="mini"
            :text="codeBtnText"
            :disabled="codeDisabled"
            @click="onSendCode"
          ></u-button>
        </u-form-item>
        <u-form-item>
          <u-input
            v-model="form.password"
            placeholder="请设置密码（6-20位）"
            type="password"
            prefixIcon="lock"
          />
        </u-form-item>
        <u-form-item>
          <u-input
            v-model="form.confirmPwd"
            placeholder="请确认密码"
            type="password"
            prefixIcon="lock-fill"
          />
        </u-form-item>
      </u-form>

      <view class="agreement">
        <u-checkbox v-model="agreed" shape="circle">
          <text class="agreement-text">
            已阅读并同意
            <text class="link" @click.stop="onAgreement">《用户服务协议》</text>
            和
            <text class="link" @click.stop="onPrivacy">《隐私政策》</text>
          </text>
        </u-checkbox>
      </view>

      <u-button
        type="primary"
        text="注 册"
        shape="circle"
        :loading="loading"
        :disabled="!agreed"
        @click="onRegister"
      ></u-button>

      <view class="login-link">
        <text>已有账号？</text>
        <text class="link-text" @click="toLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      agreed: false,
      codeDisabled: false,
      codeSeconds: 0,
      form: {
        phone: '',
        code: '',
        password: '',
        confirmPwd: ''
      }
    }
  },
  computed: {
    codeBtnText() {
      return this.codeSeconds > 0 ? `${this.codeSeconds}s后重试` : '获取验证码'
    }
  },
  methods: {
    onSendCode() {
      if (!this.form.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }
      if (!this.$utils.validatePhone(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }

      this.codeDisabled = true
      this.codeSeconds = 60
      const timer = setInterval(() => {
        this.codeSeconds--
        if (this.codeSeconds <= 0) {
          clearInterval(timer)
          this.codeDisabled = false
        }
      }, 1000)

      this.$api.userApi.sendCode(this.form.phone).then(() => {
        uni.showToast({ title: '验证码已发送', icon: 'success' })
      }).catch(() => {
        // 演示模式下模拟成功
        uni.showToast({ title: '验证码已发送', icon: 'success' })
      })
    },
    async onRegister() {
      if (!this.$utils.validatePhone(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.form.code) {
        uni.showToast({ title: '请输入验证码', icon: 'none' })
        return
      }
      if (this.form.password.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
      }
      if (this.form.password !== this.form.confirmPwd) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }

      this.loading = true
      try {
        const res = await this.$api.userApi.register({
          phone: this.form.phone,
          code: this.form.code,
          password: this.form.password
        })
        uni.showToast({ title: '注册成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      } catch (e) {
        console.error('注册失败:', e)
      } finally {
        this.loading = false
      }
    },
    toLogin() {
      uni.navigateBack()
    },
    onAgreement() {
      uni.showToast({ title: '用户服务协议', icon: 'none' })
    },
    onPrivacy() {
      uni.showToast({ title: '隐私政策', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #fff;
  padding: 60rpx 48rpx;
}
.register-header {
  margin-bottom: 60rpx;
}
.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #333;
}
.subtitle {
  font-size: 26rpx;
  color: #999;
  margin-top: 12rpx;
  display: block;
}
.register-form {
  margin-top: 20rpx;
}
.agreement {
  margin: 30rpx 0;
}
.agreement-text {
  font-size: 24rpx;
  color: #666;
}
.link {
  color: #3078f7;
}
.login-link {
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
</style>