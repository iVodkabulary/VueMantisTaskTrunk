<template>
  <div>
    <div v-if="showEditForm">
      <ListForm :selectedItem="rowItem" :isShow="showEditForm" :isNew="isAddNew" :closeCallback="hiddenForm"/>
    </div>
    <div v-if="!showEditForm">
      <el-row>
        <el-col :span="12">
          <el-button class="fa fa-plus" @click="handleAddNew"/>

          <el-button class="fa fa-refresh" @click="onReload"/>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" placeholder="Tìm kiếm" prefix-icon="el-icon-search" clearable />
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="Stt"
        >
        </el-table-column>
        <el-table-column
          prop="DataGroup"
          label="Khối"
        >

        </el-table-column>
        <el-table-column prop="Code" label="Mã hệ thống"></el-table-column>
        <el-table-column
          label="Tên"
        >
          <template slot-scope="scope">{{JSON.parse(scope.row.Description).Caption}}</template>
        </el-table-column>
        <el-table-column
          label="Khối dữ liệu"
        >
          <template slot-scope="scope">{{JSON.parse(scope.row.Description).DataGroupCaption}}</template>
        </el-table-column>
        <el-table-column
          label="Hành động">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="showDeleteDialog(scope)"><i class="el-icon-delete"></i></el-button>
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
     <el-button type="primary" @click="handleDelete(selectedItem.$index, selectedItem.row)">Xác nhận</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>

  import ListForm from "@/components/static/advance/ListForm";

  export default {
    components: {ListForm},
    data() {
      return {
        deleteDialogVisible: false,
        showEditForm: false,
        isAddNew: false,
        rowItem: {},
        tableData: [],
        keyword: "",
        temp: [],
        selectedItem: {}
      };
    },
    watch: {
      keyword: function (newVal) {
        if (newVal.trim() !== '' || this.$Utils.isEmpty(newVal)) {
          this.tableData = this.temp.filter(ele => {
            return JSON.parse(ele.Description).DataGroupCaption.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              ele.Caption.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              ele.Code.toLowerCase().indexOf(newVal.toLowerCase()) > -1
          })
        }
      }
    },
    methods: {
      showDeleteDialog(scope){
        this.deleteDialogVisible = true;
        this.selectedItem = scope;
      },
      onReload() {
        this.loadData();
      },
      handleDelete(index, item) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentId = item.Id;
        request.R1_IncludedNestedSetParent = true;
        if(item.Id != undefined && item.Id.trim() != "") {
          this.$Utils.post(request).then(data => {
            data = this.$Utils.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
            request = this.$Lodash.cloneDeep(this.$singleRequest);
            var strListId = "";
            request.TotalRequests = 0;
            data.forEach(setting => {
              request.TotalRequests++;
              request["R" + request.TotalRequests + "_RequestTemplate"] =
                "SettingNew.Delete";
              request["R" + request.TotalRequests + "_Id"] = setting.Id;
              strListId += setting.Id + ";";
            });
            if (request.TotalRequests > 0) {
              this.$Utils.post(request).then(item => {
                this.$Utils.removeAllLink(strListId);
                this.tableData.splice(index, 1);
              });
            }
          });
        }
        this.deleteDialogVisible = false;
      },
      editItem(item) {
      },
      hiddenForm() {
        this.showEditForm = false;
        this.loadData();
      },
      onSubmit() {
      },
      handleAddNew() {
        this.isAddNew = true;
        this.rowItem = {};
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
      loadData() {
        if (!this.showEditForm) {
          var sessionId = this.$getItemLocalStorage(
            this.$localStorageConstant.SessionId
          );
        }
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.List",
          R1_Level: 4
        };
        this.$Utils.postCheckResult(request).then(response => {
          this.tableData = this.$Utils.getDataWithRoot(
            response.R1,
            "Data.DynamicDS.Setting"
          );
          this.temp = this.$Lodash.cloneDeep(this.$Utils.getDataWithRoot(
            response.R1,
            "Data.DynamicDS.Setting"
          ));
        });
      }
    },
    mounted() {
      this.showEditForm = this.$route.query !== undefined && this.$route.query.id != null && this.$route.query.id !== "";
      //alert(this.$route.query)
      this.isAddNew = this.$route.query.id === "new";
      this.loadData();
    }
  };
</script>
