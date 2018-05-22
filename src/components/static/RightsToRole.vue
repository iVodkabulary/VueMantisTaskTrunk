<template>
  <div>
    <el-checkbox v-model="permissionModel.GroupInCludedUser">Bao gồm thông tin người dùng</el-checkbox>
    <br>

    <el-col :span="6">
      <el-select v-model="Role" placeholder="Chọn...">
        <el-option v-for="item in permissionModel.listUserPermissions" :key="item.id" :label="item.text" :value="item.id"
                   v-if="!ctrl.permissionModel['Static'+item.GroupId] && !item.Selected"></el-option>
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="addLine('Role', Role)">Thêm</el-button>
    </el-col>
    <el-col :span="16">&ensp;</el-col>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Phòng ban"
        width="150">
      </el-table-column>
      <el-table-column
        label="Chặn"
        width="70">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Tải"
        width="70">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Xóa"
        width="70">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Sửa"
        width="70">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Xem"
        width="70">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Email"
        width="80">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Theo dõi"
        width="90">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Đọc"
        width="80">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Quản trị"
        width="90">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="Thông báo"
        width="100">
        <!--<template slot-scope="scope">-->
        <!--<el-checkbox v-model="checked"></el-checkbox>-->
        <!--</template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    props: ["model"],
    data() {
      var dat = {};
      dat.permissionModel = this.model;
      dat.permissionModel.GroupInCludedUser = [];
      dat.Role = [];
      return dat;
    },
    methods:{
      loadRoles(){
        var role = {
          RequestAction:'SearchGroup',
          RequestClass:'BPM',
          RequestDataType:'jsontree',
          ConditionFields:'GroupType',
          GroupType:0,
          StaticFields:'GroupId;GroupName;Description;GroupParent'
        };
        this.$Utils.post(role).then(response => {
          this.roles=response;

        });
      }
    },
    mounted(){
      this.loadRoles();
    },
    created(){

    }
  }
</script>

<style scoped>
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

</style>
