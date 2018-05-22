<template>
  <div><vue-highcharts :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts></div>
</template>
<script>
  import Vue from 'vue'
  import VueHighcharts from 'vue2-highcharts'
  import Highcharts from 'highcharts';
  export default {
    components: {
      VueHighcharts
    },
    props: ['chartInfo'],
    data() {
      return {
        Highcharts: Highcharts,
        DisplaySeries: this.$Lodash.cloneDeep(this.chartInfo.chartData.series),
        chartName: this.chartInfo.Caption ? this.chartInfo.Caption : this.$defaultUndefined
      }
    },
    created() {
      this.DisplaySeries = this.$Lodash.cloneDeep(this.chartInfo.chartData.series)
      this.chartName = this.chartInfo.Caption ? this.chartInfo.Caption : this.$defaultUndefined;
      this.Highcharts.setOptions({
        lang: {
          thousandsSep: '.',
          decimalPoint: ','
        }
      });
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
          polar: this.chartInfo.polar == true,
          type: 'line'
        },
        title: {
          text: this.chartInfo.Caption ? this.chartInfo.Caption : 'Báo cáo thống kê'
        },
        xAxis: {
          categories: this.chartInfo.chartData.categories,
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: {
          title: { text: '' },
          lineWidth: 0,
          min: this.chartInfo.yMin,
          max: this.chartInfo.yMax,
          labels: {
            formatter: function () {
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
          line: {
            dataLabels: {
              enabled: true,
              format: '{point.y:,.2f}'
            },
            pointPadding: 0.2,
            borderWidth: 0,
            tooltip: {
              pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'
            }
          },
          series: {
            cursor: 'pointer'
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
          this.chartConfig.plotOptions.line.tooltip.ySuffix = chartSetting.setting.FormatValue
          chartSetting.name += " (" + chartSetting.setting.FormatValue + ")";
          $.each(chartSetting.data, (item, value) => {
            chartSetting.data[item] = chartSetting.setting.FormatValue == "Triệu" ? value / 1000000 : value / 1000000000;
          })
          this.chartConfig.plotOptions.line.dataLabels.format = "{point.y:,.2f}";
        } else if (chartSetting.setting && chartSetting.setting.FormatValue) {
          this.chartConfig.plotOptions.line.dataLabels.format = chartSetting.setting.FormatValue == "(x).2f" ? "{point.y:,.2f}"
            : chartSetting.setting.FormatValue == "(x).1f" ? "{point.y:,.1f}"
              : chartSetting.setting.FormatValue == "(x).0f" ? "{point.y:,.0f}"
                : this.chartConfig.plotOptions.line.dataLabels.format;
          this.chartConfig.plotOptions.line.tooltip.pointFormat = chartSetting.setting.FormatValue == "(x).2f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.2f}</b><br/>'
            : chartSetting.setting.FormatValue == "(x).1f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.1f}</b><br/>'
              : chartSetting.setting.FormatValue == "(x).0f" ? '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}</b><br/>'
                : this.chartConfig.plotOptions.line.tooltip.pointFormat;
        }
      })
    }
  }
</script>
<style lang="scss">

</style>
