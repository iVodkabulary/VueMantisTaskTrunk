<template>
  <div id="formConfig">
    <el-form>
      <el-form-item>
        <el-button v-show="isShow!=undefined" @click="back">Quay lại</el-button>
        <el-button type="primary" @click="openPermissionSelector()" v-if="!isNew">Cấp phép</el-button>
        <el-button type="primary" @click="save">Lưu</el-button>
      </el-form-item>
      <el-form-item v-if="$isSystemAdmin()" >
        <el-tabs type="border-card" @tab-click="openedSignal=true;">
          <el-tab-pane label="Cấu hình Form">
            <FormForm :data="fullData"/>
          </el-tab-pane>
          <el-tab-pane label="Phân Quyền">
            <SubRights v-if="openedSignal" :data="fullData"/>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item v-else >
        <div type="border-card">

            <FormForm :data="fullData" style="display:none;"/>

            <SubRights :data="fullData"/>

        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import FormForm from "@/components/static/advance/FormForm";
  import SubRights from "@/components/static/SubRights";
  import PermissionSelector from '@/components/static/PermissionSelector';

  export default {
    name: "form",
    components: {FormForm, SubRights, PermissionSelector},
    props: ['selectedItem', 'isShow', 'isNew', 'closeCallback'],
    data() {
      var passIt = this.selectedItem;
      passIt.CurrentDataGroup = {};
      passIt.Description = {};

      var dat={
        passedItem: passIt,
        selectedGroups: '',
        selectedField: '',
        centerDialogVisible: false,
        elements:[],
        notifitions:[],
        input:'',
        value3: '',
        selectedDisplayType: 'ThreeColumn',
        DataGroup: [],
        DataGroupTree: [],
        cascaderData: [],
        selectedDataGroup: [],
        selectedDataGroups: [],
        DisplayType: [],
        action: '',
        ObjectFields: [],
        model: {
          ObjectFields: [],
          Caption: '',
          Description: {
            Groups: [],
            Buttons: [],
            HasCommentTab: false,
            HasFileTab: false,
            HasHistoryTab: false,
            HasPermissionTab: false,
            History: false,
            Subcribe: false
          }
        },
        permission : {},
        viewModel: {
          DataGroup: {
            source: []
          },
          OrderFields: {
            source: [],
          },
          contextOrderFields: { autoOpenPopup: false, mode: 'popup' },
          CurrentDataGroup: { Fields: [], Buttons: [] }
        },
        communication: { action: '', item: {}, index: '', scope: this },
        administrator: this.$Lodash.cloneDeep(this.$administrator),
        Description: {},
        checkBoxGroup: ["Cấp phép", "Bình luận", "File đính kèm", "Lịch sử cập nhật", "Lịch sử thay đổi", "Lặp nội dung", "Theo dõi"],
        CurrentDataGroup : {
          Fields: [],
          Buttons: []
        },
        permissionModel: {
          passedItem: passIt,
          listDropdownRoles: [],
          listDropdownFields: [],
          listStaticPermissions: [],
          listScriptPermissions: [],
          listDynamicPermissions: [],
          listUserPermissions: [],
          listUserGroups: [],
          listRoles: [],
          listUsers: [],
          listGroupRoles: {},
        },
        parentSetting: [],
        catModel:{
          Caption:'',
          GroupDisplayType:'',
          action:'',
        },
        tmpGroup:{
          Caption:'',
          GroupDisplayType:'',
        },
        listSelectedButtons :[],
        options: [],
      };
      dat.dropdownRoles = [];
      dat.permissionModel.listRoleGroups = [];
      dat.permissionModel.objListUserPermissions = {};
      dat.permissionModel.objListUsers = {};
      dat.permissionModel.LeadershipDynamicOrganization = '';
      dat.permissionModel.StaticPermissions = '';
      dat.permissionModel.FormRequest = '';
      dat.permissionModel.FormDataRoot = '';
      dat.permissionModel.FormCode = '';
      dat.permissionModel.Code = '';
      dat.permissionModel.AlwaysUpdatePermission = false;
      dat.AlwaysUpdatePermission = false;
      dat.RolesIncludedUser = false;
      dat.permissionModel.RolesIncludedUser = false;
      dat.permissionModel.RemoveRole = false;
      dat.RemoveRole = false;
      dat.permissionModel.StaticIncludedUser = false;
      dat.StaticIncludedUser = false;
      dat.Group = [];
      dat.dropdownDynamicPermissions = [];
      dat.User = '';
      dat.Field = '';
      dat.AddLines = {
        Group: [],
        Role: [],
        User: [],
        Field: [],
      };
      dat.permissionModel.GroupInCludedUser = false;
      dat.GroupInCludedUser = false;
      dat.Role = [];
      dat.signal = 0;
      dat.LeadershipDynamicOrganization = '';
      return {
        fullData: dat,
        openedSignal:false,
        isShowForm: this.isShow,
      };
    },
    methods: {
      save() {
        var ctrl = this;
        ctrl.bindListPermissions();
        var savedData = ctrl.bindSavedData();
        var action = 'edit';
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request = ctrl.$Utils.updateParamsSingleRequest(request, savedData);
        if (ctrl.fullData.model.Id)
          request = ctrl.$Utils.updateParamsSingleRequest(request, { RequestTemplate: 'SettingNew.Update' });
        else {
          action = 'insert';
          request = ctrl.$Utils.updateParamsSingleRequest(request, {
            Code: 'Form.' + ctrl.$Utils.removeVNCharacters(savedData.Caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
            RequestTemplate: 'SettingNew.Insert',
            ReferenceId: ctrl.fullData.parentSetting.Id,
            NestedSetType: 'InsertLastChildNode'
          });
        }
        ctrl.$Utils.postCheckResult(request).then(function(data) {
          if (data.success) {
            ctrl.fullData.model.Id = data.R1.Data;
            if (action == 'insert')
              ctrl.$Utils.linkToRoleEveryone([{
                Id: ctrl.fullData.model.Id,
                Caption: ctrl.fullData.model.Caption,
                Name: ctrl.fullData.model.Caption
              }]);
            ctrl.$Utils.showMessage('success', ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf);
            ctrl.$hub.$emit('forceUpdate', data.R1.Data);
          }
        });
      },

      bindListPermissions() {
        var ctrl = this;
        ctrl.fullData.model.Description.Permissions = [];
        if (ctrl.fullData.permissionModel.listStaticPermissions.length > 0) {
          var node = { Name: 'Static' };
          node.Permissions = '&Count=' + ctrl.fullData.permissionModel.listStaticPermissions.length;
          $.each(ctrl.fullData.permissionModel.listStaticPermissions, function(index, item) {
            node.Permissions += '&Value' + (index + 1) + '=' + item.Value;
            node.Permissions += '&KeyCode' + (index + 1) + '=' + item.KeyCode;
          });

          node.CurrentUser = '';
          $.each(ctrl.fullData.dropdownRoles, function(k, item) {
            node.CurrentUser += item + ';';
          });
          if (ctrl.fullData.AlwaysUpdatePermission)
            node.AlwaysUpdatePermission = true;
          if (ctrl.fullData.RolesIncludedUser)
            node.RolesIncludedUser = true;
          if (ctrl.fullData.GroupInCludedUser)
            node.GroupInCludedUser = true;
          ctrl.fullData.model.Description.Permissions.push(node);
        }

        if (ctrl.fullData.permissionModel.listDynamicPermissions.length > 0) {
          var node = { Name: 'Dynamic' };
          node.Permissions = '&Count=' + ctrl.fullData.permissionModel.listDynamicPermissions.length;
          $.each(ctrl.fullData.permissionModel.listDynamicPermissions, function(index, item) {
            node.Permissions += '&Value' + (index + 1) + '=' + item.Value;
            node.Permissions += '&KeyCode' + (index + 1) + '=' + item.KeyCode;
            if (item.KeyType)
              node.Permissions += '&KeyType' + (index + 1) + '=' + item.KeyType;
          });
          ctrl.fullData.model.Description.Permissions.push(node);
        }
        if (ctrl.fullData.permissionModel.listScriptPermissions.length > 0) {
          var node = { Name: 'Script' };
          node.LeadershipDynamicOrganization = ctrl.fullData.permissionModel.LeadershipDynamicOrganization;
          node.Permissions = '&Count=' + ctrl.fullData.permissionModel.listScriptPermissions.length;
          $.each(ctrl.fullData.permissionModel.listScriptPermissions, function(index, item) {
            node.Permissions += '&Name' + (index + 1) + '=' + item.Name;
            node.Permissions += '&Value' + (index + 1) + '=' + item.Value;
            node.Permissions += '&KeyCode' + (index + 1) + '=' + item.KeyCode;
          });
          ctrl.fullData.model.Description.Permissions.push(node);
        }

        if (ctrl.fullData.dropdownDynamicPermissions.length > 0) {
          var node = { Name: 'Replica' };
          node.DynamicPermissions = '';
          $.each(ctrl.fullData.dropdownDynamicPermissions, function(k, item) {
            node.DynamicPermissions += item.value + ';';
          });
          node.StaticPermissions = ctrl.fullData.permissionModel.StaticPermissions;
          if (ctrl.StaticIncludedUser)
            node.StaticIncludedUser = true;
          node.FormRequest = ctrl.fullData.permissionModel.FormRequest;
          node.FormDataRoot = ctrl.fullData.permissionModel.FormDataRoot;
          node.FormCode = ctrl.fullData.permissionModel.FormCode;
          node.Code = ctrl.fullData.permissionModel.Code;
          ctrl.fullData.model.Description.Permissions.push(node);
        }

        if (ctrl.fullData.RemoveRole) {
          var node = { Name: 'Remove', Value: true };
          ctrl.fullData.model.Description.Permissions.push(node);
        }

        // ctrl.$hub.$emit('permissionsDone', ctrl.model);
      },
      bindSavedData() {
        var savedData = this.$Lodash.cloneDeep(this.fullData.model);
        this.$Utils.deleteAutoValue(savedData);
        this.fullData.DataGroup.forEach(dataGroup => {
          if (dataGroup.Id == this.fullData.selectedDataGroups[this.fullData.selectedDataGroups.length-1]) {
            var refDataGroup = this.$Lodash.cloneDeep(dataGroup);
            refDataGroup.Description = JSON.parse(refDataGroup.Description);
            savedData.Name = refDataGroup.Code;
            savedData.DataGroup = refDataGroup.Code;
            savedData.Caption = this.fullData.model.Caption;
            savedData.Description.Caption = this.fullData.model.Caption;
            savedData.Description.DataGroupCaption = refDataGroup.Caption;
            savedData.Description.Link = refDataGroup.Description.Link;
            savedData.Description.RootData = refDataGroup.Description.RootData;
            savedData.Description.DataSource = refDataGroup.Description.DataSource;
            savedData.Description.AdditionConditions = refDataGroup.Description.AdditionConditions;
            savedData.Description.Dependencies = refDataGroup.Description.Dependencies;
          }
        });
        savedData.Description.DisplayType = this.fullData.selectedDisplayType;
        savedData.Fields = this.$Lodash.cloneDeep(savedData.ObjectFields);

        var refFields = this.$Lodash.cloneDeep(this.fullData.CurrentDataGroup.Fields);
        $.each(savedData.Fields,(k, field) => {
          $.each(refFields, (h, dgField) => {
            if (dgField.Name == field.Name) {
              $.each(dgField, (key, value) => {
                if (!this.$Utils.isEmpty(field[key]))
                  field[key] = value;
              });
              this.$Utils.deleteAutoValue(field);
            }
          });
        });

        $.each(refFields, (k, field) => {
          this.$Utils.deleteAutoValue(field);
          if (field.FormFieldType == 'Hidden')
            savedData.Fields.push(field);
          if (field.DynamicText != undefined && field.DynamicText != null)
            savedData.Fields.push({ Name: field.DynamicText, FieldStorageType: 'Dynamic' });
        });
        var tmp = [];
        $.each(this.fullData.model.Description.Groups, (k, group)=>{
          if(group.children)
            tmp = tmp.concat(group.children);
        })

        $.each(tmp, (k, v)=>{
          delete v.$parent;
        });

        savedData.ObjectFields = JSON.stringify(tmp);
        var iStartIndex = 0;
        var iFieldCount = 0;
        for (var i = 1; i < 7; i++) {
          if (savedData.ObjectFields.length > iStartIndex) {
            savedData['OF' + i] = savedData.ObjectFields.substring(iStartIndex, iStartIndex + 9999);
            iStartIndex = 10000 * i - i;
            iFieldCount = i;
          }
        }
        savedData.Description.OFCount = iFieldCount;
        delete savedData.ObjectFields;

        iStartIndex = 0;
        iFieldCount = 0;
        tmp = this.$Lodash.cloneDeep(savedData.Fields);
        $.each(tmp, (k, v)=>{
          delete v.$parent;
        });
        savedData.Fields = JSON.stringify(tmp);
        for (var i = 1; i < 7; i++) {
          if (savedData.Fields.length > iStartIndex) {
            savedData['F' + i] = savedData.Fields.substring(iStartIndex, iStartIndex + 9999);
            iStartIndex = 10000 * i - i;
            iFieldCount = i;
          }
        }
        savedData.Description.FCount = iFieldCount;
        delete savedData.Fields;

        savedData.Description.Buttons = this.fullData.model.Description.Buttons;

        savedData.Description.Groups = [];
        $.each(this.fullData.model.Description.Groups, (k, group)=>{
          group.ListFields = '';
          delete group.$parent;
          savedData.Description.Groups.push(group);
          var tmp = this.$Lodash.cloneDeep(group.children);
          delete group.children;
          $.each(tmp, (i, field)=>{
            group.ListFields += field.Name + ';';
          })
        })

        $.each(savedData.Description, (key, value) => {
          if (value == true & !$.isNumeric(savedData.Description[key]))
            savedData.Description[key] = 'true';
          if (value == false && value != '')
            savedData.Description[key] = 'false';
        });
        savedData.Description.ModuleType = 'Form';
        savedData.Description = JSON.stringify(savedData.Description);
        return savedData;
      },
      openPermissionSelector(){
        this.$hub.$emit(
          "set-modal-data",
          'Cấp quyền',
          "60%",
          true,
          "center",
          PermissionSelector,
          false,
          '',
          this.selectedItem.Id
        );
      },
      back() {
        this.isShowForm = false;
        setTimeout(function () {
        }, 1000)
        if (this.closeCallback) this.closeCallback();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-form-item--mini.el-form-item {
    margin-bottom: 5px;
  }
</style>
