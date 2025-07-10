<template>
  <div class="con-usermanag" style="margin: 0 auto;width: 1400px;">
    <el-main class="content">
      <div style="margin-bottom: 16px;">
        <h2 style="text-align: center;">用户管理</h2>
      </div>
      <el-table :data="userList" border style="width: 100%;">
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="用户名" prop="yhm" align="center"></el-table-column>
        <el-table-column label="性别" prop="xb" align="center"></el-table-column>
        <el-table-column label="居住地址" prop="jzd" align="center"></el-table-column>
        <el-table-column label="职业" prop="zy" align="center"></el-table-column>
        <el-table-column label="用户角色" prop="js" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="danger" size="mini" @click="deleteUser(scope.row)">
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
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'UsermanagView',
  data() {
    return {
      userList: []
    }
  },
  mounted() {
    this.getUserList();
    document.title = '用户管理 - 四川非遗新闻发布系统';
  },
  methods: {
    async getUserList() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/user');
        
        if (response.status >= 200 && response.status < 300) {
          this.userList = response.data;
        } else {
          ElMessage.error('获取用户列表失败: ' + response.statusText);
        }
      } catch (error) {
        console.error('获取用户列表错误:', error);
        ElMessage.error('获取用户列表失败: ' + error.message);
      }
    },
    
    async deleteUser(row) {
      try {
        await ElMessageBox.confirm(
          `确定要删除用户 "${row.yhm}" 吗？`, 
          '删除确认', 
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        await axios.delete(`http://127.0.0.1:8080/user/${row.id}`);
        ElMessage.success('删除成功');
        await this.getUserList();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败: ' + error.message);
        }
      }
    }
  }
}
</script>
  