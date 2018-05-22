<template>
  <div id="tTbl" >
    <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
      <el-row>
      </el-row>
      <el-tooltip content="Thêm mới mục tiêu" placement="top" v-if="editableUser && !$isMobileDevice">
        <el-button size="mini" icon="fa fa-plus" @click="addNewTarget()"></el-button>
      </el-tooltip>
      <el-button  v-if="editableUser && $isMobileDevice" size="mini" icon="fa fa-plus" @click="addNewTarget()"></el-button>
    </div>
    <el-table :data="dtSrc" border empty-text="Không có dữ liệu">
      <el-table-column label="" width="50px">
        <template slot-scope="scope">
          <div style="text-align: center;cursor: pointer" @click="openTargetDetail(scope.row)">
            <i class="fa-lg icon-magnifier-add" ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-tree-column prop="Name" label="Tên" levelKey="level" treeKey="Id" parentKey="ParentId"></el-table-tree-column>
      <el-table-column prop="Progress" label="Hoàn thành" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(isNaN(scope.row.Progress)?0:scope.row.Progress)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="TargetType" label="Loại" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          {{targetsObj[scope.row.TargetType]?targetsObj[scope.row.TargetType].Name:'---'}}
        </template>
      </el-table-column>
      <el-table-column prop="Plan" label="Kế hoạch" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="Done" label="Đạt được" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="Unit" label="Đơn vị" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="Owner" label="Người quản lý" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <div>
            <img v-if="userWithAvatarLst[scope.row.Owner]!=undefined" class = 'avatar' style='margin: 8px 10px 0 0;' height='35' width='35' :title="userWithAvatarLst[scope.row.Owner].Username"
                 :src="loadAvatar(userWithAvatarLst[scope.row.Owner].Avatar)" />
            <span v-else>{{scope.row.OwnerName}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>


  </div>

</template>

<script>
  import Vue from 'vue'
  import ElTableTreeColumn from  'element-tree-grid/src/index.js';
  import ElTreeGrid from 'element-tree-grid';
  import TargetDialog from '@/components/static/TargetDialog'
  Vue.use(require('vue-moment'));
  export default {
    props:["targetLst", "options", "typeLst", "workerLst", "departmentLst", "targetFieldLst", "getTargets", "getObject", "rootId", "targetSavedLst"],
    components:{ElTreeGrid,ElTableTreeColumn},
    data() {
      return {
        dtSrc:[],
        userWithAvatarLst: [],
        editableUser: false
      }
    },
    methods: {
      loadAvatar(avatar){
       if(avatar == undefined) avatar = 'assets/images/avatars/profile.png';
       avatar = avatar.replace('profile.jpg', 'profile.png');
                var strAvatar =
                  avatar === "assets/images/avatars/profile.png"
                    ? this.$appUri.BaseURL + avatar
                    : this.$appUri.BaseURL + avatar.replace('/','') + "&Height=50&Width=50";
      return strAvatar;
     },
      openTargetDetail(row){
        var dataToPass = {
          item: row,
          workers: this.workerLst,
          // departments:this.departmentLst,
          isEditable:false,
          targetLst:this.targetLst,
          departmentLst:this.departmentLst,
          disabled:true,
          targetFields:JSON.parse(this.targetFieldLst),
          getTargets:this.getTargets,
          getObject:this.getObject,
          targetSavedLst:this.targetSavedLst,
        };
        this.$hub.$emit(
          "set-modal-data",
          "",
          "50%",
          true,
          "center",
          TargetDialog,
          false,
          "",
          dataToPass,
          true
        );
        this.$hub.$emit("open-modal");
      },
      addNewTarget(){
        if(this.targetFieldLst && this.targetFieldLst.constructor != Array) return;
        var dataToPass = {item: {},
          workers: this.workerLst,
          departments:this.departmentLst,
          isEditable:true,
          targetLst:this.targetLst,
          departmentLst:this.departmentLst,
          disabled:false,
          targetFields:JSON.parse(this.targetFieldLst),
          rootId:this.rootId,
          getTargets:this.getTargets,
          getObject:this.getObject,
          targetSavedLst:this.targetSavedLst,
        };
        this.$hub.$emit(
          "set-modal-data",
          "",
          "50%",
          true,
          "center",
          TargetDialog,
          false,
          "",
          dataToPass,
          false
        );
        this.$hub.$emit("open-modal");
      },
    },
    watch: {
      targetLst: function(val){
          this.dtSrc = this.$Utils.treeify(val, this.options.key, this.options.parentKey, 'level');
      },
    },
    created(){
      this.userWithAvatarLst = this.$Utils.rotateDementionArr(this.workerLst, 'UserId');
      this.targetsObj = this.$Utils.rotateDementionArr(this.typeLst, 'Id');
      this.dtSrc = this.$Utils.treeify(this.targetLst, this.options.key, this.options.parentKey, 'level');
      var user = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser));
      if (this.$isSystemAdmin() || this.$isMantisAdmin()) {
        this.editableUser = true;
      } else if (user.GroupRoles) {
        if (
          (user.GroupRoles.Leader && user.GroupRoles.Leader.indexOf(user.Project.GroupId) > -1) ||
          (user.GroupRoles.Director && user.GroupRoles.Director.indexOf(user.Project.GroupId) > -1)
        ) {
          this.editableUser = true;
        }
      } else {
        this.editableUser = false;
      }
    },
  };
</script>

<style lang="scss">
  #tTbl {
    #plusBtn {
      position: fixed;
      top: 120px;
      right: 30px;
      z-index: 99;
      cursor: pointer;
    }
  }
</style>
