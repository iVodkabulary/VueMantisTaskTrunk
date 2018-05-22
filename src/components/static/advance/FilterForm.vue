<template>
  <el-form :model="model.Description" label-width="120px" :rules="rules" ref="form">
    <el-form-item>
      <el-button @click="back">Quay lại</el-button>
      <el-button type="primary" @click="save">Lưu</el-button>
    </el-form-item>
    <el-form-item label="Tên" prop="Caption">
      <el-input v-model="model.Description.Caption" placeholder="Nhập tên..."/>
    </el-form-item>
    <el-form-item label="Mô tả">
      <el-input v-model="model.Description.More" placeholder="Nhập mô tả ..."/>
    </el-form-item>
    <el-form-item label="Khối dữ liệu">
      <SelectTree :datasource="viewModel.DataGroup.source" :nameField="['Caption','Code']" :value="value"
                  :selectedValue="viewModel.selectedDataGroup" :callback="onSelectDataGroup"/>
    </el-form-item>
    <el-form-item label="Hiển thị với quản trị viên">
      <el-checkbox v-model="model.Description.isAdminSeen"/>
    </el-form-item>
    <el-form-item>
      <el-col :span="2"> &ensp;</el-col>
      <el-col :span="10">
        <el-select v-model="viewModel.Field" clearable placeholder="Chọn trường dữ liệu thêm vào bộ lọc"
                   style="width: 100%" filterable>
          <el-option
            v-for="item in viewModel.CurrentDataGroup.Fields"
            :key="item.Name"
            :label="item.Caption+' ('+item.Name+')'"
            :value="item.Name" v-if="item.FilterIsUsed == 'true'">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="viewModel.Group" clearable placeholder="Nhóm bộ lọc" style="width: 90%">
          <el-option
            v-for="item in model.Description.Groups"
            :key="item.Caption"
            :label="item.Caption"
            :value="item.Caption">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :disabled="viewModel.Group === ''" @click="insertField()">Thêm</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-card>
        <sortable-tree v-for="(item, index) in viewModel.Groups" :data="item"
                       :dragEnable="true" closeStateKey="$foldClose">
          <template slot-scope="{item}">
            <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
              <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i
                :class='item.collapseIcon'></i></span>
              <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i
                :class='item.expandIcon'></i></span>
              <span class="mr-3"><a href="javascript:void(0)">{{item.Caption}}</a></span>
              <span><i class="el-icon-edit" v-if="!item.children" @click="editField(item)"></i></span>
              <span><i class="el-icon-delete" v-if="!item.children" @click="removeField(item, index)"></i></span>
            </div>
          </template>
        </sortable-tree>
      </el-card>
    </el-form-item>
  </el-form>
</template>
<script>
  import SelectTree from '@/components/dynamic/SelectTree'
  import FieldInfoDialog from '@/components/static/advance/FieldInfoDialog';

  export default {
    components: {
      SelectTree, FieldInfoDialog
    },
    props: ['selectedItem', 'isShow', 'isNew', 'closeCallback'],
    data() {
      return {
        checked: false,
        dataBlock: [],
        dataField: '',
        dataFields: [],
        options: [],
        value4: '',
        value: '',
        inputName: '',
        inputDescription: '',
        action: '',
        model: {},
        parentSetting: {},
        loadField: '',
        viewModel: {
          SelectedDataGroup: '',
          Field: '',
          Group: '',
          Groups: [],
          DataGroup: {
            source: []
          },
          OrderFields: {
            source: []
          },
          CurrentDataGroup: {
            Fields: []
          }
        },
        rules: {
          Caption: [{required: true, message: 'Trường bắt buộc', trigger: 'blur'}]
        }
      };
    },
    methods: {
      editField(item) {
        var ctrl = this;
        var communication = {
          item: item,
          action: 'edit',
          type: 'Form',
        };
        ctrl.$hub.$emit(
          "set-modal-data",
          "Thông tin trường dữ liệu",
          "50%",
          true,
          "center",
          FieldInfoDialog,
          false,
          "",
          communication
        );
      },
      removeField(item, index) {
        var temp = [];
        $.each(this.viewModel.Groups[index].children, (key, value) => {
          if (item.Name === value.Name) {
            this.viewModel.Groups[index].children.splice(key, 1);
            temp = this.$Lodash.cloneDeep(this.viewModel.Groups);
            this.model.Description.Groups = this.$Lodash.cloneDeep(temp);
            $.each(this.model.ObjectFields, (key, value) => {
              if (item.Name === value.Name) {
                this.model.ObjectFields.splice(key, 1);
                return false
              }
            });
            return false
          }
        });

      },
      handleChange(data) {

      },
      onSelectDataGroup(data) {
        this.viewModel.SelectedDataGroup = data;
        this.viewModel.OrderFields.source = [];
        this.viewModel.ListDataGroups.forEach(datagroup => {
          if (datagroup.Id === this.viewModel.SelectedDataGroup[this.viewModel.SelectedDataGroup.length - 1]) {
            var request = this.$Lodash.cloneDeep(this.$singleRequest);
            request.R1_RequestTemplate = 'SettingNew.SearchSetting';
            request.R1_Code = datagroup.Code;
            this.$Utils.postCheckResult(request).then((result) => {
              result = this.$Utils.getDataWithRoot(result.R1, 'Data.DynamicDS.Setting');
              result = result[0];
              result.Description = JSON.parse(result.Description);
              result.Fields = '';
              for (var i = 1; i <= result.Description.FCount; i++) {
                if (result['F' + i] != undefined) {
                  result.Fields += result['F' + i];
                  delete result['F' + i];
                }
              }
              result.Fields = JSON.parse(result.Fields);
              this.viewModel.CurrentDataGroup = {Fields: result.Fields};
            });
          }
        });
      },
      changeState(item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
      },
      editTreeNode(selectedItem) {

      },
      back() {
        if (this.closeCallback) this.closeCallback();
      },
      save() {
        this.$refs['form'].validate((valid) => {
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
                Code: 'Filter.' + this.$Utils.removeVNCharacters(savedData.Caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
                RequestTemplate: 'SettingNew.Insert',
                ReferenceId: this.parentSetting.Id,
                NestedSetType: 'InsertLastChildNode'
              });
            }
            this.$Utils.postCheckResult(request).then((data) => {
              if (data.success) {
                this.model.Id = data.R1.Data;
                if (action === 'insert') {
                  this.$Utils.linkToRoleEveryone([{
                    Id: this.model.Id,
                    Caption: this.model.Caption,
                    Name: this.model.Name
                  }]);
                  //$state.go('app.configuration.filters.detail', {id: this.model.Id});
                }
                this.$Utils.showMessage('success', this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
              }
            });
          } else {
            return false;
          }
        });
      },
      bindEditor() {
        if (!this.isNew) {
          this.action = 'edit';
          var currentForm = this.$Lodash.cloneDeep(this.selectedItem);
          currentForm.Description = JSON.parse(currentForm.Description);
          currentForm.ObjectFields = '';
          for (var i = 1; i <= currentForm.Description.OFCount; i++) {
            if (currentForm['OF' + i] !== undefined) {
              currentForm.ObjectFields += currentForm['OF' + i];
              // delete currentForm['F' + i];
              delete currentForm['OF' + i];
            }
          }
          currentForm.ObjectFields = JSON.parse(currentForm.ObjectFields);
          $.each(currentForm.Description, (value, key) => {
            if (value === 'true')
              currentForm.Description[key] = true;
            else if (value === 'false')
              currentForm.Description[key] = false;
          });
          this.model = currentForm;
          this.viewModel.CurrentDataGroup.Fields = this.$Lodash.cloneDeep(this.model.ObjectFields);
          $.each(this.model.Description.Groups, (key, item) => {
            if (item.ListFields) {
              var tempListField = item.ListFields;
              var temp = tempListField.split(";");
              item.children = [];
              $.each(temp, (k, data) => {
                $.each(this.model.ObjectFields, (k, field) => {
                  if (field.Name === data) {
                    item.children.push(field);
                    this.viewModel.OrderFields.source.push(field);
                  }
                })
              });
              item.collapseIcon = 'fa fa-plus-square';
              item.expandIcon = 'fa fa-minus-square';
              item.level = '0';
              item.Level = '5';
              item.Name = item.Caption;
            }
          });
          this.viewModel.Groups = this.$Lodash.cloneDeep(this.model.Description.Groups);
        }
        else {
          this.action = '';
        }

        this.bindDataGroupSource();

        if (this.action === '') {
          this.model = {
            Description: {
              Groups: [
                {Caption: 'Lọc chính'},
                {Caption: 'Lọc nâng cao'}
              ],
              Dependencies: [],
              Link: {}
            },
            ObjectFields: []
          };
          this.viewModel.Groups = this.$Lodash.cloneDeep(this.model.Description.Groups);
          this.viewModel.Groups.forEach(item => {
            item.ListFields = "";
            item.children = [];
            item.collapseIcon = 'fa fa-plus-square';
            item.expandIcon = 'fa fa-minus-square';
            item.level = '0';
            item.Level = '5';
            item.Name = item.Caption;
          });
          this.bindParentSetting();
        }
      },
      bindParentSetting() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_Code = 'xSetting.Project.Filter';
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.parentSetting = data[0];
        })
      },
      bindDataGroupSource() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Project.DataGroup';
        request.R1_Level = '4;5';
        this.$Utils.post(request).then((data) => {
          this.viewModel.ListDataGroups = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel.DataGroup.source = this.$Lodash.cloneDeep(this.viewModel.ListDataGroups);
          this.viewModel.DataGroup.source.forEach(item => {
            var ret = true;
            if (item.Code === this.selectedItem.Name) {
              var tmp = [item.ParentId, item.Id];
              this.$set(this.viewModel, 'selectedDataGroup', tmp);
              this.onSelectDataGroup(this.viewModel.selectedDataGroup);
              ret = false;
            }
            return ret;
          })
        });
      },
      bindSavedData() {
        var savedData = this.$Lodash.cloneDeep(this.model);
        this.$Utils.deleteAutoValue(savedData);
        this.viewModel.ListDataGroups.forEach((dataGroup) => {
          if (dataGroup.Id === this.viewModel.SelectedDataGroup[this.viewModel.SelectedDataGroup.length - 1]) {
            var refDataGroup = this.$Lodash.cloneDeep(dataGroup);
            refDataGroup.Description = JSON.parse(refDataGroup.Description);
            savedData.Name = refDataGroup.Code;
            savedData.Caption = savedData.Description.Caption;
            savedData.Description.DataGroupCaption = refDataGroup.Caption;
            savedData.Description.Link = refDataGroup.Description.Link;
            savedData.Description.RootData = refDataGroup.Description.RootData;
            savedData.Description.DataSource = refDataGroup.Description.DataSource;
            savedData.Description.AdditionConditions = refDataGroup.Description.AdditionConditions;
            savedData.Description.Dependencies = refDataGroup.Description.Dependencies;
          }
        });

        $.each(savedData.Description.Groups, (key, group) => {
          group.ListFields = '';
          this.viewModel.Groups[key].children.forEach(child => {
            group.ListFields += child.Name + ";";
          });
        });

        savedData.Fields = this.$Lodash.cloneDeep(savedData.ObjectFields);
        var refFields = this.$Lodash.cloneDeep(this.viewModel.CurrentDataGroup.Fields);
        savedData.Fields.forEach((field) => {
          refFields.forEach((dgField) => {
            if (dgField.Name === field.Name) {
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
          if (field.FormFieldType === 'Hidden')
            savedData.Fields.push(field);
          if (field.DynamicText !== undefined && field.DynamicText != null)
            savedData.Fields.push({Name: field.DynamicText, FieldStorageType: 'Dynamic'});
        });

        savedData.ObjectFields.forEach(item => {
          delete item.$parent;
        });

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
        savedData.Fields.forEach(item => {
          delete item.$parent;
        });
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

        // var orderFieldsItems = this.$Lodash.cloneDeep(this.model.ObjectFields);
        // savedData.Description.Groups.forEach((group) => {
        //   group.ListFields = '';
        //   var treeItemId = '';
        //   orderFieldsItems.forEach((item) => {
        //     if (item.label === group.Caption && item.level === 0)
        //       treeItemId = item.id;
        //   });
        //   orderFieldsItems.forEach((item) => {
        //     if (item.parentId === treeItemId)
        //       group.ListFields += item.value + ';';
        //   });
        //   orderFieldsItems.forEach(item => {
        //
        //   })
        // });

        $.each(savedData.Description, (key, value) => {
          if (value === true & !this.isNumeric(savedData.Description[key]))
            savedData.Description[key] = 'true';
          if (value === false && value !== '')
            savedData.Description[key] = 'false';
        });

        savedData.Description.ModuleType = 'Filter';
        savedData.Description = JSON.stringify(savedData.Description);
        return savedData;
      },
      insertField() {
        this.loadField = 'Đang thêm ...'
        var exist = false;
        var temp = [];
        if (this.viewModel.Field !== '') {
          this.model.ObjectFields.forEach(selectedField => {
            if (selectedField.Name === this.viewModel.Field) {
              exist = true;
            }
          });
          if (exist === false) {
            this.viewModel.Groups.forEach(group => {
              if (group.Caption === this.viewModel.Group) {
                group.ListFields += this.viewModel.Field + ";";
                this.viewModel.CurrentDataGroup.Fields.forEach(field => {
                  if (field.Name === this.viewModel.Field) {
                    group.children.push(field);
                    this.model.ObjectFields.push(field);
                  }
                })
              }
            });
            temp = this.$Lodash.cloneDeep(this.viewModel.Groups);
            this.model.Description.Groups = this.$Lodash.cloneDeep(temp);
            temp = JSON.stringify(this.model.Description.Groups);
            this.model.Description.Groups = JSON.parse(temp);
            this.$forceUpdate();
            this.$nextTick();
          }
          else {
            this.$Utils.showMessage('error', 'Trường dữ liệu đã được thêm vào');
          }
        }
        else {
          this.$Utils.showMessage('error', 'Hãy chọn 1 trường dữ liệu');
        }
        this.viewModel.Field = '';
      },
      isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
    },
    created() {
      this.bindEditor();
    },
    mounted() {

    }
  }
</script>
<style scoped lang="scss">
  .children {
    padding-left: 10px;
  }

  .custom-tree-content {
    position: relative;
    top: 2px;
    z-index: 1;
    &.exitChild {
      margin-left: -7px;
    }
  }
</style>
