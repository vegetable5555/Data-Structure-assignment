<template>
  <div class="statistics-wrapper">
    <el-carousel :interval="5000" height="820px">
      <el-carousel-item>
        <div class="age-wrapper">
          <div ref="ageChart" class="ageChart"></div>
          <span>年龄平均值：{{ ageAvg }}</span>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="sex-wrapper">
          <div ref="sexChart" class="sexChart"></div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="height-wrapper">
          <div ref="heightChart" class="heightChart"></div>
          <span>身高平均值：{{ heightAvg }}</span>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="edu-wrapper">
          <div ref="eduChart" class="eduChart"></div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
} from "echarts/components";
import { BarChart, PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  ToolboxComponent,
  PieChart,
  LabelLayout,
]);

export default {
  name: "MyStatistics",
  data() {
    return {
      //年龄统计表
      ageChart: {},
      ageCount: [0, 0, 0, 0, 0],
      ageSum: 0,
      //性别统计表
      sexChart: {},
      sexCount: [0, 0],
      //身高统计表
      heightChart: {},
      heightCount: [0, 0, 0, 0, 0],
      heightSum: 0,
      //学历统计表
      eduChart: {},
      eduCount: [0, 0, 0, 0, 0],
    };
  },
  computed: {
    personList() {
      return this.$store.state.personList;
    },
    ageAvg() {
      return (this.ageSum / this.$store.state.personList.length).toFixed(2);
    },
    heightAvg() {
      return (this.heightSum / this.$store.state.personList.length).toFixed(1);
    },
  },
  // watch: {
  //   personList: {
  //     deep: true,
  //     handler() {
  //       //更新年龄统计表
  //       this.ageCount = [0, 0, 0, 0, 0];
  //       //更新性别统计表
  //       this.sexCount = [0, 0];
  //       //更新身高统计表
  //       this.heightCount = [0, 0, 0, 0, 0];
  //       //更新学历统计表
  //       this.eduCount = [0, 0, 0, 0, 0];
  //       //统计年龄总值
  //       this.ageSum = 0;
  //       //统计身高总值
  //       this.heightSum = 0;
  //       this.personList.forEach((element) => {
  //         this.ageCount[(element.age - 1) / 20]++;
  //         this.ageSum += element.age;
  //         this.sexCount[element.sex === "男" ? 0 : 1]++;
  //         this.heightSum += element.height;
  //         if (element.height < 150) {
  //           this.heightCount[0]++;
  //         } else if (element.height < 160) {
  //           this.heightCount[1]++;
  //         } else if (element.height < 170) {
  //           this.heightCount[2]++;
  //         } else if (element.height < 180) {
  //           this.heightCount[3]++;
  //         } else {
  //           this.heightCount[4]++;
  //         }
  //         if (element.education === "小学") {
  //           this.eduCount[0]++;
  //         } else if (element.education === "初中") {
  //           this.eduCount[1]++;
  //         } else if (element.education === "高中") {
  //           this.eduCount[2]++;
  //         } else if (element.education === "大学") {
  //           this.eduCount[3]++;
  //         } else {
  //           this.eduCount[4]++;
  //         }
  //       });
  //       //年龄表更新参数
  //       this.ageChart.setOption({
  //         series: [
  //           {
  //             name: "age",
  //             type: "bar",
  //             data: this.ageCount,
  //           },
  //         ],
  //       });
  //       //性别表设置参数
  //       this.sexChart.setOption({
  //         series: {
  //           data: [
  //             { value: this.sexCount[0], name: "男" },
  //             { value: this.sexCount[1], name: "女" },
  //           ],
  //         },
  //       });
  //       //身高表设置参数
  //       this.heightChart.setOption({
  //         series: {
  //           data: [
  //             { value: this.heightCount[0], name: "<150" },
  //             { value: this.heightCount[1], name: "150~159" },
  //             { value: this.heightCount[2], name: "160~169" },
  //             { value: this.heightCount[3], name: "170~179" },
  //             { value: this.heightCount[4], name: ">179" },
  //           ],
  //         },
  //       });
  //       //学历表设置参数
  //       this.eduChart.setOption({
  //         series: {
  //           data: [
  //             { value: this.eduCount[0], name: "小学" },
  //             { value: this.eduCount[1], name: "初中" },
  //             { value: this.eduCount[2], name: "高中" },
  //             { value: this.eduCount[3], name: "大学" },
  //             { value: this.eduCount[4], name: "无" },
  //           ],
  //         },
  //       });
  //     },
  //   },
  // },
  mounted() {
    //更新统计数据
    this.$store.state.personList.forEach((element) => {
      this.ageCount[Math.floor((element.age - 1) / 20)]++;
      this.ageSum += element.age;
      this.sexCount[element.sex === "男" ? 0 : 1]++;
      this.heightSum += element.height;
      if (element.height < 150) {
        this.heightCount[0]++;
      } else if (element.height < 160) {
        this.heightCount[1]++;
      } else if (element.height < 170) {
        this.heightCount[2]++;
      } else if (element.height < 180) {
        this.heightCount[3]++;
      } else {
        this.heightCount[4]++;
      }
      if (element.education === "小学") {
        this.eduCount[0]++;
      } else if (element.education === "初中") {
        this.eduCount[1]++;
      } else if (element.education === "高中") {
        this.eduCount[2]++;
      } else if (element.education === "大学") {
        this.eduCount[3]++;
      } else {
        this.eduCount[4]++;
      }
    });
    this.ageChart = echarts.init(this.$refs["ageChart"]);
    this.sexChart = echarts.init(this.$refs["sexChart"]);
    this.heightChart = echarts.init(this.$refs["heightChart"]);
    this.eduChart = echarts.init(this.$refs["eduChart"]);
    this.ageChart.setOption({
      title: {
        text: "家族成员年龄统计",
        left: "30%",
        textStyle: {
          fontSize: "35",
        },
      },
      grid: {
        top: "20%",
      },
      tooltip: {
        padding: 10,
      },
      xAxis: {
        data: ["1~20", "21~40", "41~60", "61~80", "81~100"],
        name: "年龄",
        nameTextStyle: {
          fontSize: "20",
        },
      },
      yAxis: {
        name: "人数",
        nameTextStyle: {
          fontSize: "20",
        },
      },
      series: [
        {
          name: "Age",
          type: "bar",
          data: this.ageCount,
        },
      ],
    });
    this.sexChart.setOption({
      title: {
        text: "家族男女比例",
        left: "center",
        textStyle: {
          fontSize: "35",
        },
      },
      tooltip: {},
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          fontSize: "25",
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "Sex",
          type: "pie",
          radius: "70%",
          label: {
            formatter: "{b}  {d}%",
            fontSize: "30",
            fontWeight: "bold",
          },
          data: [
            { value: this.sexCount[0], name: "男" },
            { value: this.sexCount[1], name: "女" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
      color: ["rgb(125, 156, 240)", "rgb(228, 112, 112)"],
    });
    this.heightChart.setOption({
      title: {
        text: "家族身高分布",
        left: "center",
        textStyle: {
          fontSize: "35",
        },
      },
      tooltip: {},
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          fontSize: "20",
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "Height",
          type: "pie",
          radius: "70%",
          center: ["50%", "60%"],
          label: {
            formatter: "{b}  {d}%",
            fontSize: "15",
            fontWeight: "bold",
            width: "300",
          },
          data: [
            { value: this.heightCount[0], name: "<150" },
            { value: this.heightCount[1], name: "150~159" },
            { value: this.heightCount[2], name: "160~169" },
            { value: this.heightCount[3], name: "170~179" },
            { value: this.heightCount[4], name: ">179" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
    this.eduChart.setOption({
      title: {
        text: "家族学历情况统计",
        left: "center",
        textStyle: {
          fontSize: "35",
        },
      },
      tooltip: {},
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          fontSize: "20",
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "Education",
          type: "pie",
          radius: "70%",
          center: ["50%", "60%"],
          label: {
            formatter: "{b}  {d}%",
            fontSize: "15",
            fontWeight: "bold",
            width: "300",
          },
          data: [
            { value: this.eduCount[0], name: "小学" },
            { value: this.eduCount[1], name: "初中" },
            { value: this.eduCount[2], name: "高中" },
            { value: this.eduCount[3], name: "大学" },
            { value: this.eduCount[4], name: "无" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  },
};
</script>

<style>
.age-wrapper,
.sex-wrapper,
.height-wrapper,
.edu-wrapper {
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ageChart,
.sexChart,
.heightChart,
.eduChart {
  width: 800px;
  height: 600px;
  margin-top: 120px;
}
.age-wrapper span,
.height-wrapper span {
  display: block;
  font-size: 3em;
  color: var(--grey);
  font-weight: bold;
}

.el-carousel__indicators{
  background-color: rgba(77,77,77,.25)
}

.el-carousel__indicators:hover{
  background-color: rgba(77,77,77,.5)
}

.el-carousel__arrow{
  font-size: 2em;
  width: 70px;
  height: 70px;
}
</style>