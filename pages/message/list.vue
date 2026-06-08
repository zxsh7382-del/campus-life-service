<template>
  <view class="message-page">
    <!-- 顶部操作 -->
    <view class="msg-header" v-if="list.length">
      <text class="unread-tip" v-if="unreadCount">{{ unreadCount }}条未读</text>
      <text class="read-all" @click="onReadAll">全部已读</text>
    </view>

    <!-- 消息列表 -->
    <view class="msg-list">
      <message-item
        v-for="item in list"
        :key="item.id"
        :data="item"
        @click="onMsgClick(item)"
      ></message-item>
      <u-loadmore v-if="list.length" :status="loadStatus" />
      <empty-state
        v-if="!list.length && !loading"
        icon="bell"
        text="暂无消息"
      ></empty-state>
    </view>
  </view>
</template>

<script>
import MessageItem from '@/components/message-item.vue'
import EmptyState from '@/components/empty-state.vue'

export default {
  components: { MessageItem, EmptyState },
  data() {
    return {
      list: [],
      loading: false,
      page: 1,
      loadStatus: 'loadmore'
    }
  },
  computed: {
    unreadCount() {
      return this.list.filter(m => !m.isRead).length
    }
  },
  onLoad() {
    this.loadList()
    this.loadUnreadCount()
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
        const res = await this.$api.messageApi.getList({ page: this.page, pageSize: 15 })
        const records = res.records || res.list || []
        if (this.page === 1) {
          this.list = records
        } else {
          this.list = [...this.list, ...records]
        }
        this.loadStatus = records.length < 15 ? 'nomore' : 'loadmore'
      } catch (_) {
        this.loadStatus = 'loadmore'
      } finally {
        this.loading = false
      }
    },
    async loadUnreadCount() {
      try {
        const res = await this.$api.messageApi.getUnreadCount()
        this.$store.commit('message/SET_UNREAD_COUNT', res?.count || res?.unreadCount || 0)
      } catch (_) {}
    },
    async onMsgClick(item) {
      if (!item.isRead) {
        try {
          await this.$api.messageApi.markRead(item.id)
          item.isRead = true
          this.$store.dispatch('message/decrementUnread')
        } catch (_) {}
      }
      uni.showToast({ title: item.title, icon: 'none' })
    },
    async onReadAll() {
      try {
        await this.$api.messageApi.markAllRead()
        this.list.forEach(m => { m.isRead = true })
        this.$store.commit('message/SET_UNREAD_COUNT', 0)
        uni.showToast({ title: '已全部已读', icon: 'success' })
      } catch (_) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.message-page {
  padding-bottom: 24rpx;
}
.msg-header {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: #fff;
}
.unread-tip {
  font-size: 24rpx;
  color: #ff4d4f;
}
.read-all {
  font-size: 24rpx;
  color: #3078f7;
}
</style>