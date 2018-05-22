<template>
  <div class="dailyReport">
    <el-row :gutter="20">
      <el-main>
        <el-tabs v-model="activeName" @tab-click="searchTask()">
          <el-tab-pane label="Theo nhân sự" name="worker">
            <el-container>
              <el-header>
                <el-row>
                  <el-col :xs="19" :md="12" class="leftaligndiv">
                    <i class="el-icon-date"></i>
                    <span>
                      <b>{{userName}}: Báo cáo ngày {{ dateText }}</b>
                    </span>
                  </el-col>
                  <el-col :xs="5" :md="12" class="rightaligndiv">
                    <el-button @click="onExportData('Individual')" v-if="!$isMobileDevice">
                      <span class="hidden-sm-and-down">Xuất báo cáo</span>
                      <i class="hidden-md-and-up fa fa-file-excel-o"></i>
                    </el-button>
                    <el-button @click="sendReport('Individual')">
                      <span class="hidden-sm-and-down">Gửi báo cáo</span>
                      <i class="hidden-md-and-up fa fa-send-o"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <el-container direction="vertical">
                  <el-row><span><b> Danh sách công việc đã lập KẾ HOẠCH {{this.dateText}}</b></span></el-row>
                  <el-row>
                    <DailyTable :id="'listTaskDone'" :tblData="listTaskDone" />
                  </el-row>
                  <el-row><span><b> Các công việc PHÁT SINH {{this.dateText}}</b></span></el-row>
                  <el-row>
                    <DailyTable :id="'listTaskUnpredicted'" :tblData="listTaskUnpredicted" />
                     
                  </el-row>
                  <el-row><span><b> Các công việc đã HOÀN THÀNH {{this.dateText}}</b></span></el-row>
                  <el-row>
                      <DailyTable :id="'listTaskNotDone'" :tblData="listTaskNotDone" />
                     
                  </el-row>
                </el-container>
                <hr/>
                <el-container direction="vertical">
                  <el-row><span><b>Các công việc KẾ HOẠCH {{this.nextdateText}}</b></span></el-row>
                  <el-row>
                    <DailyTable :id="'listTaskNextDay'" :tblData="listTaskNextDay" />
                    
                  </el-row>
                </el-container>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="Theo phòng ban" name="project">
            <el-container>
              <el-header>
                <el-row>
                  <el-col :xs="14" :md="12" class="leftaligndiv">
                    <i class="el-icon-date"></i>
                    <span style="font-size: 14px;">
                   <b>{{prName}} ngày {{ dateText }}</b>
                 </span>
                  </el-col>
                  <el-col :xs="10" :md="12" class="rightaligndiv">
                    <el-select v-model="selectedProject" clearable placeholder="Phong Ban"
                               @change="changeProject(selectedProject)">
                      <el-option v-for="item in dataPr" :key="item.GroupId" :label="item.GroupName"
                                 :value="item.GroupId">
                      </el-option>
                    </el-select>
                    <el-button @click="onExportData('Project')" v-if="!$isMobileDevice">
                      <span class="hidden-sm-and-down">Xuất báo cáo</span>
                      <i class="hidden-md-and-up fa fa-file-excel-o"></i>
                    </el-button>
                    <el-button @click="sendReport('Project')">
                      <span class="hidden-sm-and-down">Gửi báo cáo</span>
                      <i class="hidden-md-and-up fa fa-send-o"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <el-container style="border: 1px solid black; padding: 10px;" direction="vertical">
                  <el-row><span><b> Danh sách công việc đã lập KẾ HOẠCH {{ this.dateText }}</b></span></el-row>
                  <el-row>
                     <DailyTable :id="'listTaskDone'" :tblData="ProjectlistTaskDone" />
                     
                  </el-row>
                  <el-row><span><b> Các công việc PHÁT SINH {{ this.dateText }}</b></span></el-row>
                  <el-row>
                    <DailyTable :id="'listTaskUnpredicted'" :tblData="ProjectlistTaskUnpredicted" />
                    
                  </el-row>
                  <el-row><span><b> Các công việc đã HOÀN THÀNH {{ this.dateText }}</b></span></el-row>
                  <el-row>
                     <DailyTable :id="'listTaskNotDone'" :tblData="ProjectlistTaskNotDone" />
                     
                  </el-row>
                </el-container>
                <el-container style="border: 1px solid black; padding: 10px; margin-top: 10px" direction="vertical">
                  <el-row><span><b>Các công việc KẾ HOẠCH {{ this.nextdateText }}</b></span></el-row>
                  <el-row>
                    <DailyTable :id="'listTaskNextDay'" :tblData="ProjectlistTaskNextDay" />
                    
                  </el-row>
                </el-container>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="Theo tiến độ" name="progress">
            <el-container>
              <el-header>
                <el-row>
                  <el-col :xs="14" :md="12" class="leftaligndiv">
                    <i class="el-icon-date"></i>
                    <span style="font-size: 14px;">
                   <b>Tiến độ công việc Ngày {{ dateText }}</b>
                 </span>
                  </el-col>
                  <el-col :xs="10" :md="12" class="rightaligndiv">
                    <el-select v-model="selectedProject" clearable placeholder="Phòng Ban"
                               @change="changeProject(selectedProject)">
                      <el-option v-for="item in dataPr" :key="item.GroupId" :label="item.GroupName"
                                 :value="item.GroupId">
                      </el-option>
                    </el-select>
                    <el-button @click="onExportData('Progress')" v-if="!$isMobileDevice">
                      <span class="hidden-sm-and-down">Xuất báo cáo</span>
                      <i class="hidden-md-and-up fa fa-file-excel-o"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <el-container direction="vertical">
                  <el-row v-for="item in ListUserProgress" :key="item.Id" style="width: 100%;">
                    <el-col :xs="4" :md="2" class="parentTable">
                      <img :src="item.Avatar" class="round-image" />
                    </el-col>
                    <el-col :xs="8" :md="4" class="parentTable">
                      <div class="cellTable">
                        {{item.name}}:
                      </div>
                    </el-col>
                    <el-col :xs="2" :md="1" class="rightaligndiv parentTable">
                      <div class="cellTable">
                        {{item.success}}/{{item.total}}
                      </div>
                    </el-col>
                    <el-col :xs="10" :md="14" class="parentTable">
                      <el-progress :text-inside="true" status="success" class="cellTable"
                                   :percentage="parseFloat(item.total)!== 0 ? Math.round((item.success*100)/item.total) : 0"/>
                    </el-col>
                  </el-row>
                </el-container>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="Tạo báo cáo" name="createReport">
            <el-container>
              <el-header>
                <el-row>
                  <el-col :xs="19" :md="12" class="leftaligndiv">
                    <i class="el-icon-date"></i>
                    <span style="font-size: 14px;">
                   <b>Tạo Báo Cáo</b>
                 </span>
                  </el-col>
                  <el-col :xs="5" :md="12" class="rightaligndiv">
                    <el-button @click="sendReport('Create')">
                      <span class="hidden-sm-and-down">Gửi báo cáo</span>
                      <i class="hidden-md-and-up fa fa-send-o"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <el-row>
                  <el-col :xs="24" :md="12">
                    <el-row><span><b><u>Danh sách công việc</u></b></span></el-row>
                    <el-row style="width: 100%;">
                      <el-table
                        ref="multipleTable"
                        border
                        :data="listTaskToBuild"
                        :max-height="tableHeight" empty-text="Không có dữ liệu"
                        style="width: 100%;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column
                          prop="Index"
                          label="Mã"
                          width="65">
                        </el-table-column>
                        <el-table-column
                          prop="Name"
                          label="Tên công việc"
                          min-width="200">
                        </el-table-column>
                        <el-table-column
                          prop="PlanManHour"
                          label="Ước tính">
                        </el-table-column>
                        <el-table-column
                          label="Ngày thực hiện">
                          <template slot-scope="scope">
                            <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.PlanStartDate, 'DD/MM/YYYY HH:mm')}} </span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-row>
                  </el-col>
                  <el-col :xs="24" :md="12">
                    <el-row style="width: 100%; padding: 10px">
                      <el-col :span="24">
                        <el-collapse v-model="activeCollapse">
                          <el-row>
                            <el-col :span="1" class="toggleButton">
                              <el-button type="primary" icon="fa fa-chevron-right" @click="toggleSelection('done')"/>
                            </el-col>
                            <el-col :span="23">
                              <el-collapse-item name="1">
                                <template slot="title">
                                  <span><b>Công việc hoàn thành</b></span>
                                </template>
                                <el-table
                                  ref="doneTable"
                                  border
                                  :max-height="tableHeight"
                                  :data="listTaskDoneToSent" empty-text="Không có dữ liệu"
                                  style="width: 100%; "
                                  height="250">
                                  <el-table-column
                                    prop="Index"
                                    label="Mã"
                                    width="65">
                                  </el-table-column>
                                  <el-table-column
                                    prop="Name"
                                    label="Tên công việc"
                                    min-width="200">
                                  </el-table-column>
                                  <el-table-column
                                    prop="PlanManHour"
                                    label="Ước tính">
                                  </el-table-column>
                                  <el-table-column
                                    fixed="right"
                                    label="Thao tác"
                                    width="120">
                                    <template slot-scope="scope">
                                      <el-button
                                        @click.native.prevent="deleteRow(scope.row, listTaskDoneToSent)"
                                        type="text"
                                        size="small">
                                        Remove
                                      </el-button>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </el-collapse-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="1" class="toggleButton">
                              <el-button type="primary" icon="fa fa-chevron-right" @click="toggleSelection('unpredicted')"/>
                            </el-col>
                            <el-col :span="23">
                              <el-collapse-item name="2">
                                <template slot="title">
                                  <span><b>Công việc phát sinh</b></span>
                                </template>
                                <el-table
                                  ref="unpredictedTable"
                                  border
                                  :max-height="tableHeight"
                                  :data="listTaskUnpredictedToSent" empty-text="Không có dữ liệu"
                                  style="width: 100%; "
                                  height="250">
                                  <el-table-column label="">
                                    <el-table-column
                                      prop="Index"
                                      label="Mã"
                                      width="65">
                                    </el-table-column>
                                    <el-table-column
                                      prop="Name"
                                      label="Tên công việc"
                                      min-width="200">
                                    </el-table-column>
                                    <el-table-column
                                      prop="PlanManHour"
                                      label="Ước tính">
                                    </el-table-column>
                                    <el-table-column
                                      fixed="right"
                                      label="Thao tác"
                                      width="120">
                                      <template slot-scope="scope">
                                        <el-button
                                          @click.native.prevent="deleteRow(scope.row, listTaskUnpredictedToSent)"
                                          type="text"
                                          size="small">
                                          Remove
                                        </el-button>
                                      </template>
                                    </el-table-column>
                                  </el-table-column>
                                </el-table>
                              </el-collapse-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="1" class="toggleButton">
                              <el-button type="primary" icon="fa fa-chevron-right" @click="toggleSelection('notdone')"/>
                            </el-col>
                            <el-col :span="23">
                              <el-collapse-item name="3">
                                <template slot="title">
                                  <span><b>Công việc chưa hoàn thành</b></span>
                                </template>
                                <el-table
                                  ref="notdoneTable"
                                  border
                                  :max-height="tableHeight"
                                  :data="listTaskNotDoneToSent" empty-text="Không có dữ liệu"
                                  style="width: 100%; "
                                  height="250">
                                  <el-table-column
                                    prop="Index"
                                    label="Mã"
                                    width="65">
                                  </el-table-column>
                                  <el-table-column
                                    prop="Name"
                                    label="Tên công việc"
                                    min-width="200">
                                  </el-table-column>
                                  <el-table-column
                                    prop="PlanManHour"
                                    label="Ước tính">
                                  </el-table-column>
                                  <el-table-column
                                    fixed="right"
                                    label="Thao tác"
                                    width="120">
                                    <template slot-scope="scope">
                                      <el-button
                                        @click.native.prevent="deleteRow(scope.row, listTaskNotDoneToSent)"
                                        type="text"
                                        size="small">
                                        Remove
                                      </el-button>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </el-collapse-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="1" class="toggleButton">
                              <el-button type="primary" icon="fa fa-chevron-right" @click="toggleSelection('nextday')"/>
                            </el-col>
                            <el-col :span="23">
                              <el-collapse-item name="4">
                                <template slot="title">
                                  <span><b>Công việc ngày tiếp theo</b></span>
                                </template>
                                <el-table
                                  ref="nextdayTable"
                                  border
                                  :max-height="tableHeight"
                                  :data="listTaskNextDayToSent" empty-text="Không có dữ liệu"
                                  style="width: 100%; "
                                  height="250">
                                  <el-table-column
                                    prop="Index"
                                    label="Mã"
                                    width="65">
                                  </el-table-column>
                                  <el-table-column prop="Name" label="Tên công việc" min-width="200">
                                  </el-table-column>
                                  <el-table-column
                                    prop="PlanManHour"
                                    label="Ước tính">
                                  </el-table-column>
                                  <el-table-column
                                    fixed="right"
                                    label="Thao tác"
                                    width="120">
                                    <template slot-scope="scope">
                                      <el-button
                                        @click.native.prevent="deleteRow(scope.row, listTaskNextDayToSent)"
                                        type="text"
                                        size="small">
                                        Remove
                                      </el-button>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </el-collapse-item>
                            </el-col>
                          </el-row>
                        </el-collapse>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="Quản lý báo cáo" name="manageReport">
            <el-container>
              <el-header>
                <el-row>
                  <el-col :span="24" class="leftaligndiv">
                    <i class="el-icon-date"></i>
                    <span style="font-size: 14px;">
                   <b>Danh sách báo cáo</b>
                 </span>
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <el-container direction="vertical">
                  <el-row><span><b>Danh sách báo cáo đã gửi</b></span></el-row>
                  <el-row>
                    <el-table
                      border
                      :data="listReportSent"
                      style="width: 100%; " empty-text="Không có dữ liệu"
                      height="250">
                      <el-table-column type="index" width="50">
                      </el-table-column>
                      <el-table-column prop="Subject" label="Tiêu đề" width="180">
                      </el-table-column>
                      <el-table-column prop="To" label="Tới">
                      </el-table-column>
                      <el-table-column prop="Cc" label="Cc">
                      </el-table-column>
                      <el-table-column prop="SenderName" label="Người gửi">
                      </el-table-column>
                      <el-table-column label="Ngày gửi">
                        <template slot-scope="scope">
                          <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.Date, 'DD/MM/YYYY HH:mm')}} </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                  <el-row><span><b>Danh sách báo cáo đã nhận</b></span></el-row>
                  <el-row>
                    <el-table
                      border
                      :data="listReportReceived"
                      style="width: 100%; " empty-text="Không có dữ liệu"
                      height="250">
                      <el-table-column
                        type="index"
                        width="50">
                      </el-table-column>
                      <el-table-column
                        prop="Subject"
                        label="Tiêu đề"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="To"
                        label="Tới">
                      </el-table-column>
                      <el-table-column
                        prop="Cc"
                        label="Cc">
                      </el-table-column>
                      <el-table-column
                        prop="SenderName"
                        label="Người gửi">
                      </el-table-column>
                      <el-table-column
                        prop="Date"
                        label="Ngày gửi">
                      </el-table-column>
                    </el-table>
                  </el-row>
                </el-container>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import SendReport from "@/components/static/SendReport";
import DailyTable from "@/components/DailyTable";
Vue.use(require("vue-moment"));
const taskRequestFelds = 'Id;Index;Name;StatusName;Status;PlanManHour;RemainingManHour;PlanStartDate;Deadline;PriorityId;PriorityIdName;TypeName;TotalDownload;TotalComment;WorkerName'
const resoled = '532e9f1e-f5dc-4e75-b7c9-2bd785bbda67';
const closed = '53cc3819-c019-4749-b0e4-52213438049b';
export default {
  provide() {
    return {
      statusColors: this.statusColors,
      priorityColors: this.priorityColors,
      taskDone: [resoled, closed]
    };
  },
  components: { Vue, SendReport, DailyTable },
  data() {
    var selectedDate = this.$Utils.formatDateTime(new Date(), "DD/MM/YYYY");

    return {
      statusColors: {},
      priorityColors: {},
      activeCollapse: ["1", "2", "3", "4"],
      base: this.$appUri.BaseURL === "/" ? "" : this.$appUri.BaseURL,
      activeName: "worker",
      worker: [],
      listTask: [],
      listProgress: [],
      selectedDate,
      multipleSelection: [],
      listTaskToBuild: [],
      listTaskDone: [],
      ProjectlistTaskDone: [],
      listTaskNotDone: [],
      ProjectlistTaskNotDone: [],
      listTaskUnpredicted: [],
      ProjectlistTaskUnpredicted: [],
      listTaskNextDay: [],
      ProjectlistTaskNextDay: [],
      listReportSent: [],
      listReportReceived: [],
      loggedOnUser: JSON.parse(localStorage.getItem("LoggedOnUser")),
      listTaskDoneToSent: [],
      listTaskUnpredictedToSent: [],
      listTaskNotDoneToSent: [],
      listTaskNextDayToSent: [],
      dataListUser: [],
      dataLU: [],
      ListUserProgress: [],
      dataPr: [],
      viewModel: [],
      reload: true,
      lastUserSearchRequest: {},
      lastGroupSearchRequest: {},
      selectedUser: "",
      DatePicker: new Date(),
      start: "",
      end: "",
      nextStart: "",
      nextEnd: "",
      FieldsData: [],
      selectedProject: "",
      prName: "",
      isSystemAdmin: this.$isSystemAdmin(),
      isMantisAdmin: this.$isMantisAdmin(),
      searchType: "Day",
      tableHeader: {
        Index: "Mã",
        Name: "Tên công việc",
        StatusName: "Trạng thái",
        PlanManHour: "Ước tính",
        RemainingManHour: "Thực tế",
        PlanStartDate: "Ngày thực hiện",
        Deadline: "Ngày kết thúc",
        PriorityIdName: "Ưu tiên",
        TypeName: "Tính chất"
      },
      selectedTab: "",
      datetimeFormat: "DD/MM/YYYY",
      requestDatetimeFormat: "YYYY-MM-DDTHH:mm:ss",
      dateText: "TUẦN NÀY",
      nextdateText: "TUẦN SAU",
      viewModelGroup: [],
      userName: "",
      dayStart: "",
      dayEnd: "",
      selectedNextDate: "",
      tableHeight: window.innerHeight * 7 / 10
    };
  },
  computed: {
    // ListUserProgress: function(){
    //   return this.ListUserProgress.filter(element =>{
    //     if(this.isSystemAdmin) return element
    //     else if(element.Username != 'Superadmin') {
    //       return element
    //     }
    //   })
    // }
  },
  methods: {
    loadSetting() {
      var statusRequest = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        // category
        R1_RequestTemplate: "Setting.SearchBase",
        R1_ParentCode: "xSystem.Setting.xTask.Status"
      };
      this.$Utils.post(statusRequest).then(dt => {
        var listStatus = this.$Utils.getDataWithRoot(
          dt.R1,
          "Data.DynamicDS.Setting"
        );
        listStatus.map(element => {
          // console.log(element)
          this.statusColors[element.Id.toUpperCase()] = element.Color;
        });
      });
      var priorityRequest = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "xEdu.TaskPriority",
        R1_Code: "TaskPriority"
      };
      this.$Utils.post(priorityRequest).then(dt => {
        var listStatus = this.$Utils.getDataWithRoot(
          dt.R1,
          "Data.DocumentDS.Document"
        );
        listStatus.map(element => {
          this.priorityColors[element.Id.toUpperCase()] = element.Lead;
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleSelection(type) {
      switch (type) {
        case "done":
          this.multipleSelection.forEach(item => {
            this.listTaskDoneToSent.push(item);
            this.listTaskToBuild.splice(item, 1);
          });
          break;
        case "unpredicted":
          this.multipleSelection.forEach(item => {
            this.listTaskUnpredictedToSent.push(item);
            this.listTaskToBuild.splice(item, 1);
          });
          break;
        case "notdone":
          this.multipleSelection.forEach(item => {
            this.listTaskNotDoneToSent.push(item);
            this.listTaskToBuild.splice(item, 1);
          });
          break;
        case "nextday":
          this.multipleSelection.forEach(item => {
            this.listTaskNextDayToSent.push(item);
            this.listTaskToBuild.splice(item, 1);
          });
          break;
      }
    },
    deleteRow(data, rows) {
      rows.splice(data, 1);
      this.listTaskToBuild.push(data);
    },
    // sendReport() {
    //   this.$hub.$emit(
    //     "set-modal-data",
    //     "Gửi báo cáo",
    //     "50%",
    //     true,
    //     "center",
    //     SendReport,
    //     false,
    //     '',
    //   );
    //   this.$hub.$emit("open-modal");
    // },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Sum";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    getReport() {
      var strId = this.loggedOnUser["UserId"];
      var request = {
        RequestAction: "SearchUser",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        ConditionFields: "IncludedGroupManager;Group;Status;LoginName",
        StaticFields: "UserId;Status;LoginName;Username",
        DynamicFields: "Email;",
        Status: "1",
        UserId: strId
      };
      this.$Utils.post(request).then(user => {
        var userData = this.$Utils.getDataWithRoot(user, "UserDS.User");
        var strEmail = userData[0].Email;
        var requestReceiver = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 2,
          R1_RequestTemplate: "SendMessage.Search",
          R1_Code: "DailyReport",
          R1_To: strEmail,
          R1_RequestOrderFields: "Created DESC",
          R2_RequestTemplate: "SendMessage.Search",
          R2_Code: "DailyReport",
          R2_Sender: strId,
          R2_RequestOrderFields: "Created DESC"
        };

        this.$Utils.post(requestReceiver).then(data => {
          this.listReportSent = this.$Utils.getDataWithRoot(
            data.R2,
            "Data.ConversationDS.Message"
          );
          this.listReportReceived = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.ConversationDS.Message"
          );
        });
      });
    },
    searchUserProgress() {
      let ctrl = this;
      if (!this.isMantisAdmin && !this.isSystemAdmin) {
        if (this.dataLU) {
          this.dataLU = this.dataLU.filter(el => {
            return el.UserId == localStorage.getItem("UserId");
          });
        }
      }

      this.dataLU.forEach((value, key) => {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 2;
        request.RequestClass = "xBase";
        request.RequestAction = "Request";
        request.R1_RequestTemplate = "AG_Task_Task.Count";
        request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R1_Status =
          "53cc3819-c019-4749-b0e4-52213438049b;532e9f1e-f5dc-4e75-b7c9-2bd785bbda67";
        request.R1_PlanStartDateStartValue = this.start;
        request.R1_PlanStartDateEndValue = this.end;
        request.R1_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R1_Project = this.loggedOnUser.Project.GroupId;
        if (value) {
          request.R1_Worker = value.UserId;
          request.R2_Worker = value.UserId;
        }
        request.R2_RequestTemplate = "AG_Task_Task.Count";
        request.R2_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R2_PlanStartDateStartValue = this.start;
        request.R2_PlanStartDateEndValue = this.end;
        request.R2_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R2_Project = this.loggedOnUser.Project.GroupId;
        this.ListUserProgress = [];
        this.$Utils.postCheckResult(request).then(data => {
          var totalSuccess = this.$Utils.getDataWithRoot(data, "R1.Data");
          var totalTask = this.$Utils.getDataWithRoot(data, "R2.Data");
          //console.log( ctrl.$isSystemAdmin())
          if(ctrl.$isSystemAdmin() || (!ctrl.$isSystemAdmin() && value.LoginName.toLowerCase() != 'superadmin'))
          this.ListUserProgress.push({
            name: value.Username,
            success: totalSuccess[0],
            total: totalTask[0],
            Avatar: this.loadAvatar(value.Avatar)
          });
        });
      });
    },
    loadAvatar(avatar) {
      if (avatar == undefined) avatar = "assets/images/avatars/profile.png";
      avatar = avatar.replace("profile.jpg", "profile.png");
      var strAvatar =
        avatar === "assets/images/avatars/profile.png"
          ? this.$appUri.BaseURL + avatar
          : this.$appUri.BaseURL +
            avatar.replace("/", "") +
            "&Height=50&Width=50";
      return strAvatar;
    },
    searchUserInGroup() {
      var requestGroup = this.$Lodash.cloneDeep(this.$singleRequest);
      requestGroup.RequestAction = "SearchUserGroup";
      requestGroup.RequestClass = "BPM";
      requestGroup.StaticFields = "UserId";
      if (this.loggedOnUser.Project.GroupId) {
        requestGroup.GroupId = this.loggedOnUser.Project.GroupId;
      } else {
        requestGroup.GroupId = "No Data";
      }
      this.$Utils.post(requestGroup).then(dataU => {
        this.dataListUser = this.$Utils.getDataWithRoot(
          dataU,
          "UserDS.UserGroup"
        );
        var requestListUser = this.$Lodash.cloneDeep(this.$singleRequest);
        requestListUser.RequestClass = "BPM";
        requestListUser.RequestAction = "SearchUsers";
        requestListUser.StaticFields = "UserId;Username;LoginName";
        requestListUser.ConditionFields = "Status";
        requestListUser.DynamicFields = "Avatar";
        requestListUser.IncludedGroup = true;
        requestListUser.Status = 1;
        if (this.dataListUser.length > 0) {
          this.dataListUser.forEach((value, key) => {
            if (value) {
              requestListUser.UserId += ";" + value.UserId;
            }
          });
        } else {
          requestListUser.UserId = "No data";
        }
        this.$Utils.post(requestListUser).then(dataLU => {
          this.dataLU = this.$Utils.getDataWithRoot(dataLU, "Data.UserDS.User");
          if (this.$isSystemAdmin())
            this.dataLU = this.dataLU.filter(el => {
              return el.Groups.indexOf(this.$administrator) === -1;
            });
        });
      });
    },
    searchGroupOfUser() {
      var request = {
        RequestAction: "SearchUserWithGroups",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        ConditionFields: "IncludedGroupManager;Group;Status;LoginName;UserId",
        StaticFields: "UserId;Username;LoginName;Description;Status;",
        DynamicFields:
          "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
        StructFields:
          "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification",
        OrderFields: "LoginName ASC",
        GroupType: "1",
        Status: 1,
        UserId: this.loggedOnUser.UserId
      };
      this.$Utils.post(request).then(data => {
        this.ListGroup = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
        var requestD = {
          RequestClass: "BPM",
          RequestAction: "SearchGroup",
          ConditionFields: "GroupType,Description",
          StaticFields:
            "GroupId;GroupName;Description;GroupParent;Status;GroupPath",
          StructFields: "ParentName",
          orderFields: "GroupName ASC",
          RequestDataType: "json",
          GroupId: this.ListGroup[0].Groups,
          GroupType: 1
        };
        this.$Utils.post(requestD).then(dataD => {
          this.dataPr = this.$Utils.getDataWithRoot(dataD, "UserDS.Group");
          this.dataPr.forEach(project => {
            if (project.GroupId === this.loggedOnUser.Project.GroupId) {
              this.prName = project.GroupName;
              this.selectedProject = project.GroupId;
            }
          });
        });
      });
    },
    getAllFieldData() {
      var Id = "4922c65f-4cf4-4e12-8529-40282ce794dc";
      var listRequestName = "DataGroup.danh-sach-cong-viec.04b66";
      this.viewModel.selectedTab = 0;
      var arrModuleTypes = ["Form", "List", "Filter"];
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_Id = Id;

      arrModuleTypes.forEach(type => {
        request.TotalRequests++;
        request["R" + request.TotalRequests + "_RequestTemplate"] =
          "SettingNew.SearchSetting";
        request["R" + request.TotalRequests + "_ParentCode"] =
          "xSetting.Project." + type;
        request["R" + request.TotalRequests + "_Level"] = "4";
        request["R" + request.TotalRequests + "_Name"] = listRequestName;
      });

      this.$Utils.post(request).then(data => {
        var currentDataGroup = this.$Utils.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        )[0];
        if (currentDataGroup.Description !== undefined) {
          currentDataGroup.Description = JSON.parse(
            currentDataGroup.Description
          );
          if (this.viewModel.DataSource) {
            this.viewModel.DataSource.forEach(source => {
              if (source.Name === currentDataGroup.Description.DataSource)
                currentDataGroup.Description.DataSource = source;
            });
          }
          currentDataGroup.Description.Fields = "";
          for (var i = 1; i <= currentDataGroup.Description.FCount; i++) {
            if (currentDataGroup["F" + i] !== undefined) {
              currentDataGroup.Description.Fields += currentDataGroup["F" + i];
              delete currentDataGroup["F" + i];
            }
          }
          currentDataGroup.Description.Fields =
            currentDataGroup.Description.Fields !== ""
              ? JSON.parse(currentDataGroup.Description.Fields)
              : [];
          this.FieldsData = currentDataGroup.Description.Fields;
        }
      });
    },
    searchTask() {
      var type = "";
      switch (this.activeName) {
        case "worker":
          type = "Individual";
          break;
        case "project":
          this.reload = false;
          type = "Project";
          break;
        case "progress":
          type = "Progress";
          break;
        case "createReport":
          type = "Individual";
          break;
        case "manageReport":
          type = "Individual";
          break;
      }
      if (type === "Individual" || type === "Project") {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 4;
        request.RequestClass = "xBase";
        request.RequestAction = "Request";

        if (type == "Individual") {
          if (this.selectedUser !== "") {
            request.R1_Worker = this.selectedUser;
            request.R2_Worker = this.selectedUser;
            request.R3_Worker = this.selectedUser;
            request.R4_Worker = this.selectedUser;
          } else if (!this.isSystemAdmin && !this.isMantisAdmin) {
            request.R1_Worker = localStorage.getItem("UserId");
            request.R2_Worker = localStorage.getItem("UserId");
            request.R3_Worker = localStorage.getItem("UserId");
            request.R4_Worker = localStorage.getItem("UserId");
          }
        } else if (type == "Project") {
          if (this.selectedProject && this.selectedProject !== "") {
            request.R1_Project = this.selectedProject;
            request.R2_Project = this.selectedProject;
            request.R3_Project = this.selectedProject;
            request.R4_Project = this.selectedProject;
          } else if (!this.isSystemAdmin && !this.isMantisAdmin) {
            request.R1_Project = this.loggedOnUser.Project.GroupId;
            request.R2_Project = this.loggedOnUser.Project.GroupId;
            request.R3_Project = this.loggedOnUser.Project.GroupId;
            request.R4_Project = this.loggedOnUser.Project.GroupId;
          }
        }

        request.R1_RequestTemplate = "AG_Task_Task.Search";
        request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R1_RequestFields = taskRequestFelds;
        request.R1_PlanStartDateStartValue = this.start;
        request.R1_PlanStartDateEndValue = this.end;
        request.R1_UserField = "Worker";
        request.R1_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R1_Type = "d6fe5391-72aa-4401-b80b-b5515fa9eda0";
        request.R1_RequestOrderFields = "PlanStartDate ASC";

        request.R2_RequestTemplate = "AG_Task_Task.Search";
        request.R2_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R2_RequestFields = taskRequestFelds;
        request.R2_PlanStartDateStartValue = this.start;
        request.R2_PlanStartDateEndValue = this.end;
        request.R2_UserField = "Worker";
        request.R2_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R2_Type = "fc75703e-dd59-44cc-be3b-b0d09c43fe81";
        request.R2_RequestOrderFields = "PlanStartDate ASC";

        request.R3_RequestTemplate = "AG_Task_Task.Search";
        request.R3_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R3_RequestFields = taskRequestFelds;
        request.R3_PlanStartDateStartValue = this.start;
        request.R3_PlanStartDateEndValue = this.end;
        request.R3_UserField = "Worker";
        request.R3_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R3_Status =
          "53cc3819-c019-4749-b0e4-52213438049b;532e9f1e-f5dc-4e75-b7c9-2bd785bbda67;";
        request.R3_RequestOrderFields = "PlanStartDate ASC";

        request.R4_RequestTemplate = "AG_Task_Task.Search";
        request.R4_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R4_RequestFields = taskRequestFelds;
        request.R4_PlanStartDateStartValue = this.nextStart;
        request.R4_PlanStartDateEndValue = this.nextEnd;
        request.R4_UserField = "Worker";
        request.R4_AssignedUser = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        request.R4_RequestOrderFields = "PlanStartDate ASC";

        if (type === "Individual") {
          this.lastUserSearchRequest = request;
        } else {
          this.lastGroupSearchRequest = request;
        }

        this.$Utils.postCheckResult(request).then(data => {
          if (type === "Individual") {
            this.viewModel = [
              {
                Title: "Danh sách công việc đã lập KẾ HOẠCH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R1.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc PHÁT SINH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R2.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc đã HOÀN THÀNH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R3.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc KẾ HOẠCH tiếp theo ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R4.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              }
            ];
            this.listTaskDone = this.$Utils.getDataWithRoot(
              data,
              "R1.Data.TasksDS.Task"
            );
            this.listTaskUnpredicted = this.$Utils.getDataWithRoot(
              data,
              "R2.Data.TasksDS.Task"
            );
            this.listTaskNotDone = this.$Utils.getDataWithRoot(
              data,
              "R3.Data.TasksDS.Task"
            );
            this.listTaskNextDay = this.$Utils.getDataWithRoot(
              data,
              "R4.Data.TasksDS.Task"
            );
            this.listTaskToBuild = [];
            this.viewModel.forEach(value => {
              if (value.dataSource.length > 0) {
                value.dataSource.forEach(values => {
                  var idx = JSON.stringify(this.listTaskToBuild).indexOf(
                    values.Id
                  );
                  if (idx == -1) {
                    this.listTaskToBuild.push(values);
                  }
                });
              }
            });
            this.$nextTick();
          } else {
            this.viewModelGroup = [
              {
                Title: "Danh sách công việc đã lập KẾ HOẠCH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R1.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc PHÁT SINH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R2.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc đã HOÀN THÀNH ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R3.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              },
              {
                Title: "Các công việc KẾ HOẠCH tiếp theo ",
                dataSource: this.$Utils.getDataWithRoot(
                  data,
                  "R4.Data.TasksDS.Task"
                ),
                TotalPlan: 0,
                TotalActual: 0,
                sum: function(item) {
                  this.TotalPlan =
                    this.TotalPlan + parseFloat(item.PlanManHour);
                  this.TotalActual =
                    this.TotalActual + parseFloat(item.RemainingManHour);
                }
              }
            ];
            this.ProjectlistTaskDone = this.$Utils.getDataWithRoot(
              data,
              "R1.Data.TasksDS.Task"
            );
            this.ProjectlistTaskUnpredicted = this.$Utils.getDataWithRoot(
              data,
              "R2.Data.TasksDS.Task"
            );
            this.ProjectlistTaskNotDone = this.$Utils.getDataWithRoot(
              data,
              "R3.Data.TasksDS.Task"
            );
            this.ProjectlistTaskNextDay = this.$Utils.getDataWithRoot(
              data,
              "R4.Data.TasksDS.Task"
            );
          }
        });
      } else {
        if (type === "Progress") {
          this.searchUserProgress();
        }
      }
    },
    changeProject(item) {
      this.selectedProject = item;
      this.dataPr.forEach(data => {
        if (data.GroupId === this.selectedProject) {
          this.prName = data.GroupName;
        }
      });
      this.searchTask();
    },
    saveAs(blob, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
        // For IE:
        navigator.msSaveBlob(blob, fileName);
      } else {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    },
    onExportData(type) {
      var j = 1;
      var tableTitle = [];
      var rqField = "";

      //Xác định tên cho từng bảng
      if (type === "Individual" || type === "Project") {
        for (var i = 0; i < this.viewModel.length; i++) {
          if (this.searchType === "Day") {
            if (i < 3) {
              tableTitle.push(this.viewModel[i]["Title"] + this.dateText);
            } else {
              tableTitle.push(this.viewModel[i]["Title"] + this.nextdateText);
            }
          } else {
            if (i < 3) {
              tableTitle.push(this.viewModel[i]["Title"] + this.dateText);
            } else {
              tableTitle.push(this.viewModel[i]["Title"] + this.nextdateText);
            }
          }
        }
      } else if (type === "Progress") {
        for (var i = 0; i < this.dataLU.length; i++) {
          tableTitle.push(this.dataLU[i].Username);
        }
      }

      //Xác định tên trường dữ liệu lấy ra (mặc định)
      $.each(this.tableHeader, (key, value) => {
        rqField += key + ";";
      });

      //Khởi tạo request cơ bản
      var request = this.$Lodash.cloneDeep(this.$singleRequest);

      switch (type) {
        case "Individual":
          request = this.lastUserSearchRequest;
          request.RequestClass = "xBase";
          request.RequestAction = "ExcelRequest";
          request.RequestHeader = JSON.stringify(this.tableHeader);
          request.TableName = JSON.stringify(tableTitle);
          request.ExportType = type;

          request.R1_RequestFields = rqField;
          request.R2_RequestFields = rqField;
          request.R3_RequestFields = rqField;
          request.R4_RequestFields = rqField;

          break;
        case "Project":
          request = this.lastGroupSearchRequest;
          request.RequestClass = "xBase";
          request.RequestAction = "ExcelRequest";
          request.RequestHeader = JSON.stringify(this.tableHeader);
          request.TableName = JSON.stringify(tableTitle);
          request.ExportType = type;

          request.R1_RequestFields = rqField;
          request.R2_RequestFields = rqField;
          request.R3_RequestFields = rqField;
          request.R4_RequestFields = rqField;

          break;
        case "Progress":
          request.TotalRequests = this.dataLU.length;
          request.RequestClass = "xBase";
          request.RequestAction = "ExcelRequest";
          request.RequestHeader = JSON.stringify(this.tableHeader);
          request.TableName = JSON.stringify(tableTitle);
          request.ExportType = type;

          this.dataLU.forEach((value, key) => {
            request["R" + j + "_RequestFields"] = rqField;
            request["R" + j + "_RequestTemplate"] = "AG_Task_Task.Search";
            request["R" + j + "_RequestDataGroup"] =
              "DataGroup.danh-sach-cong-viec.04b66";
            request["R" + j + "_Worker"] = value.UserId;
            request["R" + j + "_PlanStartDateStartValue"] = this.start;
            request["R" + j + "_PlanStartDateEndValue"] = this.end;
            request["R" + j + "_WorkerName"] = value.Username;
            request["R" + j + "_AssignedUser"] = this.$getItemLocalStorage(
              this.$localStorageConstant.SessionId
            );
            j++;
          });
          break;
        default:
          console.log("Invalid request! Undefined request type!");
          break;
      }

      this.$Utils.postGetExcel(request).then(response => {
        var blob = new Blob([response], {
          type: "application/vnd.ms-excel"
        });

        switch (type) {
          case "Individual":
            if (this.Username === "" || typeof this.Username === "undefined") {
              this.saveAs(
                blob,
                "Báo cáo - " +
                  this.loggedOnUser.Username +
                  " - " +
                  this.$Utils.formatDateTime(new Date(), "DD-MM-YYYY") +
                  ".xls"
              );
            } else {
              this.saveAs(
                blob,
                "Báo cáo - " +
                  this.Username +
                  " - " +
                  this.$Utils.formatDateTime(new Date(), "DD-MM-YYYY") +
                  ".xls"
              );
            }
            break;

          case "Project":
            this.saveAs(
              blob,
              "Báo cáo - " +
                this.prName +
                " - " +
                this.$Utils.formatDateTime(new Date(), "DD-MM-YYYY") +
                ".xls"
            );
            break;

          case "Progress":
            this.saveAs(
              blob,
              "Báo Cáo Tiến Độ - " +
                this.$Utils.formatDateTime(new Date(), "DD-MM-YYYY") +
                ".xls"
            );
            break;
        }
      });
    },
    sendReport(type) {
      var dataToPass;
      if (type === "Individual") {
        dataToPass = this.$Lodash.cloneDeep(this.viewModel);
      } else if (type === "Project") {
        dataToPass = this.$Lodash.cloneDeep(this.viewModelGroup);
      } else if (type === "Create") {
        dataToPass = [
          {
            Title: "Danh sách công việc đã lập KẾ HOẠCH ",
            dataSource: this.listTaskDoneToSent,
            TotalPlan: 0,
            TotalActual: 0,
            sum: function(item) {
              this.TotalPlan = this.TotalPlan + parseFloat(item.PlanManHour);
              this.TotalActual =
                this.TotalActual + parseFloat(item.RemainingManHour);
            }
          },
          {
            Title: "Các công việc PHÁT SINH ",
            dataSource: this.listTaskUnpredictedToSent,
            TotalPlan: 0,
            TotalActual: 0,
            sum: function(item) {
              this.TotalPlan = this.TotalPlan + parseFloat(item.PlanManHour);
              this.TotalActual =
                this.TotalActual + parseFloat(item.RemainingManHour);
            }
          },
          {
            Title: "Các công việc đã HOÀN THÀNH ",
            dataSource: this.listTaskNotDoneToSent,
            TotalPlan: 0,
            TotalActual: 0,
            sum: function(item) {
              this.TotalPlan = this.TotalPlan + parseFloat(item.PlanManHour);
              this.TotalActual =
                this.TotalActual + parseFloat(item.RemainingManHour);
            }
          },
          {
            Title: "Các công việc KẾ HOẠCH tiếp theo ",
            dataSource: this.listTaskNextDayToSent,
            TotalPlan: 0,
            TotalActual: 0,
            sum: function(item) {
              this.TotalPlan = this.TotalPlan + parseFloat(item.PlanManHour);
              this.TotalActual =
                this.TotalActual + parseFloat(item.RemainingManHour);
            }
          }
        ];
      }
      this.$hub.$emit(
        "set-modal-data",
        "Gửi báo cáo",
        "70%",
        true,
        "center",
        SendReport,
        false,
        "",
        dataToPass
      );
    },
    changeDateTextbyType(data) {
      switch (data[2]) {
        case "yesterday":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "DayStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "DayEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "HÔM QUA";
          this.nextdateText = "HÔM NAY";
          break;
        case "today":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "DayNextStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "DayNextEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "HÔM NAY";
          this.nextdateText = "NGÀY MAI";
          break;
        case "tomorrow":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "DayNextStart",
            this.requestDatetimeFormat,
            data[0]
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "DayNextEnd",
            this.requestDatetimeFormat,
            data[1]
          );
          this.dateText = "NGÀY MAI";
          this.nextdateText = "NGÀY KIA";
          break;
        case "lastweek":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "WeekStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "WeekEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "TUẦN TRƯỚC";
          this.nextdateText = "TUẦN NÀY";
          break;
        case "thisweek":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "WeekNextStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "WeekNextEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "TUẦN NÀY";
          this.nextdateText = "TUẦN SAU";
          break;
        case "nextweek":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "Week2NextStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "Week2NextEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "TUẦN SAU";
          this.nextdateText = "TUẦN TIẾP THEO";
          break;
        case "lastmonth":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "MonthStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "MonthEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "THÁNG TRƯỚC";
          this.nextdateText = "THÁNG NÀY";
          break;
        case "thismonth":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "MonthNextStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "MonthNextEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "THÁNG NÀY";
          this.nextdateText = "THÁNG SAU";
          break;
        case "nextmonth":
          this.nextStart = this.$Utils.getDateTimeByKey(
            "Month2NextStart",
            this.requestDatetimeFormat
          );
          this.nextEnd = this.$Utils.getDateTimeByKey(
            "Month2NextEnd",
            this.requestDatetimeFormat
          );
          this.dateText = "THÁNG SAU";
          this.nextdateText = "THÁNG TIẾP THEO";
          break;
        default:
          break;
      }
    }
  },
  created() {},
  mounted() {
    this.loadSetting();
    //this.getAllFieldData();
    if (this.$rootScope.dateFilter) {
      this.start =
        Vue.moment(this.$rootScope.dateFilter[0]).format("YYYY-MM-DD") +
        "T00:00:00";
      this.end =
        Vue.moment(this.$rootScope.dateFilter[1]).format("YYYY-MM-DD") +
        "T23:59:59";
      this.changeDateTextbyType(this.$rootScope.dateFilter);
    } else {
      this.start = Vue.moment(this.DatePicker.setHours(0, 0, 0, 0)).format(
        this.requestDatetimeFormat
      );
      this.end = Vue.moment(this.DatePicker.setHours(23, 59, 59, 999)).format(
        this.requestDatetimeFormat
      );
      this.nextStart = Vue.moment(this.DatePicker.setHours(0, 0, 0, 0))
        .add(1, "days")
        .format(this.requestDatetimeFormat);
      this.nextEnd = Vue.moment(this.DatePicker.setHours(23, 59, 59, 999))
        .add(1, "days")
        .format(this.requestDatetimeFormat);
    }
    if (this.$rootScope.selectedWorkerId) {
      this.$rootScope.selectedWorkerId.forEach(item => {
        this.selectedUser += item + ";";
      });
    }
    this.userName = this.loggedOnUser.Username;
    this.$hub.$on("datePicked", data => {
      var temp = this.$Lodash.cloneDeep(data);
      this.start = Vue.moment(data[0]).format(this.requestDatetimeFormat);
      this.end = Vue.moment(data[1]).format(this.requestDatetimeFormat);

      this.dayStart = Vue.moment(data[0]).format(this.datetimeFormat);
      this.dayEnd = Vue.moment(data[1]).format(this.datetimeFormat);

      if (this.dayStart.toString() === this.dayEnd.toString()) {
        this.selectedDate = Vue.moment(this.start).format(this.datetimeFormat);
        this.dateText = this.selectedDate.toString();
        this.nextStart = Vue.moment(this.start)
          .add(1, "days")
          .format(this.requestDatetimeFormat);
        this.nextEnd = Vue.moment(this.end)
          .add(1, "days")
          .format(this.requestDatetimeFormat);
      } else {
        this.selectedDate = Vue.moment(this.start).format(this.datetimeFormat);
        this.selectedNextDate = Vue.moment(this.end).format(
          this.datetimeFormat
        );
        this.dateText =
          this.selectedDate.toString() + "-" + this.selectedNextDate.toString();
        this.nextStart = Vue.moment(this.end)
          .add(1, "days")
          .format(this.requestDatetimeFormat);
        this.nextEnd = Vue.moment(this.end)
          .add(1, "days")
          .format(this.requestDatetimeFormat);
      }

      this.nextdateText = Vue.moment(this.nextStart)
        .format(this.datetimeFormat)
        .toString();

      this.changeDateTextbyType(temp[2]);
       
      if (this.activeName === "progress") {
        this.searchUserProgress();
      } else {
        this.searchTask();
        this.getReport();
      }
    });
    this.$hub.$on("workerPicked", data => {
      this.selectedUser = "";
      this.userName = "";
      if (data.length > 0) {
        data.forEach(userId => {
          this.selectedUser += userId + ";";
          this.dataLU.forEach(user => {
            if (user.UserId === userId) {
              this.userName += user.Username + ",";
            }
          });
        });
        if (this.userName === "") {
          this.userName = "Tất cả nhân sự";
        }
        if (this.activeName === "worker") {
          this.searchTask();
        }
      } else {
        this.userName = this.loggedOnUser.Username;
        this.searchTask();
      }
    });
    this.getReport();
    this.searchTask();
    this.searchUserInGroup();
    this.searchGroupOfUser();
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.dailyReport {
  .parentTable {
    display: table;
    height: 100%;
  }
  .cellTable {
    display: table-cell;
    vertical-align: middle;
  }

  width: 100%;
  margin-top: 5px;

  hr {
    margin-bottom: 7px;
  }

  .el-tabs__header {
    margin: 0 0 5px;
  }

  .toggleButton {
    padding: 12px 0 0 0;
  }

  .main .container-fluid {
    padding: 0px 17px !important;
  }

  body {
    font-size: 13px;
  }

  .round-image {
    border-radius: 50%;
    max-height: 50px;
    display: block;
    margin: auto;
  }

  .el-progress-bar__outer {
    height: 20px !important;
  }

  .el-input__inner {
    height: 26px;
  }

  .el-select {
    width: 150px;
  }

  .el-button {
    padding: 5px;
  }

  .el-header,
  .el-footer {
    height: auto !important;
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
    line-height: 30px;
    padding: 0 5px;
  }

  .rightaligndiv {
    text-align: right;
    padding-right: 5px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
  }

  .el-main {
    background-color: #fff;
    color: #333;
    padding: 5px;
  }

  body > .el-container {
    margin-bottom: 40px;
    font-size: 13px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
  }

  .el-container:nth-child(7) .el-aside {
  }

  .el-row {
    margin-bottom: 5px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-table thead {
    padding: 5px 0px;
    font-size: 14px;
  }

  .el-table td {
    padding: 5px 0px;
  }

  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
