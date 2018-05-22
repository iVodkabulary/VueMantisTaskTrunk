<template>
  <div class="animated fadeIn">
    <div class="page-header mb-2">
      <div class="title-box py-1 px-3">
        <div class="row">
          <h5 class="col m-auto"><i class="fa fa-file-text-o"></i><span>Quản lý trang:</span></h5>
          <div class="col text-right pr-0">
            <el-button v-if="selectedItem.Id" @click="requestByAction('save');">Lưu</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-container>
      <el-row style="width:100%">
        <el-col :xs="24" :md="7" class="border-box mt-aside">
          <PageTree :treePage="treePage"/>
        </el-col>
        <el-col :xs="24" :md="17" class="pl-2 pr-2">
          <div v-if="!selectedItem.Id">
            Chưa có trang được chọn
          </div>
          <el-tabs v-model="activeName" :tab-position="tabPosition" v-if="selectedItem.Id">
            <el-tab-pane label="Phổ biến">
              <el-form label-width="120px" :rules="rules" :model="model.Description">
                <el-form-item label="Tên" prop="Caption">
                  <el-input v-model="model.Description.Caption" @change="onCaptionChange"/>
                </el-form-item>
                <el-form-item>
                  <el-button @click="showPermission(selectedItem.Id)">Phân quyền</el-button>
                </el-form-item>
                <el-form-item label="Tên nội dung" prop="Caption">
                  <el-input v-model="model.Caption"/>
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="model.Description.PageLink">
                    <el-radio label="Empty" v-if="isSystemAdmin">Không có liên kết</el-radio>
                    <el-radio label="Url">Là đường dẫn</el-radio>
                    <el-radio label="Redirect" v-if="isSystemAdmin">Mở ra trang khác
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="model.Description.PageLink == 'Redirect'" label="Đường dẫn">
                  <el-input v-model="model.Description.UrlPage"></el-input>
                </el-form-item>
                <el-form-item v-if="model.Description.PageLink == 'Url'" label="Trang liên kết">
                  <el-input v-model="model.Description.UrlPage"></el-input>
                </el-form-item>
                <el-form-item label="Biểu tượng">
                  <div class="row">
                    <span><i :class="model.Description.MenuIcon" class="col"></i></span>
                    <el-input v-model="model.Description.MenuIcon" class="col"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="Số bản ghi" v-if="isSystemAdmin">
                  <el-select v-model="model.Description.LimitIndex">
                    <el-option :value="25">25</el-option>
                    <el-option :value="35">35</el-option>
                    <el-option :value="50">50</el-option>
                    <el-option :value="100">100</el-option>
                    <el-option :value="200">200</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="model.Description.IsShowOnMenu">Hiển thị trên menu
                  </el-checkbox>
                  <el-checkbox v-model="model.Description.IsDetail">Chi tiết
                  </el-checkbox>
                  <el-checkbox v-model="model.Description.Pagination">Phân trang
                  </el-checkbox>
                  <el-checkbox v-show="isSystemAdmin" v-model="model.Description.DisplayRole">Cho phép quản trị
                  </el-checkbox>
                  <el-checkbox v-model="model.Description.DisplayChange">Hiển thị chuyển dạng
                  </el-checkbox>
                  <el-checkbox v-model="model.Description.IsDashboard">Dashboard
                  </el-checkbox>
                </el-form-item>
                <el-form-item v-if="isSystemAdmin">
                  <el-button @click="executeSubElement('autoload',$event)" :disabled="$Utils.equals(selectedItem, {})">
                    Tự động tải
                  </el-button>
                </el-form-item>
                <el-form-item label="Cấu hình thêm" v-if="isSystemAdmin">
                  <el-input v-model="model.Description.ExtraSetting"></el-input>
                </el-form-item>
                <el-form-item label="Mô tả" v-if="isSystemAdmin">
                  <el-input v-model="model.Description.More"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Chức năng" name="1"
                         v-if="!model.Description.IsDashboard && model.Description.PageLink!=='Redirect'">
              <el-form label-width="120px">
                <el-form-item label="Loại">
                  <el-select clearable v-model="viewModel.ModuleType" @change="onModuleTypeChange()">
                    <el-option value="Filter" v-if="isSystemAdmin" label="Filter"></el-option>
                    <el-option value="Form" v-if="isSystemAdmin" label="Form"></el-option>
                    <el-option value="List" v-if="isSystemAdmin" label="List"></el-option>
                    <el-option value="Report" label="Report"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Tên">
                  <el-select v-model="viewModel.ModuleValue" filterable placeholder="" value-key="Id">
                    <el-option v-for="item in viewModel.ListSourceModules" :key="item.Id" :label="item.Caption"
                               :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="insertModule">Thêm</el-button>
                </el-form-item>
              </el-form>
              <table class="el-table__body-wrapper el-table--border is-scroll-left">
                <thead>
                <tr>
                  <th>Loại</th>
                  <th>Chức năng</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody v-dragula="model.Value" bag="fieldsABag">
                  <tr v-for="(module, index) in model.Value" v-if="module.ModuleType !='Filter'" :key="module.ModuleCode" class="hoverdragable">
                    <td>{{module.ModuleType}}</td>
                    <td>{{module.Caption}}</td>
                    <td>
                      <el-button title="Chỉnh sửa"
                                 @click="executeSubElement('module','edit',module,index)">
                        <i class="fa fa-edit"></i>
                      </el-button>
                      <el-button @click="deleteModule('module',index)" title="Xóa">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br>
              <span>Liên kết lọc</span>
              <div>
                <table class="el-table__body-wrapper el-table--border is-scroll-left">
                  <thead>
                  <tr>
                    <th>Tên bộ lọc</th>
                    <th>Công cụ</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(filter, index) in model.Description.Filters">
                    <td>{{filter.Caption}}</td>
                    <td>
                      <div v-if="!$isMobileDevice" class="row">
                        <div v-for="module in model.Value" v-if="module.ModuleType !='Filter'" class="col">
                          <el-tooltip class="item" v-if="filter.Link" effect="dark" :content="module.Caption"
                                      placement="top-start">
                            <el-checkbox :checked="filter.Link[module.ModuleCode]"
                                         @change="changeFilter(filter.Link, module.ModuleCode, $event)"></el-checkbox>
                          </el-tooltip>
                        </div>
                        <div flex ng-if="isSystemAdmin">
                          <el-button @click="deleteModule('filter',index)" title="Xóa">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </div>
                      </div>
                      <div v-else class="row">
                        <div v-for="module in model.Value" v-if="module.ModuleType !='Filter'" class="col">
                            <el-checkbox :checked="filter.Link[module.ModuleCode]"
                                         @change="changeFilter(filter.Link, module.ModuleCode, $event)"></el-checkbox>
                        </div>
                        <div flex ng-if="isSystemAdmin">
                          <el-button @click="deleteModule('filter',index)" title="Xóa">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Nâng cao" v-if="model.Description.PageLink!=='Redirect'" name="2">
              <el-form label-width="120px">
                <el-form-item label="Loại">
                  <el-select clearable v-model="viewModel.ModuleType" @change="onModuleTypeChange()">
                    <el-option value="Filter" v-if="isSystemAdmin" label="Filter"></el-option>
                    <el-option value="Form" v-if="isSystemAdmin" label="Form"></el-option>
                    <el-option value="List" v-if="isSystemAdmin" label="List"></el-option>
                    <el-option value="Report" v-if="isSystemAdmin" label="Report"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Tên">
                  <el-select v-model="viewModel.ModuleValue" filterable placeholder="" value-key="Id">
                    <el-option v-for="item in viewModel.ListSourceModules" :key="item.Id" :label="item.Caption"
                               :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Nhóm" v-model="viewModel.Group">
                  <el-select v-model="viewModel.Group">
                    <el-option v-for="item in model.Description.Groups" :label="item.Caption"
                               :value="item.Name"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button @click="insertModule" :disabled="!viewModel.Group">Thêm</el-button>
                  <el-button @click="executeSubElement('group','insert')"
                             :disabled="model.Description.IsDashboard == false">Thêm nhóm
                  </el-button>
                </el-form-item>

                <el-form-item label="Trường dữ liệu ">
                  <el-card class="box-card">
                    <div v-dragula="model.Description.Groups" bag="groupPagesbag">
                      <sortable-tree v-for="(tree, index) in model.ObjectFields" :data="tree" @changePosition="positionChanged"
                                     :dragEnable="true" closeStateKey="$foldClose">
                        <template slot-scope="{item}">
                          <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
                            <span v-if="item['$foldClose'] && item.children && item.children.length"
                                  @click="changeState(item)"><i :class='item.collapseIcon'></i></span>
                            <span v-else-if="!item['$foldClose'] && item.children && item.children.length"
                                  @click="changeState(item)"><i :class='item.expandIcon'></i></span>
                            <span class="mr-3"><a href="javascript:void(0)" @click="editTreeNode(item, index)">{{item.Caption}}</a></span>
                          </div>
                        </template>
                      </sortable-tree>
                    </div>
                  </el-card>
                </el-form-item>
              </el-form>
              Liên kết lọc
              <table class="el-table__body-wrapper el-table--border el-table--border is-scroll-left">
                <thead>
                <tr>
                  <th style="width: 20%;">Tên bộ lọc</th>
                  <th style="width: 20%;">Nhóm</th>
                  <th style="width: 60%;">Công cụ</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(filter, index) in model.Description.Filters">
                  <td>{{filter.Caption}}</td>
                  <td>{{filter.Group}}</td>
                  <td v-if="!$isMobileDevice" class="row">
                    <div v-for="module in model.Value" v-if="module.ModuleType !='Filter'" class="col">
                      <el-tooltip class="item" v-if="filter.Link" effect="dark" :content="module.Caption"
                                  placement="top-start">
                        <el-checkbox :checked="filter.Link[module.ModuleCode]"
                                     @change="changeFilter(filter.Link, module.ModuleCode, $event)"></el-checkbox>
                      </el-tooltip>
                    </div>
                    <div v-if="isSystemAdmin" class="col">
                      <el-button @click="deleteModule('filter',index)" title="Xóa">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </td>
                  <td v-else class="row">
                    <div v-for="module in model.Value" v-if="module.ModuleType !='Filter'" class="col">
                        <el-checkbox :checked="filter.Link[module.ModuleCode]"
                                     @change="changeFilter(filter.Link, module.ModuleCode, $event)"></el-checkbox>
                    </div>
                    <div v-if="isSystemAdmin" class="col">
                      <el-button @click="deleteModule('filter',index)" title="Xóa">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </el-tab-pane>
            <el-tab-pane label="Đa ngôn  ngữ" name="3" v-if="false">
              <el-form label-width="120px">
                <el-form-item label="Ngôn ngữ">
                  <el-select v-model="viewModel.LanguageValue" value-key="Id">
                    <el-option v-value="item" v-for="item in viewModel.ListLanguage" :label="item.title"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="insertLanguage">Thêm</el-button>
                </el-form-item>
              </el-form>
              <table class="el-table__body-wrapper el-table--border is-scroll-left">
                <thead>
                <tr>
                  <th>Ngôn ngữ</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(module, index) in model.Language">
                  <td>{{module.LanguageValue}}</td>
                  <td>
                    <el-button title="Chỉnh sửa phân quyền"
                               @click="executeSubElement('language','edit',module,index)">
                      <i class="fa fa-edit"></i>
                    </el-button>
                    <el-button @click="deleteLanguage('module',index)">
                      <i class="fa fa-eraser"></i>
                    </el-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueDragula from 'vue-dragula';
  import PageTree from "@/components/static/advance/PageTree";
  import PageForm from "@/components/static/advance/PageForm";
  import PageAdvanceGroupInfo from "@/components/static/advance/PageAdvanceGroupInfo";
  import PageAutoLoad from "@/components/static/advance/PageAutoLoad";
  import PageFieldInfoDialog from "@/components/static/advance/PageFieldInfoDialog";
  import utilsLibrary from "@/services/utils";
  import PermissionSelector from "@/components/static/PermissionSelector";

  Vue.use(VueDragula);
  export default {
    name: "categories",
    components: {
      PageTree,
      PageForm,
      PermissionSelector,
    },
    data() {
      return {
        model: {
          ObjectFields: [],
          Description: {
            isDashBoard: false,
            PageLink: '',
            MenuIcon: '',
            ExtraSetting: '',
            LimitIndex: 35,
            IsShowOnMenu: false,
            IsDetail: false,
            Pagination: false,
            DisplayRole: false,
            DisplayChange: false,
            Filters: {
              Link: {},
            }
          },

        },
        viewModel: {
          Page: [],
          Groups: [],
          ListLanguage: [],
          ListSourceModules: [],
          Group: '',
          ModuleValue: {},
        },
        radio: "0",
        tableData: [],
        Pagelist: [],
        activeName: "0",
        selectedItem: {},
        isSystemAdmin: false,
        isMantisAdmin: false,
        treePage: {},
        tabPosition: 'top',
        rules: {
          Caption: [{required: true, message: 'Trường bắt buộc', trigger: 'blur'}]
        }
      };
    },
    methods: {
      positionChanged(option){
        if(option.afterParent.Level == undefined){
          delete option.afterParent.children;
          option.beforeParent.children.splice(option.beforeIndex,0, option.data)
        }
        this.model.ObjectFields = JSON.parse(JSON.stringify(this.model.ObjectFields))
        this.$forceUpdate();
      },
      editTreeNode(selectedItem, index) {
        var type = selectedItem.level === '0' ? 'group' : 'field';
        this.executeSubElement(type, 'edit', selectedItem, index);
      },
      changeFilter(item, code, value) {
        this.$set(item, code, value)
      },
      changeState(item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
      },
      bindPageSource() {
        var ctrl = this;
        ctrl.Pagelist = [];
        ctrl.viewModel.Page.source = [];
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Project.Page';
        request.R1_IncludedNestedSetParent = true;
        utilsLibrary.post(request).then((data) => {
          data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          ctrl.Pagelist = data.filter(page => {
            if (page.Description != undefined) {
              page.treeCaption = page.Caption + '';
              page.Description = JSON.parse(page.Description);
              page.Caption = page.Description.Caption;
            }
            var returnCondition = ctrl.isSystemAdmin || page.Description ==undefined || (page.Description && page.Description.DisplayRole === "true")
            return returnCondition;
          })
          var tmp = this.$Utils.createCustomTreeFromList(
            ctrl.Pagelist,
            "Id",
            "ParentId",
            "children",
            {Caption: 'Name', Id: 'value'},
            {
              type: "data-group",
              collapseIcon: 'fa fa-plus-square-o',
              expandIcon: 'fa fa-minus-square-o',
              icon: "icon-folder",
              unread: 0,
              total: 0,
              $foldClose: false,
            }
          );
            $.each(tmp, (i, item)=>{
              if(item.Description == undefined){
                ctrl.treePage = item;
                return false;
              }
            })
        });
      },
      requestByAction(action) {
        var ctrl = this;
        var selectedItem = this.selectedItem;
        if (selectedItem == null)
          return;
        if (action === 'edit') {
          ctrl.resetForm();
          var request = ctrl.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_Id = selectedItem.value;
          utilsLibrary.postCheckResult(request).then(function (data) {
            data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
            var currentObject = data[0];
            if (currentObject.Description !== undefined) {

              currentObject.Description = JSON.parse(currentObject.Description);
              currentObject.Value = JSON.parse(currentObject.Value);
              currentObject.Language = (typeof currentObject.Language) === 'string' ? JSON.parse(currentObject.Language) : [];
              $.each(currentObject.Description, function (key, value) {
                if (value === 'true')
                  currentObject.Description[key] = true;
                if (value === 'false')
                  currentObject.Description[key] = false;
              });
              currentObject.Description.IsDashboard = currentObject.Description.IsDashboard !== undefined ? currentObject.Description.IsDashboard : false;
              if (currentObject.Description.Filters === undefined || currentObject.Description.Filters === false)
                currentObject.Description.Filters = [];
              ctrl.model = currentObject;

              request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
              request.R1_RequestTemplate = 'SettingNew.SearchSetting';
              request.R1_Code = '';
              $.each(ctrl.model.Value, function (k, item) {
                request.R1_Code += item.ModuleCode + ';';
              })
              utilsLibrary.post(request).then(function (data) {
                var arrSourceModules = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
                $.each(arrSourceModules, (key, source) => {
                  $.each(ctrl.model.Value, (k, module) => {
                    if (module.ModuleCode === source.Code) {
                      if (module.ModuleType === 'Report')
                        module.DataGroup = source.DataGroup;
                      else
                        module.DataGroup = source.Name;
                      module.Caption = source.Caption;
                    }
                  })

                  $.each(ctrl.model.Description.Filters, (key, module) => {
                    if (module.ModuleCode === source.Code) {
                      ctrl.$set(module, 'Caption', source.Caption);
                      ctrl.$set(module, 'DataGroup', source.DataGroup);
                    }
                  })
                })

                if (ctrl.model.Description.IsDashboard) {

                  ctrl.model.ObjectFields = ctrl.$Lodash.cloneDeep(ctrl.model.Description.Groups);
                  var tmp = ctrl.$Utils.rotateDementionArr(ctrl.model.Value, 'ModuleCode');
                  $.each(ctrl.model.ObjectFields, (k, group) => {
                    group.children = []
                    $.each(group.ListModules.split(';'), (i, child) => {
                      if (child !== '')
                        group.children.push(tmp[child]);
                    })
                    group.collapseIcon = 'fa fa-plus-square';
                    group.expandIcon = 'fa fa-minus-square';
                    group.level = '0';
                  });

                }
                else {
                  if (ctrl.model.Description.ModuleOrder !== undefined && ctrl.model.Description.ModuleOrder !== false) {
                    var arrModuleOrders = ctrl.model.Description.ModuleOrder.split(';');
                    var arrModules = ctrl.$Lodash.cloneDeep(ctrl.model.Value);
                    $.each(arrModuleOrders, (orderIndex, moduleCode) => {
                      $.each(arrModules, (index, module) => {
                        if (moduleCode === module.ModuleCode)
                          ctrl.model.Value.splice(orderIndex, 0, ctrl.model.Value.splice(index, 1)[0]);
                      });
                    });
                  }
                }
                if (ctrl.model.Description.FilterOrder !== undefined && ctrl.model.Description.FilterOrder !== false) {
                  var arrFilterOrders = ctrl.model.Description.FilterOrder.split(';');
                  var arrFilters = ctrl.$Lodash.cloneDeep(ctrl.model.Description.Filters);
                  $.each(arrFilterOrders, (orderIndex, filterCode) => {
                    $.each(arrFilters, (index, filter) => {
                      if (filterCode == filter.ModuleCode)
                        ctrl.model.Description.Filters.splice(orderIndex, 0, ctrl.model.Description.Filters.splice(index, 1)[0]);
                    });
                  });
                }
                $.each(ctrl.model.Description.Filters, (key, item) => {
                  item.Link = {};
                  if (item.FilterLink !== undefined) {
                    $.each(ctrl.model.Value, (key, module) => {
                      ctrl.$set(item.Link, module.ModuleCode, item.FilterLink.indexOf(module.ModuleCode) !== -1)
                    })
                  }
                })
              });
            }
            ctrl.onElementClick({args: {innerText: 'Sửa'}});
          });
        }
        else if (action === 'save') {
          var savedData = ctrl.bindSavedData();
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request = utilsLibrary.updateParamsSingleRequest(request, savedData);
          utilsLibrary.postCheckResult(request).then((data) => {
            if (data.success) {
              utilsLibrary.showMessage('success', this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
              ctrl.bindPageSource();
              ctrl.requestByAction('edit');
            }
          });
        }

      },
      onModuleTypeChange() {
        var ctrl = this;
        if (ctrl.viewModel.ModuleType !== '') {
          ctrl.viewModel.ModuleValue = {};
          ctrl.viewModel.ListSourceModules = [];
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_ParentCode = 'xSetting.Project.' + ctrl.viewModel.ModuleType;
          request.R1_Level = '4';
          utilsLibrary.post(request).then((data) => {
            ctrl.viewModel.ListSourceModules = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          });
        }
      },
      onCaptionChange() {

        var ctrl = this;
        if (!utilsLibrary.isEmpty(ctrl.model.Description.UrlPage))
          ctrl.model.Description.UrlPage = 'dynamic/' + utilsLibrary.removeVNCharacters(ctrl.model.Description.Caption);
      },
      insertModule() {
        var ctrl = this;
        var treeGroupsItems = ctrl.model.ObjectFields;
        if (ctrl.viewModel.ModuleValue != '' && ctrl.viewModel.ModuleValue != null) {
          var selectedModule = ctrl.viewModel.ModuleValue;
          selectedModule = {
            Caption: selectedModule.Caption,
            ModuleCode: selectedModule.Code,
            ModuleType: ctrl.viewModel.ModuleType,
            DataGroup: ctrl.viewModel.ModuleType == 'Report' ? selectedModule.DataGroup : selectedModule.Name,
            Group: ctrl.viewModel.Group
          }
          var exist = false;
          $.each(ctrl.model.Value, (key, module) => {
            if (module.ModuleCode == selectedModule.ModuleCode)
              exist = true;
          });
          if (ctrl.model.Description.IsDashboard && selectedModule.ModuleType != 'Filter') {
            $.each(treeGroupsItems, (key, item) => {
              if (item.level == 0 && item.value == ctrl.viewModel.Group) {
                item.children.push(selectedModule)
                return false;
              }
            });
          }
          if (!exist) {
            if (selectedModule.ModuleType == 'Filter') {
              selectedModule.Link = {};
              $.each(ctrl.model.Value, (key, module) => {
                selectedModule.Link[module.ModuleCode] = false;
              });

              ctrl.model.Description.Filters.push(selectedModule);
            }
            else
              ctrl.model.Value.push(selectedModule);
          }else{
            ctrl.$Utils.showMessage("error", "Đã tồn tại");
          }
          ctrl.viewModel.ModuleValue = '';
        }
        else
          utilsLibrary.showMessage('error', 'Hãy chọn 1 chức năng');
      },
      insertLanguage() {
        var ctrl = this;
        if (ctrl.viewModel.LanguageValue != '' && ctrl.viewModel.LanguageValue != null) {
          var selectedModule = ctrl.viewModel.LanguageValue;
          selectedModule = {
            LanguageValue: selectedModule.title,
            LanguageCode: selectedModule.code
          }
          var exist = false;
          $.each(ctrl.model.Language, (key, module) => {
            if (module.LanguageValue == selectedModule.LanguageValue)
              exist = true;
          });
          if (!exist) {
            ctrl.model.Language.push(selectedModule);
          }
          ctrl.viewModel.LanguageValue = '';
        }
        else
          utilsLibrary.showMessage('error', 'Hãy chọn 1 ngôn ngữ');
      },
      deleteLanguage(type, index) {
        ctrl.model.Language.splice(index, 1);
      },
      deleteModule(type, index) {
        var ctrl = this;
        if (type == 'module')
          ctrl.model.Value.splice(index, 1);
        else
          ctrl.model.Description.Filters.splice(index, 1);
      },
      bindGroup(communication) {
        var ctrl = this;
        var isExist = false;
        if (communication.action == 'edit') {
          $.each(ctrl.model.Description.Groups, (index, item) => {
            if (item.Name == communication.item.Name && communication.index != index)
              isExist = true;
          });
          if (!isExist) {
            ctrl.model.Description.Groups[communication.index] = communication.item;
            ctrl.treeGroups.updateItem(ctrl.treeGroups.getSelectedItem().element, {
              label: communication.item.Caption,
              value: communication.item.Name
            });
          }
        }
        else {
          ctrl.model.Description.Groups.push(communication.item);
          ctrl.treeGroups.addTo({
            label: communication.item.Caption,
            value: communication.item.Name
          });
        }
      },
      executeSubElement(type, action, item, index) {
        var ctrl = this;
        ctrl.communication.action = action;
        ctrl.communication.scrope = ctrl;
        if (action == 'edit') {
          ctrl.communication.item = item;
          ctrl.communication.index = index;
        }

        var dialog = type == 'group' ? PageAdvanceGroupInfo : type == 'autoload' ? PageAutoLoad : PageFieldInfoDialog;
        var title = type == 'autoload' ? 'Thông tin liên kết' : "Thông tin nhóm";
        this.$hub.$emit(
          "set-modal-data",
          title,
          "50%",
          true,
          "center",
          dialog,
          false,
          "",
          ctrl.communication
        );
      },
      onElementClick() {
        var ctrl = this;
        var orderIndex = -1;
        var orderItem = {};
        if (this.selectedItem != null) {
          if (this.selectedItem.level === 0) {
            $.each(ctrl.model.Description.Groups, (index, item) => {
              if (item.Name === selectedItem.value) {
                orderIndex = index;
                orderItem = item;
              }
            });
          }
          else {
            if (ctrl.model.Description.IsDashboard) {
              $.each(ctrl.model.Value, (index, module) => {
                if (module.ModuleCode === this.selectedItem.value) {
                  orderIndex = index;
                  orderItem = module;
                }
              });
              var parentGroup = this.selectedItem.parentElement;
            }
          }
        }
      },
      bindListUserPermissions() {
        var ctrl = this;
        ctrl.viewModel.UserPermissions = [];
        ctrl.viewModel.GroupPermissions = [];
        ctrl.viewModel.RolePermissions = {};
        ctrl.viewModel.listUsers = [];
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'Status',
          Status: '1',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;GroupType'
        };
        utilsLibrary.post(request).then((data) => {
          data = utilsLibrary.getDataWithRoot(data, 'UserDS.Group');
          $.each(data, (key, value) => {
            if (value.GroupType == 0)
              ctrl.viewModel.UserPermissions.push(value);
            else if (value.GroupType == 1)
              ctrl.viewModel.GroupPermissions.push(value);
            else if (value.GroupType == 2) {
              if (!utilsLibrary.isEmpty(ctrl.viewModel.RolePermissions) || !utilsLibrary.isEmpty(ctrl.viewModel.RolePermissions[value.GroupParent]))
                if(ctrl.viewModel.RolePermissions[value.GroupParent]== undefined)
                  ctrl.viewModel.RolePermissions[value.GroupParent] = []
              ctrl.viewModel.RolePermissions[value.GroupParent].push(value);
            }
          })
        });
        request = {
          RequestAction: 'SearchUserWithGroups',
          IncludedGroupManager: 'true',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'IncludedGroupManager;Group;Status',
          Status: '1',
          GroupType: '1',
          StaticFields: 'UserId;Username;LoginName',
          orderFields: 'LoginName ASC'
        };
        utilsLibrary.post(request).then((data) => {
          data = utilsLibrary.getDataWithRoot(data, 'Data.UserDS.User');
          ctrl.viewModel.listUsers = data;

        });
      },
      bindSavedData() {
        var ctrl = this;
        var savedData = ctrl.$Lodash.cloneDeep(ctrl.model);
        utilsLibrary.deleteAutoValue(savedData);
        savedData.RequestTemplate = 'SettingNew.Update';
        if (savedData.Description.IsDashboard) {
          var treeGroupItems = ctrl.treePage;
          $.each(savedData.Description.Groups, (key, group) => {
            utilsLibrary.deleteAutoValue(group);
            group.ListModules = '';
            var groupItemId = '';
            for (var i = 0; i < treeGroupItems.length; i++) {
              if (treeGroupItems[i].value == group.Name) {
                groupItemId = treeGroupItems[i].id;
                break;
              }
            }
            $.each(group.children, (key, item) => {
              group.ListModules += item.ModuleCode + ';';
              delete item.$parent;
            });
            delete group.children;
          })
        }
        else {
          savedData.Description.ModuleOrder = '';
          $.each(savedData.Value, (key, module) => {
            savedData.Description.ModuleOrder += module.ModuleCode + ';';
          });
          savedData.Description.FilterOrder = '';
          $.each(savedData.Description.Filters, (key, module) => {
            savedData.Description.FilterOrder += module.ModuleCode + ';';
          });
        }
        $.each(savedData.Value, (index, module) => {
          if (module) {
            delete module.$parent
            if (module.ModuleType == 'Filter') {
              savedData.Value.splice(index, 1);
            }
          }
        });

        $.each(savedData.Description.Filters, (key, filter) => {
          utilsLibrary.deleteAutoValue(filter);
          delete filter.Caption;
          filter.FilterLink = '';
          $.each(filter.Link, (key, value) => {
            if (value)
              filter.FilterLink += key + ';';
          })
          delete filter.Link;
          savedData.Value.push(filter);
        });

        $.each(savedData.Value, (key, module) => {
          delete module.Caption;
        })

        $.each(savedData.Description, (key, value) => {
          if (value == true)
            savedData.Description[key] = 'true';
          if (value == false && value != '')
            savedData.Description[key] = 'false';
        });

        savedData.Description = JSON.stringify(savedData.Description);
        savedData.Value = JSON.stringify(savedData.Value);
        savedData.Language = JSON.stringify(savedData.Language);
        return savedData;
      },
      resetForm() {
        var ctrl = this;
        ctrl.viewModel.Groups.source = [];
        ctrl.viewModel.selectedTab = 0;
        ctrl.viewModel.ModuleType = '';
        ctrl.viewModel.Group = '';
        ctrl.viewModel.ListSourceModules = [];
      },
      showPermission(id) {
        this.$hub.$emit(
          "set-modal-data",
          "Chia sẻ tài liệu",
          "80%",
          true,
          "left",
          PermissionSelector,
          true,
          '',
          id
        );
      },
      init() {
        var ctrl = this;
        ctrl.isSystemAdmin = this.$isSystemAdmin();
        ctrl.isMantisAdmin = this.$isMantisAdmin();
        this.bindListUserPermissions();
        this.bindPageSource();
        ctrl.communication = {action: '', item: {}, index: '', scope: ctrl};
      }
    },
    watch: {},
    destroyed() {
      this.$hub.$off("fill-data-to-page");
      this.$hub.$off("reloadTree");
      this.$hub.$off("reloadFieldTree");
    },
    created() {
      this.init();
    },
    mounted() {
      this.$hub.$on("fill-data-to-page", (item) => {
        this.activeName = "0";
        this.selectedItem = item;
        this.requestByAction('edit');
      });
      this.$hub.$on("reloadTree", () => {
        this.bindPageSource();
      });
      this.$hub.$on("reloadFieldTree", (index) => {
        this.$forceUpdate();
      });

    }
  };
</script>
<style lang="scss" scoped>
  .mt-aside {
    max-height: calc(100vh - 180px);
    overflow: auto;
  }

  .title-box {
    background-color: #f0f3f5;
    border: 1px solid #c2cfd6;
  }

  .custom-tree-content {
    position: relative;
    top: 2px;
    z-index: 1;
    &.exitChild {
      margin-left: -7px;
    }
  }
  .hoverdragable {
    cursor: pointer;
  }
</style>
