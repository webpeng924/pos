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
                      <span>还款金额：￥&nbsp;{{v.dis_total}}</span>
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
                      <span class="span-name one-txt-cut">{{choose?choose.cardname:''}}</span>
                      <span class="span-quantity one-txt-cut">X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{choose.price}}</span>
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
                      <span class="span-name one-txt-cut">{{choose.name}}</span>
                      <span class="span-quantity one-txt-cut">X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{choose.pay_money}}</span>
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
            <div class="itemsView" style="padding-top: 15px;" v-if="sign==4">
              <div class="tView">消费明细</div>
              <div class="toPayView">
                <div class="listItem">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name one-txt-cut">{{choose.name}}</span>
                      <span class="span-quantity one-txt-cut">会员卡X1</span>
                    </div>
                    <div class="amtView">
                      <span>支付金额：￥&nbsp;{{choose.recharge_money}}</span>
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
                  <label style="color:red;">￥{{sign==1?choose.price:choose.pay_money}}</label>
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
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_ZFB.png" />
                  </div>
                  <div class="textView overflowText">支付宝</div>
                  <div class="selectView">
                    <img
                      src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_Black.png"
                    />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='wx'}"
                  @click="paytype='wx'"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_WX.png" />
                  </div>
                  <div class="textView overflowText">微信</div>
                  <div class="selectView">
                    <img
                      src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_Black.png"
                    />
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
                    <img
                      src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_Black.png"
                    />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='other'}"
                  @click="paytype='other'"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_XJ.png" />
                  </div>
                  <div class="textView overflowText">其他</div>
                  <div class="selectView">
                    <img
                      src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_Black.png"
                    />
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='card'}"
                  @click="paytype='card'"
                  v-show="sign==1||sign==2"
                >
                  <div class="iconView">
                    <img src="../assets/images/kalei.png" />
                  </div>
                  <div class="textView overflowText">会员卡</div>
                  <div class="selectView">
                    <img
                      src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_Black.png"
                    />
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
      :visible.sync="dialogVisible"
      width="500px"
      class="payDialog"
      :show-close="false"
      :modal-append-to-body="false"
      title="付款码"
      center
    >
      <img :src="showImg|imgUrl" alt class="payEr" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fukuanOK">确认收到款项</el-button>
      </span>
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
        :info="choose"
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
  props: ['orderlist', 'choose', 'money', 'closeinfo'],
  data () {
    return {
      paytype: '',
      itemlist: [],
      storeid: sessionStorage.getItem('storeid'),
      wxImg: '',
      zfbImg: '',
      qtImg: '',
      showImg: '',
      erweima: false,
      dialogVisible: false,
      payend: false,
      sign: 0,
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
        case '其他':
          return 'other';
      }
    },
    submit () {
      if (!this.paytype) return this.$message.error('请选择支付方式')
      if (this.paytype == 'zfb' || this.paytype == 'wx' || this.paytype == 'other') {
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
      } else {
        this.fukuanOK()
      }
    },
    async fukuanOK () {
      if (!this.paytype) return this.$message.error('请选择扣款方式')
      if (this.sign == 3) {
        const res = await this.$axios.get('/api?datatype=repayment', {
          params: {
            storeid: this.storeid,
            member_id: this.itemlist[0].member_id,
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
    // 充值
    async addmoney () {
      const res = await this.$axios.get('/api?datatype=recharge', {
        params: {
          storeid: this.storeid,
          member_id: this.closeinfo.member_id,
          money: Number(this.closeinfo.money),
          gift_money: Number(this.closeinfo.gift_money),
          paytype: this.paytype
        }
      })
      if (res.data.code == 1 && res.data.data) {
        // this.$message.success('充值成功')
        // this.showaddMoney = false
        // this.getInfo(this.member_id)
        this.choose = {
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
          pay_type: this.paytype
        }
      })
      if (res.data.code == 1) {
        // this.$message.success('收款成功')
        // this.innerVisible = false
        // this.quickmoney = false
        this.dialogVisible = false
        this.payend = true
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
            member_id: this.choose.member_id,
            id: this.choose.id,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          // this.$message.success('购买成功')
          // this.menuDialog = false
          // this.innerVisible = false
          Object.assign(this.choose, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      } else if (this.sign == 2) {
        const res = await this.$axios.get('/api?datatype=buy_package', {
          params: {
            storeid: this.storeid,
            member_id: this.choose.member_id,
            id: this.choose.id,
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
          Object.assign(this.choose, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        const res = await this.$axios.get('/api?datatype=buy_member_card', {
          params: {
            storeid: this.storeid,
            member_id: this.choose.member_id,
            card_id: this.choose.id,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          Object.assign(this.choose, res.data.list)
          this.dialogVisible = false
          this.payend = true
        } else {
          this.$message.error(res.data.msg)
        }
      }
    },
    async getInfo () {
      const res = await this.$axios.get('/api?datatype=get_orderlist', {
        params: {
          storeid: this.storeid,
          status: 3,//1服务中 2待结账 3已结账  4已作废
          staffid: 'all'
        }
      })
      if (res.data.code == 1 && res.data.data) {
        let arr = JSON.parse(this.orderlist)
        arr.forEach(item => {
          let obj = res.data.data.find(v => v.order_no == item.order_no)
          if (obj.orderinfo) {
            obj['itemnames'] = '内容：'
            obj.orderinfo.forEach(j => {
              obj['itemnames'] = obj['itemnames'] + ',' + j.itemname
            })
          }
          this.itemlist.push(obj)
          this.ids.push(item.id)
        })
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
  },
  created () {
    if (this.orderlist) {
      this.sign = 3
      this.getInfo()
    }
    if (this.choose) {
      this.itemlist.push(this.choose)
      if (this.choose.card_no) {
        this.sign = 5
      } else if (this.choose.typeid) {
        this.sign = 1
      } else {
        this.sign = 2
      }
    }
    if (this.money) {
      this.sign = 4
    }
    if (this.closeinfo) {
      this.sign = 5
    }
    this.getererima()
  },
  mounted () {
    var a = 'FLAG_0'
    javascript: jsSzb.smClientScreen(a)
    return false;
  },
  watch: {},
  computed: {
    total () {
      let sum = 0
      if (this.money) {
        sum = Number(this.money)
      } else {
        this.itemlist.forEach(item => {
          sum += Number(item.dis_total)
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
            // background: #fff
            //   url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Green.png)
            //   35px center / 28px no-repeat;
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
    width: 500px;
    padding: 20px 100px;
  }
}
</style>
