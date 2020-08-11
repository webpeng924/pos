<template>
  <div id="cikalist">
    <div class="topView">
      <button class="btn-close btn-audio" @click="back"></button>
      <div class="tView">抵用券信息</div>
      <div class="checkbox">
        <el-checkbox v-model="checked" @change="getList">隐藏已停用</el-checkbox>
      </div>
      <button class="btn-audio btn-shopCart" @click="addnew"></button>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="toEdit">
        <el-table-column prop="id" label="编号" width="120"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column label="类别">
          <template slot-scope="scope">
            <span>{{scope.row.typeid==1?'项目':'产品'}}抵用券</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.starttime|Time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间">
          <template slot-scope="scope">
            <span>{{scope.row.endtime|Time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态">
          <template slot-scope="scope">
            <span
              :style="scope.row.is_stop==1?'color:#999':'color:#51d251'"
            >{{scope.row.is_stop==1?'停用':'正常'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <i class="el-icon-arrow-right"></i>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加抵用券"
      :visible.sync="add"
      width="500px"
      custom-class="formDialog"
      :modal-append-to-body="false"
      center
    >
      <div class="contant">
        <el-form label-position="right" label-width="100px" ref="form">
          <!-- <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              抵用类型
            </span>
            <el-radio-group v-model="typeid">
              <el-radio label="1">项目</el-radio>
              <el-radio label="2">产品</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              抵用金额
            </span>
            <el-input v-model="amount"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              使用时间
            </span>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              是否停用
            </span>
            <el-radio-group v-model="is_stop">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
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
import moment from 'moment'
export default {
  components: {},
  props: ['from'],
  data () {
    return {
      type: 1,
      tableData: [],
      add: false,
      status: 0,
      amount: '',
      date: '',
      is_stop: '0',
      typeid: '1',
      choose: '',
      storeid: sessionStorage.getItem('storeid'),
      checked: false
    }
  },
  watch: {},
  filters: {
    Time (val) {
      return moment.unix(val).format('YYYY-MM-DD')
    }
  },
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=voucher_list', {
        params: {
          storeid: this.storeid,
          status: this.checked ? 1 : null
        }
      })
      console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
    addnew () {
      this.amount = ''
      this.date = ''
      this.is_stop = '0'
      this.typeid = '1'
      this.choose = ''
      this.add = true
      this.type = 1
    },
    toEdit (row) {
      let starttime = moment.unix(row.starttime).format('YYYY-MM-DD')
      let endtime = moment.unix(row.endtime).format('YYYY-MM-DD')
      this.amount = row.amount
      this.date = [starttime, endtime]
      this.is_stop = row.is_stop
      this.typeid = row.typeid
      this.choose = row
      this.add = true
      this.type = 2
    },
    async submit () {
      if (!this.amount) return this.$message.error('请输入抵用券金额')
      if (!this.date) return this.$message.error('请设置使用时间')
      const res = await this.$axios.get('/api?datatype=insert_voucher', {
        params: {
          storeid: this.storeid,
          type: this.type,
          typeid: 1,
          amount: this.amount,
          starttime: this.date[0],
          endtime: this.date[1],
          is_stop: this.is_stop,
          id: this.type == 1 ? 0 : this.choose.id
        }
      })
      if (res.data.code == 1) {
        if (this.type == 1) {
          this.$message.success('添加成功')
        } else {
          this.$message.success('修改成功')
        }
        this.add = false
        this.getList()
      } else {
        this.$message.error('失败')
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#cikalist {
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
    position: relative;
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
    }
    .checkbox {
      position: absolute;
      right: 80px;
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
      background: #fff
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Add.png)
        center / 28px no-repeat;
    }
  }
  .bomView {
    padding: 0 20px;
  }
}
</style>
