<template>
  <div id="app" v-cloak>
    <sz-nav></sz-nav>
    <router-view class="page"></router-view>
  </div>
</template>

<script>
import nav from './views/nav.vue'
import { userInfo } from 'os';

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
      console.log(e)
      var that = this;
      var n = window.event.screenX - window.screenLeft;
      var b = n > document.documentElement.scrollWidth - 20;
      if (b && window.event.clientY < 0 || window.event.altKey) {
        that.$axios.get('/api?datatype=logout&id=' + that.id)
        return false
      } else {
        console.log('刷新')
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
    }
  },
  mounted () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  }
}
</script>

<style lang="css">
@import '//at.alicdn.com/t/font_1902156_6niq9bbqylf.css';

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
