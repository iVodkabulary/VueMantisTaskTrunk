<template>
  <div>
    <el-form ref="form" :model="emailForm" labelWidth="120px" :label-position="left">
      <el-form-item label="Người nhận">
        <el-input v-model="receiverEmail"></el-input>
      </el-form-item>
      <el-form-item label="CC">
        <el-input v-model="ccEmail"></el-input>
      </el-form-item>
      <el-form-item label="Chủ đề">
        <el-input v-model="emailTitle"></el-input>
      </el-form-item>
      <el-form-item label="Nội dung">
        <froala :tag="'textarea'" :config="config" v-model="emailBody"></froala>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">Cancel</el-button>
      <el-button @click="SendMessage()" type="primary">Confirm</el-button>
    </span>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: ['data'],
    data() {
      var receiverEmail = '';
      var ccEmail = '';
      var emailTitle = '';
      var emailBody = '';
      var emailForm = {
        receiverEmail: receiverEmail,
        ccEmail: ccEmail,
        emailTitle: emailTitle,
        emailBody: emailBody
      };
      return {
        config: this.$froOptions,
        innerVisible: true,
        userImage: '',
        textarea: "",
        msg: "",
        msg1: true,
        dataToPass: this.data ,
        radio: '1',
        receiverEmail,
        ccEmail,
        emailTitle,
        emailBody,
        emailForm,
        dialogTableVisible: false,
        dialogFormVisible: false,
        senderEmail: '',
        loggedOnUser: JSON.parse(localStorage.getItem('LoggedOnUser')),
        base: this.$appUri.BaseURL === '/' ? '' : this.$appUri.BaseURL,
      }
    },
    methods: {
      loadData() {
        var request = {
          RequestAction: 'SearchUser',
          IncludedGroupManager: 'true',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'IncludedGroupManager;Group;Status;LoginName',
          StaticFields: 'UserId;Status;LoginName;Username',
          DynamicFields: 'Email;',
          Status: '1',
          UserId: this.loggedOnUser['UserId']
        };
        this.$Utils.post(request).then((user) =>{
          var userData = this.$Utils.getDataWithRoot(user, 'UserDS.User');
          this.senderEmail = userData[0].Email;
        })
        var content = "";
        var content = "";
        this.dataToPass.forEach((value) => {
          content += "<p>" + value.Title + "</p>";
          var table = '<table cellspacing="0" border="1"> <thead style="width:100% ;background-color:#434343; color:#fff;font-size: 14px;"><tr>' +
            '<th width="127">Mã</th><th width="792">Tên công việc</th><th width="97">Trạng thái</th>' +
            '<th width="80">Ước tính</th><th width="80">Thực tế</th><th width="135">Ngày thực hiện</th>' +
            '<th width="135">Ngày kết thúc</th><th width="80">Ưu tiên</th><th width="80">Tính chất</th></tr></thead>';
          table += '<tbody>';
          if (value.dataSource.length > 0) {
            value.dataSource.forEach((value1) => {
              var row = "";
              if (value1) {
                row = '<tr>' +
                  '<td>' + value1.Index + '</td>' +
                  '<td>' + value1.Name + '</td>' +
                  '<td>' + value1.StatusName + '</td>' +
                  '<td>' + value1.PlanManHour + '</td>' +
                  '<td>' + value1.RemainingManHour + '</td>' +
                  '<td>' + this.$Utils.formatDateTime(value1.PlanStartDate, "DD-MM-YYYY") + '</td>' +
                  '<td>' + this.$Utils.formatDateTime(value1.Deadline, "DD-MM-YYYY") + '</td>' +
                  '<td>' + value1.PriorityIdName + '</td>' +
                  '<td>' + value1.TypeName + '</td>' +
                  '</tr>';
                table += row;
              }
            })

          } else {
            table += '<tr><td> </td><td> </td><td> </td><td> </td><td>  </td><td> </td><td> </td><td> </td><td> </td></tr>'
          }
          var rowtotal = '<tr>' +
            '<td>&nbsp;</td>' +
            '<td>&nbsp;</td>' +
            '<td><strong>Tổng</strong></td>' +
            '<td><strong>' + value.TotalPlan + '</strong></td>' +
            '<td><strong>' + value.TotalActual + '</strong></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>';
          table += rowtotal;
          table += '</tbody></table>';
          content += table;

        })
        content += "</br> </br></br></br>  ";
        content +="<p> ------------------------------</p><p>"
        content += "Người tạo </p><p>"
        content += this.loggedOnUser["Username"];
        content += "</p>";
        var searchRequest = this.$Lodash.cloneDeep(this.$singleRequest);
        searchRequest.R1_RequestTemplate = 'Setting.SearchBase';
        searchRequest.R1_Code = 'Notification.email-gui-bao-cao-ngay.08h82';
        this.$Utils.post(searchRequest).then((result) => {
          if (result) {
            var template = this.$Utils.getDataWithRoot(result, 'R1.Data.DynamicDS.Setting')[0];
            if (this.$Utils.isEmpty(template, 'Description')) {
              template.Description = JSON.parse(template.Description);
              this.emailTitle = template.Description.Title + " " + this.$Utils.formatDateTime(new Date(), "DD-MM-YYYY");
              this.emailBody = this.$Utils.decodeHtmlEntities(template.Description.Content);
            }
          }
          if (this.$Utils.isEmpty(this.emailBody)) {
            this.emailBody += this.$Utils.decodeHtmlEntities(content);
          } else
            this.emailBody = this.$Utils.decodeHtmlEntities(content);

        })
      },
      closeForm(){
        this.$hub.$emit('close-modal')
      },
      SendMessage() {
        var requestSendmail = this.$Lodash.cloneDeep(this.$singleRequest);
        requestSendmail.RequestTemplate = "SendMessage";
        requestSendmail.R1_To = this.receiverEmail;
        requestSendmail.R1_Code = 'DailyReport';
        requestSendmail.R1_Subject = this.emailTitle;
        requestSendmail.R1_Body = this.$Utils.encodeHtmlEntities(this.emailBody);
        requestSendmail.R1_Name = 'Email';
        requestSendmail.R1_From = this.senderEmail;
        requestSendmail.R1_State = 2;
        requestSendmail.R1_Date = this.$Utils.formatDateTime();
        requestSendmail.R1_Parent = this.loggedOnUser['UserId'];
        requestSendmail.R1_Sender = this.loggedOnUser['UserId'];
        requestSendmail.R1_SenderName = this.loggedOnUser['Username'];
        requestSendmail.R1_Cc = this.ccEmail;
        requestSendmail.R1_HasAttachment = null;
        this.$Utils.post(requestSendmail).then(function(data) {
          if (data.success) {
            //alert("success", "Gửi báo cáo thành công");
            this.closeForm();
          } else {
            //alert("error", "Không thể gửi báo cáo");
          }
        });
      }
    },
    mounted() {
      this.loadData();
      setTimeout(function() {
        $("a:contains('Unlicensed copy of the Froala Editor')").remove();
      }, 900);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .fr-sticky-dummy{
    height: 0px !important;
  }
</style>
