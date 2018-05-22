<template>
  <div>
    <el-form>
      <el-form-item>&ensp;</el-form-item>
      <el-form-item>
        <el-col :span="1">&ensp;</el-col>
        <el-col :span="2">
          <el-button type="primary" plain>Thêm</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain>Tải</el-button>
        </el-col>
        <el-col :span="19"></el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="1">Show &ensp;</el-col>
        <el-col :span="3">
          <el-select v-model="value2" clearable placeholder="Chọn">
            <el-option
              v-for="item in integers"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="14">entries &ensp;</el-col>
        <el-col :span="1">Tìm  </el-col>
        <el-col :span="5">
          <el-input placeholder="Nhập từ khóa" v-model="input"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="tableData4"
          style="width: 100%"
          max-height="250">
          <el-table-column
            fixed
            prop="index"
            label="STT"
            width="70">
          </el-table-column>
          <el-table-column
            prop="name"
            label="Mã báo cáo"
            width="200">
          </el-table-column>
          <el-table-column
            prop="state"
            label="Tên báo cáo"
            width="300">
          </el-table-column>
          <el-table-column
            prop="city"
            label="Khối dữ liệu"
            width="180">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Xử lý"
            width="130">
            <template slot-scope="scope">
              <el-button  icon="el-icon-edit" @click="editReport(scope.$index, tableData4)"></el-button>
              <el-button  icon="el-icon-delete" @click="centerDialogVisible=true"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button plain>Trước</el-button>
        <el-button v-for="page in integers" :key="page.Id" plain>{{page}}</el-button>
        <el-button plain>Sau</el-button>
      </el-form-item>
      <el-dialog
        title="Cảnh báo"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" >Xóa</el-button>
          <el-button @click="centerDialogVisible = false">Hủy</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>

  import DetailedReport from "@/components/static/DetailedReport.vue";
  export default {
    components: {
      DetailedReport
    },
    data() {
      return {
        centerDialogVisible:false,
        show:false,
        integers: [{
          value: 10
        }, {
          value: 25
        }, {
          value: 50
        }, {
          value: 100
        }],
        value2: '',
        input: '',
        tableData4: [{
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }]
      }
    },
    methods: {
      showEdit(){
        this.show=!this.show;
      },
      editReport(index , rows) {
        var user =rows[index]  ;
        this.$hub.$emit(
          "set-modal-data",
          "Báo cáo chi tiết",
          "90%",
          true,
          "center",
          DetailedReport,
          false,
          '',
          user
        );
        this.$hub.$emit("open-modal");
      },
      closeForm(){
        this.$hub.$emit('close-modal')
      }
    },
    created: function() {

    }
  }
</script>

<style scoped>

</style>
