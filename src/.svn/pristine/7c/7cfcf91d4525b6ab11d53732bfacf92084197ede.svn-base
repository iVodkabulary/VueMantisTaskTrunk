<template>
  <div>
    <el-form>
      <el-form-item label="Tên nhóm">
        <el-input v-model="model.Caption"/>
      </el-form-item>
      <el-form-item label="Quyền hiển thị">
        <el-select v-model="model.UserPermissions" multiple clearable>
          <el-option-group label="Người dùng">
            <el-option v-if="viewModel.UserPermissions" v-for="item in viewModel.UserPermissions" :value="item.GroupId"
                       :label="item.GroupName"></el-option>
          </el-option-group>

          <el-option-group label="Phòng ban">
            <div v-for="item in viewModel.GroupPermissions">
              <el-option :value="item.GroupId" :label="item.GroupName"></el-option>
              <el-option v-if="viewModel.RolePermissions[item.GroupId]" v-for="child in viewModel.RolePermissions[item.GroupId]" :value="child.GroupId"
                         :label="'--' + child.GroupName"></el-option>
            </div>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="Quyền nhân sự">
        <el-select v-model="model.listUsers" multiple>
          <el-option v-if="viewModel.listUsers" v-for="item in viewModel.listUsers" :value="item.UserId" :label="item.LoginName">
            <span style="float: left">{{ item.LoginName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Username }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Menu Icon">
        <el-input v-model="model.MenuIcon"/>
      </el-form-item>
      <el-form-item label="Flex">
        <el-input v-model="model.Flex"/>
      </el-form-item>
      <el-form-item label="Flex SM">
        <el-input v-model="model.FlexSM"/>
      </el-form-item>
      <el-form-item label="Flex XS">
        <el-input v-model="model.FlexXS"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="save">Lưu</el-button>
        <el-button @click="cancel">Đóng</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "page-advance-group-info",
    props: ['data'],
    data() {
      var dat = {
        model: {
          Caption: '',
          UserPermissions: [],
          listUsers: [],
          MenuIcon: '',
          Flex: '',
          GroupDisplayType: 'Default',
          FlexSM: 50,
          FlexXS: 100,
          action: '',
          children:[],
          level: '0',
        },
        viewModel: {
          UserPermissions: this.data.scope.viewModel.UserPermissions,
          GroupPermissions: this.data.scope.viewModel.GroupPermissions,
          RolePermissions: this.data.scope.viewModel.RolePermissions,
          listUsers: this.data.scope.viewModel.listUsers,
        },
        centerDialogVisible: true,
        treeLst: this.data.scope.model.ObjectFields,
        dataToPass: this.data,
      };
      return dat;
    },
    methods: {
      save() {
        var ctrl = this;
        if (ctrl.data.action == 'edit') {
          ctrl.treeLst.splice(ctrl.data.index, 1);
          ctrl.treeLst.splice(ctrl.data.index, 0, ctrl.model);
        }else{
          ctrl.treeLst.push(ctrl.model);
        }
        ctrl.$hub.$emit('reloadFieldTree');
        ctrl.clearModel();
      },
      cancel() {
        this.$hub.$emit('close-modal')
      },
      clearModel() {
        this.$hub.$emit('close-modal')
      }
    },
    created() {
      var ctrl = this;
      if (ctrl.data.action == 'edit') {
        ctrl.action = 'edit';
        var model = ctrl.$Lodash.cloneDeep(ctrl.data.item);
        $.each(model, (k, v)=>{
            ctrl.$set(ctrl.model,k,v);
        })
      }
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
</style>
