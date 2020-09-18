<template>
  <div id="projectlist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <!-- <div class="centerView">
        <div class="tView">产品消耗设定</div>
        <div class="dateView">2020年07月08日 至 2020年07月08日</div>
      </div>-->
      <div class="tView">产品消耗设定</div>
      <button class="btn-audio" style="font-size:18px;color:#dc670b">保存</button>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="项目编号" width="180"></el-table-column>
        <el-table-column prop="name" label="项目名称" width="180"></el-table-column>
        <el-table-column prop="address" label="消耗产品"></el-table-column>
        <el-table-column prop="address" width="50">></el-table-column>
      </el-table>
    </div>
    <div class="set_page" :class="{activePage:add}">
      <addproject @close="add=false"></addproject>
    </div>
  </div>
</template>

<script>
import addproject from '@/components/addproject.vue'
export default {
  components: { addproject },
  props: ['typ'],
  data () {
    return {
      item: 1,
      tableData: [1, 2, 3],
      add: false,
      headname: ''
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    }
  },
  created () {
    if (this.typ == 1) {
      this.headname = '项目'
    } else {
      this.headname = '产品'
    }
  },
  mounted () { }
}
</script>

<style>
/* .el-tabs--left .el-tabs__header.is-left {
  width: 200px;
  height: 100%;
}
.el-tabs--left .el-tabs__item.is-left {
  font-size: 20px;
  line-height: 50px;
  height: 50px;
} */
</style>
<style lang="scss" scoped>
#projectlist {
  height: 50%;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    height: 85px;
    line-height: 40px;
    background: #fff;
    text-align: center;
    .centerView {
      width: 100%;
      text-align: center;
      height: 45px;
    }
    .btn-close {
      width: 40px;
      height: 40px;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_X_Black.png)
        left center / 24px no-repeat;
    }
    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
      font-family: PingFangSC-Semibold;
    }
  }
  .disTypeView {
    position: relative;
    margin: 15px;
    display: flex;
    background: #f8f8f8;
    padding: 17px 38px 17px 25px;
    line-height: 20px;
    font-size: 15px;
    border-radius: 5px;
    > div {
      flex: 1;
      text-align: right;
    }
  }
  .menuView {
    border-bottom: 0.5px solid #ddd;
  }
  .bomView {
    padding: 0 20px;
  }
  .bView > button {
    width: 100%;
    height: 54px;
    font-size: 15px;

    color: #47bf7c;
    box-shadow: 0 0 2px 0 rgba(220, 220, 220, 0.4);
  }
}
</style>
