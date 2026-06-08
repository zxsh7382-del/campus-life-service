<!-- App.vue 全局样式与生命周期 -->
	<template>
	  <div id="app">
	    <!-- 页面渲染入口 -->
	    <router-view />
	  </div>
	</template>
	
	<script>
	export default {
	  name: 'App',
	  // 应用全局生命周期
	  onLaunch() {
	    // 应用启动时执行，全端生效
	    console.log('校园生活服务平台 启动成功')
	  },
	  onShow() {
	    // 应用从后台切换至前台触发
	  },
	  onHide() {
	    // 应用从前台切换至后台触发
	  }
	}
	</script>
	
	<style lang="scss">
	/* 引入 uView 全局基础样式 */
	@import "uni_modules/uview-ui/theme.scss";
	
	/* 自定义全局样式 */
	page {
	  background-color: #f5f5f5;
	  font-size: 14px;
	}
	</style>