<template>
  <div id="prolist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">
        库存量统计
        <!-- <p>{{date}}</p> -->
      </div>
      <el-input placeholder="请输入产品编号/名称" v-model="searchtxt" style="width:260px" @input="getCPlist">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <!-- <el-button slot="append" icon="el-icon-search" @click="getCPlist">搜索</el-button> -->
      </el-input>
      <!-- <i class="el-icon-date" @click="openDate"></i>
       <el-dialog :close-on-click-modal="false"  :visible.sync="dialogVisible" :modal="false" style="height:0;margin-top:10%">
        <el-date-picker v-model="date" type="date" ref="date" value-format="yyyy年MM月dd日"></el-date-picker>
      </el-dialog>-->
    </div>
    <div class="bomView">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="100%"
        show-summary
        ref="table"
        :summary-method="getSummaries"
      >
        <el-table-column prop="goods_no" label="产品编号"></el-table-column>
        <el-table-column prop="goods_name" label="产品名称"></el-table-column>
        <el-table-column prop="title" label="统计类别"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="in_cost" label="成本价"></el-table-column>
        <el-table-column prop="in_costSum" label="成本合计"></el-table-column>
        <el-table-column prop="price" label="售价"></el-table-column>
        <el-table-column prop="priceSum" label="售价合计"></el-table-column>
        <el-table-column prop="goods_unit" label="产品规格"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      dialogVisible: false,
      date: '',
      searchtxt: '',
      storeid: sessionStorage.getItem('storeid'),
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // console.log(column)
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value)) && (column['label'] == '数量' || column['label'] == '成本合计' || column['label'] == '售价合计')) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '.';
        }
      });
      return sums;
    },
    async getCPlist () {
      const res = await this.$axios.get('/api?datatype=get_skulist', {
        params: {
          storeid: this.storeid,
          search: this.searchtxt,
          type: 1
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          item['in_costSum'] = item.number * item.in_cost
          item['priceSum'] = item.number * item.price
        })
      } else {
        this.tableData = []
      }
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '年' + m + '月' + d + '日'
    },
    openDate () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.date.focus()
      })
    }
  },
  updated () {
    this.$refs.table.doLayout();
  },
  created () {
    // let a = this.formatDate(new Date())
    // this.date = a
    this.getCPlist()
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#prolist {
  height: 100%;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    height: 85px;
    line-height: 40px;
    background: #fff;
    text-align: center;

    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
      p {
        line-height: 20px;
        &:last-child {
          font-size: 16px;
          padding-top: 5px;
        }
      }
    }
    .el-input {
      width: 300px;
    }
    .el-icon-date {
      font-size: 30px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .bomView {
    padding: 0 20px;
    height: calc(100% - 85px);
  }
}
</style>
