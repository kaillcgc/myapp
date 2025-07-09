<template>
  <div class="hdygcon">
    <div class="hdygimg">
      <img src="@/assets/img/预告2.png" alt="hdyg">
    </div>
    <div class="hdyg-title">
      <h2 style="text-align: center">—— &nbsp;非遗文化展览与活动预告&nbsp; ——</h2>
    </div>
    <div class="hdyg">
      <ul>
        <li 
          v-for="activity in activities" 
          :key="activity.id" 
          style="border-bottom: 1.5px solid rgb(226, 225, 225);"
        >
          <p>{{ activity.date }} / {{ activity.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const activities = [
  { id: 1, date: '2024-11-20', name: '四川传统剪纸艺术展' },
  { id: 2, date: '2024-12-05', name: '川剧脸谱制作体验课' },
  { id: 3, date: '2024-12-15', name: '蜀绣工作坊' },
  { id: 4, date: '2024-12-22', name: '非遗文化节（成都锦里）' },
  { id: 5, date: '2025-01-10', name: '竹编工艺传承教学班' }
]
</script>