<template>
  <div class="churutongji">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="$emit('close')"></button>
      <div class="tView">
        <p>会员卡销售统计表</p>
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
        <el-table-column prop="date" label="卡类别编号" min-width="100"></el-table-column>
        <el-table-column prop="date" label="卡类别名称" min-width="100"></el-table-column>
        <el-table-column prop="date" label="数量" min-width="80"></el-table-column>
        <el-table-column prop="date" label="售卡金额" min-width="100"></el-table-column>
        <el-table-column label="本卡本店">
          <el-table-column prop="date" label="储值销售" min-width="100"></el-table-column>
          <el-table-column prop="date" label="次卡销售" min-width="100"></el-table-column>
          <el-table-column prop="date" label="套餐销售" min-width="100"></el-table-column>
          <el-table-column prop="date" label="储值消费" min-width="100"></el-table-column>
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
