<template>
  <div class="app">
    <AppHeader :currentUser = "loggedUser"/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from "../_nav";
import {
  Header as AppHeader,
  Sidebar,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from "../components/";

export default {
  name: "Home",
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: [],
      loggedUser: JSON.parse(localStorage.getItem("LoggedOnUser"))
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched;
    }
  },
  methods: {
    init() {
      var arrPages = [];
      arrPages = this.$getItemLocalStorage(
        this.$localStorageConstant.ListPages
      );
      if (arrPages == null || this.$localStorageConstant.ListPages == "") {
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
          arrPages = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          this.$setItemLocalStorage(
            this.$localStorageConstant.ListPages,
            JSON.stringify(arrPages)
          );
          this.nav = this.buildMenu(false, arrPages);
        });
      } else {
        this.nav = this.buildMenu(true, arrPages);
      }
    },
    buildMenu(isLoad, arrPages){
       var rightMenu = {};
       if(isLoad) {
         rightMenu = JSON.parse(arrPages);
       } else {
          rightMenu = arrPages;
        }
        rightMenu = rightMenu.filter(ele => {
          ele.Description = JSON.parse(ele.Description);
          ele.Value = JSON.parse(ele.Value);
          ele["url"] = ele.Description.UrlPage.replace('static/', '/').replace('configuration/','/').replace('dynamic','/dynamic');
          ele["name"] = ele.Description.Caption;
          ele["icon"] = ele.Description.MenuIcon;
          return ele.Description.IsShowOnMenu;
        });
        var tree = this.$Utils.createCustomTreeFromList(
          rightMenu,
          "Id",
          "ParentId",
          "children",
          {},
          {}
        );
        return tree;
    }
  },
  created() {
     this.init();
  },
  mounted(){
  },
  watch: {
    '$route.fullPath': function (after) {
      // console.log('1', $("a[href$='/config']")[0].classList);
      // console.log('2', $("a[class~='router-link-exact-active']")[0].classList);
      if($("a[class~='router-link-exact-active']")[0])
        $("a[class~='router-link-exact-active']")[0].classList.remove('router-link-exact-active','open','active');
      if(after.indexOf('dynamic/view-all-task-page?')>-1 || after.indexOf('/scrumboard')>-1){
        $("a[href$='/timeline']")[0].classList.add('router-link-exact-active','open','active');
      }else if(after.indexOf('setting-users')>-1 || after.indexOf('/setting-group-project')>-1 || after.indexOf('/setting-ui')>-1){
        $("a[href$='/config']")[0].classList.add('router-link-exact-active','open','active');
      }
    }
  }
};
</script>

<style lang="scss">
.container-fluid {
  padding: 0px 10px !important;
}
</style>
