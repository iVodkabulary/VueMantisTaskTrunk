<template>
  <div>
    <el-radio v-model="status" label="1">Hoạt động</el-radio>
    <el-radio v-model="status" label="0">Không hoạt động</el-radio>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" class="fa fa-plus" @click="addNewUser"><span class="hidden-xs-only">Thêm mới</span></el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="searchInput" placeholder="Tìm kiếm" prefix-icon="el-icon-search" clearable/>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      element-loading-text="Tải dữ liệu..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      border
      empty-text="Không có dữ liệu"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        label="Stt"
      >
      </el-table-column>
      <el-table-column
        prop="LoginName"
        label="Tên đăng nhập"
        min-width="110"
      >
      </el-table-column>
      <el-table-column
        prop="Username"
        label="Tên đầy đủ"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        prop="Email"
        label="Hòm thư"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        prop="GroupsName"
        label="Phòng ban"
        min-width="300"
      >

      </el-table-column>
      <el-table-column
        label="Hoạt động"
      >
        <template slot-scope="scope">
          <el-checkbox :checked="scope.row.Status == 1" @change="changeStatus(scope.$index, $event, scope.row)"/>
        </template>
      </el-table-column>

      <el-table-column
        label="Xử lý"
        fixed="right"
        min-width="80">
        <template slot-scope="scope">
          <div class="row">
            <div class="col-3 offset-2 center-icon-clickable" @click="editUser(scope.row)">
              <i class="el-icon-edit"></i>
            </div>
            <div class="col-3 offset-1 center-icon-clickable" @click="changePass(scope.row)">
              <i class="icon-key"></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import UserInfo from "@/components/static/UserInfo";
  import ChangeThePassword from "@/components/static/ChangeThePassword.vue";
  import Rights from "@/components/static/Rights.vue";
  //import users from "@/temp/users.json"
  import {mapGetters} from "vuex";

  export default {
    components: {
      UserInfo,
      ChangeThePassword,
      Rights
    },
    data() {
      return {
        loading: false,
        sessionId: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        ),
        tableData: [],
        centerDialogVisible: false,
        status: "1",
        searchInput: '',
        temp: []
      };
    },

    watch: {
      status: function (newVal) {
        this.loadData();
      },
      searchInput: function (newVal) {
        if (newVal.trim() !== '' || this.$Utils.isEmpty(newVal)) {
          this.tableData = this.temp.filter(ele => {
            return (this.$Utils.isEmpty(ele.GroupsName) && ele.GroupsName.toLowerCase().indexOf(newVal.toLowerCase())) > -1 ||
              (this.$Utils.isEmpty(ele.LoginName) && ele.LoginName.toLowerCase().indexOf(newVal.toLowerCase())) > -1 ||
              (this.$Utils.isEmpty(ele.Email) && ele.Email.toLowerCase().indexOf(newVal.toLowerCase()) > -1) ||
              (this.$Utils.isEmpty(ele.Username) && ele.Username.toLowerCase().indexOf(newVal.toLowerCase()) > -1)
          })
        }
      }
    },
    methods: {
      addNewUser() {
        this.$hub.$emit(
          "set-modal-data",
          "Tạo người dùng",
          "80%",
          true,
          "center",
          UserInfo,
          true,
          "",
          {action: 'insert', item: null, reload: this.loadData}
        );
      }, changeStatus(i, e, r) {
        var status = e ? 1 : 0;
        var request = {
          RequestClass: "BPM",
          RequestAction: "UpdateUser",
          UserId: r.UserId,
          Status: status,
          StaticFields: "Status",
          SessionId: this.sessionId
        };
        this.$Utils.post(request).then(response => {
          try {
            var res = JSON.parse(response);
            if (res.success) {
              this.$message.success("Cập nhật thành công");
            } else {
              this.$message.error("Cập nhật không thành công");
            }
          } catch (error) {
            this.$message.error("Cập nhật không thành công");
          }
          this.loadData();
        });
      },
      loadData() {
        var requestGroup = {
          RequestAction: "SearchGroup",
          RequestClass: "BPM",
          RequestDataType: "json",
          SessionId: this.sessionId,
          ConditionFields: "GroupId,GroupType",
          GroupType: "1",
          StaticFields: "GroupId;GroupName;Description;GroupParent"
        };
        this.loading = true;
        this.$Utils.post(requestGroup).then(data1 => {
          var grData = this.$Utils.getDataWithRoot(data1, "UserDS.Group");
          var groupList = this.$Utils.rotateDementionArr(grData, "GroupId");
          this.getUsers(groupList);
        });
      },
      getUsers(groups) {
        this.tableData = [];
        var request = {
          RequestAction: "SearchUserWithGroups",
          IncludedGroupManager: true,
          RequestClass: "BPM",
          RequestDataType: "json",
          SessionId: this.sessionId,
          ConditionFields: "IncludedGroupManager;Group;Status;LoginName;UserId",
          StaticFields: "UserId;Username;LoginName;Description;Status;",
          DynamicFields:
            "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
          StructFields:
            "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification",
          OrderFields: "LoginName ASC",
          GroupType: 1,
          Status: this.status
        };

        this.$Utils.post(request).then(response => {
          var data = this.$Utils.getDataWithRoot(response, "Data.UserDS.User");
          this.tableData = data.filter(value => {
            value.GroupsName = "";
            if (value.Groups)
              $.each(value.Groups.split(";"), (k, ele) => {
                if (groups[ele]) value.GroupsName += groups[ele].GroupName + " ; ";
              });
            return this.$isSystemAdmin() || value.LoginName.toLowerCase() !== "superadmin";
          });
          this.temp = this.$Lodash.cloneDeep(this.tableData);
          this.loading = false;
        });
      },
      changePass(user) {
        this.$hub.$emit(
          "set-modal-data",
          "Thay đổi mật khẩu",
          "25%",
          true,
          "center",
          ChangeThePassword,
          false,
          '',
          user
        );
      },
      editUser(user) {
        this.$hub.$emit(
          "set-modal-data",
          "Sửa thông tin người dùng",
          "70%",
          true,
          "center",
          UserInfo,
          false,
          '',
          {action: 'edit', item: user, reload: this.loadData}
        );
      }
    },
    created() {
      this.loadData();
    },
    mounted() {
    }
  };
</script>

<style lang="scss" scoped>
.center-icon-clickable {
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  padding: 1px;
  font-size: 15px;
  border-radius: 4px;
}
</style>
