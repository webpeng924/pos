<template>
  <div id="app" v-cloak>
    <sz-nav></sz-nav>
    <router-view class="page"></router-view>
    <audio id="audio" src="https://hb.rgoo.com/tishi.mp3" style="display:none;" />
  </div>
</template>

<script>
import nav from './views/nav.vue'
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
          noloading: true
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
    async getyynew () {
      // console.log('请求预约数据')
      if (this.$route.path == '/login') return
      let that = this
      const res = await this.$axios.get('/api?datatype=get_yylist_read', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          noloading: true
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        let list = res.data.data
        let txt = '</br>'
        list.forEach(item => {
          txt += `<p>预约人：${item.name}，手机号：${item.mobile}，预约项目：${item.itemname}，预约时间：${item.yytime}。</p></br>`
        })
        that.$alert(txt, '预约提醒', {
          confirmButtonText: '确认预约',
          dangerouslyUseHTMLString: true,
          showClose: false,
          callback: action => {
            that.$axios.get('/api?datatype=get_yylist_read_confirm', {
              params: {
                storeid: sessionStorage.getItem('storeid'),
                noloading: true
              }
            })
            this.$message(res.data.msg)
          }
        });
        const audio = document.getElementById('audio')
        audio.play()
      }
    },
    openIn (notify, memberId, v) {
      notify.close()
    }
  },
  mounted () {
    let audio = document.getElementById('audio')
    audio.play()
    setTimeout(() => {
      audio.pause()
      audio.load()
    }, 10)
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
    let yynew = null
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
    }, duration)
    yynew = setInterval(() => {
      this.getyynew()
    }, 60000)
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
