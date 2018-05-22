<template>
  <div>
    <el-form >
      <el-form-item>
        <el-select v-model="value" placeholder="Chọn">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value" :key="item.Id">
          </el-option>
        </el-select>
        <el-button type="primary">Thêm</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Trường dữ liệu"
            width="150">
          </el-table-column>
          <el-table-column
            label="Chặn"
            width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Tải"
            width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Xóa"
            width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Sửa"
            width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Xem"
            width="60">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Email"
            width="70">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Theo dõi"
            width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Đọc"
            width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Quản trị"
            width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="Thông báo"
            width="90">
            <template slot-scope="scope">
              <el-checkbox v-model="checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            width="130"
            label="Bảng dữ liệu">
            <template slot-scope="scope">
              <el-select v-model="value2" placeholder="Chọn">
                <el-option
                  v-for="item in options2"
                  :label="item.label"
                  :value="item.value" :key="item.Id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>


  export default {
    data() {
      return {
        options: [{
          value: 'Người tạo',
          label: 'Người tạo',
        }, {
          value: 'Phòng ban',
          label: 'Phòng ban'
        }, {
          value: 'Nhân sự liên quan',
          label: 'Nhân sự liên quan'
        }],
        value: ''
        ,
        value2: '',
        options2: [{
          value: 'Nhân sự',
          label: 'Nhân sự',
        },
          {
            value: 'Phòng ban',
            label: 'Phòng ban',
          }
        ],
        checked: true,
        tableData: [{
          name: 'Tổ chức'

        }, {
          name: 'Quản lý'
        }, {
          name: 'Nhân sự thực hiện'

        }, {
          name: 'Theo dõi'

        },{
          name: 'Quyền phòng ban'
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
