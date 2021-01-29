<template>
  <div id="storeIn">
    <div class="topView">
      <button class="btn-back" @click="$emit('close',0)"></button>
      <div class="tView">入库</div>
      <div class="btnView">
        <button class="btn-audio btn-green" @click="saveAdd" v-show="!setid">保存</button>
      </div>
    </div>
    <div class="contentView">
      <div class="orderInfoView">
        <div class="tView">单据信息</div>
        <div class="listView">
          <div class="groupView">
            <div class="subItem textView disView">
              <label>单号</label>
              <div>{{stock_no}}</div>
            </div>
            <div class="subItem selectView">
              <label>入库日期</label>
              <div @click="dateDialog=true">{{date|time('y-m-d')}}</div>
            </div>
            <div class="subItem selectView">
              <label>入库方式</label>
              <div @click="wayDialog=true">{{way}}</div>
            </div>
            <el-dialog
              :close-on-click-modal="false"
              title="入库方式"
              :visible.sync="wayDialog"
              width="30%"
              center
              :append-to-body="true"
              custom-class="dialog"
            >
              <div class="contentView" style="max-height: 720px;">
                <div
                  class="listItem"
                  :class="{select:way=='正常入库'}"
                  @click="way='正常入库';wayDialog=false"
                >正常入库</div>
                <!-- <div
                  class="listItem"
                  :class="{select:way=='盘盈入库'}"
                  @click="way='盘盈入库';wayDialog=false"
                >盘盈入库</div>-->
                <div
                  class="listItem"
                  :class="{select:way=='客户退货'}"
                  @click="way='客户退货';wayDialog=false"
                >客户退货</div>
                <!-- <div
                  class="listItem"
                  :class="{select:way=='调拨入库'}"
                  @click="way='调拨入库';wayDialog=false"
                >调拨入库</div>-->
              </div>
            </el-dialog>
            <div class="subItem">
              <label>归属仓库</label>
              <div>门店仓库</div>
            </div>
          </div>
          <div class="groupView">
            <div class="subItem textView disView">
              <label>数量合计</label>
              <div>{{chooselist.length}}</div>
            </div>
            <div class="subItem textView disView">
              <label>金额合计</label>
              <div>￥&nbsp;{{totalPrice}}</div>
            </div>
          </div>
          <div class="groupView">
            <div class="subItem selectView">
              <label>采购人</label>
              <div @click="workerDialog=true">{{buyer}}</div>
            </div>
            <el-dialog
              :close-on-click-modal="false"
              title="选择采购人"
              :visible.sync="workerDialog"
              width="30%"
              center
              :append-to-body="true"
              custom-class="dialog"
            >
              <div class="contentView" style="max-height: 720px;">
                <div
                  v-for="(v,k) in workerlist"
                  :key="k"
                  class="listItem"
                  :class="{select:buyid==v.id}"
                  @click="buyid=v.id;buyer=v.name;workerDialog=false"
                >{{v.job_no}}-{{v.name}}</div>
              </div>
            </el-dialog>
            <div class="remarkView">
              <div>备注</div>
              <textarea placeholder="填写备注" v-model="remark"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="incomeGoodsView">
        <div class="tView">
          入库信息
          <!-- <button class="btn-add btn-audio" v-show="!setid" @click="opencode">扫码</button> -->
          <button class="btn-add btn-audio" v-show="!setid" @click="openadd">选择产品</button>
          <button style="color:red" v-show="setid&&way!='客户退货'" @click="delInstore">删除</button>
        </div>
        <div class="headerView">
          <div class="nameView">产品信息</div>
          <div class="cntView">数量</div>
          <div class="priceView">采购单价</div>
          <div class="amtView">总金额</div>
          <div class="supplierView">供应商</div>
          <!-- <div class="descView">规格</div> -->
          <div class="dateView">生产日期</div>
        </div>
        <div class="listView" v-if="!setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button class="btn-del btn-audio" @click="delchoose(v)"></button>
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="cntView">
              <input v-model="v.number" @change="changeNum(v,1)" />
            </div>
            <div class="priceView">
              <input v-model="v.in_cost" @change="changeNum(v,2)" />
            </div>
            <div class="amtView">
              <input v-model="v.total" @change="changeTotal(v)" />
            </div>
            <div class="supplierView">
              <div>{{v.supplier_id}}</div>
            </div>
            <!-- <div class="descView overflowText"></div> -->
            <div class="dateView selectView" @click="changeDate(v)">{{v.makedate}}</div>
          </div>
        </div>
        <div class="listView" v-show="setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button></button>
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="cntView">{{v.number}}</div>
            <div class="priceView">{{v.in_cost}}</div>
            <div class="amtView">{{v.total}}</div>
            <div class="supplierView">{{v.supplier_id}}</div>
            <div class="dateView">{{v.makedate}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:addpro}">
      <addPro @close="addpro=false"></addPro>
    </div>

    <!-- 选择入库产品 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择产品"
      :visible.sync="choosepro"
      custom-class="chooseDialog"
      :modal-append-to-body="false"
      center
      width="700px"
      style="height:100%"
    >
      <div class="searchView">
        <!-- <el-input placeholder="请输入产品编号或名称" v-model="searchtxt" @blur="changecate"  prefix-icon="el-icon-search">
        </el-input>-->
        <el-input placeholder="请输入产品编号或名称" v-model="searchtxt">
          <el-button slot="append" icon="el-icon-search" @click="changecate">搜索</el-button>
        </el-input>
      </div>
      <div class="headerView">
        <label class="label-code">编号</label>
        <label class="label-name">产品名称</label>
        <label>
          <el-dropdown trigger="click" @command="changecate">
            <span class="el-dropdown-link">
              {{cate.title}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="null">全部</el-dropdown-item>
              <el-dropdown-item v-for="(v,k) in cateList" :key="k" :command="v">{{v.title}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </label>
        <label class="label-source">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              供应商
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"></el-dropdown-menu>
          </el-dropdown>
        </label>
      </div>
      <div class="listView">
        <div class="listItem" v-for="(v,k) in tableData" :key="k" @click="chosCp(v)">
          <label class="label-icon" :class="{select:list.includes(v.id)}"></label>
          <label class="label-code">{{v.goods_no}}</label>
          <label class="label-name">{{v.goods_name}}</label>
          <label>{{v.title}}</label>
          <label class="label-source"></label>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="choosepro = false">取 消</el-button>
        <el-button type="success" @click="submitGoods">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="日期选择"
      :visible.sync="dateDialog"
      center
      :append-to-body="true"
      custom-class="dialog"
    >
      <div @click="dateDialog = false">
        <el-calendar v-model="date"></el-calendar>
      </div>
    </el-dialog>

    <!-- 生产日期 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="makeDay"
      center
      :append-to-body="true"
      custom-class="dialog"
    >
      <div @click="chosMakeDay">
        <el-calendar v-model="prodate"></el-calendar>
      </div>
    </el-dialog>

    <!-- 选择入库产品扫码 -->
    <el-dialog
      :close-on-click-modal="false"
      title="输入条码"
      :visible.sync="codeDialog"
      :modal-append-to-body="false"
      center
      width="700px"
      custom-class="codeDialog"
      style="height:320px"
    >
      <div class="searchView" style="padding:20px">
        <input placeholder="请输入产品条形码" v-model="codebar" ref="input" @keyup.enter="getitem" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="codeDialog = false">取 消</el-button>
        <el-button type="success" @click="getitem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addPro from '@/components/addpro.vue'
import qs from 'qs'
export default {
  components: { addPro },
  props: ['setid'],
  data () {
    return {
      addpro: false,
      choosepro: false,
      tableData: [],
      tableData1: [],
      codebar: '',
      searchtxt: '',
      list: [],
      storeid: sessionStorage.getItem('storeid'),
      stock_no: '',
      way: '正常入库',
      wayDialog: false,
      codeDialog: false,
      dateDialog: false,
      workerDialog: false,
      makeDay: false,
      date: new Date,
      workerlist: [],
      buyer: '请选择采购人',
      buyid: '',
      remark: '',
      cateList: [],
      chooselist: [],
      cate: { id: null, title: '全部' },
      prodate: '',
      chosOne: ''
    }
  },
  watch: {},
  computed: {
    totalPrice () {
      let sum = 0
      this.chooselist.forEach(item => {
        sum += Number(item.total)
      })
      return sum
    }
  },
  methods: {
    // opencode () {
    //   this.codebar = ''
    //   this.codeDialog = true
    //   this.getCPlist()
    //   this.$nextTick(() => { this.$refs['input'].focus() })
    // },
    getitem (codebar) {
      if (!codebar) return
      this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: this.storeid,
          status: 1,
          bar_code: codebar
        }
      }).then(res => {
        // console.log(res)
        if (res.data.code == 1 && res.data.data && res.data.data[0]) {
          let data = res.data.data[0]
          if (this.list.includes(data.id)) {
            this.$message.error('此产品已添加，请直接修改数量')
          } else {
            this.list.push(data.id)
            this.submitGoods()
            this.$message.success('添加成功')
          }
        } else {
          this.$message.error('未查询到此条码')
        }
      })
      // this.codebar = ''
      // this.$nextTick(() => { this.$refs['input'].focus() })
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    async getworkerlist () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 1,
          is_wei: 1
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.workerlist = res.data.data
      } else {
        this.workerlist = []
      }
    },
    openadd () {
      this.choosepro = true
      // this.searchtxt = null
      this.getCPlist()
    },
    async getCPlist () {
      const res = await this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: this.storeid,
          status: 1
        }
      })
      // console.log(res)
      this.tableData = res.data.data
      this.tableData1 = this.tableData
      this.tableData.forEach(item => {
        this.cateList = []
        res.data.data.forEach(item => {
          if (this.cateList.length != 0) {
            // this.cateList.every(v => {
            let cateL = this.cateList.map(v => v.id)
            if (!cateL.includes(item.category_id)) {
              this.cateList.push({ 'id': item.category_id, 'title': item.title })
            }
            // })
          } else {
            this.cateList.push({ 'id': item.category_id, 'title': item.title })
          }
        })
      })
    },
    chosCp (v) {
      if (!this.list.includes(v.id)) {
        this.list.push(v.id)
      } else {
        this.list = this.list.filter(value => value != v.id)
      }
    },
    async saveAdd () {
      if (!this.buyid) return this.$message.error('请选择采购人')
      if (!this.chooselist.length) return this.$message.error('缺少产品信息')
      let arr = []
      this.chooselist.forEach(item => {
        // if (item.number == 1)
        // let obj = {
        //   id: item.id,
        //   goods_name: item.goods_name,
        //   number: item.number,
        //   in_cost: item.in_cost,
        //   total: item.total,
        //   supplier: item.supplier,
        //   makedate: item.makedate
        // }
        let obj = {
          id: item.id,
          category_id: item.category_id,
          goods_name: item.goods_name,
          goods_no: item.goods_no,
          number: item.number,
          in_cost: item.in_cost,
          total: item.total,
          supplier: item.supplier,
          makedate: item.makedate
        }
        arr.push(obj)
      })
      let data = qs.stringify({
        storeid: this.storeid,
        stock_no: this.stock_no,
        into_date: this.formatDate(this.date),
        into_type: this.way,
        warehouse: '门店仓库',
        number: this.chooselist.length,
        amount: this.totalPrice,
        into_userid: this.buyid,
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        remark: this.remark,
        goodsinfo: arr
      })
      const res = await this.$axios.post('/api?datatype=insert_into_stock', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('入库成功')
        this.$emit('close', 1)
      }
    },
    delchoose (v) {
      this.chooselist = this.chooselist.filter(item => item.id != v.id)
      this.list = this.list.filter(item => item != v.id)
    },
    submitGoods () {
      let arr = []
      this.list.forEach(id => {
        let a = this.tableData1.find(item => item.id == id)
        let b = this.chooselist.find(val => val.id == id)
        this.$set(a, 'number', 1)
        this.$set(a, 'total', Number(a.in_cost))
        // this.$set(a, 'supplier_id', '供应商A')
        this.$set(a, 'makedate', this.formatDate(new Date()))
        Object.assign(a, b)
        console.log(a, b)
        arr.push(a)
      })
      if (arr.length > 60) return this.$message.error('商品数量不能超过60个，请分批入库！')
      this.chooselist = arr
      this.choosepro = false
    },
    async changecate (command) {
      if (command == 'null') {
        this.cate = { id: null, title: '全部' }
      } else {
        this.cate = command
      }
      const res = await this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: this.storeid,
          cate: this.cate.id,
          status: 1,
          search: this.searchtxt
        }
      })
      this.tableData = res.data.data
    },
    async getNewNo () {
      const res = await this.$axios.get('/api?datatype=get_stock_no', {
        params: {
          storeid: this.storeid,
          type: 1
        }
      })
      if (res.data.code == 1) {
        this.stock_no = res.data.data
      }
    },
    // 修改数量
    changeNum (v, id) {
      if (id == 1) {
        v.number = window.isNaN(Number(v.number)) ? 1 : Number(v.number)
        if (v.number < 1) {
          v.number = 1
          this.$message.error('数量不能少于1件')
        }
      } else {
        v.in_cost = window.isNaN(Number(v.in_cost)) ? 0 : Number(v.in_cost)
        if (v.in_cost < 0) {
          v.in_cost = 0
          this.$message.error('价格输入不正确')
        }
      }
      this.chooselist.forEach(item => {
        if (item.id == v.id) {
          item.total = item.number * item.in_cost
        }
      })
    },
    changeTotal (v) {
      v.total = v.total.replace(/[^0-9]/g, '0')
      this.chooselist.forEach(item => {
        if (item.id == v.id) {
          item.in_cost = Number(item.total) / Number(item.number)
        }
      })
    },
    changeDate (v) {
      this.prodate = v.makedate
      this.chosOne = v
      this.makeDay = true
    },
    chosMakeDay () {
      this.chooselist.forEach(item => {
        if (item.id == this.chosOne.id) {
          item.makedate = this.formatDate(this.prodate)
        }
      })
      this.makeDay = false
    },
    async getinfoByid () {
      const res = await this.$axios.get('/api?datatype=get_one_stock', {
        params: {
          sign: 1,
          id: this.setid
        }
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.stock_no = data.stock_no
        this.date = data.into_date
        this.way = data.into_type
        this.buyer = data.name
        this.buyid = data.into_userid
        this.remark = data.remark
        this.chooselist = data.goodsinfo
      }
    },
    delInstore () {
      if (this.way == '盘盈入库') return this.$message.error('盘点相关，无法删除')
      this.$confirm('确认删除此入库单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          storeid: this.storeid,
          id: this.setid,
          role: JSON.parse(sessionStorage.getItem('userInfo')).role,
          checkman: JSON.parse(sessionStorage.getItem('userInfo')).username
        }
        const res = await this.$axios.get('/api?datatype=del_stock_into', { params })
        if (res.data.code == 1) {
          this.$message.success('操作成功')
          this.$emit('close', 1)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    opencode () {
      var _this = this
      var codeString = "";
      //定时器每隔200ms 清空codeString
      //扫码枪读取的速度比手动输入的速度要快很多，这也可以作为区分扫码还是手动输入的条件
      var scanTimeer = setInterval(function () {
        var now = new Date().getTime();
        if (now - lastTime > 200) {
          codeString = "";
        }
      }, 200);
      var lastTime;
      var caseFormat = false;
      document.onkeydown = function (e) {
        var nextTime = new Date().getTime();
        var code = e.which;
        //shift键
        if (code == 16) {
          caseFormat = true;
        } else {
          if (caseFormat) {
            if (code >= 65 && code <= 90) {
              //转小写
              code = code + 32;
            } else if (code >= 97 && code <= 122) {
              //转大写
              code = code - 32;
            }
            caseFormat = false;
          }
          var char = String.fromCharCode(code);
          if (codeString == "") {
            codeString += char;
          } else if (nextTime - lastTime <= 30) {
            codeString += char;
          }
        }
        lastTime = nextTime;
      };

      window.onkeydown = (function (e) {
        var nextTime1 = new Date().getTime();
        var lastTime1;
        if (e.which == 13) {
          _this.getitem(codeString.substring(0, codeString.length - 1));
          codeString = "";
        }
      })
    }
  },
  created () {
    if (this.setid) {
      this.getinfoByid()
    } else {
      this.getNewNo()
    }
    this.getworkerlist()
    this.getCPlist()
    this.opencode()
  },
  beforeDestroy () {
    // console.log('消毁')
    document.onkeydown = null
    window.onkeydown = null
  },
  mounted () { }
}
</script>
<style lang="scss">
.chooseDialog.el-dialog {
  height: 80%;
  .el-dialog__body {
    height: calc(100% - 124px) !important;
  }
}
</style>
<style lang="scss" scoped>
#storeIn {
  height: 100%;
  .topView {
    position: relative;
    padding: 35px 20px 10px 20px;
    text-align: center;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    .tView {
      font-size: 24px;
      color: #28282d;
      font-family: PingFangSC-Semibold;
      line-height: 40px;
      flex: 1;
    }
    .btnView {
      position: absolute;
      top: 35px;
      right: 15px;
      span {
        font-size: 16px;
        margin-right: 15px;
        color: #47bf7c;
      }
    }
    .btn-green {
      padding: 0 10px;
      line-height: 40px;
      height: 40px;
      background: #47bf7c;
      border-radius: 5px;
      font-size: 15px;
      color: #fff;
      width: 90px;
      height: 40px;
    }
  }
  .contentView {
    height: calc(100% - 85px);
    display: flex;
    div > .tView {
      padding: 15px 20px 10px 20px;
      line-height: 35px;
      font-size: 18px;
      color: #28282d;
      box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.01);
    }
    .orderInfoView {
      width: 300px;
      min-width: 300px;
      border-right: 0.5px solid rgba(220, 220, 220, 0.7);
      .listView {
        overflow: auto;
        padding: 10px 0;
        height: calc(100% - 60px);
        .groupView {
          margin-bottom: 25px;
          .subItem {
            display: flex;
            line-height: 20px;
            padding: 12px 25px 12px 20px;
            font-size: 14px;
            &.selectView {
              background: transparent url(../../assets/images/Icon_Right.png)
                right center / 28px no-repeat;
            }
            > div {
              flex: 1;
              color: #28282d;
              text-align: right;
              cursor: pointer;
            }
          }
        }
        .remarkView {
          padding: 0 10px 15px 10px;
          color: #28282d;
          > div {
            padding: 10px 20px 10px 10px;
            line-height: 20px;
            font-size: 14px;
          }
          textarea {
            display: block;
            width: 100%;
            min-height: 140px;
            background: #f4f4f4;
            border-radius: 6px;
            padding: 10px 12px;
            font-size: 14px;
            line-height: 20px;
            color: #28282d;
            box-sizing: border-box;
            border: none;
            outline: none;
            resize: none;
          }
        }
      }
    }
    .incomeGoodsView {
      flex: 1;
      .tView > button {
        float: right;
        text-align: right;
        font-size: 15px;
        color: #47bf7c;
        width: 80px;
        height: 35px;
      }
      .headerView {
        display: flex;
        line-height: 44px;
        padding-left: 62px;
        padding-right: 5px;
        font-size: 14px;
        color: #8a8a8a;
        text-align: center;
        > div {
          flex: 2;
          &.nameView {
            flex: 3;
            text-align: left;
          }
          &.cntView {
            flex: 1;
            text-align: left;
          }
          &.dateView,
          &.supplierView {
            flex: 2.5;
            border-radius: 5px;
            margin: 0 10px;
            padding-right: 20px;
          }
        }
      }
      .listView {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 104px);
        padding-bottom: 35px;
        .listItem {
          position: relative;
          display: flex;
          background: #fff;
          padding: 6px 5px 6px 62px;
          line-height: 42px;
          font-size: 14px;
          color: #28282d;
          cursor: pointer;
          &:nth-child(odd) {
            background: #f4f4f4;
          }
          > div {
            flex: 2;
            input {
              display: block;
              width: 100%;
              background: #fff;
              border-radius: 5px;
              border: 0.5px solid rgba(220, 220, 220, 0.7);
              font-size: 14px;
              padding: 10px 0;
              line-height: 20px;
              text-align: center;
            }
            &.nameView {
              flex: 3;
              text-align: left;
            }
            &.cntView {
              flex: 1;
              text-align: left;
            }
            &.dateView {
              flex: 2.5;
              border-radius: 5px;
              margin: 0 10px;
              padding-right: 20px;
            }
            &.priceView {
              margin: 0 10px;
            }
            &.dateView,
            &.supplierView {
              flex: 2.5;
              border-radius: 5px;
              margin: 0 10px;
              padding-right: 20px;
              text-align: center;
            }
            &.dateView.selectView,
            &.supplierView.selectView {
              border: 0.5px solid rgba(220, 220, 220, 0.7);
              background: #fff url(../../assets/images/Icon_Right.png) right
                center / 22px no-repeat;
            }
          }
          .btn-del {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 55px;
            background: #fff url(../../assets/images/Del_Red.png) center / 24px
              no-repeat;
          }
        }
      }
    }
  }
  .chooseDialog,
  .codeDialog {
    .searchView {
      padding: 10px 12px;
      background: #f4f4f4;
      input {
        display: block;
        width: 100%;
        padding: 8px 12px 8px 38px;
        height: 36px;
        line-height: 20px;
        border: none;
        font-size: 14px;
        border-radius: 5px;
        background: #fff url(../../assets/images/search.png) 10px center / 24px
          no-repeat;
      }
    }
    .headerView {
      display: flex;
      padding: 15px 15px 10px 72px;
      line-height: 20px;
      color: #8a8a8a;
      justify-content: space-around;
      label {
        flex: 1;
      }
      label.label-name {
        flex: 2;
        text-align: left;
      }
    }
    .listView {
      overflow: auto;
      height: calc(100% - 100px);
      color: #28282d;
      .listItem {
        position: relative;
        display: flex;
        padding: 17px 15px 17px 72px;
        line-height: 20px;
        color: #8a8a8a;
        background: #fff;
        cursor: pointer;
        .label-icon {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 58px;
          background: #fff url(../../assets/images/check-kong.png) center / 24px
            no-repeat;
        }
        .label-icon.select {
          background: #fff url(../../assets/images/check-s.png) center / 24px
            no-repeat;
        }
        label {
          flex: 1;
          cursor: pointer;
        }
        label.label-name {
          flex: 2;
          text-align: left;
        }
      }
      .listItem:nth-child(odd) {
        background: #f8f8f8;
      }
    }
  }
}
</style>
