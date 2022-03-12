<template>
  <div class="statistics-wrapper">
    <div class="age-wrapper">
      <div ref="ageChart" class="ageChart"></div>
      <span>年龄平均值：{{ ageAvg }}</span>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

export default {
  name: "MyStatistics",
  data() {
    return {
      //年龄统计表
      ageCharts: {},
      ageCount: [0, 0, 0, 0, 0],
      ageSum: 0,
    };
  },
  computed: {
    personList() {
      return this.$store.state.personList;
    },
    ageAvg() {
      return (this.ageSum / this.$store.state.personList.length).toFixed(2);
    },
  },
  watch: {
    personList: {
      handler() {
        this.ageCount = [0, 0, 0, 0, 0];
        //统计年龄总值
        this.ageSum = 0;
        this.personList.forEach((element) => {
          this.ageCount[(element.age - 1) / 20]++;
          this.ageSum += element.age;
        });
        this.ageCharts.setOption({
          series: [
            {
              name: "age",
              type: "bar",
              data: this.ageCount,
            },
          ],
        });
      },
      deep: true,
    },
  },
  mounted() {
    //统计年龄总值
    this.ageSum = 0;
    //更新年龄统计数据
    this.$store.state.personList.forEach((element) => {
      this.ageCount[Math.floor((element.age - 1) / 20)]++;
      this.ageSum += element.age;
    });
    this.ageCharts = echarts.init(this.$refs["ageChart"]);
    this.ageCharts.setOption({
      title: {
        text: "家族成员年龄统计",
        left: "30%",
        textStyle:{
            fontSize: '35'
        }
      },
      grid:{
          top: '20%'
      },
      tooltip: {},
      xAxis: {
        data: ["1~20", "21~40", "41~60", "61~80", "81~100"],
        name: "年龄",
      },
      yAxis: {
        name: "人数",
      },
      series: [
        {
          name: "age",
          type: "bar",
          data: this.ageCount,
        },
      ],
      color: 'rgb(77, 76, 76)',
    });
  },
};
</script>

<style>
.ageChart {
  width: 800px;
  height: 600px;
  margin-top: 120px;
  margin-left: 400px;
}
.age-wrapper span{
    font-size: 3em;
    color: var(--grey);
    margin-left: 600px;
    font-weight: bold;
}
</style>