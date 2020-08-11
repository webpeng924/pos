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
            <div class="itemsView" style="padding-top: 15px;">
              <div class="tView">消费明细</div>
              <div class="toPayView">
                <div class="listItem" v-for="(v,k) in itemlist" :key="k">
                  <div class="masterView">
                    <div class="nameView">
                      <span class="span-name">{{v.itemname}}</span>
                      <span class="span-quantity">x{{v.num}}</span>
                    </div>
                    <!-- <div class="btnView">
                      <button class="btn-split"></button>
                      <button class="btn-dyqPay"></button>
                    </div>-->
                    <div class="amtView">
                      <span>原价：￥&nbsp;{{Number(v.num)*Number(v.price)}}</span>
                    </div>
                    <div class="discountView" v-show="bookinfo.customer_type==2&&isuseCard">
                      <span>会员折扣价：￥&nbsp;{{Number(v.discount_price)}}</span>
                    </div>
                    <div class="payTypeView">
                      <label class>支付方式：{{paytype}}</label>
                    </div>
                    <button class="btn-select select"></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="bView">
              <div class="btnView" v-show="bookinfo.dis_total!=0">
                <button @click="quanDialog=true;getvoucher()">抵用券</button>
                <span v-show="choosquan">
                  -{{choosquan.v_amount}}元
                  <i
                    class="el-icon-remove-outline"
                    style="color:red"
                    @click="choosquan=''"
                  ></i>
                </span>
              </div>
              <div class="amtInfoView">
                <div class="payableAmt" style="color:#ccc">
                  应付金额：
                  <label>￥&nbsp;{{isuseCard ? bookinfo.total : fullPrice}}</label>
                </div>
                <div class="payableAmt" style="color:#ccc" v-show="isuseCard">
                  优惠金额：
                  <label>￥&nbsp;{{isuseCard ?(bookinfo.total-bookinfo.dis_total).toFixed(2):0}}</label>
                </div>
                <div class="toPayAmt">
                  待付金额：
                  <label>
                    ￥&nbsp;
                    <span>{{payPrice}}</span>
                  </label>
                </div>
              </div>
              <button
                class="btn-remark overflowText"
                v-show="bookinfo.customer_type==2"
              >会员卡余额：{{memberPrice}}元（此订单若使用会员卡余额抵扣，请确保余额充足！）</button>
            </div>
            <div class="paymentView">
              <div class="tView">支付方式</div>
              <div class="paymentList">
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='支付宝'}"
                  @click="changepaytype('支付宝')"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_ZFB.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">支付宝</label>
                    <label class="label-amt" v-show="paytype=='支付宝'">应收：{{payPrice}}</label>
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='微信'}"
                  @click="changepaytype('微信')"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_WX.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">微信</label>
                    <label class="label-amt" v-show="paytype=='微信'">应收：{{payPrice}}</label>
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='现金'}"
                  @click="changepaytype('现金')"
                >
                  <div class="iconView">
                    <img src="../assets/images/xianjin.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">现金</label>
                    <label class="label-amt" v-show="paytype=='现金'">应收：{{payPrice}}</label>
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='其他'}"
                  @click="changepaytype('其他')"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_XJ.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">其他</label>
                    <label class="label-amt" v-show="paytype=='其他'">应收：{{payPrice}}</label>
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='会员卡'}"
                  @click="changepaytype('会员卡')"
                  v-show="bookinfo.customer_type == 2"
                >
                  <div class="iconView">
                    <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Pay_XJ.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">会员卡</label>
                    <label class="label-amt" v-show="paytype=='会员卡'">应收：{{payPrice}}</label>
                  </div>
                </div>
                <div
                  class="paymentItem listItem btn-audio"
                  :class="{select:paytype=='签账'}"
                  @click="changepaytype('签账')"
                  v-show="bookinfo.customer_type == 2"
                >
                  <div class="iconView">
                    <img src="../assets/images/qianzhang.png" />
                  </div>
                  <div class="textView overflowText">
                    <label class="label-name">签账</label>
                    <label class="label-amt" v-show="paytype=='签账'">应收：{{payPrice}}</label>
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
      <payend @close="payend=false;getererima()" v-if="payend"></payend>
    </div>

    <el-dialog
      title="抵用券列表"
      :visible.sync="quanDialog"
      width="400px"
      center
      :modal-append-to-body="false"
      custom-class="dialog"
    >
      <div class="contentView" style="max-height: 620px;">
        <div class="quanItem" @click="chooseQuan(v)" v-for="(v,k) in quanlist" :key="k">
          <div class="left">现金券</div>
          <div class="right">
            <p>{{v.v_amount}}元</p>
            <p class="p1">使用时间：{{v.v_starttime|time}} 至 {{v.v_endtime|time}}</p>
            <span class="el-icon-circle-check" :class="{select:choosquan.id==v.id}"></span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import erweima from '@/views/lqy/erweimaPay'
import payend from './payEnd'
import moment from 'moment'
export default {
  components: { erweima, payend },
  props: ['bookinfo'],
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
      memberPrice: 0,
      isuseCard: true,
      haveDistotal: false,
      quanDialog: false,
      choosquan: '',
      quanlist: []
    }
  },
  filters: {
    time (value) {
      return moment.unix(value).format("YYYY-MM-DD");
    }
  },
  methods: {
    submit () {
      if (!this.paytype) return this.$message.error('请选择支付方式')
      if (this.paytype == '支付宝' || this.paytype == '微信' || this.paytype == '其他') {
        if (this.paytype == '支付宝') {
          this.showImg = this.zfbImg
        } else if (this.paytype == '微信') {
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
    async  fukuanOK () {
      if (!this.paytype) return this.$message.error('请选择扣款方式')
      let paytype = this.type(this.paytype)
      const res = await this.$axios.get('/api?datatype=pay_order', {
        params: {
          storeid: this.storeid,
          pay_type: paytype,
          order_no: this.bookinfo.order_no,
          order_id: this.bookinfo.id,
          full_price: this.haveDistotal ? null : this.isuseCard ? null : this.fullPrice,
          v_amount: this.choosquan ? this.choosquan.v_amount : 0,
          v_id: this.choosquan ? this.choosquan.id : null,
        }
      })
      if (res.data.code == 1) {
        this.$message.success('完成')
        this.payend = true
        this.dialogVisible = false
      } else {
        this.$message.error(res.data.msg)
      }
    },
    changepaytype (data) {
      if (this.bookinfo.customer_type == 2) {
        if (data != '会员卡') {
          this.isuseCard = false
          this.choosquan = ''
        } else {
          this.isuseCard = true
        }
      }
      this.paytype = data
    },
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
        case '签账':
          return 'signbill';
        case '会员卡':
          return 'card';
      }
    },
    chooseQuan (v) {
      if (this.paytype == '会员卡') {
        let flag = moment.unix(v.v_starttime).format('YYYY-MM-DD') <= moment(new Date()).format('YYYY-MM-DD')
        console.log(flag)
        if (flag) {
          this.choosquan = v
          this.quanDialog = false
        } else {
          this.$message.error('未到可使用时间')
        }
      } else {
        this.$message.error('仅限会员卡支付可抵用！')
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
    async getvoucher () {
      const res = await this.$axios.get('/api?datatype=get_member_voucher', {
        params: {
          storeid: this.storeid,
          member_id: this.bookinfo.member_id,
          status: 0
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.quanlist = res.data.data
      } else {
        this.quanlist = []
      }
    },
    async getmember () {
      const res = await this.$axios.get("/api?datatype=get_one_member", {
        params: {
          storeid: this.storeid,
          member_id: this.bookinfo.member_id
        }
      });
      if (res.data.code == 1) {
        if (Number(res.data.data.signbill) > 0) {
          this.memberPrice = '-' + res.data.data.signbill
        } else {
          this.memberPrice = res.data.data.balance
        }
      }
    },
  },
  created () {
    if (this.bookinfo) {
      this.itemlist = this.bookinfo.orderinfo
      if (this.bookinfo.customer_type == 2) {
        this.paytype = '会员卡'
        this.getmember()
      }
      if (this.bookinfo.dis_total != this.bookinfo.total) {
        this.haveDistotal = true
      }
    }
    let obj = JSON.parse(sessionStorage.getItem('shopInfo'))
    if (obj) {
      this.wxImg = obj.wx_code
      this.zfbImg = obj.zfb_code
      this.qtImg = obj.other_code
    } else {
      this.getererima()
    }
  },
  mounted () { },
  watch: {},
  computed: {
    fullPrice () {
      let sum = 0
      this.bookinfo.orderinfo.forEach(item => {
        sum += Number(item.num) * Number(item.price)
      })
      return sum
    },
    payPrice () {
      let sum = 0
      if (this.haveDistotal) {
        sum = this.bookinfo.dis_total
      } else {
        if (this.isuseCard) {
          sum = this.bookinfo.dis_total
        } else {
          sum = this.fullPrice
        }
      }
      if (this.choosquan) {
        sum = Number(sum) - Number(this.choosquan.v_amount)
      }
      if (sum < 0) {
        sum = 0
      }
      return sum
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
    height: calc(100% - 85px);
    overflow: auto;
    .orderView {
      flex: 1;
      position: relative;
      width: 100%;
      height: 100%;
      background: #f4f4f4;
      overflow: hidden;
      padding-bottom: 68px;
      .contentView {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100%);
        .orderInfoView {
          width: 100%;
        }
        .itemsView {
          padding: 0 15px 25px 15px;
          min-height: 100px;
          background: #fff;
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
            background: transparent;
          }
          .toPayView > .listItem {
            background: #f4f4f4;
            margin-bottom: 10px;
            border-radius: 6px;
            overflow: hidden;
            &:last-child {
              margin-bottom: 0;
            }
            .masterView,
            .branchItem {
              position: relative;
              display: flex;
              padding: 20px 20px 20px 60px;
              line-height: 28px;
              justify-content: space-between;
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
          padding: 15px 0 0 15px;
          background: #f4f4f4;
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
            background: transparent;
          }
          .paymentList {
            padding: 0 0 50px 8px;
            overflow-x: hidden;
            overflow-y: auto;
            .paymentItem {
              position: relative;
              display: inline-flex;
              padding: 9px;
              width: 240px;
              border-radius: 6px;
              background: #fff;
              margin: 0 7px 18px 7px;
              vertical-align: middle;
              border: 1px solid #fff;
              &.select {
                border: 1px solid #47bf7c;
              }
              &.select::after {
                position: absolute;
                content: '';
                right: 0;
                bottom: 0;
                width: 22px;
                height: 22px;
                background: transparent
                  url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Payment_S.png)
                  right bottom / 22px no-repeat;
              }
              .iconView {
                margin-right: 10px;
                height: 40px;
                img {
                  width: 40px;
                  height: 40px;
                }
              }
              .textView {
                display: flex;
                flex: 1;
                color: #28282d;
                line-height: 40px;
                .label-name {
                  flex: 2;
                }
                .label-amt {
                  // flex: 1;
                  text-align: right;
                  color: #47bf7c;
                }
              }
            }
          }
        }
      }
      > div.btnView {
        position: fixed;
        width: 100%;
        bottom: 0;
        text-align: center;
        background: #f4f4f4;
        button {
          width: 100%;
          height: 48px;
          line-height: 48px;
          font-size: 16px;
          font-family: PingFangSC-Medium;
          color: #fff;
          background: #dc670b;
          border-radius: 0;
        }
      }
    }
  }
  .payEr {
    width: 500px;
    padding: 20px 100px;
  }
  .dialog {
    .contentView {
      padding: 20px;
      display: block;
      min-height: 400px;
      .quanItem {
        width: 100%;
        height: 80px;
        border-radius: 5px;
        position: relative;
        color: #fff;
        display: flex;
        margin-bottom: 10px;
        background: radial-gradient(
              circle at right top,
              transparent 10px,
              #ffb142 0
            )
            top left / 30% 51% no-repeat,
          radial-gradient(circle at right bottom, transparent 10px, #ffb142 0)
            bottom left / 30% 51% no-repeat,
          radial-gradient(circle at left top, transparent 10px, #ffb142 0) top
            right / 70% 51% no-repeat,
          radial-gradient(circle at left bottom, transparent 10px, #ffb142 0)
            bottom right / 70% 51% no-repeat;
        .left {
          width: 30%;
          height: 100%;
          border-right: 1px dashed #fff;
          line-height: 80px;
          font-size: 20px;
          text-align: center;
        }
        .right {
          flex: 1;
          flex-direction: column;
          display: flex;
          padding: 10px;
          font-size: 30px;
          position: relative;
          p {
            flex: 1;
            text-align: center;
          }
          .p1 {
            font-size: 12px;
          }
          span {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #fff;
            width: 26px;
            height: 26px;
            // margin-top: 17px;
            border-radius: 100%;
            color: #fff;
            font-size: 26px;
            &.select {
              color: rgb(119, 224, 58);
            }
          }
        }
      }
    }
  }
}
</style>
