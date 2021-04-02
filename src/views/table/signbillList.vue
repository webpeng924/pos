<template>
  <div class="churutongji">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="$emit('close')"></button>
      <div class="tView">
        <p>会员签帐汇总(默认当月)</p>
        <div class="dateView">
          <el-date-picker
            v-model="date"
            type="daterange"
            prefix-icon="a"
            :clearable="false"
            range-separator="-"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <div class="bomView">
      <el-table :data="tableData" height="100%" ref="table">
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="card_num" label="会员卡号" min-width="120"></el-table-column>
        <el-table-column prop="name" label="会员姓名" min-width="120"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" min-width="120"></el-table-column>
        <el-table-column prop="signbill" label="总签帐" min-width="100"></el-table-column>
        <el-table-column>
          <template #default="{row}">
            <el-button type="danger" plain @click="detail(row)">签帐明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="签帐明细"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      custom-class="Dialog"
    >
      <el-table :data="detailData" height="100%">
        <el-table-column property="date" label="日期"></el-table-column>
        <el-table-column property="order_no" label="单号"></el-table-column>
        <el-table-column property="money" label="金额"></el-table-column>
      </el-table>
    </el-dialog>
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
      detailDialog: false,
      detailData: [],
      tableData: []
    }
  },
  updated () {
    this.$refs.table.doLayout();
  },
  methods: {
    getList () {
      this.$axios.get('/apt?datatype=table_signbill', {
        params: {
          storeid: this.storeid,
          starttime: this.date[0],
          endtime: this.date[1],
        }
      }).then(res => {
        if (res.data.code == 1 && res.data.list) {
          this.tableData = res.data.list
        } else {
          this.tableData = []
        }
      })
    },
    detail (row) {
      this.$axios.get('/apt?datatype=table_signbill_detail', {
        params: {
          storeid: this.storeid,
          member_id: row.member_id,
          starttime: this.date[0],
          endtime: this.date[1],
        }
      }).then(res => {
        if (res.data.code == 1 && res.data.list) {
          this.detailData = res.data.list
          this.detailData.forEach(item => {
            item['date'] = moment.unix(item.dateline).format('YYYY-MM-DD HH:mm:ss')
          })
          this.detailDialog = true
        } else {
          this.detailData = []
          this.$message.error('暂无数据')
        }
      })
    }
  },
  watch: {
    date () {
      this.getList();
    },
  },
  created () {
    let date = []
    let start = moment().add('month', 0).format('YYYY-MM') + '-01'
    let end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    this.date = date
  },
  mounted () { },
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
