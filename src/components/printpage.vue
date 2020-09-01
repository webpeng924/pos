<template>
  <div class="printPage">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">单号：{{info.order_no}} 已结账</div>
      <el-button @click="print">打印</el-button>
    </div>
    <div class="contentView" style="color: rgb(40, 40, 45);">
      <div class="headerView">
        <div class="orderInfoView">
          <div class="editDateView edit">消费日期：{{info.dateline|moment}}</div>
        </div>
      </div>
      <div class="serviceView">
        <div class="tView">消费内容</div>
        <div class="listItem" v-for="(v,k) in orderInfo" :key="k">
          <div class="infoView">
            <div class="nameView">
              <label class="label-name">{{v.itemname}}</label>
              <label class="label-cnt">
                X
                <span>{{v.num}}</span>
              </label>
              <!---->
            </div>
            <div class="payTypeView">{{info.pay_type|type}}</div>
            <div class="payAmtView">￥{{v.discount_price}}</div>
          </div>
          <div class="empView" v-show="v.staff1!=0">
            <label>
              <span class="span-name">凯撒</span>
              <span class="span-job">No.</span>
            </label>
          </div>
        </div>
      </div>
      <div class="payTypeView">
        <div class="tView">支付方式</div>
        <div class="payInfoView">
          <div class="typeItem">
            <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_XJ.png" class="img-icon" />
            <label>{{info.pay_type|type}}</label>
            <label class="label-amt">￥&nbsp;{{info.dis_total}}</label>
          </div>
        </div>
      </div>
      <div class="bottomView">
        <div class="remarkView">{{info.remark?info.remark:'无备注信息'}}</div>
        <div class="totalAmtView">
          总价：
          <label>
            ￥&nbsp;
            <span>{{info.dis_total}}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: ['info'],
  data () {
    return {
      orderInfo: []
    }
  },
  filters: {
    moment (val) {
      return moment.unix(val).format('YYYY-MM-DD')
    },
    type (val) {
      switch (val) {
        case 'zfb':
          return '支付宝';
        case 'wx':
          return '微信';
        case 'cash':
          return '现金';
        case 'other':
          return '其他';
        case 'signbill':
          return '签账';
        case 'card':
          return '会员卡';
      }
    }
  },
  methods: {
    back () {
      this.$emit('close')
    },
    print () {
      let obj = {
        shopName: JSON.parse(sessionStorage.getItem('shopInfo')).shop_name,
        type: '结账单',
        time: moment(this.info.dateline).format('YYYY-MM-DD'),
        list: this.orderInfo,
        printTime: this.formatDate(new Date),
        payType: this.$options.filters['type'](this.info.pay_type),
        dis_total: this.info.dis_total
      }
      var a = JSON.stringify(obj); javascript: lee.funAndroid(a);
      return false;
    },
  },
  created () {
    if (this.info) {
      this.orderInfo = this.info.orderinfo
    }
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.printPage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  z-index: 200;
  padding-bottom: 35px;
  .tView {
    width: 100%;
    text-align: center;
  }
  .contentView {
    height: calc(100% - 85px);
    overflow-y: auto;
    background: #fff;
    border-radius: 6px;
    padding: 0 25px 10px 25px;
    margin: 0px 80px 0 80px;
    color: #28282d;
    .headerView {
      border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
      padding-bottom: 12px;
      .orderInfoView {
        display: flex;
        line-height: 28px;
        padding: 12px 0 5px 0;
        font-size: 13px;
        color: #8a8a8a;
        div {
          width: 30%;
          height: 28px;
          vertical-align: middle;
        }
      }
    }
    .serviceView > .tView {
      font-size: 16px;
      line-height: 28px;
      padding: 12px 0 8px 0;
      height: 48px;
      text-align: left;
    }
    .serviceView > .listItem {
      background: #f4f4f4;
      padding: 15px 15px 10px 15px;
      margin-bottom: 10px;
      border-radius: 6px;
      overflow: hidden;
      .infoView {
        display: flex;
        line-height: 30px;
        .nameView {
          flex: 1;
          font-size: 15px;
          > .label-name {
            min-width: 180px;
          }
          .label-cnt {
            margin-left: 35px;
            font-size: 14px;
          }
        }
        .payTypeView {
          min-width: 85px;
          text-align: right;
          font-size: 14px;
        }
        .payAmtView {
          min-width: 85px;
          text-align: right;
          font-size: 14px;
        }
      }
      .empView {
        margin-top: 5px;
        line-height: 25px;
        font-size: 13px;
      }
    }
    > .payTypeView {
      margin-top: 12px;
      .tView {
        line-height: 36px;
        font-size: 14px;
        text-align: left;
      }
      .payInfoView {
        display: flex;
        line-height: 30px;
        font-size: 14px;
        .typeItem {
          flex: 1;
          display: flex;
          .img-icon {
            margin-top: 3px;
            margin-right: 10px;
            width: 24px;
            height: 24px;
          }
          .label-amt {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
    .bottomView {
      display: flex;
      padding: 15px 5px 10px 5px;
      line-height: 24px;
      .remarkView {
        flex: 1;
        font-size: 14px;
        color: #8a8a8a;
      }
      .totalAmtView {
        margin-left: 25px;
        font-size: 14px;
        color: #5a5a5a;
        label {
          font-size: 16px;
          color: #ff5e56;
        }
      }
    }
  }
}
</style>
