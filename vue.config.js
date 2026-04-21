const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 👇 下面这行是关键，确保打包到 dist 文件夹
  outputDir: 'dist',
  
  // 如果你的项目有使用 history 模式的路由，需要加上 publicPath
  publicPath: '/'
})