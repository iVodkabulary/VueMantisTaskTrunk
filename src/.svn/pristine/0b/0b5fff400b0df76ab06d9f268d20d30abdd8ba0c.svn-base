<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="Loại">
        <el-select v-model="model.NotificationType" placeholder="Chọn" clearable>
          <el-option
            v-for="item in viewModel.NotificationType"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Quyền">
        <el-select v-model="model.Permissions" placeholder="Chọn" clearable>
          <el-option
            v-for="item in viewModel.Permissions"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mẫu gửi">
        <el-select v-model="model.Template" placeholder="Chọn" clearable>
          <el-option
            v-for="item in viewModel.Template"
            :key="item.Code"
            :label="item.Caption"
            :value="item.Code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Trường bổ sung">
        <el-input v-model="model.NotifyFields" clearable/>
      </el-form-item>
      <el-form-item label="Thêm">
        <el-input v-model="model.AdditionField" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="save()" type="primary">Lưu</el-button>
        <el-button @click="closeForm">Đóng</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    components: {},
    name: "list-notification-info-dialog",
    props: ["data"],
    data() {
      return {
        action: '',
        communication: {},
        model: {},
        viewModel: {NotificationType: {}, Permissions: {}, Template: {}},
        communication: { action: '', item: {}, index: '', scope: this },
        arrCombo : [
          { Code: 'xSetting.Default.Project.Form.NotificationType', Field: 'NotificationType' },
          { Code: 'xSetting.Template.Permissions', Field: 'Permissions' },
          { Code: 'xSetting.Project.Notification', Field: 'Template' }
        ],
      };
    },
    methods: {
      save(){
        this.communication = {
          action: this.action,
          item: this.model,
          index: this.data.index
        };
        this.data.scope.bindSubElement(this.data.scope.model.Description.Notifications, this.$Lodash.cloneDeep(this.communication));
        this.$hub.$emit('close-modal')
      },
      closeForm(){
        this.$hub.$emit('close-modal')
      },
      bindComboModel(code, field) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = code;
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel[field] = data;
        })
      }
    },
    destroyed() {
    },
    mounted() {

    },
    created(){
      if(this.data.action === 'edit'){
        this.action = 'edit';
        this.model = this.$Lodash.cloneDeep(this.data.item.row);
        $.each(this.model, (key, value) => {
          if (value === 'true')
            this.model[key] = true;
          else if (value === 'false')
            this.model[key] = false;
        });
      }else {
        this.model = { NodeType: 'Notifications', Status: true };
      }
      for (var i = 0; i < this.arrCombo.length; i++) {
        this.bindComboModel(this.arrCombo[i].Code, this.arrCombo[i].Field);
      }
    },
    watch: {

    }
  };
</script>
