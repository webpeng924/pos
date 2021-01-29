<template>
  <div id="taocan">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">活动套餐</div>
      <el-input
        v-model="searchtxt"
        placeholder="输入套餐编号/名称"
        style="width:200px;position: absolute;right: 200px;"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" @click="getList"></i>
      </el-input>
      <div class="checkbox">
        <el-checkbox v-model="checked" @change="getList();updateStatus()">隐藏已停用</el-checkbox>
      </div>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="addNew">新增</button>
    </div>
    <div class="bView">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        @row-click="rowClick"
        ref="refTable"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="props_item" v-for="(v,k) in props.row.goodsinfo" :key="k">
              <span>产品名称：{{v.goods_name}}</span>
              <span>数量：{{v.count}}</span>
              <span>单价：{{v.price}}</span>
              <span>总价值：{{(Number(v.price)*Number(v.count)).toFixed(2)}}</span>
            </div>
            <div class="props_item" v-for="(v,k) in props.row.itemsinfo" :key="k+Math.random()">
              <span>次卡名称：{{v.itemname}}</span>
              <span>数量：{{v.typeid==1?v.count:v.num}}</span>
              <span>类型：{{v.typeid|Type}}</span>
              <span>总价值：{{Number(v.price).toFixed(2)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="套餐编号"></el-table-column>
        <el-table-column prop="name" label="套餐名称" min-width="150"></el-table-column>
        <el-table-column prop="pay_money" label="销售价"></el-table-column>
        <el-table-column prop="fact_money" label="会员到账"></el-table-column>
        <el-table-column label="套餐可售时间" width="220">
          <template slot-scope="scope">
            <span v-if="scope.row.starttime">{{scope.row.starttime.split(' ')[0]}}</span>至
            <span v-if="scope.row.endtime">{{scope.row.endtime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span
              :style="scope.row.is_stop==1?'color:#999':'color:lightgreen'"
            >{{scope.row.is_stop==1?'停用':'正常'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              circle
              @click.stop="toEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              circle
              @click.stop="del(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="projectList"
      :modal-append-to-body="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <projectList @close="setdata" v-if="projectList" :from="fromtype"></projectList>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="product"
      :modal-append-to-body="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <product @close="setdata1" v-if="product" :from="fromtype"></product>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="添加套餐"
      :visible.sync="add"
      width="500px"
      custom-class="formDialog"
      :modal-append-to-body="false"
    >
      <div class="contant">
        <el-form label-position="right" label-width="80px" :model="form">
          <el-form-item label="套餐名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="支付金额">
            <el-input v-model="form.pay_money"></el-input>
          </el-form-item>
          <el-form-item label="会员到账">
            <el-input v-model="form.fact_money"></el-input>
          </el-form-item>
          <!-- <el-form-item label="有效期限">
            <el-col :span="11">
              <el-input v-model="form.usetime"></el-input>
            </el-col>
            <el-col class="line" :span="3">
              <div style="text-align: center">-</div>
            </el-col>
            <el-col :span="10">
              <el-select v-model="form.dateType" placeholder="请选择">
                <el-option label="年" value="年"></el-option>
                <el-option label="月" value="月"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-col>
          </el-form-item>-->

          <el-form-item label="可售期限">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否停用">
            <el-radio-group v-model="form.is_stop">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="包含项目">
            <div class="list">
              <div class="item" v-for="(v,k) in itemsInfo" :key="k">
                <i
                  class="iconfont icon-shanchu1"
                  style="color:red;padding:0 5px"
                  @click="removeitem(k)"
                ></i>
                <span>{{v.itemname}}</span>
                <div>{{v.typeid==1?v.count:v.num}}{{v.typeid|Type}}</div>
              </div>
            </div>
            <i class="i" @click="openXM">添加</i>
          </el-form-item>
          <el-form-item label="包含产品">
            <div class="list">
              <div class="item" v-for="(v,k) in goodsInfo" :key="k">
                <i
                  class="iconfont icon-shanchu1"
                  style="color:red;padding:0 5px"
                  @click="removegoods(k)"
                ></i>
                <span>{{v.goods_name}}</span>
                <el-input-number :min="1" :max="999" v-model="v.count" size="mini"></el-input-number>
                {{v.goods_unit}}
              </div>
            </div>
            <i class="i" @click="openCP">添加</i>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import projectList from './cikalist'
import product from './product'
import qs from 'qs'
import moment from 'moment'
export default {
  components: { projectList, product },
  props: [],
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      fromtype: false,
      type: 1,
      id: 0,
      tableData: [],
      add: false,
      searchtxt: '',
      headname: '',
      form: {
        name: '',
        pay_money: '',
        is_stop: '0',
        fact_money: ''
      },
      itemsInfo: [],
      goodsInfo: [],
      date: '',
      projectList: false,
      product: false,
      checked: false
    }
  },
  watch: {
    itemsInfo: {
      handler () {
        let sum = 0
        this.itemsInfo.forEach(item => {
          sum += item.count * item.price
        })
        this.goodsInfo.forEach(item => {
          sum += item.count * item.price
        })
        this.form.sale_price = sum + Number(this.form.fact_price)
      },
      deep: true
    },
    goodsInfo () {
      let sum = 0
      this.itemsInfo.forEach(item => {
        sum += item.count * item.price
      })
      this.goodsInfo.forEach(item => {
        sum += item.count * item.price
      })
      this.form.sale_price = sum + Number(this.form.fact_price)
    }
  },
  computed: {},
  filters: {
    Type (val) {
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
  methods: {
    back () {
      this.$emit('close')
    },
    openXM () {
      this.fromtype = true
      this.projectList = true
      this.add = false
    },
    openCP () {
      this.fromtype = true
      this.product = true
      this.add = false
    },
    setdata (data) {
      this.projectList = false
      this.add = true
      // console.log(data)
      if (data) {
        if (this.itemsInfo.length) {
          this.itemsInfo.forEach(item => {
            // console.log(item.id, data.id)
            if (item.id != data.id) {
              this.itemsInfo.push(data)
            } else {
              this.$message.error('已选此项')
            }
          })
        } else {
          this.itemsInfo.push(data)
        }
      }
    },
    del (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delitem(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async delitem (id) {
      const res = await this.$axios.get('/api?datatype=del_package&id=' + id)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('已删除')
        this.getList()
      }
    },
    addNew () {
      this.form = {
        name: '',
        pay_money: '',
        is_stop: '0',
        fact_money: ''
      }
      this.date = ''
      this.goodsInfo = []
      this.itemsInfo = []
      this.id = 0
      this.type = 1
      this.add = true
    },
    toEdit (row) {
      let starttime = moment(row.starttime).format('YYYY-MM-DD')
      let endtime = moment(row.endtime).format('YYYY-MM-DD')
      this.form = {
        name: row.name,
        pay_money: row.pay_money,
        is_stop: row.is_stop,
        fact_money: row.fact_money
      }
      this.date = [starttime, endtime]
      this.goodsInfo = row.goodsinfo ? row.goodsinfo : []
      this.itemsInfo = row.itemsinfo ? row.itemsinfo : []
      this.id = row.id
      this.type = 2
      this.add = true
    },
    setdata1 (data) {
      this.product = false
      this.add = true
      // console.log(data)
      if (data) {
        if (this.goodsInfo.length) {
          this.goodsInfo.forEach(item => {
            // console.log(item.id, data.id)
            if (item.id != data.id) {
              this.$set(data, 'count', 1)
              this.goodsInfo.push(data)
            }
          })
        } else {
          this.$set(data, 'count', 1)
          data.content = ''
          this.goodsInfo.push(data)
        }
      }
    },
    updateStatus (type) {
      let parameter = null
      if (type == 1) {
        parameter = ' true=>隐藏停用，false=>全部显示'
      }
      this.$axios.get('/api?datatype=edit_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'tc_state',
          info: '套餐列表筛选',
          value: this.checked,
          parameter: parameter
        }
      }).then(res => {
        if (type == 1) {
          this.getList()
        }
        // console.log(res)
      })
    },
    rowClick (row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    async getState () {
      const res = await this.$axios.get('/api?datatype=get_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'tc_state'
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        if (res.data.data != null) {
          if (res.data.data.value == 'true') {
            this.checked = true
          } else {
            this.checked = false
          }
          this.getList()
        }
      }
      if (res.data.code == 3) {
        this.updateStatus(1)
      }
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_package_list', {
        params: {
          storeid: this.storeid,
          search: this.searchtxt ? this.searchtxt : null,
          status: this.checked ? 1 : null
        }
      })
      // console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          if (item.goodsinfo) {
            // console.log(item.goodsinfo)
            item.goodsinfo = JSON.parse(item.goodsinfo)
          }
          if (item.itemsinfo) {
            item.itemsinfo = JSON.parse(item.itemsinfo)
          }
        })
      } else {
        this.tableData = []
      }
      this.$message.success('加载完成')
    },

    removeitem (k) {
      this.itemsInfo.splice(k, 1)
    },
    removegoods (k) {
      this.goodsInfo.splice(k, 1)
    },
    async submit () {
      let data = qs.stringify({
        storeid: this.storeid,
        type: this.type,//1增加  2编辑
        id: this.id,
        name: this.form.name,
        pay_money: this.form.pay_money,
        fact_money: this.form.fact_money,
        is_stop: this.form.is_stop,
        starttime: this.date[0],
        endtime: this.date[1],
        itemsinfo: this.itemsInfo,
        goodsinfo: this.goodsInfo
      })
      const res = await this.$axios.post('/api?datatype=insert_package', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.getList()
        this.add = false
      } else if (res.data.code == 2) {
        this.$message.error(res.data.msg)
      } else {
        this.$message.error('添加失败')
      }
    }
  },
  created () {
    this.getState()
  },
  mounted () { }
}
</script>

<style lang="scss">
.formDialog {
  .contant {
    padding: 20px 30px 20px 20px;
  }
  .el-range-separator {
    padding: 0;
  }
  .el-form-item {
    position: relative;
    .i {
      position: absolute;
      line-height: 70px;
      right: 10px;
      top: 0;
      cursor: pointer;
      color: #dc670b;
    }
  }
  .el-form .list {
    height: 80px;
    padding-top: 5px;
    overflow-y: auto;
    padding-right: 45px;

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #999;
    }
    &-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      background: #f8f8f8;
    }
    .item {
      line-height: 30px;
      border-bottom: 0.5px dashed #eee;
      display: flex;
      // &:last-child {
      //   border: none;
      // }
      span {
        flex: 1;
      }
      .el-input {
        width: 70px;
        margin-right: 10px;
        .el-input__inner {
          padding-right: 0;
        }
      }
    }
  }
  .el-input-number.el-input-number--mini {
    margin-right: 10px;
  }
  .el-input.el-input--mini {
    width: 130px !important;
  }
  .el-input-number--mini .el-input__inner {
    padding-left: 0;
  }
}
.proDialog {
  height: 100%;
  margin: 0 !important;
  overflow: hidden;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
#taocan {
  height: 100%;

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
    .checkbox {
      position: absolute;
      right: 80px;
    }
  }

  .el-form-item__content .list {
    height: 60px;
  }

  .bView {
    padding: 0 20px;
    height: calc(100% - 85px);
  }
  .props_item {
    padding-left: 60px;
    line-height: 30px;
    background-color: #eee;
    display: flex;
    span {
      flex: 1;
      margin-right: 50px;
    }
  }
}
</style>
