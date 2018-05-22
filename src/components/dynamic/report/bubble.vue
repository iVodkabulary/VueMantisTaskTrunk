<template>
 <div><vue-highcharts :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts></div>   
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
        this.chartName = this.chartInfo.Caption ? this.chartInfo.Caption : '';
        var arrData = [];
        $.each(this.chartInfo.chartData.categories, (key, category) => {
          arrData.push({
            x: this.chartInfo.chartData.series[0].data[key],
            y: this.chartInfo.chartData.series[1].data[key],
            z: this.chartInfo.chartData.series[2].data[key],
            name: category
          });
        });
        this.chartConfig = {
          options: {
            chart: {
              type: 'bubble',
              plotBorderWidth: 1,
              zoomType: 'xy'
            },
            legend: {
              enabled: false
            },
            title: {
              text: this.chartInfo.Caption ? this.chartInfo.Caption : 'Báo cáo thống kê'
            },
            xAxis: {
              gridLineWidth: 1,
              title: {
                text: ''
              },
              labels: {
                format: '{value}'
              }
            },
            yAxis: {
              startOnTick: false,
              endOnTick: false,
              title: {
                text: ''
              },
              labels: {
                format: '{value}'
              },
              maxPadding: 0.2
            },
            tooltip: {
              useHTML: true,
              headerFormat: '<table>',
              pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
              '<tr><th>' + this.chartInfo.chartData.series[0].name + ':</th><td>{point.x}</td></tr>' +
              '<tr><th>' + this.chartInfo.chartData.series[1].name + ':</th><td>{point.y}</td></tr>' +
              '<tr><th>' + this.chartInfo.chartData.series[2].name + ':</th><td>{point.z}</td></tr>',
              footerFormat: '</table>',
              followPointer: true
            },
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                  format: '{}'
                }
              }
            },
            series: [{}]
          },
          series: [{
            data: arrData,
            marker: {
              fillColor: {
                radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                stops: [
                  [0, 'rgba(255,255,255,0.5)'],
                  [1, this.Highcharts.Color(this.Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                ]
              }
            }
          }]
        };
      }

 }
 </script>
 
  <style lang="scss">
  
  </style>