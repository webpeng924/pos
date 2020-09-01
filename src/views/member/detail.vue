<template>
  <div class="member-detail">
    <div class="topView">
      <button class="btn-back" @click="$emit('close')"></button>
      <div class="tView">会员案例图</div>
    </div>
    <div class="contentView">
      <div class="listView">
        <!-- <div class="item">
          <div class="left">会员编号：</div>
          <div class="right">{{info.account}}</div>
        </div>
        <div class="item">
          <div class="left">会员姓名：</div>
          <div class="right">{{info.name}}</div>
        </div>
        <div class="item">
          <div class="left">性 别：</div>
          <div class="right">{{info.sex == 1 ? "男" : "女"}}</div>
        </div>
        <div class="item">
          <div class="left">会员卡号：</div>
          <div class="right">{{info.account}}</div>
        </div>
        <div class="item">
          <div class="left">手机号码：</div>
          <div class="right">{{info.mobile}}</div>
        </div>
        <div class="item">
          <div class="left">会员类型：</div>
          <div class="right">{{info.cardtype}}</div>
        </div>
        <div class="item">
          <div class="left">余 额：</div>
          <div class="right">{{info.balance}}</div>
        </div>-->
        <div class="item">
          <div class="left">案例图片：</div>
          <div class="right">
            <div class="imageRoom">
              <el-image
                v-for="(v,k) in urls"
                :key="k"
                style="width: 150px; height: 150px;"
                :src="v.img|imgUrl"
                fit="scale-down"
                @click="delPic(v)"
              ></el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['info'],
  data () {
    return {
      urls: [],
      storeid: sessionStorage.getItem("storeid"),
      member_id: ''
    };
  },
  methods: {
    async getmemberPic () {
      const res = await this.$axios.get('/api?datatype=get_photo_list', {
        params: {
          storeid: this.storeid,
          member_id: this.member_id
        }
      })
      if (res.data.code == 1) {
        this.urls = res.data.list
        this.$message.success('加载完成')
      } else if (res.data.code == 3) {
        this.urls = []
        this.$message.success('加载完成')
      } else {
        this.urls = []
        this.$message.error('获取失败')
      }
    },
  },
  created () {
    if (this.info) {
      this.member_id = this.info.member_id
      this.getmemberPic()
    }
  },
  mounted () { },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.member-detail {
  height: 100%;
  .topView {
    border-bottom: 1px solid #eee;
    .tView {
      text-align: center;
      width: 100%;
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
      border-radius: 6px;
      .item {
        display: flex;
        border-bottom: 0.5px solid #eee;
        padding: 17px 25px 17px 0;
        line-height: 20px;
        position: relative;
        .left {
          width: 80px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .imageRoom {
    /deep/ .el-image {
      margin: 10px;
      .image-slot {
        text-align: center;
        vertical-align: middle;
        i {
          font-size: 100px;
          color: #ccc;
          line-height: 200px;
        }
      }
    }
  }
}
</style>
