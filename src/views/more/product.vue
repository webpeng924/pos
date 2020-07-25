<template>
  <div id="prolist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">产品资料</div>
      <button class="btn-audio btn-shopCart" @click="add=true"></button>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit">
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
      status: 0,
      cate: '',
      searchtxt: '',
      choose: ''
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
          status: this.status,
          cate: this.cate,
          search: this.searchtxt
        }
      })
      console.log(res)
      this.tableData = res.data.data
    },
    toEdit (row) {
      if (this.from) {
        this.$emit('close', row)
      } else {
        console.log(row)
        this.choose = row
        this.add = true
      }
    }
  },
  created () { this.getList() },
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
