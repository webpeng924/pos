<template>
  <div id="taocan">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">活动套餐</div>
      <el-input v-model="searchtxt" placeholder="输入套餐编号/名称" style="width:200px;margin-right:20px">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="getList"></i>
      </el-input>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="add=true">新增</button>
    </div>
    <div class="bView">
      <el-table :data="tableData" style="width: 100%" height="100%">
        <!-- <el-table-column prop="date" label="门店编号"></el-table-column> -->
        <el-table-column prop="package_no" label="套餐编号"></el-table-column>
        <el-table-column prop="name" label="套餐名称"></el-table-column>
        <el-table-column prop="fact_price" label="标准价格"></el-table-column>
        <el-table-column prop="usetime" label="有效期限"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="scope.row.is_stop==1?'color:#999':'color:lightgreen'"
            >{{scope.row.is_stop==1?'停用':'正常'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.starttime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endtime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="projectList"
      :modal-append-to-body="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <projectList @close="setdata" v-if="projectList" :from="fromtype"></projectList>
    </el-dialog>
    <el-dialog
      :visible.sync="product"
      :modal-append-to-body="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <product @close="setdata1" v-if="product" :from="fromtype"></product>
    </el-dialog>
    <el-dialog
      title="添加套餐"
      :visible.sync="add"
      width="500px"
      custom-class="formDialog"
      :modal-append-to-body="false"
    >
      <div class="contant">
        <el-form label-position="right" label-width="80px" :model="form">
          <el-form-item label="套餐编号">
            <el-input v-model="form.package_no"></el-input>
          </el-form-item>
          <el-form-item label="套餐名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="汇总价格">
            <el-input v-model="form.sale_price"></el-input>
          </el-form-item>
          <el-form-item label="实际价格">
            <el-input v-model="form.fact_price"></el-input>
          </el-form-item>
          <el-form-item label="有效期限">
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
          </el-form-item>
          <el-form-item label="是否停用">
            <el-radio-group v-model="form.is_stop">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="可售期限">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="包含项目">
            <div class="list">
              <div class="item" v-for="(v,k) in itemsInfo" :key="k">
                <span>{{v.name}}</span>
                <el-input type="number" min="1" v-model="v.count" size="small"></el-input>次
              </div>
            </div>
            <i class="i" @click="openXM">添加</i>
          </el-form-item>
          <el-form-item label="包含产品">
            <div class="list">
              <div class="item" v-for="(v,k) in goodsInfo" :key="k">
                <span>{{v.goods_name}}</span>
                <el-input type="number" min="1" v-model="v.count" size="small"></el-input>
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
import projectList from './projectList'
import product from './product'
import qs from 'qs'
export default {
  components: { projectList, product },
  props: [],
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      fromtype: false,
      type: 1,
      id: 0,
      tableData: [1, 2, 3],
      add: false,
      searchtxt: '',
      headname: '',
      form: {
        package_no: '',
        name: '',
        sale_price: '',
        is_stop: '0',
        usetime: '',
        dateType: '年',
        fact_price: ''
      },
      itemsInfo: [],
      goodsInfo: [],
      date: '',
      projectList: false,
      product: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')

    },
    openXM () {
      this.fromtype = true
      this.projectList = true
    },
    openCP () {
      this.fromtype = true
      this.product = true
    },
    setdata (data) {
      this.projectList = false
      console.log(data)
      if (this.itemsInfo.length) {
        this.itemsInfo.forEach(item => {
          console.log(item.id, data.id)
          if (item.id != data.id) {
            this.$set(data, 'count', 1)
            this.itemsInfo.push(data)
          }
        })
      } else {
        this.$set(data, 'count', 1)
        this.itemsInfo.push(data)
      }
    },
    del (id) {
      this.$confirm('确定删除该活动吗?', '提示', {
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
      console.log(res)
      if (res.data.code == 1) {
        this.$message.success('已删除')
        this.getList()
      }
    },
    setdata1 (data) {
      this.product = false
      console.log(data)
      if (this.goodsInfo.length) {
        this.goodsInfo.forEach(item => {
          console.log(item.id, data.id)
          if (item.id != data.id) {
            this.$set(data, 'count', 1)
            this.goodsInfo.push(data)
          }
        })
      } else {
        this.$set(data, 'count', 1)
        this.goodsInfo.push(data)
      }
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_package_list', {
        params: {
          storeid: this.storeid,
          search: this.searchtxt ? this.searchtxt : null
        }
      })
      console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      }
    },
    async submit () {
      let data = qs.stringify({
        storeid: this.storeid,
        type: this.type,//1增加  2编辑
        id: this.id,
        package_no: this.form.package_no,//编号
        name: this.form.name,
        sale_price: this.form.sale_price,
        fact_price: this.form.fact_price,
        usetime: this.form.usetime + this.form.dateType,
        is_stop: this.form.is_stop,
        starttime: this.date[0],
        endtime: this.date[1],
        itemsinfo: this.itemsInfo,
        goodsinfo: this.goodsInfo
      })
      const res = await this.$axios.post('/api?datatype=insert_package', data)
      console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.data)
        this.add = false
      } else if (res.data.code == 2) {
        this.$message.error(res.data.data)
      } else {
        this.$message.error('添加失败')
      }
    }
  },
  created () {
    this.getList()
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
}
.proDialog {
  height: 100%;
  margin: 0 !important;
  overflow: hidden;
  .el-dialog__header {
    display: none;
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

  .el-form-item__content .list {
    height: 60px;
  }

  .bView {
    padding: 0 20px;
    height: calc(100% - 85px);
  }
}
</style>
