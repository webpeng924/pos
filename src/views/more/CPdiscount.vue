<template>
  <div class="discountlist">
    <div class="topView">
      <!-- <button class="btn-close btn-audio" @click="back"></button> -->
      <button
        class="btn-audio"
        style="font-size:16px;color:#dc670b;margin-right:20px"
        @click="saveList"
      >保存并返回</button>
      <div class="tView">{{title}}</div>
      <button class="btn-audio" style="font-size:16px;color:#dc670b" @click="openList">新增</button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="编号" prop="goods_no"></el-table-column>
      <el-table-column label="名称" prop="goods_name"></el-table-column>
      <el-table-column label="折扣">
        <template slot-scope="{row}">
          <div style="width:50%">
            <el-input
              v-model="row.discount"
              size="small"
              type="number"
              min="0"
              max="1"
              @change="changeDiscount(row)"
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择产品 -->
    <el-dialog
      title="选择产品"
      :visible.sync="showList"
      custom-class="Dialog"
      :modal-append-to-body="false"
      center
      width="500px"
      style="height:100%"
    >
      <!-- <div class="searchView">
        <el-input placeholder="请输入产品编号或名称" v-model="searchtxt">
          <el-button slot="append" icon="el-icon-search" @click="changecate">搜索</el-button>
        </el-input>
      </div>-->
      <div class="headerView">
        <label class="label-code">编号</label>
        <label class="label-name">产品名称</label>
      </div>
      <div class="listView">
        <div class="listItem" v-for="(v,k) in XMlist" :key="k" @click="chosCp(v)">
          <label class="label-icon" :class="{select:list.includes(v.id)}"></label>
          <label class="label-code">{{v.goods_no}}</label>
          <label class="label-name">{{v.goods_name}}</label>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showList = false">取 消</el-button>
        <el-button type="success" @click="submitGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['CPdata'],
  data () {
    return {
      title: '产品折扣',
      showList: false,
      storeid: sessionStorage.getItem('storeid'),
      tableData: [],
      list: [],
      XMlist: []
    }
  },
  methods: {
    openList () {
      this.showList = true
      this.getXMlist()
    },
    saveList () {
      this.$emit('close', this.tableData)
    },
    chosCp (v) {
      if (!this.list.includes(v.id)) {
        this.list.push(v.id)
      } else {
        this.list = this.list.filter(value => value != v.id)
      }
    },
    submitGoods () {
      this.showList = false
      this.tableData = []
      this.XMlist.forEach(v => {
        if (this.list.includes(v.id)) {
          let discount = 1
          if (this.CPdata) {
            let cp = this.CPdata.find(k => k.id == v.id)
            if (cp) {
              discount = cp.discount
            }
          }
          let obj = {
            id: v.id,
            goods_no: v.goods_no,
            goods_name: v.goods_name,
            discount: discount
          }
          this.tableData.push(obj)
        }
      })
    },
    changeDiscount (row) {
      console.log(row)
      if (row.discount > 1 || row.discount < 0) {
        row.discount = 1
        this.$message('折扣系数为0-1之间')
      }
      row.discount = Number(row.discount).toFixed(2)
    },
    async getXMlist () {
      const res = await this.$axios.get('/api?datatype=get_goods_list', {
        params: {
          storeid: this.storeid,
          status: 1,
        }
      })
      // console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
      } else {
        this.XMlist = []
      }
    },
    back () {
      this.$emit('close')
    },
    handleEdit (index, row) {
      console.log(index, row);
    },
    handleDelete (index, row) {
      // console.log(index, row);
      this.list = this.list.filter(v => v != row.id)
      this.submitGoods()
    }
  },
  created () {
    if (this.CPdata) {
      this.tableData = JSON.parse(JSON.stringify(this.CPdata))
      this.list = this.tableData.map(v => v.id)
    }
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>
<style lang="scss">
.Dialog.el-dialog {
  height: 70%;
  .el-dialog__body {
    height: calc(100% - 70px) !important;
  }
}
</style>
<style lang="scss" scoped>
.discountlist {
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    height: 85px;
    line-height: 40px;
    background: #fff;
    text-align: center;
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
  .Dialog {
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
      overflow: auto;
      height: calc(100% - 45px);
      color: #28282d;
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
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_N.png)
            center / 24px no-repeat;
        }
        .label-icon.select {
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_S.png)
            center / 24px no-repeat;
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
