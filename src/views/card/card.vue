<template>
  <div id="cardHome">
    <div class="tView">售卡</div>
    <div class="cardTypeView listView" style="height: 793px;">
      <div class="cardTypeItem listItem" @click="cardDialog=true">
        <div class="imgView">
          <img src="../../assets/images/vip.png" />
        </div>
        <div class="textView">
          <label class="label-name one-txt-cut">会员卡</label>
          <label class="label-price one-txt-cut">
            ￥&nbsp;
            <span>0</span>
          </label>
        </div>
      </div>
      <div class="cardTypeItem listItem">
        <div class="imgView">
          <img src="../../assets/images/vip.png" />
        </div>
        <div class="textView">
          <label class="label-name one-txt-cut">1000元白银九折卡</label>
          <label class="label-price one-txt-cut">
            ￥&nbsp;
            <span>1000</span>
          </label>
        </div>
      </div>
      <div class="cardTypeItem listItem">
        <div class="imgView">
          <img src="../../assets/images/vip.png" />
        </div>
        <div class="textView">
          <label class="label-name one-txt-cut">2000元黄金八折卡</label>
          <label class="label-price one-txt-cut">
            ￥&nbsp;
            <span>2000</span>
          </label>
        </div>
      </div>
      <div class="cardTypeItem listItem">
        <div class="imgView">
          <img src="../../assets/images/vip.png" />
        </div>
        <div class="textView">
          <label class="label-name one-txt-cut">5000元钻石六折卡</label>
          <label class="label-price one-txt-cut">
            ￥&nbsp;
            <span>5000</span>
          </label>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="cardDialog"
      :before-close="handleClose"
      width="64em"
    >
      <div class="cardDetailView">
        <div class="topView">
          <div class="imgView">
            <img src="../../assets/images/vip.png" />
          </div>
          <div class="nameView">会员卡</div>
          <div class="menuView">
            <div class="menuItem select">账户详情</div>
          </div>
        </div>
        <div class="contentView">
          <div class="descView listView" style="height: 355px;">
            <p>储值账户金额：0元</p>
          </div>
        </div>
        <div class="bView">
          <label class="label-price">
            ￥&nbsp;0
            <span>(储值：￥0)</span>
          </label>
          <div class="btn-select btn-audio" @click="pages = 1;page=true;cardDialog=false">选择</div>
        </div>
      </div>
    </el-dialog>

    <div class="set_page" :class="{activePage:page}" v-if="pages==1">
      <opencard @close="page=false"></opencard>
    </div>
  </div>
</template>

<script>
import opencard from '@/components/openCard.vue'
export default {
  components: { opencard },
  props: {},
  data () {
    return {
      cardDialog: false,
      page: false,
      pages: null
    }
  },
  watch: {},
  computed: {},
  methods: {
    handleClose () {
      this.cardDialog = false
    }
  },
  created () { },
  mounted () { }
}
</script>
<style>
.el-dialog__body {
  padding: 0;
}
.el-dialog__wrapper > div {
  margin-top: 5vh !important;
}
</style>
<style lang="scss" scoped>
#cardHome {
  // background: #f4f4f4;
  .tView {
    padding: 35px 20px 10px 20px;
    font-size: 24px;
    color: #28282d;
    background: #fff;
  }
  .cardTypeView {
    padding: 10px 0 20px 25px;
    overflow-x: hidden;
    overflow-y: auto;
    .cardTypeItem {
      cursor: pointer;
      position: relative;
      float: left;
      padding: 15px 15px 0 15px;
      margin: 0 10px 15px 10px;
      border-radius: 10px;
      overflow: hidden;
      .textView {
        padding: 15px 0 10px 0;
        line-height: 20px;
        display: flex;
        width: 220px;
        .label-name {
          flex: 1;
          font-size: 15px;
          font-family: PingFangSC-Semibold;
          color: #28282d;
        }
        .label-price {
          flex: 1;
          text-align: right;
          font-size: 15px;
          font-family: PingFangSC-Semibold;
          color: #ff5e56;
          span {
            font-size: 18px;
          }
        }
      }
    }
  }
  .imgView > img {
    width: 220px;
    height: 142px;
    border-radius: 8px;
    overflow: hidden;
    background: #f4f4f4;
  }
  .el-dialog {
    border-radius: 6px;
    box-shadow: rgb(51, 51, 51) 0px 0px 20px 0px;
    /deep/.el-dialog__body {
      padding: 0;
    }
  }
  .cardDetailView {
    .topView {
      text-align: center;
    }
    .nameView {
      line-height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Semibold;
      color: #28282d;
      padding: 15px 0 15px 0;
    }
  }
  .menuItem {
    position: relative;
    display: inline-block;
    line-height: 32px;
    font-size: 15px;
    color: #5a5a5a;
    width: 82px;
    text-align: center;
  }
  .menuItem.select:after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    content: '';
    width: 24px;
    height: 2px;
    background: #28282d;
    border-radius: 1px;
  }
  .contentView {
    padding: 10px 15px 0 15px;
    background: #fff;
  }
  .contentView > div {
    background: #f4f4f4;
    border-radius: 6px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .descView {
    padding: 12px 15px;
  }
  .bView {
    padding: 10px 15px;
    line-height: 40px;
    overflow: hidden;
    height: 60px;
    .btn-select {
      float: right;
      width: 110px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #fff;
      background: #28282d;
      border-radius: 6px;
      text-align: center;
    }
    .label-price {
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      color: #ff5e56;
      span {
        margin-left: 10px;
        font-size: 15px;
        color: #8a8a8a;
      }
    }
  }
  .set_page {
    position: absolute;
    background: #fff;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    top: 100%;
    z-index: 11;
  }

  .set_page.activePage {
    top: 0;
    animation: top 0.5s linear;
  }

  @keyframes bottom {
    0% {
      top: 0;
    }

    100% {
      top: 100%;
    }
  }
  @keyframes top {
    0% {
      top: 100%;
      opacity: 0;
    }

    100% {
      top: 0;
      opacity: 1;
    }
  }
}
</style>
