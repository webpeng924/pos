<template>
  <div id="integral">
    <div class="topView">
      <div class="tView">积分兑换</div>
      <div class="record" @click="showRecord">兑换记录</div>
      <div>我的积分：{{integral}}</div>
    </div>
    <div class="shopinfo">
      <el-row>
        <el-col :span="6" v-for="(v,k) in tableData" :key="k">
          <el-card :body-style="{ padding: '5px'}" style="margin:5% 10%">
            <img :src="v.goods_img" class="image" />
            <div style="padding: 14px;">
              <span class="one-txt-cut">{{v.goods_name}}</span>
              <div class="bottom clearfix">
                <p class="two-txt-cut">{{v.goods_memo}}</p>
                <p>
                  市场价：
                  <del>￥{{v.market_price}}</del>
                </p>
                <p>兑换积分：{{v.goods_integral}}</p>
              </div>
            </div>
            <el-button
              type="primary"
              class="button"
              style="padding:5px;dispaly:block;margin:0 5px 10px 0"
              @click="showaddress(v)"
            >立即兑换</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="请核对收货信息" :visible.sync="showinfo" width="30%" :close-on-click-modal="false">
      <div style="margin:20px" class="inteinfo">
        <div style="margin-top:10px">
          <span>收货人：</span>
          <el-input v-model="userinfo.name" size="small"></el-input>
        </div>
        <div>
          <span>收货电话：</span>
          <el-input v-model="userinfo.mobile" size="small"></el-input>
        </div>
        <div>
          <span>收货地址：</span>
          <el-input v-model="shopinfo.address" size="small"></el-input>
        </div>
        <div>
          <span>兑换数量：</span>
          <el-input-number
            v-model="num"
            :step-strictly="true"
            :step="1"
            @change="handleChange"
            :min="1"
            :max="max"
            size="small"
          ></el-input-number>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showinfo = false">取 消</el-button>
        <el-button type="primary" @click="submit">确定兑换</el-button>
      </span>
    </el-dialog>
    <!-- 右侧 -->
    <el-drawer title="兑换记录" :visible.sync="showrecord" direction="rtl">
      <el-table :data="gridData">
        <el-table-column property="adt" label="日期" width="100"></el-table-column>
        <el-table-column property="goods_name" label="产品"></el-table-column>
        <el-table-column property="order_num" label="数量" width="70"></el-table-column>
        <el-table-column property="cost_integral" label="消费积分" width="80"></el-table-column>
        <el-table-column label="订单状态" width="100">
          <template scope="{row}">
            <span :style="'color:'+color(row.status_name)">{{row.status_name}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {},
  data () {
    return {
      choose: '',
      gridData: [],
      max: 2,
      tableData: [],
      num: 1,
      currentDate: new Date(),
      storeid: sessionStorage.getItem('storeid'),
      showinfo: false,
      showrecord: false,
      integral: 0,
      shopinfo: JSON.parse(sessionStorage.getItem('shopInfo')),
      userinfo: JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  methods: {
    color (val) {
      switch (val) {
        case '待确认':
          return 'red';
        case '已发货':
          return 'yellow';
        case '已确认':
          return 'green';
        case '已完成':
          return 'bule';
        default:
          return '#999'
      }
    },
    getData () {
      this.$axios.get('/app?datatype=goods_list&&storeid=' + this.storeid).then(res => {
        console.log(res)
        if (res.data.code == 1 && res.data.data) {
          this.tableData = res.data.data
        }
      })
    },
    getList () {
      this.$axios.get('/app?datatype=order_list&&storeid=' + this.storeid).then(res => {
        console.log(res)
        if (res.data.code == 1 && res.data.data) {
          this.gridData = res.data.data
        }
      })
    },
    handleChange (value) {
      value = Math.round(value)
      let need = value * this.choose.goods_integral
      if (this.integral < need) {
        this.$message.error('积分不足')
        this.max = value - 1
      } else {
        this.max++
      }
    },
    submit () {
      if (!this.shopinfo.address.trim() || !this.userinfo.mobile.trim() || !this.userinfo.name.trim()) return this.$message.error('缺少收货信息！')
      let params = {
        storeid: this.storeid,
        goods_id: this.choose.id,
        staff_id: this.userinfo.id,
        cost_integral: this.num * this.choose.goods_integral,
        order_num: this.num,
        goods_name: this.choose.goods_name,
        goods_img: this.choose.goods_img,
        rece_name: this.userinfo.name.trim(),
        rece_mobile: this.userinfo.mobile.trim(),
        rece_address: this.shopinfo.address.trim(),
      }
      this.$axios.get('/app?datatype=create_order', {
        params
      }).then(res => {
        console.log(res)
        if (res.data.code == 1) {
          this.showinfo = false
          this.$alert('兑换成功！产品将在5个工作日内发货，请注意查收！', '成功', {
            confirmButtonText: '确定',
            type: 'success',
          });
          this.getintegral()
        } else {
          this.$alert(res.data.msg, '失败', {
            confirmButtonText: '确定',
            type: 'warning',
          });
        }
      })

    },
    // 展开并查询记录
    showRecord () {
      this.getList()
      this.showrecord = true
    },
    getintegral () {
      let month = moment().format('YYYY-MM')
      this.$axios.get('/api?datatype=get_sign_list', {
        params: {
          storeid: this.storeid,
          month: month
        }
      }).then(res => {
        if (res.data.code == 1 && res.data.sum) {
          this.integral = res.data.sum
        }
      })
    },
    showaddress (v) {
      if (Number(this.integral) < v.goods_integral) return this.$message.error('积分不足')
      // if (this.shopinfo.address.trim() && this.userinfo.mobile.trim() && this.userinfo.name.trim()) {
      this.choose = v
      this.showinfo = true
      this.num = 1
      this.max = 2
      // } else {
      // this.$alert('缺少收货信息，请联系客服', '提示', {
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // });
      // }
    }
  },
  created () {
    this.getintegral()
    this.getData()
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
#integral {
  height: 100%;
  .record {
    margin-right: 20px;
    cursor: pointer;
    color: #dc670b;
  }
  .topView {
    background: linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%);
    .tView {
      flex: 1;
    }
  }
  .shopinfo {
    padding: 20px;
    height: calc(100% - 85px);
    overflow: auto;
  }
  .inteinfo {
    > div {
      display: flex;
      margin-bottom: 10px;
      span {
        display: block;
        width: 80px;
      }
      .el-input {
        flex: 1;
      }
    }
  }
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  p {
    margin-bottom: 5px;
  }
  p:first-child {
    line-height: 16px;
    min-height: 32px;
    color: #999;
    margin-bottom: 10px;
  }
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 180px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
