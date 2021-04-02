<template>
  <div id="store">
    <div class="topView">
      <div class="one">
        <el-select v-model="value">
          <el-option value="库存-入库单">库存-入库单</el-option>
          <el-option value="库存-出库单">库存-出库单</el-option>
        </el-select>
        <el-button @click="checkOrder" size="small" type="success">查询订单</el-button>
      </div>
      <div class="dateView">
        <el-date-picker
          v-model="date"
          type="daterange"
          prefix-icon="a"
          :clearable="false"
          range-separator="-"
          format="yyyy年MM月dd日"
          @change="getDate"
        ></el-date-picker>
        <!-- <i class="el-icon-arrow-right"></i> -->
      </div>
      <div class="btnView">
        <el-input
          v-model="searchtxt"
          placeholder="请输入产品名称"
          style="width:180px;margin-right:20px"
          clearable
          @change="getDate"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" @change="getDate"></i>
        </el-input>
        <button class="btn-audio btn-green" @click="turnIn">入库</button>
        <button class="btn-audio btn-black" @click="turnOut">出库</button>
      </div>
    </div>
    <div class="contantView">
      <!-- 入库 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        v-if="sign==1"
        @row-click="toEdit"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="props_item" v-for="(v,k) in props.row.goodsinfo" :key="k">
              <span>入库产品：{{v.goods_name}}</span>
              <span>数量：{{v.number}}</span>
              <span>单价：{{v.in_cost}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock_no" label="单号"></el-table-column>
        <el-table-column prop="sdate" label="入库日期"></el-table-column>
        <el-table-column prop="stype" label="类型"></el-table-column>
        <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
        <el-table-column prop="amount" label="金额合计"></el-table-column>
        <el-table-column prop="allnum" label="数量合计" width="100"></el-table-column>
        <el-table-column prop="checkman" label="操作人"></el-table-column>
        <el-table-column label="操作时间" width="100">
          <template slot-scope="scope">{{Timer(scope.row.check_time)}}</template>
        </el-table-column>
      </el-table>
      <!-- 出库 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        v-if="sign==2"
        @row-click="toEdit"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="props_item" v-for="(v,k) in props.row.goodsinfo" :key="k">
              <span>出库产品：{{v.goods_name}}</span>
              <span>数量：{{v.number}}</span>
              <span>单价：{{v.in_cost}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock_no" label="单号"></el-table-column>
        <el-table-column prop="sdate" label="出库日期"></el-table-column>
        <el-table-column prop="stype" label="类型" width="150">
          <template slot-scope="scope">
            {{scope.row.stype}}
            <span
              style="color:#dc670b"
              v-show="scope.row.stype=='调拨出库'"
            >({{scope.row.db_status|dbtype}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
        <el-table-column prop="amount" label="金额合计"></el-table-column>
        <el-table-column prop="allnum" label="数量合计" width="100"></el-table-column>
        <el-table-column prop="checkman" label="操作人"></el-table-column>
        <el-table-column label="操作时间" width="100">
          <template slot-scope="scope">{{Timer(scope.row.check_time)}}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="set_page" :class="{activePage:pageIn}">
      <stroeIn @close="setInfo" v-if="pageIn" :setid="setid"></stroeIn>
    </div>
    <div class="set_page" :class="{activePage:pagedb}">
      <storeIndb @close="setInfo" v-if="pagedb" :info="dbInfo"></storeIndb>
    </div>
    <div class="set_page" :class="{activePage:pageOut}">
      <stroeOut @close="setInfo" v-if="pageOut" :setid="setid"></stroeOut>
    </div>

    <!-- 会员卡弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="待入库列表"
      :visible.sync="showOrder"
      width="60%"
      center
      :modal-append-to-body="false"
      custom-class="cardDialog quickmoney"
    >
      <el-table ref="cardTable" :data="OrderList" style="width: 100%" @row-click="choosed">
        <el-table-column width="55">
          <template slot-scope="{row}">
            <div class="seleted" :class="{active:chooseids.includes(row.order_id)}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="order_no" label="订单编号"></el-table-column>
        <el-table-column prop="number" label="产品数量"></el-table-column>
        <el-table-column prop="adt" label="订货日期"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showOrder = false">取 消</el-button>
        <el-button type="primary" @click="chooseSubmit">一键入库</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import stroeIn from './storeIn'
import storeIndb from './storeIndb'
import stroeOut from './storeOut'
import moment from 'moment'
export default {
  components: { stroeIn, stroeOut, storeIndb },
  props: {},
  data () {
    return {
      showOrder: false,
      OrderList: [],
      chooseids: [],
      value: '库存-入库单',
      date: '',
      type: 1,
      storeid: sessionStorage.getItem('storeid'),
      tableData: [],
      pageIn: false,
      pagedb: false,
      pageOut: false,
      notify: null,
      sign: 1,
      searchtxt: '',
      dbInfo: '',
      setid: ''
    }
  },
  watch: {
    value (data) {
      // console.log(data)
      if (data == '库存-入库单') {
        this.sign = 1
      } else {
        this.sign = 2
      }
      this.getDate()
    }
  },
  filters: {
    dbtype (val) {
      switch (val) {
        case '1':
          return '未接收';
        case '2':
          return '部分接收';
        case '3':
          return '全部接收';
        default:
          return ''
      }
    }
  },
  computed: {
  },
  methods: {
    checkOrder () {
      let params = {
        storeid: this.storeid
      }
      this.$axios.get('/apt?datatype=get_store_order', { params }).then(res => {
        console.log(res)
        if (res.data.list && res.data.list.length > 0) {
          this.OrderList = res.data.list
          this.showOrder = true
        } else {
          this.$message.error('暂无待入库订单')
        }
      })
    },
    chooseSubmit () {
      if (!this.chooseids.length) return this.$message.error('未选择入库订单')
      let params = {
        storeid: this.storeid,
        ids: this.chooseids,
        into_userid: JSON.parse(sessionStorage.getItem('userInfo')).id,
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username
      }
      this.$axios.get('/apt?datatype=import_store_order', {
        params
      }).then(res => {
        console.log(res)
        if (res.data.msg == '成功') {
          this.$message.success('成功')
          this.showOrder = false
          this.getDate()
        } else {
          this.$message.error('失败')
        }
      })
    },
    choosed (row) {
      if (this.chooseids.includes(row.order_id)) {
        this.chooseids = this.chooseids.filter(v => v != row.order_id)
      } else {
        this.chooseids.push(row.order_id)
      }
    },
    async getDate () {
      const res = await this.$axios.get('/api?datatype=get_stock_list', {
        params: {
          storeid: this.storeid,
          sign: this.sign,
          start: this.formatDate(new Date(this.date[0])),
          end: this.formatDate(new Date(this.date[1])),
          search: this.searchtxt ? this.searchtxt : null
        }
      })
      // console.log(res)
      this.tableData = []
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(item => {
          let allnum = 0
          if (item.goodsinfo) {
            item.goodsinfo.forEach(v => {
              allnum += Number(v.number)
            })
          }
          this.$set(item, 'allnum', allnum)
        })
        this.tableData = res.data.data
      }
    },
    setInfo (data) {
      // console.log(data)
      if (data == 1) {
        this.getDate()
      }
      this.pageIn = false
      this.pagedb = false
      this.pageOut = false
      this.setid = ''
      this.getdb()
    },
    Timer (date) {
      let time = Number(date)
      return moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    turnIn () {
      this.value = '库存-入库单'
      this.pageIn = true
      if (this.notify) {
        this.notify.close()
      }
    },
    turnOut () {
      this.value = '库存-出库单'
      this.pageOut = true
      if (this.notify) {
        this.notify.close()
      }
    },
    // 编辑删除
    toEdit (row) {
      this.setid = row.id
      if (this.sign == 1) {
        if (row.stype == '调拨入库') {
          return this.$message.error('已接收调拨单不可删除')
        } else {
          this.pageIn = true
        }
      } else {
        if (row.stype == '调拨出库' && row.db_status > 1) {
          return this.$message.error('已接收调拨单不可删除')
        } else {
          this.pageOut = true
        }
      }
    },
    getdb () {
      this.$axios.get('/api?datatype=get_db_count', {
        params: {
          storeid: this.storeid
        }
      }).then(res => {
        let that = this
        if (res.data.code == 1 && res.data.data) {
          if (res.data.data > 0) {
            this.notify = this.$notify({
              title: '提示',
              message: '您有' + res.data.data + '条调拨待处理，点此处理',
              type: 'warning',
              duration: 0,
              onClick: that.openIn,
              position: 'bottom-right'
            });
          }
        }
      })
    },
    openIn () {
      this.$axios.get('/api?datatype=get_db_onestock', {
        params: {
          storeid: this.storeid
        }
      }).then(res => {
        // console.log(res)
        this.dbInfo = res.data.data
        this.value = '库存-入库单'
        this.pagedb = true
        if (this.notify) {
          this.notify.close()
        }
      })
    }
  },
  beforeDestroy () {
    if (this.notify) {
      this.notify.close()
    }
  },
  created () {
    const a = new Date() + ''
    this.date = [a, a]
    this.getDate()
    this.getdb()
  },
  mounted () { }
}
</script>
<style>
#store .topView .one > .el-select input {
  width: 185px;
}
.dateView .el-input__inner {
  border: none;
}
</style>
<style lang="scss" scoped>
#store {
  .seleted {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
  }
  .active {
    background-color: rgb(133, 206, 97);
  }
  .topView {
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
  }
  .topView .one > .el-select input {
    width: 185px;
  }
  .dateView {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    color: #8a8a8a;
    cursor: pointer;
    padding-right: 25px;
    i {
      position: absolute;
      right: 50px;
      line-height: 40px;
    }
  }
  .btnView {
    flex: 1;
    text-align: right;
    button {
      width: 110px;
      height: 40px;
      margin-right: 10px;
    }
    .btn-green {
      padding: 0 10px;
      line-height: 40px;
      height: 40px;
      background: #dc670b;
      border-radius: 5px;
      font-size: 15px;
      color: #fff;
    }
    .btn-black {
      padding: 0 10px;
      line-height: 40px;
      height: 40px;
      background: #dc670b;
      border-radius: 5px;
      font-size: 15px;
      color: #fff;
    }
  }
  .contantView {
    height: calc(100% - 85px);
    padding: 0 20px;
  }
  /deep/ .el-table__expanded-cell {
    padding: 0;
  }
  .props_item {
    padding-left: 60px;
    line-height: 30px;
    background-color: #eee;
    &:nth-child(odd) {
      background-color: #ccc;
    }
    span {
      margin-right: 50px;
    }
  }
}
</style>
