<template>
<div>
<DynamicDialog/>
  <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import Utils from "@/services/utils";
import cordovaPushV5 from '@/lib/cordovaPushV5'
//import URL from "./services/utils";
import Lodash from "lodash";
import DynamicDialog from "@/components/dynamic/DynamicDialog";
import Hub from "@/events/Hub.js";
import Signalr from "signalr";
import DataTables from 'vue-data-tables'
Vue.use(Utils);
Vue.use(require("vue-moment"));
Vue.use(Lodash);
Vue.use(DynamicDialog);
Vue.use(Signalr);
// configure language
locale.use(lang);
  Vue.use(DataTables)
/*
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

import VueI18n from 'vue-i18n'
import Element from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)
Vue.config.lang = 'en'
Vue.locale('en', enLocale)
*/

Vue.use(ElementUI, { size: "mini" });
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Rate);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$Utils = Utils;
Vue.prototype.$cordovaPushV5 = cordovaPushV5;
Vue.prototype.$Lodash = Lodash;
Vue.prototype.$hub = Hub;
Vue.prototype.$signalr = Signalr;
Vue.prototype.$rootScope = {loggedOnUser: localStorage.getItem('LoggedOnUser') ? JSON.parse(localStorage.getItem('LoggedOnUser')) : {} };
Vue.prototype.$froOptions = {
  charCounterCount: false,
  // toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
  toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
  toolbarButtonsMD: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting'],
  imageInsertButtons: ['imageBack', '|', 'imageByURL'],
  heightMin: 200,
  // videoUpload: false,
  imageUploadRemoteUrls: false,
  videoInsertButtons: ['videoBack', '|', 'videoByURL'],
  // imageUpload: false
};
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export default {
  name: "app",
  components: {
    DynamicDialog
  },
  data() {
    return {
      //proxy: null,
      //connection: null,

    };
  },
  methods: {

  },
  created: function() {

  },
  mounted: function() {

  }
};

/**
 * Khai báo giá trị mặc định của hệ thống
 */
(Vue.prototype.$defaultUndefined = "[Không xác định]"),
  (Vue.prototype.$defaultChangePass = 14),
  (Vue.prototype.$roleEveryoneId = Utils.roleEveryoneId()),
  (Vue.prototype.$administrator = Utils.administrator()),
  (Vue.prototype.$supervisor = Utils.supervisor());
  (Vue.prototype.$manager = Utils.manager()),
  (Vue.prototype.$leader = Utils.leader());

Vue.prototype.$upload_file_max_length = 20480;
/**
 * tên các key được dùng để lưu vào Local Storage của trình duyệt
 */
Vue.prototype.$localStorageConstant = {
  SessionId: "SessionId",
  UserId: "UserId",
  LoginName: "LoginName",
  AppConfig: "AppConfig",
  table_settings_type: "table_settings_type",
  organization: "organization",
  objectStatus: "objectStatus",
  LoggedOnUser: "LoggedOnUser",
  RootScopeDataParams: "RootScopeDataParams",
  MenuStateUpdateLatest: "MenuStateUpdateLatest",
  MenuRoleSelected: "MenuRoleSelected",
  HTMLTemplateCache: "HTMLTemplateCache",
  DynamicMenu: "DynamicMenu",
  ModuleSetting: "ModuleSetting",
  FilterData: "FilterData",
  ListPages: "ListPages",
  appUri: "appUri",
  SaveStatus: "SaveStatus",
  Password: "Password",
  settingColor: "settingColor",
  arrPriorityColor: "arrPriorityColor",
  Lang: "Lang",
  Application: "Application",
  Notification: "Notification",
  ModeProject: "ModeProject",
  StoredURI: "StoredURI"
};
/**
 * khai báo object request được sử dụng nhiều trong hệ thống
 */
Vue.prototype.$singleRequest = {
  RequestClass: "xBase",
  RequestAction: "Request",
  TotalRequests: 1
};

/**
 * danh sách các message được sử dụng
 */
Vue.prototype.$toastMessage = {
  loadingDataFailed: "Tải dữ liệu không thành công",
  settingTemplateError:
    "Cài đặt cấu hình không chính xác xin vui lòng liên hệ với quản trị viên",
  reportDataMergeError:
    "Dữ liệu các biểu đồ của bạn không phù hợp để ghép, xin vui lòng cấu hình lại",
  updateItemPre: "Cập nhật ",
  updateItemSuf: " thành công",
  updateItemFailed: "Cập nhật không thành công",
  deleteItemFailed: "Xóa không thành công",
  deleteItemPre: "Xóa thành công ",
  deleteItemSuf: "",
  getCountFail: "Lấy số bản ghi không thành công",
  countZero: "Không có dữ liệu",
  reportNull: "Không có dữ liệu thống kê",
  reportError: "Tải dữ liệu không thành công",
  emptyTemplate: "Không có mẫu email",
  deleteSettingChild: "Bạn cần xóa các bản ghi con trước",
  deleteSettingWarning: "Bạn thực sự muốn xóa bản ghi này?",
  oneWayAction: "Hành động này không thể hoàn tác. ",
  copyNoteWarning:
    "Bạn thực sự muốn xóa các dữ liệu cũ và khởi tạo lại các bản ghi mới?",
  emptyRedirectLink: "Chưa có setting đường dẫn cụ thể",
  loginError: "Đăng nhập không thành công"
};
Vue.prototype.$informations = [
  {
    version: "1.0",
    checked: 1,
    versionName: "starter",
    price: "12",
    best: 0,
    versionTemplate: {
      pdca: "mantis",
      crm: "",
      knowledge: "",
      cashbook: "",
      report: "mantis",
      module: { callcenter: false, sms: false, facebook: false }
    },
    isActive: true
  },
  {
    version: "1.0",
    versionName: "professional",
    checked: 2,
    price: "12",
    best: "BEST VALUE",
    versionTemplate: {
      pdca: "mantis",
      crm: "",
      knowledge: "",
      cashbook: "",
      report: "mantis",
      module: { callcenter: false, sms: false, facebook: false }
    },
    isActive: false
  },
  {
    version: "1.0",
    price: "12",
    best: 0,
    checked: 3,
    versionName: "enterprise",
    versionTemplate: {
      pdca: "mantis",
      crm: "",
      knowledge: "",
      cashbook: "",
      report: "mantis",
      module: { callcenter: false, sms: false, facebook: false }
    },
    isActive: false
  }
];
var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  iPad: function() {
    return navigator.userAgent.match(/iPad/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  }
};
Vue.prototype.$isMobile= isMobile;

if (
  isMobile.Android() ||
  isMobile.BlackBerry() ||
  isMobile.iOS() ||
  isMobile.Opera() ||
  isMobile.Windows()
) {
  Vue.prototype.$isMobileDevice = true;
} else {
  Vue.prototype.$isMobileDevice = false;
}
if (document.location.protocol == "file:") {
  Vue.prototype.$myDevice = "isMobileApp";
  //loadjscssfile("bower_components/framework7/css/framework7.material.colors.css", "css");
} else {
  Vue.prototype.$myDevice = "notMobileApp";
}
if (isMobile.iOS() && document.location.protocol == "file:") {
  Vue.prototype.$iPrefix = "";
} else {
  Vue.prototype.$iPrefix = "";
}

Vue.prototype.$getItemLocalStorage = function(localStorageKey) {
  return window.localStorage.getItem(localStorageKey);
};

Vue.prototype.$removeItemLocalStorage = function(localStorageKey) {
  window.localStorage.removeItem(localStorageKey);
};

Vue.prototype.$setItemLocalStorage = function(
  localStorageKey,
  localStorageValue
) {
  window.localStorage.setItem(localStorageKey, localStorageValue);
};

Vue.prototype.$clearStorage = function() {
  if (
    Vue.prototype.$getItemLocalStorage(
      Vue.prototype.$localStorageConstant.SaveStatus
    ) == "true"
  ) {
    var SaveStatus = Vue.prototype.$getItemLocalStorage(
      Vue.prototype.$localStorageConstant.SaveStatus
    );
    if (
      Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.LoginName
      )
    )
      var LoginName = Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.LoginName
      );
    if (
      Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.AppConfig
      )
    )
      var AppConfig = Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.AppConfig
      );
    if (
      Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.Password
      )
    )
      var Password = Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.Password
      );

     if (
      Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.StoredURI
      )
    )
      var StoredURI = Vue.prototype.$getItemLocalStorage(
        Vue.prototype.$localStorageConstant.StoredURI
      );
  }
  window.localStorage.clear();
  if (SaveStatus) {
    Vue.prototype.$setItemLocalStorage(
      Vue.prototype.$localStorageConstant.SaveStatus,
      SaveStatus
    );
    if (LoginName)
      Vue.prototype.$setItemLocalStorage(
        Vue.prototype.$localStorageConstant.LoginName,
        LoginName
      );
    if (AppConfig)
      Vue.prototype.$setItemLocalStorage(
        Vue.prototype.$localStorageConstant.AppConfig,
        AppConfig
      );
    if (Password)
      Vue.prototype.$setItemLocalStorage(
        Vue.prototype.$localStorageConstant.Password,
        Password
      );
    if (StoredURI)
      Vue.prototype.$setItemLocalStorage(
        Vue.prototype.$localStorageConstant.StoredURI,
        StoredURI
      );
  }
};

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

Vue.prototype.$getXmlPath = function() {
  return xmlConfig.xmlPath;
};

Vue.prototype.$isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Vue.prototype.$userRoot = Vue.prototype.$Utils.jsonParse(localStorage.getItem('LoggedOnUser'));
Vue.prototype.$isMantisAdmin = function() {
  if (Vue.prototype.$Utils.jsonParse(localStorage.getItem('LoggedOnUser')).Roles)
    return (JSON.stringify(Vue.prototype.$Utils.jsonParse(localStorage.getItem('LoggedOnUser')).Roles).indexOf(Vue.prototype.$supervisor) > -1);
};

Vue.prototype.$isSystemAdmin = function() {
  if (Vue.prototype.$Utils.jsonParse(localStorage.getItem('LoggedOnUser')).Roles)
    return (JSON.stringify(Vue.prototype.$Utils.jsonParse(localStorage.getItem('LoggedOnUser')).Roles).indexOf(Vue.prototype.$administrator) > -1);
};

Vue.prototype.$safeApply = function(scope, action, fn) {
  var phase = scope.$root.$$phase;
  if (phase == "$apply" || phase == "$digest") {
    if (fn && typeof fn === "function") {
      fn();
    }
  } else {
    scope["$" + action](fn);
  }
};
// var url = "";
//var url = "http://man-crm.mn.com.vn";
var url = Utils.URL();

if (
  Vue.prototype.$getItemLocalStorage(Vue.prototype.$localStorageConstant.appUri)
) {
  Vue.prototype.$appUri = JSON.parse(
    Vue.prototype.$getItemLocalStorage(
      Vue.prototype.$localStorageConstant.appUri
    )
  );
} else {
  Vue.prototype.$appUri = {
    BaseURL: url + "/",
    BaseUri: url + "/xRequest.ashx",
    BaseUriCopy: "http://templagute.mn.com.vn/xRequest.ashx",
    BaseRedirect: "/my-view-page"
  };
}
</script>


<style lang="sass" scoped>

/* Import Font Awesome Icons Set */
$fa-font-path: "~font-awesome/fonts/";
@import "~font-awesome/css/font-awesome.min.css";
/* Import Simple Line Icons Set */
$simple-line-font-path: "~simple-line-icons/fonts/";
@import "~simple-line-icons/css/simple-line-icons.css";
/* Import Bootstrap Vue Styles */
@import "~bootstrap-vue/dist/bootstrap-vue.css";
</style>
<style lang="scss">
// Import Main styles for this application
@import "./scss/style";

.el-dialog {
      margin-top: 5vh !important ;
}
.el-tree-node__expand-icon {
  font-size: 22px !important;
}

.nav-link.nav-dropdown-toggle::before{
  top: 44%;
}

.el-table .cell {
  word-break: keep-all !important;
}

.el-range-editor {
  max-width: 200px;
}
.MobileDateRange {
  width: 100vw !important;
  max-width: 646px;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .el-picker-panel__content {
        padding: 3px;
      .el-date-range-picker__header > div {
        margin: 0px;
      };
      };
      min-width: 0px;
    }
  }
}
.has-sidebar.MobileDateRange{
  .el-picker-panel__body-wrapper {
    .el-picker-panel__sidebar {
      width: 100%;
      position: relative;
      .el-picker-panel__shortcut {
        float: left;
        width: auto;
      }}
    .el-picker-panel__body {
      margin-left: 0px !important;
    }
  }
}

.aside-menu-hidden {
  .main {
    @media (max-width: 991px){
      margin: 0px !important;
    }
  }
  .sidebar:not(.sidebar-old){
    @media (max-width: 991px){
      height: auto !important;
      max-height: calc(100vh - 55px) !important;
      .sidebar-nav {
        min-height: 0px !important;

        .nav {
          min-height: 0px !important;
        }
      }

    }
  }

  .sidebar.sidebar-old {
    @media (max-width: 991px){
      max-height: calc(100vh - 55px) !important;
      .sidebar-nav {
        min-height: 0px !important;

        .nav {
          min-height: 0px !important;
        }
      }

    }
  }
}

.sidebar {
  .nav-link {
    font-size: 1.0rem;
    font-weight: 300;

    i {
      font-size: 1.3rem;
    }
  }
}

.text-nowrap {
  white-space: nowrap;
}
.cell20 {
  max-width: 20px;
  min-width: 20px;
}
.cell25 {
  max-width: 25px;
  min-width: 25px;
}
.cell30 {
  max-width: 30px;
  min-width: 30px;
}

.cell40 {
  max-width: 40px;
  min-width: 40px;
}

.cell50 {
  max-width: 50px;
  min-width: 50px;
}

.cell60 {
  max-width: 60px;
  min-width: 60px;
}

.cell70 {
  max-width: 70px;
  min-width: 70px;
}

.cell75 {
  max-width: 75px;
  min-width: 75px;
}
.cell80 {
  max-width: 80px;
  min-width: 80px;
}
.cell85{
  max-width: 85px;
  min-width: 85px;
}
.cell90 {
  max-width: 90px;
  min-width: 90px;
}

.cell100 {
  max-width: 100px;
  min-width: 100px;
}

.cell110 {
  max-width: 110px;
  min-width: 110px;
}

.cell120 {
  max-width: 120px;
  min-width: 120px;
}

.cell130 {
  max-width: 130px;
  min-width: 130px;
}

.cell140 {
  max-width: 140px;
  min-width: 140px;
}

.cell150 {
  max-width: 150px;
  min-width: 150px;
}

.cell160 {
  max-width: 160px;
  min-width: 160px;
}

.cell170 {
  max-width: 170px;
  min-width: 170px;
}

.cell180 {
  max-width: 180px;
  min-width: 180px;
}

.cell190 {
  max-width: 190px;
  min-width: 190px;
}

.cell200 {
  max-width: 200px;
  min-width: 200px;
}

.cell220 {
  max-width: 220px;
  min-width: 220px;
}

.cell250 {
  max-width: 250px;
  min-width: 250px;
}

.cell300 {
  max-width: 300px;
  min-width: 300px;
}

.cell400 {
  max-width: 400px;
  min-width: 400px;
}

.cell500 {
  max-width: 500px;
  min-width: 500px;
}
.width100{
      width: 100px;
      border-right: 1px solid #ddd;
    }
   .width90{
      width: 90px;
      border-right: 1px solid #ddd;
    }
    .width75{
      width: 75px;
      border-right: 1px solid #ddd;
    }
     .width70{
      width: 70px;
      border-right: 1px solid #ddd;
    }
      .width65{
      width: 65px;
      border-right: 1px solid #ddd;
    }
      .width60{
      width: 60px;
      border-right: 1px solid #ddd;
    }
.none{
  display: none;
}
.textcenter {
  text-align: center;
}
/* Priority */
.priority {
  position: absolute;
}
/* File Type */
/* File Type docx */
.p-7277e474-77fd-44d7-82fe-61b028345d5e:before {
  content: "\e7e7";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type exel */
.p-268552f6-7301-4f0e-9db4-fcae993f9ffe:before {
  content: "\e7d8";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type pdf */
.p-ab5dde4c-7105-4330-bffe-03fa964aac71:before {
  content: "\e7e1";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type jpg png  */
.p-c1ffa5ea-ff22-4cbc-9680-5928c1152655:before {
  content: "\e7dc";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}

/* File Type ai  */
.p-496388af-b315-4e8a-a9cb-28af2f7348d6:before {
  content: "\e7e9";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type mmap  */
.p-26ccd7fa-0943-4bea-b4fb-490219330072:before {
  content: "\e7e9";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type ppt  */
.p-ec2fa298-51b9-4cc7-8a4a-e282b63d40b5:before {
  content: "\e7e3";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* File Type mpp  */
.p-730bdd96-37d9-45c4-a7b6-217313168309:before {
  content: "\e7e9";
  font-style: normal;
  color: #333 !important;
  font-weight: bolder;
  font-size: 30px;
}
/* Tình trạng */
/* Công khai */
.a-d2658bd9-f6b9-4f98-9387-d5da5ac99737:before {
  font-style: normal;
  content: "\e7ac";
  color: #BBB !important;
  font-weight: bolder;
}
/* RIêng tư */
.a-9c5d600e-458d-4939-a65c-d33a991c2c2e:before {
  font-style: normal;
  content: "\e8de";
  color: #BBB !important;
  font-weight: bolder;
}


/* 01 - Thấp*/
.p-ce7c82f0-751e-4b70-bbe2-8a859f5cb2b9:before {
  font-style: normal;
  content: "\f078";
  color: #69AA46 !important;
  font-weight: bolder;
}
/* 02 - Bình thường */
.p-45865baa-468f-437a-864a-604758612fa8:before {
  font-style: normal;
  content: "\f068";
  color: #FEB902 !important;
  font-weight: bolder;
}
/* 03 - Khẩn cấp */
.p-0d50afca-c440-4785-b75b-1f7f4beed8c1:before {
  font-style: normal;
  content: "\f071";
  color: #DD5A43 !important;
  font-weight: bolder;
}
/* 04 - Cao*/
.p-cf284d4b-0eca-48b4-9e9d-54dd76869f6c:before {
  font-style: normal;
  content: "\f077";
  color: #DD5A43 !important;
  font-weight: bolder;
}


/* Status icon */
/* re-open*/
.work-status.q-bbc399a9-a2b4-45ad-b948-32e5623dc021:before {
  font-style: normal;
  content: "\f0c8";
  color: #fff494 !important;
}

/* processing*/
.work-status.q-05625d94-3884-4f00-9918-254c1216c6cd:before {
  font-style: normal;
  content: "\f0c8";
  color: #fcbdbd !important;
}

/* new*/
.status-box:before{
  font-style: normal;
  content: "\f0c8";
}
.work-status.q-db8e700c-78c6-4f35-9477-36e0335888f5:before {
  font-style: normal;
  content: "\f0c8";
  color: #e3b7eb !important;
}

/* feedback*/
.work-status.q-5756c3d9-37a8-4032-bd6c-2a01161b73c7:before {
  font-style: normal;
  content: "\f0c8";
  color: #c9ccc4 !important;
}

/* close*/
.work-status.q-53cc3819-c019-4749-b0e4-52213438049b:before {
  font-style: normal;
  content: "\f0c8";
  color: #c2dfff !important;
}

/*assigned*/
.work-status.q-fab4fa55-cf1d-4625-8f65-8b43e832061b:before {
  font-style: normal;
  content: "\f0c8";
  color: #d2f5b0 !important;
}

/* resolve*/
.work-status.q-532e9f1e-f5dc-4e75-b7c9-2bd785bbda67:before {
  font-style: normal;
  content: "\f0c8";
  color: #eee !important;
}


/* End */

/* status support
Hotline*/
.support-status.z-ce539bca-2487-4c8a-816b-5b1ef3e32793:before {
  font-style: normal;
  content: "\e991";
  color: #e3b7eb;
}
/*Email*/
.support-status.z-022b762d-d1da-4daf-ab92-8a11fb4cd739:before {
  font-style: normal;
  content: "\e7b5";
  color: #e3b7eb;
}
/*Đánh giá*/
.support-status.z-d296f799-758a-4f57-9fc7-bc2899312daf:before {
  font-style: normal;
  content: "\e7d6";
}
/*Fanpage facebook*/
.support-status.z-95b50181-0cdc-48ee-8a61-d427f919b16a:before {
  font-style: normal;
  content: "\e7cd";
}
/*Chat*/
.support-status.z-4220e9d3-6ae0-432b-80c6-14435348668b:before {
  font-style: normal;
  content: "\e74f";
}
/*Trực tiếp*/
.support-status.z-4b6957c6-9b0b-496c-94b6-44e950059f0b:before {
  font-style: normal;
  content: "\e610";
}
/* Màu trạng thái*/

/* re-open*/
.work-status.z-bbc399a9-a2b4-45ad-b948-32e5623dc021 {
  background: #fff494
}

/* processing*/
.work-status.z-05625d94-3884-4f00-9918-254c1216c6cd {
  background: #fcbdbd
}

/* new*/
.work-status.z-db8e700c-78c6-4f35-9477-36e0335888f5 {
  background: #e3b7eb
}

/* feedback*/
.work-status.z-5756c3d9-37a8-4032-bd6c-2a01161b73c7 {
  background: #c9ccc4
}

/* close*/
.work-status.z-53cc3819-c019-4749-b0e4-52213438049b {
  background: #c2dfff
}

/*assigned*/
.work-status.z-fab4fa55-cf1d-4625-8f65-8b43e832061b {
  background: #d2f5b0;
}

/* resolve*/
.work-status.z-532e9f1e-f5dc-4e75-b7c9-2bd785bbda67 {
  background: #eee
}



/* Màu trạng thái*/


/* re-open*/
.status-re-open {
  background: #fff494;
  color: #000 !important;
}

/* processing*/
.status-processing {
  background: #fcbdbd;
  color: #000 !important;
}

/* new*/
.status-new {
  background: #e3b7eb;
  color: #000 !important;
}

/* feedback*/
.status-feedback {
  background: #c9ccc4;
  color: #000 !important;
}

/* close*/
.status-close {
  background: #c2dfff;
  color: #000 !important;
}

/*assigned*/
.status-assigned {
  background: #d2f5b0;
  color: #000 !important;
}

/* resolve*/
.status-resolve {
  background: #eee;
  color: #000 !important;
}

/** TN **/
/* re-open*/
.work-status.z-60703451-6ebf-49cf-895a-834cde69dd54 {
  background: #fff494
}

/* processing*/
.work-status.z-61a81f6f-76e3-431a-89ce-19339ed35efd {
  background: #fcbdbd
}

/* new*/
.work-status.z-cdf33acc-d946-43ad-9d5e-99d7bc3a4b9b {
  background: #e3b7eb
}

/* feedback*/
.work-status.z-cd46de52-891b-42a2-b263-ce565710afb4 {
  background: #c9ccc4
}

/* close*/
.work-status.z-152cbc16-b636-4810-a7be-473389ecc247 {
  background: #c2dfff
}

/*assigned*/
.work-status.z-872cadc4-2b35-4956-b938-5dba372a552e {
  background: #d2f5b0;
}

/* resolve*/
.work-status.z-eadfca0f-c9ca-467c-8de1-1a140f9ea9e4 {
  background: #eee
}

/*work-priority*/

.work-priority.z-9325a1f6-82c9-4023-8991-f6646519b8bb {
  background: #FF0000
}

/*GQT*/
.work-priority.z-0d660deb-88b0-404b-933c-abcb44fdcbe6 {
  background: #FF5B00;
}

/*ToG*/
.work-priority.z-f0adc36a-15e6-43e1-b7c6-64ca05d7efb1 {
  background: #FFC600
}

/*GoQT*/

.work-priority.z-ca22fafc-d6ac-4803-97d1-a7e2e1e69006 {
  background: #C6FF00;
}

/** Gokis **/
/* Assigned*/
.work-status.b1e06f0e-e9c1-43f8-88a7-9055f7b43b24 {
  background: #fff494
}

/* Processing*/
.work-status.9c75249b-492a-4c91-ba0f-c707b437b843 {
  background: #fcbdbd
}

/* ChangeReviewing*/
.work-status.db075bd3-45b3-4f46-a0fc-4a97ebb5502e {
  background: #e3b7eb
}

/* Cancelled*/
.work-status.e5a41ba6-3f00-42dc-bb46-c785e13a9e84 {
  background: #c9ccc4
}

/* Resolved*/
.work-status.965b22a8-9c2a-4a8c-8fb7-cc1831643799 {
  background: #c2dfff
}

/*Closed*/
.work-status.a891b25e-3007-4011-8615-5b1d1023f58b {
  background: #d2f5b0;
}

/* Pending*/
.work-status.f49e1648-99db-4d8d-9fb9-af49549f4eaa {
  background: #eee
}

/* Rejected*/
.work-status.788c9d25-747d-4f32-a466-1fe4508c2cf1 {
  background: #FFE4C4;
}

/*Negotiating*/
.work-status.6131bc52-2f4f-48d2-9268-928a2ef513c1 {
  background: #C1CDC1;
}

/* RegistReviewing*/
.work-status.1bd828b4-27c4-49f7-abc7-64ad1f8b505f {
  background: #F0F8FF;
}
/*RequestReviewing*/
.work-status.37df5e34-c684-4c4e-80e2-43586ce89f9f {
  background: #54FF9F;
}

.colorred {
  background: #54FF9F;
}

::-webkit-scrollbar {
  width: 5px;
  //height: 3px
}

::-webkit-scrollbar-button {
  background: #ccc
}

::-webkit-scrollbar-track-piece {
  background: #888
}

::-webkit-scrollbar-thumb {
  background: #eee
}

.tac {
  text-align: center;
}
.pdr5 {
  padding-right: 5px;
}

</style>
