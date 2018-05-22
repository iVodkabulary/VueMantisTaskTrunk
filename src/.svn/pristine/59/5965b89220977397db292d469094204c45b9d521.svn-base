<template>
  <div>
    <el-tabs type="card">
      <el-tab-pane label="Quyền theo phòng ban">
        <RightsToGroups :model = "modelData"></RightsToGroups>
      </el-tab-pane>
      <el-tab-pane label="Quyền theo vai trò">
        <RightsToRole :model = "modelData"></RightsToRole>
      </el-tab-pane>
      <el-tab-pane label="Quyền theo người dùng">
        <RightsToUser></RightsToUser>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import RightsToGroups from "@/components/static/RightsToGroups.vue";
  import RightsToRole from "@/components/static/RightsToRole.vue";
  import RightsToUser from "@/components/static/RightsToUser.vue";
  export default {
    components: {
      RightsToGroups,
      RightsToRole,
      RightsToUser
    },
    props: ["model"],
    data() {
      return {
        modelData: this.model,
        checked: true,
        tableData: [],
        options5: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value10: [],
        function:{

        }
      }
    },
    methods:{
      addLine(type, line) {
        var ctrl = this;
        ctrl.AddLines[type].push(line);
        switch(type){
          case "Group": {
            $.each(ctrl.permissionModel.listUserGroups, function(key, value){
              if(value.GroupId == line.GroupId){
                ctrl.permissionModel.listUserGroups[key].Selected = true;
                delete ctrl.Group;
              }
            })
            break;
          }
          case "Role": {
            $.each(ctrl.permissionModel.listUserPermissions, function(key, value){
              if(value.GroupId == line.GroupId){
                ctrl.permissionModel.listUserPermissions[key].Selected = true;
                delete ctrl.Role;
              }
            })
            break;
          }
          case "User": {
            $.each(ctrl.permissionModel.listUsers, function(key, value){
              if(value.UserId == line.UserId){
                ctrl.permissionModel.listUsers[key].Selected = true;
                delete ctrl.User;
              }
            })
            break;
          }
          case "Field": {
            $.each(ctrl.CurrentDataGroup.Fields, function(key, value){
              if(value.Id == line.Id){
                ctrl.CurrentDataGroup.Fields[key].Selected = true;
                delete ctrl.Field;
              }
            })
            break;
          }
          default:
            break;
        }
      },
    }
  }
</script>

<style scoped>
  .el-table th {
    background-color: #3e4548;
    color: #fff;
  }

  .el-table--border td, .el-table--border th {
    border-right: 2px solid #f2f3f4;
  }

  .el-dialog--center .el-dialog__header {
    padding-top: 10px;
    background-color: #3e4548;
    color: #fff;
  }

</style>
