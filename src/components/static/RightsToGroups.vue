<template>
  <div>
    <el-form>
      <el-form-item>
        <el-col :span="4">Người dùng tạo/Cập nhật</el-col>
        <el-col :span="10">
          <el-select v-model="permissionModel.dropdownRoles" multiple style="width: 90%" filterable allow-create
                     placeholder="Chọn...">
            <el-option v-for="item in permissionModel.listDropdownRoles" :key="item.Id" :label="item.Name"
                       :value="item.Id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-checkbox v-model="permissionModel.AlwaysUpdatePermission">Luôn cập nhật quyền</el-checkbox>
        </el-col>
        <el-col :span="5">
          <el-checkbox v-model="permissionModel.RolesIncludedUser">Bao gồm thông tin người dùng</el-checkbox>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="6">
          <el-select v-model="Group" placeholder="Chọn...">
            <el-option v-for="item in permissionModel.listUserGroups" :key="item.GroupId" :label="item.GroupName"
                       :value="item.GroupId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button @click="addLine('Group', Group)">Thêm</el-button>
        </el-col>
        <el-col :span="16">&ensp;</el-col>
      </el-form-item>
      <el-form-item>
        <table>
          <thead>
          <tr>
            <th class="col-md-4 text-left">PHÒNG BAN</th>
            <th class="col-md-1 text-center" v-for="item in permissionModel.listRoles"
                v-show="item.Name != 'LinkGroup'">
              {{item.Name}}
            </th>
          </tr>
          </thead>
          <tbody v-for="item in permissionModel.listUserGroups" v-if="permissionModel['Static'+item.GroupId]">
            <tr>
              <td class="text-left">{{item.GroupName}}</td>
              <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                <input type="checkbox" @click='checkStaticLinked(item.GroupId, role.Code)'
                       v-model-options="{ debounce: 200 }" v-model="permissionModel['Static'+item.GroupId + role.Code]"
                       class="permission-check">
              </td>
            </tr>
            <tr v-for="child in permissionModel.listGroupRoles[item.GroupId]">
              <td>-- {{child.GroupName}}</td>
              <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                <input type="checkbox" @click='checkStaticLinked(child.GroupId, role.Code)'
                       v-model-options="{ debounce: 200 }" v-model="permissionModel['Static'+child.GroupId + role.Code]"
                       class="permission-check">
              </td>
            </tr>
          </tbody>
          <tbody v-for="item in AddLines.Group">
            <tr>
              <td class="text-left">{{item.GroupName}}</td>
              <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                <input type="checkbox" @click='checkStaticLinked(item.GroupId, role.Code)'
                       v-model="permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
              </td>
            </tr>
            <tr v-for="child in permissionModel.listGroupRoles[item.GroupId]">
              <td>-- {{child.GroupName}}</td>
              <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                <input type="checkbox" @click='checkStaticLinked(child.GroupId, role.Code)'
                       v-model="permissionModel['Static'+child.GroupId + role.Code]" class="permission-check">
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    components: {
    },
    props: ["model"],
    data() {
      var dat = {};
      dat.permissionModel = this.model;
      dat.permissionModel.listDropdownRoles = [];
      dat.permissionModel.dropdownRoles = [];
      dat.permissionModel.AlwaysUpdatePermission = false;
      dat.permissionModel.RolesIncludedUser = false;
      dat.permissionModel.listUserGroups = [];
      dat.permissionModel.listRoles = [];
      dat.permissionModel.listGroupRoles = [];
      dat.Group = [];
      dat.AddLines = {
        Group: [],
      };



      return dat;
    },
    methods: {
      loadgroups() {
        var groups = {
          RequestClass: 'BPM',
          RequestAction: 'SearchGroup',
          ConditionFields: 'GroupType',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status',
          StructFields: 'ParentName',
          GroupType: '1',
          orderFields: 'GroupName ASC',
          RequestDataType: 'json'
        };
        this.$Utils.post(groups).then(response => {
          this.AddLines.Group = response.UserDS.Group;
        });
      },
      loadGroupRoles() {
        var groups = {
          RequestClass: 'BPM',
          RequestAction: 'SearchGroup',
          ConditionFields: 'GroupType',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status',
          StructFields: 'ParentName',
          GroupType: '2',
          orderFields: 'GroupName ASC',
          RequestDataType: 'json'
        };
        this.$Utils.post(groups).then(response => {
          this.permissionModel.listGroupRoles = response.UserDS.Group;
        });
      },
      loadRights() {
        var groups = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'Setting.SearchBase',
          R1_ParentCode: 'xSetting.Template.Permissions',
        };
        this.$Utils.post(groups).then(response => {
          this.permissionModel.listDropdownRoles = response.R1.Data.DynamicDS.Setting;
        });
      },

      checkStaticLinked(id, code) {
        var ctrl = this;
        var exist = false;
        var itemIndex = -1;
        var checkedItem = {};
        $.each(ctrl.permissionModel.listStaticPermissions, function(index, item) {
          if (item.Value == id) {
            itemIndex = index;
            exist = true;
            checkedItem = item;
          }
        });
        if (!exist)
          ctrl.permissionModel.listStaticPermissions.push({ Value: id, KeyCode: code + ';' });
        else {
          if (!ctrl.permissionModel['Static' + id + code])
            checkedItem.KeyCode += code + ';';
          else {
            checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ';', '');
            if (checkedItem.KeyCode == '')
              ctrl.permissionModel.listStaticPermissions.splice(itemIndex, 1);
          }
        }
      },


    },
    mounted() {

    },
    created() {
      this.loadgroups();
      this.loadRights();
      this.loadGroupRoles();
    }
  }
</script>

<style lang="scss" scoped>
  .el-table th {
    background-color: #3e4548;
    color: #fff;
  }

  .el-table--border td, .el-table--border th {
    border-right: 2px solid #f2f3f4;
  }

  .el-dialog--center .el-dialog__header {
    padding-top: 10px;
    background-color: #3e4548;
    color: #fff;
  }

</style>
