<template>
  <div id="app">
    <div>
      <h1>Analyze Data</h1>
      <div>
        <input type="file" @change="onFileSelected" accept=".txt">
        <button @click="drawChart">Draw Chart</button>
      </div>
    </div>
    <!-- ECharts 容器 -->
    <div ref="echartsContainer" style="width: 100%; height: calc(100vh - 200px);"></div>
    <!-- 展示当前标签长度 -->
    <div>
      <!-- <h2>Labels</h2>
      <ul>
        <li v-for="label in labels" :key="label">{{ label }}</li>
      </ul> -->
      <p>Total Labels: {{ labels.length }}</p>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      labels: [
        'CH-07--GDSP1',
        'CH-07--GDSP0',
        'CH-01--GDCLK1',
        'CH-01--GDCLK0',
        'CH-08--SDOE1',
        'CH-08--SDOE0',
        'CH-04--GDOE1',
        'CH-04--GDOE0',
        'CH-05--SDCLK1',
        'CH-05--SDCLK0',
        'CH-10--SDLE1',
        'CH-10--SDLE0',
        'CH-02--SDSP1',
        'CH-02--SDSP0',
        'CH-13--D01',
        'CH-13--D00'
      ]
    };
  },
  methods: {
    drawChart() {
      const chart = echarts.init(this.$refs.echartsContainer);
      chart.setOption({
        title: {
          text: 'Analyze Data Chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'category',
          data: this.labels,
          axisLabel: {
            fontSize: 12,  // 调整字体大小
            interval: 0,   // 确保每个标签都显示
          },
          splitLine: { show: false } // 关闭 y 轴的分隔线
        },
        grid: {
          left: '80%',   // 控制图表左边距
          right: '80%',  // 控制图表右边距
          top: '10%',    // 控制图表顶部边距
          bottom: '10%', // 控制图表底部边距
          containLabel: true // 防止标签溢出容器
        },
        series: [
          {
            name: 'Step Start',
            type: 'line',
            step: 'start',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Step Middle',
            type: 'line',
            step: 'middle',
            data: [220, 282, 201, 234, 290, 430, 410]
          },
          {
            name: 'Step End',
            type: 'line',
            step: 'end',
            data: [450, 432, 401, 454, 590, 530, 510]
          }
        ]
      });
    }
  },
  mounted() {
    this.drawChart(); // 页面加载时直接绘制图表
  }
};
</script>

<style scoped>
#app {
  text-align: center;
  background-color: #FFC107;
  color: white;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
</style>
