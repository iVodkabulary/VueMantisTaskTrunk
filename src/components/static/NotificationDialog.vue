<template>
  <div>
    <el-form label-width="15%">
      <el-form-item label="Loại">
        <el-select v-model="model.NotificationType" clearable placeholder="" style="width: 100%">
          <el-option v-for="item in viewModel.NotificationType" :key="item.Code" :label="item.Name"
                     :value="item.Code"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Quyền">
        <el-select v-model="model.Permissions" clearable placeholder="" style="width: 100%">
          <el-option v-for="item in viewModel.Permissions" :key="item.Code" :label="item.Name"
                     :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mẫu gửi">
        <el-select v-model="model.Template" clearable placeholder="" style="width: 100%">
          <el-option v-for="item in viewModel.Template" :key="item.Code" :label="item.Caption"
                     :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Trường bổ sung">
        <el-input v-model="model.NotifyFields" clearable placeholder="" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="Thêm">
        <el-input v-model="model.AdditionField" clearable placeholder="" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="Thêm">
        <el-button type="primary" @click="save">Lưu</el-button>
        <el-button  @click="cancel">Đóng</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "notification-dialog",
    props: ['data'],
    data() {
      var dat = {
        model: {
          NotificationType: '',
          Permissions: '',
          Template: '',
          NotifyFields: '',
          AdditionField: '',
        },
        viewModel: {
          NotificationType: [],
          Permissions: [],
          Template: [],
        },
        dataToPass: this.data,
        reqCount: 0,
        arrCombo: [],
      }
      return dat;
    },
    methods: {
      bindComboModel(arrCombo) {
        var ctrl = this;
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: arrCombo.length,
        }
        arrCombo.forEach(function (val, i) {
          request['R' + (i + 1) + '_RequestTemplate'] = 'SettingNew.SearchSetting';
          request['R' + (i + 1) + '_ParentCode'] = val.Code;
        });
        ctrl.$Utils.post(request).then(function (data) {
          arrCombo.forEach(function (val, j) {
            ctrl.viewModel[val.Field] = ctrl.$Utils.getDataWithRoot(data['R' + (j + 1)], 'Data.DynamicDS.Setting');
            ctrl.reqCount++;
          });

        })
      },
      save() {
        var ctrl = this;
        if (ctrl.$Utils.isEmpty(ctrl.model.NotificationType)) {
          if(ctrl.dataToPass.action == 'edit')
            ctrl.dataToPass.Notifications.splice(ctrl.dataToPass.index, 1)
          ctrl.dataToPass.Notifications.splice(ctrl.dataToPass.index,0,ctrl.model);
          ctrl.cancel();
        }

      },
      cancel() {
        this.$hub.$emit('close-modal');
      }
    },
    watch: {
      reqCount: function (newVal) {
        if (newVal == this.arrCombo.length) {
          this.viewModel = Object.assign({}, this.viewModel)
        }
      }
    },
    created() {
      var ctrl = this;
      if (ctrl.dataToPass.action == 'edit') {
        ctrl.model = ctrl.$Lodash.cloneDeep(ctrl.dataToPass.item);
        $.each(ctrl.model, function (key, value) {
          if (value == 'true')
            ctrl.model[key] = true;
          else if (value == 'false')
            ctrl.model[key] = false;
        });
      } else {
        ctrl.model = {NodeType: 'Notifications', Status: true};
      }
      ctrl.viewModel = {};

      ctrl.arrCombo = [
        {Code: 'xSetting.Default.Project.Form.NotificationType', Field: 'NotificationType'},
        {Code: 'xSetting.Template.Permissions', Field: 'Permissions'},
        {Code: 'xSetting.Project.Notification', Field: 'Template'}
      ];
      ctrl.bindComboModel(ctrl.arrCombo);
    }
  }
</script>

<style scoped>

</style>
