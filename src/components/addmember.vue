<template>
  <div id="addpro">
    <div class="topView">
      <button class="btn-back" @click="back"></button>
      <div class="tView">{{choose?'员工资料':'添加'}}</div>
      <button class="btn-audio btn-shopCart" @click="submit">保存</button>
    </div>
    <div class="contentView">
      <div class="listView">
        <div class="item">
          <div class="left">员工头像（选填）</div>
          <div class="right">
            <div class="imgView">
              <img :src="'https://hb.rgoo.com'+avatar" alt />
              <span @click="openCropper">点击上传</span>
            </div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <div class="left">
            编号
            <span class="xing">*</span>
          </div>
          <div class="right">
            <div v-show="choose" style="font-size:14px;color:#000">{{jobNo}}</div>
            <input type="text" placeholder="请输入" v-model="jobNo" v-show="!choose" />
          </div>
        </div>
        <div class="item">
          <div class="left">
            姓名
            <span class="xing">*</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="name" />
          </div>
        </div>
        <div class="item" @click="sexDialog=true">
          <div class="left">
            性别
            <span class="xing">*</span>
          </div>
          <div class="right">{{sex}}</div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="性别"
          :visible.sync="sexDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div class="listItem" :class="{select:sex=='男'}" @click="sex='男';sexDialog=false">男</div>
            <div class="listItem" :class="{select:sex=='女'}" @click="sex='女';sexDialog=false">女</div>
          </div>
        </el-dialog>
        <div class="item">
          <div class="left">
            手机号
            <span class="xing">*</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="mobile" />
          </div>
        </div>
        <div class="item" @click="sectionDialog=true">
          <div class="left">部门</div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="section" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="部门"
          :visible.sync="sectionDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              :class="{select:section=='销售部'}"
              @click="section='销售部';sectionDialog=false"
            >销售部</div>
            <div
              class="listItem"
              :class="{select:section=='管理部'}"
              @click="section='管理部';sectionDialog=false"
            >管理部</div>
            <div
              class="listItem"
              :class="{select:section=='美容组'}"
              @click="section='美容组';sectionDialog=false"
            >美容组</div>
            <div
              class="listItem"
              :class="{select:section=='按摩组'}"
              @click="section='按摩组';sectionDialog=false"
            >按摩组</div>
            <div
              class="listItem"
              :class="{select:section=='足疗组'}"
              @click="section='足疗组';sectionDialog=false"
            >足疗组</div>
          </div>
        </el-dialog>
        <div class="item" @click="serviceJobDialog=true">
          <div class="left">
            服务职称
            <span class="xing">*</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="serviceJob" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="服务职称"
          :visible.sync="serviceJobDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              :class="{select:serviceJob=='学徒'}"
              @click="serviceJob='学徒';serviceJobDialog=false"
            >学徒</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='初级美容师'}"
              @click="serviceJob='初级美容师';serviceJobDialog=false"
            >初级美容师</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='助理'}"
              @click="serviceJob='助理';serviceJobDialog=false"
            >助理</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='美容师'}"
              @click="serviceJob='美容师';serviceJobDialog=false"
            >美容师</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='店长'}"
              @click="serviceJob='店长';serviceJobDialog=false"
            >店长</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='经理'}"
              @click="serviceJob='经理';serviceJobDialog=false"
            >经理</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='按摩师'}"
              @click="serviceJob='按摩师';serviceJobDialog=false"
            >按摩师</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='美体师'}"
              @click="serviceJob='美体师';serviceJobDialog=false"
            >美体师</div>
            <div
              class="listItem"
              :class="{select:serviceJob=='顾问'}"
              @click="serviceJob='顾问';serviceJobDialog=false"
            >顾问</div>
          </div>
        </el-dialog>
        <div class="item" @click="jobDialog=true">
          <div class="left">
            职位
            <span class="xing">*</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="job" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="职位"
          :visible.sync="jobDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              :class="{select:job=='美容师'}"
              @click="job='美容师';jobDialog=false"
            >美容师</div>
            <div
              class="listItem"
              :class="{select:job=='收银人员'}"
              @click="job='收银人员';jobDialog=false"
            >收银人员</div>
            <div
              class="listItem"
              :class="{select:job=='按摩师'}"
              @click="job='按摩师';jobDialog=false"
            >按摩师</div>
            <div
              class="listItem"
              :class="{select:job=='足疗师'}"
              @click="job='足疗师';jobDialog=false"
            >足疗师</div>
            <div
              class="listItem"
              :class="{select:job=='美容经理'}"
              @click="job='美容经理';jobDialog=false"
            >美容经理</div>
            <div class="listItem" :class="{select:job=='店长'}" @click="job='店长';jobDialog=false">店长</div>
            <div
              class="listItem"
              :class="{select:job=='管理人员'}"
              @click="job='管理人员';jobDialog=false"
            >管理人员</div>
            <div
              class="listItem"
              :class="{select:job=='清洁工'}"
              @click="job='清洁工';jobDialog=false"
            >清洁工</div>
          </div>
        </el-dialog>
        <div class="item" @click="nowStatusDialog=true">
          <div class="left">
            目前状态
            <span class="xing">*</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请选择" v-model="nowStatus" readonly />
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-dialog
          title="目前状态"
          :visible.sync="nowStatusDialog"
          width="30%"
          center
          :append-to-body="true"
          custom-class="dialog"
        >
          <div class="contentView" style="max-height: 720px;">
            <div
              class="listItem"
              :class="{select:nowStatus=='在职'}"
              @click="nowStatus='在职';nowStatusDialog=false"
            >在职</div>
            <div
              class="listItem"
              :class="{select:nowStatus=='未在职'}"
              @click="nowStatus='未在职';nowStatusDialog=false"
            >未在职</div>
            <div
              class="listItem"
              :class="{select:nowStatus=='离职'}"
              @click="nowStatus='离职';nowStatusDialog=false"
            >离职</div>
          </div>
        </el-dialog>
        <div class="item">
          <div class="left">
            预约状态
            <span class="xing">*</span>
          </div>
          <div class="right">
            <el-switch v-model="yyStatus" active-color="#13ce66"></el-switch>
          </div>
        </div>
        <div class="item">
          <div class="left">登陆账号（非必填）</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="username" @input="change" />
          </div>
        </div>
        <div class="item">
          <div class="left">登陆密码（非必填）</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="password" />
          </div>
        </div>
        <div class="item">
          <div class="left">备注</div>
          <div class="right">
            <input type="text" placeholder="请输入" v-model="remark" />
          </div>
        </div>
      </div>
    </div>
    <!-- 图片上传 -->
    <xcropper ref="cropper"></xcropper>
  </div>
</template>

<script>
import xcropper from '@/components/xcropper.vue'
export default {
  components: { xcropper },
  props: ['choose'],
  data () {
    return {
      avatar: '',
      id: 0,
      type: 1,
      background: '',
      jobNo: '',
      name: '',
      sex: '男',
      mobile: '',
      section: '',
      serviceJob: '',
      job: '',
      nowStatus: '在职',
      yyStatus: true,
      username: '',
      password: '',
      remark: '',
      sexDialog: false,
      sectionDialog: false,
      serviceJobDialog: false,
      jobDialog: false,
      nowStatusDialog: false,
      storeid: sessionStorage.getItem('storeid'),
    }
  },
  watch: {},
  computed: {},
  methods: {
    back () {
      this.$emit('close')
    },
    change () {
      this.username = this.username.toLowerCase()
    },
    // 打开上传图片
    openCropper () {
      let option = {
        title: '员工头像',
        msg: '建议图片大小：2M'
      };
      this.$refs.cropper.open(option, (data) => {
        // console.log(data)
        this.avatar = data
      })
    },
    async submit () {
      if (!this.jobNo) return this.$message.error('请输入编号')
      if (!this.name) return this.$message.error('请输入姓名')
      if (!this.mobile) return this.$message.error('请输入手机号')
      if (!(/^1[3456789]\d{9}$/.test(this.mobile))) return this.$message.error('手机号不正确')
      // if (!this.section) return this.$message.error('请选择部门')
      if (!this.serviceJob) return this.$message.error('请选择服务职称')
      if (!this.job) return this.$message.error('请选择职位')
      let nowStatus = ''
      if (this.nowStatus == '在职') {
        nowStatus = 1
      } else if (this.nowStatus == '未在职') {
        nowStatus = 2
      } else {
        nowStatus = 3
      }
      const params = {
        storeid: this.storeid,
        id: this.id,
        type: this.type,
        avatar: this.avatar,
        job_no: this.jobNo,
        name: this.name,
        sex: this.sex == '男' ? '1' : '2',
        mobile: this.mobile,
        section: this.section,
        service_job: this.serviceJob,
        job: this.job,
        now_status: nowStatus,
        yy_status: this.yyStatus ? '1' : '0',
        username: this.username,
        password: this.password,
        remark: this.remark
      }

      const res = await this.$axios.get('/api?datatype=insert_staff', {
        params
      })

      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        this.back()
      } else {
        this.$message.error(res.data.msg)
      }
    }
  },
  created () {
    // console.log(this.choose)
    if (this.choose) {
      this.id = this.choose.id
      this.avatar = this.choose.avatar
      this.type = 2
      this.jobNo = this.choose.job_no
      this.name = this.choose.name
      this.sex = this.choose.sex == '1' ? '男' : '女'
      this.mobile = this.choose.mobile
      this.section = this.choose.section
      this.serviceJob = this.choose.service_job
      this.job = this.choose.job
      this.nowStatus = this.choose.now_status == 1 ? '在职' : this.choose.now_status == 2 ? '未在职' : '离职'
      this.yyStatus = this.choose.yy_status == 1 ? true : false
      this.username = this.choose.username
      this.password = this.choose.password
      this.remark = this.choose.remark
    }
  },
  mounted () { }
}
</script>

<style  lang="scss">
.dialog .contentView {
  border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  padding: 10px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  .listItem {
    font-size: 15px;
    font-family: PingFangSC-Medium;
    color: #28282d;
    padding: 15px 0;
    line-height: 20px;
  }
  .listItem.select {
    background: #fff
      url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_R_Green.png)
      right center / 28px no-repeat;
  }
}
</style>
<style lang="scss" scoped>
#addpro {
  height: 100%;
  .topView {
    width: 100%;
    display: flex;
    padding: 35px 20px 10px 20px;
    border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
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
    }
    button.btn-shopCart {
      height: 40px;
      position: relative;
      font-size: 20px;
      color: #dc670b;
    }
  }
  .contentView {
    position: relative;
    padding: 25px 30px 50px 30px;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 85px);
    .listView {
      // height: 100%;
      padding: 0 15px;
      background: #f8f8f8;
      border-radius: 6px;
      .item {
        display: flex;
        border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
        padding: 17px 25px 17px 0;
        line-height: 20px;
        position: relative;
        .right {
          flex: 1;
          text-align: right;
          .imgView {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
            background: url('https://hb.rgoo.com/upload/shop/moren.jpg')
              no-repeat center center;
            background-size: 100% 100%;
            img {
              width: 100%;
            }
            span {
              position: absolute;
              width: 100%;
              right: 0;
              width: 80px;
              height: 80px;
              line-height: 80px;
              text-align: center;
              color: #fff;
              background-color: rgba(0, 0, 0, 0.5);
              display: none;
            }
            &:hover span {
              display: inline-block;
            }
          }
          input {
            line-height: 28px;
            text-align: right;
            background: transparent;
            padding: 0;
            font-size: 14px;
            color: #28282d;
            outline: none;
            border: none;
          }
        }
        i {
          position: absolute;
          font-size: 18px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
