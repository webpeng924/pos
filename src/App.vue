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
    }
  },
  methods: {
    browerStatus (e) {
      console.log(e)
      var that = this;
      let id = localStorage.getItem('userId')
      var n = window.event.screenX - window.screenLeft;
      var b = n > document.documentElement.scrollWidth - 20;
      if (b && window.event.clientY < 0 || window.event.altKey) {
        that.$axios.get('/api?datatype=logout&id=' + id)
      } else {
        // that.$axios.get('/api?datatype=logout&id=7')
      }
    }
  },
  mounted () {
    var that = this;
    // 监听浏览器是否关闭
    window.addEventListener("beforeunload", e => that.browerStatus())
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
