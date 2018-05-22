<template>
  <div class="calendar-setting">
    <!--<b-card>-->
      <!--<b-button  @click="createSetting()">Tạo dự án mới</b-button>-->
    <!--</b-card>-->
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Nhập tên dự án" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getSetting(searchText)"></el-button>
        </el-input>
      </el-col>
      <el-col  :span="4">
        <el-button size="mini" @click="editProject()" icon="fa fa-plus"></el-button>
      </el-col>
    </el-row>

    <el-table :data="ListProject" border style="width: 100%">
      <el-table-column label="STT" type='index'>
      </el-table-column>
      <el-table-column label="TÊN TRANG" prop="Name" ></el-table-column>
      <el-table-column label="CÔNG CỤ">
        <template slot-scope="scope">
          <el-button @click="editProject(scope.row)" icon="el-icon-edit"/>
          <el-button @click="removeSetting(scope.row)" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Thông tin thiết lập" :visible.sync="dialogFormVisible" :close-on-click-modal="false" show-close>
      <el-form :model="model"  ref="model" >
        <el-form-item prop="Name"  label-width="180px" size="mini" label="Tên"
        :rules="{
          required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
        }"
        >
          <el-input v-model="model.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="DynamicText" label-width="180px" size="mini" label="Form"
        :rules="{
          required: true, message: 'Form bắt buộc chọn', trigger: 'blur', type: 'object'
        }">
          <el-select v-model="model.DynamicText" placeholder="Chọn cấu hình form" value-key="Code" @change="selectedItemChange">
            <el-option v-for="item in PopupModules" :label="item.Caption" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="Value" label-width="180px" size="mini" label="Trường phân loại"
        :rules="{
          required: true, message: 'Trường bắt buộc chọn', trigger: 'blur'
        }">
          <el-select v-model="model.Value" placeholder="Chọn trường phân loại" v-if="ListSelect">
            <el-option v-for="item in ListSelect" :label="item.Caption" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="NodeType" label-width="180px" size="mini" label="List"
        :rules="{
          required: true, message: 'List bắt buộc chọn', trigger: 'blur'
        }" >
          <el-select v-model="model.NodeType" placeholder="Chọn cấu hình list">
            <el-option v-for="item in ListPage" :label="item.Caption" :value="item.Code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="Attribute" label-width="180px" size="mini" label="Filter"
        :rules="{
          required: true, message: 'Filter bắt buộc chọn', trigger: 'blur'
        }">
          <el-select v-model="model.Attribute" placeholder="Chọn cấu hình Filter" >
            <el-option v-for="item in ListFilter" :label="item.Caption" :value="item.Code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="Extra" label-width="180px" size="mini" label="Xem mặc định"
        :rules="{
          required: true, message: 'Xem mặc định bắt buộc chọn', trigger: 'blur'
        }">
          <el-select v-model="model.Extra" placeholder="Chọn cấu hình Xem mặc định">
            <el-option v-for="item in ListView" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
<!--         <div layout="row">
          <md-button class="md-mini md-default" ng-click="ctrl.showPermission($event)" aria-label="Cấp phép" translate translate-attr-aria-label="" ng-if="ctrl.model.Id">Cấp phép
          </md-button>
        </div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">Lưu</el-button>
        <el-button @click="dialogFormVisible = false">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  // let id = 1000;
  import EditProject from '@/components/static/EditProject'
  export default {
    components: {EditProject},
    data() {
      return {
        ListProject: [],
        searchText: '',
        dialogFormVisible: false,
        model: {},
        formLabelWidth: '100%',
        PopupModules: [],
        ListSelect: [],
        ListPage: [],
        ListFilter: [],
        ListView: [{key:'agendaWeek',value:'Xem theo tuần'},{key:'agendaDay',value:'Xem theo ngày'},{key:'month',value:'Xem theo tháng'}],
      }
    },

  created() {
    this.getSetting();
  },
    methods: {
      getSetting(filter) {
       var request = this.$Lodash.cloneDeep(this.$singleRequest);
       request.R1_RequestTemplate = "Setting.SearchBase";
       request.R1_ParentCode = 'xSetting.Project.Tools.Calendar';
       request.R1_IncludedNestedSetParent = true;
       this.$Utils.postCheckResult(request).then((data) => {
         this.ListProject = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
         this.ParentId = this.$Lodash.cloneDeep(this.ListProject[0].Id);
         this.ListProject.shift();
         if(filter){
           this.ListProject =  this.ListProject.filter(function (item) {
             return item.Name.toLocaleLowerCase().indexOf(filter.toLowerCase()) >-1;
           })
         }
       });

     },
    save() {
      var ctrl = this;
     // console.log(ctrl.$refs)
      ctrl.$refs['model'].validate((valid) => {
        if (valid) {
          if(ctrl.$Utils.isEmpty(ctrl.model.DynamicText, 'Code')){
            ctrl.model.DynamicText = ctrl.$Lodash.cloneDeep(ctrl.model.DynamicText.Code);
            ctrl.$Utils.saveSelectModel(ctrl);
            var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            request.R1_RequestTemplate = 'Setting.Update';

            if (ctrl.model.Id == undefined || ctrl.model.Id == '') {
              request.R1_ReferenceId = this.ParentId;
              request.R1_RequestTemplate = 'Setting.Insert';
              request.R1_NestedSetType = 'InsertLastChildNode';
            }
            request = ctrl.$Utils.updateParamsSingleRequest(request, ctrl.model);
            ctrl.$Utils.postCheckResult(request).then(function (data) {
              if (data.success) {
                ctrl.$Utils.showMessage('success', ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf);
                if(request.R1_RequestTemplate == 'Setting.Insert'){
                  ctrl.$Utils.linkToRoleEveryone([{
                    Id: data.R1.Data,
                    Caption: ctrl.model.Name
                  }])
                }
                ctrl.getSetting();
                ctrl.dialogFormVisible = false
              }
              else
                ctrl.$Utils.showMessage('error', ctrl.$toastMessage.updateItemFailed);
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    editProject(setting) {
      var ctrl = this;
      // var user =data  ;
      // var dataToPass = {user: user, search: this.getSetting}
      //  this.$hub.$emit(
      //    "set-modal-data",
      //    "Sửa lịch biểu",
      //    "70%",
      //    true,
      //    "center",
      //    EditProject,
      //    false,
      //    'EditProject',
      //    dataToPass
      //  );
      //  this.$hub.$emit("open-modal");
      ctrl.dialogFormVisible = true
      // ctrl.editData = data;

      ctrl.model = {};
      ctrl.viewModel = {Data: {Fields: []}};
      if(ctrl.$Utils.isEmpty(setting)){
        ctrl.model = ctrl.$Lodash.cloneDeep(setting)
        //console.log(ctrl.model)
      }

      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
      request.R1_RequestTemplate = 'Setting.SearchBase';
      request.R1_ParentCode = 'xSetting.Project.List';
      ctrl.$Utils.post(request).then(function (data) {
        data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
        ctrl.ListPage = data;
        ctrl.baseList = ctrl.$Lodash.cloneDeep(data);
        data.forEach(function (item) {

          if (item.Description != undefined) {
            item.Description = JSON.parse(item.Description);
            item.Caption = item.Description.Caption;
          }
        })
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = 'Setting.SearchBase';
          request.R1_ParentCode = 'xSetting.Project.Filter';
          ctrl.$Utils.post(request).then(function (data) {
            data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            ctrl.ListFilter = data;
            ctrl.baseFilter = ctrl.$Lodash.cloneDeep(data);
            data.forEach(function (item) {
              if (item.Description != undefined) {
                item.Description = JSON.parse(item.Description);
                item.Caption = item.Description.Caption;
              }
            })
            var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            request.R1_RequestTemplate = 'Setting.SearchBase';
            request.R1_ParentCode = 'xSetting.Project.Form';
            ctrl.$Utils.postCheckResult(request).then(function (data) {
              data = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
              ctrl.PopupModules = data;
              data.forEach(function (item) {
                if (item.Description != undefined) {
                  item.Description = JSON.parse(item.Description);
                  item.Caption = item.Description.Caption;
                }
              })
              data.forEach(function (item) {
                if (ctrl.model.DynamicText == item.Code) {
                  ctrl.model.DynamicText = item;
                  ctrl.selectedItemChange(true);
                }
              });
            });
          });
      });
     },
     selectedItemChange(status) {
      var ctrl = this;
      for(var i = 1; i <= ctrl.model.DynamicText.Description.FCount; i++){
        if(i == 1)
          ctrl.ListField = "";
        ctrl.ListField += ctrl.model.DynamicText['F'+ i]
      }
      ctrl.ListField = JSON.parse(ctrl.ListField)
      ctrl.ListSelect = [];
      $.each(ctrl.ListField, function(key, value){
        if(value.FieldColumnType == "DateTime")
          ctrl.ListSelect.push(value)
        // if (ctrl.model.Value == value.Name) {
        //   ctrl.model.Value = value;
        // }
      })
      ctrl.ListFilter = [];
      // ctrl.model.Attribute = ctrl.$Utils.isEmpty(status) ? ctrl.model.Attribute : [];
      ctrl.baseFilter.forEach(function(item){
        if(item.Name == ctrl.model.DynamicText.Name){
          ctrl.ListFilter.push(item)
        }
        // if(ctrl.$Utils.isEmpty(status) && ctrl.model.Attribute == item.Code){
        //   ctrl.model.Attribute = item;
        // }
      })
      ctrl.ListPage = [];
      // ctrl.model.NodeType = ctrl.$Utils.isEmpty(status) ? ctrl.model.NodeType : [];
      ctrl.baseList.forEach(function(item){
        if(item.Name == ctrl.model.DynamicText.Name){
          ctrl.ListPage.push(item)
        }
        // if(ctrl.$Utils.isEmpty(status) && ctrl.model.NodeType == item.Code){
        //   ctrl.model.NodeType = item;
        // }
      })
    },
     removeSetting(data) {
      this.$Utils.showConfirm('Cảnh báo', this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning).then(() => {
        if(this.$Utils.isEmpty(data)){
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "Setting.Delete";
          request.R1_Id = data.Id;
          this.$Utils.postCheckResult(request).then( (dData) =>
           {
            this.getSetting();
          })
        };
         //$mdDialog.hide();
         //dataToPass.function.getSetting();
       })
     },
     // createSetting(){
     //    var user = {}  ;
     //    var dataToPass = {user: user, search: this.getSetting}
     //   this.$hub.$emit(
     //     "set-modal-data",
     //     "Thêm mới lịch biểu",
     //     "70%",
     //     true,
     //     "center",
     //     EditProject,
     //     false,
     //     'EditProject',
     //     dataToPass
     //   );
     //   // this.$hub.$emit("open-modal");
     // }


    }
  };
</script>
<style lang="scss">
  .calendar-setting {
    .el-select {
      width: 100%;
    }
  }
</style>
