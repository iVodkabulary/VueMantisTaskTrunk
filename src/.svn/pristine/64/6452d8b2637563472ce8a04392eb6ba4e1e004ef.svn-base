<template>
  <div>
    <el-form >
      <el-form-item>
        Phân quyền cho cấp trên: &ensp;&ensp;
        <el-select v-model="value" placeholder="Chọn">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-tabs type="card" >
            <el-tab-pane label="Phòng Ban">
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
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Tải"
                  width="70">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Xóa"
                  width="70">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Sửa"
                  width="70">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Xem"
                  width="70">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Email"
                  width="80">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Theo dõi"
                  width="90">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Đọc"
                  width="80">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Quản trị"
                  width="90">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Thông báo"
                  width="100">
                  <template slot-scope="scope">
                    <el-checkbox v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Vai trò">
              <el-table
              :data="tableData2"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="Vai trò"
                width="150">
              </el-table-column>
              <el-table-column
                label="Chặn"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Tải"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Xóa"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Sửa"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Xem"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Email"
                width="80">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Theo dõi"
                width="90">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Đọc"
                width="70">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Quản trị"
                width="90">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Thông báo"
                width="100">
                <template slot-scope="scope">
                  <el-checkbox v-model="checked"></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
            </el-tab-pane>
        </el-tabs >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        value:'',
        options: [{
          value: 'Người tạo',
          label: 'Người tạo',
        }, {
          value: 'Phòng ban',
          label: 'Phòng ban'
        },{
          value: 'Theo dõi',
          label: 'Theo dõi'
        },
          {
            value: 'Quyền phòng ban',
            label: 'Quyền phòng ban'
          },
          {
            value: 'Nhân sự liên quan',
            label: 'Nhân sự liên quan'
          },
          {
          value: 'Nhân sự thực hiện',
          label: 'Nhân sự thực hiện'
        }],
        checked: true,
        tableData: [{
          name: 'Trưởng bộ phận'

        }, {
          name: 'Thành viên'
        }],
        tableData2: [{
          name: 'Accounting'
        }, {
          name: 'Leader'
        }, {
          name: 'Editor'
        },{
          name: 'Administrator'
        },
          {
            name: 'Developer'
          },
          {
            name: 'Manager'
          },
          {
            name: 'Member'
          },
          {
            name: 'Customer'
          },
          {
            name: 'Supervisor'
          },
          {
            name: 'Everyone'
          },
          {
            name: 'Officer'
          }
        ]
      }
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
