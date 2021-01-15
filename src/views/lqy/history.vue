<template>
  <div class="history">
    <el-table :data="tableData" style="width: 100%" height="100%">
      <el-table-column prop="adddatetime" label="时间" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      storeid: sessionStorage.getItem('storeid'),
      tableData: []
    }
  },
  methods: {
    getlist () {
      this.$axios.get('/api?datatype=get_smslist&storeid=' + this.storeid).then(res => {
        if (res.data.code == 1) {
          this.tableData = res.data.data
        }
      })
    }
  },
  created () {
    this.getlist()
  },
  mounted () { },
  watch: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
</style>
