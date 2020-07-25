<template>
  <div id="erweima">
    <div class="topView">
      <div class="tView">门店付款二维码</div>
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
    </div>
    <div class="erweima-pay">
      <div class="pay-item">
        <div class="pay-header">支付宝</div>
        <!-- <div class="pay-default" @click="updata('zhifubao')" v-if="!zhifubao">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div class="pay-uploader" v-else>
        <img :src="`http://hb.rgoo.com${zhifubao}`" alt="" />
        </div>-->
        <div class="pay-uploader" v-if="zhifubao">
          <img :src="`http://hb.rgoo.com${zhifubao}`" alt />
        </div>
        <el-button type="primary" class="mt20" size="small" @click="updata('zhifubao')">上传图片</el-button>
      </div>
      <div class="line"></div>
      <div class="pay-item">
        <div class="pay-header">微 信</div>
        <!-- <div class="pay-default" @click="updata('weixin')" v-if="!weixin">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div class="pay-uploader" v-else>
        <img :src="`http://hb.rgoo.com${weixin}`" alt="" />
        </div>-->
        <div class="pay-uploader" v-if="weixin">
          <img :src="`http://hb.rgoo.com${weixin}`" alt />
        </div>
        <el-button type="primary" size="small" class="mt20" @click="updata('weixin')">上传图片</el-button>
      </div>
      <div class="line"></div>
      <div class="pay-item">
        <div class="pay-header">其 他</div>
        <!-- <div class="pay-default" @click="updata('weixin')" v-if="!weixin">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div class="pay-uploader" v-else>
        <img :src="`http://hb.rgoo.com${weixin}`" alt="" />
        </div>-->
        <div class="pay-uploader" v-if="other">
          <img :src="`http://hb.rgoo.com${other}`" alt />
        </div>
        <el-button type="primary" size="small" class="mt20" @click="updata('other')">上传图片</el-button>
      </div>
      <xcropper ref="cropper"></xcropper>
    </div>
  </div>
</template>

<script>
import xcropper from "@/components/xcropper.vue";
export default {
  data () {
    return {
      zhifubao: "",
      weixin: "",
      other: ""
    };
  },
  methods: {
    updata (type) {
      let option = {
        title: type,
        msg: "建议图片大小：2M"
      };
      this.$refs.cropper.open(option, data => {
        this[type] = data;
      });
    }
  },
  components: {
    xcropper
  }
};
</script>

<style lang="scss" scoped>
.topView {
  position: relative;
  background: #fff;
  padding: 25px 0 15px 0;
  text-align: center;
  border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
  .tView {
    font-size: 24px;
    color: #28282d;
    line-height: 40px;
    text-align: center;
    width: 100%;
  }
  .btn-back {
    position: absolute;
    top: 25px;
    left: 15px;
  }
}
.erweima-pay {
  display: flex;
  justify-content: space-between;
  padding: 50px 15%;
  .line::after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background-color: #ccc;
  }
  .mt20 {
    margin-top: 20px;
  }
  .pay-item {
    text-align: center;
    .pay-header {
      font-size: 30px;
      color: #46aa;
      margin-bottom: 30px;
    }
    .pay-default {
      width: 300px;
      height: 300px;
      border: 1px solid #000;
      text-align: center;
      line-height: 300px;
      font-size: 25px;
    }
    .pay-uploader {
      width: 300px;
      height: 300px;
      text-align: center;
      img {
        max-width: 300px;
        height: 300px;
      }
    }
  }
}
</style>
