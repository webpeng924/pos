<template>
  <div id="showroom">
    <div class="topView">
      <div class="tView">
        <label>展厅</label>
      </div>
      <el-badge :value="carlist.length" class="item" v-show="carlist.length">
        <button class="btn-audio btn-shopCart" @click="drawerRight=true"></button>
      </el-badge>
      <button class="btn-audio btn-shopCart" v-show="!carlist.length"></button>
    </div>
    <div class="top">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide>
          <img src="../../assets/images/kv1.jpg" alt />
        </swiper-slide>
        <swiper-slide style="background: lime;">
          <img src="../../assets/images/kv2.jpg" alt />
        </swiper-slide>
        <swiper-slide style="background: blue;">
          <img src="../../assets/images/kv3.jpg" alt />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div class="bottom">
      <div class="left" @click="chostit = '项目介绍';showProject = true">
        <div class="p">
          <p>项目介绍</p>
          <p>project</p>
        </div>
      </div>
      <div class="right" @click="chostit = '产品介绍';showProject = true">
        <div class="p">
          <p>产品介绍</p>
          <p>product</p>
        </div>
      </div>
    </div>

    <div class="set_page" :class="{activePage:showProject}">
      <project @close="modifyCar" v-if="showProject" :title="chostit"></project>
    </div>

    <!-- <div class="set_page" :class="{activePage:showProduct}">
      <product @close="modifyCar" v-if="showProduct"></product>
    </div>-->
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
import project from './project.vue'
// import product from './product.vue'

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  components: { Swiper, SwiperSlide, project },
  directives: {
    swiper: directive
  },
  props: {},
  data () {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        autoplay: {
          delay: 5000
        },
        loop: true
      },
      showProject: false,
      showProduct: false,
      carlist: JSON.parse(sessionStorage.getItem('carlist')),
      chostit: '',
      drawerRight: false,
    }
  },
  watch: {},
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    totalPrice () {
      let sum = 0
      this.carlist.forEach(item => {
        sum += item.num * item.price
      })
      return sum
    }
  },
  methods: {
    modifyCar (data) {
      console.log(data)
      let arr = JSON.parse(sessionStorage.getItem('carlist'))
      if (arr) {
        this.carlist = arr
      } else {
        this.carlist = []
      }
      if (data) {
        this.carlist = data
      }
      this.showProject = false
      this.showProduct = false
    },
    handleChange () {

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
    this.modifyCar()
  },
  mounted () {
    console.log('Current Swiper instance object', this.swiper)
  }
}
</script>
<style lang="scss" scoped>
#showroom {
  padding-left: 120px;
  .topView {
    position: fixed;
    display: flex;
    top: 0;
    left: 120px;
    right: 0;
    padding: 35px 20px 10px 40px;
    height: 85px;
    line-height: 40px;
    z-index: 100;
    background: transparent;
    .tView {
      flex: 1;
      font-size: 24px;
      color: #fff;
    }
    .btn-shopCart {
      cursor: pointer;
      position: relative;
      width: 40px;
      height: 40px;
      background: transparent
        url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_ShopCart_White.png)
        center / 40px no-repeat;
    }
  }
  .top {
    height: 60%;
    position: relative;
    .swiper-container {
      height: 100%;
      // background: pink;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .swiper-button-prev {
      color: #fff;
    }
    .swiper-button-next {
      color: #fff;
    }
  }
  .bottom {
    height: 40%;
    position: relative;
    bottom: 0;
    display: flex;
    .left,
    .right {
      font-size: 18px;
      width: 50%;
      cursor: pointer;
      text-align: center;
      // border: 1px solid #000;
      position: relative;
      color: #fff;
      .p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .left {
      background: url(../../assets/images/xmjs.png) no-repeat center center;
      background-size: 100% 100%;
    }
    .right {
      background: url(../../assets/images/cpjs.png) no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
