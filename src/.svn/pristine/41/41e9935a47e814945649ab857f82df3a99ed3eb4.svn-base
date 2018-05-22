<template>
    <div class="source">
      <div class="el-table__body-wrapper grab-bing" v-dragscroll>
        <table>
          <thead>
          <tr>
            <th class="tgWeek default-column" rowspan="2">{{datasrc.TypeName}}</th>
            <th class="default-column" :colspan="datasrc.ListCols['Kế hoạch'].length">Kế hoạch</th>
            <th class="c default-column" rowspan="2"></th>
            <th class="default-column" v-if="datasrc.ListCols['Thực hiện']" :colspan="datasrc.ListCols['Thực hiện'].length">Thực hiện</th>
          </tr>
          <tr>
            <th :class="'default-column cl-'+ item.Name" v-for="item in datasrc.ListCols['Kế hoạch']">{{item.Caption}}</th>
            <th :class="'default-column cl-' + item.Name" v-for="item in datasrc.ListCols['Thực hiện']">{{item.Caption}}</th>
          </tr>
          </thead>
          <tbody v-if="datasrc.cells">
          <tr :class="cell.CellType " v-for="cell in datasrc.cells">
            <td class="default-column" :colspan="cell.CellType =='h' ? 2 : 1">
              <router-link v-if="cell.CellType != 'h'" :to="'/dynamic/view/Index='+ cell.Index"
                 v-on:click="showSetting(item)">{{cell.Index}}</router-link>
              <span v-if="cell.CellType == 'h'">{{cell.Index}}</span>
            </td>
            <td :class="'tg-' + item.Name" v-for="(item, index) in datasrc.ListCols['Kế hoạch']"
                v-if="!(cell.CellType == 'h' && index == 0)">
              <router-link v-if="item.Redirect" :to="'/dynamic/view/Index=' + cell.Index">{{cell[item.DynamicText
                ? item.DynamicText : !item.Expression ? item.Name : item.Expression]}}</router-link>
              <span v-if="item.Format && item.FieldColumnType == 'DateTime'">{{cell[item.DynamicText ? item.DynamicText : !item.Expression ? item.Name : item.Expression] ? $Utils.formatDateTime(cell[item.DynamicText ? item.DynamicText : !item.Expression ? item.Name : item.Expression], (cell.CellType == 'h' ? 'DD/MM/YYYY' : 'HH:mm')) : ''}}</span>
              <span v-if="item.FieldColumnType != 'DateTime' && !item.Redirect">{{cell[item.DynamicText ? item.DynamicText : !item.Expression ? item.Name : item.Expression]}}</span>
            </td>
            <td class="default-column c"></td>
            <td :class="'default-column tg-' + item.Name" v-for="item in datasrc.ListCols['Thực hiện']" >
                <!--:style="{'background-color': item.Name == 'StatusName' ? arrStatusColor[cell.Status] : 'none'} ">-->
              <router-link v-if="item.Redirect" :to="'/dynamic/view/Index=' + cell.Index">{{cell[item.DynamicText
                ? item.DynamicText : !item.Expression ? item.Name : item.Expression]}}</router-link>
              <span v-if="item.Expression == 'SpentTime'" style="white-space: nowrap;">{{convertSpendTime(cell.SpentTime)}}
                          <i v-if="cell.CellType !='h'" class="fa  fa-clock-o fa-lg mt-4"
                             :style="{color: cell.SpentTime < 0 ? 'red' : 'blue'}"></i>
                        </span>
              <el-progress v-if="item.Name == 'Progress' && cell.CellType !='h'" :text-inside="true"
                           :stroke-width="18" :percentage="cell.Progress?parseInt(cell.Progress):0"
                           :status=" cell.Progress!=undefined? (parseInt(cell.Progress) >= 100 ? 'success' : parseInt(cell.Progress) == 0 ? 'exception': '') : 'exception'"></el-progress>
              <span v-if="item.Name == 'Progress' && cell.CellType =='h'">{{cell.Progress}}%</span>
              <span v-if="item.Format && item.FieldColumnType == 'DateTime'">{{$Utils.formatDateTime(cell[item.DynamicText ? item.DynamicText : !item.Expression ? item.Name : item.Expression], 'DD/MM/YYYY HH:mm') }}</span>

              <div :style="(cell.CellType !='h' && cell.Status != undefined && item.Name === 'StatusName') ? 'background-color: ' + $rootScope.arrStatusColor[cell.Status.toUpperCase()] : ''" v-if="item.FieldColumnType != 'DateTime' && !item.Redirect && item.Expression != 'SpentTime' && item.Name != 'Progress'">{{cell[item.DynamicText ? item.DynamicText : !item.Expression ? item.Name : item.Expression]}}</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
 </template>

 <script>
   // import WeekTaskData from "@/temp/WeekTaskData.json"
   import Vue from "vue"
   import vuedragscroll from 'vue-dragscroll'

   Vue.use(vuedragscroll)
   Vue.use(require('vue-moment'));
   export default {
     name: 'WeekTask',
     props: ['datasrc'],
     data() {
       return {};
     },
     methods:{
       convertSpendTime(data) {
         var exp = "";
         if (Math.abs(data) >= 24) {
           exp = parseFloat(eval(data) / 24).toFixed(0) + " ngày";
         } else if (data != 0) {
           exp = data + " giờ";
         } else
           exp = data;
         return exp;
       },
       // getWeekthisYear() {
       //   this.arrWeek = [];
       //   var thisWeek = moment().week();
       //   if(Vue.moment().isoWeekday() >= 5)
       //     thisWeek = thisWeek + 1;
       //   for (var i = thisWeek; i > 0; i--) {
       //     var startWeek = moment(this.thisYear.toString(),"YYYY").add(i, 'weeks').startOf('isoweek').format('DD/MM/YYYY');
       //     var endWeek = moment(this.thisYear.toString(),"YYYY").add(i, 'weeks').endOf('isoweek').format('DD/MM/YYYY');
       //     var arrW = {
       //       name: "Tuần " + i + " (" + startWeek + " - " + endWeek + ")",
       //       value: i
       //     };
       //     this.arrWeek.push(arrW);
       //   }
       //   this.model.WeekNumber = moment().isoWeek();
       //   this.bindObjWeek();
       // },
       // bindObjWeek() {
       //   this.isWeek = 'true';
       //   this.firstDayOfWeek(this.thisYear, this.model.WeekNumber, true)
       // },
       // firstDayOfWeek(year, week, firstTime) {
       //   this.model.PlanStartDateStartValue = new Date(year, 0, 1);
       //   var offset = this.model.PlanStartDateStartValue.getTimezoneOffset();
       //   this.model.PlanStartDateStartValue.setDate(this.model.PlanStartDateStartValue.getDate() + 4 - (this.model.PlanStartDateStartValue.getDay() || 7));
       //   this.model.PlanStartDateStartValue.setTime(this.model.PlanStartDateStartValue.getTime() + 7 * 24 * 60 * 60 * 1000 * (week + (year == this.model.PlanStartDateStartValue.getFullYear() ? -1 : 0)));
       //   this.model.PlanStartDateStartValue.setTime(this.model.PlanStartDateStartValue.getTime() + (this.model.PlanStartDateStartValue.getTimezoneOffset() - offset) * 60 * 1000);
       //   this.model.PlanStartDateStartValue.setDate(this.model.PlanStartDateStartValue.getDate() - 3);
       //   var e = angular.copy(this.model.PlanStartDateStartValue); // adjust when day is sunday
       //   e.setDate(this.model.PlanStartDateStartValue.getDate() - this.model.PlanStartDateStartValue.getDay() + (this.model.PlanStartDateStartValue.getDay() == 0 ? -6 : 1) + 6);
       //   e.setHours(23, 59, 59);
       //   this.model.PlanStartDateEndValue = e;
       //   if(!firstTime)
       //     this.getObject();
       // }
     }

   }
 </script>

  <style>

  </style>
