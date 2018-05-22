<template>
  <div class="project-setting">
    <!--<b-card>-->
      <!--<b-button  @click="createProject()">Tạo dự án mới</b-button>-->
    <!--</b-card>-->
    <el-row>

      <el-col  :span="12">
        <el-button size="mini" @click="createProject()" icon="fa fa-plus"></el-button>
      </el-col>
      <el-col :span="12">
        <el-input placeholder="Nhập tên dự án" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getProject(searchText)"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table :data="ListProject" border style="width: 100%">
      <el-table-column label="Tên" >
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="editProject(scope.row)">{{scope.row.Name}}</a>
<!--           <span class="link">{{scope.row.Name}}</span>
 -->        </template>
      </el-table-column>
      <el-table-column label="Mô tả" prop="Describe" ></el-table-column>
      <el-table-column label="Phòng ban" prop="DepartmentName"></el-table-column>
      <el-table-column label="Hành động" width="100px">
        <template slot-scope="scope">
          <el-button @click="removeProject(scope.row.Id)" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
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
      }
    },

  created() {
    this.getProject();
  },
    methods: {
      getProject(filter) {
       var request = this.$Lodash.cloneDeep(this.$singleRequest);
       request.R1_RequestTemplate = "xDocument_Document.Search";
       request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
       request.R1_RequestFields = "Id;Tool;TypeName;Name;ManagerName;StatusName;StateName;PermitName;Progress;DepartmentName;PlanManHour;ActualManHour;FinishDate;PriorityName;ProductName;StartDate;Version;Code;CreatedBy;Department;Id;Manager;ModifiedBy;Priority;PriorityDescription;PriorityId;State;Status;Type;Permit;Describe;Active;ActiveName;ProjectCode;Department;DepartmentName;Manager;ManagerName;Worker;WorkerName";
       request.R1_Code = "Project";
       this.$Utils.postCheckResult(request).then((data) => {
         this.ListProject = this.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document');
         if(filter){
           this.ListProject =  this.ListProject.filter(function (item) {
             return item.Name.toLocaleLowerCase().indexOf(filter.toLowerCase()) >-1;
           })
         }
       });
     },
     editProject(data) {
      var user = data  ;
      var dataToPass = {user: user, search: this.getProject}
       this.$hub.$emit(
         "set-modal-data",
         "Sửa thông tin dự án",
         "70%",
         true,
         "center",
         EditProject,
         false,
         '',
         dataToPass
       );
     },
     removeProject(data) {
      this.$Utils.showConfirm('Cảnh báo', this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning).then(() => {
         var searchRequest = {
           RequestClass: 'xBase',
           RequestAction: 'Request',
           TotalRequests: 4,
           // category
           R1_RequestTemplate: 'Setting.SearchBase',
           R1_ParentCode: 'xSetting.Project.Parameter.Project.Category',
           R1_Value: data,

           // target
           R2_RequestTemplate: 'Setting.SearchBase',
           R2_ParentCode: 'xSetting.Project.Parameter.Project.Target',
           R2_Value: data,
           // task
           R3_RequestTemplate: 'AG_Task_Task.Search',
           R3_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
           R3_RequestFields: 'Id;Index;State',
           R3_Project: data,
           // version
           R4_RequestTemplate: 'xDocument_Document.Search',
           R4_RequestDataGroup: 'DataGroup.quan-ly-version.0ad08',
           R4_Code: 'Version',
           R4_Project: data,
           // group
         }
         this.$Utils.post(searchRequest).then((dataS) => {
           var requestDel = this.$Lodash.cloneDeep(this.$singleRequest);
           requestDel.R1_RequestTemplate = "xDocument_Document.Delete";
           requestDel.R1_Id = data;
           requestDel.R1_Code = "Project";
           requestDel.TotalRequests = 1;
           var i = 1;
           //caregory request
           var listSetting = this.$Utils.getDataWithRoot(dataS.R1, 'Data.DynamicDS.Setting');
           $.each(listSetting, (key, value) => {
             if (value) {
               i++;
               requestDel.TotalRequests++;
               requestDel["R" + i + "_RequestTemplate"] = "Setting.Delete";
               requestDel["R" + i + "_Id"] = value.Id;
             }
           });
           // target request
           var listSettings = this.$Utils.getDataWithRoot(dataS.R2, 'Data.DynamicDS.Setting');
           $.each(listSettings, (key, value) => {
             if (value) {
               i++;
               requestDel.TotalRequests++;
               requestDel["R" + i + "_RequestTemplate"] = "Setting.Delete";
               requestDel["R" + i + "_Id"] = value.Id;
             }
           });
           //task request
           var listTask = this.$Utils.getDataWithRoot(dataS.R3, 'Data.TasksDS.Task');
           $.each(listTask, (key, value) => {
             if (value) {
               i++;
               requestDel.TotalRequests++;
               requestDel["R" + i + "_RequestTemplate"] = 'AG_Task_Task.Update';
               requestDel["R" + i + "_RequestDataGroup"] = "DataGroup.danh-sach-cong-viec.04b66";
               requestDel["R" + i + "_Id"] = value.Id;
               requestDel["R" + i + "_State"] = 1;
               requestDel["R" + i + "_RequestFields"] = 'Id;Index;State';

             }
           });
           var listVersion = this.$Utils.getDataWithRoot(dataS.R4, 'Data.DocumentDS.Document');
           $.each(listVersion, (key, value) => {
             if (value) {
               i++;
               requestDel.TotalRequests++;
               requestDel["R" + i + "_RequestTemplate"] = 'xDocument_Document.Delete';
               requestDel["R" + i + "_Code"] = 'Version';
               requestDel["R" + i + "_Id"] = value.Id;
             }
           });
           // request Xoa
           this.$Utils.postCheckResult(requestDel).then((data) => {
             if (data.success) {
               this.$Utils.showMessage('success', this.$toastMessage.deleteItemPre + this.$toastMessage.deleteItemSuf);
               this.getProject();
             }
           });
         })
         //$mdDialog.hide();
         //dataToPass.function.getProject();
       })
     },
     createProject(){
        var user = {}  ;
        var dataToPass = {user: user, search: this.getProject}
       this.$hub.$emit(
         "set-modal-data",
         "Thêm mới dự án",
         "70%",
         true,
         "center",
         EditProject,
         false,
         '',
         dataToPass
       );
     }


    }
  };
</script>
<style lang="scss">
  .project-setting {
    th div {
      text-align: center;
    }
  }

</style>
