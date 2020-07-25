<template>
  <div class="lqy-recharge">
    <div class="erweima-item">
      <div class="erweima-header">5000条短信(450元)</div>
      <div class="erweima-content">
        <img :src="url" alt />
      </div>
    </div>
    <div class="erweima-item">
      <div class="erweima-header">5000条短信(450元)</div>
      <div class="erweima-content">
        <img :src="url" alt />
      </div>
    </div>
    <div class="erweima-item">
      <div class="erweima-header">5000条短信(450元)</div>
      <div class="erweima-content">
        <img :src="url" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      url: require("../../assets/images/logo.jpg")
    };
  },
  methods: {},
  created () { },
  mounted () { },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.lqy-recharge {
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
  .erweima-item {
    flex: 1;
    padding: 30px;
    border-right: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    .erweima-header {
      font-size: 18px;
      color: #46aae6;
      margin-bottom: 20px;
    }
    .erweima-content {
      width: 300px;
      height: 300px;
      img {
        max-width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
