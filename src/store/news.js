// src/store/news.js（必须存在！）
import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [] // 存储新闻数据
  }),
  actions: {
    addNews(news) {
      this.newsList.unshift(news) // 添加新闻到列表
    }
  }
})