<template>
  <div class="app flex-row align-items-center login-page" @keyup.enter="signIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body">
                <el-form :model="form" ref="user" class="demo-ruleForm" >
                <!-- <img src=""> -->
                <h1>Đăng nhập</h1>
                <!-- <p class="text-muted">Đăng nhập hệ thống</p> -->
                  <el-form-item
                    prop="Username"
                    :rules="[
                    { required: true, message: 'Vui lòng nhập tài khoản'}
                    ]"
                  >
                <div class="input-group mb-2">
                    <span class="input-group-addon"><i class="icon-user"></i></span>
                  <el-input type="text" class="form-control" placeholder="Tên đăng nhập" v-model="form.Username"></el-input>
                </div>
                  </el-form-item>
                  <el-form-item
                    prop="password"
                    :rules="[
                    { required: true, message: 'Vui lòng nhập mật khẩu'}
                    ]">
                <div class="input-group mb-2">
                  <span class="input-group-addon"><i class="icon-lock"></i></span>
                  <el-input type="password" class="form-control" placeholder="Mật khẩu" v-model="form.password"></el-input>
                </div>
                  </el-form-item>
                  <el-form-item v-if="myDevice == 'isMobileApp'"
                    prop="base"
                    :rules="[
                    { required: true, message: 'Vui lòng nhập địa chỉ trang'}
                    ]">
                <div class="input-group">
                  <span class="input-group-addon"><i class="fa fa-globe"></i></span>
                  <el-input  class="form-control" placeholder="Địa chỉ trang chủ" v-model="form.base"></el-input>
                </div>
                  </el-form-item>
                   <el-form-item
                    prop="remember"
                    >
                    <el-checkbox true-label="true" false-label="false" v-model="form.remember">Lưu thông tin</el-checkbox>
                   </el-form-item>

                <div class="row">
                  <div class="col-6">
                    <button  type="button" class="btn btn-primary px-4"  @click="signIn" >Đăng nhập</button>
                  </div>
                  <div class="col-6 text-right">
                    <button type="button" class="btn btn-link px-0"><router-link to="pages/reset-pass">Quên mật khẩu?</router-link></button>
                  </div>
                </div>
                  </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utilsLibrary from "@/services/utils";
export default {
  name: "Login",
  data() {
    return {
      form: {
        Username: "",
        password: "",
        base: "",
        remember: false,
        authenticated: false,
        deviceType: '',
        registrationId: '',
        uri: ''
      },
      registrationId: undefined,
      myDevice: ""
    };
  },
  created() {
    //console.log(this.$Utils.checkSession());
    utilsLibrary.logout();
    this.base = this.$appUri.BaseURL;
  },
  mounted() {
    this.init();
  },
  methods: {
    checkAccountValidate() {
      if (this.$rootScope.returnURL) {
        //$state.go(this.$rootScope.returnURL.state.name, this.$rootScope.returnURL.params);
        this.$router.go(
          this.$rootScope.returnURL.state.name,
          this.$rootScope.returnURL.params
        );
      } else {
        // RELOAD STATE
        //$location.path(appUri.BaseRedirect);
        this.$router.push(this.$appUri.BaseRedirect);
      }

      utilsLibrary.checkPassExpire(function(valid) {
        if (valid) {
          if (this.$rootScope.returnURL) {
            // $state.go(
            //   this.$rootScope.returnURL.state.name,
            //   this.$rootScope.returnURL.params
            // );
          } else {
            //RELOAD STATE
            // $location.path(appUri.BaseRedirect);
          }
        }
      });
    },
    signIn() {
      var ctrl = this;
      this.$clearStorage();
      this.$rootScope.pageType = "signIn";
      ctrl.viewModel = {
        Formtitle: "Đăng nhập tài khoản",
        showLogin: true,
        showExtension: true,
        showChangePass: false
      };
      ctrl.pass = {};
      if (ctrl.myDevice === "isMobileApp") {
        //TODO for pushnotification
        ctrl.registerPushNotification();
        //ctrl.login();
      } else {
        ctrl.login();
      }
    },
    registerPushNotification() {
      var ctrl = this;
      var options = {
        android: {
          icon: "icon",
          senderID: "68497599090"
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true"
        },
        windows: {}
      };

      // initialize
      this.$cordovaPushV5.initialize(options).then(()=> {
        // start listening for new notifications
        this.$cordovaPushV5.onNotification();
        // start listening for errors
        this.$cordovaPushV5.onError();
        // register to get registrationId
        if (window.device.isVirtual !== true) {
          this.$cordovaPushV5.register().then((registrationId)=> {
            ctrl.registrationId = registrationId;
            ctrl.login();
          });
        } else {
          ctrl.login();
        }
      });
    },

    login() {
      var ctrl = this;
      if (
        !utilsLibrary.isEmpty(ctrl.form.Username) ||
        ctrl.form.Username == ""
      ) {
        utilsLibrary.showMessage("error", "Nhập tên đăng nhập");
        return false;
      }
      if (
        !utilsLibrary.isEmpty(ctrl.form.password) ||
        ctrl.form.password == ""
      ) {
        utilsLibrary.showMessage("error", "Nhập mật khẩu");
        return false;
      }
      if (ctrl.myDevice == "isMobileApp") {
        if (
          !utilsLibrary.isEmpty(ctrl.form.base) ||
          ctrl.form.base == ""
        ) {
          utilsLibrary.showMessage("error", "Nhập đường dẫn trang");
          return false;
        }
      }
      // utilsLibrary.showLoading("start");
      if (utilsLibrary.isEmpty(ctrl.form.base) && ctrl.form.base != "") {
        if (ctrl.form.base.toLowerCase().indexOf("http") == -1) {
          this.$appUri.BaseURL = "http://" + ctrl.form.base + "/";
          this.$appUri.BaseUri = "http://" + ctrl.form.base + "/xRequest.ashx";
          this.form.uri = this.$appUri.BaseUri;
        } else {
          this.$appUri.BaseURL = ctrl.form.base + "/";
          this.$appUri.BaseUri = ctrl.form.base + "/xRequest.ashx";
          this.form.uri = this.$appUri.BaseUri;
        }

        if (ctrl.registrationId) {
          ctrl.form.registrationId = ctrl.registrationId;
        }

        if (ctrl.myDevice == "isMobileApp") {
          //TODO for cordova plugin device
         ctrl.form.deviceId = window.device.uuid;
        }

        if (ctrl.myDevice == "isMobileApp" && this.$isMobile.Android()) {
          ctrl.form.deviceType = "Android";
        } else if (ctrl.myDevice == "isMobileApp" && this.$isMobile.iOS()) {
          ctrl.form.deviceType = "Ios";
        } else {
          ctrl.form.deviceType = "Web";
        }
      }
      utilsLibrary.login(ctrl.form, data => {
        //console.log("datadata ", data);
        if (utilsLibrary.isEmpty(data, "success") && data.success != false) {

          // search color
          // end
          this.$setItemLocalStorage(
              this.$localStorageConstant.StoredURI,
             this.$appUri.BaseUri
            )
            //console.log(ctrl.form.remember)
            if (utilsLibrary.isEmpty(ctrl.form.remember)) {
              this.$setItemLocalStorage(
                this.$localStorageConstant.SaveStatus,
                ctrl.form.remember
              );
              if (
                utilsLibrary.isEmpty(ctrl.form.base) &&
                ctrl.myDevice == "isMobileApp"
              )
                this.$setItemLocalStorage(
                  this.$localStorageConstant.AppConfig,
                  ctrl.form.base
                );
              if (utilsLibrary.isEmpty(ctrl.form.Username))
                this.$setItemLocalStorage(
                  this.$localStorageConstant.LoginName,
                  ctrl.form.Username
                );
              if (
                utilsLibrary.isEmpty(ctrl.form.password) &&
                ctrl.myDevice == "isMobileApp"
              )
                this.$setItemLocalStorage(
                  this.$localStorageConstant.Password,
                  ctrl.form.password
                );
            }
            if (ctrl.myDevice == "isMobileApp")
              this.$setItemLocalStorage(
                this.$localStorageConstant.appUri,
                JSON.stringify(this.$appUri)
              );
            var object = this.$Lodash.cloneDeep(ctrl.form);
            object.Data = data.Data;
            this.$setItemLocalStorage(
              this.$localStorageConstant.SessionId,
              data.Data
            );
            var SessionId = data.Data; //this.$getItemLocalStorage(this.$localStorageConstant.SessionId);

            if (utilsLibrary.isEmpty(SessionId)) {
              var arrStatusColor = {};
              var arrPriorityColor = {};
              var statusRequest = {
                RequestClass: "xBase",
                RequestAction: "Request",
                TotalRequests: 1,
                R1_RequestTemplate: "Setting.SearchBase",
                R1_ParentCode: "xSystem.Setting.xTask.Status",
                SessionId: SessionId
              };
              var priorityRequest = {
                RequestClass: "xBase",
                RequestAction: "Request",
                TotalRequests: 1,
                R1_RequestTemplate: "xEdu.TaskPriority",
                R1_Code: "TaskPriority",
                SessionId: SessionId
              };
              utilsLibrary.post(statusRequest).then(dt => {
                var listStatus = utilsLibrary.getDataWithRoot(
                  dt.R1,
                  "Data.DynamicDS.Setting"
                );

                listStatus.forEach(item => {
                  arrStatusColor[item.Id.toUpperCase()] = item.Color;
                });
                this.$rootScope.arrStatusColor = arrStatusColor;
                this.$setItemLocalStorage(
                  this.$localStorageConstant.settingColor,
                  JSON.stringify(arrStatusColor)
                );
              });
              utilsLibrary.post(priorityRequest).then(rdt => {
                var listStatus = utilsLibrary.getDataWithRoot(
                  rdt.R1,
                  "Data.DocumentDS.Document"
                );
                listStatus.forEach(item => {
                  arrPriorityColor[item.Id.toUpperCase()] = item.Lead;
                });
                this.$rootScope.arrPriorityColor = arrPriorityColor;
                this.$setItemLocalStorage(
                  this.$localStorageConstant.arrPriorityColor,
                  JSON.stringify(arrPriorityColor)
                );
              });

              var request = {
                RequestClass: "xBase",
                RequestAction: "Request",
                TotalRequests: 3,
                R1_RequestTemplate: "SettingNew.SearchSetting",
                R1_IncludedNestedSetParent: true,
                R1_Code: "xSetting.Default.AppInfo",
                R2_RequestTemplate: "SettingNew.SearchSetting",
                R2_Code: "MODE_PROJECT",
                R3_RequestTemplate: "SettingNew.SearchSetting",
                R3_Code: "xSetting.Default.AppInfo.isoWeekday",
               // SessionId: SessionId
              };
              utilsLibrary.post(request).then(response => {
                //console.log("app infor ", response);
                var data1 = utilsLibrary.getDataWithRoot(
                  response.R1,
                  "Data.DynamicDS.Setting"
                );
                var data2 = utilsLibrary.getDataWithRoot(
                  response.R2,
                  "Data.DynamicDS.Setting"
                );
                 var data3 = utilsLibrary.getDataWithRoot(
                  response.R3,
                  "Data.DynamicDS.Setting"
                );
                 if(data3.length >0)
                    this.$setItemLocalStorage('firstDayOfWeekCfg', JSON.stringify(data3[0]));
                if (utilsLibrary.isEmpty(data1)) {

                  var application = { versionName: data1[0].Value };

                  this.$rootScope.application = application;
                  this.$setItemLocalStorage(
                    this.$localStorageConstant.Application,
                    JSON.stringify(application)
                  );
                  this.$rootScope.application = JSON.parse(
                    this.$getItemLocalStorage(
                      this.$localStorageConstant.Application
                    )
                  );
                } else {
                  var application = { versionName: "Professional" };
                  this.$rootScope.application = application;
                  this.$setItemLocalStorage(
                    this.$localStorageConstant.Application,
                    JSON.stringify(application)
                  );
                }
                if (utilsLibrary.isEmpty(data2, "0")) {
                  var modeproject = { mode: data2[0].Value };
                  this.$setItemLocalStorage(
                    this.$localStorageConstant.ModeProject,
                    JSON.stringify(modeproject)
                  );
                  this.$rootScope.modeProject = modeproject;
                } else {
                  var modeproject = { mode: "" };
                  this.$setItemLocalStorage(
                    this.$localStorageConstant.ModeProject,
                    JSON.stringify(modeproject)
                  );
                  this.$rootScope.modeProject = modeproject;
                }
              });
            }

            utilsLibrary.loadUserInformation(object, userInfo => {
              if (utilsLibrary.isEmpty(userInfo)) {
                this.$rootScope.loggedOnUser = userInfo;
                /** gọi đến hàm kiểm tra cấu hình, nếu có đủ thì kiểm tra có cấu hình DynamicThemeHTML chưa*/
                if(ctrl.myDevice == "isMobileApp") {
                  var request = {
                    RequestClass: "xBase",
                    RequestAction: "Request",
                    TotalRequests: 1,
                    R1_RequestTemplate: "SettingNew.SearchSetting",
                    R1_IncludedNestedSetParent: true,
                    R1_Code: "xSetting.Default.AppInfo",
                  };
                  utilsLibrary.post(request).then(response => {
                    //console.log("app infor ", response);
                    var data1 = utilsLibrary.getDataWithRoot(
                      response.R1,
                      "Data.DynamicDS.Setting"
                    );
                    if(!data1 || !data1[0] || (data1 && data1[0] && data1[0].Value != "Enterprise2")){
                      utilsLibrary.showMessage("error", "Website đang sử dụng phiên bản cũ!");
                      this.$router.push('/login');
                    } else if(this.$route.query &&  this.$route.query.redirect) {
                      utilsLibrary.showMessage("success", "Đăng nhập thành công!");
                      this.$router.push(this.$route.query.redirect);
                    } else {
                      utilsLibrary.showMessage("success", "Đăng nhập thành công!");
                      // $location.path(appUri.BaseRedirect);
                      this.$router.push(this.$appUri.BaseRedirect);
                    }
                  })
                } else {
                  utilsLibrary.showMessage("success", "Đăng nhập thành công!");
                  if (this.$route.query &&  this.$route.query.redirect) {
                    // $state.go(
                    //   this.$rootScope.returnURL.state.name,
                    //   this.$rootScope.returnURL.params
                    // );
                    //this.$router.go(this.$rootScope.returnURL.state.name);
                    this.$router.push(this.$route.query.redirect);
                  } else {
                    // $location.path(appUri.BaseRedirect);
                    this.$router.push(this.$appUri.BaseRedirect);
                  }
                }
              } else {
                utilsLibrary.showMessage("error", this.$toastMessage.loginError);
              }

            });
        } else {
          //console.log("else ");
          //utilsLibrary.showLoading("stop");
          utilsLibrary.showMessage("error", this.$toastMessage.loginError);
        }
      });
    },
    getTemplateHTML() {
      var templateCacheProcess = $q.defer();
      var request = utilsLibrary.updateParamsSingleRequest(
        this.$Lodash.cloneDeep(singleRequest),
        {
          RequestTemplate: "Setting.SearchBase",
          ParentCode: "xSetting.Default.TemplateHTML"
        }
      );
      utilsLibrary.postCheckResult(request).then(data => {
        data = utilsLibrary.getDataWithRoot(data, "R1.Data.DynamicDS.Setting");
        var objTemplate = {};
        $.each(data, (key, objTemplateSetting) => {
          if (objTemplateSetting.Name && objTemplateSetting.Value) {
            objTemplate[
              objTemplateSetting.Name.toLowerCase()
            ] = utilsLibrary.decodeHtmlEntities(objTemplateSetting.Value);
          }
        });
        this.$setItemLocalStorage(
          this.$localStorageConstant.HTMLTemplateCache,
          JSON.stringify(objTemplate)
        );
        templateCacheProcess.resolve();
      });
      return templateCacheProcess.promise;
    },

    init() {
      var ctrl = this;
      ctrl.myDevice = this.$myDevice;
      ctrl.isIOs = this.$isMobile.iOS();
      //ctrl.form = [];
      if (
        this.$getItemLocalStorage(this.$localStorageConstant.SaveStatus) ==
        "true"
      )
        ctrl.form.remember = true;
      if (this.$getItemLocalStorage(this.$localStorageConstant.AppConfig))
        ctrl.form.base = this.$getItemLocalStorage(
          this.$localStorageConstant.AppConfig
        );
      if (this.$getItemLocalStorage(this.$localStorageConstant.LoginName))
        ctrl.form.Username = this.$getItemLocalStorage(
          this.$localStorageConstant.LoginName
        );
      if (this.$getItemLocalStorage(this.$localStorageConstant.Password))
        ctrl.form.password = this.$getItemLocalStorage(
          this.$localStorageConstant.Password
        );
    }
  }
};
</script>
<style lang="scss">
.login-page{
  h1 {
    padding-left: 80px;
    background-image: url("../../assets/images/logo.png");
    background-repeat: no-repeat;
    background-position: center left;
    background-size: 70px auto;
    white-space: nowrap;
  }

  .card-body {
    .el-form-item__content {
      .element.style {
        margin-left: 0px;
      }
    }
  }
}
</style>
