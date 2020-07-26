<template>
  <div class="huankuan">
    <div class="topView">
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
      <div class="tView">还款</div>
    </div>
    <div class="contentView" style="width: 680px;">
      <div class="headerView">选择还款明细</div>
      <div class="qkAccListView listView">
        <div class="tView" v-show="signbillList.length">
          <label class="label-name">服务产品欠款</label>
          <label class="label-amt">
            剩余应还
            <span>￥&nbsp;{{totalPrice}}</span>
          </label>
          <button class="btn-select btn-audio" @click="chooseAll">全选</button>
        </div>
        <div class="listView">
          <div
            class="qkOrderItem btn-audio"
            v-for="(v,k) in signbillList"
            :key="k"
            :class="{select:choolist.includes(v.id)}"
            @click="addchoose(v)"
          >
            <div class="leftView">
              <div class="orderIdView">
                <span>单号：</span>
                {{v.order_no}}
                <!-- <label>&nbsp;收银</label> -->
              </div>
              <!-- <div class="nameView">
                <span>名称：</span>维C亮颜精华粉
              </div>-->
            </div>
            <div class="rightView">
              <div>
                <div class="textView">欠款金额</div>
                <div class="valView">￥&nbsp;{{v.money}}</div>
              </div>
              <div>
                <div class="textView">未还金额</div>
                <div class="valView">￥&nbsp;{{v.money}}</div>
              </div>
              <div>
                <div class="textView">还款金额</div>
                <div class="valView">￥&nbsp;{{choolist.includes(v.id)?v.money:0}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottomView">
        <div>
          总还款：
          <span>￥&nbsp;{{payPrice}}</span>
        </div>
        <el-button type="warning" style="width:200px" @click="submit">还款</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['member'],
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      signbillList: [],
      choolist: []
    }
  },
  methods: {
    async getlist () {
      const res = await this.$axios.get('/api?datatype=get_signbill_list', {
        params: {
          storeid: this.storeid,
          member_id: this.member.member_id
        }
      })
      if (res.data.code == 1 && res.data.list) {
        this.signbillList = res.data.list.filter(item => !item.repay_time)
      } else {
        this.signbillList = []
      }
    },
    addchoose (v) {
      if (this.choolist.includes(v.id)) {
        this.choolist = this.choolist.filter(item => item != v.id)
      } else {
        this.choolist.push(v.id)
      }
    },
    chooseAll () {
      this.choolist = []
      this.signbillList.forEach(item => {
        this.choolist.push(item.id)
      })
    },
    async submit () {
      if (!this.signbillList.length) return
      if (!this.choolist.length) return this.$message.error('请选择还款单')
      const res = await this.$axios.get('/api?datatype=repayment', {
        params: {
          storeid: this.storeid,
          member_id: this.member.member_id,
          id: this.choolist
        }
      })
      if (res.data.code == 1) {
        this.$message.success('还款成功')
        this.$emit('close')
      } else {
        this.$message.error(res.data.msg)
      }
    }
  },
  created () {
    this.getlist()
  },
  mounted () { },
  watch: {},
  computed: {
    totalPrice () {
      let sum = 0
      this.signbillList.forEach(item => {
        sum += Number(item.money)
      })
      return sum
    },
    payPrice () {
      let sum = 0
      this.choolist.forEach(item => {
        let a = this.signbillList.find(v => v.id == item)
        sum += Number(a.money)
      })
      return sum
    }
  }
}
</script>

<style lang="scss" scoped>
.huankuan {
  height: 100%;
  .topView {
    .tView {
      width: 100%;
      text-align: center;
    }
  }
  .contentView {
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    height: calc(100% - 85px);
    .headerView {
      line-height: 40px;
      font-size: 15px;
      color: #5a5a5a;
      padding-top: 20px;
    }
    .qkAccListView {
      height: calc(100% - 140px);
      overflow-x: hidden;
      overflow-y: auto;
      padding-bottom: 25px;
      .tView {
        line-height: 44px;
        .label-name {
          font-size: 16px;
          font-family: PingFangSC-Semibold;
          color: #28282d;
          min-width: 110px;
          margin-right: 15px;
        }
        .label-amt {
          font-size: 14px;
          color: #b0b0b0;
          span {
            margin-left: 10px;
            font-size: 18px;
            color: #28282d;
            font-family: DINAlternate-Bold;
            vertical-align: middle;
          }
        }
        .btn-select {
          float: right;
          line-height: 44px;
          font-size: 14px;
          color: #47bf7c;
          padding: 0 25px;
        }
      }
      .listView > .qkOrderItem {
        display: flex;
        background: #f4f4f4;
        border-radius: 6px;
        padding: 10px 15px;
        margin-bottom: 12px;
        .leftView {
          flex: 1;
          border-right: 1px dashed rgba(154, 154, 154, 0.5);
          font-size: 16px;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
        }
        .rightView {
          display: flex;
          padding-right: 60px;
          width: 420px;
          min-width: 420px;
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_N.png)
            385px center / 28px no-repeat;
          > div {
            flex: 1;
            text-align: center;
            // padding-top: 15px;
            .textView {
              line-height: 25px;
              font-size: 14px;
              color: #b0b0b0;
            }
            .valView {
              line-height: 36px;
              height: 36px;
              font-size: 18px;
              font-family: DINAlternate-Bold;
            }
          }
        }
        &.select > .rightView {
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_S.png)
            385px center / 28px no-repeat;
        }
      }
    }
    .bottomView {
      display: flex;
      padding: 15px 15px 20px 15px;
      div {
        flex: 1;
        font-size: 15px;
        content: #28282d;
        line-height: 44px;
        span {
          color: #ff5e56;
          font-size: 20px;
          font-family: DINAlternate-Bold;
          vertical-align: bottom;
        }
      }
    }
  }
}
</style>
