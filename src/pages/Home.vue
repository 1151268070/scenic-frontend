<template>
  <div>
    <h3>数据统计 5-14</h3>
    <Row class="statisticsClass">
      <i-col span="6">
        <p class="title-top">今天销售</p>
        <p class="title-bootom">0</p>
      </i-col>
      <i-col span="6">
        <p class="title-top">今天毛利</p>
        <p class="title-bootom">0</p>
      </i-col>
    </Row>
    <div class="echartsClass">
      <h3>金额统计</h3>
      <v-chart ref="domEcharts" :options="chartData"/>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import ECharts from "vue-echarts";
  import "echarts/lib/chart/line";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/legend";

  export default {
    name: "Home",
    components: {
      "v-chart": ECharts
    },
    data() {
      return {
        chartData: {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: {
            data: ["销售额"]
          },
          grid: {
            left: "3%",
            right: "3%",
            top: "5%",
            containLabel: true
          },
          yAxis: {
            type: "value"
          },
          xAxis: {
            data: [],
            type: "category",
            boundaryGap: false
          },
          series: [
            {
              name: "销售额",
              data: [],
              type: "line",
              areaStyle: {}
            }
          ]
        }
      };
    },
    methods: {},
    mounted() {
      Vue.axios.get("/js/chartData.json")
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.chartData.xAxis.data = res.data.data.xaxis;
            this.chartData.series[0].data = res.data.data.inStorageAmounts;
            this.$refs.domEcharts.resize();
          }
        });
      this.$nextTick(() => {
        window.onresize = () => {
          this.$refs.domEcharts.resize();
        };
      });
    }
  };
</script>
<style scoped lang="scss">
  .echartsClass {
    margin-top: 25px;
  }

  .echarts {
    width: 100% !important;
  }

  .ivu-row {
    margin: 15px 0;
  }

  .statisticsClass {
    p {
      color: white;
      font-weight: bold;
    }

    .title-top {
      margin: 4px 0;
      font-size: 14px;
    }

    .title-bootom {
      font-size: 28px;
    }

    .ivu-col-span-6 {
      margin-right: 20px;
      padding: 15px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }

    .ivu-col-span-6:nth-of-type(1) {
      background-color: #725EFF;
    }

    .ivu-col-span-6:nth-of-type(2) {
      background-color: #EA5351;
    }
  }

  .todoClass {
    .title-top {
      font-size: 12px;
      margin: 10px 0 -7px 0;
    }

    .title-bootom {
      font-size: 25px;
    }

    .ivu-col-span-6 {
      display: flex;
    }

    .left {
      width: 65px;
    }

    .right {
      flex: 1;
    }

    .icon {
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border-radius: 100%;
      background-color: #EDF5FF;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
  }
</style>
