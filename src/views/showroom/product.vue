<template>
  <div id="project">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">产品介绍</div>
      <button class="btn-audio btn-shopCart"></button>
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
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      catelist: [],
      active: ''
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    changeActive (id) {
      this.active = id
      this.getCPlist()
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
          storeid: this.storeid
        }
      })
      console.log(res)
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
      } else {
        this.tableData = []
      }
    },
  },
  created () { this.getCPcate() },
  mounted () { }
}
</script>

<style lang="scss" scoped>
#project {
  height: 100%;
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
}
</style>
