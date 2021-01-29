<template>
  <div class="orderAddView">
    <div class="leftView">
      <div class="topView">
        <div class="switchView">
          <button class="btn-audio" :class="{select:id==1}" @click="id=1">门店项目</button>|
          <button class="btn-audio" :class="{select:id==2}" @click="changeId">会员项目</button>
        </div>
        <button class="btn-back btn-audio" @click="$emit('close')"></button>
        <div class="btnView">
          <!-- <i class="el-icon-search" @click="showSearch = !showSearch"></i> -->
          <!-- <i class="iconfont icon-tiwen" @click="showSelect = !showSelect"></i> -->
        </div>
      </div>
      <div class="orderAddBoxView" v-show="id!=3">
        <div class="headerView" v-show="id==1">
          <div
            id="categoryView"
            class="collView listView"
            style="height: 44px;"
            v-show="!showSearch"
          >
            <!-- <div class="categoryItem btn-audio">
              <label class="select">常用</label>
            </div>-->
            <div class="categoryItem btn-audio" v-for="(v,k) in catelist" :key="k">
              <label :class="{select:active==v.id}" @click="changeActive(v.id)">{{v.title}}</label>
            </div>
          </div>
          <!-- <div class="keywordView" v-show="showSearch">
            <div class="inputView">
              <input placeholder="请输入代码或者名称查询" />
              <button class="btn-audio btn-search" @click="getXMlist">搜索</button>
            </div>
          </div>-->
        </div>
        <div class="boxView listView" style="height:100%; overflow-y: auto;" v-show="id==1">
          <div
            class="serviceItem boxItem btn-audio"
            v-for="(v,k) in XMlist"
            :key="k"
            @click="addItem(v)"
          >
            <div class="nameView">{{v.name}}</div>
            <div class="priceView">￥{{v.price}}</div>
          </div>
        </div>
        <div class="boxView listView" style="height:100%;" v-show="ismember">
          <el-table
            :data="cikalist"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%"
            height="100%"
            @row-click="choosecika"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column property="itemname" label="名称" width="120"></el-table-column>
            <el-table-column label="卡类型">
              <template slot-scope="scope">{{scope.row.typeid|type}}</template>
            </el-table-column>
            <el-table-column property="first_count" label="购买次数"></el-table-column>
            <el-table-column property="address" label="使用次数">
              <template slot-scope="scope">{{scope.row.first_count-scope.row.rest_count}}</template>
            </el-table-column>
            <el-table-column property="rest_count" label="剩余次数"></el-table-column>
          </el-table>
        </div>
      </div>

      <div id="order-resListView" v-show="id==3">
        <div class="listView">
          <div class="groupItem">
            <div class="dateView">
              06月28日
              <span>今天</span>
            </div>
            <div class="tipView" v-show="0">没有可开单的预约哟~</div>
            <div class="resItem btn-audio select">
              <div class="timeView">
                <label>18:30</label>
              </div>
              <div class="empView">
                <div class="textView">
                  <div class="nameView overflowText">炮儿</div>
                  <div class="jobView overflowText">22222222222</div>
                </div>
              </div>
              <div class="resTagView overflowText">
                <label class="label-resLen">
                  <span>30</span>分钟
                </label>&nbsp;
                <label class="label-tags">足部按摩</label>
              </div>
            </div>
          </div>
        </div>
        <div class="bView">
          <button class="btn-audio btn-notUse">不使用</button>
        </div>
      </div>
    </div>
    <div class="rightView">
      <div class="tView">
        <label>预约信息</label>
        <div class="customerView">
          <button :class="{select:!ismember}" @click="delmember">散客</button>
          <button :class="{select:ismember}" @click="tochosMember">会员</button>
        </div>
      </div>
      <div class="cardThumbView btn-audio" v-show="ismember">
        <div class="avartView">
          <img src="https://hb.rgoo.com/upload/shop/moren.jpg" width="100%" />
        </div>
        <div class="textView">
          <label class="label-name">{{ismember.name}}</label>
          <label class="label-cardNo">{{ismember.card_num}}</label>
        </div>
        <button class="btn-reset btn-audio" @click="memberView=true"></button>
      </div>
      <div class="listView" :class="{h180:ismember}">
        <div class="formView">
          <div class="inputView">
            <label class="label-leftText">顾客电话</label>
            <input placeholder="请输入顾客电话" v-model="cusMobile" />
          </div>
          <div class="inputView">
            <label class="label-leftText">顾客姓名</label>
            <input placeholder="请输入顾客姓名" v-model="cusName" />
          </div>
          <!---->
          <!-- <div class="creatMember">新会员</div> -->
        </div>
        <div class="formView">
          <!---->
          <div class="selectView">
            <label class="label-leftText">预约员工</label>
            <label
              class="label-val"
              :style="worker?'color:#000':'color:#999'"
              @click="toaddworker"
            >{{worker?worker:'请选择'}}</label>
          </div>
          <div class="selectView">
            <label class="label-leftText">预约时间</label>
            <label
              class="label-val"
              :style="staTime?'color:#000':'color:#999'"
              @click="tochoostime"
            >{{staTime?staTime:'请选择'}}</label>
          </div>
          <div class="selectView">
            <label class="label-leftText">预约时长</label>
            <input value="1小时" readonly />
          </div>
          <!-- <div class="cntView">
            <label class="label-leftText">到店人数</label>
            <div>
              <el-input-number v-model="num" @change="handleChange" :min="1" :max="999"></el-input-number>
            </div>
          </div>-->
          <div class="inputView">
            <label class="label-leftText">预约备注</label>
            <textarea
              placeholder="填写备注"
              maxlength="100"
              style="text-align: right;"
              v-model="remark"
            ></textarea>
          </div>
        </div>
        <div class="selectCourseView">
          <div class="subTView">预约项目</div>
          <div class="listItem" v-if="chosItem">
            <label class="label-name">{{chosItem.name}}</label>
            <button class="el-icon-delete btn-audio" @click="chosItem=''"></button>
          </div>
        </div>
      </div>
      <div class="btnView">
        <button class="btn-black btn-submit btn-audio" @click="submit">预约</button>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="memberView"
      width="70%"
      :before-close="handleClose"
      :append-to-body="true"
      title="选择会员"
      center
    >
      <div class="searchResView" style="background-color:#eee">
        <div class="topSearchView">
          <div class="inputView">
            <el-select v-model="type" placeholder="请选择">
              <el-option label="号码" value="号码"></el-option>
              <el-option label="姓名" value="姓名"></el-option>
            </el-select>
            <input placeholder="请输入会员名或手机号" v-model="keyword" />
            <button class="btn-close btn-audio" @click="keyword=''"></button>
          </div>
          <button class="btn-audio" :class="{search:keyword}" @click="getList">查询</button>
        </div>
        <el-table :data="tableData" style="width: 100%" height="500" @row-click="chooseCard">
          <el-table-column prop="address">
            <template slot-scope="scope">
              <img
                :src="scope.row.img?scope.row.img:'/upload/shop/moren.jpg'|imgUrl"
                alt
                style="width:80px;height:60px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="card_num" label="卡号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <!-- <el-table-column prop="cardtype" label="卡类型"></el-table-column> -->
          <el-table-column prop="balance" label="储值余额"></el-table-column>
          <!-- <el-table-column prop="expiry_date" label="有效期"></el-table-column> -->
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="workerDialog"
      center
      :modal-append-to-body="false"
      custom-class="workerDialog"
      title="选择预约员工"
    >
      <div class="menuView listView">
        <div class="menuItem" :class="{select:chosworker==null}" @click="chosworker=null">全部</div>
        <div class="menuItem" v-for="(v,k) in workercate" :key="k">{{v}}</div>
      </div>
      <div class="empView listView" style="height: 550px;">
        <div
          class="empItem listItem btn-audio"
          v-for="(v,k) in workerlist"
          :key="k"
          :class="{select:chosworker&&chosworker.id==v.id}"
          @click="chosworker=v"
        >
          <div class="imgView">
            <img :src="v.avatar?v.avatar:'/upload/shop/moren.jpg'|imgUrl" />
          </div>
          <div class="nameView">{{v.name}}</div>
          <div class="empIdView">工号：{{v.job_no}}</div>
        </div>
      </div>
      <div slot="footer" class="dialogFooter">
        <div @click="workerDialog = false">取 消</div>
        <div
          type="primary"
          @click="workerDialog=false;worker=chosworker.name;workerid=chosworker.id"
          class="btnok"
        >确 定</div>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dateDialog"
      center
      :append-to-body="true"
      custom-class="dateDialog"
      width="800px"
    >
      <div @click="chosdate" class="contant">
        <el-calendar v-model="yudate"></el-calendar>
        <div class="timeView">
          <div class="listView">
            <div
              class="listItem"
              :class="{select:hours == (v.shi + ':' + v.fen + ':00')}"
              v-for="(v,k) in timelist"
              :key="k"
              @click.stop="sethours(v)"
            >
              <label>
                {{v.shi}} : {{v.fen}}
                <span v-show="v.isyy">已预约</span>
              </label>
            </div>
            <div class="tipItem" v-show="!timelist.length">当日无可预约时间！</div>
          </div>
          <div class="btnView">
            <button @click="dateDialog = false">确认</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { format } from 'url';
export default {
  components: {},
  props: ['choose'],
  data () {
    return {
      type: '号码',
      keyword: '',
      ismember: '',
      memberView: false,
      id: 1,
      active: '',
      worker: null,
      chosworker: null,
      num: 1,
      storeid: sessionStorage.getItem('storeid'),
      showSelect: false,
      male: 'female',
      showSearch: false,
      tableData: [],
      catelist: [],
      XMlist: [],
      chosItem: '',
      cusMobile: '',
      cusName: '',
      staTime: '',
      dateDialog: false,
      workerDialog: false,
      yudate: new Date,
      workerDialog: false,
      workerlist: [],
      workercate: [],
      workerid: '',
      timelist: [{ shi: '08', fen: '00', isyy: false }, { shi: '08', fen: '30', isyy: false }, { shi: '09', fen: '00', isyy: false }, { shi: '09', fen: '30', isyy: false }],
      hours: '',
      remark: '',
      cikalist: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    handleChange () {

    },
    tochoostime () {
      if (this.worker) {
        this.dateDialog = true
        this.chosdate()
      } else {
        this.$message.error('请先选择预约员工')
        // this.getworkerlist()
        this.workerDialog = true
      }
    },
    async getworkerlist () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 1,
          is_wei: 1
        }
      })
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(item => {
          if (!item.avatar) {
            item.avatar = '/upload/shop/moren.jpg'
          }
          if (!this.workercate.includes(item.service_job)) {
            this.workercate.push(item.service_job)
          }
        })
        this.workerlist = res.data.data
        if (this.choose) {
          this.chosworker = this.workerlist.find(v => v.id == this.choose.workerid)
          this.worker = this.chosworker.name
          this.workerid = this.chosworker.id
        }
      }
    },
    toaddworker () {
      // this.getworkerlist()
      this.workerDialog = true
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    handleClose () {
      this.memberView = false
    },
    changeId () {
      if (this.ismember) {
        this.id = 2
        this.getcicardInfo()
      } else {
        this.tochosMember()
      }
    },
    async getcicardInfo () {
      const res = await this.$axios.get('/api?datatype=get_card_memberitem', {
        params: {
          storeid: this.storeid,
          member_id: this.ismember.member_id,
          sign: 1
        }
      })
      if (res.data.code == 1) {
        this.cikalist = res.data.data
      }
    },
    choosecika (data) {
      // this.$prompt('', '请输入项目使用次数', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputPattern: /^[0-9]+$/,
      //   inputValidator: (val) => { return Number(val) <= Number(data.rest_count) },
      //   inputErrorMessage: '次数错误或超出'
      // }).then(({ value }) => {
      //   // console.log(value, data)
      this.chosItem = {
        name: data.itemname,
        id: data.itemid,
        price: 0,
        cardid: data.id,
        usecika: 1
      }
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '取消使用'
      //   });
      // });
    },
    // 获取XMlist
    async getXMlist () {
      let url
      if (this.id == 1) {
        url = '/api?datatype=get_item_list'
      } else if (this.id == 2) {
        url = '/api?datatype=get_goods_list'
      }
      const res = await this.$axios.get(url, {
        params: {
          storeid: this.storeid,
          status: 1,
          cate: this.active
        }
      })
      // console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
      } else {
        if (this.showSearch) {
          this.$message.error('未搜索到该分类下项目或产品')
          this.keyword = ''
        }
        this.XMlist = []
      }
    },
    async getXMcate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate&storeid=' + this.storeid)
      // console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
      this.getXMlist()
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: this.storeid,
          sign: 2,
          search: this.keyword
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      }
    },
    changeActive (id) {
      this.active = id
      this.getXMlist()
    },
    addItem (v) {
      this.chosItem = v
    },
    async checkyy () {
      const res = await this.$axios.get('/api?datatype=get_yylist', {
        params: {
          storeid: this.storeid,
          staffid: this.workerid,
          time: moment(this.yudate).format('YYYY-MM-DD')
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        if (this.timelist.length > 0) {
          let arr = []
          res.data.data.forEach(item => {
            let aa = item.yytime.split(' ')[1]
            arr.push(aa)
          })
          // console.log(arr)
          for (let i = 0; i < this.timelist.length; i++) {
            let bb = this.timelist[i].shi + ':' + this.timelist[i].fen + ':00'
            // console.log(bb)
            if (arr.includes(bb)) {
              // console.log(this.timelist[i])
              this.timelist[i]['isyy'] = true
              this.timelist[i + 1]['isyy'] = true
            }
          }
        }
      }
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    chosdate () {
      let now = new Date
      this.timelist = [{ shi: '08', fen: '00', isyy: false }, { shi: '08', fen: '30', isyy: false }, { shi: '09', fen: '00', isyy: false }, { shi: '09', fen: '30', isyy: false }]
      let flag = this.formatDate(this.yudate) == this.formatDate(now)
      if (moment(this.yudate) > moment(this.formatDate(now))) {
        for (let i = 10; i < 22; i++) {
          for (let j = 0; j < 2; j++) {
            if (j == 0) {
              if (i != 10) {
                const a = { shi: i - 1, fen: '30', isyy: false }
                this.timelist.push(a)
              }
            } else {
              const a = { shi: i, fen: '00', isyy: false }
              this.timelist.push(a)
            }
          }
        }
        if (flag) {//当天的
          let nowshi = moment(now).format('HH')
          let nowfen = moment(now).format('m')
          this.timelist = this.timelist.filter(item => {
            // console.log(nowshi, item.shi, item.fen, nowfen)
            return item.shi > nowshi || item.shi == nowshi && nowfen < 30
          })
        }
      } else {
        this.timelist = []
      }
      // console.log(this.timelist)
      this.checkyy()
    },
    tochosMember () {
      this.memberView = true
      this.getList()
    },
    delmember () {
      if (this.ismember) {
        this.$confirm('确认放弃使用会员卡吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ismember = ''
          this.id = 1
          if (this.chosItem.usecika == 1) {
            this.chosItem = ''
          }
        })
      }
    },
    chooseCard (row) {
      // // console.log(row)
      this.ismember = row
      this.cusMobile = row.mobile
      this.cusName = row.name
      this.memberView = false
      this.id = 2
      if (this.chosItem.usecika == 1 && this.chosItem.id != row.itemid) {
        this.chosItem = ''
      }
      this.getcicardInfo()
    },
    sethours (v) {
      if (v.isyy) return this.$message.error('该时段已被预约！')
      this.hours = v.shi + ":" + v.fen + ":00"
      let date = moment(this.yudate).format('YYYY-MM-DD')
      this.staTime = date + ' ' + this.hours
    },
    async submit () {
      if (!this.cusMobile) return this.$message.error('请输入顾客电话')
      if (!(/^1[3456789]\d{9}$/.test(this.cusMobile))) return this.$message.error('请输入正确手机号')
      if (!this.cusName) return this.$message.error('请输入顾客姓名')
      if (!this.workerid) return this.$message.error('请选择预约员工')
      if (!this.staTime) return this.$message.error('请选择预约时间')
      if (!this.chosItem) return this.$message.error('请选择预约项目')
      // let date = moment(this.yudate).format('YYYY-MM-DD')
      let params = {
        type: 1,
        name: this.cusName,
        mobile: this.cusMobile,
        storeid: this.storeid,
        customer_type: this.ismember ? '2' : '1',
        member_id: this.ismember ? this.ismember.member_id : 0,
        staffid: this.workerid,
        staff: this.worker,
        yytime: this.staTime,
        itemid: this.chosItem.id,
        itemname: this.chosItem.name,
        cicardId: this.chosItem.cardid,
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        price: this.chosItem.price,
        remark: this.remark
      }
      const res = await this.$axios.get('/api?datatype=insert_yy', {
        params
      })
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('预约成功')
        this.$emit('close')
      } else {
        this.$message.success('预约失败')
      }
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
  created () {
    this.getXMcate()
    this.getworkerlist()
  },
  mounted () {
    if (this.choose) {
      this.staTime = this.choose.time
    }
  }
}
</script>


<style lang="scss">
.workerDialog {
  .empView {
    position: relative;
    z-index: 10;
    margin-top: -10px;
    background: #f4f4f4;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px 0 20px 15px;
    .empItem {
      display: flex;
      background: #f4f4f4 url(../assets/images/check-kong.png) 95% center / 28px
        no-repeat;
      padding: 12px 50px 12px 0;
      .imgView {
        margin-right: 15px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .nameView {
        flex: 1;
        font-size: 15px;
        color: #28282d;
        line-height: 20px;
        padding: 10px 0;
      }
      .empIdView {
        flex: 1;
        color: #8a8a8a;
        padding: 10px 0;
        margin-left: 10px;
      }
    }
    .empItem.select {
      background: #f4f4f4 url(../assets/images/check-xuan.png) 95% center / 28px
        no-repeat;
    }
  }
  /deep/ .el-dialog__footer {
    padding: 0;
  }
  .dialogFooter {
    display: flex;
    justify-content: space-between;
    > div {
      flex: 1;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
    }
    .btnok {
      background-color: #000;
      color: #fff;
    }
  }
}
.dateDialog {
  .contant {
    display: flex;
    .timeView {
      width: 284px;
      height: 600px;
      padding: 80px 42px 30px;
      .listView {
        overflow-x: hidden;
        overflow-y: auto;
        height: 470px;
        // padding-bottom: 35px;
        .listItem {
          line-height: 44px;
          height: 44px;
          text-align: left;
          label {
            font-size: 18px;
            color: #28282d;
            padding-left: 50px;
            cursor: pointer;
            span {
              margin-left: 12px;
              font-size: 14px;
              color: #ccc;
            }
          }
        }
        .listItem.select {
          border-top: 0.5px solid rgba(154, 154, 154, 0.5);
          border-bottom: 0.5px solid rgba(154, 154, 154, 0.5);
        }
        .listItem.select > label {
          font-size: 20px;
          border-left: 2px solid #47bf7c;
          color: #47bf7c;
          box-sizing: border-box;
        }
        .tipItem {
          line-height: 300px;
          font-size: 15px;
          color: #8a8a8a;
          text-align: center;
        }
      }
      .btnView {
        margin-top: 30px;
        text-align: center;
        button {
          width: 190px;
          height: 40px;
          line-height: 40px;
          background: #28282d;
          font-size: 15px;
          color: #fff;
          border-radius: 6px;
          padding: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.orderAddView {
  display: flex;
  height: 100%;

  button {
    background: transparent;
    border: none;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    padding: 0;
  }
  .btn-back {
    width: 40px;
    height: 40px;
    background-image: url(../assets/images/back.png);
    background-position: left center;
    background-size: 28px;
    background-repeat: no-repeat;
    position: absolute;
    top: 25px;
    left: 15px;
  }
  .leftView {
    width: 100%;
    height: 100%;
    padding-right: 400px;
    .topView {
      position: relative;
      background: #fff;
      padding: 25px 0 15px 78px;

      .btnView {
        position: absolute;
        top: 25px;
        right: 15px;
        height: 40px;
        i {
          font-size: 28px;
          padding: 10px;
          vertical-align: top;
        }
      }
      .switchView {
        display: inline-flex;
        height: 40px;
        button {
          display: flex;
          font-size: 16px;
          color: #5a5a5a;
          vertical-align: middle;
          padding: 0 20px;
          text-align: center;
          line-height: 40px;
        }
        button.select {
          font-size: 20px;
          color: #dc670b;
        }
      }
      .btn-back {
        width: 40px;
        height: 40px;
        background-image: url(../assets/images/back.png);
        background-position: left center;
        background-size: 28px;
        background-repeat: no-repeat;
        position: absolute;
        top: 25px;
        left: 15px;
      }
    }
    .orderAddBoxView {
      position: relative;
      // background: #f4f4f4;
      height: calc(100% - 85px);
      .headerView {
        position: relative;
        background: #fff;
        padding: 0 15px 15px 15px;
        z-index: 10;
        #categoryView {
          position: relative;
          height: 44px;
          line-height: 44px;
          padding: 0 40px 0 10px;
          transition: transform 0.7s, background 0.7s, height 0.7s;
          border-radius: 5px;
          background: #f8f8f8;
          overflow: hidden;
          .categoryItem {
            position: relative;
            display: inline-block;
            text-align: center;
            padding: 0 18px;
            height: 44px;
            color: #5a5a5a;
            label.select {
              font-family: PingFangSC-Semibold;
              color: #47bf7c;
            }
            label {
              display: inline-block;
              height: 32px;
              box-sizing: border-box;
              line-height: 32px;
              font-family: PingFangSC-Regular;
              font-size: 15px;
              cursor: pointer;
            }
          }
        }
        .keywordView {
          height: 44px;
          .inputView {
            position: relative;
            background: #f4f4f4 url(../assets/images/search.png) 8px center /
              24px no-repeat;
            line-height: 44px;
            border-radius: 6px;
            padding: 0 60px 0 38px;
            overflow: hidden;
            button {
              position: absolute;
              top: 0;
              right: 0;
              background: #28282d;
              font-size: 14px;
              color: #fff;
              text-align: center;
              width: 60px;
              line-height: 44px;
              height: 44px;
              padding: 0;
            }
            input {
              border: none;
              display: block;
              width: 100%;
              height: 44px;
              line-height: 30px;
              padding: 12px 0;
              font-size: 14px;
              color: #28282d;
              background: transparent;
            }
          }
        }
      }
      .boxView {
        position: relative;
        background: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 5px 18px 25px 18px;
        .boxItem {
          position: relative;
          float: left;
          width: 136px;
          height: 105px;
          background: #f8f8f8;
          border-radius: 6px;
          text-align: center;
          margin: 0 15px 15px 0;
          box-shadow: 0 2px 2px 1px #ddd;
          .nameView {
            height: 71px;
            font-size: 15px;
            color: #28282d;
            line-height: 20px;
            padding: 23px 5px 0 5px;
            overflow: hidden;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          .priceView {
            height: 34px;
            line-height: 34px;
            background: #f4f4f4;
            color: #28282d;
            font-size: 16px;
            font-family: DINAlternate-Bold;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        }
      }
      .filterView {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: 1s;
        .contentView {
          position: absolute;
          top: 62px;
          right: 15px;
          width: 560px;
          height: 582px;
          background: #fff;
          overflow-x: hidden;
          overflow-y: auto;
          border-radius: 6px;
          padding: 0 15px 20px 15px;
          box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
          .tView {
            line-height: 40px;
            font-size: 14px;
            color: #5a5a5a;
          }
          .listView {
            overflow: hidden;
          }
          .listItem {
            float: left;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #28282d;
            text-align: center;
            border: 0.5px solid #ddd;
            border-radius: 5px;
            width: 120px;
            margin-right: 11px;
            margin-bottom: 11px;
          }
          .listItem:nth-child(4n + 4) {
            margin-right: 0;
          }
          .select {
            background: #47bf7c;
            color: #fff;
            border: 0.5px solid #47bf7c;
          }
          .firstLetterFilterView {
            .listItem {
              width: 56px;
              margin-right: 9px;
            }
          }
          .btnView {
            text-align: center;
            button {
              width: 135px;
              height: 42px;
              line-height: 42px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 15px;
              color: #28282d;
              margin: 0 8px;
            }
            button.btn-comp {
              background: #28282d;
              color: #fff;
            }
          }
        }
      }
      .turnLeft {
        left: 100%;
        opacity: 0;
      }
    }
  }
  .rightView {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 10;
    width: 400px;
    min-width: 400px;
    box-shadow: 0 0 2px 0 #ddd;
    input {
      box-sizing: border-box;
      border: none;
      font-size: 14px;
    }
    .cardThumbView {
      position: relative;
      display: flex;
      background: #d6c361 url(../assets/images/VIPsmall.png) 90% center / 82px
        no-repeat;
      height: 50px;
      border-radius: 6px 6px 0 0;
      padding: 7px 10px;
      cursor: pointer;
      margin: 0 15px 10px 15px;
      .avartView {
        width: 36px;
        height: 36px;
        border: 0.5px solid #fff;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
      }
      .textView {
        flex: 1;
        line-height: 36px;
        color: #604e2a;
        font-size: 14px;
      }
      .btn-reset {
        width: 48px;
        height: 36px;
        background: transparent url(../assets/images/turn.png) center / 28px
          no-repeat;
      }
    }
    .tView {
      display: flex;
      padding: 35px 12px 10px 12px;
      font-family: PingFangSC-Semibold;
      color: #28282d;
      height: 85px;
      label {
        display: block;
        height: 32px;
        line-height: 32px;
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #28282d;
        padding-right: 20px;
        margin: 4px 0;
        border-right: 0.5px solid #ddd;
      }
      .customerView {
        display: flex;
        height: 34px;
        border-radius: 6px;
        overflow: hidden;
        background: #f4f4f4;
        padding: 0;
        margin: 4px 0 4px 12px;
        > button {
          flex: 1;
          width: 52px;
          height: 34px;
          line-height: 34px;
          background: #f4f4f4;
          color: #8a8a8a;
          font-size: 15px;
          padding: 0;
        }
        > button.select {
          color: #fff;
          background: #28282d;
        }
      }
    }
    .listView {
      height: calc(100% - 130px);
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 15px 15px 15px;
      &.h180 {
        height: calc(100% - 200px);
      }
      .formView {
        margin-bottom: 15px;
        background: #f4f4f4;
        border-radius: 6px;
        padding: 0 15px;
        > div {
          display: flex;
          line-height: 24px;
          padding: 15px 0;
          border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);

          input {
            flex: 1;
            padding-right: 15px;
            text-align: right;
            background: #f4f4f4;
            color: #28282d;
            font-size: 14px;
          }
          textarea {
            flex: 1;
            padding-right: 15px;
            resize: none;
            background: #f4f4f4;
            color: #28282d;
            border: none;
            font-size: 14px;
            height: 60px;
          }
          .label-val {
            flex: 1;
            padding-right: 15px;
            text-align: right;
            color: #28282d;
            font-size: 14px;
          }
          &.selectView > .label-val {
            padding-right: 22px;
            background: transparent url(../assets/images/Icon_Right.png) right
              center / 28px no-repeat;
          }
        }
        > div:last-child {
          border-bottom: none;
        }
        > div.cntView > div {
          flex: 1;
          text-align: right;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          color: #8a8a8a;
        }
      }
      .formView.userView {
        position: relative;
        padding-right: 90px;
        .creatMember {
          position: absolute;
          display: block;
          cursor: pointer;
          top: 0;
          bottom: 0;
          right: 0;
          width: 75px;
          height: 60px;
          border-left: 0.5px solid rgba(220, 220, 220, 0.7);
          line-height: 60px;
          text-align: center;
          font-size: 15px;
          color: #47bf7c;
          padding: 0;
          margin: auto;
        }
      }
      .selectCourseView {
        .subTView {
          margin-top: 10px;
          line-height: 36px;
          padding-left: 15px;
          font-size: 15px;
          color: #28282d;
        }
        .listItem {
          position: relative;
          display: flex;
          line-height: 20px;
          padding: 17px 10px 17px 46px;
          font-size: 14px;
          color: #5a5a5a;
          background: #f4f4f4;
          border-radius: 6px;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .btnView {
      width: 100%;
      position: absolute;
      bottom: 0;
      height: 48px;
      .btn-black {
        padding: 0 10px;
        width: 100%;
        height: 48px;
        line-height: 48px;
        background: #28282d;
        font-size: 15px;
        color: #fff;
      }
    }
  }
  .overflowText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
