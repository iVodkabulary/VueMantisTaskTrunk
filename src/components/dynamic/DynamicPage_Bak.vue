<template>
  <div class="dynamic-page">
    <!-- <div class="page-header mb-2" v-if="!formPage && !reportPage">
        <div class="bg-primary py-1 px-3">
          <div class="row">
            <h5 class="col m-auto"><i class="icon-puzzle"></i><span>{{currentPage.Caption}}</span></h5>
            <div class="col text-right pr-0" v-if="pageDescriptions.Filters && pageDescriptions.Filters.length > 0">
              <button class="btn btn-link text-white" v-b-modal.chartFilter>
                <i class="fa fa-filter fa-lg"></i>
              </button>
              <b-btn v-b-modal.modal-center></b-btn>
              <b-modal id="modal-center" centered title="Bootstrap-Vue">
                <p class="my-4">Vertically centered modal!</p>
              </b-modal>
            </div>

            <b-modal id="chartFilter" title="Bộ lọc" class="text-primary" header-bg-variant="primary" hide-footer>
              <template>
                <div>
                  <div class="text-center">
                    <button class="btn btn-secondary bg-white mr-2" @click="search()">Tìm kiếm</button>
                    <button class="btn btn-secondary bg-white" @click="clearInput()">Xóa trắng</button>
                  </div>
                  <p class="my-2">Lọc chính</p>

                </div>
              </template>
            </b-modal>
          </div>
        </div>
      </div> -->
    <div v-for="pModule in formatData" :key="pModule.ModuleCode" v-if="!reportPage" class="row">
      <el-collapse class="header-filter" v-model="activeName"  v-if="pModule.ModuleType == 'Filter'" >
        <el-collapse-item name="true">
          <template slot="title">
            <span>Bộ lọc &nbsp;</span><i class="fa fa-filter fa-lg"></i>
          </template>
          <DynamicFilter :pSetting="pModule"></DynamicFilter>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-for="pModule in formatData" :key="pModule.ModuleCode" v-if="!reportPage">
      <!-- <DynamicFilter :pSetting="pModule"  v-if="pModule.ModuleType == 'Filter'" /> -->
      <DynamicList :pSetting="pModule" v-if="pModule.ModuleType == 'List'" />
      <DynamicForm :pSetting="pModule" v-if="pModule.ModuleType == 'Form'" />
    </div>
    <div v-if="reportPage">
      <DynamicCharts :mSetting="formatData" :pSetting="currentPage" v-if="formatData && formatData.length > 0"/>
    </div>
  </div>
</template>
<script>
import DynamicCharts from "@/components/DynamicCharts";
import DynamicForm from "@/components/dynamic/DynamicForm";
import DynamicList from "@/components/dynamic/DynamicList";
import DynamicFilter from "@/components/dynamic/DynamicFilter";
import DynamicReport from "@/components/dynamic/DynamicReport";

export default {
  components: {
    DynamicCharts,
    DynamicList,
    DynamicForm,
    DynamicFilter,
    DynamicReport
  },
  props: ['data'],
  data() {
    return {
      activeName: '',//this.$isMobileDevice ? '' : 'true',
      currentPage: {},
      pageModules: [],
      pageDescriptions: [],
      listReport: [],
      formatData: [],
      objFields: {},
      sortedFilter: [],
      DataList: {},
      searchIndex: 0,
      filter: {},
      formPage: false,
      reportPage: false,
      Setting: {},
    };
  },
  created() {
    // if(this.data){

    // }
    //this.loadSettingData(JSON.parse(this.currentPage.Value), (formatData) =>{
    //console.log(formatData)
    // formatData = formatData[0];
    //   $.each(formatData[0].Fields, (key, value) => {
    //   formatData[0].Fields[key].ElementType = value.FilterElementType ? value.FilterElementType : value.FormElementType;
    //   if (formatData[0].Fields[key].ElementType === 'Select' || formatData[0].Fields[key].ElementType === 'Multi' || formatData[0].Fields[key].ElementType === 'Radio' || formatData[0].Fields[key].ElementType === 'Tree') {
    //     formatData[0].Fields[key].Code = value.FilterCode ? value.FilterCode : value.FormCode;
    //     formatData[0].Fields[key].Field = value.FilterField ? value.FilterField : value.FormField;
    //     formatData[0].Fields[key].FieldType = value.FilterFieldType ? value.FilterFieldType : value.FormFieldType;
    //     formatData[0].Fields[key].IncludeSubmit = value.FilterIncludeSubmit ? value.FilterIncludeSubmit : value.FormIncludeSubmit;
    //     formatData[0].Fields[key].Request = value.FilterRequest ? value.FilterRequest : value.FormRequest;
    //     formatData[0].Fields[key].DataRoot = value.FilterDataRoot ? value.FilterDataRoot : value.FormDataRoot;
    //     formatData[0].Fields[key].RequireOriginal = false;
    //     formatData[0].Fields[key].DisplayText = value.FilterDisplayText ? value.FilterDisplayText.replace(/{{/g, "").replace(/}}/g, "") : value.FormDisplayText ? value.FormDisplayText.replace(/{{/g, "").replace(/}}/g, "") : "Name";
    //     formatData[0].Fields[key].SavedKey = value.FilterSavedKey ? value.FilterSavedKey.replace(/{{/g, "").replace(/}}/g, "") : value.FormSavedKey ? value.FormSavedKey.replace(/{{/g, "").replace(/}}/g, "") : "Id";
    //     formatData[0].Fields[key].SavedText = value.FilterSavedText ? value.FilterSavedText.replace(/{{/g, "").replace(/}}/g, "") : value.FormSavedText ? value.FormSavedText.replace(/{{/g, "").replace(/}}/g, "") : "Name";
    //   }
    //   var type = 'Filter';
    //   $.each(formatData[0].Fields[key], (ckey, val) => {
    //     if (ckey.indexOf(type) === 0 && ckey.length > type.length) {
    //       formatData[0].Fields[key][ckey.substring(type.length, ckey.length)] = val;
    //     }
    //   });
    //   // if (formatData[0].Fields[key].FieldColumnType === 'DateTime') {
    //   //   formatData[0].Fields[key].ColumnFlex = 50;
    //   //   formatData[0].Fields[key].DateMode = 'range';
    //   // }
    //   this.objFields[formatData[0].Fields[key].Name] = formatData[0].Fields[key];
    //   formatData[0].Fields[key].Dependency = [];
    //   formatData[0].Dependencies.forEach((depend) => {
    //     if (depend.Target === formatData[0].Fields[key].Name) {
    //       formatData[0].Fields[key].Dependency.push(depend);
    //     }
    //   });
    //   // formatData[0].Fields[key].onChange = function(data) {
    //   //   this.checkDependencies(data);
    //   // }
    // });
    // var sortGroup = this.$Lodash.cloneDeep(formatData[0].Groups);
    // formatData[0].Groups.forEach((gItem) => {
    //   if (typeof gItem.ListFields == 'string') {
    //     gItem.ListFields.split(";").forEach((gvalue) => {
    //       formatData[0].Fields.forEach((value) => {
    //         if (value.Name === gvalue){
    //           if(value.ElementType === 'Select' || value.ElementType === 'Multi' || value.ElementType === 'Radio' || value.ElementType === 'Tree'){
    //             var sParms = this.$Lodash.cloneDeep(this.$singleRequest);
    //         sParms.R1_RequestTemplate = value.Request;
    //         sParms = this.$Utils.updateParamsSingleRequest(sParms, this.$Utils.stringToObject(value.Code));
    //         this.$Utils.post(sParms).then((arrayData) => {
    //           this.dataSource = [];
    //           arrayData = this.$Utils.getDataWithRoot(arrayData.R1, value.DataRoot ? value.DataRoot : 'Data' );
    //           if(sParms.R1_RequestTemplate == "User"){
    //             var arrData = this.$Lodash.cloneDeep(arrayData);
    //             arrayData = [];
    //             arrData.forEach((item) =>{
    //               if(item.LoginName != "superadmin"){
    //                 arrayData.push(item);
    //               }
    //             })
    //           }
    //           value.Data = arrayData;
    //           this.DataList[value.Name] = arrayData;
    //           value.DisplayText = value.DisplayText ? value.DisplayText.replace(/{{/g, "").replace(/}}/g, "")  : undefined;
    //             value.SavedKey = value.SavedKey ? value.SavedKey.replace(/{{/g, "").replace(/}}/g, "") : undefined;
    //             value.SavedText = value.SavedText ? value.SavedText.replace(/{{/g, "").replace(/}}/g, "")  : undefined;
    //             this[value.Name] = [];
    //           this.sortedFilter.push(value)
    //         });
    //           } else
    //             this.sortedFilter.push(value)
    //         }
    //       })
    //     })
    //   }
    // })
    //formatData = formatData;
    //})
  },

  mounted() {
    //console.log(this.data.url)
    // if (this.$route.params.url === "view-all-task-page") this.$router.push("/tasks")
    // else
   // if (this.$route.params.url === "knowhow-document")
    // this.$router.push("/knowhow-document");
    this.init();
    // if(this.data && this.data != null){
    //   if(this.data.url && this.data.url != null) this.$route.params.url = this.data.url;
    // }
    if(this.currentPage){
      this.pageModules = this.$Utils.jsonParse(this.currentPage.Value) ? this.$Utils.jsonParse(this.currentPage.Value) : {};
     this.pageDescriptions = this.$Utils.jsonParse(this.currentPage.Description) ? this.$Utils.jsonParse(this.currentPage.Description) : {};
    }

  },
  watch: {
    "$route.params.url": function(newUrl) {
      //alert(newUrl);
      //if ("view-all-task-page" === newUrl) this.$router.push("/tasks")
      //else
      //if ("knowhow-document" === newUrl) this.$router.push("/knowhow-document");
      //else this.init();
    }
  },
  methods: {
    callback() {},
    loadSettingData(moduleArray, callback) {
      //console.log(moduleArray)
      var formatData = [];
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_Code = "";
      request.R1_AssignedUser = this.$getItemLocalStorage(
         this.$localStorageConstant.SessionId
      )
      moduleArray.forEach(module => {
        if(module.Module){
          module.Module.forEach(child => {
            if (this.$Utils.isEmpty(child.listUsers, "0") && JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).UserId.indexOf(child.listUsers) >= 0) {
              request.R1_Code += child.ModuleCode + ";";
            } else if (this.$Utils.isEmpty(child.UserPermissions, "0")) {
              child.UserPermissions.forEach((permission) => {
                var Roles = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Roles;
                Roles.forEach((role) => {
                  if (permission == role.GroupId) {
                    request.R1_Code += child.ModuleCode + ";";
                  }
                })
                var Groups = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Groups;
                Groups.forEach((group) => {
                  if (permission == group.GroupId) {
                    request.R1_Code += child.ModuleCode + ";";
                  }
                })
              })
            } else if (!this.$Utils.isEmpty(child.listUsers, "0") || child.listUsers == []) {
              request.R1_Code += child.ModuleCode + ";";
            }
          });
        } else {
          if (this.$Utils.isEmpty(module.listUsers, "0") && JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).UserId.indexOf(module.listUsers) >= 0) {
            request.R1_Code += module.ModuleCode + ";";
          } else if (this.$Utils.isEmpty(module.UserPermissions, "0")) {
            module.UserPermissions.forEach((permission) => {
              var Roles = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Roles;
              Roles.forEach((role) => {
                if (permission == role.GroupId) {
                  request.R1_Code += module.ModuleCode + ";";
                }
              })
              var Groups = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Groups;
              Groups.forEach((group) => {
                if (permission == group.GroupId) {
                  request.R1_Code += module.ModuleCode + ";";
                }
              })
            })
          } else if (!this.$Utils.isEmpty(module.listUsers, "0") || module.listUsers == []) {
            request.R1_Code += module.ModuleCode + ";";
          }
        }
      });
      if (request.R1_Code == "") callback(formatData);
      else {
        this.$Utils.post(request).then(data => {
          data = this.$Utils.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
          //console.log(data)
          moduleArray.forEach(module => {
            for (var i = 0; i < data.length; i++) {
              if (module.ModuleCode == data[i].Code) {
                if ((["Form", "Filter", "List", "Report"].indexOf(module.ModuleType) != -1 ||
                  ["Form", "Filter", "List", "Report"].indexOf(module.SubElementType) != -1) &&
                  typeof data[i].Description === "string") {
                  var refModule = data[i];
                  if (refModule.ModuleType != "Filter") {
                    this.listReport.push({
                      Code: refModule.Code,
                      Name: refModule.Caption
                    });
                  }
                  if (module.ModuleType == "Form") {
                    this.formPage = true;
                  }
                  if (module.ModuleType == "Report") {
                    this.reportPage = true;
                  }
                  refModule.Description = refModule.Description
                    ? JSON.parse(refModule.Description)
                    : "";
                  if (module.ModuleType == "Filter") {
                    refModule.Description.FilterLink = this.$Utils.isEmpty(module.FilterLink) ? module.FilterLink.split(';') : [];
                    refModule.Description.functions = {
                      onFilter: this.onFilter,
                      // UrlData:  this.Setting.UrlData
                    }
                  }

                  if (this.$Utils.isEmpty(refModule, "F1")) {
                    refModule.Description.Fields = "";
                    for (var i = 1; i <= refModule.Description.FCount; i++) {
                      if (refModule["F" + i] != undefined) {
                        refModule.Description.Fields += refModule["F" + i];
                        delete refModule["F" + i];
                      }
                    }

                    refModule.Description.Fields =
                      typeof refModule.Description.Fields === "string"
                        ? JSON.parse(refModule.Description.Fields)
                        : [];
                  }
                  refModule.Description.Code = refModule.Code;
                  refModule.Description.DataGroup = refModule.Name;
                  refModule.Description.Value = refModule.Value;
                  refModule.Description.ModuleType = module.ModuleType;
                  if (typeof refModule.Description.AdditionConditions ==='string') {
                    refModule.Description.AdditionConditions = this.$Utils.stringToObject(refModule.Description.AdditionConditions, '&', '=');

                  }
                  if (module.ModuleType == "List") {
                    if(this.$Utils.isEmpty(this.$route.query) && refModule.Description.AdditionConditions && typeof refModule.Description.AdditionConditions === 'object'){
                       $.each(this.$route.query, (key, val) => {
                        refModule.Description.AdditionConditions[key] = val;
                       })
                    }
                  }
                  formatData.push(refModule.Description);
                  //console.log(refModule.Description)
                } else {
                  if (data[i].DisplaySetting != undefined)
                    formatData.push(JSON.parse(data[i].DisplaySetting));
                  break;
                }
              }
            }
          });
          callback(formatData);
        });
      }
    },

    loadUrlData(formatData) {
      return new Promise((resolve, reject) => {
        if (!this.$Utils.isEmpty(this.Setting.AutoLoad, 'length') && this.Setting.AutoLoad != "") {
          this.Setting.AutoLoad = [this.Setting.AutoLoad];
        }
        // this.Setting.AutoLoad = [{"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;Code;","Module":"Form.cap-nhat-danh-sach-san-pham.04848","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document","OtherCondition":"Id={{Id|Url}}"},
        //                      {"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;RequestFields;Code","Module":"List.crm-sanpham.0b1b7","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","OtherCondition":"CustomerId={{CustomerId|Url}}","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document"}]
        this.Setting.AutoLoad.forEach((loadFor) => {
          if (this.$Utils.isEmpty(loadFor, "Enable")) {
            // // formatData.AutoLoad = this.$Utils.stringToObject(formatData.AutoLoad);
            var objModuleFor = {};
            formatData.forEach((module) => {
              if (this.$Utils.isEmpty(module) && module.Code == loadFor.Module) {
                objModuleFor = module;
              }
            });
            switch (loadFor.Type) {
              case 'loadDataBase':
                if (!this.$Utils.isEmpty(objModuleFor.Code)) {
                  this.$Utils.showMessage('error', this.$toastMessage.settingTemplateError);
                  return false;
                }
                if (typeof loadFor.OtherCondition ==='string') {
                  $.each(this.$Utils.stringToObject(loadFor.OtherCondition), (key, value) => {
                    loadFor[key] = value;
                  })
                }
                var request = this.$Lodash.cloneDeep(this.$singleRequest);
                request.R1_RequestDataGroup = loadFor.DataGroup ? loadFor.DataGroup : objModuleFor.DataGroup;
                request.R1_RequestTemplate = loadFor.DataSource ? loadFor.DataSource + '.Search' : objModuleFor.DataSource + '.Search';
                if (typeof loadFor.AdditionConditions ==='string') {
                  loadFor.AdditionConditions = this.$Utils.stringToObject(loadFor.AdditionConditions);
                }
                /** Thêm điều kiện từ Setting.AdditionConditions */
                $.each(loadFor.AdditionConditions,(key, val) => {
                  request['R1_' + key] = val;
                });
                request.R1_RequestFields = '';
                if (this.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
                  var Links = objModuleFor.Link;
                  if (this.$Utils.isEmpty(Links)) {
                    var SubElementLinks = Links[loadFor.DataGroup]
                    SubElementLinks.forEach((value) => {
                      request.R1_RequestFields += value.Target + ';'
                      objModuleFor.Fields.forEach((field) => {
                        if (field.Name == value.Source && this.$Utils.isEmpty(field, 'DynamicText')) {
                          request.R1_RequestFields += value.Target + 'Name;'
                        }
                      });
                    })
                  }
                } else {
                  objModuleFor.Fields.forEach((field) => {
                    request.R1_RequestFields += field.Name + ';'
                  });
                }
                var conditionObject;
                if (typeof loadFor.Condition ==='string') {
                  conditionObject = {};
                  loadFor.Condition.split(';').forEach((key) => {
                    if (loadFor[key]) {
                      conditionObject[key.trim()] = loadFor[key];
                    }
                  });
                  if (!this.$Utils.isEmpty(objModuleFor.parentSetting)) {
                    objModuleFor.parentSetting = { object: {}, set: { GetFullData: 'false' } }
                  }
                }
                if (this.$Utils.isEmpty(conditionObject)) {
                  request = this.$Utils.updateParamsSingleRequest(request, conditionObject);
                }
                /** chuyển các biến trong parameter sang giá trị*/
                request = this.replaceExpression(request, objModuleFor.parentSetting.object);
                if (loadFor.AssignedUser == true) {
                  request.R1_AssignedUser = this.$getItemLocalStorage(this.$localStorageConstant.SessionId);
                }
                if (this.$isSystemAdmin() || this.$isMantisAdmin()) {
                  delete request.R1_AssignedUser
                }
                if (formatData.IsDetail != 'true' || objModuleFor.SubElements.length == 0) {
                  this.$Utils.postCheckResult(request).then((result) => {
                    if (result.success && result.R1.success) {
                      var rootData = typeof loadFor.RootData ==='string' ? loadFor.RootData : objModuleFor.RootData != "Data.DynamicDS.Setting" ? objModuleFor.RootData : "Data";
                      var data = this.$Utils.getDataWithRoot(result.R1, rootData)[0];
                      if (objModuleFor.RootData == "Data.DynamicDS.Setting" && this.$Utils.isEmpty(result)) {
                        data = this.$Utils.getDataWithRoot(result.R1, objModuleFor.RootData)[0];
                      }
                      result = data;
                      if (this.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
                        var Links = objModuleFor.Link;
                        if (this.$Utils.isEmpty(Links)) {
                          var SubElementLinks = Links[loadFor.DataGroup]
                          if (this.$Utils.isEmpty(SubElementLinks)) {
                            SubElementLinks.forEach((value) => {
                              if (this.$Utils.isEmpty(result[value.Target])) {
                                objModuleFor.parentSetting.object[value.Source] = result[value.Target];
                              }
                              if (this.$Utils.isEmpty(result[value.Target + "Name"])) {
                                objModuleFor.parentSetting.object[value.Source + "Name"] = result[value.Target + "Name"];
                              }
                            });
                          }
                        }
                      } else {
                        $.each(result, (key, val) => {
                          objModuleFor.parentSetting.object[key] = val;
                        });
                      }
                      resolve(formatData);
                    } else {
                      this.$Utils.showMessage('error', this.$toastMessage.loadingDataFailed);
                    }
                  });
                } else {
                  $.map(conditionObject, (value, index) => {
                    objModuleFor.parentSetting.object[index] = request["R1_" + index];
                  })
                  resolve(formatData);
                }
                break;
              case 'includeUrlData':
                //console.log(this.$route.fullPath)
                var url = $location.absUrl();
                if (url.indexOf('?') > 0 && objModuleFor.Code) {
                  var parameter = url.substring(url.indexOf('?') + 1, url.length);
                  parameter = this.$Utils.stringToObject(decodeURIComponent(parameter));
                  objModuleFor.parentSetting = objModuleFor.parentSetting ? objModuleFor.parentSetting : { object: {} };
                  $.each(parameter, (key, val) => {
                    objModuleFor.parentSetting.object[key] = val;
                  });
                }
                resolve(formatData);
                break;
              default:
                resolve(formatData);
                break;
            }
          } else {
            resolve(formatData);
          }
        })
      })
    },
    replaceExpression(request, object) {
      /** replace các giá trị là biến trong parameter với giá trị */
      $.each(request, (paramName, strVal) => {
        strVal = strVal + '';
        if (strVal.indexOf('{{') >= 0 && strVal.indexOf('}}') > strVal.indexOf('{{')) {
          var exp = strVal,
            returnExpression = '';
          while (exp != '') {
            returnExpression += exp.substr(0, exp.indexOf('{{'));
            var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
            /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
            if (key.indexOf('|') > 0) {
              var name = key.substr(0, key.indexOf('|')).trim();
              var value = this.$Utils.getDataWithRoot(object, name)[0];
              var filter = key.substr(key.indexOf('|') + 1, key.length).split(':');
              var type = filter[0].trim();
              var format = filter[1];
              switch (type) {
                /** trường hợp ngày tháng, lấy giá trị ngày tháng hiện tại với định dạng*/
                case 'Date':
                  value = this.$Utils.stringToDate(value);
                  returnExpression += this.$Utils.formatDateTime(value, format);
                  break;
                case 'RangeTime':
                  returnExpression += this.$Utils.getDateTimeByKey(format);
                  break;
                case 'UserInfo':
                  /** trường hợp lấy thông tin người dùng*/
                  returnExpression += this.$Utils.getUserInfo(name);
                  break;
                case 'Url':
                  /** trường hợp lấy thông tin từ đường dẫn*/
                  if (this.$Utils.isEmpty(this.$route.params, 'value'))
                    returnExpression += this.$Utils.stringToObject(this.$route.params.value)[name];
                  break;
                default:
                  returnExpression += value;
                  break;
              }
            } else if (this.$Utils.isEmpty(object[key])) {
              returnExpression += object[key];
            }
            exp = exp.substr(exp.indexOf('}}') + 2, exp.length);
          }
          request[paramName] = returnExpression;
        }
      });
      return request;
    },

    createdListFromDataTree(tree, listMenu) {
      this.$.each(tree, (k, value) => {
        var tmpData = this.$Lodash.cloneDeep(value);
        delete tmpData.children;
        if (
          value.children &&
          this.$Utils.isEmpty(value.children[0], "ModuleType")
        ) {
          tmpData.Module = this.$Lodash.cloneDeep(value.children);
        }
        listMenu.push(tmpData);
        if (value.children && !this.$Utils.isEmpty(value.ModuleType)) {
          createdListFromDataTree(value.children, listMenu);
        }
      });
      return listMenu;
    },

    bindSettingCurrentPage() {
      var ctrl = this;
      var $state = this.$route;
      var $stateParams = this.$route.params;
      //var currentPage = this.Setting;
      var isExist = false;
      var Breadcrumb = [];
      var arrPages = JSON.parse(
        this.$getItemLocalStorage(this.$localStorageConstant.ListPages)
      );
      for (var i = 0; i < arrPages.length; i++) {
        var Description = JSON.parse(arrPages[i].Description);
        if (
          (Description.UrlPage == "dynamic/" + $stateParams.url ||
            Description.UrlPage.indexOf("dynamic/" + $stateParams.url + "/") !=
              -1) &&
          Description.PageLink != "Empty"
        ) {
          this.currentPage = arrPages[i];
        //console.log(this.currentPage)
          // this.Setting = this.$Lodash.cloneDeep(this.currentPage);
          // delete this.Setting.Description;
          // delete this.Setting.Value;
          // $.each(JSON.parse(this.currentPage.Description), (key, val) =>{
          //   this.Setting[key] = val;
          // })
          // $.each(JSON.parse(this.currentPage.Value), (key, val) =>{
          //   this.Setting[key] = val;
          // })
          var childBread = {};
          childBread.Caption = this.currentPage.Caption;
          childBread.Id = this.currentPage.Id;
          childBread.ParentId = this.currentPage.ParentId;
          childBread.Url = Description.UrlPage;
          //this.$Utils.addLanguage(currentPage, childBread);
          //Breadcrumb.push(childBread);
          //ctrl.getBreadcrumb(childBread, Breadcrumb, arrPages);
          isExist = true;
          break;
        }
      }
      if (!isExist) this.$router.push("/pages/404");
      if(this.$Utils.isEmpty(this.currentPage, 'Id')){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_Id = this.currentPage.Id;
        this.$Utils.post(request).then(data => {
          data = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          )[0];
            var pageConfig = data.Description;
          if(data.Description && data.Description.constructor === String) {
              pageConfig = JSON.parse(data.Description);
          }
           if(data.Value && data.Value.constructor === String) {
              pageConfig.Module = JSON.parse(data.Value);
           }
          //this.$Utils.addLanguage(data, pageConfig);
          //consoleconsole.log('$stateParams.query ----',this.$route.query)
          //console.log(this.$route.query)
          if (this.$Utils.isEmpty(this.$route.query))
            pageConfig.UrlData = this.$Utils.stringToObject(this.$route.query);
          pageConfig.Breadcrumb = Breadcrumb;
          // ctrl.data = pageConfig;
          this.Setting = pageConfig;
          this.loadSettingData(JSON.parse(this.currentPage.Value), formatData => {
            this.loadUrlData(formatData).then((result) =>{
              this.formatData = result;
            })
          });
        });
      }
    },

    getBreadcrumb(input, output, listPage) {
      this.$.each(listPage, (k, value) => {
        if (input.ParentId == value.Id) {
          var childBread = {};
          childBread.Caption = value.Caption;
          childBread.Id = value.Id;
          childBread.ParentId = value.ParentId;
          this.$Utils.addLanguage(value, childBread);
          if (angular.isString(value.Description)) {
            if (
              JSON.parse(value.Description).PageLink == "Empty" ||
              !this.$Utils.isEmpty(JSON.parse(value.Description).PageLink)
            )
              childBread.Url = "#";
            else childBread.Url = JSON.parse(value.Description).UrlPage;
          }
          output.unshift(childBread);
          if (this.$Utils.isEmpty(value.ParentId)) {
            ctrl.getBreadcrumb(childBread, output, listPage);
          }
        }
      });
      return output;
    },

    onFilter(arrFilterData, objSetting) {
      var ctrl = this;
      objSetting.FilterLink.forEach(function(code) {
        for (var i = 0; i < ctrl.Setting.Module.length; i++) {
          if (ctrl.formatData[i].Code == code) {
            if (ctrl.$Utils.isEmpty(ctrl.formatData[i], 'functions.search' + ctrl.formatData[i].ModuleType)) {
              ctrl.formatData[i].functions['search' + ctrl.formatData[i].ModuleType](arrFilterData);
            }
            break;
          }
        }
      });
    },

    init() {
      //console.log(this.$getItemLocalStorage(this.$localStorageConstant.ListPages))
      if (
        this.$getItemLocalStorage(this.$localStorageConstant.ListPages) ==
          null ||
        this.$localStorageConstant.ListPages == ""
      ) {
        var request = this.$Utils.updateParamsSingleRequest(
          this.$Lodash.cloneDeep(this.$singleRequest),
          {
            AssignedUser: this.$getItemLocalStorage(
              this.$localStorageConstant.SessionId
            ),
            RequestTemplate: "SettingNew.SearchSetting",
            ParentCode: "xSetting.Project.Page"
          }
        );
        this.$Utils.post(request).then(data => {
          var arrPages = [];
          arrPages = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          //console.log(this.data)
          this.$setItemLocalStorage(
            this.$localStorageConstant.ListPages,
            JSON.stringify(arrPages)
          );
          if(this.data){
            this.Setting = this.$Lodash.cloneDeep(this.data)
            this.loadSettingData([this.Setting], formatData => {
            this.loadUrlData(formatData).then((result) =>{
              this.formatData = result;
            })
          });
          } else
            this.bindSettingCurrentPage();
        });
      } else {
        //console.log(this.data)
        if(this.data){
          this.Setting = this.$Lodash.cloneDeep(this.data)
          this.loadSettingData([this.Setting], formatData => {
          this.loadUrlData(formatData).then((result) =>{
              // console.log(result)
              this.formatData = result
              // console.log(result)
              // console.log(this.Setting)
              $.each(this.formatData, (key,val) =>{
                if(this.Setting.ModuleCode == val.Code)
                  this.formatData[key].parentSetting = this.Setting.parentSetting;
              })
            })
          });
        } else
          this.bindSettingCurrentPage();
      }
    }
  }
};
</script>
<style lang="scss">
  .dynamic-page {
    .header-filter {
      width: 100%;

      .el-collapse-item__header {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;

        .el-collapse-item__arrow {
          line-height: 30px;
        }
      }


      .el-collapse-item__content {
        padding-bottom: 0px;
      }
    }
  }
</style>
