<template>
  <div id="sznav">
    <div class="logo">
      <img src="../assets/images/logo.png" alt />
    </div>
    <router-link :to="{name:'Home'}">
      <div class="nav_item">
        <i class="iconfont icon-shouyin"></i>
        <span>收银台</span>
      </div>
    </router-link>
    <router-link :to="{name:'card'}" v-show="type!=1">
      <div class="nav_item">
        <i class="iconfont icon-huiyuanvipqia01"></i>
        <span>开通会员</span>
      </div>
    </router-link>
    <router-link :to="{name:'order'}">
      <div class="nav_item">
        <i class="iconfont icon-yuyuejilu"></i>
        <span>预约</span>
      </div>
    </router-link>
    <router-link :to="{name:'showroom'}">
      <div class="nav_item">
        <i class="iconfont icon-zhanting"></i>
        <span>展厅</span>
      </div>
    </router-link>
    <router-link :to="{name:'members'}">
      <div class="nav_item">
        <i class="iconfont icon-tianchongxing-"></i>
        <span>会员</span>
      </div>
    </router-link>
    <router-link :to="{name:'daily'}">
      <div class="nav_item">
        <i class="iconfont icon-bingtutongji"></i>
        <span>日结</span>
      </div>
    </router-link>
    <!-- <router-link :to="{name:'brand'}">
      <div class="nav_item">
        <i class="iconfont icon-biaoqian"></i>
        <span>流水牌</span>
      </div>
    </router-link>-->
    <router-link :to="{name:'store'}">
      <div class="nav_item">
        <i class="iconfont icon-stock"></i>
        <span>库存</span>
      </div>
    </router-link>
    <router-link :to="{name:'more'}">
      <div class="nav_item">
        <i class="iconfont icon-wenda"></i>
        <span>更多</span>
      </div>
    </router-link>
    <router-link :to="{name:'integralShop'}">
      <div class="nav_item">
        <i class="iconfont icon-jifenshangcheng"></i>
        <span>积分商城</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      type: sessionStorage.getItem('shoptype')
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#sznav {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 120px;
  background: linear-gradient(to bottom, #3c2615 0%, #7b6554 100%);
  color: rgb(170, 170, 170);
  overflow: auto;
  .logo {
    height: 85px;
    line-height: 85px;
    text-align: center;
  }
  img {
    width: 100%;
    height: 85px;
    vertical-align: top;
  }
  a > .nav_item {
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 12px;
    justify-content: space-between;
    text-align: center;
    color: rgb(170, 170, 170);
    display: flex;
    cursor: pointer;
    i {
      font-size: 28px;
    }
    span {
      display: inline-block;
      font-size: 16px;
      width: 70px;
      text-align: left;
    }
  }
  a.router-link-active {
    .nav_item {
      color: #fff;
      background: #dc670b;
    }
  }
}
</style>
