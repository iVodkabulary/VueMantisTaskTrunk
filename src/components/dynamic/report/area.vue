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
        if (this.labelitalic == 1) {
          this.xAx.labels = {
            groupedOptions: [{
              rotation: 0 // rotate labels for a 2nd-level
              // align: 'right'
            }],
            rotation: -45, // rotate labels for a 2nd-level
            align: 'right' // 0-level options aren't changed, use them as always

          };
        }

        this.chartConfig = {
            chart: {
              renderTo: "chart",
              type: 'area',
              height: 550
            },
            title: {
              text: this.chartInfo.Caption ? this.chartInfo.Caption : 'Báo cáo thống kê'
            },
            xAxis: {
              categories: this.chartInfo.chartData.categories
            },
            yAxis: {title: {text: ''}},
            tooltip: {
              shared: true
//                                valueSuffix: ' millions'
            },
            plotOptions: {
              area: {
                stacking: 'normal',
                lineColor: '#fff',
                lineWidth: 1,
                marker: {
                  lineWidth: 1,
                  lineColor: '#fff'
                }
              },
              series: {
                cursor: 'pointer',
                point: {
                  // events: {
                  //     click: clickCallback()
                  // }
                }
              }
            },
            credits: {
              enabled: false
            },
            legend: {
              y: -10,
              align: 'center',
              verticalAlign: 'bottom',
              borderWidth: 0
            },
          series: this.chartInfo.chartData.series
        };
      }

 }
 </script>
 
  <style lang="scss">
  
  </style>