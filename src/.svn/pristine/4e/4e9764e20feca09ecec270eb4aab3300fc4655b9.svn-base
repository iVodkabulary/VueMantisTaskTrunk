<template>
  <div class="project-report">
    <div class="page-header mb-2">
      <div class="title-box py-1 px-3">
        <div class="row">
          <h5 class="col-md-8 m-auto"><i class="fa fa-industry"></i><span>  Dự án</span></h5>
          <div class="col text-right p-0">
            <div class="row text-right pr-0">
              <div div class="col-md-5 col-sm-5 col-5 pr-0">
                <el-select v-model="VersionProject" placeholder="Dự án" multiple
                           collapse-tags no-data-text="Không có dữ liệu">
                  <el-option v-for="item in baseList"
                             :key="item.Id"
                             :label="item.Name"
                             :value="item.Id">
                  </el-option>
                </el-select>
              </div>
              <div div class="col-md-6 col-sm-6 col-5 pl-0">
                <el-date-picker size="mini"
                                v-model="PlanStartDate"
                                type="daterange"
                                :popper-class="$isMobileDevice ? 'MobileDateRange': ''"
                                align="right"
                                range-separator="-"
                                start-placeholder="Bắt đầu"
                                end-placeholder="Kết thúc"
                                format="dd/MM/yyyy"
                                :picker-options="dateOptions">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div > -->
    <div v-if="viewModelGroup.length >= listStatus.length && DisplaySlick" class="project-slide mr-4 ml-4">
      <slick ref="slick" :options="slickOptions">
        <div class="card" v-for="item in viewModelGroup" :key="item.Id">
          <el-tooltip v-if="!$isMobileDevice" class="item" effect="dark" :content="item.Name" placement="top">
            <div class="card-header" @click="showDetailStatus(item)">{{item.Name}}</div>
          </el-tooltip>
          <div v-else class="card-header" @click="showDetailStatus(item)">{{item.Name}}</div>
          <div class="card-body text-center">
            <el-tooltip :content="item.Count + '/' +item.Total" placement="top" effect="light"><el-progress type="circle" :percentage="item.Percent"></el-progress></el-tooltip>
          </div>
          <div class="card-footer p-0">
            <div class="row">
              <div class="col-sm-6"><span>Tỉ lệ: <b>{{item.Percent}}%</b></span></div>
              <!-- <div class="col-sm-1"></div> -->
              <a href="javascript:void(0)" @click="showDetailStatus(item)" class="col-sm-5 text-right">Xem thêm</a>
            </div>
          </div>
        </div>
      </slick>
    </div>
    <div class="row d-flex justify-content-between report">
      <b-card class="col-md-9 mr-md-4 chart">
        <div class="d-flex flex-wrap justify-content-between">
          <b-card v-for="item in arrReport" class="col-md-6">
            <Report :Setting="item" :Filter="filter" :SearchIndex="allIndex"></Report>
            <!-- <Report :Setting="item" :Filter="filter" :SearchIndex="searchIndex"></Report> -->
          </b-card>
        </div>
      </b-card>
      <b-card class="col" v-if="!$isMobileDevice || $isMobile.iPad()">
        <template>
          <div>
            <div class="text-center">
              <button :class="'btn btn-secondary bg-white ' + (!$isMobile.iPad() ? 'mr-2' : 'col-12 mb-2')" @click="search()">Tìm kiếm</button>
              <button :class="'btn btn-secondary bg-white ' + ($isMobile.iPad() ? 'col-12' : '')" @click="clearInput()">Xóa trắng</button>
            </div>
            <div class="col-12 py-2 px-0">
              <el-input v-model="form['Keyword']"
                        type="text"
                        placeholder="Nhập từ khóa">
              </el-input>
            </div>
            <div class="RangeFilter col-12 py-2 px-0">
              <el-date-picker size="mini"
                              v-model="form['PlanStartDate']"
                              type="daterange"
                              align="right"
                               :popper-class="$isMobileDevice ? 'MobileDateRange': ''"
                              range-separator="-"
                              start-placeholder="Bắt đầu"
                              end-placeholder="Kết thúc"
                              format="dd/MM/yyyy"
                              :picker-options="dateOptions">
              </el-date-picker>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['Worker']" placeholder="Thực hiện" style="width: 100%;" multiple
                         collapse-tags  no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['Worker']"
                           :key="item.UserId"
                           :label="item.Username"
                           :value="item.UserId">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['PriorityId']" placeholder="Ưu tiên" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['PriorityId']"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['StatusDisplay']" placeholder="Quyền xem" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['StatusDisplay']"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['VersionProject']" placeholder="Dự án" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['VersionProject']"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['Project']" placeholder="Phòng ban" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['Project']"
                           :key="item.GroupId"
                           :label="item.GroupName"
                           :value="item.GroupId">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['Manager']" placeholder="Quản lý" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['Manager']"
                           :key="item.UserId"
                           :label="item.Username"
                           :value="item.UserId">
                </el-option>
              </el-select>
            </div>
            <div class="col-12 py-2 px-0">
              <el-select v-model="form['Status']" placeholder="Trạng thái" style="width: 100%;" multiple
                         collapse-tags no-data-text="Không có dữ liệu">
                <el-option v-for="item in DataList['Status']"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </div>
          </div>
        </template>
      </b-card>
    </div>
    <!-- </div> -->
  </div>
</template>
<script>
import Vue from "vue";
import timeline from "pzvue-timeline";
import Slick from "vue-slick";
import "../../node_modules/slick-carousel/slick/slick.css";
import Report from "./dynamic/DynamicReport";

Vue.component("Report", Report);

export default {
  components: {
    timeline: timeline,
    "timeline-item": timeline.item,
    Slick
  },
  data() {
    var firstDayOfWeekCfg = this.$getItemLocalStorage('firstDayOfWeekCfg')? parseInt(JSON.parse(this.$getItemLocalStorage('firstDayOfWeekCfg')).Value): 1;
    return {
      firstDayOfWeekCfg: firstDayOfWeekCfg,
      filter: {},
      form: {},
      ms: "Hello",
      showCollapse: true,
      slickOptions: {
        slidesToShow: !this.$isMobileDevice ? 5 : !this.$isMobile.iPad() ? 2 : 4,
        slidesToScroll: 3,
        infinite: false
        // Any other options that can be got from plugin documentation
      },
      Worker: "",
      Project: "",
      sortedFilter: [],
      VersionProject: [],
      DataList: {},
      viewModelGroup: [],
      PlanStartDate: [],
      arrReport: [],
      baseList: [],
      listStatus: [],
      listTaskTimeline: [],
      idToIndex: [],
      taskIndexTemp: [],
      taskIndexName: [],
      taskIndexContent: [],
      datasource: [],
      listSubscribe: [],
      searchIndex: 0,
      allIndex: 0,
      firstIndex: 0,
      indexx: 1,
      endIndex: 30,
      DisplaySlick: true,
      dateOptions: {
        firstDayOfWeek: firstDayOfWeekCfg,
        shortcuts: [
          {
            text: "Hôm trước",
            onClick(picker) {
              var now = new Date();
              var end = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  (now.getDate() - 1) +
                  " 23:59:59"
              );
              var start = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  (now.getDate() - 1) +
                  " 00:00:00"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Hôm nay",
            onClick(picker) {
              var now = new Date();
              var start = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  now.getDate() +
                  " 00:00:00"
              );
              var end = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  now.getDate() +
                  " 23:59:59"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Hôm sau",
            onClick(picker) {
              var now = new Date();
              var start = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  (now.getDate() + 1) +
                  " 00:00:00"
              );
              var end = new Date(
                now.getFullYear() +
                  "/" +
                  (now.getMonth() + 1) +
                  "/" +
                  (now.getDate() + 1) +
                  " 23:59:59"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tuần trước",
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() - 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              var start = new Date(
                monday.getFullYear() +
                  "/" +
                  (monday.getMonth() + 1) +
                  "/" +
                  monday.getDate() +
                  " 00:00:00"
              );
              var end = new Date(
                sunday.getFullYear() +
                  "/" +
                  (sunday.getMonth() + 1) +
                  "/" +
                  sunday.getDate() +
                  " 23:59:59"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tuần này",
            onClick(picker) {
              var dateVal = new Date();
              var monday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              var start = new Date(
                monday.getFullYear() +
                  "/" +
                  (monday.getMonth() + 1) +
                  "/" +
                  monday.getDate() +
                  " 00:00:00"
              );
              var end = new Date(
                sunday.getFullYear() +
                  "/" +
                  (sunday.getMonth() + 1) +
                  "/" +
                  sunday.getDate() +
                  " 23:59:59"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tuần sau",
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() + 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              var start = new Date(
                monday.getFullYear() +
                  "/" +
                  (monday.getMonth() + 1) +
                  "/" +
                  monday.getDate() +
                  " 00:00:00"
              );
              var end = new Date(
                sunday.getFullYear() +
                  "/" +
                  (sunday.getMonth() + 1) +
                  "/" +
                  sunday.getDate() +
                  " 23:59:59"
              );

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tháng trước",
            onClick(picker) {
              var dateVal = new Date();
              var pre = Vue.moment().subtract(1, "months")._d;
              var start = Vue.moment(pre).startOf("month")._d;
              var end = Vue.moment(start).endOf("month")._d;

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tháng này",
            onClick(picker) {
              var dateVal = new Date();
              var start = Vue.moment([
                dateVal.getFullYear(),
                dateVal.getMonth()
              ])._d;
              var end = Vue.moment(start).endOf("month")._d;

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Tháng sau",
            onClick(picker) {
              var dateVal = new Date();
              var next = Vue.moment().add(1, "months")._d;
              var start = Vue.moment(next).startOf("month")._d;
              var end = Vue.moment(start).endOf("month")._d;

              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    next() {
      this.$refs.slick.next();
    },

    prev() {
      this.$refs.slick.prev();
    },

    reInit() {
      // Helpful if you have to deal with v-for to update dynamic lists
      this.$nextTick(() => {
        this.$refs.slick.reSlick();
      });
    },
    handleChange() {},
    searchProject() {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "xDocument_Document.Search";
      request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
      request.R1_RequestFields = "Id;Name;Code;";
      request.R1_Code = "Project";
      request.R1_Id = "";
      // if(this.listStatus && this.listStatus.length > 0){
      // 	$.each(this.listStatus, (val, k) => {
      // 		request.R1_Id += val.Id + ";";
      // 	})
      // }
      if (!this.$isSystemAdmin() && !this.$isMantisAdmin())
        request.R1_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
      this.$Utils.post(request).then(dt => {
        this.baseList = this.$Utils.getDataWithRoot(
          dt.R1,
          "Data.DocumentDS.Document"
        );
        this.searchData();
      });
    },
    searchData(filter) {
      if (this.listStatus.length == 0) {
        this.listStatus = this.$Lodash.cloneDeep(this.baseList);
        if (filter) filter["VersionProject"] = "";
      }
      // if(filter)
      // this.filter = filter;
      if (this.$Utils.isEmpty(this.listStatus)) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = this.listStatus.length * 2;
        for (var i = 1; i <= this.listStatus.length; i++) {
          this.ProjectCode != this.listStatus[i - 1].Id;
          request["R" + i + "_VersionProject"] = this.listStatus[i - 1].Id;
          request["R" + i + "_RequestTemplate"] = "AG_Task_Task.Count";
          request["R" + i + "_RequestDataGroup"] =
            "DataGroup.danh-sach-cong-viec.04b66";
          //request['R' + i + '_RequestFields'] = 'Project;';
          // request['R' + i + '_PlanStartDateStartValue'] = this.start;
          // request['R' + i + '_PlanStartDateEndValue'] = this.end;
          request["R" + i + "_AssignedUser"] = this.$getItemLocalStorage(
            this.$localStorageConstant.SessionId
          );
          request[
            "R" + [i + this.listStatus.length] + "_AssignedUser"
          ] = this.$getItemLocalStorage(this.$localStorageConstant.SessionId);
          request[
            "R" + [i + this.listStatus.length] + "_VersionProject"
          ] = this.listStatus[i - 1].Id;
          request["R" + [i + this.listStatus.length] + "_Status"] =
            "532e9f1e-f5dc-4e75-b7c9-2bd785bbda67;53cc3819-c019-4749-b0e4-52213438049b;";
          request["R" + [i + this.listStatus.length] + "_RequestTemplate"] =
            "AG_Task_Task.Count";
          request["R" + [i + this.listStatus.length] + "_RequestDataGroup"] =
            "DataGroup.danh-sach-cong-viec.04b66";
          //request['R' + [i + this.listStatus.length] + '_RequestFields'] = 'Project;';
          // request['R' + [i + this.listStatus.length] + '_PlanStartDateStartValue'] = this.start;
          // request['R' + [i + this.listStatus.length] + '_PlanStartDateEndValue'] = this.end;
          if (!filter) {
            this.filter[
              "PlanStartDateStartValue"
            ] = this.$Utils.getDateTimeByKey("WeekStart");
            this.filter["PlanStartDateEndValue"] = this.$Utils.getDateTimeByKey(
              "WeekEnd"
            );
            request[
              "R" + i + "_PlanStartDateStartValue"
            ] = this.$Utils.getDateTimeByKey("WeekStart");
            request[
              "R" + i + "_PlanStartDateEndValue"
            ] = this.$Utils.getDateTimeByKey("WeekEnd");
            request[
              "R" + [i + this.listStatus.length] + "_PlanStartDateStartValue"
            ] = this.$Utils.getDateTimeByKey("WeekStart");
            request[
              "R" + [i + this.listStatus.length] + "_PlanStartDateEndValue"
            ] = this.$Utils.getDateTimeByKey("WeekEnd");
          } else {
            $.each(filter, (kC, condition) => {
              if (
                this.$Utils.isEmpty(condition, "setting") &&
                condition.setting.ElementType == "MultiTree"
              ) {
                $.each(condition.value.split(";"), (key, divine) => {
                  if (this.$Utils.isEmpty(divine) && divine != "") {
                    var level = key + 1;
                    request[
                      "R" + i + "_" + condition.name + "Level" + level
                    ] = divine;
                    request[
                      "R" +
                        [i + this.listStatus.length] +
                        "_" +
                        condition.name +
                        "Level" +
                        level
                    ] = divine;
                    delete request["R" + i + "_" + condition.name];
                    delete request[
                      "R" + [i + this.listStatus.length] + "_" + condition.name
                    ];
                  }
                });
              } else if (
                this.$Utils.isEmpty(condition) &&
                condition !== "" &&
                kC !== "VersionProject"
              ) {
                request["R" + i + "_" + kC] = condition;
                request[
                  "R" + [i + this.listStatus.length] + "_" + kC
                ] = condition;
              }
            });
          }
        }
        this.DisplaySlick = false;
        this.$Utils.post(request).then(data => {
          var Total = 0;
          var Count = 0;
          var Percent = 0;
          this.viewModelGroup = [];
          for (var i = 1; i <= this.listStatus.length; i++) {
            Total = this.$Utils.getDataWithRoot(data["R" + i], "Data");
            Count = this.$Utils.getDataWithRoot(
              data["R" + [i + this.listStatus.length]],
              "Data"
            );
            Total = parseInt(Total);
            Count = parseInt(Count);
            if (Total == 0) {
              Percent = 0;
            } else {
              Percent = parseFloat(Count / Total * 100).toFixed(0);
            }
            var o = {
              Name: this.listStatus[i - 1].Name,
              Count: Count,
              Total: Total,
              Id: this.listStatus[i - 1].Id,
              Percent: parseInt(Percent)
            };
            this.viewModelGroup.push(o);
          }
          this.DisplaySlick = true;
        });
      }
    },
    searchReport() {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      // request.R1_Id = 'b21e139a-3de2-4d06-b1a2-5e230903bd77';
      // request.R1_Id = 'ba09b34a-a169-4180-ab14-7fc5115f8eee';
      (request.R1_AssignedUser = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      )),
        (request.R1_ParentCode = "xSetting.Project.Page");

      this.$Utils.post(request).then(data => {
        this.firstIndex++;
        var arrPages = this.$Utils.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        for (var i = 0; i < arrPages.length; i++) {
          var Description = this.$Utils.jsonParse(arrPages[i].Description);
          if (Description.UrlPage == this.reportUrl) {
            var currentPage = arrPages[i];
            var listModule = this.$Utils.jsonParse(currentPage.Value);
            var listReport = "";
            $.each(listModule, function(key, value) {
              if (value.ModuleType == "Report") {
                listReport += value.ModuleCode + ";";
              }
            });
            var reportRequest = this.$Lodash.cloneDeep(this.$singleRequest);
            reportRequest.R1_RequestTemplate = "SettingNew.SearchSetting";
            reportRequest.R1_Code = listReport;
            this.$Utils.post(reportRequest).then(rdata => {
              rdata = this.$Utils.getDataWithRoot(
                rdata.R1,
                "Data.DynamicDS.Setting"
              );

              $.each(rdata, (key, value) => {
                value.Value = this.$Utils.jsonParse(value.Value);
                var des = this.$Utils.jsonParse(value.Description);
                delete value.Description;
                $.each(des, function(k, val) {
                  value[k] = val;
                });
                // if(key == 1)
                value.ShowTable = false;
                if (key == 3) {
                  this.arrReport.unshift(value);
                } else this.arrReport.push(value);
              });
            });
            break;
          }
        }
      });
    },
    getFilter() {
      var searchFilter = this.$Lodash.cloneDeep(this.$singleRequest);
      searchFilter.R1_RequestTemplate = "Setting.SearchBase";
      searchFilter.R1_ParentCode = "xSetting.Project.Filter";
      searchFilter.R1_Code = this.filterCode;
      this.$Utils.post(searchFilter).then(dataE => {
        this.SettingFilter = this.$Utils.getDataWithRoot(
          dataE.R1,
          "Data.DynamicDS.Setting"
        )[0];
        if (
          this.$Utils.isEmpty(this.SettingFilter, "Description") &&
          typeof this.SettingFilter.Description == "string"
        )
          this.SettingFilter.Description = this.$Utils.jsonParse(
            this.SettingFilter.Description
          );
        if (this.SettingFilter.Description) {
          this.SettingFilter.Dependencies = this.SettingFilter.Description.Dependencies;
          this.objFields = {};
          for (var i = 1; i <= this.SettingFilter.Description.FCount; i++) {
            if (i === 1) this.FilterSettings = "";
            this.FilterSettings += this.SettingFilter["F" + i];
            if (i === this.SettingFilter.Description.FCount) {
              this.FilterSetting = this.$Utils.jsonParse(this.FilterSettings);
              this.setFilterSetting = true;
              this.SettingFilter.Fields = this.FilterSetting;
              $.each(this.FilterSetting, (key, value) => {
                this.FilterSetting[key].ElementType = value.FilterElementType
                  ? value.FilterElementType
                  : value.FormElementType;
                if (
                  this.FilterSetting[key].ElementType === "Select" ||
                  this.FilterSetting[key].ElementType === "Multi" ||
                  this.FilterSetting[key].ElementType === "Radio" ||
                  this.FilterSetting[key].ElementType === "Tree"
                ) {
                  this.FilterSetting[key].Code = value.FilterCode
                    ? value.FilterCode
                    : value.FormCode;
                  this.FilterSetting[key].Field = value.FilterField
                    ? value.FilterField
                    : value.FormField;
                  this.FilterSetting[key].FieldType = value.FilterFieldType
                    ? value.FilterFieldType
                    : value.FormFieldType;
                  this.FilterSetting[
                    key
                  ].IncludeSubmit = value.FilterIncludeSubmit
                    ? value.FilterIncludeSubmit
                    : value.FormIncludeSubmit;
                  this.FilterSetting[key].Request = value.FilterRequest
                    ? value.FilterRequest
                    : value.FormRequest;
                  this.FilterSetting[key].DataRoot = value.FilterDataRoot
                    ? value.FilterDataRoot
                    : value.FormDataRoot;
                  this.FilterSetting[key].RequireOriginal = false;
                  this.FilterSetting[key].DisplayText = value.FilterDisplayText
                    ? value.FilterDisplayText
                        .replace(/{{/g, "")
                        .replace(/}}/g, "")
                    : value.FormDisplayText
                      ? value.FormDisplayText
                          .replace(/{{/g, "")
                          .replace(/}}/g, "")
                      : "Name";
                  this.FilterSetting[key].SavedKey = value.FilterSavedKey
                    ? value.FilterSavedKey.replace(/{{/g, "").replace(/}}/g, "")
                    : value.FormSavedKey
                      ? value.FormSavedKey.replace(/{{/g, "").replace(/}}/g, "")
                      : "Id";
                  this.FilterSetting[key].SavedText = value.FilterSavedText
                    ? value.FilterSavedText
                        .replace(/{{/g, "")
                        .replace(/}}/g, "")
                    : value.FormSavedText
                      ? value.FormSavedText
                          .replace(/{{/g, "")
                          .replace(/}}/g, "")
                      : "Name";
                }
                var type = "Filter";
                $.each(this.FilterSetting[key], (ckey, val) => {
                  if (ckey.indexOf(type) === 0 && ckey.length > type.length) {
                    this.FilterSetting[key][
                      ckey.substring(type.length, ckey.length)
                    ] = val;
                  }
                });
                if (this.FilterSetting[key].FieldColumnType === "DateTime") {
                  this.FilterSetting[key].ColumnFlex = 50;
                  this.FilterSetting[key].DateMode = "range";
                }
                this.objFields[
                  this.FilterSetting[key].Name
                ] = this.FilterSetting[key];
                this.FilterSetting[key].Dependency = [];
                this.SettingFilter.Dependencies.forEach(depend => {
                  if (depend.Target === this.FilterSetting[key].Name) {
                    this.FilterSetting[key].Dependency.push(depend);
                  }
                });
                // this.FilterSetting[key].onChange = function(data) {
                //   this.checkDependencies(data);

                // }
              });
              var sortGroup = this.$Lodash.cloneDeep(
                this.SettingFilter.Description.Groups
              );
              this.SettingFilter.Description.Groups = [];
              if (
                this.$Utils.isEmpty(sortGroup[1]) &&
                sortGroup[1].Caption === "Lọc chính"
              ) {
                this.SettingFilter.Description.Groups.push(sortGroup[1]);
                this.SettingFilter.Description.Groups.push(sortGroup[0]);
              } else {
                this.SettingFilter.Description.Groups = sortGroup;
              }
              this.SettingFilter.Description.Groups.forEach(gItem => {
                if (typeof gItem.ListFields == "string") {
                  gItem.ListFields.split(";").forEach(gvalue => {
                    this.FilterSetting.forEach(value => {
                      if (value.Name === gvalue) {
                        if (
                          value.ElementType === "Select" ||
                          value.ElementType === "Multi" ||
                          value.ElementType === "Radio" ||
                          value.ElementType === "Tree"
                        ) {
                          var sParms = this.$Lodash.cloneDeep(
                            this.$singleRequest
                          );
                          // //     		if(sParms.R1_Code == "Version" && sParms.R1_RequestDataGroup == "DataGroup.quan-ly-version.0ad08")
                          // //   sParms.R1_Project = (this.$Utils.isEmpty(sParms.R1_Project) && sParms.R1_Project != "") ? sParms.R1_Project : this.$Utils.isEmpty(this.itemData, 'Project') ? this.itemData.Project : $rootScope.loggedOnUser.Project.GroupId;
                          // // if(sParms.R1_ParentCode == "xSetting.Project.Parameter.Project.Category")
                          // //   sParms.R1_Value = (this.$Utils.isEmpty(sParms.R1_Value) && sParms.R1_Value != "") ? sParms.R1_Value : this.$Utils.isEmpty(this.itemData, 'Project') ? this.itemData.Project : $rootScope.loggedOnUser.Project.GroupId;
                          sParms.R1_RequestTemplate = value.Request;
                          sParms = this.$Utils.updateParamsSingleRequest(
                            sParms,
                            this.$Utils.stringToObject(value.Code)
                          );
                          this.$Utils.post(sParms).then(arrayData => {
                            this.dataSource = [];
                            arrayData = this.$Utils.getDataWithRoot(
                              arrayData.R1,
                              value.DataRoot ? value.DataRoot : "Data"
                            );
                            if (sParms.R1_RequestTemplate == "User") {
                              var arrData = this.$Lodash.cloneDeep(arrayData);
                              arrayData = [];
                              arrData.forEach(item => {
                                if (item.LoginName != "superadmin") {
                                  arrayData.push(item);
                                }
                              });
                            }
                            value.Data = arrayData;
                            this.DataList[value.Name] = arrayData;
                            value.DisplayText = value.DisplayText
                              ? value.DisplayText
                                  .replace(/{{/g, "")
                                  .replace(/}}/g, "")
                              : undefined;
                            value.SavedKey = value.SavedKey
                              ? value.SavedKey
                                  .replace(/{{/g, "")
                                  .replace(/}}/g, "")
                              : undefined;
                            value.SavedText = value.SavedText
                              ? value.SavedText
                                  .replace(/{{/g, "")
                                  .replace(/}}/g, "")
                              : undefined;
                            this[value.Name] = [];
                            this.sortedFilter.push(value);
                          });
                        } else this.sortedFilter.push(value);
                      }
                    });
                  });
                }
              });
            }
          }
        }
      });
    },
    search() {
      this.searchIndex++;
      this.allIndex++;
    },
    showDetailStatus(item) {
      var query = {};
      $.each(this.filter, (key, val) => {
        //   if(key == 'Keyword' && val!= ''){
        //     query[key] = val;
        //   } else if(key == 'PlanStartDate' && val.length > 0){
        //     query[key+'StartValue'] = this.$Utils.formatDateTime(val[0]);
        //     e = val[1];
        //     e.setHours(23, 59, 59);
        //     query[key+'EndValue'] = this.$Utils.formatDateTime(e);
        //   } else if(Array.isArray(val) && val.length > 0){
        //     query[key] = val.join(';')
        //   }
        if (val != "") {
          query[key] = val;
        }
      });
      query["VersionProject"] = item.Id;
      // console.log(query)
      this.$router.push({
        path: "timeline",
        query: query
      });
    }
  },
  watch: {
    // a computed getter
    // datasource: function(newdatasource){
    //   // `this` points to the vm instance
    //   this.listTaskTimeline = $.map(this.datasource, (v, i) => {
    //     return {
    //       WorkerName: v.CreatedByName,
    //       Name: this.taskIndex[v.SourceId].name,
    //       eType: this.readHistory(v),
    //       Date: this.getDayName(v.Created),
    //       Avatar: this.$appUri.BaseUri+ "/" + v.Avatar + "&Height=50&Width=50"
    //     };
    //   });
    // }
    searchIndex: function(date) {
      if (this.form != undefined) {
        $.each(this.form, (key, value) => {
          if (key == "Keyword") {
            this.filter[key] = value;
          } else if (key == "PlanStartDate") {
            var s = "",
              e = "";
            if (this.$Utils.isEmpty(value, "0")) {
              s = value[0];
              s.setHours(0, 0, 0);
              this.filter[
                "PlanStartDateStartValue"
              ] = this.$Utils.formatDateTime(s);
            }
            if (this.$Utils.isEmpty(value, "1")) {
              e = value[1];
              e.setHours(23, 59, 59);
              this.filter["PlanStartDateEndValue"] = this.$Utils.formatDateTime(
                e
              );
            }
          } else {
            // $.each(value, (val, k) => {

            // })
            if (Array.isArray(value)) this.filter[key] = value.join(";");
          }
        });
        // console.log(this.filter)
        this.searchData(this.filter);
      }
    },
    PlanStartDate: function(date) {
      if (this.firstIndex != 0) {
        var s = "",
          e = "";
        if (this.$Utils.isEmpty(date, "0")) {
          s = date[0];
          s.setHours(0, 0, 0);
          this.filter["PlanStartDateStartValue"] = this.$Utils.formatDateTime(
            s
          );
        }
        if (this.$Utils.isEmpty(date, "1")) {
          e = date[1];
          e.setHours(23, 59, 59);
          this.filter["PlanStartDateEndValue"] = this.$Utils.formatDateTime(e);
        }
        this.searchData(this.filter);
        this.allIndex++;
      }
    },
    VersionProject: function(data) {
      if (this.firstIndex != 0) {
        this.listStatus = [];
        // if(!this.filter['VersionProject']){
        this.filter["VersionProject"] = "";
        // }
        // $.each(data, (k, val) => {
        // 	if(val != "" && this.$Utils.jsonParse(val)){
        // 		this.filter['VersionProject'] += this.$Utils.jsonParse(val).Id + ";";
        // 		this.listStatus.push(this.$Utils.jsonParse(val))
        // 	}

        // })

        $.each(this.baseList, (key, value) => {
          $.each(data, (k, val) => {
            if (value != "" && val == value.Id) {
              this.filter["VersionProject"] += value.Id + ";";
              this.listStatus.push(value);
            }
          });
        });
        this.searchData(this.filter);
        this.allIndex++;
      }
    }
  },
  mounted() {
    // if (this.indexx == 1) {
    //   this.SearchHistory();
    // }
    // var intervalHistory = setInterval(() => {
    //   this.SearchHistory(0, this.endIndex);
    // }, 10000);
  },
  created() {
    var dateVal = new Date();
    var monday = Vue.moment(dateVal)
      .isoWeekday(this.firstDayOfWeekCfg)
      .startOf("isoweek")._d;
    var sunday = Vue.moment(dateVal)
      .isoWeekday(this.firstDayOfWeekCfg)
      .endOf("isoweek")._d;
    var start = new Date(
      monday.getFullYear() +
        "/" +
        (monday.getMonth() + 1) +
        "/" +
        monday.getDate() +
        " 00:00:00"
    );
    var end = new Date(
      sunday.getFullYear() +
        "/" +
        (sunday.getMonth() + 1) +
        "/" +
        sunday.getDate() +
        " 23:59:59"
    );
    // var start = Vue.moment().isoWeekday(this.firstDayOfWeekCfg).startOf("isoweek")._d;
    // var end = Vue.moment().isoWeekday(this.firstDayOfWeekCfg).endOf("isoweek")._d;

    this.PlanStartDate = [start, end];
    // this.form['PlanStartDate'] = []
    var params = this.$Lodash.cloneDeep(this.$singleRequest);
    params.R1_RequestTemplate = "Setting.SearchBase";
    params.R1_ParentCode = "xSetting.Default.SettingProject";
    this.$Utils.post(params).then(data => {
      this.Setting = this.$Utils.getDataWithRoot(
        data.R1,
        "Data.DynamicDS.Setting"
      );
      this.Setting.forEach(val => {
        if (val.Name == "Report") {
          this.reportUrl = val.Value;
        }
        if (val.Name == "Filter") this.filterCode = val.Value;
      });
      this.getFilter();
      this.searchProject();
      this.searchReport();
    });
  }
};
</script>
<style lang="scss">
.project-report {
  .project-slide {
    .card {
      .card-header {
      }
    }
  }

  .card {
    .card-header {
      padding: 7px;
      font-weight: 700;
      background-color: #c2dfff;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .card-body {
      padding: 5px;
    }

    .card-footer {
      border: none;
      background-color: #fff;
      div {
        font-size: 11px;
        white-space: nowrap;
        span {
          padding-left: 10px;
        }
      }
    }
  }

  .el-collapse-item__content {
    padding-bottom: 0px !important;
  }

  .text-muted {
    color: #c2cfd6 !important;
  }

  .card-header {
    text-align: center;
  }

  .btn-collapse {
    text-align: end;
    button {
      background-color: #fff;
    }
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .slick-next:before {
    content: "→";
  }

  .slick-prev:before {
    content: "←";
  }

  .slick-prev {
    left: -25px;
  }

  .slick-next {
    right: -25px;
  }

  .slick-slide {
    padding-left: 5px;
  }

  .slick-prev:before,
  .slick-next:before {
    font-family: "slick";
    font-size: 20px;
    line-height: 1;
    opacity: 0.75;
    color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .slick-prev,
  .slick-next {
    font-size: 0;
    line-height: 0;
    position: absolute;
    top: 50%;
    display: block;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    padding: 0;
    cursor: pointer;
    color: transparent;
    border: none;
    outline: none;
    background: transparent;
  }

  .slick-slider {
    .slick-list {
      .slick-track {
        min-width: 100%;
      }
    }
  }

  .report {
    .chart {
      .card {
        .card-body {
        }
      }
    }
  }

  .title-box {
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
  }
  .RangeFilter {
  .el-date-editor {
    max-width: 100%;
  }
  }
}
</style>
