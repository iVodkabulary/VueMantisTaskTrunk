<template>
  <div>
    <!-- <button @click="load" v-if="!loaded">load</button> -->
    <areas v-if="chartType == 'area'" :chartInfo="Setting"></areas>
    <bubble v-if="chartType == 'bubble'" :chartInfo="Setting"></bubble>
    <funnel v-if="chartType == 'funnel'" :chartInfo="Setting"></funnel>
    <gauge v-if="chartType == 'gauge'" :chartInfo="Setting"></gauge>
    <general v-if="chartType == 'general'" :chartInfo="Setting"></general>
    <lines v-if="chartType == 'line'" :chartInfo="Setting"></lines>
    <pie v-if="chartType == 'pie'" :chartInfo="Setting"></pie>
    <waterfall v-if="chartType == 'waterfall'" :chartInfo="Setting"></waterfall>
    <column v-if="chartType == 'column'" :chartInfo="Setting"></column>
  </div>
</template>

<script>
import Vue from 'vue'
import areas from './area'
import bubble from './bubble'
import column from './column'
import funnel from './funnel'
import gauge from './gauge'
import general from './general'
import lines from './lines'
import pie from './pie'
import waterfall from './waterfall'
// loadFunnel(Highcharts);

Vue.component('areas', areas)
Vue.component('bubble', bubble)
Vue.component('column', column)
Vue.component('funnel', funnel)
Vue.component('gauge', gauge)
Vue.component('general', general)
Vue.component('lines', lines)
Vue.component('pie', pie)
Vue.component('waterfall', waterfall)

export default{
  props: ['Setting'],
  data: function(){
    return{
      // chartType: 'column',
      chartType: 'column',
      Status: true,
    };
  },
  methods: {

  },
  created() {
    // console.log(this.Setting.chartData.categories)
    this.chartType = (typeof this.Setting['Chart'] == 'string') ? this.Setting['Chart'].toLowerCase() : 'column';
    // if(this.chartType != 'pie'){
    //   var cate = this.$Lodash.cloneDeep(this.Setting.chartData.categories)
    //   this.Setting.chartData.categories = [];
    //   if(cate && cate.length){
    //     cate.forEach(item => {
    //       this.Setting.chartData.categories.push(item.name);
    //     })
    //   }
    // }
    if (this.chartType == 'general') {
      $.each(this.Setting['chartData'], (c, chart) => {
        if(this.$Utils.isEmpty(this.Setting['chartData'][c]['chartData']['categories'][0], 'name')){
          var cate = this.$Lodash.cloneDeep(this.Setting['chartData'][c]['chartData']['categories'])
          this.Setting['chartData'][c]['chartData']['categories'] = [];
          if(cate && cate.length){
            cate.forEach(item => {
              this.Setting['chartData'][c]['chartData']['categories'].push(item.name);
            })
          }
        }
        $.each(chart.chartData.series, (s, series) => {
          var afterDecimal = 0;
          if (series.setting.FormatValue) {
            afterDecimal = series.setting.FormatValue.substring(series.setting.FormatValue.indexOf('.') + 1, series.setting.FormatValue.indexOf('f'));
            afterDecimal = afterDecimal == '' ? 0 : afterDecimal;
            if (series.setting.FormatValue == "Triệu" || series.setting.FormatValue == "Tỷ") {
              series.name += " (" + series.setting.FormatValue + ")";
              $.each(series.data, (item, value) => {
                series.data[item] = series.setting.FormatValue == "Triệu" ? value / 1000000 : value / 1000000000;
              })
              afterDecimal = 2;
            }
          }
          var multiple = Math.pow(10, afterDecimal);
          $.each(series.data, (key, val) => {
            series.data[key] = Math.round(val * multiple) / multiple;
          });
          this.Setting['chartData'][c]['chartData']['series'][s]['data'] = series.data;
        });
      });
    }
  }
}
</script>