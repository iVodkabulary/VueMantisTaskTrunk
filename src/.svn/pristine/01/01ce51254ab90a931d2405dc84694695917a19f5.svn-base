<template>
  <div>
            <el-col :span="6">
              <el-select v-model="value" placeholder="Chọn">
                <el-option
                  v-for="item in users"
                  :key="item.UserId"
                  :label="item.Username"
                  :value="item.UserId">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary">Thêm</el-button>
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
    data() {
      return {
        checked: true,
        tableData:[],
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
        value: '',
        users:[]
      }
    },
    methods:{
      loadUsers(){
        var usr = {
          RequestAction: 'SearchUserWithGroups',
          IncludedGroupManager: true,
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'IncludedGroupManager;Group;Status',
          Status: 1,
          GroupType: 1,
          StaticFields: 'UserId;Username;LoginName',
          OrderFields: 'LoginName ASC'
        };
        this.$Utils.post(usr).then(response => {
          this.users=response.Data.UserDS.User;

        });
      }
    },
    mounted(){
      this.loadUsers();
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
