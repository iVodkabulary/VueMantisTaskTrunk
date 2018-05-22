<template>
  <div>
    <el-form :model="emailForm" :rules="rules" ref="emailForm">
       <el-form-item >
      </el-form-item>
      <el-form-item prop="Email">
        <el-input v-model="emailForm.Email" placeholder="Email"  ></el-input>
      </el-form-item>
      <el-form-item prop="Password">
        <el-input v-model="emailForm.Password" placeholder="Mật khẩu" type="password" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-col :span="10">&ensp; </el-col>
        <el-col :span="4">
          <el-button @click="submitForm('emailForm')" type="primary">Lưu</el-button>
          <el-button @click="closeForm()">Đóng</el-button>
        </el-col>
        <el-col :span="10">&ensp; </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      emailForm: {
        Email: "",
        Password: ""
      },
      rules: {
        Email: [{
            required: true,
            message: "Không để trống",
            trigger: "blur"
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: 'blur,change'
          }],
        Password: {
          required: true,
          message: "Không để trống",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.emailForm.Email !== this.data.Email){

          }else{
            this.$notify({
              title: 'HTML String',
              dangerouslyUseHTMLString: true,
              message: 'Email không thay đổi',
              type: 'info'
            });
            this.closeForm();
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    closeForm(){
      this.$hub.$emit('close-modal')
    }
  },
  mounted() {
    //console.log(this.data);
    this.emailForm.Email = this.data.Email;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
