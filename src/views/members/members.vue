<template>
  <div id="members">
    <div class="topView">
      <div class="tView">会员</div>
    </div>
    <div class="searchResView">
      <div class="topSearchView">
        <div class="inputView">
          <el-select v-model="type" placeholder="请选择">
            <el-option label="号码" value="号码"></el-option>
            <el-option label="姓名" value="姓名"></el-option>
          </el-select>
          <input placeholder="请输入手机号或会员卡号" v-model="keyword" />
          <button class="btn-close btn-audio" @click="keyword=''"></button>
        </div>
        <button class="btn-audio" :class="{search:keyword}" @click="getList">查询</button>
      </div>
      <el-table :data="tableData" style="width: 100%" @row-click="openInfo">
        <el-table-column width="120">
          <template slot-scope="scope">
            <img :src="scope.row.img|imgUrl" alt style="width:100px;height:75px" />
          </template>
        </el-table-column>
        <el-table-column prop="account" label="卡号" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="cardtype" label="卡类型"></el-table-column>
        <el-table-column prop="balance" label="储值余额"></el-table-column>
        <el-table-column prop="expiry_date" label="有效期"></el-table-column>
      </el-table>
    </div>
    <div class="set_page" :class="{activePage:info}">
      <memInfo @close="info=false;getList()" :choose="choosOne" v-if="info"></memInfo>
    </div>
  </div>
</template>

<script>
import memInfo from './memberinfo'
export default {
  components: { memInfo },
  props: {},
  data () {
    return {
      type: '号码',
      keyword: '',
      tableData: [1, 2],
      info: false,
      choosOne: '',
      storeid: sessionStorage.getItem('storeid')
    }
  },
  watch: {},
  computed: {},
  methods: {
    openInfo (row) {
      this.choosOne = row
      this.info = true
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: this.storeid,
          search: this.keyword
        }
      })
      console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      }
    }
  },
  created () {
    this.getList()
    console.log(this.$route.query)
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#members {
  .topView {
    background: #eee;
    position: fixed;
    left: 120px;
  }
  .searchResView {
    position: relative;
    right: 0;
    top: 0;
    padding-top: 85px;
    background: transparent;
    .topSearchView {
      position: absolute;
      top: 30px;
      left: 0;
      right: 0;
      margin: auto;
      width: 400px;
      background: #fff;
      height: 44px;
      display: flex;
      border-radius: 6px;
      overflow: hidden;
      /deep/ .el-select {
        input {
          line-height: 34px;
          border: none;
          font-size: 15px;
          color: #28282d;
          border-right: 0.5px solid rgba(220, 220, 220, 0.7);
        }
      }
      .inputView {
        display: flex;
        position: relative;
        flex: 1;
        padding-right: 44px;
        .el-select {
          margin-top: 5px;
          width: 80px;
          height: 34px;
          display: inline-block;
          position: relative;
        }
        input {
          flex: 1;
          padding: 10px 15px;
          font-size: 15px;
          line-height: 24px;
          border: none;
          background: #fff;
        }
        .btn-close {
          position: absolute;
          width: 44px;
          height: 44px;
          right: 0;
          top: 0;
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_InputClean.png)
            center / 18px no-repeat;
        }
      }
      button {
        width: 70px;
        height: 44px;
        padding: 0;
        line-height: 44px;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #fff;
        background: #d4d4d5;
      }
      button.search {
        background: #28282d;
      }
    }
  }
}
</style>
