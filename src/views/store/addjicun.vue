<template>
  <div id="addPan">
    <div class="topView">
      <button class="btn-back" @click="$emit('close',0)"></button>
      <div class="tView" v-show="setid">查看</div>
      <div class="tView" v-show="!setid">寄存</div>
      <div class="btnView">
        <button class="btn-audio btn-green" @click="saveAdd" v-show="!setid">保存</button>
      </div>
    </div>
    <div class="contentView">
      <div class="orderInfoView">
        <div class="tView">单据信息</div>
        <div class="listView">
          <div class="groupView">
            <div class="subItem textView disView" v-show="!membername">
              <el-button
                v-show="!member"
                plain
                style="width:100%"
                @click="getList();memberView=true"
              >选择会员</el-button>
              <el-button
                v-show="member"
                style="width:100%;background: #d6c361 url(/img/VIPsmall.ac08d099.png) 90% center/82px no-repeat;"
                @click="getList();memberView=true"
              >
                {{member.name}}
                <span style="margin:0 15px;font-size:13px">{{member.mobile}}</span>
              </el-button>
            </div>
            <div class="subItem textView disView" v-show="membername">
              <el-button
                style="width:100%;background: #d6c361 url(/img/VIPsmall.ac08d099.png) 90% center/82px no-repeat;"
              >{{membername}}</el-button>
            </div>
            <div class="subItem textView disView">
              <label>寄存单号</label>
              <div>{{stock_no}}</div>
            </div>
            <div class="subItem textView disView">
              <label>单据类型</label>
              <div>寄存</div>
            </div>
            <div class="subItem selectView">
              <label>寄存日期</label>
              <div @click="()=>{if(!this.setid){dateDialog=true}}">{{date|time('y-m-d')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="incomeGoodsView">
        <div class="tView">
          详细信息
          <!-- <button class="btn-add btn-audio">扫码</button> -->
          <button class="btn-add btn-audio" @click="openadd" v-show="!setid">选择产品</button>
          <!-- <button style="color:red" v-show="setid" @click="delInstore">删除</button> -->
        </div>
        <div class="headerView">
          <div class="nameView">产品名称</div>
          <div class="priceView">寄存数量</div>
          <div class="priceView">单位</div>
          <div class="priceView">负责员工</div>
          <div class="priceView" style="margin-left:10px">备注</div>
        </div>
        <div class="listView" v-if="!setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button class="btn-del btn-audio" @click="delchoose(v)"></button>
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="priceView">
              <input v-model="v.num" @change="changeNum(v)" />
            </div>
            <div class="priceView">{{v.goods_unit}}</div>
            <div class="priceView">
              <input
                v-model="v.staff_name"
                @click="chooseitem=v;workerDialog=true"
                placeholder="选择负责员工"
                readonly
                suffix-icon="el-icon-arrow-right"
              />
            </div>
            <div class="priceView" style="margin-left:10px">
              <input v-model="v.remark" placeholder="备注信息" />
            </div>
          </div>
        </div>
        <div class="listView" v-show="setid">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <button></button>
            <div class="nameView overflowText">{{v.goods_name}}</div>
            <div class="priceView overflowText">{{v.number}}</div>
            <div class="priceView">{{v.goods_unit}}</div>
            <div class="priceView">{{v.staff_name}}</div>
            <div class="priceView" style="margin-left:10px">{{v.remark}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="set_page" :class="{activePage:addpro}">
      <addPro @close="addpro=false"></addPro>
    </div>

    <!-- 选择产品 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择产品"
      :visible.sync="choosepro"
      custom-class="chooseDialog"
      :modal-append-to-body="false"
      center
      width="700px"
    >
      <div class="searchView">
        <input placeholder="请输入产品编号或名称" v-model="searchtxt" @change="changecate" />
      </div>
      <div class="headerView">
        <label class="label-code">编号</label>
        <label class="label-name">产品名称</label>
        <label>单位</label>
      </div>
      <div class="listView">
        <div class="listItem" v-for="(v,k) in tableData" :key="k" @click="chosCp(v)">
          <label class="label-icon" :class="{select:list.includes(v.id)}"></label>
          <label class="label-code">{{v.goods_no}}</label>
          <label class="label-name">{{v.goods_name}}</label>
          <label>{{v.goods_unit}}</label>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="choosepro = false">取 消</el-button>
        <el-button type="success" @click="submitGoods">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="日期选择"
      :visible.sync="dateDialog"
      center
      :append-to-body="true"
      custom-class="dialog"
    >
      <div @click="choosday">
        <el-calendar v-model="date"></el-calendar>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="memberView"
      width="70%"
      :append-to-body="true"
      title="选择会员"
      center
    >
      <div
        class="searchResView"
        style="background: linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%)"
      >
        <div class="topSearchView">
          <div class="inputView">
            <input placeholder="请输入会员名或手机号" v-model="keyword" @keyup.enter="getList" />
            <button class="btn-close btn-audio" @click="keyword=''"></button>
          </div>
          <button class="btn-audio" :class="{search:keyword}" @click="getList">查询</button>
        </div>
        <el-table :data="memberlist" style="width: 100%" height="400px" @row-click="choosMember">
          <el-table-column prop="address">
            <template slot-scope="scope">
              <img :src="scope.row.img|imgUrl" alt style="width:80px" />
            </template>
          </el-table-column>
          <el-table-column prop="card_num" label="卡号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <!-- <el-table-column prop="cardtype" label="卡类型"></el-table-column> -->
          <el-table-column prop="balance" label="储值余额"></el-table-column>
          <!-- <el-table-column prop="expiry_date" label="有效期"></el-table-column> -->
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="选择员工"
      :visible.sync="workerDialog"
      width="30%"
      center
      :append-to-body="true"
      custom-class="dialog"
    >
      <div class="contentView" style="max-height: 720px;">
        <div
          v-for="(v,k) in workerlist"
          :key="k"
          class="listItem"
          :class="{select:chooseitem.staff_id==v.id}"
          @click="chooseStaff(v)"
        >{{v.job_no}}-{{v.name}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addPro from '@/components/addpro.vue'
import qs from 'qs'
export default {
  components: { addPro },
  props: ['setid', 'membername'],
  data () {
    return {
      addpro: false,
      memberView: false,
      choosepro: false,
      tableData: [],
      tableData1: [],
      memberlist: [],
      keyword: '',
      member: '',
      searchtxt: '',
      list: [],
      storeid: sessionStorage.getItem('storeid'),
      stock_no: '',
      dateDialog: false,
      workerDialog: false,
      typeDialog: false,
      date: new Date,
      workerlist: [],
      chooseitem: '',
      searchtxt: null,
      chooselist: [],
    }
  },
  watch: {},
  methods: {
    choosday (e) {
      let flag1 = e.toElement.innerHTML.includes("上个月");
      let flag2 = e.toElement.innerHTML.includes("下个月");
      if (!flag1 && !flag2) {
        this.dateDialog = false      }
    },
    chooseStaff (v) {
      this.chooselist.forEach(item => {
        if (item.id == this.chooseitem.id) {
          item.staff_id = v.id
          item.staff_name = v.name
        }
      })
      this.workerDialog = false
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: this.storeid,
          sign: 2,
          search: this.keyword
        }
      })
      if (res.data.code == 1) {
        this.memberlist = res.data.data
      }
    },
    choosMember (row) {
      this.member = row
      this.memberView = false
    },
    async getinfoByid () {
      const res = await this.$axios.get('/api?datatype=get_membergoods_list_detail', {
        params: {
          storeid: this.storeid,
          jicun_id: this.setid
        }
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.stock_no = data.info.stock_no
        this.date = data.info.jicun_date

        this.chooselist = data.list
      }
    },
    delInstore () {
      this.$confirm('确认删除此出库单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          storeid: this.storeid,
          id: this.setid,
          role: JSON.parse(sessionStorage.getItem('userInfo')).role,
          checkman: JSON.parse(sessionStorage.getItem('userInfo')).username
        }
        const res = await this.$axios.get('/api?datatype=del_stock_out', { params })
        if (res.data.code == 1) {
          this.$message.success('操作成功')
          this.$emit('close', 1)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    async getworkerlist () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 1,
          is_wei: 1
        }
      })
      if (res.data.code == 1) {
        this.workerlist = res.data.data
      }
    },
    openadd () {
      this.choosepro = true
      this.getCPlist()
    },
    async getCPlist () {
      const res = await this.$axios.get('/api?datatype=get_skulist', {
        params: {
          storeid: this.storeid,
          status: 1,
          type: 1
        }
      })
      // console.log(res)
      this.tableData = res.data.data
      this.tableData1 = this.tableData
    },
    chosCp (v) {
      if (!this.list.includes(v.id)) {
        this.list.push(v.id)
      } else {
        this.list = this.list.filter(value => value != v.id)
      }
    },
    async saveAdd () {
      if (!this.member) return this.$message.error('请选择会员')
      if (!this.chooselist.length) return this.$message.error('缺少产品信息')
      let arr = []
      this.chooselist.forEach(item => {
        let obj = {
          goods_id: item.goods_id,
          goods_unit: item.goods_unit,
          goods_name: item.goods_name,
          staff_id: item.staff_id,
          staff_name: item.staff_name,
          number: item.num,
          remark: item.remark
        }
        arr.push(obj)
      })
      let data = {
        storeid: this.storeid,
        stock_no: this.stock_no,
        jicun_date: this.formatDate(this.date),
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        member_id: this.member.member_id,
        type: '寄存',
        goodsInfo: arr
      }
      const res = await this.$axios.post('/api?datatype=member_goods_add', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('成功')
        this.$emit('close', 1)
      }
    },
    delchoose (v) {
      this.chooselist = this.chooselist.filter(item => item.id != v.id)
      this.list = this.list.filter(item => item != v.id)
    },
    submitGoods () {
      let arr = []
      this.list.forEach(id => {
        let a = this.tableData1.find(item => item.id == id)
        let b = this.chooselist.find(val => val.id == id)
        this.$set(a, 'num', 1)
        this.$set(a, 'remark', '')
        this.$set(a, 'staff_name', '')
        this.$set(a, 'staff_id', '')
        Object.assign(a, b)
        // console.log(a, b)
        arr.push(a)
      })
      if (arr.length > 60) return this.$message.error('商品数量不能超过60个，请分批寄存！')
      this.chooselist = arr
      this.choosepro = false
    },
    async changecate () {
      const res = await this.$axios.get('/api?datatype=get_skulist', {
        params: {
          storeid: this.storeid,
          status: 1,
          type: 1,
          search: this.searchtxt
        }
      })
      this.tableData = res.data.data
    },
    async getNewNo () {
      const res = await this.$axios.get('/api?datatype=get_stock_no', {
        params: {
          storeid: this.storeid,
          type: 4
        }
      })
      if (res.data.code == 1) {
        this.stock_no = res.data.data
      }
    },
    // 修改数量
    changeNum (v) {
      if (v.num) {
        v.num = parseInt(v.num)
      }
      this.chooselist.forEach(item => {
        if (item.id == v.id) {
          if (item.num < 1) {
            item.num = 1
          }
        }
      })
    }
  },
  created () {
    if (this.setid) {
      this.getinfoByid()
    } else {
      this.getNewNo()
    }
    this.getworkerlist()
  },
  mounted () { }
}
</script>
<style lang="scss">
.chooseDialog.el-dialog {
  height: 80%;
  .el-dialog__body {
    height: calc(100% - 124px) !important;
  }
}
</style>
<style lang="scss" scoped>
#addPan {
  height: 100%;
  .topView {
    position: relative;
    padding: 35px 20px 10px 20px;
    text-align: center;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    .tView {
      font-size: 24px;
      color: #28282d;
      font-family: PingFangSC-Semibold;
      line-height: 40px;
      flex: 1;
    }
    .btnView {
      position: absolute;
      top: 35px;
      right: 15px;
      span {
        font-size: 16px;
        margin-right: 15px;
        color: #47bf7c;
      }
    }
    .btn-green {
      padding: 0 10px;
      line-height: 40px;
      height: 40px;
      background: #47bf7c;
      border-radius: 5px;
      font-size: 15px;
      color: #fff;
      width: 90px;
      height: 40px;
    }
  }
  .contentView {
    height: calc(100% - 85px);
    display: flex;
    div > .tView {
      padding: 15px 20px 10px 20px;
      line-height: 35px;
      font-size: 18px;
      color: #28282d;
      box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.01);
    }
    .orderInfoView {
      width: 300px;
      min-width: 300px;
      border-right: 0.5px solid rgba(220, 220, 220, 0.7);
      .listView {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px 0;
        height: calc(100% - 60px);
        .groupView {
          margin-bottom: 25px;
          .subItem {
            display: flex;
            line-height: 20px;
            padding: 12px 25px 12px 20px;
            font-size: 14px;
            &.selectView {
              background: transparent url(../../assets/images/Icon_Right.png)
                right center / 28px no-repeat;
            }
            > div {
              flex: 1;
              color: #28282d;
              text-align: right;
              cursor: pointer;
            }
          }
        }
      }
    }
    .incomeGoodsView {
      flex: 1;
      .tView > button {
        float: right;
        text-align: right;
        font-size: 15px;
        color: #47bf7c;
        width: 80px;
        height: 35px;
      }
      .headerView {
        display: flex;
        line-height: 44px;
        padding-left: 62px;
        padding-right: 5px;
        font-size: 14px;
        color: #8a8a8a;
        > div {
          text-align: center;
          flex: 2;
          &.nameView {
            flex: 3;
            text-align: left;
          }
        }
      }
      .listView {
        overflow-x: hidden;
        overflow-y: auto;
        padding-bottom: 35px;
        height: calc(100% - 104px);
        .listItem {
          position: relative;
          display: flex;
          background: #fff;
          padding: 6px 5px 6px 62px;
          line-height: 42px;
          font-size: 14px;
          color: #28282d;
          cursor: pointer;
          &:nth-child(odd) {
            background: #f4f4f4;
          }
          > div {
            flex: 2;
            text-align: center;
            input {
              display: block;
              width: 100%;
              background: #fff;
              border-radius: 5px;
              border: 0.5px solid rgba(220, 220, 220, 0.7);
              font-size: 14px;
              padding: 10px 0;
              line-height: 20px;
              text-align: center;
            }
            &.nameView {
              flex: 3;
              text-align: left;
            }
          }
          .btn-del {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 55px;
            background: #fff url(../../assets/images/Del_Red.png) center / 24px
              no-repeat;
          }
        }
      }
    }
  }
  .chooseDialog {
    .searchView {
      padding: 10px 12px;
      background: #f4f4f4;
      input {
        display: block;
        width: 100%;
        padding: 8px 12px 8px 38px;
        height: 36px;
        line-height: 20px;
        border: none;
        font-size: 14px;
        border-radius: 5px;
        background: #fff url(../../assets/images/search.png) 10px center / 24px
          no-repeat;
      }
    }
    .headerView {
      display: flex;
      padding: 15px 15px 10px 72px;
      line-height: 20px;
      color: #8a8a8a;
      justify-content: space-around;
      label {
        flex: 1;
      }
      label.label-name {
        flex: 2;
        text-align: left;
      }
    }
    .listView {
      overflow-x: hidden;
      overflow-y: auto;
      color: #28282d;
      height: calc(100% - 100px);
      .listItem {
        position: relative;
        display: flex;
        padding: 17px 15px 17px 72px;
        line-height: 20px;
        color: #8a8a8a;
        background: #fff;
        cursor: pointer;
        .label-icon {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 58px;
          background: #fff url(../../assets/images/check-kong.png) center / 24px
            no-repeat;
        }
        .label-icon.select {
          background: #fff url(../../assets/images/check-s.png) center / 24px
            no-repeat;
        }
        label {
          flex: 1;
          cursor: pointer;
        }
        label.label-name {
          flex: 2;
          text-align: left;
        }
      }
      .listItem:nth-child(odd) {
        background: #f8f8f8;
      }
    }
  }
}
</style>
