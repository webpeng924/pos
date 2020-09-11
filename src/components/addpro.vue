<template>
  <div id="addpro">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">添加</div>
      <button class="btn-audio btn-shopCart" @click="submit">保存</button>
    </div>
    <div class="contentView listView">
      <div class="baseInfoView">
        <div class="tipView">必填</div>
        <div class="groupView">
          <div class="subItem">
            <label class="label-leftText">产品图片</label>
            <div class="valView">
              <div class="imgView">
                <img :src="img|imgUrl" alt />
                <span @click="openCropper">点击上传</span>
              </div>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="subItem type-input">
            <label class="label-leftText">
              产品编号
              <span class="xing">*</span>
            </label>
            <div class="valView">
              <input type="text" placeholder="请输入" v-model="goodsInfo.goods_no" />
            </div>
          </div>
          <div class="subItem type-input">
            <label class="label-leftText">
              产品名称
              <span class="xing">*</span>
            </label>
            <div class="valView">
              <input type="text" placeholder="请输入" v-model="goodsInfo.goods_name" />
            </div>
          </div>
          <div class="subItem type-input">
            <label class="label-leftText">
              标准价格
              <span class="xing">*</span>
            </label>
            <div class="valView">
              <input type="text" placeholder="请输入" v-model="goodsInfo.price" />
            </div>
          </div>
          <div class="subItem type-input">
            <label class="label-leftText">
              采购价格
              <span class="xing">*</span>
            </label>
            <div class="valView">
              <input type="text" placeholder="请输入" v-model="goodsInfo.in_cost" />
            </div>
          </div>
          <div class="subItem type-select">
            <label class="label-leftText">
              统计分类
              <span class="xing">*</span>
            </label>
            <div class="valView" @click="categoryDialog=true">
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
                :class="{select:goodsInfo.category_id==v.id}"
                @click="goodsInfo.category_id=v.id;categoryName=v.title;categoryDialog=false"
                v-for="(v,k) in catelist"
                :key="k"
              >{{v.title}}</div>
            </div>
          </el-dialog>
          <div class="subItem type-select">
            <label class="label-leftText">
              存放仓库
              <span class="xing">*</span>
            </label>
            <div class="valView">
              <input type="text" placeholder="请选择" v-model="goodsInfo.warehouse" readonly />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="subItem type-select">
            <label class="label-leftText">
              标准单位
              <span class="xing">*</span>
            </label>
            <div class="valView" @click="unitDialog=true">
              <input type="text" placeholder="请选择" v-model="goodsInfo.goods_unit" readonly />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <el-dialog
            title="标准单位"
            :visible.sync="unitDialog"
            width="30%"
            center
            :append-to-body="true"
            custom-class="dialog"
          >
            <div class="contentView" style="max-height: 720px;">
              <div
                class="listItem"
                :class="{select:goodsInfo.goods_unit==v}"
                @click="goodsInfo.goods_unit=v;unitDialog=false"
                v-for="(v,k) in unitlist"
                :key="k"
              >{{v}}</div>
            </div>
          </el-dialog>
          <div class="subItem type-input">
            <label class="label-leftText">条形码</label>
            <div class="valView">
              <input placeholder="请输入" v-model="goodsInfo.bar_code" />
            </div>
          </div>
        </div>
        <div class="tipView">非必填</div>
        <div class="groupView">
          <div class="subItem type-select">
            <label class="label-leftText">供应商</label>
            <div class="valView">
              <input type="text" placeholder="请选择" v-model="supplier" readonly />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="subItem type-switch">
            <label class="label-leftText">是否停用</label>
            <div class="valView">
              <el-switch v-model="goodsInfo.is_stop" active-color="#13ce66"></el-switch>
            </div>
          </div>
          <div class="subItem type-switch">
            <label class="label-leftText">停止销售</label>
            <div class="valView">
              <el-switch v-model="goodsInfo.state" active-color="#13ce66"></el-switch>
            </div>
          </div>

          <div class="subItem type-input">
            <label class="label-leftText">规格描述</label>
            <div class="valView">
              <input placeholder="请输入" v-model="goodsInfo.goods_spec_format" />
            </div>
          </div>
          <div class="subItem type-input">
            <label class="label-leftText">备注</label>
            <div class="valView">
              <input placeholder="请输入" v-model="goodsInfo.remark" />
            </div>
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
      item: 1,
      categoryDialog: false,
      categoryName: '',
      catelist: [],
      unitlist: ['瓶', '盒', '袋', '份', '克', '个', '千克', '升', '毫升', '双', '套'],
      unitDialog: false,
      supplier: '',
      img: '',
      storeid: sessionStorage.getItem('storeid'),
      goodsInfo: {
        storeid: sessionStorage.getItem('storeid'),
        type: 1,
        id: 0,
        goods_name: '',
        goods_no: '',
        price: '',
        in_cost: '',
        category_id: '',
        warehouse: '门店仓库',
        goods_unit: '',
        supplier_id: '',
        state: false,
        is_stop: false,
        bar_code: '',
        goods_spec_format: '',
        remark: ''
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    async getCate () {

      const res = await this.$axios.get('/api?datatype=get_goodscate', {
        params: {
          storeid: this.storeid,
        }
      })

      // console.log(res)
      if (res.data.code == 1) {
        this.catelist = res.data.data
      }
    },
    // 打开上传图片
    openCropper () {
      let option = {
        title: '项目图',
        msg: '建议图片大小：2M',
        fixedNumber: [3, 2]
      };
      this.$refs.cropper.open(option, (data) => {
        // console.log(data)
        this.img = data
      })
    },
    async submit () {
      if (!this.goodsInfo.goods_name || !this.goodsInfo.goods_no || !this.goodsInfo.price || !this.goodsInfo.in_cost || !this.goodsInfo.category_id || !this.goodsInfo.goods_unit) return this.$message.error('请完善产品信息')
      let params = {
        storeid: this.goodsInfo.storeid,
        type: this.goodsInfo.type,
        id: this.goodsInfo.id,
        pic: this.img,
        goods_name: this.goodsInfo.goods_name,
        goods_no: this.goodsInfo.goods_no,
        price: this.goodsInfo.price,
        in_cost: this.goodsInfo.in_cost,
        category_id: this.goodsInfo.category_id,
        warehouse: this.goodsInfo.warehouse,
        goods_unit: this.goodsInfo.goods_unit,
        supplier_id: this.goodsInfo.supplier_id,
        state: this.goodsInfo.state ? '1' : '0',
        is_stop: this.goodsInfo.is_stop ? '1' : '0',
        bar_code: this.goodsInfo.bar_code,
        goods_spec_format: this.goodsInfo.goods_spec_format,
        remark: this.goodsInfo.remark
      }

      const res = await this.$axios.get('/api?datatype=insert_goods', { params })
      // console.log(res)

      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.back()
      } else if (res.data.code == 2) {
        this.$message.error(res.data.msg)
      } else {
        this.$message.error('添加失败')
      }
    }
  },
  created () {
    this.getCate()
    if (this.choose) {
      this.categoryName = this.choose.title
      this.goodsInfo.type = 2
      this.img = this.choose.img
      this.goodsInfo.id = this.choose.id
      this.goodsInfo.goods_name = this.choose.goods_name
      this.goodsInfo.goods_no = this.choose.goods_no
      this.goodsInfo.warehouse = this.choose.warehouse
      this.goodsInfo.name = this.choose.name
      this.goodsInfo.price = this.choose.price
      this.goodsInfo.in_cost = this.choose.in_cost
      this.goodsInfo.category_id = this.choose.category_id
      this.goodsInfo.goods_unit = this.choose.goods_unit
      this.goodsInfo.is_stop = this.choose.is_stop == 1 ? true : false
      this.goodsInfo.state = this.choose.state == 1 ? true : false
      this.goodsInfo.bar_code = this.choose.bar_code
      this.goodsInfo.goods_spec_format = this.choose.goods_spec_format
      this.goodsInfo.remark = this.choose.remark
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
      font-family: PingFangSC-Semibold;
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
    height: calc(100% - 131px);
    padding: 0 30px 50px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    .baseInfoView > .tipView,
    .advancedInfoView > .tipView {
      line-height: 36px;
      font-size: 14px;
      color: #8a8a8a;
      padding: 0 15px;
    }
    .baseInfoView > .groupView,
    .contentView > .advancedInfoView > .groupView {
      padding: 0 15px;
      background: #f8f8f8;
      border-radius: 6px;
      margin-bottom: 16px;
      .subItem {
        position: relative;
        display: flex;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        padding: 17px 25px 17px 0;
        line-height: 20px;
        i {
          position: absolute;
          font-size: 18px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .valView {
          flex: 1;
          text-align: right;
          font-size: 14px;
          color: #28282d;
          .imgView {
            display: inline-block;
            position: relative;
            width: 120px;
            height: 80px;
            background: url('https://hb.rgoo.com/upload/shop/moren.jpg')
              no-repeat center center;
            background-size: 100% 100%;
            img {
              width: 100%;
              height: 100%;
            }
            span {
              position: absolute;
              width: 100%;
              right: 0;
              width: 120px;
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
          > input {
            line-height: 28px;
            text-align: right;
            background: transparent;
            padding: 0;
            font-size: 14px;
            color: #28282d;
            border: none;
          }
        }
      }
    }
  }
}
</style>
