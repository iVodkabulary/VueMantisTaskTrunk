<template>
 <div>
 <el-form :inline="!$isMobileDevice" :rules="rules" label-width="130px" ref="validateForm" :model="formInline">
   <el-form-item label="Tên danh mục" prop="Name">
     <el-input v-model="formInline.Name" placeholder="Tên danh mục"/>
   </el-form-item>
   <el-form-item label="Danh mục cha">
     <el-cascader :options="categories" placeholder="Chọn" change-on-select clearable v-model="formInline.Parent"
                  @change="handleChange"/>
   </el-form-item>
   <el-form-item>
     <el-button type="primary" @click="onSubmit('validateForm')">Lưu</el-button>
   </el-form-item>
 </el-form>
 <DocumentCategoryTree :datasource="treeData"/>
</div>
</template>
<script>
import DocumentCategoryTree from "@/components/dynamic/DocumentCategoryTree";
import CreateDocumentCategoryForm from "@/components/static/CreateDocumentCategoryForm";
import utilsLibrary from "@/services/utils";

export default {
  components: { DocumentCategoryTree, CreateDocumentCategoryForm },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === undefined || value.trim() === "") {
        callback(new Error("Tên cần phải có"));
      } else {
        callback();
      }
    };

    return {
      rootId: '',
      level: 0,
      categories: [],
      treeData: {
        Name: "Danh mục nghiệp vụ",
        children: [],
        level: "0",
        Level: "5",
        collapseIcon: "fa fa-cog",
        expandIcon: "fa fa-cog"
      },
      formInline: {
        Name: "",
        ParentId: undefined,
        Parent: []
      },
      rules: {
        Name: [{ validator: validateName, trigger: "blur" }]
      },
    };
  },

  methods: {
    handleChange(value) {
      this.formInline.ParentId = value[value.length - 1];
    },
    checkExits() {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "Setting.SearchBase";
      request.R1_ParentId = utilsLibrary.isEmpty(this.formInline.ParentId)
        ? this.formInline.ParentId
        : this.rootId;
      request.R1_Level = parseInt(this.level) + 1 + this.formInline.Parent.length;
      utilsLibrary.post(request).then(data => {
        var listExitsTags = utilsLibrary.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        //console.log(listExitsTags);
        listExitsTags = listExitsTags.filter(el => {
          return (
            el.Name.trim().toLowerCase() ===
            this.formInline.Name.trim().toLowerCase()
          );
        });
        if (listExitsTags.length > 0) {
          utilsLibrary.showMessage("error", "Tên đã tồn tại");
          return false;
        } else {
          //return true;
          this.save();
        }
      });
    },
    save() {
      var ctrl = this.formInline;
      if(!utilsLibrary.isEmpty(ctrl.ParentId)){
        ctrl.ParentId = this.$Lodash.cloneDeep(this.rootId);
      }
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "Setting.Insert";
      request.R1_Name = ctrl.Name;
      request.R1_ReferenceId = ctrl.ParentId;
      request.R1_NestedSetType = "InsertLastChildNode";
      utilsLibrary.postCheckResult(request).then(dData => {
        utilsLibrary.linkToRoleEveryone([
          {
            Id: dData.R1.Data,
            Caption: ctrl.Name
          }
        ]);
        this.formInline.Name = '';
        this.formInline.Parent = [];
        this.formInline.ParentId = undefined;
        this.$hub.$emit("update-document-category-tree", ctrl);
        this.init();
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkExits();
        } else {
          return false;
        }
      });
    },
    init() {
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_ParentCode: "xSetting.Project.Parameter.Category",
        R1_IncludedNestedSetParent: true
      };
      this.$Utils.post(request).then(data => {
        var category = [];
        category = this.$Utils.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        var parent = category.shift();
        this.rootId = parent.Id ;
        this.level = parent.Level;
        this.categories = this.$Utils.createCustomTreeFromList(
          this.$Lodash.cloneDeep(category),
          "Id",
          "ParentId",
          "children",
          { Name: "label", Id: "value" },
          {}
        );
      });
    }
  },
  mounted() {
    this.init();
    this.$hub.$on("update-document-category-selecttree", () => {
      this.init();
    });
  }
};
</script>
