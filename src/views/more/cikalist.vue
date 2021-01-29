<template>
  <div id="cikalist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">次卡列表</div>
      <button class="btn-audio btn-filter" @click="drawer=true"></button>
      <button
        class="btn-audio"
        style="font-size:18px;color:#dc670b"
        @click="add=true"
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
          <el-input placeholder="请输入项目名称" v-model="searchtxt">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="draweritem">
          隐藏停用项目
          <el-switch v-model="checked" active-color="#13ce66"></el-switch>
        </div>
        <div class="draweritem">
          分类：
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{cate|type}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="null">全部</el-dropdown-item>
              <el-dropdown-item command="1">次卡</el-dropdown-item>
              <el-dropdown-item command="2">月卡</el-dropdown-item>
              <el-dropdown-item command="3">季卡</el-dropdown-item>
              <el-dropdown-item command="4">年卡</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-drawer>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit" height="100%">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="itemname" label="项目名称"></el-table-column>
        <el-table-column label="次卡类型">
          <template slot-scope="scope">{{scope.row.typeid|type}}</template>
        </el-table-column>
        <el-table-column label="次数 / 时长">
          <template slot-scope="{row}">{{row.typeid==1?row.count:row.num}}</template>
        </el-table-column>
        <el-table-column prop="price" label="次卡售价"></el-table-column>
        <el-table-column width="120" label="操作" v-if="!from">
          <template slot-scope="scope">
            <span
              style="padding:10px;background:red;color:#fff"
              v-show="scope.row.state==0"
              @click="changeState(scope.row.id,1)"
            >停用此卡</span>
            <span
              style="padding:10px;background:#60e860;color:#fff"
              v-show="scope.row.state==1"
              @click="changeState(scope.row.id,0)"
            >启用此卡</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <addcika @close="add=false;getList()" v-if="add" :choose="choose"></addcika>
    </div>
  </div>
</template>

<script>
import addcika from '@/components/addcika.vue'
export default {
  components: { addcika },
  props: ['from'],
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      // status: 0,
      cate: '',
      searchtxt: '',
      choose: '',
      checked: false,
      drawer: false
    }
  },
  filters: {
    type (val) {
      switch (val) {
        case '1':
          return '次卡';
        case '2':
          return '月卡';
        case '3':
          return '季卡';
        case '4':
          return '年卡';
        default:
          return '全部'
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    toEdit (row) {
      if (this.from) {
        this.$emit('close', row)
      }
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_ci_list', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          state: this.checked ? 0 : null,
          typeid: this.cate,
          itemname: this.searchtxt

        }
      })
      // console.log(res)
      this.tableData = res.data.data
    },
    updateStatus (type) {
      let parameter = null
      if (type == 1) {
        parameter = ' true=>隐藏停用，false=>全部显示'
      }
      this.$axios.get('/api?datatype=edit_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'cika_state',
          info: '次卡列表筛选',
          value: this.checked,
          parameter: parameter
        }
      }).then(res => {
        if (type == 1) {
          this.getList()
        }
        // console.log(res)
      })
    },
    async getState () {
      const res = await this.$axios.get('/api?datatype=get_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'cika_state'
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        if (res.data.data != null) {
          if (res.data.data.value == 'true') {
            this.checked = true
          } else {
            this.checked = false
          }
          this.getList()
        }
      }
      if (res.data.code == 3) {
        this.updateStatus(1)
      }
    },
    handleCommand (command) {
      this.cate = command
      if (command == 'null') {
        this.cate = null
        //   this.catetitle = '全部'
        // } else {
        //   let a = this.cateList.find(item => item.id == command)
        //   this.catetitle = a.title
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
    async changeState (id, state) {
      const res = await this.$axios.get('/api?datatype=change_cicard_state', {
        params: {
          id: id,
          state: state
        }
      })
      if (res.data.code == 1) {
        this.$message.success('修改成功')
        this.getList()
      } else {
        this.$message.success('操作失败')
      }
    }
  },
  created () {
    if (this.from) {
      this.checked = true
      this.getList()
    } else {
      this.getState()
    }
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#cikalist {
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
    .checkbox {
      position: absolute;
      right: 80px;
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
    padding: 0 20px;
    height: calc(100% - 90px);
  }
}
</style>
