<template>
  <el-container id="target-part">
    <el-aside v-show="showMenu" style="background-color: rgb(238, 241, 246)" class="hidden-xs-only">
      <BlockLeftPanelTarget title="Mục tiêu của tôi" :vList="myTargetLst" :fnOpenDetail="openTargetDetail"/>
      <BlockLeftPanelTarget title="Mục tiêu tôi quản lý" :vList="myManagedTargetLst" :fnOpenDetail="openTargetDetail"/>
      <BlockLeftPanelTarget title="Mục tiêu được xem" :vList="publicTargetLst" :fnOpenDetail="openTargetDetail"/>
    </el-aside>
    <div v-on:click="onShowMenu(showMenu)" style="cursor: pointer;" class="hidden-xs-only">
      <el-tooltip v-if="!showMenu" content="Mở rộng" placement="top">
        <i class="fa fa-chevron-circle-right fa-lg mt-4 pl-1 pr-1"></i>
      </el-tooltip>
      <el-tooltip v-if="showMenu" content="Thu gọn" placement="top">
        <i class="fa fa-chevron-circle-left fa-lg mt-4 pl-1 pr-1"></i>
      </el-tooltip>
    </div>
    <el-main id="mainTarget" style="overflow: hidden">
      <div class="hidden-sm-and-up">
        <el-collapse>
          <el-collapse-item title="Phân loại mục tiêu">
            <BlockLeftPanelTarget title="Mục tiêu của tôi" :vList="myTargetLst" :fnOpenDetail="openTargetDetail"/>
            <BlockLeftPanelTarget title="Mục tiêu tôi quản lý" :vList="myManagedTargetLst"
                                  :fnOpenDetail="openTargetDetail"/>
            <BlockLeftPanelTarget title="Mục tiêu được xem" :vList="publicTargetLst" :fnOpenDetail="openTargetDetail"/>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
        <div :span="1"></div>
        <div class="my-row row">
          <div class="col" v-if="ListType && TargetTab !== 'settingTargets' ">
            <el-select v-model="filter.targetTypeId"
                       placeholder="Loại mục tiêu">
              <el-option v-if="ListType.length>0" v-for="item in ListType" :label="item.Name" :value="item.Id"
                         :key="item.Id"/>
            </el-select>
          </div>
          <div class="col" v-if="filteredListGroup && TargetTab !== 'settingTargets' ">
            <el-select multiple collapse-tags
                       v-model="filter.departmentIds" placeholder="Phòng ban">
              <el-option v-for="item in filteredListGroup" :label="item.GroupName"
                         :value="item.GroupId" :key="item.Id"/>
            </el-select>
          </div>
          <div class="col" v-if="TargetTab !== 'settingTargets' ">
            <el-select v-model="filter.selectedWorkers" placeholder="Lọc nhân sự" size="mini" multiple collapse-tags>
              <el-option v-for="w in ListWorker" :key="w.UserId" :label="w.Username" :value="w.UserId" v-if="w.UserId.indexOf(';')==-1"></el-option>
            </el-select>
          </div>
          <!--<div>
            <el-radio-group v-model="dateFilterType" size="mini" @change="changeFilterDateType" v-show="TargetTab === 'settingTargets'">
              <el-radio-button label="week">Tuần</el-radio-button>
              <el-radio-button label="month">Tháng</el-radio-button>
              <el-radio-button label="quarter">Quý</el-radio-button>
            </el-radio-group>
          </div>-->
          <div class="col">
            <el-select v-model="filter.startDateValue" placeholder="Tuần">
              <el-option-group v-if="years" v-for="year in years" :key="year.year" :label="year.year">
                <el-option v-for="item in year.weeks" :label="item.name" :value="item.value"
                           :key="item.value">
                  <span style="float: left">{{ item.name }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.text }}</span>
                </el-option>
              </el-option-group>
            </el-select>
            <!--<el-select v-else-if="dateFilterType==='month' && months" v-model="filter.startDateValue"
                       placeholder="Tháng" @clear="filter.startDateValue=''">
              <el-option v-if="months.length>0" v-for="month in months" :label="month.name" :value="month.value"
                         :key="month.value"/>
            </el-select>
            <el-select v-else-if="dateFilterType==='quarter' && quarters" v-model="filter.startDateValue"
                       placeholder="Quý" @clear="filter.startDateValue=''">
              <el-option v-if="quarters.length>0" v-for="quarter in quarters" :label="quarter.name" :value="quarter.value"
                         :key="quarter.value"/>
            </el-select>-->
          </div>
        </div>
      </div>
      <el-tabs v-model="TargetTab" @tab-click="changeTab">
        <el-tab-pane label="Mục tiêu tuần" name="weekTargets">
          <div id="configuration-list-detail" v-if="TargetTab === 'weekTargets' && Display">
            <WeekTarget :datasrc="dataToPass"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Công việc tuần" name="weekTasks">
          <div flex v-if="TargetTab == 'weekTasks' && Display">
            <WeekTask :datasrc="dataToPass"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Nhập mục tiêu" name="settingTargets">
          <div flex v-if="TargetTab == 'settingTargets' && Display">
            <TargetSetting :options="{'key':'Id', 'parentKey':'ParentId', 'levelKey': 'Level','rootLevel':6}"
                           :typeLst="ListType" :workerLst="ListWorker" :departmentLst="ListGroup" :targetLst="targetLst"
                           :targetFieldLst="targetFields"
                           :getTargets="getTargets" :getObject="getObject" :rootId="ParentId" :targetSavedLst="targetSavedLst"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import Vue from 'vue'
  import WeekTarget from '@/components/static/WeekTarget'
  import WeekTask from '@/components/static/WeekTask'
  import TargetSetting from '@/components/static/TargetSetting'
  import TargetDialog from '@/components/static/TargetDialog'
  import BlockLeftPanelTarget from '@/components/static/BlockLeftPanelTarget'
  import 'element-ui/lib/theme-chalk/display.css'
  Vue.use(require('vue-moment'))
  export default {
    components: {
      WeekTarget,
      WeekTask,
      TargetSetting,
      BlockLeftPanelTarget,
    },
    computed: {},
    watch: {
      filter: {
        handler: function (after, before) {
          this.filterChanged(after);
        },
        deep: true,
      },
    },
    mounted() {
      this.$rootScope.arrStatusColor = this.$getItemLocalStorage(this.$localStorageConstant.settingColor);
      if(this.$rootScope.arrStatusColor) this.$rootScope.arrStatusColor = JSON.parse(this.$rootScope.arrStatusColor);
      this.$hub.$on("datePicked", data => {
        this.model.PlanStartDateStartValue = data[0];
        this.model.PlanStartDateEndValue = data[1];
        this.changeType(this.Type, this.Target)
      })
      this.$hub.$on("workerPicked", data => {
        this.model.Worker = data;
        this.changeType(this.Type, this.Target)
      });
    },
    data() {
      var data = {
        startDateVal: '',
        endDateVal: '',
        "dateFilterType": "week",
        "currentTab": "weekTargets",
        "TargetTab": "weekTargets",
        "base": "",
        "isMobileVer": null,
        "height": 720,
        "showMenu": true,
        "headers": [],
        "listDates": [],
        "listGroupsDate": [],
        "tasks": [],
        "ProgressColor": [
          15,
          30,
          45,
          60,
          75,
          90,
          105
        ],
        "ListPlan": [],
        "DateTime": [
          [
            {
              "key": "DayAgo",
              "value": "Hôm trước"
            },
            {
              "key": "Day",
              "value": "Hôm nay"
            },
            {
              "key": "DayNext",
              "value": "Hôm sau"
            }
          ],
          [
            {
              "key": "WeekAgo",
              "value": "Tuần trước"
            },
            {
              "key": "Week",
              "value": "Tuần này"
            },
            {
              "key": "WeekNext",
              "value": "Tuần sau"
            }
          ],
          [
            {
              "key": "MonthAgo",
              "value": "Tháng trước"
            },
            {
              "key": "Month",
              "value": "Tháng này"
            },
            {
              "key": "MonthNext",
              "value": "Tháng sau"
            }
          ]
        ],
        "datasource": [],
        "notifications": [],
        "taskIndex": [],
        "listSubscribe": [],
        "isSystemAdmin": true,
        "isMantisAdmin": true,
        "prefix": "",
        "indexx": 1,
        "ListType": [
          {
            "Id": "1",
            "Name": "Mục tiêu công ty"
          },
          {
            "Id": "2",
            "Name": "Mục tiêu phòng ban"
          },
          {
            "Id": "3",
            "Name": "Mục tiêu cá nhân"
          }
        ],
        "isMobileApp": null,
        "SettingList": {},
        "showFilter": false,
        "model": {
          "WeekNumber": 48,
          "PlanStartDateStartValue": "2017-11-26T17:00:00.000Z",
          "PlanStartDateEndValue": "2017-12-03T16:59:59.000Z"
        },
        "listData": [],
        "thisYear": 2017,
        "viewModel": {},
        "baseUri": "",
        "Show": [],
        "Showa": true,
        "isMobileDevice": false,
        "Type": "Target",
        "TypeName": "Mục tiêu",
        "Target": 0,
        "arrWeek": [],
        "isWeek": "true",
        "ListWorker": [],
        "ListGroup": [],
        "filteredListGroup": [],
        "ListVersionProject": [],
        "targetFields": [],
        "ListProject": [],
        "SettingIndex": 0,
        "setFilterSetting": false,
        "lists": {},
        "ListSettings": [],
        "ListField": [],
        "ListCols": {},
        "listDisplay": [],
        "FieldList": "",
        "objSearch": {},
        "ListTarget": "",
        "listTargetDetail": [],
        "arrStatusColor": [],
        "dataSource": [],
        "Display": true,
        "cells": [],
        endDateVal: null,
        // "date": null
      };
      data.firstDayOfWeekCfg = this.$getItemLocalStorage('firstDayOfWeekCfg')? parseInt(JSON.parse(this.$getItemLocalStorage('firstDayOfWeekCfg')).Value): 1;
      data.targetLst = []
      data.targetSavedLst = []
      data.myTargetLst = [];
      data.myManagedTargetLst = [];
      data.publicTargetLst = [];
      data.years = this.getRecentWeeks(data.firstDayOfWeekCfg);
      data.months = [];
      data.quarters = [];
      data.filter = {
        startDateValue: "",
        departmentId: "",
        targetTypeId: "",
        selectedWorkers: '',
        departmentIds: [],
      };
      data.ParentId = '';
      data.tabCache = '';
      data.dataToPass = data;
      return data;
    },
    methods: {
      changeFilterDateType(val){
        var startDate = '';
        if(val==='week'){
          startDate= Vue.moment().isoWeekday(this.firstDayOfWeekCfg).startOf('isoweek')._d;
        }else if(val==='month'){
          startDate = Vue.moment().startOf('month')._d;
        }else if(val==='quarter'){
          startDate = Vue.moment().startOf('quarter')._d;
        }
        this.filter.startDateValue = startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate() + ' 00:00:00';
      },
      filterChanged(after){
        if (this.TargetTab == "settingTargets") {
          if (after.startDateValue == '') {
            var tmp = this.$Lodash.cloneDeep(this.targetSavedLst);
            this.targetLst = tmp.filter(item=>{
              return !(item.Code && item.Code === 'xSetting.Project.Parameter.Organization.Target');
            })
          } else {
            var startDateVal = new Date(after.startDateValue);
            var endDateVal = null;
            if(this.dateFilterType ==='week'){
              endDateVal= Vue.moment(startDateVal).isoWeekday(this.firstDayOfWeekCfg).endOf('isoweek')._d;
            }else if(this.dateFilterType ==='month'){
              endDateVal = Vue.moment(startDateVal).endOf('month')._d;
            }else if(this.dateFilterType ==='quarter'){
              endDateVal = Vue.moment(startDateVal).endOf('quarter')._d;
            }
            this.targetLst = this.targetSavedLst.filter((val) => {
              var condition = (new Date(val.ActualStartDate) <= startDateVal && new Date(val.ActualFinishDate) >= startDateVal)
                || (new Date(val.ActualStartDate) <= endDateVal && new Date(val.ActualFinishDate) >= endDateVal)
                || (new Date(val.ActualStartDate) <= startDateVal && new Date(val.ActualFinishDate) >= endDateVal)
                || (new Date(val.ActualStartDate) >= startDateVal && new Date(val.ActualFinishDate) <= endDateVal)
              return condition;
            });
          }
        } else {
          this.model.PlanStartDateStartValue = new Date(after.startDateValue);
          this.model.PlanStartDateEndValue = Vue.moment(after.startDateValue).isoWeekday(this.firstDayOfWeekCfg).endOf('isoweek');
          this.model.Project = after.departmentIds;
          this.model.Worker = after.selectedWorkers;
          var level = after.targetTypeId == '1' ? 0 : after.targetTypeId;
          if (this.currentTab == "weekTasks") {
            this.changeType('PlanStartDate')
          } else if (this.currentTab == "weekTargets") {
            this.changeType('Target', level);
          }
        }
      },
      changeTab(tab) {
        if(this.tabCache === 'settingTargets'){
          this.dateFilterType = 'week';
          this.changeFilterDateType('week');
        }
        this.changeTabTarget(tab.paneName);
        this.tabCache = tab.paneName;
      },
      onShowMenu(status) {
        this.showMenu = !status;
        $("#display").toggle("slow");
      },
      openTargetDetail(data, isEditable) {
        var fields = JSON.parse(this.targetFields);
        var dataToPass = {
          item: data,
          workers: this.ListWorker,
          departmentLst: this.ListGroup,
          isEditable: isEditable,
          targetLst: this.targetLst,
          disabled: !isEditable,
          targetFields: fields,
          getTargets: this.getTargets,
          getObject: this.getObject,
          targetSavedLst: this.targetSavedLst,
        };
        this.$hub.$emit(
          "set-modal-data",
          "",
          "50%",
          true,
          "center",
          TargetDialog,
          false,
          "",
          dataToPass,
          true
        );
        this.$hub.$emit("open-modal");
      },
      changeTabTarget(type) {
        if (type !== this.currentTab) {
          if (type == "weekTasks") {
            // this.$hub.$emit('isShowBreadScrum', true);
            //this.Display = false;
            this.changeType('PlanStartDate')
            if (this.thisYear != Vue.moment().year()) {
              this.thisYear = Vue.moment().year();
              this.getWeekthisYear();
            }
          } else if (type == "weekTargets") {
            // this.$hub.$emit('isShowBreadScrum', true);
            //this.Display = false;
            this.changeType('Target', this.filter.targetTypeId == '1' ? 0 : this.filter.targetTypeId);
          }else {
            if (this.filter.startDateValue == '') {
              var tmp = this.$Lodash.cloneDeep(this.targetSavedLst);
              this.targetLst = tmp.filter(item=>{
                return !(item.Code && item.Code === 'xSetting.Project.Parameter.Organization.Target');
              })
            } else {
              var startDateVal = Vue.moment(new Date(this.filter.startDateValue))._d;
              var endDateVal = Vue.moment(startDateVal).isoWeekday(this.firstDayOfWeekCfg).endOf('isoweek')._d;

              this.targetLst = this.targetSavedLst.filter((val, key) => {
                var condition = (new Date(val.ActualStartDate) <= startDateVal && new Date(val.ActualFinishDate) >= startDateVal)
                  || (new Date(val.ActualStartDate) <= endDateVal && new Date(val.ActualFinishDate) >= endDateVal)
                  || (new Date(val.ActualStartDate) <= startDateVal && new Date(val.ActualFinishDate) >= endDateVal)
                  || (new Date(val.ActualStartDate) >= startDateVal && new Date(val.ActualFinishDate) <= endDateVal)
                return condition;
              });
            }
          }
          this.currentTab = type;
        }
      },
      changeType(type, level) {
        this.Type = type;
        this.TypeName = type == 'PlanStartDate' ? 'Tuần' : 'Mục tiêu';
        this.Target = level;
        var typeNumber = type == 'PlanStartDate' ? 1 : 0
        if (!this.SettingList[this.Type])
          this.loadSetting(type == 'PlanStartDate' ? 1 : 0);
        else {
          var displayList = []
          this.SettingList[this.ListSettings[typeNumber].Name].Fields.forEach(function (val) {
            if (val.Caption && val.ListIsHidden != 'true') {
              displayList.push(val)
            }
          });
          var flag = false;
          this.ListCols = {};
          for (var i = 0; i < displayList.length; i++) {
            if (displayList[i].FieldType == "Group") {
              var dValue = displayList[i].Caption;
              this.ListCols[dValue] = [];
              flag = true;
            } else if (flag) {
              this.ListCols[dValue].push(displayList[i])
            }

          }
          this.getObject();
        }
      },
      getObject() {
        var vm = this;
        vm.objSearch = {};
        if (vm.Type == 'Target') {
          vm.ListTarget = '';
          var requestSearch = vm.$Utils.updateParamsSingleRequest(vm.$Lodash.cloneDeep(vm.$singleRequest), {
            ParentCode: 'xSetting.Project.Parameter.Organization.Target',
            RequestOrderFields: 'LeftIndex ASC',
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TargetType: vm.Target,
            RequestDataGroup: 'DataGroup.muc-tieu.091fb',
            RequestFields: 'Plan;Done;Progress;Unit;Assigned;AssignedName;Owner;OwnerName;TargetType;Id;Index;Code;Name;Value;Description;LeftIndex;ParentId;Level;ValueName;RightIndex;Created;CreatedBy;Modified;ActualStartDate;ActualFinishDate;IsPublic',
            RequestTemplate: 'xDynamicData_Setting.Search',
            AssignedUser: vm.$getItemLocalStorage(vm.$localStorageConstant.SessionId)
          });
          if (vm.$isMantisAdmin() && vm.Target == 0) {
            requestSearch.R1_TargetType = '1;2';
          } else if (vm.Target == 0)
            delete requestSearch.R1_TargetType;
          requestSearch.R1_Value = "";
          if (vm.model.Project.length > 0) {
            requestSearch.R1_Value = vm.model.Project.join(';');
          }


          vm.$Utils.postCheckResult(requestSearch).then(data => {
            data = vm.$Utils.getDataWithRoot(data, 'R1.Data.DynamicDS.Setting');
            vm.listTargetDetail = [];
            var currentId = vm.$getItemLocalStorage(vm.$localStorageConstant.UserId).toLowerCase();
            var noteChild = {};
            var noteRoot = 0;
            var index = 0;
            $.each(data, function (key, value) {
              var checked = {};
              if (!vm.model.Worker || vm.model.Worker.length == 0) {
                checked.Worker = true;
              } else {
                $.each(vm.model.Worker, function (key, val) {
                  if (val.indexOf(';') != -1) {
                    checked.Worker = true;
                  } else if (value.Assigned && value.Assigned.indexOf(val) != -1) {
                    checked.Worker = true;
                  }
                })
              }
              if (vm.Target == 0) {
                var minLevel = 6;
                var dashed = "";
                if (minLevel == value.Level) {
                  noteRoot++
                }
                dashed = noteRoot;
                if (!vm.$Utils.isEmpty(noteChild[noteRoot]))
                  noteChild[noteRoot] = {};
                for (var i = minLevel; i < value.Level; i++) {
                  if (!vm.$Utils.isEmpty(noteChild[noteRoot], value.Level))
                    noteChild[noteRoot][value.Level] = 0;
                  if (i == value.Level - 1) {
                    noteChild[noteRoot][value.Level]++
                    noteChild[noteRoot][eval(value.Level) + 1] = 0;
                  }
                  if (noteChild[noteRoot][i + 1] != 0 && noteChild[noteRoot][i + 1])
                    dashed += '.' + noteChild[noteRoot][i + 1];
                  else
                    dashed += '.0';
                }
                value.Index = dashed;
              }
              if (((!vm.$Utils.isEmpty(value.ActualStartDate) && !vm.$Utils.isEmpty(value.ActualFinishDate)) ||
                  (vm.$Utils.isEmpty(value.ActualStartDate) && eval(new Date(value.ActualStartDate) >= new Date(vm.model.PlanStartDateStartValue))
                    && eval(new Date(value.ActualStartDate) <= new Date(vm.model.PlanStartDateEndValue)))
                  || (vm.$Utils.isEmpty(value.ActualFinishDate)
                    && eval(new Date(value.ActualFinishDate) >= new Date(vm.model.PlanStartDateStartValue))
                    && eval(new Date(value.ActualFinishDate) <= new Date(vm.model.PlanStartDateEndValue)))
                  || (vm.$Utils.isEmpty(value.ActualStartDate) && vm.$Utils.isEmpty(value.ActualFinishDate)
                    && eval(new Date(value.ActualStartDate) <= new Date(vm.model.PlanStartDateEndValue))
                    && eval(new Date(value.ActualFinishDate) >= new Date(vm.model.PlanStartDateEndValue))))
                && checked.Worker
              ) {
                if (vm.Target != 0) {
                  index++;
                  value.Index = index;
                }
                vm.objSearch[value.Id] = value;
                vm.ListTarget += value.Id + ";";


                //build db for left panel
                var ele = value;
                ele.isOwner = false;
                ele.isAssigned = false;
                if (ele.Plan && parseInt(ele.Plan)) {
                  ele.Plan = vm.$Utils.numberWithCommas(ele.Plan);
                }
                if (ele.Done && parseInt(ele.Done)) {
                  ele.Done = vm.$Utils.numberWithCommas(ele.Done);
                }
                if (ele.Owner && ele.Owner.toLowerCase().indexOf(currentId) > -1) {
                  ele.isOwner = true;
                }
                if (ele.Assigned && ele.Assigned.toLowerCase().indexOf(currentId) > -1) {
                  ele.isAssigned = true;
                }
                ele.GroupName = '';
                if (vm.$Utils.isEmpty(ele.Modified)) ele.Modified = vm.$Utils.formatDateTime(ele.Modified, 'DD/MM/YYYY HH:mm');
                if (!vm.$Utils.isEmpty(ele.Progress)) {
                  ele.Progress = 0;
                } else {
                  ele.Progress = ele.Progress.split('.')[0];
                }
                if (vm.$Utils.isEmpty(ele.Value)) {
                  var ids = ele.Value.split(';');
                  var Name = "";
                  $.each(ids, (key, value) => {
                    $.each(vm.ListGroup, (gK, gV) => {
                      if (gK > 0 && value == gV.GroupId) ele.GroupName += gV.GroupName + ";"
                    });
                  });
                }
                if (vm.$isSystemAdmin() || vm.$isMantisAdmin()) {
                  if (vm.Target == 0 && ele.TargetType == 1) {
                    vm.listTargetDetail.push(ele);
                  } else {
                    vm.listTargetDetail.push(ele);
                  }
                } else {
                  vm.listTargetDetail.push(ele);
                }

              }
            });
            vm.getTask();
            var user = JSON.parse(vm.$getItemLocalStorage(vm.$localStorageConstant.LoggedOnUser));
            vm.myManagedTargetLst = [];
            vm.myTargetLst = [];
            vm.publicTargetLst = [];
            $.each(vm.listTargetDetail, (key, item) => {
              item.TargetTypeName = vm.ListType[item.TargetType - 1].Name;
              if (item.isOwner === true) {
                vm.myManagedTargetLst.push(item);
              }
              else if (item.isAssigned === true) {
                vm.myTargetLst.push(item);
              }
              else {
                vm.publicTargetLst.push(item);
              }
              //start permission
              var isLeaderOfTarget = false;
              if (user.GroupRoles != undefined && user.GroupRoles.Leader != undefined && item.Value && item.Value.split(';').length > 0) {
                user.GroupRoles.Leader.split(';').filter((v, k) => {
                  if (item.Value.indexOf(v) > -1) {
                    isLeaderOfTarget = true;
                  }
                });
              }
              if (vm.$isSystemAdmin()
                || vm.$isMantisAdmin()
                || (isLeaderOfTarget && item.TargetType === '3')) {
                item.Permission = 'Manage';
              } else {
                if ((isLeaderOfTarget && item.TargetType === '2')
                  || (isLeaderOfTarget && item.TargetType === '1')
                  || (item.Owner && item.Owner.indexOf(user.UserId) > -1)
                  || (item.Assigned && item.Assigned.indexOf(user.UserId) > -1)
                ) {
                  item.Permission = 'Edit';
                } else {
                  item.Permission = 'View';
                }
              }
              //end permission
            });
          });
        } else {
          var dateTime = vm.model.PlanStartDateStartValue;
          vm.objSearch[vm.$Utils.formatDateTime(Vue.moment(dateTime).toDate(), 'YYYY/MM/DD')] = vm.$Utils.dateToString(vm.$Utils.stringToDate(dateTime).getDay());
          while (eval(new Date(Vue.moment(dateTime).add(1, 'days')) < new Date(vm.model.PlanStartDateEndValue))) {
            dateTime = vm.$Utils.formatDateTime(Vue.moment(dateTime).add(1, 'days').toDate());
            vm.objSearch[vm.$Utils.formatDateTime(dateTime, 'YYYY/MM/DD')] = vm.$Utils.dateToString(vm.$Utils.stringToDate(dateTime).getDay());
          }
          vm.getTask();
        }
      },
      getTask(type) {
        // this.arrStatusColor = $rootScope.arrStatusColor;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 0;
        request.TotalRequests++;
        var objectRequest = {
          AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
          RequestTemplate: 'AG_Task_Task.Search',
          RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
          RequestFields: 'Id;Project;ProjectName;Index;Modified;Name;StatusName;WorkerName;PlanStartDate;Deadline;PlanManHour;RemainingManHour;RestTime;ChosenOne;Progress;CategoriesName;Targets;PriorityIdName;StatusDisplayName;StatusDisplay;TotalDownload;TotalComment;Action;Categories;CategoryProjectLevel1;CategoryProjectLevel2;CategoryProjectLevel3;ChosenOne;Code;CreatedBy;GroupRoot;Id;Index;Manager;Milestone;ModifiedBy;PriorityId;Project;ProjectType;Quality;Status;TaskQualityResult;TaskRequest;TaskResult;TaskState;TotalComment;TotalDownload;Type;Version;Worker;TagName;StatusDisplayName;SeverityName;VersionProjectName;CategoriesLevel1;CategoriesLevel2;CategoriesLevel3;CategoriesLevel4;TargetsName;TargetsLevel1;TargetsLevel2;TargetsLevel3;TargetsLevel4;CategoriesLevel5;ProjectCategoriesLevel1;ProjectCategoriesLevel2;ChosenOneName;Targets;',
          RequestOrderFields: 'PlanStartDate ASC'
        };
        if (this.Type == 'Target') {

          if (this.Target != 0) {
            objectRequest["TargetsLevel" + this.Target] = this.ListTarget;
            objectRequest.RequestFields += "TargetsLevel" + this.Target + ";";
          }
        }
        objectRequest.PlanStartDateStartValue = this.$Utils.formatDateTime(this.model.PlanStartDateStartValue);
        objectRequest.PlanStartDateEndValue = this.$Utils.formatDateTime(this.model.PlanStartDateEndValue);

        /** Create filter object from filter model*/
        var filterObject = {};
        if (this.$Utils.isEmpty(this.model.PlanStartDateEndValue, 'setHours')) {
          this.model.PlanStartDateEndValue.setHours(23, 59, 59);
        }
        if (this.Type != 'Target') {
          $.each(this.model, (key, val)=> {
            if (((typeof val) == 'object') && val != null) {
              if (val.length > 0) {
                filterObject[key] = val.join(';');
              } else if (val.length != 0) {
                filterObject[key] = this.$Utils.formatDateTime(val);
              }
            } else if ((typeof val) == 'string') {
              filterObject[key] = val;
            }
          });
        } else {
          filterObject.PlanStartDateStartValue = this.$Utils.formatDateTime(this.model.PlanStartDateStartValue);
          filterObject.PlanStartDateEndValue = this.$Utils.formatDateTime(this.model.PlanStartDateEndValue);
        }

        request = this.$Utils.updateParamsSingleRequest(request, objectRequest, request.TotalRequests);
        request = this.$Utils.updateParamsSingleRequest(request, filterObject, request.TotalRequests);

        this.$Utils.postCheckResult(request).then(data => {
          this.dataSource = this.$Utils.getDataWithRoot(data.R1, 'Data.TasksDS.Task');
          this.bindData();
        });
      },
      getWorker() {
        var request = {
          RequestAction: 'SearchUsers',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'Status;LoginName;UserId',
          StaticFields: 'UserId;Username;LoginName;Status;',
          OrderFields: 'LoginName ASC',
          DynamicFields: 'Avatar',
          Status: 1,
        };
        this.$Utils.post(request).then(data => {
          this.ListWorker = this.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
          var user = JSON.parse(
            this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)
          );
          if (user.LoginName !== "superadmin") {
              this.ListWorker = this.ListWorker.filter((el)=> {
                  return el.LoginName.indexOf("superadmin") === -1;
              });
          }

          var Total = {
            UserId: this.ListWorker.map((elem) => {
              return elem.UserId
            }).join(';'), Username: 'Tất cả'
          };
          this.ListWorker.unshift(Total)
        })
      },
      getVersionProject() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        var objectRequest = {
          // AssignedUser: getItemLocalStorage(localStorageConstant.SessionId),
          RequestTemplate: 'xDocument_Document.Search',
          RequestFields: 'Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type;',
          Code: 'Project',
          RequestDataGroup: 'DataGroup.quan-ly-du-an.053gf',
        };
        request = this.$Utils.updateParamsSingleRequest(request, objectRequest);
        this.$Utils.post(request).then(data => {
          this.ListVersionProject = this.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document');
          if (this.ListVersionProject.length > 0) {
            var Total = {
              Id: this.ListVersionProject.map((elem) => {
                return elem.Id
              }).join(';'), Name: 'Tất cả'
            };
            this.ListVersionProject.unshift(Total)
          }
        })
      },
      bindData() {
        var vm = this;
        vm.Display = true;
        vm.cells = [];
        vm.tasks = vm.dataSource;
        var week = vm.objSearch;
        var days = {};
        var taskByday = {};
        var Now = new Date();
        $.each(week, function (wKey, wValue) {
          var taskByday = {};
          var cellh = {"CellType": "h"};
          cellh.Id = wValue.Id;
          var TotalPlanManHour = 0.00;
          var TotalRemainingManHour = 0.00;
          var TotalActualManHour = 0.00;
          var TotalRestTime = 0.00;
          var TotalSpentTime = 0.00;
          var TotalProgress = 0.00;
          taskByday[wKey] = [];
          $.each(vm.tasks, function (k, task) {
            if (vm.Type == 'Target') {
              var head = "";
              if (vm.Target > 0)
                head = task["TargetsLevel" + vm.Target];
              else if (task.Targets) {
                var i = 1;
                if (vm.$isMantisAdmin() && task.Targets.split(";").length > 3) {
                  i = 2;
                  head = task["TargetsLevel" + (task.Targets.split(";").length - i)];
                } else {
                  head = task["TargetsLevel" + (task.Targets.split(";").length - i)];
                }
              }
            } else {
              var time = vm.$Utils.stringToDate(task.PlanStartDate);
              var date = vm.$Utils.dateToString(time.getDay());
              var head = vm.$Utils.formatDateTime(task.PlanStartDate, 'YYYY/MM/DD');
            }
            // task.ProgressColor = getProgressColor(task.Progress);
            if (vm.$Utils.isEmpty(head) && head != "" && wKey == head) {

              for (var k in task) {
                cellh[k] = "";
              }
              ;
              task.Progress = task.Progress ? parseFloat(task.Progress).toFixed(0) : parseFloat(0).toFixed(0);
              TotalPlanManHour = parseFloat(eval(TotalPlanManHour) + eval(task.PlanManHour)).toFixed(2);
              TotalActualManHour = parseFloat(eval(TotalActualManHour) + eval(task.ActualManHour)).toFixed(2);
              TotalRemainingManHour = parseFloat(eval(TotalRemainingManHour) + eval(task.RemainingManHour)).toFixed(2);
              TotalRestTime = parseFloat(eval(TotalRestTime) + eval(task.RestTime)).toFixed(2);
              TotalProgress = parseFloat(eval(TotalProgress) + (eval(task.Progress) / 100) * eval(task.RemainingManHour)).toFixed(2);
              if (task.Status != '532e9f1e-f5dc-4e75-b7c9-2bd785bbda67' && task.Status != '53cc3819-c019-4749-b0e4-52213438049b' && eval(Now > new Date(task.PlanStartDate)))
                task.SpentTime = parseFloat(vm.$Utils.expressionToString(task, "{{Deadline|DateTime:toNows}}")).toFixed(2);
              else {
                task.SpentTime = 0;
              }
              TotalSpentTime = parseFloat(eval(TotalSpentTime) + eval(task.SpentTime)).toFixed(2);
              if (!taskByday[wKey]) taskByday[wKey] = [];
              taskByday[wKey].push(task);
            }
          });
          if (vm.Type != 'Target') {
            var wtime = vm.$Utils.stringToDate(new Date(wKey));
            var wdate = vm.$Utils.dateToString(wtime.getDay());
            if (vm.model.WeekNumber == vm.SourceWeek) {
              cellh.Index = wdate;
            } else
              cellh.Index = wdate + ' - ' + vm.$Utils.formatDateTime(new Date(wKey), 'DD/MM');
          } else {
            cellh.Index = week[wKey].Index;
            cellh.Name = week[wKey].Name;
            if (vm.$Utils.isEmpty(week[wKey].Unit))
              cellh.Unit = " " + week[wKey].Unit;

            if (week[wKey].TargetType == 1) {
              if (week[wKey].ValueName)
                cellh.WorkerName = week[wKey].ValueName.split(',').join(', ');
            } else {
              if (week[wKey].AssignedName)
                cellh.WorkerName = week[wKey].AssignedName.split(',').join(', ');
            }
          }

          cellh.PlanManHour = TotalPlanManHour;
          cellh.ActualManHour = TotalActualManHour;
          cellh.RestTime = TotalRestTime;
          cellh.RemainingManHour = TotalRemainingManHour;
          cellh.SpentTime = TotalSpentTime;
          cellh.PlanStartDate = wValue.ActualStartDate;
          cellh.Deadline = wValue.ActualFinishDate;

          if (eval(TotalRemainingManHour) != 0)
            cellh.Progress = parseFloat((eval(TotalProgress) / eval(TotalRemainingManHour)) * 100).toFixed(0);
          else
            cellh.Progress = parseFloat(0).toFixed(0)
          if (vm.Type == 'Target') {
            if (parseInt(week[wKey].Plan)) {
              cellh.TargetPlan = vm.$Utils.isEmpty(week[wKey].Plan) ? vm.$Utils.numberWithCommas(week[wKey].Plan) : 0;
            } else {
              cellh.TargetPlan = vm.$Utils.isEmpty(week[wKey].Plan) ? week[wKey].Plan : 0;
            }

            if (parseInt(week[wKey].Done)) {
              cellh.TargetDone = vm.$Utils.isEmpty(week[wKey].Done) ? vm.$Utils.numberWithCommas(week[wKey].Done) : 0;
            } else {
              cellh.TargetDone = vm.$Utils.isEmpty(week[wKey].Done) ? week[wKey].Done : 0;
            }
            cellh.TargetProgress = vm.$Utils.isEmpty(week[wKey].Progress) ? week[wKey].Progress : 0;
            // cellh.ProgressColor = getProgressColor(cellh.TargetProgress);
            if (cellh.Name) {
              vm.cells.push(cellh);
              vm.cells = vm.cells.concat(taskByday[wKey]);
            }
          } else {
            if (cellh.Index) {
              cellh.PlanStartDate = wKey;
              cellh.Deadline = wKey;
              vm.cells.push(cellh);
              vm.cells = vm.cells.concat(taskByday[wKey]);
            }
          }
        });
      },
      loadSetting(index) {
        var vm = this;
        if (!vm.$Utils.isEmpty(index))
          vm.SettingIndex = 0;
        else
          vm.SettingIndex = index;
        vm.setFilterSetting = false;
        vm.lists = {};
        var request = vm.$Lodash.cloneDeep(vm.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentCode = "xSetting.Project.Tools.Target";
        vm.$Utils.post(request).then(data => {
          vm.ListSettings = vm.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          var searchList = vm.$Lodash.cloneDeep(vm.$singleRequest);
          searchList.R1_RequestTemplate = 'Setting.SearchBase';
          searchList.R1_ParentCode = 'xSetting.Project.List';
          searchList.R1_Code = vm.ListSettings[vm.SettingIndex].Value;
          vm.$Utils.post(searchList).then(dataL => {
            vm.SettingList[vm.ListSettings[vm.SettingIndex].Name] = vm.$Utils.getDataWithRoot(dataL.R1, 'Data.DynamicDS.Setting')[0];
            if (vm.$Utils.isEmpty(vm.SettingList[vm.ListSettings[vm.SettingIndex].Name], 'Description') && ((typeof vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].Description) == 'string'))
              vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].Description = JSON.parse(vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].Description);
            for (var i = 1; i <= vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].Description.FCount; i++) {
              if (i === 1)
                vm.ListField = "";
              vm.ListField += vm.SettingList[vm.ListSettings[vm.SettingIndex].Name]['F' + i]
              delete vm.SettingList[vm.ListSettings[vm.SettingIndex].Name]['F' + i];
            }
            vm.ListField = JSON.parse(vm.ListField);
            var displayList = []
            $.each(vm.ListField, (k, val) => {
              if (val.Caption && val.ListIsHidden != 'true') {
                displayList.push(val)
              }
            })
            var flag = false;
            vm.ListCols = {};
            for (var i = 0; i < displayList.length; i++) {
              if (displayList[i].FieldType == "Group") {
                var dValue = displayList[i].Caption;
                vm.ListCols[dValue] = [];
                flag = true;
              } else if (flag) {
                vm.ListCols[dValue].push(displayList[i])
              }

            }

            vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].Fields = vm.ListField;
            vm.listDisplay = JSON.parse(vm.SettingList[vm.ListSettings[vm.SettingIndex].Name].OF1);
            vm.FieldList = "";
            $.each(vm.ListField, (value, key) => {
              vm.FieldList += vm.ListSettings[vm.SettingIndex].Name + ";";
            });
            vm.getObject();
          })
        })
      },
      getTargets() {
        var ctrl = this;
        var user = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser));
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.TotalRequests = 2;
        request.R1_RequestTemplate = 'xDynamicData_Setting.Search';
        request.R1_ParentCode = 'xSetting.Project.Parameter.Organization.Target';
        request.R1_RequestFields = 'Plan;Done;Progress;Unit;Assigned;AssignedName;Owner;OwnerName;TargetType;Id;Index;Code;Name;Value;Description;LeftIndex;ParentId;Level;ValueName;RightIndex;Created;CreatedBy;Modified;IsPublic;ActualStartDate;ActualFinishDate';
        request.R1_RequestDataGroup = 'DataGroup.muc-tieu.091fb';
        request.R1_IncludedNestedSetParent = true;
        request.R1_AssignedUser = ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId);
        request.R1_OrderFields = 'Created desc';
        //
        request.R2_RequestTemplate = 'xDynamicData_Setting.Search';
        request.R2_ParentCode = 'xSetting.Project.Parameter.Organization.Target';
        request.R2_RequestFields = 'Plan;Done;Progress;Unit;Assigned;AssignedName;Owner;OwnerName;TargetType;Id;Index;Code;Name;Value;Description;LeftIndex;ParentId;Level;Value;RightIndex;Created;CreatedBy;Modified;IsPublic;ActualStartDate;ActualFinishDate';
        request.R2_RequestDataGroup = 'DataGroup.muc-tieu.091fb';
        request.R2_IncludedNestedSetParent = true;
        request.R2_OrderFields = 'Created desc';
        ctrl.$Utils.postCheckResult(request).then(function (result) {
          var data = ctrl.$Utils.getDataWithRoot(result.R1, 'Data.DynamicDS.Setting');
          ctrl.targetLst = data.filter(item=>{
            return !(item.Code && item.Code === 'xSetting.Project.Parameter.Organization.Target');
          })
          var listObj = {};
          if (ctrl.$Utils.isEmpty(ctrl.targetLst, '0')) {
            $.each(ctrl.targetLst, function (key, value) {
              listObj[value.Id] = value;
            })
            ctrl.RootLevel = ctrl.targetLst[0].Level;
            ctrl.targets = {};
            var indexOfRoot = undefined;
            ctrl.targetLst.filter(function (value, key) {

              if (ctrl.targets[value.Id]) {
                data[key].numChildren = ctrl.targets[value.Id].numChildren;
                ctrl.targets[data[key].Id] = data[key];
              } else {
                ctrl.targets[data[key].Id] = data[key];
              }

              if (ctrl.targets[data[key].ParentId]) {
                ctrl.targets[data[key].ParentId].numChildren = (ctrl.targets[data[key].ParentId].numChildren ? ctrl.targets[data[key].ParentId].numChildren : 0) + 1;
              } else {
                ctrl.targets[data[key].ParentId] = {};
                ctrl.targets[data[key].ParentId].numChildren = 1;
              }
              var childRank = ctrl.$Utils.isEmpty(listObj[value.ParentId]) ? eval(listObj[value.ParentId].Level - ctrl.RootLevel + 1) : eval(value.Level - ctrl.RootLevel);
              ctrl.targetLst[key].text = "";
              while (childRank > 0) {
                ctrl.targetLst[key].text += "|-- "
                childRank--;
              }
              ctrl.targetLst[key].text += value.Name;

              //start permission
              var isLeaderOfTarget = false;
              if (user.GroupRoles != undefined && user.GroupRoles.Leader != undefined && ctrl.targetLst[key].Value && ctrl.targetLst[key].Value.split(';').length > 0) {
                user.GroupRoles.Leader.split(';').filter(function (v, k) {
                  if (ctrl.targetLst[key].Value.indexOf(v) > -1) {
                    isLeaderOfTarget = true;
                  }
                });
              }

              if (ctrl.$isSystemAdmin() || ctrl.$isMantisAdmin() ||
                (isLeaderOfTarget && ctrl.targetLst[key].TargetType === '3')) {
                ctrl.targetLst[key].Permission = 'Manage';
              } else {
                if ((isLeaderOfTarget && ctrl.targetLst[key].TargetType === '2') ||
                  (isLeaderOfTarget && ctrl.targetLst[key].TargetType === '1') ||
                  (ctrl.targetLst[key].Owner && ctrl.targetLst[key].Owner.indexOf(user.UserId) > -1) ||
                  (ctrl.targetLst[key].Assigned && ctrl.targetLst[key].Assigned.indexOf(user.UserId) > -1)
                ) {
                  ctrl.targetLst[key].Permission = 'Edit';
                } else {
                  ctrl.targetLst[key].Permission = 'View';
                }
              }
              //end permission

              if (ctrl.targetLst[key] && ctrl.targetLst[key].Code !== undefined && ctrl.targetLst[key].Level === '5') {
                ctrl.ParentId = ctrl.$Lodash.cloneDeep(ctrl.targetLst[key].Id);
                indexOfRoot = key;
              }
            });
            ctrl.targetSavedLst = ctrl.$Lodash.cloneDeep(ctrl.targetLst);

            if (indexOfRoot != undefined) {
              ctrl.targetLst.splice(indexOfRoot, 1);
              data.splice(indexOfRoot, 1);
            }

          }
          var lst = ctrl.$Utils.getDataWithRoot(result.R2, 'Data.DynamicDS.Setting');
          $.each(lst, function (key, ele) {
            if (ele.Code != undefined && ele.Level === '5') {
              ctrl.ParentId = ctrl.$Lodash.cloneDeep(ele.Id);
            }
          });
          if (ctrl.$Utils.isEmpty(ctrl.StartDateFilter) && ctrl.$Utils.isEmpty(ctrl.EndDateFilter)) {
            var temp = ctrl.$Lodash.cloneDeep(data);
            var lst = [];
            $.each(temp, function (value) {
              if (ctrl.$Utils.isEmpty(value)) {
                var startDate = new Date(value.ActualStartDate);
                var endDate = new Date(value.ActualFinishDate);
                if ((startDate.getTime() >= ctrl.StartDateFilter.getTime() && startDate.getTime() <= ctrl.EndDateFilter.getTime()) &&
                  (endDate.getTime() >= ctrl.StartDateFilter.getTime() && endDate.getTime() <= ctrl.EndDateFilter.getTime())) {
                  lst.push(value);
                }
              }
            });
            data = lst;
          }
          ctrl.filterChanged(ctrl.filter);
        })
      },
      getRecentWeeks(firstDayOfWeekCfg) {

        var returnYears = [];
        var thisWeek = Vue.moment().week();
        if (Vue.moment().isoWeekday() >= 5)
          thisWeek = thisWeek + 1;
        //

        // var startDate = Vue.moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7 * 8));
        // var endDate = Vue.moment(new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 7 * 8));
        var startDate = Vue.moment().subtract(8, 'weeks');
        var endDate = Vue.moment().add(8, 'weeks');
        if(endDate._d.getFullYear() !== startDate._d.getFullYear()){
          var year1 = {
            year: endDate._d.getFullYear() + '',
            weeks: [],
          }
          var year2 = {
            year: startDate._d.getFullYear() + '',
            weeks: [],
          }
          for (var i = endDate; i > startDate; i = i.subtract(1, 'weeks')) {
            var monday = Vue.moment(i._d).isoWeekday(firstDayOfWeekCfg).startOf('isoweek')._d;
            var sunday = Vue.moment(i._d).isoWeekday(firstDayOfWeekCfg).endOf('isoweek')._d;
            var week = {
              name: "Tuần " + i.isoWeek(),
              text: this.$Utils.formatDateTime(monday, 'DD/MM') + " -> " + this.$Utils.formatDateTime(sunday, 'DD/MM'),
              value: monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00'
            }
            if(year1.year ==  sunday.getFullYear())
              year1.weeks.push(week);
            else if(year2.year ==  sunday.getFullYear())
              year2.weeks.push(week);
          }
          returnYears.push(year1);
          returnYears.push(year2);
        }else {
          var year = {
            year: startDate._d.getFullYear() + '',
            weeks: [],
          }
          for (var i = endDate; i > startDate; i = i.subtract(1, 'weeks')) {
            var monday = Vue.moment(i._d).isoWeekday(firstDayOfWeekCfg).startOf('isoweek')._d;
            var sunday = Vue.moment(i._d).isoWeekday(firstDayOfWeekCfg).endOf('isoweek')._d;
            var week = {
              name: "Tuần " + i.isoWeek(),
              text: this.$Utils.formatDateTime(monday, 'DD/MM') + " -> " + this.$Utils.formatDateTime(sunday, 'DD/MM'),
              value: monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00'
            }
            year.weeks.push(week);
          }
          returnYears.push(year);
        }

        return returnYears;
      },
      getRecentMonthsAndQuarters(){
        for(var i = -6; i< 6; i ++){
          var moment = Vue.moment().add(i, 'months');
          var month = {
            name: 'Tháng ' + ( moment._d.getMonth() + 1) + ' năm '+ (moment._d.getFullYear()),
            value: moment._d.getFullYear()+ '/'+ (moment._d.getMonth()+1)+'/' + moment.startOf('month')._d.getDate() + ' 00:00:00'
          }
          this.months.push(month);

        }
        for(var i = -4; i< 4; i ++){
          var moment = Vue.moment().add(i, 'quarters');
          var quarter = {
            name: 'Quý ' + (moment.quarter()) + ' năm ' + moment._d.getFullYear(),
            value: moment.startOf('quarter')._d.getFullYear()+ '/'+ (moment.startOf('quarter')._d.getMonth() +1)+'/' + moment.startOf('quarter')._d.getDate() + ' 00:00:00'
          }
          this.quarters.push(quarter);
        }
      }
    },
    created() {
      // this.getRecentMonthsAndQuarters();
      var vm = this;
      vm.getTargets();

      var user = JSON.parse(vm.$getItemLocalStorage(vm.$localStorageConstant.LoggedOnUser));
      var groups = user.Groups;
      groups.filter(function (group) {
        if (group.GroupName === 'Leader' || group.GroupName === 'Director') {
          if (user.GroupRoles == undefined) {
            user.GroupRoles = {};
            user.GroupRoles[group.GroupName] = group.GroupParent;
          } else {
            user.GroupRoles[group.GroupName] += ';' + group.GroupParent;
          }
        }
      });
      vm.$setItemLocalStorage('LoggedOnUser', JSON.stringify(user));
      // vm.date = new Date();
      vm.headers = [];
      vm.listDates = [
        {name: "Tháng 1", value: 1, type: "Tháng"},
        {name: "Tháng 2", value: 2, type: "Tháng"},
        {name: "Tháng 3", value: 3, type: "Tháng"},
        {name: "Tháng 4", value: 4, type: "Tháng"},
        {name: "Tháng 5", value: 5, type: "Tháng"},
        {name: "Tháng 6", value: 6, type: "Tháng"},
        {name: "Tháng 7", value: 7, type: "Tháng"},
        {name: "Tháng 8", value: 8, type: "Tháng"},
        {name: "Tháng 9", value: 9, type: "Tháng"},
        {name: "Tháng 10", value: 10, type: "Tháng"},
        {name: "Tháng 11", value: 11, type: "Tháng"},
        {name: "Tháng 12", value: 12, type: "Tháng"},
        {name: "Quý 1", value: 1, type: "Quý"},
        {name: "Quý 2", value: 2, type: "Quý"},
        {name: "Quý 3", value: 3, type: "Quý"},
        {name: "Quý 4", value: 4, type: "Quý"}
      ];

      vm.listGroupsDate = vm.listDates.reduce(function (previous, current) {
        if (previous.indexOf(current.type) === -1) {
          previous.push(current.type);
        }

        return previous;
      }, []);

      vm.tasks = [];
      vm.ProgressColor = [15, 30, 45, 60, 75, 90, 105];
      vm.ListPlan = [];

      vm.DateTime = [
        [
          {key: 'DayAgo', value: 'Hôm trước',},
          {key: 'Day', value: 'Hôm nay',},
          {key: 'DayNext', value: 'Hôm sau',}
        ],
        [{key: 'WeekAgo', value: 'Tuần trước'},
          {key: 'Week', value: 'Tuần này'},
          {key: 'WeekNext', value: 'Tuần sau'}
        ],
        [{key: 'MonthAgo', value: 'Tháng trước'},
          {key: 'Month', value: 'Tháng này'},
          {key: 'MonthNext', value: 'Tháng sau'}
        ]
      ];
      vm.datasource = [];
      vm.notifications = [];
      vm.taskIndex = [];
      vm.listSubscribe = [];
      vm.isSystemAdmin = vm.$isSystemAdmin();
      vm.isMantisAdmin = vm.$isMantisAdmin();
      vm.prefix = vm.$isMobile.iOS() ? '/' : '';
      vm.indexx = 1;
      vm.ListType = [{
        "Id": "1"
        , "Name": "Mục tiêu công ty"
      }, {
        "Id": "2"
        , "Name": "Mục tiêu phòng ban"
      }, {
        "Id": "3"
        , "Name": "Mục tiêu cá nhân"
      }];
      // vm.isMobileApp = (isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.iOS() || isMobile.iPad());
      vm.SettingList = {};
      vm.showFilter = false;
      vm.model = {};
      vm.listData = [];
      vm.thisYear = Vue.moment().year();
      // vm.getComboBox();
      vm.getWorker();
      vm.getVersionProject();
      var groupRequest = vm.$Lodash.cloneDeep(vm.$singleRequest);
      groupRequest.R1_RequestTemplate = 'OrgnizationList';
      groupRequest.R1_GroupType = 1;
      vm.$Utils.post(groupRequest).then(group => {
        vm.ListGroup = vm.$Utils.getDataWithRoot(group.R1, 'Data.UserDS.Group');
        if (vm.$Utils.isEmpty(vm.ListGroup, '0')) {
          $.each(vm.ListGroup, function (key, value) {
            var childRank = value.Level;
            vm.ListGroup[key].text = "";
            while (childRank > 1) {
              vm.ListGroup[key].text += "|-- ";
              childRank--;
            }
            vm.ListGroup[key].text += value.GroupName;
          });
        }
      });
      vm.filteredListGroup = this.$Utils.getUserInfo('Groups').filter(g=>{
        return g.GroupType === '1';
      });
      var settingRequest = vm.$Lodash.cloneDeep(vm.$singleRequest);
      settingRequest.R1_RequestTemplate = "SettingNew.SearchSetting";
      settingRequest.R1_Code = "DataGroup.muc-tieu.091fb";

      vm.$Utils.post(settingRequest).then(dataSetting => {
        vm.targetFields = vm.$Utils.getDataWithRoot(dataSetting.R1, 'Data.DynamicDS.Setting.F1');
      });
      vm.TargetTab = "weekTargets";
      if (vm.$appUri.BaseURL != "/") {
        vm.baseUri = vm.$appUri.BaseURL;
      }
      else {
        vm.baseUri = "";
      }
      vm.Show = [];
      vm.Showa = true;
      // vm.isMobileDevice = false//isMobileDevice;
      vm.Type = 'Target';
      vm.TypeName = 'Mục tiêu';
      vm.Target = 0;
      if(vm.isMantisAdmin)
        vm.filter.targetTypeId = '1';
      else
        vm.filter.targetTypeId = '3';
      var monday = Vue.moment(new Date()).isoWeekday(vm.firstDayOfWeekCfg).startOf('isoweek')._d;
      vm.filter.startDateValue = monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00';
    }
  }


</script>

<style lang="scss">
  #target-part {
    .grab-bing {
      cursor : -webkit-grab;
      cursor : -moz-grab;
      cursor : -o-grab;
      cursor : grab;
    }


    .grab-bing:active {
      cursor : -webkit-grabbing;
      cursor : -moz-grabbing;
      cursor : -o-grabbing;
      cursor : grabbing;
    }
    table {
      td {
        border-right: 1px solid #ddd !important;
      }
    }

    .default-column {
      min-width: 100px;
      text-align: center;
      vertical-align: middle;
    }

    .btnMenu {
      position: absolute;
      left: 5px;
      top: 6px;
    }

    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 200px !important;
    }

    .el-collapse-item__header {
      height: 25px;
      line-height: 25px;
      padding-left: 10px;
    }

    .el-collapse-item__arrow {
      line-height: 25px;
    }

    .el-collapse-item__content {
      padding-bottom: 0px;
    }

    .headerMenu {
      height: 30px;
      padding-left: 10px;
      font-weight: bold;
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
      .layout-column {
        .flex {
          min-height: 48px;
        }
      }
    }

    .owner {
      padding-top: 5px;
    }
    .my-row {
      .col {
        padding: 0px;
      }
    }
    @media screen and (max-width: 599px) {
      .headerMenu {
        height: 30px;
      }
    }

    thead {
      background-color: white;
    }
    .c {
      min-width: 5px !important;
      td {
        border: none !important;

      }
    ;
      padding: 0px !important;
      width: 0.5px !important;
      text-align: center !important;
    }
    td.c {
      background-color: darkgray !important;
    }
    .tgSt {
      font-size: 12px;
      text-align: left;
    }
    .tgWeek {
      min-width: 70px !important;
    }
    .cl-Targets {
      min-width: 140px !important;
    }
    .cl-Name {
      min-width: 160px !important;
    }
    .tg-StatusName {
      text-align: center;
    }
    .tg-qua-han {
      /*text-align: end;*/
    }
    .h {
      td::first-child {
        padding: 10px 5px !important;
      }
      td {
        border: none !important;

      }
      background-color: white !important;
      color: black;
      outline: auto;
      outline-color: rgb(189, 189, 189);
    }
    .mt {
      max-width: 300px !important;
      min-width: 200px !important;
    }
    .r {
      max-width: 45px !important;
      min-width: 30px !important;
    }
    .icon {
      font-size: 24px;
      min-width: 25px;
      margin: 0;
      padding: 0 6px;
    }
    th {
      text-align: center !important;
      border: solid thin lightgray;
    }
    tr {
      border: solid thin lightgray;
    }
    .el-main {
      padding: 0;
    }
    .container-fluid {
      padding: 5px !important;
    }
    #filter {
      /*display: none;*/
      position: fixed;
      top: 80px;
      right: 30px;
      z-index: 99;
      cursor: pointer;
    }
  }
</style>
