<template>
  <div id="cardHome">
    <div class="tView">注册会员</div>
    <div class="cView">
      <p>请扫描下方二维码，进入会员专用小程序注册会员</p>
      <img src="../../assets/images/zhuceewm.jpg" alt />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () {
    console.log('创建')
    var a = 'FLAG_2'
    javascript: jsSzb.smClientScreen(a)
    return false;
  }
}
</script>

<style lang="scss" scoped>
#cardHome {
  // background: #f4f4f4;
  .tView {
    padding: 35px 20px 10px 20px;
    font-size: 24px;
    color: #28282d;
    background: #fff;
  }
  .cView {
    width: 100%;
    height: calc(100% - 85px);
    text-align: center;
    padding-top: 80px;
    p {
      font-size: 14px;
    }
    img {
      height: calc(100% - 100px);
      margin-top: 30px;
    }
  }
}
</style>
