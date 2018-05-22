<template>
 <div><vue-highcharts :Highcharts="Highcharts" :options="chartConfig" ref="lineCharts"></vue-highcharts></div>   
 </template>

 <script>
  import Vue from 'vue'
  import VueHighcharts from 'vue2-highcharts'
  import Highcharts from 'highcharts';
  import highchartsFunnel from 'highcharts/modules/funnel';

  highchartsFunnel(Highcharts);
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
      methods: {
        generateSeriesNames() {
          var chart = this,
            series = this.series,
            numberOfSeries = series  ? series.length : 0,
            xPixelFirst,
            yPixelFirst;

          if (arrayOfSeriesLabels && arrayOfSeriesLabels.length > 0) {
            arrayOfSeriesLabels.forEach((element, index) => {
              if (element.line) {
                element.line.destroy();
              }
              element.text.destroy();
            });
            arrayOfSeriesLabels = [];
          }

          for (var i = 0; i < numberOfSeries; i++) {
            var seriesName = series[i].name,
              firstPoint = series[i].points[0],
              yPathOffset = (chart.plotTop / 2) - 10,
              yTextOffset = 0,
              lineOffset = 10;

            arrayOfSeriesLabels.push({});

            if (!(i % 2)) {
              yTextOffset = chart.plotTop / 2;
              yPathOffset = 0;
            } else {
              arrayOfSeriesLabels[i].line = chart.renderer.path([
                'M', firstPoint.plotX + lineOffset, chart.plotHeight - lineOffset,
                'L', firstPoint.plotX + lineOffset, chart.plotHeight - yPathOffset - 5
              ])
                .attr({
                  'stroke-width': 1,
                  stroke: 'black',
                  zIndex: 5
                })
                .add();
            }

            arrayOfSeriesLabels[i].text = chart.renderer.text(seriesName, firstPoint.plotX, chart.plotHeight - yTextOffset + lineOffset).css({
              width: '5px',
              'word-wrap': 'break-word',
              fontSize: '10px'
            }).attr({
              width: 10,
              zIndex: 5
            }).add();
          }
        }
      },
      created(){
        var series = [];
        $.each(this.chartInfo.chartData.categories, (key, cat) => {
          var ser = {
            data: [],
            y: 0,
            name: cat,
            center: [(100 / this.chartInfo.chartData.categories.length * key + 50 / this.chartInfo.chartData.categories.length) + '%', '50%']
          };
          $.each(this.chartInfo.chartData.series, (k, s) => {
            ser.data.push({name: s.name, y: s.data[key]});
          });
          series.push(ser);
        });
        series[0].showInLegend = true;
        var height = this.chartInfo.chartData.categories.length > 3 ? 300 / this.chartInfo.chartData.categories.length : 100;
        if (height < 50) {
          height = 50;
        }
        this.chartConfig = {
            chart: {
              type: 'funnel',
              events: {
                load: this.generateSeriesNames,
                redraw: this.generateSeriesNames
              }
            },
            title: {
              text: this.chartInfo.Caption ? this.chartInfo.Caption : ''
            },
            plotOptions: {
              series: {
                dataLabels: {
                  x: -40,
                  distance: 3,
                  padding: 0,
                  rotation: series.length > 5 ? 45 : null,
                  format: (series.length <= 3 ? '<b>{point.name}:</b>' : '') + '{point.y:,.0f}',
                  color: (this.Highcharts.theme && this.Highcharts.theme.contrastTextColor) || 'black',
                  softConnector: true
                },
                width: (this.chartInfo.chartData.categories.length > 3 ? 90 / this.chartInfo.chartData.categories.length : 45) + '%',
                height: height -20 + '%',
                neckWidth: '0%',
                neckHeight: '0%'
              }
            },
            credits: {
              enabled: true
            },
            legend: {
              enabled: false,
              y: -10,
              align: 'center',
              verticalAlign: 'bottom',
              borderWidth: 0
            },
            series: series
        };

        var arrayOfSeriesLabels = [];
      }

 }
 </script>
 
  <style lang="scss">
  
  </style>