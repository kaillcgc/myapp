// 确保代理配置保留/api前缀
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    rewrite: (path) => path // 不再移除/api前缀
  }
}
