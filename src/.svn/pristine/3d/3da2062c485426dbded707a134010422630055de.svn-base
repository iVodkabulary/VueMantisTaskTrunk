<template>
  <el-form :model="model" ref="FieldInfoDialog" :rules="formRule" label-width="180px" label-position="left">
    <el-row>
      <el-col :span="12" class="p-2">
        <el-form-item label="Tên:" prop="Caption">
          <el-input v-model="model.Caption"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2" v-show="isSystemAdmin">
        <el-form-item label="Thuộc tính màu:">
          <el-input v-model="model.Attribute"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="p-2">
        <el-form-item label="Loại hiển thị:">
          <el-select v-model="model.ListElementType" placeholder="Chọn" clearable>
            <el-option v-for="item in viewModel.ColumnType" :label="item.Name" :value="item.Name"
                       :key="item.Code"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2" v-show="isSystemAdmin">
        <el-form-item label="Loại dữ liệu:">
          <el-select v-model="model.FieldColumnType" placeholder="Chọn" clearable>
            <el-option v-for="item in viewModel.FieldColumnType" :label="item.Name" :value="item.Name"
                       :key="item.Code"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="12" class="p-2">
        <el-form-item label="Các nút:">
          <el-input v-model="model.Buttons"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2">
        <el-form-item label="Định dạng:">
          <el-input v-model="model.Format"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="12" class="p-2">
        <el-form-item label="Class:">
          <el-input v-model="model.Class"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2">
        <el-form-item label="Chiều rộng:">
          <el-input v-model="model.Width"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="24">
        <el-form-item label="Các thuộc tính:">
          <el-checkbox v-model="model.IsBold">Đậm</el-checkbox>
          <el-checkbox v-model="model.IsItalic">Nghiêng</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Căn lề">
          <el-radio-group v-model="model.TextAlign">
            <el-radio label="Left">Trái</el-radio>
            <el-radio label="Center">Giữa</el-radio>
            <el-radio label="Right">Phải</el-radio>
            <el-radio label="Justify">Đều</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="12" class="p-2">
        <el-form-item label="Biểu thức:">
          <el-input v-model="model.Expression"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2">
        <el-form-item label="Mã Template lấy dữ liệu:">
          <el-input v-model="model.ListRequest"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="12" class="p-2">
        <el-form-item label="Đường dẫn gốc:">
          <el-input v-model="model.ListDataRoot"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2">
        <el-form-item label="Mã:">
          <el-input v-model="model.ListCode"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="isSystemAdmin">
      <el-col :span="12" class="p-2">
        <el-form-item label="Giao diện nâng cao:">
          <el-input type='textarea' v-model="model.AdvancedDisplay" :rows="4"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="p-2">
        <el-form-item label="HTML bổ sung:">
          <el-input type='textarea' v-model="model.AddHtml" :rows="4"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item>
        <el-button type="primary" @click="save()">Lưu</el-button>
        <el-button @click="close()">Đóng</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>

  export default {
    components: {},
    name: "list-field-info-dialog",
    props: ["data"],
    data() {
      return {
        isSystemAdmin: this.$isSystemAdmin(),
        viewModel: {
          ColumnType: {},
          FieldColumnType: {}
        },
        communication: {action: '', item: {}, index: '', scope: this},
        model: {},
        action: '',
        formRule: {
          Caption: {required: true, message: 'Tên bắt buộc phải nhập', trigger: 'blur'},
          ListElementType: {required: true, message: 'Loại hiển thị bắt buộc phải chọn', trigger: 'change'}
        }
      };
    },
    methods: {
      handleChange() {
        //console.log(this.model);
      },
      bindComboModel(code) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Default.Project.List.' + code;
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel[code] = data;
        })
      },
      bindFieldColumnType() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Default.Project.DataGroup.Field.FieldColumnType';
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.viewModel.FieldColumnType = data;
        })
      },
      close() {
        this.$hub.$emit('close-modal')
      },
      save() {
        // var ctrl = this;
        // var savedData = ctrl.$Lodash.cloneDeep(ctrl.model);
        // if (ctrl.$Utils.isEmpty(savedData.DisplayType))
        //   savedData.DisplayType = savedData.DisplayType.Code;
        // if (ctrl.$Utils.isEmpty(savedData.FormElementType))
        //   savedData.FormElementType = savedData.FormElementType.Name;
        this.$refs['FieldInfoDialog'].validate((valid) => {
          if (valid) {
            $.each(this.model, (key, value) => {
              if (value === true)
                this.model[key] = 'true';
              if (value === false && value !== '')
                this.model[key] = 'false';
              if ((typeof value) === 'String' && key === "AddHtml") {
                this.model[key] = value.replace(/"/g, "'");
              }
            });

            this.communication = {
              action: this.action,
              item: this.model,
              index: this.data.index
            };

            this.data.scope.bindField(this.$Lodash.cloneDeep(this.communication));
            this.close();
          }
        });
      }
    },
    created() {
      if (this.data.action === 'edit') {
        this.action = 'edit';
        this.model = this.$Lodash.cloneDeep(this.data.item);
        $.each(this.model, (k, v) => {
          v = v === 'true' ? true : v === 'false' ? false : v;
          this.$set(this.model, k, v);
        })
      }
      else {
        this.model = this.$Lodash.cloneDeep(this.data.item);
        this.action = this.data.action;
      }
      this.bindComboModel('ColumnType');
      this.bindFieldColumnType();
    }
  }
</script>

<style scoped lang="scss">

</style>
