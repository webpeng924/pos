<template>
  <div class="meminfo">
    <div class="left">
      <div class="topView">
        <button class="btn-back btn-audio" @click="$emit('close')"></button>
        <div class="tView">会员卡详情</div>
      </div>
      <div class="infoView" @click="show = 1">
        <div class="photoView">
          <div class="imgView">
            <img :src="userinfo.avatar" alt />
          </div>
        </div>
        <div class="textView one-txt-cut">
          <div class="nameView">{{ userinfo.name }}</div>
          <div class="mobileView">
            {{ userinfo.mobile }}
            <button class="btn-audio btn-copy"></button>
          </div>
        </div>
        <div class="btnView">
          <div class="btn-tk" @click="returnCard">退款</div>
          <div class="btn-hk" @click="huankuan=true">还款</div>
        </div>
      </div>
      <div class="menuView listView">
        <!-- <div class="menuItem btn-audio" @click="$message('暂未开放')">资格权益</div>
        <div class="menuItem btn-audio" @click="$message('暂未开放')">储值权益</div>-->
        <div
          class="menuItem btn-audio"
          @click="
            show = 2;
            name = '品项信息';
            getcicardInfo();
          "
        >品项信息</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 2;
            name = '套餐信息';
            cikalist = [];
          "
        >套餐信息</div>
        <div class="menuItem btn-audio" @click="$message('暂未开放')">抵用券信息</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 3;
            name = '充值记录';
            getlist(1);
          "
        >充值记录</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 3;
            name = '消费记录';
            getlist(2);
          "
        >消费记录</div>
        <!-- <div class="menuItem btn-audio">数据分析</div> -->
        <!-- <div class="menuItem btn-audio">沟通记录</div> -->
        <!-- <div class="menuItem btn-audio">产品寄存</div> -->
        <!-- <div class="menuItem btn-audio">皮肤检测</div> -->
        <!-- <div class="menuItem btn-audio">个人档案</div> -->
        <!-- <div class="menuItem btn-audio">扩展档案</div> -->
      </div>
      <div class="btnView">
        <button class="btn-topup btn-audio" @click="addmoney">
          <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Topup_White.png" />充值
        </button>
      </div>
    </div>
    <div class="contentView" v-show="show == 1">
      <div class="memberCardInfoView">
        <div class="titleView">会员信息</div>
        <div class="baseInfoView">
          <div class="photoView">
            <div class="imgView">
              <img :src="userinfo.avatar" alt style="width:100%" />
            </div>
          </div>
          <div class="contentView">
            <div class="subView cardInfoView">
              <div class="textView">
                <div class="customerView">
                  <label class="label-name">{{ userinfo.name }}</label>
                  <label class="label-mobile">{{ userinfo.mobile }}</label>
                </div>
                <div class="cardIdView">No.1234568</div>
              </div>
              <div class="btnView">
                <button>储值卡</button>
              </div>
            </div>
            <div class="subView remarkView">
              <div class="leftView">会员备注：</div>
              <div class="valView">
                {{ remark ? remark : "暂无备注" }}
                <img
                  src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Green.png"
                  class="img-edit"
                  @click="showMemo = true"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="accInfoView">
          <div class="accItem">
            <div class="valueView balanceView">
              <label>{{ userinfo.balance }}</label>
            </div>
            <div class="nameView">储值账户</div>
          </div>
        </div>
        <!-- <div class="tagsView">
          <div class="subTView">标签</div>
          <div class="contentView">
            <div class="btn-audio addItem">
              <div></div>
            </div>
          </div>
        </div>-->
        <div class="consumptionView">
          <div class="subTView">消费情况</div>
          <div class="contentView">
            <div class="subView">
              <div class="leftView">上次到店</div>
              <div class="valView">{{ userinfo.last_time }}</div>
            </div>
            <div class="subView">
              <div class="leftView">到店次数</div>
              <div class="valView">{{ userinfo.instore_count }}</div>
            </div>
            <!-- <div class="subView">
              <div class="leftView">真实消费</div>
              <div class="valView">-</div>
            </div>-->
            <div class="subView">
              <div class="leftView">消费总金额</div>
              <div class="valView">{{ userinfo.total_pay }}</div>
            </div>
            <!-- <div class="subView">
              <div class="leftView">客单价</div>
              <div class="valView">-</div>
            </div>-->
          </div>
        </div>
        <button class="btn-baseArchive"></button>
        <button class="btn-expandArchive"></button>
      </div>
    </div>
    <div class="contentView" v-show="show == 2">
      <div class="subTView">{{ name }}</div>
      <div class="listView" style="height: 884px;">
        <div class="memberEquityView">
          <div class="menuView">
            <div class="menuItem" :class="{ select: sign == 1 }" @click="sign = 1">可用</div>
            <div class="menuItem" :class="{ select: sign == 2 }" @click="sign = 2">已用</div>

            <el-button type="warning" class="menuBtn" @click="menuDialog=true">购买次卡</el-button>
          </div>
          <el-table ref="Table" :data="cikalist" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="itemname" label="名称" width="180"></el-table-column>
            <!-- <el-table-column prop="name" label="有效期" width="150"></el-table-column> -->
            <el-table-column prop="first_count" label="购买次数"></el-table-column>
            <!-- <el-table-column prop="address" label="赠送次数"></el-table-column> -->
            <el-table-column label="使用次数">
              <template slot-scope="scope">
                {{
                Number(scope.row.first_count) - Number(scope.row.rest_count)
                }}
              </template>
            </el-table-column>
            <el-table-column prop="rest_count" label="剩余次数"></el-table-column>
          </el-table>
          <!-- <div class="tipView">
            <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NoData_Bill.png" />
            <div>暂无数据</div>
          </div>-->
        </div>
      </div>
    </div>
    <div class="contentView" v-show="show == 3">
      <div class="subTView">{{ name }}</div>
      <div class="listView" style="height: 884px;">
        <el-table ref="Table" :data="tableData" style="width: 100%" height="100%">
          <el-table-column width="50"></el-table-column>
          <el-table-column prop="itemname" label="日期" width="150">
            <template slot-scope="scope">
              {{
              scope.row.dateline | time
              }}
            </template>
          </el-table-column>
          <el-table-column prop="pay_sn" label="单号" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
              scope.row.pay_sn ? scope.row.pay_sn : scope.row.order_no
              }}
            </template>
          </el-table-column>
          <el-table-column label="账户">储值账户</el-table-column>
          <el-table-column prop="type" label="类别"></el-table-column>
          <el-table-column prop="old_money" label="前次余额"></el-table-column>
          <el-table-column prop="change" label="变动金额"></el-table-column>
          <el-table-column prop="balance" label="余额"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="set_page" :class="{activePage:huankuan}">
      <huankuan @close="huankuan=false" v-if="huankuan" :member="choose"></huankuan>
    </div>

    <el-dialog
      title="备注"
      :visible.sync="showMemo"
      width="430px"
      center
      custom-class="quickmoney"
      :modal-append-to-body="false"
    >
      <div class="textView">
        <textarea placeholder="填写备注" maxlength="500"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMemo = false" style="background-color:#dc670b;color:#fff">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 次卡弹窗 -->
    <el-dialog
      title="次卡列表"
      :visible.sync="menuDialog"
      width="70%"
      center
      :modal-append-to-body="false"
      custom-class="cardDialog"
    >
      <el-table ref="cardTable" :data="cardList" style="width: 100%">
        <el-table-column width="55">
          <template slot-scope="{row}">
            <div class="seleted" :class="{active:check==row.id}" @click="choosed(row)"></div>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialog = false">取 消</el-button>
        <el-button type="primary" @click="setCard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import huankuan from '@/components/huankuan.vue'
export default {
  components: { huankuan },
  props: ['choose'],
  data () {
    return {

      show: 1,
      name: "",
      showMemo: false,
      huankuan: false,
      remark: '',
      userinfo: '',
      sign: 1,
      storeid: sessionStorage.getItem("storeid"),
      tableData: [],
      cikalist: [],
      member_id: "",
      cardList: [{
        id: 1,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      check: 0,
      checkData: '',
      menuDialog: false,
    };
  },
  watch: {
    sign (val) {
      this.getcicardInfo();
    }
  },
  filters: {
    time (value) {
      return moment.unix(value).format("YYYY-MM-DD");
    }
  },
  computed: {},
  methods: {
    addmoney () {
      this.$prompt('请充值金额', '会员充值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*(.\d{1,2})?$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '已充值: ' + value + '元'
        });
      })
    },
    returnCard () {
      this.$confirm('确认将此会员卡退款并注销吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$axios.get('/api?datatype=refund', {
          params: {
            storeid: this.storeid,
            member_id: this.choose.member_id
          }
        })
      })
    },
    choosed (row) {
      this.checkData = row
      this.check = row.id
    },
    setCard () {
      this.menuDialog = false
    },
    async getCard () {
      const res = await this.$axios.get("/api?checkData=get_ci_list", {
        params: {
          storeid: this.storeid
        }
      })
      console.log('次卡', res);

    },
    async getInfo (id) {
      const res = await this.$axios.get("/api?datatype=get_one_member", {
        params: {
          storeid: this.storeid,
          member_id: id
        }
      });
      if (res.data.code == 1) {
        this.userinfo = res.data.data;
        if (this.userinfo.last_time != null) {
          this.userinfo.last_time = moment
            .unix(this.userinfo.last_time)
            .format("YYYY-MM-DD");
        }
      }
    },
    async getcicardInfo () {
      const res = await this.$axios.get("/api?datatype=get_card_memberitem", {
        params: {
          storeid: this.storeid,
          member_id: this.member_id,
          sign: this.sign
        }
      });
      if (res.data.code == 1) {
        this.cikalist = res.data.data;
        this.$message.success("加载完成");
      }
    },
    async getlist (type) {
      const res = await this.$axios.get(
        "/api?datatype=get_member_moneydetail",
        {
          params: {
            storeid: this.storeid,
            member_id: this.member_id,
            type: type
          }
        }
      );
      if (res.data.code == 1) {
        this.$message.success("加载完成");
        this.tableData = res.data.data;
      }
    }
  },
  created () {
    this.getCard()
    if (this.choose) {
      this.getInfo(this.choose.member_id);
      this.member_id = this.choose.member_id;
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
.meminfo {
  display: flex;
  height: 100%;
  .left {
    width: 300px;
    height: 100%;
    position: relative;
    min-width: 260px;
    background: #f8f8f8;
    z-index: 10;
    border-right: 1px solid rgba(220, 220, 220, 0.7);
    .topView {
      position: relative;
      z-index: 10;
      display: flex;
      padding: 35px 0 10px 0;
      line-height: 40px;
      height: 85px;
      box-shadow: 0 0 2px 0 rgba(220, 220, 220, 0.4);
      background: #fff;
      .tView {
        flex: 1;
        text-align: center;
        margin-left: 50px;
      }
    }
    .infoView {
      position: relative;
      padding: 25px 15px 28px 22px;
      margin-bottom: 10px;
      background: #fff;
      height: 150px;
      padding-left: 100px;
      .photoView {
        position: absolute;
        left: 20px;
        background: #eee;
        width: 60px;
        height: 60px;
        margin-right: 12px;
        img {
          width: 100%;
        }
      }
      .textView {
        font-size: 18px;
        .nameView {
          font-size: 24px;
        }
      }
      .btnView {
        position: absolute;
        width: 100%;
        left: 0;
        display: flex;
        padding: 20px 0 0 50px;
        div {
          flex: 1;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
        }
      }
      .btnView > .btn-tk {
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_TK.png) 10px
          center / 28px no-repeat;
      }
      .btn-hk {
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_HK.png) 10px
          center / 28px no-repeat;
      }
    }
    .menuView {
      text-align: center;
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 300px);
      background: #fff;
      padding: 10px 0;
      .menuItem {
        display: block;
        line-height: 54px;
        height: 54px;
        background: #fff;
        color: #5a5a5a;
        font-size: 15px;
      }
    }
    .btn-topup {
      width: 100%;
      height: 55px;
      line-height: 55px;
      background: #dc670b;
      font-size: 15px;
      color: #fff;
      text-align: center;
      img {
        margin-top: -2px;
        vertical-align: middle;
        width: 28px;
        margin-right: 10px;
      }
    }
  }
  /deep/.menuBtn {
    position: fixed;
    right: 20px;
  }
  .contentView {
    position: relative;
    flex: 1;
    // max-width: 1200px;
    left: 0;
    right: 0;
    height: 100%;
    background: #fff;
    margin: auto;
    .memberCardInfoView {
      width: 100%;
      height: 100%;
      color: #28282d;
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      .titleView {
        position: relative;
        height: 180px;
        padding: 35px 0 105px 0;
        line-height: 40px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        background: transparent
          url(https://static.bokao2o.com/wisdomDesk/images/Member_CardIInfo_TopImg.png)
          center top / 100% no-repeat;
      }
      .baseInfoView {
        display: flex;
        padding: 0 0 10px 0;
        background: #fff;
        margin: 0 15px;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        .photoView {
          margin-top: -20px;
          width: 90px;
          margin-right: 15px;
          .imgView {
            position: relative;
            width: 90px;
            height: 90px;
            border-radius: 6px;
            overflow: hidden;
            background: #eee
              url(https://static.bokao2o.com/wisdomCashier/images/Member_AddGray.png)
              center / 28px no-repeat;
          }
        }
        .contentView {
          flex: 1;
          .subView {
            display: flex;
            &.cardInfoView > .textView {
              flex: 1;
              padding: 7.5px 0;
              .customerView {
                flex: 1;
                line-height: 30px;
                .label-name {
                  margin-right: 12px;
                  font-size: 20px;
                  font-family: PingFangSC-Medium;
                  color: #28282d;
                }
                .label-mobile {
                  font-size: 16px;
                  color: #8a8a8a;
                }
              }
              .cardIdView {
                line-height: 25px;
                font-size: 14px;
                color: #5a5a5a;
              }
            }
            &.cardInfoView > .btnView {
              padding-top: 18px;
              button {
                height: 36px;
                border-radius: 6px;
                border: 0.5px solid rgba(220, 220, 220, 0.7);
                margin-right: 10px;
                padding: 0 15px;
                min-width: 80px;
                font-size: 16px;
              }
            }
            &.consEmpInfoView {
              cursor: pointer;
              line-height: 28px;
              .leftView {
                font-size: 14px;
                color: #5a5a5a;
              }
              .valView {
                flex: 1;
                font-size: 14px;
                color: #28282d;
                .img-edit {
                  width: 28px;
                  height: 28px;
                  vertical-align: bottom;
                }
              }
            }
            &.remarkView {
              cursor: pointer;
              line-height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              .valView > .img-edit {
                width: 28px;
                height: 28px;
                vertical-align: bottom;
              }
            }
          }
        }
      }
      .accInfoView {
        background: #fff;
        margin: 0 15px;
        padding: 15px 0;
        .accItem {
          position: relative;
          width: 25%;
          display: inline-block;
          vertical-align: top;
          text-align: center;
          font-size: 14px;
          color: #b0b0b0;
          line-height: 20px;
          height: 60px;
          margin: 5px 0;
          border-right: 0.5px solid rgba(220, 220, 220, 0.7);
          .balanceView {
            font-size: 16px;
            color: #28282d;
            line-height: 22px;
          }
        }
      }
      > div > .subTView {
        padding: 15px 0 5px 15px;
        line-height: 25px;
        font-size: 14px;
        color: #5a5a5a;
        background: #f4f4f4;
      }
      .tagsView > .contentView {
        overflow: hidden;
        padding: 10px 0 10px 10px;
        .addItem {
          float: left;
          padding: 5px 6px;
          cursor: pointer;
          > div {
            width: 68px;
            height: 34px;
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Add.png)
              center / 28px no-repeat;
            border-radius: 5px;
            border: 1px solid #28282d;
          }
        }
      }
      .consumptionView > .contentView {
        padding: 5px 15px 135px 15px;
        .subView {
          display: flex;
          line-height: 50px;
          font-size: 15px;
        }
        .valView {
          flex: 1;
          color: #28282d;
          text-align: right;
        }
      }
    }
    .subTView {
      padding: 35px 0 10px 0;
      line-height: 40px;
      height: 85px;
      font-size: 20px;
      font-family: PingFangSC-Medium;
      color: #28282d;
      text-align: center;
      border-bottom: 0.5px solid rgba(220, 220, 220, 0.3);
    }
    .memberEquityView {
      padding: 0 20px 25px 20px;
    }
    .tipView {
      margin-top: 35px;
      text-align: center;
      line-height: 40px;
      font-size: 13px;
      color: #8a8a8a;
      > img {
        width: 192px;
      }
    }
  }
  .el-dialog.quickmoney {
    border-radius: 6px;
    background: rgb(255, 255, 255);
    box-shadow: rgb(51, 51, 51) 0px 0px 20px 0px;
  }

  .el-dialog .el-dialog__body {
    padding: 0 !important;
  }

  .el-dialog.quickmoney .el-button:hover,
  .el-dialog.quickmoney .el-button:focus {
    color: #dc670b;
    border-color: #f3c4a0;
    background-color: #ffeaca;
  }
  .quickmoney .textView {
    padding: 0 30px;
    textarea {
      display: block;
      width: 100%;
      background: #f4f4f4;
      min-height: 180px;
      padding: 15px;
      line-height: 20px;
      font-size: 14px;
      color: #28282d;
      box-sizing: border-box;
      border-radius: 6px;
      border: none;
      outline: none;
      resize: none;
      margin-bottom: 10px;
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
}
</style>
