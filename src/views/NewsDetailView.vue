<template>
  <div class="con-newsmanag" style="margin: 20px auto;width: 1400px;">
    <el-main class="content">
      <!-- 返回按钮 -->
      <el-button 
        type="text" 
        icon="el-icon-arrow-left" 
        @click="$router.go(-1)"
        style="margin-bottom: 20px;"
      >
        返回新闻列表
      </el-button>
      
      <!-- 新闻标题 -->
      <h1 style="text-align: center; margin-bottom: 30px; color: #333;">{{ newsDetail.title }}</h1>
      
      <!-- 发布时间 -->
      <div style="text-align: center; margin-bottom: 30px; color: #999;">
        <i class="el-icon-time"></i> 发布时间：{{ formatDate(newsDetail.time) }}
      </div>
      <hr>
      <br>
      <!-- 新闻内容 -->
      <div 
        class="news-content" 
        style="
          line-height: 1.8;
          font-size: 16px;
          color: #333;
          padding: 10px 50px;
        "
        v-html="newsDetail.content"
      ></div>
      
      <!-- 操作按钮（可选） -->
      <!-- <div style="margin-top: 40px; text-align: center;">
        <el-button 
          type="primary" 
          @click="editNews(newsDetail.id)"
          v-if="hasEditPermission"
        >
          编辑新闻
        </el-button>
        <el-button 
          type="danger" 
          @click="deleteNews(newsDetail)"
          v-if="hasEditPermission"
        >
          删除新闻
        </el-button>
      </div> -->
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'NewsDetail',
  data() {
    return {
      newsDetail: {
        id: '',
        title: '',
        content: '',
        time: ''
      },
      hasEditPermission: false // 根据实际权限设置
    }
  },
  created() {
    this.fetchNewsDetail();
    document.title = '新闻详情 - 四川非遗新闻发布系统';
  },
  methods: {
    async fetchNewsDetail() {
      try {
        const newsId = this.$route.params.id;
        const response = await axios.get(`http://127.0.0.1:8080/news/${newsId}`);
        
        if (response.status >= 200 && response.status < 300) {
          this.newsDetail = {
            id: response.data.id,
            title: response.data.title,
            content: response.data.content,
            time: response.data.pubtime
          };
        } else {
          ElMessage.error('获取新闻详情失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取新闻详情失败:', error);
        ElMessage.error('获取新闻详情失败: ' + error.message);
        this.$router.push('/news'); // 失败时返回新闻列表
      }
    },
    
    // 复用相同的日期格式化方法
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
          return dateString;
        }
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } catch (e) {
        return dateString;
      }
    },
    
    // 复用相同的编辑方法
    editNews(id) {
      this.$router.push(`/modi/${id}`);
    },
    
    // 复用相同的删除方法
    async deleteNews(row) {
      try {
        await this.$confirm(`确定要删除新闻 "${row.title}" 吗？`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        await axios.delete(`http://127.0.0.1:8080/news/${row.id}`);
        ElMessage.success('删除成功');
        
        // 删除后返回新闻列表
        this.$router.push('/news');
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败: ' + error.message);
        }
      }
    }
  }
}
</script>

<style scoped>
/* 保持与新闻列表页一致的样式 */
.con-newsmanag {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* 新闻内容样式 */
.news-content >>> p {
  margin-bottom: 20px;
  text-indent: 2em;
}

.news-content >>> img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>