<template>
  <div>
    <el-form :model="model" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="Tên hiển thị" prop="Caption">
        <el-input v-model="model.Caption"/>
      </el-form-item>
      <el-form-item label="Đối tượng chứa" prop="ParentObject">
        <el-select v-model="model.ParentObject" clearable>
          <el-option v-for="item in viewModel.ParentObject" :key="item.Name" :label="item.Caption" :value="item.Name"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Hành động trước đó" prop="PreAction" v-show="model.ParentObject==='Form'">
        <el-select v-model="model.PreAction" clearable>
          <el-option v-for="item in viewModel.PreAction" :key="item.Name" :label="item.Caption" :value="item.Name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Quyền hiển thị" prop="UserPermissions">
        <el-select v-model="model.UserPermissions" multiple>
          <el-option v-for="item in viewModel.UserPermissions" :key="item.GroupId" :label="item.GroupName" :value="item.GroupId"/>
          <hr/>
          <div v-for="group in viewModel.GroupPermissions" :key="group.GroupId">
            <el-option :value="group.GroupId" :label="group.GroupName">
            </el-option>
            <el-option v-for="child in viewModel.RolePermissions[group.GroupId]" :key="child.GroupId" :value="child.GroupId" :label="'--'+ child.GroupName"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="Icon" prop="Icon">
        <el-input v-model="model.Icon"/>
      </el-form-item>
      <el-form-item label="Class" prop="Class">
        <el-input v-model="model.Class"/>
      </el-form-item>
      <el-form-item label="Loại nút" prop="ButtonDisplayType">
        <el-select v-model="model.ButtonDisplayType" clearable>
          <el-option label="Thêm mới" value="Insert"/>
          <el-option label="Xuất bản" value="Export"/>
          <el-option label="Công cụ" value="Tool"/>
          <el-option label="Thông tin" value="Info"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Loại hành động" prop="ButtonType">
        <el-select v-model="model.ButtonType" clearable>
          <el-option v-for="item in viewModel.ButtonType" :key="item.Name" :label="item.Caption" :value="item.Name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Trang liên kết" v-show="model.ButtonType === 'Redirect'">
        <el-input type="text" v-model="model.Redirect"/>
      </el-form-item>
      <el-form-item label="Khối dữ liệu" prop="DataGroup" v-show="viewModel.DisplayDataGroups">
        <el-select v-model="viewModel.DataGroup" @change="onChangeDataGroup($event)" clearable>
          <el-option v-for="item in viewModel.ListDataGroups" :key="item.Code" :label="item.Caption" :value="item.Code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Loại" prop="Type">
        <el-select v-model="viewModel.Type" clearable>
          <el-option label="Trường dữ liệu" value="Field"/>
          <el-option label="Khác" value="Other"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Trường" prop="FieldColumnType" v-if="viewModel.Type === 'Field'">
        <el-select v-model="viewModel.Key" clearable>
          <el-option v-for="item in viewModel.Fields" :key="item.Name" :value="item.Name">
            {{item.Caption}} ({{item.Name}})
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Trường" v-show="viewModel.Type === 'Other'">
        <el-input type="text" v-model="viewModel.Key"/>
      </el-form-item>
      <el-form-item label="Giá trị" prop="Value">
        <el-input v-model="viewModel.Value"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addFilter" :disabled="viewModel.Key == undefined || viewModel.Key == ''|| viewModel.Value == undefined || viewModel.Value == ''">Thêm</el-button>
      </el-form-item>
      <el-table :data="model.Filters">
        <el-table-column type="index"/>
        <el-table-column label="Loại" prop="Type"/>
        <el-table-column label="Trường" prop="Key"/>
        <el-table-column label="Giá trị" prop="Value"/>
        <el-table-column label="Xử lý">
          <template slot-scope="scope">
            <el-button type="danger" @click="removeFilter(scope.$index)"
                       size="mini" icon="el-icon-delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="model.ButtonType === 'Popup'">
        <el-form-item label="Loại phần tử">
          <el-select v-model="model.PopupModuleType" clearable @change="onChangePopupModule">
            <el-option value="Form" label="Biểu mẫu"/>
            <el-option value="List" label="Danh sách"/>
            <el-option value="Filter" label="Lọc"/>
            <el-option value="Report" label="Báo cáo"/>
            <el-option value="Page" label="Trang"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Phần tử chi tiết">
          <el-select v-model="model.PopupModule" value-key="Caption" clearable @change="onChangeModule">
            <el-option v-for="item in viewModel.PopupModule" :key="item.Caption" :value="item" :label="item.Caption"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Sau cập nhật">
          <el-select v-model="model.AfterUpdate" clearable>
            <el-option v-for="item in viewModel.AfterUpdate" :key="item.Name" :label="item.Caption" :value="item.Name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Mã">
          <el-input type="text" v-model="model.Value"/>
        </el-form-item>
        <el-form-item label="Lấy đủ dữ liệu">
          <el-checkbox v-model="model.GetFullData"/>
        </el-form-item>
      </div>
      <div v-show="model.ButtonType === 'Click'">
        <el-form-item label="Hành động Click">
          <el-select v-model="model.Action" clearable>
            <el-option v-for="item in viewModel.Action" :key="item.Name" :label="item.Caption" :value="item.Name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Sau cập nhật">
          <el-select v-model="model.AfterUpdate" clearable>
            <el-option v-for="item in viewModel.AfterUpdate" :key="item.Name" :label="item.Caption" :value="item.Name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Giá trị">
          <el-input v-model="model.Value"/>
        </el-form-item>
        <el-form-item label="Thuộc Cột">
          <el-input v-model="model.ColumnName"/>
        </el-form-item>
      </div>
      <el-form-item label="Cấu hình thêm" prop="FieldColumnType">
        <el-input v-model="model.ExtraSetting"/>
      </el-form-item>
      <el-form-item label="Biểu thức JSON" prop="FieldColumnType">
        <el-input v-model="model.FormJsonExpression"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">Lưu</el-button>
        <el-button @click="cancel">Đóng</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import utilsLibrary from "@/services/utils";

  export default {
    props: ["data"],
    data() {

      return {
        type: '',
        activeName: '0',
        viewModel: {
          DisplayDataGroups: true,
          PopupModule: [],
          PopupModuleType: '',
          listFields: [],
          ParentObject: this.data.scope.viewModel.ParentObject,
          ButtonType: this.data.scope.viewModel.ButtonType,
          AfterUpdate: this.data.scope.viewModel.AfterUpdate,
          PreAction: this.data.scope.viewModel.PreAction,
          Action: this.data.scope.viewModel.Action,
          Roles: this.data.scope.viewModel.Roles,
          UserPermissions: this.data.scope.viewModel.UserPermissions,
          GroupPermissions: this.data.scope.viewModel.GroupPermissions,
          RolePermissions: this.data.scope.viewModel.RolePermissions,
          ListDataGroups: this.data.scope.viewModel.ListDataGroups,
          Fields: []
        },
        model: {
          UserPermissions: [],
        },
        rules: {
          Caption: [{required: true, message: "Tên hiển thị bắt buộc phải nhập", trigger: "blur"}],
          ParentObject: [{required: true, message: "Tên hiển thị bắt buộc phải nhập", trigger: "change"}],
          ButtonDisplayType: [{required: true, message: "Tên hiển thị bắt buộc phải nhập", trigger: "change"}],
          ButtonType: [{required: true, message: "Tên hiển thị bắt buộc phải nhập", trigger: "change"}],
        },

      };
    },
    created() {
      this.bindEditor();
    },
    mounted() {

    },
    watch: {},
    methods: {
      bindEditor() {
        var dataToPass = this.data;
        var ctrl = this;
        if (dataToPass.action === 'edit') {
          ctrl.action = 'edit';
          ctrl.model = this.$Lodash.cloneDeep(dataToPass.item);
          ctrl.$set(ctrl.model, 'UserPermissions', [])
          $.each(ctrl.model, (key, value) => {
            if (value === 'true')
              ctrl.$set(ctrl.model,key, true);
            else if (value === 'false')
              ctrl.$set(ctrl.model,key, false);
          });
          ctrl.onChangePopupModule();
        }
      },

      save() {
        var ctrl = this;
        var dataToPass = this.data;
        if (utilsLibrary.isEmpty(ctrl.model.PopupModule) && typeof ctrl.model.PopupModule === 'object') {
          ctrl.model.DataGroup = ctrl.model.PopupModule.Name;
          ctrl.model.DataGroupCaption = ctrl.model.PopupModule.Description.DataGroupCaption;
          ctrl.model.PopupModule = ctrl.model.PopupModule.Code;
        }

        if (ctrl.action === undefined)
          ctrl.model.Code = 'DataGroup.Buttons.' + utilsLibrary.removeVNCharacters(ctrl.model.Caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5);

        $.each(ctrl.model, (key, value) => {
          if (value === true)
            ctrl.model[key] = 'true';
          if (value === false && value !== '')
            ctrl.model[key] = 'false';
        });

        ctrl.communication = {action: ctrl.action, item: ctrl.model, index: dataToPass.index, Type: 'Buttons'};
        dataToPass.scope.bindSubDirectives(this.$Lodash.cloneDeep(ctrl.communication));
        //$mdDialog.hide();
        this.cancel();
      },

      cancel() {
        //$mdDialog.hide();
        this.$hub.$emit('close-modal');
      },

      onChangePopupModule(ev) {
        var ctrl = this;
        if (ctrl.model.PopupModuleType !== '') {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentCode = 'xSetting.Project.' + ctrl.model.PopupModuleType;
          utilsLibrary.post(request).then( (data) => {
            data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            ctrl.viewModel.PopupModule = data;
            $.each(data, (key, item) => {
              if (item.Description !== undefined) {
                item.Description = JSON.parse(item.Description);
                item.Caption = item.Description.Caption;
              }
            })
            $.each(data, (key, item) => {
              if (ctrl.model.PopupModule === item.Code) {
                ctrl.model.PopupModule = item;
                this.bindDataGroupFields();
              }
            });
          });
        }
      },

      onChangeModule(ev) {
        var ctrl = this;
        if (ctrl.model.PopupModule != undefined && ctrl.model.PopupModule != '') {
          ctrl.viewModel.DisplayDataGroups = false;
          this.bindDataGroupFields(ctrl.model.PopupModule.Name);
        }
      },

      onChangeDataGroup(ev) {
        var ctrl = this;
        if (ctrl.viewModel.DataGroup !== '')
          this.bindDataGroupFields(ctrl.viewModel.DataGroup);
      },

      bindDataGroupFields(dataGroupCode) {
        var ctrl = this;
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_Code = dataGroupCode;
        utilsLibrary.post(request).then((data) => {
          data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting')[0];
          if(data.Description){
            data.Description = JSON.parse(data.Description);
            data.Fields = '';
            for (var i = 1; i <= data.Description.FCount; i++) {
              if (data['F' + i] !== undefined)
                data.Fields += data['F' + i];
            }
            ctrl.viewModel.Fields = JSON.parse(data.Fields);
            this.$forceUpdate();
          }
        });
      },

      addFilter() {
        var ctrl = this;
        if (ctrl.model.Filters == undefined)
          ctrl.model.Filters = [];
        ctrl.model.Filters.push({
          Key: ctrl.viewModel.Key,
          Value: ctrl.viewModel.Value,
          Type: ctrl.viewModel.Type
        });
        ctrl.viewModel.Key = '';
        ctrl.viewModel.Value = '';
      },

      removeFilter(index) {
        var ctrl = this;
        ctrl.model.Filters.splice(index, 1);
      },



    }
  };
</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%
  }
</style>
