
<template>
    <div class="con-newsmanag" style="margin: 0 auto;width: 1400px;">
      <el-main class="content">
        <div style="margin-bottom: 16px;">
          <h2 style="text-align: center;">全部新闻</h2>
        </div>
        <el-table :data="newsList" border style="width: 100%;">
          <el-table-column label="序号" width="60" align="center">
            <template #default="scope">
              <span>
                {{ scope.$index + 1 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新闻标题" align="center">
            <template #default="scope">
              <span 
                class="news-title-link"
                @click="goToNewsDetail(scope.row.id)"
              >
                {{ scope.row.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="time" align="center"></el-table-column>
        </el-table>
      </el-main>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'MoreNews',
  data() {
    return {
      newsList: [],
      title: '',
      content: '',
      time: ''
    };
  },
  mounted() {
    this.getNewsList();
    document.title = '全部新闻 - 四川非遗新闻发布系统';
  },
  methods: {
    // 跳转到新闻详情页
    goToNewsDetail(newsId) {
      if (!newsId) {
        ElMessage.error('新闻ID无效');
        return;
      }
      
      try {
        this.$router.push({
          name: 'NewsDetail',
          params: { id: newsId }
        });
      } catch (error) {
        console.error('路由跳转失败:', error);
        ElMessage.error('跳转失败: ' + (error.message || '未知错误'));
        // 备用跳转方案
        this.$router.push(`/news/${newsId}`);
      }
    },

    async getNewsList() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/news');
        if (response.status >= 200 && response.status < 300) {
          this.newsList = response.data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            time: this.formatDate(item.pubtime)
          }));
        } else {
          ElMessage.error('请求失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取新闻列表失败:', error);
        ElMessage.error('获取新闻列表失败: ' + (error.message || '未知错误'));
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) 
          ? dateString 
          : date.toLocaleString('zh-CN');
      } catch (e) {
        return dateString;
      }
    },

    editNews(id) {
      this.$router.push(`/modi/${id}`);
    },

    async deleteNews(row) {
      try {
        await this.$confirm(`确定要删除新闻 "${row.title}" 吗？`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        await axios.delete(`http://127.0.0.1:8080/news/${row.id}`);
        ElMessage.success('删除成功');
        await this.getNewsList();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败: ' + (error.message || '未知错误'));
        }
      }
    }
  }
};
</script>

<style scoped>
.news-title-link {
  color: #409EFF;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s;
  display: inline-block;
  padding: 5px 0;
}
.news-title-link:hover {
  color: #337ecc;
  text-decoration: underline;
}
</style>
  
  
  <!-- // 跳转到发布新闻页面
      // goToPublish() {
      //   this.$router.push('/publish'); // 路由路径需根据项目配置调整
      // },
  
      // 编辑新闻，跳转到编辑页面并携带新闻 ID
      // editNews(row) {
      //   this.$router.push({
      //     path: `/edit/${row.id}`, // 使用参数传递新闻 ID，路由需配置为动态路由
      //     // 或者使用 query 传递：{ path: '/edit', query: { id: row.id } }
      //   });
      // },
  
      // 删除新闻前弹出确认框，确认后调用删除 API 并刷新列表
      // async deleteNews(row) {
      //   this.$confirm('确认删除该新闻吗？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(async () => {
      //     try {
      //       // 示例：调用删除 API（请替换为实际 API）
      //       await this.$axios.delete(`/api/news/${row.id}`); // 使用 axios 或其他请求库
      //       this.$message.success('删除成功');
      //       await this.fetchNewsList(); // 刷新数据
      //     } catch (error) {
      //       this.$message.error('删除失败');
      //     }
      //   }).catch(() => {
      //     this.$message.info('已取消删除');
      //   });
      // },
  
      // // 获取新闻列表的方法（示例中使用模拟数据）
      // async fetchNewsList() {
      //   try {
      //     // 示例：调用获取新闻列表的 API（请替换为实际 API）
      //     // const res = await this.$axios.get('/api/news');
      //     // this.newsList = res.data;
  
      //     // 模拟数据（开发阶段可使用）
      //     this.newsList = [
      //       { id: 1, title: '新闻标题1', time: '2025-04-05 10:00' },
      //       { id: 2, title: '新闻标题2', time: '2025-04-04 15:30' },
      //     ];
      //   } catch (error) {
      //     this.$message.error('获取新闻列表失败');
      //   }
      // } -->