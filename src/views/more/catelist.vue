<template>
  <div class="catelist">
    <div class="topView">
      <button class="el-icon-close btn-audio" @click="back"></button>
      <div class="tView">项目/产品分类列表</div>
      <!-- <button class="btn-audio" style="font-size:18px;color:#dc670b" @click="addcate=true">新增</button> -->
    </div>
    <div style="padding:20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目分类" name="1">
          <el-tag
            v-for="(v,k) in catelist"
            :key="k"
            :closable="v.storeid!=0"
            :type="v.storeid!=0?'success':''"
            @close="submitdel(v.id)"
            :disable-transitions="false"
          >{{v.title}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="newcate"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="submitadd"
            @blur="submitadd"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
        </el-tab-pane>
        <el-tab-pane label="产品分类" name="2">
          <el-tag
            v-for="(v,k) in catelist"
            :key="k"
            :closable="v.storeid!=0"
            :type="v.storeid!=0?'success':''"
            @close="submitdel(v.id)"
            :disable-transitions="false"
          >{{v.title}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="newcate"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="submitadd"
            @blur="submitadd"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <el-dialog
      title="新增分类"
      :visible.sync="addcate"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="400px"
    >
      <div style="padding:20px;display:flex">
        <span style="width:80px">分类所属：</span>
        <el-select v-model="cateid" placeholder="请选择分类所属" style="flex:1">
          <el-option label="项目" value="1"></el-option>
          <el-option label="产品" value="2"></el-option>
        </el-select>
      </div>
      <div style="padding:0 20px 20px 20px;display:flex">
        <span style="width:80px">分类名称：</span>
        <el-input style="flex:1" v-model="newcate"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addcate = false">取 消</el-button>
        <el-button type="primary" @click="addcate = false">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
export default {
  components: {},
  props: {},

  data () {
    return {
      // addcate: false,
      storeid: sessionStorage.getItem('storeid'),
      // cateid: '1',
      activeName: '1',
      catelist: [],
      inputVisible: false,
      newcate: ''
    }
  },
  methods: {
    handleClose (tag) {
      console.log(tag)
      this.submitdel(tag.id)
      this.catelist.splice(this.catelist.indexOf(tag), 1);
    },

    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    back () {
      this.$emit('close')
    },
    handleClick () {
      if (this.activeName == '1') {
        this.getXMcate()
      }
      if (this.activeName == '2') {
        this.getCPcate()
      }
    },
    // 获取项目分类
    async getXMcate () {
      const res = await this.$axios.get('/api?datatype=get_itemcate&storeid=' + this.storeid)
      // console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
    },
    // 获取产品分类
    async getCPcate () {
      const res = await this.$axios.get('/api?datatype=get_goodscate&storeid=' + this.storeid)
      // console.log(res)
      this.catelist = res.data.data
      this.active = res.data.data[0].id
    },
    async submitadd () {
      if (!this.newcate) return this.$message.error('请输入分类名')
      let url
      if (this.activeName == 1) {
        url = '/api?datatype=insert_itemcate'
      } else if (this.activeName == 2) {
        url = '/api?datatype=insert_goodscate'
      }

      const res = await this.$axios.get(url, {
        params: {
          storeid: this.storeid,
          title: this.newcate
        }
      })

      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        // this.addcate = false
        this.inputVisible = false;
        this.inputValue = '';
        if (this.activeName == 1) {
          this.getXMcate()
        } else if (this.activeName == 2) {
          this.getCPcate()
        }
      }
    },
    async submitdel (id) {
      let url
      if (this.activeName == 1) {
        url = '/api?datatype=del_itemcate'
      } else if (this.activeName == 2) {
        url = '/api?datatype=del_goodscate'
      }

      const res = await this.$axios.get(url, {
        params: {
          id: id
        }
      })

      // console.log(res)
      if (res.data.code == 1) {
        this.$message.success(res.data.msg)
        if (this.activeName == 1) {
          this.getXMcate()
        } else if (this.activeName == 2) {
          this.getCPcate()
        }
      }
      if (res.data.code == 2) {
        this.$message.error(res.data.msg)
      }
    },
  },
  created () {
    this.getXMcate()
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.catelist {
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

    .tView {
      flex: 1;
      font-size: 24px;
      color: #28282d;
      font-family: PingFangSC-Semibold;
    }
    .checkbox {
      position: absolute;
      right: 80px;
    }
    button.btn-shopCart {
      width: 40px;
      height: 40px;
      position: relative;
    }
    .btn-filter {
      width: 40px;
      height: 40px;
      background: #fff url(../../assets/images/filter.png) center / 28px
        no-repeat;
    }
  }
  .el-tag {
    margin-right: 10px;
    padding: 0 15px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
