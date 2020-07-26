<template>
  <div id="storeIn">
    <div class="topView">
      <button class="btn-back" @click="$emit('close')"></button>
      <div class="tView">出库</div>
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
              <label>出库日期</label>
              <div @click="dateDialog=true">{{date|time('y-m-d')}}</div>
            </div>
            <div class="subItem selectView">
              <label>出库方式</label>
              <div @click="wayDialog=true">{{way}}</div>
            </div>
            <el-dialog
              title="出库方式"
              :visible.sync="wayDialog"
              width="30%"
              center
              :append-to-body="true"
              custom-class="dialog"
            >
              <div class="contentView" style="max-height: 720px;">
                <div
                  class="listItem"
                  :class="{select:way=='正常出库'}"
                  @click="way='正常出库';wayDialog=false"
                >正常出库</div>
                <div
                  class="listItem"
                  :class="{select:way=='盘亏出库'}"
                  @click="way='盘亏出库';wayDialog=false"
                >盘亏出库</div>
                <div
                  class="listItem"
                  :class="{select:way=='供应商退货'}"
                  @click="way='供应商退货';wayDialog=false"
                >供应商退货</div>
                <div
                  class="listItem"
                  :class="{select:way=='调拨出库'}"
                  @click="way='调拨出库';wayDialog=false"
                >调拨出库</div>
                <div
                  class="listItem"
                  :class="{select:way=='损坏'}"
                  @click="way='损坏';wayDialog=false"
                >损坏</div>
                <div
                  class="listItem"
                  :class="{select:way=='赠送'}"
                  @click="way='赠送';wayDialog=false"
                >赠送</div>
              </div>
            </el-dialog>
            <div class="subItem">
              <label>归属仓库</label>
              <div>总仓库</div>
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
              <label>领取员工</label>
              <div @click="workerDialog=true">{{buyer}}</div>
            </div>
            <el-dialog
              title="选择领取员工"
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
            <div class="subItem">
              <label>领取用途（必填）</label>
              <el-input size="mini" style="width:50px" v-model="usefor"></el-input>
              <!-- <div @click="typeDialog=true">{{getType}}</div> -->
            </div>
            <div class="remarkView">
              <div>备注</div>
              <textarea placeholder="填写备注"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="incomeGoodsView">
        <div class="tView">
          出库信息
          <!---->
          <button class="btn-add btn-audio">扫码</button>
          <button class="btn-add btn-audio" @click="openadd">选择产品</button>
          <button style="color:red" v-show="setid" @click="delInstore">删除</button>
        </div>
        <div class="headerView">
          <div class="nameView">产品信息</div>
          <div class="cntView">出库数量</div>
          <div class="stockCntView">当时库存</div>
          <div class="priceView">单价</div>
          <div class="amtView">总金额</div>
          <div class="supplierView">供应商</div>
          <div class="descView">规格</div>
        </div>
        <div class="listView" v-show="!setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button class="btn-del btn-audio" @click="delchoose(v)"></button>
            <div class="nameView overflowText">{{v.goods_name}}</div>
            <div class="cntView">
              <input v-model="v.outnumber" @change="changeNum(v)" />
            </div>
            <div class="stockCntView">
              <div>{{v.oldnumber}}</div>
            </div>
            <div class="priceView">
              <div>{{v.in_cost}}</div>
              <!-- <input v-model="v.in_cost" @change="changeNum(v)" /> -->
            </div>
            <div class="amtView">
              <input v-model="v.total" />
            </div>
            <div class="supplierView">
              <div>{{v.supplier_id}}</div>
            </div>
            <div class="descView overflowText"></div>
            <!-- <div class="dateView selectView" @click="changeDate(v)">{{v.makedate}}</div> -->
          </div>
          <!---->
        </div>
        <div class="listView" v-show="setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button></button>
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="cntView">{{v.number}}</div>
            <div class="priceView">{{v.price}}</div>
            <div class="amtView">{{v.total}}</div>
            <div class="supplierView">{{v.supplier_id}}</div>
            <div class="dateView">{{v.makedate}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择出库产品 -->
    <el-dialog
      title="选择产品"
      :visible.sync="choosepro"
      custom-class="chooseDialog"
      :modal-append-to-body="false"
      center
      width="700px"
    >
      <div class="searchView">
        <!-- <el-input placeholder="请输入产品编号或名称" v-model="searchtxt" @blur="changecate"  prefix-icon="el-icon-search">
        </el-input>-->
        <input placeholder="请输入产品编号或名称" v-model="searchtxt" @blur="changecate" />
      </div>
      <div class="headerView">
        <label class="label-code">编号</label>
        <label class="label-name">产品名称</label>
        <label>库存数量</label>
        <!-- <label class="label-source">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              供应商
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </label>-->
      </div>
      <div class="listView">
        <div class="listItem" v-for="(v,k) in tableData" :key="k" @click="chosCp(v)">
          <label class="label-icon" :class="{select:list.includes(v.id)}"></label>
          <label class="label-code">{{v.goods_no}}</label>
          <label class="label-name">{{v.goods_name}}</label>
          <label>{{v.number}}</label>
          <!-- <label class="label-source"></label> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="choosepro = false">取 消</el-button>
        <el-button type="success" @click="submitGoods">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
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
      searchtxt: '',
      list: [],
      storeid: sessionStorage.getItem('storeid'),
      stock_no: '',
      way: '正常出库',
      wayDialog: false,
      dateDialog: false,
      workerDialog: false,
      makeDay: false,
      getType: '员工',
      typeDialog: false,
      date: new Date,
      workerlist: [],
      buyer: '请选择领取员工',
      buyid: '',
      remark: '',
      usefor: '',
      searchtxt: null,
      cateList: [],
      chooselist: [],
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
    async getinfoByid () {
      const res = await this.$axios.get('/api?datatype=get_one_stock', {
        params: {
          sign: 2,
          id: this.setid
        }
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.stock_no = data.stock_no
        this.date = data.out_date
        this.way = data.out_type
        this.buyer = data.name
        this.buyid = data.get_userid
        this.remark = data.remark
        data.goodsinfo.forEach(item => {
          this.$set(item, 'outnumber', item.number)
          this.$set(item, 'oldnumber', Number(item.number) + Number(item.skunum))
        })
        this.chooselist = data.goodsinfo
      }
    },
    delInstore () {
      this.$confirm('确认删除此出库单吗?', '提示', {
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
        const res = await this.$axios.get('/api?datatype=del_stock_out', { params })
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
          is_li: 0,
          is_wei: 1
        }
      })
      if (res.data.code == 1) {
        this.workerlist = res.data.data
      }
    },
    openadd () {
      this.choosepro = true
      this.getCPlist()
    },
    async getCPlist () {
      const res = await this.$axios.get('/api?datatype=get_skulist', {
        params: {
          storeid: this.storeid
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          this.cateList = []
          res.data.data.forEach(item => {
            if (this.cateList.length != 0) {
              this.cateList.every(v => {
                if (v.id != item.category_id) {
                  this.cateList.push({ 'id': item.category_id, 'title': item.title })
                }
              })
            } else {
              this.cateList.push({ 'id': item.category_id, 'title': item.title })
            }
          })
        })
      }
    },
    chosCp (v) {
      if (!this.list.includes(v.id)) {
        this.list.push(v.id)
      } else {
        this.list = this.list.filter(value => value != v.id)
      }
    },
    async saveAdd () {
      if (!this.buyid) return this.$message.error('请选择领取员工')
      if (!this.usefor) return this.$message.error('请输入领取用途')
      if (!this.chooselist.length) return this.$message.error('缺少产品信息')
      let data = qs.stringify({
        storeid: this.storeid,
        stock_no: this.stock_no,
        out_date: this.formatDate(this.date),
        out_type: this.way,
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        warehouse: '总仓库',
        number: this.chooselist.length,
        amount: this.totalPrice,
        get_usertype: '员工',
        get_userid: this.buyid,
        remark: this.remark,
        useinfo: this.usefor,
        goodsinfo: this.chooselist
      })
      const res = await this.$axios.post('/api?datatype=insert_out_stock', data)
      console.log(res)
      if (res.data.code == 1) {
        this.$message.success('出库成功')
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
        let a = this.tableData.find(item => item.id == id)
        let b = this.chooselist.find(val => val.id == id)
        this.$set(a, 'oldnumber', a.number)
        this.$set(a, 'outnumber', 0)
        this.$set(a, 'total', 0)
        this.$set(a, 'supplier_id', '供应商A')
        this.$set(a, 'makedate', this.formatDate(new Date()))
        Object.assign(a, b)
        console.log(a, b)
        arr.push(a)
      })
      this.chooselist = arr
      this.choosepro = false
    },
    async changecate (command) {
      const res = await this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: this.storeid,
          cate: command,
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
          type: 2
        }
      })
      if (res.data.code == 1) {
        this.stock_no = res.data.data
      }
    },
    // 修改数量
    changeNum (v) {
      v.outnumber = v.outnumber.replace(/[^0-9]/g, '')
      this.chooselist.forEach(item => {
        if (item.id == v.id) {
          if (Number(v.outnumber) > Number(v.oldnumber)) {
            item.outnumber = v.oldnumber
          }
          item.total = Number(item.outnumber) * Number(item.in_cost)
          item.number = item.outnumber
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
    }
  },
  created () {
    if (this.setid) {
      this.getinfoByid()
    } else {
      this.getNewNo()
    }
    this.getworkerlist()
  },
  mounted () { }
}
</script>

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
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px 0;
        height: calc(100% - 60px);
        .groupView {
          margin-bottom: 25px;
          .subItem {
            display: flex;
            line-height: 20px;
            padding: 12px 10px 12px 20px;
            font-size: 14px;
            &.selectView {
              padding: 12px 25px 12px 20px;
              background: transparent
                url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Right.png)
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
            flex: 1.5;
            text-align: left;
          }

          &.dateView,
          &.supplierView {
            flex: 2.5;
            border-radius: 5px;
            margin: 0 10px;
            padding-right: 20px;
          }
          &.supplierView {
            flex: 1.5;
          }
        }
      }
      .listView {
        overflow-x: hidden;
        overflow-y: auto;
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
            text-align: center;
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
              flex: 1.5;
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
            &.supplierView {
              flex: 1.5;
            }
            &.dateView.selectView,
            &.supplierView.selectView {
              border: 0.5px solid rgba(220, 220, 220, 0.7);
              background: #fff
                url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Right.png)
                right center / 22px no-repeat;
            }
          }
          .btn-del {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 55px;
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Del_Red.png)
              center / 24px no-repeat;
          }
        }
      }
    }
  }
  .chooseDialog {
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
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Search.png)
          10px center / 24px no-repeat;
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
      overflow-x: hidden;
      overflow-y: auto;
      color: #28282d;
      padding-bottom: 25px;
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
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_N.png)
            center / 24px no-repeat;
        }
        .label-icon.select {
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_S.png)
            center / 24px no-repeat;
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
