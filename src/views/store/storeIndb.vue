<template>
  <div id="storeIn">
    <div class="topView">
      <button class="btn-back" @click="$emit('close',0)"></button>
      <div class="tView">入库</div>
      <div class="btnView">
        <button class="btn-audio btn-green" @click="saveAdd">保存</button>
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
            <div class="subItem">
              <label>入库日期</label>
              <div>{{date|time('y-m-d')}}</div>
            </div>
            <div class="subItem">
              <label>入库方式</label>
              <div>调拨入库</div>
            </div>
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
            <div class="subItem">
              <label>来源门店</label>
              <div>{{buyer}}</div>
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
        <div class="tView">入库信息</div>
        <div class="headerView">
          <div class="nameView">产品信息</div>
          <div class="cntView">接收数量</div>
          <div class="priceView">采购单价</div>
          <div class="amtView">总金额</div>
          <div class="supplierView">供应商</div>
          <!-- <div class="descView">规格</div> -->
          <div class="dateView">生产日期</div>
        </div>
        <div class="listView">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="cntView">
              <input v-model="v.number" @change="changeNum(v,1)" />
            </div>
            <div class="priceView">
              <div style="text-align:center">{{v.in_cost}}</div>
              <!-- <input v-model="v.in_cost" @change="changeNum(v,2)" /> -->
            </div>
            <div class="amtView">
              <div style="text-align:center">{{v.total}}</div>
              <!-- <input v-model="v.total" @change="changeTotal(v)" /> -->
            </div>
            <div class="supplierView">
              <div>{{v.supplier_id}}</div>
            </div>
            <!-- <div class="descView overflowText"></div> -->
            <div class="dateView">{{v.makedate}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  components: {},
  props: ['info'],
  data () {
    return {
      choosepro: false,
      tableData: [],
      oldsum: 0,
      searchtxt: '',
      list: [],
      storeid: sessionStorage.getItem('storeid'),
      stock_no: '',
      way: '正常入库',
      workerDialog: false,
      makeDay: false,
      date: new Date,
      workerlist: [],
      buyer: '请选择采购人',
      buyid: '',
      remark: '',
      searchtxt: null,
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
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    openadd () {
      this.choosepro = true
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
    async saveAdd () {
      // if (!this.buyid) return this.$message.error('请选择采购人')
      // if (!this.chooselist.length) return this.$message.error('缺少产品信息')
      let arr = []
      let Newsum = 0
      this.chooselist.forEach(item => {
        Newsum += Number(item.number)
        // if (item.number == 1)
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
      if (Newsum < this.oldsum) {
        this.delOld()
      } else {
        this.modifyDB()
      }
      let data = qs.stringify({
        storeid: this.storeid,
        stock_no: this.stock_no,
        into_date: this.formatDate(this.date),
        into_type: '调拨入库',
        warehouse: '门店仓库',
        number: this.chooselist.length,
        amount: this.totalPrice,
        into_userid: JSON.parse(sessionStorage.getItem('userInfo')).id,
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        remark: this.remark,
        goodsinfo: arr
      })
      const res = await this.$axios.post('/api?datatype=insert_into_stock', data)
      if (res.data.code == 1) {
        this.$message.success('入库成功')
      }
    },
    // 全部接收
    modifyDB () {
      this.$axios.get('/api?datatype=update_db_status', {
        params: {
          out_id: this.info.id
        }
      }).then(res => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg)
          this.$emit('close', 1)
        }
      })
    },
    // 删除原来的出库单
    async delOld () {
      let params = {
        storeid: this.info.storeid,
        id: this.info.id,
        role: 1,
        checkman: '调拨接收门店:' + JSON.parse(sessionStorage.getItem('shopInfo')).shop_name
      }
      const res = await this.$axios.get('/api?datatype=del_stock_out', { params })
      if (res.data.code == 1) {
        this.addNew()
      } else {
        this.$message.error(res.data.msg)
      }
    },
    async addNew () {
      let arr = []
      let sum = 0
      this.chooselist.forEach(item => {
        let obj = {
          goods_id: item.goods_id,
          goods_name: item.goods_name,
          number: item.number,
          in_cost: item.in_cost,
          total: item.total,
          supplier: item.supplier,
          makedate: item.makedate
        }
        sum += Number(item.total)
        arr.push(obj)
      })
      let data = qs.stringify({
        storeid: this.info.storeid,
        stock_no: this.info.stock_no,
        out_date: this.info.out_date,
        out_type: '调拨出库',
        checkman: this.info.checkman,
        warehouse: '门店仓库',
        number: this.chooselist.length,
        amount: sum,
        db_status: 2,
        get_userid: this.storeid,
        remark: this.info.remark,
        useinfo: '调拨出库',
        goodsinfo: arr
      })
      const res = await this.$axios.post('/api?datatype=insert_out_stock', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('成功')
        this.$emit('close', 1)
      }
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
      v.number = window.isNaN(Number(v.number)) ? 0 : Number(v.number)
      if (v.number < 1) {
        v.number = 1
        this.$message.error('数量不可少于1件')
      }
      if (v.number > v.max) {
        v.number = v.max
        this.$message.error('不可超出最大接收数量')
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
    setInfo () {
      this.buyer = this.info.shop_name
      this.info.goodsinfo.forEach(item => {
        item['max'] = item.number
        this.oldsum += Number(item.number)
      })
      this.chooselist = JSON.parse(JSON.stringify(this.info.goodsinfo))
    }
  },
  created () {
    if (!this.info) return this.$emit('close', 0)
    this.setInfo()
    this.getNewNo()
    // this.getworkerlist()
    // this.getCPlist()
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
