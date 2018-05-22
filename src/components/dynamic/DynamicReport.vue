<template>
	<div class="dynamic-report">
		<!-- <b-card class="md-hue-2" v-if="reports['ShowReportHeader'] != 'false'"> -->
		<div class="row reports-header">
			<h4 class="card-title col-md reports-title">{{reports.Caption}}</h4>
            <!-- <div class="md-toolbar-tools col-md-1 text-right"> -->
                <button class="primary" type="button" v-on:click="refreshReport()" v-if="reports['FormRequest'] && !ShowTree">
                    Mở rộng
                </button>
                <button class="md-raised md-warn md-button md-default-theme md-ink-ripple blue-500-bg" type="button" v-on:click="refreshReport()" v-if="reports['FormRequest'] && ShowTree">
                    Thu gọn
                </button>
            <!-- </div> -->
        </div>
        <!-- </b-card> -->
		<div class="text-center" v-if="dataBinding!=''">{{dataBinding}}</div>
		<div  v-if="dataBinding==''">
			<div  class="table-responsive">
				<table class="table report-table table-bordered table-hover"  width="100%" v-if="!reports['viewModel']['isLoading'] && !reports['viewModel']['reportNull'] &&  reports['ShowTable']=='true'">
		            <thead>
		                <tr v-for="head in reports['formatData']['reportDataTable']['tableTH']">
		                    <th v-for="v in head" :rowspan="v.rowspan" class="text-center secondary-text" :colspan="v.colspan">
		                        {{v.value}}
		                    </th>
		                </tr>
		            </thead>
		            <tbody>
		                <tr v-for="row in reports['formatData']['reportDataTable']['tableTB']">
		                    <td v-for="(v,k) in row" :colspan="v.colspan" :class="k>0 ? 'text-right': ''">
		                        {{dynamicDataFilter(v.value, v.setting)}}
		                    </td>
		                </tr>
		            </tbody>
		        </table>
		    </div>
	        <div v-for="gObj in reports['formatData']['gObject']" v-if="!reports['viewModel']['isLoading'] && !reports['viewModel']['reportNull'] && reports['viewModel']['reportReady'] && gObj['Display']">
	            <MainChart :Setting="gObj"></MainChart>
	        </div>
	    </div>
        <!-- {{reports['formatData']['gObject']}} -->
	</div>
</template>

<script>
import Vue from 'vue'
import MainChart from './report/main';
// loadFunnel(Highcharts);
Vue.component('MainChart', MainChart)
export default {
	props: ['Setting', 'Filter', 'SearchIndex'],
	data() {
		return{
			reports: this.$Lodash.cloneDeep(this.Setting),
			listSearchCondition: [],
		    objSourceData: {},
		    fields: {},
		    filterReady: false,
		    dataBinding: 'Đang tải ...',
		    dynamicDataFilter: this.$Utils.dynamicDataFilter
		}
	},
	methods: {
		getReportSetting(settingParam) {
	      var data = {R1Data: this.reports['Value']}
	      var returnData = {};
	      if(this.reports['Value'].indexOf('ProjectCategoriesLevel') != -1){
	        this.ProjectReport = true;
	      }
	      /** tạo object cấu hình dựa trên Code và Description của mỗi object con*/
	      $.each(data, (key, RData) => {
	        var settings = {}, fields = {};
	        $.each(RData, (ksetting, setting) => {
	          if ((typeof setting.Description) == 'string' && setting.Description.indexOf('=') > 0) {
	            setting.Description = this.$Utils.stringToObject(setting.Description);
	          }
	          settings[setting.Code] = this.$Lodash.cloneDeep(setting);
	          if (setting.Code == 'Fields') {
	            $.each(setting.Description, (key, value) => {
	              fields[key] = {};
	              fields[key].count = parseInt(value);
	            });
	            fields.T = {};
	          }
	        });
	        $.each(fields, (key, val) => {
	          for (var i = 1; i < val.count + 1; i++) {
	            val[key + i] = {};
	            if (this.$Utils.isEmpty(settings[key + i], 'Description')) {
	              val[key + i] = settings[key + i].Description;
	              val[key + i].Name = settings[key + i].Name;
	            }
	          }
	        });
	        returnData[key] = fields;
	      });
	      return returnData;
	    },
	    mergeReportData(inputData) {
	      	return new Promise((resolve, reject) => {
		      var formatData = inputData.R1.formatData;
		        /** nếu chỉ có 1 bảng thì lấy dữ liệu cho báo cáo chính*/
		        resolve(this.seriesReport(this.fields.R1Data, formatData.arrData, inputData.R1.valueReport));
		      // }
		      // return deferred.promise;
		  	})
	    },
	    getDataTemplate(reportParams, type) {
	      return new Promise((resolve, reject) => {
	        // if (!this.$Utils.isSystemAdmin() && !this.$Utils.isMantisAdmin() && this.reports['IsProject']!=  'true' && this.$Utils.isEmpty(this.$rootScope.loggedOnUser.Project, 'GroupId') && !this.$Utils.isEmpty(reportParams['R1_Project'])) {
	        //   reportParams['R1_Project'] = this.$rootScope.loggedOnUser.Project.GroupId;
	        //   reportParams.R1_RequestFields += 'Project;';
	        // }
	        if (!this.$isSystemAdmin() && !this.$isMantisAdmin() && this.reports.IsProject!=  'true' && this.$Utils.isEmpty(this.$rootScope.loggedOnUser.Project, 'GroupId') && !this.$Utils.isEmpty(reportParams['R1_Project'])) {
	          reportParams['R1_Project'] = this.$rootScope.loggedOnUser.Project.GroupId;
	          // reportParams.R1_RequestFields += 'Project;';
	        }
	        delete reportParams['R1_ProjectName']
	        if(reportParams['R1_VersionProject']){
	          this.hasProject = true;
	        }
	        this.$Utils.post(reportParams).then(results => {
	          if (results.success) {
	            /** kiểm tra dữ liệu lấy về có rỗng không, nếu rỗng thông báo lỗi*/
	            var error = false, returnData = {};
	            if (!this.$Utils.isEmpty(results.R1, 'Data.DynamicDS.Report')) {
	              // reject(toastMessage.reportNull);
	              reject();
	              return false;
	            }
	            for (var i = 1; i <= reportParams.TotalRequests; i++) {
	              if (!results['R' + i].success || this.$Utils.getDataWithRoot(results['R' + i], 'Data.DynamicDS.Report').length == 0) {
	                error = true;
	              }
	            }
	            if (error) {
	            	reject();
	              // reject(toastMessage.reportNull);
	              return false;
	            }
	            /** format lại dữ liệu cho mỗi kế quả từ R1, R2, R3... */
	            for (var key = 1; key <= reportParams.TotalRequests; key++) {
	              var fields = this.$Lodash.cloneDeep(this.fields['R' + key + 'Data']);
	              results['R' + key] = this.$Utils.getDataWithRoot(results, 'R' + key + '.Data.DynamicDS')[0];
	              if (!Array.isArray(results['R' + key].Report)) {
	                results['R' + key].Report = [results['R' + key].Report];
	              }
	              /** format X to array*/
	              if(this.$Utils.isEmpty(this.reports['FormRequest']) && this.ShowTree == false && results){
	                // fields.X.count = 1;
	                if (this.$Utils.isEmpty(results, 'R' + key) && !Array.isArray(results['R' + key]['X1'])) {
	                  results['R' + key]['X1'] = [results['R' + key]['X1']];
	                }
	                if (fields.X['X1'].Format && this.$Utils.isEmpty(results, 'R' + key)) {
	                  $.each(results['R' + key]['X1'], (kX, xF) => {
	                    var object = {0: xF.Name ? xF.Name : xF.Value};
	                    xF.Name = this.$Utils.expressionToString(object, fields.X['X1'].Format);
	                  })
	                }
	              }
	              else if(fields.X){
	                for (var x = 1; x <= fields.X.count; x++) {
	                  // if(this.$Utils.isEmpty(this.reports['FormRequest']) && this.ShowTree == false && x > 1){
	                  //   delete results['R' + key]['X' + x];
	                  // } else{
	                    if (!Array.isArray(results['R' + key]['X' + x])) {
	                      results['R' + key]['X' + x] = [results['R' + key]['X' + x]];
	                    }
	                    if (fields.X['X' + x].Format) {
	                      $.each(results['R' + key]['X' + x], (kX, xF) => {
	                        var object = {0: xF.Name ? xF.Name : xF.Value};
	                        xF.Name = this.$Utils.expressionToString(object, fields.X['X' + x].Format);
	                      })
	                    }
	                  // }

	                }
	              }
	              /** format Y to array*/
	              if(fields.Y){
	              	for (var y = 1; y <= fields.Y.count; y++) {
		                if (!Array.isArray(results['R' + key]['Y' + y])) {
		                  results['R' + key]['Y' + y] = [results['R' + key]['Y' + y]];
		                }
		                if (fields.Y['Y' + y].Format) {
		                  $.each(results['R' + key]['Y' + y], (kY, yF) => {
		                    var object = {0: yF.Name ? yF.Name : yF.Value};
		                    yF.Name = this.$Utils.expressionToString(object, fields.Y['Y' + y].Format);
		                  })
		                }
		              }
	              }
	              if (this.$Utils.isEmpty(this.reports, 'AdvanceSetting.ReportOrderBy')) {
	                var sortBy = '', sortType = 1;
	                if (this.$Utils.isEmpty(this.reports, 'AdvanceSetting.ReportOrderByType', true) == 'DESC') {
	                  sortType = -1;
	                }
	                this.reports['ReportOrder'] = this.reports['AdvanceSetting']['ReportOrderBy'] + " " + this.reports['AdvanceSetting']['ReportOrderByType'];
	                $.each(fields,(kF, field) => {
	                  $.each(field, (f, k) => {
	                    if (f.Name == this.reports['AdvanceSetting']['ReportOrderBy']) {
	                      sortBy = k;
	                    }
	                  })
	                });
	                if (results['R' + key][sortBy]) {
	                  results['R' + key][sortBy].sort(function (rA, rB) {
	                    var vA = rA.Name ? rA.Name : rA.Value, vB = rB.Name ? rB.Name : rB.Value;
	                    if (vA > vB) {
	                      return sortType;
	                    } else if (vA < vB) {
	                      return -1 * sortType;
	                    }
	                    return 0;
	                  });
	                }
	              }
	              /**
	               *  thêm dữ liệu vào return data
	               * formatData: danh sách các tiêu đề
	               * valueReport: mảng các object gồm giá trị của X, Y, V... và ids
	               */
	              returnData['R' + key] = {
	                formatData: this.formatData(fields, this.$Lodash.cloneDeep(results['R' + key])),
	                valueReport: this.valueReports(fields, this.$Lodash.cloneDeep(results['R' + key])),
	              }
	            }
	            resolve(returnData);
	          } else {
	            reject();
	          }
	        });
	      });
	    },
	    formatData(fields, reportData) {
	      /** tạo danh sách các tiêu đề từ dữ liệu */
	      var arrData = [], tmp;
	      if(fields.X){
		      for (var i = 1; i <= fields.X.count; i++) {
		        tmp = reportData['X' + i] ? this.$Lodash.cloneDeep(reportData['X' + i]) : {};
		        $.each(reportData['X' + i], (key, rep) => {
		          if (rep && (rep.Value || rep.Name)) {
		            tmp[key].name = rep.Name ? rep.Name : rep.Value;
		            if (fields.X['X' + i].Prefix) {
		              tmp[key].name = fields.X['X' + i].Prefix + ' ' + tmp[key].name;
		            }
		            switch (fields.X['X' + i].DataType) {
		              case 'DateTime':
		                if (fields.X['X' + i].FormatValue) {
		                  if (fields.X['X' + i].FormatValue == 'Age') {
		                    var value = this.$Utils.stringToDate(tmp[key].name, 'YYYY');
		                      var ageDate = new Date(Date.now() - value.getTime());
		                      if(ageDate.getUTCFullYear() > 1970){
		                        tmp[key].name = Math.abs(ageDate.getUTCFullYear() - 1970)
		                      } else {
		                        tmp[key].name = this.$Utils.formatDateTime(this.$Utils.stringToDate(tmp[key].name), "DD/MM/YYYY");
		                      }
		                  } else {
		                    tmp[key].name = this.$Utils.formatDateTime(this.$Utils.stringToDate(tmp[key].name), fields.X['X' + i].FormatValue);
		                  }
		                }
		                break;
		            }
		            reportData['X' + i][key].name = tmp[key].name;
		          } else {
		            if (!this.$Utils.isEmpty(tmp[key], 'name')) {
		              tmp[key] = {};
		            }
		            tmp[key].name = this.$defaultUndefined;
		            tmp[key].Value = this.$defaultUndefined;
		          }
		        });
		        arrData.push(tmp);
		      }
		  }
		  if(fields.Y){
		      for (i = 1; i <= fields.Y.count; i++) {
		        tmp = reportData['Y' + i] ? this.$Lodash.cloneDeep(reportData['Y' + i]) : {};
		        $.each(reportData['Y' + i], (key, rep) => {
		          if (rep && (rep.Value || rep.Name)) {
		            tmp[key].name = rep.Name ? rep.Name : rep.Value;
		            switch (fields.Y['Y' + i].DataType) {
		              case 'DateTime':
		                if (fields.Y['Y' + i].FormatValue) {
		                  if (fields.Y['Y' + i].FormatValue == 'Age') {
		                    var value = this.$Utils.stringToDate(tmp[key].name, 'YYYY');
		                    var ageDate = new Date(Date.now() - value.getTime());
		                    tmp[key].name = Math.abs(ageDate.getUTCFullYear() - 1970)
		                  } else {
		                    tmp[key].name = this.$Utils.formatDateTime(this.$Utils.stringToDate(tmp[key].name), fields.Y['Y' + i].FormatValue);
		                  }
		                }
		                break;
		            }
		            reportData['Y' + i][key].name = tmp[key].name;
		          } else {
		            if (!this.$Utils.isEmpty(tmp[key])) {
		              tmp[key] = {};
		            }
		            tmp[key].name = this.$defaultUndefined;
		            tmp[key].Value = this.$defaultUndefined;
		          }
		        });
		        arrData.push(tmp);
		      }
		  }
	      /** arrDataReturn: danh sách các tiêu đề*/
	      var arrDataReturn = this.$Lodash.cloneDeep(arrData), category = [];
	      if (arrData.length > 0) {
	        var lastData = [];
	        for (var i = 0; i < arrData[arrData.length - 1].length; i++) {
	          if (arrData[arrData.length - 1][i].Name) {
	            lastData.push(arrData[arrData.length - 1][i].Name);
	          } else {
	            lastData.push(arrData[arrData.length - 1][i].Value);
	          }
	        }
	        for (var i = arrData.length - 1; i >= 0; i--) {
	          if (i == arrData.length - 1) {
	            arrData[i] = lastData;
	          }
	          if (i == 0) {
	            category = arrData[0];
	            break;
	          } else {
	            for (var j = 0; j < arrData[i - 1].length; j++) {
	              arrData[i - 1][j].categories = arrData[i];
	            }
	          }
	        }
	    }
		    this.categoryReport =  ()=> {
	        var arrData = [];
	        if(fields.X)
		        for (var i = 1; i <= fields.X.count; i++) {
		          arrData.push(reportData['X' + i]);
		        }
		    if(fields.Y)
		        for (var i = 1; i <= fields.Y.count; i++) {
		          arrData.push(reportData['Y' + i]);
		        }
	        if (arrData.length > 0) {
	          var lastData = [];
	          $.each(arrData, (key, arr) => {
	            if((arrData.length > 1 && key != 0) || arrData.length == 1 || (arrData.length > 1 && fields.V.count == 1)){
	              $.each(arr, (kO, obj) => {
	                if (obj && obj.name) {
	                  lastData.push(obj.name);
	                } else {
	                  lastData.push(this.$defaultUndefined);
	                }
	              });
	            }
	          });
	          for (var i = arrData.length - 1; i >= 0; i--) {
	            if (i == arrData.length - 1) {
	              arrData[i] = lastData;
	            }
	            if (i == 0) {
	              category = arrData;
	              break;
	            } else if(arrData[i - 1]) {
	              for (var j = 0; j < arrData[i - 1].length; j++) {
	                if(arrData[i - 1][j])
	                  arrData[i - 1][j].categories = arrData[i];
	              }
	            }
	          }
	        }
	        return category;
	      };
	      return {category: this.categoryReport(), arrData: arrDataReturn};
	    },
	    valueReports(fields, reportData) {
	      var valueReport = [];
	      var arrData = [];
	      $.each(reportData.Report, (kR, report) => {
	        /** thêm defaultUndefined vào các dữ liệu trả về thiếu giá trị X, Y*/
	        if (this.$Utils.isEmpty(report)) {
	          var tmpData = {};
	          if (fields.V && fields.V.count > 0) {
	            for (var j = 1; j <= fields.V.count; j++) {
	              tmpData['V' + j] = report['V' + j];
	              if(this.$Utils.isEmpty(report['V' + j]) && report['V' + j]!=0){
	              }
	            }
	          }
	          var ids = [];
	          if (fields.X && fields.X.count > 0) {
	            for (var j = 1; j <= fields.X.count; j++) {
	              var tmp = report['X' + j] ? report['X' + j] : this.$defaultUndefined;
	              tmpData['X' + j] = tmp;
	              ids.push(tmp);
	            }
	          }
	          if (fields.Y && fields.Y.count > 0) {
	            for (var j = 1; j <= fields.Y.count; j++) {
	              var tmp = report['Y' + j] ? report['Y' + j] : this.$defaultUndefined;
	              tmpData['Y' + j] = tmp;
	              arrData.push(tmp);
	              ids.push(tmp);
	            }
	          }
	          tmpData.ids = ids;
	          valueReport.push(tmpData);
	        }
	      });
	      return valueReport;
	    },
	    seriesReport(fields, arrData, valueReport) {
	        if(this.$Utils.isEmpty(this.reports['FormRequest'])){
	          var arrayValue = [], total = 1, div = 1, count = 0;
	          for (var i = 0; i < arrData.length; i++) {
	            total = total * arrData[i].length;
	          }
	          for (var i = 0; i < total; i++) {
	            arrayValue[i] = [];
	          }
	          for (var i = 0; i < arrData.length; i++) {
	            for (var l = 0; l < div; l++) {
	              while (count < total) {
	                for (var j = 0; j < arrData[i].length; j++) {
	                  for (var k = j * total / arrData[i].length; k < (j + 1) * (total / arrData[i].length); k++) {
	                    if(arrayValue[k + l * total].length > 0){
	                      $.each(this.object, (key, item) => {
	                        if(item.ParentId == arrayValue[k + l * total][arrayValue[k + l * total].length -1] && arrData[i][j].Value == item.Id){
	                          arrayValue[k + l * total].push(arrData[i][j].Value);
	                        }
	                      })
	                    } else if(this.$Utils.isEmpty(arrData[i][j].Value)) {
	                      arrayValue[k + l * total].push(arrData[i][j].Value);
	                    }
	                    count++;
	                  }
	                }
	              }
	              count = 0;
	            }
	            div = div * arrData[i].length;
	            total = total / arrData[i].length;
	          }
	            var arraySeries = [];
	            for (var v = 0; v < fields.V.count; v++) {
	              var arrayResult = [];
	              var fieldSetting = fields.V['V' + (v + 1)];
	              for (var i = 0; i < arrayValue.length; i++) {
	                if (valueReport) {
	                  arrayResult.push(this.checkExist(arrayValue[i], v + 1, valueReport));
	                } else {
	                  arrayResult.push(0);
	                }
	              }
	              fieldSetting.FieldColumnType = fieldSetting.DataType;
	              if (!fieldSetting.FieldColumnType || fieldSetting.FieldColumnType == 'String') {
	                fieldSetting.FieldColumnType = 'Integer';
	              }
	              arraySeries[v] = {
	                data: arrayResult,
	                name: fieldSetting.ReportCaption,
	                key: fieldSetting.Name,
	                setting: fieldSetting
	              };
	              this.reports['formatData']['seriesNumber']++;
	            }
	          this.arrayValue = arrayValue;
	          this.valueReport = valueReport;
	          return arraySeries;
	      }
	      else {
	        var arrayValue = [], total = 1, div = 1, count = 0;
	        for (var i = 0; i < arrData.length; i++) {
	          total = total * arrData[i].length;
	        }
	        for (var i = 0; i < total; i++) {
	          arrayValue[i] = [];
	        }
	        for (var i = 0; i < arrData.length; i++) {
	          for (var l = 0; l < div; l++) {
	            while (count < total) {
	              for (var j = 0; j < arrData[i].length; j++) {
	                for (var k = j * total / arrData[i].length; k < (j + 1) * (total / arrData[i].length); k++) {
	                  arrayValue[k + l * total].push(arrData[i][j].Value);
	                  count++;
	                }
	              }
	            }
	            count = 0;
	          }
	          div = div * arrData[i].length;
	          total = total / arrData[i].length;
	        }
	        var arraySeries = [];
	        for (var v = 0; v < fields.V.count; v++) {
	          var arrayResult = [];
	          var fieldSetting = fields.V['V' + (v + 1)];
	          for (var i = 0; i < arrayValue.length; i++) {
	            if (valueReport) {
	              arrayResult.push(this.checkExist(arrayValue[i], v + 1, valueReport));
	            } else {
	              arrayResult.push(0);
	            }
	          }
	          fieldSetting.FieldColumnType = fieldSetting.DataType;
	          if (!fieldSetting.FieldColumnType || fieldSetting.FieldColumnType == 'String') {
	            fieldSetting.FieldColumnType = 'Integer';
	          }
	          arraySeries[v] = {
	            data: arrayResult,
	            name: fieldSetting.ReportCaption,
	            key: fieldSetting.Name,
	            setting: fieldSetting
	          };
	          // console.log(this.reports['formatData'])
	          this.reports['formatData']['seriesNumber']++;
	        }
	      return arraySeries;
	        /** thêm dữ liệu lấy từ V */
	      }
	    },
	    checkExist(array, v, valueReport) {
	      var result = 0;
	      for (var i = 0; i < valueReport.length; i++) {
	        var condition = valueReport[i].ids.join();
	        if (Array.isArray(array)) {
	          if (condition.toLowerCase() === array.join().toLowerCase()) {
	            if (valueReport[i]['V' + v]) {
	              result = parseFloat(valueReport[i]['V' + v]);
	            }
	            break;
	          }
	        }
	      }
	      return result;
	    },
	    formatReportExpression(seriesGroup) {
		    return new Promise((resolve, reject) => {
		      if (this.$Utils.isEmpty(this.reports['Fields']['Calculators'])) {
		        $.each(this.reports['Fields']['Calculators'], (kE, expressionSetting) => {
		          if (this.$Utils.isEmpty(expressionSetting.Expression)) {
		            var series = {
		              data: [],
		              code: expressionSetting.Name,
		              name: expressionSetting.ReportCaption ? expressionSetting.ReportCaption : expressionSetting.Caption,
		              key: expressionSetting.Name,
		              setting: expressionSetting
		            };
		            series.setting.FieldColumnType = 'Double';
		            var exp = this.$Lodash.cloneDeep(expressionSetting.Expression), formatExpression = '';
		            for (var i = 0; i < seriesGroup[0].data.length; i++) {
		              var object = {};
		              $.each(seriesGroup, (kS,ser) => {
		                object[ser.key] = ser.data[i];
		              });
		              var result = this.$Utils.calculator(this.$Utils.expressionToString(object, exp));
		              if (result + '' == 'Infinity' || result + '' == 'NaN') {
		                result = 0;
		              }
		              series.data.push(result);
		            }
		            seriesGroup.push(series);
		            if (typeof this.reports['ReportOrder'] == 'string') {
		              var paraSort = this.reports['ReportOrder'].split(' ')[0],
		                typeSort = this.reports['ReportOrder'].split(' ')[1];
		              this.sortIndex = [];
		              typeSort = (typeSort.trim() == 'DESC') ? 1 : -1;
		              if (series.key == paraSort) {
		                this.sortIndex = this.$Utils.sortWithIndexes(this.$Lodash.cloneDeep(series.data), typeSort, this.reports['RecordLimit']);
		              }
		            }
		          }
		        });
		      }
		      resolve(seriesGroup);
		      // return deferred.promise;
	  		})
	   	},
	   	createChartData(categories, series) {
	      /** kiểm tra nếu có setting ko hiển thị bảng thống kê thì dừng lại */
	      if (this.reports['ShowReport'] != "true") {
	        return false;
	      }
	      this.reports['formatData']['gObject'] = [];
	      if (this.$Utils.isEmpty(this.reports, "EnableDataSeries") && this.reports['EnableDataSeries']== "true") {
	        var listChart = [];
	        $.each(this.reports['Fields']['Series'], (kC, chart) => {
	          listChart.push(chart);
	        });
	        $.each(listChart, (kC, chart) => {
	          group = {
	            Name: chart.Name,
	            chartData: {categories: categories, series: []},
	            Caption: chart.Caption,
	            Chart: chart.ReportType ? chart.ReportType : 'Column',
	            ColumnFlex: chart.ReportProportion ? chart.ReportProportion : this.reports['ReportProportion'],
	            Display: chart.Enabled
	          };
	          for (var i = 0; i < series.length; i++) {
	            if (series[i].key == chart.Name && chart.Enabled == true) {
	              group.chartData.series.push(series[i]);
	            }
	          }
	          this.reports['formatData']['gObject'].push(group);
	        });
	      }
	      else {
	        if (this.fields.R1Data.Y && this.fields.R1Data.Y.count > 0) {
	          var cateData = [], seriesData = [];
	          $.each(categories, (kC, cate) => {
	            cateData.push(cate.name);
	          });
	          for (var i = cateData.length; i < categories[0].categories.length; i++) {
	            seriesData.push({
	              name: categories[0].categories[i],
	              data: [],
	              setting: this.$Lodash.cloneDeep(series[0].setting)
	            });
	          }
	          var count = 0;
	          for (i = 0; i < cateData.length; i++) {
	            $.each(seriesData, (kS, ser) => {
	              ser.data.push(series[0].data[count]);
	              count++;
	            });
	          }
	          series = seriesData;
	          categories = cateData;
	        }
	        this.reports['formatData']['gObject'].push({
	          chartData: {categories: categories, series: series},
	          attr: {},
	          Caption: this.reports['Caption'],
	          Chart: this.reports['ReportType'] ? this.reports['ReportType'] : 'column',
	          ColumnFlex: this.reports['ReportProportion'],
	          Display: true
	        });
	      }
	      if (this.reports['ReportType'] == 'General') {
	        var group = {
	          chartData: [],
	          Caption: this.reports['Caption'],
	          Chart: 'General',
	          ColumnFlex: this.reports['ReportProportion'],
	          Display: true
	        };
	        $.each(this.reports['formatData']['gObject'], (kO, object) => {
	          object.Display = false;
	          group.chartData.push(object);
	        });
	        this.reports['formatData']['gObject'].push(group);
	      } else {
	        $.each(this.reports['formatData']['gObject'], (kO, object) => {
	          var gObjectFormat = this.$Lodash.cloneDeep(object), hide = [];
	          gObjectFormat.chartData.categories = [];
	          $.each(gObjectFormat.chartData.series, (kS, ser) => {
	            ser.data = [];
	          });
	          $.each(object.chartData.categories, (key, tb) => {
	            var hidden = true;
	            for (var i = 0; i < object.chartData.series.length; i++) {
	              if (object.chartData.series[i].data[key] && object.chartData.series[i].data[key] != 0) {
	                hidden = false;
	                break;
	              }
	            }
	            if (!hidden) {
	              hide.push(key);
	            }
	          });
	          $.each(hide, (k, i) => {
	            gObjectFormat.chartData.categories.push(object.chartData.categories[i]);
	            $.each(gObjectFormat.chartData.series, (key, ser) => {
	              ser.data.push(object.chartData.series[key].data[i]);
	            });
	          });
	        });
	      }
	      if (this.fields.R1Data.X.count < 2) {
	        /** remove all 0 column*/
	        $.each(this.reports['formatData']['gObject'], (index, object) => {
	          var gObjectFormat = this.$Lodash.cloneDeep(object), show = [];
	          gObjectFormat.chartData.categories = [];
	          $.each(gObjectFormat.chartData.series, (kS, ser) => {
	            ser.data = [];
	          });
	          $.each(object.chartData.categories, (key, tb) => {
	            var hidden = true;
	            for (var i = 0; i < object.chartData.series.length; i++) {
	              if (object.chartData.series[i].data[key] && object.chartData.series[i].data[key] != 0) {
	                hidden = false;
	                break;
	              }
	            }
	            if (!hidden) {
	              show.push(key);
	            }
	          });
	          $.each(show, (k, i) => {
	            gObjectFormat.chartData.categories.push(object.chartData.categories[i]);
	            $.each(gObjectFormat.chartData.series, (key, ser) => {
	              ser.data.push(object.chartData.series[key].data[i]);
	            });
	          });
	          this.reports['formatData']['gObject'][index] = gObjectFormat;
	        });
	      }
	      if(this.reports['ShowTable'] == false && this.dataBinding == 'Đang tải ...'){
	      	this.dataBinding = '';
	      }
	      this.reports['viewModel']['reportReady'] = true;
	    },
	    createTableData(formatData, seriesReport) {
	      // if(this.$Utils.isEmpty(formatData) && this.$Utils.isEmpty(seriesReport)){
	      //   this.TreeformatData = this.$Lodash.cloneDeep(formatData);
	      //   this.TreeseriesReport = this.$Lodash.cloneDeep(seriesReport);
	      // } else if(this.$Utils.isEmpty(this.TreeformatData) && this.$Utils.isEmpty(this.TreeseriesReport)){
	      //   this.ShowTree = true;
	      //   formatData = this.$Lodash.cloneDeep(this.TreeformatData);
	      //   seriesReport = this.$Lodash.cloneDeep(this.TreeseriesReport);
	      // }
	      formatData.arrData[0].push({name: 'Tổng'});
	      var total = seriesReport.length, tableValue = {head: [], body: []}, arrBodyData = [];
	        if (this.fields.R1Data.X.count < 2 && this.fields.R1Data.Y.count == 0) {
	        tableValue.head[0] = [{rowspan: 1, level: 0, value: this.fields.R1Data.X.X1.ReportCaption}];
	        $.each(this.reports['Fields']['Table'], (kT, tableGroup) => {

	          if (tableGroup.Display == true) {
	            for (var i = 0; i < seriesReport.length; i++) {
	              if (tableGroup.Name == seriesReport[i].key) {
	                tableValue.head[0].push({
	                  value: seriesReport[i].name,
	                  colspan: 1,
	                  level: 0,
	                });
	                arrBodyData.push(seriesReport[i]);
	              }
	            }
	          }
	        });
	        total = arrBodyData.length;
	      } else {
	        arrBodyData = seriesReport;
	        var arr = [{
	          value: this.fields.R1Data.X.X1.ReportCaption,
	          level: 0,
	          rowspan: formatData.arrData.length - this.fields.R1Data.X.count > 1 ? formatData.arrData.length - this.fields.R1Data.X.count : ''
	        }];
	        if (this.fields.R1Data.Y && this.fields.R1Data.Y.count > 0) {
	          for (var i = this.fields.R1Data.X.count; i < formatData.arrData.length; i++) {
	            total = total * formatData.arrData[i].length;
	          }
	          var div = total;
	          /** multi Y report code*/
	          if(this.fields.R1Data.Y.count == 1) {
	            for (var i = this.fields.R1Data.X.count; i < formatData.arrData.length; i++) {
	              var count = 0;
	              div = div / formatData.arrData[i].length;
	              while (count < total) {
	                $.each(formatData.arrData[i], (kE, element) => {
	                  arr.push({value: element.name, level: 0, colspan: div});
	                  count += div;
	                });
	              }
	            }
	          } else if (this.fields.R1Data.Y.count > 1) {
	            for (var i = this.fields.R1Data.X.count; i < formatData.arrData.length; i++) {
	              var arrX = [], count = 0;
	              div = div / formatData.arrData[i].length;
	              while (count < total) {
	                $.each(formatData.arrData[i], (kE, element) => {
	                  if(this.$Utils.isEmpty(element.Name))
	                    arrX.push({value: element.name, level: 0, colspan: div});
	                    count += div;
	                });
	              }
	              if(arrX.length > 0)
	                tableValue.head.push(arrX);
	            }
	          }
	        } else {
	          for (var i = 0; i < seriesReport.length; i++) {
	            arr.push({
	              value: seriesReport[i].name,
	              colspan: 1,
	              level: 0,
	              setting: seriesReport[i].setting
	            });
	          }
	        }
	        if (this.fields.R1Data.Y && this.fields.R1Data.Y.count > 1){
	          $.each(arr, (kA, ar) =>{
	            tableValue.head[0].unshift(ar);
	          })
	        } else {
	          tableValue.head.unshift(arr);
	        }
	      }
	      var level = this.fields.R1Data.X.count - 1, arrayRow = [];
	          if(this.$Utils.isEmpty(this.reports['FormRequest'])){
	            var newArr = {}
	            if(this.ShowTree == true){
	              for (var i = this.fields.R1Data.X.count - 1; i >= 0; i--) {
	                  $.each(this.object, (kR, row) => {
	                      $.each(formatData.arrData[i], (key, child) => {
	                          if(this.$Utils.isEmpty(formatData.arrData[i - 1]) && this.$Utils.isEmpty(child, 'Value') && row.Id == child.Value){
	                            $.each(formatData.arrData[i - 1], (pkey, parent) => {
	                              if(row.ParentId == parent.Value){
	                                if(!this.$Utils.isEmpty(newArr, child.Value)){
	                                  child.level = level;
	                                  newArr[child.Value] = child;
	                                }
	                                if(!this.$Utils.isEmpty(newArr, parent.Value)){
	                                  parent.level = level - 1;
	                                  newArr[parent.Value] = parent;
	                                  newArr[parent.Value].children = [];
	                                }
	                                if(this.$Utils.isEmpty(newArr[parent.Value], 'children')){
	                                  newArr[parent.Value].children.push(newArr[child.Value]);
	                                }
	                              }
	                            })
	                          } else {
	                            if(!this.$Utils.isEmpty(newArr, child.Value)){
	                              child.level = level;
	                              newArr[child.Value] = child;
	                            }
	                          }
	                      })
	                    })
	                level--;
	              }
	            }
	            else {
	              for (var i = this.fields.R1Data.X.count - 1; i >= 0; i--) {
	                $.each(formatData.arrData[i], (key, child) => {
	                  if(!this.$Utils.isEmpty(newArr, child.Value)){
	                    child.level = level;
	                    newArr[child.Value] = child;
	                  }
	                })
	                level--;
	              }
	            }

	            var sArr = this.$Lodash.cloneDeep(newArr);
	            newArr = [];
	            $.each(sArr, (key, value) =>{
	              if(value.level == 0){
	                newArr.push(value)
	              }
	            })
	            var tArr = {};
	            this.$Utils.readSettingNode(newArr, tArr)
	            var totalArr = {
	              name: "Tổng"
	            }
	            tArr["Tổng"] = totalArr
	            $.each(tArr, (key, value) => {
	              var arr = [];
	              var nlevel = this.$Lodash.cloneDeep(value.level)
	              while(nlevel > 0){
	                value.name = " -- " + value.name
	                nlevel --;
	              }
	              var x = [{value: value.name, level: value.level, colspan: 1}];
	              if(this.$Utils.isEmpty(this.fields.R1Data.Y)){
	                $.each(formatData.arrData[this.fields.R1Data.X.count], (yKey, yValue) => {
	                  var totalValue = 0
	                  var valueLevel = value.level + 1;
	                  $.each(this.valueReport, (kR, rValue) => {
	                    if(rValue["Y1"] == yValue.Value && rValue["X1"] != '[Không xác định]' && rValue["X" + valueLevel] == value.Value){
	                      totalValue = totalValue + eval(rValue["V1"])
	                    }
	                  })
	                  var totalField = {
	                    value: totalValue
	                  }
	                  x.push(totalField)
	                })
	                arr.push(x);
	                arr = arrayRow.concat(this.$Lodash.cloneDeep(arr));
	                arrayRow = this.$Lodash.cloneDeep(arr);
	              } else {
	                for (var j = 0; j < total; j++) {
	                  var totalValue = 0
	                  var valueLevel = value.level + 1;
	                  $.each(this.valueReport, (kR, rValue) => {
	                    if(rValue["X1"] != '[Không xác định]' && rValue["X" + valueLevel] == value.Value){
	                      totalValue = totalValue + eval(rValue["V1"])
	                    }
	                  })
	                  var totalField = {
	                    value: totalValue
	                  }
	                  x.push(totalField)
	                }
	                arr.push(x);
	                arr = arrayRow.concat(this.$Lodash.cloneDeep(arr));
	                arrayRow = this.$Lodash.cloneDeep(arr);
	              }
	            })
	          } else {
	            for (var i = this.fields.R1Data.X.count - 1; i >= 0; i--) {
	            var arr = [];
	            var newArr = []
	            $.each(formatData.arrData[i], (key, child) => {
	              var x = [{value: child.name, level: level, colspan: 1}];
	              for (var j = 0; j < total; j++) {
	                if (i < this.fields.R1Data.X.count - 1 && !(i == 0 && key == formatData.arrData[0].length - 1)) {
	                  x.push({});
	                }
	              }
	              arr.push(x);

	              /** nếu là phần tử tổng thì bỏ qua*/
	              if (!(i == 0 && key == formatData.arrData[0].length - 1)) {
	                arr = arr.concat(this.$Lodash.cloneDeep(arrayRow));
	              }
	            });
	          level--;
	          arrayRow = this.$Lodash.cloneDeep(arr);
	        }
	      }
	      tableValue.body = arrayRow;
	      if (!this.$Utils.isEmpty(this.fields.R1Data.Y)) {
	        this.fields.R1Data.Y.count = 0;
	      }
	      var count = 0;
	      if(!this.$Utils.isEmpty(this.reports['FormRequest'])){
	        $.each(tableValue.body, (index, childArray) => {
	          if (childArray.length == 1 || index == tableValue.body.length - 1) {
	            for (var i = 0; i < total / arrBodyData.length; i++) {
	              $.each(arrBodyData, (idx, childVal) => {
	                childArray.push({
	                  value: childVal.data[count],
	                  level: 0,
	                  colspan: 1,
	                  setting: arrBodyData[idx].setting
	                });
	              });
	              count++;
	            }
	          }
	        });
	      }
	      var clearArr = [];
	      if (this.fields.R1Data.X.count == 1) {
	        $.each(tableValue.body, (kR, row) => {
	          var hidden = true;
	          for (var i = 1; i < row.length; i++) {
	            if (row[i].value && row[i].value != 0 && row[i].value != '0.0%') {
	              hidden = false;
	              break;
	            }
	          }
	          if (!hidden) {
	            clearArr.push(row)
	          }
	        });
	        this.reports['formatData']['reportDataTable']['tableTB'] = clearArr;
	      }
	      else
	        this.reports['formatData']['reportDataTable']['tableTB'] = tableValue.body;
	      if (this.reports['formatData']['reportDataTable']['tableTB'].length <= 0)
	        this.reports['viewModel']['reportNull'] = true;
	      this.reports['formatData']['reportDataTable']['tableTH'] = tableValue.head;
	        var arrSource = [];
	        $.each(this.reports['formatData']['reportDataTable']['tableTB'], (kS, source) => {
	          var item = {};
	          $.each(source, (index, itemSource) => {
	            item['value' + index] = itemSource.value;
	            if (itemSource.setting != undefined && itemSource.setting != null) {
	              var setting = itemSource.setting;
	              var value = itemSource.value;
	              switch (setting.FieldColumnType) {
	                case 'Integer':
	                  if (value != '' && !isNaN(value)){
	                    value = parseFloat(this.$Utils.formatNumber(value)).toFixed(0);
	                  }
	                  break;
	                case 'Double':
	                  if (value != '' && !isNaN(value)) {
	                    var formated = false;
	                    if (setting.FormatValue) {
	                      var afterDecimal = 0;
	                      afterDecimal = setting.FormatValue.substring(setting.FormatValue.indexOf('.') + 1, setting.FormatValue.indexOf('f'));
	                      afterDecimal = afterDecimal == '' ? 0 : afterDecimal;
	                      value = (value == 0) ? 0 : parseFloat(this.$Utils.formatNumber(value)).toFixed(afterDecimal);
	                      formated = true;
	                    }
	                    if (typeof setting.Format == 'string') {
	                      setting.Format = setting.Format.replaceAll('{{0', '{{' + setting.Name);
	                      var object = {};
	                      object[setting.Name] = value;
	                      value = this.$Utils.expressionToString(object, setting.Format);
	                      formated = true;
	                    }
	                    if (!formated){
	                      value = parseFloat(this.$Utils.formatNumber(value)).toFixed(0);
	                    }
	                  }
	                  break;
	                case 'DateTime':
	                  if (value != undefined || value != '') {
	                    var date = this.$Utils.stringToDate(value);
	                    var format;
	                    if (this.$Utils.isEmpty(setting.Format))
	                      format = setting.Format;
	                    value = this.$Utils.formatDateTime(date, format);
	                  }
	                  break;
	              }
	              item['value' + index] = value;
	            }
	          })
	          arrSource.push(item);
	        })
	        var arrColumns = [];
	        $.each(tableValue.head, (headIndex, head) => {
	          $.each(head, (itemIndex, field) => {
	            field.mData = 'value' + (headIndex + itemIndex);
	            field.sTitle = field.value;
	            field.defaultContent = '';
	            arrColumns.push(field);
	          });
	        });
	        this.ListColumns = arrColumns;
	        this.reports['dtColumns'] = arrColumns;
	        // this.reports['dtOptions'] = DTOptionsBuilder.fromFnPromise(function () {
	        //   var defer = $q.defer();
	        //   defer.resolve(arrSource);
	        //   return defer.promise;
	        // }).withOption('paging', false)
	        //   .withOption('searching', false)
	        //   .withOption('ordering', false)
	        //   .withOption('responsive', true)
	        //   .withOption('info', false)
	        //   .withOption('rowCallback', formatClass)
	        //   .withOption('autoWidth', true)
	        //   .withLanguage({"sEmptyTable": "Không có dữ liệu!"})
	        // if (this.reports['dtInstance'].id != undefined)
	        //   this.reports['dtInstance'].reloadData();
	        // else
	        //   this.reports['authorized'] = true;

	      this.setTableAndChartWidth();
	    },
	    formatClass(row, data, index) {
	      $.each(this.ListColumns, (columnIndex, column) => {
	        if (columnIndex > 0)
	          $('td', row).eq(columnIndex).addClass('text-right');
	      });
	    },
	    refreshReport(searchCondition) {
	      if(this.$Utils.isEmpty(this.reports['FormRequest'])){
	        if(this.$Utils.isEmpty(searchCondition)){
	          this.searchCondition = this.$Lodash.cloneDeep(searchCondition);
	          this.ShowTree = false;
	        } else if(this.$Utils.isEmpty(this.searchCondition)){
	          this.ShowTree = !this.ShowTree ? true : false;
	          this.dataBinding = 'Đang tải ...'
	          searchCondition = this.$Lodash.cloneDeep(this.searchCondition);
	        } else {
	        	this.ShowTree = !this.ShowTree ? true : false;
	        }
	      }
	      if (!this.$Utils.isEmpty(this.fields.R1Data)) {
	        this.searchCondition = searchCondition;
	        this.research = true;
	        return false;
	      } else if (this.research) {
	        searchCondition = this.$Lodash.cloneDeep(this.searchCondition);
	        this.searchCondition = null;
	        this.research = false;
	      }
	      /** format lại giá trị hiện tại về rỗng*/
	      // this.defaultViewModel();
	      /** tạo request search*/
	      var reportParams = this.$Lodash.cloneDeep(this.$singleRequest);
	      reportParams.TotalRequests = 0;
	        reportParams.TotalRequests++;
	        reportParams['R' + reportParams.TotalRequests + '_Template'] = this.reports['Code'];
	        reportParams['R' + reportParams.TotalRequests + '_RequestTemplate'] = this.reports['DataSource'] + '.Report'
	        reportParams['R' + reportParams.TotalRequests + '_RequestDataGroup'] = this.reports['Name'];
	        // reportParams['R' + reportParams.TotalRequests + '_PlanStartDateStartValue'] = "2017-08-28T00:00:00";
	        // reportParams['R' + reportParams.TotalRequests + '_PlanStartDateEndValue'] = "2017-09-03T23:59:59";
	        if (this.reports['AssignedUser'] == "true") {
	          reportParams['R' + reportParams.TotalRequests + '_AssignedUser'] = localStorage.getItem('SessionId');
	        }
	        if (this.$Utils.isEmpty(this.reports['AdditionConditions'])) {
	          this.reports['AdditionConditions'] = typeof this.reports['AdditionConditions'] =='string' ? this.$Utils.stringToObject(this.reports['AdditionConditions']) : this.reports['AdditionConditions'];
	          $.each(this.reports['AdditionConditions'], (key, value) => {
	            if (value.indexOf('!!') >= 0) {
	              var valueDate = value.split('!!');
	              var item = valueDate[0];
	              var format = valueDate[1];
	              if (item == "RangeTime") {
	                this.reports['AdditionConditions'][key] = this.$Utils.getDateTimeByKey(format);
	              }
	            }
	          })
	          reportParams = this.$Utils.updateParamsSingleRequest(reportParams, this.reports['AdditionConditions'], reportParams.TotalRequests);
	        }
	        if (this.$Utils.isEmpty(this.reports, 'AdvanceSetting.AdditionConditions')) {
	          var obj = this.$Utils.stringToObject(this.reports['AdvanceSetting']['AdditionConditions'], '+', '.COMPARE');
	          reportParams = this.$Utils.updateParamsSingleRequest(reportParams, obj, reportParams.TotalRequests);
	        }

	        if (this.$Utils.isEmpty(this.reports, 'AdditionConditions')) {
	          // var obj = this.$Utils.stringToObject(this.reports['AdditionConditions'], '&', '=');
	          $.each(this.reports['AdditionConditions'], (key, item) => {
	            if (this.$Utils.isEmpty(item) && item.indexOf("RangeTime!!") >= 0) {
	              this.reports['AdditionConditions'][key + "StartValue"] = this.$Utils.getDateTimeByKey(item.split("!!")[1] + "Start");
	              this.reports['AdditionConditions'][key + "EndValue"] = this.$Utils.getDateTimeByKey(item.split("!!")[1] + "End");
	              delete this.reports['AdditionConditions'][key]
	            }
	          })
	          reportParams = this.$Utils.updateParamsSingleRequest(reportParams, this.reports['AdditionConditions'], reportParams.TotalRequests);
	        }
	        /** add search condition from filter*/
	        $.each(searchCondition, (kC, condition) => {
	          if (this.$Utils.isEmpty(condition, "setting") && condition.setting.ElementType == "MultiTree") {
	            $.each(condition.value.split(";"), (key, divine) => {
	              if (this.$Utils.isEmpty(divine) && divine != "") {
	                var level = key + 1
	                reportParams['R1_' + condition.name + "Level" + level] = divine;
	                reportParams['R2_' + condition.name + "Level" + level] = divine;
	                delete reportParams['R1_' + condition.name];
	                delete reportParams['R2_' + condition.name];
	              }
	            })
	          } else if (this.$Utils.isEmpty(condition) && condition !== '' && typeof condition === 'string') {
	            reportParams['R' + reportParams.TotalRequests + '_' + kC] = condition;
	          } else if (this.$Utils.isEmpty(condition) && Array.isArray(condition) && condition.length > 0) {
	            reportParams['R' + reportParams.TotalRequests + '_' + kC] = condition.join(';');
	          }
	        });
	      /** chuyển các giá trị trong request có định dạng là biến về dữ liệu tương ứng, phân biệt bằng {{param}} */
	      $.each(reportParams, (paramKey, val) => {
	        val = val + '';
	        if (val.indexOf('{{') >= 0 && val.indexOf('}}') > val.indexOf('{{')) {
	          var key = val.substr(val.indexOf('{{') + 2, val.indexOf('}}') - val.indexOf('{{') - 2);
	          if (key.indexOf('|') > 0) {
	            var type = key.substring(key.indexOf('|') + 1, key.length).trim(), fil = '';
	            key = key.substring(0, key.indexOf('|')).trim();
	            if (type.indexOf(':') > 0) {
	              fil = type.substring(type.indexOf(':') + 1, type.length).trim();
	              type = type.substring(0, type.indexOf(':')).trim();
	            }
	            if (key == 'Date') {
	              val = new Date;
	            } else {
	              val = reportParams[paramKey.substring(0, 3) + key];
	            }
	            switch (type) {
	              case 'DateTime':
	                /**trường hợp ngày tháng*/
	                var date = this.$Utils.stringToDate(val);
	                switch (fil) {
	                  case 'StartDay':
	                    // reportParams[paramKey] = this.$Utils.stringToDate(this.$Utils.getDateTimeByKey('WeekStart'));
	                    break;
	                  case 'EndDay':
	                    break;
	                  case 'StartWeek':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('WeekStart');
	                    break;
	                  case 'EndWeek':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('WeekEnd');
	                    break;
	                  case 'StartMonth':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('MonthStart');
	                    break;
	                  case 'EndMonth':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('MonthEnd');
	                    break;
	                  case 'StartYear':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('YearStart');
	                    break;
	                  case 'EndYear':
	                    reportParams[paramKey] = this.$Utils.getDateTimeByKey('YearEnd');
	                    break;
	                }
	                break;
	            }
	          } else {
	            if (key == paramKey.substring(paramKey.indexOf('_') + 1, paramKey.length)) {
	              reportParams[paramKey] = '';
	            } else {
	              reportParams[paramKey] = reportParams[paramKey.substring(0, paramKey.indexOf('_') + 1) + key];
	            }
	          }
	        }
	      });

	      /**
	       * gọi đến function lấy dữ liệu báo cáo
	       * reportParams: request search dữ liệu
	       * arrayFields: danh sách cấu hình các field X, Y, V... cho báo cáo chính và các báo cáo phụ
	       *
	       * resultData: dữ liệu trả về gồm R1{formatData: danh sách các tiêu đề, valueReport: giá trị của X, Y, V}, R2, R3...
	       */
	      this.getDataTemplate(reportParams).then( resultData => {
	        // console.log(resultData)
	        /**
	         * gọi đến hàm lọc các dữ liệu cho báo cáo phụ theo setting
	         * resultData: dữ liệu được trả về từ hàm trên
	         * arrayFields: cấu hình các fields X, Y, V
	         *
	         * extraData: mảng các dữ liệu từ báo cáo phụ, trả về mảng rỗng nếu không có báo cáo phụ
	         */
	        this.mergeReportData(resultData).then(reportData => {
	          /** tạo danh sách các hàng chỉ hiển thị dựa trên category và this.categoryDisplay */
	          if (this.categoriesDisplay && this.categoriesDisplay.length > 0) {
	            var categoriesIndex = {index: [], cate: []};
	            $.each(this.categoriesDisplay, (kC, category) => {
	              $.each(resultData.R1.formatData.category[0], (index, cat) => {
	                if (category == cat.name) {
	                  categoriesIndex.index.push(index);
	                  categoriesIndex.cate.push(cat);
	                }
	              });
	            });
	            resultData.R1.formatData.category[0] = categoriesIndex.cate;

	            $.each(resultData.R1.formatData.arrData[0], (k, val) => {
	              if (categoriesIndex.index.indexOf(k) < 0) {
	                resultData.R1.formatData.arrData[0][k] = undefined;
	              }
	            });
	            resultData.R1.formatData.arrData[0].clean();
	            $.each(reportData, (kS, series) => {
	              $.each(series.data, (k, val) => {
	                if (categoriesIndex.index.indexOf(k) < 0) {
	                  series.data[k] = undefined;
	                }
	              });
	              $.each(categoriesIndex.index, (kI, ind) => {
	                if (!series.data[ind]) {
	                  series.data[ind] = 0;
	                }
	              });
	              series.data.clean();
	            });
	          }
	          var rD = this.$Lodash.cloneDeep(reportData);
	          this.formatReportExpression(rD).then(seriesGroup => {

	            if (this.$Utils.isEmpty(this.sortIndex) && this.sortIndex.length > 0) {
	              $.each(seriesGroup, (kS, ser) => {
	                var data = [];
	                $.each(this.sortIndex, (kI, index) => {
	                  data.push(ser.data[index]);
	                });
	                ser.data = data;
	              });
	              var cateData = [], arrData = [];
	              $.each(this.sortIndex, (kI, index) => {
	                cateData.push(resultData.R1.formatData.category[0][index]);
	                arrData.push(resultData.R1.formatData.arrData[0][index]);
	              });
	              resultData.R1.formatData.category[0] = cateData;
	              resultData.R1.formatData.arrData[0] = arrData;
	            }
	            this.reports['viewModel']['isLoading'] = false;
	            /** tạo dữ liệu cho biểu đồ */
	            this.createChartData(this.$Lodash.cloneDeep(resultData.R1.formatData.category[0]), this.$Lodash.cloneDeep(seriesGroup));
	            /** tạo dữ liệu cho bảng */
	            if(this.reports['ShowTable'] != false){
	              $.each(seriesGroup, (kS, series) => {
	                if (resultData.R1.formatData.arrData.length > this.fields.R1Data.X.count) {
	                  var jump = 1;
	                  for (var i = this.fields.R1Data.X.count; i <= resultData.R1.formatData.arrData.length - this.fields.R1Data.X.count; i++) {
	                    jump = jump * resultData.R1.formatData.arrData[i].length;
	                  }
	                  for (var i = 0; i < jump; i++) {
	                    var count = i, total = 0;
	                    while (count <= series.data.length) {
	                      if (series.data[count]) {
	                        total += parseInt(series.data[count]);
	                      }
	                      count += jump;
	                    }
	                    series.data.push(total);
	                  }
	                } else {
	                  var total = 0;
	                  var ser = this.$Lodash.cloneDeep(series);
	                  $.each(ser.data, (kV, val) => {
	                    total += val;
	                  });
	                  if(ser.setting && ser.setting.SummaryType == "Average") {
	                  	if(ser.data.length > 0)
	                  		total = total/ser.data.length;
	                  }
	                  series.data.push(total);
	                }
	              });
	              this.createTableData(resultData.R1.formatData, seriesGroup);
	            }
	          });
	        // }, () => {
	        //   this.reports['viewModel']['reportNull'] = true;
	        //   this.reports['viewModel']['isLoading'] = false;
	        });
	      }, msg => {
	        this.reports['viewModel']['reportNull'] = true;
	        this.reports['viewModel']['isLoading'] = false;
	        this.dataBinding = 'Không có dữ liệu!';
	      });
	    },
	    setTableAndChartWidth() {
          if (this.reports['TableProportion']) {
            this.reports['viewModel']['flexTable'] = this.reports['TableProportion'];
          } else if (this.$Utils.isEmpty(this.reports['formatData'], 'reportDataTable.tableTB')) {
            if (this.reports['formatData']['reportDataTable']['tableTB'].length > 0) {
              if (this.reports['formatData']['reportDataTable']['tableTB'][0].length >= 6) {
                this.reports['viewModel']['classTable'] = '100';
                if (this.reports['formatData']['gObject'].length == 1) {
                  this.reports['formatData']['gObject'][0]['ColumnFlex'] = this.reports['ReportProportion'];
                }
              } else if (this.$Utils.isEmpty(this.reports['formatData']['gObject'][0])) {
                this.reports['formatData']['gObject'][0]['ColumnFlex'] = this.reports['ReportProportion'];
              }
            } else {
              this.reports['viewModel']['reportNull'] = true;
            }
          }
          this.dataBinding = '';
        }

	},
	watch: {
		SearchIndex: function(val){
			//console.log(val)
		//	console.log(this.$Lodash.cloneDeep(this.Filter))
			//console.log(this.Filter)
			this.dataBinding = 'Đang tải ...'
			this.reports['viewModel']['reportNull'] = false;
            this.refreshReport(this.Filter);
        },
	},
	created(){
		this.reports['viewModel'] = {
            isLoading: true,
            flexTable: 33,
            flexChart: 66,
            reportError: false,
            reportNull: false,
            reportName: this.$Utils.isEmpty(this.reports, 'Caption') ? this.reports['Caption'] : '',
            reportReady: false
          };
          this.reports['formatData'] = {
            gObject: [],
            tableValue: {head: [], body: []},
            reportDataTable: {tableTHG: [], tableTH: [], tableTB: []},
            chartData: {categories: [], series: []},
            seriesNumber: 0
          };
		if(this.$isMobileDevice == true){
        this.MobileClass = "mobile";
      }
      if (this.$Utils.isEmpty(this.reports['AdvanceSetting'])) {
        if (this.reports['AdvanceSetting']['Value']) {
          $.each(this.$Utils.stringToObject(this.reports['AdvanceSetting']['Value']), (k, v) => {
            this.reports['AdvanceSetting'][k] = v;
          });
        }
        if (this.reports['AdvanceSetting']['ExtraSetting']) {
          $.each(this.$Utils.stringToObject(this.reports['AdvanceSetting']['ExtraSetting']), (k, v) => {
            if (v.indexOf('.EQUALTO') >= 0) {
              v = v.replaceAll('.EQUALTO', '=').replaceAll('.AND', '&');
            }
            this.reports['AdvanceSetting'][k] = v;
          })
        }
      }
      if(this.$Utils.isEmpty(this.reports['FormRequest'])){
        this.ShowTree = false;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = this.reports['FormRequest'];
        request = this.$Utils.updateParamsSingleRequest(request, this.$Utils.stringToObject(this.reports['FormCode']));
        this.$Utils.post(request).then(result => {
          this.object = this.$Utils.getDataWithRoot(result, 'R1.' + this.reports['FormDataRoot']);
        })
      }
      /**
       * Tạo request lấy setting báo cáo từ máy chủ
       *
       * error: biến dùng để kiểm tra có lỗi trong setting lấy dữ liệu
       */
      var paramSettings = this.$Lodash.cloneDeep(this.$singleRequest);
      paramSettings.RequestTemplate = 'Setting.Report.SearchList';
      paramSettings.TotalRequests = 1;
      paramSettings.R1_ParentCode = this.reports['Code'];
      this.fields = this.getReportSetting(paramSettings);
      // if (this.reports['AutoSearch'] || this.research) {
      var searchCondition = {};
      searchCondition['PlanStartDateStartValue'] = this.$Utils.getDateTimeByKey('WeekStart')
      searchCondition['PlanStartDateEndValue'] = this.$Utils.getDateTimeByKey('WeekEnd')
      this.refreshReport(searchCondition);
        // this.refreshReport(this.$Utils.getDataWithRoot(this.reports, 'parentSetting.set.ParentFilterCondition'));
      // }
	}
}
</script>

<style lang="scss">
	.dynamic-report {
		.reports-header {
			white-space:nowrap;
			flex-wrap: nowrap;
		}
		.reports-title {
			white-space: nowrap;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    color: #333;
		    padding-left: 20px;
		}

		.md-toolbar-tools {
			button {
				padding: 0px;
			}
		}

		table.report-table {
	      tbody tr:last-child td {
	        font-weight: bold;
	        background: #fff;
	        color: #ff0000;
	        padding-left: 25px !important;
	      }

	      tbody td:first-child {
	        padding-left: 25px !important;
	        white-space: nowrap;
	      }
	    }
	}
</style>
