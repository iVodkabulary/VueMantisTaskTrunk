<!--suppress ALL -->
<template>

  <div class="notifi-form">

    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item>
        <el-button @click="back()" >Quay lại</el-button>
        <!-- <el-button type="primary" @click="openPermissionSelector()" v-if="!isNew" >Cấp phép</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')">Lưu</el-button>

      </el-form-item>
      <!-- <el-form-item label=""> -->
        <el-col :span="16" >
          <el-form-item label="Tên biểu mẫu">
          <!-- <label>Tên biểu mẫu</label> -->
           <el-input v-model="model.Caption"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Loại">
          <!-- <label>Loại</label> -->
          <!-- <el-input v-model="model.Description.NotificationType"></el-input> -->
            <el-select v-model="model.Description.NotificationType" placeholder="Chọn">
              <el-option value="Email">Email</el-option>
              <el-option value="SMS">SMS</el-option>
              <el-option value="Notification">Thông báo</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      <!-- </el-form-item> -->
<!--       <el-form-item label="">
 -->
        <el-col :span="12">
          <el-form-item label="Tài khoản gửi">
            <!-- <label>Tài khoản gửi</label> -->
            <el-input v-model="model.Description.EmailAccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email gửi">
          <!-- <label>Email gửi</label> -->
            <el-input v-model="model.Description.From"></el-input>
          </el-form-item>
        </el-col>
      <!-- </el-form-item> -->
      <!-- <el-form-item label=""> -->
        <el-col :span="10">
          <el-form-item label="Khối dữ liệu">
          <!-- <label>Khối dữ liệu</label> -->
<!--           <el-cascader
            :options="viewModel.ListDataGroups"
            v-model="model.Name"
           >
          </el-cascader> -->
            <!-- <el-select v-model="model.Name" placeholder="Chọn"  @change="handleChange">
              <el-option
                v-for="item in viewModel.ListDataGroups"
                :key="item.Code"
                :label="item.Caption"
                :value="item.Code">
              </el-option>
            </el-select> -->
            <el-cascader expand-trigger="hover" :options="DataGroupTree" placeholder="" v-model="selectedDataGroups" @change="handleChange(selectedDataGroups)"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Trường dữ liệu">
          <!-- <label>Trường dữ liệu</label> -->
          <!-- <el-input v-model="addField"></el-input> -->
            <el-select v-model="viewModel.Field" placeholder="Chọn" clearable>
              <el-option
                v-for="item in viewModel.ListFields"
                :key="item.Name"
                :label="item.Caption + ' (' + item.Name + ')'"
                :value="item.Name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="">
           <el-button @click="addField" class="bButton">Chọn trường</el-button>
          </el-form-item>
        </el-col>
      <!-- </el-form-item> -->
      <el-form-item label="Tiêu đề">
        <el-input v-model="model.Description.Title"></el-input>
      </el-form-item>
      <el-form-item label="Tiêu đề Thêm mới">
        <el-input v-model="model.Description.TitleInsert"></el-input>
      </el-form-item>
      <el-form-item label="Tiêu đề cập nhật">
        <el-input v-model="model.Description.TitleUpdate"></el-input>
      </el-form-item>
      <el-form-item label="Nội dung">
        <froala :tag="'textarea'" :config="configEditor" v-model="model.Description.Content"></froala>
      </el-form-item>
    </el-form>
    <!--
    <div class="wrapper">
      <div class="container" v-dragula="colOne" bag="first-bag">

        <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
      </div>
      <div class="container" v-dragula="colTwo" bag="first-bag">
        <div v-for="text in colTwo">{{text}}</div>
      </div>
    </div>
      -->
  </div>

</template>
<script>
  import Vue from 'vue';
  import VueDragula from 'vue-dragula';
  import PermissionSelector from '@/components/static/PermissionSelector';
  import SelectTree from '@/components/dynamic/SelectTree';

  Vue.use(VueDragula);

  export default {
    props: ['selectedItem', 'isShow', 'isNew', 'closeCallback'],
    components:{VueDragula, PermissionSelector, SelectTree},
    data() {
      return {
        DataGroupTree: [],
        selectedDataGroups: [],
        model: {
          Description:{},
        },
        viewModel: {
          ListDataGroups: [],
        },
        TypeList: [],
        CurrentDataGroup: {},
        configEditor: this.$froOptions,
        // addField: '',
        activeNames: ['1'],
       // isAddNew: false,

        ruleForm: {
          name: '',
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: ""
        },
        rules: {
          name: [
            {
              required: true,
              message: "Please input Activity name",
              trigger: "blur"
            },
            {
              min: 3,
              max: 5,
              message: "Length should be 3 to 5",
              trigger: "blur"
            }
          ],
          region: [
            {
              required: true,
              message: "Please select Activity zone",
              trigger: "change"
            }
          ],
          date1: [
            {
              type: "date",
              required: true,
              message: "Please pick a date",
              trigger: "change"
            }
          ],
          date2: [
            {
              type: "date",
              required: true,
              message: "Please pick a time",
              trigger: "change"
            }
          ],
          type: [
            {
              type: "array",
              required: true,
              message: "Please select at least one activity type",
              trigger: "change"
            }
          ],
          resource: [
            {
              required: true,
              message: "Please select activity resource",
              trigger: "change"
            }
          ],
          desc: [
            {
              required: true,
              message: "Please input activity form",
              trigger: "blur"
            }
          ]
        }
      };
    },

    created() {
      /*
      Vue.vueDragula.options('my-bag', {
        direction: 'vertical'
      })
      */
    },
    mounted() {
      setTimeout(function() {
        $("a:contains('Unlicensed copy of the Froala Editor')").remove();
      }, 900);
      //console.log(this.selectedItem)
      var ctrl = this;
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

        if(ctrl.$Utils.isEmpty(ctrl.selectedItem, 'Description')){
          ctrl.model = ctrl.$Lodash.cloneDeep(ctrl.selectedItem);
          // ctrl.model.Name = ctrl.model.Name;
          ctrl.model.Description = JSON.parse(ctrl.model.Description);
          ctrl.model.Description.Content = ctrl.$Utils.decodeHtmlEntities(ctrl.model.Description.Content);
          if(ctrl.model.Name){
            // ctrl.handleChange(ctrl.model.Name)
            ctrl.viewModel.ListDataGroups.forEach(item => {
              var ret = true;
              if(item.Code === ctrl.model.Name){
                ctrl.selectedDataGroups = [item.ParentId, item.Id];
                // ctrl.$set(ctrl, 'selectedDataGroups', tmp);
                ctrl.handleChange(ctrl.selectedDataGroups);
                ret = false;
              }
              return ret;
            })
          }
        }

      });
     // alert(this.selectedItem);
      //this.isAddNew = (newID === this.$route.query.id);

    },
    ready() {
      // Vue.vueDragula.eventBus.$on('drop', function (args) {
      //   console.log('drop: ' + args[0])
      // })
    },
    watch: {
      selectedItem:{
        handler:function (after, before) {
          //console.log(newItem);
        },
        deep:true
      }

    },
    methods: {
      // openPermissionSelector(){

      //   this.$hub.$emit(
      //     "set-modal-data",
      //     'Cấp quyền',
      //     "60%",
      //     true,
      //     "center",
      //     PermissionSelector,
      //     false,
      //     '',
      //     this.selectedItem.Id
      //   );
      // },
      back(state){
        //this.$router.push('/lists')
        // state = state ? state : false;
        this.resetForm('ruleForm');
        if(this.closeCallback) this.closeCallback(state);

      },
      handleChange(value) {
        var dataGroup = this.viewModel.ListDataGroups.filter((el) => {
          return el.Id == value[value.length - 1];
        })[0];
        this.model.Name = dataGroup.Code
        //console.log(dataGroup)
        if(typeof dataGroup.Description === 'string')
          dataGroup.Description = JSON.parse(dataGroup.Description);
        dataGroup.Fields = '';
        for (var i = 1; i <= dataGroup.Description.FCount; i++) {
          if (dataGroup['F' + i] != undefined)
            dataGroup.Fields += dataGroup['F' + i];
        }
        this.model.Description.DataGroupCaption = dataGroup.Caption;
        this.model.Description.RootData = dataGroup.Description.RootData;
        this.model.Description.DataSource = dataGroup.Description.DataSource;
        this.model.Description.AdditionConditions = dataGroup.Description.AdditionConditions;
        dataGroup.Fields = JSON.parse(dataGroup.Fields);
        this.viewModel.ListFields = dataGroup.Fields;
      },
      addField() {
        if(this.viewModel.Field){
          // console.log(this.viewModel.Field)
          var field = this.viewModel.ListFields.filter((el) => {
            return el.Name == this.viewModel.Field;
          })[0];
          var Token = field.DynamicText != undefined && field.DynamicText != '' ? field.DynamicText : field.Name;
          this.model.Description.Content += "{{" + Token + "}}";
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // handleChange(){},
      submitForm(){
        var ctrl = this;
        var saveObject = ctrl.$Lodash.cloneDeep(ctrl.model)
        saveObject.Value = 'Notification';
        saveObject.Description.Content = saveObject.Description.Content ? ctrl.$Utils.encodeHtmlEntities(saveObject.Description.Content) : '';
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        if (saveObject.Id)
          request = ctrl.$Utils.updateParamsSingleRequest(request, { RequestTemplate: 'SettingNew.Update' });
        else {
          // action = 'insert';
          saveObject.Code = 'Notification.' + ctrl.$Utils.removeVNCharacters(saveObject.Caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5);
          request = ctrl.$Utils.updateParamsSingleRequest(request, {
            RequestTemplate: 'SettingNew.Insert',
            ReferenceId: ctrl.selectedItem.ParentId,
            NestedSetType: 'InsertLastChildNode'
          });
        }
        saveObject.Description.Caption = saveObject.Caption;
        saveObject.Description = JSON.stringify(saveObject.Description);
        ctrl.$Utils.deleteAutoValue(saveObject);
        request = ctrl.$Utils.updateParamsSingleRequest(request, saveObject);
        ctrl.$Utils.postCheckResult(request).then(function(data) {
            if(!saveObject.Id) {
              ctrl.$Utils.linkToRoleEveryone([{
                Id: data.R1.Data,
                Caption: saveObject.Caption,
                Name: saveObject.Code
              }]);
            }
            ctrl.$Utils.showMessage('success', ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf);
            ctrl.back(true);
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .notifi-form{
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
