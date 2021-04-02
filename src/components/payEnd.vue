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
        <el-button type="success" v-if="info.customer_type == 2" plain @click="tomember">查看会员</el-button>
        <el-button type="success" plain @click="print">打印小票</el-button>
      </div>
    </div>
    <printPage class="printTest" v-if="printTest" :printList="printList"></printPage>
  </div>
</template>

<script>
import print from "print-js"
import moment from 'moment'
import printPage from '@/components/print'
export default {
  components: {
    printPage
  },
  props: ['info'],
  data () {
    return {
      printTest: false,
      orderInfo: [],
      storeid: sessionStorage.getItem('storeid'),
      cikalist: [],
      memberId: '',
      is_doublescreen: JSON.parse(sessionStorage.getItem('shopInfo')).is_doublescreen,
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
        // case 'mixed':
        //   return '混合支付';
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
    async getMember (member) {
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
    tomember () {
      // 去会员
      sessionStorage.setItem('fromid', this.memberId)
      this.$router.push({ name: 'members' })
    },
    print () {
      if ((window.navigator.userAgent).indexOf('wv') == -1) {
        this.printaa()
        return
      }
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }, { "name": "消费单号：" + this.info.order_no }]
      let time = moment.unix(this.info.dateline).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time }, { "name": "---" }, { "name": "消费明细", "value": "" }, { "name": "标准价", "value": "数量 #A# 金额" }, { "name": "---" })
      this.orderInfo.forEach(v => {
        let type = " 服务: "
        if (v.typeid == 2) {
          type = "销售："
        }
        arr.push({ "name": v.itemname + type + v.workername })
        // let discount = v.discount == 1 ? '原价' : v.discount + '折扣'
        let discount_price = v.discount == 1 ? '-' : v.discount_price
        arr.push({ name: v.price, value: v.num + " #A# " + discount_price })
      })
      if (this.cikalist.length > 0) {
        arr.push({ "name": "---" }, { "name": "抵扣", "value": "使用 #A# 剩余" })
        this.cikalist.forEach(j => {
          arr.push({ name: j.itemname, value: j.use_num + " #A# " + j.rest_count })
        })
      }
      let remark = this.info.remark == null ? '' : this.info.remark
      arr.push({ "name": "---" }, { "name": "支付方式", "value": "合计" })
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
      if (this.info.customer_type == 2) {
        arr.push({ "name": "---" }, { "name": "会员：" + this.memberInfo.name }, { "name": "卡号：" + this.memberInfo.card_num }, { "name": "手机号：" + this.memberInfo.mobile }, { name: '余额：' + this.memberInfo.balance })
      }
      arr.push({ "name": "---" }, { "name": "备注: " + remark }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      console.log(a)
      javascript: jsSzb.smPrint(a);
      return false;
    },
    printaa () {
      let titleList = [
        { name: '消费明细' }, { name: '标准价', val: '数量', val1: '金额' }
      ]
      // 消费产品
      let goodsList = []
      this.orderInfo.forEach(v => {
        let type = " 服务: "
        if (v.typeid == 2) {
          type = " "
        }
        goodsList.push({ name: v.itemname + type + v.workername })
        // let discount = v.discount == 1 ? '原价' : v.discount + '折扣'
        let discount_price = v.discount == 1 ? '-' : v.discount_price
        goodsList.push({ name: v.price, val: v.num, val1: discount_price })
      })
      // 支付列表
      let payList = [{ name: "支付方式", val1: "合计" }]
      if (this.info.pay_type == 'mixed') {
        let mixedinfo = JSON.parse(this.info.mixedinfo)
        for (var i in mixedinfo) {
          // console.log(i, mixedinfo[i])
          if (mixedinfo[i]) {
            payList.push({ name: this.$options.filters['type'](i), val1: mixedinfo[i] })
          }
        }
      } else {
        payList.push({ name: this.$options.filters['type'](this.info.pay_type), val1: this.info.dis_total })
      }
      // 折扣信息
      let discontList = []
      if (this.cikalist.length > 0) {
        discontList.push({ name: "抵扣", val: "使用", val1: "剩余" })
        this.cikalist.forEach(j => {
          discontList.push({ name: j.itemname, val: j.use_num, val1: j.rest_count })
        })
      }
      // 会员信息
      let memeberinfo = []
      if (this.info.customer_type == 2) {
        memeberinfo.push({ "name": "会员：" + this.memberInfo.name }, { "name": "卡号：" + this.memberInfo.card_num }, { "name": "手机号：" + this.memberInfo.mobile }, { name: '余额：' + this.memberInfo.balance })
      }
      // 备注
      let remark = this.info.remark == null ? '' : this.info.remark
      let remarkinfo = [{ "name": "备注: " + remark }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" }
      ]
      let obj = {
        shopname: JSON.parse(sessionStorage.getItem('shopInfo')).shop_name,
        type: '收银单',
        order_no: this.info.order_no,
        time: moment.unix(this.info.dateline).format('YYYY-MM-DD HH:mm'),
        titleList: titleList,
        goodsList: goodsList,
        discontList: discontList,
        payList: payList,
        memeberinfo: memeberinfo,
        remarkinfo: remarkinfo
      }

      this.printList = JSON.stringify(obj)
      this.printTest = true
      setTimeout(() => {
        this.printTest = false
        this.printList = ''
      }, 5000);
    }
  },
  created () {
    if (this.info) {
      this.orderInfo = this.info.info
      this.cikalist = this.info.cilist
      if (this.info.customer_type == 2) {
        this.getMember(this.info.member_id)
        this.memberId = this.info.member_id
      }
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
.printTest {
  position: fixed;
  bottom: 0;
}
</style>