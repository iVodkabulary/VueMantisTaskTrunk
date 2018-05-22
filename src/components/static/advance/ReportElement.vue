<!--suppress ALL -->
<template>

  <div class="report-element">
    <el-form label-position="top" :model="model" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item>
        <!-- <el-button type="primary" @click="openPermissionSelector()" v-if="!isNew" >Cấp phép</el-button> -->
        <!-- <el-button type="primary" @click="submitForm('ruleForm')">Lưu</el-button> -->

      </el-form-item>
      <el-form-item label="Tên" prop="ReportCaption">
        <el-input v-model="model.ReportCaption"></el-input>
      </el-form-item>
      <el-form-item label="Khóa" prop="Name">
        <el-input v-model="model.Name"></el-input>
      </el-form-item>
      <el-form-item label="Khóa cha" prop="ParentColumn" v-if="model.StorageType==='Struct'">
        <el-input v-model="model.ParentColumn" clearable></el-input>
      </el-form-item>
      <div v-if="!data.value || data.value.Type == 'Calculator'">
        <div class="row">
            <el-button  v-for="item in data.model.Description.Fields.V" type="primary" @click="onExpression(item)">{{item.Caption}}</el-button>
        </div>
        <el-form-item label="Biểu thức">
        <!-- <label>Email gửi</label> -->
          <el-input v-model="model.Expression"></el-input>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="Phương thức tính">
        <!-- <label>Email gửi</label> -->
          <el-select v-model="model.SummaryType" clearable placeholder="Chọn">
            <el-option
              v-for="item in viewModel.ListSummaryTypes"
              :key="item.Name"
              :label="item.Description"
              :value="item.Name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Phần giá trị ngày tháng" v-if="model.SummaryType=='DatePart'">
        <!-- <label>Email gửi</label> -->
          <el-select v-model="model.DatePart" clearable placeholder="Chọn">
            <el-option
              v-for="item in viewModel.ListDateParts"
              :key="item.Name"
              :label="item.Description"
              :value="item.Name">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="Định dạng giá trị">
        <!-- <label>Email gửi</label> -->
        <el-select v-model="model.FormatValue" clearable placeholder="Chọn">
          <el-option
            v-for="item in viewModel.ListFormatValues"
            :key="item.Name"
            :label="item.Name"
            :value="item.Name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <label>Khoảng giá trị</label>
        <el-switch v-model="model.RangeValue"></el-switch>
      </el-form-item>
      <el-form-item label="">
        <label>Hiển thị %</label>
        <el-switch v-model="model.Percentage"></el-switch>
      </el-form-item>
      <el-form-item label="Định dạng giá trị">
        <!-- <label>Email gửi</label> -->
        <el-select v-model="model.TotalType" clearable placeholder="Chọn">
          <el-option 
            key="Total"
            label="Tổng"
            value="Total">
          </el-option>
          <el-option
            key="Average"
            label="Trung bình"
            value="Average">
          </el-option>
          <el-option
            key="None"
            label="Không tính"
            value="None">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mã Template lấy dữ liệu" v-if="model.RangeValue">
      <!-- <label>Email gửi</label> -->
        <el-input v-model="model.ReportRequest"></el-input>
      </el-form-item>
      <el-form-item label="Đường dẫn gốc" v-if="model.RangeValue">
      <!-- <label>Email gửi</label> -->
        <el-input v-model="model.ReportDataRoot"></el-input>
      </el-form-item>
      <el-form-item label="Mã" v-if="model.RangeValue">
      <!-- <label>Email gửi</label> -->
        <el-input v-model="model.ReportCode"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">Lưu</el-button>
      <el-button type="primary" @click="close()">Đóng</el-button>
    </el-form>
  </div>

</template>
<script>
  import Vue from 'vue';
  import VueDragula from 'vue-dragula';
  import PermissionSelector from '@/components/static/PermissionSelector';

  Vue.use(VueDragula);

  export default {
    props: ['data'],
    components:{VueDragula, PermissionSelector},
    data() {

      return {
        model: {
          SummaryType: 'Count',
          Expression: '',
          // Description: {
          //   Fields: {
          //   //   "X": [
          //   //     {
          //   //       "Caption": "Trạng thái",
          //   //       "Name": "Status",
          //   //       "DataType": "String",
          //   //       "StorageType": "Static",
          //   //       "DataSource": "xDynamicData_Setting"
          //   //     }
          //   //   ],
          //   //   "Y": [],
          //   //   "V": [
          //   //     {
          //   //       "Caption": "Id",
          //   //       "Name": "Id",
          //   //       "DataType": "String",
          //   //       "StorageType": "Static",
          //   //       "ReportCaption": "Số lượng công việc",
          //   //       "SummaryType": "Count"
          //   //     }
          //   //   ],
          //   //   "T": [],
          //   //   "Table": [
          //   //     {
          //   //       "Caption": "Id",
          //   //       "Name": "Id",
          //   //       "Type": "Field",
          //   //       "Display": true
          //   //     }
          //   //   ],
          //   //   "Series": [
          //   //     {
          //   //       "Caption": "Id",
          //   //       "Name": "Id",
          //   //       "ReportType": "Column",
          //   //       "Enabled": false
          //   //     }
          //   //   ],
          //   //   "Calculators": []
          //   }
          // }
        },
        options: [],
        viewModel: {},
        CurrentDataGroup: {},
        ruleForm: {
          name: '',

        },
        rules: {
          ReportCaption: [
            {
              required: true,
              message: "Tên bắt bược nhập",
              trigger: "blur"
            }
          ]
        }
      };
    },

    created() {
     // console.log(this.data)
      if(!this.data.value){
        this.viewModel.Type = 'Calculator';
        this.action = 'add'
      } else {
        this.action = 'edit'
      }
      this.bindComboModel()

      /*
      Vue.vueDragula.options('my-bag', {
        direction: 'vertical'
      })
      */
    },
    mounted() {
     // alert(this.selectedItem);
      // if(this.selectedItem) {
      //   var des = JSON.parse(this.selectedItem.Description);
      //   this.ruleForm.name = des.Caption;
      //   this.ruleForm.desc = des.More;
      // }
      //this.isAddNew = (newID === this.$route.query.id);

    },
    ready() {
      // Vue.vueDragula.eventBus.$on('drop', function (args) {
      //   console.log('drop: ' + args[0])
      // })
    },
    watch: {
      // selectedItem:{
      //   handler:function (after, before) {
      //     console.log(newItem);
      //   },
      //   deep:true
      // }

    },
    methods: {
      close() {
         this.$hub.$emit('close-modal');
      },
      bindComboModel() {
        var ctrl = this;
        var arrParentCodes = ['SummaryType', 'FormatValue', 'DatePart'];
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        request.TotalRequests = 0;
        $.each(arrParentCodes, function (index, code) {
          request.TotalRequests++;
          request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.SearchSetting';
          request['R' + request.TotalRequests + '_ParentCode'] = 'xSetting.Default.Project.Report.' + code;
        });
        ctrl.$Utils.postCheckResult(request).then(function (result) {
          ctrl.viewModel.ListSummaryTypes = ctrl.$Utils.getDataWithRoot(result.R1, 'Data.DynamicDS.Setting');
          ctrl.viewModel.ListFormatValues = ctrl.$Utils.getDataWithRoot(result.R2, 'Data.DynamicDS.Setting');
          ctrl.viewModel.ListDateParts = ctrl.$Utils.getDataWithRoot(result.R3, 'Data.DynamicDS.Setting');
          //console.log(ctrl.viewModel)
          if(ctrl.data.value){
            ctrl.model = ctrl.$Lodash.cloneDeep(ctrl.data.value)
            ctrl.model.ReportCaption = ctrl.model.ReportCaption == undefined ? ctrl.model.Caption : ctrl.model.ReportCaption;
          }
        });
      },
      onExpression(field) {
        var ctrl = this;
        // if (!ctrl.$Utils.isEmpty(ctrl.model.Expression))
        //   ctrl.model.Expression = '';
        ctrl.model.Expression += ' {{' + field.Name + '}} ';
       // console.log(ctrl.model.Expression)
      },
      back(){
        //this.$router.push('/lists')
        this.resetForm('ruleForm');
        if(this.closeCallback) this.closeCallback();

      },
      handleChange(value, direction, movedKeys) {
       // console.log(value, direction, movedKeys);
      },
      addGroupFields() {
        this.data.push({
          key: this.data.length,
          label: `grouped-fields`,
          type: "GROUPFIELD",
          disabled: true
        });
        this.value3.push(this.data.length);
      },
      // renderFunc(h, option) {
      //   return (<span > {option.type}-{option.key}-{option.label}</span>);
      // },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.save();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      save() {
        var ctrl = this;
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            if (ctrl.viewModel.Type == 'Calculator') {
              ctrl.model.Caption = ctrl.model.ReportCaption;
              ctrl.model.Name = ctrl.model.Name ? ctrl.model.Name : 'Calculator.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5);
              ctrl.model.Type = 'Calculator'
            }

            ctrl.communication = {
              action: ctrl.action,
              item: ctrl.model,
              index: ctrl.data.index,
              // Type: ctrl.viewModel.Type,
            }

            this.data.bindField(ctrl.communication, this.data.CurrentGroup);
            this.close();
          } else {
            console.log("error submit!!");
            return false;
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleChange(){},
      onClick(){}
    }
  };
</script>
<style lang="scss" scoped>
  .report-element{
    .bButton {
      height:75px
    }
    .el-form-item {
      margin-bottom: 2px;


    }
    .el-cascader--mini {
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
    .el-form-item--mini {
      .el-form-item__label {
        line-height: 16px;
        padding: 0px !important;
      }
    }

  }
</style>
