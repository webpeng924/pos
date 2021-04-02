<template>
  <div id="setCard">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">卡类别资料</div>
      <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="addnew">添加</button>
    </div>
    <div class="bView">
      <el-table :data="tableData" style="width: 100%" height="100%">
        <el-table-column>
          <template slot-scope="scope">
            <img :src="scope.row.img|imgUrl" alt style="width:80px" />
          </template>
        </el-table-column>
        <el-table-column prop="card_no" label="类别编号"></el-table-column>
        <el-table-column prop="name" label="类别名称"></el-table-column>
        <el-table-column prop="deposit_amount" label="储值金额"></el-table-column>
        <el-table-column prop="gift_money" label="赠送金额"></el-table-column>
        <el-table-column prop="recharge_money" label="起充金额"></el-table-column>
        <el-table-column prop="item_discount" label="项目折扣">
          <template slot-scope="scope">
            <span v-if="scope.row.item_discount!=10">{{scope.row.item_discount}}折</span>
            <span v-else>无折扣</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_discount" label="商品折扣">
          <template slot-scope="scope">
            <span v-if="scope.row.goods_discount!=10">{{scope.row.goods_discount}}折</span>
            <span v-else>无折扣</span>
          </template>
        </el-table-column>
        <el-table-column prop="usetime" label="有效期"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" icon="el-icon-edit" type="primary" circle plain></el-button>
            <el-button @click="del(scope.row.id)" icon="el-icon-delete" type="danger" circle plain></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="添加卡类"
      :visible.sync="add"
      width="550px"
      custom-class="formDialog"
      :modal-append-to-body="false"
    >
      <div class="contant">
        <el-form label-position="right" label-width="80px" :model="form" :rules="rules" ref="form">
          <el-form-item label="类别编号" prop="card_no">
            <el-input v-model="form.card_no"></el-input>
          </el-form-item>
          <el-form-item label="卡片名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="储值金额" prop="deposit_amount">
            <el-input v-model="form.deposit_amount"></el-input>
          </el-form-item>-->
          <el-form-item label="起充金额" prop="recharge_money">
            <el-input v-model="form.recharge_money"></el-input>
          </el-form-item>
          <el-form-item label="赠送金额" prop="gift_money">
            <el-input v-model="form.gift_money"></el-input>
          </el-form-item>
          <el-form-item label="有效期限" prop="usetime">
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
          <el-form-item label="图片">
            <div class="imgView">
              <img :src="form.img|imgUrl" alt />
              <span @click="openCropper">点击上传</span>
            </div>
          </el-form-item>
          <el-form-item label="项目折扣">
            <el-col :span="8">
              <!-- <el-input-number v-model="form.item_discount" :max="10" :min="0" size="small"></el-input-number> -->
              <el-input-number
                v-model="form.item_discount"
                size="small"
                type="number"
                @change="changeitemDiscount"
                :step="0.01"
                :min="0"
                :max="1"
              ></el-input-number>
            </el-col>
            <!-- <el-col :span="1">
              <p style="text-align:center">折</p>
            </el-col>-->
            <el-col :span="15">
              <p>
                （ 默认：1-无折扣 ）
                <a @click="openChoose(1)">特殊项目折扣</a>
              </p>
            </el-col>
          </el-form-item>
          <el-form-item label="产品折扣">
            <el-col :span="8">
              <!-- <el-input-number v-model="form.goods_discount" :max="10" :min="0" size="small"></el-input-number> -->
              <el-input-number
                v-model="form.goods_discount"
                @change="changegoodsDiscount"
                size="small"
                type="number"
                :step="0.01"
                :min="0"
                :max="1"
              ></el-input-number>
            </el-col>
            <!-- <el-col :span="1">
              <p style="text-align:center">折</p>
            </el-col>-->
            <el-col :span="15">
              <p>
                （ 默认：1-无折扣 ）
                <a @click="openChoose(2)">特殊产品折扣</a>
              </p>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <!-- 图片上传 -->
      <xcropper ref="cropper" @close="add=true"></xcropper>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 单独折扣页面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showXMlist"
      :modal="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <XMdiscount @close="setXMdata" v-if="showXMlist" :XMdata="XMinfo"></XMdiscount>
    </el-dialog>
    <!-- 单独折扣页面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showCPlist"
      :modal="false"
      width="100%"
      custom-class="proDialog"
      center
    >
      <CPdiscount @close="setCPdata" v-if="showCPlist" :CPdata="CPinfo"></CPdiscount>
    </el-dialog>
  </div>
</template>

<script>
import xcropper from '@/components/xcropper.vue'
import XMdiscount from './XMdiscount'
import CPdiscount from './CPdiscount'
import qs from 'qs'
export default {
  components: { xcropper, XMdiscount, CPdiscount },
  props: [],
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      showXMlist: false,
      showCPlist: false,
      type: 1,
      id: 0,
      XMinfo: '',
      CPinfo: '',
      tableData: [1, 2, 3],
      add: false,
      form: {
        card_no: '',
        name: '',
        img: '',
        // deposit_amount: '',
        recharge_money: '',
        gift_money: '',
        usetime: '',
        dateType: '年',
        item_discount: '1',
        goods_discount: '1'
      },
      rules: {
        card_no: [
          { required: true, message: '请输入类别编号', trigger: 'focus' }
        ],
        name: [
          { required: true, message: '请输入卡名称', trigger: 'focus' }
        ],
        // deposit_amount: [
        //   { required: true, message: '请输入储值金额', trigger: 'focus' }
        // ],
        recharge_money: [
          { required: true, message: '请输入起充金额', trigger: 'focus' }
        ],
        gift_money: [
          { required: true, message: '请输入赠送金额', trigger: 'focus' }
        ],
        usetime: [
          { required: true, message: '请输入有效期限', trigger: 'focus' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    changeitemDiscount (currentValue) {
      this.form.item_discount = currentValue.toFixed(2)
    },
    changegoodsDiscount (currentValue) {
      console.log(currentValue)
      this.form.goods_discount = currentValue.toFixed(2)
    },
    openChoose (type) {
      this.add = false
      if (type == 1) {
        this.showXMlist = true
      } else {
        this.showCPlist = true
      }
    },
    setXMdata (data) {
      this.showXMlist = false
      this.add = true
      if (data) {
        this.XMinfo = data
      }
    },
    setCPdata (data) {
      this.showCPlist = false
      this.add = true
      if (data) {
        this.CPinfo = data
      }
    },
    back () {
      this.$emit('close')
    },
    // 打开上传图片
    openCropper () {
      this.add = false
      let option = {
        title: '卡图片',
        // msg: '建议图片大小：2M',
        fixedNumber: [3, 2]
      };
      this.$refs.cropper.open(option, (data) => {
        // console.log(data)
        this.add = true
        this.form.img = data
      })
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_card_list', {
        params: {
          storeid: this.storeid,
          search: this.searchtxt ? this.searchtxt : null
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
      }
    },
    del (id) {
      this.$confirm('确定删除该卡类吗?', '提示', {
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
    edit (data) {
      this.add = true
      this.type = 2
      this.id = data.id
      this.form = JSON.parse(JSON.stringify(data))
      this.form.dateType = data.usetime.match(/[\u4e00-\u9fa5]/g).join("")
      this.form.item_discount = (data.item_discount / 10).toFixed(2)
      this.form.goods_discount = (data.goods_discount / 10).toFixed(2)
      this.form.usetime = data.usetime.slice(0, data.usetime.length - 1)
      this.XMinfo = data.itemInfo
      this.CPinfo = data.goodsInfo
    },
    addnew () {
      this.add = true
      this.type = 1
      this.id = 0
      let data = {
        card_no: '',
        name: '',
        img: '',
        // deposit_amount: '',
        gift_money: '',
        recharge_money: '',
        usetime: '',
        dateType: '年',
        item_discount: 1,
        goods_discount: 1
      }
      this.form = data
      this.XMinfo = ''
      this.CPinfo = ''
    },
    async delitem (id) {
      const res = await this.$axios.get('/api?datatype=del_card&id=' + id)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success('已删除')
        this.getList()
      }
    },
    async submit () {
      if (!this.form.card_no || !this.form.name || !this.form.recharge_money || !this.form.usetime || !this.form.gift_money) return this.$message.error('缺少必填信息')
      if (this.XMinfo) {
        this.XMinfo.forEach(k => { k['id'] = k.itemid })
      }
      if (this.CPinfo) {
        this.CPinfo.forEach(j => { j['id'] = j.itemid })
      }
      let data = {
        storeid: this.storeid,
        type: this.type,//1增加  2编辑
        id: this.id,
        card_no: this.form.card_no,//编号
        name: this.form.name,
        img: this.form.img,
        itemInfo: this.XMinfo,
        goodsInfo: this.CPinfo,
        gift_money: this.form.gift_money,
        recharge_money: this.form.recharge_money,//起充金额
        usetime: this.form.usetime + this.form.dateType,
        item_discount: this.form.item_discount * 10,
        goods_discount: this.form.goods_discount * 10
      }
      const res = await this.$axios.post('/api?datatype=insert_card_list', data)
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.add = false
        this.getList()
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
#setCard {
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
  }

  .el-form-item__content .list {
    height: 60px;
  }

  .bView {
    padding: 0 20px;
    height: calc(100% - 85px);
  }

  .imgView {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 75px;
    background: url('https://hb.rgoo.com/upload/shop/wutu.png') no-repeat center
      center;
    background-size: 100% 100%;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      width: 100%;
      right: 0;
      width: 100px;
      height: 75px;
      line-height: 75px;
      text-align: center;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
    }
    &:hover span {
      display: inline-block;
    }
  }
}
</style>
