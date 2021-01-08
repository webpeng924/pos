<template>
  <div id="app" v-cloak>
    <sz-nav></sz-nav>
    <router-view class="page"></router-view>
  </div>
</template>

<script>
import nav from './views/nav.vue'
import { setInterval } from 'timers';
import moment from 'moment'

export default {
  components: {
    'sz-nav': nav
  },
  data () {
    return {
      id: localStorage.getItem('userId'),
      beforeUnloadTime: '',
      gapTime: ''
    }
  },
  destroyed () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  },
  methods: {
    browerStatus (e) {
      // console.log(e)
      var that = this;
      var n = window.event.screenX - window.screenLeft;
      var b = n > document.documentElement.scrollWidth - 20;
      if (b && window.event.clientY < 0 || window.event.altKey) {
        that.$axios.get('/api?datatype=logout&id=' + that.id)
        return false
      } else {
        // console.log('刷新')
      }
    },
    beforeunloadHandler () {
      this.beforeUnloadTime = new Date().getTime();
    },
    unloadHandler (e) {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime;
      //判断是窗口关闭还是刷新
      if (this.gapTime <= 5) {
        var img = document.createElement("img");
        //src是自己的后端地址以及参数(参数看自己需求)
        img.src = this.$axios.get('/api?datatype=logout&id=' + this.id);
        //将img加到body中时就会立刻发送请求
        document.body.appendChild(img);
      }
    },
    async getList () {
      let that = this
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          sign: 2,
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        let tableData = res.data.data
        let now = moment().format('YYYY-MM-DD')
        tableData.forEach(v => {
          if ((v.birthday1 || v.birthday2) && (v.birthday1 == now || v.birthday2 == now)) {
            v.notify = this.$notify({
              title: '提示',
              message: '今天是会员 ' + v.name + ' 的生日。    我知道了',
              type: 'warning',
              showClose: false,
              duration: 0,
              offset: 80,
              onClick: () => { that.openIn(v.notify, v.member_id, v) },
              position: 'top-right'
            });
          }
        })
      }
    },
    openIn (notify, memberId, v) {
      // console.log('点击了')
      notify.close()
      // if (this.$route.path == '/members') {
      //   sessionStorage.setItem('fromid', memberId)
      //   this.$router.push({ name: 'Home' })
      //   // window.history.go(0)
      // } else {
      // sessionStorage.setItem('fromid', memberId)
      // this.$router.push({ name: 'members' })
      // }
    }
  },
  mounted () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName == 'INPUT' ||
        document.activeElement.tagName == 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    })
    let now = moment().format('YYYY-MM-DD HH:ss')
    let duration = ''
    let newtime = moment().format('YYYY-MM-DD 10:00')
    let member = null
    if (moment(now) > moment(newtime)) {
      // 超过
      this.getList()
      newtime = moment().add(1, 'days').format('YYYY-MM-DD 10:00')
      duration = moment.duration(new moment(newtime).diff(new moment()))._milliseconds
      // console.log(newtime)
      // console.log(duration)
    } else {
      // 未超过
      duration = moment.duration(new moment(newtime).diff(new moment()))._milliseconds
      console.log(duration)
    }
    let timeout = setTimeout(() => {
      this.getList()
      timeout = null
      member = setInterval(() => {
        this.getList()
      }, 86400000)
      // console.log(member)
    }, duration)
  }
}
</script>

<style lang="css">
@import '//at.alicdn.com/t/font_1902156_rvovt6fc0m.css';

/* html {
  min-width: 960px;
  min-height: 600px;
} */
</style>
<style scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.page {
  /* width: calc(100%-12em); */
  height: 100%;
  padding-left: 120px;
}
</style>
