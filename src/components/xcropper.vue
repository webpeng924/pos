<template>
  <el-dialog
    :close-on-click-modal="false"
    append-to-body
    :title="title"
    :visible.sync="cropperVisible"
    width="800px"
    @close="$emit('close')"
  >
    <div>
      <el-alert :title="msg" type="error" :closable="false"></el-alert>
      <div id="cro">
        <span class="n">剪裁框</span>
        <span class="n" style="margin-right: 0">预览</span>
        <div class="cro_left">
          <VueCropper
            ref="cropper"
            :img="option.img"
            :full="option.full"
            outputType="png"
            :infoTrue="true"
            :autoCrop="true"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="true"
            :fixedNumber="option.fixedNumber"
            @real-time="realTime"
          ></VueCropper>
        </div>
        <div class="cro_right" v-html="previews.html"></div>
      </div>
      <div style="margin-top: 30px;">
        <el-button size="small" type="primary" @click="$refs.uploads.click()">
          上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
        <el-button size="small" type="primary" plain icon="el-icon-plus" @click="changeScale(1)"></el-button>
        <el-button size="small" type="primary" plain icon="el-icon-minus" @click="changeScale(-1)"></el-button>
        <el-button
          size="small"
          type="primary"
          plain
          icon="el-icon-refresh-right"
          @click="rotateRight"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          plain
          icon="el-icon-refresh-left"
          @click="rotateLeft"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          :loading="false"
          style="float: right"
          @click="proImgData()"
        >确定</el-button>
      </div>
    </div>
    <input
      type="file"
      ref="uploads"
      style="position:absolute; clip:rect(0 0 0 0);"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @click="openPIc"
      @change="uploadImg($event,1)"
    />
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  data () {
    return {
      cropperVisible: false,

      title: '',
      msg: '',
      callback: null,
      option: {
        img: '',
        full: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedNumber: [1, 1],
        outputSize: 0.3,
        outputType: 'jpeg',
      },
      previews: {},
    }
  },
  methods: {
    openPIc (e) {
      if ((window.navigator.userAgent).indexOf('wv') == -1) {
        e.target.value = '';
      } else {
        javascript: jsSzb.smPhoto();
      }
      // this.$message('DIANJI')
      // javascript: jsSzb.smPhoto();
      // jsSzb.smPhoto();
    },
    open (option, callback) {
      this.title = option.title;
      this.msg = option.msg;
      for (let i in option) {
        this.$set(this.option, i, option[i]);
      }
      this.callback = callback;
      this.cropperVisible = true;
    },
    //选择本地图片
    uploadImg (e, num) {
      let file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        console.log(typeof e.target.result === 'object')
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
          console.log(data)
        } else {
          data = e.target.result
        }
        if (num === 1) {
          console.log(data)
          this.option.img = data
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    onJaveImageResJs (e) {
      window.URL = window.URL || window.webkitURL;
      var url = window.URL.createObjectURL(this.dataURLtoBlob('data:image/png;base64,' + e));
      this.option.img = url
    },
    // base64转blob
    dataURLtoBlob (base64Data) {
      this.$message('开始转换')
      try {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(base64Data.split(',')[1]);
        else
          byteString = unescape(base64Data.split(',')[1]);
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        this.$message('转换完成')
        return new Blob([ia], {
          type: mimeString
        });
      }
      catch (err) {
        this.$notify({
          title: '提示',
          message: err,
          duration: 0
        });
      }
    },

    //缩放
    changeScale (num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num)
    },
    //旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data;
    },
    //处理剪裁后的图片数据
    proImgData () {
      this.$refs.cropper.getCropBlob((data) => {
        if (data.size < 1024 * 1024 * 2) {
          try {
            this.updata(data);
          }
          catch (err) {
            this.$notify({
              title: '提示',
              message: err,
              duration: 0
            });
          }
          // console.log(data, data.size)
        } else {
          this.cutImg(data)
          // console.log(data.size)
        }
      })
    },
    //压缩图片
    cutImg (data) {
      let percentage = 2 * 1024 * 1024 / data.size;
      let reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = (e) => {
        let img = new Image();  // 创建新的img对象
        img.src = e.target.result;  //加载base64格式图像
        img.onload = () => {  //图像加载完成
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          let imgW = parseInt(img.width * percentage);
          let imgH = parseInt(img.height * percentage);
          canvas.width = imgW;
          canvas.height = imgH;
          context.drawImage(img, 0, 0, imgW, imgH);
          canvas.toBlob((blob) => {
            if (blob.size < 1024 * 1024 * 2) {
              this.updata(blob);
            } else {
              this.cutImg(blob)
            }
          }, 'image/jpeg');
        }
      }
    },
    //上传图片到数据库
    updata (data) {
      var that = this
      const isLt40k = data.size / 1024 < 40
      if (isLt40k) return this.$message.error('上传文件大小不能小于40k!')
      let a = new FileReader();
      a.onload = function (e) {
        // let data = {
        //   img: e.target.result
        // }
        var params = new URLSearchParams()
        params.append('img', e.target.result)
        that.$axios({
          url: '/api?datatype=upload_img',
          method: 'post',
          data: params
        }).then(res => {
          // console.log(res)
          ;
          if (res.data && res.data.data) {
            that.callback(res.data.data);
            // localStorage.setItem('img', JSON.stringify(res.data.data))
            that.$emit('next', res.data.data)
            that.cropperVisible = false
          }
        }, () => { })
      }
      a.readAsDataURL(data);
    },
  },
  mounted () {
    window.onJaveImageResJs = this.onJaveImageResJs
    // console.log(window.onJaveImageResJs)
  },
  components: {
    VueCropper,
  },
};
</script>

<style scoped>
#cro {
  height: 400px;
}
#cro .cro_left {
  float: left;
  width: 350px;
  height: 350px;
  margin-right: 50px;
}
#cro .cro_right {
  float: left;
  background-color: rgba(0, 0, 0, 0.1);
}
#cro span.n {
  float: left;
  margin-right: 352px;
  font-size: 16px;
  color: #000000;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
