<template>
  <div class="lqy-postingAll">
    <div class="block">
      <div class="block-title">导入方式</div>
      <div class="block-content">
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
          <input type="text" class="entry" />
        </div>
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
        </div>
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
          <el-checkbox v-model="checkedOne" class="pd15">是否包含所有子门店</el-checkbox>
        </div>
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
          <el-checkbox v-model="checkedTwo" class="pd15">是否包含所有子门店</el-checkbox>
        </div>
      </div>
      <div class="block-footer">
        <p>
          共导入
          <span class="num">0</span>个号码
        </p>
        <el-button type="primary" class="middle">号码清单</el-button>
        <div class="footer-box">
          <el-checkbox v-model="checkedThree" class="pd15">过滤七天内已发送过的手机号</el-checkbox>
          <p class="red">发送短信前，请先仔细核对号码清单！！</p>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="block">
      <div class="block-title">短信编辑</div>
      <div class="block-content edit">
        <div class="edit-top pd15">短信内容</div>
        <div class="edit-content">
          <textarea
            v-model="write"
            name
            id
            cols="30"
            rows="10"
            placeholder="短信内容限长180个字 (一条短信60个字，包含短信签名，标点符号1个字) 短信结尾必须加“回N退订”"
            class="edit-write"
            :maxlength="maxLength"
          ></textarea>
          <div class="edit-total">
            <div class="duanxingNum">
              <span>共发送</span>
              <span class="num">0</span>
              <span>个号码</span>
              <span>|</span>
              <span>还可以</span>
              <span class="num">0</span>
              <span>条短信</span>
            </div>
            <div class="fonts">{{ write.length }}/{{ maxLength }}</div>
          </div>
        </div>
        <div class="edit-box pd15">
          <el-button type="primary" class="md10">短信模板</el-button>

          <el-button type="primary">发送短信</el-button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="block">
      <div class="block-title">功能选项</div>
      <div class="block-content bottom-btn">
        <el-button type="primary">黑名单</el-button>

        <el-button type="primary" class="ml50">短信历史</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      title: '短信群发',
      checkedOne: false,
      checkedTwo: false,
      checkedThree: false,
      maxLength: 180,
      write: ''
    }
  },
  created () {


  }

}
</script>
<style lang="scss" scoped>
.lqy-postingAll {
  /deep/.el-button + .el-button {
    margin-left: 0;
  }

  .line::after {
    content: '';
    display: block;
    height: 10px;
    width: 100%;
    margin-top: 30px;
    background-color: #ccc;
  }

  .block {
    padding: 0px 10%;
    .block-title {
      color: #46aae6;
      padding: 20px 10px;
      border-bottom: 1px solid #46aae6;
    }
    .block-content {
      display: flex;

      .block-item {
        flex: 1;
        border-right: 1px solid #afafaf;
        margin: 20px 0;
        padding: 0px 20px;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .entry {
          border: 1px solid #afafaf;
          border-radius: 5px;
          padding: 10px;
        }
      }
      .block-item:nth-last-child(1) {
        border: none;
      }
    }
    .edit {
      justify-content: center;
      align-items: center;
      .edit-content {
        width: 80%;
        .edit-write {
          margin: 10px;
          width: 100%;
          overflow: auto;
          word-break: break-all;
          height: 110px;
          resize: none;
          padding: 5px 10px;
        }
        .edit-total {
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          .fonts {
            color: #94aae8;
          }
        }
      }
      .edit-box {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    .pd15 {
      padding-bottom: 15px;
    }
    .md10 {
      margin-bottom: 10px;
    }
    .num {
      color: #46aae6;
    }
    .ml50 {
      margin-left: 50px;
    }
    .block-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      .middle {
        margin: 0px 20px;
      }
      .red {
        color: #ff0000;
      }
    }
    .bottom-btn {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
  }
  .end {
    height: 200px;
    width: 100%;
    background-color: #f99;
  }
}
</style>
