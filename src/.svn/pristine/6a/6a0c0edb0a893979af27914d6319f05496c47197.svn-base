<template>
  <div class="calendarCom">
    <calendar :events="tasks" :editable="editable" :droppable="droppable" class="bg-white" :workers="Wokers"
              :projects="Projects">
    </calendar>
    <el-container v-if="isMobile" id="listEvent" class="listEventDiv">
      <div v-show="calendarType === 'task'" style="width: 100%">
        <el-header><span>Danh sách công việc trong ngày {{dateText}}:</span></el-header>
        <el-main>
          <el-card v-show="eventList.length === 0"> Không có công việc nào trong ngày!</el-card>
          <el-card class="box-card" v-for="item in eventList" :key="item.Index">
            <el-col :span="4" class="centerText"><p class="link" @click="openTaskInfoDialog(item)">{{item.Index}}</p>
            </el-col>
            <el-col :span="15"> {{item.title}}</el-col>
            <el-col :span="5" v-if="!item.type"> {{item.workerName}}</el-col>
          </el-card>
        </el-main>
      </div>
      <div v-show="calendarType === 'birthday'" style="width: 100%">
        <el-header><span>Danh sách sinh nhật trong ngày {{dateText}}:</span></el-header>
        <el-main>
          <el-card v-show="eventList.length === 0"> Không có sinh nhật nào trong ngày!</el-card>
          <el-card class="box-card" v-for="item in eventList">
            <div class="fc-content" style="cursor: pointer;" @click="openBirthdayInfoDialog(item)">
              <span class="fc-title">
              <i class="fa fa-tag" :style="'color:' + item.customdStyle"></i>
              <i :class="item.GenderName === 'Nữ'?'icon icon-user-female text-danger': item.GenderName === 'Nam'?'icon icon-user' :'fa fa-genderless'"></i>&nbsp;&nbsp;&nbsp;
               {{item.Age}} <i class="fa fa-birthday-cake text-warning"></i>&nbsp;&nbsp;&nbsp;
               <span>{{item.title}}</span>
              </span>
            </div>
            <div class="fc-resizer fc-end-resizer"></div>
          </el-card>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
  import Vue from "vue";
  import fullcalendar from 'fullcalendar'
  import 'fullcalendar/dist/fullcalendar.min.css';
  import 'fullcalendar/dist/locale/vi.js';
  import DynamicPage from "@/components/dynamic/DynamicPage";
  import GoogleCalendarDialog from "@/components/GoogleCalendarDialog";
  import ShowTaskDetail from "@/components/static/ShowTaskDetail";
  import ProfileDetail from "@/components/static/ProfileDetail";
  import googleService from "@/services/googleService.js";
  import utilsLibrary from '@/services/utils.js';

  Array.prototype.indexOfId = function (arr, id) {
    return JSON.stringify(arr).indexOf(id);
  }
  Vue.use(require('vue-moment'));
  Vue.component('calendar', {
    template: `
    <div>
      <div class="fc-toolbar fc-header-toolbar title-box">
        <div class="fc-left">
          <div class="pl-1 pt-1">
            <i class="fa fa-calendar"></i> Lịch </div>
        </div>
        <div class="fc-center">
          <button class="btn btn-link" @click="pre">
            <i class="fa fa-chevron-left"></i>
          </button>
          <span class="text-capitalize"> {{viewtitle}}</span>
          <button class="btn  btn-link" @click="next">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
        <div :class="!$isMobileDevice ? 'fc-right' : 'calendar-filter'">
          <el-select v-if="calendarType==='task'" v-model="form.project" placeholder="Dự án" @change="selectProject" v-show="!$isMobileDevice && !$hub.$rootScope.isGoogleCalendar">
            <el-option v-for="item in cboProject" :key="item.Id" :label="item.Name" :value="item.Id"/>
          </el-select>
          <el-select v-if="calendarType==='task'" v-model="form.woker" placeholder="Nhân sự" @change="selectWoker" v-show="!$isMobileDevice && !$hub.$rootScope.isGoogleCalendar">
            <el-option v-for="item in cboWoker" :key="item.Id" :label="item.Name" :value="item.Id"/>
          </el-select>
          <el-select v-model="calendarType" placeholder="Loại lịch" @change="Tasklist" v-show="!$isMobileDevice && !$hub.$rootScope.isGoogleCalendar">
            <el-option label="Công việc" value="task"/>
            <el-option label="Sinh nhật" value="birthday"/>
          </el-select>
          <el-tooltip v-if="!$isMobileDevice" class="item" effect="dark" :content="!$hub.$rootScope.isGoogleCalendar ? 'Lịch Google' : 'Lịch công ty'" placement="bottom-end" v-show="!$isMobileDevice && $hub.$rootScope.authGoogle">
            <el-button v-show="!$isMobileDevice" icon="" @click="ChangeCalenderView">
              {{$hub.$rootScope.isGoogleCalendar ? "M" : "G"}}
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="!$isMobileDevice" class="item" effect="dark" content="Xuất excel" placement="bottom-end">
            <el-button icon="fa fa-file-excel-o" @click="excelExport"></el-button>
          </el-tooltip>
          <span v-if="$isMobileDevice">
              <el-button class="col-2" icon="fa fa-calendar-check-o" @click="changeView(0)"></el-button>
              <el-button class="col-2" icon="fa fa-align-justify" @click="changeView(1)"></el-button>
              <el-button class="col-2" icon="fa fa-th-large" @click="changeView(2)"></el-button>
              <el-button class="col-2" icon="fa fa-th" @click="changeView(3)"></el-button>
          </span>
          <span v-else>
            <el-tooltip class="item" effect="dark" content="Hôm nay" placement="bottom-end">
              <el-button icon="fa fa-calendar-check-o" @click="changeView(0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Ngày" placement="bottom-end">
              <el-button icon="fa fa-align-justify" @click="changeView(1)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Tuần" placement="bottom-end">
              <el-button icon="fa fa-th-large" @click="changeView(2)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Tháng" placement="bottom-end">
              <el-button icon="fa fa-th" @click="changeView(3)"></el-button>
            </el-tooltip>
          </span>
        </div>
      </div>
      <el-row>
        <el-col :span="24" class="text-right status-check">
          <el-col :span="24" v-if="!isMobile" >
            <el-col v-if="calendarType==='task'" >
              <el-checkbox-group v-if="calendarType==='task'" v-model="checkListStatus" @change="handleCheckedStatusChange">
                <el-checkbox border v-for="status in listStatus" :label="status.Id" :key="status.Id" :style="status.styleObject">{{status.Name}}</el-checkbox>
              </el-checkbox-group>
             </el-col>
             <el-col v-else :span="6" :offset="17">
              <el-checkbox-group placeholder="Nhóm" v-model="selectedGroup" @change="Tasklist">
                <el-checkbox label="employee" border style="background-color: #ff9d59; color: white">Nhân viên</el-checkbox>
                <el-checkbox label="customer" border style="background-color: #76526c; color: white">Khách hàng</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
          <el-col :span="24" v-else >
            <el-col v-if="calendarType==='task'" :span="12">
              <el-select multiple placeholder="Trạng thái" collapse-tags v-model="checkListStatus" @change="handleCheckedStatusChange">
                <el-option v-for="item in listStatus" :key="item.Id" :label="item.Name" :value="item.Id"/>
              </el-select>
            </el-col>
            <el-col v-else :span="12">
              <el-select multiple collapse-tags placeholder="Nhóm" v-model="selectedGroup" @change="Tasklist">
                <el-option label="Nhân viên" value="employee">
                  <span><i class="fa fa-tag" style="color:#ff9d59"></i>
                  Nhân viên</span>
                </el-option>
                <el-option label="Khách hàng" value="customer">
                <span><i class="fa fa-tag" style="color:#76526c"></i>
                  Khách hàng</span>
                </el-option>
              </el-select>
              <!--<el-checkbox-group placeholder="Nhóm" v-model="selectedGroup" @change="Tasklist">
                <el-checkbox label="employee" border style="background-color: #ff9d59; color: white">Nhân viên</el-checkbox>
                <el-checkbox label="customer" border style="background-color: #76526c; color: white">Khách hàng</el-checkbox>
              </el-checkbox-group>-->
            </el-col>
            <el-col :span="12">
              <el-select v-model="calendarType" placeholder="Loại lich" @change="Tasklist" v-show="!$hub.$rootScope.isGoogleCalendar">
                <el-option label="Công việc" value="task"/>
                <el-option label="Sinh nhật" value="birthday"/>
              </el-select>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <div ref="calendar"></div>
    </div>
    `,
    props: {
      events: {
        type: Array,
        required: true
      },
      workers: {
        type: Array,
        required: false
      },
      projects: {
        type: Array,
        required: false
      },
      editable: {
        type: Boolean,
        required: false,
        default: false
      },

      droppable: {
        type: Boolean,
        required: false,
        default: false
      },

    },
    watch: {
      events: function (newEvents) {
        var self = this;
        self.cal = $(self.$refs.calendar);
        self.eventSource = newEvents;
        self.cal.fullCalendar('removeEvents');
        self.cal.fullCalendar("addEventSource", newEvents);
        self.cal.fullCalendar({'droppable': this.droppable,});
        self.cal.fullCalendar({'editable': this.editable,});
        self.cal.fullCalendar('rerenderEvents');
        self.cal.fullCalendar('refetch-events');
        self.cal.fullCalendar('refetch-events');

        if(self.isMobile){
          self.$parent.eventList = self.cal.fullCalendar('clientEvents', (event) => {
            return event.start.format("DD-MM-YYYY") === self.$parent.dateText;
          });
        }
      },
      workers: function (newval) {
        this.cboWoker = newval
      },
      projects: function (newval) {
        this.cboProject = newval
      },

    },
    data() {
      return {
        selectedGroup: ['employee', 'customer'],
        selectedView: '3',
        calendarType: 'task',
        isMobile: false,
        eventList: [],
        cal: null,
        viewtitle: '',
        cboWoker: [],
        cboProject: [],
        eventSource: [],
        checkListStatus: [],
        form: {
          project: '',
          woker: ''
        },
        listStatus: [],
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
      }
    },
    created() {
      var vm = this;
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: 1,
        R1_RequestTemplate: 'Setting.SearchBase',
        R1_ParentCode: 'xSystem.Setting.xTask.Status'
      };
      this.isMobile = this.$isMobileDevice;
      this.$Utils.post(request).then(response => {
        var data = vm.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        $.each(data, function (index, value) {
          value.styleObject = {
            background: value.Color
          }
        });
        vm.listStatus = data;
      });
      this.$hub.$on('reloadCalendar', (data) => {
        if (!vm.$rootScope.authGoogle) {
          vm.cal = $(vm.$refs.calendar);
          var view = vm.cal.fullCalendar('getView');
          var start = new Date(view.start);
          var end = new Date(view.end);
          this.$parent.searchTask(start, end);
        }
        this.$forceUpdate();
      });
    },
    methods: {
      ChangeCalenderView() {
        this.$set(this.$rootScope, 'isGoogleCalendar', !this.$rootScope.isGoogleCalendar)
        if (this.$rootScope.isGoogleCalendar) {
          this.title = 'Calendar-Company';
        } else {
          this.title = 'Calendar-Google';
        }
        this.events[0] = [];
        this.events[1] = [];
        this.$forceUpdate();
        this.Tasklist();
      },
      Tasklist() {
        var ctrl = this;
        ctrl.cal = $(ctrl.$refs.calendar);
        var view = ctrl.cal.fullCalendar('getView');
        var start = view.start._d;
        var end = view.end._d;
        if (ctrl.$rootScope.isGoogleCalendar) {
          var gStart = utilsLibrary.formatDateTime(start, 'YYYY-MM-DDT00:00:00+07:00');
          var gEnd = utilsLibrary.formatDateTime(end, 'YYYY-MM-DDT23:59:59+07:00');
          ctrl.syncCalendar(gStart, gEnd);
        } else {
          if (this.calendarType === 'task') {
            this.calendarType = 'task';
            this.$parent.searchTask(start, end);
          } else if (this.calendarType === 'birthday') {
            if (this.selectedGroup.length === 2) {
              this.$parent.getBirthday(ctrl.cal);
              this.$parent.taskCal = false;
            } else if (this.selectedGroup.length === 1 && this.selectedGroup.indexOf('employee') > -1) {
              this.$parent.getEmployeeBirthday(ctrl.cal, true);
            } else if (this.selectedGroup.length === 1 && this.selectedGroup.indexOf('customer') > -1) {
              this.$parent.getCustomerBirthday(ctrl.cal, true);
            }
          }
        }
      },
      getStatusColor(id) {
        var colors = this.$getItemLocalStorage(this.$localStorageConstant.settingColor);
        return id ? JSON.parse(colors)[id.toUpperCase()] : '';
      },
      syncCalendar(s, e) {
        var ctrl = this;
        if (!utilsLibrary.isEmpty(s) || !utilsLibrary.isEmpty(e)) {
          return;
        }
        // var deferred = $q.defer();
        if (ctrl.$hub.$rootScope.authGoogle === false) {
          googleService.handleAuthClick().then(function (data) {
            if (data) {
              if (data === 'error') {
                utilsLibrary.showMessage('error', 'Không thể đồng bộ dữ liệu');
                // ntn
                // $state.reload();
              } else {
                googleService.initClient(s, e).then(function (gev) {
                  if (gev) {
                    ctrl.events = [];
                    ctrl.events[1] = [];
                    ctrl.events[1] = gev.map(function (task) {
                      var tid = '';
                      var isGoogleSynched = (task.extendedProperties && task.extendedProperties["private"] && task.extendedProperties["private"]["xTaskId"]);
                      if (isGoogleSynched) {
                        tid = task.extendedProperties["private"]["xTaskId"];
                      }
                      var startDate = utilsLibrary.isEmpty(task.start.dateTime) ? task.start.dateTime : task.start.date;
                      var endDate = utilsLibrary.isEmpty(task.end.dateTime) ? task.end.dateTime : task.end.date;
                      var isAllDay = "false";
                      //var notification = utilsLibrary.isEmpty(task.reminders, 'overrides') ? task.reminders.overrides[0].minutes : "";
                      return {
                        id: task.id,
                        reminders: task.reminders,
                        title: task.summary,
                        start: startDate,
                        end: endDate,
                        allDay: isAllDay === "true" ? true : false,
                        type: task.kind,
                        location: task.location,
                        status: task.status,
                        description: task.description,
                        className: 'work-status z-' + task.status + ' progress',
                        task: task,
                        stick: true,
                        color: ctrl.getStatusColor(task.Status),
                        taskId: tid
                      }
                    });
                    ctrl.$set(ctrl.$hub.$rootScope, 'firstLoad', true);
                    // ctrl.$rootScope.$broadcast('updateSyncGoogleCalendars');
                    ctrl.$hub.$emit('updateSyncGoogleCalendars');
                  }
                });
              }
            } else {
              utilsLibrary.showMessage('error', 'Có lỗi xảy ra. vui lòng kiểm tra lại')
            }
          })
        } else {
          if (!utilsLibrary.isEmpty(ctrl.$hub.$rootScope.firstLoad)) {
            googleService.initClient(s, e).then(function (gev) {
              if (gev) {
                ctrl.event = [];
                ctrl.events[1] = [];
                ctrl.events[1] = gev.map(function (task) {
                  var tid = '';
                  var isGoogleSynched = (task.extendedProperties && task.extendedProperties["private"] && task.extendedProperties["private"]["xTaskId"]);
                  if (isGoogleSynched) {
                    tid = task.extendedProperties["private"]["xTaskId"];
                  }

                  var startDate = utilsLibrary.isEmpty(task.start.dateTime) ? task.start.dateTime : task.start.date;
                  var endDate = utilsLibrary.isEmpty(task.end.dateTime) ? task.end.dateTime : task.end.date;
                  var isAllDay = "false";
                  //var notification = utilsLibrary.isEmpty(task.reminders, 'overrides') ? task.reminders.overrides[0].minutes : "";
                  return {
                    id: task.id,
                    title: task.summary,
                    start: startDate,
                    end: endDate,
                    reminders: task.reminders,
                    allDay: isAllDay === "true" ? true : false,
                    type: task.kind,
                    location: task.location,
                    status: task.status,
                    description: task.description,
                    className: 'work-status z-' + task.status + ' progress',
                    task: task,
                    stick: true,
                    color: ctrl.getStatusColor(task.Status),
                    taskId: tid
                  }
                })
                ctrl.$set(ctrl.$hub.$rootScope, 'firstLoad', true);
                // ctrl.$rootScope.$broadcast('updateSyncGoogleCalendars', true);
                ctrl.$hub.$emit('updateSyncGoogleCalendars', true);
              }
            });
          } else {
            googleService.getEvents(s, e).then(function (gev) {
              if (gev) {
                ctrl.event = [];
                ctrl.events[1] = [];
                ctrl.events[1] = gev.map(function (task) {
                  var startDate = utilsLibrary.isEmpty(task.start.dateTime) ? task.start.dateTime : task.start.date;
                  var endDate = utilsLibrary.isEmpty(task.end.dateTime) ? task.end.dateTime : task.end.date;
                  var isAllDay = "false";
                  var tid = '';
                  var isGoogleSynched = (task.extendedProperties && task.extendedProperties["private"] && task.extendedProperties["private"]["xTaskId"]);
                  if (isGoogleSynched) {
                    tid = task.extendedProperties["private"]["xTaskId"];
                  }
                  //var notification = utilsLibrary.isEmpty(task.reminders, 'overrides') ? task.reminders.overrides[0].minutes : "";
                  return {
                    id: task.id,
                    title: task.summary,
                    reminders: task.reminders,
                    start: startDate,
                    end: endDate,
                    allDay: isAllDay === "true" ? true : false,
                    type: task.kind,
                    location: task.location,
                    status: task.status,
                    description: task.description,
                    className: 'work-status z-' + task.status + ' progress',
                    task: task,
                    stick: true,
                    color: ctrl.getStatusColor(task.Status),
                    taskId: tid
                  }
                });
                ctrl.$parent.tasks = ctrl.events[1];
              }
            });
          }
        }
      },
      refreshEvents(events) {
        var self = this;
        self.cal = $(self.$refs.calendar);
        self.cal.fullCalendar('removeEvents');
        self.cal.fullCalendar("addEventSource", events);
        self.cal.fullCalendar('rerenderEvents');
        self.cal.fullCalendar('refetch-events');
      },
      pre() {
        var self = this;
        self.cal = $(self.$refs.calendar);
        self.cal.fullCalendar("prev");
        var view = self.cal.fullCalendar('getView');
        this.viewtitle = view.title;
        var data = {
          start: view.start,
          end: view.end
        };
        this.Tasklist();
      },
      next() {
        var self = this;
        self.cal = $(self.$refs.calendar);
        self.cal.fullCalendar("next");
        var view = self.cal.fullCalendar('getView');
        this.viewtitle = view.title;
        var data = {
          start: view.start,
          end: view.end
        };
        this.Tasklist();
      },
      changeView(viewtype) {
        //alert(viewtype)
        viewtype = parseInt(viewtype);
        var self = this;
        self.cal = $(self.$refs.calendar);
        var strview = '';
        switch (viewtype) {
          case 0:
            strview = 'today';
            break;
          case 1:
            strview = 'agendaDay';
            break;
          case 2:
            strview = 'agendaWeek';
            break;
          case 3:
            strview = 'month';
            break;
          default:
            strview = 'month';
            break;
        }
        if (viewtype === 0)
          self.cal.fullCalendar('today');
        else
          self.cal.fullCalendar('changeView', strview);
        // var view = self.cal.fullCalendar('getView');
        // this.viewtitle = view.title;
        // var data = {
        //   start: view.start,
        //   end: view.end
        // }
        this.Tasklist();
      },
      selectProject() {
        var projectId = this.form.project;
        if (projectId === 1) {
          var event = this.eventSource;
        } else {
          var event = this.eventSource.filter(function (el) {
            return el.VersionProject === projectId;
          })
        }
        this.refreshEvents(event);
      },
      selectWoker() {
        var wokerId = this.form.woker;
        if (wokerId === 1) {
          var event = this.eventSource;
        } else {
          var event = this.eventSource.filter(function (el) {
            return el.Worker === wokerId;
          })
        }
        this.refreshEvents(event);
      },
      handleCheckedStatusChange(value) {
        var vm = this;
        if (this.checkListStatus.length <= 0) {
          var event = this.eventSource;
        }
        else {
          var tempEvent = this.eventSource;
          var event = [];
          if (tempEvent.length > 0) {
            $.each(this.checkListStatus, function (key, value) {
              var ev = tempEvent.filter(x => x.Status === value);
              if (vm.$Utils.isEmpty(ev)) {
                event = event.concat(ev);
              }
            });
          }
        }
        this.refreshEvents(event);
      },
      excelExport() {
        var self = this;
        var view = self.cal.fullCalendar('getView');
        var start = view.start;
        var end = view.end;
        var requestExport = {
          RequestClass: 'xBase',
          RequestAction: 'ExcelRequest',
          ExportType: 'Calendar',
          TotalRequests: 1,
          RequestHeader: JSON.stringify(this.tableHeader),
          R1_RequestTemplate: 'AG_Task_Task.Search',
          R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
          R1_UserField: 'Worker',
          R1_RequestFields: 'calendar;Name;Index;ActualStartDate;ActualFinishDate;PlanStartDate;Deadline;StatusName;WorkerName;ManagerName;PlanManHour;RemainingManHour;RestTime;VersionProject;Action;Categories;CategoryProjectLevel1;CategoryProjectLevel2;CategoryProjectLevel3;ChosenOne;Code;CreatedBy;GroupRoot;Id;Manager;Milestone;ModifiedBy;PriorityId;Project;ProjectType;Quality;Status;TaskQualityResult;TaskRequest;TaskResult;TaskState;TotalComment;TotalDownload;Type;Version;Worker;TagName;StatusDisplayName;SeverityName;VersionProjectName;CategoriesLevel1;CategoriesLevel2;CategoriesLevel3;CategoriesLevel4;TargetsLevel1;TargetsLevel2;TargetsLevel3;TargetsLevel4;TargetsName;ProjectCategoriesLevel1;ProjectCategoriesName;ProjectCategoriesLevel2;ProjectCategoriesLevel3;VersionProject;PlanStartDate;',
          R1_AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
          R1_PlanStartDateStartValue: Vue.moment(start).format('YYYY-MM-DD') + 'T00:00:00',
          R1_PlanStartDateEndValue: Vue.moment(end).format('YYYY-MM-DD') + 'T23:59:59',
        }
        this.$Utils.postGetExcel(requestExport).then((response) => {
          var blob = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          this.saveAs(blob, "Báo cáo công việc theo lịch.xls");
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
      }
    },
    mounted() {
      this.$hub.$on('refreshGoogleCalendar', () => {
        var view = this.cal.fullCalendar('getView');
        var start = new Date(view.start);
        var end = new Date(view.end);
        var gStart = utilsLibrary.formatDateTime(start, 'YYYY-MM-DDT00:00:00+07:00');
        var gEnd = utilsLibrary.formatDateTime(end, 'YYYY-MM-DDT23:59:59+07:00');
        this.syncCalendar(gStart, gEnd);
      });
      this.isMobile = this.$isMobileDevice;
      var self = this;
      self.cal = $(self.$refs.calendar);
      this.$parent.cal = self.cal;
      var args = {
        firstDay: 1,
        lang: 'vi',
        header: {},
        height: "auto",
        allDaySlot: true,
        slotEventOverlap: false,
        timeFormat: 'HH:mm',
        events: self.events,
        editable: this.editable,
        eventRender: function (event, element) {
          if (self.calendarType === 'birthday') {
            var icon = event.GenderName === 'Nữ' ? 'icon icon-user-female text-danger' : event.GenderName === 'Nam' ? 'icon icon-user' : 'fa fa-genderless';
            element.html('<div class="fc-content" style="cursor: pointer; background-color: ' + event.customdStyle + '"> <span class="fc-title">'
              + '<i class="' + icon + '"></i>&nbsp;&nbsp;&nbsp;'
              + event.Age + '<i class="fa fa-birthday-cake text-warning"></i>&nbsp;&nbsp;&nbsp;'
              + event.title + '</span></div><div class="fc-resizer fc-end-resizer"></div>');

          }
        },
        dayClick: function (date) {
          var dayEvents = self.cal.fullCalendar('clientEvents', function (event) {
            return event.start.format("YYYY-MM-DD") === Vue.moment(date).format("YYYY-MM-DD");
          });
          self.$parent.$emit('day::clicked', {data: date, type: self.calendarType, events: dayEvents});
        },
        eventClick: function (event) {
          self.$parent.$emit('event::clicked', {data: event, type: self.calendarType});
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end) {
          var date = {};
          date.start = start;
          date.end = end;
          self.$parent.$emit('selectday', {data: date, type: self.calendarType});
        },
        eventLimit: true, // for all non-agenda views
        views: {
          agenda: {
            eventLimit: this.isMobile ? 0 : 6// adjust to 6 only for agendaWeek/agendaDay
          }
        },
      };

      if (self.isMobile) {
        this.$set(args, 'eventLimitClick', (cellInfo, jsEvent) => {
          // var start = this.$Utils.formatDateTime(new Date(cellInfo.date), 'YYYY-MM-DDT00:00:00+07:00');
          // var end = this.$Utils.formatDateTime(new Date(cellInfo.date), 'YYYY-MM-DDT23:59:59+07:00');
          // self.$parent.searchTaskByRange(start, end);
          self.$parent.eventList = self.cal.fullCalendar('clientEvents', function (event) {
            return event.start.format("YYYY-MM-DD") === Vue.moment(cellInfo.date).format("YYYY-MM-DD");
          });
        })
      }

      if (self.editable) {
        args.editable = true;
        args.eventResize = function (event) {
          self.$parent.$emit('event::resized', event);
        };

        args.eventDrop = function (event) {
          self.$parent.$emit('event::dropped', event);
        };
      }

      if (self.droppable) {
        args.droppable = true;
        args.eventReceive = function (event) {
          self.$emit('event::received', event);
        }
      }
      self.cal.fullCalendar(args);
      var view = self.cal.fullCalendar('getView');
      this.viewtitle = view.title;
      var data = {
        start: view.start,
        end: view.end
      };
      this.$parent.$emit('changView', data);
    }
  });

  export default {
    name: 'calendarPage',
    data() {
      return {
        calendarType: 'task',
        isMobile: false,
        eventList: [],
        tasks: [],
        dates: {},
        editable: true,
        droppable: true,
        arrStatus: [],
        Wokers: [{
          Id: '1',
          Name: 'Tất cả'
        }],
        Projects: [
          {
            Id: '1',
            Name: 'Tất cả'
          }
        ],
        SettingForm: [],
        dateText: Vue.moment(new Date()).format("DD-MM-YYYY"),
        taskCal: true
      };
    },
    created() {
      let vm = this;
      this.isMobile = this.$isMobileDevice;
      this.$on('event::dropped', event => {

        if (this.$rootScope.isGoogleCalendar) {
          var start = Vue.moment(event.start, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
          var end = Vue.moment(event.end, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
          var gevent = {
            'id': event.id,
            'summary': event.title,
            'location': event.location,
            'description': event.description,
            'start': {
              'dateTime': utilsLibrary.formatDateTime(start, 'YYYY-MM-DDTHH:mm:ss+07:00')
            },
            'end': {
              'dateTime': utilsLibrary.formatDateTime(end, 'YYYY-MM-DDTHH:mm:ss+07:00')
            }
          };
          if (!event.reminders && event.reminders.overrides.length > 0) {
            this.$set(gevent, 'reminders', event.reminders);
            //gevent.reminders = this.$Lodash.cloneDeep(event.reminders);
          }
          if (utilsLibrary.isEmpty(event.taskId)) {
            gevent.extendedProperties = {
              'private': {
                'xTaskId': event.taskId
              }
            }
          }
          googleService.updateEvent(gevent).then((data) => {
            if (data.status === 'confirmed') {
              this.cal = $(this.$refs.calendar);
              this.$hub.$emit('refreshGoogleCalendar');
              //this.syncCalendar(gStart, gEnd);
              utilsLibrary.showMessage('success', 'Cập nhật dữ liệu thành công');
            } else {
              utilsLibrary.showMessage('error', 'Không thể cập nhập dữ liệu');
              this.$hub.$emit('refreshGoogleCalendar');
              //this.syncCalendar(gStart, gEnd);
            }
          })
        } else {
          var item = this.tasks.find(function (el) {
            return el.Id === event.Id
          });
          var arrChanged = [];
          var obj = {};
          var obj2 = {};
          if (this.$Utils.isEmpty(event.start)) {
            obj.ColumnCaption = 'Ngày bắt đầu';
            obj.ColumnName = 'PlanstartDate';
            obj.NewDisplayValue = event.start.format();
            obj.NewValue = event.start.format();
            obj.OldDisplayValue = vm.$Utils.formatDateTime(item.start, 'DD/MM/YYYY HH:mm');
            obj.OldValue = vm.$Utils.formatDateTime(item.start);
            arrChanged.push(obj);
          }

          if (this.$Utils.isEmpty(event.end)) {
            obj2.ColumnCaption = 'Ngày kết thúc';
            obj2.ColumnName = 'Deadline';
            obj2.NewDisplayValue = event.end.format();
            obj2.NewValue = event.end.format();
            obj2.OldDisplayValue = vm.$Utils.formatDateTime(item.end, 'DD/MM/YYYY HH:mm');
            obj2.OldValue = vm.$Utils.formatDateTime(item.end);
            arrChanged.push(obj2);
          }
          var request = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: 1,
            R1_RequestTemplate: 'AG_Task_Task.Update',
            R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
            R1_RequestFields: 'Id; PlanStartDate; Deadline; FormSetting; Changed',
            R1_Id: event.Id,
            R1_Changed: JSON.stringify(arrChanged),
            R1_FormSetting: JSON.stringify(vm.SettingForm),
          };
          if (this.$Utils.isEmpty(event.end)) {
            request['R1_Deadline'] = event.end.format()
          }
          if (this.$Utils.isEmpty(event.start)) {
            request['R1_PlanStartDate'] = event.start.format()
          }
          vm.$Utils.post(request).then(response => {
            if (response.R1.success) {
              var eventtemp = event;
              eventtemp.start = this.$Utils.formatDateTime(event.start, 'YYYY-MM-DD HH:mm:ss');
              eventtemp.end = this.$Utils.formatDateTime(event.end, 'YYYY-MM-DD HH:mm:ss');
              this.tasks[item] = event;
            }
          })
        }
      });
      this.$on('event::clicked', passedData => {
        var event = passedData.data;
        if (this.$rootScope.isGoogleCalendar) {
          var datatopass = {
            calendarEvent: this.$Lodash.cloneDeep(event.task),
            type: "edit"
          };

          this.$hub.$emit(
            "set-modal-data",
            "Chi tiết công việc",
            "40%",
            true,
            "center",
            GoogleCalendarDialog,
            true, '', datatopass
          );
        } else {
          if (passedData.type === 'task') {
            this.$hub.$emit(
              "set-modal-data",
              "Chi tiết công việc",
              "60%",
              true,
              "center",
              ShowTaskDetail,
              true, '', {Id: event.Id}
            );
          } else if (passedData.type === 'birthday') {
            this.$hub.$emit(
              "set-modal-data",
              "Thông tin chi tiết",
              "40%",
              true,
              "center",
              ProfileDetail,
              true, '', {Id: event.Id, type: event.type}
            );
          }
        }
      });
      this.$on('event::resized', event => {
        if (this.$rootScope.isGoogleCalendar) {
          var start = Vue.moment(event.start, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
          var end = Vue.moment(event.end, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
          var gevent = {
            'id': event.id,
            'summary': event.title,
            'location': event.location,
            'description': event.Description,
            'start': {
              'dateTime': utilsLibrary.formatDateTime(start, 'YYYY-MM-DDTHH:mm:ss+07:00')
            },
            'end': {
              'dateTime': utilsLibrary.formatDateTime(end, 'YYYY-MM-DDTHH:mm:ss+07:00')
            }
          };
          if (!event.reminders && event.reminders.overrides.length > 0) {
            this.$set(gevent, 'reminders', event.reminders);
            //gevent.reminders = this.$Lodash.cloneDeep(event.reminders);
          }
          if (utilsLibrary.isEmpty(event.taskId)) {
            gevent.extendedProperties = {
              'private': {
                'xTaskId': event.taskId
              }
            }
          }
          googleService.updateEvent(gevent).then((data) => {
            if (data.status === 'confirmed') {
              this.$hub.$emit('refreshGoogleCalendar');
              utilsLibrary.showMessage('success', 'Cập nhật dữ liệu thành công');
            } else {
              this.$hub.$emit('refreshGoogleCalendar');
              utilsLibrary.showMessage('error', 'Không thể cập nhập dữ liệu');
            }
          })
        } else {
          var item = this.tasks.find(function (el) {
            return el.Id == event.Id
          });
          var arrChanged = [];
          var obj = {};
          var obj2 = {};
          obj.ColumnCaption = 'Ngày bắt đầu';
          obj.ColumnName = 'PlanstartDate';
          obj.NewDisplayValue = event.start.format();
          obj.NewValue = event.start.format();
          obj.OldDisplayValue = vm.$Utils.formatDateTime(item.start);
          obj.OldValue = vm.$Utils.formatDateTime(item.start);
          arrChanged.push(obj);
          obj2.ColumnCaption = 'Ngày kết thúc';
          obj2.ColumnName = 'Deadline';
          obj2.NewDisplayValue = event.end.format();
          obj2.NewValue = event.end.format();
          obj2.OldDisplayValue = vm.$Utils.formatDateTime(item.end);
          obj2.OldValue = vm.$Utils.formatDateTime(item.end);
          arrChanged.push(obj2);
          var request = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: 1,
            R1_RequestTemplate: 'AG_Task_Task.Update',
            R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
            R1_RequestFields: 'Id; PlanStartDate; Deadline; FormSetting; Changed',
            R1_Id: event.Id,
            R1_PlanStartDate: event.start.format(),
            R1_Deadline: event.end.format(),
            R1_Changed: JSON.stringify(arrChanged),
            R1_FormSetting: JSON.stringify(vm.SettingForm),
          }
          vm.$Utils.post(request).then(response => {
            if (response.R1.success) {
              var eventtemp = event;
              eventtemp.start = this.$Utils.formatDateTime(event.start, 'YYYY-MM-DD HH:mm:ss');
              eventtemp.end = this.$Utils.formatDateTime(event.end, 'YYYY-MM-DD HH:mm:ss');
              this.tasks[item] = event;
            }
          })
        }
      });
      this.$on("day::clicked", passedData => {
        var view = vm.cal.fullCalendar('getView');
        this.dateText = Vue.moment(passedData.data).format('DD-MM-YYYY');
        if (passedData.type === 'task') {
          var date = passedData.data;
          vm.eventList = [];
          var view = vm.cal.fullCalendar('getView');
          //var view = $(vm.$refs.calendar).fullcalendar('getView');
          if (vm.isMobile && view.name === 'month') {
            // vm.searchTaskByRange(new Date(date), new Date(date));
            vm.eventList = vm.$Lodash.cloneDeep(passedData.events);
          } else {
            if (this.$rootScope.isGoogleCalendar) {
              var datatopass = {
                calendarEvent: {
                  "summary": "",
                  "location": "",
                  "description": "",
                  "reminders": {
                    useDefault: "false",
                    overrides: []
                  },
                  "start": {
                    "dateTime": this.$Utils.formatDateTime(new Date(date), 'YYYY-MM-DDTHH:mm:ss+07:00')
                  },
                  "end": {
                    "dateTime": this.$Utils.formatDateTime(new Date(date), 'YYYY-MM-DDTHH:mm:ss+07:00')
                  }
                },
                type: "add"
              };
              this.$hub.$emit(
                "set-modal-data",
                "Chi tiết công việc",
                "40%",
                true,
                "center",
                GoogleCalendarDialog,
                true, '', datatopass
              );

            } else {
              var event = {
                PlanStartDate: this.$Utils.formatDateTime(date),
                Deadline: this.$Utils.formatDateTime(date)
              }
              var dataToPass = {
                Name: 'AG_Task_Task',
                Code: 'Form.task.0d1c1',
                Description: {DataSource: 'AG_Task_TaskDataGroup.danh-sach-cong-viec.04b66'}
              };
              var data = {
                "url": 'task-report-page',
                "RootData": dataToPass.Description.DataSource,
                "DataSource": dataToPass.Name,
                "DataGroup": dataToPass.Name,
                "ElementType": "Popup",
                "ModuleCode": dataToPass.Code,
                "parentSetting": {
                  "object": event,
                  "set": {
                    "ElementType": "Popup",
                    "GetFullData": "true"
                  },
                  "isCall": true,
                  "loadCalendar": true
                },
                "ModuleType": "Form"
              }
              //this.$hub.$emit("open-modal");
              this.$hub.$emit(
                "set-modal-data",
                "Tạo công việc",
                "60%",
                true,
                "center",
                DynamicPage,
                true,
                '',  {
            Template: 'Modal',
            Module: [data]
          }, false
              );
            }
          }
        }
        else {
          if (vm.isMobile && view.name === 'month') {
            vm.eventList = vm.$Lodash.cloneDeep(passedData.events);
          }
        }
      });
      this.$on('selectday', passedData => {
        if (passedData.type === 'task') {
          if (!vm.isMobile) {
            if (this.$rootScope.isGoogleCalendar) {
              var data = passedData.data;
              this.dateText = Vue.moment(data.start).format('DD-MM-YYYY');
              var start = Vue.moment(data.start, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
              var end = Vue.moment(data.end, 'YYYY-MM-DDTHH:mm:ss+07:00').format();
              var datatopass = {
                calendarEvent: {
                  "summary": "",
                  "location": "",
                  "description": "",
                  "reminders": {
                    useDefault: "false",
                    overrides: []
                  },
                  "start": {
                    "dateTime": this.$Utils.formatDateTime(start, 'YYYY-MM-DDTHH:mm:ss+07:00')
                  },
                  "end": {
                    "dateTime": this.$Utils.formatDateTime(end, 'YYYY-MM-DDTHH:mm:ss+07:00')
                  }
                },
                type: "add"
              };

              this.$hub.$emit(
                "set-modal-data",
                "Chi tiết công việc",
                "40%",
                true,
                "center",
                GoogleCalendarDialog,
                true, '', datatopass
              );
            } else {
              var data = passedData.data;
              var event = {
                PlanStartDate: data.start.format(),
                Deadline: data.end.format(),
              }
              var dataToPass = {
                Name: 'AG_Task_Task',
                Code: 'Form.task.0d1c1',
                Description: {DataSource: 'AG_Task_TaskDataGroup.danh-sach-cong-viec.04b66'}
              };
              var dataD = {
                "url": 'task-report-page',
                "RootData": dataToPass.Description.DataSource,
                "DataSource": dataToPass.Name,
                "DataGroup": dataToPass.Name,
                "ElementType": "Popup",
                "ModuleCode": dataToPass.Code,
                "parentSetting": {
                  "object": event,
                  "set": {
                    "ElementType": "Popup",
                    "GetFullData": "true"
                  },
                  "isCall": true,
                  "loadCalendar": true
                },
                "ModuleType": "Form"
              };
              // alert(dataD)
              // this.$hub.$emit("open-modal");
              this.$hub.$emit(
                "set-modal-data",
                "Tạo công việc",
                "60%",
                true,
                "center",
                DynamicPage,
                true,
                '',  {
            Template: 'Modal',
            Module: [dataD]
          }, false
              );
            }
          }
        }
      });
      this.$on('changView', data => {
        this.dates = data;
        vm.searchTask(data.start, data.end)
      });
      this.$on('prev', data => {
        this.dates = data;
        vm.searchTask(data.start, data.end)
      });
      this.$on('next', data => {
        this.dates = data;
        vm.searchTask(data.start, data.end)
      });
      this.$hub.$on('loadCalendar', task => {
        var vm = this;
        var startD = task.PlanStartDate;
        var endD = task.Deadline;
        if (startD === endD && startD.substr(11, 8) !== '00:00:00') {
          let tomorrow = Vue.moment(new Date(endD)).add(30, 'minutes');
          endD = vm.$Utils.formatDateTime(tomorrow);
        }
        if (startD === endD && startD.substr(11, 8) === '00:00:00') {
          var isAllDay = "true";
        } else {
          var isAllDay = "false";
        }
        ;
        var startDate = vm.$Utils.formatDateTime(startD, 'YYYY-MM-DD HH:mm:ss');
        var endDate = vm.$Utils.formatDateTime(endD, 'YYYY-MM-DD HH:mm:ss');
        var tasklist = vm.$Lodash.cloneDeep(vm.tasks);
        var newevent = {
          "Id": task.Id,
          "Index": task.Index,
          "title": task.Name,
          "start": startDate,
          "end": endDate,
          "allDay": isAllDay ? isAllDay : "false",
          "className": "",
          "color": vm.arrStatus[task.Status],
          "textColor": "#000",
          "Worker": task.Worker,
          "VersionProject": task.VersionProject,
          "Status": task.Status,
          "task": task
        }
        var taskTemp = tasklist.find(x => x.Id === newevent.Id);
        if (vm.$Utils.isEmpty(taskTemp)) {
          var idx = tasklist.indexOf(taskTemp);
          tasklist[idx] = newevent;
        }
        else {
          tasklist.push(newevent);
        }
        vm.tasks = tasklist;
      });
    },
    methods: {
      openBirthdayInfoDialog(item){
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin chi tiết",
          "40%",
          true,
          "center",
          ProfileDetail,
          true, '', {Id: item.Id, type: item.type}
        );
      },
      openTaskInfoDialog(task) {
        this.$hub.$emit(
          "set-modal-data",
          "Chi tiết công việc",
          "60%",
          true,
          "center",
          ShowTaskDetail,
          true, '', task
        );
      },
      searchTask(start, end) {
        let vm = this;
        vm.editable = true;
        var lstWokers = [{
          Id: '1',
          Name: 'Tất cả'
        }];
        var lstProjects = [
          {
            Id: '1',
            Name: 'Tất cả'
          }
        ];
        this.calendarType = 'task';
        var requestTask = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'AG_Task_Task.Search',
          R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
          R1_RequestFields: 'Id;Index;Deadline;Name;PlanStartDate;PlanEndDate;Worker;VersionProject;Status;WorkerName;VersionProjectName',
          R1_AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
          R1_PlanStartDateStartValue: Vue.moment(start).format('YYYY-MM-DD') + 'T00:00:00',
          R1_PlanStartDateEndValue: Vue.moment(end).format('YYYY-MM-DD') + 'T23:59:59',
        };
        // this.$Utils.showLoading("start");
        this.$Utils.postCheckResult(requestTask).then(response => {
          var lstTask = this.$Utils.getDataWithRoot(response.R1, 'Data.TasksDS.Task'); //response.R1.Data.TasksDS.Task;
          if (this.$Utils.isEmpty(lstTask)) {
            var taskList = lstTask.map((task) => {
              var startD = task.PlanStartDate;
              var endD = task.Deadline;
              if (startD == endD && startD.substr(11, 8) !== '00:00:00') {
                let tomorrow = Vue.moment(new Date(endD)).add(30, 'minutes');
                endD = vm.$Utils.formatDateTime(tomorrow);
              }
              if (startD === endD && startD.substr(11, 8) === '00:00:00') {
                var isAllDay = "true";
              } else {
                var isAllDay = "false";
              }
              ;
              var startDate = vm.$Utils.formatDateTime(startD, 'YYYY-MM-DD HH:mm:ss');
              var endDate = vm.$Utils.formatDateTime(endD, 'YYYY-MM-DD HH:mm:ss');
              if (vm.$Utils.isEmpty(task.Worker)) {
                var objectWoker = lstWokers.find(x => x.Id === task.Worker);
                if (!vm.$Utils.isEmpty(objectWoker)) {
                  lstWokers.push({Id: task.Worker, Name: task.WorkerName});
                }
              }
              if (vm.$Utils.isEmpty(task.VersionProject)) {
                var objectProject = lstProjects.find(x => x.Id === task.VersionProject);
                if (!vm.$Utils.isEmpty(objectProject)) {
                  lstProjects.push({Id: task.VersionProject, Name: task.VersionProjectName});
                }
              }
              return {
                "Id": task.Id,
                "Index": task.Index,
                "title": task.Name,
                "start": startDate,
                "end": endDate,
                "allDay": isAllDay ? isAllDay : false,
                "className": "",
                "color": vm.arrStatus[task.Status],
                "textColor": "#000",
                "Worker": task.Worker,
                "VersionProject": task.VersionProject,
                "Status": task.Status,
                "task": task,
                "workerName": task.WorkerName
              }
            });
            vm.tasks = taskList;
            vm.Wokers = lstWokers;
            vm.Projects = lstProjects;
          }
          else {
            this.tasks = [];
            if (vm.$isMobileDevice) {
              //vm.searchTaskByRange(new Date(), new Date(), false);
              vm.eventList = [];
            }
          }
          //this.$Utils.showLoading("stop");
        })

      },
      searchTaskByRange(start, end, isShowLoading) {
        this.editable = true;
        if (isShowLoading === undefined)
          isShowLoading = true;
        this.dateText = Vue.moment(start).format('DD-MM-YYYY');
        var requestTask = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'AG_Task_Task.Search',
          R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
          R1_RequestFields: 'Id;Index;Deadline;Name;PlanStartDate;PlanEndDate;Worker;VersionProject;Status;WorkerName;VersionProjectName',
          R1_AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
          R1_PlanStartDateStartValue: Vue.moment(start).format('YYYY-MM-DD') + 'T00:00:00',
          R1_PlanStartDateEndValue: Vue.moment(end).format('YYYY-MM-DD') + 'T23:59:59',
          SessionId: this.$getItemLocalStorage(this.$localStorageConstant.SessionId)
        }
        if (isShowLoading) {
          this.$Utils.postCheckResult(requestTask).then(response => {
            this.eventList = this.$Utils.getDataWithRoot(response.R1, 'Data.TasksDS.Task');
          })
        } else {
          this.$Utils.post(requestTask).then(response => {
            this.eventList = this.$Utils.getDataWithRoot(response.R1, 'Data.TasksDS.Task');
          })
        }
      },
      getEmployeeBirthday(calendar, clear) {
        var ctrl = this;
        if (clear) {
          ctrl.tasks = [];
        }
        ctrl.editable = false;
        var view = calendar.fullCalendar('getView');
        var parameter = {
          RequestAction: 'SearchUsers',
          RequestClass: 'BPM',
          ConditionFields: 'IncludedGroupManager;Group;Status;LoginName;UserId,Status',
          StaticFields: 'UserId;Username;Description;Status;',
          DynamicFields: 'Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone',
          StructFields: 'GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRootName;GroupManage;Notification',
          Status: 1
        };
        utilsLibrary.post(parameter).then((data) => {
          data = utilsLibrary.getDataWithRoot(data, 'Data.UserDS.User');
          $.each(data, (k, value) => {
            var birthday = new Date(value.Birthday);
            var startDate = new Date();
            if (view.start._d.getFullYear() !== view.end._d.getFullYear()) {
              startDate = (eval(new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) >= view.start._d)
                && eval(new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) <= view.end._d)) ?
                new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) :
                new Date(view.end._d.getFullYear(), birthday.getMonth(), birthday.getDate())
            } else {
              startDate = new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate());
            }
            value.Age = startDate.getFullYear() - birthday.getFullYear();
            var item = {
              "Id": value.UserId,
              "Age": value.Age,
              "title": value.Username,
              "start": startDate,
              "allDay": true,
              "textColor": "#fff",
              "GenderName": value.GenderName,
              "type": "employee",
              "customdStyle": "#ff9d59",
              editable: false
            };
            if (value.Birthday !== undefined && value.Birthday !== 'Invalid date' && value.LoginName !== 'superadmin' && value.LoginName !== 'admin') {
              ctrl.tasks.push(item)
            }
          });
        });
      },
      getCustomerBirthday(calendar, clear) {
        var ctrl = this;
        if (clear) {
          ctrl.tasks = [];
        }
        ctrl.editable = false;
        var view = calendar.fullCalendar('getView');
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'xProfile_Profile.SearchBirthday',
          R1_RequestDataGroup: 'DataGroup.khach-hang.0c3b1',
          R1_RequestFields: 'Id,Name;Birthday;GenderName;',
          R1_ConditionFields: 'BirthdayStartValue;BirthdayEndValue',
          R1_BirthdayStartValue: utilsLibrary.formatDateTime(view.start._d, 'YYYY-MM-DDT00:00:00+07:00'),
          R1_BirthdayEndValue: utilsLibrary.formatDateTime(view.end._d, 'YYYY-MM-DDT00:00:00+07:00'),
          R1_Code: 'Customer',
        }
        utilsLibrary.post(request).then(data => {
          data = utilsLibrary.getDataWithRoot(data.R1, 'Data.ProfileDS.Profile');
          $.each(data, (k, value) => {
            var birthday = new Date(value.Birthday);
            var startDate = new Date();
            if (view.start._d.getFullYear() !== view.end._d.getFullYear()) {
              startDate = (eval(new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) >= view.start._d)
                && eval(new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) <= view.end._d)) ?
                new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate()) :
                new Date(view.end._d.getFullYear(), birthday.getMonth(), birthday.getDate())
            } else {
              startDate = new Date(view.start._d.getFullYear(), birthday.getMonth(), birthday.getDate());
            }
            value.Age = startDate.getFullYear() - birthday.getFullYear();

            var item = {
              "Id": value.Id,
              "Age": value.Age,
              "title": value.Name,
              "start": startDate,
              "allDay": true,
              "textColor": "#fff",
              "GenderName": value.GenderName,
              "type": "customer",
              "customdStyle": "#76526c;",
              "type": 'customer',
              editable: false
            }
            ctrl.tasks.push(item);
          });
        });
      },
      getBirthday(calendar) {
        this.tasks = [];
        this.calendarType = 'birthday';
        this.getEmployeeBirthday(calendar, false);
        this.getCustomerBirthday(calendar, false);
        // var view = calendar.fullCalendar('getView');
        // this.eventList = this.cal.fullCalendar('clientEvents', function (event) {
        //   return event.start.format("YYYY-MM-DD") === Vue.moment(view.start).format("YYYY-MM-DD");
        // });
      }
    },
    watch: {
      tasks: function (newVal) {
        this.tasks = newVal;
      },
      Wokers: function (newVal) {
        this.Wokers = newVal;
      },
      Projects: function (newVal) {
        this.Projects = newVal;
      }

    },
    mounted() {
      var vm = this;
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: 1,
        R1_RequestTemplate: 'Setting.SearchBase',
        R1_ParentCode: 'xSystem.Setting.xTask.Status'
      };
      this.$Utils.post(request).then(response => {
        var data = vm.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        var listColor = [];
        $.each(data, function (index, value) {
          listColor[value.Id] = value.Color
        })
        vm.arrStatus = listColor;
      });
    }
  };

</script>

<style lang="scss">
  .calendarCom {
    .wrapper {
      margin: 2rem;
    }

    .listEventDiv {

      overflow: auto;
      .el-card__body {
        padding: 5px;
        em {
          display: block;
        }
      }

      .link {
        text-decoration: underline;
        color: #0c5480;
      }

      .centerText {
        text-align: center;
        vertical-align: middle;
      }

      .el-main {
        max-height: 300px;
        padding: 0px;
        min-height: 100px;
      }

      .el-header {
        height: auto !important;
        background: #fff;
        padding: 5px;
        font-weight: bold;
      }
    }

    .title-box {
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
    }

    .btn {
      background-color: #f0f3f5 !important;
    }

    .fc-unthemed .fc-header-toolbar {
      display: none
    }

    .fc-toolbar.fc-header-toolbar {
      margin-bottom: 0px;
    }

    .fc-more {
      text-transform: capitalize;
    }

    .statusArray .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #5a5e66;
    }

    .el-checkbox {
      margin-left: 6px !important;
    }

    .status-check {
      .el-select {
        width: 100%;
      }

      .el-checkbox {
        margin-top: .5rem;
      }
    }

    .calendar-filter {

      .agendar {
        .el-select {
          width: 80px;
        }
      }

      .el-button {
        width: 80px;
      }

    }
  }
</style>
