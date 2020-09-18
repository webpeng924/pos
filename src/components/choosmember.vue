<template>
  <div class="orderSerConfigEmpView">
    <div class="topView">
      <button class="btn-showType">
        <img src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_OrderAddSer_Job.png" />
      </button>
      <div class="nameView">{{title}}</div>
      <div class="customView">
        服务于：
        <button class="select">{{serverfor}}</button>
      </div>
    </div>
    <div class="bcView">
      <div class="contentView">
        <div class="empBoxView">
          <div class="menuView listView">
            <div
              class="menuItem"
              :class="{select:choose1==null}"
              @click="choose1 = null;getitem()"
            >全部</div>
            <div
              class="menuItem"
              :class="{select:choose1==v}"
              v-for="(v,k) in catelist"
              :key="k"
              @click="choose1=v;getitem()"
            >{{v}}</div>
          </div>
          <div class="empView listView">
            <div
              class="empItem listItem btn-audio"
              :class="{select:choosegong.id==v.id}"
              v-for="(v,k) in workerlist"
              :key="k"
              @click="addworker(v)"
            >
              <div class="imgView">
                <img :src="v.avatar?v.avatar:'/upload/shop/moren.jpg'|imgUrl" />
              </div>
              <div class="textView">
                <div class="nameView">{{v.name}}</div>
                <div class="empIdView">工号：{{v.job_no}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="empTypeView listView">
          <div class="empSetView listItem btn-audio select">
            <div class="defView" v-if="!choosegong">
              大工
              <span>(选填)</span>
            </div>
            <div class="empView" v-else>
              <div class="nameView">{{choosegong.name}}</div>
              <!-- <div class="serTypeView"></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bView">
      <div class="cntView">
        数量：
        <el-input-number v-model="num" :min="1" :max="maxNum" :disabled="isusecard"></el-input-number>
      </div>
      <div class="amtView">
        总价：
        <span>￥&nbsp;{{money*num}}</span>
      </div>
      <button class="btn-complete btn-audio" @click="submit">确认</button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['setinfo'],
  data () {
    return {
      title: '',
      serverfor: '',
      money: 0,
      callback: null,
      num: 1,
      maxNum: 9999,
      storeid: sessionStorage.getItem('storeid'),
      choose: '1',
      choose1: null,
      catelist: [],
      workerlist: [],
      choosegong: '',
      isusecard: false
    }
  },
  methods: {
    open (option) {
      this.title = option.title
      this.serverfor = option.serverfor
      this.money = option.money
      this.num = option.num
      if (option.maxNum) {
        this.maxNum = Number(option.maxNum)
      }
      this.$nextTick(() => {
        this.getworkerlist()
      })
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
        res.data.data.forEach(item => {
          if (!item.avatar) {
            item.avatar = '/upload/shop/moren.jpg'
          }
          if (!this.catelist.includes(item.service_job)) {
            this.catelist.push(item.service_job)
          }
        })
        this.workerlist = res.data.data
        if (this.setinfo.worker && this.setinfo.worker.staff1 != 0) {
          this.choosegong = this.workerlist.find(item => item.id == this.setinfo.worker.staff1)
        }
      } else {
        this.workerlist = []
        this.$message.error('暂无员工')
      }
    },
    async getitem () {
      const res = await this.$axios.get('/api?datatype=get_staff_list', {
        params: {
          storeid: this.storeid,
          is_li: 0,
          is_wei: 1,
          search: this.choose1
        }
      })
      if (res.data.code == 1) {
        this.workerlist = res.data.data
      }
    },
    addworker (v) {
      if (this.choosegong.name == v.name) {
        this.choosegong = ''
      } else {
        this.choosegong = v
      }
    },
    submit () {
      let data = {
        num: this.num,
        choose: { gong: this.choosegong },
        price: this.money * this.num
      }
      console.log(data)
      this.$emit('close', data)
    }
  },
  created () {
    this.isusecard = false
    this.open(this.setinfo)
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.popView-contentView {
  width: 1024px;
  height: 75vh;
  border-radius: 6px;
  background: rgb(255, 255, 255);
  overflow: auto;
  box-shadow: rgb(51, 51, 51) 0px 0px 20px 0px;
}
.popView-contentView .el-dialog__header {
  display: none;
}
.orderSerConfigEmpView {
  background: #fff;

  .topView {
    display: flex;
    padding: 35px 20px 17px 0;
    line-height: 32px;
    box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
    z-index: 10;
    button {
      background: transparent;
      border: none;
      outline: none;
      box-sizing: border-box;
      cursor: pointer;
      padding: 0;
    }
    .btn-showType {
      padding: 3px 18px 3px 20px;
      height: 34px;
      border-right: 0.5px solid rgba(220, 220, 220, 0.7);
      margin-right: 15px;
      img {
        vertical-align: top;
        width: 28px;
        height: 28px;
      }
    }
    .nameView {
      max-width: 40%;
      min-width: 120px;
      font-family: PingFangSC-Semibold;
      font-size: 15px;
      color: #28282d;
    }
    .customView {
      margin-left: 25px;
      text-align: left;
      font-size: 15px;
      color: #8a8a8a;
      button {
        margin-left: 10px;
        line-height: 20px;
        padding: 6px 20px;
        font-size: 15px;
        color: #28282d;
        border-radius: 6px;
        border: 1px solid rgba(154, 154, 154, 0.5);
      }
      button.select {
        border: 1px solid #dc670b;
        background: #dc670b;
        color: #fff;
      }
    }
  }
  .bcView {
    position: relative;
    height: calc(75vh - 150px);
    .contentView {
      position: relative;
      height: 100%;
      display: flex;
      .empBoxView {
        flex: 1;
        min-height: 100%;
        background: #f4f4f4;
        max-width: 814px;
        .menuView {
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          padding: 10px 0;
          .menuItem {
            position: relative;
            display: inline-block;
            text-align: center;
            padding: 0 18px;
            line-height: 44px;
            color: #28282d;
            font-size: 15px;
            cursor: pointer;
            &.select {
              color: #28282d;
            }
            &.select:after {
              position: absolute;
              content: '';
              left: 0;
              right: 0;
              bottom: 3px;
              width: 24px;
              height: 2px;
              background: #dc670b;
              margin: auto;
            }
          }
        }
        .empView {
          position: relative;
          z-index: 10;
          height: calc(100% - 54px);
          margin-top: -10px;
          background: #f4f4f4;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 20px 0 20px 20px;
          .empItem {
            display: inline-flex;
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Check_N.png)
              200px center / 28px no-repeat;
            padding: 17px 40px 17px 15px;
            border-radius: 6px;
            width: 240px;
            height: 74px;
            margin: 0 20px 16px 0;
            .imgView {
              margin-right: 12px;
              img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }
            .textView {
              flex: 1;
              line-height: 20px;
              color: #28282d;
              .nameView {
                font-size: 15px;
              }
            }
          }
          .empItem.select {
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Check_S.png)
              200px center / 28px no-repeat;
          }
        }
      }
      .empTypeView {
        width: 210px;
        min-width: 210px;
        height: 100%;
        .empSetView {
          position: relative;
          padding: 22px 12px 22px 22px;
          line-height: 24px;
          height: 68px;
          overflow: hidden;
          cursor: pointer;
          .empView {
            display: flex;
            .nameView {
              flex: 3;
              font-size: 15px;
              color: #47bf7c;
            }
            .serTypeView {
              border-left: 0.5px solid rgba(154, 154, 154, 0.5);
              padding-left: 10px;
              flex: 2;
            }
            /deep/ .el-select {
              height: 24px;
              display: inline-block;
              position: relative;
              .el-input {
                display: block;
                position: relative;
                font-size: 14px;
                display: inline-block;
                width: 100%;
              }
            }
          }
        }
        .empSetView.select:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: #dc670b;
        }
      }
    }
  }
  .bView {
    position: relative;
    z-index: 10;
    display: flex;
    border-top: 0.5px solid rgba(154, 154, 154, 0.5);
    padding: 10px 20px;
    line-height: 40px;
    background: #fff;
    .cntView {
      margin-top: 2px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #8a8a8a;
    }
    .amtView {
      text-align: right;
      flex: 1;
      font-size: 14px;
      color: #8a8a8a;
      vertical-align: middle;
      span {
        color: #ff5e56;
        font-size: 20px;
      }
    }
    .btn-complete {
      margin-left: 30px;
      width: 110px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 16px;
      background: #dc670b;
      border-radius: 6px;
    }
  }
  .btn-close {
    position: absolute;
    top: 10px;
    right: 5px;
    width: 40px;
    height: 40px;
    z-index: 10;
    background: url(https://static.bokao2o.com/wisdomCashier/images/Icon_X_Gray.png)
      center / 28px 28px no-repeat;
  }
}
</style>
