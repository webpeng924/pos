<template>
  <div class="discountlist">
    <div class="topView">
      <!-- <button class="el-icon-close btn-audio" @click="back"></button> -->
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
      <el-table-column label="编号" prop="item_no"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
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

    <!-- 选择项目 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择项目"
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
        <label class="label-name">项目名称</label>
      </div>
      <div class="listView">
        <div class="listItem" v-for="(v,k) in XMlist" :key="k" @click="chosCp(v)">
          <label class="label-icon" :class="{select:list.includes(v.itemid)}"></label>
          <label class="label-code">{{v.item_no}}</label>
          <label class="label-name">{{v.name}}</label>
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
  props: ['XMdata'],
  data () {
    return {
      title: '项目折扣',
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
      if (!this.list.includes(v.itemid)) {
        this.list.push(v.itemid)
      } else {
        this.list = this.list.filter(value => value != v.itemid)
      }
    },
    submitGoods () {
      this.showList = false
      this.tableData = []
      this.XMlist.forEach(v => {
        if (this.list.includes(v.itemid)) {
          let discount = 1
          if (this.XMdata) {
            let cp = this.XMdata.find(k => k.itemid == v.itemid)
            if (cp) {
              discount = cp.discount
            }
          }
          this.$set(v, 'discount', discount)
          this.$set(v, 'id', v.itemid)
          this.tableData.push(v)
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
      const res = await this.$axios.get('/api?datatype=get_item_list', {
        params: {
          storeid: this.storeid,
          status: 1,
        }
      })
      // console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
        this.XMlist.forEach(item => {
          item['itemid'] = item.id
        })
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
      console.log(index, row);
      this.list = this.list.filter(v => v != row.itemid)
      this.tableData = this.tableData.filter(v => v.itemid != row.itemid)
      // this.submitGoods()
    }
  },
  created () {
    if (this.XMdata) {
      this.tableData = JSON.parse(JSON.stringify(this.XMdata))
      this.list = this.tableData.map(v => v.itemid)
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
