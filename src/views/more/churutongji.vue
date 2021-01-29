<template>
  <div class="churutongji">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="$emit('close')"></button>
      <div class="tView">
        <p>出入库统计</p>
        <div class="dateView">
          <el-date-picker
            v-model="date"
            type="daterange"
            prefix-icon="a"
            :clearable="false"
            range-separator="-"
            format="yyyy年MM月dd日"
            @change="getList"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <div class="bomView">
      <el-table :data="tableData" height="100%">
        <el-table-column prop="goods_id" label="产品编号" width="80"></el-table-column>
        <el-table-column prop="goods_name" label="产品名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_unit" label="单位" width="80"></el-table-column>
        <el-table-column prop="old_num" label="期初量" width="100"></el-table-column>
        <!-- <el-table-column prop="date" label="金额" width="100"></el-table-column> -->
        <el-table-column label="入库明细">
          <el-table-column label="正常入库量" width="100">
            <template slot-scope="scope">{{scope.row.正常入库==null?0:scope.row.正常入库}}</template>
          </el-table-column>
          <el-table-column prop="盘盈入库" label="盘盈入库量" width="100">
            <template slot-scope="scope">{{scope.row.盘盈入库==null?0:scope.row.盘盈入库}}</template>
          </el-table-column>
          <el-table-column prop="客户退货" label="客户退货量" width="100">
            <template slot-scope="scope">{{scope.row.客户退货==null?0:scope.row.客户退货}}</template>
          </el-table-column>
          <el-table-column prop="调拨入库" label="调拨入库量" width="100">
            <template slot-scope="scope">{{scope.row.调拨入库==null?0:scope.row.调拨入库}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="into_sum" label="入库合计" width="100">
          <template slot-scope="scope">{{scope.row.into_sum==null?0:scope.row.into_sum}}</template>
        </el-table-column>
        <el-table-column label="出库明细">
          <el-table-column prop="正常出库" label="正常出库量" width="100">
            <template slot-scope="scope">{{scope.row.正常出库==null?0:scope.row.正常出库}}</template>
          </el-table-column>
          <el-table-column prop="销售量" label="销售量" width="100">
            <template slot-scope="scope">{{scope.row.销售量==null?0:scope.row.销售量}}</template>
          </el-table-column>
          <el-table-column prop="盘亏出库" label="盘亏出库量" width="100">
            <template slot-scope="scope">{{scope.row.盘亏出库==null?0:scope.row.盘亏出库}}</template>
          </el-table-column>
          <el-table-column prop="供应商退货" label="供应商退货量" width="110">
            <template slot-scope="scope">{{scope.row.供应商退货==null?0:scope.row.供应商退货}}</template>
          </el-table-column>
          <el-table-column prop="调拨出库" label="调拨出库量" width="100">
            <template slot-scope="scope">{{scope.row.调拨出库==null?0:scope.row.调拨出库}}</template>
          </el-table-column>
          <el-table-column prop="赠送" label="赠送量" width="100">
            <template slot-scope="scope">{{scope.row.赠送==null?0:scope.row.赠送}}</template>
          </el-table-column>
          <el-table-column prop="损坏" label="损坏量" width="100">
            <template slot-scope="scope">{{scope.row.损坏==null?0:scope.row.损坏}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="out_sum" label="出库合计" width="100">
          <template slot-scope="scope">{{scope.row.out_sum==null?0:scope.row.out_sum}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  components: {},
  props: {},
  data () {
    return {
      date: '',
      tableData: [],
      storeid: sessionStorage.getItem('storeid')
    }
  },
  methods: {
    async getList () {
      const res = await this.$axios.get('/apt?datatype=table_stock', {
        params: {
          storeid: this.storeid,
          start: this.date[0],
          end: this.date[1]
        }
      })
      if (res.data.code == 1 && res.data.list != null) {
        res.data.list.forEach(item => {
          if (item.into_arr != null) {
            item.into_arr.forEach(v => {
              item[v.into_type] = v.type_sum
            })
          }
          if (item.out_arr != null) {
            item.out_arr.forEach(v => {
              item[v.out_type] = v.type_sum
            })
          }
        })
        this.tableData = res.data.list
      } else {
        this.tableData = []
      }
    }
  },
  created () {
    const a = moment(new Date).format('YYYY-MM-DD')
    this.date = [a, a]
    this.getList()
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.churutongji {
  height: 100%;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    height: 105px;
    line-height: 55px;
    background: #fff;
    text-align: center;

    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
      /deep/.el-input__inner {
        border: none;
      }
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
    }
  }
  .bomView {
    padding: 0 10px;
    height: calc(100% - 108px);
  }
  /deep/.el-table thead.is-group th {
    text-align: center;
  }
}
</style>
