<template>
  <div id="more">
    <div class="leftView">
      <div class="topView">
        <p class="title">更多</p>
      </div>
      <div class="listView">
        <div
          class="userInfoItem menuItem btn-audio"
          :class="{p100:!show,active:active=='登录信息'}"
          @click="selectOption('登录信息')"
        >
          <div class="imgView">
            <img :src="userInfo.avatar|imgUrl" />
          </div>
          <div class="textView">
            <div class="userNameView overflowText">{{userInfo.username}}</div>
            <div class="shopNameView overflowText">{{shopInfo.shop_name}}</div>
          </div>
        </div>
        <div class="menuItem" :class="{p100:!show,active:active=='功能'}" @click="selectOption('功能')">
          <img src="../../assets/images/Menu.png" />
          功能
        </div>
        <div class="menuItem" :class="{p100:!show,active:active=='报表'}" @click="selectOption('报表')">
          <img src="../../assets/images/report.png" />
          报表
        </div>
        <div
          class="menuItem"
          :class="{p100:!show,active:active=='签到日历'}"
          @click="selectOption('签到日历')"
        >
          <img src="../../assets/images/calendar.png" />
          签到日历
        </div>
        <div
          class="menuItem select"
          :class="{p100:!show,active:active=='管理中心'}"
          @click="selectOption('管理中心')"
        >
          <img src="../../assets/images/system.png" />
          管理中心
        </div>
        <div class="menuItem" :class="{p100:!show}" @click="logOut">
          <img src="../../assets/images/out.png" />
          退出登录
        </div>
      </div>
    </div>
    <div class="rightView" :class="{show:show}">
      <div class="topView">
        <p class="title">{{active}}</p>
      </div>
      <div class="userInfoView" v-show="active=='登录信息'">
        <div class="headerView">
          <div class="avatarView">
            <img :src="shopInfo.avatar|imgUrl" />
          </div>
          <div class="nameView">{{userInfo.username}}</div>
        </div>
        <div class="shopView">
          <div>
            <span>连锁代码：</span>
            {{shopInfo.chain_code}}
          </div>
          <div>
            <span>门店代码：</span>
            {{shopInfo.shop_code}}
          </div>
          <div>
            <span>门店名称：</span>
            {{shopInfo.shop_name}}
          </div>
          <div>
            <span>门店电话：</span>
            {{shopInfo.mobile}}
          </div>
          <div>
            <span>门店地址：</span>
            {{shopInfo.address}}
          </div>
        </div>
      </div>
      <div class="reportView" v-show="active=='报表'">
        <div class="groupView">
          <div class="titleView">财务中心</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="baobiao=true">
              <!-- <div class="listItem btn-audio" @click="$message('暂无数据')"> -->
              <img src="../../assets/images/xiaofeimingxi.png" />
              <div>消费明细表</div>
            </div>
            <div class="listItem btn-audio" @click="openTable('staffRank')">
              <img src="../../assets/images/jCTJ.png" />
              <div>员工销售排行</div>
            </div>
            <div class="listItem btn-audio" @click="openTable('signbill')">
              <img src="../../assets/images/xiaofeimingxi.png" />
              <div>会员签帐汇总</div>
            </div>
          </div>
        </div>
        <div class="groupView">
          <div class="titleView">库存</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="kucun=true">
              <img src="../../assets/images/kucuntongji.png" />
              <div>库存量统计</div>
            </div>
            <div class="listItem btn-audio" @click="openTable('churutongji')">
              <img src="../../assets/images/jCTJ.png" />
              <div>出入库统计表</div>
            </div>
          </div>
        </div>
      </div>
      <div class="reportView" v-show="active=='签到日历'">
        <p style="font-size:15px">
          累计签到：{{attendDays}} 天
          <span style="margin-left:20px">
            累计积分：
            <img src="../../assets/images/jifen.png" style="width:16px" alt />
            {{attendintegral}}
          </span>
        </p>
        <el-calendar v-if="active=='签到日历'">
          <template slot="dateCell" slot-scope="{date, data}">
            <div
              class="calendar-day"
              v-if="data.day.substring(0, 7)==month"
              :class="{bgo:handleSelected(data.day) == 1,today:data.day==formatDate(new Date)}"
            >
              {{ data.day.split('-').slice(2).join('-') }}
              <br />
              <span v-if="handleSelected(data.day) == 1" style="color:#36c374">
                <img src="../../assets/images/jifen.png" style="width:16px" alt />
                +{{handleintegral(data.day)}}
              </span>
            </div>
            <!-- <div v-show="handleSelected"> -->
            <!-- //判断显示当前页，value是显示当前月份 -->
            <!-- <p v-if="handleSelected(data.day) == 1" style="line-height:30px">✔️</p> -->
            <!-- </div> -->
          </template>
        </el-calendar>
      </div>
      <div class="featureView" v-show="active=='功能'">
        <div class="groupView">
          <div class="titleView">基础设置</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="shopinfo=true">
              <img src="../../assets/images/mendian.png" />
              <div>门店资料</div>
            </div>
            <div class="listItem btn-audio" @click="projectlist=true">
              <img src="../../assets/images/xiangmu.png" />
              <div>项目资料</div>
            </div>
            <div class="listItem btn-audio" @click="product=true">
              <img src="../../assets/images/chanpin1.png" />
              <div>产品资料</div>
            </div>
            <div class="listItem btn-audio" @click="cikalist=true">
              <img src="../../assets/images/kucunpandian.png" />
              <div>次卡设置</div>
            </div>
            <div class="listItem btn-audio" @click="catelist=true">
              <img src="../../assets/images/xiaohao.png" />
              <div>项目/产品分类</div>
            </div>
            <div class="listItem btn-audio" @click="zhekou=true">
              <img src="../../assets/images/taocan.png" />
              <div>活动套装</div>
            </div>
            <div class="listItem btn-audio" @click="setcard=true">
              <img src="../../assets/images/kalei.png" />
              <div>卡类别资料</div>
            </div>
            <div class="listItem btn-audio" @click="memberlist=true">
              <img src="../../assets/images/yuangong1.png" />
              <div>员工资料</div>
            </div>

            <div class="listItem btn-audio" @click="quanlist=true">
              <img src="../../assets/images/diyongquan.png" />
              <div>抵用券设置</div>
            </div>
          </div>
        </div>
        <div class="groupView">
          <div class="titleView">库存管理</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="panku=true">
              <img src="../../assets/images/kucunpandian1.png" />
              <div>库存盘点</div>
            </div>
            <div class="listItem btn-audio" @click="jicun=true">
              <img src="../../assets/images/chanpin.png" />
              <div>产品寄存</div>
            </div>
            <div class="listItem btn-audio" @click="dinghuo=true">
              <img src="../../assets/images/mendian1.png" />
              <div>订货系统</div>
            </div>
            <el-dialog
              :close-on-click-modal="false"
              title="扫描下方二维码进入订货商城"
              :visible.sync="dinghuo"
              width="30%"
              center
            >
              <div style="text-align: center;padding: 20px;">
                <img style="width: 200px; height: 200px" src="../../assets/images/dinghuoPic.png" />
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="groupView" v-show="is_doublescreen==1">
          <div class="titleView">设置</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="kexian=true">
              <img src="../../assets/images/pc.png" />
              <div>客显屏轮播设置</div>
            </div>
            <el-dialog
              :close-on-click-modal="false"
              title="客显屏轮播设置"
              :visible.sync="kexian"
              width="30%"
              center
            >
              <div style="text-align: center;padding: 20px;">
                <div style="padding-bottom: 20px;">
                  <el-button type="primary" @click="changeFLAG(1)">轮播图片</el-button>
                  <el-button type="primary" @click="changeFLAG(3)">轮播视频</el-button>
                </div>
                <div style="padding-bottom: 10px;">
                  <el-button type="primary" @click="changeFLAG(2)">重新获取数据</el-button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="set_page_right" :class="{activePage:shopinfo}">
          <shopInfo @close="shopinfo=false" v-if="shopinfo"></shopInfo>
        </div>
      </div>
      <div class="contentView" v-show="active=='管理中心'">
        <div class="groupView">
          <div class="titleView">设置中心</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="erweima=true">
              <img src="../../assets/images/erweima.png" />
              <div>付款二维码</div>
            </div>
            <div class="listItem btn-audio" @click="updatepass=true">
              <img src="../../assets/images/pc.png" />
              <div>修改登录密码</div>
            </div>
            <el-dialog
              :close-on-click-modal="false"
              title="修改登录密码"
              :visible.sync="updatepass"
              width="30%"
              center
            >
              <div style="text-align: center;padding: 20px;">
                <div style="padding-bottom: 10px;">
                  <el-input placeholder="请输入原密码" v-model="oldpass"></el-input>
                </div>
                <div>
                  <el-input placeholder="请输入新密码" v-model="newpass"></el-input>
                </div>
                <div style="padding-top: 10px;">
                  <el-button type="primary" @click="changepass">确认修改</el-button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="groupView">
          <div class="titleView">营销中心</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="msg=true">
              <img src="../../assets/images/msg.png" />
              <div>短信营销</div>
            </div>
            <div class="listItem btn-audio" @click="orderlist=true">
              <img src="../../assets/images/yuangong.png" />
              <div>预约/占用历史</div>
            </div>
          </div>
        </div>
        <!-- <div class="groupView">
          <div class="titleView">库存中心</div>
          <div class="listView">
            <div class="listItem btn-audio">
              <img src="../../assets/images/tongji.png" />
              <div>统计分析</div>
            </div>
          </div>
        </div>-->
        <div class="groupView">
          <div class="titleView">会员中心</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="memberView=true">
              <img src="../../assets/images/ziliao.png" />
              <div>会员基本资料</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:product}">
      <product @close="product=false" v-if="product"></product>
    </div>
    <div class="set_page" :class="{activePage:zhekou}">
      <zhekou @close="zhekou=false" v-if="zhekou"></zhekou>
    </div>
    <div class="set_page" :class="{activePage:setcard}">
      <setCard @close="setcard=false" v-if="setcard"></setCard>
    </div>
    <div class="set_page" :class="{activePage:projectlist}">
      <projectlist @close="projectlist=false" v-if="projectlist"></projectlist>
    </div>
    <div class="set_page" :class="{activePage:xiaohao}">
      <xiaohao @close="xiaohao=false" v-if="xiaohao"></xiaohao>
    </div>
    <div class="set_page" :class="{activePage:catelist}">
      <catelist @close="catelist=false" v-if="catelist"></catelist>
    </div>
    <div class="set_page" :class="{activePage:memberlist}">
      <memberlist @close="memberlist=false" v-if="memberlist"></memberlist>
    </div>
    <div class="set_page" :class="{activePage:baobiao}">
      <baobiao @close="baobiao=false" v-if="baobiao"></baobiao>
    </div>
    <div class="set_page" :class="{activePage:kucun}">
      <kucun @close="kucun=false" v-if="kucun"></kucun>
    </div>
    <div class="set_page" :class="{activePage:msg}">
      <msg @close="msg=false" v-if="msg"></msg>
    </div>
    <div class="set_page" :class="{activePage:erweima}">
      <erweima @close="erweima=false;changeEWM()" v-if="erweima"></erweima>
    </div>
    <div class="set_page" :class="{activePage:memberView}">
      <memberView @close="memberView=false" v-if="memberView"></memberView>
    </div>
    <div class="set_page" :class="{activePage:cikalist}">
      <cikalist @close="cikalist=false" v-if="cikalist"></cikalist>
    </div>
    <div class="set_page" :class="{activePage:quanlist}">
      <quanlist @close="quanlist=false" v-if="quanlist"></quanlist>
    </div>
    <div class="set_page" :class="{activePage:panku}">
      <panku @close="panku=false" v-if="panku"></panku>
    </div>
    <div class="set_page" :class="{activePage:jicun}">
      <jicun @close="jicun=false" v-if="jicun"></jicun>
    </div>
    <div class="set_page" :class="{activePage:orderlist}">
      <orderlist @close="orderlist=false" v-if="orderlist"></orderlist>
    </div>
    <div class="set_page" :class="{activePage:showTable}">
      <churutongji @close="showTable=false;tableName=''" v-if="tableName=='churutongji'"></churutongji>
      <cardSale @close="showTable=false;tableName=''" v-if="tableName=='cardSale'"></cardSale>
      <staffRank @close="showTable=false;tableName=''" v-if="tableName=='staffRank'"></staffRank>
      <signbill @close="showTable=false;tableName=''" v-if="tableName=='signbill'"></signbill>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import product from './product'
import shopInfo from './shopInfo'
import projectlist from './projectList'
import memberlist from '../members/memberList'
import zhekou from './zhekou'
import catelist from './catelist'
import xiaohao from './xiaohao'
import baobiao from '@/components/baobiao'
import kucun from './kucunliang'
import setCard from './setCard'
import msg from '../lqy/index'
import erweima from '../lqy/erweimaPay'
import memberView from '../member/index'
import panku from '../store/panku'
import jicun from '../store/jicun'
import cikalist from './cikalist'
import quanlist from './quanlist'
import orderlist from '../order/orderlist'
import churutongji from './churutongji'
import cardSale from '../table/cardSale'
import staffRank from '../table/staffSale'
import signbill from '../table/signbillList'
export default {
  components: { product, memberlist, projectlist, shopInfo, zhekou, catelist, xiaohao, baobiao, kucun, setCard, msg, erweima, memberView, panku, cikalist, quanlist, orderlist, churutongji, cardSale, staffRank, jicun, signbill },
  props: {},
  data () {
    return {
      show: false,
      active: '',
      storeid: sessionStorage.getItem('storeid'),
      is_doublescreen: JSON.parse(sessionStorage.getItem('shopInfo')).is_doublescreen,
      catelist: false,
      product: false,
      memberlist: false,
      projectlist: false,
      shopinfo: false,
      zhekou: false,
      xiaohao: false,
      baobiao: false,
      kucun: false,
      orderlist: false,
      msg: false,
      erweima: false,
      setcard: false,
      memberView: false,
      dinghuo: false,
      panku: false,
      jicun: false,
      churutongji: false,
      cikalist: false,
      quanlist: false,
      showTable: false,
      kexian: false,
      updatepass: false,
      newpass: '',
      oldpass: '',
      tableName: '',
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      role: JSON.parse(sessionStorage.getItem('userInfo')).role,
      shopInfo: {
        avatar: '',
        shop_name: ''
      },
      attendData: [],
      attendDays: '',
      attendintegral: 0,
      month: ''
    }
  },
  watch: {
    month () {
      this.getSignList()
    }
  },
  computed: {},
  methods: {
    async changepass () {
      if (!this.newpass.trim() || !this.oldpass.trim()) return this.$message.error('请输入密码')
      let username = JSON.parse(sessionStorage.getItem('userInfo')).username
      const res = await this.$axios.get('/api?datatype=update_password', {
        params: {
          username: username,
          password: this.oldpass.trim(),
          newpass: this.newpass.trim()
        }
      })
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        setTimeout(() => {
          sessionStorage.clear()
          this.$router.push({ name: 'login' })
        }, 1000)
      } else {
        this.$message.error('失败：' + res.data.msg)
      }
    },
    openTable (name) {
      this.showTable = true
      this.tableName = name
    },
    handleSelected (day) {
      let flag = 0; //默认显示为0
      this.attendData.forEach(item => { //this.attendData是后台返回的数据
        if (item.date == day) {  //判断显示数据
          flag = 1;
          return
        }
      })
      return flag
    },
    handleintegral (day) {
      let integral = 0; //默认显示为0
      this.attendData.forEach(item => { //this.attendData是后台返回的数据
        if (item.date == day) {  //判断显示数据
          integral = item.integral;
          return
        }
      })
      return integral
    },
    changeEWM () {
      this.$axios.get('/api?datatype=more&storeid=' + this.storeid).then(
        res => {
          let data = res.data.data
          sessionStorage.setItem('shopInfo', JSON.stringify(data))
        }
      )
    },
    changeFLAG (type) {
      if (type == 1) {
        sessionStorage.setItem('FLAG', 'FLAG_1')
      } else if (type == 3) {
        sessionStorage.setItem('FLAG', 'FLAG_3')
      } else {
        var a = JSON.stringify({ id: this.storeid });
        javascript: jsSzb.smInit(a);
      }
      this.kexian = false
      var a = sessionStorage.getItem('FLAG')
      javascript: jsSzb.smClientScreen(a)
      return false;
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    selectOption (data) {
      if (this.role != 1) return this.$message.error('没有权限')
      if (this.active == data) {
        if (this.show) {
          this.show = false
          this.active = ''
        }
      } else {
        if (this.show) {
          this.active = data
        } else {
          this.active = data
          this.show = true
        }
      }
      if (data == '签到日历') {
        let now = new Date()
        this.month = moment(now).format('YYYY-MM')
        this.$nextTick(() => {
          // 点击上个月
          let prevBtn1 = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
          prevBtn1.addEventListener('click', () => {
            // console.log('上个月');
            this.month = moment(new Date(this.month)).subtract(1, "months").format('YYYY-MM')
          })
          // 点击今天
          let prevBtn2 = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)');
          prevBtn2.addEventListener('click', () => {
            // console.log('今天');
            this.month = moment(now).format('YYYY-MM')
          })
          // 点击下个月
          let prevBtn3 = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)');
          prevBtn3.addEventListener('click', () => {
            // console.log('下个月');
            this.month = moment(new Date(this.month)).add(1, 'months').format('YYYY-MM')
          })
        })
      }
    },
    async getSignList (month) {
      const res = await this.$axios.get('/api?datatype=get_sign_list', {
        params: {
          storeid: this.storeid,
          month: this.month
        }
      })
      if (res.data.code == 1) {
        this.attendData = res.data.data
        this.attendDays = res.data.count
        this.attendintegral = res.data.sum
      }
    },
    logOut () {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = JSON.parse(sessionStorage.getItem('userInfo')).id
        this.$axios.get('/api?datatype=logout&id=' + id)
        setTimeout(() => {
          sessionStorage.clear()
          this.$router.push({ name: 'login' })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    async getInfo () {
      const res = await this.$axios.get('/api?datatype=more&storeid=' + this.storeid)
      // console.log(res)
      if (res.data.code == 1) {
        this.shopInfo = res.data.data
        let data = JSON.stringify(res.data.data)
        sessionStorage.setItem('shopInfo', data)
      }
    }
  },
  created () {
    this.getInfo()
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#more {
  display: flex;
  .topView {
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    height: 85px;
    line-height: 85px;
    // padding-top: 65px;
    // font-size: 32px;
    .title {
      flex: 1;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      color: #28282d;
    }
  }
  .leftView {
    flex: 1;
    border-right: 0.5px solid rgba(220, 220, 220, 0.7);
    .listView {
      overflow-y: auto;
      padding: 30px 0;
      height: calc(100% - 85px);
      .menuItem {
        cursor: pointer;
        padding: 17px 22px;
        line-height: 28px;
        font-size: 15px;
        color: #28282d;
        > img {
          vertical-align: top;
          width: 28px;
          height: 28px;
          margin-right: 5px;
        }
        &.active {
          background-color: #f2f2f2;
        }
        &.userInfoItem {
          display: flex;
          .imgView {
            width: 54px;
            height: 54px;
            min-width: 54px;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
            img {
              width: 100%;
            }
          }
          .textView {
            flex: 1;
            padding-top: 7px;
          }
        }
      }
      .p100 {
        padding: 15px 20%;
      }
    }
  }
  .rightView {
    position: relative;
    width: 0;
    transition: 1s linear;
    .userInfoView {
      .headerView {
        background: #fff;
        text-align: center;
        padding-top: 60px;
        .avatarView {
          height: 138px;
          img {
            height: 100%;
          }
        }
        .nameView {
          height: 50px;
          line-height: 50px;
          font-size: 28px;
          color: #28282d;
        }
      }
      .shopView {
        position: relative;
        left: 0;
        right: 0;
        margin: 10px auto 0 auto;
        width: 500px;
        div {
          color: #28282d;
          font-size: 15px;
          line-height: 30px;
          padding: 5px 0;
        }
      }
    }
    .reportView,
    .featureView,
    .contentView {
      padding: 10px 15px;
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 85px);
      .groupView {
        margin-bottom: 20px;
        .titleView {
          line-height: 30px;
          font-size: 14px;
          color: #5a5a5a;
        }
        .listView {
          padding: 20px 0;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          .listItem {
            display: flex;
            width: 160px;
            text-align: center;
            font-size: 14px;

            color: #28282d;
            margin-bottom: 30px;
            div {
              line-height: 30px;
              margin-left: 10px;
            }
            img {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }
  }
  .rightView.show {
    flex: 3;
  }
  /deep/.el-calendar-table {
    td,
    tr:first-child td,
    tr td:first-child {
      border: none;
      pointer-events: none;
    }

    td.is-selected {
      background-color: transparent;
    }
    .el-calendar-day:hover {
      background-color: transparent;
    }
    .el-calendar-day {
      height: 50px;
      line-height: 30px;
      padding: 0;
      .calendar-day {
        text-align: center;
        color: #ccc;
      }
      .bgo {
        line-height: 25px;
        background-color: #ffe6d3;
        color: #28282d;
      }
      .today {
        color: #fff;
        background-color: #ffa967;
      }
    }
  }
}
</style>
