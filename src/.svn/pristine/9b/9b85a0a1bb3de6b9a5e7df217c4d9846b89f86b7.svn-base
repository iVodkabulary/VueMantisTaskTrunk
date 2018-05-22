<template>
  <el-tabs v-model="activeTab" @tab-click="handleClick">
    <el-tab-pane label="Theo tổ chức" name="toDeparments">
      <div>
        <el-table :data="departmentTree" border>
          <el-table-tree-column prop="GroupName" label="Tên" levelKey="level" treeKey="GroupId" parentKey="GroupParent"></el-table-tree-column>
          <el-table-column v-for="per in permissionsLst" :label="per.Name" :key="per.Id"
                           v-if="$isSystemAdmin() || ($isMantisAdmin() && per.Code !=='LinkObject') || (!$isMantisAdmin() && (per.Code ==='Download' || per.Code ==='Edit' || per.Code ==='View'))">
            <template slot-scope="scope">
                <el-checkbox v-model="checked[scope.row.GroupId][per.Code]" @change="perChanged(scope.row.GroupId, per.Code, $event)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="manageAble" label="Theo vai trò" name="toRoles">
      <div>
        <el-table :data="roleLst" style="width: 100%">
          <el-table-column prop="GroupName" label="Tên" > </el-table-column>
          <el-table-column v-for="per in permissionsLst" :label="per.Name" :key="per.Id">
            <template slot-scope="scope">
              <el-checkbox v-model="checked[scope.row.GroupId][per.Code]" @change="perChanged(scope.row.GroupId, per.Code, $event)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Theo người dùng" name="toUsers">
      <div >
        <el-table :data="userLst" border>
          <el-table-column prop="Username" label="Tên" > </el-table-column>
          <el-table-column v-for="per in permissionsLst" :label="per.Name" :key="per.Id"
                           v-if="$isSystemAdmin() || ($isMantisAdmin() && per.Code !=='LinkObject') || (!$isMantisAdmin() && (per.Code ==='Download' || per.Code ==='Edit' || per.Code ==='View'))">
            <template slot-scope="scope">
              <el-checkbox v-model="checked[scope.row.UserId][per.Code]" @change="perChanged(scope.row.UserId, per.Code, $event)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  //import Vue from 'vue'
  import ElTableTreeColumn from  'element-tree-grid/src/index.js';
  import ElTreeGrid from 'element-tree-grid';
    export default {
        name: "permission-selector",
      props:["data"],
      components:{ElTreeGrid,ElTableTreeColumn},
      data() {
        return {
          indexCheck:0,
          activeTab: 'toDeparments',
          departmentLst: [],
          departmentTree: [],
          roleOfDeptLst: [],
          roleLst:[],
          userLst:[],
          permissionsLst:[],
          rotatedPermissionsLst:[],
          perCurItemLst:[],
          checked:{},
          manageAble: this.$isSystemAdmin(),
        };
      },
      methods: {
        handleClick(tab, event) {
          // console.log(tab, event);
        },
        perChanged(child, code, status){
          var ctrl = this;
          var req ={};
          if(status){
            req ={
              RequestClass:'xBase',
              Parent: this.data,
              Child: child,
              Code: code,
              RequestAction: 'LinkGroupToObject',
              RequestTemplate: 'Permission.Insert',
              ParentTable: 'xObject',
              ChildTable: 'tblGroup',
            }
          }else{
            req={
              RequestClass:'xBase',
              Parent:this.data,
              Child:child,
              Code:code,
              RequestAction:'RemoveGroupFromObject',
              RequestTemplate:'Permission.Remove',
            }
          }
          ctrl.$Utils.post(req).then(function (data) {
            if(data.success){
              ctrl.$message.success("Thành công")
            }else{
              ctrl.$message.error("Thất bại")
            }
          });

        }
      },
      watch: {
        indexCheck:function (newVal) {
            var ctrl = this;
            if(newVal >= 5){
              ctrl.rotatedPermissionsLst = ctrl.$Utils.rotateDementionArr(ctrl.permissionsLst, 'Code');
              if(ctrl.perCurItemLst)
              if(ctrl.perCurItemLst.constructor === Array){
                ctrl.perCurItemLst.forEach(function (item) {
                  if(ctrl.checked[item.Child]){
                    ctrl.$set(ctrl.checked[item.Child], item.Code, true)
                  }else{
                    ctrl.$set(ctrl.checked[item.Child], item.Code, false)
                  }
                })
              }else if(ctrl.perCurItemLst.constructor === Object){
                if(ctrl.checked[ctrl.perCurItemLst.Child]){
                  ctrl.$set(ctrl.checked[ctrl.perCurItemLst.Child], ctrl.perCurItemLst.Code, true);
                }else {
                  ctrl.$set(ctrl.checked[ctrl.perCurItemLst.Child], ctrl.perCurItemLst.Code, false);
                }
              }

            }
          }
      },
      created(){
          var ctrl = this;
          /*Lấy các nhóm công việc như kế toán, lập trình viên, quản trị viên,...*/
          var rolesReq = {
            //already be an array
            RequestAction: 'SearchGroup',
            RequestClass: 'BPM',
            RequestDataType: 'jsontree',
            ConditionFields: 'GroupType',
            GroupType: 0,
            StaticFields:'GroupId;GroupName;Description;GroupParent'
          }
          this.$Utils.post(rolesReq).then(result => {
              this.roleLst = result;
              result.forEach(function (r) {
                // ctrl.checked[r.GroupId] = {};
                ctrl.$set(ctrl.checked, r.GroupId, {})
              })
              ctrl.indexCheck++;
          });

          /*Lấy các phòng*/
          var departmentsReq = {
            //UserDS.Group
            RequestAction: 'SearchGroup',
            RequestClass: 'BPM',
            RequestDataType: 'json',
            ConditionFields: 'GroupType',
            GroupType: '1;2',
            StaticFields: 'GroupId;GroupName;Description;GroupParent;Status',
            StructFields: 'ParentName',
            orderFields: 'GroupName ASC',
          }
          this.$Utils.post(departmentsReq).then(result => {
              this.departmentLst = result.UserDS.Group;
              result.UserDS.Group.forEach(function (g) {
                // ctrl.checked[g.GroupId] = {};
                ctrl.$set(ctrl.checked, g.GroupId, {})
              })
              this.departmentTree = this.$Utils.treeify(result.UserDS.Group, 'GroupId', 'GroupParent', 'level')
              ctrl.indexCheck++;
          });

          /*Lấy danh sách người dùng trong các phòng ban*/
        var usersReq = {
          //Users Data.UserDS.User
          RequestAction:'SearchUserWithGroups',
          IncludedGroupManager:true,
          RequestClass:'BPM',
          RequestDataType:'json',
          ConditionFields:'IncludedGroupManager;Group;Status;LoginName',
          StaticFields:'UserId;Username;LoginName;Description;Status;',
          DynamicFields:'Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone',
          StructFields:'GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage',
          OrderFields:'LoginName ASC',
          GroupType:1,
        }
          this.$Utils.post(usersReq).then(result => {
              this.userLst = result.Data.UserDS.User.filter((ele)=>{
                return this.manageAble || (ele.LoginName.toLowerCase() != 'superadmin')
              });
              result.Data.UserDS.User.forEach((u)=> {
                // ctrl.checked[u.UserId] = {};
                ctrl.$set(ctrl.checked, u.UserId, {})
              })
              ctrl.indexCheck++;
          });

          /*Lấy danh sách các quyền */
          var permissionsReq = {
              // Các quyền R1.Data.DynamicDS.Setting
              RequestClass:'xBase',
              RequestAction:'Request',
              TotalRequests:1,
              R1_RequestTemplate:'Setting.SearchBase',
              R1_ParentCode:'xSetting.Template.Permissions',
          }
          this.$Utils.post(permissionsReq).then(result => {
              this.permissionsLst = result.R1.Data.DynamicDS.Setting;
              ctrl.indexCheck++;
          });


          /*Lấy danh sách các quyền của tài liệu hiện tại*/
          var perForCurItemReq = {
              //Data.DataDS.Linked
              RequestAction:'SearchLinked',
              RequestClass:'Addition',
              ConditionFields:'Parent;',
              StaticFields:'Code;Child;Parent;Name;Created;Description',
              OrderFields:'Created DESC',
              Parent: this.data
            }
          this.$Utils.post(perForCurItemReq).then(result => {
              this.perCurItemLst = result.Data.DataDS.Linked;
              ctrl.indexCheck++;
          });



      }
    }
</script>

<style scoped>

</style>
