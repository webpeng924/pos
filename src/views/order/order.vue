<template>
  <div id="yuyue">
    <div class="topView">
      <div class="tView">
        <div class="typeView">员工预约</div>
        <button class="btn-pendRes"></button>
      </div>
      <div class="dateView">
        <button class="btn-date-before" @click="daybefore"></button>
        <!-- <button class="btn-dateText">2020-06-30 周二</button> -->
        <el-date-picker
          v-model="date"
          type="date"
          class="btn-dateText"
          prefix-icon="a"
          :clearable="false"
          format="yyyy年MM月dd日"
        ></el-date-picker>
        <button class="btn-date-next" @click="daynext"></button>
      </div>
      <div class="tags">
        <el-tag type="success" effect="dark" @click="addyuyue=true">预约</el-tag>
        <!-- <el-tag type="danger" effect="dark">占用</el-tag> -->
      </div>
      <div class="btnView">
        <i class="el-icon-search" @click="listDialog=true"></i>
      </div>
    </div>
    <div class="timeLineView" style="left: 1215px;"></div>
    <div class="CView">
      <div class="box">
        <div class="left">
          <div
            v-for="(v,k) in workerlist"
            :key="k"
            class="a_item"
            :style="`background:url(${imgurl(v.avatar)});background-size:100% 100%`"
          >
            <p>{{v.name}}</p>
            <p class="one-txt-cut">{{v.service_job}}({{v.job_no}})</p>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <div style="height:50px" v-for="(v,k) in timelist" :key="k">{{v.shi}}:{{v.fen}}</div>
          </div>
          <div class="item" v-for="(v,k) in timelist" :key="k">
            <div
              v-for="(val,index) in workerlist"
              :key="index"
              class="b_item"
              :class="{gr:val.shilist.includes(v.shi+':'+v.fen)}"
              :style="val[v.shi + ':' + v.fen]?'background:'+color(val[v.shi + ':' + v.fen].split(',')[1]):''"
              @click="checktime(v,val)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:addyuyue}">
      <addyuyue @close="addyuyue=false;checkyy()" :choose="info" v-if="addyuyue"></addyuyue>
    </div>
    <div class="statusView">
      <div class="flagView">
        <div class="flagItem">
          <label style="background: rgb(71, 191, 124);"></label>
          已预约
        </div>
        <div class="flagItem">
          <label style="background: rgb(145, 197, 255);"></label>
          已开单
        </div>
        <div class="flagItem">
          <label style="background: rgb(244, 78, 78);"></label>
          已占用
        </div>
        <!-- <div class="flagItem">
          <label style="background: rgb(237, 179, 57);"></label>
          已取消
        </div>-->
        <div class="flagItem">
          <label style="background: rgb(138, 138, 138);"></label>
          已过期
        </div>
      </div>
    </div>
    <el-dialog
      title="选择预约"
      :visible.sync="typeDialog"
      center
      custom-class="typeDialog"
      width="600px"
    >
      <div class="dialogMain">
        <div class="dialogItem" @click="toadd">美容预约</div>
        <div class="dialogItem" @click="submit">设置占用</div>
      </div>
    </el-dialog>

    <el-dialog
      :title="showcurrent.customer_type==0?'占用信息':'预约信息'"
      :visible.sync="yuyueDialog"
      center
      custom-class="yuyueDialog"
      width="500px"
    >
      <div class="contentView" style="max-height: 672px;">
        <div class="groupView">
          <div class="subView">
            <div class="leftView">顾客姓名</div>
            <div class="valView">{{showcurrent.name}}</div>
          </div>
          <div class="subView searchView">
            <div class="leftView">顾客电话</div>
            <div class="valView">{{showcurrent.mobile}}</div>
            <div class="searchItem"></div>
          </div>
          <div class="subView">
            <div class="leftView">预约项目</div>
            <div class="valView">{{showcurrent.itemname}}</div>
          </div>
        </div>
        <div class="groupView">
          <div class="subView">
            <div class="leftView">{{showcurrent.customer_type==0?'占用员工':'预约员工'}}</div>
            <div class="valView">{{showcurrent.staff}}</div>
          </div>
          <div class="subView">
            <div class="leftView">{{showcurrent.customer_type==0?'占用时间':'到店日期'}}</div>
            <div class="valView">{{showcurrent.yytime}}</div>
          </div>
          <div class="subView">
            <div class="leftView">操作人</div>
            <div class="valView">{{showcurrent.checkman}}</div>
          </div>
          <div class="subView remarkView">
            <div class="leftView">备注</div>
            <div class="valView">{{showcurrent.remark}}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div @click="cancel(showcurrent.id)" v-show="showcurrent.status==0">取消预约</div>
        <div v-show="showcurrent.status==2">已取消</div>
        <div v-show="showcurrent.status==1">已开单</div>
        <div v-show="showcurrent.status==3">已过期</div>
        <div @click="cancel(showcurrent.id)" v-show="showcurrent.status==4">取消占用</div>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="listDialog"
      center
      custom-class="quickmoney"
      width="600px"
      :before-close="handleClose"
    >
      <div class="inputView">
        <input prefix-icon="el-icon-search" placeholder="输入手机号查询" v-model="keyword" />
        <button class="btn-search btn-black btn-audio" @click="toSearch">搜索</button>
      </div>
      <div class="contentView" style="height: 500px;">
        <div class="tipView" v-show="!searchlist.length">没有相关的预约哟~</div>
        <div class="groupItem" v-show="searchlist.length">
          <div class="resItem btn-audio" v-for="(v,k) in searchlist" :key="k" @click="chooseOne(v)">
            <div class="timeView">
              <label>{{v.yytime}}</label>
            </div>
            <div class="empView">
              <!-- <div class="imgView">
                <img
                  src="https://static.bokao2o.com/wisdomCashier/images/Icon_noLogo.jpg?imageView2/1/w/200/h/200/interlace/1/q/100"
                />
              </div>-->
              <div class="textView">
                <div class="nameView overflowText">{{v.name}}</div>
                <div class="jobView overflowText">{{v.mobile}}</div>
              </div>
            </div>
            <div class="resUserView overflowText">
              <label class="label-name">{{v.itemname}}</label>&nbsp;
              <!-- <label class="label-resLen">
                <span>1小时</span>
              </label>&nbsp;-->
            </div>
            <div class="resUserView overflowText">
              <label class="label-tags">服务人员：{{v.staff}}</label>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addyuyue from '@/components/addyuyue'
import moment from 'moment'
export default {
  components: { addyuyue },
  props: {},
  data () {
    return {
      listDialog: false,
      workerlist: [],
      timelist: [{ shi: '08', fen: '00' }, { shi: '08', fen: '30' }, { shi: '09', fen: '00' }, { shi: '09', fen: '30' }],
      dialogVisible: false,
      date: '',
      storeid: sessionStorage.getItem('storeid'),
      addyuyue: false,
      searchlist: [],
      typeDialog: false,
      yylist: [],
      showcurrent: '',
      yuyueDialog: false,
      worker: '',
      workerid: '',
      keyword: '',
      staTime: '',
      info: ''
    }
  },
  watch: {
    date (val) {
      this.keyword = ''
      this.getworkerlist()
    }
  },
  computed: {},
  methods: {
    imgurl (data) {
      if (data) {
        return 'https://hb.rgoo.com' + data
      } else {
        return 'https://hb.rgoo.com/upload/shop/moren.jpg'
      }
    },
    toadd () {
      this.info = {
        workerid: this.workerid,
        time: this.staTime
      }
      this.addyuyue = true
      this.typeDialog = false
    },
    color (val) {
      switch (val) {
        case '0':
          return 'rgb(71, 191, 124)';
        case '1':
          return 'rgb(145, 197, 255)';
        case '2':
          return 'rgb(237, 179, 57)';
        case '3':
          return 'rgb(138, 138, 138)';
        case '4':
          return 'rgb(244, 78, 78)';
      }
    },
    async getworkerlist () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 0,
          is_wei: 1
        }
      })
      if (res.data.code == 1 && res.data.data) {
        res.data.data.forEach(v => {
          this.$set(v, 'shilist', [])
        })
        this.workerlist = res.data.data
        this.checkyy()
      } else {
        this.$message.error('无员工资料')
      }
    },
    async toSearch () {
      // console.log(this.keyword)
      if (!this.keyword) return this.$message.errer('请输入查询手机号')
      const res = await this.$axios.get('/api?datatype=get_yylist', {
        params: {
          storeid: this.storeid,
          mobile: this.keyword,
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.searchlist = res.data.data
      } else {
        this.searchlist = []
      }
    },
    chooseOne (v) {
      this.showcurrent = v
      this.yuyueDialog = true
      this.listDialog = false
      this.handleClose()
    },
    checktime (v, val) {
      // console.log(val, v)
      this.worker = val.name
      this.workerid = val.id
      this.staTime = moment(this.date).format('YYYY-MM-DD') + ' ' + v.shi + ':' + v.fen + ':00'
      // console.log(this.staTime)
      if (val.shilist.length) {
        let a = v.shi + ':' + v.fen
        let flag = val.shilist.some(item => a == item)
        if (flag) {
          let data = val[v.shi + ':' + v.fen].split(',')[0]
          // console.log(data)
          this.showcurrent = this.yylist.find(k => k.id == data)
          this.yuyueDialog = true
        } else {
          let now = new Date
          if (moment(this.date) < moment(this.formatDate(now))) return this.$message.error('时间已过，不可预约')
          let flag1 = this.date == this.formatDate(now)
          let nowshi = moment(now).format('HH')
          let nowfen = moment(now).format('m')
          if (flag1 && (v.shi <= nowshi && v.fen < nowfen)) {
            return this.$message.error('时间已过，不可预约')
          }
          this.typeDialog = true
        }
      } else {
        let now = new Date
        if (moment(this.date) < moment(this.formatDate(now))) return this.$message.error('时间已过，不可预约')
        let flag1 = this.date == this.formatDate(now)
        let nowshi = moment(now).format('HH')
        let nowfen = moment(now).format('m')
        if (flag1 && (v.shi <= nowshi && v.fen < nowfen)) {
          return this.$message.error('时间已过，不可预约')
        }
        this.typeDialog = true
      }
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    async checkyy () {
      const res = await this.$axios.get('/api?datatype=get_yylist', {
        params: {
          storeid: this.storeid,
          staffid: '',
          time: moment(this.date).format('YYYY-MM-DD')
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.yylist = res.data.data
        this.workerlist.forEach(v => {
          v['shilist'] = []
          res.data.data.forEach(item => {
            let shi = moment(item.yytime).format('HH')
            let fen = moment(item.yytime).format('mm')
            let shi1, fen1
            if (fen == '00') {
              shi1 = shi
              fen1 = '30'
            } else {
              shi1 = Number(shi) + 1 + ''
              fen1 = '00'
            }
            if (v.id == item.staffid) {
              v.shilist.push(shi + ':' + fen)
              v.shilist.push(shi1 + ':' + fen1)
              this.$set(v, shi + ':' + fen, item.id + ',' + item.status)
              this.$set(v, shi1 + ':' + fen1, item.id + ',' + item.status)
            }
          })
        })
      }
    },
    cancel (id) {
      this.$confirm('确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delyuyue(id)
      })
    },
    delyuyue (id) {
      this.$prompt('', '取消原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '请输入取消原因'
      }).then(async ({ value }) => {
        const res = await this.$axios.get('/api?datatype=cancel_yy', {
          params: {
            storeid: this.storeid,
            id: id,
            remark: value
          }
        })
        if (res.data.code == 1) {
          this.yuyueDialog = false
          this.$message.error('取消成功')
          this.getworkerlist()
        }
      })
    },
    async submit () {
      let params = {
        storeid: this.storeid,
        staffid: this.workerid,
        staff: this.worker,
        yytime: this.staTime,
        type: 2
      }
      const res = await this.$axios.get('/api?datatype=insert_yy', {
        params
      })
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('占用成功')
        this.typeDialog = false
      } else {
        this.$message.error(res.data.msg)
      }
      this.getworkerlist()
    },
    daybefore () {
      const day1 = new Date(this.date)
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
      this.date = this.formatDate(day1)
      // this.getworkerlist()
    },
    daynext () {
      const day1 = new Date(this.date)
      day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000)
      this.date = this.formatDate(day1)
      // this.getworkerlist()
    },
    handleClose () {
      this.listDialog = false
      this.keyword = ''
      this.searchlist = []
    }
  },
  created () {
    // this.getworkerlist()
    for (let i = 10; i < 22; i++) {
      for (let j = 0; j < 2; j++) {
        if (j == 0) {
          if (i != 10) {
            const a = { shi: i - 1, fen: '30' }
            this.timelist.push(a)
          }
        } else {
          const a = { shi: i, fen: '00' }
          this.timelist.push(a)
        }
      }
    }
    this.date = this.formatDate(new Date())
  },
  mounted () { }
}
</script>

<style lang="scss">
.dateView .el-input__inner {
  border: none;
  text-align: center;
}
.yuyueDialog {
  .contentView {
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    background: #fff;
    padding: 0 20px 25px 20px;
    overflow-x: hidden;
    overflow-y: auto;
    .groupView {
      border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
      padding: 10px 20px;
      .subView {
        display: flex;
        line-height: 30px;
        padding: 12px 0;
        color: #8a8a8a;
        .leftView {
          font-size: 15px;
          color: #8a8a8a;
          min-width: 70px;
        }
        .valView {
          flex: 1;
          text-align: right;
          font-size: 15px;
          color: #28282d;
        }
      }
    }
  }
  .dialog-footer {
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
#yuyue {
  .topView {
    position: fixed;
    display: flex;
    box-sizing: border-box;
    right: 0;
    width: calc(100% - 120px);
    padding: 35px 20px 10px 20px;
    height: 85px;
    line-height: 40px;
    z-index: 100;
    background: #fff;
    .tView {
      font-size: 24px;
      color: #28282d;
      .typeView {
        display: inline-block;
        width: 132px;
        margin-right: 15px;
      }
      .btn-pendRes {
        position: relative;
        vertical-align: top;
        margin-left: 15px;
        width: 40px;
        height: 40px;
        padding: 0;
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_ResTip.png)
          center / 28px no-repeat;
      }
    }
    .dateView {
      flex: 1;
      text-align: center;
      position: relative;

      button {
        display: inline-block;
        line-height: 40px;
        height: 40px;
        padding: 0;
        vertical-align: top;
      }
      .btn-date-before {
        width: 40px;
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Before.png)
          center / 32px no-repeat;
      }
      .btn-dateText {
        width: 260px;
        font-size: 18px;
        color: #28282d;
      }
      .btn-date-next {
        width: 40px;
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Next.png)
          center / 32px no-repeat;
      }
    }
    .tags {
      .el-tag {
        margin-right: 20px;
      }
    }
    .btnView i {
      font-size: 26px;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .CView {
    position: fixed;
    display: flex;
    bottom: 0;
    // font-size: 16px;
    height: calc(100% - 85px);
    width: calc(100% - 120px);
    .box {
      height: calc(100% - 50px);
      position: relative;
      overflow: auto;
      padding-left: 150px;
      z-index: 2;
      top: 54px;
      .left {
        position: absolute;
        left: 0;
        width: 150px;
      }
      .right {
        width: 100%;
        display: flex;
        overflow-x: auto;
        .top {
          top: 90px;
          position: fixed;
          width: calc(100% - 270px);
          display: flex;
          height: 50px;
          line-height: 50px;
          overflow-x: auto;
          overflow-y: hidden;
          background: #fff;
          border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
          z-index: 1;
          > div {
            flex: 1;
          }
        }
        .item {
          width: 150px;
        }
      }
      .a_item {
        position: relative;
        width: 150px;
        height: 150px;
        overflow-y: hidden;
        background: #f4f4f4;
        border-right: 0.5px solid rgba(220, 220, 220, 0.7);
        padding: 100px 10px 20px 20px;
        p {
          font-size: 14px;
          line-height: 20px;
          width: 100%;
          color: #fff;
        }
      }
      .b_item {
        cursor: pointer;
        height: 150px;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        border-right: 0.5px dashed rgba(220, 220, 220, 0.7);
      }
      .gr {
        background-color: #67c23a;
      }
      .red {
        background-color: #f56c6c;
      }
    }
  }
  .typeDialog {
    .dialogMain {
      padding-top: 40px;
      height: 300px;
      display: flex;
      .dialogItem {
        flex: 1;
        height: 200px;
        width: 200px;
        margin: 0 50px;
        background-color: #eee;
        font-size: 20px;
        text-align: center;
        line-height: 200px;
        cursor: pointer;
      }
    }
  }
  .statusView {
    position: fixed;
    right: 15px;
    bottom: 15px;
    display: flex;
    width: 360px;
    height: 32px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 5px;
    overflow: hidden;
    z-index: 100;
    .flagView {
      display: flex;
      flex: 1;
      padding-left: 12px;
      .flagItem {
        flex: 1;
        position: relative;
        padding-left: 18px;
        line-height: 32px;
        font-size: 12px;
        label {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }
    }
  }
  .quickmoney {
    .inputView {
      position: relative;
      min-width: 520px;
      left: 0;
      right: 0;
      margin: auto;
      height: 40px;
      background: #f4f4f4
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Search.png)
        13px center / 24px no-repeat;
      border-radius: 5px;
      overflow: hidden;
      padding: 5px 65px 5px 44px;
      margin: 20px;
      input {
        width: 100%;
        line-height: 30px;
        height: 30px;
        padding: 0;
        background: transparent;
        font-size: 14px;
        color: #28282d;
        border: none;
      }
      .btn-search {
        position: absolute;
        top: 0;
        right: 0;
        width: 65px;
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        background: #28282d;
        font-size: 15px;
        color: #fff;
      }
    }
    .tipView {
      font-size: 13px;
      color: #8a8a8a;
      text-align: center;
      line-height: 120px;
    }
    .resItem {
      display: flex;
      padding: 10px 15px;
      background: #fff;
      color: #28282d;
      cursor: pointer;
      .timeView {
        font-size: 14px;
        line-height: 22px;
        width: 100px;
        min-width: 13px;
        border-right: 2px solid #47bf7c;
        padding-right: 10px;
        text-align: center;
      }
      .empView {
        display: flex;
        flex: 1;
        margin-left: 10px;
      }
      .resUserView {
        flex: 1.2;
        margin-left: 10px;
        line-height: 44px;
        font-size: 14px;
      }
    }
  }
}
</style>
