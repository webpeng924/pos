<template>
  <div id="projectlist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">
        <p>库存盘点</p>
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
          <!-- <i class="el-icon-arrow-right"></i> -->
        </div>
      </div>
      <el-input
        v-model="searchtxt"
        placeholder="请输入产品名称"
        style="width:180px;margin-right:20px"
        clearable
        @change="getList"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" @change="getList"></i>
      </el-input>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="add=true">新增</button>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <add @close="add=false;getList()" :setid="choose" v-if="add"></add>
    </div>
    <div class="bomView">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="100%"
        @row-click="rowClick"
        ref="refTable"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="props_item" v-for="(v,k) in props.row.goodsinfo" :key="k">
              <span>产品名称：{{v.goods_name}}</span>
              <span>盘点前数量：{{v.old_num}}</span>
              <span>当前数量：{{v.number}}</span>
              <span>差值：{{v.new_num}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock_no" label="盘点单号"></el-table-column>
        <el-table-column prop="pan_date" label="盘点日期"></el-table-column>
        <el-table-column prop="pan_time" label="盘点时间"></el-table-column>
        <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
        <el-table-column prop="name" label="盘点人"></el-table-column>

        <!-- <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)">详情</el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import add from './addpan'
export default {
  components: { add },
  props: [],
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      status: 0,
      drawer: false,
      cate: '',
      catetitle: '全部',
      searchtxt: '',
      choose: '',
      cateList: [],
      date: '',
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
      // console.log(this.formatDate(new Date(this.date[0])))
      const res = await this.$axios.get('/api?datatype=get_stock_list', {
        params: {
          storeid: this.storeid,
          sign: 3,
          start: this.formatDate(new Date(this.date[0])),
          end: this.formatDate(new Date(this.date[1])),
          search: this.searchtxt
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
    toEdit (row) {
      // console.log(row)
      this.choose = row.id
      this.add = true
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    handleCommand (command) {
      this.cate = command
      if (command == 'null') {
        this.catetitle = '全部'
      } else {
        let a = this.cateList.find(item => item.id == command)
        this.catetitle = a.title
      }
    }
  },
  created () {
    const a = this.formatDate(new Date())
    this.date = [a, a]
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
