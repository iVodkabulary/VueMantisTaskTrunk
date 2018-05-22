<template>
 <el-form :inline="!$isMobileDevice" :rules="rules" ref="ruleForm"  :model="ruleForm">
  <el-form-item label="Mã" prop="name">
    <el-input v-model="ruleForm.name" placeholder=""></el-input>
  </el-form-item>
  <el-form-item label="">
   <el-radio-group v-model="ruleForm.radio">
  <el-radio :label="1">Mặc định</el-radio>
  <el-radio :label="0">Request</el-radio>

</el-radio-group>

  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">Tìm kiếm</el-button>
    <el-button type="primary"  >Liên kết</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  export default {
    props:['code'],
    data() {
      return {

        ruleForm: {
          name: '',
          radio:1
        },
        rules: {
          name: [
            { required: true, message: 'Mã cần có', trigger: 'blur' }
          ]
        }
      };
    },
    watch :{
      code: function(newVal){
        // this.ruleForm.name = newVal;
      }
    },
    created(){
     this.ruleForm.name = this.code;
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           // alert('submit!');
           //this.code = this.ruleForm.name;
           this.$hub.$emit('update-param-tree', this.ruleForm.name);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
