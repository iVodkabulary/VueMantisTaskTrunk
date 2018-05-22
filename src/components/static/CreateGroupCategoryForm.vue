
<template>
  <el-form :inline="!parent" label-width="130px"  :model="formInline">
  <el-form-item label="Tên nghiệp vụ" required>
    <el-input v-model="formInline.Name" placeholder="Tên nghiệp vụ"></el-input>
  </el-form-item>
   <el-form-item label="Nghiệp vụ cha">
     <el-select v-if="parent" v-model="ParentCategory" :disabled="formInline.isDisable" placeholder="Chọn">
       <el-option :label="parent.Name" :value="parent.Id">
       </el-option>
     </el-select>

     <el-cascader v-else :options="groupcategories" placeholder="Chọn" change-on-select clearable v-model="formInline.ParentCategory" @change="setParent(formInline.ParentCategory)"></el-cascader>
  </el-form-item>
  <el-form-item label="Thuộc phòng ban">
    <el-select v-model="Value" multiple clearable :disabled="formInline.isDisable" placeholder="Chọn">
      <el-option v-for="item in groups" :key="item.GroupId" :label="item.GroupName" :value="item.GroupId">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">Lưu</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import SelectCheck from "@/components/dynamic/SelectCheck";
import SelectTree from "@/components/dynamic/SelectTree";
export default {
  props: ["groupcategories", "rootId", "callback", "grcategories", "parent"],
  data() {
    return {
      ParentCategory:this.parent?this.parent.Id:'',
      formInline: {
        Name: "",
        Group: [],
        ParentCategory: this.parent?[this.parent.Id]:[],
        isDisable: false
      },
      grcate: [],
      groups: [],
      SelectedCategory: [],
      SelectedGroup: [],
      rotateGroups: [],
      SettingFilter: {},
      viewModel: {},
      Value: [],
    };
  },
  components: {
    SelectCheck,
    SelectTree
  },
  methods: {
    setParent(id) {
      //console.log(id)
      // console.log(this.grcategories)
      var data = {};
      $.each(this.groupcategories, (key, ele) => {
        if (id[0] === ele.Id) {
          data.Value = ele.Value;
          return;
        }
      });
      // console.log(data)
      var ctrl = this;
      /*var arrTemp = data.*/
      ctrl.Value = [];
      ctrl.formInline.Group = ctrl.Value;
      this.formInline.isDisable = false;
      if (data) {
        $.each(ctrl.groups, (key, value) => {
          if (data.Value) {
            $.each(data.Value.split(";"), (k, v) => {
              if (data && value.GroupId == v) {
                ctrl.Value.push(value.GroupId);
              }
            });
            this.formInline.isDisable = true;
          }
        });
        if (ctrl.Value.length > 0) {
          ctrl.formInline.Group = ctrl.Value;
        }
      }
    },
    loadGroups() {
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "OrgnizationList",
        R1_GroupType: 1
      };

      this.$Utils.post(request).then(response => {
        if (response.success) {
          this.groups = this.$Utils.getDataWithRoot(response.R1, 'Data.UserDS.Group') //response.R1.Data.UserDS.Group;
          this.rotateGroups = this.$Utils.rotateDementionArr(
            this.groups,
            "GroupId"
          );
        }
      });
    },
    loadCategories() {
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_ParentCode: "xSetting.Project.Parameter.Organization.Category",
        R1_GroupType: 1
      };
      this.$Utils.post(request).then(response => {
        if (response.data.success) {
        }
      });
    },
    childUpdate(value) {
      this.Group = value;
    },
    childTreeUpdate(value) {},
    onSubmit() {
      this.checkExits();
      // console.log("submit!");
      // this.formInline.Group = SelectCheck.value;
      // this.$hub.$emit("update-category-callback", SelectCheck);
    },
    checkExits(isUpdateAfter) {
      var ctrl = this;
      if (this.formInline.Name == "") {
        this.$message.error("Tên Nghiệp vụ không được để trống");
      } else {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchSetting";
        request.R1_ParentCode =
          "xSetting.Project.Parameter.Organization.Category";
        request.R1_Name = ctrl.formInline.Name;
        request.R1_ReferenceId = ctrl.$Utils.isEmpty(
          ctrl.formInline.ParentCategory
        )
          ? ctrl.formInline.ParentCategory[
              ctrl.formInline.ParentCategory.length - 1
            ]
          : ctrl.rootId;
        request.R1_NestedSetType = "InsertLastChildNode";
        request.R1_IncludedNestedSetParent = true;
        ctrl.$Utils.post(request).then(data => {
          var listExitsCate = ctrl.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          listExitsCate = listExitsCate.filter(el => {
            return el.Name == ctrl.Name;
          });
          if (listExitsCate.length > 0) {
            ctrl.$message.error("Danh mục phòng ban đã tồn tại.");
          } else {
            ctrl.insertSetting(isUpdateAfter);
          }
        });
      }
    },
    insertSetting(data) {
      var ctrl = this;
      var GroupId = "";
      var GroupName = "";
      if (this.formInline.Name == "") {
        this.$Utils.showMessage("error", "Tên Nghiệp vụ không được để trống");
      } else {
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = "Setting.Insert";
        request.R1_Name = ctrl.formInline.Name;
        request.R1_Value = ctrl.Value.join(";");
        //console.log('ctrl.Value==>> ',ctrl.Value);
        /*request.R1_ValueName = GroupName;*/
        request.R1_ReferenceId =
          ctrl.formInline.ParentCategory.length > 0
            ? ctrl.formInline.ParentCategory[
                ctrl.formInline.ParentCategory.length - 1
              ]
            : ctrl.rootId;
        request.R1_NestedSetType = "InsertLastChildNode";
        ctrl.$Utils.postCheckResult(request).then(dData => {
          ctrl.$Utils.linkToRoleEveryone([
            {
              Id: dData.R1.Data,
              Caption: ctrl.formInline.Name
            }
          ]);
          if (
            ctrl.$Utils.isEmpty(
              ctrl.rotateGroups[request.R1_ReferenceId],
              "Level"
            )
          )
          ctrl.onSave(ctrl.rotateGroups[request.R1_ReferenceId].Level);
          else ctrl.onSave(5);
          if (ctrl.$Utils.isEmpty(data)) {
            var pass = {};
            pass.Id = dData.R1.Data;
            if (ctrl.$Utils.isEmpty(ctrl.formInline.Name))
              pass.Name = ctrl.$Utils.clone(ctrl.formInline.Name);
            if (ctrl.$Utils.isEmpty(GroupId)) {
              pass.Value = GroupId;
              pass.ValueName = GroupName;
            }
            //show popup here
            // ctrl.function.showSetting(pass)
          }
          // ctrl.$refs['formInline'].resetFields();
          this.$message.success("Nghiệp vụ {0} thành công.".replace('{0}', ctrl.formInline.Name));
          ctrl.formInline.Name = "";
          ctrl.formInline.Group = [];
          ctrl.formInline.ParentCategory = [];
          this.$hub.$emit("update-category-tree");
        });
      }
    },
    onSave(level, status) {
      var ctrl = this;
      var strFields = JSON.stringify(ctrl.SettingFilter.Fields);
      level = level - 4;
      if (strFields.indexOf("CategoriesLevel" + level) == -1) {
        var obj = {
          Caption: "Danh mục phòng ban cấp " + level,
          DataSource: "xDynamicData_Setting",
          FieldColumnType: "String",
          FieldStorageType: "Struct",
          FilterIsUsed: "true",
          FormDisplay: "- Danh mục phòng ban cấp " + level + " -",
          FormFieldType: "Hidden",
          FormIncludeSubmit: "true",
          FormValidate: "",
          ListButtonGroups: "",
          ListIsHidden: "true",
          Name: "CategoriesLevel" + level,
          PlaceHolder: "- Danh mục phòng ban " + level + " -",
          ReportIsUsed: "true"
        };
        ctrl.SettingFilter.Fields.push(obj);
        strFields = JSON.stringify(ctrl.SettingFilter.Fields);
        var arrValue = JSON.parse(ctrl.SettingFilter.Value);
        var objValue = {
          Name: "CategoriesLevel" + level,
          ColumnType: "String",
          StorageType: "Struct"
        };
        arrValue.push(objValue);
        ctrl.SettingFilter.Value = JSON.stringify(arrValue);
        ctrl.sourceFields = ctrl.$Lodash.cloneDeep(ctrl.SettingFilter.Fields);
        delete ctrl.SettingFilter.Fields;
        var iStartIndex = 0;
        ctrl.SettingFilter.Description.FCount = 0;
        for (var i = 1; i < 7; i++) {
          if (strFields.length > iStartIndex) {
            ctrl.SettingFilter["F" + i] = strFields.substring(
              iStartIndex,
              iStartIndex + 9999
            );
            iStartIndex = 10000 * i - i;
            ctrl.SettingFilter.Description.FCount = i;
          }
        }
        ctrl.SettingFilter.Description = JSON.stringify(
          ctrl.SettingFilter.Description
        );
        if (!ctrl.$Utils.isEmpty(status) || status == false) {
          var requestData = angular.copy(singleRequest);
          ctrl.$Utils.updateParamsSingleRequest(
            requestData,
            angular.copy(ctrl.SettingFilter)
          );
          requestData.R1_RequestTemplate = "SettingNew.Update";
          //console.log(requestData);
          ctrl.$Utils.post(requestData).then(requestData => {
            ctrl.saveModules();
          });
        }
      }
    },
    saveModules() {
      var ctrl = this;
      var dataGroup = ctrl.$Lodash.cloneDeep(ctrl.SettingFilter);
      dataGroup.Description = JSON.parse(dataGroup.Description);
      dataGroup.Description.Fields = ctrl.$Lodash.cloneDeep(ctrl.sourceFields);
      var arrModules = ctrl.$Lodash.cloneDeep(ctrl.viewModel.ListModules);
      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
      request.TotalRequests = 0;
      $.each(arrModules, (k, module) => {
        request.TotalRequests++;
        module.ModuleType = module.Value;
        module.Description.DataGroupCaption = dataGroup.Caption;
        module.Description.RootData = dataGroup.Description.RootData;
        module.Description.DataSource = dataGroup.Description.DataSource;
        module.Description.AdditionConditions =
          dataGroup.Description.AdditionConditions;
        if (
          ["Form", "Filter", "List"].indexOf(module.Description.ModuleType) !=
          -1
        )
          module.Description.Link = dataGroup.Description.Link;

        if (["Form", "Filter"].indexOf(module.Description.ModuleType) != -1)
          module.Description.Dependencies = dataGroup.Description.Dependencies;
        var refFields = ctrl.$Lodash.cloneDeep(module.ObjectFields);
        var arrDefaultFields = ["Multicheck", "IndexDefault", "Tool"];
        $.each(refFields, function(k, field) {
          var isExist = false;
          for (var i = 0; i < dataGroup.Description.Fields.length; i++) {
            var dgField = dataGroup.Description.Fields[i];
            if (field.Name == dgField.Name) {
              isExist = true;
              break;
            }
          }
          if (["List"].indexOf(module.Description.ModuleType) != -1) {
            if (arrDefaultFields.indexOf(field.Name) != -1) isExist = true;
            if (field.ManualCalculator == "true") isExist = true;
          }
          if (!isExist) {
            $.each(module.ObjectFields, (index, sourceField) => {
              if (field.Name == sourceField.Name)
                module.ObjectFields.splice(index, 1);
            });
            if (module.Description.Groups != undefined) {
              $.each(module.Description.Groups, (k, group) => {
                if (group.ListFields != undefined)
                  if (group.ListFields.indexOf(field.Name) != -1)
                    group.ListFields = group.ListFields.replace(
                      field.Name + ";",
                      ""
                    );
              });
            }
          }
        });

        var refButtons = angular.copy(module.Description.Buttons);
        $.each(refButtons, (k, button) => {
          var isExist = false;
          for (var i = 0; i < dataGroup.Description.Buttons.length; i++) {
            var dgButton = dataGroup.Description.Buttons[i];
            if (dgButton.Code == button.Code) isExist = true;
          }
          if (!isExist) {
            $.each(module.Description.Buttons, (index, sourceButton) => {
              if (button.Code == sourceButton.Code)
                module.Description.Buttons.splice(index, 1);
            });
          }
        });

        $.each(module.Description.Buttons, (k, moduleButton) => {
          $.each(module.Description.Buttons, (k, dgButton) => {
            if (dgButton.Code == moduleButton.Code) moduleButton = dgButton;
          });
        });

        if (["Form", "List"].indexOf(module.Description.ModuleType) != -1) {
          for (var i = 0; i < module.Description.Buttons.length; i++) {
            $.each(dataGroup.Description.Buttons, (k, dgButton) => {
              if (module.Description.Buttons[i].Code == dgButton.Code)
                module.Description.Buttons[i] = dgButton;
            });
          }
        }

        module.Fields = angular.copy(module.ObjectFields);
        $.each(module.Fields, (k, field) => {
          $.each(dataGroup.Description.Fields, (k2, dgField) => {
            if (dgField.Name == field.Name) {
              $.each(dgField, (key, value) => {
                if (!ctrl.$Utils.isEmpty(field[key])) field[key] = value;
              });
              ctrl.$Utils.deleteAutoValue(field);
            }
          });
        });

        if (["Form", "Filter"].indexOf(module.Description.ModuleType) != -1) {
          $.each(dataGroup.Description.Fields, function(k, field) {
            ctrl.$Utils.deleteAutoValue(field);
            if (field.FormFieldType == "Hidden") module.Fields.push(field);
            if (field.DynamicText != undefined && field.DynamicText != null)
              module.Fields.push({
                Name: field.DynamicText,
                FieldStorageType: "Dynamic"
              });
          });
        } else {
          $.each(dataGroup.Description.Fields, function(field) {
            ctrl.$Utils.deleteAutoValue(field);
            if (field.ListIsHidden == "true") module.Fields.push(field);
            if (field.DynamicText != undefined && field.DynamicText != null)
              module.Fields.push({
                Name: field.DynamicText,
                FieldStorageType: "Dynamic"
              });
          });
        }

        module.ObjectFields = JSON.stringify(module.ObjectFields);
        var iStartIndex = 0;
        var iFieldCount = 0;
        for (var i = 1; i < 7; i++) {
          if (module.ObjectFields.length > iStartIndex) {
            module["OF" + i] = module.ObjectFields.substring(
              iStartIndex,
              iStartIndex + 9999
            );
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
            module["F" + i] = module.Fields.substring(
              iStartIndex,
              iStartIndex + 9999
            );
            iStartIndex = 10000 * i - i;
            iFieldCount = i;
          }
        }
        module.Description.FCount = iFieldCount;
        delete module.Fields;

        module.Description = JSON.stringify(module.Description);
        request = ctrl.$Utils.updateParamsSingleRequest(
          request,
          module,
          request.TotalRequests
        );
        request = ctrl.$Utils.updateParamsSingleRequest(
          request,
          { RequestTemplate: "SettingNew.Update" },
          request.TotalRequests
        );
      });
      ctrl.$Utils.post(request).then(function(data) {
        ctrl.updateDatagroup();
      });
    },
    updateDatagroup() {
      var ctrl = this;
      var request = ctrl.$Lodash.cloneDeep(this.$singleRequest);
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
      ctrl.$Utils.post(request).then(function(data) {
        ctrl.SettingFilter = ctrl.$Utils.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        )[0];
        if (
          ctrl.$Utils.isEmpty(ctrl.SettingFilter, "Description") &&
          typeof ctrl.SettingFilter.Description === "string"
        )
          ctrl.SettingFilter.Description = JSON.parse(
            ctrl.SettingFilter.Description
          );
        ctrl.objFields = {};
        ctrl.sortedFilter = [];
        for (var i = 1; i <= ctrl.SettingFilter.Description.FCount; i++) {
          if (i == 1) ctrl.FilterSettings = "";
          ctrl.FilterSettings += ctrl.SettingFilter["F" + i];
          if (i == ctrl.SettingFilter.Description.FCount) {
            ctrl.setFilterSetting = true;
            ctrl.FilterSetting = JSON.parse(ctrl.FilterSettings);
            ctrl.SettingFilter.Fields = ctrl.FilterSetting;
          }
        }
        ctrl.viewModel.ListModules = ctrl.$Utils.getDataWithRoot(
          data.R2,
          "Data.DynamicDS.Setting"
        );
        ctrl.viewModel.ListModules = ctrl.viewModel.ListModules.concat(
          ctrl.$Utils.getDataWithRoot(data.R3, "Data.DynamicDS.Setting")
        );
        ctrl.viewModel.ListModules = ctrl.viewModel.ListModules.concat(
          ctrl.$Utils.getDataWithRoot(data.R4, "Data.DynamicDS.Setting")
        );
        $.each(ctrl.viewModel.ListModules, function(k, item) {
          if (item.Description != undefined) {
            item.Description = JSON.parse(item.Description);
            item.ObjectFields = "";
            for (var i = 1; i <= item.Description.OFCount; i++) {
              if (item["OF" + i] != undefined)
                item.ObjectFields += item["OF" + i];
            }
            item.ObjectFields = JSON.parse(item.ObjectFields);
          }
        });
        ctrl.DatagroupSource = ctrl.$Lodash.cloneDeep(ctrl.viewModel.ListModules);
      });
    },
    loadGroupcategories() {
      //console.log(this.grcategories);
      var grcate = this.grcategories;
      $.each(grcate, (k, value) => {
        if (value.Level) {
          var childRank = value.Level;
          grcate[k].Name = "";
          while (childRank > 6) {
            grcate[k].Name += "|-- ";
            childRank--;
          }
          grcate[k].Name += value.Name;
        }
      });
      //console.log(this.grcate);
    }
  },
  created() {
    this.updateDatagroup();
    this.loadGroups();
    this.loadGroupcategories();
    if(this.parent && this.parent.Value){
      this.Value = this.parent.Value.split(';').filter(item =>{
        return item.length >0;
      });
    }
  },
  watch: {}
};
</script>
