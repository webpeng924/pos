<template>
  <div class="churutongji">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="$emit('close')"></button>
      <div class="tView">
        <p>员工业绩排行</p>
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
      <el-table :data="tableData" height="100%" show-summary ref="table">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="job_no" label="员工编号" min-width="100"></el-table-column>
        <el-table-column prop="name" label="员工姓名" min-width="100"></el-table-column>
        <el-table-column prop="job" label="员工职位" min-width="80"></el-table-column>
        <el-table-column label="项目">
          <el-table-column prop="xm_num" label="次数" min-width="100" sortable></el-table-column>
          <el-table-column prop="xm_sub" label="业绩" min-width="100" sortable></el-table-column>
        </el-table-column>
        <el-table-column label="产品">
          <el-table-column prop="cp_num" label="数量" min-width="100" sortable></el-table-column>
          <el-table-column prop="cp_sub" label="业绩" min-width="100" sortable></el-table-column>
        </el-table-column>
        <el-table-column prop="sum" label="总业绩" min-width="100" sortable></el-table-column>
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
      storeid: sessionStorage.getItem('storeid'),
      tableData: []
    }
  },
  updated () {
    this.$refs.table.doLayout();
  },
  methods: {
    getList () {
      this.$axios.get('/apt?datatype=table_staff_achievement', {
        params: {
          storeid: this.storeid,
          start: this.date[0],
          end: this.date[1]
        }
      }).then(res => {
        if (res.data.code == 1 && res.data.list) {
          res.data.list.forEach(item => {
            item['xm_num'] = 0
            item['cp_num'] = 0
            item['xm_sub'] = 0
            item['cp_sub'] = 0
            if (item.info) {
              item.info.forEach(v => {
                if (v.typeid == 2) {
                  item['cp_num'] = Number(v.s_num)
                  item['cp_sub'] = Number(v.s_subtotal)
                }
                if (v.typeid == 1 || v.typeid == 3) {
                  item['xm_num'] += Number(v.s_num)
                  item['xm_sub'] += Number(v.s_subtotal)
                }
              })
            }
          })
          this.tableData = res.data.list
        } else {
          this.tableData = []
        }
      })
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
