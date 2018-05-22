<template>
  <div class="animated fadeIn document-list">
    <div class="page-header mb-2" v-if="(!$isMobileDevice || $isMobile.iPad()) ? true : false">
      <div class="title-box py-1 px-3">
        <div class="row">
          <h5 class="col m-auto"><i class="fa fa-folder-o"></i><span>  Tài liệu</span></h5>
          <div class="col text-right pr-0">
            <el-tooltip class="item" effect="dark" content="Thêm tài liệu" placement="top">
              <router-link :to="'dynamic/knowhow-add-new-document'" class="el-button el-button--mini">
                <i class="el-icon-plus"></i>
              </router-link>
            </el-tooltip>
            <button class="btn btn-link " v-b-modal.Filter>
              <i class="fa fa-filter fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div :class="($isMobileDevice ? '' : 'row') + ' my-row'">
      <div class="col-md-3 p-0 border-box">
        <div class="my-header d-md-none d-lg-none d-xl-none">
          <el-row style="width:100%">
            <el-col :span="12">
              <span><i class="fa fa-folder-o fa-lg pr-1"></i>Tài liệu</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <router-link :to="'dynamic/knowhow-add-new-document'">
                <i class="fa fa-plus fa-lg pr-1"></i>
              </router-link>
              <i class="fa fa-filter fa-lg pr-1" v-b-modal.Filter></i>

              <span class="pr-1" @click="isCollapse =! isCollapse">
                <i v-if="!isCollapse" class="fa fa-lg fa-caret-up"></i>
                <i v-if="isCollapse" class="fa fa-lg fa-caret-down"></i>
              </span>
            </el-col>
          </el-row>
        </div>
        <DocumentTree v-show="!isCollapse" :datasource="treeData" />
      </div>
      <div class="col-md-9">
        <el-container class="border-box bg-white">
          <el-main class="p-0">
            <data-tables :data="tableData" :search-def="searchDef" :pagination-def="paginationDef">
              <el-table-column label="Công cụ" sortable="custom" width="90">
                <template slot-scope="scope">
                  <div class="row pl-1">
                    <div v-for="(button, index) in listButtons" :key="index"
                         v-if="scope.row.btnLst[button.Code]">
                         <router-link :to="$Utils.expressionToString(scope.row, button.Redirect)"
                                   class="btn btn-link p-0 pr-1"
                                   v-if="button.ButtonType == 'Redirect' || button.ButtonType == 'Popup'"
                                   :id="'exButton'+index + scope.row.Id">
                        <i :class="button.Icon" aria-hidden="true"></i>
                        <b-tooltip :target="'exButton'+index  + scope.row.Id " placement="bottom">
                          {{(button.Description ? button.Description : button.Caption)}}
                        </b-tooltip>
                      </router-link>
                      <b-button :id="'exButton'+index + scope.row.Id" variant="link" aria-label="" class="p-0 pr-1"
                                v-on:click="onButtonClick(index,scope.row )"
                                v-if="button.ButtonType != 'Redirect' && button.ButtonType != 'Popup'">
                        <i :class="button.Icon" aria-hidden="true"></i>
                        <b-tooltip :target="'exButton'+index  + scope.row.Id " placement="bottom">
                          {{(button.Description ? button.Description : button.Caption)}}
                        </b-tooltip>
                      </b-button>
                    </div>
                  </div>
                  <!--<button @click="shareDocument(scope.row)">  share</button>-->
                </template>
              </el-table-column>
              <el-table-column label="Tiêu đề" sortable="custom" prop="Name">
              </el-table-column>
              <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop"
                               sortable="custom" width="90">
              </el-table-column>
            </data-tables>
          </el-main>
        </el-container>
      </div>
    </div>
    <b-modal id="Filter" ref="Filter" title="Bộ lọc" header-bg-variant="primary" hide-footer>
      <template>
        <el-form label-position="top">
          <el-form-item class="text-center">
            <el-button @click="searchList">Tìm kiếm</el-button>
            <el-button @click="clearInput()">Xóa trắng</el-button>
          </el-form-item>
          <el-form-item label="Từ khóa">
            <el-input v-model="form.Keyword" placeholder="Nhập từ khóa"></el-input>
          </el-form-item>
          <el-form-item label="Ngày tạo" style="width: 100%;">
            <el-date-picker type="daterange" :popper-class="$isMobileDevice ? 'MobileDateRange': ''" placeholder="Ngày tạo" v-model="form.Created"
                            style="max-width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="Ngày phát hành" style="width: 100%;">
            <el-date-picker :popper-class="$isMobileDevice ? 'MobileDateRange': ''" type="daterange" placeholder="Ngày phát hành" v-model="form.PublishedDate"
                            style="max-width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form>

      </template>
    </b-modal>
  </div>
</template>
<script>
import CreateDocumentForm from "@/components/static/CreateDocumentForm";
import DocumentTree from "@/components/static/DocumentTree";
import Download from "@/components/static/Download";
import PermissionSelector from "@/components/static/PermissionSelector";

export default {
  name: "categories",
  components: {
    CreateDocumentForm,
    DocumentTree,
    PermissionSelector
  },
  data() {
    return {
      completedSignal: 0,
      isCollapse: false,
      currentUser: this.$rootScope.loggedOnUser,
      arrPermission: {},
      paginationDef: {
        pageSize: 20,
        pageSizes: [10],
        currentPage: 1
      },
      searchDef: {
        inputProps: {
          placeholder: "Tìm kiếm tài liệu"
        },
        colProps: { span: 12 }
      },
      listButtons: [],
      showButton: false,
      ListField: [],
      titles: [],
      dialogVisible: false,
      activeName: "1",
      projects: [],
      years: [],
      documentCategories: [],
      groups: [],
      dates: [],
      filterTree: [],
      treeData: [
        {
          label: "Phòng ban",
          children: [],
          type: "group",
          icon: "icon-people",
          unread: 0,
          total: 0
        },
        {
          label: "Danh mục",
          children: [],
          type: "group",
          icon: "icon-notebook",
          unread: 0,
          total: 0
        },
        {
          label: "Dự án",
          children: [],
          type: "project",
          icon: "icon-drawer",
          unread: 0,
          total: 0
        },
        {
          label: "Ngày phát hành",
          children: [],
          type: "dates",
          icon: "icon-clock"
          // unread: 0,
          // total: 0
        }
      ],
      SettingForm: [],
      options: [],
      form: {
        Keyword: "",
        // Project: [],
        // Category: [],
        // VersionProject: [],
        Created: [],
        PublishedDate: []
      },
      documentList: [],
      tableData: [],
      categories: [],
      projects: [],
      versionProjects: [],
      Types: []
    };
  },
  methods: {
    addNewDocument(e) {
      this.$hub.$emit(
        "set-modal-data",
        "Thêm mới tài liệu",
        "80%",
        true,
        "left",
        CreateDocumentForm,
        true,
        "createDocument"
      );
    },
    editDocument(item) {
      var dataToPass = {
        item: item,
        categoryLst: this.documentCategories,
        departmentLst: this.groups,
        projectLst: this.projects
      };
      this.$hub.$emit(
        "set-modal-data",
        "Chỉnh sửa tài liệu",
        "80%",
        true,
        "left",
        CreateDocumentForm,
        true,
        "",
        dataToPass
      );
    },
    shareDocument(item) {
      this.$hub.$emit(
        "set-modal-data",
        "Chia sẻ tài liệu",
        "80%",
        true,
        "left",
        PermissionSelector,
        true,
        "",
        item.Id
      );
    },
    handleClick(tab, event) {
      if (this.activeName == 4) {
        this.treeData = [];
      }
    },
    handleNodeClick() {},
    clearInput() {
      this.form.Keyword = "";
      this.form.Created = [];
      this.form.PublishedDate = [];
    },
    searchSetting() {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 2,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_Code: "Form.cap-nhat-tai-lieu.0b27c",
        R2_RequestTemplate: "SettingNew.SearchSetting",
        R2_Code: "List.danh-sach-tai-lieu.064hg;"
      };
      this.$Utils.post(request).then(response => {
        var convertIcon = [];
        convertIcon["icon-delete"] = "fa fa-trash";
        convertIcon["icon-plus-circle"] = "fa fa-plus-circle";
        convertIcon["icon-pencil-box"] = "fa fa-pencil";
        convertIcon["icon-eye"] = "fa fa-eye";
        convertIcon["icon-briefcase-download"] = "fa fa-download";
        convertIcon["icon-share ic"] = "fa fa-share";
        var SettingForm = this.$Utils.getDataWithRoot(
          response.R2,
          "Data.DynamicDS.Setting"
        )[0];
        if (
          this.$Utils.isEmpty(SettingForm, "Description") &&
          this.$Lodash.isString(SettingForm.Description)
        )
          SettingForm.Description = JSON.parse(SettingForm.Description);
        $.each(SettingForm.Description, function(fKey, fData) {
          SettingForm[fKey] = fData;
        });
        this.SettingForm = SettingForm;
        var listButtons = this.SettingForm.Description.Buttons;
        this.completedSignal +=1;
        $.each(listButtons, (index, button) => {
          button.Icon = convertIcon[button.Icon];
          if (button.UserPermissions && button.UserPermissions.length > 0) {
            button.UserPermissions.forEach(bval => {
              if (JSON.stringify(this.currentUser.Roles).indexOf(bval) > -1) {
                button.DisplayPermit = true;
              }
            });
          }
          var extra = this.$Utils.stringToObject(button.ExtraSetting);
          $.each(extra, (k, val) => {
            button[k] = val;
          });
        });
        listButtons = listButtons.filter(function(el) {
          return el.ButtonDisplayType !== "Insert";
        });
        this.listButtons = this.$Lodash.cloneDeep(listButtons);

        var listField = JSON.parse(SettingForm.OF1);
        this.ListFields = this.$Lodash.cloneDeep(listField);
        var titles = [];

        $.each(listField, function(index, title) {
          if (title.Name !== "Name" && title.Name !== "Tool") {
            titles.push({
              prop: title.Name,
              label: title.Caption
            });
          }
        });
        this.titles = this.$Lodash.cloneDeep(titles);
      });
    },
    onButtonClick(index, row) {
      this.excuteButtonClick(this.listButtons[index], row);
    },
    checkPermit(button, item) {
      var case1 = false;
      var case2 = false;
        if(button.PermitToShow && this.arrPermission && this.$Utils.isEmpty(this.arrPermission[item.Id], button.PermitToShow)) {
          if(this.arrPermission[item.Id][button.PermitToShow].indexOf(this.currentUser.UserId) != -1){
            case1 = true;
          }else{
            $.each(this.arrPermission[item.Id][button.PermitToShow],(k, bval) =>{

              if (JSON.stringify(this.currentUser.Roles).indexOf(bval) > -1) {
                case1 = true;
                return false;
              }
            })
          }
        } else if(!button.PermitToShow) {
          case1 = true;
        }
        if ((button.UserPermissions && button.DisplayPermit) || !button.UserPermissions || button.UserPermissions.length == 0) {
          case2 = true;
        }
        return case1 && case2 && this.showButton;
    },
    excuteButtonClick(setting, item) {
      var strLinkType = setting.ButtonType
        ? setting.ButtonType
        : setting.ElementType;
      if (
        !setting.ButtonType &&
        setting.ElementType == "Link" &&
        setting.Redirect
      ) {
        strLinkType = "Redirect";
      }
      switch (strLinkType) {
        case "Click":
          switch (setting.Action) {
            case "Update":
              this.excuteUpdate(item, setting);
              break;
            case "Delete":
              this.excuteDelete(item, setting);
              break;
            case "ReturnData":
              break;
            case "Download":
              this.excuteDownload(setting, item);
              break;
            case "Audio":
              this.excuteAudio(setting, item);
              break;
            case "Call":
              break;
            case "Permission":
              this.shareDocument(item);
              break;
          }
          break;
        case "Popup":
          break;
        case "Redirect":
          break;
      }
    },
    excuteDownload(button, item) {
      var vm = this;
      var binaryDatas = [];
      var totalCount = 0;
      var params = {
        RequestClass: "xBase",
        RequestAction: "SearchBinary",
        Parent: item.Id,
        ConditionFields: "Parent",
        StaticFields:
          "Name;Created;Modified;FileName;FileExtension;FileSize;CreatedBy;Description;Parent;FileSize",
        DynamicFields: "CreatedByName;SignatureVerified"
      };
      vm.$Utils.postCheckResult(params).then(data => {
        binaryDatas = vm.$Utils.getDataWithRoot(data, "Data.DynamicDS.Binary");
        totalCount = data.TotalCount;
        this.$hub.$emit(
          "set-modal-data",
          "Chia sẻ tài liệu",
          "80%",
          true,
          "left",
          Download,
          true,
          "",
          binaryDatas
        );
      });
    },
    excuteDelete(items, setting) {
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
        .then(function() {
          if (!vm.$Utils.isEmpty(items, "length")) {
            items = [items];
          }
          vm.sendDeleteRequest(items, setting);
        });
    },
    sendDeleteRequest(items, setting) {
      var vm = this;
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: items.length,
        RequestTemplate: "xDocument_Document.Delete"
      };
      $.each(items, function(key, item) {
        request["R" + (key + 1) + "_Id"] = item.Id;
        request["R" + (key + 1) + "_DeleteReferenceData"] = item.Id;
      });
      /** gửi request xóa*/
      vm.$Utils.postCheckResult(request).then(function(result) {
        $.each(items, function(key, item) {
          var name = item.Name ? item.Name : item.Id;
          if (result["R" + (key + 1)].success) {
            vm.$Utils.showMessage("success", "Xóa Thành công");
            vm.tableData = vm.tableData.filter(function(el) {
              return el.Id != item.Id;
            });
          } else
            vm.$Utils.showMessage("error", "Có lỗi xảy ra");
        });
      });
    },
    searchList() {
      this.$hub.$emit("update-document-list", this.filterTree);
      this.$refs["Filter"].hide();
    },
    getBagNumber(documentCategoriesTmp, projectTmp, groupTmp, dateTmp, filter) {
      var ctrl = this;
      var req = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests:
          documentCategoriesTmp.length +
          projectTmp.length +
          groupTmp.length +
          dateTmp.length
      };
      for (var i = 1; i <= documentCategoriesTmp.length; i++) {
        req["R" + i + "_RequestTemplate"] = "xDocument_Document.Count";
        req["R" + i + '_AssignedUser'] = ctrl.$getItemLocalStorage(
           ctrl.$localStorageConstant.SessionId
        )
        req["R" + i + "_RequestDataGroup"] =
          "DataGroup.tai-lieu-dung-chung.0cb59";
        req["R" + i + "_Code"] = "Document";
        req["R" + i + "_SettingCategory"] = documentCategoriesTmp[i - 1].Id;
        req["R" + i + '_AssignedUser'] = ctrl.$getItemLocalStorage(
           ctrl.$localStorageConstant.SessionId
        )
        if (filter) {
          $.each(ctrl.form, function(key, val) {
            if (key == "Keyword") req["R" + i + "_" + key] = val;
            else if (val.length == 2) {
              req[
                "R" + i + "_" + key + "StartValue"
              ] = ctrl.$Utils.formatDateTime(val[0]);
              req[
                "R" + i + "_" + key + "EndValue"
              ] = ctrl.$Utils.formatDateTime(val[1]);
            }
          });
        }
      }
      var extra = documentCategoriesTmp.length;
      for (var i = 1; i <= projectTmp.length; i++) {
        req["R" + (i + extra) + "_RequestTemplate"] =
          "xDocument_Document.Count";
        req["R" + (i + extra) + "_RequestDataGroup"] =
          "DataGroup.tai-lieu-dung-chung.0cb59";
        req["R" + (i + extra) + "_Code"] = "Document";
        req["R" + (i + extra) + "_VersionProject"] = projectTmp[i - 1].Id;
        req["R" + (i + extra) + '_AssignedUser'] = ctrl.$getItemLocalStorage(
           ctrl.$localStorageConstant.SessionId
        )
        if (filter) {
          $.each(ctrl.form, function(key, val) {
            if (key == "Keyword") req["R" + (i + extra) + "_" + key] = val;
            else if (val.length == 2) {
              req[
                "R" + (i + extra) + "_" + key + "StartValue"
              ] = ctrl.$Utils.formatDateTime(val[0]);
              req[
                "R" + (i + extra) + "_" + key + "EndValue"
              ] = ctrl.$Utils.formatDateTime(val[1]);
            }
          });
        }
      }
      extra += projectTmp.length;
      for (var i = 1; i <= groupTmp.length; i++) {
        req["R" + (i + extra) + "_RequestTemplate"] =
          "xDocument_Document.Count";
        req["R" + (i + extra) + "_RequestDataGroup"] =
          "DataGroup.tai-lieu-dung-chung.0cb59";
        req["R" + (i + extra) + "_Code"] = "Document";
        req["R" + (i + extra) + "_Project"] = groupTmp[i - 1].GroupId;
        req["R" + (i + extra) + '_AssignedUser'] = ctrl.$getItemLocalStorage(
           ctrl.$localStorageConstant.SessionId
        )
        if (filter) {
          $.each(ctrl.form, function(key, val) {
            if (key == "Keyword") req["R" + (i + extra) + "_" + key] = val;
            else if (val.length == 2) {
              req[
                "R" + (i + extra) + "_" + key + "StartValue"
              ] = ctrl.$Utils.formatDateTime(val[0]);
              req[
                "R" + (i + extra) + "_" + key + "EndValue"
              ] = ctrl.$Utils.formatDateTime(val[1]);
            }
          });
        }
      }
      extra += groupTmp.length;
      for (var i = 1; i <= dateTmp.length; i++) {
        req["R" + (i + extra) + "_RequestTemplate"] =
          "xDocument_Document.Count";
        req["R" + (i + extra) + "_RequestDataGroup"] =
          "DataGroup.tai-lieu-dung-chung.0cb59";
        req["R" + (i + extra) + "_Code"] = "Document";
        req["R" + (i + extra) + '_AssignedUser'] = ctrl.$getItemLocalStorage(
           ctrl.$localStorageConstant.SessionId
        )
        var dateObj = this.$Utils.stringToObject(
          this.$Utils.decodeHtmlEntities(dateTmp[i - 1].Value)
        );
        $.each(dateObj, (key, val) => {
          req["R" + (i + extra) + "_PublishedDate" + key] = val;
        });
        if (filter) {
          $.each(ctrl.form, function(key, val) {
            if (key == "Keyword") req["R" + (i + extra) + "_" + key] = val;
            else if (val.length == 2) {
              req[
                "R" + (i + extra) + "_" + key + "StartValue"
              ] = ctrl.$Utils.formatDateTime(val[0]);
              req[
                "R" + (i + extra) + "_" + key + "EndValue"
              ] = ctrl.$Utils.formatDateTime(val[1]);
            }
          });
        }
      }
      this.$Utils.postCheckResult(req).then(countData => {
        var index = 1;
        var sumxt = 0;
        var xt = documentCategoriesTmp.filter(function(item) {
          item.total = countData["R" + index].Data;
          index++;
        });

        var sumyt = 0;
        var yt = projectTmp.filter(function(item) {
          item.total = countData["R" + index].Data;
          sumyt += parseInt(item.total);
          index++;
        });

        var sumzt = 0;
        var zt = groupTmp.filter(function(item) {
          item.total = countData["R" + index].Data;
          index++;
        });


        // var sumt = 0;
        // var t = dateTmp.filter(function (item) {
        //   item.total = countData['R' + index].Data;
        //   sumt += parseInt(item.total);
        //   index++;
        // });
        // this.treeData[3].total = sumt;

        ctrl.documentCategories = documentCategoriesTmp;
        ctrl.projects = projectTmp;
        ctrl.groups = groupTmp;
        ctrl.dates = dateTmp;
      });
    },
    reloadDataLst(){
      var vm = this;
      this.tableData = $.map(vm.documentList, (v, i) => {
        var returnItem = {
          Name: v.Name,
          FileTypeName:
          "fa fa-file-" +
          (v.FileTypeName == "xls" || v.FileTypeName == "xlsx"
            ? "excel"
            : v.FileTypeName) +
          "-o",
          Created: vm.$Utils.formatDateTime(v.Created, "DD/MM/YYYY"),
          CreatedBy: v.CreatedByName,
          Category: v.CategoryName,
          Project: v.ProjectName,
          VersionProject: v.VersionProjectName,
          Id: v.Id,
          btnLst: {},
        };
        vm.listButtons.forEach(button=>{
          returnItem.btnLst[button.Code] = vm.checkPermit(button, {Id: v.Id});
        });
        return returnItem;
      });
    }
  },
  watch: {
    dates: function(newdates) {
      var dateTmp = this.$Utils.createCustomTreeFromList(
        newdates,
        "Id",
        "ParentId",
        "children",
        { Name: "label", Value: "value" },
        { type: "dates", icon: "icon-folder" }
      );
      this.treeData[3].children = dateTmp;
    },
    groups: function(newgroups) {
      var groupsTmp = this.$Utils.createCustomTreeFromList(
        newgroups,
        "Id",
        "ParentId",
        "children",
        { GroupName: "label", GroupId: "value" },
        { type: "group", icon: "icon-folder" }
      );
      this.treeData[0].total = 0;
      $.each(groupsTmp, (key, val)=>{
        this.treeData[0].total+= parseInt(val.total)
      })
      this.treeData[0].children = groupsTmp;
    },
    documentCategories: function(newDocumentCategories) {
      var cates = this.$Utils.createCustomTreeFromList(
        newDocumentCategories,
        "Id",
        "ParentId",
        "children",
        { Name: "label", Id: "value" },
        { type: "category", icon: "icon-folder" }
      );
      this.treeData[1].total = 0;
      $.each(cates, (key, val)=>{
        this.treeData[1].total+= parseInt(val.total)
      })
      this.treeData[1].children = cates;
    },
    projects: function(newprojects) {
      var projectsTmp = this.$Utils.createCustomTreeFromList(
        newprojects,
        "Id",
        "ParentId",
        "children",
        { Name: "label", Id: "value" },
        { type: "project", icon: "icon-folder" }
      );
      this.treeData[2].total = 0;
      $.each(projectsTmp, (key, val)=>{
        this.treeData[2].total+= parseInt(val.total)
      })
      this.treeData[2].children = projectsTmp;
    },
    completedSignal: function(after){
      if(after >= 2){
        this.reloadDataLst();
      }
    },
  },
  created() {},
  mounted() {
    var ctrl = this;
    ctrl.searchSetting();
    this.$hub.$on("update-document-list", data => {
      var filter = true;
      if (this.filterTree == data) {
        filter = false;
      }
      this.filterTree = ctrl.$Lodash.cloneDeep(data);
      if (data.length == 0 && filter) {
        this.documentList = [];
        this.tableData = [];
      } else {
        var typeReq = "";
        if (data.type === "project") {
          typeReq = "_VersionProject";
        } else if (data.type === "group") {
          typeReq = "_Project";
        } else if (data.type === "category") {
          typeReq = "_SettingCategory";
        } else {
          typeReq = "_PublishedDate";
        }
        var request = {
          RequestClass: "xBase",
          RequestAction: "Request",
          TotalRequests: data.length
        };

        for (var i = 1; i <= data.length; i++) {
          var typeReq = "";
          if (data[i - 1].type === "project") {
            typeReq = "_VersionProject";
          } else if (data[i - 1].type === "group") {
            typeReq = "_Project";
          } else if (data[i - 1].type === "category") {
            typeReq = "_SettingCategory";
          } else {
            typeReq = "_PublishedDate";
          }

          if (filter) {
            $.each(ctrl.form, function(key, val) {
              if (key == "Keyword") request["R" + i + "_" + key] = val;
              else if (val.length == 2) {
                request[
                  "R" + i + "_" + key + "StartValue"
                ] = ctrl.$Utils.formatDateTime(val[0]);
                request[
                  "R" + i + "_" + key + "EndValue"
                ] = ctrl.$Utils.formatDateTime(val[1]);
              }
            });
          }

          request["R" + i + "_RequestTemplate"] = "xDocument_Document.Search";
          (request["R" + i + "_RequestDataGroup"] =
            "DataGroup.tai-lieu-dung-chung.0cb59"),
            (request["R" + i + "_RequestFields"] =
              "Id;Tool;Name;Created;CreatedByName;CreatedBy;CategoryName;SettingCategory;Category;ProjectName;Project;VersionProjectName;VersionProject;CategoryName;Id;CreatedByName;ModifiedByName;Code;FileTypeName;ProjectName;TypeName;VersionProjectName;PublishedDate");
          request["R" + i + "_Code"] = "Document";
          request["R" + i + '_AssignedUser'] = ctrl.$getItemLocalStorage(
             ctrl.$localStorageConstant.SessionId
          )
          if (typeReq == "_PublishedDate") {
            var dateObj = this.$Utils.stringToObject(
              this.$Utils.decodeHtmlEntities(data[i - 1].value)
            );
            $.each(dateObj, (key, val) => {
              request["R" + i + typeReq + key] = val;
            });
          } else request["R" + i + typeReq] = data[i - 1].value;
          if (!filter) {
            $.each(ctrl.form, function(key, val) {
              if (key == "Keyword") request["R" + i + "_" + key] = val;
              else if (val.length == 2) {
                request[
                  "R" + i + "_" + key + "StartValue"
                ] = ctrl.$Utils.formatDateTime(val[0]);
                request[
                  "R" + i + "_" + key + "EndValue"
                ] = ctrl.$Utils.formatDateTime(val[1]);
              }
            });
          }
        }

        if (data.length == 0 && !filter) {
          request.TotalRequests = 1;
          $.each(ctrl.form, function(key, val) {
            if (key == "Keyword") request["R1_" + key] = val;
            else if (val.length == 2) {
              request["R1_" + key + "StartValue"] = ctrl.$Utils.formatDateTime(
                val[0]
              );
              request["R1_" + key + "EndValue"] = ctrl.$Utils.formatDateTime(
                val[1]
              );
            }
          });
        }
        this.$Utils.postCheckResult(request).then(result => {
          this.documentList = [];
          this.showButton = false;
          for (var k = 1; k <= data.length; k++) {
            if (result["R" + k].Data.DocumentDS.Document != undefined) {
              var resultArr = this.$Utils.getDataWithRoot(
                result["R" + k],
                "Data.DocumentDS.Document"
              );
              this.documentList = this.$Lodash.unionBy(
                resultArr,
                this.documentList,
                "Id"
              );
              //this.documentList = this.documentList.concat(result['R' + k].Data.DocumentDS.Document);
            }
          }
          if (!filter)
            this.getBagNumber(
              ctrl.documentCategories,
              ctrl.projects,
              ctrl.groups,
              ctrl.dates,
              true
            );
          var paramsSearchLinked = {
            RequestClass: "xBase",
            RequestAction: "Request",
            TotalRequests: this.documentList.length,
            RequestTemplate: "Permission"
          };
          $.each(this.documentList, (key, link) => {
            this.arrPermission[link.Id] = {};
            paramsSearchLinked["R" + (key + 1) + "_Parent"] = link.Id;
          });
          this.$Utils.post(paramsSearchLinked).then(result => {
            $.each(result, (k, r) => {
              r = this.$Utils.getDataWithRoot(r, "Data.DataDS.Linked");
              if (this.$Utils.isEmpty(r) && r.length > 0)
                $.each(r, (k, value) => {
                  if (
                    !this.$Utils.isEmpty(
                      this.arrPermission[r[0].Parent][value.Code]
                    )
                  )
                    this.arrPermission[r[0].Parent][value.Code] = [];
                  this.arrPermission[r[0].Parent][value.Code].push(value.Child);
                });
            });
            this.showButton = true;
            this.completedSignal +=1;
          });
        });
      }
    });

    var request = {
      RequestClass: "xBase",
      RequestAction: "Request",
      TotalRequests: 4,
      R1_RequestTemplate: "SettingNew.SearchSetting",
      R1_ParentCode: "xSetting.Project.Parameter.Category",
      R1_GroupType: 1,
      R2_RequestTemplate: "xDocument_Document.Search",
      R2_RequestDataGroup: "DataGroup.quan-ly-du-an.053gf",
      R2_RequestFields:
        "Id;Tool;TypeName;Name;ManagerName;StatusName;StateName;PermitName;Progress;DepartmentName;PlanManHour;ActualManHour;FinishDate;PriorityName;ProductName;StartDate;Version;Code;CreatedBy;Department;Id;Manager;ModifiedBy;Priority;PriorityDescription;PriorityId;State;Status;Type;Permit;Describe;Active;ActiveName;ProjectCode;Department;DepartmentName;Manager;ManagerName;Worker;WorkerName",
      R2_Code: "Project",
      R2_ParentCode: "xSetting.Project.Parameter.Organization.Category",
      R3_RequestTemplate: "OrgnizationList",
      R3_GroupType: 1,
      R4_RequestTemplate: "Setting.SearchBase",
      R4_ParentCode: "xSetting.Project.Parameter.PublicDate",
      R4_RequestOrderFields: "Name"
    };
    this.$Utils.post(request).then(resData => {
      var documentCategoriesTmp = ctrl.$Utils.getDataWithRoot(
        resData.R1,
        "Data.DynamicDS.Setting"
      );
      var projectTmp = ctrl.$Utils.getDataWithRoot(
        resData.R2,
        "Data.DocumentDS.Document"
      );
      var groupTmp = ctrl.$Utils.getDataWithRoot(
        resData.R3,
        "Data.UserDS.Group"
      );
      var dateTmp = ctrl.$Utils.getDataWithRoot(
        resData.R4,
        "Data.DynamicDS.Setting"
      );
      this.getBagNumber(documentCategoriesTmp, projectTmp, groupTmp, dateTmp);
    });
  }
};
</script>
<style lang="scss">
.document-list {
  #Filter {
    height: 100%;
    .modal-dialog {
      position: fixed;
      right: 0px;
      margin: 0px;
      height: 100%;
      .modal-content {
        height: 100%;
      }
    }
  }

  .title-box {
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
  }

  .createDocument {
    .el-dialog__header {
      text-align: left;
      background-color: #5090c1;
      .el-dialog__title {
        color: #fff;
      }
    }

    .el-dialog__footer {
      text-align: right;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #fff;
      }
    }
  }

  .el-aside {
    color: #333;
  }

  .border-box {
    border: 1px solid #5090c1;
  }

  .my-row {
    .col-md-9 {
      padding: 0px !important;
    }
  }

  .my-header {
    display: flex;
    justify-content: space-between;
    background-color: #f0f3f5;
    /*border: 1px solid #c2cfd6;*/
    padding: 0 10px 3px 10px;
    cursor: pointer;
  }
}
</style>
