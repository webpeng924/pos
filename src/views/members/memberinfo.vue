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
          :class="{select:name =='品项信息'}"
        >品项信息</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 2;
            name = '套餐信息';
            cikalist = [];
            getTClist();
          "
          :class="{select:name =='套餐信息'}"
        >套餐信息</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 2;
            name = '抵用券信息';
            getvoucher();
          "
          :class="{select:name =='抵用券信息'}"
        >抵用券信息</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 3;
            name = '充值记录';
            getlist(1);
          "
          :class="{select:name =='充值记录'}"
        >充值记录</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 3;
            name = '消费记录';
            getlist(2);
          "
          :class="{select:name =='消费记录'}"
        >消费记录</div>
        <div
          class="menuItem btn-audio"
          @click="
            show = 4;
            name = '案例图片';
            getmemberPic()
          "
          :class="{select:name =='案例图片'}"
        >案例图片</div>
        <!-- <div class="menuItem btn-audio">沟通记录</div> -->
        <!-- <div class="menuItem btn-audio">产品寄存</div> -->
        <!-- <div class="menuItem btn-audio">皮肤检测</div> -->
        <div
          class="menuItem btn-audio"
          @click="
            show = 5;
            name = '个人档案';"
        >个人档案</div>
        <!-- <div class="menuItem btn-audio">扩展档案</div> -->
      </div>
      <div class="btnView">
        <button class="btn-topup btn-audio" @click="showaddMoney=true">
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
                <!-- <img
                  src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Edit_Green.png"
                  class="img-edit"
                  @click="showMemo = true"
                />-->
              </div>
            </div>
          </div>
        </div>
        <div class="accInfoView">
          <div class="accItem">
            <div class="valueView balanceView">
              <label>{{ userinfo.balance-userinfo.gift_money }}</label>
            </div>
            <div class="nameView">储值账户</div>
          </div>
          <div class="accItem">
            <div class="valueView balanceView">
              <label>{{ userinfo.balance-userinfo.gift_money>0?userinfo.gift_money:userinfo.balance }}</label>
            </div>
            <div class="nameView">赠送账户</div>
          </div>
          <div class="accItem">
            <div class="valueView balanceView">
              <label>{{ userinfo.signbill }}</label>
            </div>
            <div class="nameView">欠款账户</div>
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
      <div class="listView" style="height: calc(100% - 85px);">
        <div class="memberEquityView">
          <div class="menuView" v-show="name!='套餐信息'">
            <div class="menuItem" :class="{ select: sign == 1 }" @click="sign = 1">可用</div>
            <div class="menuItem" :class="{ select: sign == 2 }" @click="sign = 2">已用</div>
            <div class="menuItem" :class="{ select: sign == 3 }" @click="sign = 3">过期</div>
          </div>
          <el-table
            ref="Table"
            :data="cikalist"
            style="width: 100%"
            v-show="name=='品项信息'"
            height="90%"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="itemname" label="名称" width="180"></el-table-column>
            <el-table-column label="类型" width="150">
              <template slot-scope="scope">{{ scope.row.typeid|type}}</template>
            </el-table-column>
            <el-table-column prop="first_count" label="购买次数/时长"></el-table-column>
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
          <el-table
            ref="Table"
            :data="cikalist"
            style="width: 100%"
            v-show="name=='抵用券信息'"
            height="90%"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="抵用类型">
              <template slot-scope="scope">{{ scope.row.v_typeid==1?'现金券':'现金券'}}</template>
            </el-table-column>
            <el-table-column prop="v_amount" label="抵用金额"></el-table-column>
            <el-table-column label="有效期时间">
              <template slot-scope="{row}">{{row.v_starttime|time}} 至 {{row.v_endtime|time}}</template>
            </el-table-column>
          </el-table>

          <el-table
            ref="Table"
            :data="cikalist"
            style="width: 100%"
            height="100%"
            v-show="name=='套餐信息'"
          >
            <el-table-column width="55" type="index" label="序号"></el-table-column>
            <el-table-column prop="package_name" label="套餐名称"></el-table-column>
            <el-table-column prop="pay_money" label="销售价"></el-table-column>
            <el-table-column prop="fact_money" label="会员到账"></el-table-column>
            <el-table-column prop="addtime" label="购买时间" width="220"></el-table-column>
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
                  <span>类型：{{v.typeid|type}}</span>
                  <span>总价值：{{Number(v.price).toFixed(2)}}</span>
                </div>
              </template>
            </el-table-column>
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
      <div class="listView" style="height: calc(100% - 85px);">
        <el-table
          ref="Table"
          :data="tableData"
          style="width: 100%"
          height="100%"
          v-show="name=='充值记录'"
        >
          <el-table-column width="50" type="index"></el-table-column>
          <el-table-column prop="itemname" label="日期" width="100">
            <template slot-scope="scope">
              {{
              scope.row.dateline | Time
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
        <el-table
          ref="Table"
          :data="tableData"
          style="width: 100%"
          height="100%"
          v-show="name=='消费记录'"
        >
          <el-table-column width="50" type="index"></el-table-column>
          <el-table-column prop="pay_sn" label="单号" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
              scope.row.pay_sn ? scope.row.pay_sn : scope.row.order_no
              }}
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">{{scope.row.pay_type |payType}}</template>
          </el-table-column>
          <el-table-column prop="change" label="支付金额"></el-table-column>
          <el-table-column prop="itemname" label="时间">
            <template slot-scope="scope">
              {{
              scope.row.dateline | Time
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="contentView" v-show="show == 4">
      <div class="subTView">{{ name }}</div>
      <p style="padding:10px 30px 0;color:red;display:flex">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{nowcate.title}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v,k) in catelist" :key="k" :command="v">{{v.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="flex:1;text-align:right">点击“+”添加图片, 点击相应图片可删除</span>
      </p>
      <div class="imageRoom">
        <div v-for="(v,k) in urls" :key="k">
          <el-image
            style="width: 150px; height: 150px;"
            :src="v.img|imgUrl"
            fit="scale-down"
            @click="delPic(v)"
          ></el-image>
          <el-popover placement="top" width="200" trigger="click" :content="v.desc">
            <p slot="reference" style="width:150px;padding:5px 10px" class="one-txt-cut">{{v.desc}}</p>
          </el-popover>
        </div>
        <div>
          <el-image style="width: 150px; height: 150px" fit="scale-down">
            <div slot="error" class="image-slot">
              <i class="el-icon-plus" @click="openCropper"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <div class="contentView" v-show="show == 5">
      <div class="subTView">{{ name }}</div>
      <div class="baseInfoView1">
        <div class="infoItem">
          <div class="leftView">姓名</div>
          <div class="valView overflowText">{{userinfo.name?userinfo.name:'-'}}</div>
        </div>
        <div class="infoItem">
          <div class="leftView">性别</div>
          <div class="valView overflowText">{{userinfo.sex==1?'男':'女'}}</div>
        </div>
        <div class="infoItem">
          <div class="leftView">手机号码</div>
          <div class="valView overflowText">{{userinfo.mobile?userinfo.mobile:'-'}}</div>
        </div>
        <!-- <div class="infoItem">
          <div class="leftView">微信openId</div>
          <div class="valView overflowText">-</div>
        </div>-->
        <!-- <div class="infoItem">
          <div class="leftView">家庭住址</div>
          <div class="valView overflowText">-</div>
        </div>-->
        <div class="infoItem">
          <div class="leftView">证件号码</div>
          <div class="valView overflowText">{{userinfo.IDcard?userinfo.IDcard:'-'}}</div>
        </div>
        <!-- <div class="infoItem">
          <div class="leftView">客户来源</div>
          <div class="valView overflowText">-</div>
        </div>-->
        <!-- <div class="infoItem">
          <div class="leftView">阳历生日</div>
          <div class="valView overflowText">-</div>
        </div>-->
        <div class="infoItem">
          <div class="leftView">生日</div>
          <div class="valView overflowText">{{userinfo.birthday?userinfo.birthday:'-'}}</div>
        </div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:huankuan}">
      <huankuan @close="huankuan=false" v-if="huankuan" :member="choose"></huankuan>
    </div>

    <el-dialog
      title="会员充值"
      :visible.sync="showaddMoney"
      width="430px"
      center
      custom-class="quickmoney"
      :modal-append-to-body="false"
    >
      <div class="textView">
        <div class="item">
          <span>充值金额：</span>
          <el-input placeholder="请输入" v-model="money" type="number"></el-input>
        </div>
        <div class="item">
          <span>赠送金额：</span>
          <el-input placeholder="请输入" v-model="gift_money" type="number"></el-input>
        </div>
        <div class="item">
          <span>合计：</span>
          <div>{{Number(money)+Number(gift_money)}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showaddMoney = false">取消</el-button>
        <el-button @click="addmoney" style="background-color:#dc670b;color:#fff">确定</el-button>
      </span>
    </el-dialog>

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

    <!-- 图片上传 -->
    <xcropper ref="cropper"></xcropper>
    <el-dialog
      title="描述"
      :visible.sync="showDesc"
      width="430px"
      center
      custom-class="quickmoney"
      :modal-append-to-body="false"
    >
      <div class="textView">
        <textarea placeholder="填写描述" maxlength="500" v-model="desc"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDesc" style="background-color:#dc670b;color:#fff">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import huankuan from '@/components/huankuan.vue'
import xcropper from '@/components/xcropper.vue'
export default {
  components: { huankuan, xcropper },
  props: ['choose'],
  data () {
    return {
      urls: [],
      show: 1,
      name: "",
      showMemo: false,
      showDesc: false,
      img: '',
      desc: '',
      huankuan: false,
      remark: '',
      userinfo: '',
      sign: 1,
      storeid: sessionStorage.getItem("storeid"),
      tableData: [],
      cikalist: [],
      member_id: "",
      catelist: [],
      money: '',
      gift_money: '',
      nowcate: '',
      showaddMoney: false
    };
  },
  watch: {
    sign (val) {
      if (this.name == '品相信息') {
        this.getcicardInfo();
      } else if (this.name == '抵用券信息') {
        this.getvoucher();
      } else {
        this.cikalist = []
      }
    }
  },
  filters: {
    time (value) {
      return moment.unix(value).format("YYYY-MM-DD");
    },
    Time (value) {
      return moment.unix(value).format("YYYY-MM-DD HH:mm:ss");
    },
    payType (val) {
      switch (val) {
        case 'card':
          return '会员卡';
        case 'zfb':
          return '支付宝';
        case 'wx':
          return '微信';
        case 'cash':
          return '现金';
        case 'signbill':
          return '签帐';
        default:
          return '其他';
      }
    },
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
  computed: {},
  methods: {
    handleCommand (command) {
      this.nowcate = command
      this.getmemberPic()
    },
    async  getTClist () {
      const res = await this.$axios.get("/api?datatype=get_member_package", {
        params: {
          storeid: this.storeid,
          member_id: this.member_id
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.cikalist = res.data.data
        this.cikalist.forEach(item => {
          if (item.goodsinfo) {
            item.goodsinfo = JSON.parse(item.goodsinfo)
          }
          if (item.itemsinfo) {
            item.itemsinfo = JSON.parse(item.itemsinfo)
          }
        })
      } else {
        this.cikalist = []
      }
    },
    // 删除图片
    delPic (v) {
      this.$confirm('确认删除此图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$axios.get('/api?datatype=del_member_photo&id=' + v.id)
        if (res.data.code == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getmemberPic()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    openCropper () {
      let option = {
        title: '案例图',
        msg: '建议图片大小：2M'
      };
      this.$refs.cropper.open(option, (data) => {
        console.log(data)
        this.showDesc = true
        this.img = data
      })
    },
    setDesc () {
      this.$axios.get('/api?datatype=insert_member_photo', {
        params: {
          storeid: this.storeid,
          member_id: this.member_id,
          img: this.img,
          desc: this.desc,
          item_id: this.nowcate.id
        }
      }).then(res => {
        if (res.data.code == 1) {
          this.$message.success('添加成功')
          this.showDesc = false
          this.getmemberPic()
        }
      })
    },
    async getvoucher () {
      const res = await this.$axios.get('/api?datatype=get_member_voucher', {
        params: {
          storeid: this.storeid,
          member_id: this.member_id,
          status: this.sign
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.cikalist = res.data.data
      } else {
        this.cikalist = []
      }
    },
    async getmemberPic () {
      const res = await this.$axios.get('/api?datatype=get_photo_list', {
        params: {
          storeid: this.storeid,
          member_id: this.member_id,
          item_id: this.nowcate.id
        }
      })
      if (res.data.code == 1) {
        this.urls = res.data.list
        this.$message.success('加载完成')
      } else if (res.data.code == 3) {
        this.urls = []
        this.$message.success('加载完成')
      } else {
        this.urls = []
        this.$message.error('获取失败')
      }
    },
    async addmoney () {
      if (this.money == '') return this.$message.error('请输入充值金额')
      if (Number(this.money) <= 0) return this.$message.error('请输入正确充值金额')
      const res = await this.$axios.get('/api?datatype=recharge', {
        params: {
          storeid: this.storeid,
          member_id: this.member_id,
          money: Number(this.money),
          gift_money: Number(this.gift_money)
        }
      })
      if (res.data.code == 1) {
        this.$message.success('充值成功')
        this.showaddMoney = false
        this.getInfo(this.member_id)
      } else {
        this.$message.error('充值失败')
      }
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
        if (res.data.code == 1) {
          this.$message.error('退款成功')
          this.getInfo(this.member_id)
        }
      })
    },
    // 获取项目分类
    async getXMcate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate&storeid=' + this.storeid)
      console.log(res)
      this.catelist = res.data.data
      this.nowcate = res.data.data[0]
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
        if (Number(this.userinfo.signbill) > 0) {
          this.$alert('该会员欠款：' + this.userinfo.signbill + ' 元', '提示', {
            center: true,
          })
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
        this.cikalist = res.data.data
        this.$message.success("加载完成")
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
      )
      if (res.data.code == 1) {
        this.$message.success("加载完成")
        this.tableData = res.data.data
      }
    }
  },
  created () {
    if (this.choose) {
      this.getInfo(this.choose.member_id)
      this.member_id = this.choose.member_id
      this.getXMcate()
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
        &.select {
          background: #f4f4f4;
          color: #28282d;
        }
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
      height: 100%;
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

    .imageRoom {
      height: calc(100% - 100px);
      overflow-y: auto;
      padding: 0 20px;
      > div {
        float: left;
        border: 1px dashed #ccc;
        margin: 10px;
      }
      /deep/ .el-image {
        .image-slot {
          text-align: center;
          vertical-align: middle;
          i {
            font-size: 80px;
            color: #ccc;
            line-height: 150px;
          }
        }
      }
    }
    .baseInfoView1 {
      padding: 0 15px;
      background: #fff;
      height: calc(100% - 85px);
      overflow-y: auto;
    }
    .infoItem {
      display: flex;
      border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
      padding: 15px 15px 15px 30px;
      line-height: 20px;
      .leftView {
        width: 120px;
        min-width: 120px;
        font-size: 15px;
        color: #28282d;
      }
      .valView {
        flex: 1;
        font-size: 15px;
        color: #5a5a5a;
        text-align: right;
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
    .item {
      display: flex;
      height: 50px;
      line-height: 50px;
      span {
        width: 100px;
      }
    }
  }
}
</style>
