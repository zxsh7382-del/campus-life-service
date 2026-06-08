// uni-app H5 编译配置
// 主要用于解决 uView UI 的 SCSS 变量无法被组件访问的问题
// sass-loader 全局注入 uView 主题变量文件到每个 vue 单文件组件的 <style lang="scss"> 中

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/uni_modules/uview-ui/theme.scss";`
      }
    }
  }
}