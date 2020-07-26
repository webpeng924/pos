<template>
  <div id="app" v-cloak>
    <sz-nav></sz-nav>
    <router-view class="page"></router-view>
  </div>
</template>

<script>
import nav from './views/nav.vue'

export default {
  components: {
    'sz-nav': nav
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="css">
@import '//at.alicdn.com/t/font_1902156_jal59d8ywtq.css';

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
