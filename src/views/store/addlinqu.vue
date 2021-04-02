<template>
  <div id="addPan">
    <div class="topView">
      <button class="btn-back" @click="$emit('close',0)"></button>
      <div class="tView" v-show="!type">查看</div>
      <div class="tView" v-show="type">{{type}}</div>
      <div class="btnView">
        <button class="btn-audio btn-green" @click="saveAdd" v-show="type">保存</button>
      </div>
    </div>
    <div class="contentView">
      <div class="orderInfoView">
        <div class="tView">单据信息</div>
        <div class="listView">
          <div class="groupView">
            <div class="subItem textView disView">
              <el-button
                style="width:100%;background: #d6c361 url(/img/VIPsmall.ac08d099.png) 90% center/82px no-repeat;"
              >{{membername}}</el-button>
            </div>
            <div class="subItem textView disView">
              <label>领取单号</label>
              <div>{{stock_no?stock_no:from_stock_no}}</div>
            </div>
            <div class="subItem textView disView">
              <label>单据类型</label>
              <div>领取</div>
            </div>
            <div class="subItem selectView">
              <label>领取日期</label>
              <div @click="()=>{if(this.type){dateDialog=true}}">{{date|time('y-m-d')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="incomeGoodsView">
        <div class="tView">详细信息</div>
        <div class="headerView">
          <div class="nameView">产品名称</div>
          <div class="priceView">领取数量</div>
          <div class="priceView">单位</div>
          <div class="priceView">负责员工</div>
          <div class="priceView" style="margin-left:10px">备注</div>
        </div>
        <div class="listView" v-if="type">
          <div class="listItem" v-for="(v,k) in chooselist" :key="k">
            <div class="nameView overflowText">{{v.name?v.name:v.goods_name}}</div>
            <div class="priceView">
              <input
                v-model="v.num"
                @input="changeNum(v)"
                :placeholder="`可领取数量：${v.number-v.out_number}`"
              />
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
        <div class="listView" v-show="!type">
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
  props: ['setid', 'type', 'membername', 'memberid'],
  data () {
    return {
      addpro: false,
      memberView: false,
      choosepro: false,
      tableData: [],
      tableData1: [],
      memberlist: [],
      keyword: '',
      searchtxt: '',
      list: [],
      storeid: sessionStorage.getItem('storeid'),
      stock_no: '',
      from_stock_no: '',
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
    async getinfoByid () {
      const res = await this.$axios.get('/api?datatype=get_membergoods_list_detail', {
        params: {
          storeid: this.storeid,
          jicun_id: this.setid
        }
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.from_stock_no = data.info.stock_no
        data.list.forEach(item => {
          this.$set(item, 'num', '')
          if (this.type) {
            this.$set(item, 'staff_id', '')
            this.$set(item, 'staff_name', '')
            this.$set(item, 'remark', '')
          }
        })
        this.chooselist = data.list
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
    async saveAdd () {
      let flag = this.chooselist.every(v => !v.num)
      if (flag) return this.$message.error('请至少输入一个领取数量')
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
        from_stock_no: this.from_stock_no,
        stock_no: this.stock_no,
        jicun_date: this.formatDate(this.date),
        checkman: JSON.parse(sessionStorage.getItem('userInfo')).username,
        member_id: this.memberid,
        type: '领取',
        goodsInfo: arr
      }
      const res = await this.$axios.post('/api?datatype=member_goods_out_add', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('成功')
        this.$emit('close', 1)
      }
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
      } else {
        v.num = 0
      }
      this.chooselist.forEach(item => {
        if (item.id == v.id) {
          if (item.num > v.number - v.out_number) {
            item.num = Number(v.number) - Number(v.out_number)
          }
          if (item.num < 0) {
            item.num = 0
          }
        }
      })
    }
  },
  created () {
    if (this.type) {
      this.getNewNo()
    }
    this.getinfoByid()
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
