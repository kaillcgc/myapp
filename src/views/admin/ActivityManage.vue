<template>
  <div class="con-activitymanag" style="margin: 0 auto; width: 1400px;">
    <el-main class="content">
      <div style="margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="text-align: center; flex-grow: 1;">活动管理</h2>
        <router-link to="/ReleseActivity" class="release-btn">
          <el-button type="primary">发布活动</el-button>
        </router-link>
      </div>

      <!-- 添加数据加载状态提示 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" style="font-size: 30px;">
          <Loading />
        </el-icon>
        <p>正在加载活动数据...</p>
      </div>

      <!-- 添加空数据提示 -->
      <div v-else-if="activityList.length === 0" class="empty-container">
        <el-icon style="font-size: 50px; color: #909399;">
          <DocumentRemove />
        </el-icon>
        <h3>暂无活动数据</h3>
        <p>您还没有发布任何活动，点击上方按钮发布新活动</p>
      </div>

      <el-table v-else :data="activityList" border style="width: 100%; margin-top: 30px;">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="活动标题" prop="activity" align="center" min-width="200">
          <template #default="scope">
            <div class="activity-title">{{ scope.row.activity }}</div>
          </template>
        </el-table-column>
        <el-table-column label="举办时间" prop="date" align="center" width="200">
          <template #default="scope">
            <div class="activity-date">{{ formatDate(scope.row.date) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button type="warning" size="mini" @click="editActivity(scope.row.id)" style="margin-right: 8px;">
              修改
            </el-button>
            <el-button type="danger" size="mini" @click="deleteActivity(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handlePageChange" />
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Loading, DocumentRemove } from '@element-plus/icons-vue'; // 引入图标组件

export default {
  name: 'ActivityList',
  components: {
    Loading,
    DocumentRemove
  },
  data() {
    return {
      activityList: [], // 存储活动数据的数组
      loading: true,   // 初始加载状态为true
      total: 0,         // 总记录数
      pageSize: 10,     // 每页显示数量
      currentPage: 1,    // 当前页码
    }
  },
  mounted() {
    this.getActivityList();
    document.title = '活动管理 - 四川非遗活动发布系统';
  },
  methods: {
    async getActivityList() {
      this.loading = true;
      try {
        // 添加时间戳参数避免缓存问题
        const timestamp = new Date().getTime();
        const response = await axios.get('http://127.0.0.1:8080/hdyg', {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            _t: timestamp // 避免浏览器缓存
          }
        });

        console.log('API响应数据:', response.data); // 调试输出

        if (response.status >= 200 && response.status < 300) {
          // 处理可能的多种响应格式
          if (Array.isArray(response.data)) {
            // 如果返回的是数组（不分页）
            this.activityList = response.data;
            this.total = response.data.length;
          } else if (response.data.content) {
            // 如果返回的是分页对象
            this.activityList = response.data.content || [];
            this.total = response.data.totalElements || 0;
          } else {
            // 其他格式
            this.activityList = response.data || [];
            this.total = this.activityList.length;
          }
        } else {
          ElMessage.error('请求失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取活动列表失败:', error);
        let errorMsg = '获取活动列表失败: ';

        if (error.response) {
          // 服务器返回错误
          errorMsg += `${error.response.status} - ${error.response.data?.message || '未知错误'}`;
        } else if (error.request) {
          // 请求已发出但无响应
          errorMsg += '服务器无响应，请检查网络连接';
        } else {
          // 其他错误
          errorMsg += error.message;
        }

        ElMessage.error(errorMsg);
      } finally {
        this.loading = false;
      }
    },

    // 格式化日期为 "YYYY-MM-DD"
    formatDate(dateString) {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return dateString;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      } catch (e) {
        return dateString;
      }
    },

    // 编辑活动
    editActivity(id) {
      this.$router.push(`/modiActivity/${id}`);
    },

    // 删除活动
    async deleteActivity(row) {
      try {
        await ElMessageBox.confirm(
          `确定要删除活动 "${row.activity}" 吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'delete-confirm-box'
          }
        );

        // 调用删除 API
        await axios.delete(`http://127.0.0.1:8080/hdyg/${row.id}`);
        ElMessage.success('活动删除成功');

        // 刷新列表
        this.getActivityList();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message));
        }
      }
    },

    // 处理分页变化
    handlePageChange(page) {
      this.currentPage = page;
      this.getActivityList();
    }
  }
}
</script>
