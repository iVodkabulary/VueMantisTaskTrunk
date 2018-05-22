<template>
  <div>
    <el-header v-if="itemSetting.ElementType === 'Header'">{{itemSetting.Caption}}</el-header>
    <label v-else-if="itemSetting.ElementType === 'Label'" :placeholder="itemSetting.Caption" size="mini">{{mName}}</label>
    <el-input :clearable="clearable" v-else-if="itemSetting.ElementType === 'Text' && itemSetting.FieldColumnType !== 'DateTime'" v-model="mName" :placeholder="itemSetting.Caption" size="mini" ></el-input>
    <el-select :clearable="clearable" v-else-if="itemSetting.ElementType === 'Multi'" v-model="mName" multiple collapse-tags :placeholder="itemSetting.PlaceHolder ? itemSetting.PlaceHolder : itemSetting.Caption" size="mini" filterable>
      <el-option v-for="option in itemSetting.Data" :key="option[itemSetting.SavedKey]" :label="option[itemSetting.SavedText]" :value="option[itemSetting.SavedKey]"></el-option>
    </el-select>
    <el-date-picker :clearable="clearable" v-model="mName" :format="dateTimeFormat"
                    v-else-if="itemSetting.FieldColumnType === 'DateTime' && itemSetting.DateMode === 'range'"
                    type="daterange"
                    :popper-class="$isMobileDevice ? 'MobileDateRange': ''"
                    start-placeholder="Từ ngày"
                    end-placeholder="Đến ngày"
                    size="mini" :picker-options="dateOptions">
    </el-date-picker>

    <el-date-picker :clearable="clearable" :format="itemSetting.Format? itemSetting.Format : (itemSetting.IncludeTime =='true') ? dateTimeFormat + ' HH:mm' : dateTimeFormat"
                    v-model="mName"
                    v-else-if="itemSetting.FieldColumnType === 'DateTime' && itemSetting.DateMode !== 'range'"
                    :type="itemSetting.IncludeTime =='true' ? 'datetime' : 'date'"
                    :start-placeholder="'Từ ' + itemSetting.Caption"
                    :end-placeholder="'Đến ' + itemSetting.Caption"
                    size="mini" @change="onChange()" >
    </el-date-picker>
    <el-select :clearable="clearable" v-else-if="itemSetting.ElementType === 'Select'" v-model="mName" :placeholder="itemSetting.PlaceHolder ? itemSetting.PlaceHolder : itemSetting.Caption" size="mini" :disabled="itemSetting.IsDisabled && mName!=''" filterable>
      <el-option v-for="option in itemSetting.Data" :key="option[itemSetting.SavedKey]" :label="option[itemSetting.SavedText]" :value="option[itemSetting.SavedKey]"></el-option>
    </el-select>
    <SelectTree  :clearable="clearable" v-else-if="itemSetting.ElementType === 'MultiTree'" :pSetting="itemSetting" :datasource="itemSetting.treeData" :selectedValue="mName" :callback="handleChange" :data="itemData" :source="itemSetting.sourceData" />
    <!-- <el-cascader v-else-if="itemSetting.ElementType === 'MultiTree' && itemSetting.Data" expand-trigger="hover" :options="itemSetting.Data" filterable v-model="mName" @change="handleChange">
     </el-cascader> -->
    <froala v-else-if="itemSetting.ElementType === 'Html'" :tag="'textarea'" :config="configEditor" v-model="mName"></froala>
  </div>
</template>
<script>
   import Vue from 'vue'
   import SelectTree from '@/components/dynamic/SelectTree'
   import utilsLibrary from '@/services/utils'
   Vue.use(require('vue-moment'));
 export default {
   components: {SelectTree},
   props: ['name','item', 'data', 'callback'],
   data(){
     var firstDayOfWeekCfg = this.$getItemLocalStorage('firstDayOfWeekCfg')? parseInt(JSON.parse(this.$getItemLocalStorage('firstDayOfWeekCfg')).Value): 1;
     return {
       firstDayOfWeekCfg: firstDayOfWeekCfg,
      dateTimeFormat:'dd/MM/yyyy',
       sourceData: [],
      itemSetting: this.item,
      setting: {},
      dependency: {},
      itemData: this.$Lodash.cloneDeep(this.data),
      mName: '',
      configEditor: this.$froOptions,
      clearable: true,
      dateOptions: {
        firstDayOfWeek: firstDayOfWeekCfg,
        shortcuts: [
          {
            text: 'Hôm trước',
            onClick(picker) {
              var now = new Date();
              var end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate() - 1) + ' 23:59:59');
              var start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate() - 1) + ' 00:00:00');

              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Hôm nay',
            onClick(picker) {
              var now = new Date();
              var start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 00:00:00');
              var end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 23:59:59');

              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Hôm sau',
            onClick(picker) {
              var now = new Date();
              var start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate() + 1) + ' 00:00:00');
              var end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate() + 1) + ' 23:59:59');

              picker.$emit('pick', [start, end]);
            }
          }
          , {
            text: 'Tuần trước',
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() - 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).startOf('isoweek')._d;
              var sunday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).endOf('isoweek')._d;

              var start = new Date(monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00');
              var end = new Date(sunday.getFullYear() + '/' + (sunday.getMonth() + 1) + '/' + sunday.getDate() + ' 23:59:59');


              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Tuần này',
            onClick(picker) {
              var dateVal = new Date();
              var monday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).startOf('isoweek')._d;
              var sunday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).endOf('isoweek')._d;

              var start = new Date(monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00');
              var end = new Date(sunday.getFullYear() + '/' + (sunday.getMonth() + 1) + '/' + sunday.getDate() + ' 23:59:59');


              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Tuần sau',
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() + 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).startOf('isoweek')._d;
              var sunday = Vue.moment(dateVal).isoWeekday(firstDayOfWeekCfg).endOf('isoweek')._d;

              var start = new Date(monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00');
              var end = new Date(sunday.getFullYear() + '/' + (sunday.getMonth() + 1) + '/' + sunday.getDate() + ' 23:59:59');


              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Tháng trước',
            onClick(picker) {
              var dateVal = new Date();
              var pre = Vue.moment().subtract(1, 'months')._d;
              var start = Vue.moment(pre).startOf('month')._d;
              var end = Vue.moment(start).endOf('month')._d;

              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Tháng này',
            onClick(picker) {
              var dateVal = new Date();
              var start = Vue.moment([dateVal.getFullYear(), dateVal.getMonth()])._d;
              var end = Vue.moment(start).endOf('month')._d;

              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Tháng sau',
            onClick(picker) {
              var dateVal = new Date();
              var next = Vue.moment().add(1, 'months')._d;
              var start = Vue.moment(next).startOf('month')._d;
              var end = Vue.moment(start).endOf('month')._d;

              picker.$emit('pick', [start, end]);
            }
          }]
        },
    }
   },
   created() {
    if(this.itemSetting.FormValidate && this.itemSetting.FormValidate.indexOf("Key=notEmpty") > 0 && this.itemSetting.ParentType == 'Form'){
      this.clearable = false;
    }
    setTimeout(function() {
      $("a:contains('Unlicensed copy of the Froala Editor')").remove();
    }, 800);
    if(this.itemSetting.ElementType === 'Multi'){
      this.mName = [];
      // console.log(this.itemSetting)
    }

    this.itemSetting.dependencyChange = this.dependencyChange;
    this.itemSetting.dataToDefault = this.dataToDefault;
    this.itemSetting.setVal = this.setVal;
    this.itemSetting.clearData = this.clearData;
    this.searchData();

   },
   watch: {
     mName : function (newVal) {
      if(this.itemSetting.ElementType === 'Select' || this.itemSetting.ElementType === 'Multi' || this.itemSetting.ElementType === 'Radio' || this.itemSetting.ElementType === 'Tree' || this.itemSetting.ElementType === 'MultiTree'){
        this.selectedItemChange(newVal);
      }
       if(this.callback) this.callback({name:this.name, values: newVal, model:this.itemSetting});
     }
   },
   mounted(){
     this.$hub.$on('clear-input', ()=>{
       this.mName = [];
     });
   },
   methods: {
      setUpInput(newObj) {
         var ctrl = this;
          if(newObj) {
            ctrl.itemData = newObj;
          }
          switch (ctrl.itemSetting.FieldColumnType) {
            case 'DateTime':
              /** định dạng ngày tháng, dựa theo setting lấy theo giá trị tương ứng so với ngày tháng hiện tại */
              var format = ctrl.itemSetting.Format ? ctrl.itemSetting.Format : ('DD/MM/YYYY' + (ctrl.itemSetting.IncludeTime == 'true' ? ' HH:mm' : ''));
              if (utilsLibrary.isEmpty(ctrl.itemData, ctrl.itemSetting.Name)) {
                this.mName  = utilsLibrary.formatDateTime(utilsLibrary.stringToDate(ctrl.itemData[ctrl.itemSetting.Name]), format);
              }
              break;
            case 'Double':
              /** trường hợp số thực, làm tròn đến 2 ký tự sau dấu ',' */
              if (utilsLibrary.isEmpty(ctrl.itemData, ctrl.itemSetting.Name) && ctrl.itemData[ctrl.itemSetting.Name]) {
                this.mName  = parseFloat(ctrl.itemData[ctrl.itemSetting.Name]).toFixed(2);
              } else if (!utilsLibrary.isEmpty(ctrl.itemData, ctrl.itemSetting.Name)) {
                this.mName = parseFloat(0).toFixed(2);
              } else {
                this.mName  = parseFloat(ctrl.itemSetting.Default).toFixed(2);
              }
              break;
            default:
              if (utilsLibrary.isEmpty(ctrl.itemData, ctrl.itemSetting.Name)) {
                this.mName = ctrl.itemData[ctrl.itemSetting.Name];
                if (utilsLibrary.isEmpty(ctrl.itemData[ctrl.itemSetting.Name + 'Name'])) {
                  this.mName  = ctrl.itemData[ctrl.itemSetting.Name + 'Name'];
                }
              } else if (ctrl.itemSetting.Default) {
                this.mName  = ctrl.itemSetting.Default;
              }
              break;
          }
          //console.log(this.mName)
          //this.mName = ctrl.model.inputData;
          //$scope.onChange();
        },
    selectedItemChange(inputData) {
      var object = {};
      if (this.$Utils.isEmpty(inputData)) {
        object = {
          name: this.itemSetting.Name,
          value: inputData,
        };
        if(this.itemSetting.Data && object.value){
          object.ori = this.itemSetting.Data.filter(val =>{
            return val[this.itemSetting.SavedKey] == inputData;
          })[0]
        }
        if(this.$Utils.isEmpty(this.itemSetting, 'onChange'))
          this.itemSetting.onChange(object);
      } else {
        inputData = null;
      }
    },
    onChange() {
        this.itemSetting.onChange({
            name: this.itemSetting.Name,
            value: this.mName
        });
    },
     handleChange(item) {
       this.mName = item;
     },
     searchData(data){
      if(this.itemSetting.ElementType === 'Select' || this.itemSetting.ElementType === 'Multi' || this.itemSetting.ElementType === 'Radio' || this.itemSetting.ElementType === 'Tree' || this.itemSetting.ElementType === 'MultiTree'){
          var sParms = this.$Lodash.cloneDeep(this.$singleRequest);
          sParms.R1_RequestTemplate = this.itemSetting.Request;
          sParms = this.$Utils.updateParamsSingleRequest(sParms, this.$Utils.stringToObject(this.itemSetting.Code));


          if(sParms.R1_ParentCode=='xSetting.Project.Parameter.Organization.Category'
            // || sParms.R1_ParentCode=='xSetting.Project.Parameter.Organization.Target'
            ){
            sParms.R1_Keyword = utilsLibrary.isEmpty(this.itemData, 'Project') ? this.itemData.Project : this.$rootScope.loggedOnUser.Project.GroupId;
          }

          sParms = this.$Utils.updateParamsSingleRequest(sParms, this.dependency);

          if (this.itemSetting.AssignedField == "true") {
            sParms.R1_AssignedUser = this.$getItemLocalStorage(this.$localStorageConstant.SessionId);
          }
          if(sParms.R1_ParentCode=='xSetting.Project.Parameter.Organization.Target'){
            sParms.R2_RequestTemplate = this.itemSetting.Request;
            sParms.R2_ParentCode = 'xSetting.Project.Parameter.Organization.Target'
            sParms.TotalRequests = 2;
          }
          this.$Utils.post(sParms).then((arrayData) => {
            // this.dataSource = [];
            this.itemSetting.Data = [];
            if(sParms.TotalRequests == 2){
             this.itemSetting.sourceData = this.$Utils.getDataWithRoot(arrayData.R2, this.itemSetting.DataRoot ? this.itemSetting.DataRoot : 'Data' );
            }
            arrayData = this.$Utils.getDataWithRoot(arrayData.R1, this.itemSetting.DataRoot ? this.itemSetting.DataRoot : 'Data' );
            if(sParms.R1_RequestTemplate == "User"){
              var arrData = this.$Lodash.cloneDeep(arrayData);
              arrayData = [];
              arrData.forEach((val) =>{
                if(this.$rootScope.loggedOnUser.LoginName !== "superadmin"){
                    if(val.LoginName.indexOf('superadmin') === -1){
                      arrayData.push(val);
                    }
                }
                else{
                  arrayData.push(val);
                }
                // if(val.LoginName != "superadmin" || this.$rootScope.loggedOnUser.LoginName == "superadmin"){
                //   arrayData.push(val);
                // }
              })
            }
            if(this.itemSetting.ElementType === 'MultiTree' || this.itemSetting.ElementType === 'Multi'){
              // if(arrayData){
                this.itemSetting.Data = arrayData;
                if(this.itemSetting.ElementType === 'MultiTree'){
                  this.itemSetting.treeData = this.$Utils.createCustomTreeFromList(
                    this.$Lodash.cloneDeep(arrayData),
                    "Id",
                    "ParentId",
                    "children",
                    { Name: "label", Id: "value" },
                    {}
                  );
                }
                //  else {
                //   this.itemSetting.Data = arrayData;
                // }
                if(this.$Utils.isEmpty(this.itemData, this.itemSetting.Name)){
                  this.mName = this.itemData[this.itemSetting.Name].split(';').filter((el) => {
                    return el && el != '';
                  });
                }  else {
                    if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
                      // if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
                        if(this.itemSetting.DefaultValue == 'id={{UserId}}&text={{Username}}')
                          this.itemSetting.DefaultValue = 'id={{UserId|UserInfo}}&text={{Username|UserInfo}}'
                        var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
                        // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
                        this.mName = [objDf.id];
                      // } else {
                      //   this.mName = [];
                      //   // console.log(this.itemSetting)
                      // }
                    } else {
                      this.mName = [];
                      // console.log(this.itemSetting)
                    }

                }
              if(this.itemSetting.ElementType === 'Multi'){
                var objVal = this.$Lodash.cloneDeep(this.mName);
                this.mName = []
                $.each(objVal, (key, val) =>{
                  var find = arrayData.filter((el) => {
                    return el && el != '' && el[this.itemSetting.SavedKey] == val;
                  });
                  if(find && find.length > -1)
                    this.mName.push(val)
                })
              }
              // } else {
              //   this.itemSetting.Data = {}
              // }
              this.$forceUpdate();
            } else {
              if (this.itemSetting.IsTree == "true") {
                this.formatDataSource(arrayData)
              } else {
                this.itemSetting.Data = arrayData;
              }
              if(this.$Utils.isEmpty(this.itemData, this.itemSetting.Name)){
                  // var find = arrayData.filter((el) => {
                  //   return el && el != '' && el[this.itemSetting.SavedKey] == this.itemData[this.itemSetting.Name];
                  // });
                  // if(find && find.length > 0)
                    this.mName = this.$Lodash.cloneDeep(this.itemData[this.itemSetting.Name]);
                }  else {
                    if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
                      if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
                        var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
                        // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
                        this.mName = objDf.id;
                      } else {
                        // console.log(this.itemSetting)
                        this.mName = this.itemSetting.DefaultValue;
                      }
                    }

                }
              var find = arrayData.filter((el) => {
                return el && el != '' && el[this.itemSetting.SavedKey] == this.mName;
              });
              if(!find || find.length == 0)
                this.mName = ""
            }
            // if(this.$Utils.isEmpty(this.itemData, this.itemSetting.Name)){
            //   this.mName = this.$Lodash.cloneDeep(this.itemData[this.itemSetting.Name])
            // }
            this.$forceUpdate();
          })
        } else {
          if(this.$Utils.isEmpty(this.itemData, this.itemSetting.Name)){
            if(this.itemSetting.FieldColumnType === 'DateTime'){
              this.mName = new Date(this.$Lodash.cloneDeep(this.itemData[this.itemSetting.Name]))
            } else if(this.itemSetting.ElementType === 'Html'){
              this.mName = this.$Utils.decodeHtmlEntities(this.$Lodash.cloneDeep(this.itemData[this.itemSetting.Name]))
            // }
            // else if(this.itemSetting.ElementType === 'MultiTree'){
            //   this.mName = this.itemData[this.itemSetting.Name].split(';').filter((el) => {
            //     return el && el != '';
            //   });
            } else
              this.mName = this.$Lodash.cloneDeep(this.itemData[this.itemSetting.Name])
          } else {
            if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
              if(this.itemSetting.FieldColumnType === 'DateTime'){
                var date = new Date();
                switch (this.itemSetting.DefaultValue) {
                  case 'Now':
                      this.mName = date;
                      break;
                  case 'Week':
                      this.mName = [];
                    var dateVal = new Date();
                    var s = Vue.moment(dateVal)
                      .isoWeekday(this.firstDayOfWeekCfg)
                      .startOf("isoweek")._d;
                    var e = Vue.moment(dateVal)
                      .isoWeekday(this.firstDayOfWeekCfg)
                      .endOf("isoweek")._d;
                      e.setHours(23, 59, 59);
                      s.setHours(0, 0, 0);
                      this.mName[0] = s;
                      this.mName[1] = e;
                      break;
                  case 'Month':
                      this.mName = [];
                      var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                      d.setHours(23, 59, 59);
                      this.mName[0] = new Date(date.getFullYear(), date.getMonth(), 1);
                      this.mName[1] = d;
                      break;
                  case 'Year':
                      this.mName = [];
                      var d = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
                      this.mName[0] = new Date(date.getFullYear(), 0);
                      this.mName[1] = d;
                      break;
                  case 'TwoYear':
                      this.mName = [];
                      var d = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
                      this.mName[0] = new Date(date.getFullYear() - 1, 0);
                      this.mName[1] = d;
                      break;
                  case 'LastWeek':
                      this.mName = [];
                      var diff = new Date().getDate() - new Date().getDay() + (new Date().getDay() == 0 ? -13 : 1); // adjust when day is sunday
                      var e = new Date(); // adjust when day is sunday
                      e.setDate(new Date().getDate() - new Date().getDay() + (new Date().getDay() == 0 ? -13 : 1) + 6);
                      e.setHours(23, 59, 59);
                      var s = new Date();
                      s.setTime(new Date().setDate(diff));
                      s.setHours(0, 0, 0);
                      this.mName[0] = s;
                      this.mName[1] = e;
                      break;
                  case 'LastMonth':
                      this.mName = [];
                      var d = new Date(date.getFullYear(), date.getMonth(), 0);
                      d.setHours(23, 59, 59);
                      this.mName[0] = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                      this.mName[1] = d;
                      break;
                  case 'Dynamic':
                      this.mName = [];
                      /** trường hợp cần tính toán dựa trên biểu thức*/
                      if (this.itemSetting.Expression) {
                          if (this.itemSetting.Expression.indexOf('Start') >= 0) {
                              var d = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
                              var objExpression = this.$Utils.stringToObject(this.itemSetting.Expression);
                              $.each(objExpression, function(key, value) {
                                  this.model['inputData' + key] = new Date(value);
                              })
                          }
                          if (this.itemSetting.Expression.indexOf('PreDays') >= 0) {
                              var days = this.itemSetting.Expression.split("=")
                              var d = new Date();
                              var e = Vue.moment().subtract(days[1], 'day')._d
                              d.setHours(23, 59, 59);
                              e.setHours(0, 0, 0);
                              this.mName[0] = e;
                              this.mName[1] = d;
                          }
                          // var arr = this.itemSetting.Expression.split(' '), expression = '';
                          // angular.forEach(arr, function (str) {
                          //   switch (str.trim()) {
                          //     case 'Now':
                          //       expression += date.getTime();
                          //       break;
                          //     case 'Day':
                          //       expression += 1000 * 60 * 60 * 24;
                          //       break;
                          //     case 'Week':
                          //       expression += 1000 * 60 * 60 * 24 * 7;
                          //       break;
                          //     case 'Month':
                          //       expression += 1000 * 60 * 60 * 24 * 30;
                          //       break;
                          //     case 'Year':
                          //       expression += 1000 * 60 * 60 * 24 * 365;
                          //       break;
                          //     default:
                          //       expression += str;
                          //   }
                          // });
                      }
                      // this.model.inputData = new Date(this.$Utils.calculator(expression));
                      break;
                  default:
                      this.mName = this.$Utils.stringToDate(this.itemSetting.DefaultValue);
                      break;
                }
              } else {
                // console.log(this.itemSetting.DefaultValue)
                // if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
                //   var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
                //   // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
                //   this.mName = objDf.id;
                // } else {
                  this.mName = this.itemSetting.DefaultValue;
                  // console.log(this.itemSetting)
                }
              }
            }
          }
        // }
        if(this.itemSetting.ElementType === 'Label'){
          this.setUpInput();
        }

     },

     dataToDefault(){
      if(this.itemSetting.ElementType === 'MultiTree' || this.itemSetting.ElementType === 'Multi'){
          if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
            if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
              if(this.itemSetting.DefaultValue == 'id={{UserId}}&text={{Username}}')
                this.itemSetting.DefaultValue = 'id={{UserId|UserInfo}}&text={{Username|UserInfo}}'
              var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
              // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
              this.mName = [objDf.id];
            } else {
              this.mName = [objDf.id];
            //   this.mName = [];
            //   // console.log(this.itemSetting)
            }
          } else {
            this.mName = this.$Utils.expressionToString({}, this.itemSetting.DefaultValue);
            // console.log(this.itemSetting)
          }


          // } else {
          //   this.itemSetting.Data = {}
          // }
          this.$forceUpdate();
        } else {
          if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
            if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
              var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
              // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
              this.mName = objDf.id;
            } else {
              // console.log(this.itemSetting)
              this.mName = this.$Utils.expressionToString({}, this.itemSetting.DefaultValue);
            }
          }

        }
     },

     setVal(newObj){
      if(this.itemSetting.ElementType === 'MultiTree' || this.itemSetting.ElementType === 'Multi'){
          // if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
          //   if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
          //     if(this.itemSetting.DefaultValue == 'id={{UserId}}&text={{Username}}')
          //       this.itemSetting.DefaultValue = 'id={{UserId|UserInfo}}&text={{Username|UserInfo}}'
          //     var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
          //     // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
          //     this.mName = [objDf.id];
          //   } else {
          //     this.mName = this.$Utils.expressionToString({}, this.itemSetting.DefaultValue);
          //   //   this.mName = [];
          //   //   // console.log(this.itemSetting)
          //   }
          // } else {
          //   this.mName = [];
          //   // console.log(this.itemSetting)
          // }
          if(newObj[this.itemSetting.Name]){
            this.mName = [newObj[this.itemSetting.Name]]
          } else {
            this.mName = []
          }


          // } else {
          //   this.itemSetting.Data = {}
          // }
          this.$forceUpdate();
        } else if(this.itemSetting.ElementType === 'Label'){
          if(newObj[this.itemSetting.Name]){
            this.setUpInput(newObj);
          } else {
            this.mName = "";
          }
        }  else {
          // if(this.$Utils.isEmpty(this.itemSetting, 'DefaultValue')  && this.itemSetting.DefaultValue!= ''){
          //   if(this.itemSetting.DefaultValue.indexOf('id=') != -1){
          //     var objDf = this.$Utils.stringToObject(this.$Utils.expressionToString({}, this.itemSetting.DefaultValue));
          //     // var objDf = this.$Utils.stringToObject(this.itemSetting.DefaultValue);
          //     this.mName = objDf.id;
          //   } else {
          //     // console.log(this.itemSetting)
          //     this.mName = this.$Utils.expressionToString({}, this.itemSetting.DefaultValue);
          //   }
          // }
          if(newObj[this.itemSetting.Name]){
            this.mName = newObj[this.itemSetting.Name]
          } else {
            this.mName = ""
          }

        }
        console.log(this.mName)
     },

     clearData() {
        if(this.itemSetting.ElementType === 'MultiTree' || this.itemSetting.ElementType === 'Multi'){
          this.mName = [];
          this.$forceUpdate();
        } else {
          this.mName = '';
          this.$forceUpdate();
        }
     },

     formatDataSource(arrayData) {
      var ctrl = this;
        arrayData = utilsLibrary.createdListFromDataTree(ctrl.$Lodash.cloneDeep(arrayData), []);
      var start = 1;
      if (arrayData[0]) {
        start = arrayData[0].Level ? arrayData[0].Level : arrayData[0].level;
      }
      arrayData.forEach(function (item) {
        if (item.Level) {
          item.level = item.Level;
        }
        if (item.level < start) {
          start = item.level;
        }
      });
      ctrl.itemSetting.Data = arrayData;
      $.each(arrayData, function (key, data) {
        if(utilsLibrary.isEmpty(ctrl.itemSetting.Data[key], ctrl.itemSetting.SavedText))
          ctrl.itemSetting.Data[key][ctrl.itemSetting.SavedText] = ctrl.createdLevel(data[ctrl.itemSetting.SavedText], data.level, start);
      });
      ctrl.$forceUpdate();
    },

    createdLevel(text, level, start) {
      var str = '';
      if (!start) {
        start = 1;
      }
      for (var i = start; i < level; i++) {
        str += '|-- ';
      }
      return str + text;
    },

     dependencyChange(dependencyObject, dependValue) {
      if(this.itemSetting.ElementType === 'Select'){
        switch (dependencyObject.DependencyType) {
          case 'DynamicValue':
            /** reset current data, and replace with value in depend object*/
            if (!this.$Utils.isEmpty(this.itemData)
              || this.itemData[dependValue.name] !== this.$Utils.getDataWithRoot(dependValue.value, dependencyObject.SourceField)[0]) {
              this.selectedItemChange();
            }
            if(dependencyObject.TargetKey == "getGroup"){
              // var requestSearchLink = this.$Lodash.cloneDeep(singleRequest)
              // requestSearchLink.RequestTemplate = 'Permission';
              // requestSearchLink.R1_Parent = this.$Utils.getDataWithRoot(dependValue.value)[0];
              // requestSearchLink.R1_ChildTable = 'tblGroup';
              // requestSearchLink.R1_Code = 'View';
              // this.$Utils.post(requestSearchLink).then(function (link) {
              //   link = this.$Utils.getDataWithRoot(link, 'R1.Data.DataDS.Linked');
              //   this.dependency.UserId = "";
              //   angular.forEach(link, function(value){
                  var request = {
                    RequestAction: 'SearchUserWithGroups',
                    IncludedGroupManager: 'true',
                    RequestClass: 'BPM',
                    RequestDataType: 'json',
                    ConditionFields: 'IncludedGroupManager;Group;Status;LoginName',
                    StaticFields: 'UserId;Status;LoginName',
                    // Group: value.Child,
                    Group: this.$Utils.getDataWithRoot(dependValue.value)[0],
                    Status: '1'
                  };
                  this.$Utils.postCheckResult(request).then( (data) => {
                    data = this.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
                    data.forEach((val) =>{
                      if(val.UserId && val.UserId != ""){
                        this.dependency.UserId += val.UserId + ";";
                      }
                    })
                  })
                // })
              // })
            }
             else {
              if(dependencyObject.SourceKey == 'id'){
                this.dependency[dependencyObject.TargetKey] = this.$Utils.getDataWithRoot(dependValue.value)[0];
              } else {
                this.dependency[dependencyObject.TargetKey] = this.$Utils.getDataWithRoot(dependValue.ori[dependencyObject.SourceKey])[0];
              }
            }
            this.searchData();
            break;
          case 'ChangeValidate':
            /** set current setting validate object with new value*/
            var exist = false;
            dependencyObject.Validations.forEach((validateObject) => {
              var keys = validateObject.Value ? validateObject.Value.split(';') : [];
              keys.forEach((strKey) => {
                if (this.$Utils.getDataWithRoot(dependValue.value)[0] == strKey) {
                  exist = true;
                  this.itemSetting.Validation = this.$Utils.stringToObject(validateObject.Validate);
                }
              });
            });
            if (!exist && typeof dependencyObject.ValidationDefault ==='string' && dependencyObject.ValidationDefault != '') {
              this.itemSetting.Validation = this.$Utils.stringToObject(dependencyObject.ValidationDefault);
            }
            break;
          case 'ChangeDisplay':
            break;
        }
      } else if(this.itemSetting.ElementType === 'Text'){
        switch (dependencyObject.DependencyType) {
          case 'DynamicValue':
              /** trường hợp thay đổi dữ liệu, thay đổi giá trị hiện tại bằng giá trị tương ứng trong setting vào dependValue*/
              var value = '';
              switch (this.itemSetting.FieldColumnType) {
                  case 'DateTime':
                      /** nếu là ngày tháng thì format lại trước khi hiển thị*/
                      var format = 'DD/MM/YYYY';
                      if (this.$Utils.isEmpty(this.itemSetting.Format)) {
                          /** sử dụng format từ setting nếu có */
                          format = this.itemSetting.Format;
                      }
                      value = this.$Utils.formatDateTime(this.$Utils.stringToDate(dependValue.value[dependencyObject.SourceField]), format);
                      break;
                  default:
                      value = dependValue.value[dependencyObject.SourceField];
                      break;
              }
              this.mName = value;
              break;
          case 'ChangeValidate':
              /** trường hợp thay đổi giá trị validate*/
              var exist = false;
              dependencyObject.Validations.forEach((validateObject) => {
                  var keys = validateObject.Value ? validateObject.Value.split(';') : [];
                  keys.forEach((strKey) => {
                      if (this.$Utils.getDataWithRoot(dependValue.value)[0] == strKey) {
                          exist = true;
                          this.itemSetting.Validation = this.$Utils.stringToObject(validateObject.Validate);
                      }
                  });
              });
              if (!exist && typeof dependencyObject.ValidationDefault ==='string' && dependencyObject.ValidationDefault != '') {
                  this.itemSetting.Validation = this.$Utils.stringToObject(dependencyObject.ValidationDefault);
              }
              break;
          case 'TimeSync':
                  var value = '';
                  /** nếu là ngày tháng thì format lại trước khi hiển thị*/
                  value = this.$Lodash.cloneDeep(dependValue.value);
                  // value = value.substring(0, 10);
                  // value = new Date(value);
                  value = Vue.moment(value, 'YYYY-MM-DD HH:mm').toDate()
                  // if(this.$Utils.isEmpty(this.mName) && this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'HH:mm:ss') == this.$Utils.formatDateTime(this.$Utils.stringToDate(dependValue.value), 'HH:mm:ss') && this.$Utils.isEmpty(dependencyObject.Expression)){
                  //     value.setHours(eval(this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'HH')) + dependencyObject.Expression, this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'mm'), this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'ss'));
                  // } else
                  if(this.$Utils.isEmpty(this.mName) && this.mName!=''){
                      value.setHours(this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'HH'), this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'mm'), this.$Utils.formatDateTime(this.$Utils.stringToDate(this.mName), 'ss'));
                  }
                  this.mName = value;
              break;
          case 'changeDisplay':
              /** trường hợp thay đổi giá trị hiển thị*/
              break;
        }
      } else if(this.itemSetting.ElementType === 'Label'){
        if (!this.staticData) {
         this.staticData = this.$Lodash.cloneDeep(this.itemData);
        }
        switch (dependencyObject.DependencyType) {
          /** case change current data*/
          case 'DynamicValue':
            /** define itemData if it doesn't exist*/
            if (!this.$Utils.isEmpty(this.itemData)) {
             this.itemData = {};
            }
            /** reset current data, and replace with value in depend object*/
            if (this.itemData[dependValue.name] !== this.$Utils.getDataWithRoot(dependValue.value)[0]) {
             this.mName = '';
            }
            /**
             * kiểm tra trong setting có biểu thức toán học hay không, nếu có replace các giá trong biểu thức với giá trị cho trước
             *
             * kiểm tra giá trị của source có khác với giá tri trong itemData hay ko, nếu có mới thay đổi giá trị,
             * còn không thì bỏ qua
             */
            if ((this.itemData[dependValue.name] != dependValue.value) || !dependValue.value || dependValue.ori) {
              /**kiểm tra có biểu thức thì replace các giá trị vào biểu thức, nếu không, hiển thị giá trị của dependValue lên*/
              if (this.$Utils.isEmpty(dependencyObject.Expression)) {
                var expression = this.$Utils.isEmpty(dependencyObject.Expression) ? this.$Lodash.cloneDeep(dependencyObject.Expression) : '',
                  expressionString = '';
                while (expression != '') {
                  if (expression.indexOf('{{') >= 0 && expression.indexOf('}}') > expression.indexOf('{{')) {
                    expressionString += expression.substr(0, expression.indexOf("{{"));
                    var key = expression.substr(expression.indexOf('{{') + 2, expression.indexOf("}}") - expression.indexOf('{{') - 2), path = '';
                    /**
                     * chuyển các giá trị của biểu thức thành các giá trị và lưu vàothis.objData, object dùng để
                     * lưu các giá trị của các dependValue tương ứng với từng trường Source,
                     * sau đó sẽ replace các giá trị trongthis.objData vào tên các trường tương ứng trong biểu thức
                     */
                    if (key.indexOf('.') > 0) {
                      /** cắt giá trị key và đường dẫn từ dấu . VD Customer.Id -> key = Customer, path = Id */
                      path = key.substring(key.indexOf('.') + 1, key.length).trim();
                      key = key.substring(0, key.indexOf('.')).trim();
                    }
                    /** replace các giá trị trong dependValue vàothis.objData, nếu chưa cóthis.objData[key] thì khởi tạo rỗng*/
                    if (dependValue.name === key) {
                      if (path == '') {
                       this.objData[key] = dependValue.value;
                      } else {
                        if (this.$Utils.isEmpty(dependValue, 'ori.' + path)) {
                         this.objData[key] = this.$Utils.getDataWithRoot(dependValue, 'ori.' + path)[0]
                        } else if (!this.$Utils.isEmpty(this.objData[key])) {
                         this.objData[key] = '';
                        }
                      }
                    }
                    /** chuyển các giá trị thanh biểu thức tương ứng với FieldData của itemSetting*/
                    switch (this.itemSetting.FieldColumnType) {
                      case 'String':
                        expressionString +=this.objData[key] ?this.objData[key] : '';
                        break;
                      case 'Integer':
                        expressionString +=this.objData[key] ?this.objData[key] : 0;
                        break;
                      case 'Double':
                        expressionString +=this.objData[key] ?this.objData[key] : 0;
                        break;
                      case 'DateTime':
                        break;
                    }
                    expression = expression.substr(expression.indexOf("}}") + 2, expression.length);
                  } else {
                    expressionString += expression;
                    expression = '';
                  }
                }
                /** kiểm tra nếu là dạng số thì hiển thị kết quả sau khi tính toán, nếu không thì hiển thị giá trị*/
                if (this.itemSetting.FieldColumnType == 'Integer' ||this.itemSetting.FieldColumnType == 'Double') {
                 this.itemData[this.itemSetting.Name] = this.$Utils.calculator(expressionString);
                } else {
                 this.itemData[this.itemSetting.Name] = expressionString;
                }
              } else {
               this.itemData[this.itemSetting.Name] = this.$Utils.getDataWithRoot(dependValue, 'ori.' + dependencyObject.SourceKey)[0];
              }
             this.itemSetting.onChange();
            } else if(this.$Utils.isEmpty(this.itemData, dependValue.name) &&this.itemData[dependValue.name] == dependValue.value.id){
             this.mName =this.itemData[this.itemSetting.Name];
            }
            break;
        }
      } else if(this.itemSetting.ElementType === 'MultiTree'){
        this.dependency = {};
        switch (dependencyObject.DependencyType) {
          case 'DynamicValue':
             if(dependencyObject.TargetKey == "getGroup"){
                // var requestSearchLink = angular.copy(singleRequest)
                // requestSearchLink.RequestTemplate = 'Permission';
                // requestSearchLink.R1_Parent = this.$Utils.getDataWithRoot(dependValue.value)[0];
                // requestSearchLink.R1_ChildTable = 'tblGroup';
                // requestSearchLink.R1_Code = 'View';
                // this.$Utils.post(requestSearchLink).then(function (link) {
                  // link = this.$Utils.getDataWithRoot(link, 'R1.Data.DataDS.Linked')[0];
                  this.dependency.Value = this.$Utils.isEmpty(dependValue.value) ? this.$Utils.getDataWithRoot(dependValue.value)[0] : "";
                  // angular.forEach(link, function(value){
                  //   this.dependency.Value += value.Child + ";"
                  // })
                  this.searchData();
                  if (!this.$Utils.isEmpty(this.itemData)
                    || (this.itemData[dependValue.name] !== this.$Utils.getDataWithRoot(dependValue.value)[0]) ||  this.mName.length == 0) {
                    this.mName = [];
                    this.selectedItemChange();
                  }
                // })
              } else
            if (!this.$Utils.isEmpty(dependValue.value) && this.$Utils.isEmpty(dependValue.ori)) {
              this.dependency[dependencyObject.TargetKey] = this.$Utils.getDataWithRoot(dependValue.ori)[0];
            } else {
              this.dependency[dependencyObject.TargetKey] = this.$Utils.getDataWithRoot(dependValue.value)[0];
            }
            this.searchData();
            if (!this.$Utils.isEmpty(this.itemData)
              || (this.itemData[dependValue.name] !== this.$Utils.getDataWithRoot(dependValue.value)[0]) ||  this.mName.length == 0) {
              this.mName = [];
              this.selectedItemChange();
            }
            break;
          case 'ChangeValidate':
            /** set current setting validate object with new value*/
            var exist = false;
            dependencyObject.Validations.forEach((validateObject) => {
              var keys = validateObject.Value ? validateObject.Value.split(';') : [];
              keys.forEach((strKey) => {
                if (this.$Utils.getDataWithRoot(dependValue.value)[0] == strKey) {
                  exist = true;
                  this.itemSetting.Validation = this.$Utils.stringToObject(validateObject.Validate);
                }
              });
            });
            if (!exist && typeof dependencyObject.ValidationDefault ==='string' && dependencyObject.ValidationDefault != '') {
              this.itemSetting.Validation = this.$Utils.stringToObject(dependencyObject.ValidationDefault);
            }
            break;
          case 'ChangeDisplay':
            break;
        }
      }
    }
   }
 }
</script>
<style lang="scss" scoped="true">

  .demo-input-label {
    display: inline-block;
  }
</style>
