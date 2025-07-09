<template>
  <div class="home">
    <NewsSection />
    
    <ActivityPreview />
    
    <div class="xcy" style="width: 1440px;height: 90px;margin: 0 auto;padding-top: 25px;padding-bottom: 20px">
      <img src="@/assets/img/2-24060GH91D47 copy.png" alt="xcy" width="100%" height="100%">
    </div>
    
    <div class="bodynr">
      <div class="sptj">
        <div class="body-title0" style="border-bottom: 1px solid black">
          <div class="body-title">
            <p style="margin:0px;line-height: 45px;font-size: 20px;color: #cc1c1c;font-weight: 600">视频推荐</p>
          </div>
        </div>
        <div class="sptjcon">
          <div class="sptj-xcp">
            <p style="text-align: center;font-size: 20px;color: black;font-weight: 600">宣传片：安逸四川</p>
            <p style="font-size: 18px;text-indent: 2em;padding: 0 40px;line-height: 2em;">
              天府三九大，安逸四川行，乐享自然与文化的盛宴!
            </p>
          </div>
          <div class="xcp">
            <video 
              src="@/assets/img/安逸四川.mp4" 
              controls 
              loop 
              width="800px" 
              height="400px"
            ></video>
          </div>
        </div>
      </div>
      
      <div class="news2" style="padding-top: 20px">
        <div class="left2" style="float: left">
          <div class="body-title0" style="border-bottom: 1px solid black;width: 630px;">
            <div class="body-title2">
              <p style="margin:0px;line-height: 45px;font-size: 20px;color: #cc1c1c;font-weight: 600">
                非遗亮点展示
              </p>
            </div>
          </div>
          <div class="fyldzhcon" style="background-color: white;">
            <ul class="fyldzhul">
              <li style="display: table;width: 510px;">
                <a href="#"><img style="float: left" src="@/assets/img/非遗闹新春.webp" alt="fynxc" height="150px">
                  <p>非遗闹新春传统手工艺活动</p>
                </a>
              </li>
              <li style="display: table;width: 510px;">
                <a href="#"><img style="float: left" src="@/assets/img/越南国际贸易博览会.jpg" alt="fynxc" height="150px">
                  <p style="font-size: 14px">非遗文创产品亮相2024年越南国际贸易博览会</p>
                </a>
              </li>
            </ul>
          </div>
          <div class="d" style="width: 630px;">
            <img src="@/assets/img/dibu.jpg" alt="dibud" width="550px" style="padding-top: 20px;padding-left: 50px;">
          </div>
        </div>
        
        <div class="right2" style="float: right">
          <div class="body-title0" style="border-bottom: 1px solid black;width: 630px;">
            <div class="body-title2">
              <p style="margin:0px;line-height: 45px;font-size: 20px;color: #cc1c1c;font-weight: 600">宣传推广</p>
            </div>
          </div>
          <div class="xctgcon">
            <ul class="xctgul">
              <li v-for="(item, index) in promotions" :key="index">
                <p>{{ item }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NewsSection from '@/components/news/NewsSection.vue'
import ActivityPreview from '@/components/activity/ActivityPreview.vue'

const promotions = [
  '美姑县第二届非物质文化遗产季开幕 文化底蕴焕发新活力',
  '隆昌市"非物质文化遗产周"主题系列活动开幕',
  '乘文旅之风 让红色文化焕发时代光芒',
  '2024年四川非遗保护传承优秀案例揭晓',
  '多彩非遗 共生共享2024焕新非遗 天府之夜在成都盛大绽放',
  '青神竹编入选"非物质文化遗产促进可持续发展"'
]
</script>