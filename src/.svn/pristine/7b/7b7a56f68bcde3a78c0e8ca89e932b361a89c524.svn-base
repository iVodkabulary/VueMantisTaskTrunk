<template>
 <div><vue-highcharts :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts></div>   
 </template>

 <script>
 import Vue from 'vue'
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts'
Vue.use(VueHighcharts, {Highcharts});
 export default {
   components: {
      VueHighcharts
    },
    props: ['chartInfo'],
    data() {
      return{
        Highcharts: Highcharts,
        chartConfig: {},
        DisplaySeries: this.$Lodash.cloneDeep(this.chartInfo.chartData.series)
      }
    },
    created() {
      this.DisplaySeries = this.$Lodash.cloneDeep(this.chartInfo.chartData.series)
        this.chartType = this.chartInfo.Chart ? this.chartInfo.Chart : "column";
        this.Highcharts.setOptions({
          lang: {
            thousandsSep: '.',
            decimalPoint: ','
          }
        });
        if (this.labelItalic == 1) {
          this.xAx.labels = {
            groupedOptions: [{
              rotation: 0 // rotate labels for a 2nd-level
              // align: 'right'
            }],
            rotation: -45, // rotate labels for a 2nd-level
            align: 'right' // 0-level options aren't changed, use them as always

          };
        }

        var config = {
            chart: {
              renderTo: "chart",
              type: 'column'
            },
            title: {
              text: this.chartInfo.Caption
            },
            xAxis: {
              categories: this.chartInfo.chartData.categories,
              // labels: {
              //   formatter: () => {
              //     var text = this.value,
              //     formatted = (text && text.length > 25) ? text.substring(0, 25) + '...' : text;
              //     return '<div class="js-ellipse" style="width:150px; overflow:hidden" title="' + text + '">' + formatted + '</div>';
              //   }
              // }
            },
            yAxis: {
              title: {text: ''},
              labels: {
                formatter: () => {
                  var ret,
                    numericSymbols = [' Nghìn', ' Triệu', ' Tỷ'],
                    i = 6;
                  if (this.value >= 1000 || this.value <= -1000) {
                    while (i-- && ret === undefined) {
                      var multi = Math.pow(1000, i + 1);
                      if ((this.value >= multi || this.value <= -multi) && numericSymbols[i] !== null) {
                        ret = (this.value / multi) + numericSymbols[i];
                      }
                    }
                  }
                  return (ret ? ret : this.value);
                }
              }
            },
            plotOptions: {
              column: {
                dataLabels: {
                  enabled: true,
                  format: "{point.y:,.0f}",
                },
                pointPadding: 0.2,
                borderWidth: 0,
                series: {
                  cursor: 'pointer'
                },
                tooltip: {
                  pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>'
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
          series: this.DisplaySeries
        };
        $.each(this.DisplaySeries, (kC, chartSetting) => {
          if (chartSetting.setting && chartSetting.setting.FormatValue && (chartSetting.setting.FormatValue == "Triệu" ||
            chartSetting.setting.FormatValue == "Tỷ")) {
            config.plotOptions.column.tooltip.ySuffix = chartSetting.setting.FormatValue
            chartSetting.name += " (" + chartSetting.setting.FormatValue + ")";
            $.each(chartSetting.data, (item, value) => {
              chartSetting.data[item] = chartSetting.setting.FormatValue == "Triệu" ? value / 1000000 : value / 1000000000;
            })
            config.plotOptions.column.dataLabels.format = "{point.y:,.2f}";
          } else if(chartSetting.setting && chartSetting.setting.FormatValue) {
            config.plotOptions.column.dataLabels.format = chartSetting.setting.FormatValue=="(x).2f" ? "{point.y:,.2f}" 
                                                                  : chartSetting.setting.FormatValue=="(x).1f" ? "{point.y:,.1f}" 
                                                                  : chartSetting.setting.FormatValue=="(x).0f" ? "{point.y:,.0f}" 
                                                                  : config.plotOptions.column.dataLabels.format;
            config.plotOptions.column.tooltip.pointFormat = chartSetting.setting.FormatValue=="(x).2f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.2f}</b><br/>'
                                                                    : chartSetting.setting.FormatValue=="(x).1f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.1f}</b><br/>'
                                                                    : chartSetting.setting.FormatValue=="(x).0f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>'
                                                                    : config.plotOptions.column.tooltip.pointFormat;
          }
        })
        if (this.chartInfo.chartData.categories.length > 20) {
          config.chart.type = 'bar';
          if (this.DisplaySeries.length > 1) {
            config.chart.height = this.DisplaySeries[0].data.length * this.DisplaySeries.length * 20;
          } else {
            config.chart.height = this.chartInfo.chartData.categories.length * 30;
          }
        }
        this.chartConfig = config;
    }
 }
 </script>
 
  <style lang="scss">
  
  </style>