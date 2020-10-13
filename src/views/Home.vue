<template>
  <div class="cash">
    <div class="top_select" v-show="!merge">
      <div class="right">
        <div class="btn" @click="page=true;server = ''">收银</div>
        <span class="i" @click="quickmoney=true">快速收银</span>
        <p @click="showaddtime=true" style="color:red">
          <el-button size="small" type="success">续费</el-button>
        </p>
        <p>系统到期时间：{{shopInfo.pos_period?shopInfo.pos_period:endtime}}</p>
        <!-- <el-input placeholder="员工信息查询" v-model="likeName" style="width:240px;border:#dc670b">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>-->
      </div>
      <div class="left">
        <div class="one">
          <el-select v-model="value" @focus="rotate=true">
            <el-option value="今日收银">今日收银</el-option>
            <el-option value="昨日收银">昨日收银</el-option>
            <el-option value="前日收银">前日收银</el-option>
          </el-select>
        </div>
        <div class="two">
          <el-select v-model="server" @focus="rotate=true">
            <el-option value="全部">全部</el-option>
            <el-option value="服务中">服务中</el-option>
            <el-option value="待结账">待结账</el-option>
            <el-option value="已结账">已结账</el-option>
            <el-option value="已作废">已作废</el-option>
          </el-select>
        </div>
        <div class="three" @click="showPeo">
          {{people}}
          <img src="../assets/images/Def_Icon_ArrowUp.png" :class="{imgs:rotate}" alt />
        </div>
      </div>
      <!-- <span class="i" @click="merge=true">合并</span> -->
    </div>
    <div class="top_select" v-show="merge">
      <div class="mergeHeaderView">
        <div class="leftView">
          <div class="textView">选择需要合并的单据</div>
          <div class="tipView">单据合并后不支持撤销！</div>
        </div>
        <div class="rightView">
          <button class="btn-audio btn-lightGray" @click="merge = false">取消</button>
          <button class="btn-audio btn-black" @click="merge = false">确认</button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="peoList" v-show="!rotate">
        <div class="menuView">
          <div
            class="menuItem btn-audio"
            :class="{select:choose == null}"
            @click="choosetype(null)"
          >全部</div>
          <div
            class="menuItem btn-audio"
            :class="{select:choose == v}"
            v-for="(v,index) in catelist"
            :key="index"
            @click="choosetype(v)"
          >{{v}}</div>
        </div>
        <div class="clearFilterView">
          <div
            class="btn-audio btn-clearFilter"
            @click="people='单据人员';worker='';rotate = true;getorderlist()"
          >重置</div>
        </div>
        <div class="empListView listView" style="max-height: 653px;">
          <div
            class="empItem btn-audio"
            v-for="(item,index) in workerlist"
            :key="index"
            @click="changepeo(item)"
          >
            <div class="imgView btn-audio">
              <img :src="item.avatar?item.avatar:'/upload/shop/moren.jpg'|imgUrl" alt />
            </div>
            <div class="textView btn-audio">
              <div class="overflowText btn-audio">{{item.job_no}}</div>
              <div class="overflowText btn-audio">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="listView orderList">
      <div
        class="orderItem listItem btn-audio"
        style="width: 300px;"
        @click="modifyorder(v)"
        v-for="(v,k) in orderlist"
        :key="k"
      >
        <div class="contentView">
          <div class="tView">
            <div class="tagView overflowText">&nbsp;</div>
            <div class="customerView">
              <!---->
              <div class="normalView overflowText">{{v.member_id!=0?v.member_name:'散客'}}</div>
            </div>
            <div class="creatTimeView">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Order_Time.png" />
              {{v.dateline|moment}}
            </div>
          </div>
          <div class="cView" style="margin-top:15px;">
            <div class="subItem" v-for="(val,idx) in v.orderinfo" :key="idx" v-show="idx<3">
              <div class="nameView overflowText">{{val.itemname}}</div>
              <!-- v-show="val.typeid==1" -->
              <div
                class="empView overflowText edit"
                @click.stop="openworker(v,val)"
              >{{val.workername}}</div>
              <div class="priceView one-txt-cut">
                <span>￥&nbsp;</span>
                {{val.subtotal}}
              </div>
            </div>
            <div class="subItem moreItem" v-show="v.orderinfo&&v.orderinfo.length>3">...</div>
          </div>
          <div class="bView">
            <div class="amtView" style="height:30px;padding:0">
              <label class="label-text">合计：</label>
              <label class="label-amt">
                ￥&nbsp;
                <span>{{v.total}}</span>
              </label>
            </div>
            <div class="amtView">
              <label class="label-text">实收金额：</label>
              <label class="label-amt">
                ￥&nbsp;
                <span>{{v.dis_total}}</span>
              </label>
            </div>
            <div
              class="remarkView overflowText"
              style="color: rgb(187, 187, 187);"
              @click.stop="()=>{if(v.status<3){remark=v.remark;showMemo=true;modifyid=v.id}}"
            >{{v.remark}}</div>
            <div class="serTimeView">
              <div
                v-show="v.status!=4"
                class="btn-closeTimeDwon btn-audio"
                @click.stop="cancelorder(v.id)"
              >取消订单</div>
            </div>
          </div>
        </div>
        <div class="flagView" :style="'background:'+ color(v.status)"></div>
        <div class="topImgView"></div>
        <div
          class="mergeItem"
          v-show="merge"
          @click.stop="showswitch=!showswitch"
          :class="{select:showswitch}"
        >
          <div class="mainView" v-show="showswitch" @click="stop">
            <el-switch v-model="mainPay" active-color="#13ce66"></el-switch>
            <div class="textView">主单</div>
          </div>
        </div>
      </div>
    </div>

    <div class="set_page" :class="{activePage:page}">
      <opennew @close="page=false;server='服务中';info=''" :info="info" v-if="page" :from="from"></opennew>
    </div>

    <div class="set_page" :class="{activePage:printpage}">
      <printpage @close="printpage=false;server='已结账';info=''" :info="info" v-if="printpage"></printpage>
    </div>

    <div class="set_page" :class="{activePage:innerVisible}">
      <closepage @close="innerVisible=false" v-if="innerVisible" :money="Quickprice"></closepage>
    </div>

    <div class="statusView">
      <div class="flagView">
        <div class="flagItem" v-for="(v,k) in statuslist" :key="k">
          <label :style="'background:' + v.color"></label>
          {{v.name}}({{v.num}})
        </div>
      </div>
      <div class="lineView"></div>
      <button
        class="btn-refresh btn-audio"
        @click="refresh"
        :style="'transform:rotate('+deg+'deg)'"
      ></button>
    </div>

    <el-dialog
      title="快速收款"
      :visible.sync="quickmoney"
      width="620px"
      center
      custom-class="quickmoney"
    >
      <div class="inputBoxView">
        <el-input
          class="keyboardInputView"
          :class="{select:chosIpu==1}"
          v-model="Quickprice"
          type="number"
          :min="0"
          @focus="chosIput(1)"
        ></el-input>
        <i>￥</i>
        <div style="text-align: center">
          <el-button @click="toSubmit" style="background-color:#dc670b;color:#fff">选择支付方式</el-button>
        </div>
        <!-- <el-input
          class="keyboardInputView"
          :class="{select:chosIpu==2}"
          placeholder="扫描付款码或手输付款码按回车键收款"
          @focus="chosIput(2)"
        ></el-input>-->
      </div>
      <!-- <el-dialog
        width="50%"
        title="请选择支付方式"
        :visible.sync="innerVisible"
        append-to-body
        center
        custom-class="quickmoney"
      >
        <el-radio-group v-model="paytype" style="padding:50px">
          <el-radio label="zfb">支付宝</el-radio>
          <el-radio label="wx">微信</el-radio>
          <el-radio label="cash">现金</el-radio>
          <el-radio label="other">其他</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setCard">支付</el-button>
        </span>
      </el-dialog>-->
    </el-dialog>

    <el-dialog title="备注" :visible.sync="showMemo" width="430px" center custom-class="quickmoney">
      <!-- <div class="customerTypeView">
        <el-radio v-model="radio" label="1">老客</el-radio>
        <el-radio v-model="radio" label="2">新客</el-radio>
      </div>-->
      <div class="textView">
        <textarea placeholder="填写备注" maxlength="500" v-model="remark"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyMemo" style="background-color:#dc670b;color:#fff">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 选择服务人员 -->
    <el-dialog
      :visible.sync="showworker"
      width="1024px"
      center
      custom-class="popView-contentView"
      append-to-body
    >
      <chooseworker @close="setdata" :setinfo="setinfo" v-if="showworker"></chooseworker>
    </el-dialog>

    <!-- 签到 -->
    <el-dialog :visible.sync="showSign" width="30%">
      <div style="text-align: center;padding:20px;font-size:16px">今天是 {{new Date()|moment1}}</div>
      <div style="text-align: center;padding:20px">
        <el-button type="primary" @click="toSign" style="width:80%">点击签到</el-button>
      </div>
    </el-dialog>

    <!-- 续费 -->
    <el-dialog :visible.sync="showaddtime" width="600px" :close-on-click-modal="false">
      <div class="addtime">
        <p>尊敬的用户，您好：</p>
        <p style="text-indent: 2em;">您的系统使用期限将在{{endtime}}到期；为确保您的用户体验，避免损失；请及时续费！</p>
        <div class="item_i">
          <div
            class="item_item"
            :class="{opc:addtimeType==1,bdj:addtimeType==2}"
            @click="addtimeType=2"
          >
            <span class="tag">续费享优惠</span>
            <h3>续费VIP</h3>
            <p class="money">￥800</p>
            <p class="money1">￥1000</p>
            <div class="line">免费送积分</div>
          </div>
          <div
            class="item_item"
            :class="{opc:addtimeType==2,bdj:addtimeType==1}"
            @click="addtimeType=1"
          >
            <span class="tag">续费享优惠</span>
            <h3>续费VIP</h3>
            <p class="money">￥1500</p>
            <p class="money1">￥2000</p>
            <div class="line">免费送积分</div>
          </div>
        </div>
        <div class="paytype">
          <el-radio v-model="paytype" label="zfb" border>支付宝</el-radio>
          <el-radio v-model="paytype" label="wx" border>微信</el-radio>
          <el-radio v-model="paytype" label="other" border>其他</el-radio>
        </div>
      </div>
      <div style="text-align: center;padding:10px">
        <el-button type="primary" @click="clickpaytype">支付</el-button>
      </div>
      <el-dialog width="300px" :visible.sync="showaddewm" append-to-body center>
        <img
          src="../assets/images/zfbpay800.jpg"
          alt
          style="width:100%"
          v-show="paytype=='zfb'&&addtimeType==2"
        />
        <img src="../assets/images/otherpay.jpg" alt style="width:100%" v-show="paytype=='other'" />
        <img
          src="../assets/images/zfbpay1500.jpg"
          alt
          style="width:100%"
          v-show="paytype=='zfb'&&addtimeType==1"
        />
        <img src="../assets/images/wxpay.jpg" alt style="width:100%" v-show="paytype=='wx'" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import opennew from '@/components/addnew.vue'
import printpage from '@/components/printpage.vue'
import closepage from '@/components/closeOther'
import chooseworker from '@/components/choosmember.vue'
import qs from 'qs'
import moment from 'moment'
export default {
  components: { chooseworker, opennew, printpage, closepage },
  props: {},
  data () {
    return {
      from: this.$route.params.from,
      likeName: '',
      info: '',
      deg: 0,
      mainPay: false,
      innerVisible: false,
      showaddtime: false,
      value: '今日收银',
      people: '单据人员',
      server: '服务中',
      rotate: true,
      choose: null,
      paytype: '',
      addtimeType: 0,
      gongzhong: 1,
      storeid: sessionStorage.getItem('storeid'),
      page: false,
      printpage: false,
      Quickprice: '0',
      quickmoney: false,
      chosIpu: 0,
      merge: false,
      showswitch: false,
      showMemo: false,
      showworker: false,
      shopInfo: JSON.parse(sessionStorage.getItem('shopInfo')),
      radio: '1',
      num: '1',
      workerlist: [],
      catelist: [],
      list: [],
      orderlist: [],
      setinfo: '',
      worker: '',
      modifyid: '',
      remark: '',
      statuslist: [{ name: '服务中', status: "1", num: "0", color: 'rgb(237, 179, 57)' }, { name: '待结账', status: "2", num: "0", color: 'rgb(244, 78, 78)' }, { name: '已结账', status: "3", num: "0", color: 'rgb(71, 191, 124)' }, { name: '已作废', status: "4", num: "0", color: 'rgb(221, 221, 221)' }],
      nowModifyOrder: '',
      showSign: false,
      showaddewm: false
    }
  },
  watch: {
    value (val) {
      this.getorderlist()
    },
    server (val) {
      this.getorderlist()
    },
  },
  filters: {
    moment (val) {
      return moment.unix(val).format('HH:mm')
    },
    moment1 (val) {
      return moment(val).format('YYYY年MM月DD日')
    },
    Server (val) {
      switch (val) {
        case '全部':
          return 0;
        case '服务中':
          return 1;
        case '待结账':
          return 2;
        case '已结账':
          return 3;
        case '已作废':
          return 4
      }
    }
  },
  computed: {
    endtime () {
      let time = moment(this.shopInfo.adt).add('1', 'years').format('YYYY-MM-DD')
      return time
    }
  },
  methods: {
    clickpaytype () {
      if (!this.addtimeType) return this.$message.error('请选择续费金额')
      if (!this.paytype) return this.$message.error('请选择付款方式')
      this.showaddewm = true
    },
    color (val) {
      switch (val) {
        case '1':
          return 'rgb(237, 179, 57)';
        case '2':
          return 'rgb(244, 78, 78)';
        case '3':
          return 'rgb(71, 191, 124)';
        case '4':
          return 'rgb(221, 221, 221)';
      }
    },
    async getorderlist () {
      this.orderlist = []
      let status = this.$options.filters['Server'](this.server)
      const loading = this.$loading({ lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' });
      const res = await this.$axios.get('/api?datatype=get_orderlist', {
        params: {
          storeid: this.storeid,
          date: this.value == '今日收银' ? '0' : this.value == '昨日收银' ? '1' : '2',//0今天 1昨天 2前天
          status: status,//1服务中 2待结账 3已结账  4已作废
          staffid: this.people == '单据人员' ? 'all' : this.worker.id//all,1,2,3...
        }
      })
      if (res.data.code == 1) {
        this.$message.success('加载成功')
        let workerlist = JSON.parse(sessionStorage.getItem('workerlist'))
        if (res.data.data) {
          res.data.data.forEach(item => {
            // console.log(1, item.orderinfo)
            if (item.orderinfo != null) {
              // console.log(2)
              item.orderinfo.forEach(k => {
                this.$set(k, 'workername', '')
                this.$set(k, 'workerNo', '')
                if (k.staff1 && k.staff1 != 0) {
                  let workername = workerlist.find(w => w.id == k.staff1)
                  // console.log(workerlist, k.staff1, workername)
                  k.workername = workername.name
                  k.workerNo = workername.job_no
                }
              })
            }
          })
          this.orderlist = res.data.data
          this.statuslist.forEach(item => {
            res.data.right.forEach(v => {
              if (item.status == v.status) {
                item = Object.assign(item, v)
              }
            })
          })
        } else {
          this.orderlist = []
        }
      } else {
        this.$message.error('加载失败')
      }
    },
    cancelorder (id) {
      let role = JSON.parse(sessionStorage.getItem('userInfo')).role
      if (role != 1) return this.$message.error('没有权限')
      this.$confirm('确定取消该消费单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (value) => {
        const res = await this.$axios.get('/api?datatype=cancel_order', {
          params: {
            storeid: this.storeid,
            id: id
          }
        })
        if (res.data.code == 1) {
          this.$message.success('已取消')
          this.getorderlist()
        }
      })
    },
    toSubmit () {
      if (!this.Quickprice || this.Quickprice <= 0) {
        this.$message.error('请输入正确价格')
      } else {
        this.quickmoney = false
        this.innerVisible = true
      }
    },
    // 快速收款
    // async setCard () {
    //   const res = await this.$axios.get('/api?datatype=quick_pay', {
    //     params: {
    //       storeid: this.storeid,
    //       dis_total: this.Quickprice,
    //       pay_type: this.paytype
    //     }
    //   })
    //   if (res.data.code == 1) {
    //     this.$message.success('收款成功')
    //     this.innerVisible = false
    //     this.quickmoney = false
    //   } else {
    //     this.$message.error('收款失败')
    //   }
    // },
    toSign () {
      this.$axios.get('/api?datatype=insert_sign&storeid=' + this.storeid).then(res => {
        if (res.data.code == 1) {
          this.$message.success('签到成功')
          this.shopInfo.is_sign = 1
          sessionStorage.setItem('shopInfo', JSON.stringify(this.shopInfo))
        }
        this.showSign = false
      })
    },
    // 打开整单
    modifyorder (v) {
      if (v.status < 3) {
        this.server = ''
        this.info = v
        this.page = true
      } else if (v.status == 3) {
        this.info = v
        this.printpage = true
      }
    },
    choosetype (v) {
      this.choose = v
      this.getitem()
    },
    showPeo () {
      this.rotate = !this.rotate
    },
    changepeo (item) {
      this.rotate = true
      this.people = item.job_no + '-' + item.name
      this.worker = item
      this.getorderlist()
    },
    chosIput (type) {
      if (type == 1) {
        this.chosIpu = 1
        if (this.Quickprice == 0) {
          this.Quickprice = ''
        }
      } else {
        this.chosIpu = 2
        if (this.Quickprice === '') {
          this.Quickprice = '0'
        }
      }
    },
    openworker (v, val) {
      // console.log(val)
      if (Number(v.status) < 3) {
        let option = {
          title: val.itemname,
          serverfor: v.member_name ? v.member_name : '客A',
          num: val.num,
          money: Number(val.discount_price),
          worker: val
        }
        this.modifyid = val.id
        this.setinfo = option
        this.nowModifyOrder = v
        this.showworker = true
      }
    },
    // 接受返回
    setdata (data) {
      this.$prompt('', '请输入优惠后价格', {
        confirmButtonText: '确定',
        inputValue: this.nowModifyOrder.dis_total,
        inputPattern: /^[0-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(async ({ value }) => {
        const res = await this.$axios.get('/api?datatype=update_order_distotal', {
          params: {
            dis_total: value,
            storeid: this.storeid,
            id: this.nowModifyOrder.id
          }
        })
        if (res.data.code == 1) {
          this.modifyitem(data)
        }
      })
      // console.log(data)
    },
    //修改项目信息
    async modifyitem (data) {
      let obj = qs.stringify({
        storeid: this.storeid,
        id: this.modifyid,
        staff1: data.choose.gong ? data.choose.gong.id : 0,
        num: data.num,
        subtotal: data.price
      })
      const res = await this.$axios.post('/api?datatype=update_orderitem_detail', obj)
      if (res.data.code == 1) {
        this.$message.success('更新成功')
        this.getorderlist()
        this.showworker = false
      }
    },
    // 刷新
    refresh () {
      let timer = setInterval(() => {
        if (this.deg < 360) {
          this.deg += 10
        } else {
          this.deg = 0
          clearInterval(timer)
        }
      }, 3);
      if (this.server == '服务中') {
        this.getorderlist()
      } else {
        this.server = '服务中'
      }
      // 
    },
    stop (e) {
      e.stopPropagation()
    },
    async getworkerlist () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 0,
          is_wei: 1
        }
      })
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(item => {
          if (!item.avatar) {
            item.avatar = '/upload/shop/moren.jpg'
          }
          if (!this.catelist.includes(item.service_job)) {
            this.catelist.push(item.service_job)
          }
        })
        this.workerlist = res.data.data
        sessionStorage.setItem('workerlist', JSON.stringify(res.data.data))
      }
    },
    async getitem () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 0,
          is_wei: 1,
          search: this.choose
        }
      })
      if (res.data.code == 1) {
        this.workerlist = res.data.data
      }
    },
    async modifyMemo () {
      const res = await this.$axios.get('/api?datatype=update_order_remark', {
        params: {
          storeid: this.storeid,
          id: this.modifyid,
          remark: this.remark
        }
      })
      if (res.data.code == 1) {
        this.showMemo = false
        this.getorderlist()
      }
    }
  },
  created () {
    if (this.from == 'car') {
      this.page = true
    }
    let isSign = this.shopInfo.is_sign
    if (isSign == 1) {

    } else {
      this.showSign = true
    }
    this.getworkerlist()
    this.getorderlist()
  },
}
</script>

<style>
.one > .el-select input {
  width: 132px;
  padding: 0 15px 0 0;
  line-height: 40px;
  font-size: 24px;
  color: #28282d;
  text-align: left;
  border: none;
}

.two > .el-select input {
  width: 80px;
  padding: 0 15px 0 0;
  line-height: 40px;
  font-size: 15px;
  color: #28282d;
  text-align: left;
  border: none;
}

.el-select .el-input__suffix > span > i {
  color: transparent;
  background: transparent url('../assets/images/Def_Icon_ArrowUp.png') center /
    28px no-repeat;
}

.el-dialog.quickmoney {
  border-radius: 6px;
  background: rgb(255, 255, 255);
  box-shadow: rgb(51, 51, 51) 0px 0px 20px 0px;
}
.el-dialog .el-dialog__body {
  padding: 0 !important;
}

.el-dialog.quickmoney .el-button:hover,
.el-dialog.quickmoney .el-button:focus {
  color: #dc670b;
  border-color: #f3c4a0;
  background-color: #ffeaca;
}

.el-dialog.popView-contentView {
  width: 1024px;
  height: 75vh;
  margin-top: 10vh !important;
  border-radius: 6px;
  background: rgb(255, 255, 255);
  overflow: auto;
  box-shadow: rgb(51, 51, 51) 0px 0px 20px 0px;
}
.el-dialog.popView-contentView .el-dialog__header {
  display: none;
}
</style>

<style lang="scss" scoped>
.cash {
  background: #f4f4f4;
  position: relative;

  .top_select {
    position: relative;
    z-index: 10;
    background: #fff;
    padding: 35px 20px 10px 20px;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.01);
    display: flex;
    .mergeHeaderView {
      width: 100%;
      display: flex;
      height: 40px;
      .leftView {
        flex: 1;
        overflow: hidden;
        color: #28282d;
        .textView {
          font-size: 18px;
          color: #28282d;
          line-height: 22px;
        }
        .tipView {
          font-size: 12px;
          color: #5a5a5a;
          line-height: 18px;
          padding-left: 25px;
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Warning.png)
            left center / 18px no-repeat;
        }
      }
      .rightView > button {
        width: 110px;
        margin-right: 12px;
      }
      .btn-lightGray {
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        background: #f8f8f8;
        border-radius: 5px;
        font-size: 15px;
        color: #5a5a5a;
      }
      .btn-black {
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        background: #28282d;
        border-radius: 5px;
        font-size: 15px;
        color: #fff;
      }
    }
    .right {
      flex: 1;
      p {
        float: right;
        line-height: 40px;
        font-size: 15px;
        margin-right: 30px;
        color: #999;
      }
    }
    .left {
      display: flex;
      > div {
        float: left;
        min-width: 92px;
      }
    }
    .one {
      width: 132px;
      margin-right: 25px;
    }
    .two {
      height: 40px;
      width: 80px;
      margin-right: 25px;
    }
    .three {
      position: relative;
      height: 40px;
      line-height: 40px;
      padding-right: 32px;
      font-size: 15px;
      cursor: pointer;
      img {
        transform-origin: center center;
        transform: rotate(0deg);
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
        width: 28px;
        height: 28px;
        transition: 0.5s;
      }
      .imgs {
        transform: rotate(180deg);
      }
    }
    .i {
      margin: 0 20px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      cursor: pointer;
      color: #dc670b;
    }
    .btn {
      margin-left: 20px;
      display: inline-block;
      width: 110px;
      height: 40px;
      border-radius: 6px;
      background: #dc670b;
      font-size: 16px;
      color: #fff;
      line-height: 40px;
      vertical-align: top;
      text-align: center;
      cursor: pointer;
    }
  }
  .peoList {
    // opacity: 0;
    position: absolute;
    width: 100%;
    z-index: 9;
    // margin-top: 81px;
    top: 90px;
    transition: 0.5s;
    background: #fff;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.05);
    .menuView {
      position: relative;
      flex: 1;
      height: 68px;
      border-top: 0.5px solid rgba(220, 220, 220, 0.7);
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      line-height: 40px;
      padding: 14px 130px 14px 24px;
      .menuItem {
        display: inline-block;
        min-width: 60px;
        text-align: center;
        padding: 0 15px;
        cursor: pointer;
        font-size: 16px;
        color: #28282d;
      }
      .select {
        position: relative;
        color: #28282d;
      }
      .select:after {
        content: '';
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        width: 24px;
        height: 2px;
        background: #28282d;
        margin: auto;
        border-radius: 1px;
      }
    }
    .clearFilterView {
      position: absolute;
      width: 130px;
      height: 68px;
      top: 1px;
      right: 130px;
      background: #fff;
      text-align: center;
      .btn-clearFilter {
        cursor: pointer;
        position: absolute;
        top: 1px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 72px;
        height: 36px;
        line-height: 36px;
        border: 1px solid #28282d;
        border-radius: 5px;
        font-size: 15px;
      }
    }
    .empListView {
      padding: 12px 24px 20px 20px;
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 460px;
      .empItem {
        width: 100px;
        height: 150px;
        margin-right: 15px;
        margin-bottom: 15px;
        display: inline-block;
        border-radius: 3px;
        box-shadow: 0 0 3px 0 #ddd;
        overflow: hidden;
        cursor: pointer;
        background: #fff;
        .imgView {
          cursor: pointer;
          height: 100px;
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave {
    opacity: 1;
    margin-top: 0;
    transition: 0.5s;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    margin-top: -50px;
    transition: 0.5s;
  }

  .orderList {
    overflow: auto;
    padding: 20px 0 30px 12px;
    // min-width: 870px;
    height: calc(100% - 85px);
    .orderItem {
      cursor: pointer;
      position: relative;
      float: left;
      width: 300px;
      height: 352px;
      border-radius: 6px;
      overflow: hidden;
      background: #8a8a8a;
      padding: 5px;
      margin: 0 9px 9px 0;
      .topImgView {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 17px;
        width: 140px;
        background: transparent
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_OrderTopImg.png)
          center top / 140px 17px no-repeat;
      }
      .flagView {
        position: absolute;
        top: 22px;
        left: 5px;
        width: 10px;
        height: 20px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      .contentView {
        background: #fff;
        height: 342px;
        padding: 10px;
        .tView {
          margin-top: 7px;
          display: flex;
          line-height: 20px;
          height: 20px;
          .customerView {
            flex: 1;
            font-size: 14px;
            color: #28282d;
            .normalView {
              color: #28282d;
              padding-left: 26px;
              background: transparent
                url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_CustomerNormal.png)
                left center / 24px no-repeat;
            }
          }
          .tagView {
            flex: 1;

            font-size: 20px;
            color: #28282d;
          }
          .creatTimeView {
            flex: 1;
            color: #8a8a8a;
            text-align: right;
            font-size: 12px;
            font-family: DINAlternate-Bold;
            img {
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-top: -2px;
            }
          }
        }
        .cView {
          position: relative;
          height: 142px;
          overflow: hidden;
          border-radius: 6px;
          border: 0.5px solid #ddd;
          & > div {
            display: flex;
            height: 40px;
            border-bottom: 0.5px solid #ddd;
            & > div {
              flex: 1;
              line-height: 20px;
              padding: 10px 0 10px 8px;
            }

            .nameView {
              flex: 1.2;
              font-size: 14px;
              color: #28282d;
            }
            .empView {
              padding-left: 20px;
              font-size: 12px;
              color: #8a8a8a;
              background: transparent;
            }
            .empView.edit {
              background: transparent
                url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Gray.png)
                0 center / 20px no-repeat;
            }
            .priceView {
              text-align: right;
              color: #28282d;
              font-size: 12px;
              padding-right: 8px;
              min-width: 76px;
              max-width: 66px;
            }
          }
          & > div.subItem:nth-child(3) {
            border-bottom: none;
          }
          .moreItem {
            margin-top: -5px;
            padding-left: 10px;
            line-height: 10px;
            font-size: 14px;
            height: 18px;
            color: #28282d;
            border-bottom: none;
          }
        }
        .cView::after {
          position: absolute;
          content: '';
          background: #ddd;
          right: 76px;
          top: 0;
          width: 0.5px;
          height: 142px;
        }
        .bView {
          .amtView {
            display: flex;
            position: relative;
            height: 37px;
            line-height: 30px;
            padding-bottom: 7px;
            font-size: 13px;
            .label-text {
              color: #8a8a8a;
              text-align: left;
            }
            .label-amt {
              flex: 1;
              text-align: right;
              color: #28282d;
              span {
                font-size: 20px;
              }
            }
          }
          .remarkView {
            font-size: 13px;
            color: #8a8a8a;
            margin-top: -3px;
            padding-left: 28px;
            padding-right: 10px;
            line-height: 36px;
            height: 36px;
            overflow: hidden;
            border-radius: 5px;
            background: #f4f4f4
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Gray.png)
              3px center / 22px no-repeat;
          }
          .serTimeView {
            margin-top: 12px;
            height: 28px;
            display: flex;
            overflow: hidden;
            .btn-closeTimeDwon {
              width: 62px;
              height: 28px;
              line-height: 28px;
              text-align: center;
              border: 0.5px solid #ddd;
              font-size: 12px;
              color: #28282d;

              border-radius: 3px;
            }
            .timeView {
              flex: 1;
              min-width: 60px;
              color: #8a8a8a;
              text-align: right;
              font-size: 12px;
              line-height: 28px;
            }
          }
        }
      }

      .mergeItem {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        &.select {
          background: rgba(0, 0, 0, 0.7)
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_S.png);
          background-size: 24px;
          background-repeat: no-repeat;
          background-position: 260px 312px;
        }
        .mainView {
          position: absolute;
          width: 80px;
          height: 80px;
          padding: 15px 0;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          text-align: center;
          .textView {
            margin-top: 5px;
            font-size: 12px;
            color: #fff;
            line-height: 20px;
          }
        }
      }
    }
  }

  .set_page {
    position: absolute;
    background: #fff;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    top: 100%;
    z-index: 11;
    transition: 1s;
    opacity: 0;
  }

  .set_page.activePage {
    top: 0;
    opacity: 1;
  }
  .statusView {
    position: fixed;
    right: 15px;
    bottom: 15px;
    display: flex;
    width: 400px;
    height: 32px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 5px;
    overflow: hidden;
    .flagView {
      display: flex;
      flex: 1;
      padding-left: 12px;
      .flagItem {
        flex: 1;
        position: relative;
        padding-left: 18px;
        line-height: 32px;
        font-size: 12px;
        label {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }
    }
    .lineView {
      position: absolute;
      right: 36px;
      top: 6px;
      height: 20px;
      content: '';
      width: 1px;
      background: #fff;
    }
    button {
      width: 36px;
      height: 32px;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Refresh_White.png)
        center / 26px no-repeat;
    }
  }

  .inputBoxView {
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    width: 384px;
    padding: 30px 0 25px 0;
    i {
      position: absolute;
      left: 10px;
      top: 50px;
    }
    .keyboardInputView {
      /deep/.el-input__inner {
        height: 58px;
        border: 1px solid rgba(220, 220, 220, 0.7);
        box-shadow: 0 0 3px rgba(220, 220, 220, 0.7);
        border-radius: 6px;
        margin-bottom: 15px;
        padding: 14px 24px;
        line-height: 30px;
        cursor: pointer;
      }
    }
    .select {
      /deep/.el-input__inner {
        border: 1px solid #47bf7c;
        box-shadow: 0 0 3px #47bf7c;
      }
    }
  }

  .customerTypeView {
    padding: 0 30px;
    line-height: 40px;
    text-align: left;
    font-size: 14px;
  }
  .quickmoney .textView {
    padding: 0 30px;
    textarea {
      display: block;
      width: 100%;
      background: #f4f4f4;
      min-height: 180px;
      padding: 15px;
      line-height: 20px;
      font-size: 14px;
      color: #28282d;
      box-sizing: border-box;
      border-radius: 6px;
      border: none;
      outline: none;
      resize: none;
      margin-bottom: 10px;
    }
  }
  .orderSerConfigEmpView {
    background: #fff;

    .topView {
      display: flex;
      padding: 35px 20px 17px 0;
      line-height: 32px;
      box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
      z-index: 10;
      button {
        background: transparent;
        border: none;
        outline: none;
        box-sizing: border-box;
        cursor: pointer;
        padding: 0;
      }
      .btn-showType {
        padding: 3px 18px 3px 20px;
        height: 34px;
        border-right: 0.5px solid rgba(220, 220, 220, 0.7);
        margin-right: 15px;
        img {
          vertical-align: top;
          width: 28px;
          height: 28px;
        }
      }
      .nameView {
        max-width: 40%;
        min-width: 120px;
        font-family: PingFangSC-Semibold;
        font-size: 15px;
        color: #28282d;
      }
      .customView {
        margin-left: 25px;
        text-align: left;
        font-size: 15px;
        color: #8a8a8a;
        button {
          margin-left: 10px;
          line-height: 20px;
          padding: 6px 20px;
          font-size: 15px;
          color: #28282d;
          border-radius: 6px;
          border: 1px solid rgba(154, 154, 154, 0.5);
        }
        button.select {
          border: 1px solid #dc670b;
          background: #dc670b;
          color: #fff;
        }
      }
    }
    .bcView {
      position: relative;
      height: calc(75vh - 150px);
      .contentView {
        position: relative;
        height: 100%;
        display: flex;
        .empBoxView {
          flex: 1;
          min-height: 100%;
          background: #f4f4f4;
          max-width: 814px;
          .menuView {
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            padding: 10px 0;
            .menuItem {
              position: relative;
              display: inline-block;
              text-align: center;
              padding: 0 18px;
              line-height: 44px;
              color: #28282d;
              font-size: 15px;
              cursor: pointer;
              &.select {
                color: #28282d;
              }
              &.select:after {
                position: absolute;
                content: '';
                left: 0;
                right: 0;
                bottom: 3px;
                width: 24px;
                height: 2px;
                background: #dc670b;
                margin: auto;
              }
            }
          }
          .empView {
            position: relative;
            z-index: 10;
            height: calc(100% - 54px);
            margin-top: -10px;
            background: #f4f4f4;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 20px 0 20px 20px;
            .empItem {
              display: inline-flex;
              background: #fff
                url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Check_N.png)
                200px center / 28px no-repeat;
              padding: 17px 40px 17px 15px;
              border-radius: 6px;
              width: 240px;
              height: 74px;
              margin: 0 20px 16px 0;
              .imgView {
                margin-right: 12px;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                }
              }
              .textView {
                flex: 1;
                line-height: 20px;
                color: #28282d;
                .nameView {
                  font-size: 15px;
                }
              }
            }
          }
        }
        .empTypeView {
          width: 210px;
          min-width: 210px;
          height: 100%;
          .empSetView {
            position: relative;
            padding: 22px 12px 22px 22px;
            line-height: 24px;
            height: 68px;
            overflow: hidden;
            cursor: pointer;
            .empView {
              display: flex;
              .nameView {
                flex: 3;
                font-size: 15px;
                color: #47bf7c;
              }
              .serTypeView {
                border-left: 0.5px solid rgba(154, 154, 154, 0.5);
                padding-left: 10px;
                flex: 2;
              }
              /deep/ .el-select {
                height: 24px;
                display: inline-block;
                position: relative;
                .el-input {
                  display: block;
                  position: relative;
                  font-size: 14px;
                  display: inline-block;
                  width: 100%;
                }
              }
            }
          }
          .empSetView.select:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            background: #dc670b;
          }
        }
      }
    }
    .bView {
      position: relative;
      z-index: 10;
      display: flex;
      border-top: 0.5px solid rgba(154, 154, 154, 0.5);
      padding: 10px 20px;
      line-height: 40px;
      background: #fff;
      .cntView {
        margin-top: 2px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #8a8a8a;
      }
      .amtView {
        text-align: right;
        flex: 1;
        font-size: 14px;
        color: #8a8a8a;
        vertical-align: middle;
        span {
          color: #ff5e56;
          font-size: 20px;
        }
      }
      .btn-complete {
        margin-left: 30px;
        width: 110px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        font-size: 16px;
        background: #dc670b;
        border-radius: 6px;
      }
    }
    .btn-close {
      position: absolute;
      top: 10px;
      right: 5px;
      width: 40px;
      height: 40px;
      z-index: 10;
      background: url(https://static.bokao2o.com/wisdomCashier/images/Icon_X_Gray.png)
        center / 28px 28px no-repeat;
    }
  }

  .addtime {
    padding: 20px;
    height: 400px;
    > p {
      font-weight: 700;
      padding: 0 25px;
    }
    .item_i {
      display: flex;
      padding: 60px 20px 0;
      justify-content: space-around;
      .item_item {
        width: 150px;
        height: 150px;
        border: 1px solid #ccc;
        border-radius: 6px;
        position: relative;
        .tag {
          position: absolute;
          top: -15px;
          display: inline-block;
          padding: 2px 15px;
          border-radius: 150px 0 150px 0 / 150px 0 150px 0;
          // height: 30px;
          background-color: #ff6600;
          color: #fff;
        }
        h3 {
          font-size: 18px;
          font-weight: 700;
          margin-top: 25px;
          text-align: center;
        }
        p {
          text-align: center;
          font-size: 12px;
          &.money {
            font-size: 16px;
            font-weight: 700;
            color: #ff9933;
          }
          &.money1 {
            text-decoration: line-through #ff9933;
          }
        }
        .line {
          background-color: #ff6600;
          color: #fff;
          line-height: 30px;
          text-align: center;
          position: absolute;
          bottom: 0;
          width: 100%;
        }
      }
      .opc {
        opacity: 0.5;
      }
      .bdj {
        border: 1px solid #ff6600;
      }
    }
    .paytype {
      text-align: center;
      padding-top: 30px;
    }
  }
}
</style>
