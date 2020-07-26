<template>
  <div id="prolist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">
        <span class="el-dropdown-link">
          {{ title }}
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <!-- <el-dropdown @command="handleCommand">
         
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="营收明细">营收明细</el-dropdown-item>
            <el-dropdown-item command="卡项明细">卡项明细</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
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
    <div class="menuView" v-show="title == '营收明细'">
      <div class="menuItem btn-audio" @click="chos = 3" :class="{ select: chos == 3 }">
        <label>收银</label>
      </div>
      <div class="menuItem btn-audio" @click="chos = 2" :class="{ select: chos == 2 }">
        <label>卖卡</label>
      </div>
      <div class="menuItem btn-audio" @click="chos = 1" :class="{ select: chos == 1 }">
        <label>充值</label>
      </div>
      <!-- <div
        class="menuItem btn-audio"
        :class="{ select: chos == 2 }"
        @click="chos = 2"
      >
        <label>项目</label>
      </div>-->
    </div>
    <!-- <div class="menuView" v-show="title == '卡项明细'">
      <div
        class="menuItem btn-audio"
        :class="{ select: chos == 1 }"
        @click="chos = 1"
      >
        <label class="select">全部</label>
      </div>
      <div
        class="menuItem btn-audio"
        :class="{ select: chos == 3 }"
        @click="chos = 3"
      >
        <label class>开卡</label>
      </div>
      <div
        class="menuItem btn-audio"
        :class="{ select: chos == 4 }"
        @click="chos = 4"
      >
        <label class>充值</label>
      </div>
      <div
        class="menuItem btn-audio"
        :class="{ select: chos == 5 }"
        @click="chos = 5"
      >
        <label class>还款</label>
      </div>
      <div
        class="menuItem btn-audio"
        :class="{ select: chos == 6 }"
        @click="chos = 6"
      >
        <label class>退款</label>
      </div>
    </div>-->
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" height="100%">
        <el-table-column prop="type" label="类型" width="80"></el-table-column>
        <el-table-column label="单号" width="150">
          <template slot-scope="scope">
            {{
            scope.row.pay_sn ? scope.row.pay_sn : scope.row.order_no
            }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="结账时间">
          <template slot-scope="scope">
            {{
            scope.row.dateline && scope.row.dateline | time
            }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户信息">
          <template slot-scope="scope">{{ scope.row.name?scope.row.name:'散客' }}</template>
        </el-table-column>
        <el-table-column prop="address" label="消费内容">
          <template slot-scope="scope">
            <!-- {{ scope.row.iteminfo }} -->
            <p v-for="(item, index) in scope.row.iteminfo" :key="index">{{ item.itemname }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type">
              {{
              scope.row.pay_type | paytype
              }}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="金额"></el-table-column>
        <!-- <el-table-column prop="address" width="50">
          <i class="el-icon-arrow-right"></i>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="bomView" v-show="0">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="名称" width="150"></el-table-column>
        <el-table-column prop="name" label="数量"></el-table-column>
        <el-table-column prop="address" label="均价"></el-table-column>
        <el-table-column prop="address" label="总金额"></el-table-column>
        <el-table-column prop="address" label="现金金额"></el-table-column>
        <el-table-column prop="address" label="卡付金额"></el-table-column>
        <el-table-column prop="address" label="男客"></el-table-column>
        <el-table-column prop="address" label="女客"></el-table-column>
        <el-table-column prop="address" label="营业占比"></el-table-column>
      </el-table>
    </div>
    <!-- <div class="bomView" v-show="title == '卡项明细'">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="时间"></el-table-column>
        <el-table-column prop="name" label="单号"></el-table-column>
        <el-table-column prop="address" label="姓名"></el-table-column>
        <el-table-column prop="address" label="手机号"></el-table-column>
        <el-table-column prop="address" label="卡号"></el-table-column>
        <el-table-column prop="address" label="卡类别"></el-table-column>
        <el-table-column prop="address" label="账户类别"></el-table-column>
        <el-table-column prop="address" label="业务类别"></el-table-column>
        <el-table-column prop="address" label="总金额"></el-table-column>
        <el-table-column prop="address" label="操作">
          <el-button @click="receiptVisible = true">详情</el-button>
        </el-table-column>
      </el-table>
    </div>-->
    <div class="set_page" :class="{ activePage: add }">
      <addPro @close="add = false"></addPro>
    </div>

    <!-- 详情 -->
    <div class="receipt">
      <el-dialog
        :visible.sync="receiptVisible"
        width="35%"
        custom-class="receipt-box"
        :modal-append-to-body="false"
      >
        <span slot="title">单据详情</span>
        <div class="bigLine"></div>
        <div class="line"></div>
        <div class="receipt-header">
          <div class="cell">
            <span>水单号：</span>
            <span>2013123123</span>
          </div>
          <div class="cell">
            <span>时间：</span>
            <span>20200808 09281</span>
          </div>
        </div>
        <div class="receipt-content">
          <div class="cell">
            <span>卡类型：</span>
            <span>会员卡</span>
          </div>
          <div class="cell">
            <span>卡号：</span>
            <span>12345678</span>
          </div>
          <div class="cell">
            <span>姓名：</span>
            <span>小明</span>
          </div>
          <div class="cell">
            <span>手机号：</span>
            <span>138123123123</span>
          </div>
        </div>
        <div class="receipt-bottom">
          <div class="cell">
            <span>业务类别：</span>
            <span>卡销售</span>
          </div>
          <div class="cellOnly cell">
            <span>金额分类：</span>
            <div class="cell-price">
              <div class="price-item">
                <p>储值销售</p>
                <p>¥0</p>
              </div>
              <div class="price-item">
                <p>储值金额</p>
                <p>¥0</p>
              </div>
              <div class="price-item">
                <p>品项金额</p>
                <p>¥4320</p>
              </div>
              <div class="price-item">
                <p>合计金额</p>
                <p>¥4320</p>
              </div>
            </div>
          </div>
          <div class="cell">
            <span>销售人员：</span>
            <span>李廊坊（1）</span>
          </div>
          <div class="cell">
            <span>支付方式：</span>
            <span>现金：4320</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import addPro from "@/components/addpro.vue";
import moment from "moment";
export default {
  components: { addPro },
  props: {},
  data () {
    return {
      date: "",
      item: 1,
      tableData: [],
      add: false,
      title: "营收明细",
      chos: 3,
      option: [
        { text: "收银", value: "收银" },
        { text: "售卡", value: "售卡" },
        { text: "充值", value: "充值" }
      ],
      receiptVisible: false
    };
  },
  watch: {
    date () {
      this.getList();
    },
    chos () {
      this.getList();
    }
  },
  computed: {},
  methods: {
    formatDate (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    back () {
      this.$emit("close");
    },
    handleCommand (command) {
      this.title = command;
    },
    filterType (val) {
      console.log(val);
    },
    async getList () {
      const res = await this.$axios("/api?datatype=get_store_moneydetail", {
        params: {
          storeid: 1,
          type: this.chos,
          start: this.date[0],
          end: this.date[1]
        }
      });
      if (res.code !== 1 && !res.data.data) return this.tableData = [];
      this.tableData = res.data.data;
    }
  },
  created () {
    const a = this.formatDate(new Date());
    this.date = [a, a];
  },
  mounted () { },
  filters: {
    time (value) {
      return moment.unix(value).format("YYYY-MM-DD");
    },
    paytype (val) {
      switch (val) {
        case "wx":
          return "微信";
        case "zfb":
          return "支付宝";
        case "cash":
          return "现金";
        case "signbill":
          return "会员签账";
        case "card":
          return "储值账户";
        default:
          return "其他";
      }
    }
  }
};
</script>

<style>
.el-table__column-filter-trigger i {
  font-size: 16px;
  font-weight: 700;
}
</style>

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
    .btn-close {
      width: 40px;
      height: 40px;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_X_Black.png)
        left center / 24px no-repeat;
    }
    .tView {
      flex: 1;
      .el-dropdown {
        font-size: 24px;
      }
      color: #28282d;
      font-family: PingFangSC-Semibold;
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
  .bomView {
    height: calc(100% - 150px);
    padding: 0 20px;
  }
  // 详情样式
  /deep/ .receipt-box {
    padding: 0 10px;
    height: 700px;
    overflow: hidden;
    // background: transparent
    //   url(https://static.bokao2o.com/wisdomDesk/images/Def_Bc_ReporTop.png)
    //   center top / 100% 6px no-repeat;
    .receipt-title {
      text-align: center;
    }
    .bigLine {
      width: 100%;
      height: 5px;
      background: #5a5a5a;
    }
    .line {
      margin-top: 3px;
      width: 100%;
      height: 3px;
      background-color: #5c5c5c;
    }
    .receipt-header {
      border-bottom: 1px dashed #e6e6e6;
    }
    .receipt-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px dashed #e6e6e6;
      .cell {
        width: 50%;
      }
    }
    .receipt-bottom {
      .cellOnly {
        display: flex;
        .cell-price {
          .price-item {
            display: flex;
            p {
              margin: 0;
              padding: 5px 0;
            }
            p:nth-of-type(2) {
              margin-left: 100px;
            }
          }
        }
      }
    }
    .cell {
      font-size: 14px;
      padding: 10px 0;
      span:nth-of-type(1) {
        color: #8a8a8a;
        margin-right: 15px;
      }
    }
  }
}
</style>
