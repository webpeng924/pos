<template>
  <div class="closebook">
    <div class="topView">
      <div class="tView">支付</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <div class="contentView">
      <div class="orderView">
        <div class="contentView listView">
          <div class="orderInfoView">
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==3">
              <div class="tView">还款时间：{{now|time}}</div>
              <div class="toPayView">
                <div class="listItem" v-for="(v,k) in itemlist" :key="k">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">服务产品欠款</span>
                      <span class="span-quantity one-txt-cut">{{v.itemnames}}</span>
                    </div>
                    <!-- <div class="btnView">
                      <button class="btn-split">相关单号</button>
                      <button class="btn-dyqPay"></button>
                    </div>-->
                    <div class="amtView">
                      <span>还款金额：￥&nbsp;{{v.money}}</span>
                    </div>
                    <!-- <div class="payTypeView">
                      <label class>支付方式：{{paytype}}</label>
                    </div>-->
                    <!-- <button class="btn-select select"></button> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==1">
              <div class="tView">消费明细</div>
              <div class="toPayView">
                <div class="listItem">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">{{chooseinfo?chooseinfo.cardname:''}}</span>
                      <span class="span-quantity one-txt-cut">X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{chooseinfo.price}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==2">
              <div class="tView">消费明细</div>
              <div class="toPayView">
                <div class="listItem">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">{{chooseinfo.name}}</span>
                      <span class="span-quantity one-txt-cut">X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{chooseinfo.pay_money}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==4||sign==5">
              <div class="toPayView">
                <div class="listItem">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">{{sign==5?'会员充值':'快速收款'}}</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{sign==5?closeinfo.money:money}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==6">
              <div class="tView">消费明细</div>
              <div class="toPayView">
                <div class="listItem">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">{{chooseinfo.name}}</span>
                      <span class="span-quantity one-txt-cut">会员卡X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{chooseinfo.recharge_money}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bView">
              <div class="amtInfoView">
                <div class="payableAmt" style="color:#ccc" v-if="sign==3">
                  总计还款：
                  <label>￥{{total}}</label>
                </div>
                <div class="payableAmt" style="font-size:20px" v-if="sign==1||sign==2">
                  应付金额：
                  <label style="color:red;">￥{{sign==1?chooseinfo.price:chooseinfo.pay_money}}</label>
                </div>
              </div>
            </div>
            <div class="paymentView">
              <div class="tView">支付方式</div>
              <div class="paymentList">
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='zfb'}"
                  @click="paytype='zfb'"
                >
                  <div class="iconView">
                    <img src="../assets/images/zfb.png" />
                  </div>
                  <div class="textView overflowText">支付宝</div>
                  <div class="selectView">
                    <img src="../assets/images/select.png" />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='wx'}"
                  @click="paytype='wx'"
                >
                  <div class="iconView">
                    <img src="../assets/images/wx.png" />
                  </div>
                  <div class="textView overflowText">微信</div>
                  <div class="selectView">
                    <img src="../assets/images/select.png" />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='cash'}"
                  @click="paytype='cash'"
                >
                  <div class="iconView">
                    <img src="../assets/images/xianjin.png" />
                  </div>
                  <div class="textView overflowText">现金</div>
                  <div class="selectView">
                    <img src="../assets/images/select.png" />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='other'}"
                  @click="paytype='other'"
                >
                  <div class="iconView">
                    <img src="../assets/images/other.png" />
                  </div>
                  <div class="textView overflowText">其他</div>
                  <div class="selectView">
                    <img src="../assets/images/select.png" />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='card'}"
                  @click="paytype='card'"
                  v-show="sign==1||sign==2||sign==3"
                >
                  <div class="iconView">
                    <img src="../assets/images/kalei.png" />
                  </div>
                  <div class="textView overflowText">会员卡</div>
                  <div class="selectView">
                    <img src="../assets/images/select.png" />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='mixed'}"
                  @click="paytype='mixed'"
                >
                  <div class="iconView">
                    <img src="../assets/images/mixed.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">混合支付</label>
                    <div class="selectView">
                      <img src="../assets/images/select.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnView">
          <button class="btn-settle btn-audio" @click="submit">结账</button>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="500px"
      class="payDialog"
      :modal-append-to-body="false"
      title="扫码付款"
      center
    >
      <input
        placeholder="请客户扫码或录入付款码后回车"
        v-model="codebar"
        ref="input"
        @keyup.enter="showpay"
        style="width:80%;margin:0 10%;"
        v-show="shopinfo.is_payonline == 1&&paytype != 'other'"
      />
      <span slot="footer" class="dialog-footer">
        <img :src="showImg|imgUrl" alt class="payEr" v-show="showImg" />
        <el-button type="primary" @click="fukuanOK" v-show="showImg">确认收到款项</el-button>
      </span>
    </el-dialog>

    <!-- 混合支付 -->
    <el-dialog
      :close-on-click-modal="false"
      title="混合支付"
      :visible.sync="mixedDialog"
      width="600px"
      :modal-append-to-body="false"
    >
      <div class="paylist">
        <div class="item" v-if="sign==1||sign==2||sign==3">
          <span>会员卡：</span>
          <el-input
            type="number"
            v-model="mixedinfo.card"
            :max="Number(memberPrice)"
            :min="0"
            @blur="()=>{if(mixedinfo.card>Number(memberPrice)){mixedinfo.card=Number(memberPrice)}}"
            :placeholder="`余额：${memberPrice}元`"
          ></el-input>
        </div>
        <div class="item">
          <span>支付宝：</span>
          <el-input type="number" :min="0" v-model="mixedinfo.zfb"></el-input>
        </div>
        <div class="item">
          <span style="margin-right:10px">微 信：</span>
          <el-input type="number" :min="0" v-model="mixedinfo.wx"></el-input>
        </div>
        <div class="item">
          <span style="margin-right:10px">现 金：</span>
          <el-input type="number" :min="0" v-model="mixedinfo.cash"></el-input>
        </div>
        <div class="item">
          <span style="margin-right:10px">其 他：</span>
          <el-input type="number" :min="0" v-model="mixedinfo.other"></el-input>
        </div>
        <div class="item" v-if="sign==1||sign==2">
          <span style="margin-right:10px">签 账：</span>
          <el-input type="number" :min="0" v-model="mixedinfo.signbill"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="position: relative;">
        <!-- <span class="hyye">会员余额：{{memberPrice}}元</span> -->
        <!-- <span class="hyye">待付金额：{{total}}元</span> -->
        <el-button @click="mixedDialog = false">取 消</el-button>
        <el-button type="primary" @click="mixedSubmit">结 账</el-button>
      </div>
    </el-dialog>

    <div class="set_page" :class="{activePage:erweima}">
      <erweima @close="erweima=false;getererima()" v-if="erweima"></erweima>
    </div>
    <div class="set_page" :class="{activePage:payend}">
      <payend
        :money="total"
        :paytype="paytype"
        :member="itemlist.length?itemlist[0].member_id:''"
        :sign="sign"
        :info="chooseinfo"
        v-if="payend"
      ></payend>
    </div>
  </div>
</template>

<script>
import erweima from '@/views/lqy/erweimaPay'
import payend from './payok'
import moment from 'moment'
export default {
  components: { erweima, payend },
  props: ['orderlist', 'choose', 'money', 'closeinfo', 'member'],
  data () {
    return {
      paytype: '',
      chooseinfo: '',
      mixedDialog: false,
      mixedDialog: false,
      mixedinfo: {
        zfb: '',
        wx: '',
        cash: '',
        card: '',
        other: '',
        signbill: ''
      },
      memberPrice: 0,
      itemlist: [],
      storeid: sessionStorage.getItem('storeid'),
      shopinfo: JSON.parse(sessionStorage.getItem('shopInfo')),
      codebar: '',
      is_doublescreen: JSON.parse(sessionStorage.getItem('shopInfo')).is_doublescreen,
      wxImg: '',
      zfbImg: '',
      qtImg: '',
      showImg: '',
      erweima: false,
      dialogVisible: false,
      payend: false,
      sign: 0,
      paytotal: 0,
      payorder_no: '',
      isuseCard: true,
      ids: [],
      now: new Date(),
    }
  },
  filters: {
    time (value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    type (val) {
      switch (val) {
        case '支付宝':
          return 'zfb';
        case '微信':
          return 'wx';
        case '现金':
          return 'cash';
        case '混合支付':
          return 'mixed';
        case '其他':
          return 'other';
      }
    },
    mixedSubmit () {
      let sum = 0
      let arr = Object.values(this.mixedinfo)
      arr.forEach(item => {
        sum += Number(item)
      })
      // console.log(sum)
      if (this.total != sum) {
        this.$message.error('请核对支付金额')
      } else {
        this.fukuanOK()
        this.mixedDialog = false
      }
    },
    submit () {
      if (!this.paytype) return this.$message.error('请选择支付方式')
      if (this.paytype == 'zfb' || this.paytype == 'wx' || this.paytype == 'other') {
        if (this.shopinfo.is_payonline == 1 && this.paytype != 'other') {
          this.showcode()
        } else {
          if (this.paytype == 'zfb') {
            this.showImg = this.zfbImg
          } else if (this.paytype == 'wx') {
            this.showImg = this.wxImg
          } else {
            this.showImg = this.qtImg
          }
          if (this.showImg) {
            this.dialogVisible = true
          } else {
            this.$confirm('缺少该付款二维码', '提示', {
              confirmButtonText: '去上传',
              cancelButtonText: '更换付款方式',
              type: 'warning'
            }).then(() => {
              this.erweima = true
            })
          }
        }
      } else if (this.paytype == 'mixed') {
        this.mixedDialog = true
      } else {
        this.fukuanOK()
      }
    },
    showcode () {
      if (this.paytype == 'zfb') {
        this.showImg = this.zfbImg
      } else {
        this.showImg = this.wxImg
      }
      this.dialogVisible = true
      this.codebar = ''
      this.$nextTick(() => { this.$refs['input'].focus() })
    },
    async fukuanOK () {
      if (!this.paytype) return this.$message.error('请选择扣款方式')
      if (this.sign == 3) {
        const res = await this.$axios.get('/api?datatype=repayment', {
          params: {
            storeid: this.storeid,
            member_id: this.itemlist[0].member_id,
            mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
            id: this.ids,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          // this.$message.success('还款成功')
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      } else if (this.sign == 4) {
        this.setCard()
      } else if (this.sign == 5) {
        this.addmoney()
      } else {
        this.toBuy()
      }
    },
    async showpay () {
      let that = this
      if (!that.codebar) return
      const res = await that.$axios.get('http://hb.rgoo.com/api/sft_pay.php', {
        params: {
          storeid: this.storeid,
          order_no: that.payorder_no,
          amount: that.paytotal,
          pay_type: that.paytype == 'zfb' ? 'ZFB01' : 'TX01',
          authCode: that.codebar
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        that.timer = setInterval(function () {
          that.checkpay(res.data.order_no, res.data.txnTime, res.data.paytime)
        }, 2000);
      }
    },
    async checkpay (order_no, time, paytime) {
      const res = await this.$axios.get('http://hb.rgoo.com/api/sft_return.php', {
        params: {
          storeid: this.storeid,
          order_no: order_no,
          paytime: paytime,
          txntime: time
        }
      })
      // console.log(res)
      if (res.data.errorCode == '00') {
        clearInterval(this.timer)
        this.timer = null
        this.fukuanOK()
      } else if (res.data.errorCode != 'AW' && res.data.errorCode != 'A7' && res.data.errorCode != '09') {
        clearInterval(this.timer)
        this.timer = null
        this.$message.error('支付失败')
        this.codebar = ''
        this.$nextTick(() => { this.$refs['input'].focus() })
      }
    },
    // 充值
    async addmoney () {
      const res = await this.$axios.get('/api?datatype=recharge', {
        params: {
          storeid: this.storeid,
          member_id: this.closeinfo.member_id,
          money: Number(this.closeinfo.money),
          mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
          order_no: this.payorder_no,
          gift_money: Number(this.closeinfo.gift_money),
          paytype: this.paytype
        }
      })
      if (res.data.code == 1 && res.data.data) {
        // this.$message.success('充值成功')
        // this.showaddMoney = false
        // this.getInfo(this.member_id)
        this.chooseinfo = {
          member_id: this.closeinfo.member_id,
          money: this.closeinfo.money,
          gift_money: this.closeinfo.gift_money,
          order_no: res.data.data
        }
        this.dialogVisible = false
        this.payend = true
      } else {
        this.$message.error('充值失败')
      }
    },
    // 快速收款
    async setCard () {
      const res = await this.$axios.get('/api?datatype=quick_pay', {
        params: {
          storeid: this.storeid,
          dis_total: this.money,
          order_no: this.payorder_no,
          mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
          pay_type: this.paytype
        }
      })
      if (res.data.code == 1) {
        // this.$message.success('收款成功')
        // this.innerVisible = false
        // this.quickmoney = false
        this.dialogVisible = false
        this.payend = true
        this.chooseinfo = res.data.order
      } else {
        this.$message.error('收款失败')
      }
    },
    // 购买套餐或次卡或会员卡
    async toBuy () {
      if (this.sign == 1) {
        const res = await this.$axios.get('/api?datatype=buy_ccard', {
          params: {
            storeid: this.storeid,
            member_id: this.chooseinfo.member_id,
            mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
            id: this.chooseinfo.id,
            order_no: this.payorder_no,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          // this.$message.success('购买成功')
          // this.menuDialog = false
          // this.innerVisible = false
          Object.assign(this.chooseinfo, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      } else if (this.sign == 2) {
        const res = await this.$axios.get('/api?datatype=buy_package', {
          params: {
            storeid: this.storeid,
            member_id: this.chooseinfo.member_id,
            mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
            order_no: this.payorder_no,
            id: this.chooseinfo.id,
            pay_type: this.paytype,
            userid: JSON.parse(sessionStorage.getItem('userInfo')).id,
            username: JSON.parse(sessionStorage.getItem('userInfo')).username
          }
        })
        if (res.data.code == 1) {
          // this.$message.success('购买成功')
          // this.TCDialog = false
          // this.innerVisible = false
          // this.getList()
          Object.assign(this.chooseinfo, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        const res = await this.$axios.get('/api?datatype=buy_member_card', {
          params: {
            storeid: this.storeid,
            member_id: this.chooseinfo.member_id,
            mixedinfo: this.paytype == 'mixed' ? this.mixedinfo : null,
            card_id: this.chooseinfo.id,
            order_no: this.payorder_no,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          Object.assign(this.chooseinfo, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      }
    },
    async getInfo () {
      const res = await this.$axios.get('/api?datatype=get_signbill_list', {
        params: {
          storeid: this.storeid,
          // status: 3,//1服务中 2待结账 3已结账  4已作废
          // staffid: 'all'
          member_id: this.member.member_id
        }
      })
      if (res.data.code == 1 && res.data.list) {
        let arr = JSON.parse(this.orderlist)
        arr.forEach(item => {
          let obj = res.data.list.find(v => v.order_no == item.order_no)
          this.paytotal += Number(obj.money)
          if (obj.info) {
            obj['itemnames'] = '内容：'
            obj.info.forEach(j => {
              obj['itemnames'] = obj['itemnames'] + ',' + j.itemname
            })
          }
          this.itemlist.push(obj)
          this.ids.push(item.id)
        })
        this.paytotal = this.paytotal.toFixed(2)
      }
    },
    getererima () {
      this.$axios.get('/api?datatype=more&storeid=' + this.storeid).then(
        res => {
          let data = res.data.data
          this.wxImg = data.wx_code
          this.zfbImg = data.zfb_code
          this.qtImg = data.other_code
          sessionStorage.setItem('shopInfo', JSON.stringify(data))
        }
      )
    },
    async getmember (id) {
      const res = await this.$axios.get("/api?datatype=get_one_member", {
        params: {
          storeid: this.storeid,
          member_id: id
        }
      });
      if (res.data.code == 1) {
        if (Number(res.data.data.signbill) > 0) {
          this.$alert('该会员欠款：' + res.data.data.signbill + ' 元', '提示', {
            center: true,
          })
        }
        this.memberPrice = res.data.data.balance
      }
    },
    getOrderNo () {
      this.$axios.get('/api?datatype=get_order_no').then(res => {
        // console.log(res)
        this.payorder_no = res.data.data
      })
    }
  },
  created () {
    if (this.orderlist) {
      // 还款
      this.sign = 3
      this.getInfo()
      this.memberPrice = this.member.balance
    }
    if (this.choose) {
      console.log(this.choose)
      this.chooseinfo = JSON.parse(JSON.stringify(this.choose))
      this.itemlist.push(this.chooseinfo)
      this.getmember(this.choose.member_id)
      if (this.chooseinfo.card_no) {
        // 买会员卡
        this.sign = 6
        this.paytotal = this.chooseinfo.recharge_money
      } else if (this.chooseinfo.typeid) {
        // 买次卡
        this.sign = 1
        this.paytotal = this.chooseinfo.price
      } else {
        // 买套餐
        this.sign = 2
        this.paytotal = this.chooseinfo.pay_money
      }
    }
    if (this.money) {
      // 快速收款
      this.sign = 4
      this.paytotal = this.money
    }
    if (this.closeinfo) {
      // 充值
      this.sign = 5
      this.paytotal = this.closeinfo.money
    }
    this.getererima()
    this.getOrderNo()
  },
  mounted () {
    if (this.is_doublescreen == 1) {
      var a = 'FLAG_0'
      javascript: jsSzb.smClientScreen(a)
      return false;
    }
  },
  watch: {},
  computed: {
    total () {
      let sum = 0
      if (this.money) {
        sum = Number(this.money)
      } else if (this.closeinfo && this.closeinfo.money) {
        sum = Number(this.closeinfo.money)
      } else {
        this.itemlist.forEach(item => {
          if (item.price) {
            sum += Number(item.price)
          } else if (item.recharge_money) {
            sum += Number(item.recharge_money)
          } else if (item.pay_money) {
            sum += Number(item.pay_money)
          } else {
            sum += Number(item.money)
          }
        })
      }
      return sum.toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.closebook {
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
  .contentView {
    display: flex;
    position: relative;
    height: calc(100% - 110px);
    // min-height: 450px;
    overflow: auto;
    .orderView {
      flex: 1;
      position: relative;
      width: 100%;
      height: 100%;
      background: #f4f4f4;
      overflow: hidden;
      padding-bottom: 60px;
      > .listView {
        // overflow-x: hidden;
        // overflow-y: auto;
        height: 100%;
        .orderInfoView {
          width: 100%;
          height: calc(100% - 200px);
        }
        .itemsView {
          height: calc(100% - 90px);
          padding: 0 15px 25px 15px;
          min-height: 160px;
          background: #fff;
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
            background: transparent;
          }
          .toPayView {
            height: calc(100% - 40px);
            overflow: auto;
            min-height: 100px;
            & > .listItem {
              background: #f4f4f4;
              margin-bottom: 10px;
              border-radius: 6px;

              &:last-child {
                margin-bottom: 0;
              }
              .masterView,
              .branchItem {
                position: relative;
                display: flex;
                padding: 20px 20px 20px 60px;
                line-height: 24px;
                justify-content: space-between;

                .span-name {
                  width: 200px;
                  display: inline-block;
                }
                .span-quantity {
                  width: 400px;
                  display: inline-block;
                }
              }
            }
          }
        }
        .bView {
          position: relative;
          line-height: 25px;
          text-align: right;
          padding: 15px 35px 45px 35px;
          display: flex;
          background: #fff;
          div.btnView {
            width: 200px;
            text-align: left;
          }
          div.amtInfoView {
            flex: 1;
            text-align: right;
            > div {
              display: inline-block;
              margin-right: 20px;
            }
            .toPayAmt {
              font-size: 20px;
              label {
                font-family: DINAlternate-Bold;
                color: #ff5e56;
              }
            }
          }
          .btn-remark {
            position: absolute;
            bottom: 10px;
            left: 0;
            width: 100%;
            font-size: 14px;
            color: #8a8a8a;
            line-height: 25px;
            padding: 0 35px 0 65px;
            text-align: left;
          }
        }
        .paymentView {
          padding-left: 15px;
          background: #f4f4f4;
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
            background: transparent;
          }
          .paymentList {
            padding: 0 0 0 8px;
            overflow-x: hidden;
            overflow-y: auto;
            .paymentItem {
              position: relative;
              float: left;
              width: 87px;
              height: 87px;
              border-radius: 6px;
              background: #f8f8f8;
              padding: 10px 0;
              text-align: center;
              margin: 0 6px 10px 6px;
              overflow: hidden;
              .selectView {
                display: none;
              }
              .iconView {
                height: 40px;
                img {
                  height: 100%;
                }
              }
              .textView {
                margin-top: 8px;
                line-height: 20px;
                font-size: 14px;
                color: #28282d;
              }
            }
            .paymentItem.select .selectView {
              display: block;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: rgba(40, 40, 45, 0.4);
              text-align: center;
              border-radius: 6px;
              img {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 28px;
                height: 28px;
              }
            }
          }
        }
      }
      > div.btnView {
        position: fixed;
        width: 100%;
        bottom: 0;
        padding: 20px 0;
        text-align: center;
        background: #f4f4f4;
        button {
          width: 260px;
          height: 48px;
          line-height: 48px;
          font-size: 16px;
          color: #fff;
          background: #dc670b;
          border-radius: 6px;
        }
      }
    }
  }
  .payEr {
    width: 460px;
    padding: 20px 100px;
  }
  .paylist {
    padding: 0 100px;
    padding-top: 5px;

    .item {
      // border-bottom: 1px solid #ececec;
      display: flex;
      margin: 10px 0;
      height: 40px;
      justify-content: space-between;
      span {
        line-height: 40px;
      }
      /deep/ .el-input,
      .el-input-number {
        background-color: #eee;
        border-radius: 5px;
        flex: 1;
        border: none;
        padding-left: 10px;
        input.el-input__inner {
          line-height: 28px;
          text-align: left;
          background: transparent;
          padding: 0;
          font-size: 14px;
          color: #28282d;
          outline: none;
          border: none;
        }
      }
      /deep/ .el-input-number {
        .el-input-number__decrease,
        .el-input-number__increase {
          display: none;
        }
      }
    }
  }
}
</style>
