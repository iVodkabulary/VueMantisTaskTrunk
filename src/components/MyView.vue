<template>
  <div class="myView">

      <slick ref="slick" :options="slickOptions" v-if="listStatus && listStatus.length > 0">
        <div class="card" v-for="item in listStatus" :key="item.Id">
          <div class="card-header" :style="item.styleObject">{{item.Name}}</div>
          <div class="card-body text-center">
            <el-tooltip :content="item.Content" placement="top" effect="light">
              <el-progress type="circle" :percentage="item.Percent" :width="$isMobileDevice && !$isMobile.iPad()?50:100"></el-progress>
            </el-tooltip>
          </div>
          <div class="card-footer text-center p-0">
            <a @click="redirectStatus(item.Id)">Xem thêm </a>
            <!-- <button type="button" class="btn btn-light" @click="showDetail(item.Id)" ></button> -->
          </div>
        </div>
      </slick>

    <div class="row">
      <div class="col-md-8">
        <div v-if="viewModel.map" v-for="group in viewModel.map" :key="group.Id">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :name="group.name">
              <template slot="title">
                 <div class="title-box">
                  <i :class="'fa fa-lg fa-list-alt ' + ($isMobileDevice ? 'ml-1 mr-1' : ' ml-3 mr-3')"></i>
                  <span :class="$isMobileDevice?'': 'h5'">{{group.display}}</span>
                  <span class="ml-1 bg-secondary px-2 " style="border-radius:10px;">
                    {{viewModel.numberIndex?viewModel.numberIndex[group.name]:0}}/{{viewModel.total?viewModel.total[group.name]:0}}
                  </span>
                  <el-button :class="!$isMobileDevice ? 'mt-2' : 'mt-1'" style="float:right;" :style="$isMobileDevice ? 'padding-top: 3px; padding-bottom: 3px;': '' " @click.stop="showDetailTask(group.name)" round v-if="viewModel.dataSource[group.name] && viewModel.dataSource[group.name].length > 0">
                    <span v-if="!$isMobileDevice">Xem thêm</span>
                    <i v-else class="fa fa-ellipsis-h" aria-hidden="true"></i>
                  </el-button>
                </div>
              </template>
              <el-row class="contentTask" v-if="viewModel.dataSource[group.name]" v-for="task in viewModel.dataSource[group.name]" :key="task.Id" style="width: 100%;">
                <el-col :span="$isMobileDevice ? 4 : 3">

                    <div class="text-center">{{task.Index}}</div>
                    <div class="m-0  mt-1 row">

                        <el-tooltip :content="task.StatusName" placement="bottom">
                          <i class="fa fa-square pl-2" :style="'color:' + arrStatusColor[task.Status]"></i>
                        </el-tooltip>
                        <el-tooltip :content="task.PriorityIdName" placement="bottom">

                          <i v-if="task.PriorityIdName == 'khẩn cấp'" class="fa fa-exclamation-triangle text-danger pl-2"></i>
                          <i v-if="task.PriorityIdName == 'cao'" class="fa fa-chevron-up text-danger pl-2" ></i>
                          <i v-if="task.PriorityIdName == 'thường'" class="fa fa-minus text-warning pl-2" ></i>
                          <i v-if="task.PriorityIdName == 'thấp'" class="fa fa-chevron-down text-secondary  pl-2" ></i>

                        </el-tooltip>
                        <el-tooltip content="Chỉnh sửa" placement="bottom">
                          <router-link class="fa fa-pencil pl-2" :to="'/dynamic/view/Index='+task.Index">
                          </router-link>
                         </el-tooltip>

                    </div>

                </el-col>
                <el-col :span="$isMobileDevice ? 20 : 21">
                  <div class="rightContentTask pl-3">
                    <div style="max-height: 45px;">
                      <router-link :to="'/dynamic/view/Index='+task.Index"> {{task.Name}}</router-link>
                    </div>
                    <div>
                      {{formatDate(task.PlanStartDate)}}&nbsp;|&nbsp;{{task.WorkerName}}
                    </div>
                  </div>
                </el-col>
              </el-row>

            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="col-md-4">
        <div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="Active">
              <template slot="title">
                <div class="title-box"><i class="fa fa-2x fa-clock-o ml-3 mr-3"></i><span class="h4">Hoạt động</span></div>
              </template>
              <div class="row">
                <div class="scrollActive">
                  <div class="timeline">
                    <div>
                      <div class="line text-muted"></div>
                      <article v-if="listTaskTimeline" class="panel panel-primary" v-for="item in listTaskTimeline" :key="item.Id">
                        <!-- Icon -->
                        <div class="panel-heading icon">
                          <i v-if="item.eType == 'CREATED'" class="fa fa-lg fa-calendar-plus-o"></i>
                          <i v-if="item.eType == 'UPDATED'" class="fa fa-lg fa-calendar-check-o"></i>
                          <i v-if="item.eType == 'COMMENTED'" class="fa fa-lg fa-commenting-o"></i>
                          <i v-if="item.eType == 'REPLIED'" class="fa fa-lg fa-comments-o"></i>
                        </div>
                        <!-- /Icon -->
                        <div class="card-timeline">
                          <div class="row m-0 p-0">
                            <div class="col-3 pl-1 text-center mt-3">
                              <img class="timeline-avatar rounded-circle" :alt="item.WorkerName"  :src="item.Avatar">
                              <!--
                              <img class="timeline-avatar rounded-circle" :alt="item.WorkerName" v-show="!item.Avatar" src="../assets/images/avatars/profile.png">
                              -->
                            </div>
                            <div class="col-9 pl-0">
                              <div class="tl-contentName"><span>{{item.WorkerName}} <b>{{item.Type}} </b>({{item.eType}})</span></div>
                              <div class="tl-contentDate">{{getDayName(item.Date)}} <span>ngày </span>{{formatDate(item.Date)}}</div>
                            </div>
                            <div class="m-2">
                              <router-link :to="'/dynamic/view/Index='+item.Index"> {{item.Name}}</router-link>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>

              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import Vue from "vue";
import Slick from "vue-slick";
import "../../node_modules/slick-carousel/slick/slick.css";

export default {
  components: {
    Slick
  },
  data() {
    return {
      base: this.$appUri.BaseURL === "/" ? "" : this.$appUri.BaseURL,
      intervalHistory: {},
      showCollapse: true,
      slickOptions: {
        slidesToShow: !this.$isMobileDevice ? 6 : 4,
        slidesToScroll: 1,
        infinite: true
        // Any other options that can be got from plugin documentation
      },
      listStatus: [],
      activeNames: [
        "Knows",
        "Reference",
        "Worker",
        "CreatedBy",
        "Date",
        "Dealine",
        "Resolved",
        "Active"
      ],
      redirectUrl: "",
      UserInfor: JSON.parse(this.$Utils.getUserInfo()),
      viewModel: {
        userId: "",
        dataSource: {
          Worker: [],
          CreatedBy: [],
          Resolved: [],
          date: [],
          Knows: [],
          Dealine: []
        },
        defaultRecord: 10,
        loading: {},
        limit: {
          Worker: { current: 1, total: 0 },
          // Manager: { current: 1, total: 0 },
          CreatedBy: { current: 1, total: 0 },
          Resolved: { current: 1, total: 0 },
          Date: { current: 1, total: 0 },
          Knows: { current: 1, total: 0 },
          Reference: { current: 1, total: 0 },
          Dealine: { current: 1, total: 0 }
        },
        /* prefix: isMobile.iOS() ? '/' : '',*/
        map: [
          { name: "Knows", lable: "Knows", display: " Tôi theo dõi" },
          { name: "Reference", lable: "Reference", display: " Tôi liên quan" },
          {
            name: "Worker",
            lable: "Worker",
            display: " Tôi nhận (chưa giải quyết)"
          },
          { name: "CreatedBy", lable: "CreatedBy", display: " Tôi tạo ra" },
          { name: "Dealine", lable: "Worker", display: " Công việc đến hạn" },
          { name: "Resolved", lable: "Worker", display: " Hoàn thành" },
          {
            name: "Date",
            lable: "Knows",
            display: " Chỉnh sửa gần đây (30 Ngày)"
          }
          // { name: 'Manager', lable: 'Manager', display: ' Chưa gán cho ai' }
        ]
      },
      listTaskTimeline: [],
      idToIndex: [],
      taskIndexTemp: [],
      taskIndexName: [],
      taskIndexContent: [],
      datasource: [],
      listSubscribe: [],
      indexx: 1,
      endIndex: 30,
      viewModelGroup: [],
      listStatuss: [],
      baseList: [],
      lists: [],
      data: [],
      total: 0,
      percent: 0,
      viewModel: {
        map: {},
        dataSource: {},
        loading: {},
        numberIndex: {},
        total: {},
        Name: {},
        limit: {},
        listStatus: {}
      },
      start: "", //this.$Utils.getDateTimeByKey('WeekStart'),
      end: "", //this.$Utils.getDateTimeByKey('WeekEnd'),
      requestDatetimeFormat: "YYYY-MM-DDThh:mm:ss",
      arrStatusColor: [],
      model: {}
    };
  },
  methods: {
    redirectStatus(data) {
      //?Status=db8e700c-78c6-4f35-9477-36e0335888f5&PlanStartDateStartValue=2017-12-25T00:00:00&PlanStartDateEndValue=2017-12-31T23:59:59
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var project = currentUser.Project && currentUser.Project.GroupId? currentUser.Project.GroupId: '';
      var query = {
        Status: data,
        Project: project,
        // PlanStartDateStartValue: this.start,
        // PlanStartDateEndValue: this.end
      };

      //var ctrl = this;
      // ctrl.viewModel.url = ctrl.viewModel.prefix + 'dynamic/view-all-task-page?';
      //var filterObject = {};
      //filterObject['Status'] = data;
      //filterObject['PlanStartDateStartValue'] = ctrl.start;
      //filterObject['PlanStartDateEndValue'] = ctrl.end;
      if (!this.$isMantisAdmin() && !this.$isSystemAdmin()) {
        query;
        query["Worker"] = this.$Utils.getUserInfo("UserId");
        query["WorkerName"] = this.$Utils.getUserInfo("Username");
      }
      this.$router.push({ path: "/dynamic/view-all-task-page", query });
      //ctrl.viewModel.url += utilsLibrary.objectToString(filterObject);
    },
    moment: function(date) {
      return Vue.moment(date);
    },
    formatDate: function(date) {
      return Vue.moment(date).format("DD/MM/YYYY  h:mm");
    },
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
    showDetailStatus(id) {
      var ctrl = this;
      this.$router.push({
        path: "list",
        query: {
          Status: id,
          PlanStartDateStartValue: ctrl.start,
          PlanStartDateEndValue: ctrl.end,
          Worker:
            !ctrl.$isMantisAdmin() && !ctrl.$isSystemAdmin()
              ? ctrl.UserInfor.UserId
              : "",
          WorkerName:
            !ctrl.$isMantisAdmin() && !ctrl.$isSystemAdmin()
              ? ctrl.UserInfor.Username
              : ""
        }
      });
    },
    showDetailTask(code) {
      var vm = this;
      var filterObject = {};
      if (code != "Date") {
        filterObject.PlanStartDateStartValue = vm.start;
        filterObject.PlanStartDateEndValue = vm.end;
      }
      if (code == "Worker" || code == "CreatedBy") {
        filterObject[code] = this.UserInfor.UserId;
        filterObject[code + "Name"] = this.UserInfor.Username;
      }
      $.each(this.model[code], function(k, v) {
        if (vm.$Lodash.isObject(v)) {
          filterObject[k] = vm.$Utils.formatDateTime(v);
        } else if (vm.$Lodash.isString(v) && v != "") {
          filterObject[k] = v;
        }
        /* this.$Lodash.isObject(key)*/
      });
      if (code == "Dealine") {
        filterObject["Worker"] = vm.UserInfor.UserId;
      }
      if (code == "Manager") {
        $.each(this.viewModel.datasource[code], function(k, v) {
          if (!vm.$Utils.isEmpty(filterObject, "Id")) {
            filterObject["Id"] = "";
          }
          filterObject["Id"] += v.Id + ";";
        });
      }

      this.$router.push({
        path: "/dynamic/view-all-task-page",
        query: filterObject
      });
    },
    handleChange() {},
    // search history
    SearchHistory(s, e) {
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      if (currentUser.Project.GroupId) {
        var startIndex = s ? s : 0;
        var endIndex = e ? e : this.endIndex;
        var taskRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "AG_Task_Task.Search",
          R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
          R1_RequestFields: "Id;Index;Name;Content",
          R1_StartIndex: startIndex,
          R1_EndIndex: endIndex,
          R1_RequestOrderFields: "Modified DESC",
          R1_AssignedUser: sessionId
        };
        //$scope.formData = {};
        this.idToIndex = [];
        this.taskIndexTemp = [];
        this.taskIndexName = [];
        this.taskIndexContent = [];

        this.$Utils.post(taskRequest).then(taskdata => {
          var taskList = this.$Utils.getDataWithRoot(
            taskdata,
            "R1.Data.TasksDS.Task"
          );
          $.each(taskList, (key, task) => {
            this.idToIndex.push(task.Id);
            this.taskIndexTemp[task.Id] = {
              index: task.Index,
              name: task.Name
            };
          });
          this.taskIndex = this.taskIndexTemp;
          this.taskName = this.taskIndexName;
          if (this.idToIndex.length > 0) {
            var requestH = this.$Lodash.cloneDeep(this.$singleRequest);
            requestH.TotalRequests = this.idToIndex.length;
            for (var i = 1; i <= this.idToIndex.length; i++) {
              requestH["R" + i + "_RequestClass"] = "xBase";
              requestH["R" + i + "_RequestAction"] = "Request";
              requestH["R" + i + "_RequestTemplate"] = "ChangedLogs";
              requestH["R" + i + "_SourceId"] = this.idToIndex[i - 1];
              requestH["R" + i + "_StartIndex"] = 0;
              requestH["R" + i + "_EndIndex"] = 1;
              requestH["R" + i + "_Code"] = "ChangedHistory";
              requestH["R" + i + "_RequestOrderFields"] = "Created DESC";
            }
            //this.test = [];
            var temp = [];
            this.$Utils.post(requestH).then(data => {
              for (var i = 1; i <= this.idToIndex.length; i++) {
                var item = this.$Utils.getDataWithRoot(
                  data["R" + i],
                  "Data.DataDS.Logs"
                );
                if (item[0]) temp.push(item[0]);
              }
              if (
                this.datasource.length == 0 ||
                this.datasource.length != temp.length
              ) {
                this.datasource = temp;
              } else {
                $.each(this.datasource, (key, value) => {
                  temp = temp.filter(el => {
                    return (
                      el.Id != value.Id &&
                      new Date(el.Created).getTime() >
                        new Date(value.Created).getTime()
                    );
                  });
                });
                if (temp.length > 0) {
                  $.each(temp, (key1, value1) => {
                    this.datasource.pop();
                    this.datasource.unshift(value1);
                  });
                } else {
                  return;
                }
              }
              //get avatar
              var arrLoginNames = [];
              var request = {
                RequestAction: "SearchUsers",
                RequestClass: "BPM",
                RequestDataType: "json",
                StaticFields: "LoginName",
                DynamicFields: "Avatar",
                ConditionFields: "LoginName",
                LoginName: arrLoginNames.toString()
              };
              this.$Utils.post(request).then(users => {
                users = this.$Utils.getDataWithRoot(users, "Data.UserDS.User");
                $.each(this.datasource, (key, source) => {
                  $.each(users, (key, user) => {
                    if (user.UserId === source.CreatedBy) {
                      source.Avatar = user.Avatar;
                      // user.Avatar != undefined
                      //   ? this.$appUri.BaseURL + "/" + user.Avatar.substring(1) + "&Height=50&Width=50"
                      //   : '../assets/images/avatars/profile.png';
                    }
                  });
                });

                this.listTaskTimeline = $.map(this.datasource, (v, i) => {
                  if (this.readHistory(v) == "CREATED") {
                    var type = "Tạo mới";
                  } else if (this.readHistory(v) == "UPDATED") {
                    var type = "Cập nhật";
                  } else if (this.readHistory(v) == "COMMENTED") {
                    var type = "Bình luận";
                  } else {
                    var type = "Phản hồi";
                  }
                  //console.log(v.Avatar);
                  return {
                    WorkerName: v.CreatedByName,
                    Name: this.taskIndex[v.SourceId].name,
                    Index: this.taskIndex[v.SourceId].index,
                    eType: this.readHistory(v),
                    Type: type,
                    Date: v.Created,
                    Avatar: this.loadAvatar(v.Avatar)
                  };
                });
              });
              var rq = {
                RequestClass: "xBase",
                RequestAction: "Request",
                TotalRequests: 1,
                R1_AssignedPermission: "Subscribe",
                R1_AssignedUser: sessionId,
                R1_RequestTemplate: "AG_Task_Task.Search",
                R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
                R1_RequestFields: "Id;Index",
                R1_RequestOrderFields: "Modified DESC",
                R1_Knows: currentUser.UserId,
                R1_Project: currentUser.Project.GroupId
              };

              this.$Utils.post(rq).then(dataS => {
                dataS = this.$Utils.getDataWithRoot(
                  dataS,
                  "R1.Data.TasksDS.Task"
                );
                $.each(dataS, (key2, value2) => {
                  this.listSubscribe.push(value2.Id);
                });
              });
            });
          }
        });
      }
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
    readHistory(item) {
      try {
        var colName = JSON.parse(item.Changes)[0].ColumnName;
        if (item.Version == 1) return "CREATED";
        else if (colName === "Comment") return "COMMENTED";
        else if (colName === "Reply") return "REPLIED";
        else return "UPDATED";
      } catch (err) {
        return "UPDATED";
      }
    },
    getDayName(item) {
      var dateNow = this.$Utils.formatDateTime(Date.Now, "DD/MM/YYYY");

      if (dateNow === this.$Utils.formatDateTime(item, "DD/MM/YYYY")) {
        var date = new Date();
        var currentDate = new Date(item);
        var t = date - currentDate;
        if (Math.round(t / 60 / 60 / 1000) > 0) {
          return Math.round(t / 60 / 60 / 1000) + " Giờ trước ";
        } else if (Math.round(t / 60 / 1000) <= 0) {
          return "Vừa xong";
        } else {
          return Math.round(t / 60 / 1000) + " Phút trước";
        }
      }
      var yesterday = this.$Utils.formatDateTime(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        "DD/MM/YYYY"
      );
      if (this.$Utils.formatDateTime(item, "DD/MM/YYYY") === yesterday) {
        return "Hôm qua";
      }
      //var date = new Date();
      var date = new Date(item);
      var day = date.getDay();
      var days = new Array(
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật"
      );
      return days[day];
    },
    searchData(data) {
      //var ctrl = this;
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      this.lists = this.$Lodash.cloneDeep(this.baseList);
      this.filter = data;
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
        this.listStatuss = this.$Utils.getDataWithRoot(
          dt.R1,
          "Data.DynamicDS.Setting"
        );
        var arrTemp = [];
        $.each(listStatus, function(k, v) {
          arrTemp[v.Id] = v.Color;
        });
        this.arrStatusColor = arrTemp;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = listStatus.length;
        for (var i = 1; i <= listStatus.length; i++) {
          request["R" + i + "_Status"] = listStatus[i - 1].Id;
          request["R" + i + "_RequestTemplate"] = "AG_Task_Task.Count";
          request["R" + i + "_RequestDataGroup"] =
            "DataGroup.danh-sach-cong-viec.04b66";
          // request['R' + i + '_RequestFields'] = 'PriorityIdName;PlanStartDate;Index;PriorityId;StatusName;';
          request["R" + i + "_PlanStartDateStartValue"] = this.start;
          request["R" + i + "_PlanStartDateEndValue"] = this.end;
          request["R" + i + "_AssignedUser"] = this.$getItemLocalStorage(
            this.$localStorageConstant.SessionId
          );

          if (
            this.$Utils.isEmpty(currentUser.Project, "GroupId") &&
            (!this.$Utils.isEmpty(request["R" + i + "_Project"]) ||
              request["R" + i + "_Project"] === "")
          ) {
            request["R" + i + "_Project"] = currentUser.Project.GroupId;
            // request['R' + i + '_RequestFields'] += 'Project;';
          }

          if (!this.$isMantisAdmin() && !this.$isSystemAdmin()) {
            request["R" + i + "_Worker"] = currentUser.UserId;
          }
        }

        this.$Utils.post(request).then(data => {
          this.Total = 0;
          this.viewModelGroup = [];
          for (var i = 1; i <= listStatus.length; i++) {
            this.data = this.$Utils.getDataWithRoot(data["R" + i], "Data");
            this.data = parseInt(this.data);
            this.Total += this.data;
          }
          for (var i = 1; i <= listStatus.length; i++) {
            this.data = this.$Utils.getDataWithRoot(data["R" + i], "Data");
            this.data = parseInt(this.data);
            if (this.Total == 0) {
              this.Percent = 0;
            } else {
              this.Percent = parseInt(this.data / this.Total * 100);
            }
            var o = {
              Name: listStatus[i - 1].Name,
              Count: this.data,
              Total: this.Total,
              Id: listStatus[i - 1].Id,
              Color: listStatus[i - 1].Color,
              data: {
                series: [this.Percent, 100 - this.Percent]
              },
              options: {
                donut: true,
                donutWidth: this.obtions,
                showLabel: false,
                width: this.WidthHeight,
                height: this.WidthHeight
              }
            };
            this.viewModelGroup.push(o);
          }
        });
      });
    },
    getComboBox() {
      var requestSearch = this.$Utils.updateParamsSingleRequest(
        this.$Lodash.cloneDeep(this.$singleRequest),
        {
          ParentCode: "xSystem.Setting.xTask.Status",
          RequestOrderFields: "Index ASC",
          RequestTemplate: "Setting.SearchBaseTree"
        }
      );
      this.$Utils.post(requestSearch).then(data => {
        this.viewModel.listStatus = this.$Utils.getDataWithRoot(
          data,
          "R1.Data"
        );
        if (this.viewModel.listStatus.length > 0) {
          this.viewModel.listStatus.unshift({ Id: "", Name: "-Trạng thái-" });
        }
      });
    },
    getTask(type) {
      var self = this;
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      var arrayMap = this.viewModel.map;
      if (type) {
        arrayMap = [
          arrayMap.find(o => {
            return o.name == type;
          })
        ];
      }
      /*this.arrStatusColor = [];*/
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.TotalRequests = 0;
      $.each(arrayMap, (key, object) => {
        this.viewModel.dataSource[object.name] = [];
        this.viewModel.loading[object.name] = true;
        this.viewModel.numberIndex = {};
        this.viewModel.total = {};
        this.viewModel.Name = {};
        if (!this.viewModel.limit[object.name].current) {
          this.viewModel.limit[object.name].current = 1;
        }
        request.TotalRequests++;
        var objectRequest = {
          AssignedUser: sessionId,
          RequestTemplate: "AG_Task_Task.Search",
          RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
          RequestFields:
            "Id;Index;Name;Status;StatusName;PriorityIdName;PriorityId;PlanStartDate;Dealine;Modified;Manager;Worker;WorkerName;TaskRequest;StatusDisplay;StatusDisplayName;",
          StartIndex:
            (this.viewModel.limit[object.name].current - 1) *
              this.viewModel.defaultRecord +
            1,
          EndIndex:
            this.viewModel.defaultRecord *
            this.viewModel.limit[object.name].current,
          RequestOrderFields: "Modified DESC"
        };

        if (object.name != "Date") {
          objectRequest.PlanStartDateStartValue = this.$Utils.formatDateTime(
            this.start,
            "YYYY-MM-DDT00:00:00"
          );
          objectRequest.PlanStartDateEndValue = this.$Utils.formatDateTime(
            this.end,
            "YYYY-MM-DDT23:59:59"
          );
        }
        objectRequest[object.label] = this.UserInfor.UserId;
        if (
          object.name == "Resolved" &&
          (this.$isSystemAdmin() || this.$isMantisAdmin())
        ) {
          objectRequest[object.label] = "";
        }

        var filterObject = {};
        /*if (this.$Utils.isEmpty(this.model[object.name], "PlanStartDateEndValue")) {
            this.model[object.name].PlanStartDateEndValue.setHours(23, 59, 59);
            console.log(this.model[object.name].PlanStartDateEndValue);
          }*/
        $.each(this.model[object.name], (val, key) => {
          if (this.$Lodash.isObject(key)) {
            filterObject[val] = this.$Utils.formatDateTime(key);
          } else if (this.$Lodash.isString(key)) {
            filterObject[val] = key;
          }
        });

        if (this.$Utils.isEmpty(currentUser.Project, "GroupId")) {
          objectRequest.Project = currentUser.Project.GroupId;
          objectRequest.RequestFields += "Project;ProjectName";
        }
        request = this.$Utils.updateParamsSingleRequest(
          request,
          filterObject,
          request.TotalRequests
        );
        request = this.$Utils.updateParamsSingleRequest(
          request,
          objectRequest,
          request.TotalRequests
        );

        request.TotalRequests++;

        var objectRequestCount = this.$Lodash.cloneDeep(objectRequest);
        objectRequestCount.RequestTemplate = "AG_Task_Task.Count";
        request = this.$Utils.updateParamsSingleRequest(
          request,
          filterObject,
          request.TotalRequests
        );
        request = this.$Utils.updateParamsSingleRequest(
          request,
          objectRequestCount,
          request.TotalRequests
        );
      });
      this.$Utils.postCheckResult(request).then(data => {
        $.each(arrayMap, (key, object) => {
          this.viewModel.loading[object.name] = false;
          this.viewModel.dataSource[object.name] = this.$Utils.getDataWithRoot(
            data,
            "R" + (key * 2 + 1) + ".Data.TasksDS.Task"
          );
          this.viewModel.limit[object.name].total = Math.ceil(
            this.$Utils.getDataWithRoot(
              data,
              "R" + (key * 2 + 2) + ".Data"
            )[0] / this.viewModel.defaultRecord
          );
          this.viewModel.total[object.name] = this.$Utils.getDataWithRoot(
            data,
            "R" + (key * 2 + 2) + ".Data"
          )[0];
          this.viewModel.numberIndex[object.name] = this.viewModel.dataSource[
            object.name
          ].length;

          if (
            this.$Utils.isEmpty(
              this.viewModel.dataSource[object.name],
              "Name"
            ) &&
            this.viewModel.dataSource[object.name].Name.length > 30
          ) {
            this.viewModel.Name[object.name] =
              this.viewModel.dataSource[object.name].Name.SubString(30) + "...";
          } else {
            this.viewModel.Name[object.name] = this.viewModel.dataSource[
              object.name
            ].Name;
          }

          if (this.viewModel.dataSource[object.name].length < 1) {
            this.viewModel.limit[object.name].current = 0;
          }
          if (object.name === "Manager") {
            var obj = this.$Lodash.cloneDeep(
              this.viewModel.dataSource[object.name]
            );
            this.viewModel.dataSource[object.name] = [];
            this.viewModel.numberIndex[object.name] = 0;
            $.each(obj, (k, v) => {
              if (v.Worker == "" || !this.$Utils.isEmpty(v.Worker)) {
                this.viewModel.dataSource[object.name].push(v);
                this.viewModel.numberIndex[object.name]++;
              }
            });
            this.viewModel.total[object.name] = this.viewModel.numberIndex[
              object.name
            ];
          }
        });
      });
    }
  },
  created() {
    this.model = {
      Worker: {
        Status:
          "db8e700c-78c6-4f35-9477-36e0335888f5;fab4fa55-cf1d-4625-8f65-8b43e832061b;05625d94-3884-4f00-9918-254c1216c6cd;5756c3d9-37a8-4032-bd6c-2a01161b73c7;bbc399a9-a2b4-45ad-b948-32e5623dc021;"
      },
      // Manager: {},
      CreatedBy: {},
      Resolved: {
        Status: "532e9f1e-f5dc-4e75-b7c9-2bd785bbda67"
      },
      Date: {
        ModifiedStartValue: this.$Utils.stringToDate(
          this.$Utils.getDateTimeByKey("MonthStart")
        ),
        ModifiedEndValue: this.$Utils.stringToDate(
          this.$Utils.getDateTimeByKey("MonthEnd")
        )
      },
      Knows: {
        AssignedPermission: "Subscribe"
      },
      Reference: {
        ChosenOne: this.UserInfor.UserId
      },
      Dealine: {
        PlanStartDateEndValue: this.$Utils.stringToDate(
          this.$Utils.formatDateTime(Date.Now, "YYYY-MM-DDT23:59:59")
        ),
        Status:
          "db8e700c-78c6-4f35-9477-36e0335888f5;fab4fa55-cf1d-4625-8f65-8b43e832061b;05625d94-3884-4f00-9918-254c1216c6cd;5756c3d9-37a8-4032-bd6c-2a01161b73c7;bbc399a9-a2b4-45ad-b948-32e5623dc021;"
      }
    };
    this.viewModel = {
      userId: this.UserInfor.UserId,
      dataSource: {
        Worker: [],
        CreatedBy: [],
        Resolved: [],
        date: [],
        Knows: [],
        Dealine: []
      },
      defaultRecord: 10,
      loading: {},
      limit: {
        Worker: { current: 1, total: 0 },
        // Manager: { current: 1, total: 0 },
        CreatedBy: { current: 1, total: 0 },
        Resolved: { current: 1, total: 0 },
        Date: { current: 1, total: 0 },
        Knows: { current: 1, total: 0 },
        Reference: { current: 1, total: 0 },
        Dealine: { current: 1, total: 0 }
      },
      prefix: "/", //this.$isMobile.iOS() ? '/' : '',
      map: [
        { name: "Knows", label: "Knows", display: " Tôi theo dõi" },
        { name: "Reference", label: "Reference", display: " Tôi liên quan" },
        {
          name: "Worker",
          label: "Worker",
          display: " Tôi nhận (chưa giải quyết)"
        },
        { name: "CreatedBy", label: "CreatedBy", display: " Tôi tạo ra" },
        { name: "Dealine", label: "Worker", display: " Công việc đến hạn" },
        { name: "Resolved", label: "Worker", display: " Hoàn thành" },
        {
          name: "Date",
          label: "Knows",
          display: !this.$isMobileDevice ? " Chỉnh sửa gần đây (30 Ngày)" : "Gần đây (30 Ngày)"
        }
        // { name: 'Manager', label: 'Manager', display: ' Chưa gán cho ai' }
      ],
      listStatus: []
    };
    this.getComboBox();
  },
  watch: {
    viewModelGroup: function(newviewModelGroup) {
      this.listStatus = $.map(newviewModelGroup, (v, i) => {
        return {
          Name: v.Name,
          styleObject: {
            "background-color": v.Color
          },
          Data: v.Count,
          TotalData: v.Total,
          Percent: v.Total == 0 ? 0 : parseInt(v.Count / v.Total * 100),
          Id: v.Id,
          Content: v.Count + "/" + v.Total
        };
      });
    },
    viewModel: function(newviewModel) {
      $.map(newviewModel.map, (v, i) => {
        return {
          Title: v.display,
          Des: "view",
          Conclution:
            newviewModel.numberIndex[v.label] +
            "/" +
            this.viewModel.total[v.label],
          Task: [
            {
              Name: "",
              Index: "",
              Date: "",
              WorkerName: ""
            }
          ]
        };
      });
    }
  },
  destroyed() {
    clearInterval(this.intervalHistory);
  },
  mounted() {
    if (this.indexx == 1) {
      this.SearchHistory();
    }
    this.intervalHistory = setInterval(() => {
      this.SearchHistory(0, this.endIndex);
    }, 10000);
    if (this.$rootScope.dateFilter && this.$rootScope.dateFilter.length > 2) {
      this.start = Vue.moment(this.$rootScope.dateFilter[0]).format('YYYY-MM-DD') + 'T00:00:00';
      this.end = Vue.moment(this.$rootScope.dateFilter[1]).format('YYYY-MM-DD') + 'T23:59:59';


      // this.start = Vue.moment(this.$rootScope.dateFilter[0]).format(
      //   "YYYY-MM-DDT00:00:00"
      // );
      // this.end = Vue.moment(this.$rootScope.dateFilter[1]).format(
      //   "YYYY-MM-DDT23:59:59"
      // );
    }
    this.$hub.$on("datePicked", data => {
      // this.start = this.$Utils.formatDateTime(data[0], "YYYY-MM-DDT00:00:00");
      // this.end = this.$Utils.formatDateTime(data[1], "YYYY-MM-DDT23:59:59");
      this.start = Vue.moment(data[0]).format('YYYY-MM-DD') + 'T00:00:00';
      this.end = Vue.moment(data[1]).format('YYYY-MM-DD') + 'T23:59:59';
      this.searchData();
      this.getTask();
    });
    this.searchData();
    this.getTask();
  }
};
</script>
<style lang="scss">
.myView .el-collapse-item__content {
  padding-bottom: 0px !important;
}

.myView {
  .title-box {
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
  }
  .card {
    margin-bottom: 0px;
  }
  .card-body {
   padding: 0em;

}
}
@media screen and (max-width: 599px) {
.myView {
.card-body {
  padding: 0em;
   font-size: 13px;
}
.card-header {
   padding: 0em;
   font-size: 13px;
}
.card-footer {
  font-size: 13px;
}

}
}
@media screen and (max-width: 768px) {
.myView .el-collapse-item__content {
  padding-bottom: 0px !important;
}
.myView {
  .title-box {
    line-height: 2.5em;
  }
}
.myView {
  .el-collapse {
    line-height: 2.5em;
    .el-collapse-item {
      padding-bottom: 0.5em;
      .el-collapse-item__header {
        height:  2.5em;
        line-height: 2.5em;
      }
      .el-collapse-item__arrow {
         line-height: 2.5em;
      }
    }
  }
}
}
.myView .timeline {
  position: relative;
  padding: 21px 15px 5px;
  margin-top: 4px;
  margin-bottom: 30px;
}

.myView .timeline-avatar {
  width: 40px;
  height: 40px;
}

.myView .card-timeline {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 95%;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
}

.myView .text-muted {
  color: #c2cfd6 !important;
}

.myView .timeline .line {
  position: absolute;
  width: 4px;
  display: block;
  background: currentColor;
  top: 0px;
  bottom: 0px;
  margin-left: 25px;
}

.myView .timeline .separator {
  border-top: 1px solid currentColor;
  padding: 5px;
  padding-left: 40px;
  font-style: italic;
  font-size: 0.9em;
  margin-left: 30px;
}

.myView .timeline .line::before {
  top: -4px;
}

.myView .timeline .line::after {
  bottom: -4px;
}

.myView .timeline .line::before,
.myView .timeline .line::after {
  content: "";
  position: absolute;
  left: -4px;
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 50%;
  background: currentColor;
}

.myView .timeline .panel {
  position: relative;
  margin: 10px 0px 21px 65px;
  clear: both;
}

.myView .tl-contentName {
  font-size: 14px;
}

.myView .tl-contentDate {
  font-size: 12px;
}

.myView .timeline .panel::before {
  position: absolute;
  display: block;
  top: 8px;
  left: -24px;
  content: "";
  width: 0px;
  height: 0px;
  border: inherit;
  border-width: 12px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
}

.myView .contentTask {
  border: 1px solid #c2cfd6 !important;
}

.myView .rightContentTask {
  border-left: 1px solid #63c2de !important;
}

.myView .timeline .panel .panel-heading.icon * {
  font-size: 20px;
  vertical-align: middle;
  line-height: 40px;
}

.myView .timeline .panel .panel-heading.icon {
  position: absolute;
  left: -59px;
  display: block;
  width: 40px;
  height: 40px;
  padding: 0px;
  border-radius: 50%;
  text-align: center;
  float: left;
  background-color: #aaa7c7 !important;
}

/*.myView .el-collapse-item__arrow {*/
/*color: #*/
/*}*/

.myView .scrollActive {
  max-height: 2000px;
  overflow: auto;
}

.myView .timeline .panel-outline {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.myView .timeline .panel-outline .panel-body {
  padding: 10px 0px;
}

.myView .timeline .panel-outline .panel-heading:not(.icon),
.myView .timeline .panel-outline .panel-footer {
  display: none;
}

.myView .card-header {
  text-align: center;
}

.myView .btn-collapse {
  text-align: end;
  button {
    background-color: #fff;
  }
}

.myView .el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.myView .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.myView .el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.myView .el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.myView .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.myView .boxLeftTask {
  margin: auto !important;
}

.myView .el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.myView .slick-next:before {
  content: ">";
}

.myView .slick-prev:before {
  content: "<";
}

.myView .slick-prev {
  left: -21px;
  background: #ddd !important;
}

.myView .slick-prev:hover {
  background: #b4bccc !important;
}

.myView .slick-next {
  right: -21px;
  background: #ddd !important;
}

.myView .slick-next:hover {
  background: #b4bccc !important;
}

.myView .slick-prev:before,
.myView .slick-next:before {
  font-family: "slick";
  font-size: 20px;
  line-height: 1;
  opacity: 0.75;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.myView .slick-prev,
.myView .slick-next {
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

.myView .slick-slider {
  margin: 10px;
}

element.style {
  display: block;
}

slick-theme .slick-next {
  right: -25px;
}

slick-theme .slick-prev,
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

button {
  align-items: flex-start;
  text-align: center;
  cursor: default;
  color: buttontext;
  background-color: buttonface;
  box-sizing: border-box;
  padding: 2px 6px 3px;
  border-width: 2px;
  border-style: outset;
  border-color: buttonface;
  border-image: initial;
}

user agent stylesheet input,
textarea,
select,
button {
  text-rendering: auto;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font: 400 13.3333px Arial;
}

user agent stylesheet input,
textarea,
select,
button,
meter,
progress {
  -webkit-writing-mode: horizontal-tb;
}

user agent stylesheet button {
  -webkit-appearance: button;
}

inherited
  from
  div.slider.one-time.slick-initialized.slick-slider.slick-dotted
  .slick-slider {
  position: relative;
  display: block;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -ms-touch-action: pan-y;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}
</style>
