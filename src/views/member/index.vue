<template>
  <div class="member-index">
    <div class="topView">
      <div class="tView">会员基本资料</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <div class="member-content">
      <el-table :data="tableData" stripe header-row-class-name="table-header">
        <el-table-column prop="account" label="会员编号" width="180"></el-table-column>
        <el-table-column prop="name" label="会员名称"></el-table-column>
        <el-table-column prop="account" label="会员卡号"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="cardtype" label="会员类型"></el-table-column>
        <el-table-column prop="balance" label="余额"></el-table-column>

        <el-table-column label="性别">
          <template #default="{row}">{{ row.sex == 1 ? "男" : "女" }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="{row}">
            <span class="icon" @click="detail(row)">查看详情</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page_num"
        :page-sizes="[1, 10, 15, 20]"
        :page-size="page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="2"
        class="page"
      ></el-pagination>
    </div>
    <el-dialog
      title="会员基本信息"
      width="30%"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <div class="info">
        <div class="info-item">
          <span>会员编号：</span>
          <span>{{ onceList.account }}</span>
        </div>
        <div class="info-item">
          <span>会员名称；</span>
          <span>{{ onceList.name }}</span>
        </div>
        <div class="info-item">
          <span>会员卡号：</span>
          <span>{{ onceList.account }}</span>
        </div>
        <div class="info-item">
          <span>手机号码：</span>
          <span>{{ onceList.mobile }}</span>
        </div>
        <div class="info-item">
          <span>会员类型：</span>
          <span>{{ onceList.cardtype }}</span>
        </div>
        <div class="info-item">
          <span>余 额：</span>
          <span>{{ onceList.balance }}</span>
        </div>
        <div class="info-item">
          <span>性 别：</span>
          <span>{{ onceList.sex == 1 ? "男" : "女" }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      page_size: 1,
      page_num: 1,
      total: "",
      onceList: []
    };
  },
  created () {
    this.getList();
  },
  methods: {
    async getList () {
      const res = await this.$axios.get("/api?datatype=get_memberlist", {
        params: {
          storeid: 1,
          page_size: this.page_size,
          page_num: this.page_num
        }
      });
      if (res.data.code == 1) {
        this.tableData = res.data.data;
        this.total = res.data.count;
      }
    },
    detail (row) {
      this.onceList = row;
      this.dialogVisible = true;
    },
    handleSizeChange (val) {
      this.page_size = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.page_num = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.member-index {
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
