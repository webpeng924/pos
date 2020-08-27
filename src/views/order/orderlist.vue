<template>
  <div class="orderlist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="$emit('close')"></button>
      <div class="tView">员工预约/占用记录</div>
    </div>
    <div class="bView">
      <div class="left">
        <div class="title">选择员工</div>
        <div class="list">
          <div
            class="item"
            v-for="(v,k) in workerlist"
            :key="k"
            :class="{active:active==v.id}"
            @click="getyy(v.id)"
          >
            <p>{{v.name}}</p>
            <p>NO:{{v.job_no}}</p>
          </div>
        </div>
      </div>
      <div class="right">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="100%"
        >
          <el-table-column label="类型" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.customer_type==0?'占用':'预约'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="yytime" label="时间" show-overflow-tooltip min-width="200"></el-table-column>
          <el-table-column label="时长" min-width="100">1小时</el-table-column>
          <el-table-column prop="itemname" label="项目名称" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">{{scope.row.status|type}}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="250"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      active: '',
      storeid: sessionStorage.getItem('storeid'),
      workerlist: [],
      tableData: []
    }
  },
  methods: {
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
        this.active = res.data.data[0].id
        this.getyy(res.data.data[0].id)
      }
    },
    async getyy (id) {
      this.active = id
      this.tableData = []
      const res = await this.$axios.get('/api?datatype=get_yy2_list', {
        params: {
          storeid: this.storeid,
          staffid: id
        }
      })
      if (res.data.code == 1) {
        this.tableData = res.data.data
      }
    },
    tableRowClassName ({ row }) {
      if (row.status == 1) {
        return 'success-row';
      } else if (row.status == 2) {
        return 'warning-row';
      }
      else if (row.status == 3) {
        return 'gery-row';
      }
      return '';
    }
  },
  filters: {
    type (val) {
      switch (val) {
        case '1':
          return '已开单';
        case '2':
          return '已取消';
        case '3':
          return '已过期';
        case '4':
          return '已占用';
        default:
          return '已预约'
      }
    }
  },
  created () {
    this.getworkerlist()
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style>
.el-table .warning-row {
  background: rgba(255, 208, 208, 0.664);
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .gery-row {
  background: #fafafa;
}
</style>

<style lang="scss" scoped>
.orderlist {
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
    position: relative;
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
    }
    .checkbox {
      position: absolute;
      right: 80px;
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
      background: #fff
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Add.png)
        center / 28px no-repeat;
    }
  }
  .bView {
    height: calc(100% - 85px);
    display: flex;
    .left {
      width: 200px;
      height: 100%;
      border-right: 1px solid rgba(220, 220, 220, 0.7);
      text-align: center;
      .title {
        font-size: 18px;
        padding: 15px;
        height: 60px;
        text-align: left;
        // font-weight: 700;
        color: #dc670b;
        border-bottom: 1px solid #eee;
      }
      .list {
        height: calc(100% - 60px);
        overflow: auto;
      }
      .item {
        font-size: 16px;
        border-bottom: 1px solid #eee;
        padding: 18px;
        box-sizing: border-box;
        height: 80px;
        &.active {
          background-color: #ff9a4a;
          color: #fff;
        }
      }
    }
    .right {
      flex: 1;
      height: 100%;
      padding-left: 20px;
    }
  }
}
</style>
