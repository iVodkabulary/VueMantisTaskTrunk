<template>
  <el-form :model="model" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="Nguồn" prop="Source">
      <el-input v-model="model.Source"/>
    </el-form-item>
    <el-form-item label="Đích" prop="Target">
      <el-input v-model="model.Target"/>
    </el-form-item>
    <el-form-item label="Loại" prop="DependencyType">
      <el-select v-model="model.DependencyType" @change="handleChange">
        <el-option v-for="item in viewModel.ListDependencyTypes"
                   :key="item.Name"
                   :label="item.Code"
                   :value="item.Name">
        </el-option>
      </el-select>
    </el-form-item>
    <div v-show="model.DependencyType==='DynamicValue'">
      <el-form-item label="Trường nguồn" prop="SourceKey">
        <el-input v-model="model.SourceKey"/>
      </el-form-item>
      <el-form-item label="Trường đích" prop="TargetKey">
        <el-input v-model="model.TargetKey"/>
      </el-form-item>
      <el-form-item label="Biểu thức" prop="Expression">
        <el-input v-model="model.Expression"/>
      </el-form-item>
    </div>
    <div v-show="model.DependencyType==='Validate'">
      <el-form-item label="Dùng chung Validate">
        <el-checkbox v-model="model.SameValidate">
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Loại validate">
        <el-input v-model="model.Validations"/>
      </el-form-item>
    </div>
    <div v-show="model.DependencyType==='TimeSync'">
      <el-form-item label="Cộng giờ">
        <el-input type="number" v-model="model.Expression" />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button type="primary" @click="save">Lưu</el-button>
      <el-button @click="cancel">Đóng</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      model: {  },
      rules: {
        Caption: [
          {
            required: true,
            message: "Hãy nhập tên khối dữ liệu",
            trigger: "blur"
          }
          //{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ]
      },
      viewModel: {}
    };
  },
  created() {
    //console.log(this.data);
    this.model = this.data.scope.model;
    this.viewModel = this.data.scope.viewModel;
  },
  mounted() {
    this.init();
  },
  watch: {
    data: function(newModel) {
      //console.log("dependency-dialog", newModel);
      this.model = newModel.scope.model;
      this.viewModel = newModel.scope.viewModel;
    }
  },
  methods: {
    handleChange(value) {},
    save() {
      var ctrl = this;
      //console.log(ctrl.model);
      ctrl.communication = {
        action: this.data.action,
        item: ctrl.model,
        index: this.data.index,
        Type: "Dependencies"
      };
      this.data.scope.bindSubDirectives(this.$Lodash.cloneDeep(ctrl.communication));
      this.cancel();
    },

    cancel() {
      //$mdDialog.hide();
      this.$hub.$emit("close-modal");
    },

    init() {
      var ctrl = this;
      if (this.data.action === "edit") {
        ctrl.model = this.$Lodash.cloneDeep(this.data.item);
        $.each(ctrl.model, (key, value) => {
          if (value == "true") ctrl.model[key] = true;
          else if (value == "false") ctrl.model[key] = false;
        });
      } else ctrl.model = { DependencyType: "DynamicValue" };
      ctrl.viewModel = { ListDependencyTypes: this.viewModel.DependencyType };
    }
  }
};
</script>
