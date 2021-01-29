<template>
  <div>
    <div class="payEnd" v-if="sign!=3&&sign!=5">
      <div class="pay-header">
        <div class="middle">支付</div>
      </div>
      <div class="pay-content">
        <i class="el-icon-circle-check ok"></i>
        <p>结账完成 !</p>
        <div class="backIndex">
          <el-button type="success" plain @click="back">返回</el-button>
          <el-button type="success" plain @click="print" v-show="sign!=4&&sign!=5">打印小票</el-button>
          <el-button type="success" plain @click="print2" v-show="sign==4">打印小票</el-button>
          <!-- <el-button type="success" plain @click="print1" v-show="sign==5">打印小票</el-button> -->
        </div>
      </div>
    </div>
    <div class="cardSuccessView" v-if="sign==3">
      <div class="bcView">
        <div class="tView">
          <img src="../assets/images/Payok.png" />
          还款成功！
        </div>
        <div class="orderInfoView">
          <label>还款日期：{{now|time}}</label>
        </div>
        <div class="cardInfoView">
          <div>
            <div>会员：{{memberInfo.name}}</div>
            <div>卡号：{{memberInfo.card_num}}</div>
            <div>手机号：{{memberInfo.mobile}}</div>
            <div>还款名称：服务产品欠款</div>
            <div>还款金额：￥&nbsp;{{money}}</div>
          </div>
        </div>
      </div>
      <div class="btnView">
        <button class="btn-comp btn-audio" @click="back">完成</button>
      </div>
    </div>
    <div class="cardSuccessView" v-if="sign==5">
      <div class="bcView">
        <div class="tView">
          <img src="../assets/images/Payok.png" />
          充值成功！
        </div>
        <div class="orderInfoView">
          <label>订单编号：{{info.order_no}}</label>
        </div>
        <div class="cardInfoView">
          <div>订单日期：{{now|time}}</div>
          <div>消费内容：会员充值</div>
          <div>会员：{{memberInfo.name}}</div>
          <div>卡号：{{memberInfo.card_num}}</div>
          <div>手机号：{{memberInfo.mobile}}</div>
          <div>充值金额：￥&nbsp;{{Number(info.money).toFixed(2)}}</div>
          <div>赠送金额：￥&nbsp;{{info.gift_money?Number(info.gift_money).toFixed(2):'0.00'}}</div>
          <div>余额：￥&nbsp;{{memberInfo.balance}}</div>
        </div>
      </div>
      <div class="btnView">
        <button class="btn-comp btn-audio" @click="print1" style="background-color:#47BF7C">打印</button>
        <button class="btn-comp btn-audio" @click="back">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['info', 'money', 'member', 'sign', 'paytype'],
  data () {
    return {
      orderInfo: [],
      storeid: sessionStorage.getItem('storeid'),
      is_doublescreen: JSON.parse(sessionStorage.getItem('shopInfo')).is_doublescreen,
      now: new Date(),
      newInfo: '',
      memberId: '',
      memberInfo: ''
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
        case 'mixed':
          return '混合支付';
        case 'other':
          return '其他';
        case 'signbill':
          return '签账';
        case 'card':
          return '会员卡';
      }
    },
    time (value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  methods: {
    back () {
      if (this.sign != 4) {
        // this.$router.push({ name: 'members', params: { fromid: this.memberInfo.member_id } })
        sessionStorage.setItem('fromid', this.memberId)
      }
      window.history.go(0)
      if (this.is_doublescreen == 1) {
        var a = sessionStorage.getItem('FLAG')
        javascript: jsSzb.smClientScreen(a)
        return false;
      }
    },
    async getMember (member) {
      this.memberId = member
      const res = await this.$axios.get("/api?datatype=get_one_member", {
        params: {
          storeid: this.storeid,
          member_id: member
        }
      });
      if (res.data.code == 1 && res.data.data) {
        this.memberInfo = res.data.data
      }
    },
    async getorder (order) {
      const res = await this.$axios.get('/api?datatype=get_one_order', {
        params: {
          storeid: this.storeid,
          order_id: order,
        }
      })
      this.newInfo = res.data.list.mixedinfo
      console.log(res)
    },
    print () {
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }, { "name": "消费单号：" + this.info.order_no }]
      let time = moment.unix(this.info.paytime).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time }, { "name": "---" }, { "name": "消费明细", "value": "" }, { "name": "标准价", "value": "数量 #A# 金额" }, { "name": "---" })
      if (this.sign == 1) {
        arr.push({ "name": this.info.cardname })
      } else if (this.sign == 2) {
        arr.push({ "name": this.info.name })
      } else if (this.sign == 6) {
        arr.push({ "name": this.info.name + '（会员卡）' })
      }
      arr.push({ name: this.info.total, value: 1 + "#A# " + this.info.dis_total }, { "name": "---" }, { "name": "支付方式", "value": "合计" })
      if (this.info.pay_type == 'mixed') {
        let mixedinfo = JSON.parse(this.info.mixedinfo)
        for (var i in mixedinfo) {
          // console.log(i, mixedinfo[i])
          if (mixedinfo[i]) {
            arr.push({ name: this.$options.filters['type'](i), value: mixedinfo[i] })
          }
        }
      } else {
        arr.push({ name: this.$options.filters['type'](this.info.pay_type), value: this.info.dis_total })
      }
      arr.push({ "name": "---" }, { "name": "会员：" + this.memberInfo.name }, { "name": "卡号：" + this.memberInfo.card_num }, { "name": "手机号：" + this.memberInfo.mobile }, { name: '余额：' + this.memberInfo.balance }, { "name": "---" })
      let remark = this.info.remark == null ? '' : this.info.remark
      arr.push({ "name": "备注: " + remark }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      console.log(a)
      javascript: jsSzb.smPrint(a);
      return false;
    },
    print1 () {
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }, { "name": "消费单号：" + this.info.order_no }]
      let time = moment(this.now).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time }, { "name": "---" })
      arr.push({ "name": "会员：" + this.memberInfo.name }, { "name": "卡号：" + this.memberInfo.card_num }, { "name": "手机号：" + this.memberInfo.mobile })
      arr.push({ "name": "---" }, { name: '充值金额', value: Number(this.info.money).toFixed(2) })
      if (this.info.gift_money) {
        arr.push({ name: '赠送金额', value: Number(this.info.gift_money).toFixed(2) })
      }
      arr.push({ "name": "---" }, { name: '余额', value: this.memberInfo.balance }, { "name": "---" }, { "name": "支付方式", "value": "应收合计" })
      if (this.paytype == 'mixed') {
        let mixedinfo = JSON.parse(this.newInfo)
        for (var i in mixedinfo) {
          // console.log(i, mixedinfo[i])
          if (mixedinfo[i]) {
            arr.push({ name: this.$options.filters['type'](i), value: mixedinfo[i] })
          }
        }
      } else {
        arr.push({ name: this.$options.filters['type'](this.paytype), value: this.info.money })
      }
      arr.push({ "name": "---" }, { "name": "备注: " + '-' }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      console.log(a)
      javascript: jsSzb.smPrint(a);
      return false;
    },
    print2 () {
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }]
      let time = moment(this.now).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time }, { "name": "---" })
      arr.push({ name: '快速收款', value: this.money }, { "name": "---" }, { "name": "支付方式", "value": "合计" })
      if (this.info.pay_type == 'mixed') {
        let mixedinfo = JSON.parse(this.info.mixedinfo)
        for (var i in mixedinfo) {
          // console.log(i, mixedinfo[i])
          if (mixedinfo[i]) {
            arr.push({ name: this.$options.filters['type'](i), value: mixedinfo[i] })
          }
        }
      } else {
        arr.push({ name: this.$options.filters['type'](this.paytype), value: this.money })
      }
      arr.push({ "name": "---" }, { "name": "备注: " + '-' }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      console.log(a)
      javascript: jsSzb.smPrint(a);
      return false;
    }
  },
  created () {
    // console.log(this.sign)
    if (this.info && this.info.member_id) {
      this.getMember(this.info.member_id)
    }
    if (this.info && this.info.order_no && !this.info.mixedinfo) {
      this.getorder(this.info.order_no)
    }
    if (this.member) {
      this.getMember(this.member)
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
.cardSuccessView {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 10;
  padding-top: 8%;
  .bcView {
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    width: 560px;
    background: #f4f4f4;
    border-radius: 10px;
    font-size: 14px;
    height: 70%;
    padding: 0 30px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    .tView {
      line-height: 46px;
      font-size: 24px;
      color: #28282d;
      padding: 35px 0 40px 0;
      text-align: center;
      img {
        width: 46px;
        height: 46px;
        vertical-align: top;
        margin-right: 20px;
      }
    }
    .cardInfoView {
      line-height: 28px;
    }
  }
  .btnView {
    margin-top: 40px;
    text-align: center;
    button {
      width: 260px;
      margin-left: 20px;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      color: #fff;
      background: #dc670b;
      border-radius: 6px;
    }
  }
}
</style>