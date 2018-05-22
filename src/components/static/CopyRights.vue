<template>
  <div>
    <el-col :span="3">
      Trường dữ liệu:
    </el-col>
    <el-col :span="21">
      <el-select v-model="valueSelect" multiple placeholder="Chọn" style="width: 100%">
        <el-option
          v-for="item in dataField"
          :key="item.Name"
          :label="item.Caption"
          :value="item.Name">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="24">&ensp;</el-col>
    <el-col :span="3">
      Nhập mã trực tiếp:
    </el-col>
    <el-col :span="6">
      <el-input placeholder="Nhập mã trực tiếp..." v-model="input"></el-input>
    </el-col>
    <el-col :span="1">&ensp;</el-col>
    <el-col :span="6">

      <el-checkbox v-model="checked">Bao gồm thông tin người dùng</el-checkbox>
    </el-col>
    <el-col :span="11">&ensp;</el-col>
    <el-col :span="12">
      Mã Template lấy dữ liệu: &ensp; &ensp;
      <el-input placeholder="Mã Template lấy dữ liệu" v-model="template"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="11">
      Đường dẫn gốc: &ensp; &ensp;
      <el-input placeholder="Đường dẫn gốc" v-model="dataroot"></el-input>
    </el-col>
    <el-col :span="12">
      Mã: &ensp; &ensp;
      <el-input placeholder="Mã" v-model="formCode"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="11">
      Mã riêng tư: &ensp; &ensp;
      <el-input placeholder="Mã riêng tư" v-model="code"></el-input>
    </el-col>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        valueSelect: [],
        template: '',
        input:'',
        dataroot:'',
        formCode:'',
        code:'',
        checked: true,
        dataField:[],
        valueDataField:''
      }
    },
    methods: {
      loadDataField(){
        var req={
          RequestClass:'xBase',
          RequestAction:'Request',
          TotalRequests:1,
          R1_RequestTemplate:'SettingNew.SearchSetting',
          R1_Code:'DataGroup.danh-sach-cong-viec.04b66',
        }
        this.$Utils.post(req).then(response => {
          this.valueDataField=response.R1.Data.DynamicDS.Setting;
          this.dataField=JSON.parse(this.valueDataField.F1+this.valueDataField.F2+this.valueDataField.F3+this.valueDataField.F4);
         // console.log(this.dataField)
        });

      }
    },
    mounted(){
      this.loadDataField();

    },
    created(){
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
