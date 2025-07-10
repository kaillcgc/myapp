<template>
  <div class="con-regist" style="margin: 0px auto;width: 1400px;margin-top: 50px;margin-bottom: 50px;">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.yhm"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.mm" type="password"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.xb">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="居住地">
        <el-select v-model="form.jzd" placeholder="请选择居住地">
          <el-option label="北京市" value="北京市"></el-option>
          <el-option label="天津市" value="天津市"></el-option>
          <el-option label="河北省" value="河北省"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职业">
        <el-input type="textarea" v-model="form.zy"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input type="textarea" v-model="form.grjj"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即注册</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
  setup() {
    const router = useRouter(); // 使用 Vue Router

    return {
      router // 暴露给模板和方法使用
    }
  },
  data() {
    return {
      form: {
        yhm: '',
        mm: '',
        xb: '',
        jzd: '',
        zy: '',
        grjj: '',
      }
    };
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8080/register',
          this.form
        );

        // 检查响应状态
        if (response.status === 200) {
          // 显示成功消息
          ElMessage.success('注册成功！');

          // 延迟1秒后跳转到登录页面
          setTimeout(() => {
            this.router.push('/login'); // 跳转到登录页面
          }, 1000);
        } else {
          ElMessage.warning('注册失败，请重试');
        }
      } catch (error) {
        console.error('注册失败:', error);

        // 显示错误消息
        if (error.response) {
          // 服务器返回的错误
          ElMessage.error(`注册失败：${error.response.data.message || '服务器错误'}`);
        } else if (error.request) {
          // 请求已发出但无响应
          ElMessage.error('注册失败：无法连接到服务器');
        } else {
          // 其他错误
          ElMessage.error(`注册失败：${error.message}`);
        }
      }
    },
    cancel() {
      this.router.push('/login');
    }
  },
  mounted(){
    document.title='用户注册 - 四川非遗新闻发布系统';
  }
}
</script>