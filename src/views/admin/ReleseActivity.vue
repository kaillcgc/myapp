<template>
  <div class="con-xwfb" style="margin: 0 auto; width: 1400px;">
    <div class="news-publish-container">
      <el-main class="news-publish-content">
        <!-- 返回按钮 -->
        <div class="news-back">
          <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)" class="back-button">
            返回活动列表
          </el-button>
        </div>

        <div class="news-publish">
          <h2 class="publish-title">活动发布</h2>

          <el-form :model="form" :rules="rules" ref="publishForm" label-position="right" label-width="100px"
            class="publish-form">
            <el-form-item label="活动标题" prop="activity">
              <el-input v-model="form.activity" placeholder="请输入活动标题" clearable></el-input>
            </el-form-item>

            <el-form-item label="活动日期" prop="date">
              <!-- 添加 value-format 属性确保日期格式正确 -->
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%"
                value-format="YYYY-MM-DD" format="YYYY年MM月DD日" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('publishForm')" :loading="loading">
                发布活动
              </el-button>
              <el-button @click="resetForm('publishForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs'; // 引入日期处理库

export default {
  name: 'ActivityPublish',
  data() {
    return {
      loading: false,
      form: {
        activity: '',
        date: dayjs().format('YYYY-MM-DD') // 使用本地日期格式初始化
      },
      rules: {
        activity: [
          { required: true, message: '请输入活动标题', trigger: 'blur' },
          { min: 1, max: 100, message: '标题长度在1到100个字符之间', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择活动日期', trigger: 'change' }
        ]
      }
    }
  },
  async created() {
    document.title = '活动发布 - 四川非遗活动发布系统';
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            // 准备提交数据 - 使用本地日期格式
            const activityData = {
              activity: this.form.activity,
              date: this.form.date // 直接使用 YYYY-MM-DD 格式
            };

            const response = await axios.post('http://127.0.0.1:8080/hdyg', activityData);

            if (response.status === 200) {
              ElMessage.success({
                message: '活动发布成功，3秒后自动返回活动列表',
                duration: 2500
              });

              // 3秒后跳转到活动列表
              setTimeout(() => {
                this.$router.push('/ActivityManage');
              }, 3000);

            } else {
              ElMessage.error('活动发布失败: ' + response.statusText);
            }
          } catch (error) {
            console.error('活动发布失败:', error);
            ElMessage.error('活动发布失败: ' + (error.response?.data?.message || error.message));
          } finally {
            this.loading = false;
          }
        } else {
          ElMessage.warning('请填写完整的表单内容');
          return false;
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 重置后设置默认日期为今天
      this.form.date = dayjs().format('YYYY-MM-DD');
    }
  }
}
</script>