<template>
 <div>
  <vue-highcharts :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts>
  <div class="text-center">
    <span class="series safe">zz</span> <b class="series-text"> An toàn</b>
    <span class="series strike">zz</span> <b class="series-text"> Chú ý</b><br>
    <span class="series warning">zz</span> <b class="series-text"> Cảnh báo</b> 
    <span class="series scolding">zz</span> <b class="series-text"> Nguy hiểm</b>
  </div>
 </div>   
 </template>

 <script>
 import Vue from 'vue'
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';

highchartsMore(Highcharts);
Vue.use(VueHighcharts, {Highcharts});
 export default {
   components: {
      VueHighcharts
    },
    props: ['chartInfo'],
    data(){
      return{
        Highcharts: Highcharts,
      }
    },
    created(){
      var series = this.chartInfo.chartData.series[0].data;
      var data = series[1] * 100 / (series[0] + series[1]);
      data = (data + '' == 'NaN' ? 0 : data);
      this.chartConfig = {
        options: {
          chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
          },

          title: {
            text: this.chartInfo.Caption ? this.chartInfo.Caption : ''
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}"></span> {series.name}: <b>{point.y:.0f}</b><br/>'
          },
          pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
              backgroundColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                },
                stops: [
                  [0, '#FFF'],
                  [1, '#333']
                ]
              },
              borderWidth: 0,
              outerRadius: '109%'
            }, {
              backgroundColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                },
                stops: [
                  [0, '#333'],
                  [1, '#FFF']
                ]
              },
              borderWidth: 1,
              outerRadius: '107%'
            }, {
              // default background
            }, {
              backgroundColor: '#fff',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
            }]
          },
          // the value axis
          yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#007fff',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#007fff',
            labels: {
              step: 2,
              rotation: 'auto'
            },
            title: {
              text: 'Tỉ lệ'
            },
            plotBands: [{
              from: 0,
              to: 25,
              color: '#90ed7d' // green
            }, {
              from: 25,
              to: 50,
              color: '#e4d354' // yellow
            }, {
              from: 50,
              to: 75,
              color: '#f7a35c' // orange
            }, {
              from: 75,
              to: 100,
              color: '#ff0000' // red
            }]
          }
        },
        series: [{
          name: 'Chậm tiến độ',
          data: [Math.round(data)],
          tooltip: {
            valueSuffix: ' %',
            pointFormat: null
          },
          dataLabels: {
            format: '<div style="text-align:center">{point.y:.0f}%<br/>Chậm tiến độ</div>'
          }
        }]
      };
      
    }
 }
 </script>
 
  <style lang="scss">
  
  </style>