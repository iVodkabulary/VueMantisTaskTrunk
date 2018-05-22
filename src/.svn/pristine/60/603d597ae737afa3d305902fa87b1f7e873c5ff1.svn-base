<template>
<div>
  <el-form>
      <el-form-item>
        <el-button v-show="isShowForm" @click="back">Quay lại</el-button>
        <el-button type="primary" @click="openPermissionSelector()" v-if="!id || id != null">Cấp phép</el-button>
        <el-button type="primary" @click="save">Lưu</el-button>
      </el-form-item>
      <el-form-item>
        <el-tabs type="border-card" @tab-click="openedSignal=true;">
          <el-tab-pane label="Cấu hình Form">
           <div class="form-config">
    <el-form ref="ruleForm" label-width="120px">
      <el-form-item label="Tên" >
        <el-col :span="24">
          <el-input v-model="model.Description.Caption" placeholder="Tên" ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input placeholder="Mô tả" v-model="model.Description.More"></el-input>
      </el-form-item>
      <el-form-item label="Cho phép:">
        <el-checkbox v-model="model.Description.HasPermissionTab" >Cấp phép</el-checkbox>
        <el-checkbox v-model="model.Description.HasCommentTab" >Bình luận</el-checkbox>
        <el-checkbox v-model="model.Description.HasFileTab" >File đính kèm</el-checkbox>
        <el-checkbox v-model="model.Description.HasHistoryTab" >Lịch sử cập nhật</el-checkbox>
        <el-checkbox v-model="model.Description.HasSubscribe" >Theo dõi</el-checkbox>
        <el-checkbox v-model="model.Description.History" >Lịch sử thay đổi</el-checkbox>
        <el-checkbox v-model="model.Description.Repeat" >Lặp nội dung</el-checkbox>
      </el-form-item>
      <el-form-item label="Khối dữ liệu">
        <el-col :span="12">
          <el-cascader expand-trigger="hover" :options="DataGroupTree" placeholder="" v-model="selectedDataGroups" @change="handleChange"></el-cascader>
        </el-col>
        <el-col :span="12">
          Kiểu hiển thị: {{model.DisplayType}}

          <el-radio v-for="item in viewModel.DisplayType" v-model="model.Description.DisplayType" :label="item.Code">{{item.Name}}</el-radio>
        </el-col>
      </el-form-item>
       <el-form-item label="Trường dữ liệu">
        <el-col :span="4">
          <el-select v-model="viewModel.Field" placeholder="Chọn" clearable>
            <el-option v-for="item in CurrentDataGroup.Fields" :key="item.Name" :label="item.Caption+'('+item.Name+')'" :value="item.Name"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="viewModel.Group" placeholder="Nhóm" clearable>
            <el-option v-for="item in model.Description.Groups" :key="item.Caption" :label="item.Caption" :value="item.Caption"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :disabled="viewModel.Group === '' || viewModel.Field === ''" @click="insertField">Thêm</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="centerDialogVisible=true; catModel.action ='insert' ">Thêm nhóm</el-button>
        </el-col>
        <el-col :span="2">&ensp;</el-col>
        <el-col :span="4">
          Nút hiển thị
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="13">
          <el-card class="box-card">
            <sortable-tree v-for="item in model.Description.Groups" :data="item" mixinParentKey="$parent" :dragEnable="true" closeStateKey="$foldClose">
              <template slot-scope="{item}">
                <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
                  <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.collapseIcon'></i></span>
                  <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.expandIcon'></i></span>
                  <span class="mr-3"><a href="javascript:void(0)" @click="editTreeNode(item)">{{item.Caption}}</a></span>
                </div>
              </template>
            </sortable-tree>
          </el-card>
        </el-col>
        <el-col :span="1">&ensp;</el-col>
        <el-col :span="10">
          <el-card class="box-card">
            {{listSelectedButtons}}
            <el-checkbox-group v-model="listSelectedButtons" >
              <div v-dragula="CurrentDataGroup.Buttons" bag="checkBoxBag">
                <el-checkbox style="margin-left: 0px" v-for="(item, key) in CurrentDataGroup.Buttons" class="row" :key="item.Code" :label="item.Code" @change="changeStatus($event, item.Code, key)"></el-checkbox>

            </div>

            </el-checkbox-group>
          </el-card>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
            <!--
            <FormForm :data="fullData"/>
            -->
          </el-tab-pane>
          <el-tab-pane label="Phân Quyền">
            <!--
            <SubRights v-if="openedSignal" :data="fullData"/>
            -->
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
<!--
<div id="configuration-list-detail" class="page-layout simple tabbed" layout="column" ng-controller="FormDialogController as ctrl">

  <div class="content">
    <form name="editorForm" class="md-inline-form" novalidate>

              </div>
              <div layout="row" layout-align="start center">
                <div layout="column" layout-wrap flex="60">
                  <div layout="row">
                    <md-input-container class="md-block" flex="40">
                      <label>Trường dữ liệu</label>
                      <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.viewModel.Field">
                        <md-select-header class="select-header">
                          <input ng-model-options="{ debounce: 200 }" ng-model="ctrl.searchKey" type="search" placeholder="Tìm kiếm..." class="select-header-search">
                        </md-select-header>
                        <md-option ng-value="item.Name" ng-repeat="item in ctrl.CurrentDataGroup.Fields | filter:ctrl.searchKey track by $index" ng-if="item.FormFieldType == 'General' || item.FormFieldType == 'Calculator'">
                          {{::item.Caption}} ({{::item.Name}})
                        </md-option>
                      </md-select>
                    </md-input-container>
                    <div flex="5" hide-xs hide-sm></div>
                    <md-input-container class="md-block" flex="20">
                      <label>Nhóm</label>
                      <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.viewModel.Group">
                        <md-option ng-value="item.Caption" ng-repeat="item in ctrl.model.Description.Groups track by $index">
                          {{::item.Caption}}
                        </md-option>
                      </md-select>
                    </md-input-container>
                    <div flex="5" hide-xs hide-sm></div>
                    <div flex="15">
                      <md-button class="md-accent md-raised" ng-click="ctrl.insertField()" ng-disabled="ctrl.viewModel.Group == undefined || ctrl.model.Description.Groups.length == 0" aria-label="Insert" translate translate-attr-aria-label="">
                        Thêm
                      </md-button>
                    </div>
                    <div flex="15">
                      <md-button class="md-accent md-raised" ng-click="ctrl.excuteSubElement('group',$event,'insert')" aria-label="Insert" translate translate-attr-aria-label="">
                        Thêm nhóm
                      </md-button>
                    </div>
                  </div>
                  <jqx-tree jqx-width="'100%'" jqx-height="'350'" jqx-settings="ctrl.viewModel.OrderFields" jqx-instance="ctrl.treeOrderFields"></jqx-tree>
                </div>
                <div flex="5" hide-xs hide-sm></div>
                <div layout="column" layout-wrap flex>
                  <md-input-container class="md-block">
                    Nút hiển thị
                  </md-input-container>
                  <jqx-list-box jqx-width="'100%'" jqx-height="'350'" jqx-settings="ctrl.viewModel.Buttons" jqx-instance="ctrl.listboxButtons"></jqx-list-box>
                </div>
              </div>
              <br/>
              <div class="clear"></div>
              <md-expansion-panel md-component-id="panelOne">
                <md-expansion-panel-collapsed>
                  PHẦN TỬ TRỰC THUỘC
                  <md-expansion-panel-icon></md-expansion-panel-icon>
                </md-expansion-panel-collapsed>
                <md-expansion-panel-expanded>
                  <md-expansion-panel-header>
                    MỞ RỘNG PHẦN TỬ TRỰC THUỘC
                  </md-expansion-panel-header>
                  <md-expansion-panel-content>
                    <div layout="row">
                      <md-button class="send-button md-accent md-raised" ng-click="ctrl.excuteSubElement('sub-element',$event,'insert')" ng-disabled="ctrl.treeDataGroup.getSelectedItem() ==null" aria-label="Insert" translate translate-attr-aria-label="">
                        Thêm
                      </md-button>
                    </div>
                    <br>
                    <div class="simple-table-container md-whiteframe-4dp">
                      <table class="simple" ms-responsive-table>
                        <thead>
                          <tr>
                            <td>STT</td>
                            <td>LOẠI PHẦN TỬ</td>
                            <td>PHẦN TỬ</td>
                            <td>KHỐI DỮ LIỆU</td>
                            <td>XỬ LÝ</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr ng-repeat="item in ctrl.model.Description.SubElements">
                            <td class="text-center">{{::$index+1}}</td>
                            <td>{{::item.SubElementType}}</td>
                            <td>{{::item.SubElement}}</td>
                            <td>{{::item.DataGroupCaption}}</td>
                            <td class="text-center">
                              <md-button class="md-icon-button md-mini md-default" ng-click="ctrl.excuteSubElement('sub-element',$event,'edit',item,$index)" aria-label="Edit" translate translate-attr-aria-label="">
                                <i class="icon icon-pencil-box"></i>
                              </md-button>
                              <md-button class="md-icon-button md-mini md-default" ng-click="ctrl.deleteSubElement(ctrl.model.Description.SubElements,$index)" aria-label="Delete" translate translate-attr-aria-label="">
                                <i class="icon icon-delete"></i>
                              </md-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </md-expansion-panel-content>
                  <md-expansion-panel-footer>
                    <div flex></div>
                    <md-button class="md-warn" ng-click="$panel.collapse()">Đóng lại</md-button>
                  </md-expansion-panel-footer>
                </md-expansion-panel-expanded>
              </md-expansion-panel>
              <br/>
              <md-expansion-panel md-component-id="panelTwo">
                <md-expansion-panel-collapsed>
                  THÔNG BÁO
                  <md-expansion-panel-icon></md-expansion-panel-icon>
                </md-expansion-panel-collapsed>
                <md-expansion-panel-expanded>
                  <md-expansion-panel-header>
                    MỞ RỘNG THÔNG BÁO
                  </md-expansion-panel-header>
                  <md-expansion-panel-content>
                    <div layout="row">
                      <md-button class="send-button md-accent md-raised" ng-click="ctrl.excuteSubElement('sub-notification',$event,'insert')" ng-disabled="ctrl.treeDataGroup.getSelectedItem() ==null" aria-label="Insert" translate translate-attr-aria-label="">
                        Thêm
                      </md-button>
                    </div>
                    <br>
                    <div class="simple-table-container md-whiteframe-4dp">
                      <table class="simple" ms-responsive-table>
                        <thead>
                          <tr>
                            <td>STT</td>
                            <td>LOẠI</td>
                            <td>QUẢN TRỊ</td>
                            <td>TEMPLATE</td>
                            <td>XỬ LÝ</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr ng-repeat="item in ctrl.model.Description.Notifications">
                            <td class="text-center">{{::$index+1}}</td>
                            <td>{{::item.NotificationType}}</td>
                            <td>{{::item.Permissions}}</td>
                            <td>{{::item.Template}}</td>
                            <td class="text-center">
                              <md-button class="md-icon-button md-mini md-default" ng-click="ctrl.excuteSubElement('sub-notification',$event,'edit',item,$index)" aria-label="Edit" translate translate-attr-aria-label="">
                                <i class="icon icon-pencil-box"></i>
                              </md-button>
                              <md-button class="md-icon-button md-mini md-default" ng-click="ctrl.deleteSubElement(ctrl.model.Description.Notifications,$index)" aria-label="Delete" translate translate-attr-aria-label="">
                                <i class="icon icon-delete"></i>
                              </md-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </md-expansion-panel-content>
                  <md-expansion-panel-footer>
                    <div flex></div>
                    <md-button class="md-warn" ng-click="$panel.collapse()">Đóng lại</md-button>
                  </md-expansion-panel-footer>
                </md-expansion-panel-expanded>
              </md-expansion-panel>
              <br/>
            </div>
          </md-tab-body>
        </md-tab>
        <md-tab ng-if="ctrl.isSystemAdmin">
          <md-tab-label>
            <span translate="">Phân quyền</span>
          </md-tab-label>
          <md-tab-body>
            <div class="list-detail-form-container md-background-bg md-whiteframe-1dp">
              <md-tabs md-dynamic-height>
                <md-tab>
                  <md-tab-label>
                    <span translate="">Cơ bản</span>
                  </md-tab-label>
                  <md-tab-body>
                    <md-tabs md-dynamic-height md-border-bottom>
                      <md-tab label="Quyền theo phòng ban">
                        <md-content class="md-padding">
                          <div layout="row">
                            <md-input-container class="md-block" flex="20">
                              Người dùng tạo / Cập nhật
                            </md-input-container>
                            <md-input-container class="md-block" flex="30">
                              <jqx-drop-down-list jqx-width="'100%'" jqx-height="'25'" jqx-settings="ctrl.permissionModel.listDropdownRoles" jqx-instance="ctrl.dropdownRoles"></jqx-drop-down-list>
                            </md-input-container>
                            <div flex="5" hide-xs hide-sm></div>
                            <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.AlwaysUpdatePermission" aria-label="Luôn cập nhật quyền" flex>
                              Luôn cập nhật quyền
                            </md-checkbox>
                            <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.RolesIncludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                              Bao gồm thông tin người dùng
                            </md-checkbox>
                          </div>
                          <div layout="row">
                            <md-select ng-model="ctrl.Group" flex="30" aria-label="Group select">
                              <md-option value="">Chọn</md-option>
                              <md-option ng-repeat="item in ctrl.permissionModel.listUserGroups track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.GroupId] && !item.Selected">
                                {{::item.GroupName}}
                              </md-option>
                            </md-select>
                            <md-button class="md-raised md-background" ng-click="ctrl.addLine('Group', ctrl.Group)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Group">
                              <span translate="">Thêm</span>
                            </md-button>
                          </div>
                          <div class="simple-table-container md-whiteframe-4dp">
                            <table class="simple" ms-responsive-table>
                              <thead>
                                <tr>
                                  <th class="col-md-4 text-left">PHÒNG BAN</th>
                                  <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                    {{::item.Name}}
                                  </th>
                                </tr>
                              </thead>
                              <tbody ng-repeat="item in ctrl.permissionModel.listUserGroups" ng-if="ctrl.permissionModel['Static'+item.GroupId]">

                                  <tr>
                                    <td class="text-left">{{::item.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                  <tr ng-repeat="child in ctrl.permissionModel.listGroupRoles[item.GroupId]">
                                    <td>-- {{::child.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(child.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+child.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>

                                </tbody>
                                <tbody ng-repeat="item in ctrl.AddLines.Group">
                                  <tr>
                                    <td class="text-left">{{item.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                  <tr ng-repeat="child in ctrl.permissionModel.listGroupRoles[item.GroupId]">
                                    <td>-- {{::child.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(child.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+child.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </md-content>
                        </md-tab>
                        <md-tab label="Quyền theo vai trò">
                          <md-content class="md-padding">
                            <div layout="row">
                              <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.GroupInCludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                                Bao gồm thông tin người dùng
                              </md-checkbox>
                            </div>
                            <div layout="row">
                              <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.Role" flex="30" aria-label="Role select">
                                <md-option value="">Chọn</md-option>
                                <md-option ng-repeat="item in ctrl.permissionModel.listUserPermissions track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.GroupId] && !item.Selected">
                                  {{::item.GroupName}}
                                </md-option>
                              </md-select>
                              <md-button class="md-raised md-background" ng-click="ctrl.addLine('Role', ctrl.Role)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Role">
                                <span translate="">Thêm</span>
                              </md-button>
                            </div>
                            <div class="simple-table-container md-whiteframe-4dp">
                              <table class="simple" ms-responsive-table>
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-left">VAI TRÒ</th>
                                    <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                      {{::item.Name}}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr ng-repeat="item in ctrl.permissionModel.listUserPermissions" ng-if="ctrl.permissionModel['Static'+item.GroupId]">
                                    <td class="text-left">{{::item.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                  <tr ng-repeat="item in ctrl.AddLines.Role">
                                    <td class="text-left">{{item.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </md-content>
                        </md-tab>
                        <md-tab label="Quyền theo người dùng">
                          <md-content class="md-padding">
                            <div layout="row">
                              <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.User" flex="30" aria-label="Role select">
                                <md-option value="">Chọn</md-option>
                                <md-option ng-repeat="item in ctrl.permissionModel.listUsers track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.UserId] && !item.Selected">
                                  {{::item.Username}}
                                </md-option>
                              </md-select>
                              <md-button class="md-raised md-background" ng-click="ctrl.addLine('User', ctrl.User)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.User">
                                <span translate="">Thêm</span>
                              </md-button>
                            </div>
                            <div class="simple-table-container md-whiteframe-4dp">
                              <table class="simple" ms-responsive-table>
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-left">NGƯỜI DÙNG</th>
                                    <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                      {{::item.Name}}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr ng-repeat="item in ctrl.permissionModel.listUsers" ng-if="ctrl.permissionModel['Static'+item.UserId]">
                                    <td class="text-left">{{::item.Username}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.UserId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.UserId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                  <tr ng-repeat="item in ctrl.AddLines.User">
                                    <td class="text-left">{{::item.Username}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.UserId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.UserId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </md-content>
                        </md-tab>
                      </md-tabs>
                    </md-tab-body>
                  </md-tab>
                  <md-tab>
                    <md-tab-label>
                      <span translate="">Theo dữ liệu</span>
                    </md-tab-label>
                    <md-tab-body>
                      <div layout="row">
                        <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.Field" flex="30" aria-label="Field select">
                          <md-option value="">Chọn</md-option>
                          <md-option ng-repeat="item in ctrl.CurrentDataGroup.Fields track by $index" ng-value="item" ng-if="item.Permit && !ctrl.permissionModel['Dynamic'+item.Name] && !item.Selected">
                            {{::item.Caption}}
                          </md-option>
                        </md-select>
                        <md-button class="md-raised md-background" ng-click="ctrl.addLine('Field', ctrl.Field)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Field">
                          <span translate="">Thêm</span>
                        </md-button>
                      </div>
                      <div class="simple-table-container md-whiteframe-4dp">
                        <table class="simple" ms-responsive-table>
                          <thead>
                            <tr>
                              <th class="col-md-4 text-left">TRƯỜNG DỮ LIỆU</th>
                              <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                {{::item.Name}}
                              </th>
                              <th class="col-md-4 text-left">BẢNG DỮ LIỆU</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr ng-repeat="item in ctrl.CurrentDataGroup.Fields" ng-if="(item.FormFieldType == 'General' || item.FormFieldType == 'Calculator') && ctrl.permissionModel['Dynamic'+item.Name]">
                              <td class="text-left">{{::item.Caption}}</td>
                              <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                <input type="checkbox" ng-click='ctrl.permission.checkDynamicLinked(item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic'+item.Name + role.Code]" class="permission-check">
                              </td>
                              <td class="text-left">
                                <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic_Type'+ item.Name]" flex ng-change='ctrl.permission.checkDynamicSelect(item.Name)' aria-label="Permission select">
                                  <md-option value="">Chọn</md-option>
                                  <md-option value="User">Nhân sự</md-option>
                                  <md-option value="Group">Phòng ban</md-option>
                                </md-select>
                              </td>
                            </tr>
                            <tr ng-repeat="item in ctrl.AddLines.Field">
                              <td class="text-left">{{::item.Caption}}</td>
                              <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                <input type="checkbox" ng-click='ctrl.permission.checkDynamicLinked(item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic'+item.Name + role.Code]" class="permission-check">
                              </td>
                              <td class="text-left">
                                <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic_Type'+ item.Name]" flex ng-change='ctrl.permission.checkDynamicSelect(item.Name)' aria-label="Permission select">
                                  <md-option value="">Chọn</md-option>
                                  <md-option value="User">Nhân sự</md-option>
                                  <md-option value="Group">Phòng ban</md-option>
                                </md-select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </md-tab-body>
                  </md-tab>
                  <md-tab>
                    <md-tab-label>
                      <span translate="">Theo kịch bản</span>
                    </md-tab-label>
                    <md-tab-body>
                      <md-input-container class="md-block" flex>
                        <label>Phân quyền cho cấp trên</label>
                        <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.LeadershipDynamicOrganization" flex="30">
                          <md-option value="">Chọn</md-option>
                          <md-option ng-repeat="item in ctrl.CurrentDataGroup.Fields track by $index" ng-value="item.Name" ng-if="item.Permit">
                            {{::item.Caption}}
                          </md-option>
                        </md-select>
                      </md-input-container>
                      <md-tabs md-dynamic-height md-border-bottom>
                        <md-tab>
                          <md-tab-label>
                            <span translate="">Phòng ban</span>
                          </md-tab-label>
                          <md-tab-body>
                            <div class="simple-table-container md-whiteframe-4dp">
                              <table class="simple" ms-responsive-table>
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-left">PHÒNG BAN</th>
                                    <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                      {{::item.Name}}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr ng-repeat="item in ctrl.permissionModel.listRoleGroups">
                                    <td class="text-left">{{::item.Caption}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkScriptLinked("1",item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Script'+item.Name + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </md-tab-body>
                        </md-tab>
                        <md-tab>
                          <md-tab-label>
                            <span translate="">Vai trò</span>
                          </md-tab-label>
                          <md-tab-body>
                            <div class="simple-table-container md-whiteframe-4dp">
                              <table class="simple" ms-responsive-table>
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-left">VAI TRÒ</th>
                                    <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                      {{::item.Name}}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr ng-repeat="item in ctrl.permissionModel.listUserPermissions">
                                    <td class="text-left">{{::item.GroupName}}</td>
                                    <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                      <input type="checkbox" ng-click='ctrl.permission.checkScriptLinked(item.GroupId,item.GroupName, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Script'+item.GroupId + role.Code]" class="permission-check">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </md-tab-body>
                        </md-tab>
                      </md-tabs>
                      <br>
                    </md-tab-body>
                  </md-tab>
                  <md-tab>
                    <md-tab-label>
                      <span translate="">Sao chép phân quyền</span>
                    </md-tab-label>
                    <md-tab-body>
                      <div layout="row">
                        <md-input-container class="md-block" flex="20">
                          Trường dữ liệu
                        </md-input-container>
                        <md-input-container class="md-block" flex="30">
                          <jqx-drop-down-list jqx-width="'100%'" jqx-height="'25'" jqx-settings="ctrl.permissionModel.listDropdownFields" jqx-instance="ctrl.dropdownDynamicPermissions"></jqx-drop-down-list>
                        </md-input-container>
                        <div flex="5" hide-xs hide-sm></div>
                        <md-input-container class="md-block">
                          <label>Nhập mã trực tiếp</label>
                          <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.StaticPermissions">
                        </md-input-container>
                        <div flex="5" hide-xs hide-sm></div>
                        <md-input-container class="md-block">
                          <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.StaticIncludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                            Bao gồm thông tin người dùng
                          </md-checkbox>
                        </md-input-container>
                      </div>
                      <div layout="row">
                        <md-input-container class="md-block" flex-gt-sm>
                          <label>Mã Template lấy dữ liệu</label>
                          <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormRequest" />
                        </md-input-container>
                        <div flex="5" hide-xs hide-sm></div>
                        <md-input-container class="md-block" flex-gt-sm>
                          <label>Đường dẫn gốc</label>
                          <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormDataRoot" />
                        </md-input-container>
                        <div flex="5" hide-xs hide-sm></div>
                        <md-input-container class="md-block" flex-gt-sm>
                          <label>Mã</label>
                          <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormCode" />
                        </md-input-container>
                      </div>
                      <div layout="row">
                        <md-input-container class="md-block" flex-gt-sm>
                          <label>Mã riêng tư</label>
                          <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.Code" />
                        </md-input-container>
                      </div>
                    </md-tab-body>
                  </md-tab>
                  <md-tab>
                    <md-tab-label>
                      <span translate="">Xóa phân quyền</span>
                    </md-tab-label>
                    <md-tab-body>
                      <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.RemoveRole" aria-label="Xóa phân quyền">
                        Xóa phân quyền
                      </md-checkbox>
                    </md-tab-body>
                  </md-tab>
                </md-tabs>
              </div>
            </md-tab-body>
          </md-tab>
        </md-tabs>
        <div class="list-detail-form-container md-background-bg md-whiteframe-1dp" ng-if="!ctrl.isSystemAdmin">
          <md-tabs md-dynamic-height>
            <md-tab>
              <md-tab-label>
                <span translate="">Cơ bản</span>
              </md-tab-label>
              <md-tab-body>
                <md-tabs md-dynamic-height md-border-bottom>
                  <md-tab label="Quyền theo phòng ban">
                    <md-content class="md-padding">
                      <div layout="row" hide>
                        <md-input-container class="md-block" flex="20">
                          Người dùng tạo / Cập nhật
                        </md-input-container>
                        <md-input-container class="md-block" flex="30">
                          <jqx-drop-down-list jqx-width="'100%'" jqx-height="'25'" jqx-settings="ctrl.permissionModel.listDropdownRoles" jqx-instance="ctrl.dropdownRoles"></jqx-drop-down-list>
                        </md-input-container>
                        <div flex="5" hide-xs hide-sm></div>
                        <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.AlwaysUpdatePermission" aria-label="Luôn cập nhật quyền" flex>
                          Luôn cập nhật quyền
                        </md-checkbox>
                        <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.RolesIncludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                          Bao gồm thông tin người dùng
                        </md-checkbox>
                      </div>
                      <div layout="row">
                        <md-select ng-model="ctrl.Group" flex="30" aria-label="Group select">
                          <md-option value="">Chọn</md-option>
                          <md-option ng-repeat="item in ctrl.permissionModel.listUserGroups track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.GroupId] && !item.Selected">
                            {{::item.GroupName}}
                          </md-option>
                        </md-select>
                        <md-button class="md-raised md-background" ng-click="ctrl.addLine('Group', ctrl.Group)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Group">
                          <span translate="">Thêm</span>
                        </md-button>
                      </div>
                      <div class="simple-table-container md-whiteframe-4dp">
                        <table class="simple" ms-responsive-table>
                          <thead>
                            <tr>
                              <th class="col-md-4 text-left">PHÒNG BAN</th>
                              <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                {{::item.Name}}
                              </th>
                            </tr>
                          </thead>
                          <tbody ng-repeat="item in ctrl.permissionModel.listUserGroups" ng-if="ctrl.permissionModel['Static'+item.GroupId]">

                              <tr>
                                <td class="text-left">{{::item.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                              <tr ng-repeat="child in ctrl.permissionModel.listGroupRoles[item.GroupId]">
                                <td>-- {{::child.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(child.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+child.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>

                            </tbody>
                            <tbody ng-repeat="item in ctrl.AddLines.Group">
                              <tr>
                                <td class="text-left">{{item.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                              <tr ng-repeat="child in ctrl.permissionModel.listGroupRoles[item.GroupId]">
                                <td>-- {{::child.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(child.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+child.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </md-content>
                    </md-tab>
                    <div hide>
                      <md-content class="md-padding">
                        <div layout="row">
                          <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.GroupInCludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                            Bao gồm thông tin người dùng
                          </md-checkbox>
                        </div>
                        <div layout="row">
                          <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.Role" flex="30" aria-label="Role select">
                            <md-option value="">Chọn</md-option>
                            <md-option ng-repeat="item in ctrl.permissionModel.listUserPermissions track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.GroupId] && !item.Selected && item.GroupId != ctrl.administrator">
                              {{::item.GroupName}}
                            </md-option>
                          </md-select>
                          <md-button class="md-raised md-background" ng-click="ctrl.addLine('Role', ctrl.Role)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Role">
                            <span translate="">Thêm</span>
                          </md-button>
                        </div>
                        <div class="simple-table-container md-whiteframe-4dp">
                          <table class="simple" ms-responsive-table>
                            <thead>
                              <tr>
                                <th class="col-md-4 text-left">VAI TRÒ</th>
                                <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                  {{::item.Name}}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr ng-repeat="item in ctrl.permissionModel.listUserPermissions" ng-if="ctrl.permissionModel['Static'+item.GroupId]" ng-show="item.GroupId != ctrl.administrator">
                                <td class="text-left">{{::item.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                              <tr ng-repeat="item in ctrl.AddLines.Role">
                                <td class="text-left">{{item.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.GroupId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </md-content>
                    </div>
                    <md-tab label="Quyền theo người dùng">
                      <md-content class="md-padding">
                        <div layout="row">
                          <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.User" flex="30" aria-label="Role select">
                            <md-option value="">Chọn</md-option>
                            <md-option ng-repeat="item in ctrl.permissionModel.listUsers track by $index" ng-value="item" ng-if="!ctrl.permissionModel['Static'+item.UserId] && !item.Selected && item.LoginName !='superadmin'">
                              {{::item.Username}}
                            </md-option>
                          </md-select>
                          <md-button class="md-raised md-background" ng-click="ctrl.addLine('User', ctrl.User)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.User">
                            <span translate="">Thêm</span>
                          </md-button>
                        </div>
                        <div class="simple-table-container md-whiteframe-4dp">
                          <table class="simple" ms-responsive-table>
                            <thead>
                              <tr>
                                <th class="col-md-4 text-left">NGƯỜI DÙNG</th>
                                <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                  {{::item.Name}}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr ng-repeat="item in ctrl.permissionModel.listUsers" ng-if="ctrl.permissionModel['Static'+item.UserId]" ng-show="item.LoginName !='superadmin'">
                                <td class="text-left">{{::item.Username}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.UserId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.UserId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                              <tr ng-repeat="item in ctrl.AddLines.User">
                                <td class="text-left">{{::item.Username}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkStaticLinked(item.UserId, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Static'+item.UserId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </md-content>
                    </md-tab>
                  </md-tabs>
                </md-tab-body>
              </md-tab>
              <md-tab>
                <md-tab-label>
                  <span translate="">Theo dữ liệu</span>
                </md-tab-label>
                <md-tab-body>
                  <div layout="row">
                    <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.Field" flex="30" aria-label="Field select">
                      <md-option value="">Chọn</md-option>
                      <md-option ng-repeat="item in ctrl.CurrentDataGroup.Fields track by $index" ng-value="item" ng-if="item.Permit && !ctrl.permissionModel['Dynamic'+item.Name] && !item.Selected">
                        {{::item.Caption}}
                      </md-option>
                    </md-select>
                    <md-button class="md-raised md-background" ng-click="ctrl.addLine('Field', ctrl.Field)" aria-label="Lưu" translate="" translate-attr-aria-label="" ng-disabled="!ctrl.Field">
                      <span translate="">Thêm</span>
                    </md-button>
                  </div>
                  <div class="simple-table-container md-whiteframe-4dp">
                    <table class="simple" ms-responsive-table>
                      <thead>
                        <tr>
                          <th class="col-md-4 text-left">TRƯỜNG DỮ LIỆU</th>
                          <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                            {{::item.Name}}
                          </th>
                          <th class="col-md-4 text-left">BẢNG DỮ LIỆU</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr ng-repeat="item in ctrl.CurrentDataGroup.Fields" ng-if="(item.FormFieldType == 'General' || item.FormFieldType == 'Calculator') && ctrl.permissionModel['Dynamic'+item.Name]">
                          <td class="text-left">{{::item.Caption}}</td>
                          <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                            <input type="checkbox" ng-click='ctrl.permission.checkDynamicLinked(item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic'+item.Name + role.Code]" class="permission-check">
                          </td>
                          <td class="text-left">
                            <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic_Type'+ item.Name]" flex ng-change='ctrl.permission.checkDynamicSelect(item.Name)' aria-label="Permission select">
                              <md-option value="">Chọn</md-option>
                              <md-option value="User">Nhân sự</md-option>
                              <md-option value="Group">Phòng ban</md-option>
                            </md-select>
                          </td>
                        </tr>
                        <tr ng-repeat="item in ctrl.AddLines.Field">
                          <td class="text-left">{{::item.Caption}}</td>
                          <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                            <input type="checkbox" ng-click='ctrl.permission.checkDynamicLinked(item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic'+item.Name + role.Code]" class="permission-check">
                          </td>
                          <td class="text-left">
                            <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Dynamic_Type'+ item.Name]" flex ng-change='ctrl.permission.checkDynamicSelect(item.Name)' aria-label="Permission select">
                              <md-option value="">Chọn</md-option>
                              <md-option value="User">Nhân sự</md-option>
                              <md-option value="Group">Phòng ban</md-option>
                            </md-select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </md-tab-body>
              </md-tab>
              <div hide>
                <span translate="">Theo kịch bản</span>
                <div>
                  <md-input-container class="md-block" flex>
                    <label>Phân quyền cho cấp trên</label>
                    <md-select ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.LeadershipDynamicOrganization" flex="30">
                      <md-option value="">Chọn</md-option>
                      <md-option ng-repeat="item in ctrl.CurrentDataGroup.Fields track by $index" ng-value="item.Name" ng-if="item.Permit">
                        {{::item.Caption}}
                      </md-option>
                    </md-select>
                  </md-input-container>
                  <div md-dynamic-height md-border-bottom>
                    <div>
                      <span translate="">Phòng ban</span>
                      <div>
                        <div class="simple-table-container md-whiteframe-4dp">
                          <table class="simple" ms-responsive-table>
                            <thead>
                              <tr>
                                <th class="col-md-4 text-left">PHÒNG BAN</th>
                                <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                  {{::item.Name}}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr ng-repeat="item in ctrl.permissionModel.listRoleGroups">
                                <td class="text-left">{{::item.Caption}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkScriptLinked("1",item.Name, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Script'+item.Name + role.Code]" class="permission-check">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span translate="">Vai trò</span>
                      <div>
                        <div class="simple-table-container md-whiteframe-4dp">
                          <table class="simple" ms-responsive-table>
                            <thead>
                              <tr>
                                <th class="col-md-4 text-left">VAI TRÒ</th>
                                <th class="col-md-1 text-center" ng-repeat="item in ctrl.permissionModel.listRoles" ng-show="item.Name != 'LinkGroup'">
                                  {{::item.Name}}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr ng-repeat="item in ctrl.permissionModel.listUserPermissions">
                                <td class="text-left">{{::item.GroupName}}</td>
                                <td class="text-center" ng-repeat="role in ctrl.permissionModel.listRoles" ng-show="role.Name != 'LinkGroup'">
                                  <input type="checkbox" ng-click='ctrl.permission.checkScriptLinked(item.GroupId,item.GroupName, role.Code)' ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel['Script'+item.GroupId + role.Code]" class="permission-check">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br>
                </md-tab-body>
              </div>
            </md-tabs>
            <div hide>
              <div layout="row">
                <md-input-container class="md-block" flex="20">
                  Trường dữ liệu
                </md-input-container>
                <md-input-container class="md-block" flex="30">
                  <jqx-drop-down-list jqx-width="'100%'" jqx-height="'25'" jqx-settings="ctrl.permissionModel.listDropdownFields" jqx-instance="ctrl.dropdownDynamicPermissions"></jqx-drop-down-list>
                </md-input-container>
                <div flex="5" hide-xs hide-sm></div>
                <md-input-container class="md-block">
                  <label>Nhập mã trực tiếp</label>
                  <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.StaticPermissions">
                </md-input-container>
                <div flex="5" hide-xs hide-sm></div>
                <md-input-container class="md-block">
                  <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.StaticIncludedUser" aria-label="Bao gồm thông tin người dùng" flex>
                    Bao gồm thông tin người dùng
                  </md-checkbox>
                </md-input-container>
              </div>
              <div layout="row">
                <md-input-container class="md-block" flex-gt-sm>
                  <label>Mã Template lấy dữ liệu</label>
                  <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormRequest" />
                </md-input-container>
                <div flex="5" hide-xs hide-sm></div>
                <md-input-container class="md-block" flex-gt-sm>
                  <label>Đường dẫn gốc</label>
                  <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormDataRoot" />
                </md-input-container>
                <div flex="5" hide-xs hide-sm></div>
                <md-input-container class="md-block" flex-gt-sm>
                  <label>Mã</label>
                  <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.FormCode" />
                </md-input-container>
              </div>
              <div layout="row">
                <md-input-container class="md-block" flex-gt-sm>
                  <label>Mã riêng tư</label>
                  <input type="text" ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.Code" />
                </md-input-container>
              </div>
              <md-checkbox ng-model-options="{ debounce: 200 }" ng-model="ctrl.permissionModel.RemoveRole" aria-label="Xóa phân quyền">
                Xóa phân quyền
              </md-checkbox>
            </div>
          </div>
        </md-tabs>
      </div>

      <jqx-menu jqx-width="'180'" jqx-height="'60'" jqx-settings="ctrl.viewModel.contextOrderFields" jqx-instance="ctrl.actionOrderField" jqx-on-itemclick="ctrl.onOrderFieldClick($event)">
        <ul>
          <li>Chỉnh sửa</li>
          <li>Xóa</li>
        </ul>
      </jqx-menu>
    </form>
  </div>
</div>
-->
</div>
</template>
<script>
 import Vue from 'vue';
  import VueDragula from 'vue-dragula';
import utilsLibrary from "@/services/utils"
import PermissionSelector from '@/components/static/PermissionSelector'
 import SelectTree from '@/components/dynamic/SelectTree';
  import ElementDependent from '@/components/static/ElementDependent';
  import NotificationDialog from '@/components/static/NotificationDialog';
  import ExtendNotify from '@/components/static/ExtendNotify';
  import FieldInfoDialog from '@/components/static/advance/FieldInfoDialog';
  import SortableTree from 'vue-sortable-tree';
  Vue.use(VueDragula);
export default {
    components:{VueDragula, SortableTree},
  props: ['id', 'FormCode', 'closeCallback'],
  data() {
    return {
      isShowForm: true,
      isSystemAdmin: false,
      isMantisAdmin: false,

      model: {
            Description: {
              Groups: [],
              Buttons: [],
              SubElements: [],
              Notifications: [],
              Permissions: [],
              Dependencies: [],
              Link: {},
              DisplayType: "OneColumn",
              HasHistoryTab: true
            },
            ObjectFields: []
          },
      viewModel : {
        DataGroup: {
          source: [],
          allowDrag: false,
          allowDrop: false,
          select: (event)=> {
            var selectedItem = this.treeDataGroup.getItem(event.args.element);
            onSelectDataGroup(selectedItem);
          }
        },
        OrderFields: {
          source: [],
          allowDrag: true,
          allowDrop: true,
          dragEnd: function(dragItem, dropItem, args, dropPosition, tree) {

          },
          mousedown: function(event) {

          }
        },
        Buttons: {
          source: [],
          checkboxes: true,
          allowDrag: true,
          allowDrop: true,
          displayMember: "Code",
          valueMember: "Code"
        },
        contextOrderFields: { autoOpenPopup: false, mode: "popup" },
        CurrentDataGroup: { Fields: [], Buttons: [] }
      },
      listSelectedButtons: [],
      CurrentDataGroup: { Fields: [], Buttons: [] },
      DataGroupTree:[],
      selectedDataGroups:[],
      permissionModel : {
        listDropdownRoles: {
          source: [],
          checkboxes: true,
          displayMember: "Name",
          valueMember: "Code"
        },
        listDropdownFields: {
          source: [],
          checkboxes: true,
          displayMember: "Caption",
          valueMember: "Name"
        },
        listStaticPermissions: [],
        listScriptPermissions: [],
        listDynamicPermissions: [],
        listUserPermissions: [],
        listUserGroups: [],
        listRoles: [],
        listUsers: [],
        listGroupRoles: {}
      },
      communication : { action: "", item: {}, index: "", scope: this },
      AddLines : {
        Group: [],
        Role: [],
        User: [],
        Field: []
      },

      administrator : this.$Lodash.cloneDeep(this.$administrator),
      permission: {
        bindComboModel: ()=> {
          var ctrl = this;
          var request = {
            RequestAction: "SearchGroup",
            RequestClass: "BPM",
            RequestDataType: "jsontree",
            ConditionFields: "GroupType",
            GroupType: "0",
            StaticFields: "GroupId;GroupName;Description;GroupParent"
          };
          utilsLibrary.post(request).then((data)=> {
            ctrl.permissionModel.listUserPermissions = data;
          });

          request = {
            RequestAction: "SearchGroup",
            RequestClass: "BPM",
            RequestDataType: "json",
            ConditionFields: "GroupType",
            GroupType: "1",
            StaticFields: "GroupId;GroupName;Description;GroupParent;Status",
            StructFields: "ParentName",
            OrderFields: "GroupName ASC"
          };
          utilsLibrary.post(request).then((data)=> {
            ctrl.permissionModel.listUserGroups = utilsLibrary.getDataWithRoot(
              data,
              "UserDS.Group"
            );
          });

          request = {
            RequestAction: "SearchGroup",
            RequestClass: "BPM",
            RequestDataType: "json",
            ConditionFields: "GroupType",
            GroupType: "2",
            StaticFields: "GroupId;GroupName;Description;GroupParent;Status",
            StructFields: "ParentName",
            OrderFields: "GroupName ASC"
          };
          utilsLibrary.post(request).then((data)=> {
            data = utilsLibrary.getDataWithRoot(data, "UserDS.Group");
            $.each(data, (key, value)=> {
              if (!ctrl.permissionModel.listGroupRoles[value.GroupParent])
                ctrl.permissionModel.listGroupRoles[value.GroupParent] = [];
              ctrl.permissionModel.listGroupRoles[value.GroupParent].push(
                value
              );
            });
            // ctrl.permissionModel.listGroupRoles = data;
          });

          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "Setting.SearchSetting";
          request.R1_ParentCode = "xSetting.Default.Permissions.RoleTemplate";
          utilsLibrary.post(request).then((data)=> {
            ctrl.permissionModel.listRoleGroups = utilsLibrary.getDataWithRoot(
              data.R1,
              "Data.DynamicDS.Setting"
            );
          });

          request = {
            RequestAction: "SearchUserWithGroups",
            IncludedGroupManager: "true",
            RequestClass: "BPM",
            RequestDataType: "json",
            ConditionFields: "IncludedGroupManager;Group;Status",
            Status: "1",
            GroupType: "1",
            StaticFields: "UserId;Username;LoginName",
            OrderFields: "LoginName ASC"
          };
          utilsLibrary.post(request).then((data)=> {
            ctrl.permissionModel.listUsers = utilsLibrary.getDataWithRoot(
              data,
              "Data.UserDS.User"
            );
          });

          request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "Setting.SearchBase";
          request.R1_ParentCode = "xSetting.Template.Permissions";
          utilsLibrary.post(request).then((data)=> {
            ctrl.permissionModel.listRoles = utilsLibrary.getDataWithRoot(
              data.R1,
              "Data.DynamicDS.Setting"
            );
            ctrl.permission.bindDropdownRoles(ctrl.action);
          });
        },

        checkStaticLinked: (id, code)=> {
          var ctrl = this;
          var exist = false;
          var itemIndex = -1;
          var checkedItem = {};
          $.each(ctrl.permissionModel.listStaticPermissions, (
            index,
            item

          )=> {
            if (item.Value == id) {
              itemIndex = index;
              exist = true;
              checkedItem = item;
            }
          });
          if (!exist)
            ctrl.permissionModel.listStaticPermissions.push({
              Value: id,
              KeyCode: code + ";"
            });
          else {
            if (!ctrl.permissionModel["Static" + id + code])
              checkedItem.KeyCode += code + ";";
            else {
              checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ";", "");
              if (checkedItem.KeyCode == "")
                ctrl.permissionModel.listStaticPermissions.splice(itemIndex, 1);
            }
          }
        },

        checkDynamicLinked: (name, code)=> {
          var ctrl = this;
          var exist = false;
          var itemIndex = -1;
          var checkedItem = {};
          $.each(ctrl.permissionModel.listDynamicPermissions, (
            index,
            item
          )=> {
            if (item.Value == name) {
              itemIndex = index;
              exist = true;
              checkedItem = item;
            }
          });
          if (!exist)
            ctrl.permissionModel.listDynamicPermissions.push({
              Value: name,
              KeyCode: code + ";"
            });
          else {
            if (!ctrl.permissionModel["Dynamic" + name + code])
              checkedItem.KeyCode += code + ";";
            else {
              checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ";", "");
              if (checkedItem.KeyCode == "")
                ctrl.permissionModel.listDynamicPermissions.splice(
                  itemIndex,
                  1
                );
            }
          }
        },

        checkDynamicSelect: (name)=> {
          var ctrl = this;
          var exist = false;
          var itemIndex = -1;
          var checkedItem = {};
          $.each(ctrl.permissionModel.listDynamicPermissions, (
            index,
            item
          )=> {
            if (item.Value == name) {
              itemIndex = index;
              exist = true;
              checkedItem = item;
            }
          });
          if (!exist)
            ctrl.permissionModel.listDynamicPermissions.push({
              Value: name,
              KeyCode: code + ";"
            });
          else {
            checkedItem.KeyType = ctrl.permissionModel["Dynamic_Type" + name];
          }
        },

        checkScriptLinked: (id, name, code)=> {
          var ctrl = this;
          var exist = false;
          var itemIndex = -1;
          var checkedItem = {};
          $.each(ctrl.permissionModel.listScriptPermissions, (
            index,
            item
          )=> {
            if (item.Value == id && item.Name == name) {
              itemIndex = index;
              exist = true;
              checkedItem = item;
            }
          });
          if (!exist) {
            ctrl.permissionModel.listScriptPermissions.push({
              Name: name,
              Value: id,
              KeyCode: code + ";"
            });
          } else {
            if (
              (id != "1" && !ctrl.permissionModel["Script" + id + code]) ||
              (id == "1" && !ctrl.permissionModel["Script" + name + code])
            )
              checkedItem.KeyCode += code + ";";
            else {
              checkedItem.KeyCode = checkedItem.KeyCode.replace(code + ";", "");
              if (checkedItem.KeyCode == "")
                ctrl.permissionModel.listScriptPermissions.splice(itemIndex, 1);
            }
          }
        },

        bindListPermissions: ()=> {
          var ctrl = this;
          ctrl.model.Description.Permissions = [];
          if (ctrl.permissionModel.listStaticPermissions.length > 0) {
            var node = { Name: "Static" };
            node.Permissions =
              "&Count=" + ctrl.permissionModel.listStaticPermissions.length;
            $.each(
              ctrl.permissionModel.listStaticPermissions,
              (index, item)=> {
                node.Permissions += "&Value" + (index + 1) + "=" + item.Value;
                node.Permissions +=
                  "&KeyCode" + (index + 1) + "=" + item.KeyCode;
              }
            );

            node.CurrentUser = "";
            var listCheckedRoles = ctrl.dropdownRoles.getCheckedItems();
            $.each(listCheckedRoles, (key, item)=> {
              node.CurrentUser += item.value + ";";
            });
            if (ctrl.permissionModel.AlwaysUpdatePermission)
              node.AlwaysUpdatePermission = true;
            if (ctrl.permissionModel.RolesIncludedUser)
              node.RolesIncludedUser = true;
            if (ctrl.permissionModel.GroupInCludedUser)
              node.GroupInCludedUser = true;
            ctrl.model.Description.Permissions.push(node);
          }

          if (ctrl.permissionModel.listDynamicPermissions.length > 0) {
            var node = { Name: "Dynamic" };
            node.Permissions =
              "&Count=" + ctrl.permissionModel.listDynamicPermissions.length;
            $.each(
              ctrl.permissionModel.listDynamicPermissions,
              (index, item)=> {
                node.Permissions += "&Value" + (index + 1) + "=" + item.Value;
                node.Permissions +=
                  "&KeyCode" + (index + 1) + "=" + item.KeyCode;
                if (item.KeyType)
                  node.Permissions +=
                    "&KeyType" + (index + 1) + "=" + item.KeyType;
              }
            );
            ctrl.model.Description.Permissions.push(node);
          }
          if (ctrl.permissionModel.listScriptPermissions.length > 0) {
            var node = { Name: "Script" };
            node.LeadershipDynamicOrganization =
              ctrl.permissionModel.LeadershipDynamicOrganization;
            node.Permissions =
              "&Count=" + ctrl.permissionModel.listScriptPermissions.length;
            $.each(
              ctrl.permissionModel.listScriptPermissions,
              (index, item)=> {
                node.Permissions += "&Name" + (index + 1) + "=" + item.Name;
                node.Permissions += "&Value" + (index + 1) + "=" + item.Value;
                node.Permissions +=
                  "&KeyCode" + (index + 1) + "=" + item.KeyCode;
              }
            );
            ctrl.model.Description.Permissions.push(node);
          }

          var listDynamicPermissions = ctrl.dropdownDynamicPermissions.getCheckedItems();
          if (listDynamicPermissions.length > 0) {
            var node = { Name: "Replica" };
            node.DynamicPermissions = "";
            $.each(listDynamicPermissions, (key, item)=> {
              node.DynamicPermissions += item.value + ";";
            });
            node.StaticPermissions = ctrl.permissionModel.StaticPermissions;
            if (ctrl.permissionModel.StaticIncludedUser)
              node.StaticIncludedUser = true;
            node.FormRequest = ctrl.permissionModel.FormRequest;
            node.FormDataRoot = ctrl.permissionModel.FormDataRoot;
            node.FormCode = ctrl.permissionModel.FormCode;
            node.Code = ctrl.permissionModel.Code;
            ctrl.model.Description.Permissions.push(node);
          }

          if (ctrl.permissionModel.RemoveRole) {
            var node = { Name: "Remove", Value: true };
            ctrl.model.Description.Permissions.push(node);
          }
        },

        bindDropdownRoles: (action)=> {
          var ctrl = this;
          /*
          ctrl.permissionModel.listDropdownRoles.source = new $.jqx
            .dataAdapter({
            localdata: ctrl.permissionModel.listRoles,
            datatype: "array"
          });
          */
          if (action == "edit") {
            /*
            setTimeout(()=> {
              var arrKey =
                ctrl.permissionModel.CurrentUserRole != undefined
                  ? ctrl.model.CurrentUserRole.split(";")
                  : [];
              var items = ctrl.dropdownRoles.getItems();
              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                for (var j = 0; j < arrKey.length; j++) {
                  if (item.value == arrKey[j])
                    ctrl.dropdownRoles.checkItem(item);
                }
              }
            });
            */

          }
        },

        bindDropdownFields: (action)=> {
          var ctrl = this;
          var arrFields = [];
          $.each(ctrl.CurrentDataGroup.Fields, (key, item)=> {
            if (
              item.FormFieldType == "General" ||
              item.FormFieldType == "Calculator"
            )
              arrFields.push(item);
          });

          ctrl.permissionModel.listDropdownFields.source = [];
          /*
          = new $.jqx
            .dataAdapter({
            localdata: arrFields,
            datatype: "array"
          });
          */

        },

        bindPermissionEditor: ()=> {
          var ctrl = this;
          $.each(ctrl.model.Description.Permissions, (key, item)=> {
            if (item.Permissions != "") {
              var objPermissions = utilsLibrary.stringToObject(
                item.Permissions
              );
              for (var i = 1; i <= parseInt(objPermissions.Count); i++) {
                var element = {
                  Value: objPermissions["Value" + i],
                  KeyCode: objPermissions["KeyCode" + i],
                  KeyType: utilsLibrary.isEmpty(objPermissions["KeyType" + i])
                    ? objPermissions["KeyType" + i]
                    : ""
                };
                if (objPermissions["Name" + i] != null)
                  element.Name = objPermissions["Name" + i];
                if (item.Name == "Static")
                  ctrl.permissionModel.listStaticPermissions.push(element);
                else if (item.Name == "Dynamic") {
                  if (
                    element.KeyType != "" &&
                    element.KeyType != undefined &&
                    element.KeyType != "undefined"
                  )
                    ctrl.permissionModel["Dynamic_Type" + element.Value] =
                      element.KeyType;
                  ctrl.permissionModel.listDynamicPermissions.push(element);
                } else if (item.Name == "Script")
                  ctrl.permissionModel.listScriptPermissions.push(element);

                var arrKeyCode = objPermissions["KeyCode" + i].split(";");
                for (var j = 0; j < arrKeyCode.length; j++) {
                  if (
                    item.Name == "Script" &&
                    objPermissions["Value" + i] == "1"
                  )
                    ctrl.permissionModel[
                      item.Name + objPermissions["Name" + i] + arrKeyCode[j]
                    ] = true;
                  else
                    ctrl.permissionModel[
                      item.Name + objPermissions["Value" + i] + arrKeyCode[j]
                    ] = true;
                }
              }
            }
            if (item.Name == "Static") {

              if (item.CurrentUser != "" && item.CurrentUser != undefined) {
                setTimeout(()=> {
                  var listRoles = ctrl.dropdownRoles.getItems();
                  $.each(listRoles, (key, role)=> {
                    if (item.CurrentUser.indexOf(role.value + ";") != -1) {
                      ctrl.dropdownRoles.checkItem(role);
                    }
                  });
                });
              }
              ctrl.permissionModel.AlwaysUpdatePermission =
                item.AlwaysUpdatePermission;
              ctrl.permissionModel.RolesIncludedUser = item.RolesIncludedUser;
              ctrl.permissionModel.GroupInCludedUser = item.GroupInCludedUser;
            } else if (item.Name == "Script") {
              setTimeout(()=> {
                if (
                  item.LeadershipDynamicOrganization != "" &&
                  item.LeadershipDynamicOrganization != undefined
                )
                  ctrl.permissionModel.LeadershipDynamicOrganization =
                    item.LeadershipDynamicOrganization;
              });
            } else if (item.Name == "Replica") {
              if (
                item.StaticPermissions != "" &&
                item.StaticPermissions != undefined
              )
                ctrl.permissionModel.StaticPermissions = item.StaticPermissions;
              ctrl.permissionModel.StaticIncludedUser = item.StaticIncludedUser;
              if (item.FormRequest != "" && item.FormRequest != undefined)
                ctrl.permissionModel.FormRequest = item.FormRequest;
              if (item.FormDataRoot != "" && item.FormDataRoot != undefined)
                ctrl.permissionModel.FormDataRoot = item.FormDataRoot;
              if (item.FormCode != "" && item.FormCode != undefined)
                ctrl.permissionModel.FormCode = item.FormCode;
              if (item.Code != "" && item.Code != undefined)
                ctrl.permissionModel.Code = item.Code;
              if (
                item.DynamicPermissions != "" &&
                item.DynamicPermissions != undefined
              ) {
                setTimeout(()=> {
                  var listDynamicPermissions = ctrl.dropdownDynamicPermissions.getItems();
                  $.each(listDynamicPermissions, (key, dynamic)=> {
                    if (
                      item.DynamicPermissions.indexOf(dynamic.value + ";") != -1
                    )
                      ctrl.dropdownDynamicPermissions.checkItem(dynamic);
                  });
                });
              }
            } else if (item.Name == "Remove") {
              if (item.Value == true) ctrl.permissionModel.RemoveRole = true;
            }
          });
        }
      }
    };
  },
  methods: {
    handleChange(itemIds){
      //return;
        this.selectedDataGroups = itemIds;
        this.viewModel.ListDataGroups.forEach(datagroup => {
          var ret = true;
          if(datagroup.Id === itemIds[itemIds.length - 1]){
            var request = this.$Lodash.cloneDeep(this.$singleRequest);
            request.R1_RequestTemplate = 'SettingNew.SearchSetting';
            request.R1_Code = datagroup.Code;
            this.$Utils.post(request).then(response => {
              response = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");
              response = response[0];
              response.Description = JSON.parse(response.Description);
              response.Fields = '';
              for (var i = 1; i <= response.Description.FCount; i++) {
                if (response['F' + i] != undefined)
                  response.Fields += response['F' + i];
              }
              response.Fields = JSON.parse(response.Fields);
              //this.viewModel['Field']='';
              this.$set(this.viewModel,'Field', '');
              this.CurrentDataGroup = {
                Fields: response.Fields,
                Buttons: []
              }
              // this.passedItem.CurrentDataGroup = this.CurrentDataGroup;
              response.Description.Buttons.forEach((item) =>  {
                if (item.ParentObject == 'Form')
                  this.CurrentDataGroup.Buttons.push(item);
              })
            })
            ret = false;
          }
          return ret;
        })
      },
    openPermissionSelector(){
        this.$hub.$emit(
          "set-modal-data",
          'Cấp quyền',
          "60%",
          true,
          "center",
          PermissionSelector,
          false,
          '',
          this.id
        );
      },
      back() {
        this.isShowForm = false;
        if (this.closeCallback) this.closeCallback();
      },

    bindEditor() {
      var ctrl = this;
      //var $scope = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      if (utilsLibrary.isEmpty(ctrl.FormCode) && ctrl.FormCode != '')
        request.R1_Code = ctrl.FormCode;
      else request.R1_Id = ctrl.id;
      utilsLibrary.post(request).then((data)=> {
        data = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
         //console.log(data)
        if (data.length > 0) {
          ctrl.action = "edit";
          var currentForm = data[0];

          try{
          currentForm.Description = JSON.parse(currentForm.Description);
          } catch (ex){

          }
          currentForm.ObjectFields = "";
          for (var i = 1; i <= currentForm.Description.OFCount; i++) {
            if (currentForm["OF" + i] != undefined) {
              currentForm.ObjectFields += currentForm["OF" + i];
              delete currentForm["F" + i];
              delete currentForm["OF" + i];
            }
          }
          currentForm.ObjectFields = JSON.parse(currentForm.ObjectFields);
          $.each(currentForm.Description, (key, value)=> {
            if (value == "true") currentForm.Description[key] = true;
            else if (value == "false") currentForm.Description[key] = false;
          });
          // console.log('ctrl.model===>', currentForm)
          ctrl.model = currentForm;
        } else ctrl.action = "";

        this.bindDataGroupSource();
        this.bindComboModel("DisplayType");
        ctrl.permission.bindComboModel();
         this.bindListButtons();
        if (ctrl.action == "") {
          /*
          ctrl.model = {
            Description: {
              Groups: [],
              Buttons: [],
              SubElements: [],
              Notifications: [],
              Permissions: [],
              Dependencies: [],
              Link: {},
              DisplayType: "OneColumn",
              HasHistoryTab: true
            },
            ObjectFields: []
          };
          */
          this.bindParentSetting();
        }
      });
    },

    bindParentSetting() {
      var ctrl = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_Code = "xSetting.Project.Form";
      utilsLibrary.post(request).then((data)=> {
        data = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
        ctrl.parentSetting = data[0];
      });
    },

    bindComboModel(code) {
      var ctrl = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_ParentCode = "xSetting.Default.Project.Form." + code;
      utilsLibrary.post(request).then((data)=> {
       // console.log('data---->',data)
        data = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
        this.$set(ctrl.viewModel, code, data);
        // console.log('ctrl.viewModel',ctrl.viewModel)
        //ctrl.viewModel[code] = data;
      });
    },

    bindDataGroupSource() {
      var ctrl = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_ParentCode = "xSetting.Project.DataGroup";
      utilsLibrary.post(request).then((data)=> {
        ctrl.viewModel.ListDataGroups = utilsLibrary.getDataWithRoot(
          data.R1,
          "Data.DynamicDS.Setting"
        );
        this.DataGroupTree = this.$Utils.createCustomTreeFromList(
            this.$Lodash.cloneDeep(ctrl.viewModel.ListDataGroups),
            "Id",
            "ParentId",
            "children",
            { "Caption" : "label", Id : "value" },
            {}
          );
          ctrl.viewModel.ListDataGroups.forEach(item => {
            var ret = true;
            // console.log('item.Code=>', item.Code);
            // console.log('this.viewModel.DataGroup=>', ctrl.model.DataGroup);
            if(item.Code === this.model.DataGroup){
              var tmp = [item.ParentId, item.Id];
              this.$set(this, 'selectedDataGroups', tmp);
              //console.log('this.selectedDataGroups=>', this.selectedDataGroups);
              this.handleChange(this.selectedDataGroups);
              ret = false;
            }
            return ret;
          })

        var source = {
          datatype: "json",
          datafields: [
            { name: "Id", type: "string" },
            { name: "ParentId", type: "string" },
            { name: "Caption", type: "string" },
            { name: "Code", type: "string" }
          ],
          localdata: ctrl.viewModel.ListDataGroups
        };
        var records = [];//utilsLibrary.createCu
        /*
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy(
          "Id",
          "ParentId",
          "items",
          [{ name: "Caption", map: "label" }, { name: "Code", map: "value" }]
        );*/
        ctrl.viewModel.DataGroup.source = records;
        /*
        setTimeout(()=> {
          //ctrl.treeDataGroup.expandAll();
          $.each(ctrl.treeDataGroup.getItems(), (key, item)=> {
            if (item.value == ctrl.model.Name)
              ctrl.treeDataGroup.selectItem(item);
          });
        });
        */

      });

    },

    onSelectDataGroup(selectedItem) {
      ctrl.dropDownDataGroup.setContent(
        '<div class="dropDown">' + selectedItem.label + "</div>"
      );
      ctrl.dropDownDataGroup.close();
      ctrl.viewModel.OrderFields.source = [];
      ctrl.treeOrderFields.clear();

      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "SettingNew.SearchSetting";
      request.R1_Code = selectedItem.value;
      utilsLibrary.postCheckResult(request).then((data)=> {
        data = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
        data = data[0];
        data.Description = JSON.parse(data.Description);
        data.Fields = "";
        for (var i = 1; i <= data.Description.FCount; i++) {
          if (data["F" + i] != undefined) data.Fields += data["F" + i];
        }
        data.Fields = JSON.parse(data.Fields);
        /*
        ctrl.CurrentDataGroup = {
          Fields: data.Fields,
          Buttons: []
        };*/
        $.each(data.Description.Buttons, (key, item)=> {
          if (item.ParentObject == "Form")
            ctrl.CurrentDataGroup.Buttons.push(item);
        });
        if (ctrl.action == "edit") {
          $.each(ctrl.model.Description.Groups, (key, group)=> {
            ctrl.treeOrderFields.addTo({
              label: group.Caption,
              value: group.Caption
            });
            var itemGroup = {};
            var treeItems = ctrl.treeOrderFields.getItems();
            $.each(treeItems, (key, item)=> {
              if (item.label == group.Caption) itemGroup = item;
            });

            var arrOrderFields =
              group.ListFields != undefined ? group.ListFields.split(";") : [];
            $.each(arrOrderFields, (key, orderField)=> {
              $.each(ctrl.model.ObjectFields, (key, field)=> {
                if (field.Name == orderField) {
                  ctrl.treeOrderFields.addTo(
                    {
                      label: field.Caption,
                      value: field.Name
                    },
                    itemGroup.element
                  );
                }
              });
            });
          });
          /*
          $timeout(function() {
            ctrl.treeOrderFields.expandAll();
          });
          */
          ctrl.permission.bindPermissionEditor();
        }
        this.bindListButtons();
        ctrl.permission.bindDropdownFields();
      });
    },

    bindListButtons() {
      this.listSelectedButtons = this.model.Description.ListButtons.split(';');
      //console.log('this.listSelectedButtons -->', this.listSelectedButtons)
      return;
      $.each(ctrl.model.Description.Buttons, (
        orderIndex,
        orderButton
      )=> {
        $.each(ctrl.CurrentDataGroup.Buttons, (index, button)=> {
          //console.log('listboxButtons =>',listboxButtons)
          if (button.Code == orderButton.Code)
            ctrl.CurrentDataGroup.Buttons.move(index, orderIndex);
        });
      });

      var source = {
        datatype: "json",
        localdata: ctrl.CurrentDataGroup.Buttons
      };
      /*
      ctrl.viewModel.Buttons.source = new $.jqx.dataAdapter(source);
      $timeout(function() {
        angular.forEach(ctrl.listboxButtons.getItems(), function(listboxItem) {
          angular.forEach(ctrl.model.Description.Buttons, function(item) {
            if (listboxItem.value == item.Code)
              ctrl.listboxButtons.checkItem(listboxItem);
          });
        });
      });
      */
    },

    excuteSubElement(type, ev, action, item, index) {
      ctrl.communication.action = action;
      if (action == "edit") {
        ctrl.communication.item = item;
        ctrl.communication.index = index;
      }
      ctrl.communication.type = "Form";
      var templateUrl =
        "app/main/configuration/forms/dialogs/" +
        type +
        "/" +
        type +
        "-dialog.html";
      type =
        type == "group"
          ? "GroupForm"
          : type == "field"
            ? "FieldForm"
            : type == "sub-element"
              ? "SubElement"
              : type == "sub-notification" ? "SubNotification" : type;
      $mdDialog.show({
        controller: type.capitalizeFirstLetter() + "DialogController as ctrl",
        templateUrl: templateUrl,
        targetEvent: ev,
        disableParentScroll: false,
        locals: { dataToPass: ctrl.communication }
      });
    },

    deleteSubElement(arrSubForms, index) {
      arrSubForms.splice(index, 1);
    },

    bindSubElement(arrSubForms, communication) {
      if (communication.action == "edit")
        arrSubForms[communication.index] = communication.item;
      else arrSubForms.push(communication.item);
    },

    insertField() {
      if (ctrl.viewModel.Field != "" && ctrl.viewModel.Field != null) {
        var selectedField = "";
        angular.forEach(ctrl.CurrentDataGroup.Fields, function(field) {
          if (field.Name == ctrl.viewModel.Field)
            selectedField = {
              Caption: field.Caption,
              Name: field.Name,
              DisplayType: "LeftLabel"
            };
        });

        var exist = false;
        angular.forEach(ctrl.model.ObjectFields, function(field) {
          if (field.Name == selectedField.Name) exist = true;
        });

        if (!exist) {
          var selectedGroup = "";
          var treeOrderFieldItems = ctrl.treeOrderFields.getItems();
          angular.forEach(treeOrderFieldItems, function(item) {
            if (item.level == 0 && item.label == ctrl.viewModel.Group)
              selectedGroup = item;
          });
          ctrl.treeOrderFields.addTo(
            {
              label: selectedField.Caption,
              value: selectedField.Name
            },
            selectedGroup.element
          );
          ctrl.treeOrderFields.expandItem(selectedGroup.element);
          ctrl.model.ObjectFields.push(selectedField);
        } else
          utilsLibrary.showMessage("error", "Trường dữ liệu đã được thêm vào");
        ctrl.viewModel.Field = "";
      } else utilsLibrary.showMessage("error", "Hãy chọn 1 trường dữ liệu");
    },

    bindField(communication) {
      ctrl.model.ObjectFields[communication.index] = communication.item;
      ctrl.treeOrderFields.updateItem(
        ctrl.treeOrderFields.getSelectedItem().element,
        {
          label: communication.item.Caption,
          value: communication.item.Name
        }
      );
    },

    bindGroup(communication) {
      var isExist = false;
      if (communication.action == "edit") {
        angular.forEach(ctrl.model.Description.Groups, function(item, index) {
          if (
            item.Caption == communication.item.Caption &&
            communication.index != index
          )
            isExist = true;
        });
        if (!isExist) {
          ctrl.model.Description.Groups[communication.index] =
            communication.item;
          ctrl.treeOrderFields.updateItem(
            ctrl.treeOrderFields.getSelectedItem().element,
            {
              label: communication.item.Caption,
              value: "Group"
            }
          );
        } else {
          utilsLibrary.showMessage("error", "Nhóm đã tồn tại");
        }
      } else {
        angular.forEach(ctrl.treeOrderFields.getItems(), function(item) {
          if (item.label == communication.item.Caption) isExist = true;
        });
        if (!isExist) {
          ctrl.model.Description.Groups.push(communication.item);
          ctrl.treeOrderFields.addTo({
            label: communication.item.Caption,
            value: communication.item.Name
          });
        } else utilsLibrary.showMessage("error", "Nhóm đã tồn tại");
      }
    },

    save(ev) {
      ctrl.permission.bindListPermissions();
      var savedData = bindSavedData();
      var action = "edit";
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request = utilsLibrary.updateParams.singleRequest(request, savedData);
      if (ctrl.model.Id)
        request = utilsLibrary.updateParams.singleRequest(request, {
          RequestTemplate: "SettingNew.Update"
        });
      else {
        action = "insert";
        request = utilsLibrary.updateParams.singleRequest(request, {
          Code:
            "Form." +
            utilsLibrary.removeVNCharacters(savedData.Caption) +
            "." +
            Math.random()
              .toString(18)
              .replace(/[^a-zA-Z0-9]+/g, "")
              .substr(0, 5),
          RequestTemplate: "SettingNew.Insert",
          ReferenceId: ctrl.parentSetting.Id,
          NestedSetType: "InsertLastChildNode"
        });
      }
      utilsLibrary.postCheckResult(request).then(function(data) {
        if (data.success) {
          ctrl.model.Id = data.R1.Data;
          if (action == "insert")
            utilsLibrary.linkToRoleEveryone([
              {
                Id: ctrl.model.Id,
                Caption: ctrl.model.Caption,
                Name: ctrl.model.Name
              }
            ]);
          utilsLibrary.showMessage(
            "success",
            toastMessage.updateItemPre + toastMessage.updateItemSuf
          );
          if (action == "insert")
            $state.go("app.configuration.forms.detail", { id: ctrl.model.Id });
        }
      });
    },

    bindSavedData() {
      var savedData = this.$Lodash.cloneDeep(ctrl.model);
      utilsLibrary.deleteAutoValue(savedData);
      angular.forEach(ctrl.viewModel.ListDataGroups, function(dataGroup) {
        if (dataGroup.Code == ctrl.treeDataGroup.getSelectedItem().value) {
          var refDataGroup = this.$Lodash.cloneDeep(dataGroup);
          refDataGroup.Description = JSON.parse(refDataGroup.Description);
          savedData.Name = refDataGroup.Code;
          savedData.DataGroup = refDataGroup.Code;
          savedData.Caption = savedData.Description.Caption;
          savedData.Description.DataGroupCaption = refDataGroup.Caption;
          savedData.Description.Link = refDataGroup.Description.Link;
          savedData.Description.RootData = refDataGroup.Description.RootData;
          savedData.Description.DataSource =
            refDataGroup.Description.DataSource;
          savedData.Description.AdditionConditions =
            refDataGroup.Description.AdditionConditions;
          savedData.Description.Dependencies =
            refDataGroup.Description.Dependencies;
        }
      });

      savedData.Fields = this.$Lodash.cloneDeep(savedData.ObjectFields);
      var refFields = this.$Lodash.cloneDeep(ctrl.CurrentDataGroup.Fields);
      angular.forEach(savedData.Fields, function(field) {
        angular.forEach(refFields, function(dgField) {
          if (dgField.Name == field.Name) {
            angular.forEach(dgField, function(value, key) {
              if (!utilsLibrary.isEmpty(field[key])) field[key] = value;
            });
            utilsLibrary.deleteAutoValue(field);
          }
        });
      });

      angular.forEach(refFields, function(field) {
        utilsLibrary.deleteAutoValue(field);
        if (field.FormFieldType == "Hidden") savedData.Fields.push(field);
        if (field.DynamicText != undefined && field.DynamicText != null)
          savedData.Fields.push({
            Name: field.DynamicText,
            FieldStorageType: "Dynamic"
          });
      });

      savedData.ObjectFields = JSON.stringify(savedData.ObjectFields);
      var iStartIndex = 0;
      var iFieldCount = 0;
      for (var i = 1; i < 7; i++) {
        if (savedData.ObjectFields.length > iStartIndex) {
          savedData["OF" + i] = savedData.ObjectFields.substring(
            iStartIndex,
            iStartIndex + 9999
          );
          iStartIndex = 10000 * i - i;
          iFieldCount = i;
        }
      }
      savedData.Description.OFCount = iFieldCount;
      delete savedData.ObjectFields;

      iStartIndex = 0;
      iFieldCount = 0;
      savedData.Fields = JSON.stringify(savedData.Fields);
      for (var i = 1; i < 7; i++) {
        if (savedData.Fields.length > iStartIndex) {
          savedData["F" + i] = savedData.Fields.substring(
            iStartIndex,
            iStartIndex + 9999
          );
          iStartIndex = 10000 * i - i;
          iFieldCount = i;
        }
      }
      savedData.Description.FCount = iFieldCount;
      delete savedData.Fields;

      savedData.Description.Buttons = [];
      var refButtons = this.$Lodash.cloneDeep(ctrl.CurrentDataGroup.Buttons);
      angular.forEach(ctrl.listboxButtons.getItems(), function(orderButton) {
        if (orderButton.checked) {
          angular.forEach(refButtons, function(button) {
            if (button.Code == orderButton.value) {
              savedData.Description.Buttons.push(button);
            }
          });
        }
      });

      var orderFieldsItems = ctrl.treeOrderFields.getItems();
      var refGroups = this.$Lodash.cloneDeep(savedData.Description.Groups);
      savedData.Description.Groups = [];
      angular.forEach(orderFieldsItems, function(groupItem) {
        if (groupItem.level == 0) {
          angular.forEach(refGroups, function(group) {
            if (groupItem.label == group.Caption) {
              group.ListFields = "";
              angular.forEach(orderFieldsItems, function(item) {
                if (item.parentId == groupItem.id)
                  group.ListFields += item.value + ";";
              });
              savedData.Description.Groups.push(group);
            }
          });
        }
      });

      angular.forEach(savedData.Description, function(value, key) {
        if ((value == true) & !isNumeric(savedData.Description[key]))
          savedData.Description[key] = "true";
        if (value == false && value != "") savedData.Description[key] = "false";
      });
      savedData.Description.ModuleType = "Form";
      savedData.Description = JSON.stringify(savedData.Description);
      return savedData;
    },

    cancel() {
      $mdDialog.hide();
    },

    showPermission(ev) {
      utilsLibrary.showPermission(ev, ctrl.model);
    },

    onOrderFieldClick(event) {
      var selectedItem = ctrl.treeOrderFields.getSelectedItem();
      var orderFieldIndex = -1;
      var orderFieldItem = {};
      if (event.args.innerText == "Xóa") {
        if (selectedItem != null) {
          var children = $(selectedItem.element).find("li");
          angular.forEach(children, function(item) {
            ctrl.treeOrderFields.removeItem(item);
            var itemName = ctrl.treeOrderFields.getItem(item).value;
            angular.forEach(ctrl.model.ObjectFields, function(field) {
              if (field.Name == itemName)
                ctrl.model.ObjectFields.splice(index, 1);
            });
          });
          ctrl.treeOrderFields.removeItem(selectedItem.element);
          if (selectedItem.level == 0) {
            angular.forEach(ctrl.model.Description.Groups, function(
              item,
              index
            ) {
              if (selectedItem.label == item.Caption)
                ctrl.model.Description.Groups.splice(index, 1);
            });
          } else {
            angular.forEach(ctrl.model.ObjectFields, function(item, index) {
              if (item.Name == selectedItem.value)
                ctrl.model.ObjectFields.splice(index, 1);
            });
          }
        }
      } else {
        if (selectedItem.level == 0) {
          angular.forEach(ctrl.model.Description.Groups, function(item, index) {
            if (item.Caption == selectedItem.label) {
              orderFieldIndex = index;
              orderFieldItem = item;
            }
          });
          ctrl.excuteSubElement(
            "group",
            event,
            "edit",
            orderFieldItem,
            orderFieldIndex
          );
        } else {
          angular.forEach(ctrl.model.ObjectFields, function(item, index) {
            if (item.Name == selectedItem.value) {
              orderFieldIndex = index;
              orderFieldItem = item;
            }
          });
          ctrl.excuteSubElement(
            "field",
            event,
            "edit",
            orderFieldItem,
            orderFieldIndex
          );
        }
      }
    },

    resetForm() {
      ctrl.viewModel.OrderFields.source = [];
      ctrl.permissionModel.listStaticPermissions = [];
      ctrl.permissionModel.listDynamicPermissions = [];
      ctrl.permissionModel.listScriptPermissions = [];
    },

    gotoForms() {
      $state.go("app.configuration.forms");
    },

    addLine(type, line) {
      ctrl.AddLines[type].push(line);
      switch (type) {
        case "Group": {
          angular.forEach(ctrl.permissionModel.listUserGroups, function(
            value,
            key
          ) {
            if (value.GroupId == line.GroupId) {
              ctrl.permissionModel.listUserGroups[key].Selected = true;
              delete ctrl.Group;
            }
          });
          break;
        }
        case "Role": {
          angular.forEach(ctrl.permissionModel.listUserPermissions, function(
            value,
            key
          ) {
            if (value.GroupId == line.GroupId) {
              ctrl.permissionModel.listUserPermissions[key].Selected = true;
              delete ctrl.Role;
            }
          });
          break;
        }
        case "User": {
          angular.forEach(ctrl.permissionModel.listUsers, function(value, key) {
            if (value.UserId == line.UserId) {
              ctrl.permissionModel.listUsers[key].Selected = true;
              delete ctrl.User;
            }
          });
          break;
        }
        case "Field": {
          angular.forEach(ctrl.CurrentDataGroup.Fields, function(value, key) {
            if (value.Id == line.Id) {
              ctrl.CurrentDataGroup.Fields[key].Selected = true;
              delete ctrl.Field;
            }
          });
          break;
        }
        default:
          break;
      }
      // if(type == "Group"){
      //   angular.forEach(ctrl.permissionModel.listUserGroups, function(value, key){
      //     if(value.GroupId == line.GroupId){
      //       ctrl.permissionModel.listUserGroups[key].Selected = true;
      //       delete ctrl.Group;
      //     }
      //   })
      // }
    },

    init() {
      var ctrl = this;
      ctrl.isSystemAdmin = this.$isSystemAdmin();
      ctrl.isMantisAdmin = this.$isMantisAdmin();
      //ctrl.model = {};
      /*
      ctrl.viewModel = {
        DataGroup: {
          source: [],
          allowDrag: false,
          allowDrop: false,
          select: function(event) {
            var selectedItem = ctrl.treeDataGroup.getItem(event.args.element);
            onSelectDataGroup(selectedItem);
          }
        },
        OrderFields: {
          source: [],
          allowDrag: true,
          allowDrop: true,
          dragEnd: function(dragItem, dropItem, args, dropPosition, tree) {
            if (dragItem.level != dropItem.level && dropPosition != "inside") {
              return false;
            } else if (dragItem.level < dropItem.level) {
              return false;
            } else if (
              dragItem.level == dropItem.level &&
              dropPosition == "inside"
            ) {
              return false;
            }
          },
          mousedown: function(event) {
            var rightClick =
              utilsLibrary.isRightClick(event) || $.jqx.mobile.isTouchDevice();
            if (rightClick) {
              var scrollTop = $(window).scrollTop();
              var scrollLeft = $(window).scrollLeft();
              ctrl.actionOrderField.open(
                parseInt(event.clientX) + 5 + scrollLeft,
                parseInt(event.clientY) + 5 + scrollTop
              );
              return false;
            }
          }
        },
        Buttons: {
          source: [],
          checkboxes: true,
          allowDrag: true,
          allowDrop: true,
          displayMember: "Code",
          valueMember: "Code"
        },
        contextOrderFields: { autoOpenPopup: false, mode: "popup" },
        CurrentDataGroup: { Fields: [], Buttons: [] }
      };

      ctrl.permissionModel = {
        listDropdownRoles: {
          source: [],
          checkboxes: true,
          displayMember: "Name",
          valueMember: "Code"
        },
        listDropdownFields: {
          source: [],
          checkboxes: true,
          displayMember: "Caption",
          valueMember: "Name"
        },
        listStaticPermissions: [],
        listScriptPermissions: [],
        listDynamicPermissions: [],
        listUserPermissions: [],
        listUserGroups: [],
        listRoles: [],
        listUsers: [],
        listGroupRoles: {}
      };

      ctrl.communication = { action: "", item: {}, index: "", scope: ctrl };
      ctrl.AddLines = {
        Group: [],
        Role: [],
        User: [],
        Field: []
      };

      ctrl.administrator = this.$Lodash.cloneDeep(this.$administrator);
       */
      /*
      $(document).bind('contextmenu', function(e) {
        if ($(e.target).parents('.jqx-tree').length > 0) {
          return false;
        }
        return true;
      });

      $timeout(function() {
        $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
        });
      });
      */
      this.bindEditor();
    }
  },
  mounted() {
    this.bindEditor();
    if(!Vue.vueDragula.options['checkBoxBag'])
      Vue.vueDragula.options('checkBoxBag', {
        direction: 'vertical'
      });
    this.init();
  }
};
</script>

