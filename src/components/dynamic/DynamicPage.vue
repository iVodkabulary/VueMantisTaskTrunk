<template>
  <div class="dynamic-page">
    <div v-for="pModule in formatData" :key="pModule.ModuleCode" v-if="!reportPage" class="row">
      <el-collapse class="header-filter" v-model="activeName"  v-if="pModule.ModuleType == 'Filter' && pModule.Fields" >
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
      <DynamicList :pSetting="pModule" :urlData="data.UrlData" v-if="pModule.ModuleType == 'List'" />
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
  props: ['data', 'currentPage'],
  data() {
    return {
      activeName: '',//this.$isMobileDevice ? '' : 'true',
      // currentPage: {},
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
      Setting: {Module: []},
      viewModel: {moduleReady: false, ShowField: []},
    };
  },
  created() {

  },

  mounted() {
    this['Setting'] =  this.data
    this.init();

    // if(this.currentPage){
    //   this.pageModules = this.$Utils.jsonParse(this.currentPage.Value) ? this.$Utils.jsonParse(this.currentPage.Value) : {};
    //  this.pageDescriptions = this.$Utils.jsonParse(this.currentPage.Description) ? this.$Utils.jsonParse(this.currentPage.Description) : {};
    // }

  },
  watch: {
    "$route.params.url": function(newUrl) {
      //alert(newUrl);
      //if ("view-all-task-page" === newUrl) this.$router.push("/tasks")
      //else
      //if ("knowhow-document" === newUrl) this.$router.push("/knowhow-document");
      //else this.init();
    },
    // "Setting.Module": {
    //   handler:  function(setting) {
    //     console.log(this.$Lodash.cloneDeep(setting))
    //   },
    //   deep: true
    // }
  },
  methods: {
    callback() {},
    // moduleReady() {
    //   this.viewModel.moduleReady = true;
    // },

    /**
     * Set up page template with setting
     */
    // setTemplate() {
    //   var view = angular.isString(this.Setting.directiveType) ? this.Setting.directiveType.toLowerCase() : 'default';
    //   this.htmlTemplate = 'app/main/dynamic/page/views/' + view + '.html';
    // },

    /**
     * hàm tạo phân trang cho page, tạo ra object setting view modal
     *
     * @param viewModel: biến dùng để kiểm tra đã có setting phân trang chưa, nếu chưa có thì khởi tạo giá trị mặc định
     */
    // setUpPagination(viewModel) {
    //   this.viewModel.moduleReady = false;
    //   this.Setting.Module = [];
    //   $timeout(function () {
    //     /**set up default pagination view*/
    //     if (!this.$Utils.isEmpty(viewModel)) {
    //       this.viewModel = {
    //         arrLimit: [1, 2, 3, 5, 7, 10, 20],
    //         currentPage: 1,
    //         limit: 5
    //       };
    //     }
    //     /**Create list page from dynamicList's totalCount*/
    //     if (this.Setting.viewModel.module.length > 0) {
    //       this.viewModel.totalPage = Math.ceil(this.Setting.viewModel.module.length / parseInt(this.viewModel.limit));
    //       this.viewModel.arrPage = [];
    //       if (this.viewModel.totalPage > 1) {
    //         for (var i = 1; i < parseInt(this.viewModel.totalPage) + 1; i++) {
    //           if (i <= this.viewModel.currentPage + 2 && i >= this.viewModel.currentPage - 1) {
    //             this.viewModel.arrPage.push(i);
    //           }
    //         }
    //       }
    //     }
    //     var currentFilter = 0;
    //     for (var i = (this.viewModel.currentPage - 1) * this.viewModel.limit; i < this.viewModel.currentPage * this.viewModel.limit; i++) {
    //       if (this.$Utils.isEmpty(this.Setting.viewModel.module[i])) {
    //         if (this.Setting.viewModel.filter.length > 0) {
    //           if (this.$Utils.isEmpty(this.Setting.viewModel.module[i].FilterRelative)
    //             && (this.Setting.viewModel.module[i].FilterRelative != this.Setting.viewModel.filter[currentFilter].Code
    //             || this.Setting.Module.length == 0)) {
    //             $.each(this.Setting.viewModel.filter, function (key, f) {
    //               if (f.Code == this.Setting.viewModel.module[i].FilterRelative) {
    //                 currentFilter = key;
    //               }
    //             });
    //             this.Setting.Module.push(this.Setting.viewModel.filter[currentFilter]);
    //           }
    //         }
    //         this.Setting.Module.push(this.Setting.viewModel.module[i]);
    //       }
    //     }
    //     this.Setting.ListGroups = [{
    //       ColumnFlex: 100,
    //       Flex: 100,
    //       Modules: this.Setting.Module
    //     }];
    //     this.viewModel.moduleReady = true;
    //   });
    // },

    /**
     * hàm thay đổi trang hiển thị, sau đó gọi lại functions.setUpPagination
     *
     * @param page: thứ tụ của trang muốn hiển thị
     */
    // onPagination(page) {
    //   if (this.viewModel.currentPage != page) {
    //     this.viewModel.currentPage = page;
    //     // this.Setting.functions.setUpPagination(this.viewModel);
    //   }
    // },

    // /**
    //  * thay đổi giá trị hiển thị số phần tử trên trang, sau đó gọi lại functions.setUpPagination
    //  *
    //  */
    // onChangeLimit() {
    //   this.viewModel.currentPage = 1;
    //   // this.Setting.functions.setUpPagination(this.viewModel);
    // },

    // showField (data) {
    //   if(this.viewModel.ShowField[data.Name] != 'true'){
    //     this.viewModel.ShowField[data.Name] = 'true';
    //   } else {
    //     this.viewModel.ShowField[data.Name] = 'false';
    //   }
    // },

    init() {
      var ctrl = this;
      this.Setting.viewModel = {filter: [], module: []};
      if(this.Setting.IsDashboard == 'true'){
        this.reportClass = 'dashboard-report';
      }
      ctrl.Prefix = ctrl.$isMobile.iOS() ? '/' : '';
      ctrl.ListType = true;
      ctrl.$rootScope.isReport = false;
      ctrl.$rootScope.idReport = undefined;
      // ctrl.loadFilter();
      if (ctrl.$isMobile.Android() || ctrl.$isMobile.BlackBerry() || ctrl.$isMobile.Opera() || ctrl.$isMobile.iOS() && !ctrl.$isMobile.iPad()){
        ctrl.mobileflex = true;
      }
      var CurrentList = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).CurrentList;
      ctrl.CurrentList = ctrl.$Utils.isEmpty(CurrentList) ? CurrentList : 3;
      ctrl.Showa = false;
       ctrl.disPlayHeader = true;
      if (ctrl.Setting.UrlPage == 'dynamic/knowhow-document' && !ctrl.$isMobileDevice) {
        ctrl.Showa = true;
      }else if (ctrl.Setting.UrlPage == 'dynamic/summary-page') {
        ctrl.bttR = true;
      }else{
        ctrl.bttR = false;
        ctrl.Showa = !ctrl.$isMobileDevice;
      }
      if (ctrl.Setting.UrlPage == 'dynamic/knowhow-document' && ctrl.$isMobileDevice) {
        ctrl.disPlayHeader = false;
      }
      ctrl.btt = false;
      if (ctrl.$isMobile.iPad())
        ctrl.Showa = false
      ctrl.ShowList = ctrl.$Lodash.cloneDeep(ctrl.CurrentList);
      if (ctrl.ShowList == 0 && ctrl.Setting.UrlPage == 'dynamic/view-all-task-page') {
        ctrl.ListPage = 'clList';
        ctrl.btt = true;
        ctrl.disPlayHeader = false;
      };
      if (ctrl.ShowList == 1) {
        ctrl.Link = "scrumboard";
      }
       else {
        ctrl.Link = "timeline";
      }
      var url = window.location.href;
      if (url.indexOf('?') > 0) {
        ctrl.ShowList = "0";
      }
      if(ctrl.Setting.DisplayChange == "true" && (ctrl.ShowList == "1" || ctrl.ShowList == "2")) {
        ctrl.filter = [];
      } else {
        var arrGroup = [];
        if (ctrl.$Utils.isEmpty(ctrl.Setting.Groups)) {
          ctrl.Setting.Groups.forEach((listItem) => {
            if (ctrl.$Utils.isEmpty(listItem.listUsers, "0") && JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).UserId.indexOf(listItem.listUsers) >= 0) {
              arrGroup.push(listItem);
            } else if (ctrl.$Utils.isEmpty(listItem.UserPermissions, "0")) {
              listItem.UserPermissions.forEach((permission) => {
                var Roles = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Roles;
                Roles.forEach((role) => {
                  if (permission == role.GroupId) {
                    arrGroup.push(listItem);
                  }
                })
                var Groups = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Groups;
                Groups.forEach((group) => {
                  if (permission == group.GroupId) {
                    arrGroup.push(listItem);
                  }
                })
              })
            } else if (!ctrl.$Utils.isEmpty(listItem.listUsers, "0") || listItem.listUsers == []) {
              arrGroup.push(listItem);
            }
          })
          if (ctrl.Setting.Groups.length > arrGroup.length)
            ctrl.changeGroups = true;
          ctrl.Setting.Groups = arrGroup;
        }
        ctrl.autoLoad();
      }
      ctrl.IosClass = ctrl.$isMobile.iOS() ? 'form-dynamic' : '';
      // setTemplate();
    },


    autoLoad() {
      var ctrl = this;
      ctrl.checkSettingPage().then(() => {
        if (ctrl.$Utils.isEmpty(ctrl.Setting.ExtraSetting) && ctrl.Setting.ExtraSetting !== '') {
          $.each(ctrl.$Utils.stringToObject(ctrl.Setting.ExtraSetting), (key, val) => {
            if (key !== "AdditionConditions")
              ctrl.Setting[key] = val;
          });
        }
        $.each(ctrl.Setting.Module, (key, val) => {
          if (ctrl.$Utils.isEmpty(val, 'DefaultFilter')) {
            ctrl.Setting[val.ModuleCode + 'AdditionConditions'] = val.DefaultFilter;
          }
        });
        /** sắp lại thứ tự các module trong page */
        var objComponents = { arrFilter: [], arrModule: [] },
          arrayComponent = [];
        var arrModule = [];
        if (ctrl.$Utils.isEmpty(ctrl.Setting.Groups)) {
          ctrl.Setting.Groups.forEach((listItem) => {
            ctrl.Setting.Module.forEach((module) => {
              if (listItem.ListModules.indexOf(module.ModuleCode) >= 0 && module.Group !== listItem.Caption) {
                var otherModule = ctrl.$Lodash.cloneDeep(module);
                otherModule.Group = listItem.Caption;
                arrModule.push(otherModule);
              }

              if (ctrl.$Utils.isEmpty(module.listUsers, "0") && JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).UserId.indexOf(module.listUsers) >= 0) {
                arrModule.push(module);
              } else if (ctrl.$Utils.isEmpty(module.UserPermissions, "0")) {
                module.UserPermissions.forEach((permission) => {
                  var Roles = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Roles
                  Roles.forEach((role) => {
                    if (permission === role.GroupId) {
                      arrModule.push(module);
                    }
                  })
                  var Groups = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Groups
                  Groups.forEach((group) => {
                    if (permission === group.GroupId) {
                      arrModule.push(module);
                    }
                  })
                })
              } else if (!ctrl.$Utils.isEmpty(module.listUsers, "0") || module.listUsers == []) {
                arrModule.push(module);
              }
            })
          })
          ctrl.Setting.Module = arrModule;

        } else {
          var PermitModule = [];
          ctrl.Setting.Module.forEach((module) => {
            if (ctrl.$Utils.isEmpty(module.listUsers, "0") && JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).UserId.indexOf(module.listUsers) >= 0) {
              PermitModule.push(module);
            } else if (ctrl.$Utils.isEmpty(module.UserPermissions, "0")) {
              module.UserPermissions.forEach((permission) => {
                var Roles = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Roles
                var Groups = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Groups
                Roles.forEach((role) => {
                  if (permission == role.GroupId) {
                    PermitModule.push(module);
                  }
                })
                Groups.forEach((group) => {
                  if (permission == group.GroupId) {
                    PermitModule.push(module);
                  }
                })
              })
            } else if (!ctrl.$Utils.isEmpty(module.listUsers, "0") || module.listUsers == []) {
              PermitModule.push(module);
            }
          })
          ctrl.Setting.Module = PermitModule
        }
        var multiFilter = 0;
        ctrl.Setting.Module.forEach((module) => {
          if (module.ModuleType == 'Filter') {
            objComponents.arrFilter.push(module);
            ctrl.Setting.Filter = true;
            multiFilter++;
          } else {
            objComponents.arrModule.push(module);
          }
          if (multiFilter > 1 && ctrl.Setting.IsDashboard != 'true') {
            ctrl.Setting.ReportFilter = 'true';
          }
        });
        if (typeof ctrl.Setting.ModuleOrder === 'string' && ctrl.Setting.ModuleOrder != "") {
          var arrModuleOrder = ctrl.Setting.ModuleOrder.split(';');
          arrModuleOrder.forEach((moduleCode) => {
            for (var i = 0; i < objComponents.arrModule.length; i++) {
              if (moduleCode == objComponents.arrModule[i].ModuleCode) {
                arrayComponent.push(objComponents.arrModule[i]);
                break;
              }
            }
          });
        } else {
          arrayComponent = arrayComponent.concat(objComponents.arrModule);
        }
        if (typeof ctrl.Setting.FilterOrder === 'string' && ctrl.Setting.FilterOrder != "") {
          var arrFilterOrder = ctrl.Setting.FilterOrder.split(';');
          arrFilterOrder.forEach((module) => {
            for (var i = 0; i < objComponents.arrFilter.length; i++) {
              if (module == objComponents.arrFilter[i].ModuleCode) {
                arrayComponent.push(objComponents.arrFilter[i]);
                break;
              }
            }
          });
        } else {
          arrayComponent = arrayComponent.concat(objComponents.arrFilter);
        }
        ctrl.Setting.Module = arrayComponent;
        /** thêm sắp xếp thứ tự cho module và filter*/
        ctrl.loadSettingData(ctrl.Setting.Module, (formatData) => {
          //console.log(formatData)
          formatData.forEach((module) => {
            if (typeof ctrl.Setting[module.Code] === 'string') {
              $.each(ctrl.$Utils.stringToObject(ctrl.Setting[module.Code].replaceAll('+', '&').replaceAll(':', '=')), (key, val) => {
                if (val.indexOf('.EQUALTO') > 0) {
                  val = val.replaceAll('.AND', '&').replaceAll('.EQUALTO', '=');
                }
                module[key] = val;
              });
            }
            if (typeof module.AdditionConditions === 'string') {
              module.AdditionConditions = ctrl.$Utils.stringToObject(module.AdditionConditions, '&', '=');
            } else {
              module.AdditionConditions = [];
            }
            if (ctrl.$Utils.isEmpty(ctrl.Setting[module.Code + 'AdditionConditions']) && ctrl.Setting.IsDashboard != 'true') {
              ctrl.Setting[module.Code + 'AdditionConditions'].forEach((val) => {
                if (ctrl.$Utils.isEmpty(val, 'Value') && val.Value.indexOf("|Url}}") >= 0) {
                  var exp = val.Value,
                    returnExpression = '';
                  var returnExpression = exp.substr(0, exp.indexOf('{{'));
                  var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
                  /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
                  var name = key.substr(0, key.indexOf('|')).trim();
                  module.AdditionConditions[val.Key] = ctrl.Setting.UrlData[name]
                } else
                  module.AdditionConditions[val.Key] = val.Value;
              })
            }
            /** thêm cấu hình từ directive cha vào */
            ctrl.Setting.Module.forEach((element) => {
              if (element.ModuleCode == module.Code) {
                if (ctrl.$Utils.isEmpty(element.parentSetting)) {
                  module.parentSetting = element.parentSetting;
                }
              }
            });
            if (ctrl.Setting.directiveType) {
              module.directiveType = ctrl.Setting.directiveType;
              module.place = ctrl.Setting.place;
            }
            ctrl.Setting.Module.forEach((m) => {
              if (m.ModuleCode == module.Code && !ctrl.$Utils.isEmpty(module, 'Group')) {
                module.Group = m.Group;
                if(m.SubElementType){
                  module.ModuleType = m.SubElementType;
                }
              }
            });
            module.LinkedObject = {};
            module.ModuleType = module.ModuleType ? module.ModuleType : module.Value;
            switch (module.ModuleType) {
              case 'Report':
                // module.AutoSearch = true;
                ctrl.ReportPage = true;
                ctrl.$rootScope.isReport = true;
                ctrl.$rootScope.idReport = 'idReport';
                break;
              case 'Filter':
                module.FilterLink = [];
                if (ctrl.Setting.Pagination == 'true') {
                  module.Pagination = ctrl.Setting.Pagination;
                  module.WeekField = ctrl.Setting.WeekField;
                }
                if (ctrl.$Utils.isEmpty(ctrl.Setting.LimitIndex)) {
                  module.LimitIndex = ctrl.Setting.LimitIndex;
                }
                ctrl.Setting.Module.forEach((m) => {
                  if (m.ModuleCode == module.Code) {
                    module.FilterLink = ctrl.$Utils.isEmpty(m.FilterLink) ? m.FilterLink.split(';') : [];
                  }
                });
                // if (ctrl.Setting.IsDashboard != 'true') {
                //   module.LinkedObject.setFilterSideNav = setFilterSideNav;
                // }
                // module.LinkedObject.returnFilterData = onFilter;
                break;
              case 'Form':
                ctrl.Setting.ShowHeadCaption = 'false';
                module.LinkedObject.closeModal = () => {
                  if (ctrl.$Utils.isEmpty(ctrl.Setting.closeModal)) {
                    ctrl.Setting.closeModal();
                  }
                };
                break;
              case 'List':
                module.LinkedObject.returnItemData = (setting, item) => {
                  ctrl.setModuleData(setting, item)
                };
                // module.LinkedObject.setPagination = (setting, totalRecord) => {
                //   ctrl.setPagination(setting, totalRecord)
                // };
                module.ShowSearchItem = true;
                module.AutoSearch = true;
                break;
            }
          });
          if(ctrl.ReportPage == true){
            if(ctrl.$Utils.isEmpty(ctrl.$rootScope.modeProject) && ctrl.$rootScope.modeProject.mode == 'MODE_PROJECT'){
              var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
              request.R1_RequestDataGroup = 'DataGroup.quan-ly-du-an.053gf';
              request.R1_RequestFields = 'Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type';
              request.R1_Code = 'Project';
              request.R1_RequestTemplate = 'xDocument_Document.Search';
              ctrl.$Utils.post(request).then((data) => {
                ctrl.ListProject = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document');
                ctrl.ListProject.forEach((value) =>{
                  value.name = value.Name;
                })
                ctrl.LabelProject = "Dự án";
              })
            } else {
              var request = {
                RequestAction: 'SearchUserWithGroups',
                IncludedGroupManager: 'true',
                RequestClass: 'BPM',
                RequestDataType: 'json',
                SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
                ConditionFields: 'IncludedGroupManager;Group;Status;LoginName;UserId',
                StaticFields: 'UserId;Username;LoginName;Description;Status;',
                DynamicFields: 'Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone',
                StructFields: 'GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification',
                OrderFields: 'LoginName ASC',
                GroupType: '1',
                UserId: ctrl.$rootScope.loggedOnUser.UserId,
                Status: 1
              };
              ctrl.$Utils.post(request).then((data) => {
                ctrl.ListGroupId = ctrl.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
                var requestD = {
                  RequestClass: 'BPM',
                  RequestAction: 'SearchGroup',
                  SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
                  ConditionFields: 'GroupType,Description,GroupId',
                  StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
                  StructFields: 'ParentName',
                  orderFields: 'GroupName ASC',
                  RequestDataType: 'json',
                  GroupId: ctrl.ListGroupId[0].Groups,
                  GroupType: 1
                };
                ctrl.$Utils.postCheckResult(requestD).then((dataD) => {
                  ctrl.ListProject = ctrl.$Utils.getDataWithRoot(dataD, 'UserDS.Group');
                  ctrl.ListProject.forEach((value) =>{
                    value.name = value.GroupName;
                  })
                  ctrl.LabelProject = "Phòng ban";
                })
              })
            }
          }
          /** sắp xếp lại thứ tự của các module theo filter*/
          var arrModulesOrder = [],
            arrUsedIndex = [];
          $.each(formatData, function(index, module) {
            if (module.ModuleType == 'Filter') {
              arrModulesOrder.push(module);
              arrUsedIndex.push(index);
              /** kiểm tra liên kết của filter đến các form, list, report */
              for (var i = 0; i < formatData.length; i++) {
                var moduleData = ctrl.$Lodash.cloneDeep(formatData[i])
                // if (module.FilterLink.indexOf(formatData[i].Code) >= 0 && module.Group == formatData[i].Group) {
                if (module.FilterLink.indexOf(moduleData.Code) >= 0) {
                  if (ctrl.$Utils.isEmpty(ctrl.Setting[moduleData.Code + 'AdditionConditions'], module.Group)) {
                    var addition = ctrl.$Lodash.cloneDeep(moduleData.AdditionConditions)
                    moduleData.AdditionConditions = {};
                    if(ctrl.Setting[moduleData.Code + 'AdditionConditions'][module.Groups])
                      ctrl.Setting[moduleData.Code + 'AdditionConditions'][module.Groups].forEach((val) => {
                        if (ctrl.$Utils.isEmpty(val.Key)) {
                          moduleData.AdditionConditions[val.Key] = val.Value;
                        }
                      })
                    $.each(addition, (key, val) => {
                      moduleData.AdditionConditions[key] = val;
                    })
                  }
                  moduleData.ShowSearchItem = false;
                  /*if(moduleData.ModuleType == "Report")*/
                    moduleData.AutoSearch = false;
                  moduleData.FilterRelative = module.Code;
                  moduleData.Group = module.Group
                  arrModulesOrder.push(moduleData);
                  arrUsedIndex.push(i);
                }
              }
            }
          });

          /** thêm các module ko có liên kết đến filter */
          $.each(formatData, (index, module) => {
            if (arrUsedIndex.indexOf(index) < 0)
              arrModulesOrder.push(module);
          });
          ctrl.Setting.Module = arrModulesOrder;
          arrModulesOrder.forEach((module) => {
            if (ctrl.Setting.IsDetail == 'true') {
              module.IsDetail = 'true';
            }
            if (module.ModuleType == 'Filter') {
              if (ctrl.Setting.IsDashboard == 'true') {
                module.IsDashboard = 'true';
              }
              ctrl.Setting.viewModel.filter.push(module);
            } else
              ctrl.Setting.viewModel.module.push(module);
          });
          ctrl.loadUrlData().then((setting) => {
            this.formatData = setting.Module;
            ctrl.$set(ctrl.Setting, 'Module', setting.Module);
            ctrl.ListDetail = [];
            if (ctrl.Setting.Groups) {
              ctrl.Setting.Groups.forEach((moduleGroup) => {
                moduleGroup.Modules = [];
                moduleGroup.Flex = moduleGroup.Flex == undefined ? parseInt(100 / ctrl.Setting.Groups.length) : moduleGroup.Flex;
                if (ctrl.changeGroups == true) {
                  if (ctrl.Setting.Groups.length <= 4)
                    moduleGroup.Flex = parseInt(100 / ctrl.Setting.Groups.length);
                  else if (ctrl.Setting.Groups.length <= 6)
                    moduleGroup.Flex = 33;
                  else
                    moduleGroup.Flex = 25;
                }
                ctrl.Setting.Module.forEach((value) => {
                  if (['Filter'].indexOf(value.ModuleType) >= 0 && value.Group == moduleGroup.Caption) {
                    moduleGroup.ListModules += value.Code + ';';
                    moduleGroup.Filter = value.Code;
                  }
                })
                if (moduleGroup.ListModules) {
                  moduleGroup.ListModules.split(';').forEach((code) => {
                    var object = ctrl.Setting.Module.find((module) => {
                      return code && code == module.Code && (moduleGroup.Caption == module.Group);
                    });
                    if (ctrl.$Utils.isEmpty(object) && ctrl.Setting.IsDashboard == 'true') {
                      object.ShowTable = false;
                      object.ReportProportion = '100';
                      object.ShowReportHeader = 'true';
                    }
                    if (ctrl.$Utils.isEmpty(object)) {
                      object.Group = moduleGroup.Name;
                    }
                    if (ctrl.$Utils.isEmpty(object) && object.ModuleType == 'Filter') {
                      moduleGroup.GroupFilter = object;
                    }
                    moduleGroup.Modules.push(object);
                  });
                  moduleGroup.Modules.clean();
                }
              });
            } else {
              ctrl.Setting.Groups = [{
                ColumnFlex: 100,
                Flex: 100,
                Modules: ctrl.Setting.Module,
                Caption: 'Default'
              }];
              ctrl.Setting.Module.forEach((object) => {
                if (object.ModuleType == "List" && ctrl.Setting.IsDetail == 'true') {
                  ctrl.ListDetail.push(object)
                }
                if (['Report'].indexOf(object.ModuleType) >= 0 && ctrl.Setting.IsProject == 'true') {
                  object.ShowTable = 'false';
                  object.ReportProportion = '100';
                  object.ShowReportHeader = 'false';
                  object.Flex = '50'
                  object.IsProject = 'true';
                }
              })
              if (ctrl.Setting.UrlPage == "dynamic/knowhow-document") {
                if (ctrl.isMobile.Android() || ctrl.isMobile.BlackBerry() || ctrl.isMobile.Opera() || ctrl.isMobile.iOS() && !ctrl.isMobile.iPad()) {

                  ctrl.Setting.Groups = [{
                    ColumnFlex: 100,
                    Flex: 100,
                    Modules: ctrl.Setting.Module
                  }];
                } else {

                  ctrl.Setting.Groups = [{
                    ColumnFlex: 75,
                    Flex: 75,
                    Modules: ctrl.Setting.Module
                  }]
                };

              }
            }

            if (ctrl.Setting.Pagination == 'true') {
              // ctrl.Setting.functions.setUpPagination();
            } else {
              // ctrl.Setting.functions.moduleReady();
            }
          });
        });
      });
      if(ctrl.Setting.UrlPage == 'dynamic/knowhow-document'){
        ctrl.isDocumentPage = true;
      }
    },

    loadSettingData(moduleArray, callback) {
      var ctrl = this;
      var formatData = [];
      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
      request.R1_RequestTemplate = 'SettingNew.SearchSetting';
      request.R1_Code = '';
      moduleArray.forEach((module) => {
        request.R1_Code += module.ModuleCode + ';';
      });
      if (request.R1_Code == '')
        callback(formatData);
      else {
        ctrl.$Utils.post(request).then((data) => {
          data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          moduleArray.forEach((module) => {
            if (module.ModuleType == "Report") {
              this.reportPage = true;
            }
            for (var i = 0; i < data.length; i++) {
              if (module.ModuleCode == data[i].Code) {
                if ((['Form', 'Filter', 'List', 'Report'].indexOf(module.ModuleType) != -1 || ['Form', 'Filter', 'List', 'Report'].indexOf(module.SubElementType) != -1) && typeof data[i].Description =="string") {
                  var refModule = data[i];
                  if(refModule.ModuleType != 'Filter'){
                    ctrl.listReport.push({Code: refModule.Code, Name: refModule.Caption});
                  }
                  refModule.Description = refModule.Description ? JSON.parse(refModule.Description) : "";
                  if (ctrl.$Utils.isEmpty(refModule, "F1")) {
                    refModule.Description.Fields = '';
                    for (var i = 1; i <= refModule.Description.FCount; i++) {
                      if (refModule['F' + i] != undefined) {
                        refModule.Description.Fields += refModule['F' + i];
                        delete refModule['F' + i];
                      }
                    }

                    refModule.Description.Fields = typeof refModule.Description.Fields ==='string' ? JSON.parse(refModule.Description.Fields) : [];
                  }
                  refModule.Description.Code = refModule.Code;
                  refModule.Description.DataGroup = refModule.Name;
                  refModule.Description.Value = refModule.Value;
                  refModule.Description.ModuleType = module.ModuleType;
                  if (module.ModuleType == "Filter") {
                    if(!refModule.Description.functions){
                      refModule.Description.functions = {};
                    }
                    refModule.Description.functions.onFilter = this.onFilter;
                  }
                  formatData.push(refModule.Description);
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

    /**
     * Hàm lấy dựa liệu dựa theo setting và đường dẫn URL
     */
    loadUrlData() {
      var ctrl = this;
      return new Promise((resolve, reject) => {
        if (!ctrl.$Utils.isEmpty(ctrl.Setting.AutoLoad, 'length') && ctrl.Setting.AutoLoad != "") {
          ctrl.Setting.AutoLoad = [ctrl.Setting.AutoLoad];
        }
        // ctrl.Setting.AutoLoad = [{"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;Code;","Module":"Form.cap-nhat-danh-sach-san-pham.04848","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document","OtherCondition":"Id={{Id|Url}}"},
        //                      {"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;RequestFields;Code","Module":"List.crm-sanpham.0b1b7","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","OtherCondition":"CustomerId={{CustomerId|Url}}","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document"}]
        ctrl.Setting.AutoLoad.forEach((loadFor) => {
          if (ctrl.$Utils.isEmpty(loadFor, "Enable")) {
            // // ctrl.Setting.AutoLoad = ctrl.$Utils.stringToObject(ctrl.Setting.AutoLoad);
            var objModuleFor = {};
            ctrl.Setting.Module.forEach((module) => {
              if (ctrl.$Utils.isEmpty(module) && module.Code == loadFor.Module) {
                objModuleFor = module;
              }
            });
            switch (loadFor.Type) {
              case 'loadDataBase':
                if (!ctrl.$Utils.isEmpty(objModuleFor.Code)) {
                  ctrl.$Utils.showMessage('error', ctrl.$toastMessage.settingTemplateError);
                  return false;
                }
                if (typeof loadFor.OtherCondition ==='string') {
                  $.each(ctrl.$Utils.stringToObject(loadFor.OtherCondition), (key, value) => {
                    loadFor[key] = value;
                  })
                }
                var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
                request.R1_RequestDataGroup = loadFor.DataGroup ? loadFor.DataGroup : objModuleFor.DataGroup;
                request.R1_RequestTemplate = loadFor.DataSource ? loadFor.DataSource + '.Search' : objModuleFor.DataSource + '.Search';
                if (typeof loadFor.AdditionConditions ==="string") {
                  loadFor.AdditionConditions = ctrl.$Utils.stringToObject(loadFor.AdditionConditions);
                }
                /** Thêm điều kiện từ Setting.AdditionConditions */
                $.each(loadFor.AdditionConditions, (key, val) => {
                  request['R1_' + key] = val;
                });
                request.R1_RequestFields = '';
                if (ctrl.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
                  var Links = objModuleFor.Link;
                  if (ctrl.$Utils.isEmpty(Links)) {
                    var SubElementLinks = Links[loadFor.DataGroup]
                    SubElementLinks.forEach((value) => {
                      request.R1_RequestFields += value.Target + ';'
                      objModuleFor.Fields.forEach((field) => {
                        if (field.Name == value.Source && ctrl.$Utils.isEmpty(field, 'DynamicText')) {
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
                  if (!ctrl.$Utils.isEmpty(objModuleFor.parentSetting)) {
                    objModuleFor.parentSetting = { object: {}, set: { GetFullData: 'false' } }
                  }
                }
                if (ctrl.$Utils.isEmpty(conditionObject)) {
                  request = ctrl.$Utils.updateParamsSingleRequest(request, conditionObject);
                }
                /** chuyển các biến trong parameter sang giá trị*/
                request = ctrl.replaceExpression(request, objModuleFor.parentSetting.object);
                if (loadFor.AssignedUser == true) {
                  request.R1_AssignedUser = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId);
                }
                if (ctrl.$isSystemAdmin()) {
                  request.R1_AssignedUser = undefined;
                }
                if (ctrl.Setting.IsDetail != 'true' || objModuleFor.SubElements.length == 0) {
                  ctrl.$Utils.postCheckResult(request).then((result) => {
                    if (result.success && result.R1.success) {
                      var rootData = typeof loadFor.RootData ==='string' ? loadFor.RootData : objModuleFor.RootData != "Data.DynamicDS.Setting" ? objModuleFor.RootData : "Data";
                      var data = ctrl.$Utils.getDataWithRoot(result.R1, rootData)[0];
                      if (objModuleFor.RootData == "Data.DynamicDS.Setting" && ctrl.$Utils.isEmpty(result)) {
                        data = ctrl.$Utils.getDataWithRoot(result.R1, objModuleFor.RootData)[0];
                      }
                      result = data;
                      if (ctrl.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
                        var Links = objModuleFor.Link;
                        if (ctrl.$Utils.isEmpty(Links)) {
                          var SubElementLinks = Links[loadFor.DataGroup]
                          if (ctrl.$Utils.isEmpty(SubElementLinks)) {
                            SubElementLinks.forEach((value) => {
                              if (ctrl.$Utils.isEmpty(result[value.Target])) {
                                objModuleFor.parentSetting.object[value.Source] = result[value.Target];
                              }
                              if (ctrl.$Utils.isEmpty(result[value.Target + "Name"])) {
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
                      resolve(ctrl.Setting);
                    } else {
                      ctrl.$Utils.showMessage('error', ctrl.$toastMessage.loadingDataFailed);
                    }
                  });
                } else {
                  $.map(conditionObject, (value, index) => {
                    objModuleFor.parentSetting.object[index] = request["R1_" + index];
                  })
                  resolve(ctrl.Setting);
                }
                break;
              case 'includeUrlData':
                var url = window.location.href();
                if (url.indexOf('?') > 0 && objModuleFor.Code) {
                  var parameter = url.substring(url.indexOf('?') + 1, url.length);
                  parameter = ctrl.$Utils.stringToObject(decodeURIComponent(parameter));
                  objModuleFor.parentSetting = objModuleFor.parentSetting ? objModuleFor.parentSetting : { object: {} };
                  $.each(parameter, (key, val) => {
                    objModuleFor.parentSetting.object[key] = val;
                  });
                }
                resolve(ctrl.Setting);
                break;
            }
          } else {
            resolve(ctrl.Setting);
          }
        })
      })
    },
    // loadUrlData(formatData) {
    //   return new Promise((resolve, reject) => {
    //     if (!this.$Utils.isEmpty(this.Setting.AutoLoad, 'length') && this.Setting.AutoLoad != "") {
    //       this.Setting.AutoLoad = [this.Setting.AutoLoad];
    //     }
    //     // this.Setting.AutoLoad = [{"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;Code;","Module":"Form.cap-nhat-danh-sach-san-pham.04848","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document","OtherCondition":"Id={{Id|Url}}"},
    //     //                      {"Enable":true,"ParentChild":false,"Condition":"Id;RequestDataGroup;RequestFields;Code","Module":"List.crm-sanpham.0b1b7","DataGroup":"DataGroup.product.08e9a","Type":"loadDataBase","OtherCondition":"CustomerId={{CustomerId|Url}}","AdditionConditions":"Code=Product","DataSource":"xDocument_Document","RootData":"Data.DocumentDS.Document"}]
    //     this.Setting.AutoLoad.forEach((loadFor) => {
    //       if (this.$Utils.isEmpty(loadFor, "Enable")) {
    //         // // formatData.AutoLoad = this.$Utils.stringToObject(formatData.AutoLoad);
    //         var objModuleFor = {};
    //         formatData.forEach((module) => {
    //           if (this.$Utils.isEmpty(module) && module.Code == loadFor.Module) {
    //             objModuleFor = module;
    //           }
    //         });
    //         switch (loadFor.Type) {
    //           case 'loadDataBase':
    //             if (!this.$Utils.isEmpty(objModuleFor.Code)) {
    //               this.$Utils.showMessage('error', this.$ctrl.$toastMessage.settingTemplateError);
    //               return false;
    //             }
    //             if (typeof loadFor.OtherCondition ==='string') {
    //               $.each(this.$Utils.stringToObject(loadFor.OtherCondition), (key, value) => {
    //                 loadFor[key] = value;
    //               })
    //             }
    //             var request = this.$Lodash.cloneDeep(this.$singleRequest);
    //             request.R1_RequestDataGroup = loadFor.DataGroup ? loadFor.DataGroup : objModuleFor.DataGroup;
    //             request.R1_RequestTemplate = loadFor.DataSource ? loadFor.DataSource + '.Search' : objModuleFor.DataSource + '.Search';
    //             if (typeof loadFor.AdditionConditions ==='string') {
    //               loadFor.AdditionConditions = this.$Utils.stringToObject(loadFor.AdditionConditions);
    //             }
    //             /** Thêm điều kiện từ Setting.AdditionConditions */
    //             $.each(loadFor.AdditionConditions,(key, val) => {
    //               request['R1_' + key] = val;
    //             });
    //             request.R1_RequestFields = '';
    //             if (this.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
    //               var Links = objModuleFor.Link;
    //               if (this.$Utils.isEmpty(Links)) {
    //                 var SubElementLinks = Links[loadFor.DataGroup]
    //                 SubElementLinks.forEach((value) => {
    //                   request.R1_RequestFields += value.Target + ';'
    //                   objModuleFor.Fields.forEach((field) => {
    //                     if (field.Name == value.Source && this.$Utils.isEmpty(field, 'DynamicText')) {
    //                       request.R1_RequestFields += value.Target + 'Name;'
    //                     }
    //                   });
    //                 })
    //               }
    //             } else {
    //               objModuleFor.Fields.forEach((field) => {
    //                 request.R1_RequestFields += field.Name + ';'
    //               });
    //             }
    //             var conditionObject;
    //             if (typeof loadFor.Condition ==='string') {
    //               conditionObject = {};
    //               loadFor.Condition.split(';').forEach((key) => {
    //                 if (loadFor[key]) {
    //                   conditionObject[key.trim()] = loadFor[key];
    //                 }
    //               });
    //               if (!this.$Utils.isEmpty(objModuleFor.parentSetting)) {
    //                 objModuleFor.parentSetting = { object: {}, set: { GetFullData: 'false' } }
    //               }
    //             }
    //             if (this.$Utils.isEmpty(conditionObject)) {
    //               request = this.$Utils.updateParamsSingleRequest(request, conditionObject);
    //             }
    //             /** chuyển các biến trong parameter sang giá trị*/
    //             request = this.replaceExpression(request, objModuleFor.parentSetting.object);
    //             if (loadFor.AssignedUser == true) {
    //               request.R1_AssignedUser = this.$getItemLocalStorage(this.$localStorageConstant.SessionId);
    //             }
    //             if (this.$isSystemAdmin() || this.$isMantisAdmin()) {
    //               delete request.R1_AssignedUser
    //             }
    //             if (formatData.IsDetail != 'true' || objModuleFor.SubElements.length == 0) {
    //               this.$Utils.postCheckResult(request).then((result) => {
    //                 if (result.success && result.R1.success) {
    //                   var rootData = typeof loadFor.RootData ==='string' ? loadFor.RootData : objModuleFor.RootData != "Data.DynamicDS.Setting" ? objModuleFor.RootData : "Data";
    //                   var data = this.$Utils.getDataWithRoot(result.R1, rootData)[0];
    //                   if (objModuleFor.RootData == "Data.DynamicDS.Setting" && this.$Utils.isEmpty(result)) {
    //                     data = this.$Utils.getDataWithRoot(result.R1, objModuleFor.RootData)[0];
    //                   }
    //                   result = data;
    //                   if (this.$Utils.isEmpty(loadFor.ParentChild) && loadFor.ParentChild == true) {
    //                     var Links = objModuleFor.Link;
    //                     if (this.$Utils.isEmpty(Links)) {
    //                       var SubElementLinks = Links[loadFor.DataGroup]
    //                       if (this.$Utils.isEmpty(SubElementLinks)) {
    //                         SubElementLinks.forEach((value) => {
    //                           if (this.$Utils.isEmpty(result[value.Target])) {
    //                             objModuleFor.parentSetting.object[value.Source] = result[value.Target];
    //                           }
    //                           if (this.$Utils.isEmpty(result[value.Target + "Name"])) {
    //                             objModuleFor.parentSetting.object[value.Source + "Name"] = result[value.Target + "Name"];
    //                           }
    //                         });
    //                       }
    //                     }
    //                   } else {
    //                     $.each(result, (key, val) => {
    //                       objModuleFor.parentSetting.object[key] = val;
    //                     });
    //                   }
    //                   resolve(formatData);
    //                 } else {
    //                   this.$Utils.showMessage('error', this.$ctrl.$toastMessage.loadingDataFailed);
    //                 }
    //               });
    //             } else {
    //               $.map(conditionObject, (value, index) => {
    //                 objModuleFor.parentSetting.object[index] = request["R1_" + index];
    //               })
    //               resolve(formatData);
    //             }
    //             break;
    //           case 'includeUrlData':
    //             //console.log(this.$route.fullPath)
    //             var url = $location.absUrl();
    //             if (url.indexOf('?') > 0 && objModuleFor.Code) {
    //               var parameter = url.substring(url.indexOf('?') + 1, url.length);
    //               parameter = this.$Utils.stringToObject(decodeURIComponent(parameter));
    //               objModuleFor.parentSetting = objModuleFor.parentSetting ? objModuleFor.parentSetting : { object: {} };
    //               $.each(parameter, (key, val) => {
    //                 objModuleFor.parentSetting.object[key] = val;
    //               });
    //             }
    //             resolve(formatData);
    //             break;
    //           default:
    //             resolve(formatData);
    //             break;
    //         }
    //       } else {
    //         resolve(formatData);
    //       }
    //     })
    //   })
    // },

    /**
     * hàm set lại dữ liệu trong module con
     * @param setting cấu hình của form
     * @param item dữ liệu cần set
     */
    setModuleData(setting, item) {
      var ctrl = this;
      if (typeof ctrl.Setting.SetDataSource ==='string' &&
        ctrl.Setting.SetDataSource.indexOf(setting.ModuleCode) &&
        typeof ctrl.Setting.SetDataTarget ==='string') {
        for (var i = 0; i < ctrl.Setting.Module.length; i++) {
          if (ctrl.Setting.Module[i].Code == ctrl.Setting.SetDataTarget && ctrl.$Utils.isEmpty(ctrl.Setting.Module[i].functions.setData)) {
            if (typeof ctrl.Setting.SetDataParentChild ==='string') {
              var Links = setting.Link
              var object = {};
              if (ctrl.$Utils.isEmpty(Links)) {
                var SubElementLinks = Links[ctrl.Setting.TargetCode]
                if (ctrl.$Utils.isEmpty(SubElementLinks)) {
                  SubElementLinks.forEach((value) => {
                    if (ctrl.$Utils.isEmpty(item[value.Source])) {
                      object[value.Target] = item[value.Source];
                    }
                    if (ctrl.$Utils.isEmpty(item[value.Source + "Name"])) {
                      object[value.Target + "Name"] = item[value.Source + "Name"];
                    }
                  });
                }
              }
              ctrl.Setting.Module[i].functions.setData(object);
            } else {
              ctrl.Setting.Module[i].functions.setData(item);
            }
            break;
          }
        }
      }
    },

    /**
     * hàm truyền dữ liệu số bản ghi từ list sang filter
     * @param setting cấu hình của list
     * @param totalRecord số bản ghi cho phân trang
     */
    setPagination(setting, totalRecord) {
      var ctrl = this;
      ctrl.Setting.Module.forEach((module) => {
        if (module.ModuleType == 'Filter' && module.FilterLink && module.FilterLink.indexOf(setting.Code) >= 0) {
          // module.LinkedObject.setUpPagination(totalRecord);
        }
      });
    },

    /**
     * hàm kiểm tra module đầu vào có phần tử là 1 page hay không, nếu có
     * lấy ra danh sách các module con,
     */
    checkSettingPage() {
      var ctrl = this;
      // var checkPage = $q.defer();
      return new Promise((resolve, reject) => {
        if (ctrl.Setting.Module && ctrl.Setting.Module[0] && ctrl.$Utils.isEmpty(ctrl.Setting.Module[0], 'ModuleCode') && ctrl.Setting.Module[0].ModuleCode.indexOf('Page.') == 0) {
          var exist = false;
          var parentSetting = ctrl.$Lodash.cloneDeep(ctrl.Setting.Module[0].parentSetting);
          // var dynamicMenu = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.DynamicMenu);
          if (ctrl.$Utils.isEmpty(dynamicMenu)) {
            var menuObject = JSON.parse(dynamicMenu);
            menuObject.urlPage.forEach((page) => {
              if (page.Code == ctrl.Setting.Module[0].ModuleCode) {
                angular.forEach(page, function(val, key) {
                  ctrl.Setting[key] = val;
                });
                exist = true;
                ctrl.Setting.Module = page.children;
                if (ctrl.$Utils.isEmpty(parentSetting)) {
                  ctrl.Setting.Module.forEach((m) => {
                    m.parentSetting = parentSetting;
                  });
                }
                /** chuyển giao diện về dạng module con*/
                ctrl.Setting.directiveType = 'inside';
                ctrl.Setting.place = 'page';
                resolve();
              }
            });
          }
          if (!exist) {
            ctrl.$Utils.showMessage('error', ctrl.$toastMessage.settingTemplateError);
            /** đóng pop-up*/
            if (ctrl.$Utils.isEmpty(ctrl.Setting.closeModal)) {
              ctrl.Setting.closeModal();
            }
            reject();
          }
        } else {
          resolve();
        }
      })
    },

    /**
     * Hàm replace các giá trị trong parameter
     */
    replaceExpression(request, object) {
      var ctrl = this;
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
              var value = ctrl.$Utils.getDataWithRoot(object, name)[0];
              var filter = key.substr(key.indexOf('|') + 1, key.length).split(':');
              var type = filter[0].trim();
              var format = filter[1];
              switch (type) {
                /** trường hợp ngày tháng, lấy giá trị ngày tháng hiện tại với định dạng*/
                case 'Date':
                  value = ctrl.$Utils.stringToDate(value);
                  returnExpression += ctrl.$Utils.formatDateTime(value, format);
                  break;
                case 'RangeTime':
                  returnExpression += ctrl.$Utils.getDateTimeByKey(format);
                  break;
                case 'UserInfo':
                  /** trường hợp lấy thông tin người dùng*/
                  returnExpression += ctrl.$Utils.getUserInfo(name);
                  break;
                case 'Url':
                  /** trường hợp lấy thông tin từ đường dẫn*/
                  if (this.$Utils.isEmpty(this.$route.params, 'value'))
                    returnExpression += this.$Utils.stringToObject(this.$route.params.value)[name];
                  break;value
                default:
                  returnExpression += value;
                  break;
              }
            } else if (ctrl.$Utils.isEmpty(object[key])) {
              returnExpression += object[key];
            }
            exp = exp.substr(exp.indexOf('}}') + 2, exp.length);
          }
          request[paramName] = returnExpression;
        }
      });
      return request;
    },

    /**
     * hàm set các giá trị cấu hình từ filter sang side-nav
     */
    setFilterSideNav(filterSetting, objSetting) {
      var ctrl = this;
      ctrl.filterSetting = [];
      ctrl.filterSetting = filterSetting
      ctrl.filter = {
        display: "",
        arrComponent: ctrl.filterSetting.arrComponent,
        arrMain: ctrl.filterSetting.arrMain,
      };
      // if (ctrl.filter.arrComponent) {
      ctrl.filter.display = ctrl.filter.arrComponent[0].Name;
      ctrl.filter.arrTree = ctrl.$Lodash.cloneDeep(ctrl.filter.arrComponent)
      var listTree = "";
      if (ctrl.Setting.FilterLeft == "true") {
        $.each(ctrl.filter.arrTree, (key, value) => {
          ctrl.filter.arrTree[key].ElementType = "Tree";
          if(value.Name != 'PublishedDate')
            listTree += value.Name + ";";
        })
      }

      var filters = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.FilterData);
      filters = filters && filters != "undefined" ? JSON.parse(filters) : {};
      $.each(ctrl.filter.arrTree, (key, value) => {
        if(listTree != ""){
          ctrl.filter.arrTree[key].ListTree = listTree;
        }
        if (ctrl.filter.arrTree[key].FieldColumnType == 'DateTime')
          ctrl.filter.arrTree[key].DisplayLayout = "row"
        if (ctrl.$Utils.isEmpty(ctrl.SelectedFilter) && ctrl.$Utils.isEmpty(objSetting)) {
          if (ctrl.$Utils.isEmpty(filters, ctrl.SelectedFilter.name)) {
            if (ctrl.$Utils.isEmpty(filters[ctrl.SelectedFilter.name], value.Name)) {
              ctrl.filter.arrTree[key].DefaultValue = filters[ctrl.SelectedFilter.name][value.Name];
              if (ctrl.$Utils.isEmpty(filters[ctrl.SelectedFilter.name], value.Name + "Name")) {
                ctrl.filter.arrTree[key].DefaultValue = "id=" + filters[ctrl.SelectedFilter.name][value.Name] + "&text=" + filters[ctrl.SelectedFilter.name][value.Name + 'Name']
              }
            }
          }
        }
      })
      // if(ctrl.$Utils.isEmpty(ctrl.SelectedFilter) && ctrl.$Utils.isEmpty(objSetting))
      // onsearch(objSetting);
      if (ctrl.filter.arrMain) {
        // ctrl.filter.display = ctrl.filter.arrMain[0].Name;
      }
    },


    /// gọi hàm filter
    onsearch(objSetting, addValue) {
      var ctrl = this;
      if (ctrl.$Utils.isEmpty(objSetting, 'functions.onPagination')) {
        if (ctrl.$Utils.isEmpty(ctrl.filter, 'arrTree')) {
          if (addValue)
            ctrl.getFieldsData(0, [], objSetting, addValue)
          else
            ctrl.getFieldsData(0, [], objSetting, [])
        } else {
          objSetting.functions.onPagination(1, addValue);
        }
      }
    },

    onFilter(arrFilterData, objSetting) {
      var ctrl = this;
      objSetting.FilterLink.forEach(function(code) {
        for (var i = 0; i < ctrl.Setting.Module.length; i++) {
          if (ctrl.Setting.Module[i].Code == code) {
            if (ctrl.$Utils.isEmpty(ctrl.Setting.Module[i], 'functions.search' + ctrl.Setting.Module[i].ModuleType)) {
              ctrl.Setting.Module[i].functions['search' + ctrl.Setting.Module[i].ModuleType](arrFilterData);
            }
            break;
          }
        }
      });
    },

    getFieldsData(intCount, arrResult, objSetting, addValue, callback) {
      var ctrl = this;
      if (intCount < ctrl.filter.arrTree.length) {
        /**
         * kiểm tra element con có hàm getVal hay không
         * nếu có sẽ kiểm tra validate trả về, valid = false thì dừng lại, nếu = true thì thêm kết quả vào mảng
         * nếu không sẽ gọi lại chính nó với intCount tăng lên 1
         */
        if (ctrl.$Utils.isEmpty(ctrl.filter.arrTree[intCount].getVal)) {
          ctrl.filter.arrTree[intCount].getVal(function(returnData) {
            var isOk = true;
            for (var i = 0; i < returnData.length; i++) {
              if (returnData[i].validate) {
                arrResult.unshift(returnData[i]);

              } else {
                isOk = false;
                break;
              }
            }
            if (isOk)
              ctrl.getFieldsData(intCount + 1, arrResult, objSetting, addValue, callback);
          });
        } else
          ctrl.getFieldsData(intCount + 1, arrResult, objSetting, addValue, callback);
      } else {
        ctrl.filter.data = arrResult;
        if (ctrl.Filtersave === true) {
          var dataSave = {};
          ctrl.filter.data.forEach((value) => {
            if (ctrl.$Utils.isEmpty(value, 'value') && value.value !== "") {
              dataSave[value.name] = value.value;
            }
          })
          // $mdDialog.show({
          //   controller: 'AddFilterController as ctrl',
          //   templateUrl: 'app/main/dynamic/page/dialogs/add/add-dialog.html',
          //   // targetEvent: ev,
          //   disableParentScroll: false,
          //   clickOutsideToClose: true,
          //   locals: { dataToPass: dataSave }
          // });
          ctrl.Filtersave = false;
        }
        if (ctrl.Filterlist === true) {
          var dataSave = {};
          // $mdDialog.show({
          //   controller: 'FilterListController as ctrl',
          //   templateUrl: 'app/main/dynamic/page/dialogs/filters/filters-dialog.html',
          //   // targetEvent: ev,
          //   disableParentScroll: false,
          //   clickOutsideToClose: true,
          //   locals: { dataToPass: dataSave }
          // });
          ctrl.Filterlist = false;
        }
        if (addValue && addValue.length > 0) {
          addValue.forEach((value) => {
            arrResult.push(value)
          })
        }
        objSetting.functions.onPagination(1, arrResult);
        ctrl.FilterData = arrResult;
      }
    },

    onClearFilter(objSetting) {
      var ctrl = this;
      objSetting.arrMain.forEach((component) => {
        if (ctrl.$Utils.isEmpty(component, 'clearData')) {
          component.clearData();
        }
      });
      objSetting.arrComponent.forEach((component) => {
        if (ctrl.$Utils.isEmpty(component, 'clearData')) {
          component.clearData();
        }
      });
      objSetting.arrTree.forEach((component) => {
        if (ctrl.$Utils.isEmpty(component, 'clearData')) {
          component.clearData();
        }
      });
    },

    // end
    /**
     * hàm gọi sự kiện search trong list hoặc report
     * @param arrFilterData
     * @param objSetting
     */

    // onFilter(arrFilterData, objSetting) {
    //   var ctrl = this;
    //   if (ctrl.onMono == true && ctrl.$Utils.isEmpty(ctrl.FilterDate)) {
    //     arrFilterData.push(arrFilterData[0])
    //     arrFilterData.push(arrFilterData[1])
    //     ctrl.onMono = false;
    //   }
    //    ctrl.addValue = ctrl.$Utils.isEmpty(arrFilterData) ? ctrl.$Lodash.cloneDeep(arrFilterData) : [];
    //   setTimeout(() => {
    //     if(ctrl.$Utils.isEmpty(ctrl.filter)){
    //       ctrl.filter.display = (!ctrl.$Utils.isEmpty(ctrl.fil) || (ctrl.$Utils.isEmpty(ctrl.filter.display) && ctrl.fil != ctrl.filter.display)) ? ctrl.filter.display : ctrl.$Lodash.cloneDeep(ctrl.fil);
    //     }
    //   }, 0);
    //   objSetting.FilterLink.forEach((code) => {
    //     for (var i = 0; i < ctrl.Setting.Module.length; i++) {
    //       if (ctrl.Setting.Module[i].Code == code && ctrl.Setting.Module[i].Group == objSetting.Group) {
    //         if (ctrl.$Utils.isEmpty(ctrl.Setting.Module[i], 'LinkedObject.search' + ctrl.Setting.Module[i].ModuleType)) {
    //           ctrl.Setting.Module[i].LinkedObject['search' + ctrl.Setting.Module[i].ModuleType](arrFilterData);
    //         }
    //         break;
    //       }
    //     }
    //   });
    // },

    // monoSearch(date) {
    //   var ctrl = this;
    //   if(ctrl.$Utils.isEmpty(ctrl.filter, 'display')){
    //     ctrl.fil = ctrl.$Lodash.cloneDeep(ctrl.filter.display)
    //     ctrl.filter.display = null;
    //   }
    //   var url = $location.absUrl();
    //   if(date == "0" && url.indexOf("ModifiedStartValue") == -1 && url.indexOf("ModifiedEndValue") == -1){
    //     date = ctrl.$rootScope.DateChange ? ctrl.$rootScope.DateChange : 'Week';
    //   }
    //   ctrl.searchDate = date;
    //   ctrl.$rootScope.DateChange = ctrl.searchDate;
    //  /* ctrl.$rootScope.ChangeDateView = ctrl.searchDate;*/
    //   var type = date;
    //   if (!ctrl.$Utils.isEmpty(ctrl.FilterDate)) {
    //     ctrl.FilterDate = date;
    //   }
    //   var dateField = "PlanStartDate";
    //   if (ctrl.$Utils.isEmpty(ctrl.Setting.Groups, '0') && ctrl.Setting.Groups[0].Modules[0].DataSource == "xDocument_Document")
    //     dateField = "PublishedDate";
    //   if (date == 'Week' || date == 'Month' || date == 'Year' || date == 'DayAgo' || date == 'Day' || date == 'DayNext' || date == 'WeekAgo' || date == 'MonthAgo' || date == 'WeekNext' || date == 'MonthNext') {
    //     var start = {
    //       name: dateField + "StartValue",
    //       submit: true,
    //       validate: true,
    //       value: ctrl.$Utils.getDateTimeByKey(date + 'Start')
    //     }
    //     var end = {
    //       name: dateField + "EndValue",
    //       submit: true,
    //       validate: true,
    //       value: ctrl.$Utils.getDateTimeByKey(date + 'End')
    //     }
    //   } else if (date != 'Day' && date.indexOf('Day') > -1) {
    //     var ndate = new Date()
    //     var preDay = date.split('Day')[0]
    //     var StartDate = ctrl.$Lodash.cloneDeep(ndate);
    //     StartDate.setDate(ndate.getDate() - preDay)
    //     StartDate.setHours(0, 0, 0, 0)
    //     var EndDate = ctrl.$Lodash.cloneDeep(ndate);
    //     EndDate.setHours(23, 59, 59, 999)
    //     var start = {
    //       name: dateField + "StartValue",
    //       submit: true,
    //       validate: true,
    //       value: ctrl.$Utils.formatDateTime(StartDate)
    //     }
    //     var end = {
    //       name: dateField + "EndValue",
    //       submit: true,
    //       validate: true,
    //       value: ctrl.$Utils.formatDateTime(EndDate)
    //     }
    //   }

    //   var condition = [];
    //   var filter = [];
    //   filter.push(start)
    //   filter.push(end)
    //   condition.push(filter);
    //   condition.push({ 'type': type });
    //   // if (ctrl.ShowList == 0 || !ctrl.filter || ctrl.Setting.FilterLeft == 'true') {
    //     angular.forEach(ctrl.Setting.Groups, function(group) {
    //       angular.forEach(group.Modules, function(obj) {
    //         if (obj.ModuleType == "Filter") {
    //           ctrl.mergeSearch(obj, filter);
    //         }
    //       })
    //     })
    //     // ctrl.onMono = true;
    //   // } else {
    //     ctrl.$rootScope.startDate = start.value;
    //     ctrl.$rootScope.endDate = end.value;
    //     ctrl.$rootScope.$broadcast("monoSearch", condition);
    //   // }
    // },

    searchProject(data) {
      var ctrl = this;
      if(ctrl.$Utils.isEmpty(ctrl.$rootScope.modeProject) && ctrl.$rootScope.modeProject.mode == 'MODE_PROJECT'){
        var objProject = {
          name: "VersionProject",
          submit: true,
          validate: true,
          value: data.Id
        }
      } else {
        var objProject = {
          name: "Project",
          submit: true,
          validate: true,
          value: data.GroupId
        }
      }

      var condition = [];
      var filter = [];
      filter.push(objProject)
      condition.push(filter);
      if (ctrl.ShowList == 0 || !ctrl.filter || ctrl.Setting.FilterLeft == 'true') {
        ctrl.Setting.Groups.forEach((group) => {
          group.Modules.forEach((obj) => {
            if (obj.ModuleType == "Filter") {
              ctrl.mergeSearch(obj, filter);
            }
          })
        })
        // ctrl.onMono = true;
      }
    },

    mergeSearch (obj, filter){
      var ctrl = this;
      if(!ctrl.$Utils.isEmpty(ctrl.mergeFilter)){
        ctrl.mergeFilter = [];
        if(ctrl.$Utils.isEmpty(filter[0]))
         ctrl.mergeFilter = ctrl.mergeFilter.concat(filter);
        ctrl.onsearch(obj, ctrl.mergeFilter);
        ctrl.onMono = true;
      } else {
        if(JSON.stringify(ctrl.mergeFilter).indexOf(filter[0].name) == -1){
          ctrl.mergeFilter = ctrl.mergeFilter.concat(filter);
          ctrl.onsearch(obj, ctrl.mergeFilter);
          ctrl.onMono = true;
        } else {
          $.each(ctrl.mergeFilter, function(key, value){
            if(!ctrl.$Utils.isEmpty(value)){
              delete ctrl.mergeFilter[key];
            } else if(value.name == filter[0].name){
              ctrl.mergeFilter[key] = filter[0];
            } else if(ctrl.$Utils.isEmpty(filter, '1') && value.name == filter[1].name){
              ctrl.mergeFilter[key] = filter[1];
            }
          })
          ctrl.onsearch(obj, ctrl.mergeFilter);
          ctrl.onMono = true;
        }
      }
      // ctrl.mergeFilter.push(filter);
      // onsearch(obj, ctrl.mergeFilter);
    },

    onExportExcel() {
      var ctrl = this;
      ctrl.Setting.message = '';
      ctrl.searchCondition = ctrl.FilterData;
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'ExcelRequest',
        TotalRequests: 1,
        R1_RequestTemplate: "AG_Task_Task.Search",
        R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
        R1_RequestFields: "Index;Name;StatusName;WorkerName;PlanStartDate;Deadline;Modified;PriorityIdName;StatusDisplayName;TotalDownload;TotalComment;Id;",
        ExportType: 'List',
        ExcelFormat: 'Xls',
        RequestHeader: JSON.stringify({
          Index: "Mã",
          Name: "Tên công việc",
          StatusName: "Trạng thái",
          WorkerName: "Người thực hiện",
          PlanStartDate: "Ngày thực hiện",
          Deadline: "Ngày kết thúc",
          Modified: "Cập nhật",
          PriorityIdName: "Ưu tiên",
          StatusDisplayName: "Xem trạng thái",
          TotalDownload: "Số file đính kèm",
          TotalComment: "Số bình luận",
          Id: "Id"
        }),
        R1_UserField: "Worker"
      };

      delete request.R1_StartIndex;
      delete request.R1_EndIndex;

      if (ctrl.Setting.DataSource === "AG_Task_Task") {
        request.R1_AssignedUser = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId);
        if (ctrl.$Utils.isEmpty(ctrl.$rootScope.loggedOnUser.Project, 'GroupId') && (!ctrl.$Utils.isEmpty(request['R1_Project']) || !ctrl.$Utils.isEmpty(request['R2_Project']) || request['R1_Project'] === "" || request['R2_Project'] === "")) {
          request['R1_Project'] = ctrl.$rootScope.loggedOnUser.Project.GroupId;
        }
      }

      if (ctrl.$Utils.isEmpty(ctrl.Setting, "AdditionConditions") && ctrl.Setting.AdditionConditions.Code === "Document") {
        if (ctrl.$Utils.isEmpty(ctrl.$rootScope.loggedOnUser.Project, 'GroupId') && (!ctrl.$Utils.isEmpty(request['R1_Project']) || !ctrl.$Utils.isEmpty(request['R2_Project']) || request['R1_Project'] === "" || request['R2_Project'] === "")) {
          request['R1_Project'] = ctrl.$rootScope.loggedOnUser.Project.GroupId;
        }
      }

      if (ctrl.Setting.AssignedUser === "true") {
        request.R1_AssignedUser = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId);
      }

      $.each(ctrl.Setting.AdditionConditions, (ckey, value) => {
        if (ctrl.$Utils.isEmpty(value) && value.indexOf("|BaseData}}") >= 0 && ctrl.$Utils.isEmpty(ctrl.BaseData)) {
          var exp = value,
            returnExpression = '';
          var returnExpression = exp.substr(0, exp.indexOf('{{'));
          var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
          /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
          var name = key.substr(0, key.indexOf('|')).trim();
          request['R1_' + ckey] = ctrl.BaseData[name];
        } else {
          request['R1_' + ckey] = value;
        }
      });
      ctrl.ListSearchConditions.forEach((condition) => {
        request['R1_' + condition.name] = condition.value;
      });
      if (angular.isArray(ctrl.FilterData)) {
        ctrl.FilterData.forEach((condition) => {
          if (ctrl.$Utils.isEmpty(condition, "setting") && condition.setting.Expression == "#Divine") {
            condition.value.split(";").forEach((divine) => {
              if (ctrl.$Utils.isEmpty(divine) && divine != "") {
                request['R1_' + divine] = 1;
              }
            })
          }
          if (ctrl.$Utils.isEmpty(condition, "setting") && condition.setting.ElementType == "MultiTree") {
            $.each(condition.value.split(";"), (key, divine) => {
              if (ctrl.$Utils.isEmpty(divine) && divine != "") {
                var level = key + 1
                request['R1_' + condition.name + "Level" + level] = divine;
                delete request['R1_' + condition.name];
              }
            })
          } else if (ctrl.$Utils.isEmpty(condition, 'value') && condition.value !== '' && (!ctrl.$Utils.isEmpty(condition, 'setting') || condition.setting.FormElementType != "Multi")) {
            request['R1_' + condition.name] = condition.value;
          } else if (ctrl.$Utils.isEmpty(condition, 'value') && condition.value !== '' && ctrl.$Utils.isEmpty(condition, 'setting') && condition.setting.FormElementType == "Multi" && condition.setting.DynamicText != condition.name) {

            request['R1_' + condition.name] = condition.value;
          }
        });
      }
      $.each(request, (key, val) => {
        request[key] = ctrl.$Utils.expressionToString(ctrl.Setting.objDefault, val + '');
      });

      ctrl.$Utils.postGetExcel(request).then((response) => {
        var blob = new Blob([response], {
          type: "application/vnd.ms-excel"
        });

        // ctrl.saveAs(blob, "Danh Sách Công Việc ngày " + $filter('date')(new Date(), 'dd/MM/yyyy') + ".xls");
      })
    },

    saveAs(blob, fileName) {
      var ctrl = this;
      if (window.navigator.msSaveOrOpenBlob) { // For IE:
        navigator.msSaveBlob(blob, fileName);
      } else { // For other browsers:
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    },

    saveFilter(objSetting) {
      var ctrl = this;
      ctrl.Filtersave = true;
      ctrl.getFieldsData(0, [], objSetting)
    },

    showFilter(objSetting) {
      var ctrl = this;
      ctrl.Filterlist = true;
      ctrl.getFieldsData(0, [], objSetting)
    },

    onChangePage(number) {
      var ctrl = this;
      ctrl.CurrentList = number;
      ctrl.ShowList = number;
      if (number == 1) {
        ctrl.Link = "scrumboard";
      } else if (number == 2) {
        ctrl.Link = "calendar";
      }else if (number == 3){
        ctrl.Link = "timeline";
      }
      else if (number == 0 && ctrl.Setting.UrlPage == 'dynamic/view-all-task-page') {
        ctrl.ListPage = 'clList';
        ctrl.btt = true;
      };
      var request = {
        RequestClass: 'BPM',
        RequestAction: 'UpdateUser',
        DynamicFields: "CurrentList",
        StaticFields: "UserId",
        UserId: ctrl.$rootScope.loggedOnUser.UserId,
        CurrentList: ctrl.ShowList,
        SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId)
      };
      ctrl.$Utils.post(request).then((data) => {
        var user = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser);
        user = JSON.parse(user);
        user.CurrentList = ctrl.ShowList
        // ctrl.searchDate = '';
        ctrl.$setItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser, JSON.stringify(user));
        if (number != 0) {
          var link = $location.path();
          if (!isMobile.iOS() && myDevice == 'isMobileApp')
            link = link.substring(0, 1) == "/" ? link.substring(1, link.length) : link;
          window.history.pushState(null, ctrl.Setting.Caption, link);
          ctrl.ListType = false;
        } else if(!ctrl.ListType){
          // $state.reload();
        }
        if(number == 2){
          ctrl.searchDate = '';
        }
      })

    },

    show(status) {
    var ctrl = this;

      if (status == true)
        ctrl.Showa = false
      else
        ctrl.Showa = true

    },
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
