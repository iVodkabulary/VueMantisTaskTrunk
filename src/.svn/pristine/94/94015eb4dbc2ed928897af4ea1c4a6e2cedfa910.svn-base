<template>
 <div><vue-highcharts  :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts></div>   
 </template>

 <script>
 import Vue from 'vue'
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';
Vue.use(VueHighcharts, {Highcharts});
 export default {
   components: {
      VueHighcharts
    },
    props: ['chartInfo'],
    data() {
      return{
        Highcharts: Highcharts,
        chartConfig: {}
      }
    },
    created() {
      var arr = [];
      $.each(this.chartInfo.chartData.categories, (key, category) => {
        category = {name: category}
        category['y'] = this.chartInfo.chartData.series[0].data[key];
        arr.push(category);
      });
      if (arr.length == 0) {
        $.each(this.chartInfo.chartData.series, (key, series) => {
          arr.push(series);
        });
      }
      arr.sort(function (s1, s2) {
        return s1.name > s2.name;
      });
      this.chartConfig = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: this.chartInfo.Caption
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: (this.chartInfo.showLabels != false),
              format: '{point.percentage:.1f} %',
              style: {
                color: (this.Highcharts.theme && this.Highcharts.theme.contrastTextColor) || 'black'
              }
            },
            showInLegend: true
          }
        },
        series: [{
          name: this.chartInfo.brand ? this.chartInfo.brand : 'Brands',
          colorByPoint: true,
          data: arr,
          point: {
            events: {
              click: null
            }
          }
        }]
      };
    }
 }
 </script>
 
  <style lang="scss">
  
  </style>