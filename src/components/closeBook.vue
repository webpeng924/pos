<template>
  <div class="closebook">
    <div class="topView">
      <div class="tView">支付</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <div class="contentView">
      <div class="orderView">
        <div class="contentView listView" style="height: 841px;">
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
                      <span>￥&nbsp;{{Number(v.num)*Number(v.price)}}</span>
                    </div>
                    <div class="discountView"></div>
                    <div class="payTypeView">
                      <label class>{{paytype}}</label>
                    </div>
                    <button class="btn-select select"></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="bView">
              <div class="btnView">
                <!-- <button class="btn-select select">全选</button> -->
                <!-- <button class="btn-merge disable">合并</button> -->
              </div>
              <div class="amtInfoView">
                <div class="payableAmt" style="color:#ccc">
                  应付金额：
                  <label>￥&nbsp;{{bookinfo.total}}</label>
                </div>
                <div class="payableAmt" style="color:#ccc">
                  优惠金额：
                  <label>￥&nbsp;{{(bookinfo.total-bookinfo.dis_total).toFixed(2)}}</label>
                </div>
                <div class="toPayAmt">
                  待付金额：
                  <label>
                    ￥&nbsp;
                    <span>{{bookinfo.dis_total}}</span>
                  </label>
                </div>
              </div>
              <button
                class="btn-remark overflowText"
                v-show="bookinfo.customer_type==2"
              >（此订单将使用会员卡余额抵扣，请确保余额充足！）</button>
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
                    <label class="label-amt" v-show="paytype=='支付宝'">应收：{{bookinfo.dis_total}}</label>
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
                    <label class="label-amt" v-show="paytype=='微信'">应收：{{bookinfo.dis_total}}</label>
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
                    <label class="label-amt" v-show="paytype=='现金'">应收：{{bookinfo.dis_total}}</label>
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
                    <label class="label-amt" v-show="paytype=='其他'">应收：{{bookinfo.dis_total}}</label>
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
                    <label class="label-amt" v-show="paytype=='会员卡'">应收：{{bookinfo.dis_total}}</label>
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
                    <label class="label-amt" v-show="paytype=='签账'">应收：{{bookinfo.dis_total}}</label>
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
        <el-button type="primary">确认收到款项</el-button>
      </span>
    </el-dialog>

    <div class="set_page" :class="{activePage:erweima}">
      <erweima @close="erweima=false;getererima()" v-if="erweima"></erweima>
    </div>
    <div class="set_page" :class="{activePage:payend}">
      <payend @close="payend=false;getererima()" v-if="payend"></payend>
    </div>
  </div>
</template>

<script>
import erweima from '@/views/lqy/erweimaPay'
import payend from './payEnd'
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
      payend: false
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
      const res = await this.$axios.get('/api?datatype=pay_order', {
        params: {
          storeid: this.storeid,
          pay_type: this.type(this.paytype),
          order_no: this.bookinfo.order_no,
          order_id: this.bookinfo.id
        }
      })
      if (res.data.code == 1) {
        this.$message.success('完成')
        this.payend = true
      } else {
        this.$message.error(res.data.msg)
      }
    },
    changepaytype (data) {
      if (this.bookinfo.customer_type != 2) {
        this.paytype = data
      } else {
        if (data == '签账' || data == '会员卡') {
          this.paytype = data
        }
      }
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
    }
  },
  created () {
    if (this.bookinfo) {
      this.itemlist = this.bookinfo.orderinfo
      if (this.bookinfo.customer_type == 2) {
        this.paytype = '会员卡'
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
  computed: {}
}
</script>

<style lang="scss" scoped>
.closebook {
  font-size: 16px;
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
      .btnView {
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
          background: #28282d;
          border-radius: 0;
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
