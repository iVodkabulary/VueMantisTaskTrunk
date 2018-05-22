<template>
  <div>
    <el-form label-width="15%">
      <el-form-item label="Loại">
        <el-select v-model="model.SubElementType" clearable placeholder="" style="width: 100%"
                   @change="onChangeSubElementType">
          <el-option v-for="item in subElementTypeLst" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Phần tử">
        <el-select v-model="model.SubElement" value-key="Id" style="width: 100%">
          <el-option v-for="item in viewModel.listSubElements" :key="item.id" :value="item" :label="item.Caption"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-col :span="10">
          <el-checkbox v-model="model.IncludeElementData">Lấy dữ liệu từ phần tử</el-checkbox>
        </el-col>
        <el-col :span="7">
          <el-checkbox v-model="model.SaveElementData">Lưu dữ liệu</el-checkbox>
        </el-col>
        <el-col :span="7">
          <el-checkbox v-model="model.GetFullData">Lấy đủ dữ liệu</el-checkbox>
        </el-col>
      </el-form-item>
      <el-form-item label="Trường ghép đôi">
        <el-input type="textarea" v-model="model.ParentChild" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="Cấu hình thêm">
        <el-input type="textarea" v-model="model.ExtraSetting" :rows="2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">Lưu</el-button>
        <el-button @click="cancel">Đóng</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    components: {},
    props: ['data'],
    data() {
      var dat = {
        subElementTypeLst: [
          {id: 'Form', name: 'Form'},
          {id: 'List', name: 'List'},
          {id: 'Filter', name: 'Filter'},
          {id: 'Report', name: 'Report'}],
      };
      dat.model = {
        SubElementType: '',
        IncludeElementData: false,
        SaveElementData: false,
        GetFullData: false,
        ParentChild: '',
        ExtraSetting: '',
      };
      dat.viewModel = {
        listSubElements: [],
      };
      dat.dataToPass = this.data;
      dat.communication = {action: '', item: {}, index: '', scope: this};
      return dat;
    },
    methods: {
      save() {
        var ctrl = this;
        if (ctrl.$Utils.isEmpty(ctrl.model.SubElement)) {
          ctrl.model.DataGroup = ctrl.model.SubElement.DataGroup;
          ctrl.model.DataGroupCaption = ctrl.model.SubElement.DataGroupCaption;
          ctrl.model.SubElement = ctrl.model.SubElement.Code;
          if(ctrl.dataToPass.action == 'edit'){
            ctrl.dataToPass.SubElements.splice(ctrl.dataToPass.index, 1)
            ctrl.dataToPass.SubElements.splice(ctrl.dataToPass.index,0,ctrl.model);
          }else{
            ctrl.dataToPass.SubElements.push(ctrl.model);
          }
          ctrl.cancel();
        }
      },
      onChangeSubElementType(model) {
        var ctrl = this;
        if (ctrl.model.SubElementType != '') {
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentCode = 'xSetting.Project.' + ctrl.model.SubElementType;
          request.R1_Level = '4;';
          ctrl.$Utils.post(request).then(function (data) {
            data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            ctrl.viewModel.listSubElements = data;
            if (model != undefined) {
              $.each(ctrl.viewModel.listSubElements, function (k, module) {
                if (module.Code == model.SubElement) {
                  model.SubElement = module;
                  return false;
                }
              });
            }
          });
        } else
          ctrl.viewModel.listSubElements = [];
      },
      cancel() {
        this.$hub.$emit('close-modal')
      },
    },
    destroyed() {
    },
    mounted() {
      this.loadField;
    },
    created() {
      var ctrl = this;
      if (ctrl.dataToPass.action == 'edit') {
        ctrl.action = 'edit';
        ctrl.model = ctrl.$Lodash.cloneDeep(ctrl.dataToPass.item);
        $.each(ctrl.model, function (key, value) {
          if (value == 'true')
            ctrl.model[key] = true;
          else if (value == 'false')
            ctrl.model[key] = false;
        });
        ctrl.onChangeSubElementType(ctrl.model);
      }
    },
    watch: {}
  };
</script>
