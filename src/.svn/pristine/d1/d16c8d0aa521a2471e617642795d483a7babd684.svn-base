<template>
  <div class="timeline-page">
    <el-row :gutter="20" :class="$isMobileDevice? 'padding-0': '' ">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :class="$isMobileDevice? 'padding-0': ''">
        <el-container :class="$isMobileDevice? 'padding-0': '' ">
          <el-header style="padding: 0px;">
            <el-row style="width: 100%">
              <el-col :span="12" class="leftaligndiv">
                <i class="fa fa-list-alt"></i>
                <span style="font-size: 14px;">
                  <b>Timeline</b>
                </span>
              </el-col>
              <el-col :span="12" class="rightaligndiv">
                <el-select v-model="selectedStatus" placeholder="Trạng thái" @change="getDataByStatus(selectedStatus)"
                           clearable>
                  <el-option v-for="item in ListStatus" :key="item.Id" :value="item.Id" :label="item.Name" />
                </el-select>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-container direction="vertical">
              <v-infinite-scroll @bottom="loadmore()" @top="reload()" :offset='0' class="left-scroll">
                <div v-show="loadingUp" style="text-align: center"><i class="el-icon-loading" ></i>&nbsp; Đang tải...</div>
                <el-card v-for="item in timeline" :key="item.Id" class="box-card">
                  <div class="text item">
                    <el-row style="display: flex; align-items: center">
                      <el-col :xs="4" :md="3">
                        <div class="pd-right-10">
                          <div style="text-align: center">
                            <img :src="listAvatar[item.Worker]" class="round-image" />
                          </div>
                          <div style="text-align: center">
                            <div>{{item.WorkerName}}</div>
                            <div class="b-600">{{item.dayAgo}}</div>
                          </div>
                          </div>
                      </el-col>
                      <el-col :xs="20" :md="21">
                        <el-row>
                          <span class="b-600">Tên công việc: <router-link :to="'/dynamic/view/Index=' + item.Index">{{item.Name}}</router-link></span>
                          <br />
                          <span><span class="b-600">Mục tiêu: </span> {{item.TargetLV1}};{{item.TargetLV2}};{{item.TargetLV3}}</span>
                          <br />
                          <span><span class="b-600">Bắt đầu: </span> {{$Utils.formatDateTime(item.PlanStartDate, "DD/MM/YYYY")}} | <span class="b-600">Ước tính: </span> {{item.PlanManHour}} | <span class="b-600">Kết thúc:  </span>{{$Utils.formatDateTime(item.Deadline, "DD/MM/YYYY")}} | <span class="b-600">Thực tế: </span> {{item.RemainingManHour}}</span>
                        </el-row>
                        <el-row>
                          <el-col :xs="24" :md="6">
                            <el-row style="text-align: left;">
                              <el-col :xs="12" :md="11"><span class="b-600">Hoàn thành:</span></el-col>
                              <el-col :xs="12" :md="13">
                                <div class="span-block-border" >
                                  <el-progress :text-inside="true" :stroke-width="18" :percentage="item.Progress"/>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :xs="24" :md="5">
                            <el-row style="text-align: left;">
                              <el-col :xs="12" :md="11"><span class="b-600">Ưu tiên: </span></el-col>
                              <el-col :xs="12" :md="13"><div class="span-block-border" :style="'background-color:'+ getPriorityColor(item.PriorityId)"><span>{{item.PriorityIdName}}</span></div></el-col>
                            </el-row>
                          </el-col>
                          <el-col :xs="24" :md="7">
                            <el-row style="text-align: left;">
                              <el-col :xs="12" :md="11"><span class="b-600">Trạng thái: </span></el-col>
                              <el-col :xs="12" :md="13"><div class="span-block-border" :style="'background-color:'+ getStatusColor(item.Status)"><span>{{item.StatusName}}</span></div></el-col>
                            </el-row>
                          </el-col>
                          <el-col :xs="24" :md="6">
                            <el-row>
                              <el-col :span="10">
                                <i class="fa fa-clock-o " :style="parseFloat(item.overHours+ '')<0?'color: red':'' "></i><span> {{item.overHours}} </span>
                              </el-col>
                              <el-col :span="7">
                                <i class="fa fa-paperclip "></i><span> {{item.TotalDownload ? item.TotalDownload : 0 }}</span>
                              </el-col>
                              <el-col :span="7">
                                <i class="fa fa-comment-o "></i><span> {{item.TotalComment ? item.TotalComment : 0}}</span>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                  </div>
                </el-card>
                <br/>
                <div v-show="loadingDown" style="text-align: center"><i class="el-icon-loading" ></i>&nbsp; Đang tải...</div>
                <el-card v-if="!loadingDown && loadingUp && timeline.length == 0" class="box-card">
                  <div class="center-div">Không có dữ liệu</div>
                </el-card>
              </v-infinite-scroll>
            </el-container>
          </el-main>
        </el-container>
      </el-col>
      <el-col :md="6" :lg="6" class="hidden-sm-and-down">
        <el-container direction="vertical" class="status">
          <el-row style="width: 100%;">
            <el-header>
              <span>Công việc theo trạng thái</span>
            </el-header>
            <el-main>
              <el-container direction="vertical" style="background-color: #fff">
                <el-row style="width: 100%" v-for="item in ListStatus" :key="item.Id">
                  <el-col :span="6">
                    {{item.Name}}
                  </el-col>
                  <el-col :span="4">
                    {{item.Count}}
                  </el-col>
                  <el-col :span="14">
                    <el-progress :percentage="item.Percentage" :text-inside="true" :stroke-width="18">
                    </el-progress>
                  </el-col>
                </el-row>
              </el-container>
            </el-main>
          </el-row>
          <el-row style="width: 100%;">
            <el-header>
              <span>Danh mục mục tiêu</span>
            </el-header>
            <el-main class="right-scroll">
              <el-card class="box-card" v-for="item in listTargetDetail" :key="item.Id">
                <div slot="header" class="clearfix">
                  <a href="#" class="target-header">{{item.Name}}</a>
                  <div class="owner">
                    <div v-if="item.TargetType == 1">
                      <i class="fa fa-users fa-lg mt-4"></i><span><b> Phòng:</b> {{item.GroupName}} <br /> <b>Loại:</b> {{ListType[item.TargetType -1].Name}}</span>
                    </div>
                    <div v-if="item.TargetType != 1">
                      <i class="fa fa-user fa-lg mt-4"></i><span><b> Quản lý:</b> {{item.OwnerName}} <br /> <b>Loại:</b> {{ListType[item.TargetType -1].Name}}</span>
                    </div>
                  </div>
                </div>
                <div class="bdCt text item">
                  <el-progress :text-inside="true" :stroke-width="18" :percentage="item.Progress" style="width: 90%; margin: auto"/>
                </div>
              </el-card>
            </el-main>
          </el-row>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Vue from "vue";
  import InfiniteScroll from "v-infinite-scroll";

  Vue.use(InfiniteScroll);
  export default {
    props: ["default", "sidebar"],
    data() {
      return {
        listStatus: [],
        selectedStatus: "",
        listStatuscount: [],
        ListStatus: [],
        Total: 0,
        listTargetDetail: [],
        timeline: [],
        startIndex: 0,
        endIndex: 20,
        datenow: new Date(),
        start: "",
        end: "",
        datetimeFormat: "DD-MM-YYYY",
        requestDatetimeFormat: "YYYY-MM-DDThh:mm:ss",
        ListType: [
          {
            Id: "1",
            Name: "Mục tiêu công ty"
          },
          {
            Id: "2",
            Name: "Mục tiêu phòng ban"
          },
          {
            Id: "3",
            Name: "Mục tiêu cá nhân"
          }
        ],
        loggedOnUser: JSON.parse(localStorage.getItem("LoggedOnUser")),
        loadingUp: false,
        loadingDown: false,
        dataLU: [],
        dataListUser: [],
        isSystemAdmin: this.$isSystemAdmin(),
        isMantisAdmin: this.$isMantisAdmin(),
        base: this.$appUri.BaseURL === "/" ? "" : this.$appUri.BaseURL,
        listAvatar: {},
        selectedWorker: ""
      };
    },
    methods: {
      openTaskDetail(index) {
        //this.$router.push({ path: '/dynamic/view/', query: { index:index }})
        this.$router.push("/dynamic/view/Index=" + index);
      },
      getDayAgo(item) {
        if (item != undefined) {
          var dateNow = this.$Utils.formatDateTime(Date.Now, "DD/MM/YYYY");
          var temp = this.$Utils.formatDateTime(item, "DD/MM/YYYY");
          if (dateNow === temp) {
            var date = new Date();
            var currentDate = new Date(item);
            var t = date - currentDate;
            if (Math.round(t / 60 / 60 / 1000) > 0) {
              return Math.round(t / 60 / 60 / 1000) + " giờ trước ";
            } else if (Math.round(t / 60 / 1000) <= 0) {
              return "Vừa xong";
            } else {
              return Math.round(t / 60 / 1000) + " phút trước";
            }
          }

          var diff = Math.round(
            Math.abs((new Date() - new Date(item)) / (24 * 60 * 60 * 1000))
          );
          return diff + " ngày trước";
        } else {
          return "";
        }
      },
      reload() {
        this.loadingUp = true;
        this.startIndex = 0;
        this.endIndex = 20;
        this.loadTask();
      },
      loadmore() {
        this.loadingDown = true;
        this.startIndex = this.endIndex+1;
        this.endIndex += 20;
        this.loadTask();
      },
      getDataByStatus(status) {
        this.selectedStatus = status;
        this.loadTask();
      },
      loadTask(first) {
        var taskRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "AG_Task_Task.Search",
          R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
          R1_RequestFields:
            "TotalDownload;TotalComment;Id;Index;Name;Status;Progress;StatusName;Content;PriorityIdName;PriorityId;PlanStartDate;Deadline;Modified;Manager;Worker;WorkerName;TaskRequest;StatusDisplay;StatusDisplayName;RestTime;RemainingManHour;PlanManHour;TargetsName;TargetsLevel1;TargetsLevel2;TargetsLevel3;TargetsLevel4;CategoriesLevel5;ProjectCategoriesLevel1;ProjectCategoriesLevel2;ChosenOneName;Targets;",
          R1_StartIndex: this.startIndex,
          R1_EndIndex: this.endIndex,
          R1_AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
          R1_RequestOrderFields: "Modified DESC",
          R1_PlanStartDateStartValue: this.start,
          R1_PlanStartDateEndValue: this.end
        };
        if (this.selectedStatus !== "") {
          taskRequest.R1_Status = this.selectedStatus;
        }
        if (this.selectedWorker !== "") {
          taskRequest.R1_Worker = this.selectedWorker;
        }
        if (this.$route) {
          if (this.$route.query) {
            $.each(this.$route.query, function (key, value) {
              if (value !== "" && value) {
                taskRequest["R1_" + key] = value;
                taskRequest["R2_" + key] = value;
              }
            });
          }
        }
        if (!first) {
          if (this.selectedStatus !== "") {
            taskRequest.R1_Status = this.selectedStatus;
          }
          if (this.selectedWorker !== "") {
            taskRequest.R1_Worker = this.selectedWorker;
          }
          taskRequest.R1_PlanStartDateStartValue = this.start;
          taskRequest.R1_PlanStartDateEndValue = this.end;
        }
        this.$Utils.post(taskRequest).then(taskdata => {

          taskdata = this.$Utils.getDataWithRoot(
            taskdata,
            "R1.Data.TasksDS.Task"
          );
          if (this.startIndex === 0) {
            this.timeline = taskdata;
          } else {
            this.timeline = this.timeline.concat(taskdata);
          }
          this.timeline.filter(item => {
            var temp = this.$Utils.expressionToString(
              item,
              "{{Deadline|DateTime:toNows}}"
            );
            if (item.Status !== "532e9f1e-f5dc-4e75-b7c9-2bd785bbda67" &&
              item.Status !== "53cc3819-c019-4749-b0e4-52213438049b" &&
              eval(new Date() > new Date(item.PlanStartDate))){
              item.overHours = parseFloat(temp).toFixed(2);
            }
            else item.overHours = "0.00";
            if (item.TargetsName) {
              var arrTargetName = item.TargetsName.split(";");
              if (arrTargetName[0]) {
                item.TargetLV1 = arrTargetName[0];
              }
              if (arrTargetName[1]) {
                item.TargetLV2 = arrTargetName[1];
              }
              if (arrTargetName[2]) {
                item.TargetLV3 = arrTargetName[2];
              }
            }
            item.dayAgo = this.getDayAgo(item.Modified);

            if (isNaN(item.Progress) || item.Progress === undefined) {
              item.Progress = 0;
            } else {
              item.Progress = Math.round(parseFloat(item.Progress));
            }
          });
          this.loadingUp = false;
          this.loadingDown = false;
        });
      },
      loadStatusData(first) {
        var statusRequest = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "Setting.SearchBase",
          R1_ParentCode: "xSystem.Setting.xTask.Status"
        };
        this.$Utils.post(statusRequest).then(dt => {
          this.listStatus = this.$Utils.getDataWithRoot(
            dt.R1,
            "Data.DynamicDS.Setting"
          );
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.TotalRequests = this.listStatus.length;

          for (var i = 0; i < this.listStatus.length; i++) {
            request["R" + (i + 1) + "_RequestTemplate"] = "AG_Task_Task.Count";
            request["R" + (i + 1) + "_RequestDataGroup"] =
              "DataGroup.danh-sach-cong-viec.04b66";
            request["R" + (i + 1) + "_PlanStartDateStartValue"] = this.start;
            request["R" + (i + 1) + "_PlanStartDateEndValue"] = this.end;
            request["R" + (i + 1) + "_Status"] = this.listStatus[i].Id;
            request["R" + (i + 1) + "_AssignedUser"] = localStorage.getItem(
              "access_token"
            );
            if (this.selectedWorker) {
              request["R" + (i + 1) + "_Worker"] = this.selectedWorker;
            }
            if (this.$route) {
              if (this.$route.query) {
                $.each(this.$route.query, function (key, value) {
                  if (value !== "" && value) {
                    request["R" + (i + 1) + "_" + key] = value;
                    // request["R2_"+key] = value;
                  }
                });
              }
            }
            if (!first) {
              if (this.selectedWorker) {
                request["R" + (i + 1) + "_Worker"] = this.selectedWorker;
              }
              request["R" + (i + 1) + "_PlanStartDateStartValue"] = this.start;
              request["R" + (i + 1) + "_PlanStartDateEndValue"] = this.end;
            }
          }
          this.$Utils.post(request).then(data => {
            this.listStatuscount = [];
            this.ListStatus = [];
            this.Total = 0;
            for (var i = 0; i < this.listStatus.length; i++) {
              var count = this.$Utils.getDataWithRoot(
                data["R" + (i + 1)],
                "Data"
              );
              count = parseInt(count);
              this.Total += count;
              var obj = {
                Name: this.listStatus[i].Name,
                Count: count,
                Id: this.listStatus[i].Id,
                Color: this.listStatus[i].Color
              };
              this.listStatuscount.push(obj);
            }
            this.listStatuscount.forEach(item => {
              var newObj = {
                Name: item.Name,
                Count: item.Count,
                Id: item.Id,
                Color: item.Color,
                Percentage:
                  item.Count > 0 ? Math.round(item.Count * 100 / this.Total) : 0
              };
              this.ListStatus.push(newObj);
            });
          });
        });
      },
      getStatusColor(id) {
       var colors = this.$getItemLocalStorage(this.$localStorageConstant.settingColor);
       if(colors && colors!= null)
       return JSON.parse(colors)[id.toUpperCase()];
       else return '';
      },
      getPriorityColor(id){
         var colors = this.$getItemLocalStorage(this.$localStorageConstant.arrPriorityColor);
         if(colors && colors!= null)
         return JSON.parse(colors)[id.toUpperCase()];
         else return '';
      },
      searchAvatar() {
        var request = {
          RequestAction: "SearchUserWithGroups",
          IncludedGroupManager: "true",
          RequestClass: "BPM",
          RequestDataType: "json",
          ConditionFields: "IncludedGroupManager;Group;Status;LoginName",
          StaticFields: "UserId;Username;LoginName;Description;Status;",
          DynamicFields:
            "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
          StructFields: "GroupRoot;GroupRootName;",
          OrderFields: "LoginName ASC",
          GroupType: "1",
          //Status: 1
        };

        this.$Utils.post(request).then(users => {
          users = this.$Utils.getDataWithRoot(users, "Data.UserDS.User");
          this.dataLU = users;
          users.forEach(user => {
              this.$set(this.listAvatar, user.UserId, this.loadAvatar(user.Avatar))
          });

        });
      },
      loadAvatar(avatar){


       if(avatar == undefined) avatar = 'assets/images/avatars/profile.png';
       avatar = avatar.replace('profile.jpg', 'profile.png');

                var strAvatar =
                  avatar === "assets/images/avatars/profile.png"
                    ? this.$appUri.BaseURL + avatar
                    : this.$appUri.BaseURL + avatar.replace('/','') + "&Height=50&Width=50";

      return strAvatar;
     }
    },

    created() {
      this.model = {};
    },
    mounted() {
      this.searchAvatar();
      if(this.$rootScope.selectedWorkerId){
        this.$rootScope.selectedWorkerId.forEach(item => {
          this.selectedWorker += item + ";";
        });
      }
      if (this.$rootScope.dateFilter && this.$rootScope.dateFilter.length > 2) {
        this.start = Vue.moment(this.$rootScope.dateFilter[0]).format('YYYY-MM-DD') + 'T00:00:00';
        this.end = Vue.moment(this.$rootScope.dateFilter[1]).format('YYYY-MM-DD') + 'T23:59:59';
      }
      this.$hub.$on("datePicked", data => {
        this.start = Vue.moment(data[0]).format('YYYY-MM-DD') + 'T00:00:00';
        this.end = Vue.moment(data[1]).format('YYYY-MM-DD') + 'T23:59:59';

        this.loadStatusData();
        this.loadTask();
      });
      this.$hub.$on("workerPicked", data => {
        var selectedUser = "";
        data.forEach(item => {
          selectedUser += item + ";";
        });
        this.selectedWorker = selectedUser;
        this.loadStatusData();
        this.loadTask();
      });

      this.loadStatusData(true);
      this.loadTask(true);

      this.model.Project = [this.loggedOnUser.Project.GroupId];
      var requestSearch = this.$Utils.updateParamsSingleRequest(
        this.$Lodash.cloneDeep(this.$singleRequest),
        {
          ParentCode: "xSetting.Project.Parameter.Organization.Target",
          RequestOrderFields: "LeftIndex ASC",
          RequestClass: "xBase",
          RequestAction: "Request",
          RequestDataGroup: "DataGroup.muc-tieu.091fb",
          RequestFields:
            "Plan;Done;Progress;Unit;Assigned;AssignedName;Owner;OwnerName;TargetType;Id;Index;Code;Name;Value;Description;LeftIndex;ParentId;Level;Value;RightIndex;Created;CreatedBy;Modified;ActualStartDate;ActualFinishDate",
          RequestTemplate: "xDynamicData_Setting.Search",
          AssignedUser: localStorage.getItem("access_token")
        }
      );
      this.$Utils.post(requestSearch).then(data => {
        data = this.$Utils.getDataWithRoot(data, "R1.Data.DynamicDS.Setting");
        var ListProject = [];
        var db = data;
        var currentId = localStorage.getItem("UserId");
        db.forEach((ele, key) => {
          ele.isOwner = false;
          ele.isAssigned = false;
          if (ele.Owner && ele.Owner.toLowerCase().indexOf(currentId) > -1) {
            ele.isOwner = true;
          }
          if (
            ele.Assigned &&
            ele.Assigned.toLowerCase().indexOf(currentId) > -1
          ) {
            ele.isAssigned = true;
          }
          ele.GroupName = "";
          if (this.$Utils.isEmpty(ele.Modified))
            ele.Modified = this.$Utils.formatDateTime(
              ele.Modified,
              "HH:mm DD-MM-YYYY"
            );
          if (isNaN(ele.Progress) || ele.Progress === undefined) {
            ele.Progress = 0;
          } else {
            ele.Progress = Math.round(parseFloat(ele.Progress));
          }

          this.listTargetDetail.push(ele);
        });
      });
    },
    watch: {}
  };
</script>
<style lang="scss">

  .timeline-page {
    .left-scroll {
      max-height: 80vh;
      overflow-y: scroll;
    }
    .right-scroll {
      max-height: 60vh;
      overflow-y: scroll;
    }
    @media screen and (max-width: 1366px) {
      .left-scroll {
        max-height: 75vh;
        overflow-y: scroll;
      }
      .right-scroll {
        max-height: 49vh;
        overflow-y: scroll;
      }
    }
    .pd-right-10 {
      padding-right: 10px;
    }
    .padding-0 {
      padding: 0 !important;
    }

    .b-600 {
      font-weight: 600;
    }
    body {
      font-size: 13px;
    }
    .span-block-border{
      text-align: center;
      width:60%;
      display: inline-block;
      span {
        margin: auto;
      }
      .el-progress-bar__outer, .el-progress-bar__inner {
        border-radius: 0px;
      }
    }
    .el-progress-bar__innerText {
      color: #0b0e0f;
    }

    .el-card__body {
      padding: 5px !important;
    }

    .center-div {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      width: auto;
    }

    .status {
      .el-main {
        margin-bottom: 10px;
      }

    }

    .rightaligndiv {
      padding-right: 5px;
    }

    .el-card {
      margin-bottom: 10px;
      width: 100%;
      overflow: visible;
    }

    .round-image {
      border-radius: 50%;
      max-height: 50px;
      display: block;
      margin: auto;
    }

    .target-header {
      font-size: 16px;
    }

    .el-container {
      //background-color: #fff;
      color: #333;
      padding-top: 10px;
    }

    .el-main {
      padding: 0px;
      .el-container {
        padding: 5px;
      }

    }

    .el-header {
      padding-top: 5px;
      height:32px !important;
      line-height: 27px;
      font-size: 16px;
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
      .rightaligndiv {
        text-align: right;
      }

    }
    @media screen and (max-width: 599px) {
    .container-fluid {
      padding: 0px 5px !important;
    }
    .timeline-page {
      .el-header {
        height: 32px !important;
      }
    }
}
  }
</style>
