<template>
  <div>
    <el-form>
      <el-form-item label="Chuyên mục">
        <el-input placeholder="Chuyên mục" v-model="categorie"></el-input>
      </el-form-item>
      <el-form-item label="Thuộc phòng ban">
        <el-select v-model="valueGroup" multiple placeholder="Chọn phòng ban" style="width: 100%">
          <el-option
            v-for="item in groups"
            :key="item.GroupId"
            :label="item.GroupName"
            :value="item.GroupId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-col :span="8">&ensp;</el-col>
        <el-col :span="8">
          <el-button type="primary" @click="updateCate">Lưu</el-button>
          <el-button @click="closeForm">Đóng</el-button>
        </el-col>
        <el-col :span="8">&ensp;</el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['data'],
    data() {
      return {
        categorie:this.data.Name,
        groups:[],
        valueGroup:[],
        valueGroupName:'',
        valueGroupId:'',
        categories:[],
        itemCate:''
      }
    },
    created(){
      if(this.$Utils.isEmpty(this.data.Value)){
        var arrCate=this.data.Value.split(';');
        arrCate.forEach((item)=>{
          if (item.length>1){
            this.valueGroup.push(item)
          }
        })
      }
    },
    mounted(){
      this.getGroups();
      this.loadCategories();
    },
    methods: {
      getGroups(){
        var req={
          RequestClass:'xBase',
          RequestAction:'Request',
          TotalRequests:1,
          R1_RequestTemplate:'OrgnizationList',
          R1_GroupType:1
        }
        this.$Utils.post(req).then(response => {
          this.groups=response.R1.Data.UserDS.Group;

        })
      },
      updateCate(){
        this.groups.forEach((item) => {
          this.valueGroup.forEach((id)=>{
            if(id==item.GroupId){
              this.valueGroupName+=item.GroupName;
              this.valueGroupId+=id+';';
            }
          })
        })
        var req={
          RequestClass:'xBase',
          RequestAction:'Request',
          TotalRequests:1,
          R1_RequestTemplate:'Setting.MigrateSetting',
          R1_Id:this.data.Id,
          R1_Level:this.data.Level,
          R1_Name:this.categorie,
          R1_ParentId:this.data.ParentId,
          R1_$$mdSelectId:this.data.$treeNodeId,
          R1_oldName:this.categorie,
          R1_Value:this.valueGroupId,
          R1_ValueName:this.valueGroupName
        }
        this.$Utils.post(req).then(response => {
        })
        this.$message({
          message: 'Cập nhật thành công',
          type: 'success'
        });
        this.$router.go();
        this.closeForm();
      },
      loadCategories(){
        var req={
          RequestClass:'xBase',
          RequestAction:'Request',
          TotalRequests:1,
          R1_RequestTemplate:'Setting.SearchBase',
          R1_ParentCode:'xSetting.Project.Parameter.Organization.Category'
        }
        this.$Utils.post(req).then(response => {
          this.categories=response.R1.Data.DynamicDS.Setting;

        })
      },
      closeForm(){
        this.$hub.$emit('close-modal')
      },

    }
  }
</script>
<style>

</style>
