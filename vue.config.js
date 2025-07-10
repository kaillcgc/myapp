// vue.config.js（必须存在！）
const { defineConfig } = require('@vue/cli-service')
const path = require('path') // 必须导入 path 模块

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      alias: {
        // 配置 `@` 指向项目根目录的 `src` 文件夹
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})