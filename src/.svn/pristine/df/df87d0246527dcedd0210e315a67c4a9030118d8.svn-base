<template>
  <div>
    <div class="comments">
      <div class="comment-wrap">
        <div class="photo">
          <img class="media-object avatar" :src="loadAvatar(currentUser.Avatar)" alt="">
        </div>
        <div class="comment-block">
          <froala v-if="isShowComentRichText" :tag="'textarea'" :config="configEditor" v-model="Comment"></froala>
          <el-upload
            class="upload-demo"
            ref="uploadComment"
            :action="action"
            :data="dataComment"
            :on-preview="handlePreviewComment"
            :on-remove="handleRemoveComment"
            :on-change="handleChangeComment"
            :before-upload="checkFileSizeComment"
            :on-success="handleSuccessComment"
            :auto-upload="false"
            multiple
            :fileList="attachmentsComment">
            <el-button slot="trigger" size="small" type="primary">Chọn file</el-button>
            <div class="el-upload__tip" slot="tip">Dung lượng file không được quá {{sizeLimit}}Mb</div>
          </el-upload>
          <ul class="comment-actions">
            <li class="reply" v-if="CommentFile.length>0" @click="submitUpload('Comment')">Gửi</li>
            <li class="reply" v-if="CommentFile.length==0" @click="postComment()">Gửi</li>
          </ul>
        </div>
      </div>

      <div v-for="item in Comments" :key="item.Id">
        <hr>
        <div class="comment-wrap">
          <div class="photo">
            <img class="media-object avatar" :src="loadAvatar(item.Avatar)" alt="">
          </div>

          <el-card class="box-card comment-card">
            <div class="comment-wrap">

              <div class="comment-block">
                <p class="comment-text" v-html="$Utils.decodeHtmlEntities(item.Content)"></p>
                <el-table
                  :data="JSON.parse(item.Attachment)"
                  stripe
                  style="width: 100%" v-if="item.Attachment && JSON.parse(item.Attachment).length > 0">
                  <el-table-column
                    type="index"
                    label="STT"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="FileName"
                    label="Tên file">
                    <template slot-scope="scope">
                      <a :href="base + 'Download.ashx?Id=' + scope.row.AttachmentId" target="_blank">{{scope.row.FileName}}</a>
                      <img :src="base + 'Download.ashx?Id=' + scope.row.AttachmentId"
                           v-if="scope.row.Type && imgType.indexOf(scope.row.Type) != -1">
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Hành động">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-delete" @click="removeFile(scope.row.AttachmentId, item)"
                                 v-if="item.ParentId == currentUser.UserId">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="bottom-comment">
                  <div class="comment-date">{{$Utils.formatDateTime(item.DisplayDate, 'DD/MM/YYYY HH:mm')}},</div>
                  <div class="comment-user"><b>{{item.Author}}</b></div>
                  <ul class="comment-actions">
                    <li class="complain" @click="removeComments(item)" v-if="item.ParentId == currentUser.UserId">Xóa
                    </li>
                    <li class="reply" @click="showCompose(item)">Trả lời</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="comment-wrap" v-if="showComposes[item.Id]">
              <div class="photo">
                <img class="media-object avatar" :src="loadAvatar(currentUser.Avatar)" alt="">
              </div>
              <div class="comment-block">
                <froala v-if="isShowReplyRichText" :tag="'textarea'" :config="configEditor" v-model="Reply"></froala>
                <el-upload
                  class="upload-demo"
                  ref="uploadReply"
                  :action="action"
                  :data="dataReply"
                  :on-preview="handlePreviewReply"
                  :on-remove="handleRemoveReply"
                  :on-change="handleChangeReply"
                  :before-upload="checkFileSizeReply"
                  :on-success="handleSuccessReply"
                  :auto-upload="false"
                  multiple
                  :fileList="attachmentsReply">
                  <el-button slot="trigger" size="small" type="primary">Chọn file</el-button>
                  <div class="el-upload__tip" slot="tip">Dung lượng file không được quá {{sizeLimit}}Mb</div>
                </el-upload>
                <ul class="comment-actions">

                  <li class="reply" v-if="ReplyFile.length>0" @click="submitUpload('Reply')">Gửi</li>
                  <li class="reply" v-if="ReplyFile.length==0" @click="postComment(item.Id)">Gửi</li>
                </ul>
              </div>

            </div>
            <div class="replies" v-for="rItem in item.Replies" :key="rItem.Id">
              <div class="comment-wrap">
                <div class="photo">
                  <img class="media-object avatar" :src="loadAvatar(rItem.Avatar)" alt="">
                </div>
                <div class="comment-block">
                  <p class="comment-text" v-html="$Utils.decodeHtmlEntities(rItem.Content)"></p>
                  <el-table
                    :data="JSON.parse(rItem.Attachment)"
                    stripe
                    style="width: 100%" v-if="rItem.Attachment && JSON.parse(rItem.Attachment).length > 0">
                    <el-table-column
                      type="index"
                      label="STT"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="FileName"
                      label="Tên file">
                      <template slot-scope="scope">
                        <a :href="base + 'Download.ashx?Id=' + scope.row.AttachmentId" target="_blank">{{scope.row.FileName}}</a>
                        <img :src="base + 'Download.ashx?Id=' + scope.row.AttachmentId"
                             v-if="scope.row.Type && imgType.indexOf(scope.row.Type) != -1">
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Hành động">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-delete"
                                   @click="removeFile(scope.row.AttachmentId, rItem)"
                                   v-if="rItem.ParentId == currentUser.UserId">
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="bottom-comment">
                    <div class="comment-date">{{$Utils.formatDateTime(rItem.DisplayDate, 'DD/MM/YYYY HH:mm')}}</div>
                    <ul class="comment-actions">
                      <li class="complain" @click="removeComments(rItem)" v-if="rItem.ParentId == currentUser.UserId">
                        Xóa
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </el-card>

        </div>


      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['attachmentsComment', 'attachmentsReply', 'callBackOnSuccess', 'parent', 'idSetting', 'button'],
    data() {
      return {
        CurrentButton: this.button,
        action: this.$appUri.BaseUri,
        imgType: "image/png;image/bmp;image/gif;image/jpg;image/jpe;image/jpeg",
        dataComment: {
          RequestClass: 'xBase',
          RequestAction: 'Upload',
          Username: this.$rootScope.loggedOnUser.Username,
          WriteTempFile: true
          //'Content-Type': data.file.type
        },
        dataReply: {
          RequestClass: 'xBase',
          RequestAction: 'Upload',
          Username: this.$rootScope.loggedOnUser.Username,
          WriteTempFile: true
          //'Content-Type': data.file.type
        },
        commentId: '',
        CommentFile: [],
        ReplyFile: [],
        sizeLimit: 20,
        configEditor: this.$froOptions,
        base: this.$appUri.BaseURL,
        isShowReplyRichText: true,
        isShowComentRichText: true,
        Comment: "",
        Reply: "",
        commentCount: 0,
        currentUser: this.$rootScope.loggedOnUser,
        showComposes: {},
        Attachment: [],
        CountFile: 0,
        parentObj: this.parent,
        Comments: []
      };
    },
    watch: {},
    methods: {
      loadAvatar(avatar) {
        if (avatar == undefined) avatar = 'assets/images/avatars/profile.png';
        avatar = avatar.replace('profile.jpg', 'profile.png');
        var strAvatar =
          avatar === "assets/images/avatars/profile.png"
            ? this.$appUri.BaseURL + avatar
            : this.$appUri.BaseURL + avatar.replace('/', '') + "&Height=50&Width=50";
        return strAvatar;
      },
      removeComments(item) {
        this.$Utils.showConfirm('Cảnh báo', this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning).then(() => {
          if (item.ParentId == this.$rootScope.loggedOnUser.UserId) {
            var deleteParams = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: 'Comment.Delete',
              R1_Id: item.Id,
            }
            if (this.$Utils.isEmpty(item.CommentParent)) {
              if (this.$Utils.isEmpty(item.Attachment)) {
                JSON.parse(item.Attachment).forEach((val) => {
                  if (val != '' && val.AttachmentId)
                    this.$Utils.deleteAttachmentBinary(val.AttachmentId);
                })
              }
              this.$Utils.post(deleteParams).then((dlData) => {
                if (dlData.R1.success == true) {
                  this.$Utils.showMessage('success', "Xóa thành công");
                  this.loadComments(this.parent.Id);
                } else {
                  this.$Utils.showMessage('error', "Xóa không thành công");
                }
              })
            } else {
              if (this.$Utils.isEmpty(item.Attachment)) {
                JSON.parse(item.Attachment).forEach((val) => {
                  if (val != '' && val.AttachmentId)
                    this.$Utils.deleteAttachmentBinary(val.AttachmentId);
                })
              }
              var childrenParams = this.$Lodash.cloneDeep(this.params)
              childrenParams.R1_CommentParent = item.Id;
              childrenParams.R1_CommentParentColumnType = 0;
              this.$Utils.post(childrenParams).then((data) => {
                if (data && data.R1.Data && data.R1.Data.DocumentDS && data.R1.Data.DocumentDS.Comment) {
                  if (data.R1.Data.DocumentDS.Comment.length > 0) {
                    this.Children = data.R1.Data.DocumentDS.Comment;
                  } else {
                    this.Children = [data.R1.Data.DocumentDS.Comment];
                  }
                  $.each(this.Children, (key, value) => {
                    key = key + 2;
                    deleteParams["R" + key + "_RequestTemplate"] = 'Comment.Delete';
                    deleteParams["R" + key + "_Id"] = value.Id;
                    deleteParams.TotalRequests++;
                    if (this.$Utils.isEmpty(value.Attachment)) {
                      JSON.parse(value.Attachment).forEach((val) => {
                        if (val != '' && val.AttachmentId)
                          this.$Utils.deleteAttachmentBinary(val.AttachmentId);
                      })
                    }
                  })
                  this.$Utils.post(deleteParams).then((dlData) => {
                    if (dlData.R1.success == true) {
                      this.$Utils.showMessage('success', "Xóa thành công");
                      var commentCount = {
                        RequestClass: 'xBase',
                        RequestAction: 'Request',
                        TotalRequests: 1,
                        R1_RequestTemplate: 'Comment',
                        R1_Parent: this.parent.Id,
                      };
                      this.$Utils.post(commentCount).then(data => {
                        if (this.$Utils.isEmpty(data, 'R1.Data.DocumentDS.Comment')) {
                          var length = data.filter(ele => {
                            return ele.CommentParent == undefined;
                          }).length;
                          this.parentObj.TotalComment = length;
                        } else {
                          this.parentObj.TotalComment = 0;
                        }
                        var updateParams = {
                          RequestClass: 'xBase',
                          RequestAction: 'Request',
                          TotalRequests: 1,
                          R1_RequestTemplate: "AG_Task_Task.Update",
                          R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
                          R1_RequestFields: "Id;TotalComment",
                          R1_Id: this.parent.Id,
                          R1_UserList: JSON.stringify([this.$Utils.getUserInfo("UserId")]),
                        }
                        updateParams.R1_TotalComment = this.parentObj.TotalComment;
                        this.$Utils.post(updateParams);
                      });
                      this.loadComments(this.parent.Id);
                    } else {
                      this.$Utils.showMessage('error', "Xóa không thành công");
                    }
                  })
                } else {
                  if (this.$Utils.isEmpty(item.Attachment)) {
                    JSON.parse(item.Attachment).forEach((val) => {
                      if (val != '' && val.AttachmentId)
                        this.$Utils.deleteAttachmentBinary(val.AttachmentId);
                    })
                  }
                  this.$Utils.post(deleteParams).then((dlData) => {
                    if (dlData.R1.success == true) {
                      this.$Utils.showMessage('success', "Xóa thành công");
                      this.$Utils.showMessage('success', "Xóa thành công");
                      var commentCount = {
                        RequestClass: 'xBase',
                        RequestAction: 'Request',
                        TotalRequests: 1,
                        R1_RequestTemplate: 'Comment',
                        R1_Parent: this.parent.Id,
                      };
                      this.$Utils.post(commentCount).then(data => {
                        if (this.$Utils.isEmpty(data, 'R1.Data.DocumentDS.Comment')) {
                          data = this.$Utils.getDataWithRoot(data, "R1.Data.DocumentDS.Comment");
                          var length = data.filter(ele => {
                            return ele.CommentParent == undefined;
                          }).length;
                          this.parentObj.TotalComment = length;
                        } else {
                          this.parentObj.TotalComment = 0;
                        }
                        var updateParams = {
                          RequestClass: 'xBase',
                          RequestAction: 'Request',
                          TotalRequests: 1,
                          R1_RequestTemplate: "AG_Task_Task.Update",
                          R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
                          R1_RequestFields: "Id;TotalComment",
                          R1_Id: this.parent.Id,
                          R1_UserList: JSON.stringify([this.$Utils.getUserInfo("UserId")]),
                        }
                        updateParams.R1_TotalComment = this.parentObj.TotalComment;
                        this.$Utils.post(updateParams);
                      });
                      this.loadComments(this.parent.Id);
                    } else {
                      this.$Utils.showMessage('error', "Xóa không thành công");
                    }
                  })
                }
              })
            }
          } else {
            this.$Utils.showMessage('error', "Bạn không có quyền thực hiện tác vụ này!");
          }
        })
      },
      removeFile(AttachmentId, Comment, Parent) {
        this.$Utils.deleteAttachmentBinary(AttachmentId, Parent);
        if (this.$Utils.isEmpty(Comment)) {
          var attach = this.$Lodash.cloneDeep(JSON.parse(Comment.Attachment))
          $.each(attach, (key, value) => {
            if (value.AttachmentId == AttachmentId) {
              attach.splice(key, 1);
            }
          })
          var uParams = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: 1,
            R1_RequestTemplate: 'Comment.Update',
            R1_Id: Comment.Id, //id tin
            R1_Attachment: JSON.stringify(attach),
          };
          this.$Utils.post(uParams).then((data) => {
            this.loadComments(this.parent.Id)
          })
        } else {
          this.loadComments(this.parent.Id)
        }
      },
      postComment(id) {
        if (id === undefined || id.trim() === "") {
          if (this.Comment === undefined || this.Comment.trim() === "") {
            this.$message.error('Nội dung thảo luận cần phải có');
            return;
          }
        } else {
          if (this.Reply === undefined || this.Reply.trim() === "") {
            this.$message.error('Nội dung trả lời cần phải có');
            return;
          }
        }
        var iParams = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'Comment.Insert',
        };
        this.objComment = {
          ParentId: this.currentUser.UserId,
          RatingPoints: 0,
          State: 1,
          Index: 0,
          // Content: this.$Utils.encodeHtmlEntities(this.Comment), //nội dung bình luận
          Author: this.currentUser.Username,
          AuthorDate: this.$Utils.formatDateTime(),
          DisplayDate: this.$Utils.formatDateTime(),
          PublishedDate: this.$Utils.formatDateTime(),
          CreatedByLoginName: this.currentUser.LoginName,
          // Attachment: JSON.stringify(UploadedFiles),
        };
        if (this.$Utils.isEmpty(this.parent, 'Id')) {
          this.objComment.Parent = this.parent.Id;
        }
        if (this.$Utils.isEmpty(id)) {
          this.objComment.CommentParent = id;
          this.objComment.Content = this.$Utils.encodeHtmlEntities(this.Reply)
        } else {
          this.objComment.Content = this.$Utils.encodeHtmlEntities(this.Comment)
        }
        iParams = this.$Utils.updateParamsSingleRequest(iParams, this.objComment);
        if (this.tasked == true) {
          this.tasked = false;

        } else {
          if (this.Setting.Buttons)
            this.Setting.Buttons.forEach((item) => {
              if (item.Action == 'Update' && item.ExtraSetting && item.ExtraSetting.indexOf("DisplayDependOn=Id&DisplayDependType=DependExist") != -1) {
                this.CurrentButton = item
                this.Setting.functions.getElementData(0, []);
              }
            })
        }
        if (this.Attachment && this.Attachment.length > 0)
          iParams.R1_Attachment = JSON.stringify(this.Attachment)
        this.$Utils.post(iParams).then((data) => {
          var comment = {
            Id: data.R1.Data,
            Avatar: this.currentUser.Avatar,
            ParentId: this.currentUser.UserId,
            RatingPoints: "0",
            State: "1",
            Parent: this.parent.Id,
            Author: this.currentUser.Username,
            // Content: this.Comment,
            CreatedByLoginName: this.currentUser.Username,
            DisplayDate: new Date(),
            Attachment: JSON.stringify(this.$Lodash.cloneDeep(this.Attachment))
          };
          this.Attachment = [];
          if (!id) {
            comment.Content = this.$Lodash.cloneDeep(this.Comment);
            this.Comments.unshift(comment);
            this.showComposes[comment.Id] = false;
            this.Comment = "";
          } else {
            comment.Content = this.$Lodash.cloneDeep(this.Reply);
            comment.CommentParent = id;
            $.each(this.Comments, (i, v) => {
              if (id == v.Id) {
                if (!this.Comments[i].Replies) this.Comments[i].Replies = [];
                this.Comments[i].Replies.unshift(comment);
              }
            });
            this.Reply = "";
            this.showComposes[id] = false;
          }
          var requestSearchLink = this.$Lodash.cloneDeep(this.$singleRequest);
          requestSearchLink.R1_RequestTemplate = 'Permission';
          requestSearchLink.R1_Parent = this.parent.Id;
          requestSearchLink.R1_Code = 'Email';
          this.$Utils.post(requestSearchLink).then((links) => {
            links = this.$Utils.getDataWithRoot(links, 'R1.Data.DataDS.Linked');
            if (links.length > 0) {
              var iRequest = this.$Lodash.cloneDeep(this.$singleRequest);
              iRequest.TotalRequests = 2;
              iRequest.R1_UserId = '';
              iRequest.R1_RequestTemplate = 'User';
              iRequest.R1_Status = 1;
              links.forEach((link) => {
                if (iRequest.R1_UserId.indexOf(link.Child) < 0) {
                  iRequest.R1_UserId += link.Child + ';';
                }
              });
              /**
               * Get templace email của notification email comment từ trong setting
               */
              iRequest.R2_RequestTemplate = 'Setting.SearchBase';
              iRequest.R2_Code = 'Notification.taskcomentemail03a18';
              this.$Utils.post(iRequest).then((result) => {
                var arrRequest = [],
                  template = this.$Utils.getDataWithRoot(result, 'R2.Data.DynamicDS.Setting')[0];
                if (!this.$Utils.isEmpty(template, 'Description')) {
                  // this.$Utils.showMessage('error', toastMessage.emptyTemplate);

                  return false;
                }
                /**
                 * Thay thế nội dung của template email bằng các nội dung notification
                 * Tạo request gửi email tới từng nhân sự lấy được ở bên trên
                 */
                var content = this.$Lodash.cloneDeep(comment.Content);
                template.Description = JSON.parse(template.Description)
                var contentTemplate = template.Description.Content ? this.$Utils.decodeHtmlEntities(template.Description.Content) : '';
                contentTemplate = contentTemplate.replace('{{CommentContentObject}}', content);
                this.$Utils.getDataWithRoot(result, 'R1.Data.UserDS.User').forEach((user) => {
                  arrRequest.push({
                    To: user.Email,
                    Code: this.parent.Id,
                    Subject: this.$Utils.expressionToString(this.parent, template.Description.Title),
                    Body: this.$Utils.encodeHtmlEntities(this.$Utils.expressionToString(this.parent, contentTemplate)),
                    Name: 'Email',
                    From: 'SH',
                    State: 2,
                    Date: this.$Utils.formatDateTime(),
                    Parent: this.$Utils.getUserInfo('UserId'),
                    Sender: this.$Utils.getUserInfo('UserId'),
                    SenderName: this.$Utils.getUserInfo('Username'),
                    Receiver: user.UserId,
                    ReceiverName: user.Username
                  });
                });
                var notificationRequest = this.$Lodash.cloneDeep(this.$singleRequest);
                notificationRequest.TotalRequests = 0;
                notificationRequest.RequestTemplate = 'SendMessage';
                arrRequest.forEach((req) => {
                  if (this.$Utils.isEmpty(req.To) && req.To != '') {
                    notificationRequest.TotalRequests++;
                    $.each(req, (key, val) => {
                      notificationRequest['R' + notificationRequest.TotalRequests + '_' + key] = val;
                    });
                  }
                });
                /**
                 * Nếu số request sinh ra lớn hơn 0 thì gửi request lên server
                 */
                if (notificationRequest.TotalRequests > 0) {
                  this.createHistoryLogs(this.$Utils.encodeHtmlEntities(content), this.objComment);
                  this.$Utils.post(notificationRequest, () => {
                  });
                }
              });
            }
          })
          var requestSearchLink = this.$Lodash.cloneDeep(this.$singleRequest);
          requestSearchLink.R1_RequestTemplate = 'Permission';
          requestSearchLink.R1_Parent = this.parent.Id;
          requestSearchLink.R1_Code = 'Notification';
          this.$Utils.post(requestSearchLink).then((links) => {
            links = this.$Utils.getDataWithRoot(links, 'R1.Data.DataDS.Linked');
            if (links.length > 0) {
              var gid = this.$Utils.uuidv4();
              // var baseURL = JSON.parse(getItemLocalStorage(localStorageConstant.Notification)).BaseUrl;
              var baseURL = this.$appUri.BaseURL !== "/"
                ? this.$appUri.BaseURL.substring(0, this.$appUri.BaseURL.length - 1)
                : window.document.referrer;
              // $location.$$protocol + "://" + $location.$$host;
              var SOA = baseURL + ":" + JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.Notification)).Port;
              links.forEach((val) => {
                var strAction = 'comment';
                if (this.$Utils.isEmpty(this.objComment, 'CommentParent')) {
                  strAction = 'reply';
                }
                this.sender = JSON.stringify({
                  'i': this.$rootScope.loggedOnUser.UserId,
                  'a': this.$rootScope.loggedOnUser.LoginName,
                  'avatar': this.$rootScope.loggedOnUser.Avatar,
                  'n': this.$rootScope.loggedOnUser.Username,
                  's': this.$getItemLocalStorage(this.$localStorageConstant.SessionId),
                  'g': '',
                  'p': JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.Notification)).Port,
                  'c': '10',
                  'e': baseURL
                });
                // this.content = 'Task ' + this.parent.Index + ' - ' + this.parent.Name + ' has added a comment';
                this.content = JSON.stringify({
                  'id': gid,
                  'action': strAction,
                  'index': this.parent.Index,
                  'Name': this.parent.Name,
                  'Content': this.objComment.Content
                });
                this.notification = JSON.stringify({
                  'i': gid,
                  'mt': 1,
                  'st': '4',
                  's': this.sender,
                  'c': this.content,
                  'd': JSON.stringify(this.objComment)
                });
                if (val.ChildTable == "tblGroup") {
                  this.toGroup = JSON.stringify({'i': val.Child, 'e': baseURL})
                  this.sendNotifi("Group", this.toGroup, this.notification);
                } else {
                  this.to = JSON.stringify({'i': val.Child, 'c': '10', 'e': baseURL});
                  this.sendNotifi("Individual", this.to, this.notification);
                }
              })
            }
          })
          /*Nếu comment là comment trực tiếp của task( không phải comment trả lời) thì update số lượng ocmment vào task*/
          if (iParams.R1_CommentParent == undefined) {
            var commentCount = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: 'Comment',
              R1_Parent: this.parent.Id,
            };

            var updateParams = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: "AG_Task_Task.Update",
              R1_RequestDataGroup: 'DataGroup.danh-sach-cong-viec.04b66',
              R1_RequestFields: "Id;TotalComment",
              R1_Id: this.parent.Id,
              R1_UserList: JSON.stringify([this.$Utils.getUserInfo("UserId")]),
            }

            this.$Utils.post(commentCount).then(data => {
              if (this.$Utils.isEmpty(data, 'R1.Data.DocumentDS.Comment')) {
                data = this.$Utils.getDataWithRoot(data, "R1.Data.DocumentDS.Comment");
                var length = data.filter(ele => {
                  return ele.CommentParent == undefined;
                }).length;
                this.parentObj.TotalComment = length;
              } else {
                this.parentObj.TotalComment = 0;
              }
              updateParams.R1_TotalComment = this.parentObj.TotalComment;
              this.$Utils.post(updateParams);
              this.$hub.$emit('loadScrumboard');
            });
          }

        })
      },
      sendNotifi(t, u, n) {
        switch (t) {
          case 'System': {
            this.$hub.proxy.invoke('sendSystemNotification', u, n);
            break;
          }
          case 'Group': {
            this.$hub.proxy.invoke('sendGroupNotification', u, n);
            break;
          }
          case 'Individual': {
            this.$hub.proxy.invoke('sendIndividualNotification', u, n);
            break;
          }
          default:
            break;
        }
      },
      // postReply(id) {
      //   var r = {
      //     Id: "83a997e5-5c5c-4001-8250-280b3309ccd7",
      //     Avatar: this.currentUser.Avatar,
      //     ParentId: "92648807-3e48-49f9-8006-e01a4b815bbe",
      //     RatingPoints: "0",
      //     State: "1",
      //     Parent: "363a87d3-820b-48f7-887b-73c8b9ffa0c5",
      //     Author: "admin",
      //     Content: this.Reply,
      //     CreatedByLoginName: this.currentUser.Username,
      //     DisplayDate: new Date()
      //   };
      //   //this.Comments.push(reply);
      //   $.each(this.Comments, (i, v) => {
      //     if (id == v.Id) {
      //       if (!this.Comments[i].Replies) this.Comments[i].Replies = [];
      //       this.Comments[i].Replies.push(r);
      //     }
      //   });
      //    this.Reply = "";
      //   this.showComposes[id] = false;
      //   //console.log()

      //   /*
      //   this.$message({
      //     type: "info",
      //     message: this.showComposes
      //   });
      //   */
      // },
      checkComment() {
        if (this.Comment && this.Comment != '') {
          this.tasked = true;
          this.postComment()
        }
      },

      createHistoryLogs(arrChanged, fullValue) {
        var countHistory = this.$Utils.updateParamsSingleRequest(this.$Lodash.cloneDeep(this.$singleRequest), {
          RequestTemplate: 'ChangedLogs.Count',
          SourceId: this.parent.Id,
          Code: 'ChangedHistory'
        });
        this.$Utils.post(countHistory).then((result) => {
          if (this.$Utils.isEmpty(result, 'R1.Data')) {
            if (this.$Utils.isEmpty(fullValue, 'CommentParent') && fullValue.CommentParent != "") {
              var content = [{
                "ColumnCaption": "Phản hồi",
                "ColumnName": "Reply",
                "NewDisplayValue": arrChanged,
                "NewValue": arrChanged,
                "OldDisplayValue": this.Parent.Content,
                "OldValue": this.Parent.Content
              }];
            } else {
              var content = [{
                "ColumnCaption": "Thảo luận",
                "ColumnName": "Comment",
                "NewDisplayValue": arrChanged,
                "NewValue": arrChanged
              }];
            }
            // var content = {"Bình luận": this.$Utils.encodeHtmlEntities(this.$Utils.expressionToString(this.parent, arrChanged))}
            var insertRequest = this.$Utils.updateParamsSingleRequest(countHistory, {
              RequestTemplate: 'ChangedLogs.Insert',
              Version: parseInt(result.R1.Data) + 1,
              Changes: JSON.stringify(content),
              CreatedByName: this.$Utils.getUserInfo('Username')
            });
            this.$Utils.post(insertRequest).then((insertResult) => {
              if (insertResult.success && insertResult.R1.success) {
                /** do something after insert history success*/
              } else {
                this.$Utils.showMessage('error', this.$toastMessage.insertHistoryFailed + (objReturn.Name ? objReturn.Name : ''));
              }
            });
          } else {
            this.$Utils.showMessage('error', this.$toastMessage.insertHistoryFailed + (objReturn.Name ? objReturn.Name : ''));
          }
        });
      },

      showCompose(item) {
        this.Parent = item;
        if (this.showComposes[item.Id]) this.showComposes[item.Id] = false;
        else {
          var newObj = {};
          $.each(this.showComposes, k => {
            newObj[k] = item.Id == k;
          });
          this.showComposes = newObj;
        }
      },
      // deleteComment(item.Id) {
      //     return {};
      // },

      loadAttachments(pId) {
        return [{}];
      },
      loadComments(pId) {
        var currentUser = this.$rootScope.loggedOnUser;
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        this.params = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          SessionId: sessionId,
          TotalRequests: 2,
          R1_RequestTemplate: 'Comment',
          R1_Parent: pId,
          R1_RequestOrderFields: 'DisplayDate DESC',
          R2_RequestTemplate: 'Comment.Count',
          R2_Parent: pId
        }
        this.$Utils.post(this.params).then(response => {
          var commentList = this.$Utils.getDataWithRoot(response, 'R1.Data.DocumentDS.Comment');
          var arrLoginNames = [];
          commentList.forEach((source) => {
            if ($.inArray(source.CreatedByLoginName, arrLoginNames) == -1)
              arrLoginNames.push(source.CreatedByLoginName);
          })
          var request = {
            RequestAction: 'SearchUsers',
            RequestClass: 'BPM',
            RequestDataType: 'json',
            StaticFields: 'LoginName',
            DynamicFields: 'Avatar',
            ConditionFields: 'LoginName',
            LoginName: arrLoginNames.toString()
          };
          this.$Utils.post(request).then((users) => {
            users = this.$Utils.getDataWithRoot(users, 'Data.UserDS.User');
            commentList.forEach((source) => {
              users.forEach((user) => {
                if (user.LoginName === source.CreatedByLoginName)
                  source.Avatar = user.Avatar != undefined ? user.Avatar.substring(1) : 'assets/images/avatars/profile.png';
              })
            })
            this.Comments = this.$Utils.createCustomTreeFromList(
              commentList,
              "Id",
              "CommentParent",
              "Replies"
            );
          })
          this.commentCount = this.$Utils.getDataWithRoot(response, 'R2.Data');

        })
      },
      checkFileSizeComment(file) {
        if (file.size / (1024 * 1024) > this.sizeLimit) {
          this.$message({
            message: 'Cảnh báo, bạn không thể upload file quá ' + this.sizeLimit + 'Mb',
            type: 'warning'
          });
          return false;
        }
        return true;

      },
      handleChangeComment(file, fileList) {
        this.CommentFile = fileList
        //this.fileList3 = fileList.slice(-3);
      },
      handleRemoveComment(file, fileList) {
        var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        // var request = {
        //   RequestClass:'xBase',
        //  RequestAction:'DeleteBinary',
        //  SessionId: sessionId,
        //  Id: file.response.AttachmentId,
        //  Parent:''
        // }
        // this.$Utils.post(request).then(data => {
        //    // if(this.Setting.Attachment)
        //    //   this.Setting.Attachment.replace(data.msg + ";", "");
        //    // else {
        //    //   var updateParams = {
        //    //     RequestClass: 'xBase',
        //    //     RequestAction: 'Request',
        //    //     TotalRequests: 1,
        //    //     R1_RequestTemplate: this.Setting.DataSource + ".Update",
        //    //     R1_RequestDataGroup: this.Setting.DataGroup,
        //    //     R1_RequestFields: "Id;TotalDownload",
        //    //     R1_Id: this.data.Parent
        //    //   }
        //    //   if(this.$Utils.isEmpty(this.parent, 'TotalDownload')  && !isNaN(this.parent.TotalDownload)){
        //    //     updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) - 1;
        //    //   } else {
        //    //     updateParams.R1_TotalDownload = 0;
        //    //   }
        //    //   this.parent.TotalDownload = updateParams.R1_TotalDownload;
        //    //   this.$Utils.post(updateParams).then(data => {

        //    //  });
        //    // }
        // });
      },
      handlePreviewComment(file) {
        //http://man-uat.mn.com.vn/Download.ashx?Id=6042ed68-65a2-4dfa-9d74-1522e568d5e5
        window.location.href = this.$appUri.BaseURL + 'Download.ashx?id=' + file.response.AttachmentId;
      },
      handleSuccessComment(response, file, fileList) {
        response.Type = file.raw.type;
        this.Attachment.push(response);
        if (this.CountFile < fileList.length - 1) {
          this.CountFile++;

        } else {
          this.CountFile = 0;
          this.$refs['uploadComment'].clearFiles();
          this.postComment();
        }
        // if(this.$Utils.isEmpty(this.Setting.Attachment)){
        //   this.Setting.Attachment += response.AttachmentId + ";"
        // } else {
        //   var updateParams = {
        //     RequestClass: 'xBase',
        //     RequestAction: 'Request',
        //     TotalRequests: 1,
        //     R1_RequestTemplate: this.Setting.DataSource + ".Update",
        //     R1_RequestDataGroup: this.Setting.DataGroup,
        //     R1_RequestFields: "Id;TotalDownload",
        //     R1_Id: this.data.Parent
        //   }
        //   if(this.$Utils.isEmpty(this.parent, 'TotalDownload') && !isNaN(this.parent.TotalDownload)){
        //     console.log(parseInt(this.parent.TotalDownload))
        //     updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) + 1;
        //   } else {
        //     updateParams.R1_TotalDownload = 1;
        //   }
        //   this.parent.TotalDownload = updateParams.R1_TotalDownload;
        //   this.$Utils.post(updateParams).then(data => {

        //  });
        // }
        //console.log(fileList);
      },
      checkFileSizeReply(file) {
        if (file.size / (1024 * 1024) > this.sizeLimit) {
          this.$message({
            message: 'Cảnh báo, bạn không thể upload file quá ' + this.sizeLimit + 'Mb',
            type: 'warning'
          });
          return false;
        }
        return true;

      },
      handleChangeReply(file, fileList) {
        this.ReplyFile = fileList
        //this.fileList3 = fileList.slice(-3);
      },
      handleRemoveReply(file, fileList) {
        //  var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        //  var sessionId = this.$getItemLocalStorage(
        //    this.$localStorageConstant.SessionId
        //  );
        // var request = {
        //   RequestClass:'xBase',
        //  RequestAction:'DeleteBinary',
        //  SessionId: sessionId,
        //  Id: file.response.AttachmentId,
        //  Parent:''
        // }
        // this.$Utils.post(request).then(data => {
        //    if(this.Setting.Attachment)
        //      this.Setting.Attachment.replace(data.msg + ";", "");
        //    else {
        //      var updateParams = {
        //        RequestClass: 'xBase',
        //        RequestAction: 'Request',
        //        TotalRequests: 1,
        //        R1_RequestTemplate: this.Setting.DataSource + ".Update",
        //        R1_RequestDataGroup: this.Setting.DataGroup,
        //        R1_RequestFields: "Id;TotalDownload",
        //        R1_Id: this.data.Parent
        //      }
        //      if(this.$Utils.isEmpty(this.parent, 'TotalDownload')  && !isNaN(this.parent.TotalDownload)){
        //        updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) - 1;
        //      } else {
        //        updateParams.R1_TotalDownload = 0;
        //      }
        //      this.parent.TotalDownload = updateParams.R1_TotalDownload;
        //      this.$Utils.post(updateParams).then(data => {

        //     });
        //    }
        // });
      },
      handlePreviewReply(file) {
        //http://man-uat.mn.com.vn/Download.ashx?Id=6042ed68-65a2-4dfa-9d74-1522e568d5e5
        window.location.href = this.$appUri.BaseURL + 'Download.ashx?id=' + file.response.AttachmentId;
      },
      handleSuccessReply(response, file, fileList) {
        response.Type = file.raw.type;
        this.Attachment.push(response);
        if (this.CountFile < fileList.length - 1) {
          this.CountFile++;

        } else {
          this.CountFile = 0;
          this.$refs['uploadReply'][0].clearFiles();
          this.postComment(this.Parent.Id);
        }
        // if(this.$Utils.isEmpty(this.Setting.Attachment)){
        //   this.Setting.Attachment += response.AttachmentId + ";"
        // } else {
        //   var updateParams = {
        //     RequestClass: 'xBase',
        //     RequestAction: 'Request',
        //     TotalRequests: 1,
        //     R1_RequestTemplate: this.Setting.DataSource + ".Update",
        //     R1_RequestDataGroup: this.Setting.DataGroup,
        //     R1_RequestFields: "Id;TotalDownload",
        //     R1_Id: this.data.Parent
        //   }
        //   if(this.$Utils.isEmpty(this.parent, 'TotalDownload') && !isNaN(this.parent.TotalDownload)){
        //     console.log(parseInt(this.parent.TotalDownload))
        //     updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) + 1;
        //   } else {
        //     updateParams.R1_TotalDownload = 1;
        //   }
        //   this.parent.TotalDownload = updateParams.R1_TotalDownload;
        //   this.$Utils.post(updateParams).then(data => {

        //  });
        // }
        //console.log(fileList);
      },
      submitUpload(type) {
        if (this.$Utils.isEmpty(this.$refs['upload' + type], '0'))
          this.$refs['upload' + type][0].submit();
        else
          this.$refs['upload' + type].submit();
      },
    },
    watch: {
      Comments: function (newVal) {
        newVal.forEach(element => {
          this.showComposes[element.Id] = false;
        })
      }
    },
    mounted() {
      this.Setting = this.idSetting;
      if (this.Setting.functions) {
        this.Setting.functions.checkComment = this.checkComment;
        if (this.$Utils.isEmpty(this.parent, 'Id')) {
          this.loadComments(this.parent.Id);
        }
      } else {
        if (this.$Utils.isEmpty(this.parent, 'Id')) {
          this.loadComments(this.parent.Id);
        }
      }
      setTimeout(function () {
        $("a:contains('Unlicensed copy of the Froala Editor')").remove();
      }, 900);
      // this.loadComments(this.parentId);
    }
  };
</script>
<style scope lang="scss">
  //colors
  $color_comet_approx: #555f77;
  $color_mischka_approx: #ced2db;
  $white: #fff;
  $black_8: rgba(0, 0, 0, 0.08);
  $color_mystic_approx: #e9ebee;
  $color_cadet_blue_approx: #acb4c2;
  $color_azure_radiance_approx: #0095ff;

  //fonts
  $font_0: PT Sans;
  $font_1: Helvetica Neue;
  $font_2: Helvetica;
  $font_3: Roboto;
  $font_4: Arial;
  $font_5: sans-serif;

  //@extend-elements
  //original selectors
  //input, textarea
  %extend_1 {
    outline: none;
    border: none;
    display: block;
    margin: 0;
    padding: 0;
    font-family: $font_0, $font_1, $font_2, $font_3, $font_4, $font_5;
    font-size: 1rem;
    color: $color_comet_approx;
  }

  input {
    @extend %extend_1;
    &:-moz-placeholder {
      color: $color_mischka_approx;
    }
    &:-ms-input-placeholder {
      color: $color_mischka_approx;
    }
  }

  textarea {
    @extend %extend_1;
    &:-moz-placeholder {
      color: $color_mischka_approx;
    }
    &:-ms-input-placeholder {
      color: $color_mischka_approx;
    }
  }

  input::-webkit-input-placeholder {
    color: $color_mischka_approx;
  }

  textarea::-webkit-input-placeholder {
    color: $color_mischka_approx;
  }

  input::-moz-placeholder {
    color: $color_mischka_approx;
  }

  textarea::-moz-placeholder {
    color: $color_mischka_approx;
  }

  p {
    line-height: 1.3125rem;
  }

  .comments {
    //margin: 2.5rem auto 0;
    //max-width: 60.75rem;
    //padding: 0 1.25rem;
  }

  .comment-wrap {
    margin-bottom: 1.25rem;
    display: table;
    display: table;
    width: 100%;
    min-height: 5.3125rem;
  }

  .photo {
    padding-top: 0.625rem;
    display: table-cell;
    width: 3.5rem;
    .avatar {
      height: 2.25rem;
      width: 2.25rem;
      //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
      border-radius: 50%;
      background-size: contain;
    }
  }

  .comment-card {
    background-color: $white;
    display: table-cell;
    vertical-align: top;
  }

  .comment-block {
    padding: 1rem;
    padding-bottom: 0;
    display: table-cell;
    vertical-align: top;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 0.2rem;
    //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
    box-shadow: 0 1px 3px 0 $black_8;
    background-color: $color_mystic_approx;
    textarea {
      width: 100%;
      resize: none;
    }
  }

  .comment-text {
    margin-bottom: 1.25rem;
  }

  .bottom-comment {
    color: $color_cadet_blue_approx;
    font-size: 0.875rem;
  }

  .comment-date {
    float: left;
  }

  .comment-actions {
    float: right;
    li {
      display: inline;
      margin: -2px;
      cursor: pointer;
      &.complain {
        padding-right: 0.75rem;
        border-right: 1px solid $color_mystic_approx;
      }
      &.reply {
        padding-left: 0.75rem;
        padding-right: 0.125rem;
      }
      &:hover {
        color: $color_azure_radiance_approx;
      }
    }
  }
</style>
