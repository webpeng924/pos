<template>
  <div id="projectlist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">项目资料</div>
      <button class="btn-audio btn-filter" @click="drawer=true"></button>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="add=true">新增</button>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <addproject @close="add=false;getList()" :choose="choose" v-if="add"></addproject>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit" height="100%">
        <el-table-column prop="item_no" label="编号" width="180"></el-table-column>
        <el-table-column prop="name" label="项目名称" width="180"></el-table-column>
        <el-table-column prop="price" label="标准价格"></el-table-column>
        <el-table-column prop="title" label="分类"></el-table-column>
        <el-table-column prop="belong_job" label="归属部门"></el-table-column>
        <el-table-column label="目前状态">
          <template slot-scope="scope">
            <span
              :style="scope.row.is_stop==1?'color:#999':'color:lightgreen'"
            >{{scope.row.is_stop==1?'停用':'正常'}}</span>
          </template>
        </el-table-column>
      </el-table>
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
          <el-input placeholder="请输入项目名称或编号" v-model="searchtxt">
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
  </div>
</template>

<script>
import addproject from '@/components/addproject.vue'
export default {
  components: { addproject },
  props: ['from'],
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      status: false,
      drawer: false,
      cate: '',
      catetitle: '全部',
      searchtxt: '',
      choose: '',
      cateList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    updateStatus (type) {
      let parameter = null
      if (type == 1) {
        parameter = ' true=>隐藏停用，false=>全部显示'
      }
      this.$axios.get('/api?datatype=edit_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'item_state',
          info: '项目列表筛选',
          value: this.status,
          parameter: parameter
        }
      }).then(res => {
        if (type == 1) {
          this.getList()
        }
        console.log(res)
      })
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_item_list', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          status: this.status ? 1 : 0,
          cate: this.cate,
          search: this.searchtxt
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data != null) {
        this.tableData = res.data.data
        this.cateList = []
        res.data.data.forEach(item => {
          if (this.cateList.length != 0) {
            this.cateList.every(v => {
              if (v.id != item.category_id) {
                this.cateList.push({ 'id': item.category_id, 'title': item.title })
              }
            })
          } else {
            this.cateList.push({ 'id': item.category_id, 'title': item.title })
          }
        })
      } else {
        this.tableData = []
      }
    },
    toEdit (row) {
      if (this.from) {
        this.$emit('close', row)
      } else {
        console.log(row)
        this.choose = row
        this.add = true
      }
    },
    async getState () {
      const res = await this.$axios.get('/api?datatype=get_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'item_state'
        }
      })
      console.log(res)
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
    },
    handleClose (done) {
      this.getList()
        .then(_ => {
          done();
          this.updateStatus()
        })
        .catch(_ => { });
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
    height: calc(100% - 90px);
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
