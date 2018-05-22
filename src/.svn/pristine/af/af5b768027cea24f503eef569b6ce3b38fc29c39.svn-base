<template>
	<div class="row mb-0">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="formUpdate">
  <el-form-item v-bind:label="'Tên ' + title" prop="name" >
    <el-input v-model="form.name"></el-input>
  </el-form-item>
   <el-form-item v-bind:label="'Mã ' + title">
    <el-input v-model="form.code"></el-input>
  </el-form-item>
  <el-form-item label="Hoạt động">
    <el-switch v-model="form.status"></el-switch>
  </el-form-item>
  <el-form-item v-if="data.checkGroup === '1'" label="Vai trò sử dụng">
    <el-select class="w-100" multiple clearable value-key="Name" v-model="form.groupRole">
     <el-option v-for="item in form.groupRoleTemp" :label="item.Caption" :value="item" :key="item.Name"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-bind:label="titleR + ' cha'">
    <b-form-select v-model="form.parentId" class="mb-3 selectP">
      <option v-for="item in data.groupP" :value="item.GroupId" :key="item.Id">{{item.text}}</option>
    </b-form-select>
  </el-form-item>
  <el-form-item label="Nhân sự" v-if="option &&  data.checkGroup != 2">
    <el-select size="large" v-model="form.user" placeholder="Chọn"  @change="executeUserGroup(form.user)" multiple style="width:100%">
    <el-option
      v-for="item in listUser"
      :key="item.UserId"
      :label="item.Username"
      :value="item.UserId">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="Mô tả" prop="desc">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-form-item>
    </el-form-item>
    <el-button type="primary" @click="onSubmit('form')">Lưu</el-button>
    <el-button @click="close">Đóng</el-button>
  </el-form-item>
</el-form>
	</div>

</template>
<script>
import Vue from "vue";
import SelectTree from "@/components/dynamic/SelectTree";

export default {
  components: { SelectTree },
  props: ["data"],
  data() {
    return {
      form: {
        name: "",
        code: "",
        status: true,
        desc: "",
        parentId: "",
        groupParent: "",
        user: [],
        oriUser: [],
        groupRole: [],
        groupRoleTemp: []
      },
      stages: [],
      listUser: [],
      title: "",
      titleR: "",
      input: "",
      checked: true,
      option: true,
      rules: {
        name: [
          { required: true, message: "Hãy nhập tên phòng", trigger: "blur" }
        ],
        desc: [{ required: true, message: "Hãy nhập mô tả", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getUser();
    var ctrl = this;
    if (ctrl.data.checkGroup == "1") {
      ctrl.title = "phòng ban";
      ctrl.titleR = "Phòng ban";
    } else {
      ctrl.title = "vai trò";
      ctrl.titleR = "Vai trò";
    }
    this.groupParent = ctrl.data.groupP;
    if (this.data.item) {
      this.option = true;
      var dataToPass = this.data.item;
      this.form.name = dataToPass.label;
      this.form.code = dataToPass.code;
      this.form.desc = dataToPass.des;
      this.form.groupRole = this.$Lodash.cloneDeep(dataToPass.groupRole);
      if (dataToPass.ParentId) {
        this.form.parentId = dataToPass.ParentId;
      }
      if (dataToPass.status == "1") {
        this.form.status = true;
      } else {
        this.form.status = false;
      }
    } else {
      this.option = false;
    }
    if (this.data.groupP) {
      $.each(this.data.groupP, function(k, value) {
        if (value.Level) {
          var childRank = value.Level;
          ctrl.data.groupP[k].text = "";
          while (childRank > 1) {
            ctrl.data.groupP[k].text += "|-- ";
            childRank--;
          }
          ctrl.data.groupP[k].text += value.GroupName;
        }
      });
    }
    var roleRequest = this.$Lodash.cloneDeep(this.$singleRequest);
    roleRequest.R1_RequestTemplate = "Setting.SearchSetting";
    roleRequest.R1_ParentCode = "xSetting.Default.Permissions.RoleTemplate";
    this.$Utils.post(roleRequest).then(roleData => {
      this.form.groupRoleTemp = this.$Utils.getDataWithRoot(
        roleData.R1,
        "Data.DynamicDS.Setting"
      );
      this.$forceUpdate();
    });
  },
  methods: {
    executeUserGroup(User) {
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      var ctrl = this;
      if (this.$Utils.equals(User, ctrl.oriUser) == false) {
        if (ctrl.oriUser.length > User.length) {
          $.each(ctrl.oriUser, function(key, val) {
            if (JSON.stringify(User).indexOf(val) == -1) {
              var request = {
                RequestAction: "DeleteUserGroup",
                RequestClass: "BPM",
                UserId: val,
                GroupId: ctrl.data.item.Id,
                SessionId: sessionId
              };
              ctrl.$Utils.post(request).then(data => {
                if (data.success) {
                  ctrl.$message({
                    message:
                      "Đã bỏ nhân sự ra khỏi phòng ban " + ctrl.data.item.text,
                    type: "success"
                  });
                } else {
                  ctrl.$message.error("Đã xảy ra lỗi. Xin vui lòng thử lại.");
                }
              });
            }
          });
        } else {
          $.each(User, function(key, val) {
            if (JSON.stringify(ctrl.oriUser).indexOf(val) == -1) {
              var request = {
                RequestAction: "InsertUserGroup",
                RequestClass: "BPM",
                UserId: val,
                GroupId: ctrl.data.item.Id,
                SessionId: sessionId
              };
              ctrl.$Utils.post(request).then(dataS => {
                if (dataS) {
                  ctrl.$message({
                    message:
                      "Đã thêm nhân sự vào phòng ban " + ctrl.data.item.text,
                    type: "success"
                  });
                } else {
                  ctrl.$message.error("Đã xảy ra lỗi. Xin vui lòng thử lại.");
                }
              });
            }
          });
        }
      }
    },
    getUser() {
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      var ctrl = this;
      var request = {
        RequestAction: "SearchUserWithGroups",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        SessionId: sessionId,
        ConditionFields: "IncludedGroupManager;Group;Status",
        StaticFields: "UserId;Username;LoginName;Description;Status;",
        OrderFields: "LoginName ASC",
        Status: 1
      };
      this.$Utils.post(request).then(dataUser => {
        var dataUser = this.$Utils.getDataWithRoot(
          dataUser,
          "Data.UserDS.User"
        );
        if (!this.$isSystemAdmin()) {
          dataUser = dataUser.filter(function(el) {
            return el.LoginName != "superadmin"; //el.Groups.indexOf(this.administrator) == -1 ;
          });
        }
        this.listUser = dataUser;
        var arrTemp = [];
        if (this.data.item) {
          $.each(dataUser, function(key, val) {
            if (
              ctrl.$Utils.isEmpty(val.Groups) &&
              JSON.stringify(val.Groups).indexOf(ctrl.data.item.Id) != -1
            ) {
              arrTemp.push(val.UserId);
            }
          });
        }
        ctrl.form.user = arrTemp;
        ctrl.oriUser = arrTemp;
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSave();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onSave() {
      var ctrl = this;
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      if (!this.data) {
      } else {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 1;
        if (this.data.item) {
          request.R1_RequestTemplate = "OrgnizationUpdate";
          request.R1_GroupId = this.data.item.Id;
        } else {
          request.R1_RequestTemplate = "OrgnizationInsert";
        }
        request.R1_GroupParent = this.form.parentId;
        if (this.data.checkGroup == "1") {
          request.R1_GroupType = 1;
        } else if (this.data.checkGroup == "2") {
          request.R1_GroupType = 0;
        }
        request.R1_GroupName = this.form.name;
        request.R1_GroupPath = this.form.code;
        if (this.form.status == true) {
          request.R1_Status = 1;
        } else {
          request.R1_Status = 2;
        }
        request.R1_Description = this.form.desc;
        this.$Utils.post(request).then(dataSave => {
          if (dataSave) {
            if (request.R1_RequestTemplate == "OrgnizationInsert") {
              var insertGroup = {
                RequestAction: "InsertUserGroup",
                RequestClass: "BPM",
                UserId: JSON.parse(this.$Utils.getUserInfo()).UserId,
                GroupId: dataSave.R1.Data
              };
              this.$Utils.post(insertGroup).then(data => {
                console.log(data)
              });
              if (request.R1_GroupType == 1) {
                var roleRequest = this.$Lodash.cloneDeep(this.$singleRequest);
                roleRequest.R1_RequestTemplate = "Setting.SearchSetting";
                roleRequest.R1_ParentCode = "xSetting.Default.Permissions.RoleTemplate";
                $.each(this.form.groupRoleTemp, (k, rValue) => {
                  var createNew = {
                    R1_Status: 1,
                    RequestAction: "Request",
                    RequestClass: "xBase",
                    TotalRequests: 1,
                    R1_RequestTemplate: "OrgnizationInsert",
                    R1_GroupParent: dataSave.R1.Data,
                    R1_GroupName: rValue.Name,
                    R1_GroupType: 2,
                    R1_Description: rValue.Caption
                  };
                  ctrl.$Utils.post(createNew).then(newData => {
                    var requestP = {
                      RequestClass: "BPM",
                      RequestAction: "UpdateGroupForNestedSet",
                      SessionId: sessionId
                    };
                    ctrl.$Utils.post(requestP).then(data => {
                      if (rValue.Name == "Leader") {
                        var insertGroup = {
                          RequestAction: "InsertUserGroup",
                          RequestClass: "BPM",
                          UserId: JSON.parse(ctrl.$Utils.getUserInfo()).UserId,
                          GroupId: newData.R1.Data
                        };
                        ctrl.$Utils.post(insertGroup).then(data => {
                           console.log(data)
                        });
                      }
                    });
                  });
                });
                //});
              } else {
                var requestP = {
                  RequestClass: "BPM",
                  RequestAction: "UpdateGroupForNestedSet"
                };
                this.$Utils.post(requestP).then(data => {});
              }
              if (this.data.callback) this.data.callback();
            } else if (request.R1_RequestTemplate == "OrgnizationUpdate") {
              var minus = this.$Lodash.differenceBy(
                this.data.item.groupRole,
                this.form.groupRole,
                "Name"
              );
              var plus = this.$Lodash.differenceBy(
                this.form.groupRole,
                this.data.item.groupRole,
                "Name"
              );
              var createNew = {};
              var deleteRequest = {};
              $.each(plus, (k, rValue) => {
                createNew = {
                  R1_Status: 1,
                  RequestAction: "Request",
                  RequestClass: "xBase",
                  TotalRequests: 1,
                  R1_RequestTemplate: "OrgnizationInsert",
                  R1_GroupParent: request.R1_GroupId,
                  R1_GroupName: rValue.Name,
                  R1_GroupType: 2,
                  R1_Description: rValue.Caption
                };
                this.$Utils.post(createNew).then(res => {
                  console.log(res);
                });
              });
              $.each(minus, (k, rValue) => {
                deleteRequest = {
                  RequestAction: "DeleteGroup",
                  RequestClass: "BPM",
                  ConditionFields: "GroupId;",
                  GroupId: rValue.GroupId
                };
                ctrl.$Utils.post(deleteRequest).then(dldata => {
                  console.log(dldata);
                });
              });
              if (this.data.callback) this.data.callback();
            } else {
              if (this.data.callback) this.data.callback();
            }
          }
          this.close();
        });
      }
    },
    close() {
      this.$hub.$emit("close-modal");
    },
    handleChange() {}
  }
};
</script>
<style lang="scss">
.selectP {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 1;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  max-height: 30px;
}
.formUpdate {
  width: 100%;
}
</style>
