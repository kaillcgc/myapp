<template>
    <div>
        <h1>AboutPage</h1>
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="yhm" placeholder="$[yhm]" required>
            <input type="text" v-model="mm" placeholder="$[mm]" required>
            <input type="text" v-model="xb" placeholder="$[xb]" required>
            <input type="text" v-model="jzd" placeholder="$[jzd]" required>
            <input type="text" v-model="zy" placeholder="$[zy]" required>
            <input type="text" v-model="grjj" placeholder="$[grjj]" required>
            <input type="text" v-model="js" placeholder="$[js]" required>
            <button type="primary">修改</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AboutPage',
    data() {
        return {
            yhm:'',
            mm:'',
            xb:'',
            jzd:'',
            zy:'',
            grjj:'',
            js:'',
            
        }
    },
    mounted() {
        this.yhm = this.$route.params.yhm;
        this.getUserProfile();
    },

    methods: {
        async handleLogin() {
            const response = await axios.post('http://127.0.0.1:8080/api/user/'+this.yhm, {
                yhm: this.yhm,
                mm: this.mm,
                xb:this.xb,
                jzd:this.jzd,
                zy:this.zy,
                grjj:this.grjj,
                js:this.js,
            })
            if (response.data) {
                console.log(response.data)
            } else {
                alert("请求失败")
            }
        },
        // 获取用户信息接口 (Updated comment)
        async getUserProfile() {
            try {
                const token = this.$store.state.user.token;
                // 修改数据解构方式
                const response = await axios.get(`/api/user/${this.yhm}`)
                console.log('原始响应数据:', response.data)
                
                // 直接解构顶层字段
                const { yhm, mm, xb, jzd, zy, grjj, js } = response.data;
                
                // 替代原来的 response.data.user
                Object.assign(this.userInfo, {
                  username: yhm,
                  password: mm,
                  gender: xb,
                  address: jzd,
                  profession: zy,
                  bio: grjj,
                  role: js
                });
                Object.assign(this, { yhm, mm, xb, jzd, zy, grjj, js });
            } catch (error) {
                console.error('用户信息获取失败:', error);
                alert(`获取用户信息失败：${error.response?.data?.message || error.message}`);
            }
        }
    }
}
</script>
