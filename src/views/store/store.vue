<template>
  <div id="store">
    <div class="topView">
      <div class="one">
        <el-select v-model="value">
          <el-option value="库存-入库单">库存-入库单</el-option>
          <el-option value="库存-出库单">库存-出库单</el-option>
        </el-select>
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
        v-if="value=='库存-入库单'"
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
        <el-table-column label="数量合计" width="100">
          <template slot-scope="scope">{{scope.row.goodsinfo?scope.row.goodsinfo.length:0}}</template>
        </el-table-column>
        <el-table-column prop="checkman" label="操作人"></el-table-column>
        <el-table-column label="操作时间" width="100">
          <template slot-scope="scope">{{Timer(scope.row.check_time)}}</template>
        </el-table-column>
      </el-table>
      <!-- 出库 -->
      <el-table :data="tableData" style="width: 100%" height="100%" v-else @row-click="toEdit">
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
        <el-table-column prop="stype" label="类型"></el-table-column>
        <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
        <el-table-column prop="amount" label="金额合计"></el-table-column>
        <el-table-column prop="address" label="数量合计" width="100">
          <template slot-scope="scope">{{scope.row.goodsinfo?scope.row.goodsinfo.length:0}}</template>
        </el-table-column>
        <el-table-column prop="checkman" label="操作人"></el-table-column>
        <el-table-column label="操作时间" width="100">
          <template slot-scope="scope">{{Timer(scope.row.check_time)}}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="set_page" :class="{activePage:pageIn}">
      <stroeIn @close="setInfo" v-if="pageIn" :setid="setid"></stroeIn>
    </div>

    <div class="set_page" :class="{activePage:pageOut}">
      <stroeOut @close="setInfo" v-if="pageOut" :setid="setid"></stroeOut>
    </div>
  </div>
</template>

<script>
import stroeIn from './storeIn'
import stroeOut from './storeOut'
import moment from 'moment'
export default {
  components: { stroeIn, stroeOut },
  props: {},
  data () {
    return {
      value: '库存-入库单',
      date: '',
      type: 1,
      storeid: sessionStorage.getItem('storeid'),
      tableData: [],
      pageIn: false,
      pageOut: false,
      sign: 1,
      setid: ''
    }
  },
  watch: {
    value (data) {
      console.log(data)
      if (data == '库存-入库单') {
        this.sign = 1
      } else {
        this.sign = 2
      }
      this.getDate()
    }
  },
  computed: {
  },
  methods: {
    async getDate () {
      const res = await this.$axios.get('/api?datatype=get_stock_list', {
        params: {
          storeid: this.storeid,
          sign: this.sign,
          start: this.formatDate(new Date(this.date[0])),
          end: this.formatDate(new Date(this.date[1]))
        }
      })
      console.log(res)
      this.tableData = []
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
      }
    },
    setInfo (data) {
      console.log(data)
      if (data == 1) {
        this.getDate()
      }
      this.pageIn = false
      this.pageOut = false
      this.setid = ''
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
    },
    turnOut () {
      this.value = '库存-出库单'
      this.pageOut = true
    },
    // 编辑删除
    toEdit (row) {
      this.setid = row.id
      if (this.sign == 1) {
        this.pageIn = true
      } else {
        this.pageOut = true
      }
    }
  },
  created () {
    const a = new Date() + ''
    this.date = [a, a]
    this.getDate()
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
    // background: #fff
    //   url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Next.png) right
    //   center / 28px no-repeat;
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
