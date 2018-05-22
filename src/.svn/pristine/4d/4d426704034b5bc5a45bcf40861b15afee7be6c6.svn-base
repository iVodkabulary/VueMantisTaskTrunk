<template>
  <div>
    <el-form label-position="top" :model="model" :rules="rules" ref="ruleForm">
      <el-row>
        <el-col :span="6">
            <el-form-item label="">
                <label>Hiển thị bảng thống kê</label>
                <el-switch v-model="model.Enable"></el-switch>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="Module">
                <!-- <label>Email gửi</label> -->
                <el-select clearable v-model="model.Module" placeholder="Module">
                    <el-option v-for="item in viewModel.ListModules" :key="item.ModuleCode" :label="item.Caption" :value="item.ModuleCode">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="Khối dữ liệu" v-if="model.ParentChild">              
                <el-cascader expand-trigger="hover" :options="DataGroupTree" placeholder="Khối dữ liệu" v-model="selectedDataGroups" @change="handleChange(selectedDataGroups)"></el-cascader>
            </el-form-item>
            <!-- <span v-else></span> -->
        </el-col>
        <el-col :span="6">
            <el-form-item label="Loại">
                <!-- <label>Email gửi</label> -->
                <el-select clearable v-model="model.Type" placeholder="Loại">
                    <el-option value="loadDataBase">loadDataBase</el-option>
                    <el-option value="includeUrlData">includeUrlData</el-option>
                </el-select>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
            <el-form-item label="ParentChild">
                <!-- <label>ParentChild</label> -->
                <el-switch v-model="model.ParentChild"></el-switch>
            </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item label="Phân quyền">
                <!-- <label>Email gửi</label> -->
                <!-- <label>Phân quyền</label> -->
                <el-switch v-model="model.AssignedUser"></el-switch>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="Điều kiện">
                <!-- <label>Email gửi</label> -->
                <el-input v-model="model.Condition"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="Điều kiện khác">
                <!-- <label>Email gửi</label> -->
                <el-input v-model="model.OtherCondition"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
          <el-button @click="save">Lưu</el-button>
          <el-button @click="cancel">Đóng</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "page-advance-group-info",
    props: ['data'],
    data() {
      var dat = {
        DataGroupTree: [],
        selectedDataGroups: [],
        ruleForm: {},
        rules: {

        },
        model: {
          // Caption: '',
          // UserPermissions: [],
          // listUsers: [],
          // MenuIcon: '',
          // Flex: '',
          // GroupDisplayType: 'Default',
          // FlexSM: 50,
          // FlexXS: 100
        },
        viewModel: {
          ListModules: [],
          // UserPermissions: this.data.scope.viewModel.UserPermissions,
          // GroupPermissions: this.data.scope.viewModel.GroupPermissions,
          // RolePermissions: this.data.scope.viewModel.RolePermissions,
          // listUsers: this.data.scope.viewModel.listUsers,
        },
        centerDialogVisible: true,
        treeLst: this.data.scope.model.ObjectFields,
        dataToPass: this.data,
      };
      return dat;
    },
    methods: {
      save() {
        if (this.data.action == 'edit') {
          this.treeLst.splice(this.data.index, 1);
          this.treeLst.splice(this.data.index, 0, this.model);
          this.clearModel();
        }else{
          this.treeLst.push(this.model);
          this.clearModel();
        }
      },
      cancel() {
        this.$hub.$emit('close-modal')
      },
      clearModel() {
        this.$hub.$emit('close-modal')
      },
      bindEditor() {
        var ctrl = this;
        var dataToPass = ctrl.data;
        var isInsert = false;
        if (dataToPass.scope.model.Description.AutoLoad == undefined)
          isInsert = true;
        else {
          if (dataToPass.scope.model.Description.AutoLoad.indexOf != undefined)
            if (dataToPass.scope.model.Description.AutoLoad.indexOf('Type') != -1)
              isInsert = true;
        }

        if (isInsert)
          dataToPass.scope.model.Description.AutoLoad = {
            Enable: true,
            ParentChild: true,
            Condition: 'Id;RequestDataGroup;Code;'
          };
        ctrl.model = ctrl.$Lodash.cloneDeep(dataToPass.scope.model.Description.AutoLoad);
        ctrl.bindListDataGroups();
      },
      bindListDataGroups() {
        var ctrl = this;
        var dataToPass = ctrl.data;
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Project.DataGroup';
        ctrl.$Utils.post(request).then(function(data) {
          ctrl.viewModel.ListDataGroups = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          ctrl.DataGroupTree = ctrl.$Utils.createCustomTreeFromList(
            ctrl.$Lodash.cloneDeep(ctrl.viewModel.ListDataGroups),
            "Id",
            "ParentId",
            "children",
            { "Caption" : "label", Id : "value" },
            {}
          );
          if(ctrl.model.DataGroup){
            ctrl.viewModel.ListDataGroups.forEach(item => {
              if (item.Description != undefined)
                item.Description = JSON.parse(item.Description);
              if(item.Code === ctrl.model.DataGroup){
                ctrl.selectedDataGroups = [item.ParentId, item.Id];
                ctrl.handleChange(ctrl.selectedDataGroups);
              }
            })
          }
        });
      },
      handleChange(value) {
        var dataGroup = this.viewModel.ListDataGroups.filter((el) => {
          return el.Id == value[value.length - 1];
        })[0];
        this.model.DataGroup = dataGroup.Code
        if(typeof dataGroup.Description === 'string')
          dataGroup.Description = JSON.parse(dataGroup.Description);
        this.model.AdditionConditions = dataGroup.Description.AdditionConditions.substring(1);
        this.model.DataSource = dataGroup.Description.DataSource;
      },
      save() {
        var ctrl = this;
        var dataToPass = ctrl.data;
        var savedData = ctrl.$Lodash.cloneDeep(ctrl.model);

        if (!savedData.Enable)
          delete dataToPass.scope.model.Description.AutoLoad;
        else
          dataToPass.scope.model.Description.AutoLoad = savedData;
        ctrl.cancel();
      }
    },
    created() {
      var ctrl = this;
      //.log(ctrl.data)
      ctrl.data.scope.model.Value.forEach(function(module) {
        if (module.ModuleType != 'Filter')
          ctrl.viewModel.ListModules.push(module);
      })
      ctrl.bindEditor();
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
</style>
