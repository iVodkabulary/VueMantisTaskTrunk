<template>
  <div class="dropdownactivity">
    <b-nav-item-dropdown right no-caret>
      <template slot="button-content">
        <div @click="clearNumber">
          <i class="fa-lg icon-bell"></i>
          <b-badge v-if="unread >0" pill variant="danger">{{unread}}</b-badge>
        </div>
      </template>
      <b-dropdown-header tag="div" class="text-center" @click.stop>
        <el-row>
          <el-col :span="12">Thông báo</el-col>
          <el-col :span="12" id="maskReadAll"  @click.stop="maskReadAll">Đánh dấu đã đọc</el-col>
        </el-row>
      </b-dropdown-header>
      <div class="content">
          <div :class="'message px-1 mb-1' + item.Active" v-for="item in datasource" v-bind:key="item.Id" @click="loadTask(item)" v-loading.fullscreen.lock="fullscreenLoading">
            <div class="py-3 mr-3 float-left">
              <div class="avatar">
                <img :src="item.Avatar" class="img-avatar" :alt="item.Name">
              </div>
            </div>
            <div class="mb-1">
            <div >
              <small class="text-muted">{{item.Name}}</small>
              <small class="text-muted float-right mt-1">{{item.Date}}</small>
            </div>
            <div class="text-truncate font-weight-bold">{{item.Action}}</div>
            <small class="text-muted">{{item.Task.Name}}</small>
            <hr>
            </div>
            <div class="clearfix"></div>
          </div>
      </div>
      <b-dropdown-header tag="div" class="text-center">
        <router-link to="/all-notifications">Xem thêm</router-link>
      </b-dropdown-header>
    </b-nav-item-dropdown>
  </div>
</template>
<script>
var data = [];
import utilsLibrary from "@/services/utils";
export default {
  name: "header-dropdown",
  props: ["datasource", "unread"],
  data: () => {
    return {
      fullscreenLoading: false,
      mscount: 0,
      start: 0,
      limit: 5,
      end: 5,
      myDevice : ''
    };
  },
  methods: {
    onUpdateMsCount() {
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var request = {
        RequestAction: "SearchUserWithGroups",
        IncludedGroupManager: "true",
        RequestClass: "BPM",
        RequestDataType: "json",
        ConditionFields: "UserId",
        UserId: currentUser.UserId,
        StaticFields: "Description;"
      };
      this.$Utils.post(request).then(data => {
        data = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
        var description = JSON.parse(data[0].Description);
        if (this.mscount !== parseInt(description.NotiCount)) {
          this.mscount = parseInt(description.NotiCount);
          this.playAudio().then(()=>{
              // console.log('play audio')
            }).catch((error)=> {
               console.log('play audio error ', error)
            });
        }
      });

        if (this.myDevice == "isMobileApp") {
          this.$cordovaPushV5.setBadgeNumber(this.mscount).then((result) => {}, (err) => {});
        }

    },
    getDayAgo(item) {
      if (item != undefined) {
        var dateNow = this.$Utils.formatDateTime(Date.Now, "DD/MM/YYYY");
        if (dateNow === this.$Utils.formatDateTime(item, "DD/MM/YYYY")) {
          var date = new Date();
          var currentDate = new Date(item);
          var t = date - currentDate;
          if (Math.round(t / 60 / 60 / 1000) > 0) {
            return Math.round(t / 60 / 60 / 1000) + " giờ trước ";
          } else if (Math.round(t / 60 / 1000) <= 0) {
            return "Vừa xong";
          } else {
            return Math.round(t / 60 / 1000) + " phút trước";
          }
        }

        var diff = Math.round(
          Math.abs((new Date() - new Date(item)) / (24 * 60 * 60 * 1000))
        );
        return diff + " ngày trước";
      } else {
        return "";
      }
    },
    loadNotification(s, e) {
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var requestSearch = {
        RequestClass: "xBase",
        RequestAction: "Request",
        RequestTemplate: "SendMessage.Search",
        TotalRequests: 1,
        R1_Name: "InstantMessage",
        R1_Receiver: currentUser.UserId,
        R1_StartIndex: s,
        R1_EndIndex: e,
        R1_RequestOrderFields: "Created DESC"
      };
      this.$Utils.post(requestSearch).then(function(data) {
        if (this.$Utils.isEmpty(data)) {
          var message = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.ConversationDS.Message"
          );
          angular.forEach(message, function(value) {
            if (value) {
              var temp = this.$Utils.jsonParse(value.Body);
              if (utilsLibrary.isEmpty(temp)) {
                var task = {};
                task.Name = temp.Name;
                if (this.$Utils.isEmpty(temp, "Content")) {
                  var cmtContent = temp.Content;
                }
                var user = JSON.parse(value.Description);
                //console.log(user.avatar);
                var strAvatar =
                  user.avatar === "assets/images/avatars/profile.png"
                    ? user.avatar
                    : user.avatar + "&Height=50&Width=50";
                var notificationitem = {
                  Id: temp.id,
                  Name: value.From,
                  Task: task,
                  Date: value.Created,
                  Active: "",
                  Action: lstAction[temp.action],
                  ActionClass: temp.action,
                  index: temp.index,
                  Avatar: vm.baseUri + strAvatar,
                  type: temp.action,
                  IdMessage: value.Id
                };

                if (
                  temp.action === "DocumentInsert" ||
                  temp.action === "DocumentUpdate"
                ) {
                  notificationitem.DocumentId = temp.DocumentId;
                }

                if (utilsLibrary.isEmpty(cmtContent)) {
                  notificationitem.Content = cmtContent;
                }
                var idf = JSON.stringify(vm.notifications).indexOf(
                  notificationitem.Id
                );
                if (idf === -1) {
                  if (value.State == 4) {
                    notificationitem.Active = "";
                  } else {
                    notificationitem.Active = "isActive";
                  }
                  vm.notifications.push(notificationitem);
                }
              }
            }
          });
        }
      });
    },
    playAudio() {
      var audio = new Audio(
        this.$appUri.BaseURL != "/"
          ? [this.$appUri.BaseURL + "assets/alert.mp3"]
          : "assets/alert.mp3"
      );
      audio.play();
    },
    loadTask(item) {
      var path = "/dynamic/view/Index=" + item.Index;
      if (item.Active === "isActive") {
        var i = this.datasource.indexOf(item);
        if (i != -1) {
          this.datasource[i].Active = "";
          this.updateStatus(item);
        }
      }
      if (
        item.ActionClass === "DocumentInsert" ||
        item.ActionClass === "DocumentUpdate"
      ) {
        path = "/dynamic/knowhow-update-document/Id=" + item.DocumentId;
      }
       //console.log(this.$router.currentRoute)
      //  if(this.$router.currentRoute.path === path){
      //    this.$router.go(this.$router.currentRoute);
      //  }
        //this.onUpdateMsCount();
        this.$router.push(path);
      // if ($location.$$path !== "/" + path) {
      //   $location.path(path);
      // } else {
      //   return;
      // }
    },
    updateStatus(item) {
      if (utilsLibrary.isEmpty(item, "IdMessage")) {
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          RequestTemplate: "UpdateConversation",
          R1_Id: item.IdMessage,
          R1_Name: "InstantMessage",
          R1_State: 4
        };
        utilsLibrary.post(request).then(function(data) {});
      }
    },
    clearNumber() {
      // alert('cleard')
      var description;
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
       var baseURL =
          this.$appUri.BaseURL !== "/"
            ? this.$appUri.BaseURL.substring(0, this.$appUri.BaseURL.length - 1)
            : window.origin;
      this.$hub.proxy.invoke(
        "clearCountNotification",
        currentUser.UserId,
        baseURL,
        sessionId
      );
      this.mscount = 0;

      if (this.myDevice === "isMobileApp") {
        this.$cordovaPushV5.setBadgeNumber(this.mscount).then((result) => {}, (err) => {});
      }

    },
    maskReadAll() {
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      $.each(this.datasource, (k, value) => {
        if (value.Active === "isActive") {
          value.Active = "";
        }
      });
      var requestSearch = {
        RequestClass: "xBase",
        RequestAction: "Request",
        RequestTemplate: "Message.UpdateState",
        TotalRequests: 1,
        R1_Name: "InstantMessage",
        R1_Receiver: currentUser.UserId,
        R1_State: "4"
      };
      this.$Utils.post(requestSearch).then(function(data) {
        //console.log('drop',data);
      });
    },
    openTaskDetail(index) {
      this.$router.push("/dynamic/view/Index=" + index);
      this.onUpdateMsCount();
    },
    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
        this.$message({
          message: "Congrats, this is a success message.",
          type: "success"
        });
      }, 2000);
    },
    getDayAgo(item) {
      if (item != undefined) {
        var dateNow = this.$Utils.formatDateTime(Date.Now, "DD/MM/YYYY");
        if (dateNow === this.$Utils.formatDateTime(item, "DD/MM/YYYY")) {
          var date = new Date();
          var currentDate = new Date(item);
          var t = date - currentDate;
          if (Math.round(t / 60 / 60 / 1000) > 0) {
            return Math.round(t / 60 / 60 / 1000) + " giờ trước ";
          } else if (Math.round(t / 60 / 1000) <= 0) {
            return "Vừa xong";
          } else {
            return Math.round(t / 60 / 1000) + " phút trước";
          }
        }
        var diff = Math.round(
          Math.abs((new Date() - new Date(item)) / (24 * 60 * 60 * 1000))
        );
        return diff + " ngày trước";
      } else {
        return "";
      }
    }
  },
  created() {
    //this.onUpdateMsCount();
    //this.loadNotification(this.start,this.end)
  },
  mounted() {
    this.myDevice = this.$myDevice;
    var pTag = $(".dropdownactivity");
    var aTag = pTag.find('a[class="nav-link"]');
    aTag.attr('href', 'javaScript:void(0)');
    if(this.myDevice === "isMobileApp") {
      pTag.parent().attr('href', 'javaScript:void(0)');
      aTag.attr('href', 'javaScript:void(0)');
    }
    $("#maskReadAll").on("click", () => {
      this.maskReadAll();
    });
  },
  watch: {}
};
</script>
<style lang="scss">
.isActive {
  background-color: rgb(231, 242, 248);
}

.message {
  hr {
    margin: 0;
  }
}
.dropdownactivity .dropdown-menu-right {
  width: 300px;

  .content {
    overflow-y: scroll;
    height: 400px;
    .content::-webkit-scrollbar {
      width: 2px;
      //height: 3px
    }
  }
}
</style>
