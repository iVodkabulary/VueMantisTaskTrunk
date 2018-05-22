<template>
  <div>
    <div v-if="showEditForm">
      <NotificationForm :selectedItem="rowItem" :isShow="showEditForm" :isNew="isAddNew" :closeCallback="hiddenForm" />
    </div>
    <div v-if="!showEditForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="handleAddNew">Thêm mới</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Tải lại</el-button>
        </el-form-item>
        <el-form-item label="Tìm kiếm">
          <el-input v-model="formInline.user" placeholder="Approved by"></el-input>
        </el-form-item>
        <!--
         <el-form-item label="">
            <div class="block">
           <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page.sync="currentPage"
             :page-size="pagesize"
             layout="total, prev, pager, next, jumper"
             :total="totalPage">
           </el-pagination>
         </div>
         </el-form-item>
        -->
      </el-form>
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         label="Stt">
        </el-table-column>
        <el-table-column prop="Code"
                         label="Mã">
        </el-table-column>
        <el-table-column label="Tên">
          <template slot-scope="scope">
            {{JSON.parse(scope.row.Description).Caption}}
          </template>
        </el-table-column>
        <!--       <el-table-column
                label="Khối dữ liệu">
                <template slot-scope="scope">{{JSON.parse(scope.row.Description).DataGroupCaption}}</template>
              </el-table-column> -->
        <el-table-column label="Hành động">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit" /></el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import NotificationForm from "@/components/static/advance/NotificationForm"
  export default {
    components: { NotificationForm },
    data() {
      return {
        showEditForm: false,
        isAddNew: false,
        formInline: {
          user: "",
          region: ""
        },
        rowItem: {},
        tableData: []
      };
    },
    methods: {
      editItem(item) { },
      hiddenForm(state) {
        // console.log(state)
        if (state)
          this.searchData();
        this.showEditForm = false;
      },
      onSubmit() { },
      handleAddNew() {
        this.isAddNew = true;
        this.rowItem = { ParentId: this.tableData[0].ParentId };
        this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: 'new' }});
      },
      handleEdit(index, row) {
        this.isAddNew = false;
        this.rowItem = row;
        //console.log(this.rowItem);
        this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: row.Id }});

      },
      handleDelete(index, item) {
        //console.log(item.Id);
        var ctrl = this;
        ctrl.$Utils.showConfirm('Cảnh báo', ctrl.$toastMessage.oneWayAction + ctrl.$toastMessage.deleteSettingWarning).then(function () {
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_Id = item.Id;
          if (item.Id == undefined || item.Id == '')
            ctrl.$Utils.showMessage('error', 'Không định danh được đối tượng!');
          else {
            ctrl.$Utils.postCheckResult(request).then(function (data) {
              if (data.success) {

                ctrl.$Utils.removeAllLink(item.Id);
                var delRequest = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
                delRequest.R1_RequestTemplate = 'SettingNew.Delete';
                delRequest.R1_Id = item.Id;
                ctrl.$Utils.post(delRequest).then(function (dataD) {
                  ctrl.$Utils.showMessage('success', ctrl.$toastMessage.deleteItemPre + ctrl.$toastMessage.deleteItemSuf);
                })
                ctrl.tableData.splice(index, 1);
              }
              else
                ctrl.$Utils.showMessage('error', ctrl.$toastMessage.updateItemFailed);
            });
          }
        });
      },
      searchData() {
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.Notification",
          //R1_Level: 4,
        };
        this.$Utils.post(request).then(response => {
          this.tableData = this.$Utils.getDataWithRoot(
            response.R1,
            "Data.DynamicDS.Setting"
          );
          //console.log(JSON.parse(this.tableData[0].Description).Caption);
        });
      }
    },
    mounted() {
      this.showEditForm = (this.$route.query != undefined && this.$route.query.id != null && this.$route.query.id !== '');
      //alert(this.$route.query)
      this.isAddNew = this.$route.query.id === 'new';
      if (!this.showEditForm) {
        var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );
        this.searchData();
      }
    }
  };
</script>
