<template>
  <div class="baobiao">
    <div class="topView">
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
      <div class="tView">消费明细</div>
      <el-radio v-model="radio" label="1">表格</el-radio>
      <el-radio v-model="radio" label="2">图表</el-radio>
    </div>
    <el-tabs tab-position="left" style="height:calc(100% - 85px)" v-model="tabs">
      <el-tab-pane label="项目" name="1">
        <div class="contant" v-show="radio=='1'">
          <el-table :data="tableData" style="width: 80%" border>
            <el-table-column prop="months" label="月份" width="180"></el-table-column>
            <el-table-column prop="month_num" label="销售量" width="180"></el-table-column>
          </el-table>
        </div>
        <div class="contant" v-show="radio=='2'">
          <div id="myChart1"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产品" name="2">
        <div class="contant" v-show="radio=='1'">
          <el-table :data="tableData" style="width: 80%" border>
            <el-table-column prop="months" label="月份" width="180"></el-table-column>
            <el-table-column prop="month_num" label="销售量" width="180"></el-table-column>
          </el-table>
        </div>
        <div class="contant" v-show="radio=='2'">
          <div id="myChart2"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="卡类别售出" name="3">
        <div class="contant" v-show="radio=='1'">
          <el-table :data="tableData" style="width: 80%" border>
            <el-table-column prop="months" label="月份" width="180"></el-table-column>
            <el-table-column prop="month_num" label="销售量" width="180"></el-table-column>
          </el-table>
        </div>
        <div class="contant" v-show="radio=='2'">
          <div id="myChart3"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import echart from "echarts"
export default {
  components: {},
  props: {},
  data () {
    return {
      radio: '1',
      tableData: [],
      tabs: '1',
      storeid: sessionStorage.getItem('storeid'),
      salelist: []
    }
  },
  watch: {
    tabs () {
      let text
      if (this.tabs == 2) {
        text = '产品'
      } else {
        text = '项目'
      }
      this.getData(text)
      // this.draw(text)
    }
  },
  computed: {},
  methods: {
    draw (text) {
      let a = 'myChart' + this.tabs
      var myChart = this.$echarts.init(document.getElementById(a))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: text,
          textStyle: {
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'bold',
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售量']
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              show: true,
              type: ['line', 'bar']
            }
          }
        },
        calculable: true,
        xAxis: [        //X轴数据
          {
            type: 'category',
            boundaryGap: true,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [          //Y轴数据
          { type: 'value' }
        ],
        series: [       //驱动图表数据
          {
            name: '销售量',
            type: 'bar',     //设置 默认显示图表形状 bar
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: this.salelist
          }
        ]
        // series: [{
        //   name: '当前客户',
        //   type: 'bar',
        //   data: [78, 80, 87, 93],
        //   color: '#CC0066'
        // },
        // ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async getData (text) {
      const res = await this.$axios.get('/api?datatype=make_tree_img', {
        params: {
          storeid: this.storeid,
          type: this.tabs
        }
      })
      if (res.data.code == 1 && res.data.data) {
        this.tableData = res.data.data
        this.salelist = []
        for (let i = 1; i < 13; i++) {
          let obj
          if (i < 10) {
            obj = this.tableData.find(item => item.months == '20200' + i)
            if (obj) {
              this.salelist.push(Number(obj.month_num))
            } else {
              this.salelist.push(0)
            }
          } else {
            obj = this.tableData.find(item => item.months == '2020' + i)
            if (obj) {
              this.salelist.push(Number(obj.month_num))
            } else {
              this.salelist.push(0)
            }
          }
        }
        console.log(this.salelist)
        this.draw(text)
      } else {
        this.tableData = []
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.draw('项目')
  }
}
</script>

<style lang="scss" scoped>
.baobiao {
  height: 100%;
  .topView {
    border-bottom: 1px solid #eee;
    .tView {
      flex: 1;
      text-align: center;
    }
    .el-radio {
      line-height: 40px;
    }
  }
  /deep/.el-tabs__content {
    height: 100%;

    .el-tab-pane {
      height: 100%;
    }
  }
  .contant {
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    > div {
      height: 500px;
      width: 600px;
    }
  }
}
</style>
