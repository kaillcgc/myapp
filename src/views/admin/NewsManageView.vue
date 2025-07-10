<template>
  <!-- 仅保留内容区，依赖全局布局的导航 -->
  <div class="con-newsmanag" style="margin: 0 auto;width: 1400px;">
    <el-main class="content">
      <div style="margin-bottom: 16px;">
        <h2 style="text-align: center;">新闻管理</h2>
        <router-link to="/ReleseNews" style="float: right;">发布新闻</router-link>
      </div>
      <el-table :data="newsList" border style="width: 100%;margin-top: 60px;">
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="新闻标题" prop="title" align="center"></el-table-column>
        <el-table-column label="内容" prop="content" align="center"></el-table-column>
        <el-table-column label="发布时间" prop="time" align="center"></el-table-column>
        <!-- 合并操作列，优化按钮区分度 -->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <!-- 修改按钮：黄色 + 编辑图标 + 文字 -->
            <el-button type="warning" size="mini" @click="editNews(scope.row.id)"
              style="margin-right: 8px;">
              修改
            </el-button>
            <!-- 删除按钮：红色 + 删除图标 + 文字 -->
            <el-button type="danger" size="mini" @click="deleteNews(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'NewsList',
  data() {
    return {
      newsList: [], // 存储新闻数据的数组
      title: '',
      content: '',
      time: ''
    }
  },
  mounted() {
    this.getNewsList(); // 页面加载时获取新闻列表
    document.title = '新闻管理 - 四川非遗新闻发布系统';
  },
  methods: {
    async getNewsList() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/news');

        // 检查响应状态
        if (response.status >= 200 && response.status < 300) {
          // 将后端数据映射到前端需要的格式
          this.newsList = response.data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            time: this.formatDate(item.pubtime) // 使用 pubtime 字段并格式化
          }));
        } else {
          ElMessage.error('请求失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取新闻列表失败:', error);
        ElMessage.error('获取新闻列表失败: ' + error.message);
      }
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          return dateString; // 返回原始字符串
        }

        // 格式化为本地日期时间
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } catch (e) {
        return dateString; // 返回原始字符串
      }
    },

    // 编辑新闻
    editNews(id) {
       this.$router.push(`/modi/${id}`);
    },

    // 删除新闻
    async deleteNews(row) {
      try {
        await this.$confirm(`确定要删除新闻 "${row.title}" 吗？`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 调用删除 API
        await axios.delete(`http://127.0.0.1:8080/news/${row.id}`);
        ElMessage.success('删除成功');

        // 刷新列表
        await this.getNewsList();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败: ' + error.message);
        }
      }
    }
  }
}
</script>


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