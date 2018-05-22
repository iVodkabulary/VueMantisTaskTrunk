<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
      <el-form-item label="Tài khoản">
        <el-input disabled v-model="ruleForm.LoginName" ></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input disabled v-model="ruleForm.Email" ></el-input>
      </el-form-item>
      <el-form-item label="Tên đầy đủ">
        <el-input disabled v-model="ruleForm.FullName" ></el-input>
      </el-form-item>
      <el-form-item prop="newPass" label="Nhập mật khẩu mới">
        <el-input type="password" v-model="ruleForm.newPass" placeholder="Nhập mật khẩu mới" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="confirmNewPass" label="Nhập lại mật khẩu mới">
        <el-input type="password" v-model="ruleForm.confirmNewPass" placeholder="Nhập lại mật khẩu mới" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>

          <el-button type="primary" @click="submitForm('ruleForm')">Lưu</el-button>
          <el-button @click="closeForm()">Đóng</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['data'],
    data() {
      return {
        ruleForm: {
          newPass: '',
          confirmNewPass: '',
          UserId: '',
          LoginName: '',
          Email: '',
          FullName: ''
        },
        rules: {
          newPass: [
            {
              required: true, message: 'Nhập mật khẩu mới', trigger: 'blur',
            },
            { min: 5, max: 20, message: "Tên đăng nhập có độ dài từ 5 tới 20 kí tự", trigger: "blur"},

          ],
          confirmNewPass: [
            {
              required: true, message: 'Nhập lại mật khẩu mới', trigger: 'blur'
            }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.save();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closeForm() {
        this.$hub.$emit('close-modal')
      },
      checkValidForm() {
        if (this.ruleForm.newPass != this.ruleForm.confirmNewPass) {
          this.$message({
            message: "Mật khẩu không khớp!",
            type: "error"
          });
          return false;
        }
        return true;
      }
      ,
      save() {
        if (!this.checkValidForm()) {
          return;
        }
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        var params = {
          RequestClass: 'BPM',
          RequestAction: 'SetPassword',
          Account: this.ruleForm.LoginName,
          Password: this.ruleForm.newPass,
          SessionId: sessionId
        };
        this.$Utils.post(params).then((user) => {
          //console.log(user)
          var updateChangeDate = {
            RequestClass: 'BPM',
            RequestAction: 'UpdateUser',
            UserId: currentUser.UserId,
            LoginName: currentUser.LoginName,
            StructFields: "PassChangeDate",
            PassChangeDate: this.$Utils.formatDateTime(new Date(0, 0, 0)),
            PassChangeDateColumnType: 0
          };
          this.$Utils.post(updateChangeDate).then((data) => {
            //console.log('data',data.success);
              this.$message({
                message: 'Cập nhật mật khẩu thành công.',
                type: 'success'
              });
            this.$hub.$emit('update-users-list');
            this.closeForm();
          })
        });
      }
    },
    created() {
      this.ruleForm.UserId = this.data.UserId;
      this.ruleForm.LoginName = this.data.LoginName;
      this.ruleForm.FullName = this.data.Username;
      this.ruleForm.Email = this.data.Email;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
