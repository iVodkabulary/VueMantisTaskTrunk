<template>
  <div class="dynamic-chart">
    <div class="page-header mb-2">
      <div class="title-box py-1 px-3">
        <div class="row">
          <h5 class="col m-auto"><i class="fa fa-line-chart"></i><span>  Báo cáo</span></h5>
          <div class="col text-right pr-0">
            <button class="btn btn-link" v-b-modal.chartFilter>
              <i class="fa fa-filter fa-lg"></i>
            </button>
            <!--<b-btn v-b-modal.modal-center></b-btn>
            <b-modal id="modal-center" centered title="Bootstrap-Vue">
              <p class="my-4">Vertically centered modal!</p>
            </b-modal>-->
          </div>

          <b-modal id="chartFilter" ref="chartFilter" title="Bộ lọc" class="text-primary" header-bg-variant="primary" hide-footer>
            <template>
              <div>
                <!-- <div class="text-center">
                  <button class="btn btn-secondary bg-white mr-2" @click="search()">Tìm kiếm</button>
                  <button class="btn btn-secondary bg-white" @click="clearInput()">Xóa trắng</button>
                </div> -->
<!--                 <p class="my-2">Lọc chính</p>
 -->                <DynamicFilter :pSetting="filterSetting"></DynamicFilter>
                <!-- <b-form-input v-model="filter.keyword"
                              type="text"
                              placeholder="Nhập từ khóa tìm kiếm"></b-form-input> -->
                <!-- <hr /> -->
                <!-- <p class="my-2">Lọc Nâng cao</p> -->
                <!-- <div class="col-12 py-2 px-0">
                  <el-select v-model="filter.Project" placeholder="Phòng ban" style="width: 100%;">
                    <el-option v-for="item in projects"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </div> -->
                <!-- <div class="col-12 py-2 px-0">
                  <el-date-picker
                    size="mini"
                    v-model="PlanStartDate"
                    type="daterange"
                    :popper-class="$isMobileDevice ? 'MobileDateRange': ''"
                    align="right"
                    range-separator="-"
                    start-placeholder="Bắt đầu"
                    end-placeholder="Kết thúc"
                    :picker-options="dateOptions">
                  </el-date-picker>
                </div>
                <div class="col-12 py-2 px-0">
                  <el-select v-model="filter.Worker" placeholder="Nhân sự thực hiện" style="width: 100%;" multiple
                             collapse-tags>
                    <el-option v-for="item in listWorkers"
                               :key="item.UserId"
                               :label="item.Username"
                               :value="item.UserId">
                    </el-option>
                  </el-select>
                </div>
                <div class="col-12 py-2 px-0">
                  <el-select v-model="filter.Project" placeholder="Phòng ban" style="width: 100%;" multiple
                             collapse-tags>
                    <el-option v-for="item in ListProject"
                               :key="item.GroupId"
                               :label="item.GroupName"
                               :value="item.GroupId">
                    </el-option>
                  </el-select>
                </div>
                <div class="col-12 py-2 px-0">
                  <el-select v-model="filter.VersionProject" placeholder="Dự án" style="width: 100%;" multiple
                             collapse-tags>
                    <el-option v-for="item in listVersionProjects"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </div> -->
                <!-- <div class="col-12 py-2 px-0">
                  <el-date-picker type="date" placeholder="Ngày tạo" v-model="filter.Created" style="width: 100%;"></el-date-picker>
                </div>
                <div class="col-12 py-2 px-0">
                  <el-date-picker type="date" placeholder="Ngày phát hành" v-model="filter.PublishedDate" style="width: 100%;"></el-date-picker>
                </div> -->
              </div>
            </template>
          </b-modal>
        </div>
      </div>
    </div>
    <b-card v-for="item in arrReport">
      <Report :Setting="item" :Filter="filter" :SearchIndex="searchIndex"></Report>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Report from './dynamic/DynamicReport';
  import SelectTree from '@/components/dynamic/SelectTree'
  import DynamicFilter from "@/components/dynamic/DynamicFilter";

  Vue.component('Report', Report)
  export default {
    components: {SelectTree, DynamicFilter},
    props: ['mSetting', 'pSetting'],
    data() {
      var firstDayOfWeekCfg = this.$getItemLocalStorage('firstDayOfWeekCfg')? parseInt(JSON.parse(this.$getItemLocalStorage('firstDayOfWeekCfg')).Value): 1;
      return {
        firstDayOfWeekCfg: firstDayOfWeekCfg,
        filter: {},
        PlanStartDate: [],
        arrReport: [],
        listWorkers: [],
        ListProject: [],
        listVersionProjects: [],
        searchIndex: 0,
        dateOptions: {
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
      };
    },
    methods: {
      // handleChange(value) {
      // }
      // getProject() {
      //   var params = {
      //     RequestAction: 'SearchUserWithGroups',
      //     IncludedGroupManager: 'true',
      //     RequestClass: 'BPM',
      //     RequestDataType: 'json',
      //     ConditionFields: 'IncludedGroupManager;Group;Status;LoginName;UserId',
      //     StaticFields: 'UserId;Username;LoginName;Description;Status;',
      //     DynamicFields: 'Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone',
      //     StructFields: 'GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification',
      //     OrderFields: 'LoginName ASC',
      //     GroupType: '1',
      //     UserId: JSON.parse(localStorage.getItem('LoggedOnUser'))['UserId'],
      //   }
      //   this.$Utils.post(params).then(data => {
      //     data = this.$Utils.getDataWithRoot(data, 'Data.UserDS.User')[0];
      //     var requestD = {
      //       RequestClass: 'BPM',
      //       RequestAction: 'SearchGroup',
      //       ConditionFields: 'GroupType,Description,GroupId',
      //       StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
      //       StructFields: 'ParentName',
      //       orderFields: 'GroupName ASC',
      //       RequestDataType: 'json',
      //       GroupId: data.Groups,
      //       GroupType: 1
      //     };
      //     this.$Utils.postCheckResult(requestD).then(dataD => {
      //       this.ListProject = this.$Utils.getDataWithRoot(dataD, 'UserDS.Group');
      //     })
      //   })
      // },
      // getWorker() {
      //   var params = this.$Lodash.cloneDeep(this.$singleRequest)
      //   params.R1_RequestTemplate = 'User'
      //   params.R1_limit = 1000
      //   params.R1_page = 1
      //   params.R1_start = 0
      //   params.R1_Status = 1
      //   this.$Utils.post(params).then(data => {
      //     this.listWorkers = this.$Utils.getDataWithRoot(data.R1, 'Data.UserDS.User');
      //   })
      // },
      // getVersionProject() {
      //   var params = this.$Lodash.cloneDeep(this.$singleRequest)
      //   params.R1_RequestDataGroup = 'DataGroup.quan-ly-du-an.053gf'
      //   params.R1_RequestFields = 'Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type'
      //   params.R1_Code = 'Project'
      //   params.R1_RequestTemplate = 'xDocument_Document.Search'
      //   this.$Utils.post(params).then(data => {
      //     this.listVersionProjects = this.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document');
      //   })
      // },
      // search() {
      //   this.searchIndex++;
      //   this.$refs.chartFilter.hide();
      // },
      // clearInput() {
      //   this.filter = {};
      //   this.PlanStartDate = [];
      // },
      onFilter(arrFilterData, objSetting) {
        var ctrl = this;
        arrFilterData.forEach(val => {
          if(val.name && val.name!="")
            this.filter[val.name] = val.value;
        })
        this.searchIndex++;
        this.$refs.chartFilter.hide();
      },
    },
    watch: {
      // PlanStartDate: function (date) {
      //   var s = '',
      //     e = '';
      //   if (this.$Utils.isEmpty(date, '0')) {
      //     s = date[0];
      //     s.setHours(0, 0, 0);
      //     this.filter['PlanStartDateStartValue'] = this.$Utils.formatDateTime(s)
      //   }
      //   if (this.$Utils.isEmpty(date, '1')) {
      //     e = date[1];
      //     e.setHours(23, 59, 59);
      //     this.filter['PlanStartDateEndValue'] = this.$Utils.formatDateTime(e);
      //   }
      // }
    },
    created() {
      this.filterSetting = this.mSetting.filter((el) => {
        return el.ModuleType == 'Filter';
        ;
      })[0];
      this.filterSetting.functions = {
        onFilter: this.onFilter,
        // UrlData:  this.Setting.UrlData
      }
      // this.getProject();
      // this.getWorker();
      // this.getVersionProject();
      var dateVal = new Date();
      var monday = Vue.moment(dateVal).isoWeekday(this.firstDayOfWeekCfg).startOf('isoweek')._d;
      var sunday = Vue.moment(dateVal).isoWeekday(this.firstDayOfWeekCfg).endOf('isoweek')._d;
      var start = new Date(monday.getFullYear() + '/' + (monday.getMonth() + 1) + '/' + monday.getDate() + ' 00:00:00');
      var end = new Date(sunday.getFullYear() + '/' + (sunday.getMonth() + 1) + '/' + sunday.getDate() + ' 23:59:59');
      this.PlanStartDate = [start, end]
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = 'SettingNew.SearchSetting';
      //request.R1_Code = this.reportCode;
      request.R1_Id = this.pSetting.Id;
      // request.R1_Id = 'ba09b34a-a169-4180-ab14-7fc5115f8eee';
      this.$Utils.post(request).then(data => {
        data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting')[0];
        if (data) {
          var listModule = this.$Utils.jsonParse(data.Value);
          var pageDescription =  this.$Utils.jsonParse(data.Description);
          if(this.$Utils.isEmpty(pageDescription, 'ModuleOrder'))
            var ModuleOrder = pageDescription.ModuleOrder.split(';');
          var listReport = "";
          var listFilter = "";
          if (listModule) {
            $.each(listModule, (key, value) => {
              if (value.ModuleType == 'Report') {
                if (this.$Utils.isEmpty(value.listUsers, "0") && JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).UserId.indexOf(value.listUsers) >= 0) {
                  listReport += value.ModuleCode + ";";
                } else if (this.$Utils.isEmpty(value.UserPermissions, "0")) {
                  value.UserPermissions.forEach((permission) => {
                    var Roles = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Roles;
                    Roles.forEach((role) => {
                      if (permission == role.GroupId) {
                        listReport += value.ModuleCode + ";";
                      }
                    })
                    var Groups = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)).Groups;
                    Groups.forEach((group) => {
                      if (permission == group.GroupId) {
                        listReport += value.ModuleCode + ";";
                      }
                    })
                  })
                } else if (!this.$Utils.isEmpty(value.listUsers, "0") || value.listUsers == []) {
                  listReport += value.ModuleCode + ";";
                }
                // listReport += value.ModuleCode + ";";
              } else if (value.ModuleType == 'Filter') {
                listFilter += value.ModuleCode + ";";
              }
            })
            var reportRequest = this.$Lodash.cloneDeep(this.$singleRequest);
            reportRequest.R1_RequestTemplate = 'SettingNew.SearchSetting';
            reportRequest.R1_Code = listReport;
            reportRequest.R1_AssignedUser = this.$getItemLocalStorage(
               this.$localStorageConstant.SessionId
            )
            this.$Utils.post(reportRequest).then(rdata => {
              rdata = this.$Utils.getDataWithRoot(rdata.R1, 'Data.DynamicDS.Setting');
              var objReport = {};
              $.each(rdata, (key, value) => {
                value.Value = this.$Utils.jsonParse(value.Value);
                var des = this.$Utils.jsonParse(value.Description);
                delete value.Description;
                $.each(des, function (k, val) {
                  value[k] = val;
                })
                // if(key == 1)
                if(!ModuleOrder)
                  this.arrReport.push(value)
                objReport[value.Code] = value
              })
              if(ModuleOrder)
                ModuleOrder.forEach(module =>{
                  if(this.$Utils.isEmpty(objReport[module]) && module!=''){
                    this.arrReport.push(objReport[module])
                  }
                })
               $.each(listModule, (key, value) => {
                  $.each(this.arrReport, (akey, aval) => {
                    if(aval.Code == value.ModuleCode) {
                      if (this.$Utils.isEmpty(value, 'DefaultFilter')) {
                          if(!aval.AdditionConditions) {
                            this.arrReport[akey].AdditionConditions = "";
                          }
                          value.DefaultFilter.forEach(fil => {
                            this.arrReport[akey].AdditionConditions += "&" + fil.Key + "=" + fil.Value
                          })
                        }
                      }
                  })
               })


            })

            /** Lấy dữ liệu filter
            var filterRequest = this.$Lodash.cloneDeep(this.$singleRequest);
            filterRequest.R1_RequestTemplate = 'SettingNew.SearchSetting';
            filterRequest.R1_Code = listFilter;
            this.$Utils.post(filterRequest).then(fdata => {
              fdata = this.$Utils.getDataWithRoot(fdata.R1, 'Data.DynamicDS.Setting');

              $.each(fdata, (key, value) => {
                value.Value = this.$Utils.jsonParse(value.Value);
                var des = this.$Utils.jsonParse(value.Description);
                delete value.Description;

                if (this.$Utils.isEmpty(value, "F1")) {
                    des.Fields = "";
                    for (var i = 1; i <= des.FCount; i++) {
                      if (value["F" + i] != undefined) {
                        des.Fields += value["F" + i];
                        delete value["F" + i];
                      }
                    }

                    des.Fields =
                      typeof des.Fields === "string"
                        ? JSON.parse(des.Fields)
                        : [];
                  }
                  des.Code = value.Code;
                  des.DataGroup = value.Name;
                  des.Value = value.Value;
                  des.ModuleType = module.ModuleType;
                  if (typeof des.AdditionConditions ==='string') {
                    des.AdditionConditions = this.$Utils.stringToObject(des.AdditionConditions, '&', '=');

                  }

                  $.each(des, function (k, val) {
                    value[k] = val;
                  })
                console.log(value)
                // if(key == 1)
                // this.arrReport.push(value)
              })


            })
            */
          }
        }
      })
    }
  }
</script>

<style lang="scss">
  .dynamic-chart {
    .card {
      margin-bottom: 5px;
    }
    #chartFilter .modal-dialog {
      position: fixed;
      right: 0px;
      margin: 0px;
      height: 100%;
    }

    .title-box {
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
    }

    #chartFilter .modal-dialog .modal-content {
      height: 100%;
    }
  }

</style>
