<template>
  <div id="cikalist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">抵用券信息</div>
      <div class="checkbox">
        <el-checkbox v-model="checked" @change="getList();updateStatus()">隐藏已停用</el-checkbox>
      </div>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="addnew">新增</button>
    </div>
    <div class="bomView">
      <el-table :data="tableData" stripe style="width: 100%" height="100%">
        <el-table-column prop="id" label="编号" width="60"></el-table-column>
        <el-table-column prop="type" label="类别"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="内容" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="使用说明" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始时间" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.starttime|Time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" min-width="100">
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="添加抵用券"
      :visible.sync="add"
      width="500px"
      custom-class="formDialog quickmoney"
      :modal-append-to-body="false"
      center
    >
      <div class="contant">
        <el-form label-position="right" label-width="100px" ref="form">
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              券名称
            </span>
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              抵用类型
            </span>
            <el-radio-group v-model="type">
              <el-radio label="体验券">体验券</el-radio>
              <el-radio label="亲友券">亲友券</el-radio>
              <el-radio label="现金券">现金券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              抵用金额
            </span>
            <el-input v-model="amount" type="number" :min="0"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">内容</span>
            <el-input v-model="content" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span class="xing">*</span>
              使用说明
            </span>
            <el-input v-model="remark" type="textarea"></el-input>
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
      sign: 1,
      tableData: [],
      add: false,
      name: '',
      type: '',
      amount: '',
      content: '',
      remark: '',
      date: '',
      is_stop: '0',
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
      // console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      } else {
        this.tableData = []
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
          menu_name: 'quan_state',
          info: '抵用券列表筛选',
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
    async getState () {
      const res = await this.$axios.get('/api?datatype=get_store_config', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          menu_name: 'quan_state'
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
    addnew () {
      this.amount = ''
      this.name = ''
      this.remark = ''
      this.date = ''
      this.content = ''
      this.is_stop = '0'
      this.type = ''
      this.choose = ''
      this.add = true
      this.sign = 1
    },
    toEdit (row) {
      let starttime = moment.unix(row.starttime).format('YYYY-MM-DD')
      let endtime = moment.unix(row.endtime).format('YYYY-MM-DD')
      this.amount = row.amount
      this.date = [starttime, endtime]
      this.is_stop = row.is_stop
      this.type = row.type
      this.content = row.content
      this.name = row.name
      this.remark = row.remark
      this.choose = row
      this.add = true
      this.sign = 2
    },
    async submit () {
      if (!this.type) return this.$message.error('请选择抵用类型')
      if (!this.amount) return this.$message.error('请输入抵用券金额')
      if (!this.remark) return this.$message.error('请输入使用说明')
      if (!this.date) return this.$message.error('请设置使用时间')
      const res = await this.$axios.get('/api?datatype=insert_voucher', {
        params: {
          storeid: this.storeid,
          name: this.name,
          sign: this.sign,
          type: this.type,
          content: this.content,
          amount: this.amount,
          starttime: this.date[0],
          endtime: this.date[1],
          is_stop: this.is_stop,
          id: this.sign == 1 ? 0 : this.choose.id,
          remark: this.remark
        }
      })
      if (res.data.code == 1) {
        if (this.sign == 1) {
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
    this.getState()
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
    }
  }
  .bomView {
    padding: 0 20px;
    height: calc(100% - 90px);
  }
}
</style>
