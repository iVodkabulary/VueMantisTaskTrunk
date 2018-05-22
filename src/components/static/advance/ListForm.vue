<!--suppress ALL -->
<template>

  <div class="form-list">
    <el-form :model="model" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item>
        <el-button @click="back">Quay lại</el-button>
        <el-button type="primary" @click="openPermissionSelector()" v-if="!isNew">Cấp phép</el-button>
        <el-button type="primary" @click="save()">Lưu</el-button>
      </el-form-item>
      <el-form-item label="Tên" prop="Caption">
        <el-input v-model="model.Caption"></el-input>
      </el-form-item>

      <el-form-item label="Mô tả" prop="name">
        <el-input type='textarea' v-model="model.More"></el-input>
      </el-form-item>
      <el-form-item label="Xuất bản" v-show="model.Description.DisplayType == 'Partition'">
        <el-switch v-model="model.Description.Export"></el-switch>
      </el-form-item>
      <el-form-item label="Áp dụng quyền" v-show="isSystemAdmin">
        <el-switch v-model="model.Description.AssignedUser"></el-switch>
      </el-form-item>
      <el-form-item label="Cho phép quản trị" v-show="isSystemAdmin">
        <el-switch v-model="model.Description.isAdminSeen"></el-switch>
      </el-form-item>
      <el-form-item label="Kiểu hiển thị" prop="type">
        <el-radio-group v-model="model.Description.DisplayType">
          <el-radio v-for="item in viewModel.DisplayType" :label="item.Code" :key="item.Code">{{item.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Khối dữ liệu" prop="region">
        <SelectTree :datasource="viewModel.ListDataGroups" :nameField="['Caption','Code']"
                    :selectedValue="selectedDataGroup" :changeOnSelect="false" :callback="handleChange"/>
      </el-form-item>
      <el-form-item label="Trường dữ liệu đưa vào">
        <el-select v-model="viewModel.Field" placeholder="Chọn" clearable filterable>
          <el-option
            v-for="item in CurrentDataGroup.Fields"
            :key="item.Name"
            :label="item.Caption + ' (' + item.Name + ')'"
            :value="item.Name"  v-if="item.ListIsHidden !='true'">
          </el-option>
        </el-select>
        <el-button @click="insertField()" :disabled="viewModel.Field === ''">Thêm</el-button>
        <el-button type="primary"
                   @click="showFieldDetail('insert', { ColumnType: 'Text', TextAlign: 'Left', ManualCalculator: 'true' })">
          Thêm trường mới
        </el-button>
        <!--<el-button type="primary" @click="submitForm('ruleForm')">Thêm nhóm dữ liệu</el-button>-->
        <el-button type="primary" @click="deleteField()">Xóa</el-button>
      </el-form-item>
      <el-form-item label="Trường dữ liệu ">
        <el-card class="box-card">
          <div v-dragula="model.ObjectFields" bag="fieldsBag">
            <div class="dragable row" v-for="(field, index) in model.ObjectFields" :key="field.Name">
              <span @click="selectField(field.Name)">{{field.Caption}} ({{field.Name}})</span>
              <span><i class="el-icon-edit" @click="showFieldDetail('edit', field)"></i></span>
              <span><i class="el-icon-delete" @click="removeField(index)"></i></span>
            </div>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="Hiển thị nút">
        <el-card class="box-card">
          <el-checkbox-group v-model="listSelectedButtons">
            <div v-dragula="CurrentDataGroup.Buttons" bag="btnFieldsBag">
              <el-checkbox style="margin-left: 0px" v-for="item in CurrentDataGroup.Buttons" :key="item.Code"
                           class="row dragable" :label="item.Code"></el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>
      </el-form-item>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="Thông báo" name="1">
          <el-button type="primary" @click="editRow('insert')">Thêm</el-button>
          <el-table
            :data="model.Description.Notifications"
            style="width: 100%">
            <el-table-column
              type="index"
              label="STT"
              width="50">
            </el-table-column>
            <el-table-column
              prop="NotificationType"
              label="Loại"
              width="180">
            </el-table-column>
            <el-table-column
              prop="Permissions"
              label="Quản trị"
              width="180">
            </el-table-column>
            <el-table-column
              prop="Template"
              label="Template">
            </el-table-column>
            <el-table-column
              label="Xử lý">
              <template slot-scope="scope">
                <el-button @click="editRow('edit',scope, scope.$index)" size="small"><i class="el-icon-edit"></i></el-button>
                <el-button   type="danger" @click="deleteRow(scope.$index)" size="small"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>

</template>
<script>
  import Vue from 'vue';
  import VueDragula from 'vue-dragula';
  import PermissionSelector from '@/components/static/PermissionSelector';
  import SelectTree from '@/components/dynamic/SelectTree';
  import ListFieldInfoDialog from '@/components/static/advance/ListFieldInfoDialog';
  import ExtendListNotify from '@/components/static/ExtendListNotify';

  Vue.use(VueDragula);

  export default {
    props: ['selectedItem', 'isShow', 'isNew', 'closeCallback'],
    components: {VueDragula, PermissionSelector, SelectTree, ListFieldInfoDialog, ExtendListNotify},
    data() {
      return {
        selectedField: '',
        isSystemAdmin: this.$isSystemAdmin(),
        activeNames: ['1'],
        model: {},
        ruleForm: {
          name: '',
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: ""
        },
        rules: {
          Caption: {required: true, message: 'Trường bắt buộc', trigger: 'blur'}
        },
        viewModel: {
          Field: '',
          PartitionCalculator: {
            source: [],
            checkboxes: true,
            displayMember: 'Caption',
            valueMember: 'Name'
          },
          DataGroup: {
            source: []
          },
          Fields: {
            source: []
          },
          Buttons: {
            source: []
          },
          DisplayType: '',
          ListDataGroups: [],
          CurrentDataGroup: {Fields: [], Buttons: []}
        },
        parentSetting: {},
        listSelectedButtons: [],
        selectedDataGroup: [],
        action: '',
        CurrentDataGroup: {},
        communication: {action: '', item: {}, index: '', scope: this}
      };
    },

    created() {
      this.bindEditor();
      Vue.vueDragula.options('fieldsbag', {
        direction: 'vertical'
      });
      Vue.vueDragula.options('btnFieldsbag', {
        direction: 'vertical'
      })
    },
    mounted() {

    },
    ready() {
      Vue.vueDragula.eventBus.$on('drop', function (args) {
        //console.log('drop: ' + args[0])
      })
    },
    watch: {
      selectedItem: {
        handler: function (after, before) {
          //console.log(newItem);
        },
        deep: true
      }
    },
    methods: {
      editRow(action, item, index) {
        this.communication.action = action;
        if (action === 'edit') {
          this.communication.item = item;
          this.communication.index = item.$index;
        }
        this.communication.type = "List";
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin chi tiết thông báo",
          "40%",
          true,
          "center",
          ExtendListNotify,
          false,
          '',
          this.communication
        );
      },
      bindSubElement(arrSubForms, communication) {
        if (communication.action == 'edit')
          this.model.Description.Notifications[communication.index] = communication.item;
        else
          this.model.Description.Notifications.push(communication.item);
      },
      deleteRow(index) {
        this.model.Description.Notifications.splice(index, 1);
      },
      bindField(communication) {
        if (communication.action == 'edit') {
          this.model.ObjectFields.forEach(field => {
            if (field.Name === communication.item.Name) {
              $.each(communication.item, (key, value) => {
                this.$set(field, key, value);
              })
            }
          })
        } else {
          communication.item.Name = this.$Utils.removeVNCharacters(communication.item.Caption);
          this.model.ObjectFields.push(communication.item);
        }
      },
      showFieldDetail(action, item) {
        this.communication = {
          item: this.$Lodash.cloneDeep(item),
          action: action,
          index: '',
          type: 'List',
          scope: this
        };
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin trường dữ liệu",
          "50%",
          true,
          "center",
          ListFieldInfoDialog,
          false,
          "",
          this.communication
        );
      },
      save() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var savedData = this.bindSavedData();
            var action = 'edit';
            var request = this.$Lodash.cloneDeep(this.$singleRequest);
            request = this.$Utils.updateParamsSingleRequest(request, savedData);
            if (this.model.Id)
              request = this.$Utils.updateParamsSingleRequest(request, {RequestTemplate: 'SettingNew.Update'});
            else {
              action = 'insert';
              request = this.$Utils.updateParamsSingleRequest(request, {
                Code: 'List.' + this.$Utils.removeVNCharacters(savedData.Caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
                RequestTemplate: 'SettingNew.Insert',
                ReferenceId: this.parentSetting.Id,
                NestedSetType: 'InsertLastChildNode'
              });
            }
            this.$Utils.postCheckResult(request).then((data) => {
              if (data.success) {
                this.model.Id = data.R1.Data;
                if (action == 'insert') {
                  this.$Utils.linkToRoleEveryone([{
                    Id: this.model.Id,
                    Caption: this.model.Caption,
                    Name: this.model.Name
                  }]);
                  this.$Utils.showMessage('success', this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
                  //$state.go('app.configuration.lists.detail', { id: this.model.Id });
                }
              }
            });
          }
          else {
            return false
          }
        });
      },
      bindSavedData() {
        var savedData = this.$Lodash.cloneDeep(this.model);
        this.$Utils.deleteAutoValue(savedData);
        this.viewModel.ListDataGroups.forEach((dataGroup) => {

          if (dataGroup.Id === this.selectedDataGroup[this.selectedDataGroup.length - 1]) {
            var refDataGroup = this.$Lodash.cloneDeep(dataGroup);
            refDataGroup.Description = JSON.parse(refDataGroup.Description);
            savedData.Name = refDataGroup.Code;
            savedData.Description.Caption = savedData.Caption;
            savedData.Description.DataGroupCaption = refDataGroup.Caption;
            savedData.Description.RootData = refDataGroup.Description.RootData;
            savedData.Description.DataSource = refDataGroup.Description.DataSource;
            savedData.Description.AdditionConditions = refDataGroup.Description.AdditionConditions;
            savedData.DataGroup = refDataGroup.Code;
          }
        });

        savedData.Fields = this.$Lodash.cloneDeep(savedData.ObjectFields);
        if(this.CurrentDataGroup.Fields){
          var refFields = this.$Lodash.cloneDeep(this.CurrentDataGroup.Fields);
          savedData.Fields.forEach((field) => {
            refFields.forEach((dgField) => {
              if (dgField.Name == field.Name) {
                $.each(dgField, (key, value) => {
                  if (!this.$Utils.isEmpty(field[key]))
                    field[key] = value;
                });
                this.$Utils.deleteAutoValue(field);
              }
            });
          });

          refFields.forEach((field) => {
            this.$Utils.deleteAutoValue(field);
            if (field.ListIsHidden == 'true')
              savedData.Fields.push(field);
            if (field.DynamicText != undefined && field.DynamicText != null)
              savedData.Fields.push({Name: field.DynamicText, FieldStorageType: 'Dynamic'});
          });
        }

        savedData.ObjectFields = JSON.stringify(savedData.ObjectFields);
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
        savedData.Fields = JSON.stringify(savedData.Fields);
        for (var i = 1; i < 7; i++) {
          if (savedData.Fields.length > iStartIndex) {
            savedData['F' + i] = savedData.Fields.substring(iStartIndex, iStartIndex + 9999);
            iStartIndex = 10000 * i - i;
            iFieldCount = i;
          }
        }

        savedData.Description.FCount = iFieldCount;
        delete savedData.Fields;

        savedData.Description.Buttons = [];
        if(this.CurrentDataGroup.Buttons){
          var refButtons = this.$Lodash.cloneDeep(this.CurrentDataGroup.Buttons);
          refButtons.forEach((button) => {
            this.listSelectedButtons.forEach((selectedBtn) => {
              if (button.Code == selectedBtn) {
                savedData.Description.Buttons.push(button);
              }
            });
          });
        }

        $.each(savedData.Description, (key, value) => {
          if (value == true & !this.isNumeric(savedData.Description[key]))
            savedData.Description[key] = 'true';
          if (value == false && value != '')
            savedData.Description[key] = 'false';
        });

        savedData.Description.ModuleType = 'List';
        savedData.Description = JSON.stringify(savedData.Description);
        return savedData;
      },
      insertField() {
        if (this.viewModel.Field != '' && this.viewModel.Field != null) {
          var selectedField = '';
          this.CurrentDataGroup.Fields.forEach((field) => {
            if (field.Name === this.viewModel.Field) {
              selectedField = {Caption: field.Caption, Name: field.Name, ColumnType: 'Text', TextAlign: 'Left'};
              if (field.FieldColumnType == 'DateTime')
                selectedField.Format = 'DD/MM/YYYY';
            }
          });

          var exist = false;
          this.model.ObjectFields.forEach((field) => {
            if (field.Name == selectedField.Name)
              exist = true;
          });

          if (!exist) {
            this.model.ObjectFields.push(selectedField);
          } else {
            this.$Utils.showMessage('error', 'Trường dữ liệu đã được thêm vào');
          }
          this.viewModel.Field = '';
        } else {
          this.$Utils.showMessage('error', 'Hãy chọn 1 trường dữ liệu');
        }
      },
      deleteField() {
        if (this.viewModel.Field) {
          $.each(this.model.ObjectFields, (key, value) => {
            if (value !== undefined) {
              if (value.Name === this.viewModel.Field) {
                this.model.ObjectFields.splice(key, 1);
                this.viewModel.Field = '';
              }
            }
          });
        } else {
          this.$Utils.showMessage('error', 'Chọn trường trước khi xóa!');
        }
      },
      removeField(index) {
        this.model.ObjectFields.splice(index, 1);
      },
      selectField(name) {
        this.viewModel.Field = name;
      },
      openPermissionSelector() {
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
        //this.$router.push('/lists')
        if (this.closeCallback) this.closeCallback();

      },
      addGroupFields() {
        this.data.push({
          key: this.data.length,
          label: `grouped-fields`,
          type: "GROUPFIELD",
          disabled: true
        });
        this.value3.push(this.data.length);
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onClick() {
      },
      bindEditor() {
        if (!this.isNew) {
          this.action = 'edit';
          var currentObject = this.$Lodash.cloneDeep(this.selectedItem);
          currentObject.Description = JSON.parse(currentObject.Description);
          currentObject.ObjectFields = '';
          for (var i = 1; currentObject.Description.OFCount && i <= currentObject.Description.OFCount; i++) {
            if (currentObject['OF' + i] != undefined) {
              currentObject.ObjectFields += currentObject['OF' + i];
              // delete currentObject['F' + i];
              delete currentObject['OF' + i];
            }
          }
          currentObject.ObjectFields = JSON.parse(currentObject.ObjectFields);
          $.each(currentObject.Description, (key, value) => {
            if (value == 'true')
              currentObject.Description[key] = true;
            else if (value == 'false')
              currentObject.Description[key] = false;
          });
          this.model = this.$Lodash.cloneDeep(currentObject);
          this.viewModel.CurrentDataGroup = {
            Fields: this.$Lodash.cloneDeep(this.model.ObjectFields),
            Buttons: []
          }
          this.model.Description.Buttons.forEach(item => {
            this.listSelectedButtons.push(item.Code);
          });
          this.bindComboModel('DisplayType');
          this.bindDataGroupSource();
        }
        else {
          this.action = '';
        }
        if (this.action === '') {
          this.model = {Description: {Buttons: [], DisplayType: 'Popular', Notifications: []}, ObjectFields: []};
          this.bindComboModel('DisplayType');
          this.bindDataGroupSource();
          this.bindParentSetting();
        }
      },
      bindComboModel(code) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Default.Project.List.' + code;
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel[code] = data;
        })
      },
      handleChange(itemIds) {
        this.selectedDataGroup = itemIds;
        var selectedId = itemIds[itemIds.length - 1];
        this.viewModel.ListDataGroups.forEach(datagroup => {
          var ret = true;
          if (datagroup.Id === selectedId) {
            var request = this.$Lodash.cloneDeep(this.$singleRequest);
            request.R1_RequestTemplate = 'SettingNew.SearchSetting';
            request.R1_Code = datagroup.Code;
            this.$Utils.post(request).then(response => {
              response = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");
              response = response[0];
              response.Description = JSON.parse(response.Description);
              response.Fields = '';
              for (var i = 1; i <= response.Description.FCount; i++) {
                if (response['F' + i] != undefined){
                  response.Fields += response['F' + i];
                  delete response['F' + i];
                }
              }
              response.Fields = [
                { Caption: 'Chọn', Name: 'Multicheck', ColumnType: 'Text', TextAlign: 'Center' },
                { Caption: 'Số thứ tự', Name: 'IndexDefault', ColumnType: 'Text', TextAlign: 'Center' },
                { Caption: 'Công cụ', Name: 'Tool', ColumnType: 'Text', TextAlign: 'Center' }
              ].concat(JSON.parse(response.Fields));
              //response.Fields = JSON.parse(response.Fields);
              //console.log(response.Fields)
              this.CurrentDataGroup = {
                Fields: response.Fields,
                Buttons: []
              }
              this.selectedItem.CurrentDataGroup = this.CurrentDataGroup;
              response.Description.Buttons.forEach((item) => {
                if (item.ParentObject == 'List')
                  this.CurrentDataGroup.Buttons.push(item);
              })

              var temp = [];
              this.listSelectedButtons.forEach(code => {
                this.CurrentDataGroup.Buttons.forEach(item => {
                  if (item.Code === code) {
                    temp.push(item);
                    var flag = true;
                  }
                });
              });
              this.CurrentDataGroup.Buttons.forEach(item => {
                var flag = false;
                this.listSelectedButtons.forEach(code => {
                  if (item.Code === code) {
                    flag = true;
                  }
                });
                if (!flag) {
                  temp.push(item);
                }
              })
              this.CurrentDataGroup.Buttons = this.$Lodash.cloneDeep(temp);
            })
            ret = false;
          }
          return ret;
        })
      },
      bindDataGroupSource() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Project.DataGroup';
        request.R1_Level = '4;5';
        this.$Utils.post(request).then((data) => {
          this.viewModel.ListDataGroups = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel.DataGroup.source = this.viewModel.ListDataGroups;
          this.viewModel.DataGroup.source.forEach(item => {
            var ret = true;
            if (item.Code === this.selectedItem.DataGroup) {

              var tmp = [item.ParentId, item.Id];
              this.$set(this, 'selectedDataGroup', tmp);
              this.handleChange(this.selectedDataGroup);
              ret = false;
            }
            return ret;
          })
        });
      },
      bindParentSetting() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_Code = 'xSetting.Project.List';
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.parentSetting = data[0];
        })
      },
      isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },
      renderFunc(h, option) {
        return ( < span > {option.type
      }
        -{option.key
      }
        -{option.label
      }<
        /span>);
      },
    }
  };
</script>
<style scoped lang="scss">
  .form-list {
    .box-card {
      height: 300px;
      overflow: scroll;
    }
    .dragable:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>
