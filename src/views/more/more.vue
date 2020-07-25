<template>
  <div id="more">
    <div class="leftView">
      <div class="topView">
        <p class="title">更多</p>
      </div>
      <div class="listView">
        <div
          class="userInfoItem menuItem btn-audio"
          :class="{p100:!show,active:active=='登陆信息'}"
          @click="selectOption('登陆信息')"
        >
          <div class="imgView">
            <img :src="shopInfo.avatar?shopInfo.avatar:'/upload/shop/moren.jpg'|imgUrl" />
          </div>
          <div class="textView">
            <div class="userNameView overflowText">admin</div>
            <div class="shopNameView overflowText">{{shopInfo.shop_name}}</div>
          </div>
        </div>
        <div class="menuItem" :class="{p100:!show,active:active=='功能'}" @click="selectOption('功能')">
          <img src="https://static.bokao2o.com/wisdomDesk/images/Menu_Feature.png" />
          功能
        </div>
        <div class="menuItem" :class="{p100:!show,active:active=='报表'}" @click="selectOption('报表')">
          <img src="https://static.bokao2o.com/wisdomDesk/images/Menu_Report.png" />
          报表
        </div>
        <div
          class="menuItem select"
          :class="{p100:!show,active:active=='管理中心'}"
          @click="selectOption('管理中心')"
        >
          <img src="https://static.bokao2o.com/wisdomDesk/images/Menu_System.png" />
          管理中心
        </div>
        <div class="menuItem" :class="{p100:!show}" @click="logOut">
          <img src="https://static.bokao2o.com/wisdomDesk/images/Menu_S3backend.png" />
          退出登录
        </div>
      </div>
    </div>
    <div class="rightView" :class="{show:show}">
      <div class="topView">
        <p class="title">{{active}}</p>
      </div>
      <div class="userInfoView" v-show="active=='登陆信息'">
        <div class="headerView">
          <div class="avatarView">
            <img :src="shopInfo.avatar?shopInfo.avatar:'/upload/shop/moren.jpg'|imgUrl" />
          </div>
          <div class="nameView">admin</div>
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
            {{shopInfo.tel}}
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
              <img src="../../assets/images/xiaofeimingxi.png" />
              <div>消费明细表</div>
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
            <!-- <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Report_JCTJ.png" />
              <div>寄存统计</div>
            </div>-->
          </div>
        </div>
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
            <div class="listItem btn-audio">
              <img src="../../assets/images/xiaohao.png" />
              <div>产品消耗设定</div>
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
            <!-- <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_XTCS.png" />
              <div>系统参数</div>
            </div>-->
          </div>
        </div>
        <!-- <div class="groupView">
          <div class="titleView">现场管理</div>
          <div class="listView">
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_SRZC.png" />
              <div>收入支出</div>
            </div>
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_MKDD.png" />
              <div>卖卡订单</div>
            </div>
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_CZDD.png" />
              <div>充值订单</div>
            </div>
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_FWMYD.png" />
              <div>服务满意度</div>
            </div>
          </div>
        </div>-->
        <div class="groupView">
          <div class="titleView">库存管理</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="panku=true">
              <img src="../../assets/images/kucunpandian1.png" />
              <div>库存盘点</div>
            </div>
            <!-- <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_CPJC.png" />
              <div>产品寄存</div>
            </div>-->
          </div>
        </div>
        <!-- <div class="groupView">
          <div class="titleView">系统管理</div>
          <div class="listView">
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_KCPD.png" />
              <div>订货系统</div>
            </div>
            <div class="listItem btn-audio">
              <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Feature_CPJC.png" />
              <div>后台管理</div>
            </div>
          </div>
        </div>-->
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
          </div>
        </div>
        <div class="groupView">
          <div class="titleView">营销中心</div>
          <div class="listView">
            <div class="listItem btn-audio" @click="msg=true">
              <img src="../../assets/images/msg.png" />
              <div>短信营销</div>
            </div>
          </div>
        </div>
        <div class="groupView">
          <div class="titleView">库存中心</div>
          <div class="listView">
            <div class="listItem btn-audio">
              <img src="../../assets/images/tongji.png" />
              <div>统计分析</div>
            </div>
          </div>
        </div>
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
      <erweima @close="erweima=false" v-if="erweima"></erweima>
    </div>
    <div class="set_page" :class="{activePage:memberView}">
      <memberView @close="memberView=false" v-if="memberView"></memberView>
    </div>
    <div class="set_page" :class="{activePage:panku}">
      <panku @close="panku=false" v-if="panku"></panku>
    </div>
  </div>
</template>

<script>
import product from './product'
import shopInfo from './shopInfo'
import projectlist from './projectList'
import memberlist from '../members/memberList'
import zhekou from './zhekou'
import xiaohao from './xiaohao'
import baobiao from '@/components/baobiao'
import kucun from './kucunliang'
import setCard from './setCard'
import msg from '../lqy/index'
import erweima from '../lqy/erweimaPay'
import memberView from '../member/index'
import panku from '../store/panku'
export default {
  components: { product, memberlist, projectlist, shopInfo, zhekou, xiaohao, baobiao, kucun, setCard, msg, erweima, memberView, panku },
  props: {},
  data () {
    return {
      show: false,
      active: '',
      storeid: sessionStorage.getItem('storeid'),
      product: false,
      memberlist: false,
      projectlist: false,
      shopinfo: false,
      zhekou: false,
      xiaohao: false,
      baobiao: false,
      kucun: false,
      msg: false,
      erweima: false,
      setcard: false,
      memberView: false,
      panku: false,
      shopInfo: {
        avatar: '',
        shop_name: ''
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    selectOption (data) {
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
    },
    logOut () {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear()
        this.$router.push({ name: 'login' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    async getInfo () {
      const res = await this.$axios.get('/api?datatype=more&storeid=' + this.storeid)
      console.log(res)
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
      overflow-x: hidden;
      overflow-y: auto;
      padding: 30px 0;
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
            font-family: PingFangSC-Medium;
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
}
</style>
