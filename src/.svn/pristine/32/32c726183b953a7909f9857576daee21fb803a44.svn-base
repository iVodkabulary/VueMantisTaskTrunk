<template>
  <div class="detail">
    <el-form>
      <el-form-item>
        <el-col :span="2">Tên: </el-col>
        <el-col :span="22">
          <el-input
            placeholder="Please input"
            v-model="input1"
            :disabled="true">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">Mô tả: </el-col>
        <el-col :span="22">
          <el-input
            placeholder="Nhập mô tả..."
            v-model="input2">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item >
        <el-col :span="2">&ensp;</el-col>
        <el-col :span="5">
        <el-checkbox v-model="checked1">Hiển thị biểu đồ</el-checkbox>
      </el-col>
        <el-col :span="5">
          <el-checkbox v-model="checked2">Hiển thị tiêu đề biểu đồ</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="checked3">Hiển thị bảng thống kê</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="checked4">Lấy theo quyền</el-checkbox>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="1">&ensp; </el-col>
        <el-col :span="8">
          <h9>Mã template lấy dữ liệu</h9>
          <el-input placeholder="Mã template lấy dữ liệu" v-model="input1"></el-input>
        </el-col>
        <el-col :span="8">
          <h9>Đường dẫn gốc</h9>
          <el-input placeholder="Đường dẫn gốc" v-model="input1"></el-input>
        </el-col>
        <el-col :span="7">
          <h9>Mã</h9>
          <el-input placeholder="Mã" v-model="input1"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="1">&ensp; </el-col>
        <el-col :span="8">
          <h9>Tỉ lệ biểu đồ</h9>
          <el-input placeholder="Tỉ lệ biểu đồ" v-model="input1"></el-input>
        </el-col>
        <el-col :span="8">
          <h9>Tỉ lệ bảng</h9>
          <el-input placeholder="Tỉ lệ bảng" v-model="input1"></el-input>
        </el-col>
        <el-col :span="7">
          <h9>Kiểu biểu đồ</h9>
          <el-input placeholder="Kiểu biểu đồ" v-model="input1"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">Khối dữ liệu&ensp;</el-col>
        <el-col :span="7">
          <SelectTree :datasource="arr"></SelectTree> &ensp;
        </el-col>
        <el-col :span="3">
          Dữ liệu thêm vào
        </el-col>
        <el-col :span="5">
          <el-select v-model="value" placeholder="Chọn">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          Nhóm: &ensp;
        </el-col>
        <el-col :span="5.5">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">Chính</el-radio>
            <el-radio :label="6">Phụ</el-radio>
            <el-radio :label="9">Đơn vị</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="19">&ensp;</el-col>
        <el-col :span="2">
          <el-button type="primary" plain>Thêm</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain>Thêm tính toán</el-button>
        </el-col>
        <el-col :span="1">&ensp;</el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="8">
          Góc nhìn chính
        <el-card class="box-card">
        </el-card>
        </el-col>
        <el-col :span="8">
          Góc nhìn phụ
          <el-card class="box-card">
          </el-card>
        </el-col>
        <el-col :span="8">
          Đơn vị
          <el-card class="box-card">
          </el-card>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="7">
          Sắp xếp
          <el-select v-model="value" placeholder="Chọn">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          Hướng sắp xếp
          <el-select v-model="value" placeholder="Chọn">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          Số phần tử:
        </el-col>
        <el-col :span="5">
          <el-input placeholder="Nhập số phần tử" v-model="input"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="3">
          Cấu hình thêm:
        </el-col>
        <el-col :span="21">
          <el-input placeholder="Cấu hình thêm" v-model="input"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <h6>Bảng thống kê</h6>
          <el-card class="box-card">
          </el-card>
        </el-col>
        <el-col :span="1">
          &ensp;
        </el-col>
        <el-col :span="11">
          <h6>Biểu đồ kết hợp</h6><br>
          <el-checkbox v-model="checked1">Sử dụng</el-checkbox>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="id"
              label="Tên"
              width="100">
            </el-table-column>
            <el-table-column
              label="Operations">
              <template slot-scope="scope">
                <!--<el-button-->
                  <!--size="mini"-->
                  <!--@click="handleEdit(scope.$index, scope.row)">Edit</el-button>-->
                <el-checkbox v-model="checked1"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="Operations">
              <template slot-scope="scope">
                <el-select v-model="value" placeholder="Chọn">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="10">&ensp;</el-col>
        <el-col :span="4">
        <el-button type="primary">Lưu</el-button>
        <el-button @click="closeForm">Đóng</el-button>
        </el-col>
        <el-col :span="10">&ensp;</el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input1:'Theo trạng thái',
        input:'5',
        input2:'',
        checked1:true,
        checked2:true,
        checked3:true,
        checked4:false,
        arr: [{
          label: 'Level one 1',
          children: [{
            label: 'Level two 1-1',
            children: [{
              label: 'Level three 1-1-1'
            }]
          }]
        }],
        options: [{
          value: 'Option1',
          label: 'Option1'
        }, {
          value: 'Option2',
          label: 'Option2'
        }, {
          value: 'Option3',
          label: 'Option3'
        }, {
          value: 'Option4',
          label: 'Option4'
        }, {
          value: 'Option5',
          label: 'Option5'
        }],
        value: '',
        radio2: 3,
        tableData: [{
          id: '2016-05-03',
          user: false,
          address: 'No. 189, Grove St, Los Angeles'
        }],
        multipleSelection: []
      }
    },
    methods: {
      closeForm(){
        this.$hub.$emit('close-modal')
      }
    },
    created: function() {

    }
  }
</script>

<style lang="scss">
  .detail{
    .box-card {
      height: 350px;
    }
  }
</style>
