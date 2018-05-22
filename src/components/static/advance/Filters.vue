<template>
  <div>
    <div v-if="showEditForm">
      <FilterForm :selectedItem="rowItem" :isShow="showEditForm" :isNew="isAddNew" :closeCallback="hiddenForm"/>
    </div>
    <div v-if="!showEditForm">
      <el-row>
        <el-col :span="12">
          <el-button class="fa fa-plus" @click="handleAddNew"/>

          <el-button class="fa fa-refresh" @click="onReload"/>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchInput" placeholder="Tìm kiếm" prefix-icon="el-icon-search" clearable/>
        </el-col>
      </el-row>
      <el-table
        :data="arr"
        style="width: 100%">
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
          label="Khối dữ liệu">
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
              @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import FilterForm from "@/components/static/advance/FilterForm";

  export default {
    components: {FilterForm},
    data() {
      return {
        showEditForm: false,
        isAddNew: true,
        searchInput: '',
        keyword: '',
        arr: [],
        temp: [],
        rowItem: {},
      };
    },
    methods: {
      handleAddNew() {
        this.isAddNew = true;
        this.rowItem = {};
        this.showEditForm = true;
        //this.$router.push({ path: '/lists', query: { id: 'new' }});
      },
      onReload() {
        this.loadData();
      },
      hiddenForm() {
        this.isAddNew = true;
        this.rowItem = {};
        this.showEditForm = false;
        this.onReload();
      },
      editItem(item) {
      },
      handleEdit(index, row) {
        this.isAddNew = false;
        this.rowItem = row;
        this.showEditForm = true;
      },
      handleDelete(index, row) {
        this.$Utils.showConfirm('Cảnh báo', this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning)
          .then(() => {
            var request = {
              RequestClass: 'xBase',
              RequestAction: 'Request',
              TotalRequests: 1,
            };
            request.R1_RequestTemplate = 'Setting.SearchBase';
            request.R1_ParentId = row.Id;
            request.R1_IncludedNestedSetParent = true;
            if (row.Id === undefined || row.Id === '')
              this.$Utils.showMessage('error', 'Không định danh được đối tượng!');
            else {
              this.$Utils.showLoading('start');
              this.$Utils.post(request).then((data) => {
                data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
                request = {
                  RequestClass: 'xBase',
                  RequestAction: 'Request',
                  TotalRequests: 1,
                };
                var strListId = '';
                request.TotalRequests = 0;
                data.forEach((setting) => {
                  request.TotalRequests++;
                  request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.Delete';
                  request['R' + request.TotalRequests + '_Id'] = setting.Id;
                  strListId += setting.Id + ';'
                });
                if (request.TotalRequests > 0) {
                  this.$Utils.post(request).then(() => {
                    this.$Utils.showMessage('success', this.$toastMessage.deleteItemPre + this.$toastMessage.deleteItemSuf);
                    this.$Utils.removeAllLink(strListId);
                    this.arr.splice(index, 1);
                    this.$Utils.showLoading('stop');
                  });
                }
              });
            }
          });
      },
      loadData() {
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: 1,
          R1_RequestTemplate: "SettingNew.SearchSetting",
          R1_ParentCode: "xSetting.Project.Filter",
          R1_Level: 4
        };
        this.$Utils.postCheckResult(request).then(response => {
          if (response.success) {
            this.arr = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");
            this.temp = this.$Lodash.cloneDeep(this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting"));
          }
        });
      },
      reload() {
        this.loadData();
        this.$router.push('/filters');
      }
    },
    mounted() {

    },
    created() {
      this.loadData();
    },
    watch: {
      searchInput: function (newVal) {
        if (newVal.trim() !== '' || this.$Utils.isEmpty(newVal)) {
          this.arr = this.temp.filter(ele => {
            return JSON.parse(ele.Description).DataGroupCaption.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              JSON.parse(ele.Description).Caption.toLowerCase().indexOf(newVal.toLowerCase()) > -1 ||
              ele.Code.toLowerCase().indexOf(newVal.toLowerCase()) > -1
          })
        }
      }
    }
  };
</script>
