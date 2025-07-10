<template>
  <div class="con-modi" style="margin: 0 auto; width: 1400px;">
    <el-form :model="form" label-width="120px" style="margin-top: 50px;">
      <el-form-item label="活动标题">
        <el-input v-model="form.title" />
      </el-form-item>
      
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          style="width: 400px"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存修改</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs' // 引入日期处理库

const route = useRoute()
const router = useRouter()
const activityId = route.params.id

// 表单数据模型
const form = reactive({
  title: '',     // 活动标题
  date: ''       // 活动日期
})

// 原始活动数据（用于重置或比较）
const originalActivity = ref(null)

// 获取活动详情
const fetchActivityDetail = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8080/hdyg/${activityId}`)
    originalActivity.value = response.data
    
    // 填充表单数据
    form.title = response.data.activity || ''
    
    // 处理日期格式 - 转换为标准YYYY-MM-DD格式
    if (response.data.date) {
      form.date = dayjs(response.data.date).format('YYYY-MM-DD')
    }
    
    ElMessage.success('活动详情加载成功')
  } catch (error) {
    console.error('获取活动详情失败:', error)
    ElMessage.error(`获取活动详情失败: ${error.message}`)
  }
}

// 提交修改
const onSubmit = async () => {
  try {
    // 验证表单
    if (!form.title.trim()) {
      ElMessage.warning('活动标题不能为空')
      return
    }
    
    if (!form.date) {
      ElMessage.warning('请选择活动日期')
      return
    }
    
    // 准备提交数据
    const submitData = {
      id: activityId,
      activity: form.title,
      date: form.date, // 已经是YYYY-MM-DD格式
    }
    
    // 发送PUT请求修改活动
    const response = await axios.put(
      `http://127.0.0.1:8080/hdyg/${activityId}`,
      submitData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    // 处理响应
    if (response.status === 200) {
      ElMessage.success('活动修改成功')
      router.push('/ActivityManage')
    } else {
      ElMessage.error(`修改失败: ${response.statusText}`)
    }
  } catch (error) {
    console.error('修改活动失败:', error)
    
    // 更详细的错误处理
    if (error.response) {
      const { data, status } = error.response
      if (status === 400) {
        ElMessage.error(`请求参数错误: ${data.message || '请检查输入'}`)
      } else if (status === 404) {
        ElMessage.error('活动不存在或已被删除')
      } else {
        ElMessage.error(`服务器错误: ${status} - ${data?.message || '请联系管理员'}`)
      }
    } else {
      ElMessage.error(`修改失败: ${error.message}`)
    }
  }
}

// 取消修改
const cancel = () => {
  // 询问用户是否确认取消
  ElMessageBox.confirm('确认放弃所有修改吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/ActivityManage')
  }).catch(() => {
    // 用户取消，不做操作
  })
}

// 组件挂载时获取活动详情
onMounted(() => {
  fetchActivityDetail()
  
  // 设置页面标题
  document.title = '编辑活动 - 四川非遗活动管理系统'
})
</script>