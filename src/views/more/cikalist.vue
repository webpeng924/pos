<template>
  <div id="cikalist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">次卡列表</div>
      <button class="btn-audio btn-shopCart" @click="add=true"></button>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="itemname" label="项目名称"></el-table-column>
        <el-table-column label="次卡类型">
          <template slot-scope="scope">{{scope.row.typeid|type}}</template>
        </el-table-column>
        <el-table-column label="次数 / 时长">
          <template slot-scope="{row}">{{row.typeid==1?row.count:row.num}}</template>
        </el-table-column>
        <el-table-column prop="price" label="次卡售价"></el-table-column>
        <el-table-column prop="address" width="120" label="操作">
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.state==0"
              type="danger"
              @click="changeState(scope.row.id,1)"
            >停用</el-button>
            <el-button
              v-show="!scope.row.state==1"
              type="success"
              @click="changeState(scope.row.id,0)"
            >启用</el-button>
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
      status: 0,
      cate: '',
      searchtxt: '',
      choose: ''
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
        }
      })
      console.log(res)
      this.tableData = res.data.data
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
      this.status = 1
    }
    this.getList()
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
  }
  .bomView {
    padding: 0 20px;
  }
}
</style>
