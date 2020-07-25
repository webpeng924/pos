<template>
  <div id="showroom">
    <div class="topView">
      <div class="tView">
        <label>展厅</label>
      </div>
      <el-badge :value="carlist.length" class="item" v-show="carlist.length">
        <button class="btn-audio btn-shopCart"></button>
      </el-badge>
      <button class="btn-audio btn-shopCart" v-show="!carlist.length"></button>
    </div>
    <div class="top">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide>1</swiper-slide>
        <swiper-slide style="background: lime;">2</swiper-slide>
        <swiper-slide style="background: blue;">3</swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div class="bottom">
      <div class="left" @click="showProject = true">
        <div class="p">
          <p>项目介绍</p>
          <p>project</p>
        </div>
      </div>
      <div class="right" @click="showProduct = true">
        <div class="p">
          <p>产品介绍</p>
          <p>product</p>
        </div>
      </div>
    </div>

    <div class="set_page" :class="{activePage:showProject}">
      <project @close="showProject=false;modifyCar()" v-if="showProject"></project>
    </div>

    <div class="set_page" :class="{activePage:showProduct}">
      <product @close="showProduct=false;modifyCar()" v-if="showProduct"></product>
    </div>
  </div>
</template>

<script>
import project from '@/components/project.vue'
import product from '@/components/product.vue'

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  components: { Swiper, SwiperSlide, project, product },
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
      carlist: JSON.parse(sessionStorage.getItem('carlist'))
    }
  },
  watch: {},
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    modifyCar () {
      let arr = JSON.parse(sessionStorage.getItem('carlist'))
      if (arr) {
        this.carlist = arr
      } else {
        this.carlist = []
      }
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
      background: pink;
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
      border: 1px solid #000;
      position: relative;
      .p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
