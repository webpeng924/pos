<template>
  <div id="project">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">产品介绍</div>
      <button class="btn-audio btn-shopCart"></button>
    </div>
    <div class="menuView">
      <div
        class="menuItem btn-audio"
        style="margin-left: 25px;"
        :class="{select:item==1}"
        @click="item=1"
      >护理</div>
      <div class="menuItem btn-audio" :class="{select:item==2}" @click="item=2">美容</div>
      <div class="menuItem btn-audio" :class="{select:item==3}" @click="item=3">精油</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      item: 1
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    }
  },
  created () { },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#project {
  height: 100%;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    height: 85px;
    line-height: 40px;
    background: #fff;
    text-align: center;
    .btn-back {
      width: 40px;
      height: 40px;
      background-image: url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NavBack.png);
      background-position: left center;
      background-size: 28px;
      background-repeat: no-repeat;
    }
    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
      font-family: PingFangSC-Semibold;
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_ShopCart_Black.png)
        center / 24px no-repeat;
    }
  }
}
</style>
