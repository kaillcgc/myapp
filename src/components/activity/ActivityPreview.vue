<template>
  <div class="hdygcon">
    <div class="hdygimg">
      <img src="@/assets/img/预告2.png" alt="hdyg">
    </div>
    <div class="hdyg-title">
      <h2 style="text-align: center">—— &nbsp;非遗文化展览与活动预告&nbsp; ——</h2>
    </div>
    <div v-if="!loading && !error && activities.length === 0" class="empty-message">
      暂无活动预告
    </div>
    
    <div class="hdyg">
      <ul v-if="!loading && !error && activities.length > 0">
        <li 
          v-for="activity in activities" 
          :key="activity.id" 
          style="border-bottom: 1.5px solid rgb(226, 225, 225);"
        >
          <p>{{ formatDate(activity.date) }} / {{ activity.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 响应式数据
const activities = ref([])
const loading = ref(false)
const error = ref(null)

// 获取活动数据
const fetchActivities = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 使用 /hdyg 接口
    const response = await axios.get('http://127.0.0.1:8080/hdyg')
    
    // 检查响应状态
    if (response.status >= 200 && response.status < 300) {
      // 将后端数据映射到前端需要的格式
      activities.value = response.data.map(item => ({
        id: item.id,
        date: item.date,        // 使用后端返回的 date 字段
        name: item.activity     // 使用后端返回的 activity 字段
      }))
    } else {
      error.value = '请求失败: ' + response.statusText
      ElMessage.error(error.value)
    }
  } catch (err) {
    console.error('获取活动数据失败:', err)
    error.value = '获取活动数据失败: ' + (err.response?.data?.message || err.message)
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    // 格式化为 YYYY-MM-DD
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (e) {
    return dateString
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchActivities()
})
</script>