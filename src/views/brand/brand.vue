<template>
  <div id="brand">
    <div class="topView">
      <div class="tView">流水牌</div>
      <div id="orderHolder_menuView" class="menuView">
        <div class="menuItem btn-audio" :class="{select:chos==1}" @click="chos=1">
          <label>1</label>
        </div>
        <div class="menuItem btn-audio" :class="{select:chos==2}" @click="chos=2">
          <label>日常</label>
        </div>
      </div>
      <div class="statusView">
        <label>
          <span style="background: rgb(237, 179, 57);"></span>点牌
        </label>
        <label>
          <span style="background: rgb(136, 101, 101);"></span>轮牌
        </label>
        <label>
          <span style="background: rgb(71, 191, 124);"></span>待客
        </label>
        <label>
          <span style="background: rgb(221, 221, 221);"></span>休息
        </label>
      </div>
      <div class="typeView">
        轮牌调整
        <el-switch v-model="flag" active-color="#13ce66"></el-switch>
      </div>
    </div>
    <div id="scheduleIndex_content" class="contentView listView" style="min-height: 969px;">
      <div id="scheduleIndex_group_0" class="groupView">
        <div class="headerView">1</div>
        <div class="empsBox">
          <div
            class="empItem"
            v-for="item in menberlist"
            :key="item"
            v-dragging="{ item: item, list: menberlist, group: '1' }"
          >
            <div class="timeLenView" style="background: rgb(71, 191, 124);"></div>
            <div class="imgView" style="background-image: url();">
              <!---->
            </div>
            <div class="empIdView">{{item}}</div>
            <div class="empNameView">店长(店长)</div>
          </div>
          <div class="empItem">
            <div class="timeLenView" style="background: rgb(71, 191, 124);"></div>
            <div class="imgView" style="background-image: url();">
              <!---->
            </div>
            <div class="empIdView">1001</div>
            <div class="empNameView">123</div>
          </div>
          <div class="empItem addItem" @click="dialogVisible = true;showtit=1"></div>
        </div>
      </div>
      <div id="scheduleIndex_group_1" class="groupView">
        <div class="headerView">日常</div>
        <div class="empsBox">
          <div class="empItem">
            <div class="timeLenView" style="background: rgb(71, 191, 124);"></div>
            <div class="imgView" style="background-image: url();">
              <!---->
            </div>
            <div class="empIdView">001</div>
            <div class="empNameView">店长(店长)</div>
          </div>
          <div class="empItem">
            <div class="timeLenView" style="background: rgb(71, 191, 124);"></div>
            <div
              class="imgView"
              style="background-image: url(09a04914-6dc5-47e6-95fa-b7e82e885e49.png?imageView2/1/w/200/h/200/interlace/1/q/100&quot;);"
            >
              <!---->
            </div>
            <div class="empIdView">CSYG0001</div>
            <div class="empNameView">丽美(助理)</div>
          </div>
          <div class="empItem addItem" @click="dialogVisible = true;showtit='日常'"></div>
        </div>
        <!---->
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      custom-class="addDialog"
    >
      <div class="topView" slot="title">
        <div class="tView">添加【 {{showtit}} 】</div>
        <button class="btn-comp" @click="dialogVisible=false">完成</button>
      </div>
      <div class="contentView">
        <div class="leftView">
          <div class="tView">待选</div>
          <div class="listView" style="height: 628px;">
            <div class="tipView">暂无可上牌的员工</div>
          </div>
        </div>
        <div class="rightView">
          <div class="tView">
            已选
            <label>（拖动右侧图标调整排序）</label>
          </div>
          <div class="listView" style="height: 628px;"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      flag: false,
      chos: 1,
      dialogVisible: false,
      showtit: '',
      menberlist: [1, 2, 3],
    }
  },
  watch: {},
  computed: {},
  methods: {
    handleClose () { },
  },
  created () { },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      //因为我这在排序的时候不需要做处理，所以空着就行
      // console.log(value.list)
    })
  }
}
</script>

<style>
.addDialog .el-dialog__header {
  padding: 0;
  box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
}
</style>
<style lang="scss" scoped>
#brand {
  .menuView {
    flex: 1;
    height: 60px;
    line-height: 40px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 0;
    .menuItem {
      label {
        cursor: pointer;
      }
    }
  }
  .statusView {
    line-height: 36px;
    height: 36px;
    z-index: 100;
    background: #fff;
    margin-right: 10px;
    label {
      position: relative;
      display: inline-block;
      margin-left: 20px;
      padding-left: 18px;
      font-size: 12px;
      color: #8a8a8a;
      span {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
  }
  .typeView {
    min-width: 130px;
    font-size: 14px;
    color: #28282d;
    text-align: right;
  }
  .contentView {
    overflow-x: hidden;
    background: #f4f4f4;
    padding: 0 0 55px 15px;
    .groupView > .headerView {
      line-height: 20px;
      padding: 20px 0 10px 5px;
      font-size: 14px;
      color: #8a8a8a;
    }
    .empsBox {
      overflow: hidden;
      padding-top: 5px;
      .empItem {
        position: relative;
        cursor: pointer;
        float: left;
        width: 100px;
        height: 164px;
        text-align: center;
        /* border-radius: 3px; */
        margin: 0 7px 14px 7px;
        background: #fff;
        box-shadow: 0 0 3px 0 #bbb;
        overflow: hidden;
        &.addItem {
        }
        .timeLenView {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          /* width: 60px; */
          margin: auto;
          background: rgba(255, 255, 255, 0.3);
          /* border-radius: 0 0 5px 5px; */
          line-height: 18px;
          height: 18px;
          font-size: 12px;
          color: #fff;
        }
        .imgView {
          width: 100px;
          height: 100px;
          background: #f4f4f4;
          background-size: 100px 100px;
          background-repeat: no-repeat;
          background-position: center;
          /* margin-top: 25px; */
        }
      }
    }
  }
  .addDialog {
    /deep/.el-dialog__header {
      padding: 0 !important;
    }
    .topView {
      position: relative;
      display: block;
      left: 0;
      height: 50px;
      line-height: 50px;
      text-align: center;
      padding: 0;
      background: #ffffff;
      box-shadow: 0 0 5px 0 rgba(187, 187, 187, 0.5);
      .tView {
        line-height: 50px;
      }
      .btn-comp {
        position: absolute;
        font-size: 16px;
        top: 0;
        right: 0;
        line-height: 50px;
        height: 50px;
        padding: 0 20px;
        cursor: pointer;
      }
    }
    .contentView {
      display: flex;
      background: #f8f8f8;
      padding: 0;
      div > .tView {
        line-height: 42px;
        font-size: 14px;
        color: #28282d;
        padding: 0 25px;
      }
      .leftView {
        position: relative;
        flex: 2.7;
        box-shadow: 0 2px 4px 0 rgba(40, 40, 45, 0.5);
        z-index: 10;
        .listView {
          padding: 5px 24px 35px 24px;
          overflow-x: hidden;
          overflow-y: auto;
          .tipView {
            line-height: 200px;
            text-align: center;
            font-size: 14px;
            color: #8a8a8a;
          }
        }
      }
      .rightView {
        flex: 2.3;
      }
    }
  }
}
</style>
