<template>
  <div>
    <div v-if="showEditForm">
      <FormCfg :selectedItem="rowItem" :isShow="showEditForm" :isNew="isAddNew" :closeCallback="hiddenForm"/>
    </div>
    <div v-if="!showEditForm">

      <el-row>
        <el-col :span="12">
          <el-button class="fa fa-plus" @click="handleAddNew"></el-button>

          <el-button class="fa fa-refresh" @click="onReload"></el-button>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" placeholder="Tìm kiếm"></el-input>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="Stt"></el-table-column>
        <el-table-column prop="DataGroup" label="Khối"></el-table-column>
        <el-table-column prop="Code" label="Mã hệ thống"></el-table-column>
        <el-table-column label="Tên">
          <template slot-scope="scope">{{scope.row.Caption}}</template>
        </el-table-column>
        <el-table-column
          label="Khối dữ liệu">
          <template slot-scope="scope">{{scope.row.DataGroupCaption}}</template>
        </el-table-column>
        <el-table-column
          label="Hành động">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"/></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="openDeleteDialog(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="Cảnh báo"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Hủy</el-button>
     <el-button type="primary" @click="handleDelete">Xác nhận</el-button>
     </span>
    </el-dialog>
  </div>

</template>

<script>
  import FormCfg from "@/components/static/advance/Form";

  export default {
    components: {FormCfg},
    data() {
      return {
        deleteDialogVisible: false,
        showEditForm: false,
        isAddNew: false,
        keyword:'',
        rowItem: {},
        tableData: [],
        fullListForm: [],
        selectedRow: {},
        currentUser: JSON.parse(localStorage.getItem("LoggedOnUser"))
      }
    },
    methods: {
       handleAddNew() {
        this.isAddNew = true;
        this.rowItem = {};
        this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: 'new' }});
      },
      editItem(item) {
      },
      onReload() {
        this.loadData();
      },
      hiddenForm() {
        this.showEditForm = false;
        this.loadData();
      },
      handleEdit(index, row) {
        this.isAddNew = false;
        this.rowItem = row;
        this.showEditForm = true;
      },
      openDeleteDialog(index, row) {
        this.deleteDialogVisible = true;
        this.selectedRow = row;
      },
      handleDelete() {
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'SettingNew.SearchSetting',
          R1_ParentId: this.selectedRow.Id,
          R1_IncludedNestedSetParent: 'true'
        };

        this.$Utils.post(request).then(response => {
          response = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
          request = this.$Lodash.cloneDeep(this.$singleRequest);
          var strListId = '';
          request.TotalRequests = 0;
          response.forEach(function (setting) {
            request.TotalRequests++;
            request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.Delete';
            request['R' + request.TotalRequests + '_Id'] = setting.Id;
            strListId += setting.Id + ';'
          });
          if (request.TotalRequests > 0) {
            this.$Utils.post(request).then(response => {
              this.$Utils.removeAllLink(strListId);
              this.loadData();
            });
          }
          ;
        });

        this.deleteDialogVisible = false;
      },
      loadData() {
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.Form",
          R1_Level: 4
        };
        this.$Utils.postCheckResult(request).then(response => {
          this.fullListForm = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");
          this.tableData = this.$Lodash.cloneDeep(this.fullListForm);
        });
      }
    },
    mounted() {
      this.loadData();
    },
    watch: {
      keyword: function (newVal) {
        if(newVal.trim() !== ''){
          this.tableData = this.fullListForm.filter(ele => {
            var json = JSON.parse(ele.Description);
            var a = json.DataGroupCaption==undefined?'':json.DataGroupCaption;
            var b  = ele.Caption==undefined?'':ele.Caption;
            var c  = ele.DataGroup==undefined?'':ele.DataGroup;

            var valid = a.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              b.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              c.toLowerCase().indexOf(newVal.toLowerCase()) > -1
            return valid;
          });


        }

      }



    }
  };
</script>
