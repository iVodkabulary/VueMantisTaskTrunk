<template>
  <div>
    <el-form :model="viewModel" label-width="120px">
      <el-form-item label="Khối dữ liệu">
        <el-cascader placeholder="Chọn khối dữ liệu"
                     :options="treeDataGroup"
                     v-model="DataGroup"
                     @change="onSelectDataGroup">
        </el-cascader>
      </el-form-item>
      <el-form-item label="Form nhập liệu">
        <el-select v-model="InputForm" value-key="Id" placeholder="Form nhập liệu">
          <el-option v-for="item in viewModel.ListForms" :key="item.Id" :label="item.Caption"
                     :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Không check trùng">
        <el-button @click="clearRadio()">Xóa kiểm tra trùng</el-button>

      </el-form-item>
    </el-form>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Danh sách trường import" name="1">
        <el-table
          :data="model.Columns"

          style="width: 100%">
          <el-table-column
            type="index"
            label="Stt"
          >
          </el-table-column>
          <el-table-column
            label="Trường trong sheet"
            width="180">
            <template slot-scope="scope">{{scope.row}}</template>
          </el-table-column>

          <el-table-column
            label="Trường giá trị"
          >
            <template slot-scope="scope">
              <el-select filterable clearable value-key="Name"
                         @change="depend(viewModel.ValueMap[scope.row], scope.row)"
                         v-model="viewModel.ValueMap[scope.row]">
                <el-option v-for="item in viewModel.listFields" :key="item.Name"
                           :label="item.Caption +' (' +item.Name+ ')'" :value="item"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Trường hiển thị"
          >
            <template slot-scope="scope">

              <el-select filterable clearable value-key="Name" v-model="viewModel.DisplayMap[scope.row]"
                         v-if="viewModel.ValueMap[scope.row] && viewModel.ValueMap[scope.row]['FormElementType'] && ['Select','Multi','Radio','CombineData'].indexOf(viewModel.ValueMap[scope.row]['FormElementType'])>-1">
                <el-option v-for="item in viewModel.listFields" :key="item.Name"
                           :label="item.Caption +' (' +item.Name+ ')' " :value="item"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Kiểm tra trùng"
          >
            <template slot-scope="scope">
              <el-radio :label="scope.row" v-model="viewModel.Dupplicate.Column">&nbsp;</el-radio>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="prepareConvert(selectedDataGroup)">Chuyển đổi dữ liệu</el-button>
        <el-button @click="cancel">Bỏ qua</el-button>
      </el-collapse-item>
      <el-collapse-item v-if="viewModel.Convert.listError.length > 0" title="Danh sách trường dữ liệu kiểm tra lại"
                        name="2">
        <el-table
          :data="viewModel.Convert.listError"
          style="width: 100%">
          <el-table-column
            type="index"
            label="Stt"
          >
          </el-table-column>
          <el-table-column
            label="Dòng"
          >
            <template slot-scope="scope">
              {{scope.row.Index+1}}
            </template>
          </el-table-column>
          <el-table-column
            label="Mô tả"
          >
            <template slot-scope="scope">
              <div v-for="error in scope.row.listErrors" :key="error.Caption">
                <b>{{error.Caption}}: </b>{{error.Message}}
              </div>
            </template>
          </el-table-column>
        </el-table>

      </el-collapse-item>
      <el-row v-if="model.isConverted && viewModel.Convert.listError.length==0">
        <el-col :span="2">
          <el-input type="number" v-model="viewModel.NumberRequestPerTime"></el-input>
        </el-col>

        <el-button type="primary" @click="excuteImport(selectedDataGroup)">
          Nhập dữ liệu
        </el-button>
        <el-button type="danger" @click="showConfirm(selectedDataGroup)">
          Xóa trắng dữ liệu
        </el-button>

      </el-row>
      <el-collapse-item v-if="viewModel.listLogs.length > 0" title="Kết quả" name="3">
        <el-table
          :data="viewModel.listLogs"
          style="width: 100%">
          <el-table-column label="#" prop="total">
          </el-table-column>

          <el-table-column
            label="Số lượng thành công"
          >
            <template slot-scope="scope">
              {{scope.row.Success}} / {{viewModel.Convert.listRows.length}}
            </template>
          </el-table-column>
          <el-table-column
            label="Số lượng thêm mới"
            prop="Inserted"
          >

          </el-table-column>
          <el-table-column
            label="Số lượng cập nhật"
            prop="Updated"
          >

          </el-table-column>
          <el-table-column
            label="thất bại"
            prop="Failed"
          >

          </el-table-column>
        </el-table>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import utilsLibrary from "@/services/utils.js";
  import Vue from "vue";

  Vue.use(require("numeral"));
  Vue.use(require("vue-moment"));
  export default {
    props: ["data"],
    data() {
      return {
        importedCount: 0,
        activeNames: ["1", "2", "3"],
        viewModel: {
          DataGroup: {
            source: [],
            allowDrag: false,
            allowDrop: false,
            select: function (event) {
              ctrl.onSelectDataGroup(event);
            }
          },
          listFields: [],
          ListDataGroups: [],
          listLogs: [],
          Parameters: [],
          listPermissions: [],
          listDependencies: [],
          listRequestFields: [],
          Convert: {listColumns: [], listRows: [], listError: []},
          Loop: 0,
          NumberRequestPerTime: 5,
          ValueMap: {},
          DisplayMap: {},
          Dupplicate: {listData: [], Caption: "", Name: "", listServerData: []},
          ListForms: []
        },
        communication: {action: "", item: {}, index: "", scope: this},
        listfield: [],
        objfield: {},
        treeDataGroup: [],
        selectedDataGroup: {},
        DataGroup: [],
        InputForm: "",
        model: {isConverted: false, Rows: [], Columns: []},
        dtOptions: {
          paging: false,
          searching: false,
          autoWidth: false,
          showNEntries: false,
          responsive: true
        }
      };
    },
    methods: {
      clearRadio() {
        this.viewModel.Dupplicate.Column = "1-";
      },
      bindDataGroupSource() {
        var ctrl = this;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Project.DataGroup";
        //utilsLibrary.showLoading('start');
        utilsLibrary.post(request).then(data => {
          data = utilsLibrary.getDataWithRoot(data.R1, "Data.DynamicDS.Setting");
          ctrl.viewModel.ListDataGroups = data;
          $.each(ctrl.viewModel.ListDataGroups, (key, item) => {
            item.Description =
              item.Description != "" ? JSON.parse(item.Description) : {};
            item.Fields = "";
            for (var i = 1; i <= item.Description.FCount; i++) {
              if (item["F" + i] != undefined) {
                item.Fields += item["F" + i];
                delete item["F" + i];
              }
            }
            item.Fields = item.Fields != "" ? JSON.parse(item.Fields) : [];
          });
          ctrl.treeDataGroup = utilsLibrary.createCustomTreeFromList(
            ctrl.viewModel.ListDataGroups,
            "Id",
            "ParentId",
            "children",
            {Caption: "label", Id: "value"},
            {}
          );
          /*
          var source =
          {
            datatype: "json",
            datafields: [
              {name: "Id", type: "string"},
              {name: "ParentId", type: "string"},
              {name: "Caption", type: "string"},
              {name: "Code", type: "string"},
              {name: "DataSource", type: "string"},
              {name: "AdditionConditions", type: "string"}
            ],
            localdata: data
          };
          var dataAdapter = new $.jqx.dataAdapter(source);
          dataAdapter.dataBind();
          var records = dataAdapter.getRecordsHierarchy('Id', 'ParentId', 'items', [
            {name: 'Caption', map: 'label'},
            {name: 'Code', map: 'value'}
          ]);
          ctrl.viewModel.DataGroup.source = records;
          utilsLibrary.showLoading('stop');
          $timeout(function () {
            ctrl.treeDataGroup.expandAll();
          });
          */
        });
      },

      bindInputForm(selectedDataGroup) {
        var ctrl = this;

        //var selectedDataGroup = ctrl.treeDataGroup.getSelectedItem();
        if (selectedDataGroup != undefined) {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "SettingNew.SearchSetting";
          request.R1_ParentCode = "xSetting.Project.Form";
          request.R1_Name = selectedDataGroup.Code;
          //ctrl.viewModel.ListForms = [];
          utilsLibrary.post(request).then(data => {
            data = utilsLibrary.getDataWithRoot(
              data.R1,
              "Data.DynamicDS.Setting"
            );

            this.$set(ctrl.viewModel, "ListForms", data);

            $.each(ctrl.viewModel.ListForms, (key, item) => {
              item.Description = JSON.parse(item.Description);
            });
          });
        } else utilsLibrary.showMessage("error", "Khối dữ liệu chưa được chọn!");
      },

      onSelectDataGroup(item) {
        var ctrl = this;
        var iVal = item[item.length - 1];
        //var item = ctrl.treeDataGroup.getItem(event.args.element);
        //ctrl.dropDownDataGroup.setContent('<div class="dropDown">' + item.label + '</div>');
        //ctrl.dropDownDataGroup.close();
        $.each(ctrl.viewModel.ListDataGroups, (key, dataGroup) => {
          if (dataGroup.Id === iVal) {
            this.selectedDataGroup = dataGroup;
            //return;
          }
        });

        var arrFields = this.selectedDataGroup.Fields;

        ctrl.viewModel.savedMap = {};

        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchSetting";
        request.R1_Name = this.selectedDataGroup.Code;
        request.R1_ParentCode = "xSetting.Project.Import";

        ctrl.bindInputForm(this.selectedDataGroup);
        utilsLibrary.postCheckResult(request).then(data => {
          ctrl.viewModel.savedMap = utilsLibrary.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          ctrl.listfield = [];
          ctrl.objfield = {};
          ctrl.viewModel.listFields = [];

          $.each(arrFields, (key, childNode) => {
            ctrl.listfield.push(childNode.Name);
            ctrl.objfield[childNode.Name] = childNode;
            $.each(ctrl.model.Columns, (key, column) => {
              if (column === childNode.Caption) {
                this.$set(ctrl.viewModel.ValueMap, column, childNode);
              }
            });
          });

          $.each(ctrl.listfield, (item, value) => {
            ctrl.viewModel.listFields.push(ctrl.objfield[value]);
          });

          if (ctrl.viewModel.savedMap.length > 0) {
            if (ctrl.viewModel.savedMap[0].MapFields !== undefined) {
              var arrMapFields = JSON.parse(ctrl.viewModel.savedMap[0].MapFields);
              $.each(arrMapFields, (key, mapField) => {
                $.each(ctrl.model.Columns, (key, column) => {
                  if (column === mapField.Caption) {
                    $.each(arrFields, (key, childNode) => {
                      if (childNode.Name === mapField.DisplayMap)
                        this.$set(ctrl.viewModel.DisplayMap, column, childNode);
                      if (childNode.Name === mapField.ValueMap)
                        this.$set(ctrl.viewModel.ValueMap, column, childNode);
                    });
                  }
                });
              });
            }
          }
        });
      },
      depend(value, column) {
        var ctrl = this;
        if (
          ["Select", "Multi", "Radio", "CombineData", "DataInside"].indexOf(
            value.FormElementType
          ) > -1 &&
          utilsLibrary.isEmpty(ctrl.objfield[value.Name + "Name"]) &&
          !utilsLibrary.isEmpty(value.FormSourceData)
        ) {
          this.$set(
            ctrl.viewModel.DisplayMap,
            column,
            ctrl.objfield[value.Name + "Name"]
          );
        }
      },

      showConfirm(selectedDataGroup) {
        this.$Utils.showConfirm('Cảnh báo', 'Xóa toàn bộ dữ liệu trong bảng dữ liệu này!').then(() => {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = selectedDataGroup.Description.DataSource + '.Search';
          request.R1_RequestDataGroup = selectedDataGroup.Code;
          if (selectedDataGroup.Description.AdditionConditions != '' && selectedDataGroup.Description.AdditionConditions != undefined) {
            $.each(utilsLibrary.stringToArray(selectedDataGroup.Description.AdditionConditions)[0], (key, val) => {
              request['R1_' + key] = val;
            });
          }

          utilsLibrary.post(request).then((data) => {
            data = utilsLibrary.getDataWithRoot(data.R1, selectedDataGroup.Description['RootData']);

            request = this.$Lodash.cloneDeep(this.$singleRequest);
            $.each(data, (index, item) => {
              request['R' + (index + 1) + '_RequestTemplate'] = selectedDataGroup.Description['DataSource'] + '.Delete';
              request['R' + (index + 1) + '_Id'] = item.Id;
              request['R' + (index + 1) + '_DeleteReferenceData'] = item.Id;
              request.TotalRequests = index + 1;
            });
            utilsLibrary.post(request).then((data) => {
              if (data.success) {
                utilsLibrary.showMessage('success', this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
              } else
                utilsLibrary.showMessage('error', this.$toastMessage.updateItemFailed);

            });
          });
        }).catch(() => {

        })
        //return;
      },
      cancel() {
        this.$hub.$emit("close-modal");
      },

      prepareConvert(selectedDataGroup) {
        var ctrl = this;
        var message = "";
        var isValidated = true;

        if (selectedDataGroup == null) {
          isValidated = false;
          message = "Khối dữ liệu";
        }

        if (ctrl.InputForm == "" || ctrl.InputForm == undefined) {
          isValidated = false;
          message = "Form nhập";
        }

        if (isValidated) {
          var request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = "SettingNew.SearchSetting";
          request.R1_Code = ctrl.InputForm;
          if (utilsLibrary.isEmpty(ctrl.InputForm)) {
            utilsLibrary.post(request).then(data => {
              data = utilsLibrary.getDataWithRoot(
                data.R1,
                "Data.DynamicDS.Setting"
              )[0];
              if (data.Description && data.Description.constructor === String)
                data.Description = JSON.parse(data.Description);
              ctrl.viewModel.listDependencies = data.Description.Dependencies;
              ctrl.viewModel.listPermissions = data.Description.Permissions;
              ctrl.convert(selectedDataGroup);
            });
          } else {
            ctrl.convert(selectedDataGroup);
          }
        } else {
          utilsLibrary.showMessage("error", message + " chưa được nhập đầy đủ!");
        }
      },
      convert(selectedDataGroup) {
        var numeral = require("numeral");
        var ctrl = this;
        ctrl.model.isConverted = false;
        ctrl.viewModel.listRequestFields = [];
        ctrl.viewModel.Convert = {
          listColumns: [],
          listRows: [],
          listError: [],
          listView: []
        };
        ctrl.viewModel.Parameters = [];
        ctrl.viewModel.Dupplicate.listData = [];
        ctrl.viewModel.Dupplicate.listServerData = [];
        //utilsLibrary.showLoading('start');
        var arrRequest = [];
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        $.each(ctrl.model.Columns, (key, column) => {
          var valueMap = ctrl.viewModel.ValueMap[column];
          var displayMap = ctrl.viewModel.DisplayMap[column];
          if (valueMap !== undefined) {
            var item = {
              Caption: column,
              ValueMap: valueMap.Name,
              FieldColumnType: valueMap.FieldColumnType,
              FormElementType: valueMap.FormElementType,
              FormExpression: valueMap.FormExpression,
              DynamicText: valueMap.DynamicText,
              FormSourceData: valueMap.FormSourceData
            };
            if (displayMap !== undefined)
              item.DisplayMap =
                displayMap.Name !== undefined
                  ? displayMap.Name
                  : item.ValueMap + "Name";
            if (valueMap.FormSavedKey !== undefined && valueMap.FormSavedKey !== "")
              item.FormSavedKey = valueMap.FormSavedKey
                .replace("{{", "")
                .replace("}}", "");
            if (
              valueMap.FormSavedText !== undefined &&
              valueMap.FormSavedText !== ""
            )
              item.FormSavedText = valueMap.FormSavedText
                .replace("{{", "")
                .replace("}}", "");
            if (
              valueMap.FormExpression !== undefined &&
              valueMap.FormExpression !== ""
            )
              item.FormExpression = valueMap.FormExpression;
            if (valueMap.FormImport !== undefined && valueMap.FormImport !== "")
              item.FormImport = valueMap.FormImport;
            if (valueMap.DynamicText !== undefined && valueMap.DynamicText !== "")
              item.DynamicText = valueMap.DynamicText;
            if (
              valueMap.FormSourceData !== undefined &&
              valueMap.FormSourceData !== ""
            )
              item.FormSourceData = valueMap.FormSourceData;
            if (valueMap.FormDataRoot !== undefined && valueMap.FormDataRoot !== "")
              item.FormDataRoot =
                valueMap.FormDataRoot === "Data"
                  ? "Data.DynamicDS.Setting"
                  : valueMap.FormDataRoot;
            else item.FormDataRoot = "Data.DynamicDS.Setting";
            if (item.FormExpression !== undefined) {
              var arrFormExpression = item.FormExpression
                .replace("{{", "")
                .replace("}}", "")
                .split(".");
              if (arrFormExpression.length > 1) {
                $.each(ctrl.viewModel.listFields, (key, field) => {
                  if (field.Name === arrFormExpression[0]) {
                    var formCode = field.FormCode;
                    request["R" + request.TotalRequests + "_RequestTemplate"] =
                      field.FormRequest === "Setting.SearchSettingTree"
                        ? "Setting.SearchSetting"
                        : field.FormRequest;
                    $.each(
                      utilsLibrary.stringToArray(formCode)[0],
                      (key, val) => {
                        request["R" + request.TotalRequests + "_" + key] = val;
                      }
                    );
                    request.TotalRequests++;
                    item.ValueMap = arrFormExpression[1];
                    item.ValueCompare = field.FormSavedText;
                    arrRequest.push({
                      Name: item.ValueMap,
                      RootData:
                        field.FormDataRoot !== undefined &&
                        field.FormDataRoot !== ""
                          ? field.FormDataRoot
                          : "Data.DynamicDS.Setting"
                    });
                  }
                });

                $.each(ctrl.viewModel.listFields, (key, field) => {
                  if (
                    field.FormElementType === "CombineData" ||
                    field.FormElementType === "DataInside"
                  ) {
                    if (
                      field.FormExpression !== undefined &&
                      field.FormExpression !== "" &&
                      field.FormExpression.split("}}") <= 2
                    ) {
                      var arrFieldFormExpression = field.FormExpression
                        .replace("{{", "")
                        .replace("}}", "")
                        .split(".");
                      if (
                        arrFieldFormExpression.indexOf(arrFormExpression[0]) !== -1 &&
                        item.ValueMap !== arrFieldFormExpression[1]
                      ) {
                        item.DisplayMap = arrFieldFormExpression[1];
                        item.ValueCompare = valueMap.Name;
                      }
                    }
                  }
                });
              } else {
              }
            }

            if (
              ["Select", "Multi", "Radio"].indexOf(valueMap.FormElementType) >=
              0 &&
              !utilsLibrary.isEmpty(valueMap.FormSourceData)
            ) {
              var isSource = false;
              var isTarget = false;
              $.each(ctrl.viewModel.listDependencies, (key, dependency) => {
                if (dependency.Source === item.ValueMap) isSource = true;
                if (
                  dependency.Target === item.ValueMap &&
                  utilsLibrary.isEmpty(valueMap.FormCode) &&
                  valueMap.FormCode.indexOf("ParentId=Id") >= 0
                ) {
                  isTarget = true;
                  item.Source = dependency.Source;
                  item.TargetKey = dependency.TargetKey;
                }
              });
              if (!isTarget) {
                var formCode = "";
                if (valueMap.FormCode !== "" && valueMap.FormCode !== undefined) {
                  formCode = valueMap.FormCode;
                  if (
                    valueMap.FormFullCode !== "" &&
                    valueMap.FormFullCode !== undefined
                  )
                    formCode = valueMap.FormFullCode;
                  request["R" + request.TotalRequests + "_RequestTemplate"] =
                    valueMap.FormRequest === "Setting.SearchBaseTree"
                      ? "Setting.SearchSetting"
                      : valueMap.FormRequest === "Setting.SearchSettingTree"
                      ? "Setting.SearchSetting"
                      : valueMap.FormRequest === "Setting.SearchBase"
                        ? "Setting.SearchSetting"
                        : valueMap.FormRequest;
                  $.each(utilsLibrary.stringToArray(formCode)[0], (key, val) => {
                    if (utilsLibrary.isEmpty(val) && val !== "")
                      request["R" + request.TotalRequests + "_" + key] = val;
                    else {
                      delete request[
                      "R" + request.TotalRequests + "_RequestTemplate"
                        ];
                      request.TotalRequests--;
                    }
                  });
                  if (isSource) {
                    item.Level = request["R" + request.TotalRequests + "_Level"];
                    delete request["R" + request.TotalRequests + "_Level"];
                  }
                  request.TotalRequests++;
                  arrRequest.push({
                    Name: valueMap.Name,
                    RootData: item.FormDataRoot
                  });
                }
              }
            }
            ctrl.viewModel.Convert.listColumns.push(item);
          }
        });
        request.TotalRequests--;
        utilsLibrary.post(request).then(data => {
          if (data.success || request.TotalRequests === 0) {
            for (var i = 1; i <= parseInt(request.TotalRequests); i++) {
              if (data["R" + i].success)
                arrRequest[i - 1].Data = utilsLibrary.getDataWithRoot(
                  data["R" + i],
                  arrRequest[i - 1].RootData
                );
            }
            $.each(ctrl.viewModel.Convert.listColumns, (key, column) => {
              $.each(arrRequest, (rKey, request) => {
                if (column.ValueMap === request.Name) {
                  column.Parameters = request.Data;
                }
                if (column.Source === request.Name) {
                  column.Parameters = request.Data;
                }
              });
            });
            $.each(ctrl.viewModel.Convert.listColumns, (key, column) => {
              if (column.Source !== undefined) {
                if (column.Parameters === undefined) {
                  $.each(ctrl.viewModel.Convert.listColumns, (key, column1) => {
                    if (column.Source === column1.ValueMap) {
                      column.Parameters = column1.Parameters;
                    }
                  });
                }
              }
            });

            var isSettingParameters = true;

            $.each(ctrl.model.Rows, (index, excelRow) => {
              var convert = {listErrors: []};
              $.each(ctrl.viewModel.Convert.listColumns, (key, column) => {
                var excelValue = excelRow[column.Caption];
                if (ctrl.viewModel.Dupplicate.Column === column.Caption) {
                  ctrl.viewModel.Dupplicate.Name = column.ValueMap;
                  if (
                    ctrl.viewModel.Dupplicate.listData.indexOf(excelValue) === -1
                  ) {
                    ctrl.viewModel.Dupplicate.listData.push(excelValue);
                  } else {
                    convert.Index = index + 1;

                    convert.listErrors.push({
                      Caption: "Kiểm tra trùng",
                      Message: excelValue + " bị trùng"
                    });
                  }
                }

                if (excelValue === undefined) {
                  if (
                    column.FieldColumnType === "Double" ||
                    column.FieldColumnType === "Integer" ||
                    column.FieldColumnType === "Float"
                  ) {
                    convert[column.ValueMap] = undefined;
                    ctrl.bindRequestFields(column.ValueMap);
                  }
                } else {
                  if (
                    column.FieldColumnType === "DateTime" ||
                    column.FieldColumnType === "Date"
                  ) {
                    if (new Date(excelValue) !== "Invalid Date") {
                      convert[column.ValueMap] = ctrl.$Utils.formatDateTime(
                        new Date(excelValue)
                      );

                      // Vue.moment(
                      //   new Date(excelValue)
                      // ).format("YYYY-MM-DD");
                    } else {
                      convert.Index = index + 1;
                      convert.listErrors.push({
                        Caption: column.Caption,
                        Message:
                          "Format ngày tháng sai, đặt lại theo định dạng MM/DD/YYYY"
                      });
                    }
                  } else if (
                    column.FieldColumnType === "Double" ||
                    column.FieldColumnType === "Integer"
                  ) {
                    if (excelValue == "0") {
                      convert[column.ValueMap] = 0;
                    } else if (excelValue !== "") {
                      if (numeral(excelValue).value() !== 0) {
                        convert[column.ValueMap] = numeral(excelValue).value();
                      } else {
                        // if (excelValue != 0) {
                        //   convert[column.ValueMap] = excelValue;
                        // }
                        convert.Index = index + 1;
                        convert.listErrors.push({
                          Caption: column.Caption,
                          Message: "Format số sai"
                        });
                      }
                    }
                  } else {
                    convert[column.ValueMap] = excelValue;
                  }
                  ctrl.bindRequestFields(column.ValueMap);
                  if (
                    ["Select", "Multi", "Radio"].indexOf(
                      column.FormElementType
                    ) >= 0 &&
                    !utilsLibrary.isEmpty(column.FormSourceData)
                  ) {
                    var isExist = false;
                    var valueField =
                      column.FormSavedKey !== undefined
                        ? column.FormSavedKey
                        : "Id";
                    var displayField =
                      column.FormSavedText !== undefined
                        ? column.FormSavedText
                        : "Name";
                    if (column.Source !== undefined) {
                      $.each(column.Parameters, (key, parameters) => {
                        if (parameters[displayField] === excelValue) {
                          if (
                            parameters[column.TargetKey] === convert[column.Source]
                          ) {
                            isExist = true;
                            convert[column.ValueMap] = parameters[valueField];
                            if (utilsLibrary.isEmpty(column.DisplayMap)) {
                              convert[column.DisplayMap] =
                                parameters[displayField];
                            } else {
                              convert[column.DynamicText] =
                                parameters[displayField];
                            }
                          }
                        }
                      });
                    } else {
                      $.each(column.Parameters, (key, parameters) => {
                        if (column.Level !== undefined) {
                          if (
                            parameters[displayField] === excelValue &&
                            parameters.Level === column.Level
                          ) {
                            isExist = true;
                            convert[column.ValueMap] = parameters[valueField];
                            if (utilsLibrary.isEmpty(column.DisplayMap)) {
                              convert[column.DisplayMap] =
                                parameters[displayField];
                            } else {
                              convert[column.DynamicText] =
                                parameters[displayField];
                            }
                          }
                        } else {
                          if (parameters[displayField] === excelValue) {
                            isExist = true;
                            if (column.FormImport !== undefined) {
                              convert[column.FormImport] = parameters[valueField];
                              ctrl.bindRequestFields(column.FormImport);
                              // delete convert[column.ValueMap];
                            } else {
                              convert[column.ValueMap] = parameters[valueField];
                            }
                            if (utilsLibrary.isEmpty(column.DisplayMap)) {
                              convert[column.DisplayMap] =
                                parameters[displayField];
                            } else {
                              convert[column.DynamicText] =
                                parameters[displayField];
                            }
                          }
                        }
                      });
                    }
                    // ctrl.bindRequestFields(column.ValueMap);
                    if (utilsLibrary.isEmpty(column.DisplayMap)) {
                      ctrl.bindRequestFields(column.DisplayMap);
                    } else {
                      ctrl.bindRequestFields(column.DynamicText);
                    }
                    if (!isExist) {
                      convert.Index = index + 1;
                      convert.listErrors.push({
                        Caption: column.Caption,
                        Message: "Dữ liệu không tồn tại trong bảng tham số"
                      });
                    }
                  }

                  if (
                    column.FormExpression !== undefined &&
                    column.DisplayMap !== undefined
                  ) {
                    var isExist = false;
                    var fieldCaptionCompare = "";
                    $.each(ctrl.viewModel.Convert.listColumns, (key, item) => {
                      if (item.ValueMap.indexOf(column.ValueCompare) !== -1) {
                        fieldCaptionCompare = item.Caption;
                      }
                    });

                    $.each(column.Parameters, (key, parameters) => {
                      if (
                        column.FormExpression !== undefined &&
                        column.FormExpression !== "" &&
                        utilsLibrary.isEmpty(column.DisplayMap)
                      ) {
                        if (
                          parameters[column.ValueCompare + "Name"] ===
                          excelRow[fieldCaptionCompare]
                        ) {
                          isExist = true;
                          convert[column.ValueMap] = parameters[column.ValueMap];
                          if (utilsLibrary.isEmpty(column.DisplayMap)) {
                            convert[column.DisplayMap] =
                              parameters[column.ValueMap + "Name"];
                          } else {
                            convert[column.DynamicText] =
                              parameters[column.ValueMap + "Name"];
                          }
                          ctrl.bindRequestFields(column.ValueMap);
                          if (utilsLibrary.isEmpty(column.DisplayMap)) {
                            ctrl.bindRequestFields(column.DisplayMap);
                          } else {
                            ctrl.bindRequestFields(column.DynamicText);
                          }
                        }
                      } else if (
                        parameters[column.ValueCompare] ===
                        excelRow[fieldCaptionCompare]
                      ) {
                        isExist = true;
                        convert[column.ValueMap] = parameters[column.ValueMap];
                        if (utilsLibrary.isEmpty(column.DisplayMap)) {
                          convert[column.DisplayMap] = parameters["Name"];
                        } else {
                          convert[column.DynamicText] = parameters["Name"];
                        }
                        // ctrl.bindRequestFields(column.ValueMap);
                        if (utilsLibrary.isEmpty(column.DisplayMap)) {
                          ctrl.bindRequestFields(column.DisplayMap);
                        } else {
                          ctrl.bindRequestFields(column.DynamicText);
                        }
                      }
                    });
                    if (!isExist) {
                      convert.Index = index + 1;
                      convert.listErrors.push({
                        Caption: column.Caption,
                        Message: "Dữ liệu không tồn tại trong bảng tham số"
                      });
                    }
                  }
                }
              });



              if (convert.listErrors.length > 0) {
                ctrl.viewModel.Convert.listError.push(convert);
              } else {
                delete convert.listErrors;
                if (
                  convert["undefined"] !== undefined &&
                  convert["undefined"] !== ""
                ) {
                  isSettingParameters = false;
                }
                var FieldsSorted = [];
                if (utilsLibrary.isEmpty(ctrl.viewModel.listRequestFields)) {
                  $.each(ctrl.viewModel.listRequestFields, (key, value) => {
                    $.each(convert, (name, item) => {
                      if (name === value) {
                        FieldsSorted.push(item);
                      }
                    });
                  });
                  ctrl.viewModel.Convert.listView.push(FieldsSorted);
                  ctrl.viewModel.Convert.listRows.push(convert);
                }
              }
            });
            if (isSettingParameters) {
              if (ctrl.viewModel.Convert.listError.length === 0) {
                var arrMapFields = [];
                $.each(ctrl.viewModel.Convert.listColumns, (key, value) => {
                  arrMapFields.push({
                    Caption: value.Caption,
                    DisplayMap: value.DisplayMap
                      ? value.DisplayMap
                      : value.DynamicText,
                    ValueMap: value.ValueMap
                  });
                });

                var requestSavedMap = this.$Lodash.cloneDeep(this.$singleRequest);
                requestSavedMap.R1_Name = selectedDataGroup.Code; // ctrl.treeDataGroup.getSelectedItem().value;
                requestSavedMap.R1_Code = utilsLibrary.removeVNCharacters(
                  ctrl.InputForm.Caption
                );
                requestSavedMap.R1_MapFields = JSON.stringify(arrMapFields);

                if (ctrl.viewModel.savedMap.length === 0) {
                  requestSavedMap.R1_RequestTemplate = "Setting.Insert";
                  requestSavedMap.R1_NestedSetType = "InsertLastChildNode";
                  //Id của Node có Code là xSetting.Project.Import
                  requestSavedMap.R1_ReferenceId =
                    "9c0c92cc-04df-4d61-a8c1-fe0d57e737db";
                } else {
                  requestSavedMap.R1_RequestTemplate = "Setting.Update";
                  requestSavedMap.R1_Id = ctrl.viewModel.savedMap[0].Id;
                }

                //if (ctrl.viewModel.savedMap.length > 0) {
                //    if (utilsLibrary.isEmpty(ctrl.viewModel.savedMap[0], 'Id')) {
                //
                //    }
                //}

                utilsLibrary.post(requestSavedMap).then(data => {
                  if (data.success) {
                    ctrl.viewModel.savedMap = [{Id: data.R1.Data}];
                  }
                });
              }
              ctrl.model.isConverted = true;
            } else {
              ctrl.model.isConverted = false;
              ctrl.viewModel.Convert = {
                listColumns: [],
                listRows: [],
                listError: [],
                listView: []
              };
              utilsLibrary.showMessage(
                "error",
                "Trường hiển thị của các dữ liệu tham số chưa được chọn đầy đủ!"
              );
            }
          } else {
            utilsLibrary.showMessage("error", "Không lấy được dữ liệu tham số!");
          }
          ///utilsLibrary.showLoading('stop');
        });
      },

      bindRequestFields(field) {
        var ctrl = this;
        if (
          utilsLibrary.isEmpty(field) &&
          ctrl.viewModel.listRequestFields.indexOf(field) === -1
        ) {
          if (field.indexOf("{") === -1) {
            ctrl.viewModel.listRequestFields.push(field);
          }
        }
      },

      excuteImport(selectedDataGroup) {
        var ctrl = this;
        if (ctrl.viewModel.Convert.listRows.length > 0) {
          ctrl.viewModel.listLogs = [];
          $.each(ctrl.viewModel.ListDataGroups, (key, item) => {
            if (item.Code == selectedDataGroup.value) {
              selectedDataGroup = item;
            }
          });

          $.each(ctrl.viewModel.listFields, (key, field) => {
            ctrl.bindRequestFields(field.Name);
          });

          var arrAdditionConditions = [];
          if (
            selectedDataGroup.Description["AdditionConditions"] !== "" &&
            selectedDataGroup.Description["AdditionConditions"] !== undefined
          ) {
            arrAdditionConditions = utilsLibrary.stringToArray(
              selectedDataGroup.Description["AdditionConditions"]
            )[0];
            $.each(arrAdditionConditions, (key, val) => {
              if (val.indexOf("{") === -1) {
                ctrl.bindRequestFields(key);
              }
            });
          }
          var strRequestFields = "";
          $.each(ctrl.viewModel.listRequestFields, (key, field) => {
            strRequestFields += field + ";";
          });
          if (
            ctrl.viewModel.Dupplicate.Column !== undefined &&
            ctrl.viewModel.Dupplicate.Column !== ""
          ) {
            var requestServer = this.$Lodash.cloneDeep(this.$singleRequest);
            requestServer.R1_RequestTemplate =
              selectedDataGroup.Description["DataSource"] + ".Search";
            requestServer.R1_RequestFields =
              "Id;" + ctrl.viewModel.Dupplicate.Name;
            requestServer.R1_RequestDataGroup = selectedDataGroup.Code;
            $.each(arrAdditionConditions, (key, val) => {
              if (val.indexOf("{") == -1) {
                requestServer["R1_" + key] = val;
              }
            });
            utilsLibrary.post(requestServer).then((data) => {
              if (data.success) {
                ctrl.viewModel.Dupplicate.listServerData = this.$Lodash.cloneDeep(utilsLibrary.getDataWithRoot(
                  data.R1,
                  selectedDataGroup.Description["RootData"]
                ));
                ctrl.excuteImportRequest(
                  selectedDataGroup,
                  arrAdditionConditions,
                  strRequestFields,
                );
              } else utilsLibrary.showMessage("error", ctrl.$toastMessage.updateItemFailed);
            });
          } else {
            ctrl.excuteImportRequest(
              selectedDataGroup,
              arrAdditionConditions,
              strRequestFields,
            );
          }
        } else {
          utilsLibrary.showMessage(
            "error",
            "Danh sách dữ liệu chuyển đổi được không có dữ liệu"
          );
        }
      },

      excuteImportRequest(selectedDataGroup, arrAdditionConditions, strRequestFields) {
        var ctrl = this;
        var mod = ctrl.viewModel.Convert.listRows.length < ctrl.viewModel.NumberRequestPerTime ? ctrl.viewModel.Convert.listRows.length : ctrl.viewModel.NumberRequestPerTime;
        var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        for (var i = 0; i < ctrl.viewModel.Convert.listRows.length; i++) {
          var index = i % mod;
          var row = ctrl.viewModel.Convert.listRows[i];
          $.each(row, (key, value) => {
            request["R" + (index + 1) + "_" + key] = value;
          });
          $.each(arrAdditionConditions, (key, val) => {
            request["R" + (index + 1) + "_" + key] = val;
          });
          request["R" + (index + 1) + "_RequestTemplate"] =
            selectedDataGroup.Description["DataSource"] + ".Insert";
          request["R" + (index + 1) + "_RequestDataGroup"] =
            selectedDataGroup.Code;
          request["R" + (index + 1) + "_ModifiedByName"] = "Import";
          request["R" + (index + 1) + "_RequestFields"] = strRequestFields;
          $.each(ctrl.viewModel.Dupplicate.listServerData, (key, server) => {
            if (server[ctrl.viewModel.Dupplicate.Name] === row[ctrl.viewModel.Dupplicate.Name]) {
              request["R" + (index + 1) + "_RequestTemplate"] =
                selectedDataGroup.Description["DataSource"] + ".Update";
              request["R" + (index + 1) + "_Id"] = server.Id;
              delete server.Data;

              var requestServer = this.$Lodash.cloneDeep(this.$singleRequest);
              requestServer.R1_RequestTemplate =
                this.selectedDataGroup.Description["DataSource"] + ".Search";
              requestServer.R1_RequestFields = "";
              requestServer.R1_RequestDataGroup = this.selectedDataGroup.Code;
              requestServer.R1_Id = server.Id;
              this.selectedDataGroup.Fields.forEach(item => {
                if (item.History === 'true') {
                  requestServer.R1_RequestFields += item.Name + ";";
                }
              });

              utilsLibrary.post(requestServer).then((data) => {
                row.SourceData = this.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document')[0];
              });
            }
          });
          if ((i !== 0 && index === mod - 1) || (i === ctrl.viewModel.Convert.listRows.length - 1)) {
            request.TotalRequests = index + 1;
            utilsLibrary.post(request).then(data => {
              if (data.success) {
                var log = {
                  total: 0,
                  Success: 0,
                  Failed: 0,
                  Message: "",
                  Inserted: 0,
                  Updated: 0
                };

                $.each(data, (k, v) => {
                  if (k.indexOf('R') === 0) {
                    if (v.success) {
                      var item = ctrl.viewModel.Convert.listRows[ctrl.importedCount];
                      item.Id = v.Data;
                      log.Success++;
                      if (v.msg.indexOf("inserted with Id ") !== -1) {
                        log.Inserted++;
                        ctrl.addPermissionToObject(item);
                      } else if (v.msg.indexOf("updated with Id ") !== -1) {
                        log.Updated++;
                        ctrl.createHistoryLogs(
                          item,
                          item.SourceData !== undefined ? item.SourceData : []
                        );
                      }
                    } else {
                      log.Failed++;
                      log.Message = v.msg;
                    }
                    log.total++;
                    ctrl.importedCount++;
                  }
                });
                ctrl.viewModel.listLogs.push(log);
              } else
                utilsLibrary.showMessage(
                  "error",
                  ctrl.$toastMessage.updateItemFailed
                );
            });
            request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          }

        }
      },
      createArrChanged(returnData, arrData) {
        var ctrl = this;
        var arrChanged = [];
        /** using for loop compare each field in ctrl.objectSourceData with returnData,
         * if different push a object with fields: ColumnCaption, ColumnName, OldValue, NewValue,
         * OldDisplayValue, NewDisplayValue to arrChanged
         */
        $.each(returnData, (key, val) => {
          if (arrData[key] &&
            arrData[key] !== val.toString() &&
            !(!utilsLibrary.isEmpty(arrData[key]) && val.toString() === "")
          ) {
            /** kiểm tra có tồn tại trường có Name tương úng hay không, nêu đây là combo select, sử dụng caption để hiển thị*/
            var caption = utilsLibrary.isEmpty(ctrl.fields, key + ".Caption")
              ? ctrl.fields[key].Caption
              : key;
            if (key.length > 4 && key.indexOf("Name") > 0) {
              var name = key.substr(0, key.length - 4);
              if (utilsLibrary.isEmpty(ctrl.fields, name)) {
                caption = ctrl.fields[name].Caption
                  ? ctrl.fields[name].Caption
                  : name;
              }
            }
            var submit = {};
            $.each(arrData, (key, object) => {
              if (object.name === key) {
                submit = this.$Lodash.cloneDeep(object);
              }
            });
            var changedObject = {
              ColumnCaption: caption,
              ColumnName: key,
              OldDisplayValue: submit.oldDisplay
                ? submit.oldDisplay
                : arrData[key],
              OldValue: arrData[key],
              NewDisplayValue: submit.display ? submit.display : val,
              NewValue: val
            };
            /**
             * so sánh dựa trên phân loại của dữ liệu trong trường hợp dữ liệu là ngày tháng hay số thực
             */
            //if (utilsLibrary.isEmpty(ctrl.fields[key])) {
            //    switch (ctrl.fields[key].FieldColumnType) {
            //        case 'DateTime':
            //            if (utilsLibrary.stringToDate(val).getTime() == utilsLibrary.stringToDate(arrData[key]).getTime()) {
            //                changedObject = undefined;
            //            }
            //            break;
            //        case 'Double':
            //            if (parseFloat(val) == parseFloat(arrData[key])) {
            //                changedObject = undefined;
            //            }
            //            break;
            //    }
            //}
            if (changedObject) {
              arrChanged.push(changedObject);
            }
          }
        });
        return arrChanged;
      },

      createHistoryLogs(returnData, arrData) {
        var ctrl = this;
        var arrChanged = ctrl.createArrChanged(returnData, arrData);
        if (arrChanged.length > 0) {
          var countHistory = this.$Lodash.cloneDeep(this.$singleRequest);
          countHistory.R1_RequestTemplate = "ChangedLogs.Count";
          countHistory.R1_SourceId = returnData.Id;
          countHistory.R1_Code = "ImportHistory";
          utilsLibrary.post(countHistory).then(result => {
            if (utilsLibrary.isEmpty(result, "R1.Data")) {
              var insertRequest = countHistory;
              insertRequest.R1_RequestTemplate = "ChangedLogs.Insert";
              insertRequest.R1_Version = parseInt(result.R1.Data) + 1;
              insertRequest.R1_Changes = JSON.stringify(arrChanged);
              insertRequest.R1_CreatedByName = utilsLibrary.getUserInfo("Username");
              utilsLibrary.post(insertRequest).then(insertResult => {
                if (insertResult.success && insertResult.R1.success) {
                  /** do something after insert history success*/
                } else {
                  utilsLibrary.showMessage(
                    "error",
                    ctrl.$toastMessage.insertHistoryFailed +
                    (returnData.Name ? returnData.Name : "")
                  );
                }
              });
            } else {
              utilsLibrary.showMessage(
                "error",
                ctrl.$toastMessage.insertHistoryFailed +
                (returnData.Name ? returnData.Name : "")
              );
            }
          });
        }
      },

      addPermissionToObject(object, count, arrRequest) {
        /** set up default value*/
        var ctrl = this;
        count = utilsLibrary.isEmpty(count) ? count : 0;
        arrRequest = utilsLibrary.isEmpty(arrRequest) ? arrRequest : [];
        if (count < ctrl.viewModel.listPermissions.length) {
          var permissionSetting = this.$Lodash.cloneDeep(
            ctrl.viewModel.listPermissions[count]
          );
          switch (permissionSetting.Name) {
            case "Static":
              if (
                permissionSetting.Permissions &&
                permissionSetting.Permissions.constructor === String
              ) {
                var objectPermission = utilsLibrary.stringToArray(
                  permissionSetting.Permissions
                  )[0],
                  arr = [];
                for (var i = 1; i <= objectPermission.Count; i++) {
                  arr.push({
                    Value: objectPermission["Value" + i],
                    KeyCode: objectPermission["KeyCode" + i]
                  });
                }
                permissionSetting.Permissions = arr;
              }
              /**
               * Trường hợp phân quyền cho các giá trị có Id có setting trước trong setting.Value
               * VD: bắn quyền cho role Manager với Id là abc-xyz
               */
              $.each(permissionSetting.Permissions, (key, setting) => {
                if (utilsLibrary.isEmpty(setting.Value) && setting.Value != "") {
                  var arrCode =
                    setting.KeyCode && setting.KeyCode.constructor === String
                      ? setting.KeyCode.split(";")
                      : [];
                  $.each(arrCode, (key, code) => {
                    if (code.trim() != "") {
                      arrRequest.push({
                        RequestClass: "xBase",
                        Parent: object.Id,
                        Child: setting.Value,
                        Code: code,
                        Name: object.Name + " - " + code,
                        RequestAction: "LinkGroupToObject",
                        ParentTable: "xObject",
                        ChildTable: "tblGroup"
                      });
                    }
                  });
                }
              });
              ctrl.addPermissionToObject(object, count + 1, arrRequest);
              break;
            case "Dynamic":
              if (
                permissionSetting.Permissions &&
                permissionSetting.Permissions.constructor === String
              ) {
                var objectPermission = utilsLibrary.stringToArray(
                  permissionSetting.Permissions
                  )[0],
                  arr = [];
                for (var i = 1; i <= objectPermission.Count; i++) {
                  arr.push({
                    Value: objectPermission["Value" + i],
                    KeyCode: objectPermission["KeyCode" + i]
                  });
                }
                permissionSetting.Permissions = arr;
              }
              /**
               * Trường hợp phân quyền cho các giá trị tồn tại sẵn trong object, dựa theo danh sách tên các
               * trường trong object để lấy ra Id và thêm vào các quyền tương ứng trong setting.KeyCode
               * VD: bắn phân quyền cho CustomerParent
               */
              $.each(permissionSetting.Permissions, (key, setting) => {
                if (
                  utilsLibrary.isEmpty(setting.Value) &&
                  object[setting.Value]
                ) {
                  var arrCode =
                    setting.KeyCode && setting.KeyCode.constructor === String
                      ? setting.KeyCode.split(";")
                      : [];
                  $.each(arrCode, (key, code) => {
                    if (code.trim() != "") {
                      arrRequest.push({
                        RequestClass: "xBase",
                        Parent: object.Id,
                        Child: object[setting.Value],
                        Code: code,
                        Name: object.Name + " - " + code,
                        RequestAction: "LinkGroupToObject",
                        ParentTable: "xObject",
                        ChildTable: "tblGroup"
                      });
                    }
                  });
                }
              });
              ctrl.addPermissionToObject(object, count + 1, arrRequest);
              break;
            case "Replica":
              /**
               * Trường hợp sao chép quyền từ các trường với Id tồn tại sẵn trong object,
               * VD: Sao chép quyền của dự án vào công việc
               * lấy ra tất cả các link object có parent là giá trị cần sao chép quyền,
               * xóa Id của tất cả các link nhận được và đội parent thành Id của Object hiện tại
               */
              var stringId = "",
                staticId =
                  permissionSetting.StaticPermissions &&
                  permissionSetting.StaticPermissions.constructor === String
                    ? permissionSetting.StaticPermissions.split(";")
                    : [],
                dynamicFields = (permissionSetting.DynamicPermissions,
                permissionSetting.DynamicPermissions.constructor === String)
                  ? permissionSetting.DynamicPermissions.split(";")
                  : [];
              $.each(staticId, (key, id) => {
                if (id != "") {
                  stringId += id + ";";
                }
              });
              $.each(dynamicFields, (key, field) => {
                if (utilsLibrary.isEmpty(object[field]) && object[field] != "") {
                  stringId += object[field] + ";";
                }
              });
              /** tạo reqeuest search các objectLink theo danh sách Id vừa tạo*/
              var requestSearchLink = this.$Lodash.cloneDeep(this.$singleRequest);
              requestSearchLink.RequestTemplate = "Permission";
              requestSearchLink.R1_Parent = stringId;
              if (stringId != "") {
                utilsLibrary.post(requestSearchLink).then((result) => {
                  $.each(
                    utilsLibrary.getDataWithRoot(result, "R1.Data.DataDS.Linked"),
                    (key, linkObject) => {
                      linkObject.Name = object.Name + "(" + linkObject.Name + ")";
                      linkObject.RequestClass = "xBase";
                      linkObject.Parent = object.Id;
                      linkObject.RequestAction = "LinkGroupToObject";
                      linkObject.ParentTable = "xObject";
                      linkObject.ChildTable = "tblGroup";
                      delete linkObject.Id;
                      arrRequest.push(linkObject);
                    }
                  );
                  ctrl.addPermissionToObject(object, count + 1, arrRequest);
                });
              } else {
                ctrl.addPermissionToObject(object, count + 1, arrRequest);
              }
              break;
            case "Script":
              if (
                permissionSetting.Permissions &&
                permissionSetting.Permissions.constructor === String
              ) {
                var objectPermission = utilsLibrary.stringToArray(
                  permissionSetting.Permissions
                  )[0],
                  arr = [];
                for (var i = 1; i <= objectPermission.Count; i++) {
                  arr.push({
                    Value: objectPermission["Value" + i],
                    KeyCode: objectPermission["KeyCode" + i]
                  });
                }
                permissionSetting.Leadership = arr;
              }
              /** trường hợp bắn quyền cho quản lý cấp cao hơn*/
              if (utilsLibrary.isEmpty(permissionSetting.Leadership)) {
                /** lấy id của group sẽ bắn quyền dựa vào LeadershipDynamicOrganization hoặc user data*/
                var baseGroup = utilsLibrary.isEmpty(
                  permissionSetting.LeadershipDynamicOrganization
                  )
                  ? object[permissionSetting.LeadershipDynamicOrganization]
                  : utilsLibrary.getUserInfo("GroupRoot"),
                  groupId = "";
                /** lấy danh sách sơ đồ tổ chức trong hệ thống*/
                utilsLibrary.getListGroup((organization) => {
                  /** lấy GroupId của các tổ chức cấp cao hơn so với baseGroup*/
                  while (utilsLibrary.isEmpty(baseGroup)) {
                    var exist = false;
                    for (var i = 0; i < organization.length; i++) {
                      if (
                        utilsLibrary.isEmpty(baseGroup) &&
                        organization[i].GroupId.toLowerCase() ===
                        baseGroup.toLowerCase()
                      ) {
                        groupId += baseGroup + ";";
                        baseGroup = organization[i].GroupParent;
                        exist = true;
                        break;
                      }
                    }
                    if (!exist) {
                      baseGroup = undefined;
                    }
                  }
                  /** tạo danh sách các role cần bắn phân quyền*/
                  var roles = [];
                  $.each(permissionSetting.Leadership, (key, setting) => {
                    roles.push(setting.Value);
                  });
                  if (roles != "") {
                    /** gọi hàm lấy danh sách người dùng, có quyền tương ứng trong tổ chức*/
                    utilsLibrary
                      .getUserFromGroupAndListRole(groupId, roles)
                      .then(listUser => {
                        /** chạy vòng lặp với mỗi user để lấy ra UserId*/
                        $.each(listUser, (key, user) => {
                          /** bổ sung thêm các quyền như View, Edit từ Leadership vào object phân quyền*/
                          $.each(permissionSetting.Leadership, (key, setting) => {
                            if (setting.Value == user.RoleId) {
                              var codes =
                                setting.KeyCode &&
                                setting.KeyCode.constructor === String
                                  ? setting.KeyCode.split(";")
                                  : [];
                              $.each(codes, (key, code) => {
                                arrRequest.push({
                                  RequestClass: "xBase",
                                  Parent: object.Id,
                                  Child: user.UserId,
                                  Code: code,
                                  Name: object.Name + " - " + user.Username,
                                  RequestAction: "LinkUserToObject",
                                  ParentTable: "xObject",
                                  ChildTable: "tblUser"
                                });
                              });
                            }
                          });
                        });
                        ctrl.addPermissionToObject(object, count + 1, arrRequest);
                      });
                  } else {
                    ctrl.addPermissionToObject(object, count + 1, arrRequest);
                  }
                });
              } else {
                ctrl.addPermissionToObject(object, count + 1, arrRequest);
              }
              break;
            case "Remove":
              ctrl.addPermissionToObject(object, count + 1, arrRequest);
              break;
          }
        } else {
          /** tạo request sử dụng template request mặc định trên setting, có thể bị lỗi nếu không có setting*/
          var paramsLink = {
            RequestClass: "xBase",
            RequestAction: "Request",
            TotalRequests: arrRequest.length,
            RequestTemplate: "Permission.Insert"
          };
          /** gửi thông báo tạo mới/thay đổi khi có setting*/
          $.each(arrRequest, (index, requet) => {
            $.each(requet, (key, val) => {
              paramsLink["R" + (index + 1) + "_" + key] = val;
            });
          });
          /** post permission request */
          utilsLibrary.post(paramsLink);
        }
      },

      init() {
        var dataToPass = this.data;
        var ctrl = this;
        ctrl.dtOptions = {
          paging: false,
          searching: false,
          autoWidth: false,
          showNEntries: false,
          responsive: true
        };
        var sheet = this.$Lodash.cloneDeep(dataToPass.item);
        ctrl.model.Columns = sheet.Columns;
        ctrl.model.Rows = sheet.Rows;
        ctrl.model.isConverted = false;
        ctrl.bindDataGroupSource();
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      importedCount: function (newVal) {
        if (newVal === this.viewModel.Convert.listRows.length) {
          utilsLibrary.showMessage(
            "success",
            this.$toastMessage.updateItemPre +
            this.$toastMessage.updateItemSuf
          );
          this.data.item.isImported = true;
        }
      }
    }
  };
</script>

