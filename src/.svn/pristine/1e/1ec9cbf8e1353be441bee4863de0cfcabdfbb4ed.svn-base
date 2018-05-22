<template>
  <div style="margin: 20px;">
    <el-form :label-position="labelPosition" label-width="100px" v-if="data.radio == 1">
      <el-form-item label="Tên">
        <el-input v-model="model.Name"></el-input>
      </el-form-item>
      <el-form-item label="Mã">
        <el-input v-model="model.Code"></el-input>
      </el-form-item>
      <el-form-item label="Mầu">
        <el-color-picker v-model="model.Color"></el-color-picker>
      </el-form-item>
      <el-form-item label="Giá trị">
        <el-input v-model="model.Value"></el-input>
      </el-form-item>
      <el-form-item label="Tên hiển thị">
        <el-input v-model="model.Caption"></el-input>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="model.Id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input type="textarea" v-model="model.Description"></el-input>
      </el-form-item>
      <el-form-item label="Đồng  bộ dữ liệu" v-if="model.Id">
        <el-switch v-model="Migrate">
        </el-switch>
      </el-form-item>
      <el-form-item>
      <el-button @click="openPermissionSelector()"  v-if="model.Id">Phân quyền</el-button>
      </el-form-item>
      <el-form-item>
        <el-col :span="5">&ensp;</el-col>
        <el-col :span="14">
          <el-button type="primary" @click="addPara()">Lưu</el-button>
          <el-button @click="closeForm()">Đóng</el-button>
        </el-col>
        <el-col :span="5">&ensp;</el-col>
      </el-form-item>
    </el-form>

    <el-form label-position="top" label-width="100px" v-else>
      <el-form-item label="">
        <el-col :span="8">
          <label>Tên</label>
          <el-input v-model="model.Name"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Mã</label>
          <el-input v-model="model.Code"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Type</label>
          <el-input v-model="model.DataType"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="8">
          <label>Library</label>
          <el-input v-model="model.Library"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Class</label>
          <el-input v-model="model.Class"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Action</label>
          <el-input v-model="model.Action"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="8">
          <label>Conditions</label>
          <el-input v-model="model.Conditions"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Statics</label>
          <el-input v-model="model.Statics"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Structs</label>
          <el-input v-model="model.Structs"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Dynamics">
          <el-input type="textarea" autosize v-model="model.Dynamics"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="12">
          <label>Orders</label>
          <el-input v-model="model.Orders"></el-input>
        </el-col>
        <el-col :span="12">
          <label>Parameters</label>
          <el-input v-model="model.Parameters"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="12">
          <label>EncodedParameters</label>
          <el-input v-model="model.EncodedParameters"></el-input>
        </el-col>
        <el-col :span="12">
          <label>Settings</label>
          <el-input v-model="model.Settings"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item>
      <el-button  @click="openPermissionSelector()">Phân quyền</el-button>
      </el-form-item> -->
      <el-form-item>
<!--         <el-col :span="5">&ensp;</el-col>
        <el-col :span="14"> -->
          <el-button type="primary" @click="addPara()">Lưu</el-button>
          <el-button @click="closeForm()">Đóng</el-button>
<!--         </el-col>
        <el-col :span="5">&ensp;</el-col> -->
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import PermissionSelector from '@/components/static/PermissionSelector';

  export default {
    props:['data'],
    components: {PermissionSelector},
    data() {
      return {
        model: this.$Lodash.cloneDeep(this.data.data),
        labelPosition: 'right',
        // name:this.data.data.Name,
        // code:this.data.data.Code,
        // color:this.data.data.Color,
        // value:this.data.data.Value,
        // dislayName:this.data.data.Caption,
        // id:this.data.data.Id,
        // description:this.data.data.Description,
        Migrate: false,
        value1:true,
      };
    },
    methods:{
      addPara(){

          var req = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: 1,
            R1_RequestTemplate: 'Setting.Update'
          }
          if(!this.data.data.Id){
            req.R1_RequestTemplate = 'Setting.Insert';
            req.R1_NestedSetType = 'InsertLastChildNode';
            req.R1_ReferenceId = this.model.ParentId;
          } else if(this.Migrate == true){
            req.R1_RequestTemplate = 'Setting.MigrateSetting';
          }
          req = this.$Utils.updateParamsSingleRequest(req, this.model);
          this.$Utils.post(req).then(res => {

                this.data.loadData()

              this.closeForm()

          });


      },
      closeForm() {
        this.$hub.$emit('close-modal')
      },
      openPermissionSelector(){
        this.$hub.$emit(
          "set-modal-data",
          'Cấp quyền',
          "60%",
          true,
          "center",
          PermissionSelector,
          false,
          '',
          this.model.Id
        );
      },
    },
    mounted(){

    },
    created(){
      var ctrl = this;
      if(this.model.Id){
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'Setting.SearchSetting',
          R1_Id: this.model.Id,//'xSetting.Project.Parameter',
        }
        this.$Utils.postCheckResult(request).then(data => {
          this.model = this.$Utils.getDataWithRoot(data.R1, "Data.DynamicDS.Setting")[0];
        })
      }
    }
  }
</script>
