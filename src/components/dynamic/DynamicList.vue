<template>
<div class="tasklist">
  <el-row >
    <el-col :span="22" v-if="!Setting.IsDetail">
      <el-button v-if="Setting.ShowInsertButton" @click="onLinkClick(Setting.InsertButton,{})"><i class="el-icon-circle-plus-outline"></i></el-button>
      <span v-if="$isMobileDevice || (!Setting.ShowInsertButton && !Setting.ShowExportButton)">&nbsp;</span>
      <el-button v-if="Setting.ShowExportButton && !$isMobileDevice" @click="excuteExcel()"><i class="fa fa-file-excel-o"></i></el-button>
    </el-col>
    <!--
    <md-button class="md-fab md-mini md-accent md-icon-button float-right"
      ng-mousedown="ctrl.onLinkClick(ctrl.Setting.InsertButton,{})"
      aria-label="Thêm" href="{{ctrl.currentLink}}"
      ng-show="ctrl.Setting.ShowInsertButton">
      <md-tooltip md-direction="top">Thêm</md-tooltip>
      <md-icon md-font-icon="icon-loupe"></md-icon>
    </md-button>
    <md-button class="md-fab md-mini md-accent md-icon-button float-right"
      aria-label="Xuất bản"
      ng-json-export-excel data="ctrl.ExportItem"
      report-fields="ctrl.objColumnp"
      filename="ctrl.Setting.Caption"
      ng-show="ctrl.Setting.ShowExportButton && !ctrl.isMobile">
      <md-tooltip md-direction="top">Xuất bản</md-tooltip>
      <md-icon md-font-icon="icon-file-excel"></md-icon>
    </md-button>
    -->
    <el-col :span="2" ng-if="!Setting.IsDetail">
      <Pagination :totalPage="totalP" :currentPage="currentP" :pagesize="maxItem" :callback="handleSelectPage"/>
   </el-col>
   </el-row>
  <el-table :data="FormatData" style="width: 100%" empty-text="Không có dữ liệu">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column v-for="(item, index) in ListColumns" :key="index" :label="item.Caption" :class-name="formatClass(item)" :min-width="item.Caption === 'Công việc' ? '300' : '80'">
      <template slot-scope="scope">
        <div :style="formatStyle(item, scope.row)">
          <div v-if="item.Name === 'Tool'">
              <div v-if="Setting.ButtonsAddHtml && Setting.ButtonsAddHtml.constructor === String && Setting.ButtonsAddHtml != ''">
                <span v-html="expressionHtmlString(Setting.ButtonsAddHtml, scope.row)"></span>
                <!--
                <input class="list-check" type="checkbox" @checked="exists(scope.$index)" @click="toggle(scope.$index)">
                -->
                <span class="position-relative pr-1" v-for="(button, bIndex) in ListButtons" :key="button.Id"  v-if="(button.ExtraTextClass && displayControl(button, scope.row).extraText) || !button.ExtraTextClass">
                     <router-link :to="'/' + $Utils.expressionToString(scope.row.SourceData, button.Redirect)" v-if="button.ButtonType == 'Redirect'">
                      <i type="primary" :class="'icon ' + button.Icon" data-toggle='tooltip' data-placement='top' :title='button.Caption'></i>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </router-link>
                    <!--
                    <a :href="'#/' + $Utils.expressionToString(scope.row.SourceData, button.Redirect)" v-if="button.ButtonType == 'Redirect'">
                      <i type="primary" :class="'icon ' + button.Icon" data-toggle='tooltip' data-placement='top' :title='button.Caption'></i>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </a>
                    -->
                    <el-button type="primary" :class="'icon ' + button.Icon "  v-if="button.ButtonType != 'Redirect'" @click="onButtonClick(bIndex, scope.$index)" data-toggle='tooltip' data-placement='top' :title='button.Caption'>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </el-button>
                </span>
              </div>
              <div layout="row" class="default-tool" v-else>
                <input class="list-check" type="checkbox" @checked="exists(scope.$index)" @click="toggle(scope.$index)">
                <span class="position-relative pr-1" v-for="(button, bIndex) in ListButtons" :key="button.Id"  v-if="(button.ExtraTextClass && displayControl(button, scope.row).extraText) || !button.ExtraTextClass">

                    <router-link :to="'/' + $Utils.expressionToString(scope.row.SourceData, button.Redirect)" v-if="button.ButtonType == 'Redirect'">
                      <i type="primary" :class="'icon ' + button.Icon" data-toggle='tooltip' data-placement='top' :title='button.Caption'></i>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </router-link>
                    <!--
                    <a :href="'#/' + $Utils.expressionToString(scope.row.SourceData, button.Redirect)" v-if="button.ButtonType == 'Redirect'"><i type="primary" :class="'icon ' + button.Icon" data-toggle='tooltip' data-placement='top' :title='button.Caption'></i>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </a>
                    -->
                    <el-button type="primary" :class="'icon ' + button.Icon "  v-if="button.ButtonType != 'Redirect'" @click="onButtonClick(bIndex, scope.$index)" data-toggle='tooltip' data-placement='top' :title='button.Caption'>
                      <span class="bg-danger text-white text-center" v-if="button.ExtraTextClass">{{displayControl(button, scope.row).extraText}}</span>
                    </el-button>
                </span>
              </div>
          </div>
          <span v-else-if="item.ElementType == 'Popup'">
            <!-- <a :href="'#/' + $Utils.expressionToString(scope.row.SourceData, item.Redirect)" v-if="!item.ButtonType && item.ElementType == 'Link' && item.Redirect">{{scope.row[item.Name]}}</a> -->
            <a href="javascript:void(0)" @click="onFieldClick(index , scope.$index)" >{{scope.row[item.Name]}}</a>
            <span v-if="Setting.LinksAddHtml" v-html="expressionHtmlString(Setting.LinksAddHtml, scope.row)"></span>
          </span>
          <span v-else-if="item.ElementType == 'Link'">
            <router-link :to="'/' + $Utils.expressionToString(scope.row.SourceData, item.Redirect)" v-if="!item.ButtonType && item.ElementType == 'Link' && item.Redirect">
                      {{scope.row[item.Name]}}
            </router-link>
            <!--
            <a :href="'#/' + $Utils.expressionToString(scope.row.SourceData, item.Redirect)" v-if="!item.ButtonType && item.ElementType == 'Link' && item.Redirect">{{scope.row[item.Name]}}</a>
            -->
            <a href="javascript:void(0)" @click="onFieldClick(index , scope.$index)" v-else>{{scope.row[item.Name]}}</a>
            <span v-if="Setting.LinksAddHtml" v-html="expressionHtmlString(Setting.LinksAddHtml, scope.row)"></span>
          </span>
          <span v-else-if="item.FormElementType == 'Html'" v-html="scope.row[item.Name]"></span>
          <span v-else>{{scope.row[item.Name]}}</span>
        </div>
        <!-- <i class="el-icon-time"></i> -->
        <!-- <div v-html="bindToolHtml(item, scope.row, scope)"></div> -->
      </template>
      <!-- <template slot-scope="scope" v-if="item.Name !== 'Tool'">
        {{scope.row[item.Name]}}
      </template> -->
    </el-table-column>
    <!-- <el-table-column
      prop="Index"
      label="Index">
       <template slot-scope="scope">
        <span  style="text-align: center" @click="openTaskDetail(scope.row.Index)" > {{scope.row.Index}} </span>
      </template>
    </el-table-column> -->
  </el-table>
  <el-row>
    <Pagination :totalPage="totalP" :currentPage="currentP" :pagesize="maxItem" :callback="handleSelectPage"/>
  </el-row>
</div>
</template>

<script>
import Vue from 'vue'
import Pagination from "@/components/dynamic/Pagination";
import DynamicPage from "@/components/dynamic/DynamicPage";
import ShowTaskDetail from "@/components/static/ShowTaskDetail";

export default {
  components: { Pagination, DynamicPage },
  props:["pSetting", "urlData"],
  data() {
    var ctrl = {};
    ctrl.totalCountPage = this.$rootScope.totalIndexSearch;
    ctrl.Setting = this.pSetting;
    ctrl.isIOs = this.$isMobile.iOS();
    // ctrl.BaseData = $scope.BaseData;
    ctrl.selected = [];
    ctrl.isSelected = false;
    ctrl.urlPageDocument = this.$rootScope.urlPageDocument;
    ctrl.Setting.Flag = false;
    ctrl.objColumnp = [];
    ctrl.lastFilterExecuted = {};
    ctrl.ListButtons = [];
    ctrl.selectedValue = '';
    ctrl.FormatData = [];
    ctrl.currentP = 1;
    ctrl.startIndex = 1;
    ctrl.endIndex = 20;
    ctrl.totalP = 0;
    ctrl.maxItem = 50;
    ctrl.dateStart = '';
    ctrl.dateEnd = '';
    ctrl.selectedWorker = [];
    ctrl.Id = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).UserId;
    if (ctrl.urlPageDocument === 'dynamic/knowhow-document') {
      ctrl.idDocument = 'idDocumentAdd';
    }
    return ctrl;
  },
  methods: {
    handleSelectPage(val) {
      this.currentP = val;
      this.startIndex = eval(val - 1) * this.maxItem;
      this.endIndex = this.startIndex + this.maxItem;
      var index = [{
        name: "StartIndex",
        submit: true,
        validate: true,
        value: this.startIndex
      },
      {
        name: "EndIndex",
        submit: true,
        validate: true,
        value: this.endIndex
      }]
      this.searchCondition = this.$Lodash.unionBy(index, this.searchCondition, 'name')
      // var res = this.searchCondition.map(obj => index.find(o => o.name === obj.name) || obj);
      this.searchList(this.searchCondition, true);
      //alert(val)
    },
    onShowDetailDialog(listEvent, comment,objSetting) {
      //var objSetting = listEvent;
      var ctrl = this;
      $.each(ctrl.Setting.Fields, function(k, field){
        if(field.Caption === 'ListDetail'){
          ctrl.displayHTMLDetail = field.AddHtml;
        }
      });
      if(ctrl.displayHTMLDetail) {
        listEvent.DisplayDetail = ctrl.expressionHtmlString(ctrl.displayHTMLDetail, listEvent);
        var locals= {
          dataToPass: listEvent,
            setting: ctrl.Setting,
            comment: comment
        }
        ctrl.$hub.$emit(
          "set-modal-data",
          "Chi tiết",
          "50%",
          true,
          "center",
          ShowTaskDetail,// html here
          true, '',
          locals,
        );
      } else {
        /** khởi tạo dữ liệu  truyền vào directive con*/
        var item = listEvent;
        if (!this.$Utils.isEmpty(item)) {
          item = {};
        }
        $.each(this.$Lodash.cloneDeep(ctrl.Setting.objDefault), (key, val)=> {
          item[key] = val;
        });
        var object = {};
        if (objSetting.ParentChild && objSetting.ParentChild.constructor == String) {
          $.each(this.$Utils.stringToObject(objSetting.ParentChild),  (parentKey,childKey)=> {
            if (this.$Utils.isEmpty(item, parentKey)) {
              object[childKey] = item[parentKey];
            }
          });
        }
        else
          object = item;

        if (this.$Utils.isEmpty(objSetting.Value) && objSetting.Value.indexOf('ReferenceId') > 0) {
          var array = this.$Utils.stringToObject(objSetting.Value);
          $.each(array, function (key, val) {
            object[key] = val;
          })
        }
        objSetting.parentSetting = {
          // PreAction:
          object: this.$Lodash.cloneDeep(object),
          set: this.$Lodash.cloneDeep(objSetting),
          callback: ctrl.Setting.functions
        };
        objSetting.directiveType = 'inside';
        /** gọi service mở pop-up*/
        objSetting.ModuleType = objSetting.PopupModuleType ? objSetting.PopupModuleType : "Form";
        /* this.$Utils.showPopup({
          Template: 'Modal',
          Module: [objSetting]
        }); */

          ctrl.$hub.$emit(
          "set-modal-data",
          "Chi tiết",
          "100%",
          true,
          "center",
          DynamicPage,// html here
          true, '',
          {
            Template: 'Modal',
            Module: [objSetting]
          }, false);
      }
    },
    excuteExcel() {
      var ctrl = this;
      var rqField = "";
      var ListHeader = {"Id": "Id"};
      ctrl.ListColumns.forEach(val => {
        if(val.Name !== 'Tool') {
          rqField += val.Name + ";";
          ListHeader[val.Name] = val.Caption;
        }
      });

      var request = ctrl.$Lodash.cloneDeep(ctrl.lastFilterExecuted);
      request.TotalRequests = 1;
      request.RequestClass = 'xBase';
      request.RequestAction = 'ExcelRequest';
      request.R1_RequestFields = rqField + "Id;";
      delete request.R1_StartIndex;
      delete request.R1_EndIndex;
      request.RequestHeader = JSON.stringify(ListHeader);
      request.ExcelFormat = 'Xls';
      request.ExportType = 'List';

      ctrl.$Utils.postGetExcel(request).then(function(response) {
        var blob = new Blob([response], {
          type: "application/vnd.ms-excel"
        });
        ctrl.saveAs(blob, "Danh Sách Công Việc Ngày " + ctrl.$Utils.formatDateTime(new Date(), 'DD/MM/YYYY')  + ".xls");
      })
    },
    saveAs(blob, fileName) {
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
    autoLoad() {
      var ctrl = this;
      var loggedUser = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser));
      $.each(ctrl.Setting.Buttons, function(k, button) {
        if ((typeof button.ExtraSetting)==='string') {
          $.each(ctrl.$Utils.stringToObject(button.ExtraSetting), function(k, v) {
            button[k] = v;
          });
        }
        if (button.ButtonDisplayType === 'Insert') {
          button.ModuleCode = button.PopupModule;
          button.ElementType = button.ElementType ? button.ElementType : 'Popup';
          ctrl.Setting.InsertButton = button;
          ctrl.Setting.ShowInsertButton = true;
          if (ctrl.$Utils.isEmpty(ctrl.Setting.InsertButton.UserPermissions, "0")) {
            ctrl.Setting.ShowInsertButton = false;
            $.each(ctrl.Setting.InsertButton.UserPermissions, function(k, permission) {
              var Roles = loggedUser.Roles;
              var Groups = loggedUser.Groups;
              $.each(Roles, function(k, role) {
                if (permission === role.GroupId) {
                  ctrl.Setting.ShowInsertButton = true;
                }
              })
              $.each(Groups, function(k, group) {
                if (permission === group.GroupId) {
                  ctrl.Setting.ShowInsertButton = true;
                }
              })
            })
          }
        } else if (button.ButtonDisplayType === 'Export') {
          ctrl.Setting.ShowExportButton = true;
        } else if (button.Action === 'Call' && (!ctrl.$Utils.isEmpty(loggedUser.Extension) || ctrl.$isMobile.iOS())) {} else
          ctrl.ListButtons.push(button);
      });
      /** Set up Setting column before render*/
      var arrColumns = [];
      $.each(ctrl.Setting.Fields, function(k, field) {
        if ((typeof field.AdvancedDisplay)==='string') {
          $.each(ctrl.$Utils.stringToObject(field.AdvancedDisplay), function(k, v) {
            if (k !== "AddHtml")
              field[k] = v;
          });
        }
        var type = ctrl.Setting.ModuleType;
        $.each(field, function(key, val) {
          if (key.indexOf(type) === 0 && key.length > type.length)
            field[key.substring(type.length, key.length)] = val;
        });
        if (field.ElementType === 'ButtonGroup' && (field.Buttons)==='string') {
          var arrButtons = field.Buttons.split(';');
          field.Buttons = [];
          $.each(arrButtons, function(k, btnName) {
            $.each(ctrl.ListButtons, function(k, button) {
              if (button.Name === btnName) {
                button.hideOnTool = true;
                field.Buttons.push(button);
              }
            })
          });
        }
        if (field.Name === ctrl.Setting.PartitionSortBy && ctrl.Setting.DisplayType === 'Partition')
          ctrl.PartitionField = field;
        if (field.ListIsMobile === 'true' && ctrl.$isMobileDevice) {
          field.ListIsHidden = 'true'
        }
        field.ElementType = ctrl.$Utils.isEmpty(field.ElementType) ? field.ElementType : 'Text';
        field.Class = field.Class ? field.Class : 'text-nowrap';
        field.Class += ['Double', 'Integer', 'DateTime'].indexOf(field.FieldColumnType) !== -1 ? ' text-right' : '';
        if (field.ListIsHidden !== 'true' && field.Caption !== undefined) {
          if (field.Expression)
            ctrl.objCalculator[field.Name] = field;
          if (field.DynamicText === '') {
            delete field.DynamicText;
          }
          if (field.DynamicText !== undefined && field.DynamicText !== null) {
            field.OldName = ctrl.$Lodash.cloneDeep(field.Name);
            field.Name = field.DynamicText;
          }
          ctrl.ListColumns.push(field);
          // console.log(ctrl.ListColumns)
          arrColumns.push(ctrl.bindColumn(field));
        }
        if ((field.ListIsHidden !== 'true' || field.Name === "Id" || (ctrl.$Utils.isEmpty(field, 'AdvancedDisplay')
            && field.AdvancedDisplay.indexOf("ListIsHidden=true") >= 0))
          && field.Caption !== undefined) {
          if (field.Expression) {
            ctrl.objCalculator[field.Name] = field;
            if (field.Expression === "#Divine") {
              var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
              request.R1_RequestTemplate = field.FormRequest;
              request.R1_ParentCode = field.FormCode.substring(11, field.FormCode.length);
              ctrl.$Utils.post(request).then(function(Sdata) {
                ctrl.ListSettings = ctrl.$Utils.getDataWithRoot(Sdata.R1, field.FormDataRoot);
              });
            }
          }
          if (field.DynamicText !== undefined && !ctrl.$Utils.isEmpty(field.OldName)) {
            field.OldName = ctrl.$Lodash.cloneDeep(field.Name);
            field.Name = field.DynamicText;
          }
          ctrl.FullColumns.push(field);

        }
      });
      ctrl.objColumnp = {};
      $.each(ctrl.FullColumns, function(column) {
        if (ctrl.$Utils.isEmpty(column.Name) && column.Name !== 'Tool') {
          ctrl.objColumnp[column.Name] = column.Caption;
        }
      });
      ctrl.columnp = JSON.stringify(ctrl.objColumnp);
      ctrl.Setting.dtColumns = arrColumns;

      if (ctrl.$Utils.isEmpty(ctrl.Setting, 'parentSetting.object')) {
        $.each(ctrl.Setting.parentSetting.object, function(key, val) {
          ctrl.Setting.objDefault[key] = val;
        });
      }
      if (ctrl.Setting.DisplayType === 'Tree')
        ctrl.setTreeColumn(ctrl.ListColumns);
      if (ctrl.Setting.AutoSearch)
        ctrl.searchList();
    },
    showEdit(data) {
      var ctrl = this;
      var dataToPass = {
        Code: "Form.cap-nhat-nhieu-cong-viec.048h8",
        Description: { DataSource: "AG_Task_Task", RootData: "Data.TasksDS.Task" },
        Name: "DataGroup.danh-sach-cong-viec.04b66"
      };
      var objSetting = {
        "RootData": dataToPass.Description.DataSource,
        "ElementType": "Popup",
        "ModuleCode": dataToPass.Code,
        "parentSetting": {
          "listTask": ctrl.selectedValue,
          "set": {
            "ElementType": "Popup",
            "GetFullData": "true"
          },
          "isCall": true
        },
        "ModuleType": "Form"
      };
      // //ntn show popup
      // utilsLibrary.showPopup({
      //   Template: 'Modal',
      //   Module: [objSetting]
      // });
    },
    searchList(searchCondition, pag) {
      var ctrl = this;
      if(!pag){
        ctrl.currentP = 1;
        ctrl.searchCondition = searchCondition;
      }
      var sessionId = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId);
      var loggedOnUser = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser));
      ctrl.Setting.message = '';

      //console.log(ctrl.Setting)
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: 2,
        R1_RequestTemplate: ctrl.Setting.DataSource + '.Search',
        R1_RequestDataGroup: ctrl.Setting.DataGroup,
        R1_RequestFields: 'Id;',
        R2_RequestTemplate: ctrl.Setting.DataSource + '.Count',
        R2_RequestDataGroup: ctrl.Setting.DataGroup
      };
      if(ctrl.selectedWorker.length > 0){
        request.R1_Worker = this.selectedWorker.join(";");
      }
      if (ctrl.Setting.DataSource === "AG_Task_Task") {
        request.R1_AssignedUser = sessionId;
        request.R2_AssignedUser = sessionId;
        if (!ctrl.$isSystemAdmin() && !ctrl.$isMantisAdmin() && ctrl.$Utils.isEmpty(loggedOnUser.Project, 'GroupId')
          && (!ctrl.$Utils.isEmpty(request['R1_Project']) || !ctrl.$Utils.isEmpty(request['R2_Project']) || request['R1_Project'] === "" || request['R2_Project'] === "")) {
          request['R1_Project'] = loggedOnUser.Project.GroupId;
          request['R2_Project'] = loggedOnUser.Project.GroupId;
          request.R1_RequestFields += 'Project;ProjectName';
        }
      }
      if (ctrl.Setting.AssignedUser === "true") {
        request.R1_AssignedUser = sessionId;
        request.R2_AssignedUser = sessionId;
      }
      $.each(ctrl.Setting.AdditionConditions, function(ckey, value) {
        if (ctrl.$Utils.isEmpty(value) && value.indexOf("|BaseData}}") >= 0 && ctrl.$Utils.isEmpty(ctrl.BaseData)) {
          var exp = value;
          var returnExpression = exp.substr(0, exp.indexOf('{{'));
          var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
          /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
          var name = key.substr(0, key.indexOf('|')).trim();
          request['R1_' + ckey] = ctrl.BaseData[name];
          request['R2_' + ckey] = ctrl.BaseData[name];
        } else {
          request['R1_' + ckey] = value;
          request['R2_' + ckey] = value;
        }
      });
      $.each(ctrl.Setting.Fields, function(k, value) {
        if (value.Name)
          request.R1_RequestFields += value.Name + ';';
        if (value.DynamicText && value.OldName)
          request.R1_RequestFields += value.OldName + ';';

      });
      if (ctrl.Setting.DisplayType == 'Tree') {
        delete request.R1_RequestDataGroup;
        delete request.R2_RequestDataGroup;
        delete request.R1_RequestFields;
        ctrl.Setting.RootData = 'Data';
      }
      $.each(ctrl.ListSearchConditions, function(k, condition) {
        request['R1_' + condition.name] = condition.value;
        request['R2_' + condition.name] = condition.value;
      });
      if(ctrl.Setting.DataSource === "AG_Task_Task"){
        if(this.$Utils.isEmpty(this.urlData)){
          $.each(this.urlData, (k, v)=>{
            request['R1_' + k] = v;
            request['R2_' + k] = v;
          });
        }
      }
      if(ctrl.dateStart !== '' && ctrl.Setting.DataSource === "AG_Task_Task"){
        request.R1_PlanStartDateStartValue = this.dateStart;
        request.R2_PlanStartDateStartValue = this.dateStart;
      }
      if(ctrl.dateEnd !== '' && ctrl.Setting.DataSource === "AG_Task_Task"){
        request.R1_PlanStartDateEndValue = this.dateEnd;
        request.R2_PlanStartDateEndValue = this.dateEnd;
      }


      if (ctrl.searchCondition && Array.isArray(ctrl.searchCondition)) {
        $.each(ctrl.searchCondition, function(k, condition) {
          //console.log(condition)
          if (ctrl.$Utils.isEmpty(condition, "setting") && condition.setting.Expression == "#Divine") {
            $.each(condition.value.split(";"), function(k, divine) {
              if (ctrl.$Utils.isEmpty(divine) && divine != "") {
                request['R1_' + divine] = 1;
                request['R2_' + divine] = 1;
              }
            })
          }
          if (ctrl.$Utils.isEmpty(condition, "setting") && condition.setting.ElementType == "MultiTree") {
            $.each(condition.value.split(";"), function(key, divine) {
              if (ctrl.$Utils.isEmpty(divine) && divine != "") {
                var level = key + 1
                request['R1_' + condition.name + "Level" + level] = divine;
                request['R2_' + condition.name + "Level" + level] = divine;
                delete request['R1_' + condition.name];
                delete request['R2_' + condition.name];
              }
            })
          } else if (ctrl.$Utils.isEmpty(condition, 'value') && condition.value !== '' && (!ctrl.$Utils.isEmpty(condition, 'setting') || condition.setting.FormElementType != "Multi")) {
            request['R1_' + condition.name] = condition.value;
            request['R2_' + condition.name] = condition.value;
          } else if (ctrl.$Utils.isEmpty(condition, 'value') && condition.value !== '' && ctrl.$Utils.isEmpty(condition, 'setting') && condition.setting.FormElementType == "Multi" && condition.setting.DynamicText != condition.name) {

            request['R1_' + condition.name] = condition.value;
            request['R2_' + condition.name] = condition.value;
          }
        });
      }
      $.each(request, function(key, val) {
        request[key] = ctrl.$Utils.expressionToString(ctrl.Setting.objDefault, val + '');

      });
      /** Xóa điều kiện thừa */
      delete request['R2_StartIndex'];
      delete request['R2_EndIndex'];
      /**Thêm lấy danh sách các phần tử nếu loại danh sách là phân nhóm*/
      if (ctrl.Setting.DisplayType == 'Partition' && ctrl.Setting.PartitionSortBy) {
        if (ctrl.PartitionField.FormRequest) {
          var object = ctrl.$Utils.stringToObject(ctrl.PartitionField.FormCode);
          object.RequestTemplate = ctrl.PartitionField.FormRequest;
          request.TotalRequests++;
          request = ctrl.$Utils.updateParamsSingleRequest(request, object, request.TotalRequests);
        }
      }
      if (!ctrl.$Utils.isEmpty(request['R1_StartIndex'])) {
        request['R1_StartIndex'] = 1;
        request['R1_EndIndex'] = ctrl.maxItem;
      }
      if (ctrl.Setting.DataSource == "AG_Task_Task" && ctrl.$Utils.isEmpty(request.R1_Categories) && request.R1_Categories != "") {
        request.R1_RequestTemplate = 'AG_Task_Task.SearchTaskByCategory';
        request.R1_ConditionFields = 'Categories';
        delete request['R2_StartIndex'];
        delete request['R2_EndIndex'];
      }
      if (request['R1_Id'] || request['R1_State'] == 1) {
        delete request['R1_Project'];
        delete request['R2_Project'];
      }
      // var request = {
      //   RequestClass:'xBase',
      //   RequestAction:'Request',
      //   TotalRequests:2,
      //   R1_RequestTemplate:'AG_Task_Task.Search',
      //   R1_RequestDataGroup:'DataGroup.danh-sach-cong-viec.04b66',
      //   R1_RequestFields:'Id;Tool;Index;Name;StatusName;WorkerName;PlanStartDate;Deadline;PlanManHour;RemainingManHour;CategoriesName;PriorityIdName;StatusDisplayName;StatusDisplay;TotalDownload;TotalComment;listdetail;Action;Categories;CategoryProjectLevel1;CategoryProjectLevel2;CategoryProjectLevel3;ChosenOne;Code;CreatedBy;GroupRoot;Id;Manager;Milestone;ModifiedBy;PriorityId;Project;ProjectType;Quality;Status;TaskQualityResult;TaskRequest;TaskResult;TaskState;TotalComment;TotalDownload;Type;Version;Worker;TagName;StatusDisplayName;SeverityName;VersionProjectName;CategoriesLevel1;CategoriesLevel2;CategoriesLevel3;CategoriesLevel4;TargetsLevel1;TargetsLevel2;TargetsLevel3;TargetsLevel4;TargetsName;ProjectCategoriesName;ProjectCategoriesLevel1;ProjectCategoriesLevel2;ProjectCategoriesLevel3;ChosenOneName;',
      //   R2_RequestTemplate:'AG_Task_Task.Count',
      //   R2_RequestDataGroup:'DataGroup.danh-sach-cong-viec.04b66',

      //   R1_UserField:'Worker',
      //   R2_UserField:'Worker',
      //   // R1_PlanStartDateStartValue:'2017-12-25T00:00:00',
      //   // R2_PlanStartDateStartValue:'2017-12-25T00:00:00',
      //   // R1_PlanStartDateEndValue:'2017-12-31T23:59:59',
      //   // R2_PlanStartDateEndValue:'2017-12-31T23:59:59',
      //   R1_StartIndex:1,
      //   R1_EndIndex:50,
      // }

      ctrl.$Utils.postCheckResult(request).then(function(result) {
        ctrl.lastFilterExecuted = request;
        if (result.success) {
          ctrl.selected = [];
          ctrl.isSelected = false;
          ctrl.SourceData = ctrl.$Utils.getDataWithRoot(result.R1, ctrl.Setting.RootData);
          ctrl.totalP = !isNaN(parseInt(ctrl.$Utils.getDataWithRoot(result.R2, 'Data'))) ? parseInt(ctrl.$Utils.getDataWithRoot(result.R2, 'Data')) : 0;
          // console.log(ctrl.$Lodash.cloneDeep(result.R1))
          ctrl.FormatData = ctrl.$Lodash.cloneDeep(ctrl.SourceData);
         // console.log(ctrl.FormatData)
          if (ctrl.FormatData.length > 0 && ctrl.Setting.DataSource != "AG_Task_Task") {
            var paramsSearchLinked = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: ctrl.FormatData.length,
              RequestTemplate: 'Permission'
            };
            $.each(ctrl.FormatData, function(key, link) {
              ctrl.arrPermission[link.Id] = {}
              paramsSearchLinked['R' + (key + 1) + '_Parent'] = link.Id;
            });
            ctrl.$Utils.post(paramsSearchLinked).then(function(result) {
              $.each(result, function(k, r) {
                r = ctrl.$Utils.getDataWithRoot(r, 'Data.DataDS.Linked')
                if (ctrl.$Utils.isEmpty(r) && r.length > 0)
                  $.each(r, function(k, value) {
                    if (!ctrl.$Utils.isEmpty(ctrl.arrPermission[r[0].Parent][value.Code]))
                      ctrl.arrPermission[r[0].Parent][value.Code] = []
                    ctrl.arrPermission[r[0].Parent][value.Code].push(value.Child);
                  })
              })
              if (ctrl.$Utils.isEmpty(ctrl.SourceData) && ctrl.$Utils.isEmpty(ctrl.Setting.InsideList)) {
                delete ctrl.Setting.InsideList;
              }
              ctrl.bindList();
            })
          } else
            ctrl.bindList();
          ctrl.formatCalculatorColumn();
          ctrl.formatField();
          // ctrl.Setting.LinkedObject.setPagination(ctrl.Setting, result.R2.Data);
          if (ctrl.Setting.DisplayType == 'Partition') {
            var arrPartitionOrders = [];
            ctrl.Setting.ListPartitionOrders = [];
            if (result.R3 && ctrl.$Utils.isEmpty(ctrl.PartitionField))
              ctrl.Setting.ListPartitionOrders = ctrl.$Utils.getDataWithRoot(result.R3, ctrl.PartitionField.FormDataRoot ? ctrl.PartitionField.FormDataRoot : 'Data');
            ctrl.formatPartition();
          } else if (ctrl.Setting.DisplayType == 'Tree')
            ctrl.setTreeData();
        } else {
          ctrl.$Utils.showMessage("error", "tải dữ liệu thất bại");
        }
      });
    },
    bindList() {
      var ctrl = this;
      var paging = false,
        searching = false;
      if (ctrl.Setting.IsDetail == "true") {
        searching = true;
        if (ctrl.FormatData.length > 10) {
          paging = true;
        }
      }
      // ctrl.Setting.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      //   var defer = $q.defer();
      //   defer.resolve(ctrl.FormatData);
      //   return defer.promise;
      // }).withOption('paging', paging)
      //   .withOption('searching', searching)
      //   .withOption('ordering', false)
      //   .withOption('responsive', true)
      //   .withOption('info', false)
      //   .withOption('autoWidth', true)
      //   .withOption('keys', true)
      //   .withOption('bScrollInfinite', true)
      //   .withOption('bScrollCollapse', true)
      //   // .withOption('sScrollY', 200)
      //   .withOption('rowCallback', formatClass)
      //   .withLanguage({ "sEmptyTable": "Không có dữ liệu!" })
      //   .withOption('drawCallback', function(settings) {
      //     $compile(angular.element('#' + settings.sTableId).contents())($scope);
      //   }) //.withFixedHeader({top: true, headerOffset: 130});
      // if (ctrl.$isMobileDevice) {
      //   ctrl.Setting.dtOptions.withOption('responsive', false)
      // }
      //
      // if (ctrl.Setting.dtInstance.id != undefined) {
      //   ctrl.Setting.dtInstance.reloadData();
      // } else {
      //   ctrl.Setting.authorized = true;
      // }
    },
    bindColumn(field) {
      var ctrl = this;
      var objField = field;
      if (field.ElementType == 'ButtonGroup'){
        //ntn
        // objField = DTColumnBuilder.newColumn(null).withTitle(field.Caption).renderWith(bindGroupHtml);
      }
      else if (field.ElementType == 'Popup') {
        //ntn
        // objField = DTColumnBuilder.newColumn(field.Name).withTitle(field.Caption).renderWith(bindLinkHtml);
        if (field.AddHtml && field.AddHtml.constructor === String) {
          ctrl.Setting.LinksAddHtml = ctrl.$Utils.decodeHtmlEntities(field.AddHtml);
        }
      } else if (field.ElementType == 'Link') {
        // objField = DTColumnBuilder.newColumn(field.Name).withTitle(field.Caption).renderWith(bindLinkHtml);
        if (field.AddHtml && field.AddHtml.constructor === String) {
          ctrl.Setting.LinksAddHtml = ctrl.$Utils.decodeHtmlEntities(field.AddHtml);
        }
      } else {
        if (field.Name == 'IndexDefault'){
          //ntn
          // objField = DTColumnBuilder.newColumn(null).withTitle(field.Caption);
        }
        if (field.Name == 'Tool') {
          // objField = DTColumnBuilder.newColumn(null).withTitle(field.Caption).renderWith(bindToolHtml);
          if (field.AddHtml && field.AddHtml.constructor === String) {
            ctrl.Setting.ButtonsAddHtml = ctrl.$Utils.decodeHtmlEntities(field.AddHtml);
          }
        } else {
          if (field.AddHtml) {
            ctrl.Setting.FieldAddHtml = ctrl.$Utils.decodeHtmlEntities(field.AddHtml);
            // objField = DTColumnBuilder.newColumn(null).withTitle(field.Caption).renderWith(bindField);
          } else {
            objField.mData = field.Name;
            objField.sTitle = field.Caption;
            objField.defaultContent = '';
            if (field.ListIsHidden == 'true')
              objField.bVisible = false;

          }
        }
      }
      return objField;
    },
    formatCalculatorColumn(isUpdate) {
      var ctrl = this;
      $.each(ctrl.FormatData, function(k, data) {
        $.each(ctrl.objCalculator, function(name, field) {
          if (field.Expression == "#Divine") {
            $.each(ctrl.ListSettings, function(k, item) {
              var divine = ctrl.$Utils.expressionToString(item, field.FormSavedKey);
              if (data[divine] == "1") {
                result = ctrl.$Utils.expressionToString(item, field.FormSavedText);
                data[name] = result;

              }
            })
          } else {
            var expression = ctrl.$Utils.expressionToString(data, field.Expression),
              result = '';
            switch (field.FieldColumnType) {
              case 'Integer':
                result = ctrl.$Utils.calculator(expression);
                break;
              case 'Double':
                result = ctrl.$Utils.calculator(expression);
                if (result!==Number)
                  result = '';
                break;
              default:
                result = expression;
            }
            if (ctrl.$Utils.isEmpty(field.DependOn)) {
              if ((field.DepenType == "onEmpty" && field.DependValue.indexOf(data[field.DependOn]) == -1) || (field.DepenType == "onExist" && field.DependValue.indexOf(data[field.DependOn]) >= 0)) {
                data[name] = result;
              }
            } else
              data[name] = result;
          }
        });
        $.each(ctrl.Setting.Fields, function(k, field) {
          if (field.ListRequest) {
            var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            request.R1_RequestTemplate = field.ListRequest;
            var conditions = ctrl.$Utils.stringToObject(field.ListCode);
            $.each(conditions, function(key, item) {
              request["R1_" + key] = item;
            });
            ctrl.$Utils.post(request).then(function(result) {
              if (result.success) {
                if (result.R1.success) {
                  var Data = ctrl.$Utils.getDataWithRoot(result.R1, field.ListDataRoot);
                  var compareValue = ctrl.$Lodash.cloneDeep(data[field.Name])
                  $.each(Data, function(k, value) {
                    var compare = ctrl.$Utils.stringToObject(value.Value);
                    if (
                      ((ctrl.$Utils.isEmpty(compare.Start) && compareValue >= compare.Start) ||
                        (ctrl.$Utils.isEmpty(compare.StartF) && compareValue > compare.Start) ||
                        (!ctrl.$Utils.isEmpty(compare.Start) && !ctrl.$Utils.isEmpty(compare.StartF))
                      ) &&
                      ((ctrl.$Utils.isEmpty(compare.End) && compareValue <= compare.End) ||
                        (ctrl.$Utils.isEmpty(compare.EndF) && compareValue < compare.EndF) ||
                        (!ctrl.$Utils.isEmpty(compare.End) && !ctrl.$Utils.isEmpty(compare.EndF))
                      )) {
                      data[field.Name] = value.Name;
                    }
                  })
                }
              }
            })
          }
        })
      });
    },
    formatField() {
      var ctrl = this;
      ctrl.ExportItem = {};
      $.each(ctrl.FormatData, function(index, source) {
        ctrl.ExportItem[index] = ctrl.$Lodash.cloneDeep(source);
        $.each(ctrl.FullColumns, function(k, column) {
          var setting = column;
          var value = ''
          if (column.Name == 'IndexDefault')
            source[setting.Name] = index + 1;
          else if (column.FormElementType == 'Html')
            source[setting.Name] = source[setting.Name] != '' && source[setting.Name] != undefined ? ctrl.$Utils.decodeHtmlEntities(source[setting.Name]) : '';
          else {
            var value = source[column.Name];
            switch (setting.FieldColumnType) {
              case 'Integer':
                if (value != '' && !isNaN(value))
                  source[setting.Name] =  parseFloat(value).toFixed(2);
                break;
              case 'Double':
                if (value != '' && !isNaN(value)) {
                  var formated = false;
                  if (setting.FormatValue) {
                    var afterDecimal = 0;
                    afterDecimal = setting.FormatValue.substring(setting.FormatValue.indexOf('.') + 1, setting.FormatValue.indexOf('f'));
                    afterDecimal = afterDecimal == '' ? 0 : afterDecimal;
                    value = (value == 0) ? 0 : parseFloat(value).toFixed(afterDecimal)
                    formated = true;
                  }
                  if (setting.Format && setting.Format.constructor === String) {
                    setting.Format = setting.Format.split('{{0').join('{{' + setting.Name);
                    var object = {};
                    object[setting.Name] = value;
                    value = ctrl.$Utils.expressionToString(object, setting.Format);
                    formated = true;
                  }
                  if (!formated)
                    value = parseFloat(value).toFixed(0);
                }
                break;
              case 'DateTime':
                if (value != undefined && value != '') {
                  var date = ctrl.$Utils.stringToDate(value);
                  var format;
                  if (ctrl.$Utils.isEmpty(setting.Format))
                    format = setting.Format;
                  value = ctrl.$Utils.formatDateTime(date, format);
                }
                break;
            }
            ctrl.ExportItem[index][setting.Name] = ctrl.$Lodash.cloneDeep(value);
            if (setting.MaxChar && eval(setting.MaxChar).constructor===Number && ctrl.$Utils.isEmpty(value) && value.length > setting.MaxChar) {
              source[setting.Name + "#Default"] = ctrl.$Lodash.cloneDeep(value)
              value = value.substring(0, setting.MaxChar) + "...";
            }
            source[setting.Name] = value;
          }
        });
        source.SourceData = ctrl.SourceData[index];
      });
    },
    formatPartition() {
      var ctrl = this;
      var fieldSetting = ctrl.PartitionField;
      var displayArray = ctrl.Setting.ListPartitionOrders;

      if (ctrl.$Utils.isEmpty(displayArray)) {
        if (fieldSetting.FormDataRoot == 'Data')
          displayArray = ctrl.$Utils.createdListFromDataTree(ctrl.$Lodash.cloneDeep(displayArray), []);
      }

      ctrl.PartitionDataSource = [];
      var partitionObject = {},
        undefinedObject = {
          head: 'undefined',
          display: ctrl.$defaultUndefined,
          data: []
        };
      $.each(ctrl.SourceData, function(index, object) {
        var head = ctrl.$defaultUndefined,
          display = '';
        if (object[fieldSetting.Name]) {
          switch (fieldSetting.FieldColumnType) {
            case 'String':
              head = fieldSetting.OldName ? object[fieldSetting.OldName] : object[fieldSetting.Name];
              display = object[ctrl.Setting.PartitionDisplayName];
              break;
            case 'DateTime':
              var time = ctrl.$Utils.stringToDate(object[fieldSetting.Name]),
                date = ctrl.$Utils.dateToString(time.getDay());
              head = ctrl.$Utils.formatDateTime(time, 'YYYY/MM/DD');
              display = date + ' - ' + ctrl.$Utils.formatDateTime(time, 'DD/MM');
              break;
          }
          if (!ctrl.$Utils.isEmpty(partitionObject[head]))
            partitionObject[head] = { display: display, data: [], value: head, Caption: display };
          partitionObject[head].data.push(ctrl.FormatData[index]);
        } else
          undefinedObject.data.push(ctrl.FormatData[index]);
      });
      if (undefinedObject.data.length > 0)
        partitionObject.undefined = undefinedObject;

      /**sắp xếp lại thứ tự trước khi hiển thị*/
      var sortPartitionArray = [];
      if (displayArray.length > 0) {
        displayArray.push({ Id: 'undefined', Caption: ctrl.$defaultUndefined });
        $.each(displayArray, function(k, sortObject) {
          if (fieldSetting.FormField != 'Id' && sortObject[fieldSetting.FormField]) {
            sortObject.Id = sortObject[fieldSetting.FormField]
          }
          if (!ctrl.$Utils.isEmpty(sortObject.Name) && ctrl.$Utils.isEmpty(fieldSetting.FormSavedText)) {
            var SavedText = fieldSetting.FormSavedText.substr(fieldSetting.FormSavedText.indexOf('{{') + 2, fieldSetting.FormSavedText.indexOf('}}') - fieldSetting.FormSavedText.indexOf('{{') - 2);
            sortObject.Name = sortObject[SavedText];
          }
          var objId = ctrl.$Utils.isEmpty(fieldSetting.FormSavedKey) ? sortObject[fieldSetting.FormSavedKey.substr(fieldSetting.FormSavedKey.indexOf('{{') + 2, fieldSetting.FormSavedKey.indexOf('}}') - fieldSetting.FormSavedKey.indexOf('{{') - 2)] : sortObject.Id;
          if (partitionObject[objId]) {
            partitionObject[objId].display = sortObject.Caption ? sortObject.Caption : sortObject.Name;
            sortPartitionArray.push(partitionObject[objId]);
          }
        });
      } else {
        $.each(partitionObject, function(k, object) {
          sortPartitionArray.push(object);
        });
        sortPartitionArray.sort(function(a, b) {
          var valA = 0,
            valB = 0;
          switch (fieldSetting.FieldColumnType) {
            case 'DateTime':
              valA = new Date(a.value).getTime();
              valB = new Date(b.value).getTime();
              break;
            default:
              valA = a.display;
              valB = b.display;
              break;
          }
          if (valA > valB) {
            return 1;
          } else if (valA < valB) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      var total = { Caption: 'Thống kê tổng', type: 'total', rowClass: 'progress' };
      $.each(sortPartitionArray, function(k, object) {
        ctrl.PartitionDataSource.push({
          type: 'head',
          value: object.value,
          name: object.display,
          Caption: object.display
        });
        ctrl.PartitionDataSource = ctrl.PartitionDataSource.concat(object.data);
        if (ctrl.$Utils.isEmpty(ctrl.Setting.PartitionCalculator) && ctrl.Setting.PartitionCalculator != '') {
          var partitionTotal = { Caption: 'Thống kê', type: 'total', rowClass: 'progress' },
            calculatorFields = ctrl.Setting.PartitionCalculator.split(';');
          $.each(calculatorFields, function(calculatorKey) {
            if (!ctrl.$Utils.isEmpty(total[calculatorKey])) {
              total[calculatorKey] = 0;
            }
            partitionTotal[calculatorKey] = 0;
            $.each(object.data, function(k, item) {
              var value = 0;
              if (!isNaN(item[calculatorKey])) {
                value = parseFloat(item[calculatorKey]);
              }
              partitionTotal[calculatorKey] += value;
              total[calculatorKey] += value;
            });
            partitionTotal[calculatorKey] =  parseFloat(partitionTotal[calculatorKey]).toFixed(2);
          });
          ctrl.PartitionDataSource.push(partitionTotal);
        }
      });

      if (ctrl.$Utils.isEmpty(ctrl.Setting.PartitionCalculator) && ctrl.Setting.PartitionCalculator != '' && ctrl.FormatData.length != 0) {
        var arrCalculatorFields = ctrl.Setting.PartitionCalculator.split(';');
        $.each(arrCalculatorFields, function(k, field) {
          if (field != '')
            total[field] = total[field] != 0 ? parseFloat(total[field]).toFixed(2) : 0;
        });
        ctrl.PartitionDataSource.push(total);
      }
      ctrl.FormatData = [];
      ctrl.FormatData = ctrl.PartitionDataSource;
      ctrl.partionData = partitionObject;
    },
    formatClass(column, data) {
      var ctrl = this;
      // $.each(ctrl.ListColumns, function(columnIndex, column) {
        if (column.Class || (column.Attribute && column.Attribute != "")) {
          var listColor = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SettingColor));
          var arrClasses = column.Class.split(' '),
            returnClass = '';
          if (column.Attribute && column.Attribute != "")
            if(data){
              $.each(listColor, function(k, value) {
                if (value.Extra == data[column.Attribute]) {
                  arrClasses.push(value.Value)
                }
              })
            }

          arrClasses.forEach(function(string) {
            string = string.trim();
            if (string.indexOf('{{') >= 0 && string.indexOf('}}') > 0) {
              var key = string.substr(string.indexOf('{{') + 2, string.indexOf('}}') - 4);
              if(data){
                ctrl.color = data[key];
                if (ctrl.$Utils.isEmpty(key)) {
                  returnClass += string.replace('{{' + key + '}}', data[key]);
                  returnClass += ' ';
                }
              }
            } else
              returnClass += string + ' ';
          });
          if (returnClass.indexOf('{{') >= 0 && returnClass.indexOf('}}') > 0) {
              var key = returnClass.substr(returnClass.indexOf('{{') + 2, returnClass.indexOf('}}') - 4);
              if (ctrl.$Utils.isEmpty(key)) {
                returnClass = eval(returnClass.replace('{{' + key + '}}', key));
              }
            }
          // if (['head', 'total'].indexOf(data.type) >= 0) {
          //   if (!ctrl.$Utils.isEmpty(returnClass))
          //     returnClass = ""
          //   returnClass += " md-body-2 none-ex"
          // }
          // if (['head'].indexOf(data.type) >= 0) {
          //   returnClass += " partitioning none-ex"
          // }
          // $('td', row).eq(columnIndex).addClass(returnClass);
          if (returnClass.indexOf('text-center cell100 work-status z-') != -1) {
            // $('td', row).eq(columnIndex).attr('style','background-color:' + ctrl.$rootScope.arrStatusColor[ctrl.color]);
          }

        }
      // });
      // var returnClass = '123'
      return returnClass;
    },
    formatStyle(column, data) {
      var ctrl = this;
      // $.each(ctrl.ListColumns, function(columnIndex, column) {
        if (column.Class || (column.Attribute && column.Attribute != "")) {
          var listColor = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SettingColor));
          var arrClasses = column.Class.split(' '),
            returnClass = '', returnStyle='';
          if (column.Attribute && column.Attribute != "")
            if(data){
              $.each(listColor, function(k, value) {
                if (value.Extra == data[column.Attribute]) {
                  arrClasses.push(value.Value)
                }
              })
            }

          arrClasses.forEach(function(string) {
            string = string.trim();
            if (string.indexOf('{{') >= 0 && string.indexOf('}}') > 0) {
              var key = string.substr(string.indexOf('{{') + 2, string.indexOf('}}') - 4);
              if(data){
                ctrl.color = data[key];
                if (ctrl.$Utils.isEmpty(key)) {
                  returnClass += string.replace('{{' + key + '}}', data[key]);
                  returnClass += ' ';
                }
              }
            } else
              returnClass += string + ' ';
          });
          if (returnClass.indexOf('{{') >= 0 && returnClass.indexOf('}}') > 0) {
              var key = returnClass.substr(returnClass.indexOf('{{') + 2, returnClass.indexOf('}}') - 4);
              if (ctrl.$Utils.isEmpty(key)) {
                returnClass = returnClass.replace('{{' + key + '}}', key);
              }
            }
          // if (['head', 'total'].indexOf(data.type) >= 0) {
          //   if (!ctrl.$Utils.isEmpty(returnClass))
          //     returnClass = ""
          //   returnClass += " md-body-2 none-ex"
          // }
          // if (['head'].indexOf(data.type) >= 0) {
          //   returnClass += " partitioning none-ex"
          // }
          // $('td', row).eq(columnIndex).addClass(returnClass);
          if (returnClass.indexOf('text-center cell100 work-status z-') != -1) {
            returnStyle = 'background-color:' + ctrl.arrStatusColor[ctrl.color]
            // $('td', row).eq(columnIndex).attr('style','background-color:' + ctrl.$rootScope.arrStatusColor[ctrl.color]);
          }

        }
      // });
      // var returnClass = '123'
      return returnStyle;
    },

    bindToolHtml(data, full, meta) {
      var ctrl = this;
      ctrl.listp = [];
      var strContent = '';
      // if (['head', 'total'].indexOf(data.type) == -1) {
        if (ctrl.Setting.ButtonsAddHtml.constructor === String && ctrl.Setting.ButtonsAddHtml != "") {
          var AddHtml = ctrl.expressionHtmlString(ctrl.Setting.ButtonsAddHtml, full);
          // var AddHtml = AddHtml.replace("<i class='icon work-status q-" + data.Status + "'>","<i class='icon work-status status-box' style='color:" + this.$rootScope.arrStatusColor[data.Status] + "'>");
          strContent += AddHtml;
        } else
          strContent += '<div layout="row" class="default-tool">';
        if (ctrl.Setting.ShowExportButton == true && ctrl.isMobile != true) {
          strContent += '<input class="list-check" type="checkbox" ng-checked="exists(\'' + meta.$index + '\')" ng-click="toggle(\'' + meta.$index + '\')">'
        }
        $.each(ctrl.ListButtons, function(index, button) {
          var display = true;
          if (ctrl.$Utils.isEmpty(button.Filters)) {
            $.each(button.Filters, function(k, value) {
              var compare = ""
              if (value.Value.indexOf("{{") >= 0) {
                compare = ctrl.$Utils.getUserInfo(value.split("{{").join('').split("}}").join(''));
              } else {
                compare = value.Value
              }
              if (!ctrl.$Utils.isEmpty(full[value.Key]) ||
                (value.Type == "Field" && ctrl.$Utils.isEmpty(full, value.Key) && full[value.Key].indexOf(compare) == -1) ||
                (value.Type != "Field" && compare.indexOf(value.Key) == -1)) {
                display = false;
              }
            })
          }
          if (ctrl.$Utils.isEmpty(button.UserPermissions, "0")) {
            display = false;
            $.each(button.UserPermissions, function(k, permission) {
              var Roles = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Roles
              $.each(Roles, function(k, role) {
                if (permission == role.GroupId) {
                  // ctrl.Setting.Flag = true;
                  display = true;
                }
              })
              var Groups = JSON.parse(getItemLocalStorage(localStorageConstant.LoggedOnUser)).Groups
              $.each(Groups, function(k, group) {
                if (permission == group.GroupId) {
                  display = true;
                  // ctrl.Setting.Flag = true;
                }
              })
            })
          }
          if (ctrl.$Utils.isEmpty(button.PermitToShow)) {
            display = false;
            if (ctrl.$Utils.isEmpty(ctrl.arrPermission, data.Id))
              $.each(ctrl.arrPermission[data.Id][button.PermitToShow], function(k, target) {
                if (JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).UserId.indexOf(target) >= 0) {
                  display = true;
                } else {
                  var Roles = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Roles
                  var Groups = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser)).Groups
                  $.each(Roles, function(k, role) {
                    if (target == role.GroupId) {
                      display = true;
                    }
                  })
                  $.each(Groups, function(k, group) {
                    if (target == group.GroupId) {
                      display = true;
                    }
                  })
                }
              })
          }
          if (display == true) {
            var objButton = ctrl.displayControl(button, data);
            objButton.Show = true;
            if (!button.hideOnTool && objButton.Show) {
              // if (button.Icon == "icon-pencil") {
              //   strContent += '<el-button type="primary" class="icon ' + button.Icon + '"';
              // } else {
              //   strContent += '<el-button type="primary" class="icon ' + button.Icon + '"';
              // }
              if (button.ButtonType == 'Redirect') {
                // if (ctrl.$isMobile.iOS()){
                  strContent += ' <a href="#/' + ctrl.$Utils.expressionToString(meta.$index.SourceData, ctrl.$Lodash.cloneDeep(button.Redirect)) + '">';
                // }
                // else{
                //   strContent += '<a :to="' + ctrl.$Utils.expressionToString(meta.$index.SourceData, ctrl.$Lodash.cloneDeep(button.Redirect)) + '">';
                // }
                if (button.Icon == "icon-pencil") {
                  strContent += '<i type="primary" class="icon ' + button.Icon + '">';
                } else {
                  strContent += '<i type="primary" class="icon ' + button.Icon + '">';
                }
                if (button.ExtraTextClass)
                  strContent += '<md-icon class="bg-danger text-white text-center">' + objButton.extraText + '</md-icon>';
                strContent += '</i>';
                strContent += '</a>'
              } else{
                if (button.Icon == "icon-pencil") {
                  strContent += '<el-button type="primary" class="icon ' + button.Icon + '"';
                } else {
                  strContent += '<el-button type="primary" class="icon ' + button.Icon + '"';
                }
                strContent += ' v-on:click="onButtonClick(\'' + index + '\',\'' + meta.$index + '\')"';
                if (button.ExtraTextClass)
                  strContent += '<md-icon class="bg-danger text-white text-center">' + objButton.extraText + '</md-icon>';
                strContent += '</el-button>';
              }
              // strContent += '><md-tooltip>' + (button.Description ? button.Description : button.Caption) + '</md-tooltip>';
              // if (button.ExtraTextClass)
              //   strContent += '<md-icon class="bg-danger text-white text-center">' + objButton.extraText + '</md-icon>';
              // strContent += '</el-button>';
            }
          }
        });
        strContent += '</div>';
        return strContent;
      // }
      //  else if (data.type.indexOf('head') >= 0) {
      //   if (!ctrl.$Utils.isEmpty(ctrl.isMobile)) {
      //     $.each(ctrl.partionData, function(key, value) {
      //       if (value.display == full.name) {
      //         ctrl.listp = ctrl.$Lodash.cloneDeep(value.data);
      //         $.each(ctrl.listp, function(key, vItem) {
      //           $.each(vItem, function(cKey, cItem) {
      //             if (cKey.indexOf("#Default") >= 0) {
      //               ctrl.listp[vKey][cKey.substring(0, cKey.length - 8)] = cItem
      //             }
      //           })
      //         })
      //         ctrl.listp = JSON.stringify(ctrl.listp);
      //         ctrl.listp = ctrl.listp.split("'").join("‘");
      //       }
      //     })
      //     strContent += '<a ng-json-export-excel data=\'' + ctrl.listp + '\' report-fields=\'' + ctrl.columnp + '\' filename="\'' + full.name + '\'"><md-tooltip>Xuất bản</md-tooltip><md-icon md-font-icon="icon-file-excel" class="blue-500-fg"></md-icon></a>'
      //   }
      //   return strContent;
      // } else {
      //   return full.Caption;
      // }
    },
    bindField(data, type, full, meta) {
      var strContent = '';
      if (ctrl.Setting.FieldAddHtml.constructor === String && ['head', 'total'].indexOf(full.type) == -1) {
        var AddHtml = this.expressionHtmlString(ctrl.Setting.FieldAddHtml, full)
        strContent += AddHtml;
      }
      return strContent;
    },
    bindGroupHtml(data, type, full, meta) {
      var strContent = '';
      return strContent;
    },
    bindLinkHtml(data, full, meta) {
      var ctrl = this;
      var strContent = '';
      // if (['head', 'total'].indexOf(full.type) == -1) {
        meta.column = 2
        var fieldSetting = ctrl.ListColumns[meta.column];
        //console.log(meta)
        var strLinkType = fieldSetting.ButtonType ? fieldSetting.ButtonType : fieldSetting.ElementType;
        if (!fieldSetting.ButtonType && fieldSetting.ElementType == 'Link' && fieldSetting.Redirect) {
          // if (ctrl.$isMobile.iOS())
            strContent += '<a href="#/' + ctrl.$Utils.expressionToString(ctrl.FormatData[meta.$index].SourceData, ctrl.$Lodash.cloneDeep(fieldSetting.Redirect)) + '">';
          // else
          //   strContent += '<a href="' + ctrl.$Utils.expressionToString(ctrl.FormatData[meta.$index].SourceData, ctrl.$Lodash.cloneDeep(fieldSetting.Redirect)) + '">';

        } else
          strContent += '<a href="javascript:void(0)" v-on:click="onFieldClick(\'' + meta.column + '\',\'' + meta.$index + '\')">';
        if (ctrl.Setting.LinksAddHtml && ctrl.Setting.LinksAddHtml.constructor === String) {
          var AddHtml = ctrl.expressionHtmlString(ctrl.Setting.LinksAddHtml, full)
        }
        // if (ctrl.$Utils.isEmpty(full[ctrl.Setting.dtColumns[meta.column].mData + "#Default"])) {
        //   strContent += full[ctrl.Setting.dtColumns[meta.column].mData] + '<md-tooltip>' + full[ctrl.Setting.dtColumns[meta.column].mData + "#Default"] + '</md-tooltip></a>';
        //   if (ctrl.$Utils.isEmpty(AddHtml))
        //     strContent += AddHtml
        // } else {
        //   strContent += full[ctrl.Setting.dtColumns[meta.column].mData] + '<md-tooltip>' + full[ctrl.Setting.dtColumns[meta.col].mData] + '</md-tooltip></a>';
        strContent += full[fieldSetting.Name] + '</a>';
          if (ctrl.$Utils.isEmpty(AddHtml))
            strContent += AddHtml
        // }
        return strContent;
      // } else if (full.type.indexOf('head') >= 0)
      //   return full.Caption;
      // else
      //   return strContent;
    },
    excuteUpdate(item, setting) {
      var ctrl = this;
      /**lấy cấu hình request từ Action và tạo ra request update*/
      if (ctrl.$Utils.isEmpty(setting.Value) && setting.Value != '') {
        var returnObject = ctrl.$Lodash.cloneDeep(item);
        $.each(ctrl.$Utils.stringToObject(setting.Value), function(key, val) {
          returnObject[key] = val;
        });
        var request = ctrl.$Utils.updateParamsSingleRequest(ctrl.$Lodash.cloneDeep(ctrl.$singleRequest), returnObject);
        request = ctrl.$Utils.updateParamsSingleRequest(request, {
          RequestTemplate: ctrl.Setting.DataSource + '.Update',
          RequestDataGroup: ctrl.Setting.DataGroup,
          RequestFields: 'Id;'
        });
        request.R1_RequestFields += ctrl.Setting.Fields.map(function(f) {
          return f.Name;
        }).join(';');
        ctrl.$Utils.post(request).then(function(result) {
          if (result.success) {
            ctrl.$Utils.showMessage("success", ctrl.$toastMessage.updateItemPre + (returnObject.Name ? returnObject.Name : '') + ctrl.$toastMessage.updateItemSuf)
            ctrl.updateList(returnObject);
          } else
            ctrl.$Utils.showMessage("error", ctrl.$toastMessage.updateItemFailed);
        });
      } else
            ctrl.$Utils.showMessage("error", ctrl.$toastMessage.settingTemplateError);
    },
    excuteDelete(items, setting) {
      var ctrl = this;
      ctrl.$confirm('Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?', 'Cảnh Báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Bỏ  qua',
        type: 'warning'
      }).then(() => {

        if (items && items.constructor !== Array) {
          items = [items];
        }
        if (ctrl.$Utils.isEmpty(ctrl.Setting.Notifications, '0')) {
          $.each(items, function(key, item) {
            var paramsSearchLinked = {
              RequestAction: 'SearchLinked',
              RequestClass: 'Addition',
              ConditionFields: 'Parent;',
              StaticFields: 'Code;Child;Parent;Name;Created;Description',
              OrderFields: 'Created DESC',
              Parent: item.Id
            };
            ctrl.$Utils.post(paramsSearchLinked).then(function(result) {
              if (result.TotalCount > 0) {
                var arrLink = result.TotalCount == 1 ? [result.Data.DataDS.Linked] : result.Data.DataDS.Linked;
                var requestGetData = ctrl.$Lodash.cloneDeep(singleRequest);
                requestGetData.R1_RequestTemplate = 'SettingNew.SearchSetting';
                requestGetData.R1_Code = ctrl.Setting.DataGroup;
                ctrl.$Utils.post(requestGetData).then(function(resultGetData) {
                  if (resultGetData.success && resultGetData.R1.success) {
                    var data = ctrl.$Utils.getDataWithRoot(resultGetData.R1, 'Data.DynamicDS.Setting')[0];
                    /** Thêm điều kiện từ Setting.AdditionConditions */
                    data.Description = (data.Description && data.Description.constructor===String) ? JSON.parse(data.Description) : [];
                    if (ctrl.$Utils.isEmpty(data, "F1")) {
                      data.Description.Fields = '';
                      for (var i = 1; i <= data.Description.FCount; i++) {
                        if (data['F' + i] != undefined) {
                          data.Description.Fields += data['F' + i];
                          delete data['F' + i];
                        }
                      }
                      ctrl.Setting.FullFields = (data.Description.Fields && data.Description.Fields.constructor ===String) ? JSON.parse(data.Description.Fields) : [];
                    }
                    var requestGetFull = ctrl.$Lodash.close(ctrl.$singleRequest);
                    requestGetFull.R1_RequestTemplate = ctrl.Setting.DataSource + '.Search';
                    /** Thêm điều kiện từ Setting.AdditionConditions */
                    requestGetFull.R1_Id = item.Id;
                    requestGetFull.R1_RequestFields = '';
                    requestGetFull.R1_RequestDataGroup = ctrl.Setting.DataGroup;
                    $.each(ctrl.Setting.AdditionConditions, function(key, val) {
                      requestGetFull['R1_' + key] = val;
                    });
                    $.each(ctrl.Setting.FullFields, function(k, field) {
                      if (field.DynamicText) {
                        requestGetFull.R1_RequestFields += field.DynamicText + ';';
                      } else {
                        requestGetFull.R1_RequestFields += field.Name + ';'
                      }
                    });
                    /** chuyển các biến trong parameter sang giá trị*/
                    $.each(requestGetFull, function(key, val) {
                      requestGetFull[key] = ctrl.expressionToString(ctrl.objSourceData, val + '');
                    });
                    /** post search request */
                    ctrl.$Utils.post(requestGetFull).then(function(resultGetFull) {
                      if (resultGetFull.success && resultGetFull.R1.success) {
                        var dataSearch = ctrl.$Utils.getDataWithRoot(resultGetFull.R1, ctrl.Setting.RootData)[0];
                        if (ctrl.$Utils.isEmpty(dataSearch)) {
                          ctrl.sendDeleteRequest(items, setting)
                          ctrl.sendNotification(arrLink, dataSearch);
                        } else {
                          ctrl.sendDeleteRequest(items, setting)
                        }
                      } else {
                        ctrl.$Utils.showMessage("error", ctrl.$toastMessage.loadingDataFailed);
                        ctrl.sendDeleteRequest(items, setting)
                      }
                    });
                  } else {
                    ctrl.sendDeleteRequest(items, setting)
                  }
                })
              } else {
                ctrl.sendDeleteRequest(items, setting)
              }
            });
          })
        } else {
          ctrl.sendDeleteRequest(items, setting)
        }
      }).catch(() => {
        this.$Utils.showMessage('info', 'Bỏ qua tác vụ xoá');
      });
    },
    sendDeleteRequest(items, setting) {
      var ctrl = this;
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: items.length,
        RequestTemplate: ctrl.Setting.DataSource + '.Delete'
      };
      $.each(items, function(key, item) {
        request['R' + (key + 1) + '_Id'] = item.Id;
        // request['R' + (key + 1) + '_DeleteReferenceData'] = item.Id;
      });
      /** gửi request xóa*/
      ctrl.$Utils.post(request).then(function(result) {
        $.each(items, function(key, item) {
          var name = item.Name ? item.Name : item.Id;
          if (result['R' + (key + 1)].success) {
            ctrl.$Utils.showMessage("success", ctrl.$toastMessage.deleteItemPre + name)
            if (setting.AfterUpdate && ctrl.$Utils.isEmpty(ctrl.Setting.functions, setting.AfterUpdate))
              ctrl.Setting.functions[setting.AfterUpdate](item);
            else
              ctrl.removeFromList(item);
          } else
            ctrl.$Utils.showMessage("error", ctrl.$toastMessage.deleteItemFailed + ' ' +name)
        });
      });
    },
    excuteDownload(button, item) {
      var ctrl = this;
      ctrl.binaryDatas = [];
      ctrl.totalCount = 0;
      var params = {
        RequestClass: 'xBase',
        RequestAction: 'SearchBinary',
        Parent: item.Id,
        ConditionFields: 'Parent',
        StaticFields: 'Name;Created;Modified;FileName;FileExtension;FileSize;CreatedBy;Description;Parent;FileSize',
        DynamicFields: 'CreatedByName;SignatureVerified'
      };
      ctrl.$Utils.post(params).then(function(data) {
        ctrl.binaryDatas = ctrl.$Utils.getDataWithRoot(data, 'Data.DynamicDS.Binary');
        ctrl.totalCount = data.TotalCount;
        //ntn show dialog
        // $mdDialog.show({
        //   controller: 'attachmentDownloadController as ctrl',
        //   templateUrl: 'app/main/dynamic/list/dialogs/dowload/download.html',
        //   targetEvent: event,
        //   clickOutsideToClose: true,
        //   preserveScope: true,
        //   autoWrap: true,
        //   skipHide: true,
        //   locals: { dataToPass: ctrl.binaryDatas }
        // });
      })
    },
    excuteAudio(button, item) {
      $mdDialog.show({
        controller: 'audioPlayController as ctrl',
        templateUrl: 'app/main/dynamic/list/dialogs/audioplay/audioplay.html',
        targetEvent: event,
        clickOutsideToClose: true,
        preserveScope: true,
        autoWrap: true,
        skipHide: true,
        locals: { dataToPass: item.RecordFile }
      });
    },
    excuteCall(button, item) {
      this.$hub.$emit('showCall', item);
    },
    excutePermission(button, item) {
      if (this.$Utils.isEmpty(item.Id)) {
        this.$Utils.showPermission({}, item);
      }
    },
    updateList(item) {
      var ctrl = this;
      /** gọi đến hàm tạo format lại dữ liệu theo phân vùng*/
      if (ctrl.Setting.DisplayType == 'Partition') {
        ctrl.FormatData = [];
        ctrl.searchList(ctrl.searchCondition);
        ctrl.formatPartition();
      } else {
        var exist = false;
        $.each(ctrl.FormatData, function(key, data) {
          if (data.Id === item.Id) {
            ctrl.FormatData[key] = item;
            exist = true;
          }
        });
        if (!exist)
          ctrl.FormatData.unshift(item);
        if (ctrl.Setting.dtInstance.id != undefined)
          ctrl.Setting.dtInstance.reloadData();
      }
    },
    removeFromList(item) {
      var ctrl = this;
      // if (ctrl.Setting.DisplayType == 'Partition')
        ctrl.searchList(ctrl.searchCondition);
      // else {
      //   $.each(ctrl.FormatData, function(key, val) {
      //     if (val.Id == item.Id) {
      //       ctrl.FormatData.splice(key, 1);
      //     }
      //   });
      //   if (ctrl.Setting.dtInstance.id != undefined)
      //     ctrl.Setting.dtInstance.reloadData();
      // }
    },
    onButtonClick(index, row) {
      this.onLinkClick(this.ListButtons[index], this.FormatData[row].SourceData);
    },
    onFieldClick(col, row) {
      //console.log(row)
      this.onLinkClick(this.ListColumns[col], this.FormatData[row].SourceData);
    },
    onLinkClick(setting, item) {
      console.log(setting)
      console.log(item)
      var  ctrl = this;
      var strLinkType = setting.ButtonType ? setting.ButtonType : setting.ElementType;
      if (!setting.ButtonType && setting.ElementType == 'Link' && setting.Redirect) {
        strLinkType = 'Redirect';
      }
      ctrl.currentLink = '#';
      switch (strLinkType) {
        case 'Click':
          switch (setting.Action) {
            case 'Update':
              ctrl.excuteUpdate(item, setting);
              break;
            case 'Delete':
              ctrl.excuteDelete(item, setting);
              break;
            case 'ReturnData':
              var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
              request.R1_RequestTemplate = ctrl.Setting.DataSource + '.Search';
              /** Thêm điều kiện từ Setting.AdditionConditions */
              request.R1_Id = item.Id;
              request.R1_RequestFields = '';
              request.R1_RequestDataGroup = ctrl.Setting.DataGroup;
              $.each(ctrl.Setting.AdditionConditions, function(key, val) {
                request['R1_' + key] = val;
              });
              $.each(ctrl.Setting.Fields, function(k, field) {
                request.R1_RequestFields += field.Name + ';'
                if (field.DynamicText) {
                  request.R1_RequestFields += field.OldName + ';';
                }
              });
              /** chuyển các biến trong parameter sang giá trị*/
              $.each(request, function(key, val) {
                request[key] = ctrl.$Utils.expressionToString(item, val + '');
              });
              /** post search request */
              ctrl.$Utils.post(request).then(function(result) {
                if (result.success && result.R1.success) {
                  var dataSearch = ctrl.$Utils.getDataWithRoot(result.R1, ctrl.Setting.RootData)[0];
                  if (ctrl.$Utils.isEmpty(dataSearch)) {
                    /** đặt lại các giá trị mặc định */
                    ctrl.Setting.LinkedObject.returnItemData(ctrl.Setting, dataSearch);
                  }
                } else {
                  ctrl.$Utils.showMessage("error", ctrl.$toastMessage.loadingDataFailed);
                }
              });
              break;
            case 'Download':
              ctrl.excuteDownload(ctrl.Setting, item);
              break;
            case 'Audio':
              ctrl.excuteAudio(ctrl.Setting, item);
              break;
            case 'Call':
              ctrl.excuteCall(ctrl.Setting, item);
              break;
            case 'Permission':
              ctrl.excutePermission(ctrl.Setting, item);
              break;
          }
          break;
        case 'Popup':
          setting.ModuleCode = setting.PopupModule;
          ctrl.onShowDetailDialog(item,null,setting);
          break;
        case 'Redirect':
          if (ctrl.$Utils.isEmpty(setting.Redirect) && setting.Redirect != '')
            // $location.path(ctrl.$Utils.expressionToString(item, ctrl.$Lodash.cloneDeep(setting.Redirect)));
            ctrl.$router.push(ctrl.$Utils.expressionToString(item, "/"+ctrl.$Lodash.cloneDeep(setting.Redirect)))
          else
             ctrl.$Utils.showMessage("error", ctrl.$toastMessage.emptyRedirectLink);
          break;
      }
    },
    onUpdateClick(item, objSetting) {
      var ctrl = this;
      /** khởi tạo dữ liệu  truyền vào directive con*/
      if (!ctrl.$Utils.isEmpty(item)) {
        item = {};
      }
      $.each(ctrl.$Lodash.cloneDeep(ctrl.Setting.objDefault), function(key, val) {
        item[key] = val;
      });
      var object = {};
      if (objSetting.ParentChild && objSetting.ParentChild.constructor === String ) {
        $.each(ctrl.$Utils.stringToObject(objSetting.ParentChild), function(parentKey, childKey) {
          if (ctrl.$Utils.isEmpty(item, parentKey)) {
            object[childKey] = item[parentKey];
          }
        });
      } else
        object = item;

      if (ctrl.$Utils.isEmpty(objSetting.Value) && objSetting.Value.indexOf('ReferenceId') > 0) {
        var array = ctrl.$Utils.stringToObject(objSetting.Value);
        $.each(array, function(key, val) {
          object[key] = val;
        })
      }
      objSetting.parentSetting = {
        // PreAction:
        object: ctrl.$Lodash.cloneDeep(object),
        set: ctrl.$Lodash(objSetting),
        callback: ctrl.Setting.functions
      };
      objSetting.directiveType = 'inside';
      /** gọi service mở pop-up*/
      objSetting.ModuleType = objSetting.PopupModuleType ? objSetting.PopupModuleType : "Form";
      //ntn show popup
      // utilsLibrary.showPopup({
      //   Template: 'Modal',
      //   Module: [objSetting]
      // });
    },
    displayControl(setting, item) {
      var ctrl = this;
      setting = setting ? setting : {};
      var object = { Show: true };
      if (setting.DisplayDependOn) {
        switch (setting.DisplayDependType) {
          case 'DependExist':
            if (!ctrl.$Utils.isEmpty(item, setting.DisplayDependOn)) {
              object.Show = false;
            }
            break;
          case 'DependEmpty':
            if (ctrl.$Utils.isEmpty(item, setting.DisplayDependOn)) {
              object.Show = false;
            }
            break;
          case 'DependOnSameAsValue':
            if (setting.DependValue) {
              if (item[setting.DisplayDependOn] != setting.DependValue) {
                object.Show = false;
              }
            }
            break;
          case 'DependOnDifferentThanValue':
            if (setting.DependValue) {
              if (item[setting.DisplayDependOn] == setting.DependValue) {
                object.Show = false;
              }
            }
            break;
        }
      }
      if (setting.ExtraText) {
        object.extraText = ctrl.$Utils.expressionToString(item, setting.ExtraText);
      }
      return object;
    },
    setTreeColumn(columns) {
      // $(document).bind('contextmenu', function(e) {
      //   return !$(e.target).parents('.jqx-grid').length > 0;
      // });
      // var arrColumn = [];
      // angular.forEach(columns, function(column) {
      //   arrColumn.push({ text: column.Caption, dataField: column.Name, name: column.Name, type: 'string' })
      // });
      // arrColumn[0].width = '30%';
      // if (utilsLibrary.isEmpty(arrColumn[1])) {
      //   arrColumn[1].width = '30%';
      // }
      // $scope.jqxSetting.TreeSetting.columns = arrColumn;
    },
    expressionHtmlString(exp, data) {
      var ctrl = this;
      var replacedExpression = '';
      while (exp && exp !== '') {
        if (exp.indexOf('{{') >= 0 && exp.indexOf('}}') > exp.indexOf('{{')) {
          replacedExpression += exp.substr(0, exp.indexOf('{{'));
          var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
          /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
          var exist = false;
          if (key.indexOf('|') > 0) {
            var name = key.substr(0, key.indexOf('|')).trim(),
              value = data[name],
              filter = key.substr(key.indexOf('|') + 1, key.length).split(':'),
              type = filter[0].trim(),
              format = filter[1];
            var strValue;
            switch (type) {
              case 'Cutstring':
                if (eval(format).constructor === Number && ctrl.$Utils.isEmpty(value, 'length') && value.length > format) {
                  // source[format.Name + "#Default"] = ctrl.$Lodash.cloneDeep(value)
                  if (format > 0) {
                    value = value.substring(0, format) + "...";
                  } else {
                    value = "..." + value.substring(eval(value.length + format), value.length);
                  }
                }
                strValue = value;
                break;
              case 'Color':
                // console.log(value)
                strValue = 'color:' + ctrl.arrStatusColor[value]
                break;
              case 'DateTime':
                value = ctrl.$Utils.stringToDate(value);
                switch (format) {
                  case 'Age':
                    var ageDate = new Date(Date.now() - value.getTime());
                    strValue = Math.abs(ageDate.getUTCFullYear() - 1970);
                    break;
                  default:
                    if (name === 'Now') {
                      var time = new Date;
                      strValue = ctrl.$Utils.formatDateTime(time, 'DD/MM/YYYY HH:mm:ss');
                    } else
                      strValue = ctrl.$Utils.formatDateTime(value, format);
                    break;
                }
                break;
              default:
                strValue = value;
                break;
            }
            replacedExpression += strValue;
          } else {
            if (ctrl.$Utils.isEmpty(data[key])) {
              replacedExpression += data[key];
            } else {
              replacedExpression += 0;
            }
          }
          exist = true;
          exp = exp.substr(exp.indexOf('}}') + 2, exp.length);
        } else {
          replacedExpression += exp;
          exp = '';
        }
      }
      return replacedExpression;
    },
    setTreeData() {
      // var ctrl = this;
      // var dataFields = ctrl.$Lodash.cloneDeep($scope.jqxSetting.TreeSetting.columns);
      // dataFields.push({ name: 'children', type: 'array' });
      // var source = {
      //   dataType: 'json',
      //   dataFields: dataFields,
      //   hierarchy: {
      //     root: 'children'
      //   },
      //   id: 'Id',
      //   localData: ctrl.FormatData
      // };
      // $scope.jqxSetting.TreeSetting.source = new $.jqx.dataAdapter(source);
      // $timeout(function() {
      //   angular.forEach($scope.jqxModel.TreeSetting.getRows(), function(row) {
      //     $scope.jqxModel.TreeSetting.expandRow(row.uid);
      //   });
      // });
    },
    onActionItemClick(e) {
      // var itemSelected = $('#jqxTreeGrid').jqxTreeGrid('getSelection');
      // if (itemSelected.length >= 0) {
      //   angular.forEach(ctrl.ListButtons, function(button, index) {
      //     if (button.Caption == e.args.innerText.trim()) {
      //       onLinkClick(button, itemSelected[0]);
      //     }
      //   });
      // }
    },
    sendNotification(arrRequest, objReturn) {
      var ctrl = this;
      /** get template sms, email... from setting*/
      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest),
        templateObject = {},
        userIds = '',
        requireOriginal = false;
      request['R1_Code'] = '';
      $.each(ctrl.Setting.Notifications, function(k, notificationSetting) {
        /** thêm request search template
         *  templateObject: object lưu lại thông tin template
         */
        request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.SearchSetting';
        request['R' + request.TotalRequests + '_Code'] = notificationSetting.Template + ';';
        templateObject[notificationSetting.Name] = {
          TemplateCode: notificationSetting.Template,
          Template: '',
          Code: notificationSetting.NotificationType,
          Receivers: [],
          Title: '',
          From: '',
          EmailAccount: '',
          Static: notificationSetting.AdditionField ? notificationSetting.AdditionField : '',
          Dynamic: notificationSetting.NotifyFields ? notificationSetting.NotifyFields : ''
        };
        /**
         * Tạo danh sách userId tương ứng với mỗi templateObject
         * @type {string}
         */
        var code = notificationSetting.Permissions ? notificationSetting.Permissions : '';
        $.each(code.split(';'), function(k, strCode) {
          $.each(arrRequest, function(k, permissionRequest) {
            if (permissionRequest.Code == strCode && templateObject[notificationSetting.Name].Receivers.join(';').indexOf(permissionRequest.Child) < 0) {
              templateObject[notificationSetting.Name].Receivers.push(permissionRequest.Child);
              if (userIds.indexOf(permissionRequest.Child) < 0) {
                userIds += permissionRequest.Child + ';';
              }
            }
          });
        });
        if (notificationSetting.RequireOriginal == 'true') {
          requireOriginal = true;
        }
      });
      if (userIds !== '') {
        /** thêm vào request seach thông tin người dùng*/
        request.TotalRequests++;
        request = ctrl.$Utils.updateParamsSingleRequest(request, {
          UserId: userIds,
          RequestTemplate: 'User',
          Status: 1
        }, request.TotalRequests);
      }
      /** chuyển các biến trong parameter sang giá trị*/
      $.each(request, function(key, val) {
        request[key] = ctrl.$Utils.expressionToString(objReturn, val + '');
      });
      /** post request search, return templateEmail/SMS, list user, Original info for returnObject... */
      ctrl.$Utils.post(request).then(function(resultTemplate) {
        if (!resultTemplate.success) {
          return false;
        }
        /** fill data from result template to templateObject, userArray, and returnObject*/
        $.each(ctrl.$Utils.getDataWithRoot(resultTemplate, 'R1.Data.DynamicDS.Setting'), function(k, template) {
          var notifiTemplate = JSON.parse(template.Description);
          for (var i = 0; i < ctrl.Setting.Notifications.length; i++) {
            if (template.Code == ctrl.Setting.Notifications[i].Template) {
              templateObject[ctrl.Setting.Notifications[i].Name].Template = ctrl.$Utils.decodeHtmlEntities(notifiTemplate.Content);
              templateObject[ctrl.Setting.Notifications[i].Name].EmailAccount = notifiTemplate.EmailAccount;
              templateObject[ctrl.Setting.Notifications[i].Name].From = notifiTemplate.From;
              templateObject[ctrl.Setting.Notifications[i].Name].Title = notifiTemplate.Title;
              templateObject[ctrl.Setting.Notifications[i].Name].TitleInsert = notifiTemplate.TitleInsert;
              templateObject[ctrl.Setting.Notifications[i].Name].TitleUpdate = notifiTemplate.TitleUpdate;
            }
          }
        });
        /** set arrayUser to templateObject*/
        var arrUser = ctrl.$Utils.getDataWithRoot(resultTemplate, 'R' + (ctrl.Setting.Notifications.length + 1) + '.Data.UserDS.User');
        /** set returnObject if get origin data is required*/
        if (ctrl.$Utils.isEmpty(resultTemplate.R3)) {
          if (requireOriginal) {
            var object = ctrl.$Utils.getDataWithRoot(resultTemplate['R' + (ctrl.Setting.Notifications.length + 1)], ctrl.Setting.RootData)[0];
            $.each(object, function(key, val) {
              objReturn[key] = val;
            });
          }
        }
        var arrayRequest = [];
        $.each(templateObject, function(k, tps) {
          /**
           * Kiểm tra trong template có yêu cầu hiển thị danh sách thay dổi hay không
           * nếu có replace {{ListChange với danh sách thay đổi
           */
          if (tps.Template.indexOf('{{ListChange') > 0) {
            var listChangekey = [];
            $.each(ctrl.Setting.FullFields, function(k, field) {
              if (field.History == 'true') {
                listChangekey.push(field.Name);
              }
            });
            /**
             * Biểu thức trong ListChange có dạng {paraA} {paraB}
             * strReplace: chuỗi danh sách các thay đổi
             * @type {string}
             */
            var string = tps.Template.substring(tps.Template.indexOf('{{ListChange') + 2, tps.Template.length);
            var str = '{{' + string.substr(0, string.indexOf('}}') + 2);
            var template = string.substr(string.indexOf('|') + 1, string.indexOf('}}') - string.indexOf('|') - 2);
            var strReplace = '';
            // /** chuyển thành dạng biểu thức thông thường để đưa vào hàm replace giá trị*/
            template = template.split('{').join('{{').split('}').join('}}');
            $.each(ctrl.Setting.FullFields, function(key, item) {
              item.Value = item.DynamicText ? objReturn[item.DynamicText] : objReturn[item.Name];
              if (this.$Utils.isEmpty(item, 'FieldColumnType') && item.FieldColumnType == 'DateTime') {
                item.Value = ctrl.$Utils.formatDateTime(item.Value, 'DD/MM/YYYY')
              }
              if (item.Value && item.Caption) {
                if (item.Name != 'Tool' && listChangekey.indexOf(item.Name) >= 0) {
                  /** gọi service replace giá trị và decode html nếu cần, thêm vào strReplace*/
                  if (ctrl.$Utils.isEmpty(item, 'FormElementType') && item.FormElementType == 'Html') {
                    strReplace += ctrl.$Utils.decodeHtmlEntities(ctrl.$Utils.expressionToString(item, template));
                  } else {
                    strReplace += ctrl.$Utils.expressionToString(item, template);
                  }
                }
              }
            });
            /** replace ListChange với chuỗi thu được*/
            tps.Template = tps.Template.replace(str, strReplace);
          }
          /** replace các biến giá trị trong template với giá trị trong objReturn*/
          tps.Template = ctrl.$Utils.expressionToString(objReturn, tps.Template);
          tps.Title = ctrl.$Utils.expressionToString(objReturn, tps.Title);
          $.each(tps.Receivers, function(k, userId) {
            var user;
            for (var i = 0; i < arrUser.length; i++) {
              if (userId == arrUser[i].UserId) {
                user = arrUser[i];
                break;
              }
            }
            /** tạo request email từ template*/
            if (ctrl.$Utils.isEmpty(user)) {
              arrayRequest.push({
                To: user.Email,
                Code: objReturn.Id,
                Subject: tps.Title,
                Body: ctrl.$Utils.encodeHtmlEntities(tps.Template),
                Name: 'Email',
                From: tps.From,
                EmailAccount: tps.EmailAccount,
                State: 2,
                Date: ctrl.$Utils.formatDateTime(),
                Parent: ctrl.$Utils.getUserInfo('UserId'),
                Sender: ctrl.$Utils.getUserInfo('UserId'),
                SenderName: ctrl.$Utils.getUserInfo('Username'),
                Receiver: user.UserId,
                ReceiverName: user.Username
              });
            }
          });
          /** tạo danh sách email từ setting bao gồm email động trong object, và email tĩnh setting trước*/
          var arrTo = [];
          if (tps.Static && tps.Static.constructor === String) {
            arrTo = arrTo.concat(tps.Static.split(';'));
          }
          if (tps.Dynamic && tps.Dynamic.constructor === String) {
            $.each(tps.Static.split(';'), function(k, field) {
              if (ctrl.$Utils.isEmpty(objReturn[field])) {
                arrTo.push(objReturn[field]);
              }
            });
          }
          $.each(arrTo, function(k, to) {
            arrayRequest.push({
              To: to,
              Code: objReturn.Id,
              Subject: tps.Title,
              Body: ctrl.$Utils.encodeHtmlEntities(tps.Template),
              Name: 'Email',
              From: tps.From,
              EmailAccount: tps.EmailAccount,
              State: 2,
              Date: ctrl.$Utils.formatDateTime(),
              Parent: ctrl.$Utils.getUserInfo('UserId'),
              Sender: ctrl.$Utils.getUserInfo('UserId'),
              SenderName: ctrl.$Utils.getUserInfo('Username'),
              Receiver: ctrl.$defaultUndefined,
              ReceiverName: ctrl.$defaultUndefined
            })
          });
        });
        var notificationRequest = ctrl.$Lodash.cloneDeep(ctr.$singleRequest);
        /** convert to multi request before post to server  */
        notificationRequest.TotalRequests = 0;
        notificationRequest.RequestTemplate = 'SendMessage';
        $.each(arrayRequest, function(k, req) {
          if (req.To) {
            notificationRequest.TotalRequests++;
            $.each(req, function(key, val) {
              notificationRequest['R' + notificationRequest.TotalRequests + '_' + key] = val;
            });
          }
        });
        /** if TotalRequests > 0, post to server */
        if (notificationRequest.TotalRequests > 0) {
          ctrl.$Utils.post(notificationRequest);
        }
      });
    },
    toggle(item) {
      var  ctrl = this;
      ctrl.selectedValue = [];
      var idx = ctrl.selected.indexOf(item);
      if (idx > -1) {
        ctrl.selected.splice(idx, 1);
      } else {
        ctrl.selected.push(item);
      }
      $.each(ctrl.selected, function(index, selected) {
        if (ctrl.$Utils.isEmpty(ctrl.FormatData[eval(selected)])) {
          ctrl.selectedValue[index] = ctrl.FormatData[eval(selected)];
        }
      })
      if (ctrl.$Utils.isEmpty(ctrl.selected, '0')) {
        ctrl.ExportItem = ctrl.selectedValue;
        ctrl.isSelected = true;
      } else {
        ctrl.ExportItem = ctrl.FormatData;
        ctrl.isSelected = false;
      }
    },
    exists(item) {
      return this.selected.indexOf(item) > -1;
    }
  },
  mounted() {
    var ctrl = this;
    if(!ctrl.Setting.functions)
      ctrl.Setting.functions = {};
    ctrl.Setting.functions.searchList = ctrl.searchList;
    var statusRequest = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        // category
        R1_RequestTemplate: "Setting.SearchBase",
        R1_ParentCode: "xSystem.Setting.xTask.Status"
      };
    ctrl.$Utils.post(statusRequest).then(dt => {
      var listStatus = ctrl.$Utils.getDataWithRoot(
        dt.R1,
        "Data.DynamicDS.Setting"
      );
      ctrl.listStatuss = ctrl.$Utils.getDataWithRoot(
        dt.R1,
        "Data.DynamicDS.Setting"
      );
      var arrTemp = [];
      $.each(listStatus, function(k,v){
        arrTemp[v.Id] = v.Color;
      });
      ctrl.arrStatusColor = arrTemp;
    })
    ctrl.searchList();
    ctrl.$hub.$on("reloadList", function($event, data) {
      if (!data) {
        ctrl.searchList();
        ctrl.selected = [];
        ctrl.isSelected = false;
      }
    })
  },
  watch: {

  },
  created(){
    if (this.$rootScope.dateFilter && this.$rootScope.dateFilter.length > 2) {
      this.dateStart = Vue.moment(this.$rootScope.dateFilter[0]).format('YYYY-MM-DD') + 'T00:00:00';
      this.dateEnd = Vue.moment(this.$rootScope.dateFilter[1]).format('YYYY-MM-DD') + 'T23:59:59';
      /* this.dateStart = Vue.moment(this.$rootScope.dateFilter[0]).format(this.requestDatetimeFormat);
      this.dateEnd = Vue.moment(this.$rootScope.dateFilter[1]).format(this.requestDatetimeFormat); */
    }
    if(this.$rootScope.selectedWorkerId){
      this.selectedWorker = this.$rootScope.selectedWorkerId;
    }
    this.$hub.$on("workerPicked", data => {
      this.selectedWorker = data;
      this.searchList();
    });
    this.$hub.$on("datePicked", data => {
      this.dateStart = Vue.moment(data[0]).format('YYYY-MM-DD') + 'T00:00:00';
      this.dateEnd = Vue.moment(data[1]).format('YYYY-MM-DD') + 'T23:59:59';
      this.searchList();
    });
    this.PartitionField = {};
    this.ListColumns = [];
    this.FullColumns = [];
    this.ListButtons = [];
    this.ListSearchConditions = [];
    this.Setting.objDefault = {};
    this.objCalculator = {};
    this.selected = [];
    this.arrPermission = {};
    if (this.$myDevice == "isMobileApp") {
      this.isMobile = true;
    }
    this.isMobileDevice = this.$isMobileDevice;
    this.autoLoad();
  }
};
</script>

<style lang="scss">
  .tasklist{
    th {
    .el-table .cell{
      word-break: keep-all !important;
      white-space: nowrap;
    }
    }
    .icon {
      font-size: 15px;
    }
    .list-check {
      display: inline;
    }
    .bg-danger {
      position: absolute;
      right: 2px;
      bottom: -4px;
      font-family: sans-serif;
      color: rgb(255, 255, 255);
      font-size: 10px;
      min-width: 13px;
      width: inherit;
      line-height: 13px;
      min-height: 13px;
      max-height: 13px;
      border-radius: 50%;
      padding: 1px;
    }
  }
</style>
