<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Phổ biến" name="0">
        <el-form :model="model" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Tên hiển thị" prop="Caption">
            <el-input v-model="model.Caption"/>
          </el-form-item>
          <el-form-item label="Tên trường" prop="Name">
            <el-input v-model="model.Name"/>
          </el-form-item>
          <el-form-item label="Gợi ý" prop="PlaceHolder">
            <el-input v-model="model.PlaceHolder"/>
          </el-form-item>
          <el-form-item label="Loại trường" prop="FieldStorageType">
            <el-select v-model="model.FieldStorageType" value-key="Id" clearable>
              <el-option v-for="item in viewModel.FieldStorageType" :key="item.Id" :label="item.Caption"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Loại dữ liệu" prop="FieldColumnType">
            <el-select v-model="model.FieldColumnType" value-key="Id" clearable>
              <el-option v-for="item in viewModel.FieldColumnType" :key="item.Id" :label="item.Caption"
                         :value="item"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Biểu mẫu" name="1">
        <el-form :model="model" :rules="rules" ref="formForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Lưu dữ liệu">
            <el-checkbox v-model="model.FormIncludeSubmit"/>
          </el-form-item>
          <el-form-item label="Trường lịch sử">
            <el-checkbox v-model="model.History"/>
          </el-form-item>
          <el-form-item label="Lấy theo quyền" prop="PlaceHolder">
            <el-checkbox v-model="model.AssignedField"/>
          </el-form-item>
          <el-form-item label="Xóa cập nhật" prop="PlaceHolder">
            <el-checkbox v-model="model.ClearAfter"/>
          </el-form-item>
          <el-form-item label="Trường lưu tên" prop="PlaceHolder">
            <el-input v-model="model.DynamicText"/>
          </el-form-item>
          <el-form-item label="Giá trị mặc định" prop="PlaceHolder">
            <el-input v-model="model.FormDefaultValue"/>
          </el-form-item>
          <el-form-item label="Gọi hàm bên ngoài" prop="PlaceHolder">
            <el-input v-model="model.FormCallExtraService"/>
          </el-form-item>
          <el-form-item label="Loại trường" prop="FormFieldType">
            <el-select v-model="model.FormFieldType" value-key="Id" clearable @change="onFormFieldTypeChange('ev')">
              <el-option v-for="item in viewModel.FormFieldType" :key="item.Id" :label="item.Description"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Kiểu phần tử" prop="FormElementType">
            <el-select v-model="model.FormElementType" value-key="Id" clearable @change="onChangeElementType">
              <el-option v-for="item in viewModel.FormElementType" :key="item.Id" :label="item.Caption"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <div v-if="">
            <div v-if="model.FormFieldType && model.FormFieldType.Name==='Calculator'">
              <el-form-item label="Phụ thuộc vào" prop="FormDependOn">
                <el-input v-model="model.FormDependOn"/>
              </el-form-item>
              <el-form-item label="Giá trị phụ thuộc" prop="FormDependValue">
                <el-input v-model="model.FormDependValue"/>
              </el-form-item>
              <el-form-item label="Biểu thức" prop="FormExpression">
                <el-input v-model="model.FormExpression"/>
              </el-form-item>
              <el-form-item label="Biểu thức JSON" prop="FormJsonExpression">
                <el-input v-model="model.FormJsonExpression"/>
              </el-form-item>
              <el-form-item label="Định dạng" prop="FormFormat">
                <el-input v-model="model.FormFormat"/>
              </el-form-item>
              <el-form-item label="Index" prop="FormIndex">
                <el-input v-model="model.FormIndex"/>
              </el-form-item>
              <el-form-item label="Value" prop="FormValue">
                <el-input v-model="model.FormValue"/>
              </el-form-item>
              <el-form-item label="Dynamic Value" prop="FormDynamicValue">
                <el-input v-model="model.FormDynamicValue"/>
              </el-form-item>
              <el-form-item label="Data Change Type" prop="FormDataChangeType">
                <el-select v-model="model.FormDataChangeType" value-key="Id" clearable>
                  <el-option v-for="item in viewModel.FormDataChangeType" :key="item.Id" :label="item.Caption"
                             :value="item"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Data depend on" prop="FormDataDependOn">
                <el-input v-model="model.FormDataDependOn"/>
              </el-form-item>
              <el-form-item label="Data depend on value" prop="FormDependOnValue">
                <el-input v-model="model.FormDependOnValue"/>
              </el-form-item>
            </div>
          </div>
          <div v-if="model.FormElementType">
            <div v-if="['Select','Multi','Radio','MultiTree'].indexOf(model.FormElementType.Name)>=0">
              <el-form-item label="Mã Template lấy dữ liệu">
                <el-input v-model="model.FormRequest"/>
              </el-form-item>
              <el-form-item label="Đường dẫn gốc">
                <el-input v-model="model.FormDataRoot"/>
              </el-form-item>
              <el-form-item label="Mã">
                <el-input v-model="model.FormCode"/>
              </el-form-item>
              <el-form-item label="Trường theo dữ liệu gốc">
                <el-input v-model="model.FormSearchField"/>
              </el-form-item>
              <el-form-item label="Lấy dữ liệu gốc">
                <el-checkbox v-model="model.RequireOriginal"/>
              </el-form-item>
              <el-form-item label="Dạng cây">
                <el-checkbox v-model="model.FormIsTree"/>
              </el-form-item>
              <el-form-item label="Giá trị hiển thị">
                <el-input v-model="model.FormDisplayText"/>
              </el-form-item>
              <el-form-item label="Giá trị lưu lại">
                <el-input v-model="model.FormSavedKey"/>
              </el-form-item>
              <el-form-item label="Chuỗi lưu lại">
                <el-input v-model="model.FormSavedText"/>
              </el-form-item>
              <el-form-item label="FormField">
                <el-input v-model="model.FormField"/>
              </el-form-item>
              <el-form-item label="Tùy chọn khác">
                <el-input v-model="model.FormOther"/>
              </el-form-item>
              <el-form-item label="Giá trị tùy chọn khác">
                <el-input v-model="model.FormOtherValue"/>
              </el-form-item>
              <el-form-item label="Giá trị chọn">
                <el-input v-model="model.FormSourceData"/>
              </el-form-item>
              <el-form-item label="Giá trị Import">
                <el-input v-model="model.FormImport"/>
              </el-form-item>
            </div>
            <el-form-item label="Mã hóa" v-if="model.FormElementType.Name === 'Html'">
              <el-checkbox v-model="model.FormEncrypt"/>
            </el-form-item>
            <el-form-item label="Nội dung Html" v-if="model.FormElementType.Name === 'View'">
              <el-input type="textarea" v-model="model.FormHtml"/>
            </el-form-item>
          </div>
          <el-form-item label="Cấu hình thêm">
            <el-input type="textarea" v-model="model.ExtraSetting"/>
          </el-form-item>
          <el-form-item label="Loại Validate" v-if="model.FormFieldType && model.FormFieldType.Name === 'General'">
            <el-select multiple v-model="viewModel.checkedItems" value-key="Id" @change="onCheckChangeValidate()">
              <el-option v-for="item in viewModel.FormValidate.source" :key="item.Id" :label="item.Name"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-card v-for="item in viewModel.checkedItems" :key="item.Id">
            <el-row>{{item.Name}}</el-row>
            <el-row>
              <el-form-item v-for="validateElement in item.Description" :label="validateElement" label-width="120px">
                <el-input v-model="validateModel.Validate[item.Name+validateElement]"/>
              </el-form-item>
            </el-row>
          </el-card>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Bộ lọc" name="2">
        <el-form :model="viewModel" :rules="rules" ref="filterForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Giá trị mặc định" prop="FilterDefaultValue">
            <el-input v-model="model.FilterDefaultValue"/>
          </el-form-item>
          <el-form-item label="Định dạng" prop="FilterFormat">
            <el-input v-model="model.FilterFormat"/>
          </el-form-item>
          <el-form-item label="Bao gồm giờ" prop="FilterIncludeTime">
            <el-checkbox v-model="model.FilterIncludeTime"/>
          </el-form-item>
          <el-form-item label="Được sử dụng" prop="FilterIsUsed">
            <el-checkbox v-model="model.FilterIsUsed"/>
          </el-form-item>
          <el-form-item label="Loại trường" prop="FilterFieldType">
            <el-select v-model="model.FilterFieldType" value-key="Id" clearable @change="onFilterFieldTypeChange('ev')">
              <el-option v-for="item in viewModel.FilterFieldType" :key="item.Id" :label="item.Description"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Kiểu phần tử" prop="FilterElementType">
            <el-select v-model="model.FilterElementType" value-key="Id" clearable>
              <el-option v-for="item in viewModel.FilterElementType" :key="item.Id" :label="item.Caption"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <div v-if="model.FilterElementType">
            <div v-if="['Select','Multi','Radio','MultiTree'].indexOf(model.FilterElementType.Name)>=0">
              <el-form-item label="Mã Template lấy dữ liệu">
                <el-input v-model="model.FilterRequest"/>
              </el-form-item>
              <el-form-item label="Đường dẫn gốc">
                <el-input v-model="model.FilterDataRoot"/>
              </el-form-item>
              <el-form-item label="Mã">
                <el-input v-model="model.FilterCode"/>
              </el-form-item>
              <el-form-item label="Trường theo dữ liệu gốc">
                <el-input v-model="model.FilterSearchField"/>
              </el-form-item>
              <el-form-item label="Dạng cây">
                <el-checkbox v-model="model.FilterIsTree"/>
              </el-form-item>
              <el-form-item label="Giá trị hiển thị">
                <el-input v-model="model.FilterDisplayText"/>
              </el-form-item>
              <el-form-item label="Giá trị lưu lại">
                <el-input v-model="model.FilterSavedKey"/>
              </el-form-item>
              <el-form-item label="Chuỗi lưu lại">
                <el-input v-model="model.FilterSavedText"/>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Danh sách" name="3">
        <el-form :model="viewModel" :rules="rules" ref="filterForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Kiểu hiển thị" prop="ListElementType">
            <el-select v-model="model.ListElementType" value-key="Id" clearable>
              <el-option v-for="item in viewModel.ListElementType" :key="item.Id" :label="item.Caption"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Trường ẩn" prop="ListIsHidden">
            <el-checkbox v-model="model.ListIsHidden"/>
          </el-form-item>
          <div v-if="model.ListElementType">
            <div v-if="['Popup','Link'].indexOf(model.ListElementType.Name)>=0">
              <el-form-item label="Loại phần tử">
                <el-select v-model="model.PopupModuleType" clearable value-key="Id">
                  <el-option label="Form" value="Form"/>
                  <el-option label="Filter" value="Filter"/>
                  <el-option label="List" value="List"/>
                  <el-option label="Report" value="Report"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Phần tử chi tiết">
                <el-select v-model="model.PopupModule" value-key="Id" clearable>
                  <el-option v-for="item in viewModel.PopupModule" :key="item.Id" :label="item.Caption"
                             :value="item"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Mã">
                <el-input v-model="model.Value"/>
              </el-form-item>
              <el-form-item label="Lấy đủ dữ liệu">
                <el-checkbox v-model="model.GetFullData"/>
              </el-form-item>
              <el-form-item label="Sau cập nhật">
                <el-select v-model="model.AfterUpdate" value-key="Id" clearable>
                  <el-option v-for="item in viewModel.AfterUpdate" :key="item.Name" :value="item.Name"
                             :label="item.Caption"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Trường ghép đôi">
                <el-input type="textarea" v-model="model.ParentChild"/>
              </el-form-item>
            </div>
            <div v-if="model.ListElementType.Name === 'Redirect'">
              <el-form-item label="Trang liên kết" prop="Caption">
                <el-input v-model="model.Caption"/>
              </el-form-item>
            </div>
            <div v-if="model.ListElementType.Name === 'ButtonGroup'">
              <el-form-item label="Nút trực thuộc" prop="Buttons">
                <!--<el-cascader :options="viewModel.Buttons" :show-all-levels="false"/>-->
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Báo cáo" name="4">
        <el-form :model="viewModel" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Tên sử dụng" prop="ReportCaption">
            <el-input v-model="model.ReportCaption"/>
          </el-form-item>
          <el-form-item label="Khối dữ liệu" prop="DataSource">
            <el-select v-model="model.DataSource" value-key="Id" clearable>
              <el-option v-for="item in viewModel.DataSource" :key="item.Id" :label="item.Name"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Được sử dụng" prop="ReportIsUsed">
            <el-checkbox v-model="model.ReportIsUsed"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Cấp phép" name="5"/>
    </el-tabs>
    <el-button type="primary" @click="save">Lưu</el-button>
    <el-button @click="cancel">Đóng</el-button>
  </div>
</template>
<script>
  import utilsLibrary from "@/services/utils";
  import SelectCheck from '@/components/dynamic/SelectCheck'

  export default {
    components: {
      SelectCheck
    },
    props: ["data"],
    data() {
      return {
        type: '',
        activeName: '0',
        viewModel: {
          Source: '',
          Target: '',
          ListSourceFields: [],
          ListTargetFields: [], ListLinks: [],
          FormElementType: [],
          checked: []
        },
        model: {},
        action: '',
        rules: {
          Caption: [{required: true, message: "Tên hiển thị bắt buộc phải nhập", trigger: "blur"}],
          Name: [{required: true, message: "Tên trường phải nhập", trigger: "blur"}],
          FieldStorageType: [{required: true, message: "Loại trường bắt buộc phải nhập", trigger: "change"}],
          FieldColumnType: [{required: true, message: "Loại dữ liệu bắt buộc phải nhập", trigger: "change"}]
        },

      };
    },
    created() {
      this.init();
    },
    mounted() {

    },
    watch: {},
    methods: {
      onChangeElementType(val){
console.log(val)
      },
      childUpdate() {

      },
      handleClick(tab, event) {

      },
      bindEditor() {
        var ctrl = this;
        var dataToPass = this.data;
        if (dataToPass.action === 'edit') {
          utilsLibrary.bindScopeModel(ctrl, dataToPass);
          ctrl.onFormFieldTypeChange();
          ctrl.onFilterFieldTypeChange();
          ctrl.onChangePopupModule();

          ctrl.validateModel.Validate = {};
          var objFormValidate = utilsLibrary.stringToObject(ctrl.model.FormValidate);
          if (objFormValidate.Key !== undefined) {
            var arrKey = objFormValidate.Key.split(';');
            arrKey.splice(-1, 1);
            arrKey.forEach(item => {
              ctrl.viewModel.FormValidate.source.forEach(source => {
                if (item === source.Name) {
                  ctrl.viewModel.checkedItems.push(source);
                }
              });
            });
            this.viewModel.checkedItems.forEach(item => {
              if (typeof item.Description === 'string')
                item.Description = item.Description.split(";");
            });
            $.each(objFormValidate, function(key, value) {
              ctrl.validateModel.Validate[key] = value;
            });
          }

        } else {
          ctrl.model = {
            History: true,
            FormIncludeSubmit: true,
            FormElementType: '',
            FilterElementType:'',
          };
          $.each(ctrl.viewModel.ListElementType, (key, element) => {
            if (element.Name === 'Text')
              ctrl.$set(ctrl.model, 'ListElementType', element);
          });
        }
      },

      save() {
        var ctrl = this;
        var dataToPass = this.data;
        //var selectedDataGroup = dataToPass.scope.treeDataGroup.getSelectedItem();

        ctrl.model.FormValidate = '';

        var strKey = ctrl.viewModel.checkedItems.length > 0 ? '&Key=' : '';
        ctrl.viewModel.checkedItems.forEach((item) => {
          strKey += item.Name + ';';
        });
        ctrl.model.FormValidate = strKey;
        $.each(ctrl.validateModel.Validate, function (key, value) {
          if(key !== 'Key' && key !== 'Index')
            ctrl.model.FormValidate += '&' + key + '=' + value;
        });

        ctrl.model.ListButtonGroups = '';

        utilsLibrary.saveSelectModel(ctrl);

        if (utilsLibrary.isEmpty(ctrl.model.PopupModule)) {
          ctrl.model.DataGroup = ctrl.model.PopupModule.DataGroup;
          ctrl.model.DataGroupCaption = ctrl.model.PopupModule.DataGroupCaption;
          ctrl.model.PopupModule = ctrl.model.PopupModule.Code;
        }

        if (utilsLibrary.isEmpty(ctrl.model.FormElementType))
          ctrl.model.FormElementType = ctrl.model.FormElementType.Name;

        if (utilsLibrary.isEmpty(ctrl.model.FilterElementType))
          ctrl.model.FilterElementType = ctrl.model.FilterElementType.Name;

        if (ctrl.action === undefined)
          ctrl.model.Code = 'DataGroup.Fields.' + ctrl.model.Name + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5);

        $.each(ctrl.model, (key, value) => {
          if (value === true)
            ctrl.model[key] = 'true';
          if (value === false && value !== '')
            ctrl.model[key] = 'false';
        });

        ctrl.communication = {action: ctrl.action, item: ctrl.model, index: dataToPass.index, Type: 'Fields'};
        dataToPass.scope.bindSubDirectives(this.$Lodash.cloneDeep(ctrl.communication));
        this.cancel();
      },

      cancel() {
        //$mdDialog.hide();
        this.$hub.$emit('close-modal');
      },

      onCheckChangeValidate() {
        this.viewModel.checkedItems.forEach(item => {
          if (typeof item.Description === 'string')
            item.Description = item.Description.split(";");
        });
        this.$forceUpdate();
      },

      onFormFieldTypeChange(ev) {
        var ctrl = this;
        if (ctrl.model.FormFieldType !== undefined && ctrl.model.FormFieldType !== '') {
          if (ev !== undefined)
            ctrl.model.FormElementType = '';
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentCode = 'xSetting.Default.Project.DataGroup.Field.FormElementType.' + ctrl.model.FormFieldType.Name;
          request.R1_Level = '8';
          utilsLibrary.post(request).then((data) => {
            ctrl.viewModel.FormElementType = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            $.each(ctrl.viewModel.FormElementType, (key, item) => {
              if (ctrl.model.FormElementType === item.Name)
                ctrl.model.FormElementType = item;
            });
            this.$forceUpdate();
          })
        }
      },

      onFilterFieldTypeChange(ev) {
        var ctrl = this;
        if (ctrl.model.FilterFieldType !== undefined && ctrl.model.FilterFieldType !== '') {
          if (ev !== undefined)
            ctrl.model.FilterElementType = '';
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentCode = 'xSetting.Default.Project.DataGroup.Field.FilterElementType';
          // request.R1_Level = '8';
          utilsLibrary.post(request).then((data) => {
            ctrl.viewModel.FilterElementType = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            $.each(ctrl.viewModel.FilterElementType, (key, item) => {
              if (ctrl.model.FilterElementType === item.Name)
                ctrl.model.FilterElementType = item;
            });
            this.$forceUpdate();
          })
        }
      },

      onChangePopupModule(ev) {
        var ctrl = this;
        if (ctrl.model.PopupModuleType !== undefined && ctrl.model.PopupModuleType !== '') {
          if (ev !== undefined)
            ctrl.model.PopupModule = '';
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'Setting.Datagroup.PopupSearch';
          request.R1_ParentCode = 'xSetting.Project.' + ctrl.model.PopupModuleType;
          request.R1_Level = '4;';
          utilsLibrary.post(request).then((data) => {
            ctrl.viewModel.PopupModule = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            $.each(ctrl.viewModel.PopupModule, (key, item) => {
              if (ctrl.model.PopupModule === item.Code) {
                ctrl.model.PopupModule = item;
              }
            });
          });
        }
      },

      init() {
        var ctrl = this;
        var dataToPass = this.data;
        var arrButtons = [];
        $.each(dataToPass.scope.viewModel.listButtons, (key, item) => {
          if (item.ParentObject === 'List') {
            arrButtons.push(item);
          }
        });
        ctrl.viewModel = {
          FormValidate: {source: []}
        };
        ctrl.viewModel = {
          Data: {
            Default: {valueMember: 'Name'},
            Fields: [
              {Name: 'FormFieldType'},
              {Name: 'FilterFieldType'},
              {Name: 'FieldColumnType'},
              {Name: 'ListElementType'},
              {Name: 'FormDataChangeType'},
              {Name: 'DataSource'},
              {
                Name: 'FieldStorageType',
                Model: 'FieldStorageType;FormSubFieldType'
              },
              {Name: 'FormValidate', IsJqueryWidgets: true}
            ]
          },
          FormValidate: {
            source: dataToPass.scope.viewModel.FormValidateSource,
            checkboxes: true,
            displayMember: 'Name',
            valueMember: 'Description',
            checkChange: (event) => {
              ctrl.onCheckChangeValidate(event);
            }
          },
          DataSource: dataToPass.scope.viewModel.DataSource,
          FormFieldType: dataToPass.scope.viewModel.FormFieldType,
          FilterFieldType: dataToPass.scope.viewModel.FormFieldType,
          FieldColumnType: dataToPass.scope.viewModel.FieldColumnType,
          ListElementType: dataToPass.scope.viewModel.ListElementType,
          FormDataChangeType: dataToPass.scope.viewModel.FormDataChangeType,
          AfterUpdate: dataToPass.scope.viewModel.AfterUpdate,
          FieldStorageType: dataToPass.scope.viewModel.FieldStorageType,
          Buttons: {source: arrButtons, checkboxes: true, displayMember: 'Caption', valueMember: 'Code'},
          checkedItems: []
        };
        console.log(this.viewModel.FormFieldType);
        ctrl.validateModel = {Validate: {}, checkedItems: []};
        ctrl.communication = {action: '', item: {}, index: '', scope: ctrl};
        this.bindEditor();
      }
    }
  };
</script>
