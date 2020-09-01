<template>
  <div class="payEnd">
    <div class="pay-header">
      <div class="middle">支付</div>
    </div>
    <div class="pay-content">
      <i class="el-icon-circle-check ok"></i>
      <p>结账完成 !</p>
      <div class="backIndex" @click="back">
        <el-button type="success" plain>返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  methods: {
    back () {
      window.history.go(0)
      var a = 'FLAG_1'
      javascript: jsSzb.smClientScreen(a)
      return false;
    },
  },
}
</script>
<style lang='scss' scoped>
.payEnd {
  text-align: center;
  .pay-header {
    height: 84px;
    font-size: 24px;
    line-height: 84px;
    border-bottom: 1px solid #ccc;
    position: relative;
    .left {
      position: absolute;
      left: 10px;
    }
    .middle {
      text-align: center;
    }
  }
  .pay-content {
    padding-top: 100px;

    .ok {
      font-size: 120px;
      color: rgb(104, 208, 104);
    }
    p {
      font-size: 40px;
      padding: 20px;
    }
    .backIndex {
      font-size: 20px;
    }
  }
}
</style>