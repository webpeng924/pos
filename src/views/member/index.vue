<template>
  <div class="member-index">
    <div class="topView">
      <div class="tView">会员基本资料</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <div class="member-content">
      <el-table :data="tableData" stripe header-row-class-name="table-header" height="90%">
        <el-table-column prop="account" label="会员编号" min-width="150"></el-table-column>
        <el-table-column prop="name" label="会员姓名" min-width="120"></el-table-column>
        <!-- <el-table-column prop="cardtype" label="会员类型" min-width="120"></el-table-column> -->
        <el-table-column label="性别" min-width="60">
          <template #default="{row}">{{ row.sex == 1 ? "男" : "女" }}</template>
        </el-table-column>
        <el-table-column prop="card_num" label="会员卡号" min-width="150"></el-table-column>
        <el-table-column label="归属门店" min-width="120">{{shopName}}</el-table-column>
        <el-table-column prop="mobile" label="手机号码" min-width="120"></el-table-column>
        <el-table-column label="累计卡销售" min-width="100">0</el-table-column>
        <el-table-column prop="balance" label="账户余额" min-width="100"></el-table-column>
        <el-table-column prop="instore_count" label="消费次数" min-width="80"></el-table-column>
        <el-table-column label="最后消费日期" min-width="120">
          <template #default="{row}">{{ row.last_time |time }}</template>
        </el-table-column>
        <el-table-column prop="card_addtime" label="开卡日期" min-width="110"></el-table-column>
        <el-table-column label="案例图" min-width="100">
          <template #default="{row}">
            <span class="icon" @click="detail(row)">查看更多</span>
          </template>
        </el-table-column>
        <el-table-column label="是否停用" min-width="100">
          <template #default="{row}">
            <el-switch
              v-model="row.sta"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template #default="{row}">
            <el-button type="danger" plain @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page_num"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page_size"
        layout=" sizes, prev, pager, next,total"
        :total="total"
        class="page"
      ></el-pagination>
    </div>
    <div class="set_page" :class="{activePage:dialogVisible}">
      <detail @close="dialogVisible=false" v-if="dialogVisible" :info="onceList"></detail>
    </div>
  </div>
</template>

<script>
import detail from './detail'
import moment from 'moment'
export default {
  components: { detail },
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      page_size: 10,
      page_num: 1,
      total: 0,
      shopName: JSON.parse(sessionStorage.getItem('shopInfo')).shop_name,
      storeid: sessionStorage.getItem('storeid'),
      onceList: []
    };
  },
  created () {
    this.getList();
  },
  filters: {
    time (val) {
      if (val != 0) {
        return moment.unix(val).format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  methods: {
    async getList () {
      const res = await this.$axios.get("/api?datatype=get_memberlist", {
        params: {
          storeid: this.storeid,
          page_size: this.page_size,
          sign: 1,
          page_num: this.page_num
        }
      });
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(item => {
          let flag = item.status == 3 ? false : true
          this.$set(item, 'sta', flag)
        })
        this.tableData = res.data.data;
        if (this.page_num == 1) {
          this.total = Number(res.data.count);
        }
      } else {
        this.tableData = []
      }
    },
    async detail (row) {
      this.onceList = row
      this.dialogVisible = true;
    },
    handleSizeChange (val) {
      this.page_size = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.page_num = val;
      this.getList();
    },
    changeStatus (row) {
      // console.log(row)
      let status = 3
      if (row.sta) {
        status = 1
      }
      this.tochange(status, row.member_id)
    },
    async tochange (status, id) {
      const res = await this.$axios.get('/api?datatype=set_member_status', {
        params: {
          storeid: this.storeid,
          member_id: id,
          status: status
        }
      })
      if (res.data.msg == '成功') {
        if (status == '9') {
          this.$message.success(res.data.msg)
          this.getList()
        } else {
          let msg = status == 3 ? '已停用' : '已启用'
          this.$message.success(msg)
        }
      } else {
        this.$message.error(res.data.msg)
      }
    },
    del (row) {
      this.$confirm('确认要删除此会员吗？此操作不可撤销，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tochange('9', row.member_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.member-index {
  height: 100%;
  .topView {
    position: relative;
    background: #fff;
    padding: 25px 0 15px 0;
    text-align: center;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    .tView {
      font-size: 24px;
      color: #28282d;
      line-height: 40px;
      text-align: center;
      width: 100%;
    }
    .btn-back {
      position: absolute;
      top: 25px;
      left: 15px;
    }
  }
  .member-content {
    padding: 50px;
    box-sizing: border-box;
    height: calc(100% - 85px);
    .icon {
      color: rgb(100, 180, 195);
    }
    .page {
      text-align: center;
      margin-top: 20px;
    }
  }
  .info {
    padding: 20px;
    .info-item {
      line-height: 40px;
      display: flex;
      span {
        &:first-child {
          width: 90px;
        }
        &:last-child {
          flex: 1;
          text-align: right;
        }
      }
    }
  }

  .member-header {
    height: 85px;
    font-size: 35px;
    text-align: center;
    line-height: 85px;
    border-bottom: 1px solid #000;
  }
  .el-table tr th {
    color: #fff;
    text-align: center;
    background-color: #46aae6;
  }
  th:nth-of-type(1) {
    border-radius: 10px 0 0 0;
  }
  th:nth-last-of-type(2) {
    border-radius: 0 10px 0 0;
  }
  .el-table tr td {
    text-align: center;
  }
}
</style>
