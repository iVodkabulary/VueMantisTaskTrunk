<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="Cơ bản">
        <el-tabs type="card">
          <el-tab-pane label="Quyền theo phòng ban">
            <el-form label-width="100px" label-position="left">
              <el-col :span="24">
                <el-form-item label="Người dùng tạo/Cập nhật">
                  <el-col :xs="24" :md="12">
                    <el-select clearable v-model="dropdownRoles" multiple style="width: 90%" filterable allow-create
                               placeholder="Chọn...">
                      <el-option v-for="item in permissionModel.listRoles" :key="item.Code" :label="item.Name"
                                 :value="item.Code"/>
                    </el-select>
                  </el-col>
                  <el-col :xs="24" :md="6">
                    <el-checkbox v-model="AlwaysUpdatePermission"
                                 @change="handlerToFixCheckboxValue('AlwaysUpdatePermission', $event)">Luôn cập nhật
                      quyền
                    </el-checkbox>
                  </el-col>
                  <el-col :xs="24" :md="6">
                    <el-checkbox v-model="RolesIncludedUser"
                                 @change="handlerToFixCheckboxValue('RolesIncludedUser', $event)">Bao gồm thông tin
                      người dùng
                    </el-checkbox>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :xs="16" :md="4">
                <el-select clearable v-model="Group" placeholder="Chọn...">
                  <el-option v-for="item in permissionModel.listUserGroups" :key="item.GroupId" :label="item.GroupName"
                             :value="item.GroupId" v-if="!permissionModel['Static'+item.GroupId] && !item.Selected"/>
                </el-select>
              </el-col>
              <el-col :xs="8" :md="2">
                <el-button @click="addLine('Group', permissionModel.objListUserGroups[Group])"
                           :disabled="!Group">Thêm
                </el-button>
              </el-col>
              <el-col :md="16" class="hidden-xs-only">&ensp;</el-col>
              <el-col :md="24">
                <div class="el-table__body-wrapper is-scroll-left">
                  <table style="width: 100%">
                    <thead>
                    <tr>
                      <th class="text-left" style="width: 30%;">PHÒNG BAN</th>
                      <th class="text-center" :style="'width: '+ (70/permissionModel.listRoles.length) + '%;'"
                          v-for="item in permissionModel.listRoles"
                          v-show="item.Name !== 'LinkGroup'">
                        {{item.Name}}
                      </th>
                    </tr>
                    </thead>
                    <tbody v-for="item in permissionModel.listUserGroups"
                           v-if="permissionModel['Static'+item.GroupId]">
                    <tr>
                      <td class="text-left">{{item.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox @change='checkStaticLinked(item.GroupId, role.Code)'
                                     v-model="permissionModel['Static'+item.GroupId + role.Code]"
                        />
                      </td>
                    </tr>
                    <tr v-for="child in permissionModel.listGroupRoles[item.GroupId]">
                      <td>-- {{child.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox @change='checkStaticLinked(child.GroupId, role.Code)'
                                     v-model="permissionModel['Static'+child.GroupId + role.Code]"
                        />
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-for="item in AddLines.Group">
                    <tr>
                      <td class="text-left">{{item.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox @change='checkStaticLinked(item.GroupId, role.Code)'
                                     v-model="permissionModel['Static'+item.GroupId + role.Code]"/>
                      </td>
                    </tr>
                    <tr v-for="child in permissionModel.listGroupRoles[item.GroupId]">
                      <td>-- {{child.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox @change='checkStaticLinked(child.GroupId, role.Code)'
                                     v-model="permissionModel['Static'+child.GroupId + role.Code]"/>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </el-col>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Quyền theo vai trò">
            <div>
              <el-col :span="24">
                <el-checkbox v-model="GroupInCludedUser">Bao gồm thông tin người dùng</el-checkbox>
              </el-col>
              <el-col :xs="16" :md="4">
                <el-select clearable v-model="Role" placeholder="Chọn...">
                  <el-option v-for="item in permissionModel.listUserPermissions" :key="item.id" :label="item.text"
                             :value="item.id"
                             v-if="!permissionModel['Static'+item.GroupId] && !item.Selected"/>
                </el-select>
              </el-col>
              <el-col :xs="8" :md="2">
                <el-button @click="addLine('Role', permissionModel.objListUserPermissions[Role])"
                           :disabled="!Role">
                  Thêm
                </el-button>
              </el-col>
              <el-col :span="16" class="hidden-xs-only">&ensp;</el-col>
              <el-col :span="24">
                <div class="el-table__body-wrapper is-scroll-left">
                  <table style="width: 100%">
                    <thead>
                    <tr>
                      <th class="text-left" style="width: 30%;">VAI TRÒ</th>
                      <th class="text-center" :style="'width:'+ (70/permissionModel.listRoles.length) +'%;'"
                          v-for="item in permissionModel.listRoles" v-show="item.Name != 'LinkGroup'">
                        {{item.Name}}
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in permissionModel.listUserPermissions"
                        v-if="permissionModel['Static'+item.GroupId]">
                      <td class="text-left">{{item.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox v-model="permissionModel['Static'+item.GroupId + role.Code]"
                                     @change='checkStaticLinked(item.GroupId, role.Code)'/>
                      </td>
                    </tr>
                    <tr v-for="item in AddLines.Role">
                      <td class="text-left">{{item.GroupName}}</td>
                      <td class="text-center" v-for="role in permissionModel.listRoles"
                          v-show="role.Name !== 'LinkGroup'">
                        <el-checkbox v-model="permissionModel['Static'+item.GroupId + role.Code]"
                                     @change='checkStaticLinked(item.GroupId, role.Code)'/>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </el-col>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Quyền theo người dùng">
            <div>
              <el-col :xs="16" :md="4">
                <el-select clearable v-model="User" placeholder="--Chọn người dùng--">
                  <el-option v-for="item in permissionModel.listUsers" :key="item.UserId" :label="item.Username"
                             :value="item.UserId"
                             v-if="!permissionModel['Static'+item.UserId] && !item.Selected"/>
                </el-select>
              </el-col>
              <el-col :xs="8" :md="2">
                <el-button @click="addLine('User', permissionModel.objListUsers[User])"
                           :disabled="!User">Thêm
                </el-button>
              </el-col>
              <el-col :md="16" class="hidden-xs-only">&ensp;</el-col>
              <div class="el-table__body-wrapper is-scroll-left">
                <table style="width: 100%">
                  <thead>
                  <tr>
                    <th class="text-left" style="width:30%">NGƯỜI DÙNG</th>
                    <th class="text-center" :style="'width:'+ (70/permissionModel.listRoles.length) +'%;'"
                        v-for="item in permissionModel.listRoles" v-show="item.Name !== 'LinkGroup'">
                      {{item.Name}}
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in permissionModel.listUsers" v-if="permissionModel['Static'+item.UserId]">
                    <td class="text-left">{{item.Username}}</td>
                    <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                      <el-checkbox @change='checkStaticLinked(item.UserId, role.Code)'
                                   v-model="permissionModel['Static'+item.UserId + role.Code]"/>
                    </td>
                  </tr>
                  <tr v-for="item in AddLines.User">
                    <td class="text-left">{{item.Username}}</td>
                    <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name != 'LinkGroup'">
                      <el-checkbox @change='checkStaticLinked(item.UserId, role.Code)'
                                   v-model="permissionModel['Static'+item.UserId + role.Code]"/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="Theo dữ liệu">
        <el-col :xs="16" :md="4">
          <el-select v-model="Field" clearable placeholder="Chọn">
            <el-option v-for="item in CurrentDataGroup.Fields" :label="item.Caption" :value="item.Name"
                       :key="item.Name"
                       v-if="item.Permit && !permissionModel['Dynamic'+item.Name] && !item.Selected"/>
          </el-select>
        </el-col>
        <el-col :xs="8" :md="2">
          <el-button @click="addLine('Field', permissionModel.objFields[Field])" :disabled="!Field">Thêm</el-button>
        </el-col>
        <el-col :span="24">
          <div class="el-table__body-wrapper is-scroll-left">
            <table style="width: 100%">
              <thead>
              <tr>
                <th class="text-left" style="width:20%">TRƯỜNG DỮ LIỆU</th>
                <th class="text-center" :style="'width:'+ (80/permissionModel.listRoles.length) +'%;'"
                    v-for="item in permissionModel.listRoles" v-show="item.Name !== 'LinkGroup'">
                  {{item.Name}}
                </th>
                <th class="text-left">BẢNG DỮ LIỆU</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in CurrentDataGroup.Fields"
                  v-if="(item.FormFieldType === 'General' || item.FormFieldType === 'Calculator') && permissionModel['Dynamic'+item.Name]">
                <td class="text-left">{{item.Caption}}</td>
                <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name !== 'LinkGroup'">
                  <el-checkbox @change='checkDynamicLinked(item.Name, role.Code)'
                               v-model="permissionModel['Dynamic'+item.Name + role.Code]"/>
                </td>
                <td class="text-left">
                  <el-select clearable v-model="permissionModel['Dynamic_Type'+ item.Name]"
                             @change='checkDynamicSelect(item.Name)'>
                    <el-option value="User" label="Nhân sự"/>
                    <el-option value="Group" label="Phòng ban"/>
                  </el-select>
                </td>
              </tr>
              <tr v-for="item in AddLines.Field">
                <td class="text-left">{{item.Caption}}</td>
                <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name !== 'LinkGroup'">
                  <el-checkbox @change='checkDynamicLinked(item.Name, role.Code)'
                               v-model="permissionModel['Dynamic'+item.Name + role.Code]"/>
                </td>
                <td class="text-left">
                  <el-select clearable v-model="permissionModel['Dynamic_Type'+ item.Name]"
                             @change='checkDynamicSelect(item.Name)'>
                    <el-option value="User" label="Nhân sự"/>
                    <el-option value="Group" label="Phòng ban"/>
                  </el-select>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="Theo kịch bản">
        <el-form label-width="100px">
          <el-form-item label="Phân quyền cho cấp trên:">
            <el-select clearable v-model="permissionModel.LeadershipDynamicOrganization" placeholder="-Chọn cấp-" no-data-text="Không có dữ liệu">
              <el-option v-for="item in CurrentDataGroup.Fields" :key="item.Name" :label="item.Caption"
                         :value="item.Name" v-if="item.Permit"/>
            </el-select>
          </el-form-item>
        </el-form>
        <el-tabs type="card">
          <el-tab-pane label="Phòng Ban">
            <div class="el-table__body-wrapper is-scroll-left">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th class="text-left" style="width: 30%;">PHÒNG BAN</th>
                  <th class="text-center" :style="'width:'+ (70/permissionModel.listRoles.length) +'%;'"
                      v-for="item in permissionModel.listRoles" v-show="item.Name != 'LinkGroup'">
                    {{item.Name}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in permissionModel.listRoleGroups">
                  <td class="text-left">{{item.Caption}}</td>
                  <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name !== 'LinkGroup'">
                    <el-checkbox @change='checkScriptLinked("1",item.Name, role.Code)'
                                 v-model="permissionModel['Script'+item.Name + role.Code]"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Vai trò">
            <div class="el-table__body-wrapper is-scroll-left">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th class="text-left" style="width: 30%">VAI TRÒ</th>
                  <th class="text-center" :style="'width:'+ (70/permissionModel.listRoles.length) +'%;'"
                      v-for="item in permissionModel.listRoles" v-show="item.Name != 'LinkGroup'">
                    {{item.Name}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in permissionModel.listUserPermissions">
                  <td class="text-left">{{item.GroupName}}</td>
                  <td class="text-center" v-for="role in permissionModel.listRoles" v-show="role.Name !== 'LinkGroup'">
                    <el-checkbox @change='checkScriptLinked(item.GroupId,item.GroupName, role.Code)'
                                 v-model="permissionModel['Script'+item.GroupId + role.Code]"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="Sao chép phân quyền">
        <el-form label-width="100px">
          <el-form-item label="Trường dữ liệu:">
            <el-select clearable v-model="dropdownDynamicPermissions" multiple placeholder="Chọn trường dữ liệu"
                       style="width: 90%">
              <el-option v-for="item in permissionModel.listDropdownFields" :key="item.Name" :label="item.Caption"
                         :value="item.Name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Nhập mã trực tiếp">
            <el-col :xs="24" :md="11">
              <el-input placeholder="Nhập mã trực tiếp..." v-model="permissionModel.StaticPermissions"/>
            </el-col>
            <el-col :xs="24" :md="10">
              <el-checkbox v-model="StaticIncludedUser"
                           @change="handlerToFixCheckboxValue('StaticIncludedUser', $event)">Bao gồm thông tin người
                dùng
              </el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item label="Mã Template lấy dữ liệu">
            <el-input placeholder="Mã Template lấy dữ liệu" v-model="permissionModel.FormRequest"/>
          </el-form-item>
          <el-form-item label="Đường dẫn gốc">
            <el-input placeholder="Đường dẫn gốc" v-model="permissionModel.FormDataRoot"/>
          </el-form-item>
          <el-form-item label="Mã">
            <el-input placeholder="Mã" v-model="permissionModel.FormCode"/>
          </el-form-item>
          <!--end row-->
          <el-form-item label="Mã riêng tư">
            <el-input placeholder="Mã riêng tư" v-model="permissionModel.Code"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Xóa phân quyền">
        <el-checkbox v-model="RemoveRole" @change="handlerToFixCheckboxValue('RemoveRole', $event)">Xóa phân quyền
        </el-checkbox>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    components: {},
    props: ['data'],
    data() {
      var dat = this.data;
      return dat;
    },
    methods: {
      handlerToFixCheckboxValue(name, value) {
        this.$set(this.permissionModel, name, value)
      },
      checkDynamicLinked(name, code) {
        var ctrl = this;
        var exist = false;
        var itemIndex = -1;
        var checkedItem = {};
        $.each(ctrl.permissionModel.listDynamicPermissions, function (index, item) {

          if (item.Value === name) {
            itemIndex = index;
            exist = true;
            checkedItem = item;
            return false
          }
        });
        if (!exist)
          ctrl.permissionModel.listDynamicPermissions.push({Value: name, KeyCode: code + ';'});
        else {
          if (ctrl.permissionModel['Dynamic' + name + code])
            checkedItem.KeyCode += code + ';';
          else {
            checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ';', '');
            if (checkedItem.KeyCode === '')
              ctrl.permissionModel.listDynamicPermissions.splice(itemIndex, 1);
          }
        }
      },
      checkDynamicSelect(name) {
        var ctrl = this;
        var exist = false;
        var itemIndex = -1;
        var checkedItem = {};
        $.each(ctrl.permissionModel.listDynamicPermissions, function (index, item) {
          var ret = true;
          if (item.Value === name) {
            itemIndex = index;
            exist = true;
            checkedItem = item;
            ret = false;
          }
          return ret;
        });
        if (!exist)
          ctrl.permissionModel.listDynamicPermissions.push({Value: name, KeyCode: name + ';'});
        else {
          checkedItem.KeyType = ctrl.permissionModel['Dynamic_Type' + name];
        }
      },
      checkScriptLinked(id, name, code) {
        var ctrl = this;
        var exist = false;
        var itemIndex = -1;
        var checkedItem = {};
        $.each(ctrl.permissionModel.listScriptPermissions, function (index, item) {
          if (item.Value === id && item.Name === name) {
            itemIndex = index;
            exist = true;
            checkedItem = item;
          }
        });
        if (!exist) {
          ctrl.permissionModel.listScriptPermissions.push({
            Name: name,
            Value: id,
            KeyCode: code + ';'
          });
        } else {
          if ((id !== '1' && ctrl.permissionModel['Script' + id + code]) || (id === '1' && ctrl.permissionModel['Script' + name + code]))
            checkedItem.KeyCode += code + ';';
          else {
            checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ';', '');
            if (checkedItem.KeyCode === '')
              ctrl.permissionModel.listScriptPermissions.splice(itemIndex, 1);
          }
        }
      },


      checkStaticLinked(id, code) {
        var ctrl = this;
        var exist = false;
        var itemIndex = -1;
        var checkedItem = {};
        $.each(ctrl.permissionModel.listStaticPermissions, function (index, item) {
          if (item.Value === id) {
            itemIndex = index;
            exist = true;
            checkedItem = item;
          }
        });
        if (!exist)
          ctrl.permissionModel.listStaticPermissions.push({Value: id, KeyCode: code + ';'});
        else {
          if (ctrl.permissionModel['Static' + id + code])
            checkedItem.KeyCode += code + ';';
          else {
            checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ';', '');
            if (checkedItem.KeyCode === '')
              ctrl.permissionModel.listStaticPermissions.splice(itemIndex, 1);
          }
        }
      },

      bindComboModel() {
        var ctrl = this;
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'jsontree',
          SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
          ConditionFields: 'GroupType',
          GroupType: '0',
          StaticFields: 'GroupId;GroupName;Description;GroupParent'
        };
        ctrl.$Utils.post(request).then(function (data) {
          // ctrl.permissionModel.listUserPermissions = data;
          ctrl.$set(ctrl.permissionModel, 'listUserPermissions', data);
          ctrl.$set(ctrl.permissionModel, 'objListUserPermissions', ctrl.$Utils.rotateDementionArr(ctrl.permissionModel.listUserPermissions, 'GroupId'));
          ctrl.signal++;
        });

        request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
          ConditionFields: 'GroupType',
          GroupType: '1',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        };
        ctrl.$Utils.post(request).then(function (data) {
          // ctrl.permissionModel.listUserGroups = ctrl.$Utils.getDataWithRoot(data, 'UserDS.Group');
          ctrl.$set(ctrl.permissionModel, 'listUserGroups', ctrl.$Utils.getDataWithRoot(data, 'UserDS.Group'));
          ctrl.$set(ctrl.permissionModel, 'objListUserGroups', ctrl.$Utils.rotateDementionArr(ctrl.permissionModel.listUserGroups, 'GroupId'));
          ctrl.signal++;
        });

        request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
          ConditionFields: 'GroupType',
          GroupType: '2',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        };
        ctrl.$Utils.post(request).then(function (data) {
          data = ctrl.$Utils.getDataWithRoot(data, 'UserDS.Group');
          $.each(data, function (k, value) {
            if (!ctrl.permissionModel.listGroupRoles[value.GroupParent])
              ctrl.permissionModel.listGroupRoles[value.GroupParent] = [];
            ctrl.permissionModel.listGroupRoles[value.GroupParent].push(value);
          })
          // ctrl.permissionModel.listGroupRoles = data;
          ctrl.signal++;
        });

        request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchSetting';
        request.R1_ParentCode = 'xSetting.Default.Permissions.RoleTemplate';
        ctrl.$Utils.post(request).then(function (data) {
          ctrl.permissionModel.listRoleGroups = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          ctrl.signal++;
        })

        request = {
          RequestAction: 'SearchUserWithGroups',
          IncludedGroupManager: 'true',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          SessionId: ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.SessionId),
          ConditionFields: 'IncludedGroupManager;Group;Status',
          Status: '1',
          GroupType: '1',
          StaticFields: 'UserId;Username;LoginName',
          OrderFields: 'LoginName ASC'
        };
        ctrl.$Utils.post(request).then((data)=> {
          var userList = ctrl.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
          if(!this.$isSystemAdmin())
          userList = userList.filter(ele =>{
            return ele.LoginName.toLowerCase().indexOf('superadmin') == -1
          });
          // ctrl.permissionModel.listUsers = ctrl.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
          ctrl.$set(ctrl.permissionModel, 'listUsers', userList);
          ctrl.$set(ctrl.permissionModel, 'objListUsers', ctrl.$Utils.rotateDementionArr(ctrl.permissionModel.listUsers, 'UserId'));
          ctrl.signal++;
        });

        request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_ParentCode = 'xSetting.Template.Permissions';
        ctrl.$Utils.post(request).then(function (data) {
          ctrl.$set(ctrl.permissionModel, 'listRoles', ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting'));
          // ctrl.permissionModel.listRoles = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          // ctrl.dropdownRoles = ctrl.permissionModel.CurrentUserRole != undefined ? ctrl.model.CurrentUserRole.split(';') : [];
          ctrl.signal++;
        });
      },
      bindDropdownFields() {
        this.$set(this.permissionModel, 'objFields', this.$Utils.rotateDementionArr(this.CurrentDataGroup.Fields, 'Name'))
        $.each(this.CurrentDataGroup.Fields, (k, item) => {
          // this.$set(this.permissionModel,'Dynamic_Type'+ item.Name,'');
          if (item.FormFieldType === 'General' || item.FormFieldType === 'Calculator')
            this.permissionModel.listDropdownFields.push(item);
        })
      },
      bindPermissionEditor() {
        var ctrl = this;
        $.each(ctrl.permissionModel.passedItem.Description.Permissions, function (k, item) {
          if (item.Permissions !== '') {
            var objPermissions = ctrl.$Utils.stringToObject(item.Permissions);
            for (var i = 1; i <= parseInt(objPermissions.Count); i++) {
              var element = {
                Value: objPermissions['Value' + i],
                KeyCode: objPermissions['KeyCode' + i],
                KeyType: ctrl.$Utils.isEmpty(objPermissions['KeyType' + i]) ? objPermissions['KeyType' + i] : ''
              };
              if (objPermissions['Name' + i] != null)
                element.Name = objPermissions['Name' + i];
              if (item.Name === 'Static')
                ctrl.permissionModel.listStaticPermissions.push(element);
              else if (item.Name === 'Dynamic') {
                if (element.KeyType !== '' && element.KeyType !== undefined && element.KeyType !== 'undefined')
                  ctrl.$set(ctrl.permissionModel, 'Dynamic_Type' + element.Value, element.KeyType);
                ctrl.permissionModel.listDynamicPermissions.push(element);
              } else if (item.Name === 'Script')
                ctrl.permissionModel.listScriptPermissions.push(element);

              var arrKeyCode = objPermissions['KeyCode' + i].split(';');
              for (var j = 0; j < arrKeyCode.length; j++) {
                if (item.Name === 'Script' && objPermissions['Value' + i] === "1")
                  ctrl.$set(ctrl.permissionModel, item.Name + objPermissions['Name' + i] + arrKeyCode[j], true);
                else
                  ctrl.$set(ctrl.permissionModel,item.Name + objPermissions['Value' + i] + arrKeyCode[j], true);
              }
            }
          }
          if (item.Name === 'Static') {
            if (item.CurrentUser !== '' && item.CurrentUser !== undefined) {
              $.each(ctrl.permissionModel.listRoles, function (k, role) {
                if (item.CurrentUser.indexOf(role.Code + ';') !== -1 && ctrl.dropdownRoles.indexOf(role.Code) === -1) {
                  ctrl.dropdownRoles.push(role.Code)
                }
              });
            }
            ctrl.permissionModel.AlwaysUpdatePermission = item.AlwaysUpdatePermission;
            ctrl.AlwaysUpdatePermission = item.AlwaysUpdatePermission;
            ctrl.permissionModel.RolesIncludedUser = item.RolesIncludedUser;
            ctrl.RolesIncludedUser = item.RolesIncludedUser;
            ctrl.GroupInCludedUser = item.GroupInCludedUser;
            ctrl.permissionModel.GroupInCludedUser = item.GroupInCludedUser;
          } else if (item.Name === 'Script') {
            // setTimeout(function() {
            if (item.LeadershipDynamicOrganization !== '' && item.LeadershipDynamicOrganization !== undefined) {
              ctrl.permissionModel.LeadershipDynamicOrganization = item.LeadershipDynamicOrganization;
            }
            // });
          } else if (item.Name === 'Replica') {
            if (item.StaticPermissions !== '' && item.StaticPermissions !== undefined)
              ctrl.permissionModel.StaticPermissions = item.StaticPermissions;
            ctrl.StaticIncludedUser = item.StaticIncludedUser;
            ctrl.permissionModel.StaticIncludedUser = item.StaticIncludedUser;
            if (item.FormRequest !== '' && item.FormRequest !== undefined)
              ctrl.permissionModel.FormRequest = item.FormRequest;
            if (item.FormDataRoot !== '' && item.FormDataRoot !== undefined)
              ctrl.permissionModel.FormDataRoot = item.FormDataRoot;
            if (item.FormCode !== '' && item.FormCode !== undefined)
              ctrl.permissionModel.FormCode = item.FormCode;
            if (item.Code !== '' && item.Code !== undefined)
              ctrl.permissionModel.Code = item.Code;
            if (item.DynamicPermissions !== '' && item.DynamicPermissions !== undefined) {
              // setTimeout(function() {
              var listDynamicPermissions = ctrl.permissionModel.listDropdownFields;
              $.each(listDynamicPermissions, function (k, dynamic) {
                if (item.DynamicPermissions.indexOf(dynamic.Name + ';') !== -1 && ctrl.dropdownDynamicPermissions.indexOf(dynamic.Name) === -1)
                  ctrl.dropdownDynamicPermissions.push(dynamic.Name);
              });
              // });
            }
          } else if (item.Name === 'Remove') {
            if (item.Value === true) {
              ctrl.RemoveRole = true;
              ctrl.permissionModel.RemoveRole = true;
            }
          }
        });
      },
      addLine(type, line) {
        var ctrl = this;
        ctrl.AddLines[type].push(line);
        switch (type) {
          case "Group": {
            $.each(ctrl.permissionModel.listUserGroups, function (key, value) {
              var ret = true;
              if (value.GroupId === line.GroupId) {
                ctrl.$set(value, 'Selected', true);
                ctrl.Group = '';
                ret = false;
              }
              return ret;
            })
            break;
          }
          case "Role": {
            $.each(ctrl.permissionModel.listUserPermissions, function (key, value) {
              var ret = true;
              if (value.GroupId === line.GroupId) {
                ctrl.$set(value, 'Selected', true);
                ctrl.Role = '';
                ret = false;
              }
              return ret;
            })
            break;
          }
          case "User": {
            $.each(ctrl.permissionModel.listUsers, function (key, value) {
              var ret = true;
              if (value.UserId === line.UserId) {
                ctrl.$set(value, 'Selected', true);
                ctrl.User = '';
                ret = false;
              }
              return ret;
            })
            break;
          }
          case "Field": {
            $.each(ctrl.CurrentDataGroup.Fields, function (key, value) {
              if (value.Name === line.Name) {
                ctrl.$set(value, 'Selected', true);
                ctrl.Field = '';
               return false;
              }
            });
            break;
          }
          default:
            break;
        }
      }
    },
    mounted() {
      this.$hub.$on("saveFormForm", data => {
        this.bindListPermissions();
      });
    },
    watch: {
      passedModel: {
        handler: function (after) {
          if (this.signal === 6) {
            this.bindPermissionEditor();
          }
        },
        deep: true,
      },
      signal: {
        handler: function (after) {
          if (after === 6) {
            this.bindPermissionEditor();
          }
        }
      },
      CurrentDataGroup: {
        handler: function (after) {
          this.$set(this.permissionModel, 'objFields', this.$Utils.rotateDementionArr(after.Fields, 'Name'))
        },
        deep: true,
      },
    }
    ,
    created() {
      var ctrl = this;
      ctrl.isSystemAdmin = ctrl.$isSystemAdmin();
      ctrl.isMantisAdmin = ctrl.$isMantisAdmin();
      ctrl.administrator = ctrl.$Lodash.cloneDeep(ctrl.$administrator);
      ctrl.bindComboModel();
      ctrl.bindDropdownFields()

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 5px;
  }
</style>
