<template>
  <div class="lqy-postingAll">
    <div class="block">
      <div class="block-title"></div>
      <div class="block-content">
        <div class="block-item">
          <el-button type="warning" plain @click="getList();memberView=true">选择会员</el-button>
          <!-- <input type="text" class="entry" /> -->
        </div>
        <!-- <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
        </div>
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
          <el-checkbox v-model="checkedOne" class="pd15">是否包含所有子门店</el-checkbox>
        </div>
        <div class="block-item">
          <el-button type="primary">从文件导入（TXT）</el-button>
          <el-checkbox v-model="checkedTwo" class="pd15">是否包含所有子门店</el-checkbox>
        </div>-->
      </div>
      <div class="block-footer">
        <p>
          共导入
          <span class="num">{{checklist.length}}</span>个号码
        </p>
        <el-button type="success" plain class="middle" @click="listView=true">号码清单</el-button>
        <div class="footer-box">
          <!-- <el-checkbox v-model="checkedThree" class="pd15">过滤七天内已发送过的手机号</el-checkbox> -->
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
            v-model="smstxt"
            cols="30"
            rows="10"
            placeholder="请从右侧短信模板选择（可自定义编辑）"
            class="edit-write"
            :maxlength="maxLength"
          ></textarea>
          <div class="edit-total">
            <div class="duanxingNum">
              <!-- <span>共发送</span>
              <span class="num">0</span>
              <span>个号码 |</span>-->
              <span>还可以发送</span>
              <span class="num">{{count}}</span>
              <span>条短信</span>
            </div>
            <div class="fonts">{{ smstxt.length }}/{{ maxLength }}</div>
          </div>
        </div>
        <div class="edit-box pd15">
          <el-button type="primary" plain class="md10" @click="smstemplate=true;gettamp()">短信模板</el-button>
          <el-button type="warning" plain @click="sendsms">发送短信</el-button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <!-- <div class="block">
      <div class="block-title">功能选项</div>
      <div class="block-content bottom-btn">
        <el-button type="primary" class="ml50">短信历史</el-button>
      </div>
    </div>-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="memberView"
      width="70%"
      :before-close="handleClose"
      :append-to-body="true"
      custom-class="smsDialog"
      title="选择会员"
      center
    >
      <div
        class="searchResView"
        style="background: linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%)"
      >
        <div class="topSearchView">
          <el-select v-model="datetype" class="selectday" placeholder="会员关怀" @change="getList">
            <el-option label="全部会员" value="0"></el-option>
            <el-option label="本月生日会员" value="1"></el-option>
            <el-option label="三天内生日会员" value="2"></el-option>
            <el-option label="本月未消费会员" value="3"></el-option>
            <el-option label="7天未消费会员" value="4"></el-option>
            <el-option label="储值余额不足100" value="5"></el-option>
            <el-option label="查看欠款会员" value="6"></el-option>
          </el-select>
          <div class="inputView">
            <input placeholder="请输入会员名或手机号" v-model="keyword" @keyup.enter="getList" />
            <button class="btn-close btn-audio" @click="keyword=''"></button>
          </div>
          <button class="btn-audio" :class="{search:keyword}" @click="getList">查询</button>
        </div>
        <el-table :data="tableData" style="width: 100%" height="100%" @row-click="choosMember">
          <el-table-column width="55">
            <template slot-scope="{row}">
              <div class="seleted" :class="{active:check.includes(row.member_id)}"></div>
            </template>
          </el-table-column>
          <el-table-column prop="card_num" label="卡号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="birthday1" label="会员生日"></el-table-column>
          <el-table-column prop="balance" label="储值余额"></el-table-column>
          <el-table-column prop="signbill" label="欠款金额"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="memberView = false">取 消</el-button>
        <el-button @click="submitchoose">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="listView"
      width="400px"
      :append-to-body="true"
      custom-class="listDialog"
      title="号码清单"
      center
    >
      <el-table ref="cardTable" :data="checklist" style="width:100%" height="450px">
        <el-table-column prop="name" label="会员名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="smstemplate"
      width="60%"
      :append-to-body="true"
      custom-class="listDialog"
      title="短信模板"
      center
    >
      <div class="templist">
        <div
          class="titem"
          v-for="(val,k) in tempList"
          :key="k"
          :class="{active:val.content==smstxt}"
          @click="smstxt=val.content"
        >{{'“'+val.name+'”：'+val.content}}</div>
      </div>
      <div style="text-align:center">
        <el-button type="primary" @click="smstemplate=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      tempList: [],
      smstxt: '',
      title: '短信群发',
      checkedOne: false,
      datetype: '',
      checkedTwo: false,
      checkedThree: false,
      check: [],
      checklist: [],
      count: 0,
      type: '号码',
      storeid: sessionStorage.getItem('storeid'),
      shopinfo: sessionStorage.getItem('shopInfo'),
      keyword: '',
      tableData: [],
      maxLength: 180,
      memberView: false,
      smstemplate: false,
      listView: false
    }
  },
  methods: {
    handleClose () {
      this.memberView = false
    },
    gettamp () {
      this.$axios.get('/api?datatype=get_store_smstemp').then(
        res => {
          if (res.data.code == 1) {
            this.tempList = res.data.data
            this.tempList.forEach(item => {
              item.content = item.content.replace(/{s10}/g, JSON.parse(this.shopinfo).shop_name)
            })
          }
        }
      )
    },
    sendsms () {
      if (!this.check.length) return this.$message.error('请选择会员')
      if (!this.smstxt) return this.$message.error('请选择短信模板')
      let data = {
        storeid: this.storeid,
        ids: this.check,
        content: this.smstxt
      }
      this.$axios.post('https://hb.rgoo.com/index.php/sysmanage/Sms/sms_send_pos_api/', data).then(res => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg)
          this.checksms()
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // this.$axios.post('/s?datatype=send_sms', data).then(res => {
      //   if (res.data.code == 1) {
      //     this.$message.success(res.data.msg)
      //     this.checksms()
      //   } else {
      //     this.$message.error(res.data.msg)
      //   }
      // })
    },
    choosMember (row) {
      // console.log(row)
      if (!this.check.includes(row.member_id)) {
        this.check.push(row.member_id)
      } else {
        this.check = this.check.filter(v => v != row.member_id)
      }
    },
    submitchoose () {
      this.checklist = this.tableData.filter(item => this.check.includes(item.member_id))
      this.memberView = false
    },
    async getList () {
      const res = await this.$axios.get('/api?datatype=get_memberlist', {
        params: {
          storeid: this.storeid,
          sign: 2,
          datetype: this.datetype,
          search: this.keyword
        }
      })
      // console.log(res)
      if (res.data.code == 1) {
        this.tableData = res.data.data
        this.check = this.checklist.map(v => v.member_id)
      }
    },
    checksms () {
      this.$axios.get('/api?datatype=get_store_smscount', {
        params: {
          storeid: this.storeid
        }
      }).then(res => {
        if (res.data.code == 1) {
          this.count = Number(res.data.data)
        }
      })
    }
  },
  created () {
    this.checksms()
  }

}
</script>

<style lang="scss">
.smsDialog {
  height: 80%;
  &.el-dialog .el-dialog__body {
    height: calc(100% - 125px);
  }
  .searchResView {
    height: 100%;
  }
  .seleted {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
  }
  .active {
    background-color: rgb(133, 206, 97);
  }
}
.listDialog {
  padding: 10px;
  height: 80%;
  &.el-dialog .el-dialog__body {
    height: calc(100% - 60px);
  }
  .templist {
    height: calc(100% - 60px);
    overflow: auto;
    .titem {
      margin: 10px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 6px;
    }
    .active {
      border: 3px solid rgb(133, 206, 97);
    }
  }
}
</style>
<style lang="scss" scoped>
.topSearchView {
  width: 450px;
}
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
        // height: 100px;
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
