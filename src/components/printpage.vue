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
      <div class="serviceView" v-if="memberInfo">
        <div class="tView">会员信息</div>
        <div
          style="background: #f4f4f4;padding: 15px 15px 10px 15px;font-size:14px;border-radius: 6px;"
        >
          <div>会员：{{memberInfo.name}}</div>
          <div>卡号：{{memberInfo.card_num}}</div>
          <div>手机号：{{memberInfo.mobile}}</div>
          <div>余额：{{memberInfo.balance}}</div>
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
            </div>
            <div class="payTypeView">{{info.pay_type|type}}</div>
            <div class="payAmtView">￥{{v.discount_price}}</div>
          </div>
          <div class="empView" v-show="v.staff1!=0">
            <label>
              <span class="span-name">{{v.workername}}</span>
              <span class="span-job">No.{{v.workerNo}}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="payTypeView">
        <div class="tView">支付方式</div>
        <div class="payInfoView">
          <div class="typeItem">
            <img src="../assets/images/xianjin.png" class="img-icon" />
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
    <printPage class="printTest" v-if="printTest" :printList="printList"></printPage>
  </div>
</template>

<script>
import print from "print-js"
import moment from 'moment'
import printPage from '@/components/print'
export default {
  components: { printPage },
  props: ['info'],
  data () {
    return {
      orderInfo: [],
      printTest: false,
      printList: '',
      storeid: sessionStorage.getItem('storeid'),
      cikalist: [],
      memberInfo: ''
    }
  },
  filters: {
    moment (val) {
      return moment.unix(val).format('YYYY-MM-DD HH:mm')
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
        case 'mixed':
          return '混合支付';
      }
    }
  },
  methods: {
    back () {
      this.$emit('close')
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
    async getinfo (id) {
      const res = await this.$axios.get('/api?datatype=get_one_order', {
        params: {
          storeid: this.storeid,
          order_id: id
        }
      })
      console.log(res)
      this.cikalist = res.data.list.cilist
    },
    print () {
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }, { "name": "收银单", "style": "1" }, { "name": "---" }, { "name": "消费单号：" + this.info.order_no }]
      let time = moment.unix(this.info.dateline).format('YYYY-MM-DD HH:mm')
      arr.push({ "name": "消费日期：" + time })
      if (this.info.customer_type == 2) {
        arr.push({ "name": "---" }, { "name": "会员：" + this.memberInfo.name }, { "name": "卡号：" + this.memberInfo.card_num }, { "name": "手机号：" + this.memberInfo.mobile }, { name: '余额：' + this.memberInfo.balance })
      }
      arr.push({ "name": "---" }, { "name": "消费明细", "value": "" }, { "name": "标准价", "value": "数量 #A# 金额" }, { "name": "---" })
      this.orderInfo.forEach(v => {
        let type = " 服务: "
        if (v.typeid == 2) {
          type = " "
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
      arr.push({ "name": "---" }, { "name": "备注: " + remark }, { "name": "门店电话：" + JSON.parse(sessionStorage.getItem('shopInfo')).mobile }, { "name": "门店地址：" + JSON.parse(sessionStorage.getItem('shopInfo')).address }, { "name": "收银员：" + JSON.parse(sessionStorage.getItem('userInfo')).username }, { "name": "签字：" }, { "name": "感谢您的光临！" })
      var a = JSON.stringify(arr);
      if ((window.navigator.userAgent).indexOf('wv') == -1) {
        this.printaa()
      } else {
        javascript: jsSzb.smPrint(a);
        return false;
      }
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
      this.orderInfo = this.info.orderinfo
      if (this.info.customer_type == 2) {
        this.getMember(this.info.member_id)
        this.getinfo(this.info.id)
      }
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
        .span-name {
          margin-right: 10px;
        }
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
