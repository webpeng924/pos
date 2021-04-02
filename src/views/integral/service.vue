<template>
  <div id="cardHome">
    <div class="tView">联系客服</div>
    <div class="cView">
      <p>请扫描下方二维码，添加客服微信</p>
      <img src="../../assets/images/szbkf.png" alt />
      <img src="../../assets/images/szbkf2.png" alt />
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
  methods: {},
  created () { },
  mounted () { },
  watch: {},
  computed: {}
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
      width: 25%;
      margin: 10%;
    }
  }
}
</style>
