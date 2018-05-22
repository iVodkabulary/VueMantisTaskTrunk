<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body">
                <h1>Quên mật khẩu</h1>
                <p class="text-muted">Khôi phục mật khẩu</p>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-user"></i></span>
                  <input type="text" class="form-control" placeholder="Username" v-model="checkuser">
                </div>
                <span style="color:red" v-show="msg1" >{{ user_msg }}</span>
                <div class="input-group mb-4">
                  <span class="input-group-addon"><i class="icon-envelope"></i></span>
                  <input type="email" class="form-control" placeholder="Email" v-model="checkemail"><br>
                </div>
                <span style="color:red" v-if="checkemail.length  > 0">{{ email_msg }}</span>
                <span style="color:red" v-show="warning" >Lỗi, vui lòng kiểm tra lại thông tin</span>
                <span style="color:green" v-show="warning2" >Một tin nhắn đã gửi tới email của bạn</span>
                <div class="row">
                  <div class="col-6">
                    <button type="button" class="btn btn-primary px-4" v-on:click="sendEmail()">Gửi</button>
                  </div>
                  <div class="col-6 text-right">
                    <button type="button" class="btn btn-link px-0"><router-link to="/login">Quay lại đăng nhập</router-link></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
 import router from '@/./router'

export default {
 data () {
    return {
      user: {
        Username: "",
        Password : "",
        Email:'',
        base : '',
        authenticated: false
      },
      params : {
        RequestClass: "BPM",RequestAction: "SignIn"
      },
      checkemail:'',
      email_msg:'',
      user_msg: "",
      msg1: true,
      checkuser:'',
      warning: false,
      warning2: false
    }
  },
  created(){

  },
  methods: {

    valid_email(email, msg) {

      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        this[msg] = "";
        return true;
      } else{
          this[msg] = "Email không đúng định dạng";
          return false;
      }
    },
    check_user(value, msg) {
      var length = value.length;
      var display='Tài khoản không được để trống';
      if (length >0) {
        this[msg] = "";
        return true;
      } else {
        this[msg] = display;
        return false;
      }
    },
    sendEmail(){
      var params = {
        RequestClass: 'BPM',
        RequestAction: 'RecoverPassword',
        Account: this.checkuser,
        Email: this.checkemail,
        Code: 'Notification.email-thong-bao-quen-mat-khau.06b86'
      };
      this.$Utils.post(params).then((data) => {
        if (data.success) {
          this.warning2 = !this.warning2;
        } else {
          this.warning = !this.warning;
        }
      });
    }
  },
  watch: {
    checkemail: function(value) {
      this.valid_email(value, "email_msg");
    },
    checkuser: function(value){
      this.check_user(value, "user_msg");
   }
  },
  mounted(){
    this.checkemail=this.user.Email;
    this.checkuser=this.user.Username;
  }
}
</script>
