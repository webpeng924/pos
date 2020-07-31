<template>
  <div id="addpro">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">{{step==1?'添加':'次卡'}}</div>
      <!-- <button class="btn-audio btn-shopCart" @click="step=2" v-show="step==1">下一步</button>
      <button class="btn-audio btn-shopCart" @click="step=1" v-show="step==2">上一步</button>-->
      <button class="btn-audio btn-shopCart" @click="submit">保存</button>
    </div>
    <div class="contentView">
      <div class="listView">
        <div class="item">
          <div class="left">项目图</div>
          <div class="right">
            <div class="imgView">
              <img :src="img|imgUrl" alt />
              <span @click="openCropper">点击上传</span>
            </div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <div class="left">项目编号</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="item_no" />
          </div>
        </div>
        <div class="item">
          <div class="left">项目名称</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="name" />
          </div>
        </div>
        <div class="item">
          <div class="left">标准价格</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="price" />
          </div>
        </div>
        <div class="item" @click="categoryDialog=true">
          <div class="left">分类</div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="categoryName" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="分类"
          :visible.sync="categoryDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              :class="{select:category_id==v.id}"
              @click="category_id=v.id;categoryName=v.title;categoryDialog=false"
              v-for="(v,k) in catelist"
              :key="k"
            >{{v.title}}</div>
          </div>
        </el-dialog>
        <div class="item" @click="belongDialog=true">
          <div class="left">归属部门</div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="belong_job" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="归属部门"
          :visible.sync="belongDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              v-for="(v,k) in bumenlist"
              :key="k"
              :class="{select:belong_job==v}"
              @click="belong_job=v;belongDialog=false"
            >{{v}}</div>
          </div>
        </el-dialog>
        <div class="item">
          <div class="left">是否停用</div>
          <div class="right">
            <el-switch v-model="is_stop" active-color="#13ce66"></el-switch>
          </div>
        </div>
        <div class="item">
          <div class="left">备注</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="remark" />
          </div>
        </div>
      </div>
      <div class="listView" v-show="0">
        <div class="item">
          <div class="left">项目次数</div>
          <div class="right">
            <input
              type="number"
              min="0"
              placeholder="请输入"
              v-model="ccard_count"
              @change="changeNum()"
            />
          </div>
        </div>
        <div class="item">
          <div class="left">单次优惠价</div>
          <div class="right">
            <input
              type="number"
              min="0"
              placeholder="请输入"
              v-model="ccard_price"
              @change="changeNum()"
            />
          </div>
        </div>
        <div class="item">
          <div class="left">总价</div>
          <div class="right">
            <input
              type="number"
              min="0"
              placeholder="请输入"
              v-model="ccard_total"
              @change="changetotal()"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 图片上传 -->
    <xcropper ref="cropper"></xcropper>
  </div>
</template>

<script>
import xcropper from '@/components/xcropper.vue'
export default {
  components: { xcropper },
  props: ['choose'],
  data () {
    return {
      step: 1,
      catelist: [],
      bumenlist: ['销售部', '管理部', '美容部', '按摩组', '足疗组'],
      categoryName: '',
      type: 1,
      id: 0,
      img: '',
      storeid: sessionStorage.getItem('storeid'),
      ccard_count: 0,
      ccard_price: 0,
      ccard_total: 0,
      item_no: "",
      name: "",
      price: "",
      category_id: "",
      belong_job: "",
      is_stop: false,
      remark: "",
      categoryDialog: false,
      belongDialog: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getCate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate', {
        params: {
          storeid: this.storeid,
        }
      })
      console.log(res)
      if (res.data.code == 1) {
        this.catelist = res.data.data
      }
    },
    back () {
      this.$emit('close')
    },
    // 打开上传图片
    openCropper () {
      let option = {
        title: '项目图',
        msg: '建议图片大小：2M'
      };
      this.$refs.cropper.open(option, (data) => {
        console.log(data)
        this.img = data
      })
    },
    async submit () {
      const params = {
        storeid: this.storeid,
        remark: this.remark,
        type: this.type,
        id: this.id,
        img: this.img,
        item_no: this.item_no,
        name: this.name,
        price: this.price,
        category_id: this.category_id,
        belong_job: this.belong_job,
        is_stop: this.is_stop ? 1 : 0,
        remark: this.remark,
        ccard_count: this.ccard_count,
        ccard_price: this.ccard_price,
        ccard_total: this.ccard_total
      }
      const res = await this.$axios.get('/api?datatype=insert_item', {
        params
      })
      console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.back()
      }
    },
    changeNum () {
      this.ccard_total = Number(this.ccard_count) * Number(this.ccard_price)
    },
    changetotal () {
      this.ccard_price = Number(this.ccard_total) / Number(this.ccard_count)
    }
  },
  created () {
    this.getCate()
    console.log(this.choose)
    if (this.choose) {
      this.categoryName = this.choose.title
      this.type = 2
      this.id = this.choose.id
      this.img = this.choose.img
      this.ccard_count = this.choose.ccard_count
      this.ccard_price = this.choose.ccard_price
      this.ccard_total = this.choose.ccard_total
      this.item_no = this.choose.item_no
      this.name = this.choose.name
      this.price = this.choose.price
      this.category_id = this.choose.category_id
      this.belong_job = this.choose.belong_job
      this.is_stop = this.choose.is_stop == 1 ? true : false
      this.remark = this.choose.remark
    }
  },
  mounted () { }
}
</script>

<style  lang="scss">
.dialog .contentView {
  border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  padding: 10px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  .listItem {
    font-size: 15px;
    font-family: PingFangSC-Medium;
    color: #28282d;
    padding: 15px 0;
    line-height: 20px;
  }
  .listItem.select {
    background: #fff
      url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_R_Green.png)
      right center / 28px no-repeat;
  }
}
</style>
<style lang="scss" scoped>
#addpro {
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
    .btn-back {
      width: 40px;
      height: 40px;
      background-image: url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NavBack.png);
      background-position: left center;
      background-size: 28px;
      background-repeat: no-repeat;
    }
    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
    }
    button.btn-shopCart {
      height: 40px;
      position: relative;
      font-size: 20px;
      color: #dc670b;
    }
  }
  .contentView {
    position: relative;
    padding: 25px 30px 50px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 85px);
    .listView {
      // height: 100%;
      padding: 0 15px;
      background: #f8f8f8;
      border-radius: 6px;
      .item {
        display: flex;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        padding: 17px 25px 17px 0;
        line-height: 20px;
        position: relative;
        .right {
          flex: 1;
          text-align: right;
          .imgView {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
            background: url('https://hb.rgoo.com/upload/shop/moren.jpg')
              no-repeat center center;
            background-size: 100% 100%;
            img {
              width: 100%;
            }
            span {
              position: absolute;
              width: 100%;
              right: 0;
              width: 80px;
              height: 80px;
              line-height: 80px;
              text-align: center;
              color: #fff;
              background-color: rgba(0, 0, 0, 0.5);
              display: none;
            }
            &:hover span {
              display: inline-block;
            }
          }
          input {
            line-height: 28px;
            text-align: right;
            background: transparent;
            padding: 0;
            font-size: 14px;
            color: #28282d;
            outline: none;
            border: none;
          }
        }
        i {
          position: absolute;
          font-size: 18px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
