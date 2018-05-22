<template>
  <div>
    <el-tabs v-model="activeName" :tab-position="tabPosition" >
      <el-tab-pane label="Người dùng" name="first">
        <UIUsers />
        <!-- Phân quyền task -->
      </el-tab-pane>
      <el-tab-pane label="Phân quyền task" name="second">
        <FormCfg v-if="activeName==='second'" :selectedItem ="taskFormSettings"/>
      </el-tab-pane>
      <el-tab-pane label="Phân quyền tài liệu" name="third">
        <FormCfg v-if="activeName==='third'" :selectedItem ="docFormSettings"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

 <script>

import UserInfo from "@/components/static/UserInfo";
import ChangeThePassword from "@/components/static/ChangeThePassword";
import FormCfg from "@/components/static/advance/Form";
import UIUsers from "@/components/static/advance/Users";
 export default {
   components: {
     UserInfo,ChangeThePassword,FormCfg,UIUsers
   },
   data() {
     return {
       taskCode : "Form.task.0d1c1",
       taskFormSettings: {},
       docCode : "Form.cap-nhat-tai-lieu.0b27c",
       docFormSettings: {},
       activeName: 'first',
       tableData: [],
       temp : [],
       centerDialogVisible: false,
       tabPosition: 'top',
       valueAction:'Hoạt động',
       valueNotAction:'',
       searchInput:"",
     }
   },
   watch : {
     searchInput: function(newVal)  {
       if(newVal == null || newVal.trim() == ''){
        this.tableData = this.temp;
       } else {
         this.tableData = this.tableData.filter(ele => {
           return ele.Username.toLowerCase().indexOf(newVal.toLowerCase()) > -1
         })
       }
     }
   },
   methods: {
     search(ten, rows){
       rows.filter(row => {
         return row.Username.indexOf(ten) > -1
       });

     },
     changePass(index , rows) {
       var user =rows[index]  ;
       this.$hub.$emit(
         "set-modal-data",
         "Thay đổi mật khẩu",
         "70%",
         true,
         "center",
         ChangeThePassword,
         false,
         '',
         user
       );
     },
     editUser(index , rows) {
      var user =rows[index]  ;
       this.$hub.$emit(
         "set-modal-data",
         "Sửa thông tin người dùng",
         "80%",
         true,
         "center",
         UserInfo,
         true,
         '',
         {action: 'edit', item:this.userModel}
       );
     },
     indexMethod(index){
       return index+1;
     },
     getUsers(){
       var request = {
         RequestAction:'SearchUserWithGroups',
         IncludedGroupManager:true,
         RequestClass:'BPM',
         RequestDataType:'json',
         ConditionFields:'IncludedGroupManager;Group;Status;LoginName;UserId',
         StaticFields:'UserId;Username;LoginName;Description;Status;',
         DynamicFields:'Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone',
         StructFields:'GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification',
         OrderFields:'LoginName ASC',
         GroupType:1,
         Status:1
       }
       this.$Utils.post(request)
         .then(response => {
            //console.log('error ', response);
           this.tableData = this.$Utils.getDataWithRoot(response, 'Data.UserDS.User'); // response.data.Data.UserDS.User;
            //console.log('error ', this.tableData);
           this.temp = this.tableData;
         }, (response)=> {
           //console.log('error ', response);
         });
     },
     getTaskDocumentFormSetting(){
       var request = {
         RequestClass: "xBase",
         RequestAction: "Request",
         TotalRequests: 2,
         R1_RequestTemplate: "SettingNew.SearchSetting",
         R1_ParentCode: "xSetting.Project.Form",
         R1_Level: 4,
         R1_Code: this.taskCode,
         R2_RequestTemplate: "SettingNew.SearchSetting",
         R2_ParentCode: "xSetting.Project.Form",
         R2_Level: 4,
         R2_Code: this.docCode,
         SessionId: this.sessionId
       };
       this.$Utils.post(request).then(response => {
         this.taskFormSettings = this.$Utils.getDataWithRoot(response.R1,"Data.DynamicDS.Setting")[0];
         this.docFormSettings = this.$Utils.getDataWithRoot(response.R2,"Data.DynamicDS.Setting")[0];
       });
     },
   },

   created(){
     this.getUsers();
     this.getTaskDocumentFormSetting();
   },
 }
 </script>

  <style lang="scss" scoped>
    .el-table th{
      background-color:#3e4548;
      color: #fff;
    }
    .el-table--border td, .el-table--border th{
      border-right:2px solid #f2f3f4;
    }
    .el-dialog--center .el-dialog__header{
      padding-top: 10px;
      background-color:#3e4548;
      color: #fff;
    }
    .el-tabs__header {
      margin: 0 0 5px !important;
    }
  </style>
