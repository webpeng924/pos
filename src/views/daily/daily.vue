<template>
  <div id="daily">
    <div class="topView">
      <div class="tView">
        <span :class="{active:type==1}" @click="type=1">日结</span> /
        <span :class="{active:type==2}" @click="type=2">本月概览</span>
      </div>
      <div class="dateView">
        <el-date-picker
          v-show="type==1"
          v-model="date"
          type="daterange"
          prefix-icon="a"
          :clearable="false"
          range-separator="-"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </div>
    <div class="contentView" v-show="type==1">
      <div class="left">
        <div class="headerView">
          <div class="tView">实际营业款</div>
          <div class="amtView">
            ￥&nbsp;
            <span>{{total}}</span>
          </div>
          <button class="btn-detail" @click="ysmingxi=true"></button>
          <button class="btn-audio btn-print" @click="dialogVisible = true;printTest=false">打印小票</button>
        </div>
        <div class="listView">
          <div class="one" v-show="list1.length">
            <div class="item">
              <span class="s1">现金类</span>
              <span>实际收款</span>
              <!-- <span>虚</span> -->
            </div>
            <div class="item" v-for="(v,k) in list1" :key="k">
              <span class="s2">{{v.pay_type|paytype}}</span>
              <span>￥{{v.stotal}}</span>
              <!-- <span class="s2">2011</span> -->
            </div>
          </div>
          <div class="one" v-show="list2.length">
            <div class="item">
              <span class="s1">卡付类</span>
              <span>实际收款</span>
              <!-- <span>虚</span> -->
            </div>
            <div class="item" v-for="(v,k) in list2" :key="k">
              <span class="s2">会员卡扣款</span>
              <span>￥{{v.stotal}}</span>
              <!-- <span class="s2">39</span> -->
            </div>
          </div>
          <div class="one" v-show="list3.length">
            <div class="item">
              <span class="s1" style="color:red">欠款类</span>
              <span>实际签账</span>
              <!-- <span>虚</span> -->
            </div>
            <div class="item" v-for="(v,k) in list3" :key="k" style="color:red">
              <span class="s2">会员签账</span>
              <span>￥{{v.stotal}}</span>
              <!-- <span class="s2">39</span> -->
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="customerView">
          <div class="tView">客源</div>
          <div class="cView">
            <div class="totalCntView cntItem">
              <div>{{infolist.zong}}</div>
              <div>客数</div>
            </div>
            <div>
              <div class="cntItem">
                <div>{{newcus}}</div>
                <div>新客</div>
              </div>
              <div class="cntItem">
                <div>{{oldcus}}</div>
                <div>老客</div>
              </div>
            </div>
            <div>
              <div class="cntItem">
                <div>{{nocard}}</div>
                <div>散客</div>
              </div>
              <div class="cntItem">
                <div>{{card}}</div>
                <div>会员</div>
              </div>
            </div>
          </div>
        </div>
        <div class="cardSaleView">
          <div class="tView">会员</div>
          <div class="cView">
            <div class="cardSaleView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  开卡
                  <span>{{kaika.ccount}}</span>
                </label>
                <label class="label-amt">￥&nbsp;{{kaika.total}}</label>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="kaika.point>100?100:kaika.point"
                status="warning"
              ></el-progress>
            </div>
            <div class="cardTopupView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  充值
                  <span>{{chong.ccount}}</span>
                </label>
                <label class="label-amt">￥&nbsp;{{chong.total}}</label>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="chong.point>100?100:chong.point"
                status="exception"
              ></el-progress>
            </div>
          </div>
        </div>
        <div class="saleInfoView">
          <div class="tView">服务</div>
          <div class="cView">
            <div class="serviceTopView" style="display:block">
              <div class="tView">项目Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>序号</label>
                  <label>项目名称</label>
                  <label>单价</label>
                  <label>次数</label>
                </div>
                <div class="itemView" v-for="(v,k) in infolist.item" :key="k">
                  <label>{{k+1}}</label>
                  <label class="overflowText">{{v.itemname}}</label>
                  <label>{{v.price}}</label>
                  <label>{{v.ccount}}</label>
                </div>
              </div>
            </div>
            <div class="productTopView" style="display:block">
              <div class="tView">产品Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>序号</label>
                  <label>产品名称</label>
                  <label>单价</label>
                  <label>次数</label>
                </div>
                <div class="itemView" v-for="(v,k) in infolist.goods" :key="k">
                  <label>{{k+1}}</label>
                  <label class="overflowText">{{v.itemname}}</label>
                  <label>{{v.price}}</label>
                  <label>{{v.ccount}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contentView" v-show="type==2">
      <div class="left">
        <div class="headerView">
          <div class="tView">
            营业收入
            <span>{{month}}</span>
          </div>
          <div class="amtView">
            ￥&nbsp;
            <span>{{total}}</span>
          </div>
        </div>
        <div class="listView">
          <div class="one">
            <div class="item">
              <span>本月营收目标：</span>
              <span>{{target.toFixed(2)}} 元</span>
              <span @click="modifyTarget">修改</span>
            </div>
            <div class="item">
              <span>目标差额：</span>
              <span>{{target>total?(target-total).toFixed(2):(total-target).toFixed(2)}} 元</span>
              <span v-if="target<total" style="color:red">超出</span>
              <span v-if="target>total" style="color:#ccc">未达标</span>
            </div>
          </div>
          <div class="two">
            <el-progress
              type="circle"
              :percentage="percentage > 100 ? 100 : percentage"
              :stroke-width="20"
              :width="150"
              :format="_format(percentage)"
            ></el-progress>
            <p>业绩完成度</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="cusView">
          <div class="item">
            <div class="tView">到店顾客数</div>
            <div class="cView">{{infolist.zong}}人</div>
          </div>
          <div class="item">
            <div class="tView" style="padding-left:0">人数与销售额对比</div>
            <div class="pView">
              <span>会员</span>
              <div>
                <div class="indiv">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="15"
                    v-if="!isNaN(card/infolist.zong*100)"
                    :percentage="Number((card/infolist.zong*100).toFixed(0))>100?100:Number((card/infolist.zong*100).toFixed(0))"
                    status="warning"
                  ></el-progress>
                  <span>{{card}} 人</span>
                </div>
                <div class="indiv">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="15"
                    v-if="!isNaN(cardsum/total*100)"
                    :percentage="Number((cardsum/total*100).toFixed(0))>100?100:Number((cardsum/total*100).toFixed(0))"
                    status="success"
                  ></el-progress>
                  <span>{{cardsum}} 元</span>
                </div>
              </div>
            </div>
            <div class="pView">
              <span>散客</span>
              <div>
                <div class="indiv">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="15"
                    v-if="!isNaN(nocard/infolist.zong*100)"
                    :percentage="Number((nocard/infolist.zong*100).toFixed(0))"
                    status="warning"
                  ></el-progress>
                  <span>{{nocard}} 人</span>
                </div>
                <div class="indiv">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="15"
                    v-if="!isNaN(nocardsum/total*100)"
                    :percentage="Number((nocardsum/total*100).toFixed(0))"
                    status="success"
                  ></el-progress>
                  <span>{{nocardsum}} 元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cardSaleView">
          <div class="tView">会员</div>
          <div class="cView">
            <div class="cardSaleView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  开卡
                  <span>{{kaika.ccount}}</span>
                </label>
                <label class="label-amt">￥&nbsp;{{kaika.total}}</label>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="kaika.point>100?100:kaika.point"
                status="warning"
              ></el-progress>
            </div>
            <div class="cardTopupView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  充值
                  <span>{{chong.ccount}}</span>
                </label>
                <label class="label-amt">￥&nbsp;{{chong.total}}</label>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="chong.point>100?100:chong.point"
                status="exception"
              ></el-progress>
            </div>
          </div>
        </div>
        <div class="saleInfoView">
          <div class="tView">服务排行</div>
          <div class="cView">
            <div class="serviceTopView" style="display:block">
              <div class="tView">项目Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>序号</label>
                  <label>项目名称</label>
                  <label>单价</label>
                  <label>次数</label>
                </div>
                <div class="itemView" v-for="(v,k) in infolist.item" :key="k">
                  <label>{{k+1}}</label>
                  <label class="overflowText">{{v.itemname}}</label>
                  <label>{{v.price}}</label>
                  <label>{{v.ccount}}</label>
                </div>
              </div>
            </div>
            <div class="productTopView" style="display:block">
              <div class="tView">产品Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>序号</label>
                  <label>产品名称</label>
                  <label>单价</label>
                  <label>次数</label>
                </div>
                <div class="itemView" v-for="(v,k) in infolist.goods" :key="k">
                  <label>{{k+1}}</label>
                  <label class="overflowText">{{v.itemname}}</label>
                  <label class="overflowText">{{v.price}}</label>
                  <label>{{v.ccount}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="dialog">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        class="news"
        :append-to-body="false"
      >
        <span slot="title" class="dialog-title">打印预览</span>
        <div id="print1">
          <div id="printContent" class="print-58">
            <div id="print-bcView" ref="print">
              <div class="header">
                <h4>{{shopInfo.shop_name}}</h4>
                <h4>{{date[0] == date[1]?'日结汇总':'营收汇总'}}</h4>
                <hr />
                <p
                  style="text-align:left;line-height:24px"
                >记账日期：{{date[0] == date[1]?date[1]:date[0] +' 至 '+ date[1]}}</p>
              </div>
              <div class="listView">
                <table align="left" class="textScale">
                  <tbody>
                    <tr v-show="list1.length">
                      <td>现金类:</td>
                      <!-- <td></td> -->
                    </tr>
                    <tr v-for="(v,k) in list1" :key="k+'a'">
                      <td>{{v.pay_type|paytype}}</td>
                      <td>{{v.stotal}}</td>
                    </tr>
                    <tr v-show="list2.length">
                      <td>卡付类:</td>
                      <!-- <td></td> -->
                    </tr>
                    <tr v-for="(v,k) in list2" :key="k+'b'">
                      <td>会员卡扣款</td>
                      <td>{{v.stotal}}</td>
                    </tr>
                    <tr v-show="list3.length">
                      <td>欠款类:</td>
                      <!-- <td></td> -->
                    </tr>
                    <tr v-for="(v,k) in list3" :key="k+'c'">
                      <td>会员签账</td>
                      <td>{{v.stotal}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="otherInfoView">
                <p class="textScale">打印时间：{{formatDate(new Date)}}</p>
                <p class="textScale">操作人员：admin</p>
                <p class="textScale">签名：</p>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="btn gray" @click="dialogVisible = false">关闭</div>
          <div class="btn green" @click="print">打印</div>
        </span>
      </el-dialog>
    </div>
    <div class="set_page" :class="{activePage:ysmingxi}">
      <ysmingxi @close="ysmingxi=false" v-if="ysmingxi" :Date="date"></ysmingxi>
    </div>
    <printPage class="printTest" v-if="printTest" :printList="printList"></printPage>
  </div>
</template>

<script>
import printPage from '../../components/print'
import ysmingxi from './ysmingxi'
import moment from 'moment'
export default {
  components: { ysmingxi, printPage },
  props: {},
  data () {
    return {
      date: '',
      now: '',
      type: 1,
      list: [],
      dialogVisible: false,
      printTest: false,
      ysmingxi: false,
      storeid: sessionStorage.getItem('storeid'),
      shopInfo: JSON.parse(sessionStorage.getItem('shopInfo')),
      infolist: [],
      total: 0,
      list1: [],
      list2: [],
      list3: [],
      newcus: 0,
      oldcus: 0,
      nocard: 0,
      nocardsum: 0,
      cardsum: 0,
      card: 0,
      chong: {
        ccount: 0,
        point: 0,
        total: 0
      },
      kaika: {
        ccount: 0,
        point: 0,
        total: 0
      },
      // percentage: 0,
      target: 0,
    }
  },
  watch: {
    date () {
      this.getData()
      this.getTarget()
    },
    type (val) {
      if (val == 1) {
        const a = this.formatDate(new Date())
        this.date = [a, a]
      } else {
        let a = moment(new Date).endOf('month').format("YYYY-MM-DD")
        let b = moment(new Date).endOf('month').format("YYYY-MM") + '-01'
        this.date = [b, a]
      }
    }
  },
  computed: {
    month () {
      return moment(new Date()).format('YYYY-MM')
    },
    percentage () {
      let percentage = this.total
      if (this.target != 0) {
        percentage = Number(((this.total / this.target) * 100).toFixed(2))
      }
      return percentage
    }
  },
  filters: {
    paytype (val) {
      switch (val) {
        case 'wx':
          return '微信';
        case 'zfb':
          return '支付宝';
        case 'cash':
          return '现金';
        case 'mixed':
          return '混合支付';
        case 'signbill':
          return '会员签账';
        default:
          return '其他'
      }
    }
  },
  methods: {
    _format (value) {
      return () => {
        return value + '%'
      }
    },
    modifyTarget () {
      this.$prompt('', '修改本月营收目标', {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: '确定修改',
        cancelButtonText: '取消',
        inputValue: this.target,
        inputPattern: /^[0-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(({ value }) => {
        this.$axios.get('/api?datatype=insert_store_target', {
          params: {
            storeid: this.storeid,
            month: this.month,
            value: value
          }
        }).then(res => {
          if (res.data.code == 1) {
            this.getTarget()
          }
        })
      })
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    async getTarget () {
      const res = await this.$axios.get('/api?datatype=get_store_target', {
        params: {
          storeid: this.storeid,
          month: this.month
        }
      })
      if (res.data.code == 1) {
        this.target = Number(res.data.data)
      }
    },
    print () {
      if ((window.navigator.userAgent).indexOf('wv') == -1) {
        this.printaa()
        return
      }
      let arr = [{ "name": JSON.parse(sessionStorage.getItem('shopInfo')).shop_name, "style": "1" }]
      let time = ''
      let type = ''
      if (this.date[0] == this.date[1]) {
        type = '日结汇总'
        time = '记账日期：' + this.date[0]
      } else {
        type = '营收汇总'
        time = '记账日期：' + this.date[0] + '至' + this.date[1]
      }
      arr.push({ "name": type, "style": "1" }, { "name": "---" }, { "name": time, }, { "name": "---" })
      if (this.list1.length != 0) {
        arr.push({ "name": "现金类:", "value": "" })
        this.list1.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "value": item.stotal
          }
          arr.push(bb)
        })
      }
      if (this.list2.length != 0) {
        arr.push({ "name": "" }, { "name": "卡付类:", "value": "" })
        this.list2.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "value": item.stotal
          }
          arr.push(bb)
        })
      }
      if (this.list3.length != 0) {
        arr.push({ "name": "" }, { "name": "欠款类:", "value": "" })
        this.list3.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "value": item.stotal
          }
          arr.push(bb)
        })
      }
      let printTime = '打印时间：' + moment().format('YYYY-MM-DD HH:mm')
      let checkmen = '操作员：' + JSON.parse(sessionStorage.getItem('userInfo')).username
      arr.push({ "name": "---" }, { "name": printTime }, { "name": checkmen }, { "name": "签名：" })
      // console.log(JSON.stringify(arr))
      var a = JSON.stringify(arr);
      javascript: jsSzb.smPrint(a);
      return false;
    },
    printaa () {
      let titleList = []
      // 消费产品
      let goodsList = []

      // 支付列表
      let payList = []
      if (this.list1.length != 0) {
        payList.push({ "name": "现金类:" })
        this.list1.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "val1": item.stotal
          }
          payList.push(bb)
        })
      }
      if (this.list2.length != 0) {
        payList.push({ "name": "" }, { "name": "卡付类:" })
        this.list2.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "val1": item.stotal
          }
          payList.push(bb)
        })
      }
      if (this.list3.length != 0) {
        payList.push({ "name": "" }, { "name": "欠款类:" })
        this.list3.forEach(item => {
          let bb = {
            "name": this.$options.filters['paytype'](item.pay_type), "val1": item.stotal
          }
          payList.push(bb)
        })
      }

      // 折扣信息
      let discontList = []

      // 会员信息
      let memeberinfo = []

      // 备注
      let printTime = '打印时间：' + moment().format('YYYY-MM-DD HH:mm')
      let checkmen = '操作员：' + JSON.parse(sessionStorage.getItem('userInfo')).username
      let remarkinfo = [{ "name": printTime }, { "name": checkmen }, { "name": "签名：" }]
      let time = ''
      let type = ''
      if (this.date[0] == this.date[1]) {
        type = '日结汇总'
        time = '记账日期：' + this.date[0]
      } else {
        type = '营收汇总'
        time = '记账日期：' + this.date[0] + '至' + this.date[1]
      }
      let obj = {
        shopname: JSON.parse(sessionStorage.getItem('shopInfo')).shop_name,
        type: type,
        order_no: '',
        Othertime: time,
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
    },
    async getData () {
      const res = await this.$axios.get('/api?datatype=day_money_index', {
        params: {
          storeid: this.storeid,
          start: this.date[0],
          end: this.date[1]
        }
      })
      if (res.data.code == 1) {
        this.total = 0
        this.list1 = []
        this.list2 = []
        this.list3 = []
        this.newcus = 0
        this.oldcus = 0
        this.nocard = 0
        this.nocardsum = 0
        this.cardsum = 0
        this.card = 0
        this.chong = {
          ccount: 0,
          point: 0,
          total: 0
        }
        this.kaika = {
          ccount: 0,
          point: 0,
          total: 0
        }
        this.infolist = res.data.data
        if (res.data.data.arr1) {
          res.data.data.arr1.forEach(item => {
            this.total += Number(item.stotal)
            if (item.pay_type == 'card') {
              this.list2.push(item)
            } else if (item.pay_type == 'signbill') {
              this.list3.push(item)
            } else {
              this.list1.push(item)
            }
          })
          this.total = this.total.toFixed(2)
        }
        if (res.data.data.customer1) {
          res.data.data.customer1.forEach(item => {
            if (item.customer_type == 1) {
              this.nocard = item.ccount
              this.nocardsum = Number(item.sum_total)
            } else {
              this.card = item.ccount
              this.cardsum = Number(item.sum_total)
            }
          })
          res.data.data.customer1.forEach(item => {
            if (item.customer_type == 1) {
              this.newcus = item.ccount
            } else {
              this.oldcus = item.ccount
            }
          })
        }

        if (res.data.data.member != null) {
          res.data.data.member.forEach(item => {
            if (item.type == '充值') {
              this.chong = item
            } else if (item.type == '会员卡') {
              this.kaika = item
            }
          })
        }
        this.$message.success('加载完成')
      }
    }
  },
  created () {
    // const a = this.formatDate(new Date())
    // this.date = [a, a]
    this.type = 2
  },
  mounted () {
    window.callJsFunction = this.callJsFunction
  }
}
</script>
<style>
#daily .dateView .el-input__inner {
  border: none;
}
.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  font-size: 18px;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: auto;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
@import '../../assets/css/print.css';

#daily {
  background: #fff url(../../assets/images/blacktop.png) 70px top / 300px 242px
    no-repeat;
  background-size: 33% 242px;
  .tView {
    color: #999;
    font-size: 22px;
    span.active {
      font-size: 26px;
      color: #fff;
      text-decoration: underline;
    }
  }
  .dateView {
    position: absolute;
    right: 0;
    display: flex;
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    color: #8a8a8a;
    cursor: pointer;
    margin-right: 5%;
    padding-right: 25px;
  }
  .contentView {
    display: flex;
    height: calc(100% - 85px);
    .left {
      width: 40%;
      height: 100%;
      border-right: 0.5px solid rgba(154, 154, 154, 0.5);
      .headerView {
        position: relative;
        padding: 15px 22px 0 22px;
        height: 157px;
        z-index: 10;
        .tView {
          line-height: 22px;
          margin-bottom: 10px;
          font-size: 20px;
          color: #f1f1f1;
          span {
            font-size: 14px;
            margin-left: 10px;
          }
        }
        .amtView {
          line-height: 42px;
          font-size: 20px;

          color: #fff;
          span {
            font-size: 36px;
            vertical-align: top;
          }
        }
        .btn-detail {
          position: absolute;
          top: 20px;
          right: 0;
          width: 110px;
          height: 116px;
          background: transparent url(../../assets/images/DCKXQ.png) center /
            110px no-repeat;
        }
        .btn-print {
          position: absolute;
          bottom: 0;
          right: 22px;
          width: 90px;
          height: 30px;
          font-size: 13px;
          color: #28282d;
          background: #fff url(../../assets/images/print.png) 0 center / 19px
            no-repeat;
          padding-left: 20px;
        }
      }
      .listView {
        height: calc(100% - 157px);
        overflow: auto;
        padding: 15px;
        .one {
          .item {
            display: flex;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: #28282d;
            &:first-child {
              font-size: 17px;
              height: 40px;
              line-height: 40px;
              .s1 {
                flex: 4;
                color: limegreen;
              }
            }
            .s2 {
              color: #8a8a8a;
            }
            span {
              flex: 3;
              &:last-child {
                text-align: right;
              }
            }
          }
        }
        .two {
          text-align: center;
          padding: 20px 0;
          p {
            margin-top: 10px;
          }
        }
      }
    }
    .right {
      width: 60%;
      height: 100%;
      padding: 20px;
      overflow-y: auto;
      > div {
        margin-top: 35px;
        &:first-child {
          margin-top: 0;
        }
      }
      .cusView {
        display: flex;
        .cView {
          padding-left: 30px;
          font-size: 16px;
          color: #47bf7c;
          font-weight: 700;
        }
        .item {
          flex: 2;
          &:first-child {
            flex: 1;
          }
          .pView {
            width: 100%;
            display: flex;
            margin-bottom: 6px;
            span {
              width: 30px;
            }
            > div {
              flex: 1;
            }
            .indiv {
              display: flex;
              .el-progress {
                flex: 1;
              }
              span {
                width: 100px;
                padding-left: 10px;
              }
            }
          }
        }
      }
      .tView {
        line-height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        color: #28282d;
        padding: 15px 0 15px 10px;
      }
      .customerView > .cView > div {
        border-right: 0.5px solid rgba(220, 220, 220, 0.7);
        &:last-child {
          border: none;
        }
      }

      .customerView .cView {
        padding-left: 50px;
      }
      .cView {
        display: flex;
        text-align: center;
        > div {
          padding: 0 15px;
          flex: 1;
          display: flex;
          > div {
            flex: 1;
            & > div:nth-child(1) {
              margin-bottom: 10px;
              font-weight: 700;
            }
          }
        }

        .totalCntView {
          display: block;
          text-align: left;
          div:nth-child(1) {
            color: #47bf7c;
            font-size: 28px;
            line-height: 28px;
            margin-bottom: 10px;
          }
        }
        .textView {
          padding: 0 35px 0 15px;
          line-height: 22px;
          margin-bottom: 13px;
          color: #28282d;
          display: flex;
          justify-content: space-between;
        }
      }
      .chartView {
        height: 16px;
        border-radius: 4px;
        background: #f4f4f4;
        overflow: hidden;
        text-align: right;
      }
      .chartView > div {
        transition: transform 0.7s, background 0.7s, font-size 0.7s, width 0.7s;
        font-size: 10px;
        color: #fff;
        padding: 0 5px;
        min-width: 40px;
        border-radius: 4px;
        &.cardSalePropView {
          background: #edb339;
        }
        &.cardTopupPropView {
          background: #f44e4e;
        }
      }
      .saleInfoView > .cView > div > .bcView {
        border-radius: 5px;
        background: #f8f8f8;
        padding-bottom: 15px;
        min-height: 270px;
        .headerView {
          display: flex;
          border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
          padding: 15px 0 10px;
          line-height: 20px;
        }
        label {
          flex: 2;
          text-align: center;
          font-size: 14px;
          color: #28282d;
          &:first-child,
          &:last-child {
            flex: 1;
          }
        }
        .itemView {
          position: relative;
          display: flex;
          margin-top: 18px;
          // padding-left: 15px;
          line-height: 24px;
          label {
            flex: 2;
            // text-align: left;
            &:first-child,
            &:last-child {
              flex: 1;
            }
          }
          .img-index {
            position: absolute;
            top: 0;
            left: 12px;
            width: 24px;
            height: 24px;
          }
          .tag-index {
            position: absolute;
            top: 2px;
            left: 12px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-family: DINAlternate-Bold;
            background: #dddddd;
            border-radius: 50%;
            color: #8a8a8a;
            text-align: center;
          }
        }
      }
      .saleInfoView .cView .tView {
        text-align: left;
        padding: 0;
        line-height: 36px;
        font-size: 14px;
        color: #28282d;
      }
    }
  }
  // 弹框样式
  .dialog {
    .news {
      width: 100%;
      /deep/ .el-dialog {
        width: 20% !important;
        min-width: 300px;
      }
    }
    p {
      margin: 0;
      padding: 0;
    }
    /deep/.el-dialog {
      padding: 0px 40px;
    }
    .dialog-header {
      text-align: center;
      color: #8c8a8c;
      p:nth-of-type(2) {
        font-size: 12px;
      }
      border-bottom: 1px solid #000;
    }
    .dialog-content {
      padding-bottom: 10px;
      border-bottom: 1px solid #000;
      .content-item {
        font-size: 10px;
        display: flex;
        justify-content: space-between;
        .content-title {
          font-weight: 600;
        }
      }
    }
    .dialog-bottom {
      font-size: 10px;
      p {
        padding-top: 5px;
      }
    }
    .btn {
      width: 45%;
    }
    /deep/.el-dialog__body {
      padding: 0;
    }
    /deep/.el-dialog__header {
      text-align: center;
    }
    /deep/.dialog-footer {
      display: flex;
      color: #fff;
      justify-content: space-between;
      .btn {
        width: 45%;
        padding: 10px 0;
        border-radius: 5px;
        text-align: center;
      }
    }
    /deep/.el-dialog__footer {
      padding: 10px 0;
    }
    .gray {
      background-color: #999;
    }
    .green {
      background: #47bf7c;
    }
  }
}
</style>
