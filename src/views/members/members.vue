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
      <el-table :data="tableData" style="width: 100%" @row-click="openInfo" height="100%">
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="success" size="mini" @click.stop="getCard(scope.row,1)">购买次卡</el-button>
            </div>
            <div style="margin-top:10px">
              <el-button type="warning" size="mini" @click.stop="getCard(scope.row,2)">购买套餐</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="expiry_date" label="有效期"></el-table-column> -->
      </el-table>
    </div>
    <div class="set_page" :class="{activePage:info}">
      <memInfo @close="info=false;getList()" :choose="choosOne" v-if="info"></memInfo>
    </div>

    <!-- 次卡弹窗 -->
    <el-dialog
      title="次卡列表"
      :visible.sync="menuDialog"
      width="70%"
      center
      :modal-append-to-body="false"
      custom-class="cardDialog quickmoney"
    >
      <el-table ref="cardTable" :data="cardList" style="width: 100%" @row-click="choosed">
        <el-table-column width="55">
          <template slot-scope="{row}">
            <div class="seleted" :class="{active:check==row.id}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="次卡编号"></el-table-column>
        <el-table-column prop="itemname" label="项目名称"></el-table-column>
        <el-table-column label="次数 / 时长">
          <template slot-scope="{row}">{{row.typeid==1?row.count:row.num}}</template>
        </el-table-column>
        <el-table-column label="次卡类型">
          <template slot-scope="scope">{{scope.row.typeid|Type}}</template>
        </el-table-column>
        <el-table-column prop="price" label="次卡售价"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialog = false">取 消</el-button>
        <el-button type="primary" @click="choosePay" style="background-color:#dc670b;">确 定</el-button>
      </span>

      <el-dialog
        width="500px"
        title="请选择支付方式"
        :visible.sync="innerVisible"
        append-to-body
        center
        custom-class="quickmoney"
      >
        <el-radio-group v-model="paytype" style="padding:50px">
          <el-radio label="zfb">支付宝</el-radio>
          <el-radio label="wx">微信</el-radio>
          <el-radio label="cash">现金</el-radio>
          <el-radio label="other">其他</el-radio>
          <el-radio label="card" style="margin-top:30px" v-show="shoptype==5">会员卡余额</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setCard" style="background-color:#dc670b;">支付</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <!-- 套餐弹窗 -->
    <el-dialog
      title="套餐列表"
      :visible.sync="TCDialog"
      width="70%"
      center
      :modal-append-to-body="false"
      custom-class="cardDialog quickmoney"
    >
      <el-table ref="cardTable" :data="TCList" style="width: 100%" @row-click="choosed">
        <el-table-column width="55">
          <template slot-scope="{row}">
            <div class="seleted" :class="{active:check==row.id}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="套餐编号"></el-table-column>
        <el-table-column prop="name" label="套餐名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pay_money" label="销售价"></el-table-column>
        <el-table-column prop="fact_money" label="会员到账"></el-table-column>
        <el-table-column label="套餐可售时间" width="220">
          <template slot-scope="scope">
            <span v-if="scope.row.starttime">{{scope.row.starttime.split(' ')[0]}}</span>至
            <span v-if="scope.row.endtime">{{scope.row.endtime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="props_item" v-for="(v,k) in props.row.goodsinfo" :key="k">
              <span>产品名称：{{v.goods_name}}</span>
              <span>数量：{{v.count}}</span>
              <span>单价：{{v.price}}</span>
              <span>总价值：{{(Number(v.price)*Number(v.count)).toFixed(2)}}</span>
            </div>
            <div class="props_item" v-for="(v,k) in props.row.itemsinfo" :key="k+Math.random()">
              <span>次卡名称：{{v.itemname}}</span>
              <span>数量：{{v.typeid==1?v.count:v.num}}</span>
              <span>类型：{{v.typeid|Type}}</span>
              <span>总价值：{{Number(v.price).toFixed(2)}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TCDialog = false">取 消</el-button>
        <el-button type="primary" @click="choosePay">确 定</el-button>
      </span>

      <el-dialog
        width="500px"
        title="请选择支付方式"
        :visible.sync="innerVisible"
        append-to-body
        center
        custom-class="quickmoney"
      >
        <el-radio-group v-model="paytype" style="padding:50px">
          <el-radio label="zfb">支付宝</el-radio>
          <el-radio label="wx">微信</el-radio>
          <el-radio label="cash">现金</el-radio>
          <el-radio label="other">其他</el-radio>
          <el-radio label="card" v-show="shoptype==5" style="margin-top:30px">会员卡余额</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setCard">支付</el-button>
        </span>
      </el-dialog>
    </el-dialog>
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
      tableData: [],
      info: false,
      choosOne: '',
      cardList: [],
      buytype: 1,
      TCList: [],
      menuDialog: false,
      TCDialog: false,
      innerVisible: false,
      shoptype: sessionStorage.getItem('shoptype'),
      choose: '',
      paytype: 'zfb',
      check: 0,
      checkData: '',
      storeid: sessionStorage.getItem('storeid')
    }
  },
  watch: {},
  computed: {},
  filters: {
    Type (val) {
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
  methods: {
    openInfo (row) {
      this.choosOne = row
      this.info = true
    },
    async getCard (member, type) {
      this.buytype = type
      this.choose = member
      if (type == 1) {
        const res = await this.$axios.get("/api?datatype=get_ci_list", {
          params: {
            storeid: this.storeid,
            state: 0
          }
        })
        if (res.data.code == 1 && res.data.data) {
          this.cardList = res.data.data
          this.menuDialog = true
        } else {
          this.cardList = []
        }
      } else {
        const res = await this.$axios.get("/api?datatype=get_package_list", {
          params: {
            storeid: this.storeid,
            status: 1
          }
        })
        if (res.data.code == 1 && res.data.data) {
          this.TCList = res.data.data
          this.TCList.forEach(item => {
            if (item.goodsinfo) {
              item.goodsinfo = JSON.parse(item.goodsinfo)
            }
            if (item.itemsinfo) {
              item.itemsinfo = JSON.parse(item.itemsinfo)
            }
          })
          this.TCDialog = true
        } else {
          this.TCList = []
        }
      }
    },
    choosed (row) {
      this.checkData = row
      this.check = row.id
    },
    async setCard () {
      if (this.buytype == 1) {
        const res = await this.$axios.get('/api?datatype=buy_ccard', {
          params: {
            storeid: this.storeid,
            member_id: this.choose.member_id,
            id: this.check,
            pay_type: this.paytype
          }
        })
        if (res.data.code == 1) {
          this.$message.success('购买成功')
          this.menuDialog = false
          this.innerVisible = false
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        const res = await this.$axios.get('/api?datatype=buy_package', {
          params: {
            storeid: this.storeid,
            member_id: this.choose.member_id,
            id: this.check,
            pay_type: this.paytype,
            userid: JSON.parse(sessionStorage.getItem('userInfo')).id,
            username: JSON.parse(sessionStorage.getItem('userInfo')).username
          }
        })
        if (res.data.code == 1) {
          this.$message.success('购买成功')
          this.TCDialog = false
          this.innerVisible = false
          this.getList()
        } else {
          this.$message.error(res.data.msg)
        }
      }
    },
    choosePay () {
      if (this.check) {
        this.innerVisible = true
      } else {
        this.$message.error('请选择')
      }

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
      } else {
        this.tableData = []
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
  height: 100%;
  .topView {
    background: linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%);
    position: fixed;
    left: 120px;
  }
  .searchResView {
    height: 100%;
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
  /deep/.cardDialog {
    padding: 0 20px;
    height: 500px;
    position: relative;
    .seleted {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid #ccc;
    }
    .active {
      background-color: rgb(133, 206, 97);
    }
    /deep/.dialog-footer {
      position: absolute;
      right: 30px;
      bottom: 10px;
    }
  }
  .props_item {
    line-height: 30px;
    border-bottom: 1px solid #eee;
    display: flex;
    span {
      flex: 1;
      margin-right: 50px;
    }
  }
}
</style>
