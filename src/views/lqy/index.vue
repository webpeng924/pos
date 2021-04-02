<template>
  <div class="lqy-index">
    <div class="topView">
      <div class="tView">短信营销</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <el-tabs tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="短信群发">
        <div class="box">
          <lqyPosting></lqyPosting>
        </div>
      </el-tab-pane>
      <el-tab-pane label="短信历史" style="
    height: calc(100% - 85px);
">
        <div class="box" v-if="show">
          <history></history>
        </div>
      </el-tab-pane>
      <el-tab-pane label="短信充值">
        <div class="box">
          <lqyRecharge></lqyRecharge>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import lqyPosting from "./postingAll.vue";
import lqyRecharge from "./recharge.vue";
import history from './history'
export default {
  data () {
    return {
      show: false
    }
  },
  created () { },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
      if (tab.label == '短信历史') {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  components: {
    lqyPosting,
    lqyRecharge,
    history
  }
};
</script>
<style lang="scss" scoped>
$height: calc(100% - 85px);
.lqy-index {
  font-size: 16px;
  height: 100%;
  .topView {
    position: relative;
    background: #fff;
    padding: 25px 0 15px 0;
    text-align: center;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    .tView {
      font-size: 24px;
      color: #28282d;
      line-height: 40px;
      text-align: center;
      width: 100%;
    }
    .btn-back {
      position: absolute;
      top: 25px;
      left: 15px;
    }
  }
  /deep/.el-tabs--left {
    height: 100%;
  }
  /deep/.el-tabs__header {
    margin: 0;
    width: 150px;
  }
  /deep/.el-tabs__content {
    height: $height;
    overflow: auto;
  }
  .box {
    height: 100%;
  }
}
</style>
