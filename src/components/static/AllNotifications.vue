<template>
  <b-card>
    <div class="container">
      <div class="row">
        <h3><i class="el-icon-bell"></i>Thông báo của bạn</h3>
      </div>
      <div class="qa-message-list" id="wallmessages">
        <v-infinite-scroll @bottom="loadmore()" @top="reload()" :offset='0' style="max-height: 85vh; overflow-y: scroll;">
        <div class="message-item" id="m16" v-for="item in notifications" v-bind:key="item.Id">
          <div class="message-inner"  @click="openTaskDetail(item.index)" v-loading.fullscreen.lock="fullscreenLoading">
            <div class="message-head clearfix">
              <div class="avatar pull-left"><img class="img-avatar" :src="item.Avatar"></div>
              <div class="user-detail">
                <h6 class="handle">{{item.Name}} <span>{{item.Action}}</span></h6>
                <div class="post-meta">
                  <div class="asker-meta">
											<span class="qa-message-what">{{item.Task.Name}}</span>
                      <span class="qa-message-when">
                        <i class="fa fa-calendar-plus-o" v-if="item.type == 'insert'"></i>
                        <i class="fa fa-calendar-check-o" v-if="item.type == 'updated'"></i>
                        <i class="fa fa-comment-o" v-if="item.type == 'comment'"></i>
                        <i class="fa fa-comments-o" v-if="item.type == 'reply'"></i>
                        <i class="el-icon-tickets" v-if="item.type == 'DocumentUpdate'"></i>
                        <i class="el-icon-document" v-if="item.type == 'DocumentInsert'"></i>
                        <span class="qa-message-when-data">  {{getDayName(item.Date)}}</span>
											</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="qa-message-content" v-html="htmlRender(item.Content)">
            </div>
          </div>
        </div>
        </v-infinite-scroll>
      </div>
    </div>
  </b-card>
</template>
<script>
 import utilsLibrary from '@/services/utils'
export default {
  data() {
    return {
      //$rootScope.info
      //this.lang = $translate.use();
      //this.loadMore = loadMore;
      //this.loadNotification = loadNotification;
      iScrollPos: 0,
      lstAction: {
        updated: "đã cập nhật công việc: ",
        insert: "đã thêm công việc: ",
        comment: "đã bình luận vào công việc: ",
        reply: "đã phản hồi bình luận trong công việc:",
        DocumentUpdate: "đã cập nhật tài liệu:",
        DocumentInsert: "đã thêm tài liệu: "
      },
      LoggedOnUser: {},
      SessionId: '',
      limit: 10,
      mscount: 0,
      notifications: [],
      start: 1,
      end: 10,
      isMobile: this.$isMobile,
      baseUri: this.$appUri.BaseURL,
      avatarWH: '&Height=36&Width=36',
      fullscreenLoading: false,
    }
  },
  methods: {
    reload(){
      this.start = 1;
      this.end = 10;
      this.loadNotification(this.start,this.end);
    },
    loadTask(item) {
      var vm = this;
      var path = "dynamic/view/Index=" + item.index;
      if (item.Active === "isActive") {
        var i = vm.notifications.indexOf(item);
        if (i != -1) {
          vm.notifications[i].Active = "";
          updateStatus(item);
        }
      }
      if (
        item.ActionClass === "DocumentInsert" ||
        item.ActionClass === "DocumentUpdate"
      ) {
        path = "dynamic/knowhow-update-document/Id=" + item.DocumentId;
      }
      if ($location.$$path !== "/" + path) {
        $location.path(path);
      } else {
        return;
      }
    },
    loadmore(){
      this.start = this.end;
      this.end += 10;
      this.loadNotification(this.start,this.end);
    },
    openTaskDetail(index) {
      this.$router.push("/dynamic/view/Index=" + index);;
    },
    loadTask(item) {
      var path = 'dynamic/view/Index=' + item.index;
      if (item.Active === 'isActive') {
        var i = this.notifications.indexOf(item);
        if (i != -1) {
          this.notifications[i].Active = '';
          updateStatus(item);
        }
      }
      if (item.ActionClass === 'DocumentInsert' || item.ActionClass === 'DocumentUpdate') {
        path = 'dynamic/knowhow-update-document/Id=' + item.DocumentId;
      }
      if ($location.$$path !== '/' + path) {
        $location.path(path);
      } else {
        return;
      }
    },

    updateStatus(item) {
      if (utilsLibrary.isEmpty(item, 'IdMessage')) {
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          SessionId: getItemLocalStorage(localStorageConstant.SessionId),
          RequestTemplate: 'UpdateConversation',
          R1_Id: item.IdMessage,
          R1_Name: 'InstantMessage',
          R1_State: 4
        }
        utilsLibrary.post(request).then((data) => {
          //console.log(data)
        })
      }
    },

    getDayName(item) {
      var dateNow = utilsLibrary.formatDateTime(Date.Now, 'DD/MM/YYYY');
      if (dateNow === utilsLibrary.formatDateTime(item, 'DD/MM/YYYY')) {
        var date = new Date();
        var currentDate = new Date(item);
        var t = date - currentDate;
        if (Math.round(t / 60 / 60 / 1000) > 0) {
          return Math.round(t / 60 / 60 / 1000) + " Giờ trước ";
        } else if (Math.round(t / 60 / 1000) <= 0) {
          return "Vừa xong";
        } else {
          return Math.round(t / 60 / 1000) + " Phút trước";
        }
      }
      var yesterday = utilsLibrary.formatDateTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'DD/MM/YYYY');
      if (utilsLibrary.formatDateTime(item, 'DD/MM/YYYY') === yesterday) {
        return 'Hôm qua lúc ' + utilsLibrary.formatDateTime(item, 'HH:mm')
      }
      /*{ return 'Yesterday' }*/
      var date1 = new Date();
      var d = utilsLibrary.formatDateTime(item);
      var startWeek = new Date(utilsLibrary.getDateTimeByKey('WeekStart'));
      var endWeek = utilsLibrary.getDateTimeByKey('WeekEnd');
      var date1 = new Date(d);
      if (date1 < startWeek) {
        return utilsLibrary.formatDateTime(item, 'DD/MM/YYYY') + ' Lúc ' + utilsLibrary.formatDateTime(item, 'HH:mm')
      }
      var day = date1.getDay();
      var days = new Array("Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật");
      return days[day] + ' Lúc ' + utilsLibrary.formatDateTime(item, 'HH:mm');
    },

    maskReadAll() {
      this.mscount = 0;
      if (myDevice == "isMobileApp") {
        /*
        $cordovaPushV5.setBadgeNumber(0).then(function(result) {}, function(err) {
          console.log("Error: " + err);
        });
        */
      }
      $.each(this.notifications, (key, value) => {
        if (value.Active === 'isActive') {
          value.Active = '';
        }
      })
      var requestSearch = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        RequestTemplate: 'Message.UpdateState',
        TotalRequests: 1,
        R1_Name: 'InstantMessage',
        R1_Receiver: this.LoggedOnUser.UserId,
        R1_State: '4',
      }
      utilsLibrary.post(requestSearch).then((data) => {
        //console.log(data);
      })
    },
    htmlRender(input) {
      return utilsLibrary.decodeHtmlEntities(input)// $sce.trustAsHtml(utilsLibrary.decodeHtmlEntities(input));
    },
    loadNotification(s, e) {
      var requestSearch = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        RequestTemplate: 'SendMessage.Search',
        TotalRequests: 1,
        R1_Name: 'InstantMessage',
        R1_Receiver: this.LoggedOnUser.UserId,
        R1_StartIndex: s,
        R1_EndIndex: e,
        R1_RequestOrderFields: 'Created DESC'
      }
      utilsLibrary.post(requestSearch).then((data) => {
        if (utilsLibrary.isEmpty(data)) {
          var message = utilsLibrary.getDataWithRoot(data.R1, 'Data.ConversationDS.Message');
          /*this.notifications = [];*/
          $.each(message, (key, value) => {
            if (value) {
              var temp = utilsLibrary.jsonParse(value.Body);
              if (utilsLibrary.isEmpty(temp)) {
                var task = {};
                task.Name = temp.Name;
                if (utilsLibrary.isEmpty(temp, 'Content')) {
                  var cmtContent = temp.Content;
                }
                var user = JSON.parse(value.Description);
                 user.avatar = user.avatar.replace('profile.jpg', 'profile.png');
                 var strAvatar =
                  user.avatar === "assets/images/avatars/profile.png"
                    ? user.avatar
                    : user.avatar.replace('/','') + "&Height=50&Width=50";
                var notificationitem = {
                  Id: temp.id,
                  Name: value.From,
                  Task: task,
                  Date: value.Created,
                  Active: '',
                  Action: this.lstAction[temp.action],
                  ActionClass: temp.action,
                  index: temp.index,
                  Avatar: this.baseUri + strAvatar,
                  type: temp.action,
                  IdMessage: value.Id,
                }

                if (temp.action === 'DocumentInsert' || temp.action === 'DocumentUpdate') {
                  notificationitem.DocumentId = temp.DocumentId;
                }

                if (utilsLibrary.isEmpty(cmtContent)) {
                  notificationitem.Content = cmtContent;
                }
                var idf = JSON.stringify(this.notifications).indexOf(notificationitem.Id)
                if (idf === -1) {
                  if (value.State == 4) {
                    notificationitem.Active = ''
                  } else {
                    //this.mscount++;
                    notificationitem.Active = 'isActive';
                  }
                  this.notifications.push(notificationitem);
                }
              }
            }
          })
        }
      })
    }
  },
  mounted() {
    this.LoggedOnUser = JSON.parse(
      this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)
    );
    this.SessionId = this.$getItemLocalStorage(
      this.$localStorageConstant.SessionId
    );

    this.loadNotification(this.start, this.end);
  },


}
</script>
<style>.message-item {
margin-bottom: 25px;
margin-left: 40px;
position: relative;
}
.message-item .message-inner {
background: #fff;
border: 1px solid #ddd;
border-radius: 3px;
padding: 10px;
position: relative;
}
.message-item .message-inner:before {
border-right: 10px solid #ddd;
border-style: solid;
border-width: 10px;
color: rgba(0,0,0,0);
content: "";
display: block;
height: 0;
position: absolute;
left: -20px;
top: 6px;
width: 0;
}
.message-item .message-inner:after {
border-right: 10px solid #fff;
border-style: solid;
border-width: 10px;
color: rgba(0,0,0,0);
content: "";
display: block;
height: 0;
position: absolute;
left: -18px;
top: 6px;
width: 0;
}
.message-item:before {
background: #fff;
border-radius: 2px;
bottom: -30px;
box-shadow: 0 0 3px rgba(0,0,0,0.2);
content: "";
height: 100%;
left: -30px;
position: absolute;
width: 3px;
}
.message-item:after {
background: #fff;
border: 2px solid #ccc;
border-radius: 50%;
box-shadow: 0 0 5px rgba(0,0,0,0.1);
content: "";
height: 15px;
left: -36px;
position: absolute;
top: 10px;
width: 15px;
}
.clearfix:before, .clearfix:after {
content: " ";
display: table;
}
.message-item .message-head {
border-bottom: 1px solid #eee;
margin-bottom: 8px;
padding-bottom: 8px;
}
.message-item .message-head .avatar {
margin-right: 20px;
}
.message-item .message-head .user-detail {
overflow: hidden;
}
.message-item .message-head .user-detail h5 {
font-size: 16px;
font-weight: bold;
margin: 0;
}
.message-item .message-head .post-meta {
float: left;
padding: 0 15px 0 0;
}
.message-item .message-head .post-meta >div {
color: #333;
font-weight: bold;
text-align: right;
}
.post-meta > div {
color: #777;
font-size: 12px;
line-height: 22px;
}
.message-item .message-head .post-meta >div {
color: #333;
font-weight: bold;
text-align: right;
}
.post-meta > div {
color: #777;
font-size: 12px;
line-height: 22px;
}

</style>

