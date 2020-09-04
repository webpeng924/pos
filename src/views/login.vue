<template>
  <div id="login">
    <div>
      <div class="login_box">
        <div class="top">
          <img src="../assets/images/logo.jpg" alt />
        </div>
        <div class="bom" @keyup.enter="login">
          <el-input v-model="name" @change="success=false" placeholder="请输入账号" clearable>
            <i slot="prefix" class="iconfont icon-yonghuming1"></i>
          </el-input>
          <el-input
            v-model="password"
            @change="success=false"
            placeholder="请输入密码"
            :show-password="true"
          >
            <i slot="prefix" class="iconfont icon-lock"></i>
          </el-input>
        </div>
        <div class="btn" @click="login">登陆</div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:signPage}">
      <xiaohao @close="signPage=false" v-if="signPage"></xiaohao>
    </div>
  </div>
</template>

<script>
import signPage from '@/components/signPage'
import qs from 'qs'
export default {
  components: {},
  props: {},
  data () {
    return {
      password: '',
      name: '',
      signPage: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    async login () {
      if (!this.name) return this.$message.error('请输入账号')
      if (!this.password) return this.$message.error('请输入密码')
      let data = qs.stringify({
        username: this.name,
        password: this.password
      })
      console.log('成功')
      try {
        const res = await this.$axios.post('/api?datatype=login', data)
        console.log(res)
        if (res.data.code == 1) {
          this.getInfo(res.data.data.storeid)
          this.$message.success(res.data.msg)
          sessionStorage.setItem('storeid', res.data.data.storeid)
          this.$store.commit('setJson', res.data.data);
          localStorage.setItem('userId', res.data.data.id)
          sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
        } else {
          this.$message.error(res.data.msg)
        }
      }
      catch (err) {
        alert('登录出错')
      }
    },
    async getInfo (id) {
      const res = await this.$axios.get('/api?datatype=more&storeid=' + id)
      console.log(res)
      if (res.data.code == 1) {
        let data = res.data.data
        sessionStorage.setItem('shopInfo', JSON.stringify(data))
        sessionStorage.setItem('shoptype', data.type_id)
        this.$router.push({ name: 'Home' })
      }
    }
  },
  created () { },
  mounted () {
    if ((/Android/gi).test(navigator.userAgent)) {
      window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' ||
          document.activeElement.tagName == 'TEXTAREA') {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  background: url(../assets/images/bg.png);
  z-index: 999;
  padding-left: 0;
  height: 100%;
  overflow-y: auto;
  position: fixed;
  width: 100%;
  > div {
    height: 100%;
    min-height: 700px;
    // min-width: 1200px;
    position: relative;
    justify-content: center; /*子元素水平居中*/
    align-items: center; /*子元素垂直居中*/
    display: -webkit-flex;
    .login_box {
      width: 40%;
      height: 60%;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 16px 60px 0px rgba(0, 0, 0, 0.5);
      border-radius: 16px;
      // margin: 160px auto;
      position: relative;
      .top {
        width: 100%;
        height: 35%;
        position: relative;
        background: url(../assets/images/bg1.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 300px;
        img {
          position: absolute;
          // width: 170px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 80%;
        }
      }
    }
    .bom {
      width: 70%;
      // height: 50%;
      margin: 0 auto;
      /deep/.el-input {
        margin-top: 50px;
        .el-input__inner {
          border-radius: 0;
          border: none;
          border-bottom: 1px solid #999;
          font-size: 20px;
        }
      }
      i {
        color: #56a7ff;
        line-height: 40px;
        font-size: 22px;
      }
    }
    .btn {
      position: absolute;
      bottom: 10px;
      width: 50%;
      // height: 10%;
      padding: 1% 0;
      transform: translateX(-50%);
      left: 50%;
      background: rgba(86, 167, 255, 1);
      border-radius: 4px;
      color: #fff;
      text-align: center;
      font-size: 24px;
      cursor: pointer;
    }
  }
}
</style>
