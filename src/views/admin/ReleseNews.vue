<template>
  <div class="news-publish-container">
    <el-main class="news-publish-content">
      <!-- 返回按钮 -->
      <div class="news-back">
        <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)" class="back-button">
          返回新闻列表
        </el-button>
      </div>

      <div class="news-publish">
        <h2 class="publish-title">新闻发布</h2>

        <el-form :model="form" :rules="rules" ref="publishForm" label-position="right" label-width="100px"
          class="publish-form">
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入新闻标题" clearable></el-input>
          </el-form-item>

          <el-form-item label="新闻类别" prop="newstype">
            <el-select v-model="form.newstype" placeholder="请选择新闻类别" style="width: 100%" :loading="loadingTypes">
              <el-option v-for="item in newsTypes" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="form.keyword" placeholder="多个关键词用逗号分隔" clearable></el-input>
          </el-form-item>

          <el-form-item label="新闻内容" prop="content">
            <el-input type="textarea" v-model="form.content" :rows="10" placeholder="请输入新闻内容" resize="none"></el-input>
          </el-form-item>

          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="请输入作者名称" clearable :disabled="true"></el-input><!-- 禁用作者输入框 -->
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('publishForm')" :loading="loading">
              发布新闻
            </el-button>
            <el-button @click="resetForm('publishForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user'; // 导入用户状态管理

export default {
  name: 'NewsPublish',
  setup() {
    const userStore = useUserStore(); // 使用用户状态管理

    return {
      userStore
    }
  },
  data() {
    return {
      loading: false,
      loadingTypes: false,
      newsTypes: [], // 存储新闻类型数据
      form: {
        title: '',
        content: '',
        author: this.userStore.user?.yhm || '', // 使用当前用户的用户名作为默认作者
        keyword: '',
        newstype: null, // 对应NewsDo中的newstype字段（Integer）
        pubtime: new Date().toISOString()
      },
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在1到100个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' },
          { min: 1, message: '内容至少1个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者信息缺失', trigger: 'blur' }
        ],
        newstype: [
          { required: true, message: '请选择新闻类型', trigger: 'change' }
        ]
      }
    }
  },
  async created() {
    document.title = '新闻发布 - 四川非遗新闻发布系统';

    // 检查用户是否登录
    if (!this.userStore.user) {
      ElMessage.warning('请先登录后再发布新闻');
      this.$router.push('/login');
      return;
    }

    // 设置作者为当前用户名
    this.form.author = this.userStore.user.yhm;

    await this.fetchNewsTypes();
  },
  methods: {
    // 获取新闻类型
    async fetchNewsTypes() {
      this.loadingTypes = true;
      try {
        const response = await axios.get('http://127.0.0.1:8080/news/types');

        if (response.status === 200) {
          this.newsTypes = response.data;
          if (this.newsTypes.length > 0) {
            this.form.newstype = this.newsTypes[0].id; // 默认选中第一个类型
          }
        } else {
          ElMessage.error('获取新闻类型失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取新闻类型失败:', error);
        ElMessage.error('获取新闻类型失败: ' + (error.response?.data?.message || error.message));
      } finally {
        this.loadingTypes = false;
      }
    },

    // 提交表单
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            // 准备提交数据
            const newsData = {
              title: this.form.title,
              content: this.form.content,
              author: this.form.author,
              keyword: this.form.keyword,
              newstype: this.form.newstype,
              pubtime: new Date(this.form.pubtime),
              // 可选：设置类型名称
              typeName: this.getTypeNameById(this.form.newstype)
            };

            const response = await axios.post('http://127.0.0.1:8080/news', newsData);

            if (response.status === 200) {
              ElMessage.success({
                message: '新闻发布成功，3秒后自动返回新闻列表',
                duration: 2500 // 提示显示2.5秒
              });

              // 3秒后跳转到新闻列表
              setTimeout(() => {
                this.$router.push('/admin/news');
              }, 3000);

            } else {
              ElMessage.error('新闻发布失败: ' + response.statusText);
            }
          } catch (error) {
            console.error('新闻发布失败:', error);
            ElMessage.error('新闻发布失败: ' + (error.response?.data?.message || error.message));
          } finally {
            this.loading = false;
          }
        } else {
          ElMessage.warning('请填写完整的表单内容');
          return false;
        }
      });
    },

    // 根据ID获取类型名称
    getTypeNameById(typeId) {
      const type = this.newsTypes.find(item => item.id === typeId);
      return type ? type.typeName : '';
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 重新设置默认选中的新闻类型
      if (this.newsTypes.length > 0) {
        this.form.newstype = this.newsTypes[0].id;
      }
      this.form.pubtime = new Date().toISOString();
      // 重置后保持作者为当前用户
      this.form.author = this.userStore.user.yhm;
    }
  }
}
</script>

<style scoped>
.news-publish-container {
  margin: 0 auto;
  width: 1200px;
  max-width: 90%;
  padding: 30px 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}

.news-publish-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.news-back {
  margin-bottom: 30px;
}

.back-button {
  padding: 0;
  font-size: 14px;
  color: #666;
}

.back-button:hover {
  color: #409EFF;
}

.publish-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.publish-form {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .news-publish-container {
    padding: 15px 0;
    width: 95%;
  }

  .news-publish-content {
    padding: 20px;
  }

  .publish-title {
    font-size: 20px;
    margin-bottom: 30px;
  }
}
</style>