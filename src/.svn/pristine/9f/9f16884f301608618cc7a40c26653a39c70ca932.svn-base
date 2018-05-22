<template>
  <div>
    <el-form :inline="!$isMobileDevice" label-width="120px">
          <el-form-item label="Loại tham số:">

          <el-select v-model="selectedParamCodes" @change="handleCodeChange" clearable placeholder="Chọn">
            <el-option v-for="item in paramCodes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="Tham số:">

          <el-select v-model="selectedParams" @change="handleParamChange" clearable placeholder="Chọn">
            <el-option v-for="item in params"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Code"
                       >
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item v-if="isAddAble">
          <el-button type="primary" plain @click="addnew">Thêm</el-button>
      </el-form-item>
    </el-form>
     <el-table ref="paramTable"
                  :data="dataTable"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           label="Stt"
                           >
          </el-table-column>
          <el-table-column prop="Name"
                           label="Tham số"
                           >
                            <template slot-scope="scope">
                             <div v-if="scope.row.Color != undefined && scope.row.Color != null && scope.row.Color != ''" :style="'text-align: center; background-color:'+scope.row.Color">
                              <span  >{{scope.row.Name}} </span>
                              </div>
                              <div v-else  :style="'text-align: center'">
                                <span >{{scope.row.Name}} </span>
                              </div>
                            </template>
          </el-table-column>
          <!--<el-table-column label="Xử lý">
          </el-table-column>-->
          <el-table-column label="Xử lý">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
              <el-button size="mini"
                         @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
  </div>
</template>
<script>
import ParameterSetting from "@/components/static/ParameterSetting";
import utilsLibrary from "@/services/utils";

export default {
  components: {
    ParameterSetting
  },
  data() {
    return {
      paramCodes: [
        {
          value: "xSystem.Setting.xTask",
          label: "Tham số công việc"
        },
        {
          value: "xSetting.Project.Parameter.DocumentView",
          label: "Tham số tài liệu"
        }
      ],
      selectedParamCodes: "",
      params: [],
      selectedParams: "",
      selectedParamsId: "",
      dataTable: [],
      sessionId: "",
      isAddAble: false
    };
  },
  methods: {
    handleCodeChange(value) {
      if (value == undefined || value == null || value == "") {
        this.params = [];
      } else {
        this.loadParamCodes(value);
      }
      this.selectedParams = "";
      this.selectedParamsId = "";
      this.dataTable = [];
    },
    handleParamChange(value) {
      if (value == undefined || value == null || value == "") {
        this.reload();
        this.isAddAble = false;
        this.selectedParamsId = "";
      } else {
        this.loadParams(value);
        this.selectedParamsId = this.params.filter(ele => {
          return ele.Code === value;
        })[0].Id;
        this.isAddAble = true;
      }
    },
    loadParamCodes(newCode) {
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_IncludedNestedSetParent: false,
        R1_Level: 5,
        R1_ParentCode: newCode,
        SessionId: this.sessionId
      };
      this.$Utils.post(request).then(data => {
        this.params = this.$Utils.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        if (newCode === "xSystem.Setting.xTask") {
          this.params.push({ Name: "Độ ưu tiên", Code: "TaskPriority" });
        }
      });
    },
    loadParams(newParam) {
      if (newParam === "TaskPriority") {
        var request1 = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "xEdu.TaskPriority",
          R1_Code: newParam
        };
        utilsLibrary.post(request1).then(data => {
          var lstParameter = utilsLibrary.getDataWithRoot(
            data.R1,
            "Data.DocumentDS.Document"
          );
          $.each(lstParameter, (key, item) => {
            item.Color = item.Lead;
          });
          this.dataTable = lstParameter;
        });
      } else {
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_IncludedNestedSetParent: false,
          R1_ParentCode: newParam,
          SessionId: this.sessionId
        };
        this.$Utils.post(request).then(data => {
          this.dataTable = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
        });
      }
    },
    reload() {
      this.dataTable = [];
    },
    searchData() {
      this.loadParams(this.selectedParams);
    },
    handleEdit(index, row) {
      var data = {
        paramtypes: this.paramCodes,
        parameter: row,
        selectedParams: this.selectedParams
      };
      this.showdialog(data);
    },
    handleDelete(index, row) {
      var vm = this;
      vm
        .$confirm(
          "Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?",
          "Cảnh Báo",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Bỏ qua",
            type: "warning"
          }
        )
        .then(() => {
          if (vm.selectedParams != "TaskPriority") {
            vm.deleteSetting(row);
          } else {
            vm.deletePriority(row);
          }
        })
        .catch(() => {});
    },
    deleteSetting(row) {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.Delete",
        R1_Id: row.Id
      };
      vm.$Utils.post(request).then((data) => {
        if (data.success) {
          vm.$Utils.showMessage("success", "Xóa Thành công");
          vm.searchData();
        } else {
          vm.$Utils.showMessage("error", "Có lỗi xảy ra");
        }
      });
    },
    deletePriority(row) {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "xEdu.TaskPriority.Delete",
        R1_RequestFields: "Code; Name; Description; Id",
        R1_Id: row.Id
      };
      utilsLibrary.post(request).then((data)=> {
        if (data.success) {
          utilsLibrary.showMessage("success", "Xóa thành công");
          vm.searchData();
        } else {
          utilsLibrary.showMessage("success", "Không thể xóa bản ghi này");
        }
      });
    },
    addnew() {
      var data = {
        paramCodes: this.paramCodes,
        params: this.params,
        selectedParamCodes: this.selectedParamCodes,
        selectedParams: this.selectedParams,
        selectedParamsId: this.selectedParamsId,
        isAddNew: false
      };
      this.showdialog(data);
    },
    showdialog(data) {
      this.$hub.$emit(
        "set-modal-data",
        "Thông tin thiết lập",
        "50%",
        true,
        "left",
        ParameterSetting,
        true,
        "",
        data
      );
    }
  },
  created() {
    this.sessionId = this.$getItemLocalStorage(
      this.$localStorageConstant.SessionId
    );
    this.$hub.$on("loadParameter", data => {
      this.searchData();
    });
  },
  watch: {},
  destroyed() {
    this.$hub.$off("loadParameter");
  }
};
</script>
<style scoped>

</style>
