<template>
  <div class="con-modi" style="margin: 0 auto;width: 1400px;">
  <el-form :model="form" label-width="120px" style="margin-top: 50px;">
    <el-form-item label="新闻标题">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="类型">
      <!-- 修改为动态生成选项 -->
      <el-select v-model="form.region" placeholder="请选择类型">
        <el-option 
          v-for="type in newsTypes" 
          :key="type.id" 
          :label="type.typeName" 
          :value="type.id.toString()" 
        />
      </el-select>
    </el-form-item>
    <el-form-item label="时间">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const newsId = route.params.id

// 存储新闻类型列表
const newsTypes = ref([])

// 表单数据
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  desc: ''
})

// 原始新闻数据（用于保存未修改的字段）
const originalNews = ref(null)

// 获取新闻类型列表
const fetchNewsTypes = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/news/types')
    newsTypes.value = response.data
  } catch (error) {
    console.error('获取新闻类型失败:', error)
    ElMessage.error('获取新闻类型失败: ' + error.message)
  }
}

// 获取新闻详情
const fetchNewsDetail = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8080/news/${newsId}`)
    originalNews.value = response.data
    
    // 填充表单数据
    form.name = response.data.title
    form.region = response.data.newstype?.toString() || '1'
    form.desc = response.data.content
    
    // 处理时间
    if (response.data.pubtime) {
      const pubtime = new Date(response.data.pubtime)
      form.date1 = pubtime
      form.date2 = pubtime
    }
    
    ElMessage.success('新闻详情加载成功')
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    ElMessage.error('获取新闻详情失败: ' + error.message)
  }
}

// 提交修改
const onSubmit = async () => {
  try {
    // 组合日期和时间
    const pubtime = new Date(form.date1)
    const time = new Date(form.date2)
    
    if (time) {
      pubtime.setHours(time.getHours())
      pubtime.setMinutes(time.getMinutes())
      pubtime.setSeconds(time.getSeconds())
    }
    
    // 查找选中的类型名称
    const selectedType = newsTypes.value.find(
      type => type.id.toString() === form.region
    )
    
    // 准备提交数据
    const submitData = {
      id: newsId,
      title: form.name,
      content: form.desc,
      pubtime: pubtime.toISOString(),
      newstype: parseInt(form.region) || 1,
      // 以下字段使用原始数据或默认值
      author: originalNews.value?.author || "系统管理员",
      keyword: originalNews.value?.keyword || "",
      acnumber: originalNews.value?.acnumber || 0,
      typeName: selectedType?.typeName || "未知类型",
      newstypeName: selectedType?.typeName || ""
    }
    
    // 发送PUT请求
    const response = await axios.put(
      `http://127.0.0.1:8080/news/${newsId}`,
      submitData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    // 处理响应
    if (response.status === 200) {
      ElMessage.success('新闻修改成功')
      router.push('/admin/news') // 返回新闻管理页面
    } else {
      ElMessage.error('修改失败: ' + response.statusText)
    }
  } catch (error) {
    console.error('修改新闻失败:', error)
    ElMessage.error('修改新闻失败: ' + error.message)
  }
}

// 取消修改
const cancel = () => {
  router.push('/admin/news')
}

// 组件挂载时获取新闻详情和类型列表
onMounted(() => {
  fetchNewsDetail()
  fetchNewsTypes()
})
</script>