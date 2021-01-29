<template>
  <div id="addcika">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">添加次卡</div>
      <button class="btn-audio btn-shopCart" @click="submit">保存</button>
    </div>
    <div class="contentView listView">
      <div class="baseInfoView">
        <div class="tipView">必填</div>
        <div class="groupView">
          <div class="subItem type-input">
            <label class="label-leftText">选择项目</label>
            <div class="valView" @click="XMDialog=true">
              <input type="text" placeholder="请选择" v-model="item.name" readonly />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="subItem type-select">
            <label class="label-leftText">次卡类型</label>
            <div class="valView" @click="categoryDialog=true">
              <input type="text" placeholder="请选择" v-model="categoryName" readonly />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <el-dialog
            :close-on-click-modal="false"
            title="次卡类型"
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
                @click="category_id=v.id;categoryName=v.name;categoryDialog=false"
                v-for="(v,k) in catelist"
                :key="k"
              >{{v.name}}</div>
            </div>
          </el-dialog>
          <div class="subItem type-input">
            <label class="label-leftText">次数 / 时长</label>
            <div class="valView">
              <!-- <el-input-number size="mini" :min="1" v-model="number"></el-input-number> -->
              <input type="text" placeholder="请输入" v-model="number" @change="changeNum" />
            </div>
            <i style="font-size:14px;color:#000;">{{category_id|cateType}}</i>
          </div>

          <div class="subItem type-input">
            <label class="label-leftText">次卡售价</label>
            <div class="valView">
              <input type="text" placeholder="请输入" v-model="price" @change="changePrice" />
            </div>
          </div>

          <el-dialog
            :close-on-click-modal="false"
            title="选择项目"
            :visible.sync="XMDialog"
            width="30%"
            center
            :append-to-body="true"
            custom-class="dialog"
          >
            <div class="contentView" style="max-height: 720px;">
              <div
                class="listItem"
                :class="{select:item.id==v.id}"
                @click="item=v;XMDialog=false"
                v-for="(v,k) in XMlist"
                :key="k"
              >{{v.name}}</div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['choose'],
  data () {
    return {
      categoryDialog: false,
      categoryName: '',
      category_id: '',
      price: '',
      catelist: [{ id: 1, name: '次卡' }, { id: 2, name: '月卡' }, { id: 3, name: '季卡' }, { id: 4, name: '年卡' }],
      XMDialog: false,
      number: '',
      storeid: sessionStorage.getItem('storeid'),
      item: '',
      XMlist: []
    }
  },
  watch: {},
  computed: {},
  filters: {
    cateType (val) {
      switch (val) {
        case 1:
          return '次';
        case 2:
          return '月';
        case 3:
          return '季';
        case 4:
          return '年';
        default:
          return ''
      }
    }
  },
  methods: {
    back () {
      this.$emit('close')
    },
    changeNum () {
      this.number = this.number.replace(/\D/g, '')
    },
    changePrice () {
      let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
      if (!reg.test(this.price)) {
        this.$message('价格错误')
        this.price = 0
      }
    },
    // 获取XMlist
    async getXMlist () {
      const res = await this.$axios.get('/api?datatype=get_item_list', {
        params: {
          storeid: this.storeid,
          status: 1
        }
      })
      // console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
      } else {
        this.$message.error('暂无数据')
        this.XMlist = []
      }
    },
    async submit () {
      if (!this.price || !this.number || !this.category_id || !this.item.id) return this.$message.error('请填写完整信息')
      let params = {
        storeid: this.storeid,
        itemid: this.item.id,
        itemname: this.item.name,
        typeid: this.category_id,
        num: this.number,
        price: this.price
      }
      const res = await this.$axios.get('/api?datatype=insert_cicard', { params })
      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.back()
      }
    }
  },
  created () {
    this.getXMlist()
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

    color: #28282d;
    padding: 15px 0;
    line-height: 20px;
  }
  .listItem.select {
    background: #fff url(../assets/images/select_green.png) right center / 28px
      no-repeat;
  }
}
</style>
<style lang="scss" scoped>
#addcika {
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
      background-image: url(../assets/images/back.png);
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
