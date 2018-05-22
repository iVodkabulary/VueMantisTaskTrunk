<template>
  <div>
    <el-upload class="upload-demo"
               ref="upload"
               :action="action"
               :data="data"
               :on-remove="handleRemove"
               :on-change="handleChange"
               :before-upload="checkFileSize"
               :on-success="handleSuccess"
               :auto-upload="true"
               multiple>
      <!-- :fileList ="attachments" > -->
      <!-- :on-preview="handlePreview" -->
      <el-button slot="trigger" size="small" type="primary">Chọn file</el-button>
      <!--
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server</el-button>
      -->
      <div class="el-upload__tip" slot="tip">Dung lượng file không được quá {{sizeLimit}}Mb</div>
    </el-upload>
    <el-table :data="this.datasource"
              stripe
              style="width: 100%" v-if="this.datasource && this.datasource.length > 0">
      <el-table-column type="index"
                       label="Stt">
      </el-table-column>
      <!--         <el-table-column
          prop="name"
          label="Người cập nhật"
          width="180">
        </el-table-column> -->
      <el-table-column prop="FileName"
                       label="Tên file">
        <template slot-scope="scope">
          <a :href="base + 'Download.ashx?Id=' + scope.row.Id" target="_blank">{{scope.row.FileName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="CreatedByName"
                       label="Người Tạo">
      </el-table-column>
      <el-table-column label="Hành động">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click="removeFile(scope.row)" v-if="scope.row.CreatedBy == currentUser">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'UploadFile',
    props: ['attachments', 'callBackOnSuccess', 'parent', 'idSetting'],
    data() {
      //console.log(this.$appUri.BaseUri)
      return {
        action: this.$appUri.BaseUri,
        data: {},
        sizeLimit: 20,
        Setting: {},
        datasource: [],
        currentUser: JSON.parse(localStorage.getItem("LoggedOnUser")).UserId,
        base: '/',
        CountFile: 0,
      };
    },
    created() {
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      this.data = {
        RequestClass: 'xBase',
        RequestAction: 'Upload',
        SessionId: sessionId,
        Username: currentUser.Username,
        WriteTempFile: true
        //'Content-Type': data.file.type
      };
    },
    watch: {
      parent: function (p) {
        this.Setting = this.idSetting
        if (this.$Utils.isEmpty(this.parent, 'Id')) {
          this.data.Parent = this.parent.Id;
          this.getList();
        } else {
          this.Setting.Attachment = "";
          this.Setting.clearUploaded = this.clearUploaded;
        }
      }
    },
    methods: {
      clearUploaded() {
        this.datasource = [];
      },
      getList() {
        if (this.$Utils.isEmpty(this.data, 'Parent') || this.$Utils.isEmpty(this.Setting, 'Attachment')) {
          var params = {
            RequestClass: "xBase",
            RequestAction: "SearchBinary",
            // Parent: this.data.Parent,
            // ConditionFields: 'Parent',
            StaticFields: 'Name;Created;Modified;FileName;FileExtension;FileSize;CreatedBy;Description;Parent;FileSize',
            DynamicFields: 'CreatedByName;SignatureVerified'
          };
          if (this.$Utils.isEmpty(this.data, 'Parent')) {
            params.Parent = this.data.Parent;
            params.ConditionFields = 'Parent';
          } else {
            params.Id = this.Setting.Attachment;
            params.ConditionFields = 'Id';
          }
          this.$Utils.post(params).then((data) => {
            if (data && data.Data && data.Data.DynamicDS && data.Data.DynamicDS.Binary) {
              if (data.Data.DynamicDS.Binary.length > 0) {
                this.datasource = data.Data.DynamicDS.Binary;
              } else {
                this.datasource = [data.Data.DynamicDS.Binary];
              }
              this.parent.TotalDownload = data.Data.DynamicDS.Binary.length;

              // this.totalCount = parseInt(data.TotalCount);
              // angular.forEach(this.datasource, function(file){
              //   this.totalSize = this.totalSize + parseInt(file.FileSize);
              // })
            } else if (data.TotalCount == '0') {
              this.datasource = [];
            }
          })
        } else {
          this.datasource = [];
        }
      },
      removeFile(item) {
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'DeleteBinary',
          Id: item.Id,
          Parent: ''
        }
        this.$Utils.post(request).then(data => {
          if (this.Setting.Attachment)
            this.Setting.Attachment.replace(data.msg + ";", "");
          else {
            var updateParams = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: this.Setting.DataSource + ".Update",
              R1_RequestDataGroup: this.Setting.DataGroup,
              R1_RequestFields: "Id;TotalDownload",
              R1_Id: this.data.Parent
            }
            if (this.$Utils.isEmpty(this.parent, 'TotalDownload') && !isNaN(this.parent.TotalDownload)) {
              updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) - 1;
            } else {
              updateParams.R1_TotalDownload = 0;
            }
            this.parent.TotalDownload = updateParams.R1_TotalDownload;
            this.$Utils.post(updateParams).then(data => {

            });
          }
          this.getList();
        })
      },
      checkFileSize(file) {
        //console.log(file.size)
        // console.log(file.size / (1024 * 1024))
        if (file.size / (1024 * 1024) > this.sizeLimit) {
          this.$message({
            message: 'Cảnh báo, bạn không thể upload file quá ' + this.sizeLimit + 'Mb',
            type: 'warning'
          });
          return false;
        }
        return true;

      },
      handleChange(file, fileList) {
        // console.log(file);
        //this.fileList3 = fileList.slice(-3);
      },
      handleRemove(file, fileList) {
        var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'DeleteBinary',
          SessionId: sessionId,
          Id: file.response.AttachmentId,
          Parent: ''
        }
        this.$Utils.post(request).then(data => {
          if (this.Setting.Attachment)
            this.Setting.Attachment.replace(data.msg + ";", "");
          else {
            var updateParams = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: this.Setting.DataSource + ".Update",
              R1_RequestDataGroup: this.Setting.DataGroup,
              R1_RequestFields: "Id;TotalDownload",
              R1_Id: this.data.Parent
            }
            if (this.$Utils.isEmpty(this.parent, 'TotalDownload') && !isNaN(this.parent.TotalDownload)) {
              updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) - 1;
            } else {
              updateParams.R1_TotalDownload = 0;
            }
            this.parent.TotalDownload = updateParams.R1_TotalDownload;
            this.$Utils.post(updateParams).then(data => {
            });
          }
        });
      },
      handlePreview(file) {
        //http://man-uat.mn.com.vn/Download.ashx?Id=6042ed68-65a2-4dfa-9d74-1522e568d5e5
        window.location.href = this.$appUri.BaseURL + 'Download.ashx?id=' + file.response.AttachmentId;
        //console.log(file);
      },
      handleSuccess(response, file, fileList) {
        //console.log(response)
        if (this.$Utils.isEmpty(this.Setting.Attachment)) {
          this.Setting.Attachment += response.AttachmentId + ";"
          // this.$refs.upload.clearFiles();
          // this.getList();
        }

        if (this.CountFile < fileList.length - 1) {
          this.CountFile++;

        } else {
          if (this.$Utils.isEmpty(this.data, 'Parent')) {
            var updateParams = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
              R1_RequestTemplate: this.Setting.DataSource + ".Update",
              R1_RequestDataGroup: this.Setting.DataGroup,
              R1_RequestFields: "Id;TotalDownload",
              R1_Id: this.data.Parent
            }
            if (this.$Utils.isEmpty(this.parent, 'TotalDownload') && !isNaN(this.parent.TotalDownload)) {
              //console.log(parseInt(this.parent.TotalDownload))
              updateParams.R1_TotalDownload = parseInt(this.$Lodash.cloneDeep(this.parent.TotalDownload)) + fileList.length;
            } else {
              updateParams.R1_TotalDownload = fileList.length;
            }
            this.parent.TotalDownload = updateParams.R1_TotalDownload;
            this.$Utils.post(updateParams).then(data => {
              // this.$refs.upload.clearFiles();
              // this.getList();
            });
          }
          this.CountFile = 0;
          this.$refs.upload.clearFiles();
          this.getList();
        }
        //console.log(fileList);
      },
      submitUpload() {
        //console.log(this.$refs.upload);
        this.$refs.upload.submit();
      }

    }
  }
</script>
<style lang="scss">

</style>
