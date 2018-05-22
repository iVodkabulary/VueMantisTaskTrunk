
<template>
  <el-form :inline="!$isMobileDevice" :rules="rules" label-width="130px" ref="validateForm" :model="formInline">
  <el-form-item label="Tên danh mục" prop="Name">
    <el-input v-model="formInline.Name" placeholder="Tên danh mục" ></el-input>
  </el-form-item>
   <el-form-item label="Danh mục cha">
     <el-cascader :options="groupcategories" placeholder="Chọn" change-on-select clearable v-model="formInline.Parent" @change="handleChange"></el-cascader>
  </el-form-item>
  <el-form-item>
    <el-button type="primary"  @click="onSubmit('validateForm')">Lưu</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import utilsLibrary from "@/services/utils";
export default {
  props: ["groupcategories", "rootId", "Level", "callback", "grcategories"],
  data() {
    var validateName = (rule, value, callback) => {
      if (value === undefined || value.trim() === "") {
        callback(new Error("Tên cần phải có"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        Name: "",
        ParentId: undefined,
        Parent: []
      },
      rules: {
        Name: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  components: {},
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
      request.R1_Level =
        parseInt(this.Level) + 1 + this.formInline.Parent.length;
      utilsLibrary.post(request).then(data => {
        var listExitsTags = utilsLibrary.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        //console.log(listExitsTags);
        listExitsTags = listExitsTags.filter(el => {
          return (
            el.Name.trim().toLowerCase() ==
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
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "Setting.Insert";
      request.R1_Name = ctrl.Name;
      request.R1_ReferenceId = utilsLibrary.isEmpty(ctrl.ParentId)
        ? ctrl.ParentId
        : this.rootId;
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
        this.$hub.$emit("update-document-category-tree");
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
    }
  }
};
</script>
