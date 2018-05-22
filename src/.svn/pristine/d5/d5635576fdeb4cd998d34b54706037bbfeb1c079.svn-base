<template>
  <el-container class="list-filter">
 <!--    <el-header>
      Header
    </el-header> -->
    <el-main>
      <div class="text-center" v-if="pSetting.DisplayType == 'OneColumn'">
        <button class="btn btn-secondary bg-white mr-2" @click="onSubmit">Tìm kiếm</button>
        <button class="btn btn-secondary bg-white" @click="onClear()">Xóa trắng</button>
      </div>
      <el-form :inline="false" :model="formInline" class="demo-form-inline" ref="dynamicfilterform">
        <el-col :span="24">
          <div  v-for="gFil in filter" class="row w-100" v-if="gFil && gFil.length > 0">
            <el-form-item v-for="item in gFil" :key="item.Code"  :label="item.Caption" :class="pSetting.DisplayType == 'OneColumn' ? 'col-md-12' : item.FieldColumnType == 'DateTime' ? 'col-md-4' : 'col-md-2'" v-if="item">
              <DynamicInput :name="item.Name" :item="item" :callback='handleChildChange'/>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-main>
    <el-footer v-if="pSetting.DisplayType != 'OneColumn'">
      <el-button style="float: right; margin-left: 10px" type="default" @click="onClear()">Xóa trắng</el-button>
      <el-button style="float: right; margin-left: 10px" type="primary" @click="onSubmit">Tìm kiếm</el-button>
    </el-footer>
  </el-container>
</template>


<script>

  import DynamicInput from '@/components/dynamic/DynamicInput'
  export default {
    props: [ 'pSetting', 'callback', 'filterCode'],
    components: {
      DynamicInput
    },
    data() {
      return {
        formInline: {
          // searchKey: '',
          // versionproject: '',
          // worker: '',
          // manager: '',
          // priority: '',
          // type: '',
          // startdate: '',
          // enddate: '',
          // region: '',
          // project: '',
          // status: '',
          // ParentCategory: '',
        },
        SelectedCategory: '',
        sortedFilter: [],
        SettingFilter: [],
        objFields: {},
        setFilterSetting: false,
        FilterSettings: '',
        dataSource: [],
        Setting: [],
        groupcategories: [],
        DataList: {},
        filterParams: [],
        viewModel: {},
        arrElements: [],
        objSourceData: {},
        arrResult: {},
        filter: {},
      }
    },
    methods: {
      handleChildChange(item){
        // this.filterParams[item.name] = item.values;
        this.formInline[item.name] = (item.model.ElementType =="Text" && item.model.FieldColumnType =="DateTime") ? this.$Utils.formatDateTime(item.values) : item.values;
        if (item.model.ElementType === 'Select' || item.model.ElementType === 'Multi' || item.model.ElementType === 'Radio' || item.model.ElementType === 'Tree'|| item.model.ElementType === 'MultiTree') {
          var ori = {};
          if(this.$Utils.isEmpty(item.model, 'Data')){
            if(item.values && item.values!= '' && typeof item.values !=='string'){
              // item.oldValues = this.$Lodash.cloneDeep(item.values)
              item.newValues = '';
              item.valuesName = "";
              ori = [];
              var sourceData = item.model.sourceData ? item.model.sourceData : item.model.Data
              item.values.forEach((val) =>{
                var obj = sourceData.filter((el) => {
                  return el[item.model.SavedKey] == val;
                })[0];
                if(obj){
                  item.newValues += val + ';';
                  item.valuesName += obj[item.model.SavedText] + ';';
                  ori.push(obj);
                }
              })
              this.arrResult[item.name] = {
                name: item.name,
                value: item.newValues,
                validate: true,
                setting: item.model,
                ori: ori,
                submit: true
              }
              // this.arrResult[item.name + 'Name'] = {
              //   name: item.name + 'Name',
              //   value: item.valuesName,
              //   validate: true,
              //   setting: item.model,
              //   ori: ori,
              //   submit: true
              // }
              
            }else{
              ori = item.model.Data.filter((el) => {
                return el[item.model.SavedKey] == item.values;
              })[0];
              if(ori){
                this.arrResult[item.name] = {
                  name: item.name,
                  value: item.values,
                  validate: true,
                  setting: item.model,
                  ori: ori,
                  submit: true
                }
                // this.arrResult[item.name + 'Name'] = {
                //   name: item.name + 'Name',
                //   value: ori[item.model.SavedText],
                //   validate: true,
                //   setting: item.model,
                //   ori: ori,
                //   submit: true
                // }
              } else
                delete this.arrResult[item.name]
            }
          }
        } else if (item.model.ElementType =="Text" && item.model.FieldColumnType =="DateTime") {
          if (this.$Utils.isEmpty(item.values, '1')) {
            this.arrResult[item.name + 'StartValue'] = {
              name: item.name + 'StartValue',
              value: this.$Utils.formatDateTime(item.values[0]),
              display: this.$Lodash.cloneDeep(this.$Utils.formatDateTime(item.values[0], 'DD/MM/YYYY HH:mm')),
              // oldDisplay: this.objSourceData[item.name],
              setting: item.model,
              submit: true,
              validate: true
            };
          } else
              delete this.arrResult[item.name + 'StartValue']
          if (this.$Utils.isEmpty(item.values, '1')) {
            var e = item.values[1];
            e.setHours(23, 59, 59);
            this.$Utils.formatDateTime(e);
            this.arrResult[item.name  + 'EndValue'] = {
              name: item.name + 'EndValue',
              value: this.$Utils.formatDateTime(e),
              display: this.$Lodash.cloneDeep(this.$Utils.formatDateTime(e, 'DD/MM/YYYY HH:mm')),
              // oldDisplay: this.objSourceData[item.name],
              setting: item.model,
              submit: true,
              validate: true
            };
          } else
              delete this.arrResult[item.name + 'EndValue']
        } else{
          this.arrResult[item.name] = {
            name: item.name,
            value: item.values,
            display: this.$Lodash.cloneDeep(this.objSourceData[item.name]),
            oldDisplay: this.objSourceData[item.name],
            setting: item.model,
            validate: true,
            submit: true,
          };
        }
        // console.log(item);
      },
      onSubmit() {
        var ctrl = this;
        // console.log(this.arrResult)
        // if(this.callback) this.callback(this.arrResult);
        var array = $.map(ctrl.arrResult, function(value, index) {
            return [value];
        });
        if(ctrl.Setting.functions.onFilter)
          ctrl.Setting.functions.onFilter(array, ctrl.Setting);
      },

      childTreeUpdate(){

      },
      // resetForm(formname){
      //   // this.$hub.$emit('clear-input')
      //   // console.log(this);
      // },
      onClear(element) {
        if (this.$Utils.isEmpty(element)) {
          element.clearData();
        } else {
          $.each(this.filter, (k, g) => {
            g.forEach((e) => {
              e.clearData();
            });
          });
        }
      },
      autoLoad() {
        var ctrl = this;
        /**kiểm tra dữ liệu lọc cũ có tồn tại*/
        var filters = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.FilterData);
        if (ctrl.$Utils.isEmpty(ctrl.Setting.viewModel, "urlObject")) {
          if (!ctrl.Setting.parentSetting) {
            ctrl.Setting.parentSetting = {};
          }
          if (!ctrl.$Utils.isEmpty(ctrl.Setting.parentSetting.object)) {
            ctrl.Setting.parentSetting.object = {};
          }
          $.each(ctrl.Setting.viewModel.urlObject, function(key, value) {
            if (key != "Limit" && key != "Page")
              ctrl.Setting.parentSetting.object[key] = value;
            if (key.indexOf("Name") >= 0) {
              ctrl.Setting.parentSetting.object[key] = decodeURI(value);
            }
          })
        } else {
          if (filters && filters != "undefined") {
            filters = JSON.parse(filters);
            if (ctrl.$Utils.isEmpty(filters[ctrl.viewModel.filterKey])) {
              if (!ctrl.Setting.parentSetting) {
                ctrl.Setting.parentSetting = {};
              }
              if (!ctrl.$Utils.isEmpty(ctrl.Setting.parentSetting.object)) {
                ctrl.Setting.parentSetting.object = filters[ctrl.viewModel.filterKey]
              }
            }
          }
        }
        /** all fields object*/
        ctrl.objFields = {};
        /** List ElementChild, that will be sorted by Index */
        ctrl.arrElements = [];
        ctrl.Setting.Fields.forEach(function(element) {
          /** đè các giá trị mặc định từ filer lên*/
          var type = ctrl.Setting.ModuleType;
          $.each(element, function(key, val) {
            if (key.indexOf(type) == 0 && key.length > type.length) {
              element[key.substring(type.length, key.length)] = val;
            }
          });
          if (element.FieldColumnType == 'DateTime') {
            if (ctrl.Setting.Pagination == 'true' && element.Name == ctrl.Setting.WeekField) {
              element.Week = 'true'
            }
            element.ColumnFlex = ctrl.Setting.DefaultFlex * 2;
            element.DateMode = 'range';
          }
          /**
           * Nếu trường trong filter là loại select hoặc multi thì thêm các trường Code, Field,
           FieldType, IncludeSubmit, Request, DataRoot vối giá trị lấy trong filter
           * Nếu trong filter không có giá trị thì lấy giá trị trong form của datagroup
           */
          element.ElementType = element.ElementType ? element.ElementType : element.FormElementType;
          ctrl.objFields[element.Name] = element;
          $.each(element, function(key, val) {
            if (key.indexOf(type) == 0 && key.length > type.length) {
              element[key.substring(type.length, key.length)] = val;
            }
          });
          if (element.ElementType == 'Select' || element.ElementType == 'Multi' || element.ElementType == 'Radio' || element.ElementType == 'Tree' || element.ElementType == 'MultiTree') {
            element.Code = element.FilterCode ? element.FilterCode : element.FormCode;
            element.Field = element.FilterField ? element.FilterField : element.FormField;
            element.FieldType = element.FilterFieldType ? element.FilterFieldType : element.FormFieldType;
            element.IncludeSubmit = element.FilterIncludeSubmit ? element.FilterIncludeSubmit : element.FormIncludeSubmit;
            element.Request = element.FilterRequest ? element.FilterRequest : element.FormRequest;
            element.DataRoot = element.FilterDataRoot ? element.FilterDataRoot : element.FormDataRoot;
            element.RequireOriginal = false;
            // element.DisplayText = element.FilterDisplayText ? element.FilterDisplayText : element.FormDisplayText;
            // element.SavedKey = element.FilterSavedKey ? element.FilterSavedKey : element.FormSavedKey;
            // element.SavedText = element.FilterSavedText ? element.FilterSavedText : element.FormSavedText;

            element.DisplayText = element.FilterDisplayText ? element.FilterDisplayText.replace(/{{/g, "").replace(/}}/g, "") : element.FormDisplayText ? element.FormDisplayText.replace(/{{/g, "").replace(/}}/g, "") : "Name";
              element.SavedKey = element.FilterSavedKey ? element.FilterSavedKey.replace(/{{/g, "").replace(/}}/g, "") : element.FormSavedKey ? element.FormSavedKey.replace(/{{/g, "").replace(/}}/g, "") : "Id";
              element.SavedText = element.FilterSavedText ? element.FilterSavedText.replace(/{{/g, "").replace(/}}/g, "") : element.FormSavedText ? element.FormSavedText.replace(/{{/g, "").replace(/}}/g, "") : "Name";
          }
          

          element.setFormObject = function(object) {
            ctrl.defaultData = ctrl.$Lodash.cloneDeep(object);
            ctrl.objSourceData = ctrl.$Lodash.cloneDeep(object);
          };
          element.Dependency = [];
          ctrl.Setting.Dependencies.forEach(function(depend) {
            if (depend.Target === element.Name) {
              element.Dependency.push(depend);
            }
          });
          /**
           * function kiểm tra khi giá trị trong element thay đổi, gọi đến hàm sử lý dependency
           * @param data: dữ liệu đã thay dổi, được gửi lên từ element
           */
          element.onChange = function(data) {
            ctrl.Setting.functions.checkDependencies(data);
          };
          element.onComponentSearch = ctrl.onComponentSearch;
          ctrl.arrElements.push(element);
        });
        /**
         * Tạo danh sách các field của filter
         * Sắp xếp lại thứ tự của các trường trong filter theo thứ tự trong ListFields
         */
        ctrl.Setting.Groups.forEach(function(groupFilter) {
          if (groupFilter.ListFields) {
            if (groupFilter.Caption == "Lọc chính") {
              groupFilter.Name = "Main";
            } else if (groupFilter.Caption == "Lọc nâng cao") {
              groupFilter.Name = "Advanced";
            }
            ctrl.filter[groupFilter.Name] = [];
            groupFilter.ListFields.split(';').forEach(function(fieldName) {
              if (fieldName && ctrl.objFields[fieldName]) {
                ctrl.filter[groupFilter.Name].push(ctrl.objFields[fieldName]);
              }
            });
          }
        });
        var objSharedComponent = {
          key: ctrl.viewModel.filterKey,
          arrComponent: ctrl.filter.Advanced,
          arrMain: ctrl.filter.Main,
          functions: ctrl.Setting.functions,
          data: ctrl.$Utils.getDataWithRoot(ctrl.Setting, 'parentSetting.object')[0]
        };
        if (ctrl.Setting.IsDashboard == 'true') {
          objSharedComponent.IsDashboard = 'true';
        }
        if (ctrl.Setting.ExtraPageFilter == 'true') {
          // ctrl.Setting.LinkedObject.setFilterSideNav(objSharedComponent);
          if (objSharedComponent.arrMain) {
            var mainFilter = {};
            $.each(objSharedComponent, function(key, val) {
              if (key != "arrComponent") {
                mainFilter[key] = val;
              }
            })
            // sharedFilterProperties.setFilterSetting(objSharedComponent);
          } else {
            // ctrl.filter.Show = 'false';
            // ctrl.Setting.viewModel.PaginationFlex = 100;
          }
        } else {
          // sharedFilterProperties.setFilterSetting(objSharedComponent);
        }
        ctrl.Setting.functions.getRequireNotNullFields().then(function() {
          /**truyền cấu hình sang quick-panel*/
          setTimeout(function() {
            if (ctrl.$Utils.isEmpty(ctrl.Setting.AutoSearch) && ctrl.Setting.AutoSearch != 'false') {
              ctrl.Setting.functions.onPagination(ctrl.Setting.viewModel.currentPage);
            }
          }, 1000);
        });
      },
      getRequireNotNullFields() {
        var ctrl = this;
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            if (typeof ctrl.Setting.FieldNotNull === 'string' && ctrl.Setting.FieldNotNull != '') {
              var arrNotNullField = ctrl.Setting.FieldNotNull.split(';');
              var requestSearch = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
              var arrFieldSetting = [];
              requestSearch.TotalRequests = 0;
              arrNotNullField.forEach(function(fName) {
                if (ctrl.$Utils.isEmpty(ctrl.objFields, fName + '.Request')) {
                  var field = ctrl.objFields[fName];
                  arrFieldSetting.push(field);
                  requestSearch.TotalRequests++;
                  requestSearch['R' + requestSearch.TotalRequests + '_RequestTemplate'] = field.Request;
                  requestSearch = ctrl.$Utils.updateParamsSingleRequest(requestSearch, ctrl.$Utils.stringToObject(field.Code), requestSearch.TotalRequests)
                }
              });
              if (requestSearch.TotalRequests == 0) {
                resolve();
                return false;
              }
              ctrl.$Utils.postCheckResult(requestSearch).then(function(result) {
                ctrl.notNullObject = {};
                $.each(arrFieldSetting, function(index, field) {
                  ctrl.notNullObject[field.Name] = '';
                  var rootData = field.DataRoot ? field.DataRoot : 'Data';
                  var saveValue = field.SavedKey ? field.SavedKey : '{{Id}}';
                  var data = ctrl.$Utils.getDataWithRoot(result, 'R' + (index + 1) + '.' + rootData);
                  data.forEach(function(item) {
                    ctrl.notNullObject[field.Name] += ctrl.$Utils.expressionToString(item, saveValue) + ';';
                  });
                });
                resolve();
              });
            } else {
              resolve();
            }
          });
        })
      },
      checkDependencies(data) {
        var ctrl = this;
        ctrl.Setting.Dependencies.forEach(function(depend) {
          if (ctrl.$Utils.isEmpty(data.name) && depend.Source === data.name) {
            if (ctrl.$Utils.isEmpty(ctrl.objFields, depend.Target + '.dependencyChange')) {
              ctrl.objFields[depend.Target].dependencyChange(depend, data);
            } else if (ctrl.$Utils.isEmpty(depend.DependOn) && depend.DependOn.indexOf('.') > 0 &&
              ctrl.$Utils.isEmpty(ctrl.Setting.Fields, depend.DependOn.substring(0, depend.DependOn.indexOf('.')) + '.dependencyChange')) {
              ctrl.Setting.Fields[depend.Target.substring(0, depend.Target.indexOf('.'))].dependencyChange(data);
            }
          }
        });
      },
      onComponentSearch(arrResult) {
        var ctrl = this;
        ctrl.Setting.functions.onPagination(1, arrResult);
      },

    },
    mounted() {
      /*
      var params = this.$Lodash.cloneDeep(this.$singleRequest);
      params.R1_RequestTemplate = 'Setting.SearchBase';
      params.R1_ParentCode = 'xSetting.Default.SettingProject';
      this.$Utils.post(params).then((data) => {
        this.Setting = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
        this.Setting.forEach((val) => {
          if (val.Name == "Report") {
            this.reportUrl = val.Value;
          }
          if (val.Name == "Filter"){}
            //this.filterCode = val.Value;
        })
        });
        */
        
        this.Setting = this.pSetting;
        if(!this.Setting.functions)
          this.Setting.functions = {}
        this.Setting.functions.autoLoad = this.autoLoad;
        this.Setting.functions.getRequireNotNullFields = this.getRequireNotNullFields;
        this.Setting.functions.checkDependencies = this.checkDependencies;
        this.Setting.functions.onComponentSearch = this.onComponentSearch;
        this.viewModel = {
          filterKey: this.$route.params.url + this.Setting.Code,
          redirectUrl: '#'
        };

        this.filter = {};

        this.Setting.functions.autoLoad();
       //this.getFilter();
      
    }
  }
</script>

  <style lang="scss">
    .list-filter{
      .el-main{
        padding: 0px;
        // padding-bottom: 15px;
        padding-left: 10px;
        background-color: #fff;

        .demo-form-inline{
          .el-col{
            .el-form-item{
              margin: 0px;
              height: 46px;
              // margin-bottom: 5px;

              label{
                width: 100%;
                text-align: left;
                line-height: 10px;
                font-size: 11px;
                margin-bottom: 0px;
              }
              .el-form-item__content{
                display: block;
                padding: 5px;

                .el-form-item__error {
                  right: 0;
                  left: auto;
                }

                .el-input__inner {
                  // padding-left: 28px;
                  width: 100% ;
                }

                .el-range-editor {
                  //padding-left: 28px;
                  max-width: 100%;
                }


                .el-select{
                  width: 100%;
                }

                .el-cascader {
                  width: 100%;
                }

                .el-date-editor{
                  width: 100%;
                }

                .el-header {
                  max-height: 30px;
                  line-height: 30px;
                  background-color: #20a8d8;
                  font-size: 1.09375rem;
                  color: #fff;
                }
              }
            }

            .header-ele {
              padding: 0px;
              margin-bottom: 10px;
            }
          }
        }
      }


      .el-footer{
        padding: 0px;
        padding-right: 10px;
        height: 30px !important;
        .el-collapse{
          //margin: 20px;
        }

        .el-button--mini {
          padding: 5px 15px;
        }

        .card{
          border: none;
          margin-bottom: 0px;
        }
        .button-list {
          background-color: #f0f8ff;
        }
      }
    }
  </style>

