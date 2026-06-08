<template>
  <view class="order-page">
    <!-- 订单状态标签 -->
    <u-tabs
      :list="tabs"
      :current="currentTab"
      @change="onTabChange"
      :scrollable="true"
    ></u-tabs>

    <!-- 订单列表 -->
    <view class="order-list">
      <order-card
        v-for="item in list"
        :key="item.id"
        :data="item"
        @click="toDetail(item)"
        @pay="toPay(item)"
        @cancel="onCancel(item)"
        @confirm="onConfirm(item)"
        @review="toReview(item)"
      ></order-card>
      <u-loadmore v-if="list.length" :status="loadStatus" />
      <empty-state
        v-if="!list.length && !loading"
        icon="order"
        text="暂无订单"
        showBtn
        btnText="去逛逛"
        @action="toServiceList"
      ></empty-state>
    </view>
  </view>
</template>

<script>
import OrderCard from '@/components/order-card.vue'
import EmptyState from '@/components/empty-state.vue'

export default {
  components: { OrderCard, EmptyState },
  data() {
    return {
      currentTab: 0,
      list: [],
      loading: false,
      page: 1,
      loadStatus: 'loadmore'
    }
  },
  computed: {
    tabs() {
      return this.$store.getters['order/tabs']
    }
  },
  onLoad() {
    this.loadList()
  },
  onPullDownRefresh() {
    this.page = 1
    this.list = []
    this.loadList().finally(() => uni.stopPullDownRefresh())
  },
  onReachBottom() {
    if (this.loadStatus === 'loadmore') {
      this.page++
      this.loadList()
    }
  },
  methods: {
    async loadList() {
      this.loading = true
      this.loadStatus = 'loading'
      try {
        const status = this.$store.getters['order/currentStatus']
        const params = { page: this.page, pageSize: 10 }
        if (status !== undefined && status !== '') params.status = status
        const res = await this.$api.orderApi.getList(params)
        const records = res.records || res.list || []
        if (this.page === 1) {
          this.list = records
        } else {
          this.list = [...this.list, ...records]
        }
        this.loadStatus = records.length < 10 ? 'nomore' : 'loadmore'
      } catch (_) {
        this.loadStatus = 'loadmore'
      } finally {
        this.loading = false
      }
    },
    onTabChange({ index }) {
      if (this.currentTab === index) return
      this.$store.commit('order/SET_CURRENT_TAB', index)
      this.currentTab = index
      this.page = 1
      this.list = []
      this.loadList()
    },
    toDetail(item) {
      uni.navigateTo({ url: `/pages/order/detail?id=${item.id}` })
    },
    toPay(item) {
      uni.navigateTo({ url: `/pages/order/pay?id=${item.id}` })
    },
    toReview(item) {
      uni.navigateTo({ url: `/pages/order/review?id=${item.id}` })
    },
    async onCancel(item) {
      uni.showModal({
        title: '取消订单',
        content: '确定取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$api.orderApi.cancel(item.id, '用户主动取消')
              uni.showToast({ title: '已取消', icon: 'success' })
              this.page = 1
              this.list = []
              this.loadList()
            } catch (_) {}
          }
        }
      })
    },
    async onConfirm(item) {
      uni.showModal({
        title: '确认完成',
        content: '确认该服务已完成？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$api.orderApi.confirm(item.id)
              uni.showToast({ title: '已确认', icon: 'success' })
              this.page = 1
              this.list = []
              this.loadList()
            } catch (_) {}
          }
        }
      })
    },
    toServiceList() {
      uni.switchTab({ url: '/pages/service/list' })
    }
  }
}
</script>

<style scoped>
.order-page {
  padding-bottom: 24rpx;
}
</style>