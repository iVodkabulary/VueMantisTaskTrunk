<template>
  <div :class="'animated fadeIn categories ' + ($isMobileDevice ? 'mobile-category' : '')">
    <div v-if="!$isMobileDevice" class="row">
        <h5 class="col-md-12"><i class="fa fa-sitemap"></i><span> Danh Mục </span></h5>
    </div>
    <div class="row my-row">
      <div class="col-md-3 p-0 border-box">
        <div class="my-header d-md-none d-lg-none d-xl-none" @click="isCollapse =! isCollapse">
          <div>
            <span>Danh mục</span>
          </div>
          <span>
            <i v-if="!isCollapse" class="fa fa-angle-down"></i>
            <i v-if="isCollapse" class="fa fa-angle-right"></i>
          </span>
        </div>
        <div v-show="!isCollapse">
          <div class="p-2 ">
            <el-radio-group v-model="radio" size="small" @change="changeRadio(radio)">
              <el-radio :label="1">Nghiệp vụ</el-radio>
              <el-radio :label="2">Dự án</el-radio>
            </el-radio-group>
            <el-select style="max-width: 120px;" v-model="project" placeholder="Dự án" v-if="typeproject" @change="changeProject">
              <el-option v-for="item in projects"
                         :key="item.Id"
                         :label="item.Name"
                         :value="item.Id">
              </el-option>
            </el-select>
          </div>
          <div class="px-2 bg-white">
            <button class="btn btn-link" @click="expandAll">Mở rộng</button>
            <button class="btn btn-link" @click="collapseAll">Thu gọn</button>
          </div>
          <el-tree ref="categoriesTree" highlight-current empty-text="Không có dữ liệu" :expand-on-click-node="false" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </div>
      <div class="col-md-9">
        <el-container class="border-box">
          <el-header>
              <el-form :inline="true" v-if="!$isMobileDevice">
                  <el-form-item label="Ngày bắt đầu">
                    <el-date-picker v-model="chooseDate" type="daterange" format='dd/MM/yyyy'></el-date-picker>
                  </el-form-item>
                  <el-form-item label="Trạng thái">
                    <el-select v-model="status" placeholder="Trạng thái">
                      <el-option v-for="item in Statuses" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Nhân sự">
                    <el-select v-model="worker" placeholder="Nhân sự">
                      <el-option v-for="item in Wokers" :key="item.UserId" :label="item.Username" :value="item.UserId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Phòng ban" v-if="!typeproject && derparment != 1">
                    <el-select v-model="derparment" placeholder="Phòng ban" >
                      <el-option v-for="item in Projects" :key="item.GroupId" :label="item.GroupName" :value="item.GroupId"></el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item>
                  <el-button @click="onSearch">Tìm kiếm</el-button>
                </el-form-item>
              </el-form>
              <div id="Filter" class="my-header d-md-none d-lg-none d-xl-none" @click="isCollapseFilter =! isCollapseFilter">
              <div>
                <span>Bộ lọc</span>
              </div>
              <span>
                <i v-if="isCollapseFilter" class="fa fa-angle-down"></i>
                <i v-else class="fa fa-angle-right"></i>
              </span>
            </div>
                  <div class="bg-white pb-1"  v-if="isCollapseFilter">
                  <el-form label-position="right" size="mini" label-width="120px">
                    <el-form-item label="Ngày bắt đầu" style="width:100%;">
                      <el-date-picker v-model="chooseDate" popper-class="MobileDateRange" :unlink-panels="false" type="daterange" format='dd/MM/yyyy'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="Trạng thái"  style="width:100%;">
                      <el-select  v-model="status" placeholder="Trạng thái">
                        <el-option v-for="item in Statuses" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Nhân sự" style="width:100%;">
                      <el-select v-model="worker" placeholder="Nhân sự">
                        <el-option v-for="item in Wokers" :key="item.UserId" :label="item.Username" :value="item.UserId"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Phòng ban" style="width:100%;" v-if="!typeproject && derparment != 1">
                      <el-select v-model="derparment" placeholder="Phòng ban" >
                        <el-option v-for="item in Projects" :key="item.GroupId" :label="item.GroupName" :value="item.GroupId"></el-option>
                      </el-select>
                    </el-form-item>
                  <el-form-item>
                    <el-button @click="onSearch" type="primary">Tìm kiếm</el-button>
                  </el-form-item>
                </el-form>
                 </div>
          </el-header>
          <el-main >
            <el-table :data="tableData" show-summary sum-text="Tổng" border width="100%" empty-text="Không có dữ liệu">
              <el-table-column type="index"
                               label="Stt" width="50px">
              </el-table-column>
              <el-table-column prop="Name" width="200px"
                               label="Tên công việc">
                <template slot-scope="scope">
                  <b v-if="!scope.row.Marked && ( !scope.row.UserList || scope.row.UserList.indexOf(currentUser.UserId) == -1)">
                    <router-link :to="'/dynamic/view/Index='+scope.row.Index"> {{scope.row.Name}}</router-link>
                  </b>
                  <router-link :to="'/dynamic/view/Index='+scope.row.Index" v-else> {{scope.row.Name}}</router-link>
                </template>
              </el-table-column>

              <el-table-column
                               label="Trạng thái">
              <template slot-scope="scope">
                <span :style="'background-color:'+ getStatusColor(scope.row.Status)">{{scope.row.StatusName}}</span>
              </template>
              </el-table-column>

              <el-table-column prop="WorkerName"
                               label="Nhân sự" >
              </el-table-column>
              <el-table-column prop="PlanManHour"
                               label="Ước tính" >
              </el-table-column>
              <el-table-column prop="RemainingManHour"
                               label="Thực tế" >
              </el-table-column>
              <el-table-column prop="PlanStartDate"
                               label="Bắt đầu">
                <template slot-scope="scope">
                  <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.PlanStartDate, 'DD/MM/YYYY HH:mm')}} </span>
                </template>
              </el-table-column>
              <el-table-column prop="Deadline"
                               label="Kết thúc">
                <template slot-scope="scope">
                  <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.Deadline, 'DD/MM/YYYY HH:mm')}} </span>
                </template>
              </el-table-column>
            </el-table>
            <Pagination v-if="tableData.length>0" :totalPage="totalP" :currentPage="currentP" :pagesize="maxItem" :callback="handleSelectPage" />
          </el-main>
        </el-container>
      </div>
    </div>


  </div>
</template>
<script>
import Pagination from "@/components/dynamic/Pagination";
export default {
  components: {
    Pagination
  },
  name: "categories",
  data() {
    return {
      filterable: "",
      currentUser: JSON.parse(this.$Utils.getUserInfo()),
      chooseDate: [
        this.$Utils.getDateTimeByKey("MonthStart"),
        this.$Utils.getDateTimeByKey("MonthEnd")
      ],
      // chooseDate[1]: this.$Utils.getDateTimeByKey('MonthEnd'),
      status: 1,
      worker: 1,
      project: "",
      derparment: 1,
      typeproject: false,
      isCollapse: false,
      isCollapseFilter: false,
      treeDataTemp: [],
      projects: [],
      Statuses: [],
      Wokers: [],
      Projects: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      radio: 1,
      tableData: [],
      selectCategory: null,
      totalP: 0,
      currentP: 1,
      maxItem: 50,
      startIndex: 1,
      endIndex: 50
    };
  },
  watch: {},
  created() {
    this.$hub.$on("reload", data => {
      this.searchTask();
    });
  },
  destroyed() {
    this.$hub.$off("reload");
  },
  methods: {
    getStatusColor(id) {
      var colors = this.$getItemLocalStorage(this.$localStorageConstant.settingColor);
       return JSON.parse(colors)[id.toUpperCase()];
      },
    handleNodeClick(data) {
      this.selectCategory = data.Id;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 2,
        R1_RequestTemplate: "AG_Task_Task.Search",
        R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
        R1_RequestFields:
          "Id;Name;Index;WorkerName;Worker;PlanStartDate;Deadline;UserList;StatusName,Status;PlanManHour;RemainingManHour",
        R1_Keyword: data.Id,
        R1_Status: this.status,
        R1_Worker: this.worker,
        R1_StartIndex: 1,
        R1_EndIndex: 50,
        R1_PlanStartDateStartValue: this.$Utils.formatDateTime(
          this.chooseDate[0]
        ),
        R1_PlanStartDateEndValue: this.$Utils.formatDateTime(
          this.chooseDate[1]
        ),
        R1_AssignedUser: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        ),
        R2_RequestTemplate: "AG_Task_Task.Count",
        R2_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
        R2_RequestFields:
          "Id;Name;Index;WorkerName;Worker;PlanStartDate;Deadline;UserList;StatusName,Status;PlanManHour;RemainingManHour",
        R2_Keyword: data.Id,
        R2_Status: this.status,
        R2_Worker: this.worker,
        R2_PlanStartDateStartValue: this.$Utils.formatDateTime(
          this.chooseDate[0],
          "DD/MM/YYYY"
        ),
        R2_PlanStartDateEndValue: this.$Utils.formatDateTime(
          this.chooseDate[1],
          "DD/MM/YYYY"
        ),
        R2_AssignedUser: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        )
      };
      if (this.typeproject == false && this.derparment != 1) {
        request["R1_Project"] = this.derparment;
      }
      if (this.typeproject) {
        request["R1_Project"] = this.project;
      }
      if (this.status == 1) {
        delete request.R1_Status;
        delete request.R2_Status;
      }
      if (this.worker == 1) {
        delete request.R1_Worker;
        delete request.R2_Worker;
      }
      this.$Utils.postCheckResult(request).then(response => {
        var lstTask = response.R1.Data.TasksDS.Task;
        if (lstTask && !this.$Utils.isEmpty(lstTask, "length")) {
          lstTask = [lstTask];
        }
        var totalPage = response.R2.Data;
        this.currentP = 1;
        this.totalP = parseInt(totalPage);
        this.tableData = lstTask ? lstTask : [];
        if (this.$isMobileDevice) {
          $(document).scrollTop( $("#Filter").offset().top - 55);
       }
      });
    },
    expandAll() {
      this.$refs["categoriesTree"].$data.store.defaultExpandAll = true;
      this.treeData = JSON.parse(JSON.stringify(this.treeData));
    },
    collapseAll() {
      this.$refs["categoriesTree"].$data.store.defaultExpandAll = false;
      this.treeData = JSON.parse(JSON.stringify(this.treeData));
    },
    handleSelectPage(val) {
      this.currentP = val;
      this.startIndex = (val - 1) * this.maxItem + 1;
      this.endIndex = (val - 1) * this.maxItem + this.maxItem;
      this.SearchTaskAndPagging();
    },
    onSearch() {
      this.searchTask();
      this.SearchTaskAndPagging();
    },
    searchTask() {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "AG_Task_Task.Search",
        R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
        R1_RequestFields:
          "Id;Name;Index;WorkerName;Worker;PlanStartDate;Deadline;UserList;Categories;ProjectCategories;StatusName;PlanManHour;RemainingManHour",
        R1_Keyword: this.selectCategory,
        R1_PlanStartDateStartValue: vm.$Utils.formatDateTime(
          this.chooseDate[0]
        ),
        R1_PlanStartDateEndValue: vm.$Utils.formatDateTime(this.chooseDate[1]),
        R1_Status: this.status,
        R1_Worker: this.worker,
        R1_AssignedUser: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        )
      };

      if (this.typeproject == false && this.derparment != 1) {
        request["R1_Project"] = this.derparment;
      }
      if (this.typeproject) {
        request["R1_Project"] = this.project;
      }
      if (this.status == 1) {
        delete request.R1_Status;
      }
      if (this.worker == 1) {
        delete request.R1_Worker;
      }
      if (!vm.$Utils.isEmpty(this.selectCategory)) {
        delete request.R1_Keyword;
      }
      var listDataTree = vm.$Lodash.cloneDeep(vm.treeDataTemp);
      this.$Utils.postCheckResult(request).then(response => {
        var lstTask = this.$Utils.getDataWithRoot(
          response.R1,
          "Data.TasksDS.Task"
        ); // response.R1.Data.TasksDS.Task;
        // console.log(lstTask)
        // if (lstTask && !this.$Utils.isEmpty(lstTask, "length")) {
        //   lstTask = [lstTask];
        // }
        if (
          vm.$Utils.isEmpty(lstTask) &&
          vm.$Utils.isEmpty(this.selectCategory)
        ) {
          var count = lstTask.length;
          vm.totalP = parseInt(count);
          vm.currentP = 1;
        }
        $.each(lstTask, function(index, value) {
          var isRead =
            !vm.$Utils.isEmpty(value, "UserList") ||
            value.UserList.indexOf(vm.currentUser.UserId) == -1;
          $.each(listDataTree, function(key, val) {
            if (!vm.$Utils.isEmpty(val) || !vm.$Utils.isEmpty(val["unread"])) {
              val.unread = 0;
            }
            if (!vm.$Utils.isEmpty(val, "total")) {
              val.total = 0;
            }
            if (!vm.$Utils.isEmpty(val, "isSelect")) {
              val.valueName = val.Name + " (0)";
              val.isSelect = true;
            }
            if (isRead) {
              if (
                !vm.typeproject &&
                vm.$Utils.isEmpty(value.Categories) &&
                value.Categories.indexOf(val.Id) != -1
              ) {
                // Organization
                val.unread++;
              } else if (
                vm.typeproject &&
                vm.$Utils.isEmpty(value.ProjectCategories) &&
                value.ProjectCategories.indexOf(val.Id) != -1
              ) {
                // Project
                val.unread++;
              }
            }
            if (
              !vm.typeproject &&
              vm.$Utils.isEmpty(value.Categories) &&
              value.Categories.indexOf(val.Id) != -1
            ) {
              // Organization
              val.total++;
              if (val.unread == 0) {
                val.valueName =
                  val.Name + " (" + val.unread + "/" + val.total + " )";
              } else {
                val.valueName =
                  val.Name + " (" + val.unread + "/" + val.total + ")";
              }
            } else if (
              vm.typeproject &&
              vm.$Utils.isEmpty(value.ProjectCategories) &&
              value.ProjectCategories.indexOf(val.Id) != -1
            ) {
              // Project
              val.total++;
              if (val.unread == 0) {
                val.valueName =
                  val.Name + " (" + val.unread + "/" + val.total + ")";
              } else {
                val.valueName =
                  val.Name + " (" + val.unread + "/" + val.total + ")";
              }
            }
          });
        });
        if (!vm.$Utils.isEmpty(lstTask) || lstTask.length == 0) {
          $.each(listDataTree, function(key, val) {
            val.valueName = val.Name + " (0)";
          });
        }
        var tree = [];
        if (vm.$Utils.isEmpty(listDataTree)) {
          tree = this.$Utils.createCustomTreeFromList(
            listDataTree,
            "Id",
            "ParentId",
            "children",
            { valueName: "label", Id: "value" },
            {
              type: "category",
              icon: "icon-folder",
              unread: 0,
              total: 0
            }
          );
        }
        vm.treeData = tree;
        //if (this.$Utils.isEmpty(this.selectCategory)) {
        //  this.tableData = lstTask;
        //}
      });
    },
    SearchTaskAndPagging() {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "AG_Task_Task.Search",
        R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
        R1_RequestFields:
          "Id;Name;Index;WorkerName;Worker;PlanStartDate;Deadline;UserList;Categories;ProjectCategories;StatusName;",
        R1_Keyword: this.selectCategory,
        R1_PlanStartDateStartValue: vm.$Utils.formatDateTime(
          this.chooseDate[0]
        ),
        R1_PlanStartDateEndValue: vm.$Utils.formatDateTime(this.chooseDate[1]),
        R1_Status: this.status,
        R1_Worker: this.worker,
        R1_StartIndex: this.startIndex,
        R1_EndIndex: this.endIndex,
        R1_AssignedUser: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        )
      };

      if (this.typeproject == false && this.derparment != 1) {
        request["R1_Project"] = this.derparment;
      }
      if (this.typeproject) {
        request["R1_Project"] = this.project;
      }
      if (this.status == 1) {
        delete request.R1_Status;
      }
      if (this.worker == 1) {
        delete request.R1_Worker;
      }
      if (!vm.$Utils.isEmpty(this.selectCategory)) {
        delete request.R1_Keyword;
      }
      this.$Utils.postCheckResult(request).then(response => {
        var lstTask = response.R1.Data.TasksDS.Task;
        if (this.$Utils.isEmpty(this.selectCategory)) {
          this.tableData = lstTask ? lstTask : [];
        }
      });
    },
    changeRadio(item) {
      var vm = this;
      this.tableData = [];
      this.treeData = [];
      this.selectCategory = null;
      if (item === 1) {
        this.typeproject = false;
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.Parameter.Organization.Category"
        };
        this.$Utils.post(request).then(response => {
          var data = response.R1.Data.DynamicDS.Setting;
          if (data && !this.$Utils.isEmpty(data, "length")) {
            data = [data];
          }
          this.treeDataTemp = vm.$Lodash.cloneDeep(data);
          this.searchTask();
        });
      } else {
        this.typeproject = true;
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestDataGroup: "DataGroup.quan-ly-du-an.053gf",
          R1_RequestFields:
            "Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type",
          R1_Code: "Project",
          R1_RequestTemplate: "xDocument_Document.Search"
        };
        this.$Utils.post(request).then(response => {
          var data = response.R1.Data.DocumentDS.Document;
          if (data && !this.$Utils.isEmpty(data, "length")) {
            data = [data];
          }
          this.projects = data;
          if (this.$Utils.isEmpty(data, "0")) {
            this.project = data[0].Id;
            this.changeProject();
          }
        });
      }
    },
    changeProject() {
      var vm = this;
      this.tableData = [];
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_ParentCode: "xSetting.Project.Parameter.Project.Category",
        R1_Value: this.project
      };
      this.$Utils.post(request).then(response => {
        var data = response.R1.Data.DynamicDS.Setting;
        if (data && !this.$Utils.isEmpty(data, "length")) {
          data = [data];
        }
        this.treeDataTemp = vm.$Lodash.cloneDeep(data);
        this.searchTask();
      });
    }
  },
  mounted() {
    var vm = this;
    // request search tree
    var request = {
      RequestClass: "xBase",
      RequestAction: "Request",
      TotalRequests: 1,
      R1_RequestTemplate: "SettingNew.SearchSetting",
      R1_ParentCode: "xSetting.Project.Parameter.Organization.Category"
    };
    vm.$Utils.post(request).then(response => {
      var data = response.R1.Data.DynamicDS.Setting;
      this.treeDataTemp = vm.$Lodash.cloneDeep(data);
      this.searchTask();
    });
    var statusRequest = {
      RequestClass: "xBase",
      RequestAction: "Request",
      TotalRequests: 1,
      R1_RequestTemplate: "Setting.SearchBase",
      R1_ParentCode: "xSystem.Setting.xTask.Status"
    };
    this.$Utils.post(statusRequest).then(response => {
      var data = response.R1.Data.DynamicDS.Setting;
      this.Statuses = [
        {
          Id: 1,
          Name: "Tất cả"
        }
      ];
      this.Statuses = this.Statuses.concat(data);
    });
    var userRequest = {
      RequestClass: "BPM",
      RequestAction: "SearchUsers",
      TotalRequests: 1,
      StaticFields: "UserId;Username;LoginName;Status",
      ConditionFields: "Status",
      Status: 1
    };
    this.$Utils.post(userRequest).then(response => {
      var data = response.Data.UserDS.User;
      this.Wokers = [
        {
          UserId: 1,
          Username: "Tất cả"
        }
      ];
      this.Wokers = this.Wokers.concat(data);
      var user = JSON.parse(
        this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)
      );
      if (user.LoginName !== "superadmin") {
          this.Wokers = this.Wokers.filter(function(el) {
              return (!el.LoginName || (el.LoginName && el.LoginName.indexOf("superadmin") === -1));
          });
      }
    });
    if (this.typeproject == false) {
      var projectRequest = {
        RequestClass: "BPM",
        RequestAction: "SearchGroup",
        ConditionFields: "GroupType,Description",
        StaticFields:
          "GroupId;GroupName;Description;GroupParent;Status;GroupPath",
        StructFields: "ParentName",
        orderFields: "GroupName ASC",
        RequestDataType: "json",
        GroupType: 1
      };
      this.$Utils.post(projectRequest).then(response => {
        var data = response.UserDS.Group;
        this.Projects = [
          {
            GroupId: 1,
            GroupName: "Tất cả"
          }
        ];
        this.Projects = this.Projects.concat(data);
      });
    }
  }
};
</script>
<style lang='scss' scoped>

.categories {
  @media screen and (max-width: 768px) {
    .el-date-range-picker {
      overflow: auto !important;
      width: 100% !important;
    }
  }

  .el-tree-node__expand-icon {
    font-size: 24px;
  }

  .my-row {
    .col-md-9 {
      padding: 0px !important;
    }
  }
  .my-header {
    display: flex;
    justify-content: space-between;
    background-color: #f0f3f5;
    /*border: 1px solid #c2cfd6;*/
    padding: 0 10px 3px 10px;
    cursor: pointer;
  }
  .el-header {
    background-color: #e1e1e1;
    color: #333;
    // line-height: 60px;
    height: auto !important;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .categories-form .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }

  .border-box {
    border: 1px solid #5090c1;
  }

  .title-box {
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
  }

  .el-aside {
    color: #333;
  }

  .categories-form {
    .el-form-item__label {
      line-height: 15px;
      margin-bottom: 2px;
    }

    .el-button--mini {
    }
  }
}

.mobile-category {
  .el-header {
    padding: 0 5px;
    .el-collapse {
      background-color: #e1e1e1;
    }
  }

  .el-main {
    padding: 0px;
  }

  .el-form-item {
    width: 45%;
  }
}
</style>
