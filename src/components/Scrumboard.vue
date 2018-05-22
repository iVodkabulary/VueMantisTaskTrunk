<template>
  <div class="scrumBoard">
    <div class="card-header p-0">
      <div class="">
        <div class="row">
          <h5 class="col m-auto"><i class="fa fa-trello pr-1"></i><span>Bảng</span></h5>
          <div class="col text-right pr-0">
            <div class="row m-0">
              <div class="col p-0">
                <!-- <button class="btn btn-link p-0">
                  <i class="fa fa-file-excel-o fa-lg"></i>
                </button> -->
                <button class="btn btn-link" v-b-modal.Filter>
                  <i class="fa fa-filter fa-lg pr-1"></i>
                </button>
              </div>
            </div>
          </div>
          <b-modal id="Filter" title="Bộ lọc" ref="myModalRef" class="text-primary" header-bg-variant="primary"
                   hide-footer>
            <template>
              <div class="formSearch">
                <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
                  <div class="text-center">
                    <button class="btn btn-secondary bg-white mr-2" @click="searchData">Tìm kiếm</button>
                    <button class="btn btn-secondary bg-white" @click="resetForm">Xóa trắng</button>
                  </div>
                  <b-form-input v-model="form.keyword"
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm"></b-form-input>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.Project" placeholder="Dự án" style="width: 100%;">
                      <el-option v-for="item in project"
                                 :key="item.Id"
                                 :label="item.Name"
                                 :value="item.Id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.worker" placeholder="Nhân sự thực hiện" style="width: 100%;">
                      <el-option v-for="item in worker"
                                 :key="item.UserId"
                                 :label="item.Username"
                                 :value="item.UserId">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.manager" placeholder="Quản lí" style="width: 100%;">
                      <el-option v-for="item in manager"
                                 :key="item.UserId"
                                 :label="item.Username"
                                 :value="item.UserId">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.priority" placeholder="Ưu tiên" style="width: 100%;">
                      <el-option v-for="item in priority"
                                 :key="item.Id"
                                 :label="item.Name"
                                 :value="item.Id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.viewStatus" placeholder="Xem trạng thái" style="width: 100%;">
                      <el-option v-for="item in viewStatus"
                                 :key="item.id"
                                 :label="item.text"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-date-picker type="date" format="dd-MM-yyyy" placeholder="Từ ngày bắt đầu"
                                    v-model="form.startDate" style="width: 100%;"></el-date-picker>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-date-picker type="date" format="dd-MM-yyyy" placeholder="Đến ngày bắt đầu"
                                    v-model="form.endDate" style="width: 100%;"></el-date-picker>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.department" placeholder="Phòng ban" style="width: 100%;">
                      <el-option v-for="item in department"
                                 :key="item.GroupId"
                                 :label="item.GroupName"
                                 :value="item.GroupId">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-12 py-2 px-0">
                    <el-select multiple v-model="form.status" placeholder="Trạng thái" style="width: 100%;">
                      <el-option v-for="item in stages"
                                 :key="item.id"
                                 :label="item.Name"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </el-form>
              </div>
            </template>
          </b-modal>
        </div>
      </div>
    </div>
    <div class="kanban">
      <kanban-board :stages="stages" :blocks="taskLists" @update-block="updateBlock">
        <div v-for="block in taskLists" :slot="block.id" class="cardContent">
          <div @click="showDetailScrum(block, false)">
            <div class="text-primary">{{block.title}}</div>
            <div>{{block.workerName}} | {{block.level}}</div>
            <div>{{block.dateStart}} | {{block.dateEnd}}</div>
            <div>Ước tính: {{block.plan}} | Thực tế: {{block.real}}</div>
            <div class="row">
              <div class="col-6 text-left scrumBoard">
                <b-nav-item class="d-md-down-none p-0">
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </b-nav-item>
              </div>
              <div class="col-6 text-right" @click.stop="showDetailScrum(block, true)">
                <i class="fa fa-comments" aria-hidden="true"></i><span> {{block.totalCmt ? block.totalCmt : 0}}</span>
              </div>
            </div>
          </div>
        </div>
      </kanban-board>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import vueKanban from "vue-kanban";
  import ShowTaskDetail from "@/components/static/ShowTaskDetail";
  import DynamicPage from "@/components/dynamic/DynamicPage";
  // import "../../node_modules/vue-kanban/src/assets/kanban.scss";

  Vue.use(vueKanban);
  export default {
    data() {
      return {
        stages: [
          {
            id: 1,
            Name: "Mới",
            StyleObject: {
              "background-color": "#e3b7eb"
            }
          }
        ],
        worker: [],
        project: [],
        manager: [],
        priority: [],
        viewStatus: [],
        department: [],
        dateStart: "",
        dateEnd: "",
        selectedWorker: [],
        form: {
          keyword: "",
          Project: "",
          worker: "",
          manager: "",
          priority: "",
          viewStatus: "",
          startDate: "",
          endDate: "",
          department: "",
          status: ""
        },
        taskLists: [],
        dataS: {},
        dataSearch: {},
        SettingForm: [],
        arrStatus: [],
        categories: []
      };
    },
    created() {
      //console.log("----------- in scrumboad ", this.$rootScope.dateFilter);
      this.bindDataSearch();
      this.loadSetting();

      //var dateStart = this.$Utils.getDateTimeByKey("WeekStart");
      //var dateEnd = this.$Utils.getDateTimeByKey("WeekEnd");
      var requestStatus = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "Setting.SearchBase",
        R1_ParentCode: "xSystem.Setting.xTask.Status"
      };
      this.$Utils.post(requestStatus).then(statusList => {
        var statusList = this.$Utils.getDataWithRoot(
          statusList,
          "R1.Data.DynamicDS.Setting"
        );
        var arrTemp = [];
        $.each(statusList, function (k, v) {
          arrTemp[v.Id] = v.Name;
        });
        this.arrStatus = arrTemp;
        this.stages = $.makeArray(
          $.map(statusList, function (val, i) {
            return {
              id: val.Id,
              Name: val.Name,
              StyleObject: {
                "background-color": val.Color
              }
            };
          })
        );
      });
    },
    methods: {
      bindDataSearch() {
        var userRequest = {
          RequestClass: "BPM",
          RequestAction: "SearchUsers",
          TotalRequests: 1,
          StaticFields: "UserId;Username;LoginName;Status",
          ConditionFields: "Status",
          Status: 1
        };
        this.$Utils.post(userRequest).then(data => {
          var data = data.Data.UserDS.User;
          this.worker = data;
          this.manager = data;
        });

        var priorityRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "xEdu.TaskPriority",
          R1_Code: "TaskPriority"
        };
        this.$Utils.post(priorityRequest).then(data => {
          var pri = data.R1.Data.DocumentDS.Document;
          this.priority = pri;
        });

        var viewStatusRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "Setting.SearchBaseTree",
          R1_ParentCode: "xSystem.Setting.xTask.StatusDisplay"
        };
        this.$Utils.post(viewStatusRequest).then(data => {
          var viewS = data.R1.Data;
          this.viewStatus = viewS;
        });

        var projectsRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "xDocument_Document.Search",
          R1_RequestDataGroup: "DataGroup.quan-ly-du-an.053gf",
          R1_RequestFields:
            "Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type",
          R1_Code: "Project",
          R1_Keyword: ""
        };
        this.$Utils.post(projectsRequest).then(data => {
          var projects = data.R1.Data.DocumentDS.Document;
          this.project = projects;
        });

        var departmentRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_GroupType: 1,
          R1_RequestTemplate: "OrgnizationList"
        };
        this.$Utils.post(departmentRequest).then(data => {
          var department = data.R1.Data.UserDS.Group;
          this.department = department;
        });
      },
      searchData() {
        this.dataSearch.keyword = this.form.keyword;
        this.dataSearch.Project = this.form.Project;
        this.dataSearch.worker = this.form.worker;
        this.dataSearch.manager = this.form.manager;
        this.dataSearch.priority = this.form.priority;
        this.dataSearch.viewStatus = this.form.viewStatus;
        this.dataSearch.startDate = this.form.startDate;
        this.dataSearch.endDate = this.form.endDate;
        this.dataSearch.department = this.form.department;
        this.dataSearch.status = this.form.status;
        this.getTask(this.dataSearch);
        //this.$refs.myModalRef.hide();
      },
      resetForm() {
        this.form.keyword = "";
        this.form.Project = [];
        this.form.worker = [];
        this.form.manager = [];
        this.form.priority = [];
        this.form.viewStatus = [];
        this.form.startDate = "";
        this.form.endDate = "";
        this.form.department = [];
        this.form.status = [];
      },
      loadSetting() {
        var vm = this;
        var setFilterSetting = false;
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "Setting.SearchBase",
          R1_ParentCode: "xSetting.Project.Form",
          R1_Code: "Form.task.0d1c1"
        };
        vm.$Utils.post(request).then(data => {
          var SettingForm = vm.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          )[0];
          if (
            vm.$Utils.isEmpty(SettingForm, "Description") &&
            vm.$Lodash.isString(SettingForm.Description)
          )
            SettingForm.Description = JSON.parse(SettingForm.Description);
          //if (utilsLibrary.isEmpty(ctrl.SettingForm.Description.AdditionConditions)) {
          //  ctrl.AdditionConditions = utilsLibrary.stringToObject(ctrl.SettingForm.Description.AdditionConditions)
          //}
          $.each(SettingForm.Description, function (fData, fKey) {
            SettingForm[fKey] = fData;
          });
          this.SettingForm = SettingForm;
        });
      },
      getTask(data) {
        var dateStart = this.$Utils.getDateTimeByKey("WeekStart");
        var dateEnd = this.$Utils.getDateTimeByKey("WeekEnd");
        var selectedWorker = [];
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        if (data) {
          if (data.start) {
            dateStart = this.$Utils.formatDateTime(
              data.start,
              "YYYY-MM-DDT00:00:00"
            );
          } else if (data.startDate) {
            dateStart = this.$Utils.formatDateTime(
              data.startDate,
              "YYYY-MM-DDT00:00:00"
            );
          }
          if (data.end) {
            dateEnd = this.$Utils.formatDateTime(data.end, "YYYY-MM-DDT23:59:59");
          } else if (data.endDate) {
            dateEnd = this.$Utils.formatDateTime(
              data.endDate,
              "YYYY-MM-DDT23:59:59"
            );
          }
          if (data.selectedWorker) {
            selectedWorker = data.selectedWorker;
          }
        }
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.RequestClass = "xBase";
        request.RequestAction = "Request";
        request.TotalRequests = 1;
        request.R1_RequestTemplate = "AG_Task_Task.Search";
        request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R1_RequestFields =
          "Id;Name;Index;TotalComment;PlanStartDate;Deadline;Status;Worker;WorkerName;PlanManHour;RemainingManHour;";
        request.R1_GroupType = 1;
        request.R1_PlanStartDateStartValue = this.dateStart;
        request.R1_PlanStartDateEndValue = this.dateEnd;
        request.R1_Worker = this.selectedWorker.join(";");
        request.R1_AssignedUser = sessionId;
        if (data) {
          if (data.keyword && data.keyword != "") {
            request.R1_Keyword = data.keyword;
          }
          if (data.Project && data.Project.length > 0) {
            request.R1_VersionProject = data.Project.join(";");
          }
          if (data.worker && data.worker.length > 0) {
            request.R1_Worker = data.worker.join(";");
          }
          if (data.manager && data.manager.length > 0) {
            request.R1_Manager = data.manager.join(";");
          }
          if (data.priority && data.priority.length > 0) {
            request.R1_PriorityId = data.priority.join(";");
          }
          if (data.viewStatus && data.viewStatus.length > 0) {
            request.R1_StatusDisplay = data.viewStatus.join(";");
          }
          if (data.categories && data.categories.length > 0) {
            request.R1_Categories = data.categories;
          }
          if (data.department && data.department.length > 0) {
            request.R1_Project = data.department.join(";");
          }
          if (data.status && data.status.length > 0) {
            request.R1_Status = data.status.join(";");
          }
        }
        this.$Utils.postCheckResult(request).then(taskdata => {
          var taskList = this.$Utils.getDataWithRoot(
            taskdata,
            "R1.Data.TasksDS.Task"
          );
          this.taskLists = $.makeArray(
            $.map(taskList, function (val, i) {
              return {
                id: val.Id,
                Index: val.Index,
                status: val.Status,
                title: val.Name,
                workerName: val.WorkerName,
                dateStart: Vue.moment(val.PlanStartDate).format("DD/MM/YYYY hh:mm"),
                dateEnd: Vue.moment(val.Deadline).format("DD/MM/YYYY hh:mm"),
                level: val.PriorityIdName,
                task: val,
                plan: val.PlanManHour,
                real: val.RemainingManHour,
                totalCmt: val.TotalComment
              };
            })
          );
        });
      },
      updateBlock(id, status) {
        var ctrl = this;
        $.each(this.taskLists, (k, v) => {
          var arrChanged = [];
          var obj = {};
          var obj2 = {};
          if (v.id == id) {
            obj.ColumnCaption = "Trạng thái";
            obj.ColumnName = "Status";
            obj.NewDisplayValue = ctrl.arrStatus[status];
            obj.NewValue = status;
            obj.OldDisplayValue = ctrl.arrStatus[v.status];
            obj.OldValue = v.status;
            arrChanged.push(obj);
            obj2.ColumnCaption = "Trạng thái";
            obj2.ColumnName = "StatusName";
            obj2.NewDisplayValue = ctrl.arrStatus[status];
            obj2.NewValue = status;
            obj2.OldDisplayValue = ctrl.arrStatus[v.status];
            obj2.OldValue = v.status;
            arrChanged.push(obj2);
            var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            request.R1_RequestTemplate = "AG_Task_Task.Update";
            request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
            request.R1_RequestFields =
              "Id;Status;StatusName;FormSetting;Changed";
            request.R1_Id = id;
            request.R1_Status = status;
            request.R1_StatusName = ctrl.arrStatus[status];
            request.R1_FormSetting = JSON.stringify(ctrl.SettingForm);
            request.R1_Changed = JSON.stringify(arrChanged);
            ctrl.$Utils.post(request).then(data => {
              var request = this.$Lodash.cloneDeep(this.$singleRequest);
              request.RequestClass = "xBase";
              request.RequestAction = "Request";
              request.TotalRequests = 1;
              request.R1_RequestTemplate = "AG_Task_Task.Search";
              request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
              request.R1_RequestFields =
                'Id;Name;Index;ActualStartDate;ActualFinishDate;PlanStartDate;Deadline;StatusName;WorkerName;' +
                'ManagerName;PlanManHour;RemainingManHour;RestTime;VersionProject;Action;Categories;CategoryProjectLevel1;' +
                'CategoryProjectLevel2;CategoryProjectLevel3;ChosenOne;Code;CreatedBy;GroupRoot;Manager;Milestone;' +
                'ModifiedBy;PriorityId;Project;ProjectType;Quality;Status;TaskQualityResult;TaskRequest;TaskResult;' +
                'TaskState;TotalComment;TotalDownload;Type;Version;Worker;TagName;StatusDisplayName;SeverityName;' +
                'VersionProjectName;CategoriesLevel1;CategoriesLevel2;CategoriesLevel3;CategoriesLevel4;TargetsLevel1;' +
                'TargetsLevel2;TargetsLevel3;TargetsLevel4;TargetsName;ProjectCategoriesLevel1;ProjectCategoriesName;' +
                'ProjectCategoriesLevel2;ProjectCategoriesLevel3;';
              request.R1_Id = id;
              ctrl.$Utils.postCheckResult(request).then(data => {
                data = this.$Utils.getDataWithRoot(data.R1, 'Data.TasksDS.Task');
                var dataToPass = {
                  "url": 'task-report-page',
                  "RootData": 'AG_Task_Task',
                  "DataSource": 'Form.task.0d1c1',
                  "DataGroup": 'DataGroup.danh-sach-cong-viec.04b66',
                  "ElementType": "Popup",
                  "ModuleCode": 'Form.task.0d1c1',
                  "parentSetting": {
                    "object": data[0],
                    "set": {
                      "ElementType": "Popup",
                      "GetFullData": "true"
                    },
                    "isCall": true,
                    "loadScrumboard": true,
                    "loadCalendar": true,
                  },
                  "ModuleType": "Form"
                };
                this.$hub.$emit(
                  "set-modal-data",
                  "Chỉnh sửa công việc",
                  "100%",
                  true,
                  "center",
                  DynamicPage,
                  true,
                  '', {
            Template: 'Modal',
            Module: [dataToPass]
          } , false
                );
              });
            });
          }
        });
      },
      showDetailScrum(item, flag) {
        if (flag) {
          this.$set(item.task, 'activeName', flag);
          this.$hub.$emit(
            "set-modal-data",
            'Chi tiết công việc',
            "60%",
            true,
            "center",
            ShowTaskDetail,
            true,
            "",
            item.task
          );
        } else {
          this.$hub.$emit(
            "set-modal-data",
            'Chi tiết công việc',
            "60%",
            true,
            "center",
            ShowTaskDetail,
            true,
            "",
            item.task
          );
        }

      }
    },
    mounted() {
      if (this.$rootScope.dateFilter && this.$rootScope.dateFilter.length > 2) {
        this.dateStart = Vue.moment(this.$rootScope.dateFilter[0]).format('YYYY-MM-DD') + 'T00:00:00';
        this.dateEnd = Vue.moment(this.$rootScope.dateFilter[1]).format('YYYY-MM-DD') + 'T23:59:59';
        /* this.dateStart = Vue.moment(this.$rootScope.dateFilter[0]).format(this.requestDatetimeFormat);
        this.dateEnd = Vue.moment(this.$rootScope.dateFilter[1]).format(this.requestDatetimeFormat); */
      }
      if (this.$rootScope.selectedWorkerId) {
        this.selectedWorker = this.$rootScope.selectedWorkerId;
      }
      this.getTask();

      this.$hub.$on("datePicked", data => {
        this.dataS.start = data[0];
        this.dataS.end = data[1];
        this.dateStart = Vue.moment(data[0]).format('YYYY-MM-DD') + 'T00:00:00';
        this.dateEnd = Vue.moment(data[1]).format('YYYY-MM-DD') + 'T23:59:59';
        /*  this.dateStart = this.$Utils.formatDateTime(
           data[0],
           "YYYY-MM-DDT00:00:00"
         );
         this.dateEnd = this.$Utils.formatDateTime(data[1], "YYYY-MM-DDT00:00:00"); */
        this.getTask();
      });
      this.$hub.$on("loadScrumboard", data => {
        this.searchData();
      });
      this.$hub.$on("workerPicked", data => {
        this.selectedWorker = data;
        this.getTask();
      });
    }
  };
</script>

<style lang="scss">
  @media screen and (max-width: 599px) {
    .container-fluid {
      padding: 0px 5px !important;
    }
  }

  .scrumBoard {
    $ease-out: all .3s cubic-bezier(0.23, 1, 0.32, 1);

    ul.drag-list, ul.drag-inner-list {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .drag-container {
      max-width: 1000px;
      margin: 20px auto;
    }

    .drag-list {
      display: flex;
      align-items: flex-start;

      @media (max-width: 690px) {
        display: block;
      }
    }

    .drag-column {
      flex: 1;
      margin: 0 10px;
      position: relative;
      background: rgba(black, 0.2);
      overflow: hidden;

      @media (max-width: 690px) {
        margin-bottom: 30px;
      }

      h2 {
        font-size: 0.8rem;
        margin: 0;
        text-transform: uppercase;
        font-weight: 600;
      }
    }

    .drag-column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
    }

    .drag-inner-list {
      min-height: 50px;
      color: white;
    }

    .drag-item {
      padding: 10px;
      margin: 10px;
      height: 100px;
      background: rgba(black, 0.4);
      transition: $ease-out;

      &.is-moving {
        transform: scale(1);
        background: #f1f1f1;
      }

    }

    .drag-header-more {
      cursor: pointer;
    }

    .drag-options {
      position: absolute;
      top: 44px;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 10px;
      transform: translateX(100%);
      opacity: 0;
      transition: $ease-out;

      &.active {
        transform: translateX(0);
        opacity: 1;
      }

      &-label {
        display: block;
        margin: 0 0 5px 0;

        input {
          opacity: 0.6;
        }

        span {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 400;
          margin-left: 5px;
        }
      }
    }

    /* Dragula CSS  */

    .gu-mirror {
      position: fixed !important;
      margin: 0 !important;
      z-index: 9999 !important;
      opacity: 0.8;
      list-style-type: none;
    }

    .gu-hide {
      display: none !important;
    }

    .gu-unselectable {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }

    .gu-transit {
      opacity: 0.2;
    }

    .drag-column {
      background-color: #fff;
    }
    .kanban {
      overflow: auto;
      height: 74vh;
    }
    .drag-container {
      min-width: 2500px;
      margin: 20px auto;

      @media (max-width: 690px) {
        min-width: 0px;
      }
    }
    .drag-inner-list {
      max-height: 61vh;
      overflow: auto;
    }
    .drag-column-header {
      background: #ff9a54;
    }
    .drag-item {
      background: #f1f1f1;
      color: #333;
      height: 100%;
      cursor: pointer;
    }
    .formSearch {
      width: 250px;
    }
    .nav-link {
      padding: 0px;
      color: #333;
    }

    .showDetailScrumboard {
      .el-dialog__header {
        text-align: left;
        background-color: #5090c1;
        .el-dialog__title {
          color: #fff;
        }
      }
      .el-dialog__footer {
        text-align: right;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    #Filter {
      .modal-dialog {
        position: fixed;
        right: 0px;
        margin: 0px;
        height: 100%;
        .modal-content {
          height: 100%;
        }
      }
    }
    .title-box {
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
    }
    .selectedWorker {
      margin: auto;
    }
    .drag-column {
      h2 {
        font-size: 16px;
        margin: 0;
        text-transform: none;
        font-weight: 600;
      }
    }

  }

</style>
