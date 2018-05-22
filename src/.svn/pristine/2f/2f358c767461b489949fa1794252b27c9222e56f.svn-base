<template>
  <el-form ref="form" :model="model" label-width="120px" class="documentForm">
    <el-form-item>
      <el-col :span="12">
        <el-select v-model="model.Category" placeholder="Danh mục" style="width: 90%;">
          <el-option v-for="item in categories"
                     :key="item.Id"
                     :label="item.text"
                     :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="model.Project" placeholder="Phòng ban" style="width: 90%;" @change="changeProject">
          <el-option v-for="item in projects"
                     :key="item.GroupId"
                     :label="item.text"
                     :value="item.GroupId" :value-key="item">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-select v-model="model.VersionProject" placeholder="Dự án" style="width: 90%;">
          <el-option v-for="item in versionProjects"
                     :key="item.Id"
                     :label="item.Name"
                     :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="model.Type" placeholder="Nghiệp vụ" style="width: 90%;">
          <el-option v-for="item in Types"
                     :key="item.Id"
                     :label="item.Name"
                     :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-date-picker type="date" placeholder="Ngày tạo" v-model="model.Created" format="dd-MM-yyyy" style="width: 90%;"></el-date-picker>
      </el-col>
      <el-col :span="12">
        <el-date-picker type="date" placeholder="Ngày phát hành" v-model="model.PublishedDate" format="dd-MM-yyyy" style="width: 90%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-select v-model="model.FileType" placeholder="Phân loại" style="width: 90%;">
          <el-option v-for="item in FileTypes"
                     :key="item.Id"
                     :label="item.Name"
                     :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-input v-model="model.Name" placeholder="Tên tài liệu"></el-input>
    </el-form-item>
    <el-form-item>
      <froala :tag="'textarea'" :config="config" v-model="model.Description"></froala>
    </el-form-item>
    <el-form-item label="Tài liệu đính kèm">
      <UploadFile />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import UploadFile from "@/components/static/UploadFile";
  export default {
    name: 'CreateDocument',
    props: {
      value: ''
    },
    components: {
      UploadFile
    },
    data() {
      return {
        userInfor: JSON.parse(this.$Utils.getUserInfo()),
        SettingForm: null,
        model: {
          Id: null,
          Category: null,
          Project: {},
          VersionProject: null,
          Type: null,
          Created: null,
          PublishedDate: null,
          FileType: null,
          Name: null,
          Description: null
        },
        config: this.$froOptions,
        categories: [],
        projects: [],
        versionProjects: [],
        Types: [],
        FileTypes: []
      }
    },
    methods: {
      changeProject() {
      },
      onSubmit() {
        var vm = this;
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_Project: this.model.Project ? this.model.Project.GroupId : null,
          R1_ProjectName: this.model.Project ? this.model.Project.GroupName : null,
          R1_ProjectCode: this.model.Project ? this.model.Project.Code : null,
          R1_RequestFields: 'Id;Category;CategoryName;Project;ProjectName;VersionProject;VersionProjectName;Created;PublishedDate;FileType;FileTypeName;Name;Description;Code;Type;CreatedBy;CreatedByName;Modified;ModifiedBy;ModifiedByName;TypeName;FormSetting;Changed;',
          R1_Category: this.model.Category ? this.model.Category.Id : null,
          R1_CategoryName: this.model.Category ? this.model.Category.Name : null,
          R1_VersionProject: this.model.VersionProject ? this.model.VersionProject.GroupId : null,
          R1_VersionProjectName: this.model.VersionProject ? this.model.VersionProject.GroupName : null,
          R1_Created: vm.$Utils.formatDateTime(this.model.Created),
          R1_PublishedDate: vm.$Utils.formatDateTime(this.model.PublishedDate),
          R1_FileType: this.model.FileType ? this.model.FileType.Id : null,
          R1_FileTypeName: this.model.FileType ? this.model.FileType.Name : null,
          R1_Name: this.model.Name,
          R1_Description: this.model.Description,
          R1_RequestDataGroup: 'DataGroup.tai-lieu-dung-chung.0cb59',
          R1_RequestTemplate: 'xDocument_Document.Insert',
          R1_CreatedByName: this.userInfor.Username,
          R1_ModifiedByName: this.userInfor.Username,
          R1_Version: 1,
          R1_Code: 'Document',
          R1_FormSetting: JSON.stringify(vm.SettingForm),
        }
        $.each(request, function (key, value) {
          if (!vm.$Utils.isEmpty(value)) {
            delete request[key]
          }
        })
        vm.$Utils.post(request).then(response => {
          //console.log(response)
        })
      },
      bindTree(data, level, name) {
        if (this.$Utils.isEmpty(data)) {
          var tree = this.$Lodash.cloneDeep(data);
          $.each(tree, function (key, value) {
            var childRank = value.Level;
            tree[key].text = "";
            while (childRank > level) {
              tree[key].text += "|-- "
              childRank--;
            }
            tree[key].text += value[name];
          })
        }
        return tree;
      },
    },
    created() {
      var vm = this;
      var userInfor = JSON.parse(this.$Utils.getUserInfo())
      var projectId = null;
      if (vm.$Utils.isEmpty(userInfor, 'Project') && vm.$Utils.isEmpty(userInfor.Project, 'GroupId')) {
        projectId = userInfor.Project.GroupId;
      }
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: 5,
        R1_RequestTemplate: 'Setting.SearchBase',
        R1_ParentCode: 'xSetting.Project.Parameter.Category',
        R1_RequestOrderFields: 'LeftIndex ASC',

        R2_RequestTemplate: 'OrgnizationList',
        R2_GroupType: 1,
        R2_AssignedUser: this.$getItemLocalStorage(this.$localStorageConstant.SessionId),

        R3_RequestTemplate: 'xDocument_Document.Search',
        R3_RequestDataGroup: 'DataGroup.quan-ly-du-an.053gf',
        R3_RequestFields: 'Id;Name;ProjectCode;Code;CreatedBy;State;Status;Type',
        R3_Code: 'Project',

        R4_RequestTemplate: 'Setting.SearchBase',
        R4_ParentCode: 'xSetting.Project.Parameter.DocumentView.DocumentType',

        R5_RequestTemplate: 'Setting.SearchBase',
        R5_ParentCode: 'xSetting.Project.Parameter.Organization.Category',
        R5_Value: projectId
      }
      if (vm.$Utils.isEmpty(projectId)) {
        request.R1_Project = projectId
      }
      this.$Utils.post(request).then(response => {
        var categoriesTree = vm.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        categoriesTree = this.bindTree(categoriesTree, 5, 'Name')
        this.categories = categoriesTree;
        var projectTree = vm.$Utils.getDataWithRoot(response.R2, 'Data.UserDS.Group');
        projectTree = this.bindTree(projectTree, 1, 'GroupName');
        this.projects = projectTree;
        //console.log(this.projects)
        if (vm.$Utils.isEmpty(this.projects)) {
          var defaultProject = this.projects.find(x => x.GroupId == projectId);
          this.model.Project = defaultProject;
        }


        this.versionProjects = vm.$Utils.getDataWithRoot(response.R3, 'Data.DocumentDS.Document')
        this.FileTypes = vm.$Utils.getDataWithRoot(response.R4, 'Data.DynamicDS.Setting');
        var categoriesType = vm.$Utils.getDataWithRoot(response.R5, 'Data.DynamicDS.Setting');
        this.Types = this.bindTree(categoriesType);
      })
    },
    mounted() {
      setTimeout(function() {
        $("a:contains('Unlicensed copy of the Froala Editor')").remove();
      }, 900);
      var request = {
        RequestClass: 'xBase',
        RequestAction: 'Request',
        TotalRequests: 1,
        R1_RequestTemplate: 'SettingNew.SearchSetting',
        R1_Code: 'Form.cap-nhat-tai-lieu.0b27c'
      }
      this.$Utils.post(request).then(response => {
        var SettingForm = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting')[0];
        if (this.$Utils.isEmpty(SettingForm, 'Description') && this.$Lodash.isString(SettingForm.Description))
          SettingForm.Description = JSON.parse(SettingForm.Description);
        $.each(SettingForm.Description, function (fData, fKey) {
          SettingForm[fKey] = fData;
        })
        this.SettingForm = SettingForm;


      })

    }
  }
</script>
<style>
  .documentForm .el-form-item__content {
    margin-left: 0 !important;
  }
</style>
