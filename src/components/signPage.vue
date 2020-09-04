<template>
  <div class="page sign-page">
    <div class="content">
      <div>请用正楷在下框写入您的真实姓名：</div>
      <div class="sign-wrap" id="signWrap">
        <canvas id="myCanvas" width="200" height="300"></canvas>
      </div>
    </div>
    <div class="fix-btn">
      <el-button
        size="large"
        type="hollow"
        class="hollow-primary-btn"
        @click.native="clearArea()"
      >清除</el-button>
      <el-button size="large" type="primary" @click.native="saveSign()">提交</el-button>
    </div>
  </div>
</template>
<script>
// import * as marketService from "../marketService";

export default {
  data () {
    return {
      image: "",
      mousePressed: false,
      c: "",
      ctx: "",
      lastX: 0,
      lastY: 0,
    };
  },
  mounted () {
    console.log("mounted");
    this.image = "";
    this.mousePressed = false;
    var lastX, lastY;
    this.ctx = document.getElementById("myCanvas").getContext("2d");
    this.c = document.getElementById("myCanvas");
    var signWrap = document.getElementById("signWrap");
    this.c.width = signWrap.clientWidth; //设置宽度
    this.c.height = signWrap.clientHeight; //设置高度

    //监听touchstart事件，touchmove事件，touchend事件等事件
    this.InitThis();
  },
  methods: {
    saveImageInfo () {
      var image = this.c.toDataURL("image/png"); //得到生成后的签名base64位  url 地址
      console.log(image);
      let params = {
        contract_number: this.$route.query.contract_number,
        img_base64: image //图片base6码
      };
      this.wxContractSignatureFun(params);
    },
    InitThis () {
      // 触摸屏
      var that = this;
      this.c.addEventListener(
        "touchstart",
        function (event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            this.mousePressed = true;
            that.Draw(
              touch.pageX - this.offsetLeft,
              touch.pageY - this.offsetTop,
              false
            );
          }
        },
        false
      );

      this.c.addEventListener(
        "touchmove",
        function (event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            if (this.mousePressed) {
              that.Draw(
                touch.pageX - this.offsetLeft,
                touch.pageY - this.offsetTop,
                true
              );
            }
          }
        },
        false
      );

      this.c.addEventListener(
        "touchend",
        function (event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
            // var touch = event.targetTouches[0];
            this.mousePressed = false;
          }
        },
        false
      );
      //   this.c.addEventListener(
      //     "touchcancel",
      //     function(event) {
      //       this.mousePressed = false;
      //     },
      //     false
      //   );

      // 鼠标
      this.c.onmousedown = function (event) {
        this.mousePressed = true;
        that.Draw(
          event.pageX - this.offsetLeft,
          event.pageY - this.offsetTop,
          false
        );
      };

      this.c.onmousemove = function (event) {
        if (this.mousePressed) {
          that.Draw(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop,
            true
          );
        }
      };

      this.c.onmouseup = function (event) {
        this.mousePressed = false;
      };
    },
    Draw (x, y, isDown) {
      if (isDown) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000"; //颜色
        this.ctx.lineWidth = 3; //线宽
        this.ctx.lineJoin = "round";
        this.ctx.lineMax = 10; //设置画笔最大线宽
        this.ctx.lineMin = 3; //设置画笔最小线宽
        this.ctx.linePressure = 1.2; //设置画笔笔触压力
        this.ctx.smoothness = 30; //设置画笔笔触大小变化的平滑度。
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      this.lastX = x;
      this.lastY = y;
    },
    clearArea () {
      console.log("清空画板");
      // Use the identity matrix while clearing the canvas
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },
    saveSign () {
      //提交签名
      this.checkEmpty();  //调用 表单非空验证
    },
    checkEmpty () {
      var c = document.getElementById("myCanvas"); // 获取html的canvas对象，我这个id="myCanvas"
      if (this.isCanvasBlank(c)) {
        this.$dialog.toast({
          mes: "请签名",
          timeout: 1500,
          icon: "error",
          callback: () => { }
        });
        return;
      } else {
        console.log("提交签名");
        var image = this.c.toDataURL("image/png"); //得到生成后的签名base64位  url 地址
        console.log(image);//保存为图片base64 url
      }
    },
    //验证canvas画布是否为空函数
    isCanvasBlank (canvas) {
      var blank = document.createElement("canvas"); //系统获取一个空canvas对象
      blank.width = canvas.width;
      blank.height = canvas.height;
      return canvas.toDataURL() == blank.toDataURL(); //比较值相等则为空
    },
  }
};
</script>
<style lang="scss" scoped>
.page {
  height: 100%;
}

.sign-page .content {
  padding: 0.3rem;
  font-size: 14px;
  height: 100%;
  color: #666;
}

.sign-wrap {
  margin-top: 0.3rem;
  width: 100%;
  height: 70%;
  border: 1px dashed #999;
  // border-radius: 6px;
}

#myCanvas {
  // width: 90%;
  // height: 150px;
  // border-radius: 10px;
  // margin: 10px 5% 5px 5%;
  color: #ff6000;
  background-color: #ffffff;
}
</style>