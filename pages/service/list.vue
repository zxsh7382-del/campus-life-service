<template>
  <view class="service-page">
    <!-- 搜索栏 -->
    <view class="search-wrap" v-if="showSearch">
      <u-search
        v-model="keyword"
        placeholder="搜索服务"
        :showAction="false"
        @search="onSearch"
        @clear="onSearchClear"
      ></u-search>
    </view>

    <!-- 分类标签 -->
    <u-tabs
      :list="categoryTabs"
      :current="currentTab"
      @change="onTabChange"
      :scrollable="true"
    ></u-tabs>

    <!-- 服务列表 -->
    <view class="service-list">
      <service-card
        v-for="item in list"
        :key="item.id"
        :data="item"
        @click="toDetail(item)"
      ></service-card>
      <u-loadmore v-if="list.length" :status="loadStatus" />
      <empty-state
        v-if="!list.length && !loading"
        icon="file-text"
        text="暂无服务"
      ></empty-state>
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
      keyword: '',
      showSearch: true,
      categoryTabs: [{ name: '全部' }],
      currentTab: 0,
      list: [],
      loading: false,
      page: 1,
      loadStatus: 'loadmore'
    }
  },
  onLoad(options) {
    if (options?.focus === '1') {
      this.showSearch = true
    }
    this.loadCategories()
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
    async loadCategories() {
      try {
        const res = await this.$api.serviceApi.getCategories()
        const cats = res || []
        this.categoryTabs = [{ name: '全部' }, ...cats.map(c => ({ name: c.name, id: c.id }))]
      } catch (_) {}
    },
    async loadList() {
      this.loading = true
      this.loadStatus = 'loading'
      try {
        const categoryId = this.currentTab > 0 ? this.categoryTabs[this.currentTab]?.id : ''
        const params = { page: this.page, pageSize: 10, keyword: this.keyword }
        if (categoryId) params.categoryId = categoryId
        const res = await this.$api.serviceApi.getList(params)
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
      this.currentTab = index
      this.page = 1
      this.list = []
      this.loadList()
    },
    onSearch() {
      this.page = 1
      this.list = []
      this.loadList()
    },
    onSearchClear() {
      this.keyword = ''
      this.page = 1
      this.list = []
      this.loadList()
    },
    toDetail(item) {
      uni.navigateTo({ url: `/pages/service/detail?id=${item.id}` })
    }
  }
}
</script>

<style scoped>
.service-page {
  padding-bottom: 24rpx;
}
.search-wrap {
  padding: 16rpx 24rpx;
}
.service-list {
  padding-top: 16rpx;
}
</style>