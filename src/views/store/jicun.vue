<template>
  <div id="projectlist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">产品寄存</div>
      <el-input
        v-model="searchtxt"
        placeholder="请输入单号/会员编号/姓名/手机号"
        style="width:280px;margin-right:20px"
        clearable
        @change="getList"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" @click="getList"></i>
      </el-input>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="add=true">新增</button>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <add
        @close="add=false;choose='';getList()"
        :setid="choose.id"
        v-if="add"
        :membername="choose.name"
      ></add>
    </div>
    <div class="set_page" :class="{activePage:addOut}">
      <addOut
        @close="addOut=false;choose='';type= '',getList()"
        :setid="choose.id"
        v-if="addOut"
        :membername="choose.name"
        :memberid="choose.member_id"
        :type="type"
      ></addOut>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" height="100%" ref="refTable">
        <el-table-column prop="stock_no" label="单号"></el-table-column>
        <el-table-column prop="card_num" label="会员卡号"></el-table-column>
        <el-table-column prop="name" label="会员姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="jicun_date" label="日期"></el-table-column>
        <el-table-column prop="checkman" label="操作人"></el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-button v-show="scope.row.type=='寄存'" type="primary" @click="toEdit(scope.row)">领取</el-button>
            <p v-show="scope.row.type!='寄存'"></p>
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope">
            <el-button @click="Open(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import add from './addjicun'
import addOut from './addlinqu'
export default {
  components: { add, addOut },
  props: [],
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      type: '',
      addOut: false,
      status: 0,
      drawer: false,
      cate: '',
      catetitle: '全部',
      searchtxt: '',
      choose: '',
      cateList: [],
      storeid: sessionStorage.getItem('storeid')
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_membergoods_list', {
        params: {
          storeid: this.storeid,
          keyword: this.searchtxt
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
    rowClick (row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    // 领取
    toEdit (row) {
      // console.log(row)
      this.choose = row
      this.addOut = true
      this.type = '领取'
    },
    // 查看
    Open (row) {
      if (row.type == '领取') {
        this.choose = row
        this.addOut = true
      } else {
        this.choose = row
        this.add = true
      }
      // console.log(row)
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    }
  },
  created () {
    this.getList()
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#projectlist {
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
    height: calc(100% - 105px);
    padding: 0 20px 20px;
  }
  .drawerlist {
    padding: 0 20px;
    font-size: 16px;
    .draweritem {
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .el-switch {
        margin-top: 15px;
      }
    }
  }
}
</style>
