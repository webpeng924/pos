<template>
  <div class="payEnd">
    <div class="pay-header">
      <div class="middle">支付</div>
    </div>
    <div class="pay-content">
      <i class="el-icon-circle-check ok"></i>
      <p>结账完成 !</p>
      <div class="backIndex">
        <el-button type="success" plain @click="back">返回首页</el-button>
        <el-button type="success" plain @click="print">打印小票</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['info'],
  data () {
    return {
      orderInfo: [],
      is_doublescreen: JSON.parse(sessionStorage.getItem('shopInfo')).is_doublescreen,
    }
  },
  filters: {
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
      window.history.go(0)
      if (this.is_doublescreen == 1) {
        var a = sessionStorage.getItem('FLAG')
        javascript: jsSzb.smClientScreen(a)
        return false;
      }
    },
    print () {
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }, { "name": "消费单号：" + this.info.order_no }]
      let time = moment.unix(this.info.dateline).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time }, { "name": "---" }, { "name": "消费明细", "value": "" }, { "name": "标准价", "value": "数量 #A# 折扣 #A# 金额" }, { "name": "---" })
      this.orderInfo.forEach(v => {
        let type = " 服务: "
        if (v.typeid == 2) {
          type = "销售："
        }
        arr.push({ "name": v.itemname + type + v.workername })
        let discount = v.discount == 1 ? '原价' : v.discount + '折扣'
        let discount_price = v.discount == 1 ? '-' : v.discount_price
        arr.push({ name: v.price, value: v.num + "#A#" + discount + "#A# " + discount_price })
      })
      let remark = this.info.remark == null ? '' : this.info.remark
      arr.push({ "name": "---" }, { "name": "支付方式", "value": "合计" }, { name: this.$options.filters['type'](this.info.pay_type), value: this.info.dis_total }, { "name": "---" }, { "name": "备注: " + remark }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      // console.log(a)
      javascript: jsSzb.smPrint(a);
      return false;
    }
  },
  created () {
    if (this.info) {
      this.orderInfo = this.info.info
    }
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
      margin-bottom: 20px;
    }
  }
}
</style>