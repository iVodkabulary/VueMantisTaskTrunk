<template>

  <b-nav-item-dropdown right no-caret  >
    <template slot="button-content">
      <i class="fa-lg icon-plus"></i>
    </template>
    <b-dropdown-header tag="div" class="text-center" @click.stop ><strong>Thêm mới</strong></b-dropdown-header>
    <b-dropdown-item @click="addNewTask()"><i class="fa-lg icon-plus"></i>Công việc</b-dropdown-item>
    <b-dropdown-item  v-if="isManage" @click="addNewUser"><i class="fa-lg icon-user-follow"></i>Người dùng</b-dropdown-item>
     
  </b-nav-item-dropdown>

</template>
<script>
import Vue from "vue"
import UserInfo from "@/components/static/UserInfo" 
import utilsLibrary from '@/services/utils.js'

export default {
  components: { UserInfo },   
  data: () => {
    return {
     
      userModel: {},
      isManage: false,       
      isMobile: false,
      myDevice: '',
      curAvatar: '',
      //googleService:google
    };
  },
  methods: {
    addNewTask(e) {
        this.$router.push("/dynamic/task-report-page");
      },
    addNewUser(e) {
        this.$hub.$emit(
          "set-modal-data",
          "Tạo người dùng",
          "80%",
          true,
          "center",
          UserInfo,
          true,
          "",
          {action: "insert", scope: null}
        );
      },
     
     
     
  },
  mounted() {
    this.isMobile = this.$isMobileDevice;
    this.myDevice = this.$myDevice;
    this.isManage = (this.$isSystemAdmin() || this.$isMantisAdmin());
      
  },
  created() {
  }
};
</script>

