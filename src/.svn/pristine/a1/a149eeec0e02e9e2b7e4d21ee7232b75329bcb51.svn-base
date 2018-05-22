
<template>
  <el-form :inline="true" :rules="rules" ref="validateForm" :model="model" label-width="120px">
    <el-form-item label="Tên danh mục" prop="Name">
      <el-input v-model="model.Name" placeholder="Tên danh mục"/>
    </el-form-item>
    <el-form-item label="Danh mục cha" v-if="data.addNew">
      <el-input v-model="model.ParentName" placeholder="Danh mục cha" disabled/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('validateForm')">Lưu</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import utilsLibrary from "@/services/utils";
export default {
  props: ["data"],
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "" || value.trim() === "") {
        callback(new Error("Tên cần phải có"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        Name: [{ validator: validateName, trigger: "blur" }]
      },
      model: {
        Id: this.data.Id,
        Name: this.data.Name,
        oldName: this.data.Name
      }
    };
  },
  components: {
    //SelectCheck,SelectTree
  },
  created(){
    if(this.data.addNew){
      this.model = {
        Name: '',
        ParentName: this.data.Name
      }
    }
  },
  methods: {
    checkExits() {
      var ctrl = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      if (utilsLibrary.isEmpty(ctrl.model.oldName) && ctrl.model.oldName.trim() !== ctrl.model.Name.trim()) {
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentId = this.data.ParentId;
        request.R1_Level = parseInt(this.data.Level);
        utilsLibrary.post(request).then(data => {
          var listExitsTags = utilsLibrary.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          listExitsTags = listExitsTags.filter(el => {
            return (
              el.Id !== this.data.Id &&
              el.Name.trim().toLowerCase() ===
                ctrl.model.Name.trim().toLowerCase()
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
      }
      if(this.data.addNew) {
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentId = 'a54d39ff-71be-4fe7-8130-a9fc9c447f1c';
        request.R1_Level = parseInt(this.data.Level) + 1;
        utilsLibrary.post(request).then(data => {
          var listExitsTags = utilsLibrary.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          listExitsTags = listExitsTags.filter(el => {
            return (
              el.Name.trim().toLowerCase() ===
              ctrl.model.Name.trim().toLowerCase()
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
      }
    },

    save() {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "Setting.Update";
      if (this.model.Id === undefined || this.model.Id === "") {
        request.R1_ReferenceId = this.data.level === '0' ? 'a54d39ff-71be-4fe7-8130-a9fc9c447f1c' : this.data.Id;
        request.R1_RequestTemplate = "Setting.Insert";
        request.R1_NestedSetType = "InsertLastChildNode";
        request.R1_Name = this.model.Name;
      }else{
        request = utilsLibrary.updateParamsSingleRequest(request, this.model);
      }
      utilsLibrary.post(request).then(data => {
        if (data.success) {
          utilsLibrary.showMessage(
            "success",
            this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf
          );
          if (request.R1_RequestTemplate === "Setting.Insert") {
            utilsLibrary.linkToRoleEveryone([
              {
                Id: data.R1.Data,
                Caption: this.model.Name
              }
            ]);
          }
          this.$hub.$emit("update-document-category-tree");
          this.$hub.$emit("update-document-category-selecttree");
          this.$hub.$emit("close-modal");
        } else
          utilsLibrary.showMessage("error", this.$toastMessage.updateItemFailed);
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        //console.log(valid);
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
