<template>
  <el-upload
    class="avatar-uploader"
    ref="upload"
    :action="action"
    :data ="data"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imgUrl!=''" :src="imgUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
  export default {
    props:['imageUrl'],
    data() {
      var data = {};
      if(this.imageUrl && this.imageUrl.indexOf('Download')>-1){
        data.imgUrl = this.$appUri.BaseURL + this.imageUrl;
      }else{
        data.imgUrl = '';
      }
      data.action= this.$appUri.BaseUri;
      return data;
    },
    created(){
      var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
      var sessionId = this.$getItemLocalStorage(
        this.$localStorageConstant.SessionId
      );
      this.data = {
        RequestClass: 'xBase',
        RequestAction: 'Upload',
        SessionId: sessionId,
        Username: currentUser.Username,
        Parent: currentUser.UserId,
        WriteTempFile: true
      }
    },
    destroyed(){
    },
    mounted(){

    },
    methods: {
      submitUpload() {
      },
      handleAvatarSuccess(res, file) {
        this.imgUrl = URL.createObjectURL(file.raw);
        this.$hub.$emit('imgUploaded', res.AttachmentId);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type.indexOf('image/') > -1;
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('Avatar  must be picture/image format!');
        }
        if (!isLt2M) {
          this.$message.error('Avatar picture size can not exceed 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 100;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>
