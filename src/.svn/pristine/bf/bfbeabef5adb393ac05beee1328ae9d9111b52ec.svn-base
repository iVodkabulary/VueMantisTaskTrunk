<template>

  <b-nav-item-dropdown right no-caret  >
    <template slot="button-content">
      <img :src="curAvatar" class="img-avatar" :alt="user.Email">
    </template>
    <b-dropdown-header tag="div" class="text-center" @click.stop ><strong>{{user.Username}}</strong></b-dropdown-header>
    <b-dropdown-item @click="infoUser()"><i class="fa fa-user"></i>Tài khoản</b-dropdown-item>
    <b-dropdown-item v-if="!isMobile" @click="syncCalendar"><i class="fa fa-calendar"></i>{{calendarTitle}}</b-dropdown-item>
    <b-dropdown-item @click="changePass()"><i class="fa fa-shield"></i>Đổi mật khẩu</b-dropdown-item>
    <b-dropdown-item @click="logOut()"><i class="fa fa-lock"></i> Đăng xuất</b-dropdown-item>
  </b-nav-item-dropdown>

</template>
<script>
import Vue from "vue";
import UserInfo from "@/components/static/UserInfo";
import ChangeThePassword from "@/components/static/ChangeThePassword.vue";
import googleService from "@/services/googleService.js";
import utilsLibrary from '@/services/utils.js'
Vue.use(googleService);
export default {
  components: { UserInfo, ChangeThePassword },
  name: "user-dropdown",
  props: ["loggedUser"],
  data: () => {
    return {
      user: JSON.parse(localStorage.getItem("LoggedOnUser")),
      userModel: {},
      showBtnCalendar: false,
      authGoogle: false,
      flagSync: false,
      calendarTitle: "Đồng bộ hóa google",
      isMobile: false,
      myDevice: '',
      curAvatar: '',
      //googleService:google
    };
  },
  methods: {
    checkSigninGoogle() {
      if(!this.isMobile)
      try {
        googleService.checkAuth().then(data => {
          if (data === "error") {
            this.showBtnCalendar = false;

            console.log("can not connect google service");
            return;
          } else {
            this.showBtnCalendar = true;
          }
          if (data) {

            this.$set(this.$rootScope, 'authGoogle', true);
            // this.$rootScope.authGoogle = true;
            this.flagSync = true;
            this.calendarTitle = "Hủy đồng bộ hóa";
          } else {
            this.$set(this.$rootScope, 'authGoogle', false);
            // this.$rootScope.authGoogle = false;
            this.flagSync = false;
            this.calendarTitle = "Đồng bộ hóa google";
          }
          this.$hub.$emit('reloadCalendar');
        });
      } catch (ex) {
        console.log("can not connect google service", ex);
      }
    },
    syncCalendar(){
      var vm = this;
      if (!vm.isMobileApp) {
        if (vm.flagSync === false) {
          googleService.handleAuthClick().then((data)=> {
            if (data === 'error') {
              utilsLibrary.showMessage('error', 'Không thể kết nối tới google')
            } else {
              utilsLibrary.showMessage('success', 'Đồng bộ thành công');
              this.$set(this.$rootScope, 'authGoogle', true);
              vm.flagSync = true;
              vm.calendarTitle = 'Hủy đồng bộ hóa';
              this.$hub.$emit('reloadCalendar');
            }
          });
        } else {
          googleService.handleSignoutClick();
          vm.flagSync = false;
          vm.calendarTitle = 'Đồng bộ hóa google';
          this.$set(this.$rootScope, 'authGoogle', false);
          utilsLibrary.showMessage('success', 'Đã hủy kết nối đến Google Calendar');
          this.$set(this.$rootScope, 'isGoogleCalendar', false);
          // $rootScope.$broadcast('reloadCalendar');
          vm.$hub.$emit('reloadCalendar');
        }
      }
    },
    connect() {
      // console.log(this.user)
    },
    logOut() {
      this.$Utils.logout();
      if (this.myDevice == "isMobileApp") {
        this.$cordovaPushV5.setBadgeNumber(0).then((result)=> {
        }, (err)=>{
          console.log("Error: " + err);
        });
      }
      this.$router.push("/login");
    },
    infoUser() {
      this.$hub.$emit(
        "set-modal-data",
        "Thông tin chi tiết người dùng",
        "80%",
        true,
        "center",
        UserInfo,
        true,
        "",
        { action: "edit", item: this.userModel }
      );
      this.$hub.$emit("open-modal");
    },
    changePass() {
      this.$hub.$emit(
        "set-modal-data",
        "Thay đổi mật khẩu",
        "40%",
        true,
        "center",
        ChangeThePassword,
        false,
        "",
        this.user
      );
      this.$hub.$emit("open-modal");
    },
    loadAvatar(avatar) {
      avatar = avatar.replace("profile.jpg", "profile.png");
      var strAvatar =
        avatar === "assets/images/avatars/profile.png"
          ? this.$appUri.BaseURL + avatar
          : this.$appUri.BaseURL +
            avatar.replace("/", "") +
            "&Height=50&Width=50";
      return strAvatar;
    }
  },
  mounted() {
    this.isMobile = this.$isMobileDevice;
    this.myDevice = this.$myDevice;
    this.$hub.$on('userInfoChanged', ()=>{
      var request = {
        RequestAction: "SearchUserWithGroups",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        SessionId: this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        ),
        ConditionFields: "LoginName",
        StaticFields: "UserId;Username;LoginName;Description;Status;",
        DynamicFields:
          "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
        StructFields:
          "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification",
        OrderFields: "LoginName ASC",
        GroupType: "1",
        LoginName: this.user.LoginName != undefined ? this.user.LoginName : "",
        Status: "1"
      };
      this.$Utils.postCheckResult(request).then(data => {
        data = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
        if (data.length == 1) {
          this.userModel = data[0];
          this.$hub.$emit('userInfoLoaded', data[0]);
          this.curAvatar = this.loadAvatar(data[0].Avatar);
        }
      });
    });
  },
  created() {
    var request = {
      RequestAction: "SearchUserWithGroups",
      IncludedGroupManager: "true",
      RequestClass: "BPM",
      RequestDataType: "json",
      SessionId: this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      ),
      ConditionFields: "LoginName",
      StaticFields: "UserId;Username;LoginName;Description;Status;",
      DynamicFields:
        "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
      StructFields:
        "GroupRoot;GroupRootName;PhoneId;PhoneGroup;Public;RoleRoot;RoleRootName;GroupManage;Notification",
      OrderFields: "LoginName ASC",
      GroupType: "1",
      LoginName: this.user.LoginName != undefined ? this.user.LoginName : "",
      Status: "1"
    };
    this.$Utils.postCheckResult(request).then(data => {
      data = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
      if (data.length == 1) {
        this.userModel = data[0];
      }
    });
    this.curAvatar = this.loadAvatar(this.user.Avatar);
    this.checkSigninGoogle();
  }
};
</script>

