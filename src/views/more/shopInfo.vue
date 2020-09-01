<template>
  <div id="shopInfo">
    <div class="pageTopView">
      <div class="tView">门店资料</div>
      <button class="btn-back" @click="$emit('close')"></button>
      <button class="btn-save" @click="isEdit=true" v-show="!isEdit">编辑</button>
      <button class="btn-save" @click="saveshop" v-show="isEdit">保存</button>
    </div>
    <div class="contentView">
      <div class="logoView">
        <div class="shopLogo">
          <div @click="openCropper">
            <img
              :src="shopInfo.avatar?shopInfo.avatar:'/upload/shop/moren.jpg'|imgUrl"
              v-show="!src"
            />
            <img :src="src" v-show="src" />
          </div>
        </div>
      </div>
      <div class="groupView codeView">
        <div>
          <label class="label-leftText">本店编号</label>
          <label class="label-value">{{shopInfo.shop_code}}</label>
        </div>
        <div>
          <label class="label-leftText">连锁代码</label>
          <label class="label-value">{{shopInfo.chain_code}}</label>
        </div>
      </div>
      <div class="groupView">
        <div class="inputView">
          <label class="label-leftText">本店全称</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.shop_name}}</label>
          <el-input type="text" v-model="shopInfo.shop_name" v-show="isEdit" />
        </div>
        <div class="inputView">
          <label class="label-leftText">本店简称</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.short_name}}</label>
          <el-input type="text" v-model="shopInfo.short_name" v-show="isEdit" />
        </div>
        <div class="selectView">
          <label class="label-leftText">门店级别</label>
          <label class="label-value">{{shopInfo.typename}}</label>
        </div>
        <div class="inputView">
          <label class="label-leftText">门店电话</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.mobile}}</label>
          <el-input type="text" v-model="shopInfo.mobile" v-show="isEdit" />
        </div>
        <div class="inputView addressView">
          <label class="label-leftText">详细地址</label>
          <label class="label-value">{{shopInfo.address}}</label>
          <div id="all-map" class="map"></div>
        </div>
      </div>
      <div class="groupView">
        <div class="inputView">
          <label class="label-leftText">微信公众号</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.gzh}}</label>
          <el-input type="text" v-model="shopInfo.gzh" v-show="isEdit" />
        </div>
        <div class="inputView">
          <label class="label-leftText">公司网址</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.url}}</label>
          <el-input type="text" v-model="shopInfo.url" v-show="isEdit" />
        </div>
        <div class="chooseView">
          <label class="label-leftText">经营范围</label>
          <label class="label-value" v-show="!isEdit">{{shopInfo.scope}}</label>
          <el-input type="text" v-model="shopInfo.scope" v-show="isEdit" />
        </div>
      </div>
      <div class="groupView">
        <div class="tView">门店展示图</div>
        <div class="shopImgsView">
          <div class="imgList">
            <div class="listItem">
              <img
                src="https://img1.bokao2o.com/1e9a7acd-ecff-44b0-94ab-d4791a0847e6.png?imageView2/1/w/312/h/176/interlace/1/q/100"
              />
            </div>
            <div class="listItem">
              <img
                src="https://img1.bokao2o.com/e5d2055d-9920-477e-bd5b-148db5c50e3f.png?imageView2/1/w/312/h/176/interlace/1/q/100"
              />
            </div>
            <div class="listItem">
              <img
                src="https://img1.bokao2o.com/4e94f11d-946f-4665-9faf-21819a8a46cc.png?imageView2/1/w/312/h/176/interlace/1/q/100"
              />
            </div>
            <div class="listItem">
              <img
                src="https://img1.bokao2o.com/963602ca-c7ec-4226-a06b-e474e2e017d5.png?imageView2/1/w/312/h/176/interlace/1/q/100"
              />
            </div>
            <div class="listItem">
              <img
                src="https://img1.bokao2o.com/f4ceca41-0600-47ba-99db-5bf7b5361f4e.png?imageView2/1/w/312/h/176/interlace/1/q/100"
              />
            </div>
          </div>
        </div>
        <div class="tipView">最多支持5张门店照片，为了保证图片质量请尽量上传16：9尺寸。</div>
      </div>
    </div>
    <!-- 图片上传 -->
    <xcropper ref="cropper"></xcropper>
  </div>
</template>

<script>
import xcropper from '@/components/xcropper.vue'
// import maps from "qqmap"
export default {
  components: { xcropper },
  props: {},
  data () {
    return {
      src: '',
      isEdit: false,
      shopInfo: {}
    }
  },
  watch: {},
  computed: {},
  methods: {
    TencentMap () {
      var center = new qq.maps.LatLng(this.shopInfo.lat, this.shopInfo.lng);
      var map = new qq.maps.Map("all-map", {
        center: center,
        zoom: 14,
      });
      var marker = new qq.maps.Marker({
        position: center,
        map: map
      });
    },
    // 打开上传图片
    openCropper () {
      let option = {
        title: '更换头像',
        msg: '建议图片大小：2M'
      };
      this.$refs.cropper.open(option, (data) => {
        console.log(data)
        this.src = 'https://hb.rgoo.com' + data
        this.shopInfo.avatar = data
        this.changeLogo(data)
      })
    },
    async changeLogo (data) {
      const res = await this.$axios.get('/api?datatype=upload_shopimg', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          img: data
        }
      })
      if (res.data.code == 1) {
        let data = JSON.stringify(this.shopInfo)
        sessionStorage.setItem('shopInfo', data)
        this.$message.success(res.data.msg)
      }
    },
    async saveshop () {
      const res = await this.$axios.get('/api?datatype=edit_shop', {
        params: {
          storeid: sessionStorage.getItem('storeid'),
          shop_name: this.shopInfo.shop_name,
          short_name: this.shopInfo.short_name,
          mobile: this.shopInfo.mobile,
          gzh: this.shopInfo.gzh,
          url: this.shopInfo.url,
          scope: this.shopInfo.scope,
          kv: this.shopInfo.kv,
          avatar: this.shopInfo.avatar
        }
      })
      if (res.data.code == 1) {
        this.isEdit = false
        let data = JSON.stringify(this.shopInfo)
        sessionStorage.setItem('shopInfo', data)
        this.$message.success(res.data.msg)
      }
    }
  },
  created () {
    let data = sessionStorage.getItem('shopInfo')
    this.shopInfo = JSON.parse(data)
  },
  mounted () { this.TencentMap() }
}
</script>

<style lang="scss" scoped>
#shopInfo {
  height: 100%;
  .pageTopView {
    position: relative;
    padding: 25px 0 20px 0;
    text-align: center;
    line-height: 40px;
    background: #fff;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
    .tView {
      font-size: 18px;
      color: #28282d;
    }
    .btn-back {
      position: absolute;
      left: 0;
      top: 25px;
      width: 40px;
      height: 40px;
      background-image: url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_NavBack.png);
      background-position: left center;
      background-size: 28px;
      background-repeat: no-repeat;
    }
    .btn-save {
      position: absolute;
      top: 25px;
      right: 20px;
      width: 58px;
      height: 40px;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      color: #47bf7c;
      text-align: right;
    }
  }
  .contentView {
    overflow: auto;
    background: #f8f8f8;
    height: calc(100% - 85px);
    padding: 12px 12px 35px 12px;
    .logoView {
      position: relative;
      text-align: center;
      padding: 18px 0 28px 0;
      .shopLogo {
        cursor: pointer;
        position: relative;
        left: 0;
        right: 0;
        margin: auto;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .groupView {
      background: #fff;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 0 15px;
      .tView {
        font-size: 15px;
      }
      //
      .addressView {
        position: relative;
        padding-bottom: 170px;
      }
      .map {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 15px;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
      }
      & > div {
        position: relative;
        display: flex;
        padding: 12px 0;
        line-height: 30px;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        .label-leftText {
          min-width: 90px;
          font-size: 15px;
        }
        .label-value {
          flex: 1;
          text-align: right;
          color: #28282d;
          font-size: 15px;
          letter-spacing: -0.36px;
        }
      }
      div.shopImgsView {
        padding-top: 15px;
        padding-bottom: 0;
        border-bottom: none;
        .imgList {
          overflow: hidden;
          .listItem {
            position: relative;
            float: left;
            width: 156px;
            height: 88px;
            margin: 0 8px 15px 8px;
            border-radius: 10px;
            overflow: hidden;
            background: #f4f4f4;
          }
        }
      }
    }
  }
}
</style>
