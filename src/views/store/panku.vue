<template>
  <div id="projectlist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">库存盘点</div>
      <button class="btn-audio btn-shopCart" @click="add=true"></button>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <add @close="add=false;getList()" :choose="choose" v-if="add"></add>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="stock_no" label="盘点单号"></el-table-column>
        <el-table-column prop="pan_date" label="盘点日期"></el-table-column>
        <el-table-column prop="pan_time" label="盘点时间"></el-table-column>
        <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
        <el-table-column prop="name" label="盘点人"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="todel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
      const res = await this.$axios.get('/api?datatype=get_stock_list', {
        params: {
          storeid: this.storeid,
          sign: 3
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
    toEdit (row) {
      console.log(row)
      this.choose = row
      this.add = true
    },
    todel (v) {
      this.$confirm('确认删除此条盘库信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$axios.get('/api?datatype=del_stock_pan', {
          params: {
            storeid: this.storeid,
            id: v.id
          }
        })
        if (res.data.code == 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error('删除失败')
        }
      })
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
      font-size: 24px;
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
    .btn-filter {
      width: 40px;
      height: 40px;
      background: #fff
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Filter.png)
        center / 28px no-repeat;
    }
  }
  .bomView {
    padding: 0 20px;
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
