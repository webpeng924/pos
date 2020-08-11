<template>
  <div id="produce">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">{{title}}</div>
      <el-badge :value="carlist.length" class="item" v-show="carlist.length">
        <button class="btn-audio btn-shopCart" @click="drawerRight=true"></button>
      </el-badge>
      <button class="btn-audio btn-shopCart" v-show="!carlist.length"></button>
    </div>
    <div class="menuView">
      <div
        class="menuItem btn-audio"
        style="margin-left: 25px;"
        :class="{select:active==v.id}"
        @click="changeActive(v.id)"
        v-for="(v,k) in catelist"
        :key="k"
      >{{v.title}}</div>
    </div>
    <div class="proList">
      <div
        class="listItem btn-audio"
        v-for="(v,k) in XMlist"
        :key="k"
        @click="chooseItem=v;drawer=true"
      >
        <div class="imgView">
          <img :src="v.img?v.img:'/upload/shop/moren.jpg'|imgUrl" />
        </div>
        <div class="textView">
          <div class="nameView overflowText">{{v.name}}</div>
          <div class="priceView">
            ￥
            <span>{{v.price}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="btt"
      :with-header="false"
      :append-to-body="true"
      size="370px"
    >
      <div class="contentView">
        <div class="imgView">
          <img :src="chooseItem.img?chooseItem.img:'/upload/shop/moren.jpg'|imgUrl" />
        </div>
        <div class="textView">
          <div class="nameView">{{chooseItem.name}}</div>
          <div class="descView">介绍：无</div>
          <div class="stepView">
            <div class="tView">服务流程</div>
            <div class="processView">无</div>
          </div>
          <div class="priceView">
            单价：
            <span>￥&nbsp;{{chooseItem.price}}</span>
            <button class="btn-audio btn-add" @click="additem">添加</button>
          </div>
        </div>
        <button class="btn-close btn-audio"></button>
      </div>
    </el-drawer>

    <el-drawer
      :visible.sync="drawerRight"
      direction="rtl"
      :with-header="false"
      :append-to-body="true"
      size="370px"
    >
      <div class="carView">
        <div class="popView-headerView">购物车</div>
        <div class="listView">
          <div class="listItem serItem" v-for="(v,k) in carlist" :key="k">
            <div class="imgView">
              <img :src="v.img?v.img:'/upload/shop/moren.jpg'|imgUrl" />
            </div>
            <div class="textView">
              <div class="nameView">
                <span>({{v.typeid==1?'项目':'产品'}})</span>
                &nbsp;{{v.itemname}}
              </div>
              <div class="bView">
                <div class="cntView">
                  <el-input-number
                    size="mini"
                    v-model="v.num"
                    @change="handleChange"
                    :min="1"
                    :max="999"
                  ></el-input-number>
                </div>
                <div class="priceView">
                  ￥&nbsp;
                  <span>{{v.num*Number(v.price)}}</span>
                </div>
              </div>
            </div>
            <button class="btn-audio btn-del" @click="del(k)"></button>
          </div>
        </div>
        <div class="bottomView">
          <div class="totalAmtView">
            合计：
            <label>
              ￥&nbsp;
              <span>{{totalPrice}}</span>
            </label>
          </div>
          <button class="btn-audio btn-order" @click="openAdd">开单</button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['title'],
  data () {
    return {
      item: 1,
      drawer: false,
      drawerRight: false,
      catelist: [],
      storeid: sessionStorage.getItem('storeid'),
      active: '',
      carlist: [],
      XMlist: [],
      chooseItem: ''
    }
  },
  watch: {},
  computed: {
    totalPrice () {
      let sum = 0
      this.carlist.forEach(item => {
        sum += item.num * item.price
      })
      return sum
    }
  },
  beforeDestroy () {
    sessionStorage.setItem('carlist', JSON.stringify(this.carlist))
  },
  methods: {
    back () {
      console.log(this.carlist)
      this.$emit('close', this.carlist)
    },
    additem () {
      let obj
      if (this.title == '产品介绍') {
        obj = {
          worker: '',
          typeid: 2,
          itemid: this.chooseItem.goods_id,
          num: 1,
          itemname: this.chooseItem.goods_name,
          staff1: 0,
          price: this.chooseItem.price,
          subtotal: this.chooseItem.price,
          is_usecard: 0,
          discount: 1,
          img: this.chooseItem.img,
        }
      } else {
        obj = {
          worker: '',
          typeid: 1,
          itemid: this.chooseItem.id,
          num: 1,
          itemname: this.chooseItem.name,
          staff1: 0,
          price: this.chooseItem.price,
          subtotal: this.chooseItem.price,
          is_usecard: 0,
          discount: 1,
          img: this.chooseItem.img,
        }
      }
      if (this.carlist && this.carlist.length) {
        if (this.title == '项目介绍') {
          let flag = this.carlist.some(item => item.typeid == 1 && item.itemid == this.chooseItem.id)
          if (flag) {
            this.carlist.filter(v => {
              if (v.itemid == this.chooseItem.id) {
                v.num++
              }
            })
          } else {
            this.carlist.push(obj)
          }
        } else {
          let flag = this.carlist.some(item => item.typeid == 2 && item.itemid == this.chooseItem.goods_id)
          if (flag) {
            this.carlist.filter(v => {
              if (v.typeid == 2 && v.itemid == this.chooseItem.goods_id) {
                v.num++
              }
            })
          } else {
            this.carlist.push(obj)
          }
        }
      } else {
        this.carlist.push(obj)
      }

      this.drawer = false
    },
    handleChange () {

    },
    changeActive (id) {
      this.active = id
      if (this.title == '项目介绍') {
        this.getXMlist()
      } else {
        this.getCPlist()
      }

    },
    // 获取项目分类
    async getXMcate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate&storeid=' + this.storeid)
      console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
      this.getXMlist()
    },
    // 获取XMlist
    async getXMlist () {
      const res = await this.$axios.get('/api?datatype=get_item_list', {
        params: {
          storeid: this.storeid,
          status: 1,
          cate: this.active
        }
      })
      console.log(res)
      if (res.data.data) {
        this.XMlist = res.data.data
      } else {
        this.XMlist = []
      }
    },
    // 获取产品分类
    async getCPcate () {
      const res = await this.$axios.get('/api?datatype=get_goodscate&storeid=' + this.storeid)
      console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
      this.getCPlist()
    },
    async getCPlist () {
      const res = await this.$axios.get('/api?datatype=get_skulist', {
        params: {
          cate: this.active,
          type: 1,
          storeid: this.storeid
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.XMlist = res.data.data
      } else {
        this.XMlist = []
      }
    },
    del (k) {
      this.carlist.splice(k, 1)
    },
    openAdd () {
      sessionStorage.setItem('carlist', JSON.stringify(this.carlist))
      this.$router.push({ name: 'Home', params: { from: 'car' } })
    }
  },
  created () {
    if (this.title == '项目介绍') {
      this.getXMcate()
    } else {
      this.getCPcate()
    }

    let arr = JSON.parse(sessionStorage.getItem('carlist'))
    if (arr) {
      this.carlist = arr
    } else {
      this.carlist = []
    }
  },
  mounted () { }
}
</script>
<style>
.el-drawer__body {
  height: 40%;
}
.el-drawer__body .contentView {
  height: 100%;
  display: flex;
  padding: 15px 20px;
}
.el-drawer__body > .contentView > .imgView {
  width: 340px;
  height: 340px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 25px;
  box-shadow: 0 0 5px 0 rgba(220, 220, 220, 0.4);
}
.el-drawer__body > .contentView > .imgView img {
  width: 100%;
}
.el-drawer__body > .contentView > .textView {
  flex: 1;
  color: #28282d;
  padding-bottom: 10px;
}
.el-drawer__body > .contentView > .textView > .nameView {
  line-height: 60px;
  font-size: 20px;
}
.el-drawer__body > .contentView > .textView > .descView {
  font-size: 15px;
  line-height: 25px;
  min-height: 100px;
}
.el-drawer__body > .contentView > .textView > .priceView {
  margin-top: 40px;
  line-height: 40px;
  height: 40px;
  font-size: 15px;
  color: #8a8a8a;
}
.contentView > .textView > .priceView > span {
  font-size: 24px;
  font-family: DINAlternate-Bold;
  color: #ff5e56;
}
.contentView > .textView > .priceView > .btn-add {
  float: right;
  width: 110px;
  height: 40px;
  background: #28282d;
  color: #fff;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
#produce {
  height: 100%;
  background-color: #f4f4f4;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
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
      width: 40px;
      height: 40px;
      position: relative;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_ShopCart_Black.png)
        center / 24px no-repeat;
    }
  }
  .menuView {
    background-color: #fff;
  }
  .proList {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 35px 0 25px 120px;
    .listItem {
      cursor: pointer;
      display: inline-block;
      width: 164px;
      height: 156px;
      margin: 0 38px 38px 0;
      .imgView {
        width: 164px;
        height: 110px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .textView {
        display: flex;
        line-height: 46px;
        .priceView {
          flex: 2;
          text-align: right;
          color: #ff5e56;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
