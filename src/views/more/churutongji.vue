<template>
  <div class="churutongji">
    <div class="topView">
      <button class="btn-close btn-audio" @click="$emit('close')"></button>
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
        <el-table-column prop="date" label="产品编号" width="100"></el-table-column>
        <el-table-column prop="date" label="产品名称" width="100"></el-table-column>
        <el-table-column prop="date" label="单位" width="80"></el-table-column>
        <el-table-column prop="date" label="期初量" width="100"></el-table-column>
        <el-table-column prop="date" label="金额" width="100"></el-table-column>
        <el-table-column label="入库明细">
          <el-table-column prop="name" label="正常入库量" width="100"></el-table-column>
          <el-table-column label="盘盈入库量" width="100"></el-table-column>
          <el-table-column label="客户退货量" width="100"></el-table-column>
          <el-table-column label="调拨入库量" width="100"></el-table-column>
        </el-table-column>
        <el-table-column prop="date" label="入库合计" width="100"></el-table-column>
        <el-table-column label="出库明细">
          <el-table-column prop="name" label="正常出库量" width="100"></el-table-column>
          <el-table-column label="销售量" width="100"></el-table-column>
          <el-table-column label="盘亏出库量" width="100"></el-table-column>
          <el-table-column label="供应商退货量" width="110"></el-table-column>
          <el-table-column label="调拨出库量" width="100"></el-table-column>
          <el-table-column label="赠送量" width="100"></el-table-column>
          <el-table-column label="损坏量" width="100"></el-table-column>
        </el-table-column>
        <el-table-column prop="date" label="出库合计" width="100"></el-table-column>
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
      tableData: []
    }
  },
  methods: {
    getList () { }
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
    .btn-close {
      width: 40px;
      height: 40px;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_X_Black.png)
        left center / 24px no-repeat;
    }
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
      background: #fff
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Add.png)
        center / 28px no-repeat;
    }
    .btn-filter {
      width: 40px;
      height: 40px;
      background: #fff
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Filter.png)
        center / 28px no-repeat;
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
