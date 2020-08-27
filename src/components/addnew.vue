<template>
  <div class="orderAddView">
    <div class="leftView">
      <div class="topView">
        <div class="switchView">
          <button class="btn-audio" :class="{select:id==1}" @click="id=1;getXMcate()">选择项目</button>|
          <button class="btn-audio" :class="{select:id==2}" @click="id=2;getCPcate()">选择产品</button>|
          <button class="btn-audio" :class="{select:id==3}" @click="id=3">选择预约</button>
        </div>
        <button class="btn-back btn-audio" @click="$emit('close')"></button>
      </div>

      <div class="orderAddBoxView" v-show="id!=3">
        <div class="headerView">
          <div class="btnView" v-show="id!=3">
            <!-- <i class="el-icon-search" @click="showSearch = !showSearch;getXMlist()"></i> -->
            <div class="keywordView">
              <div class="inputView">
                <input placeholder="请输入编号或者名称查询" v-model="keyword" />
                <button class="btn-audio btn-search" @click="getXMlist">搜索</button>
              </div>
            </div>
          </div>
          <div id="categoryView" class="collView listView" style="height: 44px;">
            <div class="line">
              <div class="categoryItem btn-audio" v-for="(v,k) in catelist" :key="k">
                <label :class="{select:active==v.id}" @click="changeActive(v.id)">
                  {{v.title}}
                  <i
                    class="el-icon-remove-outline"
                    @click.stop="delActive(v.id)"
                    style="color:red"
                    v-show="delcate&&v.storeid!=0"
                  ></i>
                </label>
              </div>
            </div>
            <div class="categoryItem itemadd" v-if="!delcate">
              <label @click="addcate=true">
                <i class="el-icon-circle-plus-outline"></i>
                添加
              </label>
              <label style="margin-left:10px" @click="delcate=true">
                <i class="el-icon-remove-outline"></i> 删除
              </label>
            </div>
            <div class="categoryItem itemadd" v-else>
              <label @click="delcate=false">完成</label>
            </div>
          </div>
        </div>
        <div class="bview">
          <div class="boxView listView">
            <div
              class="serviceItem boxItem btn-audio"
              v-for="(v,k) in XMlist"
              :key="k"
              @click="openworker(v,'',1)"
            >
              <div
                class="nameView"
                :style="`background:url('http://hb.rgoo.com${v.img?v.img:'/upload/shop/moren.jpg'}') no-repeat 0 0 /100% 100%;`"
              ></div>
              <div class="priceView">{{id==1?v.name:v.goods_name}}</div>
              <div class="priceView">￥{{v.price}}</div>
            </div>
          </div>
          <div class="boxView listView" v-show="member">
            <p style="color:#dc670b">已购买次卡</p>
            <el-table
              :data="cikalist"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%"
              height="90%"
              @row-click="choosecika"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column property="itemname" label="名称" width="120"></el-table-column>
              <el-table-column label="卡类型">
                <template slot-scope="scope">{{scope.row.typeid|type}}</template>
              </el-table-column>
              <el-table-column property="first_count" label="购买次数"></el-table-column>
              <el-table-column property="address" label="使用次数">
                <template slot-scope="scope">{{scope.row.first_count-scope.row.rest_count}}</template>
              </el-table-column>
              <el-table-column property="rest_count" label="剩余次数"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div id="order-resListView" v-show="id==3">
        <div class="listView">
          <div class="groupItem">
            <div class="dateView">
              {{(new Date)|time('y-m-d')}}
              <span>今天</span>
            </div>
            <div class="tipView" v-show="!yuyuelist.length">没有可开单的预约哟~</div>
            <div
              class="resItem btn-audio"
              v-for="(v,k) in yuyuelist"
              :key="k"
              :class="{select:yyitem.id==v.id}"
              @click="changeyyitem(v)"
              v-show="v.status==0||v.status==3"
            >
              <div class="timeView">
                <label>{{v.yytime.split(' ')[1]}}</label>
              </div>
              <div class="empView">
                <div class="textView">
                  <div class="nameView overflowText">{{v.name}}</div>
                  <div class="jobView overflowText">{{v.mobile}}</div>
                </div>
              </div>
              <div class="resTagView overflowText">
                <label class="label-resLen">
                  <span>1小时</span>
                </label>&nbsp;
                <label class="label-tags">{{v.itemname}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="bView">
          <button class="btn-audio btn-notUse" @click="delyyItem">不使用</button>
        </div>
      </div>
    </div>
    <div id="orderInfoView" style="width: 500px;">
      <div class="bcView">
        <div class="topView">
          <div class="tView">单据</div>
          <div class="cardThumbView btn-audio" v-show="member">
            <div class="avartView">
              <img :src="member.img|imgUrl" />
            </div>
            <div class="textView">{{member.name}}</div>
            <button class="btn-del btn-audio" @click="clearMember"></button>
          </div>
          <div class="sexView">
            <button class="btn-female" :class="{select:male=='female'}"></button>
            <button class="btn-male" :class="{select:male=='male'}"></button>
          </div>
          <div class="normalView" v-show="!member">
            <button class="btn-selectVip" @click="getList();memberView=true">选择会员</button>
          </div>
          <!-- <button class="btn-audio btn-more"></button> -->
        </div>
        <div class="listView" style="margin-top: -20px;">
          <div class="subItem serviceItem btn-audio" v-for="(v,k) in chooslist" :key="k">
            <div class="tView">
              <div class="nameView overflowText">
                <span>{{v.itemname}}</span>
                &nbsp;x{{v.num}}
              </div>
              <i
                style="color:#EDB339;height:20px;line-height: 16px;padding:2px 6px;border-radius:3px;margin-right:10px;font-size:13px;margin-top:10px;background:#876c37;"
                v-show="v.discount&&v.discount!=1&&v.is_usecard!=1"
              >折扣 {{v.discount}}</i>
              <i
                style="color:orange;margin-right:10px"
                @click="toEditPrice(v,k)"
                v-show="v.is_usecard!=1"
              >修改价格</i>
              <div class="priceView">￥&nbsp;{{(Number(v.price)*v.num*v.discount).toFixed(2)}}</div>
            </div>
            <div class="empView">
              <div class="empItem" v-show="!v.worker&&v.typeid!=2">
                <label
                  class="label-name"
                  style="color: rgb(255, 94, 86);"
                  @click="openworker(v,k,2)"
                >未设置服务人员</label>
              </div>
              <div class="empItem" v-show="v.worker">
                <img :src="v.worker.avatar?v.worker.avatar:'/upload/shop/moren.jpg'|imgUrl" />
                <label
                  class="label-name overflowText"
                  @click="openworker(v,k,2)"
                >{{v.worker.name}}（No：{{v.worker.job_no}}）</label>
                <label class="label-job overflowText">服务人员</label>
              </div>
            </div>
            <button class="btn-del" @click="delchooselist(v,k)"></button>
          </div>
        </div>
        <div class="remarkView">
          <div
            class="overflowText tipView"
            @click="showMemo=true"
            :class="{col000:memo}"
          >{{memo?memo:'单据备注'}}</div>
        </div>
      </div>
      <div class="bottomView">
        <button class="btn-audio btn-black btn-save" @click="submit(1)">挂单</button>
        <button class="btn-audio btn-save" @click="modifytotalPrice">
          <i class="iconfont icon-edit1-act" style="color:orange;margin-right:5px"></i>
          优惠总价￥{{newprice?newprice:sumprice}}
        </button>
        <button
          class="btn-audio btn-red btn-checkout"
          @click="submit(2)"
        >结账&nbsp;&nbsp;￥&nbsp;{{sumprice}}</button>
      </div>
    </div>
    <el-dialog
      :visible.sync="memberView"
      width="70%"
      :before-close="handleClose"
      :append-to-body="true"
      title="选择会员"
      center
    >
      <div
        class="searchResView"
        style="background: linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%)"
      >
        <div class="topSearchView">
          <div class="inputView">
            <el-select v-model="type" placeholder="请选择">
              <el-option label="号码" value="号码"></el-option>
              <el-option label="姓名" value="姓名"></el-option>
            </el-select>
            <input placeholder="请输入手机号或会员卡号" v-model="keyword" />
            <button class="btn-close btn-audio" @click="keyword=''"></button>
          </div>
          <button class="btn-audio" :class="{search:keyword}">查询</button>
        </div>
        <el-table :data="tableData" style="width: 100%" height="400px" @row-click="choosMember">
          <el-table-column prop="address">
            <template slot-scope="scope">
              <img :src="scope.row.img|imgUrl" alt style="width:80px" />
            </template>
          </el-table-column>
          <el-table-column prop="account" label="卡号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="cardtype" label="卡类型"></el-table-column>
          <el-table-column prop="balance" label="储值余额"></el-table-column>
          <!-- <el-table-column prop="expiry_date" label="有效期"></el-table-column> -->
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="添加分类" :visible.sync="addcate" width="30%" :modal-append-to-body="false">
      <div style="padding:20px">
        <el-input v-model="newcate"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcate = false">取 消</el-button>
        <el-button @click="submitadd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改价格"
      :visible.sync="editDialog"
      width="40%"
      :modal-append-to-body="false"
      center
      custom-class="quickmoney"
    >
      <div style="padding:20px">
        <div style="display:flex;margin-bottom:35px">
          <span style="width:80px">原价：</span>
          <span>{{editprice}}</span>
        </div>
        <div style="display:flex;margin-bottom:20px">
          <span style="width:80px">折扣：</span>
          <el-input v-model="editdiscount" placeholder="0~1"></el-input>
        </div>
        <div style="display:flex">
          <span style="width:80px">折后价：</span>
          <el-input v-model="editdisprice" @input="changeDisprice"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyPrice">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备注"
      :visible.sync="showMemo"
      width="430px"
      center
      custom-class="quickmoney"
      :modal-append-to-body="false"
    >
      <!-- <div class="customerTypeView">
        <el-radio v-model="radio" label="1">老客</el-radio>
        <el-radio v-model="radio" label="2">新客</el-radio>
      </div>
      <div class="customerSourceView">
        客户来源：
        <el-select v-model="laiyuan" placeholder="请选择">
          <el-option label="默认" value="默认"></el-option>
          <el-option label="朋友介绍" value="朋友介绍"></el-option>
          <el-option label="广告传单" value="广告传单"></el-option>
          <el-option label="电视广告" value="电视广告"></el-option>
        </el-select>
        <el-checkbox v-model="checked" style="margin-left:8px">不计客数</el-checkbox>
      </div>-->
      <div class="textView">
        <textarea placeholder="填写备注" maxlength="500" v-model="memo"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="showMemo = false"
          style="background-color:#dc670b;color:#fff;padding:10px"
        >保 存</el-button>
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

    <div class="set_page" :class="{activePage:page}">
      <closeBook @close="page=false;" :bookinfo="bookinfo" v-if="page"></closeBook>
    </div>
  </div>
</template>

<script>
import closeBook from '@/components/closeBook.vue'
import chooseworker from '@/components/choosmember.vue'
import moment from 'moment'
import qs from 'qs'
import { userInfo } from 'os';
export default {
  components: { chooseworker, closeBook },
  props: ['info', 'from'],
  data () {
    return {
      member: '',
      newcate: '',
      type: '号码',
      laiyuan: '',
      radio: '1',
      keyword: '',
      setnum: false,
      CPnum: '1',
      memo: '',
      checked: false,
      memberView: false,
      id: 1,
      storeid: sessionStorage.getItem('storeid'),
      showMemo: false,
      showworker: false,
      addcate: false,
      delcate: false,
      XMlist: [],
      male: 'female',
      active: '1',
      catelist: [],
      chooslist: [],
      showSearch: false,
      cikalist: [],
      setinfo: '',
      additem: '',
      yuyuelist: [],
      tableData: [],
      yyitem: '',
      page: false,
      editDialog: false,
      editprice: '',
      editIndex: '',
      editdiscount: '',
      editdisprice: '',
      bookinfo: '',
      newprice: '',
      ModifyW: ''
    }
  },
  watch: {
    id (val) {
      if (val == 3) {
        this.checkyuyue()
      }
    },
    sumprice (val) {
      if (val == 0) {
        this.newprice = 0
      }
    },
    member (val, oldValue) {
      console.log(val, oldValue)
      if (val) {
        this.getInfo(val.member_id)
        this.getcicardInfo()
        this.getmembercount()
        if (val.sex == 1) {
          this.male = 'male'
        } else {
          this.male = 'female'
        }
      } else {
        this.yyitem = ''
        this.male = ''
        // this.chooslist.forEach(item => item.discount = 1)
        this.chooslist = []
      }
    },
    editdiscount (val) {
      this.editdisprice = this.editprice * val
    },
    // editdisprice (val) {
    //   this.editdiscount = this.editprice / val
    // },
    yyitem (val) {
      this.chooslist = this.chooslist.filter(item => item.typeid != 3)
      if (val != '') {
        let item = {
          worker: val.worker,
          typeid: 3,
          itemid: val.id,
          num: 1,
          itemname: val.itemname,
          staff1: val.staffid,
          price: val.price,
          subtotal: val.price,
          is_usecard: 0,
          discount: val.discount
        }
        this.chooslist.push(item)
      }
    }
  },
  computed: {
    sumprice () {
      let sum = 0
      this.chooslist.forEach(item => {
        sum += Number(item.price) * Number(item.num) * item.discount
      })
      return sum.toFixed(2)
    }
  },
  methods: {
    //挂单
    confirmDiscount (status) {
      if (!this.chooslist.length) return this.$message.error('请至少选择一个项目或产品')
      this.$prompt('', '修改优惠后总价', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定修改',
        cancelButtonText: '不修改，直接保存',
        inputValue: this.newprice ? this.newprice : this.sumprice,
        inputPattern: /^[0-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(({ value }) => {
        this.newprice = value
        this.submit(status)
      }).catch(action => {
        action === 'cancel'
          ? this.submit(status)
          : this.$message('留在当前页面')
      })
    },
    toEditPrice (v, k) {
      this.editDialog = true
      this.editIndex = k
      this.editprice = v.price
      this.editdiscount = v.discount
      // this.editdisprice = v.price * v.discount
    },
    changeDisprice () {
      this.editdiscount = this.editdisprice / this.editprice
    },
    modifyPrice () {
      this.chooslist.forEach((item, idx) => {
        if (idx == this.editIndex) {
          // item.price = this.editdisprice
          item.discount = Number(this.editdiscount)
          item.subtotal = Number(this.editdisprice) * Number(item.num)
        }
      })
      this.editDialog = false
    },
    async submit (status) {
      if (!this.chooslist.length) return this.$message.error('请至少选择一个项目或产品')
      if (this.from == 'car') {
        sessionStorage.removeItem('carlist')
      }
      let type = 1
      let id = 0
      if (this.info || this.bookinfo) {
        type = 2
        id = this.info ? this.info.id : this.bookinfo.id
      }
      this.chooslist.forEach(item => {
        item['discount_price'] = Number(item.price) * item.discount * item.num
        item['subtotal'] = Number(item.price) * item.discount * item.num
      })
      let obj = {
        storeid: this.storeid,
        customer_type: this.member ? '2' : '1',
        status: 1,
        total: this.sumprice,
        remark: this.memo,
        member_id: this.member ? this.member.member_id : 0,
        orderinfo: this.chooslist,
        type: type,
        id: id,
        dis_total: this.newprice ? this.newprice : this.sumprice
      }
      let data = qs.stringify(obj)
      console.log(obj)
      const res = await this.$axios.post('/api?datatype=insert_order', data)
      if (res.data.code == 1) {
        if (status == 1) {
          this.$emit('close')
        } else {
          this.$set(res.data.data, 'orderinfo', this.chooslist)
          this.bookinfo = res.data.data
          // this.info = res.data.data
          this.page = true
        }
      }
    },
    async getInfo (id) {
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
      }
    },
    async getmembercount () {
      const res = await this.$axios.get('/api?datatype=get_member_discount', {
        params: {
          storeid: this.storeid,
          member_id: this.member.member_id
        }
      })
      if (res.data.code == 1) {
        this.member = Object.assign(this.member, res.data.data)
        if (this.yyitem) {
          this.yyitem.discount = Number(this.member.item_discount) / 10
        }
        if (this.chooslist.length) {
          this.chooslist.forEach(item => {
            if (item.discount == 1) {
              if (item.typeid == 2) {
                item.discount = Number(this.member.goods_discount) / 10
              } else {
                item.discount = Number(this.member.item_discount) / 10
              }
            }
          })
        }
      }
    },
    async getcicardInfo () {
      const res = await this.$axios.get('/api?datatype=get_card_memberitem', {
        params: {
          storeid: this.storeid,
          member_id: this.member.member_id,
          sign: 1
        }
      })
      if (res.data.code == 1) {
        this.cikalist = res.data.data
      }
    },
    // 修改chooslist某一个单价
    modifyOnePrice (v, k) {
      this.$prompt('', '请输入单价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(({ value }) => {
        this.chooslist.forEach((item, idx) => {
          if (idx == k) {
            item.price = value
            item.subtotal = Number(item.price) * Number(item.num)
          }
        })
      })
    },
    choosecika (data) {
      if (data.typeid != 1) return this.setcika(1, data)
      this.$prompt('', '请输入项目使用次数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]+$/,
        inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '次数错误或超出'
      }).then(({ value }) => {
        this.setcika(value, data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消使用'
        });
      });
    },
    setcika (value, v) {
      let obj = {
        worker: '',
        is_usecard: 1,
        typeid: 1,
        itemid: v.id,
        num: value,
        itemname: v.itemname,
        price: 0,
        cikaid: v.id,
        subtotal: 0,
        discount: Number(this.member.item_discount) / 10,
        maxNum: v.typeid == 1 ? v.rest_count : ''
      }
      this.chooslist = this.chooslist.filter(item => !item.cikaid || item.cikaid != v.id)
      this.chooslist.push(obj)
    },
    async checkyuyue () {
      const res = await this.$axios.get('/api?datatype=get_yylist', {
        params: {
          storeid: this.storeid,
          time: moment(new Date).format('YYYY-MM-DD')
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.yuyuelist = res.data.data
      } else {
        this.yuyuelist = []
      }
    },
    delyyItem () {
      this.yyitem = ''
      this.$message('已取消关联预约')
    },
    changemale (data) {
      if (!this.member) {

      }
    },
    clearMember () {
      this.$confirm('移除会员将取消该会员关联项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.member = ''
        this.$message('已取消关联预约')
      })
    },
    changeyyitem (v) {
      if (this.yyitem && v.id != this.yyitem.id) {
        this.$message('更换关联预约，将移除已选预约项目')
      }
      if (v.member_id != 0) {
        // if (!this.member || this.member.member_id != v.member_id) {
        this.member = this.tableData.find(item => item.member_id == v.member_id)
        this.$set(v, 'discount', 1)
        let workerlist = JSON.parse(sessionStorage.getItem('workerlist'))
        let worker = workerlist.find(j => j.id == v.staffid)
        this.yyitem = JSON.parse(JSON.stringify(v))
        this.$set(this.yyitem, 'worker', worker)
        // }
      } else {
        if (this.member) {
          this.$confirm('确定将此预约关联到当前会员吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$set(v, 'discount', Number(this.member.item_discount) / 10)
            let workerlist = JSON.parse(sessionStorage.getItem('workerlist'))
            let worker = workerlist.find(j => j.id == v.staffid)
            this.yyitem = JSON.parse(JSON.stringify(v))
            this.$set(this.yyitem, 'worker', worker)
          })
        } else {
          this.$set(v, 'discount', 1)
          let workerlist = JSON.parse(sessionStorage.getItem('workerlist'))
          let worker = workerlist.find(j => j.id == v.staffid)
          this.yyitem = JSON.parse(JSON.stringify(v))
          this.$set(this.yyitem, 'worker', worker)
        }
      }
    },
    changeyyPrice () {
      this.$prompt('', '请输入单价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(({ value }) => {
        this.yyitem.price = value
      })
    },
    setdata (data) {
      if (this.ModifyW != null) {
        this.chooslist.forEach((v, k) => {
          if (k == this.ModifyW) {
            v.num = data.num
            if (data.choose.gong) {
              v.worker = data.choose.gong
              v.staff1 = data.choose.gong.id
            }
          }
        })
      } else {
        this.addchooselist(this.additem, data.choose, data.num)
      }
      this.showworker = false
    },
    // 打开
    openworker (v, k, sign) {
      console.log(v)
      if (sign == 2) {
        this.ModifyW = k
        let worker = ''
        let option = {
          title: v.itemname,
          serverfor: this.member ? this.member.name : '客B',
          money: v.price,
          worker: v,
          num: v.num,
          maxNum: v.maxNum ? v.maxNum : ''
        }
        this.setinfo = option
        this.showworker = true
      } else {
        this.additem = v
        this.ModifyW = null
        if (this.id == 1) {
          console.log(v)
          let option = {
            title: v.name,
            serverfor: this.member ? this.member.name : '客B',
            money: v.price,
            num: 1
          }
          this.setinfo = option
          this.showworker = true
        } else {
          this.CPnum = 1
          // this.setnum = true
          this.$set(this.additem, 'name', this.additem.goods_name)
          this.$prompt('', '请输入产品数量', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: 1,
            inputPattern: /^[0-9]+$/,
            // inputValidator: (val) => { return Number(val) <= Number(v.number) },
            inputErrorMessage: '格式错误'
          }).then(({ value }) => {
            this.addchooselist(v, '', value)
          })
        }
      }

    },
    changeActive (id) {
      if (this.delcate) {
        return
      } else {
        this.active = id
        this.getXMlist()
      }
    },
    delActive (id) {
      this.$alert('确认删除此分类吗', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.submitdel(id)
        }
      })
    },
    //  选择次卡
    handleCurrentChange (val) {
      this.currentRow = val
    },
    //关闭会员弹窗
    handleClose () {
      this.memberView = false
    },
    // 获取XMlist
    async getXMlist () {
      let url
      if (this.id == 1) {
        url = '/api?datatype=get_item_list'
      } else if (this.id == 2) {
        url = '/api?datatype=get_skulist'
      }
      const res = await this.$axios.get(url, {
        params: {
          storeid: this.storeid,
          status: 1,
          type: this.id == 2 ? 1 : null,
          cate: this.active,
          search: this.keyword
        }
      })

      console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
      } else {
        if (this.showSearch) {
          this.$message.error('未搜索到该分类下项目或产品')
          this.keyword = ''
        }
        this.XMlist = []
      }
    },
    // 获取项目分类
    async getXMcate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate&storeid=' + this.storeid)
      console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
      this.getXMlist()
    },
    // 获取产品分类
    async getCPcate () {
      const res = await this.$axios.get('/api?datatype=get_goodscate&storeid=' + this.storeid)
      console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
      this.getXMlist()
    },
    choosMember (row) {
      this.member = row
      this.memberView = false
    },
    //总优惠价
    modifytotalPrice () {
      this.$prompt('', '请输入优惠总价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*(.\d{1,2})?$/,
        // inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
        inputErrorMessage: '价格为整数或最多保留2位小数'
      }).then(({ value }) => {
        this.newprice = value
      })
    },
    async submitadd () {
      if (!this.newcate) return this.$message.error('请输入类名')
      let url
      if (this.id == 1) {
        url = '/api?datatype=insert_itemcate'
      } else if (this.id == 2) {
        url = '/api?datatype=insert_goodscate'
      }

      const res = await this.$axios.get(url, {
        params: {
          storeid: this.storeid,
          title: this.newcate
        }
      })

      console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.addcate = false
        if (this.id == 1) {
          this.getXMcate()
        } else if (this.id == 2) {
          this.getCPcate()
        }
      }
    },
    async submitdel (id) {
      let url
      if (this.id == 1) {
        url = '/api?datatype=del_itemcate'
      } else if (this.id == 2) {
        url = '/api?datatype=del_goodscate'
      }

      const res = await this.$axios.get(url, {
        params: {
          id: id
        }
      })

      console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        if (this.id == 1) {
          this.getXMcate()
        } else if (this.id == 2) {
          this.getCPcate()
        }
      }
      if (res.data.code == 2) {
        this.$message.error(res.data.msg)
      }
    },
    // 添加到右侧
    addchooselist (v, data, num) {
      console.log(v, data)
      if (data) {
        if (data.gong) {
          this.$set(v, 'staff1', data.id)
        }
        this.$set(v, 'typeid', 1)
        if (this.member) {
          this.$set(v, 'discount', Number(this.member.item_discount) / 10)
        } else {
          this.$set(v, 'discount', 1)
        }
        this.$set(v, 'goods_id', v.id)
      } else {
        this.$set(v, 'typeid', 2)
        if (this.member) {
          this.$set(v, 'discount', Number(this.member.goods_discount) / 10)
        } else {
          this.$set(v, 'discount', 1)
        }
      }
      console.log(v)
      let obj = {
        worker: data ? data.gong : '',
        typeid: v.typeid,
        itemid: v.goods_id,
        num: num,
        itemname: v.name,
        staff1: v.staff1 ? v.staff1 : 0,
        price: Number(v.price),
        subtotal: num * Number(v.price),
        is_usecard: 0,
        discount: v.discount
      }
      if (obj.typeid == 2) {
        this.chooslist = this.chooslist.filter(k => k.typeid != 2 || (k.typeid == 2 && k.itemid != obj.itemid))
      }
      this.chooslist.push(obj)
    },
    delchooselist (v, k) {
      this.chooslist.splice(k, 1)
      if (v.typeid == 3) {
        this.yyitem = ''
      }
    },
    async getList (sign) {
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: this.storeid,
          search: this.keyword
        }
      })
      console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
        if (this.info && sign == 1) {
          if (this.info.member_id != 0) {
            this.member = this.tableData.find(item => item.member_id == this.info.member_id)
          }
          this.newprice = this.info.dis_total
          this.memo = this.info.remark
          let workerlist = JSON.parse(sessionStorage.getItem('workerlist'))
          if (this.info.orderinfo != 'null') {
            this.info.orderinfo.forEach(v => {
              if (v.staff1 != 0) {
                v['worker'] = workerlist.find(item => item.id == v.staff1)
              } else {
                v['worker'] = ''
              }
            })
            this.chooslist = this.info.orderinfo
            this.chooslist.forEach(item => {
              if (!item.discount) {
                if (this.member) {
                  if (item.typeid == 2) {
                    this.$set(item, 'discount', Number(this.member.goods_discount) / 10)
                  } else {
                    this.$set(item, 'discount', Number(this.member.item_discount) / 10)
                  }
                } else {
                  this.$set(item, 'discount', 1)
                }
              }
            })
          }
        }
      }
    }
  },
  filters: {
    type (val) {
      switch (val) {
        case '1':
          return '次卡';
        case '2':
          return '月卡';
        case '3':
          return '季卡';
        case '4':
          return '年卡';
      }
    }
  },
  created () {
    if (this.from == 'car') {
      let arr = JSON.parse(sessionStorage.getItem('carlist'))
      this.chooslist = arr
    }
    console.log(this.info)
    this.getXMcate()
    this.getList(1)
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
.orderAddView {
  display: flex;
  height: 100%;

  // button {
  //   background: transparent;
  //   border: none;
  //   outline: none;
  //   box-sizing: border-box;
  //   cursor: pointer;
  //   padding: 0;
  // }
  .btn-back {
    width: 40px;
    height: 40px;
    background-image: url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NavBack.png);
    background-position: left center;
    background-size: 28px;
    background-repeat: no-repeat;
    position: absolute;
    top: 25px;
    left: 15px;
  }
  .leftView {
    width: 100%;
    height: 100%;
    padding-right: 500px;
    .topView {
      position: relative;
      background: #fff;
      padding: 25px 0 15px 78px;

      .switchView {
        display: inline-flex;
        height: 40px;
        button {
          display: flex;
          font-size: 16px;
          color: #5a5a5a;
          vertical-align: middle;
          padding: 0 20px;
          text-align: center;
          line-height: 40px;
        }
        button.select {
          font-size: 20px;
          color: #dc670b;
        }
      }
      .btn-back {
        width: 40px;
        height: 40px;
        background-image: url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NavBack.png);
        background-position: left center;
        background-size: 28px;
        background-repeat: no-repeat;
        position: absolute;
        top: 25px;
        left: 15px;
      }
    }

    .orderAddBoxView {
      position: relative;
      // background: #f4f4f4;
      height: calc(100% - 85px);
      .headerView {
        position: relative;
        background: #fff;
        padding: 0 15px 15px 15px;
        z-index: 10;
        // overflow-x: scroll;
        #categoryView {
          position: relative;
          height: 44px;
          line-height: 44px;
          padding: 0 130px 0 10px;
          transition: transform 0.7s, background 0.7s, height 0.7s;
          border-radius: 5px;
          background: #f8f8f8;
          .line {
            overflow-y: hidden;
            overflow-x: scroll;
            display: flex;
            flex-wrap: nowrap;
          }
          .categoryItem {
            text-align: center;
            padding: 0 18px;
            height: 44px;
            color: #5a5a5a;
            &.itemadd {
              position: absolute;
              right: 0;
              top: 0;
              color: #dc670b;
            }
            label.select {
              color: #47bf7c;
            }
            label {
              display: inline-block;
              height: 32px;
              min-width: 30px;
              box-sizing: border-box;
              line-height: 32px;
              font-size: 15px;
              cursor: pointer;
            }
          }
        }
      }
      .bview {
        height: calc(100% - 109px);
        display: flex;
        flex-direction: column;
        .boxView {
          flex: 1;
          position: relative;
          background: #fff;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 5px 18px 25px 18px;
          .boxItem {
            position: relative;
            float: left;
            width: 136px;
            height: 128px;
            background: #f8f8f8;
            border-radius: 6px;
            text-align: center;
            margin: 0 15px 15px 0;
            box-shadow: 0 2px 2px 1px #ddd;
            .nameView {
              height: 71px;
              font-size: 15px;
              color: #28282d;
              line-height: 20px;
              padding: 23px 5px 0 5px;
              overflow: hidden;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
            }
            .priceView {
              height: 28px;
              overflow: hidden;
              line-height: 28px;
              background: #f4f4f4;
              color: #28282d;
              font-size: 16px;
              border-bottom-left-radius: 6px;
              border-bottom-right-radius: 6px;
            }
          }
        }
      }
      .filterView {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: 1s;
        .contentView {
          position: absolute;
          top: 62px;
          right: 15px;
          width: 560px;
          height: 582px;
          background: #fff;
          overflow-x: hidden;
          overflow-y: auto;
          border-radius: 6px;
          padding: 0 15px 20px 15px;
          box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
          }
          .listView {
            overflow: hidden;
          }
          .listItem {
            float: left;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #28282d;
            text-align: center;
            border: 0.5px solid #ddd;
            border-radius: 5px;
            width: 120px;
            margin-right: 11px;
            margin-bottom: 11px;
          }
          .listItem:nth-child(4n + 4) {
            margin-right: 0;
          }
          .select {
            background: #47bf7c;
            color: #fff;
            border: 0.5px solid #47bf7c;
          }
          .firstLetterFilterView {
            .listItem {
              width: 56px;
              margin-right: 9px;
            }
          }
          .btnView {
            text-align: center;
            button {
              width: 135px;
              height: 42px;
              line-height: 42px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 15px;
              color: #28282d;
              margin: 0 8px;
            }
            button.btn-comp {
              background: #28282d;
              color: #fff;
            }
          }
        }
      }
      .turnLeft {
        left: 100%;
        opacity: 0;
      }
    }
  }

  .btnView {
    top: 25px;
    right: 15px;
    height: 50px;
    width: 100%;
    .keywordView {
      height: 44px;
      .inputView {
        position: relative;
        background: #f4f4f4
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Search.png)
          8px center / 24px no-repeat;
        line-height: 44px;
        border-radius: 6px;
        padding: 0 60px 0 38px;
        overflow: hidden;
        button {
          position: absolute;
          top: 0;
          right: 0;
          background: #28282d;
          font-size: 14px;
          color: #fff;
          text-align: center;
          width: 60px;
          line-height: 44px;
          height: 44px;
          padding: 0;
        }
        input {
          border: none;
          display: block;
          width: 100%;
          height: 44px;
          line-height: 30px;
          padding: 12px 0;
          font-size: 14px;
          color: #28282d;
          background: transparent;
        }
      }
    }
    // i {
    //   font-size: 28px;
    //   padding: 10px;
    //   vertical-align: top;
    // }
  }
  #orderInfoView {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background: #fff;
    z-index: 10;
    padding: 20px 10px 0 0;
    box-sizing: border-box;
    .bcView {
      background: #f8f8f8;
      height: calc(100% - 58px);
      .topView {
        position: relative;
        background-image: linear-gradient(180deg, #474747 0%, #242424 100%);
        box-shadow: inset 1px 1px 1px 0 rgba(135, 135, 135, 0.5);
        border-radius: 6px 6px 0 0;
        height: 84px;
        padding: 7px 10px 0 10px;
        div {
          display: inline-block;
          vertical-align: top;
        }
        .cardThumbView {
          width: 168px;
          display: inline-flex;
          background: #d6c361
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_VIP_Small.png)
            90% center / 82px no-repeat;
          height: 40px;
          border-radius: 6px;
          padding: 0 6px;
          cursor: pointer;
          margin-right: 5px;
          .avartView {
            margin: 6px 8px 6px 0;
            width: 28px;
            height: 28px;
            line-height: 28px;
            border: 0.5px solid #fff;
            border-radius: 50%;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .textView {
            flex: 1;
            padding: 10px 0;
            color: #604e2a;
            font-size: 14px;
            line-height: 20px;
            font-family: PingFangSC-Medium;
          }
          .btn-del {
            min-width: 36px;
            width: 36px;
            height: 40px;
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_VipDel.png)
              center / 28px no-repeat;
          }
        }
        .tView {
          min-width: 60px;
          height: 40px;
          line-height: 40px;
          font-size: 20px;
          color: #fff;
          vertical-align: top;
        }
        .sexView {
          width: 100px;
          display: inline-flex;
          .btn-female {
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Female_N.png)
              center / 30px no-repeat;
          }
          .btn-male {
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Male_N.png)
              center / 30px no-repeat;
          }
          .btn-female.select {
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Female_S.png)
              center / 30px no-repeat;
          }
          .btn-male.select {
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Male_S.png)
              center / 30px no-repeat;
          }
          button {
            width: 40px;
            height: 40px;
          }
        }
        .normalView {
          width: 100px;
          display: inline-flex;

          .btn-selectVip {
            width: 100px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1)
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_OrderItemVipFlag.png)
              5px center / 28px no-repeat;
            border-radius: 6px;
            color: #fff;
            font-size: 14px;
            padding-left: 34px;
            text-align: left;
          }
        }
        .btn-more {
          position: absolute;
          top: 7px;
          right: 10px;
          width: 40px;
          height: 40px;
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_More_White.png)
            right center / 28px no-repeat;
        }
      }
      .listView {
        padding: 0 10px 35px 10px;
        height: calc(100% - 128px);
        margin-top: -20px;
        overflow-x: hidden;
        overflow-y: auto;
        .subItem {
          position: relative;
          margin-bottom: 10px;
          background: #fff;
          border-radius: 6px;
          padding: 0 10px 10px 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .tView {
            display: flex;
            line-height: 40px;
            font-size: 15px;
            padding-right: 23px;
            .nameView {
              flex: 2;
              color: #8a8a8a;
            }
          }
          .empView {
            padding: 2px 10px;
            background: #f8f8f8;
            border-radius: 3px;
            .empItem {
              display: flex;
              padding: 2px 0;
              line-height: 24px;
              font-size: 13px;
              color: #8a8a8a;
              img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 1px solid #fff;
                margin-right: 10px;
              }
              .label-name {
                flex: 1.5;
                color: #5a5a5a;
              }
              .label-job {
                flex: 1;
                text-align: right;
                color: #28282d;
              }
            }
          }
          .btn-del {
            position: absolute;
            top: 0;
            right: 0;
            width: 28px;
            height: 28px;
            background: transparent
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_ServiceDel.png)
              right top / 28px no-repeat;
          }
        }
      }
      .remarkView {
        div {
          padding: 12px 12px 12px 35px;
          line-height: 20px;
          border-radius: 5px;
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Gray.png)
            8px center / 24px no-repeat;
          font-size: 14px;
          color: #28282d;
        }
        padding: 10px;
        & > div.tipView {
          color: #ccc;
        }
        & > div.col000 {
          color: #000;
        }
      }
    }
    .bottomView {
      position: absolute;
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;

      .btn-red {
        flex: 2;
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        background: #f44e4e;
        border-radius: 5px;
        font-size: 15px;
        color: #fff;
      }
      .btn-save,
      .btn-checkout {
        flex: 2;
        height: 58px;
        font-size: 15px;
        border-radius: 0;
      }
      .btn-black {
        flex: 1;
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        background: #28282d;
        // border-radius: 5px;
        font-size: 15px;
        color: #fff;
        height: 58px;
      }
    }
  }
  #order-resListView {
    position: relative;
    height: calc(100% - 80px);
    // background: rebeccapurple;
    .listView {
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 60px);
      .groupItem {
        .dateView {
          padding: 0 15px;
          background: #f4f4f4;
          line-height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #28282d;
        }
        .resItem {
          display: flex;
          padding: 10px 15px;
          background: #fff;
          color: #28282d;
          cursor: pointer;
          .timeView {
            font-size: 14px;
            line-height: 44px;
            width: 80px;
            min-width: 13px;
            border-right: 2px solid #47bf7c;
            padding-right: 10px;
            text-align: center;
            font-family: DINAlternate-Bold;
          }
          &.select > .resTagView {
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_R_Green.png)
              right center / 28px no-repeat;
          }
          .empView {
            display: flex;
            flex: 1;
            margin-left: 10px;
            max-width: 130px;
            width: 130px;
            .textView {
              flex: 1;
              margin-left: 10px;
              padding: 4px 0;
              max-width: 130px;
              .nameView {
                line-height: 20px;
                font-size: 14px;
              }
              .jobView {
                line-height: 20px;
                font-size: 12px;
                color: #8a8a8a;
              }
            }
          }
          .resTagView {
            flex: 2;
            margin-left: 15px;
            line-height: 44px;
            font-size: 14px;
            padding-right: 30px;
            .label-resLen {
              color: #47bf7c;
            }
            .label-tags {
              color: #28282d;
            }
          }
        }
        .tipView {
          padding: 30px;
          width: 100%;
          text-align: center;
        }
      }
    }
    .bView {
      background: #fff;
      text-align: center;
      padding: 10px 0;
      button {
        width: 90px;
        height: 40px;
        border-radius: 6px;
        font-size: 15px;
        color: #28282d;
        background: #f4f4f4;
        overflow: hidden;
      }
    }
  }
  .overflowText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .customerTypeView,
  .customerSourceView {
    padding: 0 30px;
    line-height: 40px;
    text-align: left;
    font-size: 14px;
  }
  .quickmoney .textView {
    padding: 20px 30px 0;
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
}
</style>
