<template>
  <div class="project-categories">
    <b-card>
      <el-form :model="model" :inline="!$isMobileDevice" label-width="130px" >
      <el-form-item :rules="{
          required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
        }" label="Tên nghiệp vụ" prop="Name">
       <el-input  v-model="model.Name"  type="text" placeholder="Nghiệp vụ dự án"></el-input>
      </el-form-item>
      <el-form-item label="Nghiệp vụ cha">
        <el-select v-model="model.Parent" placeholder="Nghiệp vụ cha" style="width: 100%;">
             <el-option value=''>-- Chọn nút cha --</el-option>
              <el-option v-for="item in ListData"
                     :key="item.Id"
                         :label="item.text"
                         :value="item.Id"
                         >
              </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
      <el-button @click="checkExits">Lưu</el-button>
     </el-form-item>
      </el-form>
    </b-card>
    <b-card>
      <!-- <button @click="consoleData">consoleData</button> -->
      <sortable-tree :data="treeData" mixinParentKey="$parent" @changePosition="changePosition" :dragEnable="true" closeStateKey="$foldClose">
        <template slot-scope="{item}">
          <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
            <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)">▶</span>
            <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)">▼</span>
            <span class="mr-3">{{item.Name}}</span><span v-if="item.level!='0'"><a href="javascript:void(0)" @click="editCategory(item)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a> | <a href="javascript:void(0)" @click="deleteSetting(item)"><i class="fa fa-trash" aria-hidden="true"></i></a></span>
          </div>
        </template>
      </sortable-tree>
    </b-card>
  </div>
</template>


<script>
  import Vue from 'vue'
  import SortableTree from 'vue-sortable-tree'
  import EditProjectCategory from '@/components/static/EditProjectCategory'
  Vue.component(SortableTree.name, SortableTree)
  export default {
    props: ['data'],
    components: {EditProjectCategory},
    data() {
      return {
        model: {
        Name: '',
        Parent: '',
        },
        ListData: [],
        treeData: {
            Name: 'Nghiệp vụ dự án',
            children: [],
            level: '0',
            Level: '5'
        },
        viewModel: {}
      }
    },

  created() {
     this.updateDatagroup();
     var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = 'Setting.SearchSetting';
      request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
      request.R1_IncludedNestedSetParent = true;
      this.$Utils.post(request).then((data) => {
        this.ListData = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
        if (this.$Utils.isEmpty(this.ListData, "0")) {
          this.ParentId = this.$Lodash.cloneDeep(this.ListData[0].Id);
          this.ListData.shift();
          this.PageKey = this.ListData[0];
          this.getSetting();
        }
      });
  },
    methods: {
      getSetting(){
        this.ListData = [];
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
         request.R1_RequestTemplate = 'Setting.SearchSettingTree';
         request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
         request.R1_Value = this.data.Id;
         // request.R1_IncludedNestedSetParent = true;
         request.R2_RequestTemplate = 'Setting.SearchSetting';
         request.R2_ParentCode = 'xSetting.Project.Parameter.Project.Category';
         request.R2_Value = this.data.Id;
         // request.R2_IncludedNestedSetParent = true;
         request.TotalRequests = 2;
         this.$Utils.postCheckResult(request).then((data) => {
           // this.ListData.shift();
           this.treeData.children = this.$Utils.getDataWithRoot(data.R1, 'Data');
           var SourceList = this.$Utils.getDataWithRoot(data.R2, 'Data.DynamicDS.Setting');
           if(this.$Utils.isEmpty(SourceList, '0')){
            var RootLevel = this.$Lodash.cloneDeep(SourceList[0].Level);
           }
           // SourceList.shift();
           $.each(SourceList, (key, value) => {
             var index = key - 1
             this.ListData.push(value)
             var childRank = eval(value.Level - RootLevel);
             this.ListData[key].text = "";
             while (childRank > 0) {
               this.ListData[key].text += "|-- "
               childRank--;
             }
             this.ListData[key].text += value.Name;
           })
         });
      },
      consoleData (item) {
        //console.log(this.treeData)
        //console.log(item)
      },
      changeState (item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
      },
      changePosition (option) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.MoveNode';
        request.R1_Id = option.data.Id;
        if(option.afterParent.children && option.afterParent.children.length > 1){
          var index = 0;
          $.each(option.afterParent.children, (key, value) =>{
            if(value.Id == option.data.Id && key > 0){
              index = key - 1;
              request.R1_ReferenceId = option.afterParent.children[index].Id;
              request.R1_NestedSetType = 'MoveToAfterAnother';
            } else if(value.Id == option.data.Id && key == 0){
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
          // this.$Utils.showLoading('stop');
          this.getAllLevel(option.afterParent.Level, option.data);
          // this.inputData.push()
          var taskRequest = this.$Lodash.cloneDeep(this.$singleRequest);
          taskRequest.R1_RequestTemplate = "AG_Task_Task.Search";
          taskRequest.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
          taskRequest.R1_RequestFields = "Id;Index;ProjectCategories;ProjectCategoriesName;Code;ProjectCategoriesLevel1;ProjectCategoriesLevel2;ProjectCategoriesLevel3;ProjectCategoriesLevel4;TargetsLevel1;TargetsLevel2;TargetsLevel3;TargetsLevel4;ProjectCategoriesLevel5;ProjectCategoriesLevel6;ProjectCategoriesLevel7;ProjectCategoriesLevel8;ProjectCategoriesLevel9;ProjectCategoriesLevel10;ProjectCategoriesLevel11;ProjectCategoriesLevel12"
          taskRequest.R1_Keyword = option.data.Id;
          this.$Utils.post(taskRequest).then((task) => {
            task = this.$Utils.getDataWithRoot(task.R1, 'Data.TasksDS.Task');
            this.ListTask = this.$Lodash.cloneDeep(task);
            // var request = this.$Lodash.cloneDeep(this.$singleRequest);
            // request.R1_RequestTemplate = 'SettingNew.SearchSetting';
            // request.R1_Value = this.data.Id;
            // request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
            // this.$Utils.postCheckResult(request).then((sdata) => {
            //   this.$Utils.showLoading('stop');
            //   sdata = this.$Utils.getDataWithRoot(sdata.R1, 'Data.DynamicDS.Setting');
              // this.ListCat = this.$Lodash.cloneDeep(sdata);
              this.inputData = [];
              this.checkParent(option.afterParent, option.data);
            // })
          })
        });
      },
      editCategory (item) {
        var dataToPass = {
          model: item,
          function: {
            getSetting: this.getSetting,
          }
        }
        this.$hub.$emit(
          "set-child-modal-data",
          "Sửa nghiệp vụ",
          "40%",
          true,
          "center",
          EditProjectCategory,
          false,
          '',
          dataToPass
        );
       //  this.$hub.$emit(
       //   "set-modal-data",
       //   "Sửa nghiệp vụ",
       //   "40%",
       //   true,
       //   "center",
       //   EditProjectCategory,
       //   false,
       //   '',
       //   item
       // );
       // this.$hub.$emit("open-modal");
      },
      deleteSetting(data) {
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
        };
      },
      checkExits() {
         if(!this.model.Name || this.model.Name == null || this.model.Name.trim() == ''){
          this.$Utils.showMessage('error', 'Tên nghiệp vụ cần phải có');
          return;
        }
        if(this.model.Parent && this.model.Parent != '')
          this.objParent = (this.ListData.filter((el) => {
            return el.Id == this.model.Parent;
          }))[0];
        // else {
        //   this.objParent = this.PageKey;
        // }
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchSetting';
        request.R1_Value = this.data.Id;
        request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
        this.$Utils.post(request).then((data) => {
          var listExitsCate = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          listExitsCate = listExitsCate.filter((el) => {
            return el.Name.toLowerCase() === this.model.Name.toLowerCase();
          });
          if (listExitsCate.length > 0) {
             this.$Utils.showMessage('error', 'Tên nghiệp vụ đã có');
             return;
          } else {
            this.insertSetting();
          }

        });
      },
      insertSetting(data) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.Insert";
        request.R1_Name = this.model.Name;
        request.R1_Value = this.data.Id;
        request.R1_ValueName = this.data.Name;
        request.R1_ReferenceId = this.$Utils.isEmpty(this.objParent) ? this.objParent.Id : this.ParentId;
        request.R1_NestedSetType = 'InsertLastChildNode';
        this.$Utils.postCheckResult(request).then((dData) => {
          this.$Utils.linkToRoleEveryone([{
            Id: dData.R1.Data,
            Caption: this.model.Name
          }])
          if (this.$Utils.isEmpty(this.objParent, 'Level'))
            this.onSave(this.objParent.Level);
          else
            this.onSave(5);
          // if (this.$Utils.isEmpty(data)) {
          //   var pass = {};
          //   pass.Id = dData.R1.Data;
          //   pass.Name = this.$Lodash.cloneDeep(this.Name)
          //   pass.Value = this.objParent.Id;
          //   pass.ValueName = this.objParent.Name;
          //   this.showSetting(pass)
          // }
          this.model.Name = null;
          this.model.Parent = null;
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
              for (var i = 1; i <= 7; i++) {
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
            Name: "ProjectCategoriesLevel" + level,
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
          if(this.$Utils.isEmpty(module.Description, 'Buttons')){
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
                module.Fields.push({ Name: field.DynamicText, FieldStorageType: 'Dynamic' });
            });
          } else {
            dataGroup.Description.Fields.forEach((field) => {
              this.$Utils.deleteAutoValue(field);
              if (field.ListIsHidden == 'true')
                module.Fields.push(field);
              if (field.DynamicText != undefined && field.DynamicText != null)
                module.Fields.push({ Name: field.DynamicText, FieldStorageType: 'Dynamic' });
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
          request = this.$Utils.updateParamsSingleRequest(request, { RequestTemplate: 'SettingNew.Update' }, request.TotalRequests);
        })
        this.$Utils.post(request).then((data) => {
          this.updateDatagroup();
        });
      },
      getAllLevel(parent, data) {
        // if (this.$Utils.isEmpty(next, 'nextItem') && next.nextItem.level > ori) {
        //   if (next.nextItem.level > maxLevel) {
        //     maxLevel = next.nextItem.level;
        //     level = level + 1;
        //   }
        //   getAllLevel(next.nextItem, ori, maxLevel, level, dropPosition, parent)
        // } else if (level > 1) {
        //   for (var i = 0; i <= level; i++) {
        //     var status = false;
        //     if (i < level - 1)
        //       status = true;
        //     if (dropPosition == 'inside')
        //       this.onSave(parent + i + 6, status);
        //     else {
        //       this.onSave(parent + i + 5, status);
        //     }
        //   }
        // } else {
        //   if (dropPosition == 'inside')
        //     this.onSave(parent + 6);
        //   else {
        //     this.onSave(parent + 5);
        //   }
        // }
        this.onSave(eval(parent) + 1);
        if(this.$Utils.isEmpty(data.children)){
          this.getAllLevel(eval(parent) + 1, data.children)
        }

      },
      checkParent(selectedItem) {
        if(this.$Utils.isEmpty(selectedItem, '$parent')){
          var parent = this.$Lodash.cloneDeep(selectedItem.$parent);
          delete selectedItem.$parent
          this.inputData.unshift(parent)
          this.checkParent(selectedItem.$parent)
        } else {
          // this.inputData.unshift(value)
          var taskRequest = this.$Lodash.cloneDeep(this.$singleRequest);
          taskRequest.TotalRequests = 0;
          $.each(this.ListTask, (index, task) => {
            if (this.$Utils.isEmpty(task, 'ProjectCategoriesName') && task.ProjectCategories != "") {
              var flag = false;
              var newCategory = this.$Lodash.cloneDeep(this.inputData);
              var catName = this.$Utils.isEmpty(task, 'ProjectCategoriesName') ? task.ProjectCategoriesName.split(';') : [];
              $.each(task.ProjectCategories.split(';'), (key, category) => {
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
                $.each(newCategory, function(val, key) {
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

        // $.each($scope.viewModel.treeSettings.getItems(), function(item) {
        //   $.each(this.ListCat, function(value) {
        //     if (selectedItem.value == value.Id && item.value == value.ParentId) {
        //       this.inputData.unshift(value)
        //       checkParent(item)
        //     }
        //     if (selectedItem.value == value.Id && selectedItem.level == "0" && (this.$Utils.isEmpty(this.inputData, '0') && this.inputData[0].Id != value.Id || !this.$Utils.isEmpty(this.inputData, '0'))) {
        //       this.inputData.unshift(value)
        //       var taskRequest = this.$Lodash.cloneDeep(this.$singleRequest);
        //       taskRequest.TotalRequests = 0;
        //       $.each($scope.ListTask, function(task, index) {
        //         if (this.$Utils.isEmpty(task, 'ProjectCategoriesName') && task.Categories != "") {
        //           var flag = false;
        //           var newCategory = this.$Lodash.cloneDeep(this.inputData);
        //           var catName = this.$Utils.isEmpty(task, 'ProjectCategoriesName') ? task.CategoriesName.split(';') : [];
        //           $.each(task.Categories.split(';'), function(category, key) {
        //             if (category != "") {
        //               if (flag == true) {
        //                 var cat = {};
        //                 cat.Id = category;
        //                 cat.Name = catName[key];
        //                 newCategory.push(cat)
        //               }
        //               if (category == this.inputData[this.inputData.length - 1].Id) {
        //                 flag = true;
        //               }
        //             }
        //           })
        //           if (flag == true) {
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestTemplate'] = "AG_Task_Task.Update";
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestDataGroup'] = "DataGroup.danh-sach-cong-viec.04b66";
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestFields'] = "Id;Index;ProjectCategories;Code;"
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategories'] = "";
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesName'] = "";
        //             taskRequest['R' + [taskRequest.TotalRequests + 1] + '_Id'] = task.Id;
        //             $.each(newCategory, function(val, key) {
        //               taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategories'] += val.Id + ";";
        //               taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesName'] += val.Name + ";";
        //               taskRequest['R' + [taskRequest.TotalRequests + 1] + '_ProjectCategoriesLevel' + [key + 1]] = val.Id;
        //               taskRequest['R' + [taskRequest.TotalRequests + 1] + '_RequestFields'] += 'ProjectCategoriesLevel' + [key + 1] + ';';
        //             })
        //             taskRequest.TotalRequests++;
        //           }
        //         }
        //       })
        //       this.$Utils.post(taskRequest).then(function(xtask) {})
        //     }
        //   })
        // });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .project-categories{
    .card{
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
