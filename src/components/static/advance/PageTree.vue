<template>
  <div class="project-categories">
    <b-card>
      <sortable-tree :data="treePage" mixinParentKey="$parent" @changePosition="changePosition" :dragEnable="true"
                     closeStateKey="$foldClose">
        <template slot-scope="{item}">
          <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
            <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i
              :class='item.collapseIcon'></i></span>
            <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i
              :class='item.expandIcon'></i></span>
            <span class="mr-3">
                <i v-if="item.Description && item.Description.IsShowOnMenu" class="fa fa-eye"></i>
                <i :class="item.Description ? item.Description.MenuIcon : 'fa fa-puzzle-piece'"></i>
              <a href="javascript:void(0)" v-if="item.Level!=='3'" @click="editCategory(item)">
                {{item.treeCaption}}</a>
              <a href="javascript:void(0)" v-if="item.Level ==='3'">{{item.Name}}</a>
            </span>
            <span>
              <a href="javascript:void(0)" @click="itemSelected = item; dialogVisible=true">
               <i class="fa fa-plus"></i>
              </a>
              <a v-if="item.Level!=='3'">|
                <a href="javascript:void(0)" @click="deletePage(item)">
                  <i class="fa fa-trash"></i>
                </a>
              </a>
            </span>
          </div>
        </template>
      </sortable-tree>
    </b-card>
    <el-dialog title="Thông tin" :visible.sync="dialogVisible" width="30%" center>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="Tên trang" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false; form.name= ''">Hủy bỏ</el-button>
          <el-button type="primary" @click="addCategory">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  let id = 1000;
  import Vue from 'vue'
  import SortableTree from 'vue-sortable-tree'

  Vue.component(SortableTree.name, SortableTree)
  export default {
    props: ['treePage'],
    data() {
      return {
        treeData: this.treePage,
        dialogVisible: false,
        itemSelected: {},
        form: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: 'Hãy nhập tên trang', trigger: 'blur'},
          ]
        },
        viewModel: {
          ListModules: [],

        }
      }
    },
    destroyed() {
    },
    created() {
      this.updateDatagroup();
    },
    methods: {
      changeState(item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
        this.$forceUpdate();
      },
      changePosition(option) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.MoveNode';
        request.R1_Id = option.data.Id;
        if (option.afterParent.children && option.afterParent.children.length > 1) {
          var index = 0;
          $.each(option.afterParent.children, (key, value) => {
            if (value.Id == option.data.Id && key > 0) {
              index = key - 1;
              request.R1_ReferenceId = option.afterParent.children[index].Id;
              request.R1_NestedSetType = 'MoveToAfterAnother';
            } else if (value.Id == option.data.Id && key == 0) {
              index = 1;
              request.R1_ReferenceId = option.afterParent.children[index].Id;
              request.R1_NestedSetType = 'MoveToBeforeAnother';
            }
          })
        } else {
          request.R1_ReferenceId = option.afterParent.Id;
          request.R1_NestedSetType = 'MoveToLastChildNode';
        }
        this.$Utils.post(request).then((data) => {
          this.getAllLevel(option.afterParent.Level, option.data);

        });
      },
      editCategory(item) {
        this.$hub.$emit('fill-data-to-page', item);
      },
      addCategory() {
        var ctrl = this;
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        var arrCaption = ctrl.form.name.split(';');
        request.TotalRequests = 0;
        $.each(arrCaption, function (k, caption) {
          if (caption != '') {
            request.TotalRequests++;
            request['R' + request.TotalRequests + '_RequestTemplate'] = 'Setting.Insert';
            request['R' + request.TotalRequests + '_NestedSetType'] = 'InsertLastChildNode';
            request['R' + request.TotalRequests + '_ReferenceId'] = ctrl.itemSelected.Id;
            request['R' + request.TotalRequests + '_Caption'] = caption;
            request['R' + request.TotalRequests + '_Name'] = ctrl.$Utils.removeVNCharacters(caption);
            request['R' + request.TotalRequests + '_Code'] = 'Page.' + ctrl.$Utils.removeVNCharacters(caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5);
            request['R' + request.TotalRequests + '_Description'] = JSON.stringify({
              ListGroups: [], Filter: [], Module: [],
              Caption: caption, IsDashboard: false, IsShowOnMenu: true,
              DisplayRole: ctrl.$isMantisAdmin()+'',
              PageLink: 'Url', UrlPage: 'dynamic/' + ctrl.$Utils.removeVNCharacters(caption)
            });
            request['R' + request.TotalRequests + '_Value'] = '[]';
          }
        });

        ctrl.$Utils.post(request).then(function (data) {
          if (data.success) {
            ctrl.$Utils.showMessage('success', ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf);
            ctrl.communication = {action: 'insert', items: []};
            var arrLinked = [];

            $.each(arrCaption, function (index, item) {
              if (item != '') {
                arrLinked.push({
                  Id: data['R' + (index + 1)].Data,
                  Caption: item.Caption,
                  Name: item.Name
                });
                ctrl.communication.items.push({
                  label: request['R' + (index + 1) + '_Caption'],
                  value: data['R' + (index + 1)].Data
                });
              }
            });
            ctrl.$Utils.linkToRoleEveryone(arrLinked);
            ctrl.$hub.$emit('reloadTree');
            ctrl.dialogVisible = false;
            ctrl.form.name = '';
          }
          else {
            ctrl.$Utils.showMessage('error', ctrl.$toastMessage.updateItemFailed);
          }
        });
      },
      deletePage(selectedItem) {
        var ctrl = this;
        ctrl.$Utils.showConfirm('Cảnh báo', this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning).then(() => {
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentId = selectedItem.Id;
          request.R1_IncludedNestedSetParent = true;
          ctrl.$Utils.postCheckResult(request).then((data) => {
            data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            var strListId = '';
            request.TotalRequests = 0;

            $.each(data, (key, setting) => {
              request.TotalRequests++;
              request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.Delete';
              request['R' + request.TotalRequests + '_Id'] = setting.Id;
              strListId += setting.Id + ';'
            });

            if (request.TotalRequests > 0) {
              ctrl.$Utils.post(request).then(() => {
                ctrl.$Utils.showMessage('success', ctrl.$toastMessage.deleteItemPre + ctrl.$toastMessage.deleteItemSuf);
                ctrl.$Utils.removeAllLink(strListId);
                ctrl.$hub.$emit('reloadTree');
              });
            }
          });
        });
      },
      deleteSetting(data) {
        return;
        if (this.$Utils.isEmpty(data)) {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "Setting.Delete";
          request.R1_Id = data.Id;
          this.$Utils.postCheckResult(request).then((dData) => {
            $.each(this.ListData, (key, value) => {
              if (data.Id == value.ParentId) {
                this.deleteSetting(value)
              }
            })
            this.getSetting();
          })
        }
        ;
      },
      checkExits() {
        if (this.Parent && this.Parent != '')
          this.objParent = (this.ListData.filter((el) => {
            return el.Id == this.Parent;
          }))[0];
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchSetting';
        request.R1_Value = this.data.Id;
        request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
        this.$Utils.post(request).then((data) => {
          var listExitsCate = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          listExitsCate = listExitsCate.filter((el) => {
            return el.Name == this.Name;
          });
          if (listExitsCate.length > 0) {
            //console.log('Chuyên mục đã tồn tại')
          } else {
            this.insertSetting();
          }

        });
      },
      insertSetting(data) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.Insert";
        request.R1_Name = this.Name;
        request.R1_Value = this.data.Id;
        request.R1_ValueName = this.data.Name;
        request.R1_ReferenceId = this.$Utils.isEmpty(this.objParent) ? this.objParent.Id : this.ParentId;
        request.R1_NestedSetType = 'InsertLastChildNode';
        this.$Utils.postCheckResult(request).then((dData) => {
          this.$Utils.linkToRoleEveryone([{
            Id: dData.R1.Data,
            Caption: this.Name
          }])
          if (this.$Utils.isEmpty(this.objParent, 'Level'))
            this.onSave(this.objParent.Level);
          else
            this.onSave(5);
          this.Name = null;
          this.objParent = null;
          this.getSetting();
        })
      },
      updateDatagroup() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 4;
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_Code = "DataGroup.danh-sach-cong-viec.04b66";
        request.R2_RequestTemplate = "SettingNew.SearchSetting";
        request.R2_ParentCode = "xSetting.Project.Form";
        request.R2_Level = "4";
        request.R2_Name = "DataGroup.danh-sach-cong-viec.04b66";
        request.R3_RequestTemplate = "SettingNew.SearchSetting";
        request.R3_ParentCode = "xSetting.Project.List";
        request.R3_Level = "4";
        request.R3_Name = "DataGroup.danh-sach-cong-viec.04b66";
        request.R4_RequestTemplate = "SettingNew.SearchSetting";
        request.R4_ParentCode = "xSetting.Project.Filter";
        request.R4_Level = "4";
        request.R4_Name = "DataGroup.danh-sach-cong-viec.04b66";
        this.$Utils.post(request).then((data) => {
          this.SettingFilter = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting')[0];
          if (this.$Utils.isEmpty(this.SettingFilter, 'Description') && typeof this.SettingFilter.Description == 'string')
            this.SettingFilter.Description = JSON.parse(this.SettingFilter.Description);
          this.objFields = {};
          this.sortedFilter = [];
          for (var i = 1; i <= this.SettingFilter.Description.FCount; i++) {
            if (i == 1)
              this.FilterSettings = "";
            this.FilterSettings += this.SettingFilter['F' + i]
            if (i == this.SettingFilter.Description.FCount) {
              this.setFilterSetting = true;
              this.FilterSetting = JSON.parse(this.FilterSettings)
              this.SettingFilter.Fields = this.FilterSetting;
            }
          }
          this.viewModel.ListModules = this.$Utils.getDataWithRoot(data.R2, 'Data.DynamicDS.Setting');
          this.viewModel.ListModules = this.viewModel.ListModules.concat(this.$Utils.getDataWithRoot(data.R3, 'Data.DynamicDS.Setting'));
          this.viewModel.ListModules = this.viewModel.ListModules.concat(this.$Utils.getDataWithRoot(data.R4, 'Data.DynamicDS.Setting'));
          this.viewModel.ListModules.forEach((item) => {
            if (item.Description != undefined) {
              item.Description = JSON.parse(item.Description);
              item.ObjectFields = '';
              for (var i = 1; i <= item.Description.OFCount; i++) {
                if (item['OF' + i] != undefined)
                  item.ObjectFields += item['OF' + i];
              }
              item.ObjectFields = JSON.parse(item.ObjectFields);
            }
          })
          this.DatagroupSource = this.$Lodash.cloneDeep(this.viewModel.ListModules)
        })
      },
      onSave(level, status) {
        var strFields = JSON.stringify(this.SettingFilter.Fields);
        level = level - 4;
        if (strFields.indexOf("ProjectCategoriesLevel" + level) == -1) {
          var obj = {
            Caption: "Danh mục cấp " + level,
            DataSource: "xDynamicData_Setting",
            FieldColumnType: "String",
            FieldStorageType: "Struct",
            FilterIsUsed: "true",
            FormDisplay: "- Danh mục cấp " + level + " -",
            FormFieldType: "Hidden",
            FormIncludeSubmit: "true",
            FormValidate: "",
            ListButtonGroups: "",
            ListIsHidden: "true",
            Name: "ProjectCategoriesLevel" + level,
            PlaceHolder: "- Danh mục cấp " + level + " -",
            ReportIsUsed: "true",
          }
          this.SettingFilter.Fields.push(obj);
          strFields = JSON.stringify(this.SettingFilter.Fields);
          var arrValue = JSON.parse(this.SettingFilter.Value);
          var objValue = {
            Name: "CategoriesLevel" + level,
            ColumnType: "String",
            StorageType: "Struct"
          }
          arrValue.push(objValue);
          this.SettingFilter.Value = JSON.stringify(arrValue);
          this.sourceFields = this.$Lodash.cloneDeep(this.SettingFilter.Fields);
          delete this.SettingFilter.Fields;
          var iStartIndex = 0;
          this.SettingFilter.Description.FCount = 0;
          for (var i = 1; i < 7; i++) {
            if (strFields.length > iStartIndex) {
              this.SettingFilter['F' + i] = strFields.substring(iStartIndex, iStartIndex + 9999);
              iStartIndex = 10000 * i - i;
              this.SettingFilter.Description.FCount = i;
            }
          }
          this.SettingFilter.Description = JSON.stringify(this.SettingFilter.Description);
          if (!this.$Utils.isEmpty(status) || status == false) {
            var requestData = this.$Lodash.cloneDeep(this.$singleRequest);
            this.$Utils.updateParamsSingleRequest(requestData, this.$Lodash.cloneDeep(this.SettingFilter));
            requestData.R1_RequestTemplate = "SettingNew.Update";
            this.$Utils.post(requestData).then((requestData) => {
              this.saveModules();
            })
          }
        }

      },
      saveModules() {
        var dataGroup = this.$Lodash.cloneDeep(this.SettingFilter);
        dataGroup.Description = JSON.parse(dataGroup.Description);
        dataGroup.Description.Fields = this.$Lodash.cloneDeep(this.sourceFields);
        var arrModules = this.$Lodash.cloneDeep(this.viewModel.ListModules);
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 0;
        arrModules.forEach((module) => {
          request.TotalRequests++;

          module.ModuleType = module.Value;
          module.Description.DataGroupCaption = dataGroup.Caption;
          module.Description.RootData = dataGroup.Description.RootData;
          module.Description.DataSource = dataGroup.Description.DataSource;
          module.Description.AdditionConditions = dataGroup.Description.AdditionConditions;
          if (['Form', 'Filter', 'List'].indexOf(module.Description.ModuleType) != -1)
            module.Description.Link = dataGroup.Description.Link;

          if (['Form', 'Filter'].indexOf(module.Description.ModuleType) != -1)
            module.Description.Dependencies = dataGroup.Description.Dependencies;
          var refFields = this.$Lodash.cloneDeep(module.ObjectFields);
          var arrDefaultFields = ['Multicheck', 'IndexDefault', 'Tool'];
          refFields.forEach((field) => {
            var isExist = false;
            for (var i = 0; i < dataGroup.Description.Fields.length; i++) {
              var dgField = dataGroup.Description.Fields[i];
              if (field.Name == dgField.Name) {
                isExist = true;
                break;
              }
            }
            if (['List'].indexOf(module.Description.ModuleType) != -1) {
              if (arrDefaultFields.indexOf(field.Name) != -1)
                isExist = true;
              if (field.ManualCalculator == 'true')
                isExist = true;
            }
            if (!isExist) {
              $.each(module.ObjectFields, (index, sourceField) => {
                if (field.Name == sourceField.Name)
                  module.ObjectFields.splice(index, 1);
              });
              if (module.Description.Groups != undefined) {
                module.Description.Groups.forEach((group) => {
                  if (group.ListFields != undefined)
                    if (group.ListFields.indexOf(field.Name) != -1)
                      group.ListFields = group.ListFields.replace(field.Name + ';', '');
                })
              }
            }
          })
          if (this.$Utils.isEmpty(module.Description, 'Buttons')) {
            var refButtons = this.$Lodash.cloneDeep(module.Description.Buttons);
            refButtons.forEach((button) => {
              var isExist = false;
              for (var i = 0; i < dataGroup.Description.Buttons.length; i++) {
                var dgButton = dataGroup.Description.Buttons[i];
                if (dgButton.Code == button.Code)
                  isExist = true;
              }
              if (!isExist) {
                $.each(module.Description.Buttons, (index, sourceButton) => {
                  if (button.Code == sourceButton.Code)
                    module.Description.Buttons.splice(index, 1);
                });
              }
            });

            module.Description.Buttons.forEach((moduleButton) => {
              module.Description.Buttons.forEach((dgButton) => {
                if (dgButton.Code == moduleButton.Code)
                  moduleButton = dgButton;
              })
            })
          }

          if (['Form', 'List'].indexOf(module.Description.ModuleType) != -1) {
            for (var i = 0; i < module.Description.Buttons.length; i++) {
              dataGroup.Description.Buttons.forEach((dgButton) => {
                if (module.Description.Buttons[i].Code == dgButton.Code)
                  module.Description.Buttons[i] = dgButton;
              });
            }
          }

          module.Fields = this.$Lodash.cloneDeep(module.ObjectFields);
          module.Fields.forEach((field) => {
            dataGroup.Description.Fields.forEach((dgField) => {
              if (dgField.Name == field.Name) {
                $.each(dgField, (key, value) => {
                  if (!this.$Utils.isEmpty(field[key]))
                    field[key] = value;
                });
                this.$Utils.deleteAutoValue(field);
              }
            });
          });

          if (['Form', 'Filter'].indexOf(module.Description.ModuleType) != -1) {
            dataGroup.Description.Fields.forEach((field) => {
              this.$Utils.deleteAutoValue(field);
              if (field.FormFieldType == 'Hidden')
                module.Fields.push(field);
              if (field.DynamicText != undefined && field.DynamicText != null)
                module.Fields.push({Name: field.DynamicText, FieldStorageType: 'Dynamic'});
            });
          } else {
            dataGroup.Description.Fields.forEach((field) => {
              this.$Utils.deleteAutoValue(field);
              if (field.ListIsHidden == 'true')
                module.Fields.push(field);
              if (field.DynamicText != undefined && field.DynamicText != null)
                module.Fields.push({Name: field.DynamicText, FieldStorageType: 'Dynamic'});
            });
          }

          module.ObjectFields = JSON.stringify(module.ObjectFields);
          var iStartIndex = 0;
          var iFieldCount = 0;
          for (var i = 1; i < 7; i++) {
            if (module.ObjectFields.length > iStartIndex) {
              module['OF' + i] = module.ObjectFields.substring(iStartIndex, iStartIndex + 9999);
              iStartIndex = 10000 * i - i;
              iFieldCount = i;
            }
          }
          module.Description.OFCount = iFieldCount;
          delete module.ObjectFields;

          iStartIndex = 0;
          iFieldCount = 0;
          module.Fields = JSON.stringify(module.Fields);
          for (var i = 1; i < 7; i++) {
            if (module.Fields.length > iStartIndex) {
              module['F' + i] = module.Fields.substring(iStartIndex, iStartIndex + 9999);
              iStartIndex = 10000 * i - i;
              iFieldCount = i;
            }
          }
          module.Description.FCount = iFieldCount;
          delete module.Fields;

          module.Description = JSON.stringify(module.Description);
          request = this.$Utils.updateParamsSingleRequest(request, module, request.TotalRequests);
          request = this.$Utils.updateParamsSingleRequest(request, {RequestTemplate: 'SettingNew.Update'}, request.TotalRequests);
        })
        this.$Utils.post(request).then((data) => {
          this.updateDatagroup();
        });
      },
      getAllLevel(parent, data) {
        this.onSave(eval(parent) + 1);
        if (this.$Utils.isEmpty(data.children)) {
          this.getAllLevel(eval(parent) + 1, data.children)
        }
        this.$hub.$emit('reloadTree');
      },
      checkParent(selectedItem) {
        if (this.$Utils.isEmpty(selectedItem, '$parent')) {
          var parent = this.$Lodash.cloneDeep(selectedItem.$parent);
          delete selectedItem.$parent
          this.inputData.unshift(parent)
          this.checkParent(selectedItem.$parent)
        } else {
          var taskRequest = this.$Lodash.cloneDeep(this.$singleRequest);
          taskRequest.TotalRequests = 0;
          $.each(this.ListTask, (index, task) => {
            if (this.$Utils.isEmpty(task, 'ProjectCategoriesName') && task.Categories != "") {
              var flag = false;
              var newCategory = this.$Lodash.cloneDeep(this.inputData);
              var catName = this.$Utils.isEmpty(task, 'ProjectCategoriesName') ? task.CategoriesName.split(';') : [];
              $.each(task.Categories.split(';'), (key, category) => {
                if (category != "") {
                  if (flag == true) {
                    var cat = {};
                    cat.Id = category;
                    cat.Name = catName[key];
                    newCategory.push(cat)
                  }
                  if (category == this.inputData[this.inputData.length - 1].Id) {
                    flag = true;
                  }
                }
              })
              if (flag == true) {
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestTemplate'] = "AG_Task_Task.Update";
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestDataGroup'] = "DataGroup.danh-sach-cong-viec.04b66";
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestFields'] = "Id;Index;ProjectCategories;Code;"
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategories'] = "";
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesName'] = "";
                taskRequest['R' + [taskRequest.TotalRequests + 1] + '_Id'] = task.Id;
                $.each(newCategory, function (val, key) {
                  taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategories'] += val.Id + ";";
                  taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesName'] += val.Name + ";";
                  taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesLevel' + [key + 1]] = val.Id;
                  taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestFields'] += 'ProjectCategoriesLevel' + [key + 1] + ';';
                })
                taskRequest.TotalRequests++;
              }
            }
          })
          this.$Utils.post(taskRequest);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .project-categories {
    .card {
      margin-bottom: 0px;
    }
    .custom-tree-content {
      position: relative;
      top: 2px;
      z-index: 1;
      &.exitChild {
        margin-left: -7px;
      }
    }
  }
</style>
