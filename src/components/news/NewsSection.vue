<template>
<div class="bodybackground">
  <div class="news-container">
    <h2 style="margin-top: 25px;text-align: center;margin-bottom: 0">—— &nbsp;最新消息&nbsp; ——</h2>
    <div class="container">
      <div class="conleft">
        <NewsCarousel />
      </div>
      <div class="conright">
        <div class="news">
          <ul class="newsul">
            <li v-for="news in newsList" :key="news.id">
              <router-link :to="`/news/${news.id}`" style="text-decoration: none">{{ news.title }}</router-link>
            </li>
            <div class="more-title">
              <div class="line">
                <img src="@/assets/img/gdt.png" alt="fgx">
                <router-link to="/more-news" style="color: #9F9F9F;font-size: 15px;text-decoration: none;padding-left: 8px;">
                  更多新闻
                </router-link>
              </div>
            </div>
          </ul>
        </div>
        <div class="news">
          <ul class="newsul">
            <li><a href="#">评论区开发中，敬请期待...</a></li>
            <div class="more-title">
              <div class="line">
                <img src="@/assets/img/gdt.png" alt="fgx">
                <a href="#" style="color: #9F9F9F;font-size: 15px;text-decoration: none;padding-left: 8px;">更多评论</a>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import NewsCarousel from '@/components/news/NewsCarousel.vue'
import '@/assets/css/zxxx.css'

const newsList = [
  { id: 1, title: '四川非遗展精彩开幕 展示传统魅力' },
  { id: 2, title: '首届四川传统手工艺大赛成功举办' },
  { id: 3, title: '非遗传承人培训班在成都开班' },
  { id: 4, title: '四川剪纸艺术走进社区 丰富市民文化生活' },
  { id: 5, title: '非遗进校园活动在成都多所学校开展' }
]
</script>