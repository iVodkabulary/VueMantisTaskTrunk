<template>
  <div class="animated fadeIn dataGroupAdv">
    <div class="page-header mb-1">
      <div class="title-box py-1 px-3">
        <div class="row">
          <h5 class="col m-auto">
            <i class="fa fa-sitemap"></i>
            <span>Khối dữ liệu: {{selectedItem.Name}}</span>
          </h5>
          <div class="col text-right pr-0">
            <el-button @click="requestByAction('save')">Lưu</el-button>
            <el-button @click="saveModules">Lưu module</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-container>
      <el-aside class="col-3 p-0 mr-1">
        <DataGroupTree :data="treeData"/>
      </el-aside>
      <el-container class="title-box bg-white" v-if="!$Utils.equals(selectedItem,{})">
        <el-main class="tabsfullcontent">
          <el-tabs v-model="viewModel.selectedTab">
            <el-tab-pane label="Phổ biến" name="0">
              <!-- <DataGroupForm :selectedItem="model" :selectedModel="viewModel" /> -->
              <el-form :model="model.Description" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="Tên" prop="Caption">
                  <el-col :span="11">
                    <el-input v-model="model.Description.Caption"/>
                  </el-col>
                </el-form-item>
                <el-form-item label="Mô tả" prop="More">
                  <el-col :span="11">
                    <el-input v-model="model.Description.More"/>
                  </el-col>
                </el-form-item>
                <el-form-item label="Nguồn dữ liệu" prop="DataSource">
                  <el-select v-model="model.Description.DataSource" value-key="Id" @change="onDataSourceChange" clearable>
                    <el-option v-for="item  in viewModel.DataSource" :key="item.Id" :label="item.Caption" :value="item"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="Dữ liệu gốc">
                  <el-col :span="11">
                    <el-input v-model="model.Description.RootData" disabled/>
                  </el-col>
                </el-form-item>
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="Mở rộng điều kiện truyền thêm" name="extenField1">
                    <el-form-item label="Khóa">
                      <el-col :span="11">
                        <el-input v-model="viewModel.Key"/>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="Giá trị">
                      <el-col :span="11">
                        <el-input v-model="viewModel.Value"/>
                      </el-col>
                    </el-form-item>
                    <el-button @click="addConditions" :disabled="viewModel.Key === '' || viewModel.Value === ''" type="primary">Thêm</el-button>
                    <el-table :data="model.Description.Filters"
                              style="width: 100%">
                      <el-table-column prop="Key"
                                       label="Khóa"
                                       width="180">
                      </el-table-column>
                      <el-table-column prop="Value"
                                       label="Giá trị">
                      </el-table-column>
                      <el-table-column label="Xử lý"
                                       width="180">
                        <template slot-scope="scope">
                          <el-button type="danger" @click="confirmDelete($event,'filter',scope.row,scope.$index)"
                                     size="mini">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item title="Mở rộng các trường liên quan" name="extenField2">
                    <el-button @click="excuteSubDirective($event,'dependency','insert')" type="primary">Thêm</el-button>
                    <el-table :data="model.Description.Dependencies"
                              style="width: 100%">
                      <el-table-column prop="Source"
                                       label="Nguồn"
                                       width="180">
                      </el-table-column>
                      <el-table-column prop="Target"
                                       label="Đích"
                                       width="180">
                      </el-table-column>
                      <el-table-column prop="DependencyType"
                                       label="Loại"
                                       width="180">
                      </el-table-column>
                      <el-table-column label="Loại xử lý">
                        <template slot-scope="scope">
                          <el-button @click="excuteSubDirective($event,'dependency','edit',scope.row,scope.$index)"
                                     size="mini">
                            <i class="el-icon-edit"></i>
                          </el-button>
                          <el-button type="danger" @click="confirmDelete($event,'dependency',scope.row,scope.$index)"
                                     size="mini">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item title="Mở rộng các khối liên kết" name="extenField3">
                    <el-form-item label="Khối dữ liệu liên kết" prop="name">
                      <el-col :span="11">
                        <!--<el-select v-model="viewModel.LinkDataGroup" value-key="Id" clearable>-->
                          <!--<el-option v-for="item  in viewModel.ListDataGroups" :key="item.Id" :label="item.Caption"-->
                                     <!--:value="item"/>-->
                        <!--</el-select>-->
                        <el-cascader :options="temp" expand-trigger="hover" v-model="viewModel.LinkDataGroup"
                                     placeholder="Chọn" clearable change-on-select/>
                      </el-col>
                    </el-form-item>
                    <el-button @click="excuteLink($event,'insert', 0)" type="primary">Thêm</el-button>

                    <el-table
                      :data="Links"
                      style="width: 100%">
                      <el-table-column type="index"
                                       label="Stt"
                                       width="180">
                      </el-table-column>
                      <el-table-column prop="Name"
                                       label="Khối liên kết"
                                       width="180">
                      </el-table-column>
                      <el-table-column prop=""
                                       label="Xử lý">
                        <template slot-scope="scope">
                          <el-button @click="excuteLink($event,'edit',scope.$index)"
                                     size="mini">
                            <i class="el-icon-edit"></i>
                          </el-button>
                          <el-button type="danger" @click="excuteLink($event,'delete',scope.$index)"
                                     size="mini">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Trường dữ liệu" name="1">
              &ensp;&ensp;<el-button type="primary" @click="excuteSubDirective($event,'field','insert')" plain>Thêm
            </el-button>
              <el-table :data="model.Description.Fields"
                        highlight-current-row
                        style="width: 100%">
                <el-table-column label="Stt"
                                 type="index"
                                 width="60">
                </el-table-column>
                <el-table-column label="Quản trị"
                                 width="60">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.Permit"/>
                  </template>
                </el-table-column>
                <el-table-column prop="Caption"
                                 label="Tên"
                                 width="120">
                </el-table-column>
                <el-table-column prop="Name"
                                 width="100"
                                 label="Mã">
                </el-table-column>
                <el-table-column prop="FieldStorageType"
                                 width="110"
                                 label="Loại trường">
                </el-table-column>
                <el-table-column prop="FieldColumnType"
                                 width="110"
                                 label="Loại dữ liệu">
                </el-table-column>
                <el-table-column width="110"
                                 prop="FormElementType"
                                 label="Kiểu phần tử">
                </el-table-column>
                <el-table-column label="Xử lý">
                  <template slot-scope="scope">
                    <!--@click="handleEdit(scope.$index, scope.row)">Edit-->
                    <el-button size="mini" @click="excuteSubDirective($event,'field','edit',scope.row,scope.$index)">
                      <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="danger" @click="confirmDelete($event,'field',scope.row,scope.$index)"><i
                      class="el-icon-delete"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Nút" name="2">
              <el-button type="primary" @click="excuteSubDirective($event,'button','insert')" plain>Thêm</el-button>
              <el-table :data="model.Description.Buttons"
                        highlight-current-row
                        style="width: 100%">
                <el-table-column label="Stt"
                                 type="index"
                                 width="60">
                </el-table-column>
                <el-table-column prop="Code"
                                 label="Mã"
                                 width="250">
                </el-table-column>
                <el-table-column prop="Caption"
                                 width="90"
                                 label="Nút">
                </el-table-column>
                <el-table-column prop="ParentObject"
                                 width="110"
                                 label="Đối tượng chứa">
                </el-table-column>
                <el-table-column prop="ButtonType"
                                 width="120"
                                 label="Loại hành động">
                </el-table-column>
                <el-table-column label="Xử lý">
                  <template slot-scope="scope">
                    <!--@click="handleEdit(scope.$index, scope.row)">Edit-->
                    <el-button size="mini" @click="excuteSubDirective($event,'button','edit',scope.row,scope.$index)">
                      <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="danger" @click="confirmDelete($event,'button',scope.row,scope.$index)"><i
                      class="el-icon-delete"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import DataGroupTree from "@/components/static/advance/DataGroupTree";
  import DataGroupForm from "@/components/static/advance/DataGroupForm";
  import DependencyDialog from "@/components/static/advance/DependencyDialog";
  import GroupLinkDialog from "@/components/static/advance/GroupLinkDialog";
  import GroupFieldDialog from "@/components/static/advance/GroupFieldDialog";
  import GroupButtonDialog from "@/components/static/advance/GroupButtonDialog";
  import utilsLibrary from "@/services/utils";
  import ElCascader from "element-ui/packages/cascader/src/main";

  export default {
    name: "categories",
    components: {
      ElCascader,
      DataGroupTree,
      DataGroupForm
    },
    data() {
      return {
        Links: [],
        activeNames: ["extenField1"],
        angular: this.$,
        treeData: {
          Name: "Cấu hình",
          children: [],
          level: "0"
        },
        listData: [],
        model: {Description: {Fields: [], Buttons: []}},
        viewModel: {
          DataGroup: {
            source: []
          },
          Data: {
            Default: {
              Prefix: "xSetting.Default.Project.DataGroup.Field.",
              valueMember: "Name",
              Conditions: {Level: 7, ParentCode: "Code"}
            },
            Fields: [
              {Name: "FormFieldType"},
              {Name: "FieldColumnType"},
              {Name: "ListElementType"},
              {Name: "FilterElementType"},
              {Name: "FormDataChangeType"},
              {
                Name: "DataSource",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup."
              },
              {
                Name: "DependencyType",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.Form."
              },
              {
                Name: "FieldStorageType",
                Model: "FieldStorageType;"
              },
              {
                Name: "FormValidate",
                Default: false,
                Conditions: {
                  Level: 5,
                  ParentCode: "xSetting.Default.Control.Validate"
                }
              },
              {
                Name: "ParentObject",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup.Button."
              },
              {
                Name: "ButtonType",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup.Button."
              },
              {
                Name: "AfterUpdate",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup.Button."
              },
              {
                Name: "PreAction",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup.Button."
              },
              {
                Name: "Action",
                Conditions: {ParentCode: "Code"},
                Prefix: "xSetting.Default.Project.DataGroup.Button."
              }
            ]
          },
          contextDataGroup: {autoOpenPopup: false, mode: "popup"},
          ListDataGroups: [],
          ListModules: [],
          ListDataGroupModules: [],
          selectedTab: "0",
          communication: {action: "", item: {}, index: "", scope: this},
          Key: '',
          Value: ''
        },
        rules: {
          Caption: [{required: true, message: "Tên phải nhập", trigger: "blur"}],
          DataSource: [{required: true, message: "Nguồn dữ liệu phải chọn", trigger: "change"}],
        },
        selectedItem: {},
        temp: [],
        test: []
      };
    },
    methods: {
      isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },

      bindDataGroupSource() {
        var ctrl = this;
        ctrl.viewModel.DataGroup.source = [];
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Project.DataGroup";
        request.R1_IncludedNestedSetParent = true;
        utilsLibrary.post(request).then(data => {
          ctrl.viewModel.ListDataGroups = utilsLibrary.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          $.each(ctrl.viewModel.ListDataGroups, (key, dataGroup) => {
            if (dataGroup.Description != undefined && dataGroup.Description != "")
              dataGroup.Description = JSON.parse(dataGroup.Description);
          });

          ctrl.temp = utilsLibrary.createCustomTreeFromList(
            this.$Lodash.cloneDeep(ctrl.viewModel.ListDataGroups),
            "Id",
            "ParentId",
            "children",
            {"Caption": "label", Code: "value"},
            {}
          )[0].children;

          this.treeData = utilsLibrary.createCustomTreeFromList(
            this.$Lodash.cloneDeep(ctrl.viewModel.ListDataGroups),
            "Id",
            "ParentId",
            "children",
            {Caption: "Name", Id: "value"},
            {type: "data-group", icon: "icon-folder", unread: 0, total: 0}
          )[0];
        });
      },

      requestByAction(action) {
        var ctrl = this;
        var selectedItem = this.selectedItem;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        if (jQuery.isEmptyObject(selectedItem)) {
          utilsLibrary.showMessage("error", "Không định danh được đối tượng!");
          return;
        }
        if (action === "delete") {
          utilsLibrary
            .showConfirm(
              "Cảnh báo",
              this.$toastMessage.oneWayAction +
              this.$toastMessage.deleteSettingWarning
            )
            .then(() => {
              request.R1_RequestTemplate = "SettingNew.SearchTreeList";
              request.R1_ParentId = selectedItem.value;
              request.R1_IncludedNestedSetParent = true;
              //utilsLibrary.showLoading("start");
              utilsLibrary.post(request).then(data => {
                data = utilsLibrary.getDataWithRoot(
                  data.R1,
                  "Data.DynamicDS.Setting"
                );
                request = this.$Lodash.cloneDeep(this.$singleRequest);
                var strListId = "";
                request.TotalRequests = 0;
                $.each(data, (key, setting) => {
                  request.TotalRequests++;
                  request["R" + request.TotalRequests + "_RequestTemplate"] =
                    "SettingNew.Delete";
                  request["R" + request.TotalRequests + "_Id"] = setting.Id;
                  strListId += setting.Id + ";";
                });
                if (request.TotalRequests > 0) {
                  utilsLibrary.post(request).then(() => {
                    utilsLibrary.showMessage(
                      "success",
                      this.$toastMessage.deleteItemPre + this.$toastMessage.deleteItemSuf
                    );
                    utilsLibrary.removeAllLink(strListId);
                    utilsLibrary.showLoading("stop");
                  });
                }
              });
            });
        } else if (action === "edit") {
          ctrl.viewModel.selectedTab = "0";
          var arrModuleTypes = ["Form", "List", "Filter"];
          request.R1_RequestTemplate = "SettingNew.SearchSetting";
          request.R1_Id = selectedItem.value;
          $.each(ctrl.viewModel.ListDataGroups, (key, item) => {
            if (item.Id === selectedItem.value) selectedItem.Code = item.Code;
          });
          $.each(arrModuleTypes, (key, type) => {
            if (selectedItem.Code !== undefined) {
              request.TotalRequests++;
              request["R" + request.TotalRequests + "_RequestTemplate"] = "SettingNew.SearchSetting";
              request["R" + request.TotalRequests + "_ParentCode"] = "xSetting.Project." + type;
              request["R" + request.TotalRequests + "_Level"] = "4";
              request["R" + request.TotalRequests + "_Name"] = selectedItem.Code;
            }
          });

          utilsLibrary.postCheckResult(request).then(data => {
            var currentDataGroup = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting")[0];
            if (currentDataGroup.Description !== undefined) {
              currentDataGroup.Description = JSON.parse(currentDataGroup.Description);
              $.each(ctrl.viewModel.DataSource, (key, source) => {
                if (source.Name === currentDataGroup.Description.DataSource) {
                  currentDataGroup.Description.DataSource = source;
                }
              });
              currentDataGroup.Description.Fields = "";
              for (var i = 1; i <= currentDataGroup.Description.FCount; i++) {
                if (currentDataGroup["F" + i] !== undefined) {
                  currentDataGroup.Description.Fields += currentDataGroup["F" + i];
                  delete currentDataGroup["F" + i];
                }
              }
              currentDataGroup.Description.Fields = currentDataGroup.Description.Fields !== "" ? JSON.parse(currentDataGroup.Description.Fields) : [];

              currentDataGroup.Description.Fields.forEach(item => {
                if(item.Permit){
                  if(item.Permit === 'true'){
                    item.Permit = true;
                  } else {
                    item.Permit = false;
                  }
                }
              });

              ctrl.model = currentDataGroup;
              this.Links = [];
              $.each(ctrl.model.Description.Link, (key, value) => {
                this.Links.push({ Name: key, Value: value });
              });
              ctrl.viewModel.ListModules = utilsLibrary.getDataWithRoot(data.R2, "Data.DynamicDS.Setting");
              ctrl.viewModel.ListModules = ctrl.viewModel.ListModules.concat(
                utilsLibrary.getDataWithRoot(data.R3, "Data.DynamicDS.Setting")
              );
              ctrl.viewModel.ListModules = ctrl.viewModel.ListModules.concat(
                utilsLibrary.getDataWithRoot(data.R4, "Data.DynamicDS.Setting")
              );
              $.each(ctrl.viewModel.ListModules, (key, item) => {
                if (item.Description !== undefined) {
                  item.Description = JSON.parse(item.Description);
                  item.ObjectFields = "";
                  for (var i = 1; i <= item.Description.OFCount; i++) {
                    if (item["OF" + i] !== undefined)
                      item.ObjectFields += item["OF" + i];
                  }
                  item.ObjectFields = utilsLibrary.jsonParse(item.ObjectFields);
                  if(!item.ObjectFields){
                    item.ObjectFields = utilsLibrary.jsonParse(item["OF" + 1]);
                  }
                }
              });
            }
          });
        } else {
          var savedData = this.bindSavedData();
          request.R1_RequestTemplate = "SettingNew.Update";
          request.R1_Id = savedData.Id;
          request = utilsLibrary.updateParamsSingleRequest(request, savedData);
          utilsLibrary.postCheckResult(request).then((data) => {
            if (data.success){
              utilsLibrary.showMessage("success",this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
              ctrl.requestByAction('edit');
            }
            else
              utilsLibrary.showMessage("error", this.$toastMessage.updateItemFailed);
          });
        }
      },

      bindSavedData() {
        var savedData = this.$Lodash.cloneDeep(this.model);
        savedData.Value = [];
        savedData.Caption = savedData.Description.Caption;
        savedData.Description.Fields.forEach((field) => {
          if (field.FieldColumnType !== "Condition") {
            savedData.Value.push({
              Name: field.Name,
              ColumnType: field.FieldColumnType,
              StorageType: field.FieldStorageType
            });
            if (field.DynamicText !== undefined)
              savedData.Value.push({
                Name: field.DynamicText,
                StorageType: "Dynamic"
              });
          }
          utilsLibrary.deleteAutoValue(field);

          $.each(field, (key, value) => {
            if (value === true) field[key] = "true";
            if (value === false && value !== "") field[key] = "false";
          });
        });

        savedData.Description.Buttons.forEach((button) => {
          $.each(button, (key, value) => {
            if ((value === true) & !this.isNumeric(button[key])) button[key] = "true";
            if (value === false && value !== "") button[key] = "false";
          });
        });

        if (utilsLibrary.isEmpty(savedData.Description.DataSource))
          savedData.Description.DataSource =
            savedData.Description.DataSource.Name;

        savedData.Description.AdditionConditions = "";
        savedData.Description.Filters.forEach((item) => {
          savedData.Description.AdditionConditions +=
            "&" + item.Key + "=" + item.Value;
        });

        var strFields = JSON.stringify(savedData.Description.Fields);
        delete savedData.Description.Fields;
        var iStartIndex = 0;
        var iFieldCount = 0;
        for (var i = 1; i < 7; i++) {
          if (strFields.length > iStartIndex) {
            savedData["F" + i] = strFields.substring(
              iStartIndex,
              iStartIndex + 9999
            );
            iStartIndex = 10000 * i - i;
            iFieldCount = i;
          }
        }
        savedData.Value = JSON.stringify(savedData.Value);
        savedData.Description.FCount = iFieldCount;
        savedData.Description = JSON.stringify(savedData.Description);
        return savedData;
      },

      excuteSubDirective(ev, type, action, item, index) {
        var ctrl = this;
        ctrl.communication.action = action;
        if (action === "edit") {
          ctrl.communication.item = item;
          if (item.FormJsonExpression !== undefined)
            ctrl.communication.item.FormJsonExpression = JSON.stringify(item.FormJsonExpression);
          ctrl.communication.index = index;
        }
        if (type === "link") {
          this.$hub.$emit(
            "set-modal-data",
            "Thông tin các trường liên kết",
            "60%",
            true,
            "center",
            GroupLinkDialog,
            true,
            "",
            ctrl.communication
          );
        } else if (type === "dependency") {
          this.$hub.$emit(
            "set-modal-data",
            "Thông tin các trường liên quan",
            "60%",
            true,
            "center",
            DependencyDialog,
            true,
            "",
            ctrl.communication
          );
        } else if (type === "field") {
          this.$hub.$emit(
            "set-modal-data",
            "Thông tin các trường dữ liệu",
            "60%",
            true,
            "center",
            GroupFieldDialog,
            true,
            "",
            ctrl.communication
          );
        } else if (type === "button") {
          this.$hub.$emit(
            "set-modal-data",
            "Thông tin nút",
            "60%",
            true,
            "center",
            GroupButtonDialog,
            true,
            "",
            ctrl.communication
          );
        }
      },

      excuteLink(ev, action, key) {
        var ctrl = this;
        if (action === "insert") {
          if (ctrl.viewModel.LinkDataGroup && ctrl.viewModel.LinkDataGroup.length > 0) {
            var temp = ctrl.viewModel.LinkDataGroup[ctrl.viewModel.LinkDataGroup.length - 1];
            if (ctrl.model.Description.Link[temp] === undefined) {
              ctrl.model.Description.Link[temp] = [];
              this.Links.push({
                Name: temp,
                Value: []
              });
            } else {
              this.excuteSubDirective(ev, "link", "edit", temp);
            }
          }
        } else if (action === "edit"){
          this.excuteSubDirective(ev, "link", action, this.Links[key].Name);
        }
        else if (action === "delete") {
          utilsLibrary
            .showConfirm("Cảnh báo", this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning)
            .then(() => {
              delete ctrl.model.Description.Link[this.Links[key].Name];
              this.Links.splice(key, 1);
            });
        }
      },

      bindSubDirectives(communication) {
        var ctrl = this;
        if (communication.action === "edit") {
          if (communication.item.FormJsonExpression !== undefined && communication.item.FormJsonExpression !== "") {
            communication.item.FormJsonExpression = JSON.parse(communication.item.FormJsonExpression);
          }
          ctrl.model.Description[communication.Type][communication.index] = communication.item;
          var temp = this.$Lodash.cloneDeep(ctrl.model.Description[communication.Type]);
          ctrl.model.Description[communication.Type] = temp;
          if (utilsLibrary.isEmpty(ctrl.model[communication.Type])) {
            ctrl.model[communication.Type][communication.index] = communication.item;
          } else {
            ctrl.model.Description[communication.Type][communication.index] = communication.item;
          }
        } else {
          ctrl.model.Description[communication.Type].push(communication.item);
        }
        if (communication.Type === "Fields" || communication.Type === "Buttons") {
          this.requestByAction("update");
        }
      },

      bindLink(communication) {
        this.model.Description.Link[communication.code] = communication.item;
        this.Links.forEach(item => {
          if(item.Name === communication.code){
            item.Value = communication.item;
          }
        })
      },

      confirmDelete(ev, type, item, index) {
        utilsLibrary
          .showConfirm(
            "Cảnh báo",
            this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning
          )
          .then(() => {
            var listType = type === "dependency" ? "Dependencies" : type.capitalizeFirstLetter() + "s";
            this.model.Description[listType].splice(index, 1);

            if (["field", "button"].indexOf(type) !== -1)
              this.requestByAction("update");
          });
      },

      addConditions() {
        this.model.Description.Filters.push({
          Key: this.viewModel.Key,
          Value: this.viewModel.Value
        });
        this.viewModel.Key = "";
        this.viewModel.Value = "";
      },

      onDataSourceChange() {
        this.model.Description.RootData = this.$Lodash.cloneDeep(this.model.Description.DataSource.Value);
      },

      saveModules() {
        if(jQuery.isEmptyObject(this.selectedItem)){
          utilsLibrary.showMessage("error", "Không định danh được đối tượng!");
          return;
        }
        var dataGroup = this.$Lodash.cloneDeep(this.model);
        var arrModules = this.$Lodash.cloneDeep(this.viewModel.ListModules);
        dataGroup.Caption = dataGroup.Description.Caption;
        if (utilsLibrary.isEmpty(dataGroup.Description.DataSource))
          dataGroup.Description.DataSource =
            dataGroup.Description.DataSource.Name;

        dataGroup.Description.AdditionConditions = "";
        dataGroup.Description.Filters.forEach((item) => {
          dataGroup.Description.AdditionConditions += "&" + item.Key + "=" + item.Value;
        });

        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.TotalRequests = 0;
        arrModules.forEach((module) => {
          request.TotalRequests++;
          module.Description.DataGroupCaption = dataGroup.Caption;
          module.Description.RootData = dataGroup.Description.RootData;
          module.Description.DataSource = dataGroup.Description.DataSource;
          module.Description.AdditionConditions = dataGroup.Description.AdditionConditions;
          if (["Form", "Filter", "List"].indexOf(module.Description.ModuleType) !== -1)
            module.Description.Link = dataGroup.Description.Link;

          if (["Form", "Filter"].indexOf(module.Description.ModuleType) !== -1)
            module.Description.Dependencies = dataGroup.Description.Dependencies;

          var refFields = this.$Lodash.cloneDeep(module.ObjectFields);
          var arrDefaultFields = ["Multicheck", "IndexDefault", "Tool"];
          refFields.forEach((field) => {
            var isExist = false;
            if(dataGroup.Description.Fields){
              for (var i = 0; i < dataGroup.Description.Fields.length; i++) {
                var dgField = dataGroup.Description.Fields[i];
                if (field.Name === dgField.Name) {
                  isExist = true;
                  break;
                }
              }
            }
            if (["List"].indexOf(module.Description.ModuleType) !== -1) {
              if (arrDefaultFields.indexOf(field.Name) !== -1) isExist = true;
              if (field.ManualCalculator === "true") isExist = true;
            }
            if (!isExist) {
              $.each(module.ObjectFields, (index, sourceField) => {
                if (sourceField && field.Name === sourceField.Name)
                  module.ObjectFields.splice(index, 1);
              });
              if (module.Description.Groups !== undefined) {
                module.Description.Groups.forEach((group) => {
                  if (group.ListFields !== undefined) {
                    if (group.ListFields.indexOf(field.Name) !== -1) {
                      group.ListFields = group.ListFields.replace(field.Name + ";", "");
                    }
                  }
                });
              }
            }
          });

          var refButtons = this.$Lodash.cloneDeep(module.Description.Buttons);
          if(refButtons){
            refButtons.forEach((button) => {
              var isExist = false;
              for (var i = 0; i < dataGroup.Description.Buttons.length; i++) {
                var dgButton = dataGroup.Description.Buttons[i];
                if (dgButton.Code === button.Code) isExist = true;
              }
              if (!isExist) {
                $.each(module.Description.Buttons, (index, sourceButton) => {
                  if (button.Code === sourceButton.Code)
                    module.Description.Buttons.splice(index, 1);
                });
              }
            });
            module.Description.Buttons.forEach((moduleButton) => {
              module.Description.Buttons.forEach((dgButton) => {
                if (dgButton.Code === moduleButton.Code) moduleButton = dgButton;
              });
            });

            if (["Form", "List"].indexOf(module.Description.ModuleType) !== -1) {
              for (var i = 0; i < module.Description.Buttons.length; i++) {
                dataGroup.Description.Buttons.forEach((dgButton) => {
                  if (module.Description.Buttons[i].Code === dgButton.Code)
                    module.Description.Buttons[i] = dgButton;
                });
              }
            }
          }



          module.Fields = this.$Lodash.cloneDeep(module.ObjectFields);
          module.Fields.forEach((field) => {
            dataGroup.Description.Fields.forEach((dgField) => {
              if (dgField.Name === field.Name) {
                $.each(dgField, (key, value) => {
                  //if (!utilsLibrary.isEmpty(field[key]))
                  field[key] = value;
                });
                utilsLibrary.deleteAutoValue(field);
              }
            });
          });

          if (["Form", "Filter"].indexOf(module.Description.ModuleType) !== -1) {
            dataGroup.Description.Fields.forEach((field) => {
              utilsLibrary.deleteAutoValue(field);
              if (field.FormFieldType === "Hidden") module.Fields.push(field);
              if (field.DynamicText !== undefined && field.DynamicText != null)
                module.Fields.push({
                  Name: field.DynamicText,
                  FieldStorageType: "Dynamic"
                });
            });
          } else {
            dataGroup.Description.Fields.forEach((field) => {
              utilsLibrary.deleteAutoValue(field);
              if (field.ListIsHidden === "true") module.Fields.push(field);
              if (field.DynamicText !== undefined && field.DynamicText !== null)
                module.Fields.push({
                  Name: field.DynamicText,
                  FieldStorageType: "Dynamic"
                });
            });
          }

          module.ObjectFields.forEach(item => {
            delete item.$parent;
          })

          module.ObjectFields = JSON.stringify(module.ObjectFields);
          var iStartIndex = 0;
          var iFieldCount = 0;
          for (var i = 1; i < 7; i++) {
            if (module.ObjectFields.length > iStartIndex) {
              module["OF" + i] = module.ObjectFields.substring(
                iStartIndex,
                iStartIndex + 9999
              );
              iStartIndex = 10000 * i - i;
              iFieldCount = i;
            }
          }
          module.Description.OFCount = iFieldCount;
          delete module.ObjectFields;

          iStartIndex = 0;
          iFieldCount = 0;
          module.Fields = JSON.stringify(module.Fields);
          for (var i = 1; i < 7; i++) {
            if (module.Fields.length > iStartIndex) {
              module["F" + i] = module.Fields.substring(
                iStartIndex,
                iStartIndex + 9999
              );
              iStartIndex = 10000 * i - i;
              iFieldCount = i;
            }
          }
          module.Description.FCount = iFieldCount;
          delete module.Fields;

          module.ModuleType = module.Value;
          module.Description = JSON.stringify(module.Description);
          request = utilsLibrary.updateParamsSingleRequest(
            request,
            module,
            request.TotalRequests
          );
          request = utilsLibrary.updateParamsSingleRequest(
            request,
            {RequestTemplate: "SettingNew.Update"},
            request.TotalRequests
          );
        });
        utilsLibrary.postCheckResult(request).then(data => {
          if (data.success) {
            utilsLibrary.showMessage("success", "Lưu Module thành công!");
          }
          else {
            utilsLibrary.showMessage("error", this.$toastMessage.updateItemFailed);
          }
        });
      },

      bindViewModel() {
        var ctrl = this;
        utilsLibrary
          .postCheckResult(utilsLibrary.getViewModelRequest(ctrl.viewModel.Data, "SettingNew.SearchSetting"))
          .then(data => {
            if (data.success) {
              $.each(ctrl.viewModel.Data.Fields, (index, item) => {
                var dataReturn = {};
                if (data["R" + (index + 1)].success) {
                  dataReturn = utilsLibrary.getDataWithRoot(
                    data["R" + (index + 1)],
                    item.RootData != null
                      ? item.RootData
                      : "Data.DynamicDS.Setting"
                  );
                  switch (item.Name) {
                    default:
                      ctrl.viewModel[item.Name] = dataReturn;
                      break;
                    case "FormValidate":
                      ctrl.viewModel[item.Name + "Source"] = dataReturn;
                      break;
                  }
                }
              });
            }
          });
      },

      bindListUserPermissions() {
        var ctrl = this;
        ctrl.viewModel.UserPermissions = [];
        ctrl.viewModel.GroupPermissions = [];
        ctrl.viewModel.RolePermissions = {};
        var request = {
          RequestAction: "SearchGroup",
          RequestClass: "BPM",
          RequestDataType: "json",
          ConditionFields: "Status",
          Status: "1",
          StaticFields: "GroupId;GroupName;Description;GroupParent;GroupType"
        };
        utilsLibrary.post(request).then(data => {
          data = utilsLibrary.getDataWithRoot(data, "UserDS.Group");

            $.each(data, (key, value) => {
              if (value.GroupType === '0')
                ctrl.viewModel.UserPermissions.push(value);
              else if (value.GroupType === '1')
                ctrl.viewModel.GroupPermissions.push(value);
              else if (value.GroupType === '2') {
                if (!utilsLibrary.isEmpty(ctrl.viewModel.RolePermissions, value.GroupParent))
                  ctrl.viewModel.RolePermissions[value.GroupParent] = [];
                ctrl.viewModel.RolePermissions[value.GroupParent].push(value);
              }
            });
        });
      },

      init() {
        this.bindDataGroupSource();
        this.bindViewModel();
        this.bindListUserPermissions();
        this.communication = {action: "", item: {}, index: "", scope: this};
      }
    },
    watch: {},
    destroyed() {
      this.$hub.$off("fill-data-to-data-group");
      this.$hub.$off("update-data-group-tree");
    },
    created() {
    },
    mounted() {
      this.$hub.$on("update-data-group-tree", item => {
        this.bindDataGroupSource();
      });
      this.$hub.$on("fill-data-to-data-group", item => {
        this.selectedTab = "0";
        this.bindDataGroupSource();
        this.bindViewModel();
        this.selectedItem = item;
        this.requestByAction("edit");
      });
      this.init();
    }
  };
</script>
<style lang="scss">
  .dataGroupAdv {
    .categories-form .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: auto;
    }

    .tabsfullcontent {
      padding: 0px 0px 0px 5px;
    }

    #Filter .modal-dialog {
      position: fixed;
      right: 0px;
      margin: 0px;
      height: 100%;
    }

    #Filter .modal-dialog .modal-content {
      height: 100%;
    }

    .createDocument .el-dialog__header {
      text-align: left;
      background-color: #5090c1;
    }

    .createDocument .el-dialog__header .el-dialog__title {
      color: #fff;
    }

    .createDocument .el-dialog__footer {
      text-align: right;
    }

    .createDocument .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }

    .el-aside {
      color: #333;
    }

    .border-box {
      border: 1px solid #5090c1;
    }

    .title-box {
      background-color: #f0f3f5;
      border: 1px solid #c2cfd6;
    }
  }
</style>
