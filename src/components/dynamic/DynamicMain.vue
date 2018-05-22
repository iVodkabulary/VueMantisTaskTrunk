<template>
  <div class="dynamic-main">
      <DynamicPage :data="Setting" :currentPage="currentPage" v-if="Setting.Module"/>
  </div>
</template>
<script>
import DynamicPage from "@/components/dynamic/DynamicPage";

export default {
  components: {
    DynamicPage
  },
  // props: ['data'],
  data() {
    return {
      activeName: '',//this.$isMobileDevice ? '' : 'true',
      currentPage: {},
      pageModules: [],
      pageDescriptions: [],
      listReport: [],
      formatData: [],
      objFields: {},
      sortedFilter: [],
      DataList: {},
      searchIndex: 0,
      filter: {},
      formPage: false,
      reportPage: false,
      Setting: {},
    };
  },
  created() {

  },

  mounted() {
    this.init();

    if(this.currentPage){
      this.pageModules = this.$Utils.jsonParse(this.currentPage.Value) ? this.$Utils.jsonParse(this.currentPage.Value) : {};
     this.pageDescriptions = this.$Utils.jsonParse(this.currentPage.Description) ? this.$Utils.jsonParse(this.currentPage.Description) : {};
    }

  },
  watch: {
    "$route.params.url": function(newUrl) {
    }
  },
  methods: {
    callback() {},

    createdListFromDataTree(tree, listMenu) {
      this.$.each(tree, (k, value) => {
        var tmpData = this.$Lodash.cloneDeep(value);
        delete tmpData.children;
        if (
          value.children &&
          this.$Utils.isEmpty(value.children[0], "ModuleType")
        ) {
          tmpData.Module = this.$Lodash.cloneDeep(value.children);
        }
        listMenu.push(tmpData);
        if (value.children && !this.$Utils.isEmpty(value.ModuleType)) {
          createdListFromDataTree(value.children, listMenu);
        }
      });
      return listMenu;
    },

    bindSettingCurrentPage() {
      var ctrl = this;
      var $state = this.$route;
      var $stateParams = this.$route.params;
      //var currentPage = this.Setting;
      var isExist = false;
      var Breadcrumb = [];
      var arrPages = JSON.parse(
        this.$getItemLocalStorage(this.$localStorageConstant.ListPages)
      );
      for (var i = 0; i < arrPages.length; i++) {
        var Description = JSON.parse(arrPages[i].Description);
        if (
          (Description.UrlPage == "dynamic/" + $stateParams.url ||
            Description.UrlPage.indexOf("dynamic/" + $stateParams.url + "/") !=
              -1) &&
          Description.PageLink != "Empty"
        ) {
          this.currentPage = arrPages[i];
        //console.log(this.currentPage)
          // this.Setting = this.$Lodash.cloneDeep(this.currentPage);
          // delete this.Setting.Description;
          // delete this.Setting.Value;
          // $.each(JSON.parse(this.currentPage.Description), (key, val) =>{
          //   this.Setting[key] = val;
          // })
          // $.each(JSON.parse(this.currentPage.Value), (key, val) =>{
          //   this.Setting[key] = val;
          // })
          var childBread = {};
          childBread.Caption = this.currentPage.Caption;
          childBread.Id = this.currentPage.Id;
          childBread.ParentId = this.currentPage.ParentId;
          childBread.Url = Description.UrlPage;
          //this.$Utils.addLanguage(currentPage, childBread);
          //Breadcrumb.push(childBread);
          //ctrl.getBreadcrumb(childBread, Breadcrumb, arrPages);
          isExist = true;
          break;
        }
      }
      if (!isExist) this.$router.push("/pages/404");
      if(this.$Utils.isEmpty(this.currentPage, 'Id')){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_Id = this.currentPage.Id;
        this.$Utils.post(request).then(data => {
          data = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          )[0];
            var pageConfig = data.Description;
          if(data.Description && data.Description.constructor === String) {
              pageConfig = JSON.parse(data.Description);
          }
           if(data.Value && data.Value.constructor === String) {
              pageConfig.Module = JSON.parse(data.Value);
           }
          //this.$Utils.addLanguage(data, pageConfig);
          //consoleconsole.log('$stateParams.query ----',this.$route.query)
          //console.log(this.$route.query)
          if (this.$Utils.isEmpty(this.$route.query)){
            if(typeof this.$route.query === 'string')
              pageConfig.UrlData = this.$Utils.stringToObject(this.$route.query);
            else
              pageConfig.UrlData = this.$route.query;
          }
          pageConfig.Breadcrumb = Breadcrumb;
          // ctrl.data = pageConfig;
          this.Setting = pageConfig;
          // this.loadSettingData(JSON.parse(this.currentPage.Value), formatData => {
          //   this.loadUrlData(formatData).then((result) =>{
          //     this.formatData = result;
          //   })
          // });
        });
      }
    },

    getBreadcrumb(input, output, listPage) {
      this.$.each(listPage, (k, value) => {
        if (input.ParentId == value.Id) {
          var childBread = {};
          childBread.Caption = value.Caption;
          childBread.Id = value.Id;
          childBread.ParentId = value.ParentId;
          this.$Utils.addLanguage(value, childBread);
          if (angular.isString(value.Description)) {
            if (
              JSON.parse(value.Description).PageLink == "Empty" ||
              !this.$Utils.isEmpty(JSON.parse(value.Description).PageLink)
            )
              childBread.Url = "#";
            else childBread.Url = JSON.parse(value.Description).UrlPage;
          }
          output.unshift(childBread);
          if (this.$Utils.isEmpty(value.ParentId)) {
            ctrl.getBreadcrumb(childBread, output, listPage);
          }
        }
      });
      return output;
    },


    init() {
      //console.log(this.$getItemLocalStorage(this.$localStorageConstant.ListPages))
      if (
        this.$getItemLocalStorage(this.$localStorageConstant.ListPages) ==
          null ||
        this.$localStorageConstant.ListPages == ""
      ) {
        var request = this.$Utils.updateParamsSingleRequest(
          this.$Lodash.cloneDeep(this.$singleRequest),
          {
            AssignedUser: this.$getItemLocalStorage(
              this.$localStorageConstant.SessionId
            ),
            RequestTemplate: "SettingNew.SearchSetting",
            ParentCode: "xSetting.Project.Page"
          }
        );
        this.$Utils.post(request).then(data => {
          var arrPages = [];
          arrPages = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          //console.log(this.data)
          this.$setItemLocalStorage(
            this.$localStorageConstant.ListPages,
            JSON.stringify(arrPages)
          );
          if(this.data){
            this.Setting = this.$Lodash.cloneDeep(this.data)
            this.loadSettingData([this.Setting], formatData => {
            this.loadUrlData(formatData).then((result) =>{
              this.formatData = result;
            })
          });
          } else
            this.bindSettingCurrentPage();
        });
      } else {
        //console.log(this.data)
        if(this.data){
          this.Setting = this.$Lodash.cloneDeep(this.data)
          this.loadSettingData([this.Setting], formatData => {
          this.loadUrlData(formatData).then((result) =>{
              // console.log(result)
              this.formatData = result
              // console.log(result)
              // console.log(this.Setting)
              $.each(this.formatData, (key,val) =>{
                if(this.Setting.ModuleCode == val.Code)
                  this.formatData[key].parentSetting = this.Setting.parentSetting;
              })
            })
          });
        } else
          this.bindSettingCurrentPage();
      }
    }
  }
};
</script>
<style lang="scss">
  .dynamic-page {
    .header-filter {
      width: 100%;

      .el-collapse-item__header {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;

        .el-collapse-item__arrow {
          line-height: 30px;
        }
      }


      .el-collapse-item__content {
        padding-bottom: 0px;
      }
    }
  }
</style>
