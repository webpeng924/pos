<template>
  <div class="baobiao">
    <div class="topView">
      <button class="btn-back btn-audio" @click="$emit('close')"></button>
      <div class="tView">消费明细</div>
      <el-radio v-model="radio" label="1">表格</el-radio>
      <el-radio v-model="radio" label="2">图表</el-radio>
    </div>
    <el-tabs tab-position="left" style="height:calc(100% - 85px)" v-model="tabs">
      <el-tab-pane label="产品" name="1">
        <div class="contant" v-show="radio=='1'">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </div>
        <div class="contant" v-show="radio=='2'">
          <div id="myChart1" style="width: 600px;height: 600px;"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目" name="2">
        <div class="contant" v-show="radio=='1'">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </div>
        <div class="contant" v-show="radio=='2'">
          <div id="myChart2" style="width: 600px;height: 600px;"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="卡类别售出" name="3">角色管理</el-tab-pane>
      <el-tab-pane label="员工销售额" name="4">定时任务补偿</el-tab-pane>
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
      tableData: [1, 2, 3],
      tabs: '1'
    }
  },
  watch: {},
  computed: {},
  methods: {
    draw (text) {
      let a = 'myChart' + this.tabs
      var myChart = this.$echarts.init(document.getElementById(a));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: text,
          textStyle: {
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: ['当前客户', '客户平均']
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
        xAxis: [{
          type: 'category',
          data: ['销售额（元）', '回款额（元）', '工作时间（小时）', '费率动态（元/小时）']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '当前客户',
          type: 'bar',
          data: [78, 80, 87, 93],
          color: '#CC0066'
        },
        {
          name: '客户平均',
          type: 'bar',
          data: [90, 77, 62, 76],
          color: '#009999'
        }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  created () { },
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
  .contant {
    height: calc(100% - 85px);
    padding: 20px;
  }
}
</style>
