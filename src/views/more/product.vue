<template>
  <div id="prolist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">产品资料</div>
      <button class="btn-audio btn-filter" @click="drawer=true"></button>
      <button
        class="btn-audio"
        style="font-size:18px;color:#dc670b"
        @click="addNew"
        v-show="!from"
      >新增</button>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <h2 slot="title" style="text-align: center;">筛选条件</h2>
      <div class="drawerlist">
        <div class="draweritem">
          <el-input placeholder="请输入产品名称或编号" v-model="searchtxt">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="draweritem">
          隐藏停用项目
          <el-switch v-model="status" active-color="#13ce66"></el-switch>
        </div>
        <div class="draweritem">
          分类：
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{catetitle}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="null">全部</el-dropdown-item>
              <el-dropdown-item v-for="(v,k) in cateList" :key="k" :command="v.id">{{v.title}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-drawer>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit" height="100%">
        <el-table-column prop="goods_no" label="编号" width="180"></el-table-column>
        <el-table-column prop="goods_name" label="产品名称" width="180"></el-table-column>
        <el-table-column prop="price" label="标准价格"></el-table-column>
        <el-table-column prop="goods_unit" label="标准单位"></el-table-column>
        <el-table-column prop="title" label="统计分类"></el-table-column>
        <el-table-column prop="address" label="目前状态">
          <template slot-scope="scope">
            <span
              :style="scope.row.state==1?'color:#999':scope.row.is_stop==1?'color:#999':'color:lightgreen'"
            >{{scope.row.is_stop==1?'停用':scope.row.state==1?'停止销售':'正常'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="50">></el-table-column>
      </el-table>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <addPro @close="add=false;getList()" v-if="add" :choose="choose"></addPro>
    </div>
  </div>
</template>

<script>
import addPro from '@/components/addpro.vue'
export default {
  components: { addPro },
  props: ['from'],
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      drawer: false,
      status: false,
      cate: '',
      searchtxt: '',
      choose: '',
      catetitle: '全部',
      cateList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          status: this.status ? 1 : 0,
          status2: this.status == 1 ? 1 : null,
          cate: this.cate,
          search: this.searchtxt
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data != null) {
        this.tableData = res.data.data
        this.cateList = []
        res.data.data.forEach(item => {
          if (this.cateList.length != 0) {
            let flag = this.cateList.every(v => v.id != item.category_id)
            if (flag) {
              this.cateList.push({ 'id': item.category_id, 'title': item.title })
            }
          } else {
            this.cateList.push({ 'id': item.category_id, 'title': item.title })
          }
        })
      } else {
        this.tableData = []
      }
    },
    addNew () {
      this.choose = ''
      this.add = true
    },
    handleClose (done) {
      this.getList()
        .then(_ => {
          done();
          this.updateStatus()
        })
        .catch(_ => { });
    },
    updateStatus (type) {
      let parameter = null
      if (type == 1) {
        parameter = ' true=>隐藏停用，false=>全部显示'
      }
      this.$axios.get('/api?datatype=edit_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'goods_state',
          info: '产品列表筛选',
          value: this.status,
          parameter: parameter
        }
      }).then(res => {
        if (type == 1) {
          this.getList()
        }
        // console.log(res)
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
    },
    toEdit (row) {
      if (this.from) {
        this.$emit('close', row)
      } else {
        // console.log(row)
        this.choose = row
        this.add = true
      }
    },
    async getState () {
      const res = await this.$axios.get('/api?datatype=get_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'goods_state'
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        if (res.data.data != null) {
          if (res.data.data.value == 'true') {
            this.status = true
          } else {
            this.status = false
          }
          this.getList()
        }
      }
      if (res.data.code == 3) {
        this.updateStatus(1)
      }
    }
  },
  created () {
    if (this.from) {
      this.status = true
      this.getList()
    } else {
      this.getState()
    }
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
      font-family: PingFangSC-Semibold;
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
    }
    .btn-filter {
      width: 40px;
      height: 40px;
      background: #fff url(../../assets/images/filter.png) center / 28px
        no-repeat;
    }
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
  .bomView {
    height: calc(100% - 90px);
    padding: 0 20px;
  }
}
</style>
