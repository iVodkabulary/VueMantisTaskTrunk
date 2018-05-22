<template>
  <div>
    <el-form>
      <el-tabs type="border-card">
        <el-tab-pane label="Cơ bản">
          <el-form :model="model" ref="basicInfo" :rules="basicInfoRules" class="row justify-content-md-center">
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Hình đại diện:">
                <AvatarUpload :imageUrl="model.CurAvatar"/>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1"></div>
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item v-if="$isMantisAdmin() || $isSystemAdmin()" label="Quyền người dùng:">
                <el-select v-model="RoleAdmin" placeholder="Chọn">
                  <el-option value="user" label="Người dùng"></el-option>
                  <el-option value="bod" label="BOD"></el-option>
                  <el-option value="bom" label="BOM"></el-option>
                  <el-option value="admin" label="Quản trị viên"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1"></div>
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Tên đăng nhập" prop="LoginName">
                <el-input :disabled="model.UserId!=undefined" v-model="model.LoginName"
                          placeholder="tendangnhap"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Tên đầy đủ" prop="Username">
                <el-input v-model="model.Username" placeholder="Tên đầy đủ"></el-input>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Thư điện tử" prop="Email">
                <el-input v-model="model.Email" placeholder="thudientu@vidu.com"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Số điện thoại" prop="Telephone">
                <el-input v-model="model.Telephone" placeholder="0912345678"></el-input>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Ngày sinh" prop="Birthday">
                <el-date-picker v-model="model.Birthday"></el-date-picker>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Mật khẩu(ít nhất 5 kí tự)" prop="Password">
                <el-input v-model="model.Password" type="password" placeholder="***"></el-input>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Link Facebook" prop="Facebook">
                <el-input v-model="model.Facebook" placeholder="https://www.facebook.com/tendangnhap"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Skype" prop="Skype">
                <el-input v-model="model.Skype" placeholder="tendangnhapskype"></el-input>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Tiểu sử" prop="Biography">
                <el-input type="textarea" v-model="model.Biography" :rows="2"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Quá trình công tác" prop="WorkProcess">
                <el-input type="textarea" v-model="model.WorkProcess" :rows="2"></el-input>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Người phụ trách" prop="Accountable">
                <el-select v-model="model.Description.Accountable" placeholder="Chọn">
                  <el-option v-for="item in viewModel.ListUsers " :value="item.UserId" :label="item.Username"
                             :key="item.UserId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Người điều khiển" prop="Control">
                <el-select v-model="model.Description.Control" placeholder="Chọn">
                  <el-option v-for="item in viewModel.ListUsers " :value="item.UserId"
                             :label="item.Username" :key="item.UserId"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!--end row-->
            <div class="col-md-5 col-sm-12 col-xs-12">
              <el-form-item label="Người quản lý" prop="Manager">
                <el-select v-model="model.Description.Manager" placeholder="Chọn">
                  <el-option v-for="item in viewModel.ListUsers " :value="item.UserId"
                             :label="item.Username" :key="item.UserId"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12 offset-md-1">
              <el-form-item label="Người kiểm tra" prop="DoubleChecker">
                <el-select v-model="model.Description.DoubleChecker" placeholder="Chọn">
                  <el-option v-for="item in viewModel.ListUsers " :value="item.UserId"
                             :label="item.Username" :key="item.UserId"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="model.UserId" label="Thông báo">
          <el-form class="justify-content-md-center" style="width: 100%">
            <el-form-item label="Phần công việc">
              <div class="row">
                <div class="col">
                  <label>Tất cả</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb1.Status">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
                <div class="col">
                  <label>Thêm mới</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb1.Add" @change="onChangeNoti()">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
                <div class="col">
                  <label>Chỉnh sửa</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb1.Edit" @change="onChangeNoti()">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
                <div class="col">
                  <label>Bình luận</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb1.Comment" @change="onChangeNoti()">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="Phần tài liệu">
              <div class="row">
                <div class="col-3">
                  <label>Tất cả</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb2.Status">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
                <div class="col-3">
                  <label>Thêm mới</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb2.Add" @change="onChangeNoti()">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
                <div class="col-3">
                  <label>Chỉnh sửa</label>
                  <label class="switch switch-text switch-pill switch-primary">
                    <input type="checkbox" class="switch-input" v-model="dataNoti.cb2.Edit" @change="onChangeNoti()">
                    <span class="switch-label" data-on="Bật" data-off="Tắt"></span>
                    <span class="switch-handle"></span>
                  </label>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Phòng ban & dự án">
          <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12" id="tblGroups">
              <el-card>
                <table >
                  <thead>
                  <tr class="row" >
                    <th  class="col-6">Phòng ban</th>
                    <th  class="col-6">Vai trò</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="row" v-for="item in Departments" :key="item.GroupId">
                    <td class="col-6">
                      <el-checkbox v-model="viewModel.Groups[item.GroupId]" @change="checkGroup(item)"
                                   :disabled="!isSystemAdmin && !isMantisAdmin">
                        {{item.GroupName}}
                      </el-checkbox>
                    </td>
                    <td class="col-6">
                        <div class="row">
                        <div class="col-md-6 col-sm-12 col-xs-12" v-for="grole in item.children" :key="grole.GroupId" >
                          <el-checkbox @change="handleRoleChange($event, item)" v-model="viewModel.GroupRoles[grole.GroupId]"
                                      :disabled="!isSystemAdmin && !isMantisAdmin">{{grole.Description}}
                          </el-checkbox>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-card>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12">
              <el-card>
                <table class="el-table__body-wrapper is-scroll-left">
                  <thead>
                  <tr>
                    <th>Dự án</th>
                    <th style="text-align: center;">Vai trò</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in Project " :key="item.Id">
                    <td>
                      <el-checkbox v-model="viewModel.Projects[item.Id]" @change="checkProject($event, item, true)"
                                   :disabled="!isSystemAdmin && !isMantisAdmin">
                        {{item.Name}}
                      </el-checkbox>
                    </td>
                    <td class="row">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <el-checkbox v-model="viewModel.WProject[item.Id]" @change="checkRoleProject($event, item, viewModel.MProject[item.Id], true)"
                                     :disabled="!isSystemAdmin && !isMantisAdmin">
                          Thành viên
                        </el-checkbox>
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <el-checkbox v-model="viewModel.MProject[item.Id]" @change="checkRoleProject($event, item, viewModel.WProject[item.Id], false)"
                                     :disabled="!isSystemAdmin && !isMantisAdmin">
                          Trưởng dự án
                        </el-checkbox>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Vai trò" v-if="$isSystemAdmin()">
          <div>
            <div layout="row" layout-wrap flex>
              <div flex layout="column">
                <div class="md-block" flex>
                  <label translate="USERS.Dialogs_Main_Role">Vai trò chính</label>
                  <el-select v-model="model.RoleRoot"
                             @change="changeRoleRoot">
                    <el-option v-for="item in viewModel.listRoles" :value="item.GroupId" :label="item.Description"
                               :key="item.GroupId">
                    </el-option>
                  </el-select>
                </div>
                <label translate="USERS.Dialogs_Role">Vai trò</label>
                <el-tree :data="viewModel.Role.source" show-checkbox node-key="GroupId"
                         :default-checked-keys="viewModel.Role.defaultCheckedNode" ref="roleTree"
                         :props="{children: 'children', label: 'Description'}" @check-change="changeGroup"></el-tree>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-col :span="24" class="text-center">
        <el-button type="primary" @click="save()">Lưu</el-button>
        <el-button @click="cancel()">Đóng</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import AvatarUpload from "@/components/static/AvatarUpload";
import Vue from "vue";
import ShowCrDepartment from "@/components/static/ShowCrDepartment";

Vue.use(require("vue-moment"));
export default {
  components: {AvatarUpload},
  props: ["data"],
  data() {
    var ctrl = {};
    if (this.data.action == "insert") {
      ctrl.model = {
        Description: {},
        RoleRoot: ""
      };
    } else {
      var desc = JSON.parse(this.data.item.Description);
      ctrl.model = {
        Description: {
          Accountable:
            desc.Accountable && desc.Accountable.UserId
              ? desc.Accountable.UserId
              : "",
          Control:
            desc.Control && desc.Control.UserId ? desc.Control.UserId : "",
          Manager:
            desc.Manager && desc.Manager.UserId ? desc.Manager.UserId : "",
          DoubleChecker:
            desc.DoubleChecker && desc.DoubleChecker.UserId
              ? desc.DoubleChecker.UserId
              : ""
        },
        UserId: this.data.item.UserId,

        RoleRoot: this.data.item.RoleRoot,
        LoginName: this.data.item.LoginName,
        Username: this.data.item.Username,
        Email: this.data.item.Email,
        Birthday: this.data.item.Birthday
          ? Vue.moment(this.data.item.Birthday)._d
          : "",
        Telephone: this.data.item.Telephone,
        Password: this.data.item.Password,
        Facebook: this.data.item.Facebook,
        Skype: this.data.item.Skype,
        Biography: this.data.item.Biography,
        WorkProcess: this.data.item.WorkProcess
      };
      $.each(this.data.item, function(k, ele) {
        if (ctrl.model[k] == undefined) ctrl.model[k] = ele;
      });
      ctrl.model.CurAvatar = this.data.item.Avatar
        ? this.data.item.Avatar.replace('/Download','Download')
        : "";
    }
    ctrl.basicInfoRules = {
      LoginName: [
        { required: true, message: "", trigger: "blur" },
        {
          min: 5,
          max: 20,
          message: "Tên đăng nhập có độ dài từ 5 tới 20 kí tự",
          trigger: "blur"
        }
      ],
      Username: [
        { required: true, message: "Tên cần phải có", trigger: "blur" }
      ],
      Email: [
        {
          type: "email",
          required: true,
          message: "email sai định dạng",
          trigger: "blur"
        }
      ]
    };
    ctrl.dataToPass = this.data;
    ctrl.renderable = false;
    ctrl.records = [];
    ctrl.Project = [];
    ctrl.myDes = {};
    ctrl.rolesObj = {};
    ctrl.deptsLst = [];
    ctrl.groupsAndGroupRolesTree = [];
    ctrl.objGroupRole = {};
    ctrl.objGroupRoleX = {};
    ctrl.selectedProjectName = "";
    ctrl.RoleAdmin = "";
    ctrl.formMode = this.data.action;
    ctrl.isMobileVer =
      this.$isMobile.Android() ||
      this.$isMobile.BlackBerry() ||
      this.$isMobile.Opera() ||
      this.$isMobile.iOS();
    ctrl.isMobileApp =
      this.$isMobile.Android() ||
      this.$isMobile.BlackBerry() ||
      this.$isMobile.Opera() ||
      (this.$isMobile.iOS() && !this.$isMobile.iPad());
    ctrl.dataNoti = {
      cb1: { Status: false, Add: false, Edit: false, Comment: false },
      cb2: { Status: false, Add: false, Edit: false, Comment: false }
    };
    ctrl.dataDB = {
      cb1: { Status: false, Add: false, Edit: false, Comment: false },
      cb2: { Status: false, Add: false, Edit: false, Comment: false }
    };
    ctrl.viewModel = {
      ListUsers: [],
      Data: { Fields: [] },
      Group: {
        source: []
      },
      Role: {
        source: [],
        checkChange: function(event) {
          ctrl.changeGroup(event, "Role", ctrl.treeRole);
        }
      },
      Projects: {
        source: []
      },
      WProject: {
        source: []
      },
      MProject: {
        source: []
      },

      GroupRoles: {
        source: []
      },
      GroupDropdown: {
        source: []
      },
      Groups: {},
      GroupRoles: {}
    };
    $.each(ctrl.model, function(key, value) {
      if (value == "true") ctrl.model[key] = true;
      else if (value == "false") ctrl.model[key] = false;
    });
    ctrl.Departments = [];
    ctrl.Roles = [];
    return ctrl;
  },
  methods: {
    handleRoleChange(checked, item) {
      var ctrl = this;
      var isChecked = false;
      $.each(item.children, (key, ele) => {
        if (ctrl.viewModel.GroupRoles[ele.GroupId]) {
          isChecked = true;
          return;
        }
      });

      ctrl.$set(ctrl.viewModel.Groups, item.GroupId, isChecked);
    },
    onChangeNoti() {
      var ctrl = this;
      // ctrl.dataDB.cb1.Status = !ctrl.dataNoti.cb1.Status;
      ctrl.dataDB.cb1.Edit = !ctrl.dataNoti.cb1.Edit;
      ctrl.dataDB.cb1.Add = !ctrl.dataNoti.cb1.Add;
      ctrl.dataDB.cb1.Comment = !ctrl.dataNoti.cb1.Comment;
      // ctrl.dataDB.cb2.Status = !ctrl.dataNoti.cb2.Status;
      ctrl.dataDB.cb2.Add = !ctrl.dataNoti.cb2.Add;
      ctrl.dataDB.cb2.Edit = !ctrl.dataNoti.cb2.Edit;
      ctrl.dataDB.cb2.Comment = !ctrl.dataNoti.cb2.Comment;
      ctrl.dataNoti.cb1.Status =
        ctrl.dataNoti.cb1.Add == true ||
        ctrl.dataNoti.cb1.Edit == true ||
        ctrl.dataNoti.cb1.Comment == true;
      ctrl.dataDB.cb1.Status = !ctrl.dataNoti.cb1.Status;
      ctrl.dataNoti.cb2.Status =
        ctrl.dataNoti.cb2.Add == true ||
        ctrl.dataNoti.cb2.Edit == true ||
        ctrl.dataNoti.cb2.Comment == true;
      ctrl.dataDB.cb2.Status = !ctrl.dataNoti.cb2.Status;
    },
    checkProject(checked, item, autoCheckChild) {
      var ctrl = this;
      if (checked && ctrl.$Utils.isEmpty(item.Department) && item.Department != "") {
        ctrl.viewModel.WProject[item.Id] = autoCheckChild;
        $.each(item.Department.split(";"), function(k, val) {
          if (JSON.stringify(ctrl.viewModel.Groups).indexOf(val) == -1) {
            ctrl.viewModel.Groups[val] = true;
          } else {
            $.each(ctrl.viewModel.Groups, function(key, group) {
              if (key == val && !group) {
                ctrl.viewModel.Groups[val] = true;
              }
            });
          }
        });
      } else {
        if (ctrl.$Utils.isEmpty(ctrl.viewModel.MProject, item.Id) && ctrl.viewModel.MProject[item.Id] == true) {
          ctrl.viewModel.MProject[item.Id] = false;
        }
        if (ctrl.$Utils.isEmpty(ctrl.viewModel.WProject, item.Id) && ctrl.viewModel.WProject[item.Id] == true) {
          ctrl.viewModel.WProject[item.Id] = false;
        }
      }
    },
    checkRoleProject(checked, item, other, type) {
      this.$set(this.viewModel.Projects, item.Id, checked || other);
      this.checkProject(checked || other, item, type);
    },
    checkGroup(item) {
      var ctrl = this;
      if (this.viewModel.Groups[item.GroupId] == false) {
        $.each(ctrl.objGroupRole[item.GroupId], function(key, val) {
          if (ctrl.viewModel.GroupRoles[val.GroupId] == true) {
            ctrl.viewModel.GroupRoles[val.GroupId] = false;
          }
        });
      } else {
      }
    },
    executeUserGroup(action, userId, groupId, noMessage) {
      var ctrl = this;
      var request = {
        RequestAction: action + "UserGroup",
        RequestClass: "BPM",
        UserId: userId,
        GroupId: groupId,
      };
      ctrl.$Utils.post(request).then(function(data) {
        if (noMessage == undefined || noMessage == null) {
          ctrl.$Utils.showMessage(
            "success",
            ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf
          );
        }
      });
    },
    contentType(value) {
      if (Vue.moment(value, "YYYY-MM-DD", true).isValid()) {
        return 3;
      } else if (!isNaN(value)) {
        if (value % 1 === 0) {
          return 1;
        } else {
          return 2;
        }
      }
      return 0;
    },
    changeRoleRoot(roleRoot) {
      var checkedKeys = this.$refs.roleTree.getCheckedKeys();
      if (checkedKeys.indexOf(roleRoot) == -1) {
        checkedKeys.push(roleRoot);
        this.$refs.roleTree.setCheckedKeys(checkedKeys);
      }
    },
    changeGroup(data, checked, indeterminate) {
      var ctrl = this;
      if (
        ctrl.$Utils.isEmpty(ctrl.model.Groups) &&
        ctrl.model.Groups.indexOf(data.GroupId) == -1
      ) {
        ctrl.model.Groups += data.GroupId + ";";
        // var tmpRolesObj = ctrl.$Utils.rotateDementionArr(ctrl.viewModel.listRoles, 'GroupId');
        ctrl.model.RoleRoot = data.GroupId;
        if (ctrl.model.UserId) {
          ctrl.executeUserGroup("Insert", ctrl.model.UserId, data.GroupId);
        }
      }
      if (!checked) {
        if (ctrl.model.UserId) {
          var requestS = {
            RequestAction: "SearchGroup",
            RequestClass: "BPM",
            GroupParent: data.GroupId,
            GroupType: 2,
            SessionId: ctrl.$getItemLocalStorage(
              ctrl.$localStorageConstant.SessionId
            )
          };
          ctrl.$Utils.post(requestS).then(function(dataReq) {
            var listGroupId = ctrl.$Utils.getDataWithRoot(
              dataReq,
              "UserDS.Group"
            );
            if (listGroupId.length > 0) {
              ctrl.arrGroupId = [data.GroupId];
              ctrl.arrGroupId.concat(listGroupId);

              $.each(ctrl.arrGroupId, function(k, item) {
                ctrl.executeUserGroup("Delete", ctrl.model.UserId, item);
                ctrl.model.Groups = ctrl.model.Groups.replace(item + ";", "");
              });
            } else {
              ctrl.executeUserGroup("Delete", ctrl.model.UserId, data.GroupId);
            }
          });
          ctrl.model.Groups = ctrl.model.Groups.replace(data.GroupId + ";", "");
        } else {
          ctrl.model.Groups = ctrl.model.Groups.replace(data.GroupId + ";", "");
        }
      }
    },
    changeProject(event, tree) {
      var ctrl = this;
      var args = event.args;
      var changedItem = tree.getItem(args.element);
      ctrl.selectedProjectName = changedItem.label;

      if (!args.checked) {
        if (
          ctrl.$Utils.isEmpty(ctrl.ListAddProject) &&
          ctrl.ListAddProject.indexOf(changedItem.value) != -1
        ) {
          ctrl.ListAddProject = ctrl.ListAddProject.replace(
            changedItem.value + ";",
            ""
          );
        } else {
          ctrl.ListRmProject = changedItem.value + ";";
        }
      } else {
        ctrl.checkedGroup = [];
        $.each(ctrl.Project, function(k, value) {
          if (value.Id == changedItem.value) {
            $.each(ctrl.treeGroup.getCheckedItems(), function(k, group) {
              var item = { Caption: group.label, Value: group.value };
              ctrl.checkedGroup.push(item);
            });
            if (
              JSON.stringify(ctrl.checkedGroup).indexOf(value.Department) == -1
            ) {
              $.each(ctrl.treeGroup.getItems(), function(k, item) {
                if (value.Department.indexOf(item.value) != -1) {
                  ctrl.treeGroup.checkItem(item);
                }
              });
            }
          }
        });
        ctrl.ListAddProject += changedItem.value + ";";
      }
    },
    save() {
      var ctrl = this;
      var isValidated = true;
      var isValidGroup = false;
      /*if (ctrl.$Utils.equals(ctrl.viewModel.Groups, {})
        ||ctrl.$Utils.equals(ctrl.convertObjectToArray(ctrl.viewModel.Groups), [])) {
          isValidated = false;
      }*/
      $.each(ctrl.viewModel.Groups, (k,g) => {
        if(g == true){
          isValidGroup = true;
          return false;
        }
      });
      isValidated = isValidGroup == true;
      var message = "";
      var arrRequireKey = [
        { Name: "Username", Message: "Tên đầy đủ" },
        { Name: "LoginName", Message: "Tên đăng nhập" },
        { Name: "Email", Message: "Email" }
      ];
      ctrl.model.Notification = {};
      $.each(ctrl.dataDB, function(key, item) {
        if (key == "cb1")
          ctrl.model.Notification["DataGroup.danh-sach-cong-viec.04b66"] = item;
        if (key == "cb2")
          ctrl.model.Notification["DataGroup.tai-lieu-dung-chung.0cb59"] = item;
      });
      ctrl.model.Notification = JSON.stringify(ctrl.model.Notification);
      $.each(arrRequireKey, function(k, item) {
        if (
          (message == "" && ctrl.model[item.Name] == "") ||
          ctrl.model[item.Name] == undefined
        ) {
          isValidated = false;
          message = item.Message;
        }
      });
      if (!ctrl.model.UserId &&
        (ctrl.model.Password == undefined || ctrl.model.Password == "" || ctrl.model.Password.length < 5)) {
          isValidated = false;
          message = "Mật khẩu";
      }
      if (ctrl.model.UserId && ctrl.model.Password && ctrl.model.Password.length !== 0 && ctrl.model.Password.length < 5) {
        isValidated = false;
        message = "Mật khẩu";
      }
      if (isValidated) {
        ctrl.$Utils.saveSelectModel(ctrl);
        var request = {
          RequestClass: "BPM",
          RequestAction: "InsertUser",
          StructFields:
            "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;Notification",
          StaticFields: "UserId;Username;LoginName;Description;Status;",
          DynamicFields:
            "Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone;Avatar",
          SessionId: ctrl.$getItemLocalStorage(
            this.$localStorageConstant.SessionId
          )
        };

        if (ctrl.$Utils.isEmpty(ctrl.model.RoleRoot)) {
          ctrl.model.RoleRootName =
            ctrl.viewModel.objRoles[ctrl.model.RoleRoot];
        }
        var selectedGroup = { value: "", label: "" };
        ctrl.model.GroupRoot = selectedGroup.value;
        ctrl.model.GroupRootName = selectedGroup.label;

        ctrl.model.Description.RoleRoot = {
          Caption: ctrl.model.RoleRoot,
          Value: ctrl.model.RoleRootName
        };
        ctrl.model.Description.GroupRoot = {
          Caption: ctrl.model.GroupRoot,
          Value: ctrl.model.GroupRootName
        };

        if (
          ctrl.model.Description.Accountable &&
          ctrl.model.Description.Accountable !== ""
        )
          ctrl.myDes.Accountable = {
            UserId: ctrl.model.Description.Accountable,
            Username:
              ctrl.viewModel.ObjectUsers[ctrl.model.Description.Accountable]
                .Username
          };

        if (
          ctrl.model.Description.Control &&
          ctrl.model.Description.Control !== ""
        )
          ctrl.myDes.Control = {
            UserId: ctrl.model.Description.Control,
            Username:
              ctrl.viewModel.ObjectUsers[ctrl.model.Description.Control]
                .Username
          };

        if (
          ctrl.model.Description.Manager &&
          ctrl.model.Description.Manager !== ""
        )
          ctrl.myDes.Manager = {
            UserId: ctrl.model.Description.Manager,
            Username:
              ctrl.viewModel.ObjectUsers[ctrl.model.Description.Manager]
                .Username
          };

        if (
          ctrl.model.Description.DoubleChecker &&
          ctrl.model.Description.DoubleChecker !== ""
        )
          ctrl.myDes.DoubleChecker = {
            UserId: ctrl.model.Description.DoubleChecker,
            Username:
              ctrl.viewModel.ObjectUsers[ctrl.model.Description.DoubleChecker]
                .Username
          };

        ctrl.myDes.GroupLevel1 = [];
        ctrl.myDes.GroupLevel2 = [];

        $.each(ctrl.model, function(key, value) {
          if (ctrl.$Utils.isEmpty(value)) {
            if (key == "Birthday")
              request[key] = Vue.moment(value).format("YYYY-MM-DD");
            else {
              request[key] = value;
              if (request.StructFields.indexOf(key) >= 0) {
                request[key + "ColumnType"] = ctrl.contentType(value);
              }
            }
          }
        });

        // $.each(request, function (key, value) {
        //   if (request.StructFields.indexOf(key) >= 0) {
        //     request[key + "ColumnType"] = ctrl.contentType(value);
        //   }
        // });

        if (ctrl.model.UserId) {
          request.RequestAction = "UpdateUser";
          request.UserId = ctrl.model.UserId;
        }
        if (ctrl.model.Notification == "") {
          request.Notification = ";";
        }
        request.Description = JSON.stringify(ctrl.myDes);
        delete request.Password;

        ctrl.$Utils.post(request).then(function(data) {
          try {
            if((typeof data) === 'string')
              data = JSON.parse(data);
          } catch (e) {
            data = { success: false };
          }
          if (data.success) {
            ctrl.$Utils.showMessage(
              "success",
              ctrl.$toastMessage.updateItemPre +
                ctrl.$toastMessage.updateItemSuf
            );
            // if (ctrl.RoleAdmin == "admin") {
              var insertGroup = {
                RequestAction: "InsertUserGroup",
                RequestClass: "BPM",
                UserId: data.Data,
                GroupId: ctrl.$roleEveryoneId
              };
              ctrl.$Utils.post(insertGroup);

            //   var insertRoleAdmin = {
            //     RequestAction: "InsertUserGroup",
            //     RequestClass: "BPM",
            //     UserId: data.Data,
            //     GroupId: ctrl.$supervisor
            //   };
            //   ctrl.$Utils.post(insertRoleAdmin);
            // } else {
            //   if (ctrl.dataToPass.action == "edit") {
            //     var insertGroup = {
            //       RequestAction: "DeleteUserGroup",
            //       RequestClass: "BPM",
            //       UserId: data.Data,
            //       GroupId: ctrl.$supervisor
            //     };
            //     ctrl.$Utils.post(insertGroup);
            //   } else {
            //     var insertGroup = {
            //       RequestAction: "InsertUserGroup",
            //       RequestClass: "BPM",
            //       UserId: data.Data,
            //       GroupId: ctrl.$roleEveryoneId
            //     };
            //     ctrl.$Utils.post(insertGroup);
            //   }
            // }
            if (ctrl.dataToPass.action == "edit") {
                if(ctrl.RoleAdmin != "admin"){
                  var insertGroup = {
                    RequestAction: "DeleteUserGroup",
                    RequestClass: "BPM",
                    UserId: data.Data,
                    GroupId: ctrl.$supervisor
                  };
                  ctrl.$Utils.post(insertGroup);
                }
                if(ctrl.RoleAdmin != "bod"){
                  var insertGroup = {
                    RequestAction: "DeleteUserGroup",
                    RequestClass: "BPM",
                    UserId: data.Data,
                    GroupId: ctrl.$manager
                  };
                  ctrl.$Utils.post(insertGroup);
                }
                if(ctrl.RoleAdmin != "bom"){
                  var insertGroup = {
                    RequestAction: "DeleteUserGroup",
                    RequestClass: "BPM",
                    UserId: data.Data,
                    GroupId: ctrl.$leader
                  };
                  ctrl.$Utils.post(insertGroup);
                }
                var insertGroup = {
                  RequestAction: "InsertUserGroup",
                  RequestClass: "BPM",
                  UserId: data.Data,
                  // GroupId: ctrl.$roleEveryoneId
                };
                if(ctrl.RoleAdmin == "admin"){
                  insertGroup.GroupId = ctrl.$supervisor
                } else if(ctrl.RoleAdmin == "bod"){
                  insertGroup.GroupId = ctrl.$manager
                } else if(ctrl.RoleAdmin == "bom"){
                  insertGroup.GroupId = ctrl.$leader
                }
                ctrl.$Utils.post(insertGroup);
            } else {
              var insertGroup = {
                RequestAction: "InsertUserGroup",
                RequestClass: "BPM",
                UserId: data.Data,
                GroupId: ctrl.$roleEveryoneId
              };
              ctrl.$Utils.post(insertGroup);

              if(ctrl.RoleAdmin == "admin"){
                insertGroup.GroupId = ctrl.$supervisor
              } else if(ctrl.RoleAdmin == "bod"){
                insertGroup.GroupId = ctrl.$manager
              } else if(ctrl.RoleAdmin == "bom"){
                insertGroup.GroupId = ctrl.$leader
              }
              ctrl.$Utils.post(insertGroup);
            }
            if (
              ctrl.model.Password != undefined &&
              ctrl.model.Password != null
            ) {
              request = {
                RequestClass: "BPM",
                RequestAction: "SetPassword",
                Account: ctrl.model.LoginName,
                Password: ctrl.model.Password,
                SessionId: ctrl.$getItemLocalStorage(
                  ctrl.$localStorageConstant.SessionId
                )
              };
              ctrl.$Utils.post(request);
            }

            ctrl.model.UserId = data.Data;
            ctrl.communication = {
              action: ctrl.action,
              item: ctrl.model,
              index: ctrl.dataToPass.index
            };
            ctrl.saveUserGroup(data.Data);
            ctrl.saveProjectPermiss(data.Data);
            // ctrl.Cache = {};
            // if (ctrl.dataToPass.scope != null)
            //   ctrl.dataToPass.scope.bindUsers(ctrl.$Lodash.cloneDeep(ctrl.communication));
            if (ctrl.dataToPass.reload){
              ctrl.dataToPass.reload();
            }else{
              ctrl.$hub.$emit('userInfoChanged');
            }
            ctrl.cancel();
          } else {
            if (ctrl.model.userId) {
              ctrl.$Utils.showMessage(
                "error",
                ctrl.$toastMessage.updateItemFailed
              );
            } else {
              ctrl.$Utils.showMessage(
                "error",
                "Tài khoản đã tồn tại hoặc đang bị khóa"
              );
            }
          }
        });
      } else {
        if (!ctrl.$Utils.isEmpty(ctrl.model.LoginName)) {
          ctrl.$Utils.showMessage("error", "Tên đăng nhập bắt buộc nhập");
          isValidated = false;
        } else if (!ctrl.$Utils.isEmpty(ctrl.model.Username)) {
          ctrl.$Utils.showMessage("error", "Tên đầy đủ bắt buộc nhập");
          isValidated = false;
        } else if (!ctrl.$Utils.isEmpty(ctrl.model.Email)) {
          ctrl.$Utils.showMessage("error", "Email bắt buộc nhập");
          isValidated = false;
        } else if ((!ctrl.model.UserId && (ctrl.model.Password == undefined || ctrl.model.Password == "" || ctrl.model.Password.length < 5))
        || (ctrl.model.UserId && ctrl.model.Password && ctrl.model.Password.length !== 0 && ctrl.model.Password.length < 5)) {
          ctrl.$Utils.showMessage("error", "Mật khẩu phải ít nhất 5 kí tự");
          isValidated = false;
        } else if (!isValidGroup) {
          ctrl.$Utils.showMessage(
            "error",
            "Bạn phải chọn ít nhất một phòng ban"
          );
          isValidated = false;
        }
      }
    },
    saveUserGroup(userId) {
      var ctrl = this;
      var lstInsGroups = [];
      var lstDelGroups = [];
      lstDelGroups = lstDelGroups.concat(
        ctrl.compareArray(
          ctrl.convertObjectToArray(ctrl.Cache.GroupsTemp),
          ctrl.convertObjectToArray(ctrl.viewModel.Groups)
        )
      );
      lstDelGroups = lstDelGroups.concat(
        ctrl.compareArray(
          ctrl.convertObjectToArray(ctrl.Cache.GroupsRoleTemp),
          ctrl.convertObjectToArray(ctrl.viewModel.GroupRoles)
        )
      );
      lstDelGroups = lstDelGroups.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });
      lstInsGroups = lstInsGroups.concat(
        ctrl.compareArray(
          ctrl.convertObjectToArray(ctrl.viewModel.Groups),
          ctrl.convertObjectToArray(ctrl.Cache.GroupsTemp)
        )
      );
      lstInsGroups = lstInsGroups.concat(
        ctrl.compareArray(
          ctrl.convertObjectToArray(ctrl.viewModel.GroupRoles),
          ctrl.convertObjectToArray(ctrl.Cache.GroupsRoleTemp)
        )
      );
      lstInsGroups = lstInsGroups.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });
      // insert usergroup
      $.each(lstInsGroups, function(k, value) {
        if (ctrl.$Utils.isEmpty(value)) {
          var insertGroup = {
            RequestAction: "InsertUserGroup",
            RequestClass: "BPM",
            UserId: userId,
            GroupId: value
          };
          ctrl.$Utils.post(insertGroup).then(function(data) {});
        }
      });
      // delete userGroup
      $.each(lstDelGroups, function(k, value) {
        if (ctrl.$Utils.isEmpty(value)) {
          var deleteGroup = {
            RequestAction: "DeleteUserGroup",
            RequestClass: "BPM",
            UserId: userId,
            GroupId: value
          };
          ctrl.$Utils.post(deleteGroup).then(function(data) {});
        }
      });
    },
    saveProjectPermiss(userId) {
      var ctrl = this;
      // insert
      var lstProjectIns = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.viewModel.Projects),
        ctrl.convertObjectToArray(ctrl.Cache.ProjectsTemp)
      );
      var lstManagerIns = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.viewModel.MProject),
        ctrl.convertObjectToArray(ctrl.Cache.MProjectsTemp)
      );
      var lstWorkerIns = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.viewModel.WProject),
        ctrl.convertObjectToArray(ctrl.Cache.WProjectsTemp)
      );
      // insert user to project
      var lstProject = ctrl.$Lodash.cloneDeep(ctrl.Project);
      $.each(lstProject, function(k, project) {
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = "xDocument_Document.Update";
        request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
        request.R1_RequestFields = "Id;Worker;Manager";
        request.R1_Id = project.Id;
        var manager = lstManagerIns.filter(function(item) {
          return item === project.Id;
        });
        var worker = lstWorkerIns.filter(function(item) {
          return item === project.Id;
        });
        var pWorker = project.Worker ? project.Worker : "";
        var pManager = project.Manager ? project.Manager : "";
        if (worker.length > 0 && pWorker.indexOf(userId) == -1) {
          request.R1_Worker = project.Worker + userId + ";";
        }
        if (manager.length > 0 && pManager.indexOf(userId) == -1) {
          request.R1_Manager = project.Manager + userId + ";";
        }
        if (
          ctrl.$Utils.isEmpty(request, "R1_Manager") ||
          ctrl.$Utils.isEmpty(request, "R1_Worker")
        ) {
          ctrl.$Utils.post(request).then(function(data) {});
          var insertLink = {
            RequestClass: "xBase",
            Parent: project.Id,
            Child: userId,
            Code: "View",
            Name: project.Name + " - " + "View",
            RequestAction: "LinkUserToObject",
            ParentTable: "xObject",
            ChildTable: "tblUser",
            RequestTemplate: "Permission.Insert"
          };
          ctrl.$Utils.post(insertLink).then(function(ldata) {});
        }
      });
      //delete
      var lstProjectDel = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.Cache.ProjectsTemp),
        ctrl.convertObjectToArray(ctrl.viewModel.Projects)
      );
      var lstManagerDel = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.Cache.MProjectsTemp),
        ctrl.convertObjectToArray(ctrl.viewModel.MProject)
      );
      var lstWorkerDel = ctrl.compareArray(
        ctrl.convertObjectToArray(ctrl.Cache.WProjectsTemp),
        ctrl.convertObjectToArray(ctrl.viewModel.WProject)
      );
      $.each(lstProject, function(k, project) {
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = "xDocument_Document.Update";
        request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
        request.R1_RequestFields = "Id;Worker,Manager";
        request.R1_Id = project.Id;
        var manager = lstManagerDel.filter(function(item) {
          return item === project.Id;
        });
        var worker = lstWorkerDel.filter(function(item) {
          return item === project.Id;
        });
        var pWorker = project.Worker ? project.Worker : "";
        var pManager = project.Manager ? project.Manager : "";

        if (worker.length > 0 && pWorker.indexOf(userId) != -1) {
          request.R1_Worker = pWorker.replace(userId + ";", "");
        }
        if (manager.length > 0 && pManager.indexOf(userId) != -1) {
          request.R1_Manager = pManager.replace(userId + ";", "");
        }

        if (
          ctrl.$Utils.isEmpty(request, "R1_Manager") ||
          ctrl.$Utils.isEmpty(request, "R1_Worker")
        ) {
          ctrl.$Utils.post(request).then(function(data) {});
          var paramsSearchLinked = {
            RequestAction: "SearchLinked",
            RequestClass: "Addition",
            ConditionFields: "Parent;",
            SessionId: ctrl.$getItemLocalStorage(
              this.$localStorageConstant.SessionId
            ),
            StaticFields: "Code;Child;Parent;Name;Created;Description",
            OrderFields: "Created DESC",
            Parent: project.Id,
            Child: userId
          };
          ctrl.$Utils.post(paramsSearchLinked).then(function(result) {
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
              $.each(arrLink, function(key, link) {
                removeLinks["R" + (key + 1) + "_Id"] = link.Id;
              });
              /** post request xóa, và gọi lại function tạo phân quyền với count + 1 */
              ctrl.$Utils.post(removeLinks).then(function() {});
            }
          });
        }
      });
    },
    convertObjectToArray(object) {
      var array = [];
      var strArray = JSON.stringify(object);
      strArray = strArray.split("{").join("");
      strArray = strArray.split("}").join("");
      strArray = strArray.split(",");
      $.each(strArray, function(k, value) {
        if (value) {
          value = value.split(":");
          if (value[1] === "true") {
            array.push(value[0].split('"').join(""));
          }
        }
      });
      return array;
    },
    compareArray(arrayA, arrayB) {
      var array = arrayA.filter(function(x) {
        return arrayB.indexOf(x) < 0;
      });
      return array;
    },
    cancel() {
      this.$hub.$emit("close-modal");
    },
    getAndBindRoles() {
      var req1 = {
        RequestClass: "BPM",
        RequestAction: "SearchGroup",
        ConditionFields: "GroupType",
        StaticFields:
          "GroupId;GroupName;Description;GroupParent;Status;GroupType",
        StructFields: "ParentName",
        GroupType: "0",
        orderFields: "GroupName ASC",
        RequestDataType: "json"
      };
      this.$Utils.post(req1).then(respond => {
        respond = this.$Utils.getDataWithRoot(respond, "UserDS.Group");
        this.viewModel.Role.source = this.$Utils.treeify(
          respond,
          "GroupId",
          "parent",
          "level"
        );
        this.viewModel.listRoles = respond;
        this.viewModel.objRoles = this.$Utils.rotateDementionArr(
          respond,
          "GroupId"
        );
        var arrGroups = [];
        if (
          this.model.Groups != undefined &&
          this.model.Groups.constructor === String
        ) {
          arrGroups = this.model.Groups.split(";");
          this.viewModel.Role.defaultCheckedNode = arrGroups;
        }
      });
    },
    getAndBindProjects() {
      var ctrl = this;
      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
      request.R1_RequestTemplate = "xDocument_Document.Search";
      request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
      request.R1_RequestFields =
        "Id;Name;Code;Manager;State;Status;Permit;ProjectCode;Department;Worker";
      request.R1_Code = "Project";
      ctrl.$Utils.postCheckResult(request).then(function(data) {
        ctrl.Project = ctrl.$Utils.getDataWithRoot(
          data.R1,
          "Data.DocumentDS.Document"
        );
        var projectTemp = [];
        if (!ctrl.isMantisAdmin && !ctrl.isSystemAdmin) {
          $.each(ctrl.Project, function(k, val) {
            if (
              ctrl.$Utils.isEmpty(ctrl.dataToPass.item, "UserId") &&
              ((ctrl.$Utils.isEmpty(val.Worker) &&
                val.Worker.indexOf(ctrl.dataToPass.item.UserId) != -1) ||
                (ctrl.$Utils.isEmpty(val.Manager) &&
                  val.Manager.indexOf(ctrl.dataToPass.item.UserId) != -1))
            ) {
              projectTemp.push(val);
            }
          });
          ctrl.Project = projectTemp;
        }
        var treeProject = [];
        ctrl.objGroup = {};
        treeProject = ctrl.$Lodash.cloneDeep(ctrl.Project);
        // ctrl.viewModel.Projects = {};
        // ctrl.viewModel.WProject = {};
        // ctrl.viewModel.MProject = {};
        $.each(treeProject, function(k, item) {
          ctrl.$set(ctrl.viewModel.Projects, item.Id, false);
          ctrl.$set(ctrl.viewModel.WProject, item.Id, false);
          ctrl.$set(ctrl.viewModel.MProject, item.Id, false);
          if (
            ctrl.$Utils.isEmpty(ctrl.dataToPass.item, "UserId") &&
            (ctrl.$Utils.isEmpty(item.Worker) &&
              item.Worker.indexOf(ctrl.dataToPass.item.UserId) != -1)
          ) {
            ctrl.$set(ctrl.viewModel.Projects, item.Id, true);
            ctrl.$set(ctrl.viewModel.WProject, item.Id, true);
          }
          if (
            ctrl.$Utils.isEmpty(item.Manager) &&
            ctrl.dataToPass.item &&
            item.Manager.indexOf(ctrl.dataToPass.item.UserId) != -1
          ) {
            ctrl.$set(ctrl.viewModel.Projects, item.Id, true);
            ctrl.$set(ctrl.viewModel.MProject, item.Id, true);
          }
        });
        ctrl.viewModel.Projects.source = treeProject;

        ctrl.Cache.ProjectsTemp = ctrl.$Lodash.cloneDeep(ctrl.viewModel.Projects);
        ctrl.Cache.MProjectsTemp = ctrl.$Lodash.cloneDeep(ctrl.viewModel.MProject);
        ctrl.Cache.WProjectsTemp = ctrl.$Lodash.cloneDeep(ctrl.viewModel.WProject);



      });
    },
    showCreatedDepartment(row){
        var titleDialog = "Thêm mới phòng ban";
        var dataToPass = {
          treeSrc: [],
          groupP:[],
          groupRole: [],
          //callback: this.reload,
          checkGroup: true
        };
        if(row !=undefined){
          dataToPass.item = row;
          titleDialog = "Chỉnh sửa phòng ban";
        }
        this.$hub.$emit(
        "set-modal-data",
          titleDialog,
        "60%",
        true,
        "center",
        ShowCrDepartment,
        true,
        'showCreatedDepartment',
        dataToPass
      );
  },
    getAndBindDepartments() {
      var ctrl = this;
      var req1 = {
        RequestClass: "BPM",
        RequestAction: "SearchGroup",
        ConditionFields: "GroupType",
        StaticFields:
          "GroupId;GroupName;Description;GroupParent;Status;GroupType",
        StructFields: "ParentName",
        GroupType: "1;2",
        orderFields: "GroupName ASC",
        RequestDataType: "json"
      };

      this.$Utils.post(req1).then(respond => {
        ctrl.model.Groups = ctrl.model.Groups ? ctrl.model.Groups : "";
        respond = respond.UserDS.Group;
        if(!respond){
          ctrl.$confirm('Hiện tại chưa có phòng ban, bạn có muốn tạo phòng ban?', 'Cảnh Báo',
            {
              confirmButtonText: 'Đồng ý',
              cancelButtonText: 'Bỏ qua',
              type: 'warning'
            }
          ).then(()=> {
            this.cancel();
            this.showCreatedDepartment();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Hủy bỏ tạo người dùng!'
            });
           this.cancel();
          });
        }
        ctrl.Departments = [];
        ctrl.Roles = [];
        if(respond)
        respond.forEach(ele => {
          if (ele.GroupType === "1") {
            ele["children"] = {};
            ctrl.Departments.push(ele);
            ctrl.$set(ctrl.viewModel.Groups, ele.GroupId, false);
            if (
              ctrl.model.Groups
                .toLowerCase()
                .indexOf(ele.GroupId.toLowerCase()) > -1
            ) {
              ctrl.$set(ctrl.viewModel.Groups, ele.GroupId, true);
            }
          }
          if (ele.GroupType === "2") {
            ctrl.Roles.push(ele);
            ctrl.$set(ctrl.viewModel.GroupRoles, ele.GroupId, false);
            if (
              ctrl.model.Groups
                .toLowerCase()
                .indexOf(ele.GroupId.toLowerCase()) > -1
            ) {
              ctrl.$set(ctrl.viewModel.GroupRoles, ele.GroupId, true);
            }
          }
        });
        ctrl.Departments.forEach(ele => {
          ctrl.Roles.forEach(child => {
            if (ele.GroupId === child.GroupParent)
              ele.children[child.GroupId] = child;
          });
        });
        ctrl.Cache.GroupsTemp = ctrl.$Lodash.cloneDeep(ctrl.viewModel.Groups);
        ctrl.Cache.GroupsRoleTemp = ctrl.$Lodash.cloneDeep(ctrl.viewModel.GroupRoles);

        return;
        respond = ctrl.$Utils.treeify(respond, "GroupId", "GroupParent");
        ctrl.deptsLst = [];
        var tmp = respond.filter(item => {
          ctrl.$set(ctrl.viewModel.Groups, item.GroupId, false);
          if (item.GroupType === "1") {
            if (
              ctrl.model.Groups
                .toLowerCase()
                .indexOf(item.GroupId.toLowerCase()) > -1
            ) {
              ctrl.$set(ctrl.viewModel.Groups, item.GroupId, true);
            }
            if (item.children != undefined) {
              item.children.filter((ele, i) => {
                if (ele.GroupType === "1") {
                  ctrl.$set(ctrl.viewModel.Groups, ele.GroupId, false);
                  if (
                    ctrl.model.Groups
                      .toLowerCase()
                      .indexOf(ele.GroupId.toLowerCase()) > -1
                  ) {
                    ctrl.$set(ctrl.viewModel.Groups, ele.GroupId, true);
                  }
                  ele.children.filter((e, i) => {
                    ctrl.$set(ctrl.viewModel.GroupRoles, e.GroupId, false);
                    if (
                      ctrl.model.Groups
                        .toLowerCase()
                        .indexOf(e.GroupId.toLowerCase()) > -1
                    ) {
                      ctrl.$set(ctrl.viewModel.GroupRoles, e.GroupId, true);
                    }
                  });
                  ctrl.deptsLst.push(ctrl.$Lodash.cloneDeep(ele));
                  item.children.splice(i, 1);
                } else {
                  ctrl.$set(ctrl.viewModel.GroupRoles, ele.GroupId, false);
                  if (
                    ctrl.model.Groups
                      .toLowerCase()
                      .indexOf(ele.GroupId.toLowerCase()) > -1
                  ) {
                    ctrl.$set(ctrl.viewModel.GroupRoles, ele.GroupId, true);
                  }
                }
              });
            }

            ctrl.deptsLst.push(item);
          }
        });
      });
    },
    getUsers() {
      var ctrl = this;
      var userReq = {
        RequestAction: "SearchUserWithGroups",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        SessionId: ctrl.$getItemLocalStorage(
          ctrl.$localStorageConstant.SessionId
        ),
        ConditionFields: "IncludedGroupManager;Group;Status;LoginName",
        StaticFields: "UserId;Username;LoginName;Description;Status;",
        DynamicFields:
          "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
        StructFields:
          "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification",
        OrderFields: "LoginName ASC",
        GroupType: "1",
        Status: "1"
      };
      ctrl.$Utils.postCheckResult(userReq).then(function(data) {
        data = ctrl.$Utils.getDataWithRoot(data, "Data.UserDS.User");
        ctrl.viewModel.ListUsers = data;
        ctrl.viewModel.ObjectUsers = ctrl.$Utils.rotateDementionArr(
          data,
          "UserId"
        );
      });
    }
  },
  created() {
    var ctrl = this;
    if (ctrl.data.action == "edit") {
      var request = {
        RequestClass: "BPM",
        RequestAction: "SearchGroup",
        ConditionFields: "GroupType",
        StaticFields: "GroupId;GroupName;Description;GroupParent;Status",
        StructFields: "ParentName",
        GroupType: 0,
        GroupId: ctrl.dataToPass.item.Groups,
        orderFields: "GroupName ASC",
        RequestDataType: "json"
      };
      ctrl.$Utils.postCheckResult(request).then(function(data) {
        data = ctrl.$Utils.getDataWithRoot(data, "UserDS.Group");
        data.filter(function(item) {
          if(item.GroupId == ctrl.$supervisor){
            ctrl.RoleAdmin = "admin";
          } else if(ctrl.RoleAdmin == "" && item.GroupId == ctrl.$manager) {
            ctrl.RoleAdmin = "bod";
          } else if(ctrl.RoleAdmin == "" && item.GroupId == ctrl.$leader) {
            ctrl.RoleAdmin = "bom";
          } else if(ctrl.RoleAdmin == ""){
            ctrl.RoleAdmin = "user";
          }
        });
        // if (data.length > 0) {
        //   ctrl.RoleAdmin = "admin";
        // } else {
        //   ctrl.RoleAdmin = "user";
        // }
      });
    } else if (ctrl.data.action == "insert") {
      ctrl.RoleAdmin = "user";
    }
    ctrl.getAndBindProjects();
    //
    if (
      ctrl.$Utils.isEmpty(ctrl.dataToPass.item, "Notification") &&
      ctrl.dataToPass.item.Notification.indexOf("{") != -1
    ) {
      ctrl.dataDB.cb1 = JSON.parse(ctrl.dataToPass.item.Notification)[
        "DataGroup.danh-sach-cong-viec.04b66"
      ];
      ctrl.dataDB.cb2 = JSON.parse(ctrl.dataToPass.item.Notification)[
        "DataGroup.tai-lieu-dung-chung.0cb59"
      ];
      ctrl.dataNoti.cb1.Status = !ctrl.dataDB.cb1.Status;
      ctrl.dataNoti.cb1.Edit = !ctrl.dataDB.cb1.Edit;
      ctrl.dataNoti.cb1.Add = !ctrl.dataDB.cb1.Add;
      ctrl.dataNoti.cb1.Comment = !ctrl.dataDB.cb1.Comment;
      ctrl.dataNoti.cb2.Status = !ctrl.dataDB.cb2.Status;
      ctrl.dataNoti.cb2.Add = !ctrl.dataDB.cb2.Add;
      ctrl.dataNoti.cb2.Edit = !ctrl.dataDB.cb2.Edit;
      ctrl.dataNoti.cb2.Comment = !ctrl.dataDB.cb2.Comment;
      ctrl.onChangeNoti();
    }
    ctrl.isSystemAdmin = ctrl.$isSystemAdmin();
    ctrl.isMantisAdmin = ctrl.$isMantisAdmin();
    ctrl.Cache = {};
    ctrl.Cache.GroupsTemp = {};
    ctrl.Cache.GroupsRoleTemp = {};
    ctrl.Cache.ProjectsTemp = {};
    ctrl.Cache.MProjectsTemp = {};
    ctrl.Cache.WProjectsTemp = {};

    ctrl.ListAddProject = "";
    ctrl.ListRmProject = "";

    ctrl.communication = { action: "", item: {}, index: "", scope: ctrl };
    ctrl.getUsers();
    ctrl.getAndBindDepartments();

    ctrl.getAndBindRoles();
  },
  mounted() {
    this.$hub.$on("imgUploaded", id => {
      this.model.Avatar = "/Download.ashx?Id=" + id;
    });
  },
  watch: {
    'dataNoti.cb1.Status': {
      handler: function (after) {
        if(!after){
          this.dataNoti.cb1.Add = after;
          this.dataNoti.cb1.Edit = after;
          this.dataNoti.cb1.Comment = after;
          this.dataDB.cb1.Add = !after;
          this.dataDB.cb1.Edit = !after;
          this.dataDB.cb1.Comment = !after;
          this.dataDB.cb1.Status = !after;
        }
      },
      deep: true,
    },
    'dataNoti.cb2.Status': {
      handler: function (after) {
        if(!after) {
          this.dataNoti.cb2.Add = after;
          this.dataNoti.cb2.Edit = after;
          this.dataNoti.cb2.Comment = after;
          this.dataDB.cb2.Add = !after;
          this.dataDB.cb2.Edit = !after;
          this.dataDB.cb2.Comment = !after;
          this.dataDB.cb2.Status = !after;
        }
      },
      deep: true,
    }
  },
  destroy() {
    this.$hub.$off("imgUploaded");
  }
};
</script>

<style scoped>
.el-date-editor,
.el-select {
  width: 100%;
}
</style>
