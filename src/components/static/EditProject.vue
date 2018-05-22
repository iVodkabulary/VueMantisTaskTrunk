<template>
  <div class="EditProject">
    <el-form :model="model">
      <el-form-item prop="Name" :rules="{
          required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
        }" label="Tên dự án">
        <el-input v-model="model.Name" placeholder="Tên dự án"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="ProjectCode" :rules="{
            required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
          }" label="Mã dự án">
            <el-input v-model="model.ProjectCode" placeholder="Mã dự án"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">&ensp; </el-col>
        <el-col :span="11">
          <el-form-item label="Trạng thái">
            <el-select v-model="model.Status" placeholder="Trạng thái" style="width: 100%">
              <el-option v-for="item in ListStatus"
                         :key="item.Id"
                         :label="item.Name"
                         :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item  prop="Active">
            <el-checkbox v-model="model.Active">Kích hoạt</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="2">&ensp; </el-col>
        <el-col :span="11">
          <el-form-item  label="Trưởng dự án" :rules="{
            required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
          }"  >
            <el-select v-model="model.Manager" placeholder="Trưởng dự án" style="width: 100%" multiple :collapse-tags="$isMobileDevice">
              <el-option v-for="item in ListUser"
                         :key="item.UserId"
                         :label="item.Username"
                         :value="item.UserId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item  label="Phòng ban" :rules="{
            required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
          }" >
            <el-select v-model="model.Department" placeholder="Phòng ban" style="width: 100%" multiple :collapse-tags="$isMobileDevice" @change="checkWorker">
              <el-option v-for="item in ListGroup"
                         :key="item.GroupId"
                         :label="item.GroupName"
                         :value="item.GroupId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">&ensp; </el-col>
        <el-col :span="11">
          <el-form-item  label="Nhân sự" :rules="{
            required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
          }" >
            <el-select v-model="model.Worker" placeholder="Nhân sự" style="width: 100%" multiple :collapse-tags="$isMobileDevice">
              <el-option v-for="item in listWorker"
                         :key="item.UserId"
                         :label="item.Username"
                         :value="item.UserId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="Describe" label="Mô tả">
        <el-input type="textarea"
                  :rows="2"
                  placeholder="Mô tả"
                  v-model="model.Describe">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkExits()">Lưu</el-button>
        <el-button @click="closeForm()">Đóng</el-button>
      </el-form-item>
    </el-form>
    <ProjectCategories :data="model" v-if="model.Id" />
  </div>
</template>
<script>
import ProjectCategories from "@/components/static/ProjectCategories.vue";
export default {
  props: ["data"],
  components: { ProjectCategories },
  data() {
    return {
      textarea: "",
      ListStatus: [],
      ListUser: [],
      ListGroup: [],
      dataToPass: {},
      model: {
        Name: "",
        ProjectCode: "",
        Status: "",
        Active: false,
        Manager: [],
        Department: [],
        Worker: [],
        Describe: "",
        Id: undefined
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    closeForm() {
      this.$hub.$emit("close-modal");
    },
    checkExits() {
      var isAddNew = this.model.Id == undefined || this.model.Id == "";
      if (
        !this.model.Name ||
        this.model.Name == null ||
        this.model.Name.trim() == ""
      ) {
        this.$Utils.showMessage("error", "Tên dự án cần phải có");
        return;
      }
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "xDocument_Document.Search";
      request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
      request.R1_RequestFields =
        "Id;Tool;TypeName;Name;ProjectCode;ManagerName;StatusName;StateName;PermitName;Progress;DepartmentName;PlanManHour;ActualManHour;FinishDate;PriorityName;ProductName;StartDate;Version;Code;CreatedBy;Department;Id;Manager;ModifiedBy;Priority;PriorityDescription;PriorityId;State;Status;Type;Permit;Describe;Active;ActiveName;Department;DepartmentName;Manager;ManagerName;Worker;WorkerName";
      request.R1_Code = "Project";
      this.$Utils.post(request).then(data => {
        var ListProject = this.$Utils.getDataWithRoot(
          data.R1,
          "Data.DocumentDS.Document"
        );
        if (isAddNew) {
          ListProject = ListProject.filter(el => {
            return (
              (this.model.Name &&
                this.model.Name.toLowerCase() === el.Name.toLowerCase()) ||
              this.model.ProjectCode == el.ProjectCode
            );
          });
          if (ListProject.length > 0) {
            this.$Utils.showMessage("error", "Dự án hoặc mã dự án đã tồn tại");
            return;
          }
          //this.save();
        } else {
          ListProject = ListProject.filter(ek => {
            return (
              this.model.Name.toLowerCase() == ek.Name.toLowerCase() &&
              this.model.Id != ek.Id
            );
          });
          if (ListProject.length > 0) {
            this.$Utils.showMessage("error", "Dự án đã tồn tại");
            return;
          }
        }
        this.save();
      });
    },
    save() {
      var saveAble = true;
      if (!this.$Utils.isEmpty(this.model.Name)) {
        this.$Utils.showMessage("error", "Tên dự án bắt buộc nhập");
        saveAble = false;
      } else if (
        !this.$Utils.isEmpty(this.model.ProjectCode) ||
        this.model.ProjectCode.trim() === ""
      ) {
        this.$Utils.showMessage("error", "Mã dự án bắt buộc nhập");
        saveAble = false;
      } else if (
        !this.$Utils.isEmpty(this.model.Manager) ||
        this.model.Manager.length == 0
      ) {
        this.$Utils.showMessage("error", "Trưởng dự án bắt buộc nhập");
        saveAble = false;
      } else if (
        !this.$Utils.isEmpty(this.model.Department) ||
        this.model.Department.length == 0
      ) {
        this.$Utils.showMessage("error", "Phòng ban bắt buộc nhập");
        saveAble = false;
      } else if (
        !this.$Utils.isEmpty(this.model.Worker) ||
        this.model.Worker.length == 0
      ) {
        this.$Utils.showMessage("error", "Nhân sự bắt buộc nhập");
        saveAble = false;
      }
      if (saveAble) {
        var Manager = this.$Lodash.cloneDeep(this.model.Manager);
        this.model.ManagerName = "";
        this.model.Manager = "";
        Manager.forEach(value => {
          var objManager = this.ListUser.filter(el => {
            return el.UserId == value;
          });
          this.model.ManagerName += objManager[0].Username + ";";
          this.model.Manager += value + ";";
        });
        var Department = this.$Lodash.cloneDeep(this.model.Department);
        this.model.DepartmentName = "";
        this.model.Department = "";
        Department.forEach(value => {
          var objDepartment = this.ListGroup.filter(el => {
            return el.GroupId == value;
          });
          this.model.DepartmentName += objDepartment[0].GroupName + ";";
          this.model.Department += value + ";";
        });
        var Worker = this.$Lodash.cloneDeep(this.model.Worker);
        this.model.Worker = "";
        Worker.forEach(value => {
          this.model.Worker += value + ";";
        });
        if (this.$Utils.isEmpty(this.model.Status)) {
          var objStatus = this.ListStatus.filter(el => {
            return el.Id == this.model.Status;
          });
          if (objStatus[0] && objStatus[0].Name)
            this.model.StatusName = objStatus[0].Name;
        }
        if (
          this.$Utils.isEmpty(this.model.Active) &&
          this.model.ActiveName == true
        ) {
          this.model.ActiveName = "1";
          this.model.Active = "1";
        } else {
          this.model.ActiveName = "0";
          this.model.Active = "0";
        }
        this.UpdateProject();
      }
    },
    UpdateProject(group) {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "xDocument_Document.Update";
      request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
      request.R1_RequestFields =
        "Id;Code;CreatedByName;ModifiedByName;Permit;PermitName;Status;StatusName;Active;ActiveName;Name;Describe;ProjectCode;Department;DepartmentName;Manager;ManagerName;Worker;WorkerName";
      request.R1_Code = "Project";
      request.R1_ModifiedByName = JSON.parse(
        this.$Utils.getUserInfo()
      ).Username;
      if (this.model.Id == undefined || this.model.Id == "") {
        request.R1_RequestTemplate = "xDocument_Document.Insert";
        request.R1_CreatedByName = JSON.parse(
          this.$Utils.getUserInfo()
        ).Username;
      }
      request = this.$Utils.updateParamsSingleRequest(request, this.model);
      this.$Utils.post(request).then(data => {
        // console.log(data)
        if (data.success) {
          this.$Utils.showMessage("success", "Thêm mới thành công.");
          var RoleLeader = ["Email", "View", "Download", "Notification"];
          // var RoleWorker = ['View'];
          RoleLeader.forEach(code => {
            this.model.Manager.split(";").forEach(manager => {
              if (manager != "") {
                var linkEmail = {
                  RequestClass: "xBase",
                  Parent: data.R1.Data,
                  Child: manager,
                  Code: code,
                  Name: this.model.Name + " - " + code,
                  RequestAction: "LinkUserToObject",
                  ParentTable: "xObject",
                  ChildTable: "tblUser",
                  RequestTemplate: "Permission.Insert"
                };
                // console.log(linkEmail)
                this.$Utils.post(linkEmail).then(ldata => {});
              }
            });
          });
          this.model.Worker.split(";").forEach(worker => {
            if (worker != "") {
              var linkEmail = {
                RequestClass: "xBase",
                Parent: data.R1.Data,
                Child: worker,
                Code: "View",
                Name: this.model.Name + " - View",
                RequestAction: "LinkUserToObject",
                ParentTable: "xObject",
                ChildTable: "tblUser",
                RequestTemplate: "Permission.Insert"
              };
              // console.log(linkEmail)
              this.$Utils.post(linkEmail).then(ldata => {});
            }
          });
          if (
            this.$Utils.isEmpty(this.data.user, "Manager") &&
            this.data.user.Manager != "" &&
            this.model.Manager != this.data.user.Manager
          ) {
            this.data.user.Manager.split(";").forEach(user => {
              if (user != "" && this.model.Manager.indexOf(user) == -1) {
                var paramsSearchLinked = {
                  RequestAction: "SearchLinked",
                  RequestClass: "Addition",
                  ConditionFields: "Parent;Child;",
                  SessionId: this.$getItemLocalStorage(
                    this.$localStorageConstant.SessionId
                  ),
                  StaticFields: "Code;Child;Parent;Name;Created;Description",
                  OrderFields: "Created DESC",
                  Parent: data.R1.Data,
                  Child: user
                };
                this.$Utils.post(paramsSearchLinked).then(result => {
                  if (result.TotalCount > 0) {
                    var arrLink =
                      result.TotalCount == 1
                        ? [result.Data.DataDS.Linked]
                        : result.Data.DataDS.Linked;
                    var removeLinks = {
                      RequestClass: "xBase",
                      RequestAction: "Request",
                      TotalRequests: arrLink.length,
                      RequestTemplate: "Permission.Remove"
                    };
                    $.each(arrLink, (key, link) => {
                      removeLinks["R" + (key + 1) + "_Id"] = link.Id;
                      removeLinks["R" + (key + 1) + "_Parent"] = link.Parent;
                      removeLinks["R" + (key + 1) + "_Child"] = link.Child;
                      removeLinks["R" + (key + 1) + "_Code"] = link.Code;
                    });
                    // console.log(removeLinks)
                    /** post request xóa, và gọi lại function tạo phân quyền với count + 1 */
                    this.$Utils.post(removeLinks).then(() => {});
                  }
                });
              }
            });
          }
          if (
            this.$Utils.isEmpty(this.mode) &&
            this.mode.mode != "MODE_PROJECT"
          ) {
            this.model.Department.split(";").forEach(group => {
              if (group != "") {
                var linkEmail = {
                  RequestClass: "xBase",
                  Parent: data.R1.Data,
                  Child: group,
                  Code: "View",
                  Name: this.model.Name + " - " + this.model.DepartmentName,
                  RequestAction: "LinkGroupToObject",
                  ParentTable: "xObject",
                  ChildTable: "tblGroup",
                  RequestTemplate: "Permission.Insert"
                };
                // console.log(linkEmail)
                this.$Utils.post(linkEmail).then(ldata => {});
              }
            });
          }
          if (
            this.$Utils.isEmpty(this.data.user, "Department") &&
            this.data.user.Department != "" &&
            this.model.Department != this.data.user.Department
          ) {
            this.data.user.Department.split(";").forEach(group => {
              if (group != "" && this.model.Department.indexOf(group) == -1) {
                var paramsSearchLinked = {
                  RequestAction: "SearchLinked",
                  RequestClass: "Addition",
                  ConditionFields: "Parent;Child;",
                  SessionId: this.$getItemLocalStorage(
                    this.$localStorageConstant.SessionId
                  ),
                  StaticFields: "Code;Child;Parent;Name;Created;Description",
                  OrderFields: "Created DESC",
                  Parent: data.R1.Data,
                  Child: group
                };
                // console.log(paramsSearchLinked)
                this.$Utils.post(paramsSearchLinked).then(result => {
                  if (result.TotalCount > 0) {
                    var arrLink =
                      result.TotalCount == 1
                        ? [result.Data.DataDS.Linked]
                        : result.Data.DataDS.Linked;
                    var removeLinks = {
                      RequestClass: "xBase",
                      RequestAction: "Request",
                      TotalRequests: arrLink.length,
                      RequestTemplate: "Permission.Remove"
                    };
                    $.each(arrLink, (key, link) => {
                      removeLinks["R" + (key + 1) + "_Id"] = link.Id;
                      removeLinks["R" + (key + 1) + "_Parent"] = link.Parent;
                      removeLinks["R" + (key + 1) + "_Child"] = link.Child;
                      removeLinks["R" + (key + 1) + "_Code"] = link.Code;
                    });
                    // console.log(removeLinks)
                    /** post request xóa, và gọi lại function tạo phân quyền với count + 1 */
                    this.$Utils.post(removeLinks).then(() => {});
                  }
                });
              }
            });
          }
          if (
            this.$Utils.isEmpty(this.mode) &&
            this.mode.mode != "MODE_PROJECT"
          ) {
            this.model.Department.split(";").forEach(val => {
              var linkLeader = {
                RequestClass: "xBase",
                Parent: data.R1.Data,
                Child: val,
                Code: "View",
                Name: this.model.Name + " - View",
                RequestAction: "LinkGroupToObject",
                ParentTable: "xObject",
                ChildTable: "tblGroup",
                RequestTemplate: "Permission.Insert"
              };
              // console.log(linkLeader)
              this.$Utils.post(linkLeader).then(ldata => {
                // this.data.function.getProject();
                this.data.search();
                this.closeForm();
              });
            });
          } else {
            // this.data.function.getProject();
            this.data.search();
            this.closeForm();
          }
        } else {
          this.$Utils.showMessage("error", this.toastMessage.updateItemFailed);
        }
      });
    },
    Delete(val) {
      if (val) {
        DeleteGroup(val.GroupId);
        if (val.children) {
          $.each(value.children, (key2, value2) => {
            Delete(value2);
          });
        }
      } else return;
    },
    DeleteGroup(groupid) {
      var requestD = {
        RequestAction: "DeleteGroup",
        RequestClass: "BPM",
        ConditionFields: "GroupId",
        GroupId: groupid,
        SessionId: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        )
      };
      this.$Utils.post(requestD).then(data => {});
    },
    checkPermit(val) {
      if (val.Id == "4e5c6049-41c2-4abd-b9de-6b32beb22490") {
        this.DisplayPermit = true;
      } else this.DisplayPermit = false;
    },
    checkWorker(item) {
      var Worker = this.$Lodash.cloneDeep(this.data.user.Worker);
      this.model.Worker = [];
      if (item.length >= this.model.Department.length) {
        // this.listWorker = this.$Lodash.cloneDeep(this.ListUser);
        var listDepartment = "";
        item.forEach(department => {
          listDepartment += department + ";";
        });
        var request = {
          RequestAction: "SearchUserWithGroups",
          IncludedGroupManager: "true",
          RequestClass: "BPM",
          RequestDataType: "json",
          SessionId: this.$getItemLocalStorage(
            this.$localStorageConstant.SessionId
          ),
          ConditionFields: "IncludedGroupManager;Group;Status",
          StaticFields: "UserId;Username;LoginName;Description;Status;",
          OrderFields: "LoginName ASC",
          Group: listDepartment,
          Status: 1
        };
        this.$Utils.post(request).then(data => {
          data = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
          this.ListWorker = data;
          if (!this.isSystemAdmin)
            this.ListWorker = this.ListWorker.filter(el => {
              if (el.Groups) {
                return JSON.stringify(el.Groups).indexOf("superadmin") == -1;
              }
            });
          this.ListWorker.forEach(item => {
            if (
              this.$Utils.isEmpty(Worker) &&
              Worker.indexOf(item.UserId) > -1
            ) {
              this.model.Worker.push(item.UserId);
            }
          });
        });
      }
    }
  },
  created() {
    this.dataToPass = this.data;
    var pro = this.dataToPass.user;
    if (pro && pro.Name) {
      this.model.Id = pro.Id;
      this.model.Name = pro.Name;
      this.model.ProjectCode = pro.ProjectCode;
      this.model.Status = pro.Status;
      if (pro.Active == "0") {
        this.model.Active = false;
      } else {
        this.model.Active = true;
      }
      this.model.Manager = pro.Manager;
      this.model.Department = pro.Department;
      this.model.Worker = pro.Worker;
      this.model.Describe = pro.Describe;
    }
    this.DisplayPermit = false;
    this.viewModel = { Data: { Fields: [] } };
    if (this.model.Permit == "4e5c6049-41c2-4abd-b9de-6b32beb22490") {
      this.DisplayPermit = true;
    }
    if (this.model.Active == false) this.model.Active = 0;
    else if (this.model.Active == true) {
      this.model.Active = 1;
    }
    var request = this.$Lodash.cloneDeep(this.$singleRequest);
    request.R1_RequestTemplate = "Setting.SearchSetting";
    request.R1_ParentCode = "xSetting.Project.Parameter.ProjectPermit";
    request.R2_RequestTemplate = "Setting.SearchSetting";
    request.R2_ParentCode = "xSetting.Project.Parameter.ProjectStatus";
    request.TotalRequests = 2;
    this.$Utils.post(request).then(data => {
      this.ListPermit = this.$Utils.getDataWithRoot(
        data.R1,
        "Data.DynamicDS.Setting"
      );
      this.ListPermit.forEach(item => {
        if (item.Id == this.data.user.Permit) {
          this.model.Permit = item;
        }
      });
      this.ListStatus = this.$Utils.getDataWithRoot(
        data.R2,
        "Data.DynamicDS.Setting"
      );
      // this.ListStatus.forEach((item) => {
      //   if (item.Id == this.data.Status) {
      // this.model.Status.push(this.data.Status);
      //   }
      // })
      // this.model.Status = this.data.Status;
    });
    var Department = this.$Lodash.cloneDeep(this.model.Department);
    this.model.Department = [];
    var Manager = this.$Lodash.cloneDeep(this.model.Manager);
    this.model.Manager = [];
    var groupRequest = this.$Lodash.cloneDeep(this.$singleRequest);
    groupRequest.R1_RequestTemplate = "OrgnizationList";
    groupRequest.R1_GroupType = 1;
    groupRequest.R1_Status = 1;
    this.$Utils.post(groupRequest).then(group => {
      this.ListGroup = this.$Utils.getDataWithRoot(
        group.R1,
        "Data.UserDS.Group"
      );
      $.each(this.ListGroup, (key, value) => {
        var childRank = value.Level;
        this.ListGroup[key].text = "";
        while (childRank > 1) {
          this.ListGroup[key].text += "|-- ";
          childRank--;
        }
        this.ListGroup[key].text += value.GroupName;
        if (this.$Utils.isEmpty(Department) && typeof Department === "string") {
          Department.split(";").forEach(key => {
            if (key != "" && key == value.GroupId) {
              this.model.Department.push(value.GroupId);
            }
          });
        }
      });
    });
    this.listWorker = [];
    var request = {
      RequestClass: "BPM",
      RequestAction: "SearchUser",
      StaticFields: "UserId;Username;LoginName;Status",
      ConditionFields: "Status",
      IncludedGroup: true,
      Status: 1,
      SessionId: this.$getItemLocalStorage(this.$localStorageConstant.SessionId)
    };
    this.$Utils.post(request).then(data => {
      data = this.$Utils.getDataWithRoot(data, "UserDS.User");
      this.ListUser = [];
      data.forEach(item => {
        if (this.$Utils.isEmpty(Manager) && Manager.indexOf(item.UserId) > -1) {
          if (
            (!this.$isSystemAdmin() && item.LoginName != "superadmin") ||
            this.$isSystemAdmin()
          ) {
            this.model.Manager.push(item.UserId);
          }
        }
        if (
          (!this.$isSystemAdmin() && item.LoginName != "superadmin") ||
          this.$isSystemAdmin()
        ) {
          this.ListUser.push(item);
        }
      });
      this.listWorker = this.$Lodash.cloneDeep(this.ListUser);
      if (this.data.user.Worker) {
        this.checkWorker(this.model.Department);
      }
    });
  }
};
</script>
