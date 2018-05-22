<template>
  <el-form label-width="120px">
    <el-form-item label="Tên">
      <el-input v-model="model.Caption"></el-input>
    </el-form-item>
    <el-form-item label="Gợi ý">
      <el-input v-model="model.PlaceHolder"></el-input>
    </el-form-item>
    <el-form-item label="Giao diện">
      <el-select v-model="model.DisplayType" value-key="Code">
        <el-option v-for="item in viewModel.FieldDisplayType" :label="item.Name" :value="item"
                   :key="item.Code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Kiểu phần tử">
      <el-select v-model="model.FormElementType"  value-key="Id" clearable>
        <el-option v-for="item in viewModel.FormElementType" :label="item.Name" :value="item"
                   :key="item.Id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="model.FormIsDisplay" label="Hiển thị (trường tính toán)"></el-checkbox>
      <el-checkbox v-model="model.FormIsDisabled" label="Chặn sửa"></el-checkbox>
      <el-checkbox v-model="model.IncludeTime" @click="show(Showa)" label="Bao gồm giờ"></el-checkbox>
      <el-checkbox v-show="$isSystemAdmin()" v-model="model.ClearAfter" label="Xóa sau cập nhật"></el-checkbox>
    </el-form-item>
    <el-form-item label="Định dạng">
      <el-input v-model="model.Format"></el-input>
    </el-form-item>
    <el-form-item label="Mặc định" v-show="$isSystemAdmin()" v-if="data.type">
      <el-input v-model="model[data.type + 'DefaultValue']"></el-input>
    </el-form-item>
    <el-form-item label="Kiểu nhập giờ">
      <el-select v-model="model.DateTimeType">
        <el-option value="clockinput" label="Đồng hồ"></el-option>
        <el-option value="handsinput" label="Nhập tay"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Công thức" v-show="$isSystemAdmin()">
      <el-input type="textarea" v-model="model.Expression" :rows="2"></el-input>
    </el-form-item>
    <el-form-item label="Giao diện nâng cao" v-show="$isSystemAdmin()">
      <el-input type="textarea" v-model="model.AdvancedDisplay" :rows="2"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="save()">Lưu</el-button>
      <el-button @click="close()">Đóng</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  export default {
    components: {},
    name: "field-info-dialog",
    props: ["data"],
    data() {
      var dat = {};
      dat.model = {};
      dat.viewModel = {FieldDisplayType: [], FormElementType: []};
      dat.dataToPass = this.data.item;
      if (this.data.action == 'edit') {
        dat.model = this.$Lodash.cloneDeep(this.data.item);
        $.each(dat.model, (k, v)=> {
          dat.model[k] = v==='true'?true:v==='false'?false:v;
          // this.$set(dat.model, k, v);
        })

      } else
        dat.model = {
          Caption: '',
          Expression: '',
          AdvancedDisplay: '',
          DisplayType: {},
          PlaceHolder: '',
          FormElementType: {},
          DateTimeType: '',
          FormIsDisplay: false,
          FormIsDisabled: false,
          IncludeTime: false,
          ClearAfter: false,
          Format: false,

        };
      return dat;
    },
    methods: {
      bindComboModel() {
        var ctrl = this;
        var request = ctrl.$Utils.updateParamsSingleRequest(ctrl.$Lodash.cloneDeep(ctrl.$singleRequest), {
          RequestTemplate: 'Setting.SearchBase',
          ParentCode: 'xSetting.Default.Project.DataGroup.Field.FormElementType.General'
        });
        request.TotalRequests++;
        request = ctrl.$Utils.updateParamsSingleRequest(request, {
          RequestTemplate: 'Setting.SearchBase',
          ParentCode: 'xSetting.Default.Project.Form.FieldDisplayType'
        }, request.TotalRequests);
        ctrl.$Utils.post(request).then(function (data) {
          ctrl.viewModel.FormElementType = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          ctrl.viewModel.FieldDisplayType = ctrl.$Utils.getDataWithRoot(data.R2, 'Data.DynamicDS.Setting');
          $.each(ctrl.viewModel.FieldDisplayType, function (k, item) {
            if (item.Code == ctrl.model.DisplayType) {
              ctrl.$set(ctrl.model, 'DisplayType', item)
              // return false
            }
          });
          $.each(ctrl.viewModel.FormElementType, function (k, item) {
            if (item.Name == ctrl.model.FormElementType) {
              ctrl.$set(ctrl.model, 'FormElementType', item)
              // return false;
            }
          });
        })
      },
      close(){
        this.$hub.$emit('close-modal')
      },
      save() {
        var ctrl = this;
        var savedData = ctrl.$Lodash.cloneDeep(ctrl.model);
        if (ctrl.$Utils.isEmpty(savedData.DisplayType))
          savedData.DisplayType = savedData.DisplayType.Code;
        if (ctrl.$Utils.isEmpty(savedData.FormElementType))
          savedData.FormElementType = savedData.FormElementType.Name;

        $.each(savedData, function(key, value) {
          if (value == true && !$.isNumeric(key))
            savedData[key] = 'true';
          if (value == false && !$.isNumeric(value))
            savedData[key] = 'false';
          ctrl.dataToPass[key] = value;
        });
        ctrl.close();

      }
    },
    created() {
      var ctrl = this;
      ctrl.isSystemAdmin = ctrl.$isSystemAdmin();
      ctrl.Showa = true;
      ctrl.bindComboModel();
    }
  }
</script>

<style scoped>

</style>
