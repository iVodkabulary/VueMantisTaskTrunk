<template>
  <div>
    <div v-if="showEditForm">
      <ReportForm :selectedItem="rowItem" :isShow="showEditForm" :closeCallback="hiddenForm"/>
    </div>
    <el-dialog title="Thông tin chi tiết Báo cáo" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               show-close>
      <el-form :model="rulesForm" ref="newReport">
        <el-form-item prop="Name" label-width="180px" size="mini" label="Tên"
                      :rules="{
        required: true, message: 'Tên bắt buộc nhập', trigger: 'blur'
      }"
        >
          <el-input v-model="rulesForm.Name" auto-complete="off"></el-input>
        </el-form-item>

        <!--         <div layout="row">
              <md-button class="md-mini md-default" ng-click="ctrl.showPermission($event)" aria-label="Cấp phép" translate translate-attr-aria-label="" ng-if="ctrl.model.Id">Cấp phép
              </md-button>
            </div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">Lưu</el-button>
      <el-button @click="dialogFormVisible = false">Đóng</el-button>
    </span>
    </el-dialog>
    <div v-if="!showEditForm">
      <el-row>
        <el-col :span="12">
          <el-button class="fa fa-plus" @click="dialogFormVisible = true"/>

          <el-button class="fa fa-refresh" @click="reload"/>
        </el-col>
        <el-col :span="12">
          <el-input v-model="inputProps" placeholder="Tìm kiếm" prefix-icon="el-icon-search" clearable/>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="Stt"
        >
        </el-table-column>
        <el-table-column
          prop="Code"
          label="Mã"
        >
        </el-table-column>
        <el-table-column
          label="Tên"
        >
          <template slot-scope="scope">{{JSON.parse(scope.row.Description).Caption}}</template>
        </el-table-column>
        <el-table-column
          label="Khối dữ liệu">
          <template slot-scope="scope">{{JSON.parse(scope.row.Description).DataGroupCaption}}</template>
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
              @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import ReportForm from "@/components/static/advance/ReportForm";
  import AddReportForm from "@/components/static/advance/AddReportForm";

  export default {
    components: {ReportForm, AddReportForm},
    data() {
      return {
        rulesForm: {},
        dialogFormVisible: false,
        newReport: '',
        inputProps: '',
        showEditForm: false,
        ParentSetting: '',
        formInline: {
          user: "",
          region: "",
          searchText: ""
        },
        tableData: [],
        temp: []
      };
    },
    watch: {
      inputProps: function (newVal) {
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
      handleAddNew() {
        this.isAddNew = true;
        this.rowItem = {};
        // this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: 'new' }});
      },
      save() {
        var ctrl = this;
        this.$refs['newReport'].validate(valid => {
          if (valid) {
            var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            var arrCaption = ctrl.rulesForm.Name.split(';');
            var arrItems = [];
            request.TotalRequests = 0;
            $.each(arrCaption, function (index, caption) {
              if (caption != '') {
                request.TotalRequests++;
                var item = {
                  Code: 'Report.' + ctrl.$Utils.removeVNCharacters(caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
                  Description: JSON.stringify({
                    Caption: caption, ModuleType: 'Report',
                    ReportProportion: '65', ReportType: 'Column', TableProportion: '30', EnableDataSeries: 'false',
                    ShowReport: 'true', ShowReportHeader: 'true', ShowTable: 'true', AssignedUser: 'false',
                    Fields: {X: [], Y: [], V: [], T: [], Table: [], Series: [], Calculators: []}
                  }),
                  Caption: caption, Value: '[]'
                }
                ctrl.$Utils.updateParamsSingleRequest(request, item, request.TotalRequests);
                ctrl.$Utils.updateParamsSingleRequest(request, {
                  RequestTemplate: 'SettingNew.Insert',
                  NestedSetType: 'InsertLastChildNode',
                  ReferenceId: ctrl.ParentSetting,
                }, request.TotalRequests);
                arrItems.push(item);
              }
            });
            console.log(request)
            ctrl.$Utils.post(request).then(function (data) {
              if (data.success) {
                ctrl.$Utils.showMessage('success', ctrl.$toastMessage.updateItemPre + ctrl.$toastMessage.updateItemSuf);
                // ctrl.communication = {action: 'insert', items: []};
                var arrLinked = [];

                $.each(arrItems, function (index, item) {
                  arrLinked.push({
                    Id: data['R' + (index + 1)].Data,
                    Caption: item.Caption,
                    Name: 'Report'
                  });
                  // item.Id = data['R' + (index + 1)].Data;
                  // ctrl.communication.items.push(item);
                });
                ctrl.$Utils.linkToRoleEveryone(arrLinked);
                ctrl.bindLists()
              }
              else
                ctrl.$Utils.showMessage('error', ctrl.$toastMessage.updateItemFailed);

              ctrl.dialogFormVisible = false
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      reload() {
        this.bindLists();
      },
      hiddenForm(state) {
        //console.log(state)
        if (state)
          this.searchData();
        this.showEditForm = false;
      },
      showAddReport() {
        var dataToPass = {
          data: this.ParentSetting
        };
        this.$hub.$emit("open-modal");

        this.$hub.$emit(
          "set-modal-data",
          "Thêm mới báo cáo",
          "60%",
          true,
          "center",
          AddReportForm,
          true,
          'AddReportForm',
          dataToPass
        );
      },
      bindLists() {
        var currentUser = JSON.parse(localStorage.getItem("LoggedOnUser"));
        var sessionId = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        );

        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.Report",
          R1_Level: 4,
          SessionId: sessionId
        };
        this.$Utils.postCheckResult(request).then(response => {
          this.tableData = this.$Utils.getDataWithRoot(
            response.R1,
            "Data.DynamicDS.Setting"
          );
          this.temp = this.$Lodash.cloneDeep(this.tableData);
        });
      },
      bindParentSetting() {
        var ctrl = this;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_Code = 'xSetting.Project.Report';
        this.$Utils.post(request).then(function (data) {
          var dataS = data.R1.Data.DynamicDS.Setting;
          ctrl.ParentSetting = dataS.Id;
        })
      },
      insertReport() {

      },
      editItem(item) {
      },
      onSubmit() {
      },
      handleEdit(index, row) {
        this.isAddNew = false;
        this.rowItem = row;
        //console.log(this.rowItem);
        this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: row.Id }});
      },
      handleDelete(index, item) {
        var ctrl = this;
        this.$confirm('Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?', 'Cảnh báo', {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Đóng',
          type: 'warning'
        }).then(() => {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.Delete';
          request.R1_Id = item.Id;
          if (item.Id == undefined || item.Id == '') {
            ctrl.$Utils.showMessage('error', 'Không định danh được đối tượng!');
          } else {
            ctrl.$Utils.postCheckResult(request).then(function (data) {
              ctrl.$message({
                type: 'success',
                message: 'Xóa thành công'
              });
              ctrl.bindLists();
              ctrl.$Utils.removeAllLink(item.Id);
            })
          }
        }).catch(() => {
         /*  this.$message({
            type: 'info',
            message: 'Hủy xóa'
          }); */
        });
      }
    },
    mounted() {
      this.bindLists();
      this.bindParentSetting();
    },
    created() {
      this.$hub.$on('reload', data => {
        this.bindLists();
      });
    }
  };
</script>
