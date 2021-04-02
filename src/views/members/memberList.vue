<template>
  <div id="memberlist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">员工资料</div>
      <el-input placeholder="搜索员工" v-model="searchtxt" style="width:240px;border:#dc670b">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="witchOne"></i>
      </el-input>
      <button
        class="btn-audio"
        style="font-size:18px;color:#dc670b"
        @click="add=true;choosOne=''"
      >新增</button>
    </div>

    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="chooseOne" height="100%">
        <el-table-column width="70">
          <template slot-scope="scope">
            <img :src="scope.row.avatar|imgUrl" alt style="width:44px;height:44px" />
          </template>
        </el-table-column>
        <el-table-column prop="job_no" label="编号" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="section" label="部门"></el-table-column>
        <el-table-column prop="service_job" label="服务职称"></el-table-column>
        <el-table-column prop="job" label="行政职位"></el-table-column>
        <el-table-column label="目前状态">
          <template
            slot-scope="scope"
          >{{scope.row.now_status=='1'?'在职':scope.row.now_status=='2'?'未在职':'离职'}}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="预约状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.yy_status" active-color="#13ce66" disabled></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="set_page" :class="{activePage:add}">
      <addmember @close="add=false;getList()" :choose="choosOne" v-if="add"></addmember>
    </div>
  </div>
</template>

<script>
import addmember from '@/components/addmember.vue'
export default {
  components: { addmember },
  props: {},
  data () {
    return {
      item: 1,
      tableData: [],
      add: false,
      choosOne: '',
      searchtxt: '',
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
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 0,
          is_wei: 0
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(item => {
          if (!item.avatar) {
            item.avatar = '/upload/shop/moren.jpg'
          }
          if (item.yy_status == 1) {
            item.yy_status = true
          } else {
            item.yy_status = false
          }
        })
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
    witchOne () {
      if (this.searchtxt) {
        this.search()
      } else {
        this.getList()
      }
    },
    async search () {
      const res = await this.$axios.get('/api?datatype=search_staff_list', {
        params: {
          storeid: this.storeid,
          search: this.searchtxt
        }
      })
      if (res.data.data) {
        res.data.data.forEach(item => {
          if (!item.avatar) {
            item.avatar = '/upload/shop/moren.jpg'
          }
          if (item.yy_status == 1) {
            item.yy_status = true
          } else {
            item.yy_status = false
          }
        })
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
    chooseOne (row) {
      this.choosOne = row
      this.add = true
    }
  },
  created () {
    this.getList()
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#memberlist {
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
  }
  .bomView {
    padding: 0 20px;
    height: calc(100% - 90px);
  }
}
</style>
