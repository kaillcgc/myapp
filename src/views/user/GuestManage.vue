<template>
  <div class="user-profile-container">
    <div class="header-container">
      <h2>个人信息管理</h2>
      <el-button 
        type="primary" 
        size="small" 
        @click="fetchUserInfo" 
        :loading="loading" 
      >
        刷新数据
      </el-button>
    </div>

    <el-form
      label-position="right"
      label-width="120px"
      :model="user"
      style="max-width: 600px; margin: 0 auto;"
    >
      <!-- 用户名 -->
      <el-form-item label="用户名">
        <el-input 
          v-model="user.yhm" 
          :disabled="!isEditable" 
        /> <!-- 编辑模式才可用 -->
      </el-form-item>
      
      <!-- 密码 -->
      <el-form-item label="密码">
        <el-input 
          v-model="user.mm" 
          type="password" 
          :disabled="!isEditable"
          placeholder="如需修改请输入新密码"
        />
      </el-form-item>
      
      <!-- 性别 -->
      <!--<el-form-item label="性别">
        <el-select 
          v-model="user.xb" 
          :disabled="!isEditable"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <el-option label="男" value="men" />
          <el-option label="女" value="women" />
        </el-select>
      </el-form-item>-->
      <el-form-item label="性别">
        <el-input
          v-model="user.xb" 
          disabled  
        />
      </el-form-item>
      
      <!-- 居住地 -->
      <el-form-item label="居住地">    
        <el-select
          v-model="user.jzd" 
          :disabled="!isEditable"
          placeholder="请选择居住地"
        >
          <el-option label="北京市" value="北京市" />
          <el-option label="天津市" value="天津市" />
          <el-option label="河北省" value="河北省" />
        </el-select>
      </el-form-item>

      
      <!-- 个人简介 -->
      <el-form-item label="个人简介">  
        <el-input 
          v-model="user.grjj" 
          type="textarea" 
          :rows="3" 
          :disabled="!isEditable"
        />
      </el-form-item>


      <!-- 职业 -->
      <el-form-item label="职业">
        <el-input 
          v-model="user.zy" 
          disabled
        />
      </el-form-item>

      <!-- 角色 -->
      <el-form-item label="角色">
        <el-input
          v-model="user.js" 
          disabled  
        /><!-- 角色通常不允许修改，固定不可编辑 -->
      </el-form-item>
      
      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button 
          v-if="!isEditable" 
          type="primary" 
          size="small" 
          @click="enterEditMode"
        >
          编辑资料
        </el-button>
        <el-button 
          v-if="isEditable" 
          type="success" 
          size="small" 
          @click="saveProfile"
          :loading="saving"
        >
          保存修改
        </el-button>
        <el-button 
          v-if="isEditable" 
          type="info" 
          size="small" 
          @click="cancelEdit"
          style="margin-left: 10px"
        >
          取消
        </el-button>
      </div>
    </el-form>
    
    <!-- 加载和错误提示 -->
    <div class="loading-status" v-if="loading && !isEditable">
      <el-alert
        title="正在加载用户数据..."
        type="info"
        :closable="false"
        center
        show-icon
      />
    </div>
    
    <div class="error-message" v-if="error">
      <el-alert
        :title="error"
        type="error"
        :closable="false"
        center
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.user-profile-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 800px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #409EFF;
}

.loading-status, .error-message {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 18px;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>

<script>
import { ref, reactive, onMounted, toRaw } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user'; // 引入Pinia存储

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter();
    const userStore = useUserStore(); // 获取登录时的用户信息
    
    // 状态管理
    const loading = ref(false); // 加载数据状态
    const saving = ref(false); // 保存数据状态
    const error = ref(''); // 错误信息
    const isEditable = ref(false); // 是否可编辑模式
    const originalUser = ref({}); // 保存原始数据（用于取消编辑时恢复）
    
    // 用户信息对象（响应式）
    const user = reactive({
      id: '', // 登录时获取的用户ID
      yhm: '',
      mm: '',
      xb: '',
      jzd: '',
      zy: '',
      grjj: '',
      js: ''
    });
    
    // 初始化：优先使用登录时的用户信息，再从接口获取最新数据
    const initUserInfo = () => {
      const storedUser = userStore.user; // 从Pinia获取登录时的用户信息
      if (storedUser && storedUser.id) {
        // 用登录时的信息初始化表单
        Object.assign(user, storedUser);
        originalUser.value = { ...storedUser }; // 保存原始数据
      } else {
        // 未获取到登录信息，跳转回登录页
        ElMessage.error('未检测到登录状态，请重新登录');
        router.push('/login');
      }
    };
    
    // 从接口获取用户信息（根据ID）
    const fetchUserInfo = async () => {
      if (!user.id) {
        error.value = '用户ID不存在';
        return;
      }
      
      loading.value = true;
      error.value = '';
      
      try {
        // 用登录时的ID请求接口（假设后端接口为根据ID查询）
        const response = await axios.get(`http://127.0.0.1:8080/user/${user.id}`,
          {
            headers: {
              // 携带登录时的token进行身份验证
              Authorization: `Bearer ${userStore.token}`
            }
          }
        );
        
        if (response.data && response.status === 200) {
          // 用接口返回的最新数据更新表单
          Object.assign(user, response.data);
          originalUser.value = { ...response.data }; // 更新原始数据备份
          ElMessage.success('数据加载成功');
        } else {
          error.value = '未找到用户数据';
          ElMessage.warning('未找到用户数据');
        }
      } catch (err) {
        console.error('获取用户信息失败:', err);
        error.value = `获取数据失败: ${err.message || '网络错误'}`;
        ElMessage.error(`获取数据失败: ${err.message || '网络错误'}`);
      } finally {
        loading.value = false;
      }
    };
    
    // 进入编辑模式
    const enterEditMode = () => {
      isEditable.value = true;
    };
    
    // 取消编辑（恢复原始数据）
    const cancelEdit = () => {
      Object.assign(user, originalUser.value); // 恢复到编辑前的状态
      isEditable.value = false;
    };
    
    // 保存修改
    const saveProfile = async () => {
      if (!user.id) {
        ElMessage.error('用户ID不存在，无法保存');
        return;
      }
      
      saving.value = true;
      error.value = '';
      
      try {
        console.log('提交的修改数据:', toRaw(user));
        // 调用后端更新接口（携带用户ID和修改后的数据）
        const response = await axios.put(
          `http://127.0.0.1:8080/user/${user.id}`,
          toRaw(user), // 转换为普通对象
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              'Content-Type': 'application/json' // 明确指定数据格式
        
            }
          }
        );
        
        if (response.data.success) {
          ElMessage.success('修改保存成功');
          isEditable.value = false;
          // 更新Pinia中的用户信息（保持全局状态一致）
          userStore.setUser(toRaw(user));
          // 更新原始数据备份
          originalUser.value = { ...toRaw(user) };
        } else {
          ElMessage.success('修改保存成功');
          isEditable.value = false;
          // 更新Pinia中的用户信息（保持全局状态一致）
          userStore.setUser(toRaw(user));
          // 更新原始数据备份
          originalUser.value = { ...toRaw(user) };
        }
      } catch (err) {
        console.error('保存用户信息失败:', err);
        ElMessage.error(`保存失败: ${err.message || '网络错误'}`);
      } finally {
        saving.value = false;
      }
    };
    
    // 组件挂载时初始化
    onMounted(() => {
      initUserInfo(); // 先用登录信息初始化
      if (user.id) {
        fetchUserInfo(); // 再从接口获取最新数据
      }
    });
    
    return {
      user,
      loading,
      saving,
      error,
      isEditable,
      fetchUserInfo,
      enterEditMode,
      cancelEdit,
      saveProfile
    };
  }
};
</script>