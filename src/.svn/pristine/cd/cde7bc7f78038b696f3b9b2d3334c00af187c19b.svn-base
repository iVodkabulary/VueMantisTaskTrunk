<template>
  <el-container class="dynamic-form">
    <!--     <el-header>
          Header dynamic form   {{this.$route.query.index}}
        </el-header> -->
    <el-main>
      <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline" ref="formInline">
        <el-col :span="24">
          <SubsDynamicPage :data="subElementObject" v-if="subElementObject && subElementObject.Module && subElementObject.Module.length > 0" />
          <el-form-item v-if="item" v-for="item in listElements" :key="item.Code" :prop="item.Name" :label="item.ElementType!='Header' ? item.Caption : undefined" :class="(item.ColumnFlex ? 'col-xs-12 col-md-' + (item.ColumnFlex/100) * 12 : 'col-xs-12 col-sm-4 col-lg-4') + ' ' + (item.ElementType === 'Header' ? 'header-ele' : '')">
            <DynamicInput :name="item.Name" :item="item" :data="Setting.sendData" :callback='handleChildChange' />
          </el-form-item>
        </el-col>
      </el-form>
    </el-main>
    <!--     <div>
          <UploadFile :parent="Setting.sendData" :idSetting="Setting"/>
        </div>
        <div>
          <Comment :parent="Setting.sendData" :idSetting="Setting"/>
        </div>
        <div>
          <History :parent="Setting.sendData" :idSetting="Setting"/>
        </div> -->
    <el-footer height="auto" v-if="Setting.directiveType != 'inside'">
      <b-card class="text-right button-list">
        <DynamicButton v-for="button in listButton" :key="button.Code" :data="Setting.sendData" :setting="button" v-show="!button.hiddenInForm" v-if="button" />
      </b-card>
      <b-card>
        <el-collapse v-model="activeName">
          <el-collapse-item title="Tài liệu đính kèm" name="1" v-if="Setting.HasFileTab">
            <UploadFile :parent="Setting.sendData" :idSetting="Setting" />
          </el-collapse-item>
          <el-collapse-item title="Bình luận" v-if="Setting.HasCommentTab && Setting.sendData && Setting.sendData.Id && Setting.functions" name="2">
            <Comment :parent="Setting.sendData" :idSetting="Setting" :button="currentButtonSetting" />
          </el-collapse-item>
          <!-- <el-collapse-item title="Người theo dõi" name="Follower">
            <Follower/>
          </el-collapse-item> -->
          <el-collapse-item title="Lịch sử" v-if="Setting.HasHistoryTab && Setting.sendData && Setting.sendData.Id" name="3">
            <History :parent="Setting.sendData" :idSetting="Setting" />
          </el-collapse-item>
        </el-collapse>
        <el-button v-if="$isSystemAdmin() && Setting.sendData && Setting.sendData.Id" @click="showPermission(Setting.sendData.Id)">Phân quyền</el-button>
      </b-card>
      <!-- <el-button style="float: right; margin-left: 10px" type="default" @click="resetForm('dynamicfilterform')">Xóa trắng</el-button>
      <el-button style="float: right; margin-left: 10px" type="primary" @click="getElementData(0, [])">Tìm kiếm</el-button> -->
      <!-- <el-button v-for="button in listButton" style="float: right; margin-left: 10px" type="default">{{button.Caption}}</el-button> -->
    </el-footer>
  </el-container>
</template>

<script>
import DynamicInput from "@/components/dynamic/DynamicInput";
// import DynamicPage from "@/components/dynamic/DynamicPage";
import DynamicButton from "@/components/dynamic/DynamicButton";
import Comment from "@/components/dynamic/Comment";
import UploadFile from "@/components/static/UploadFile";
import History from "@/components/static/History";
import PermissionSelector from "@/components/static/PermissionSelector";

export default {
  components: { DynamicInput, DynamicButton, UploadFile, History, Comment, PermissionSelector },
  props: ["pSetting", "rootScopePushServer"],
  data() {
    return {
      activeName: ["1", "2"],
      subElementObject: {},
      Setting: this.pSetting,
      ListInside: {},
      listElements: [],
      permissionFlag: false,
      historyFlag: false,
      Show: [],
      dayOWeek: [],
      Showa: true,
      WorkTime: 6,
      viewModel: { currentPage: 1, tabActive: [] },
      objSourceData: {},
      formInline: {},
      arrResult: {},
      rules: {},
      listButton: [],
      currentButtonSetting: {},
      ChildFields: '',
    };
  },
  methods: {
    showPermission(id){
       this.$hub.$emit(
          "set-modal-data",
          "Phân quyền",
          "80%",
          true,
          "left",
          PermissionSelector,
          true,
          '',
          id
        );
    },
    handleChildChange(item) {
      // var obj = {};
      this.formInline[item.name] =
        item.model.ElementType == "Text" &&
        item.model.FieldColumnType == "DateTime"
          ? this.$Utils.formatDateTime(item.values)
          : item.values;
      if (
        item.model.ElementType === "Select" ||
        item.model.ElementType === "Multi" ||
        item.model.ElementType === "Radio" ||
        item.model.ElementType === "Tree" ||
        item.model.ElementType === "MultiTree"
      ) {
        var ori = {};
        if (this.$Utils.isEmpty(item.model, "Data")) {
          if (
            item.values &&
            item.values != "" &&
            typeof item.values !== "string"
          ) {
            // item.oldValues = this.$Lodash.cloneDeep(item.values)
            item.newValues = "";
            item.valuesName = "";
            ori = [];
            var sourceData = item.model.sourceData
              ? item.model.sourceData
              : item.model.Data;
            item.values.forEach(val => {
              var obj = sourceData.filter(el => {
                return el[item.model.SavedKey] == val;
              })[0];
              if (obj) {
                item.newValues += val + ";";
                item.valuesName += obj[item.model.SavedText] + ";";
                ori.push(obj);
              }
            });
            this.arrResult[item.name] = {
              name: item.name,
              value: item.newValues,
              validate: true,
              setting: item.model,
              ori: ori,
              submit: true
            };
            this.arrResult[item.name + "Name"] = {
              name: item.name + "Name",
              value: item.valuesName,
              validate: true,
              setting: item.model,
              ori: ori,
              submit: true
            };
            // console.log(this.arrResult)
          } else {
            ori = item.model.Data.filter(el => {
              return el[item.model.SavedKey] == item.values;
            })[0];
            if (ori) {
              this.arrResult[item.name] = {
                name: item.name,
                value: item.values,
                validate: true,
                setting: item.model,
                ori: ori,
                submit: true
              };
              this.arrResult[item.name + "Name"] = {
                name: item.name + "Name",
                value: ori[item.model.SavedText],
                validate: true,
                setting: item.model,
                ori: ori,
                submit: true
              };
            } else delete this.arrResult[item.name];
          }
        }
      } else if (
        item.model.ElementType == "Text" &&
        item.model.FieldColumnType == "DateTime"
      ) {
        this.arrResult[item.name] = {
          name: item.name,
          value: this.$Utils.formatDateTime(item.values),
          display: this.$Lodash.cloneDeep(
            this.$Utils.formatDateTime(item.values, "DD/MM/YYYY HH:mm")
          ),
          oldDisplay: this.objSourceData[item.name],
          setting: item.model,
          submit: true,
          validate: true
        };
      } else if (
        item.model.ElementType == "Text" &&
        item.model.FieldColumnType == "Double"
      ) {
        this.arrResult[item.name] = {
          name: item.name,
          value: item.values
            ? parseFloat((item.values + "").replace(/,/gi, ".")).toFixed(2)
            : item.values === "" && item.values.ItemRequired == true ? "" : 0.0,
          display: item.values
            ? parseFloat((item.values + "").replace(/,/gi, ".")).toFixed(2)
            : item.values === "" && item.values.ItemRequired == true ? "" : 0.0,
          oldDisplay: this.objSourceData[item.name],
          setting: item.model,
          submit: true,
          validate: true
        };
      } else if (item.model.ElementType == "Html") {
        this.arrResult[item.name] = {
          name: item.name,
          value: this.$Utils.encodeHtmlEntities(item.values),
          display: this.$Lodash.cloneDeep(item.values),
          oldDisplay: this.objSourceData[item.name],
          setting: item.model,
          validate: true,
          submit: true
        };
      } else {
        this.arrResult[item.name] = {
          name: item.name,
          value: item.values,
          display: this.$Lodash.cloneDeep(item.values),
          oldDisplay: this.objSourceData[item.name],
          setting: item.model,
          validate: true,
          submit: true
        };
      }
      // console.log(this.arrResult)
    },
    loadFormSetting() {},
    init() {
      /**
      this.isSystemAdmin = this.$isSystemAdmin();
      this.isMantisAdmin = this.$isMantisAdmin();
      this.Setting = this.Setting;
      this.ListInside = this.ListInside;
      this.Setting.functions.autoLoad = autoLoad;
      this.Setting.functions.getVal = getVal;
      this.Setting.functions.getElementData = getElementData;
      this.Setting.functions.getFieldsData = getFieldsData;
      this.Setting.functions.setupListElement = setupListElement;
      this.Setting.functions.calculatorFieldsData = calculatorFieldsData;
      this.Setting.functions.saveValue = saveValue;
      this.Setting.functions.replaceExpression = replaceExpression;
      this.Setting.functions.submitDefault = submitDefault;
      this.Setting.functions.compareChange = compareChange;
      this.Setting.functions.setDataToElement = setDataToElement;
      this.Setting.functions.getFullData = getFullData;
      this.Setting.functions.setData = setData;
      this.Setting.functions.checkDependencies = checkDependencies;
      this.Setting.functions.addPermissionToObject = addPermissionToObject;
      this.Setting.functions.sendNotification = sendNotification;
      this.Setting.functions.createHistoryLogs = createHistoryLogs;
      this.Setting.functions.permission = permission;
      this.onRedirect = onRedirect;
      this.onClear = onClear;
      this.showlist = showlist;
      this.show = show;
      this.IsSafari = IsSafari;
      this.checkDate = checkDate;
      this.saveUserList = saveUserList;
      this.permissionFlag = false;
      this.historyFlag = false;
      */
      /////
      //this.Show = [];
      // this.dayOWeek = [];
      // this.Showa = true;
      //  this.WorkTime = 6;
      /**Set up data for view*/
      //this.viewModel = { currentPage: 1, tabActive: [] };
      /** create objSourceData, replace with data form parent passing data, filter list, or itthis get data request*/
      // this.objSourceData = {};
      //this.Setting.sendData = {};
      // this.Setting.PushServer = this.rootScope.PushServer;
      // this.Setting.BaseURL = this.$appUri.BaseURL; //  != "/" ? this.$appUri.BaseURL.substring(0, this.$appUri.BaseURL.length - 1) : $location.$$protocol + "://" + $location.$$host;
      /**
       * call start up Function
       */
      this.autoLoad();
    },
    autoLoad(afterU) {
      if(!this.Setting.sendData)
        this.Setting.sendData = {};
      /** làm trống nội dung nếu là thêm mới nút tree  */
      if (
        this.$Utils.isEmpty(this.Setting, "parentSetting.object.ReferenceId") &&
        this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value") &&
        this.Setting.parentSetting.set.Value.indexOf("ReferenceId") >= 0
      ) {
        $.each(this.Setting.Fields, (id, field) => {
          if (
            this.$Utils.isEmpty(this.Setting, "parentSetting.object") &&
            this.$Utils.isEmpty(
              this.Setting.parentSetting.object,
              field.Name
            ) &&
            field.FormFieldType != "Hidden"
          ) {
            this.Setting.parentSetting.object[field.Name] = "";
          }
        });
      }
      /** thêm dữ liệu truyền từ parent directive */
      if (this.$Utils.isEmpty(this.Setting, "parentSetting.object")) {
        this.objSourceData = this.$Lodash.cloneDeep(
          this.Setting.parentSetting.object
        );
        if (
          this.$Utils.isEmpty(this.Setting, "SubElements") &&
          this.Setting.SubElements.length > 0 &&
          this.Setting.AdditionConditions.Code !=
            this.Setting.parentSetting.object.Code
        )
          delete this.objSourceData.Id;
        if (
          this.Setting.DataSource == "AG_Task_Task" &&
          this.$Utils.isEmpty(
            this.$rootScope.loggedOnUser.Project,
            "GroupId"
          ) &&
          !this.$Utils.isEmpty(this.objSourceData.Project)
        ) {
          this.objSourceData.Project = this.$rootScope.loggedOnUser.Project.GroupId;
          this.objSourceData.ProjectName = this.$rootScope.loggedOnUser.Project.GroupName;
          this.objSourceData.ProjectCode = this.$rootScope.loggedOnUser.Project.GroupPath;
        }
        this.Setting.sendData = this.$Lodash.cloneDeep(this.objSourceData);
      } else if (
        (this.Setting.DataSource == "AG_Task_Task" ||
          (this.$Utils.isEmpty(this.Setting.AdditionConditions, "Code") &&
            this.Setting.AdditionConditions.Code == "Document")) &&
        this.$Utils.isEmpty(this.$rootScope.loggedOnUser.Project, "GroupId") &&
        this.$Utils.isEmpty(this.$rootScope.loggedOnUser.Project, "GroupPath")
      ) {
        this.objSourceData = {};
        this.objSourceData.Project = this.$rootScope.loggedOnUser.Project.GroupId;
        this.objSourceData.ProjectName = this.$rootScope.loggedOnUser.Project.GroupName;
        this.objSourceData.ProjectCode = this.$rootScope.loggedOnUser.Project.GroupPath;
        this.Setting.sendData = this.$Lodash.cloneDeep(this.objSourceData);
      }
      if (this.$Utils.isEmpty(this.Setting, "parentSetting.change")) {
        $.each(this.Setting.parentSetting.change, (key, value) => {
          this.Setting.sendData[key] = value;
        });
      }
      /** gọi đến hàm lấy dữ liệu từ máy chủ nếu có setting*/
      if (
        this.$Utils.isEmpty(this.Setting, "parentSetting.set.GetFullData") &&
        (this.Setting.parentSetting.set.GetFullData == true ||
          this.Setting.parentSetting.set.GetFullData == "true") &&
        this.$Utils.isEmpty(this.objSourceData.Id)
      ) {
        this.getFullData();
      } else if (
        this.Setting.DataSource == "AG_Task_Task" &&
        this.$Utils.isEmpty(this.Setting.sendData, "Id")
      ) {
        this.saveUserList(this.Setting.sendData);
        if (!afterU) this.setupListElement();
      } else if (!afterU) {
        this.setupListElement();
      }
      //console.log(this.$rootScope.loggedOnUser.Project)
    },

    /**
     * tạo danh sách các element từ setting, bổ sung các các hàm xử lý, dependency cho Fields và HiddenFields
     * tạo danh sách các button trong trường hợp pop up
     * sắp xếp các phần từ trong danh sách Fields, HiddenFields, Buttons theo index
     */
    show(status) {
      if (status == true) this.Showa = false;
      else this.Showa = true;
    },

    showlist(value) {
      if (this.$Utils(this.Show, value)) this.Show[value] = false;
      else this.Show[value] = true;
    },

    setupListElement() {
      /** all fields object*/
      this.fields = {};
      /** List ElementChild, that will be sorted by Index */
      // this.listElements = [];
      /** List HiddenField*/
      this.listHidden = [];
      /** List CalculatorField, get data from field that don't show up in form */
      this.objCalculator = [];
      /** tạo nhóm các trường từ setting*/
      var groups = [];
      $.each(this.Setting.Groups, (key, gr) => {
        groups.push({
          fields: [
            {
              Name: "FormGroup" + key,
              ElementType: "Header",
              Caption: gr.Caption ? gr.Caption : gr.Name,
              ColumnFlex: "100"
            }
          ],
          calculator: [],
          key: gr.ListFields ? gr.ListFields.split(";") : []
        });
      });
      $.each(this.Setting.Fields, (key, element) => {
        /** đè các giá trị mặc định từ form lên*/
        var type = this.Setting.ModuleType;
        $.each(element, (key, val) => {
          if (key.indexOf(type) == 0 && key.length > type.length) {
            element[key.substring(type.length, key.length)] = val;
          }
        });
        switch (element.FieldType) {
          case "Hidden":
            break;
          case "Calculator":
            var bExistInGroup = false;
            $.each(groups, (key, group) => {
              if (group.key.indexOf(element.Name) >= 0) {
                if (this.$Utils.isEmpty(element.FormIsDisplay)) {
                  group.fields[group.key.indexOf(element.Name) + 1] = element;
                }
                group.calculator[group.key.indexOf(element.Name) + 1] = element;
                bExistInGroup = true;
              }
            });
            if (!bExistInGroup) {
              this.objCalculator.push(element);
            }
            break;
          case "General":
            element.Validate = this.$Utils.stringToObject(element.Validate);
            element.Validate.Key = this.$Utils.isEmpty(element.Validate.Key)
              ? element.Validate.Key.split(";")
              : [];
            if (typeof element.AdvancedDisplay === "string") {
              $.each(
                this.$Utils.stringToObject(element.AdvancedDisplay),
                (key, val) => {
                  element[key] = val;
                }
              );
            }
            element.ElementType = element.FilterElementType
              ? element.FilterElementType
              : element.FormElementType;
            var type = "Form";
            element.ParentType = type;
            $.each(element, (ckey, val) => {
              if (ckey.indexOf(type) === 0 && ckey.length > type.length) {
                element[ckey.substring(type.length, ckey.length)] = val;
              }
            });
            if (element.Validate) {
              var validate = this.$Utils.stringToObject(element.Validate);
              if (validate.Key && validate.Key.indexOf("notEmpty") != -1) {
                this.rules[element.Name] = [
                  {
                    type:
                      element.ElementType == "MultiTree" ||
                      element.ElementType == "Multi"
                        ? "array"
                        : "string",
                    required: true,
                    message: validate.notEmptymessage,
                    trigger: "blur"
                  }
                ];
              }
              // { required: true, message: 'Please input Activity name', trigger: 'blur' }
            }
            if (
              element.ElementType === "Select" ||
              element.ElementType === "Multi" ||
              element.ElementType === "Radio" ||
              element.ElementType === "Tree" ||
              element.ElementType === "MultiTree"
            ) {
              element.Code = element.FilterCode
                ? element.FilterCode
                : element.FormCode;
              element.Field = element.FilterField
                ? element.FilterField
                : element.FormField;
              element.FieldType = element.FilterFieldType
                ? element.FilterFieldType
                : element.FormFieldType;
              element.IncludeSubmit = element.FilterIncludeSubmit
                ? element.FilterIncludeSubmit
                : element.FormIncludeSubmit;
              element.Request = element.FilterRequest
                ? element.FilterRequest
                : element.FormRequest;
              element.DataRoot = element.FilterDataRoot
                ? element.FilterDataRoot
                : element.FormDataRoot;
              element.RequireOriginal = false;
              element.DisplayText = element.FormDisplayText
                ? element.FormDisplayText.replace(/{{/g, "").replace(/}}/g, "")
                : "Name";
              element.SavedKey = element.FormSavedKey
                ? element.FormSavedKey.replace(/{{/g, "").replace(/}}/g, "")
                : "Id";
              element.SavedText = element.FormSavedText
                ? element.FormSavedText.replace(/{{/g, "").replace(/}}/g, "")
                : "Name";
              // delete element.Data;
              // delete element.treeData;
              // delete element.sourceData;
            }
            // if(element.ElementType === 'Select' || element.ElementType === 'Multi' || element.ElementType === 'Radio' || element.ElementType === 'Tree'){
            //   console.log(element)
            //   var sParms = this.$Lodash.cloneDeep(this.$singleRequest);
            //   sParms.R1_RequestTemplate = element.Request;
            //   sParms = this.$Utils.updateParamsSingleRequest(sParms, this.$Utils.stringToObject(element.Code));
            //   this.$Utils.post(sParms).then((arrayData) => {
            //     this.dataSource = [];
            //     arrayData = this.$Utils.getDataWithRoot(arrayData.R1, element.DataRoot ? element.DataRoot : 'Data' );
            //     if(sParms.R1_RequestTemplate == "User"){
            //       var arrData = this.$Lodash.cloneDeep(arrayData);
            //       arrayData = [];
            //       arrData.forEach((item) =>{
            //         if(item.LoginName != "superadmin"){
            //           arrayData.push(item);
            //         }
            //       })
            //     }
            //     element.Data = arrayData;
            //   })
            // }
            this.formInline[element.Name] = "";
            // if (element.FieldColumnType === 'DateTime') {
            //   element.ColumnFlex = 50;
            //   element.DateMode = 'range';
            // }
            // this.objFields[element.Name] = element;
            // element.Dependency = [];
            // formatData[0].Dependencies.forEach((depend) => {
            //   if (depend.Target === element.Name) {
            //     element.Dependency.push(depend);
            //   }
            // });
            // element.onChange = function(data) {
            //   this.checkDependencies(data);

            // }
            /**
             * thêm object dependency từ danh sách Setting.Dependencies vào element,
             * so sánh dựa vào Dependencies[i].Target với element.Name
             */
            element.Dependency = [];
            $.each(this.Setting.Dependencies, (key, depend) => {
              if (depend.Target === element.Name) {
                element.Dependency.push(depend);
              }
            });
            /**
             * thay đổi giá trị hiển thị cho view
             *
             * @param setting: cấu hình của element cần thay đổi
             * @param type: giá trị thay đổi, hidden or show...
             */
            element.displayControl = (setting, type) => {
              switch (type) {
                case "hidden":
                  element.hiddenInForm = true;
                  break;
                case "show":
                  element.hiddenInForm = false;
                  break;
              }
            };
            /**
             * Kiểm tra có giá trị tồn tại trên máy chủ ko
             *
             * @param dataList: danh sách các dữ liệu cần gửi lên
             * @param callback: function trả lại kết quả
             */
            element.checkDataExist = (dataList, callback) => {
              /** tạo request lấy dữ liệu từ request search*/
              var request = this.$Utils.updateParamsSingleRequest(
                this.$Lodash.cloneDeep(this.$singleRequest),
                this.Setting.Request.Search
              );
              /** thêm các thuộc tính từ dataList vào request*/
              $.each(dataList, (key, data) => {
                request["R1_" + data.name] = data.val;
              });
              $.each(request, (key, param) => {
                request[key] = this.$Utils.expressionToString(
                  this.objSourceData,
                  param + ""
                );
              });
              /** return result data*/
              this.$Utils.postCheckResult(request).then(result => {
                if (result.success && result.R1.success) {
                  callback(
                    this.$Utils.getDataWithRoot(
                      result.R1,
                      this.Setting.Request.Search.RootData
                    )
                  );
                } else {
                  callback();
                }
              });
            };
            /**
             * function kiểm tra khi giá trị trong element thay đổi, gọi đến hàm xử lý dependency
             * @param data: dữ liệu đã thay dổi, được gửi lên từ element
             */
            element.onChange = (data, preFieldType) => {
              if (
                (this.$Utils.isEmpty(preFieldType) &&
                  preFieldType != "Label") ||
                !this.$Utils.isEmpty(preFieldType)
              ) {
                this.checkDependencies(data);
              }
            };
            bExistInGroup = false;
            $.each(groups, (key, group) => {
              if (group.key.indexOf(element.Name) >= 0) {
                group.fields[group.key.indexOf(element.Name) + 1] = element;
                bExistInGroup = true;
              }
            });
            if (!bExistInGroup) {
              this.listElements.push(element);
            }
            break;
        }
        element.Dependency = [];
        $.each(this.Setting.Dependencies, (key, depend) => {
          if (depend.Target == element.Name) {
            element.Dependency.push(depend);
          }
        });
        this.fields[element.Name] = element;
      });
      /** ghép các trường từ nhóm và danh sách trường*/
      var arrFields = [];
      $.each(groups, (key, gr) => {
        arrFields = arrFields.concat(gr.fields);
        $.each(gr.calculator, (key, object) => {
          if (object && object != "") this.objCalculator.push(object);
        });
      });
      this.listElements = arrFields.concat(this.listElements);
      // this.listElements.clean();
      /** khởi tạo danh sách các nút cho form*/
      this.listButton = [];
      $.each(this.Setting.Buttons, (key, button) => {
        button.ElementType = "Button";
        if (typeof button.ExtraSetting === "string") {
          $.each(this.$Utils.stringToObject(button.ExtraSetting), (k, v) => {
            button[k] = v;
          });
        }
        if (this.$Utils.isEmpty(button.FormJsonExpression)) {
          $.each(button.FormJsonExpression, (k, v) => {
            button[k] = v;
          });
        }
        button.displayControl = type => {
          switch (type) {
            case "hidden":
              button.hiddenInForm = true;
              break;
            case "show":
              button.hiddenInForm = false;
              break;
          }
          this.$forceUpdate();
        };
        switch (button.ButtonType) {
          case "Popup":
            button.ModuleCode = button.PopupModule;
            button.onClick = () => {
              this.Setting.functions.openPopUp(this.objSourceData, this);
            };
            break;
          case "Click":
            switch (button.Action) {
              case "Subscribe":
                button.onClick = () => {
                  var taskRequest = {
                    RequestClass: "xBase",
                    RequestAction: "Request",
                    TotalRequests: 1,
                    R1_RequestFields: "Id;Subscribe",
                    R1_RequestTemplate: "AG_Task_Task.Search",
                    R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
                    R1_Id: this.Setting.sendData.Id
                  };
                  this.$Utils.post(taskRequest).then(data => {
                    data = this.$Utils.getDataWithRoot(
                      data,
                      "R1.Data.TasksDS.Task"
                    );
                    if (data) {
                      var listSubscribe = data[0].Subscribe
                        ? data[0].Subscribe.split(";")
                        : [];
                      listSubscribe = listSubscribe.filter(el => {
                        return el != "";
                      });
                      if (
                        listSubscribe &&
                        listSubscribe.indexOf(
                          this.$Utils.getUserInfo("UserId")
                        ) != -1
                      ) {
                        this.$Utils.showMessage(
                          "error",
                          "Bạn đang theo dõi Công việc này"
                        );
                      } else {
                        listSubscribe.push(this.$Utils.getUserInfo("UserId"));
                        var request = {
                          RequestClass: "xBase",
                          RequestAction: "Request",
                          TotalRequests: 1,
                          R1_RequestTemplate: "AG_Task_Task.Update",
                          R1_RequestDataGroup:
                            "DataGroup.danh-sach-cong-viec.04b66",
                          R1_RequestFields: "Id;Subscribe",
                          R1_Id: this.Setting.sendData.Id,
                          R1_Subscribe: listSubscribe.join(";")
                        };
                        this.$Utils.post(request).then(data => {
                          this.$Utils.showMessage(
                            "success",
                            "Đăng ký theo dõi thành công"
                          );
                        });
                        var linkSubcribe = {
                          RequestClass: "xBase",
                          Parent: this.Setting.sendData.Id,
                          Child: this.$Utils.getUserInfo("UserId"),
                          Code: "Subscribe",
                          Name: "Subscribe",
                          RequestAction: "LinkUserToObject",
                          ParentTable: "xObject",
                          ChildTable: "tblUser",
                          RequestTemplate: "Permission.Insert"
                        };
                        this.$Utils.post(linkSubcribe).then(ldata => {});
                        var linkEmailIns = {
                          RequestClass: "xBase",
                          Parent: this.Setting.sendData.Id,
                          Child: this.$Utils.getUserInfo("UserId"),
                          Code: "Email",
                          Name: "Email",
                          RequestAction: "LinkUserToObject",
                          ParentTable: "xObject",
                          ChildTable: "tblUser",
                          RequestTemplate: "Permission.Insert"
                        };
                        this.$Utils.post(linkEmailIns).then(ldata => {});
                      }
                    }
                  });
                };
                break;
              case "Unsubscribe":
                button.onClick = () => {
                  /** Bo theo doi task*/
                  var taskRequest = {
                    RequestClass: "xBase",
                    RequestAction: "Request",
                    TotalRequests: 1,
                    R1_RequestFields: "Id;Subscribe",
                    R1_RequestTemplate: "AG_Task_Task.Search",
                    R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
                    R1_Id: this.Setting.sendData.Id
                  };
                  this.$Utils.post(taskRequest).then(data => {
                    data = this.$Utils.getDataWithRoot(
                      data,
                      "R1.Data.TasksDS.Task"
                    );
                    if (data) {
                      var listSubscribe = data[0].Subscribe
                        ? data[0].Subscribe.split(";")
                        : [];
                      listSubscribe = listSubscribe.filter(el => {
                        return el != "";
                      });
                      if (listSubscribe) {
                        listSubscribe = listSubscribe.filter(el => {
                          return el !== this.$Utils.getUserInfo("UserId");
                        });
                        var request = {
                          RequestClass: "xBase",
                          RequestAction: "Request",
                          TotalRequests: 1,
                          R1_RequestTemplate: "AG_Task_Task.Update",
                          R1_RequestDataGroup:
                            "DataGroup.danh-sach-cong-viec.04b66",
                          R1_RequestFields: "Id;Subscribe",
                          R1_Id: this.Setting.sendData.Id,
                          R1_Subscribe:
                            listSubscribe.length > 0
                              ? listSubscribe.join(";")
                              : ";"
                        };
                        this.$Utils.post(request).then(data => {
                          this.$Utils.showMessage(
                            "success",
                            "Huỷ đăng ký theo dõi thành công"
                          );
                        });
                        var linkEmail = {
                          RequestAction: "SearchLinked",
                          RequestClass: "Addition",
                          ConditionFields: "Parent;Code;Child",
                          StaticFields:
                            "Code;Child;Parent;Name;Created;Description",
                          OrderFields: "Created DESC",
                          Parent: this.Setting.sendData.Id,
                          Child: this.$Utils.getUserInfo("UserId"),
                          Code: "Subscribe;Email"
                        };
                        this.$Utils.post(linkEmail).then(result => {
                          var arrLink =
                            result.TotalCount == 1
                              ? [result.Data.DataDS.Linked]
                              : result.Data.DataDS.Linked;
                          var removeLinks = {
                            RequestClass: "xBase",
                            RequestAction: "Request",
                            TotalRequests: arrLink.length,
                            RequestTemplate: "Permission.Remove"
                          };
                          $.each(arrLink, (key, link) => {
                            removeLinks["R" + (key + 1) + "_Id"] = link.Id;
                            removeLinks["R" + (key + 1) + "_Parent"] =
                              link.Parent;
                            removeLinks["R" + (key + 1) + "_Child"] =
                              link.Child;
                            removeLinks["R" + (key + 1) + "_Code"] = link.Code;
                          });
                          this.$Utils.post(removeLinks).then(() => {});
                        });
                      }
                    }
                  });
                };
                break;
              case "Update":
                button.onClick = () => {
                  /** gọi function lấy dữ liệu từ các element con*/
                  if (
                    this.$Utils.isEmpty(this.Setting.functions, "checkComment")
                  ) {
                    this.Setting.functions.checkComment();
                  }
                  this.currentButtonSetting = button;
                  this.getElementData(0, []);
                };
                break;
              case "Copy":
                button.onClick = () => {
                  /** gọi function lấy dữ liệu từ các element con*/
                  this.currentButtonSetting = button;
                  this.objSourceData = {};
                  this.getElementData(0, []);
                };
                break;
              case "Clear":
                button.onClick = () => {
                  /**
                   * gọi đến hàm xử lý xóa dữ liệu cho mỗi element
                   */
                  this.onClear();
                };
                break;
              case "CloseModal":
                button.onClick = () => {
                  /**
                   * gọi đến hàm xử lý xóa dữ liệu cho mỗi element
                   */
                  this.$hub.$emit("close-modal");
                };
                break;
            }
            break;
          case "Redirect":
            button.onClick = () => {
              if (
                button.Redirect.indexOf("=") >= 0 &&
                button.Redirect.indexOf("Default") >= 0
              ) {
                button.Redirect = this.$Utils.stringToObject(button.Redirect);
                $.each(button.Redirect, (key, link) => {
                  if (key != "Default") {
                    if (
                      this.$Utils.isEmpty(
                        this.Setting.parentSetting,
                        "object"
                      ) &&
                      this.$Utils.isEmpty(
                        this.Setting.parentSetting.object[key]
                      )
                    ) {
                      this.onRedirect(link, this.objSourceData);
                    } else {
                      this.onRedirect(
                        button.Redirect["Default"],
                        this.objSourceData
                      );
                    }
                  }
                });
              } else {
                this.onRedirect(button.Redirect, this.objSourceData);
              }
            };
            break;
        }
        if (
          this.$Utils.isEmpty(this.Setting, "parentSetting") &&
          (this.Setting.parentSetting.set.ButtonType == button.PreAction ||
            this.Setting.parentSetting.set.ElementType == button.PreAction)
        ) {
          this.listButton.push(button);
        } else if (
          (!this.$Utils.isEmpty(this.Setting, "parentSetting") ||
            (!this.$Utils.isEmpty(this.Setting.parentSetting.set.ButtonType) &&
              !this.$Utils.isEmpty(
                this.Setting.parentSetting.set.ElementType
              ))) &&
          button.PreAction == "Redirect"
        ) {
          this.listButton.push(button);
        } else if (
          !this.$Utils.isEmpty(button.PreAction) ||
          button.PreAction == ""
        ) {
          this.listButton.push(button);
        }
      });

      /** tạo danh sách các module con*/
      if (Array.isArray(this.Setting.SubElements)) {
        $.each(this.Setting.SubElements, (key, element) => {
          element.ModuleCode = element.SubElement;
          /** code map các trường ghép đôi giữa form cha và module con thông qua tên*/
          var item = this.$Lodash.cloneDeep(this.objSourceData);
          var Links = this.Setting.Link;
          if (this.$Utils.isEmpty(Links)) {
            var SubElementLinks = Links[element.DataGroup];
            if (this.$Utils.isEmpty(SubElementLinks)) {
              item = {};
              $.each(SubElementLinks, (key, value) => {
                if (this.$Utils.isEmpty(this.objSourceData[value.Source])) {
                  item[value.Target] = this.objSourceData[value.Source];
                }
                if (
                  this.$Utils.isEmpty(this.objSourceData[value.Source + "Name"])
                ) {
                  item[value.Target + "Name"] = this.objSourceData[
                    value.Source + "Name"
                  ];
                }
              });
              if (
                !this.$Utils.isEmpty(item.Id) &&
                this.$Utils.isEmpty(this.Setting, "parentSetting")
              ) {
                item.Id = this.Setting.parentSetting.object.Id;
              }
            }
          }
          element.parentSetting = {
            object: item,
            set: this.$Lodash.cloneDeep(element),
            callback: this.Setting.functions
          };
        });
      }
      this.subElementObject = {
        Module: this.Setting.SubElements ? this.Setting.SubElements : [],
        directiveType: "inside"
      };
    },

    /**
     * hàm lấy dữ liệu để directive cha gọi
     * trả về danh sách dữ liệu lấy từ các element
     *
     */
    getVal() {
      return new Promise((resolve, reject) => {
        this.Setting.functions.getElementData(0, [], arrayData => {
          resolve(this.arrResult);
        });
      });
    },

    /**
     * hàm lấy dữ liệu từ các form con
     *
     * @param intCount: vị trí của element trong this.listElements
     * @param arrResult: danh danh các kết quả trả về
     * @param callback: hàm lấy dữ liệu trả về
     */
    getElementData(intCount, arrResult, callback) {
      var ctrl = this;
      if (intCount < ctrl.subElementObject.Module.length) {
        if (
          ctrl.$Utils.isEmpty(
            ctrl.subElementObject.Module[intCount],
            "functions.getVal"
          )
        ) {
          ctrl.subElementObject.Module[intCount].functions
            .getVal()
            .then(data => {
              // var narr = [];
              // $.each(data, (key, val) => {
              //   arr.push(val);
              // });
            //   /** code xử lý dữ liệu ghép đôi */
              var module = ctrl.Setting.SubElements[intCount],
                // parentChild = ctrl.$Utils.stringToObject(module.ParentChild);
                parentChild = ctrl.Setting.Link ? ctrl.Setting.Link[ctrl.Setting.SubElements[intCount].DataGroup] : [];
              if (module.IncludeElementData) {
                var arr = [];
                $.each(parentChild, (index, val) => {
                  $.each(data, (key, item) =>{
                    if (key == val.Target) {
                      ctrl.arrResult[val.Source] = item;
                      this.ChildFields += val.Source + ';';
                      if(ctrl.$Utils.isEmpty(item.setting, 'DynamicText')){
                        ctrl.arrResult[val.Source + 'Name'] = data[item.setting.DynamicText]
                        ctrl.arrResult[val.Source + 'Name'].Name = val.Source + 'Name';
                        this.ChildFields += val.Source + 'Name;';
                      }
                      ctrl.arrResult[val.Source].Name = val.Source;
                    }
                  })
                });
                // ctrl.arrResult = ctrl.arrResult.concat(arr);
              }
            //   /** gọi đến hàm lấy dữ liệu từ các field con*/
              ctrl.getElementData(intCount + 1, arrResult, callback);
            });
        } else ctrl.getElementData(intCount + 1, arrResult, callback);
      } else ctrl.getFieldsData(0, arrResult, callback);
    },

    /**
     * hàm lấy dữ liệu từ các element con, khởi chạy từ intCount=0, sau khi lấy dữ liệu của 1 element con
     * thì gọi lại chính nó với intCount tăng thêm 1, chỉ dừng lại đến khi intCount = this.listElements.length
     * sau khi dừng lại sẽ gọi đến hàm điền dữ liệu cho các trường ẩn calculatorFieldsData
     *
     * @param intCount: vị trí của element trong this.listElements
     * @param arrResult: danh danh các kết quả trả về
     * @param callback: hàm trả lại kết quả
     */
    getFieldsData(intCount, arrResult, callback) {
      // if (intCount < this.listElements.length) {
      //   /**
      //    * kiểm tra element con có hàm getVal hay không
      //    * nếu có sẽ kiểm tra validate trả về, valid = false thì dừng lại, nếu = true thì thêm kết quả vào mảng
      //    * nếu không sẽ gọi lại chính nó với intCount tăng lên 1
      //    */
      //   if (this.$Utils.isEmpty(this.listElements[intCount].getVal)) {
      //     this.listElements[intCount].getVal((returnData) => {
      //       var isOk = true;
      //       for (var i = 0; i < returnData.length; i++) {
      //         if (returnData[i].validate) {
      //           arrResult.push(returnData[i]);
      //         } else {
      //           isOk = false;
      //           break;
      //         }
      //       }
      //       if (isOk) this.getFieldsData(intCount + 1, arrResult, callback);
      //     });
      //   } else this.getFieldsData(intCount + 1, arrResult, callback);
      // } else
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          var arr = [];
          $.each(this.arrResult, (key, val) => {
            arr.push(val);
          });
          this.calculatorFieldsData(0, arr, callback);
        } else {
          this.$Utils.showMessage("error", 'Chưa nhập đủ các trường bắt buộc');
          return false;
        }
      });
    },

    /**
     * hàm thêm dữ liệu vào arrResult dựa trên objCalculator và chính arrResult
     * khởi chạy từ intCount=0, sau khi lấy dữ liệu thêm arrResult
     * thì gọi lại chính nó với intCount tăng thêm 1, chỉ dừng lại đến khi intCount = this.objCalculator.length
     *
     * @param intCount: vị trí của element trong this.listElements
     * @param arrResult: danh danh các kết quả trả về
     * @param callback: hàm trả lại kết quả
     */
    calculatorFieldsData(intCount, arrResult, callback) {
      if (this.objCalculator && intCount < this.objCalculator.length) {
        /** Khởi tạo object thêm vào arrResult, mặc định là sẽ không submit nếu không có IncludeSubmit == 'true'*/
        var calculatorField = this.objCalculator[intCount],
          object = {
            name: calculatorField.Name,
            setting: calculatorField,
            submit: calculatorField.IncludeSubmit == "true",
            validate: true,
            value: ""
          };

        /**
         * switch case các trường hợp dựa trên ControlType
         */
        switch (calculatorField.ElementType) {
          case "DataInside":
            /**
             * trường hợp lấy dữ liệu từ chính bản thân hidden field, cho các trường hợp value là cố định
             */
            object.value = this.$Lodash.cloneDeep(calculatorField.Value);
            if (calculatorField.Expression) {
              object.value = "";
              var source = this.$Lodash.cloneDeep(this.objSourceData);
              $.each(arrResult, (key, obj) => {
                if (obj.submit) {
                  source[obj.name] = obj.value;
                }
              });
              $.each(
                this.$Utils.stringToArray(calculatorField.Expression),
                (key, expression) => {
                  expression.condition = this.$Utils.expressionToString(
                    source,
                    expression.condition
                  );
                  if (
                    this.$Utils.compareStringExpression(expression.condition)
                  ) {
                    object.value = expression.result;
                  }
                }
              );
              var defaultObject = this.$Utils.stringToObject(
                calculatorField.Value
              );
              if (this.$Utils.isEmpty(defaultObject, object.value)) {
                object.value = defaultObject[object.value];
              }
              object.value = this.$Utils.expressionToString(
                source,
                object.value
              );
            }
            break;
          case "DateTimeNow":
            /**
             * trường hợp lấy ngày giờ hiện taijm thêm format nếu có
             */
            var format = null;
            if (this.$Utils.isEmpty(calculatorField, "Format")) {
              format = calculatorField.Format;
            }
            object.value = this.$Utils.formatDateTime(new Date(), format);
            break;
          case "CombineData":
            /**
             * trường hợp kết hợp dữ liệu từ arrResult và this.objSourceData, thế gán giá trị vào value
             *
             * arrExpress: dãy khởi tạo từ Expression trong calculatorField, dùng để lưu lại danh sách
             * các phần tử trong biếu thức tính toán
             */
            object.submit = true;
            var exp = calculatorField.Expression
                ? calculatorField.Expression
                : "",
              replacedExpression = "";
            while (exp != "") {
              if (
                exp.indexOf("{{") >= 0 &&
                exp.indexOf("}}") > exp.indexOf("{{")
              ) {
                replacedExpression += exp.substr(0, exp.indexOf("{{"));
                var key = exp.substr(
                  exp.indexOf("{{") + 2,
                  exp.indexOf("}}") - exp.indexOf("{{") - 2
                );
                /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
                var name = this.$Lodash.cloneDeep(key),
                  value = "",
                  childParse = "";
                if (key.indexOf(".") > 0) {
                  name = key.substr(0, key.indexOf(".")).trim();
                  value = key.substr(key.indexOf(".") + 1, key.length).trim();
                  if (value.indexOf("!!") > 0) {
                    childParse = this.$Lodash
                      .clone(value)
                      .substr(
                        this.$Lodash.cloneDeep(value).indexOf("!!") + 2,
                        this.$Lodash.cloneDeep(value).length
                      )
                      .trim();
                    value = value.substr(0, value.indexOf("!!")).trim();
                  }
                }
                if (name == "$Random") {
                  replacedExpression += ("0000" +
                    ((Math.random() * Math.pow(36, 6)) << 0).toString(36)
                  ).slice(-6);
                } else {
                  var exist = false;
                  for (var i = 0; i < arrResult.length; i++) {
                    if (arrResult[i].name == name) {
                      if (value != "" && childParse == "") {
                        if (this.$Utils.isEmpty(arrResult[i], "ori." + value)) {
                          replacedExpression += arrResult[i].ori[value];
                        } else if (
                          this.$Utils.isEmpty(
                            this.objSourceData,
                            calculatorField.Name
                          )
                        ) {
                          replacedExpression += this.objSourceData[
                            calculatorField.Name
                          ];
                        }
                      } else if (value != "" && childParse != "") {
                        if (typeof arrResult[i].ori[value] === "string") {
                          var objValue = JSON.parse(arrResult[i].ori[value]);
                          if (this.$Utils.isEmpty(objValue, childParse)) {
                            if (typeof objValue[childParse] === "string") {
                              replacedExpression += objValue[childParse];
                            } else {
                              replacedExpression += this.$Utils.isEmpty(
                                objValue[childParse],
                                "0"
                              )
                                ? objValue[childParse][0][
                                    calculatorField.DynamicValue
                                  ]
                                : objValue[childParse][
                                    calculatorField.DynamicValue
                                  ];
                            }
                          }
                        }
                      } else if (
                        this.$Utils.isEmpty(arrResult[i].value) &&
                        arrResult[i].value != ""
                      ) {
                        replacedExpression += arrResult[i].value;
                      } else {
                        replacedExpression += 0;
                      }
                      exist = true;
                    }
                  }
                  if (!exist) {
                    if (this.$Utils.isEmpty(this.objSourceData, name)) {
                      replacedExpression += this.objSourceData[name];
                      exist = true;
                    }
                  }
                  /** kiểm tra nếu không tồn tại giá trị và đối với loại là số thì replace biến = 0*/
                  if (!exist) {
                    switch (calculatorField.FieldColumnType) {
                      case "Integer":
                        replacedExpression += 0;
                        break;
                      case "Double":
                        replacedExpression += 0;
                        break;
                    }
                  }
                }
                exp = exp.substr(exp.indexOf("}}") + 2, exp.length);
              } else {
                replacedExpression += exp;
                exp = "";
              }
            }
            /** Kiểm tra các trường hợp của FieldData để tính toán */
            switch (calculatorField.FieldColumnType) {
              case "String":
                /** trường hợp là string thì loại bỏ các dấu toán học*/
                object.value = replacedExpression;
                break;
              case "Integer":
                /** trường hợp là integer chuyển các phần từ rỗng thành 0, cộng chuỗi
                 * các phần tử để tạo thành biểu thức toán học*/
                object.value = 0;
                if (replacedExpression !== "") {
                  /** gọi hàm tính toán biểu thức toán học*/
                  object.value = this.$Utils.calculator(replacedExpression);
                }
                if (
                  !isNaN(calculatorField.Min) &&
                  object.value < calculatorField.Min
                ) {
                  object.value = calculatorField.Min;
                }
                break;
              case "Double":
                /** trường hợp là double chuyển các phần từ rỗng thành 0, cộng chuỗi
                 * các phần tử để tạo thành biểu thức toán học*/
                object.value = 0.0;
                if (replacedExpression !== "") {
                  /** gọi hàm tính toán biểu thức toán học, bổ sung thêm số sau dấu , */
                  object.value = this.$Utils
                    .calculator(replacedExpression)
                    .toFixed(2);
                  if (object.value + "" == "NaN") {
                    object.value = 0.0;
                  }
                }
                if (
                  !isNaN(calculatorField.Min) &&
                  object.value < calculatorField.Min
                ) {
                  object.value = calculatorField.Min.toFixed(2);
                }
                break;
              case "DateTime":
                /** trường hợp ngày tháng, chuyển listData thành dạng chuỗi,
                 * format chuỗi nhân được thành dạng ngày với format (nếu có) */
                var str = "";
                if (this.$Utils.isEmpty(calculatorField, "Format")) {
                  str = this.$Utils.formatDateTime(
                    this.$Utils.stringToDate(replacedExpression),
                    calculatorField.Format
                  );
                }
                object.value = str.trim();
                break;
            }
            break;
          case "CompareValue":
            var compareKey = calculatorField.Expression.split(";");
            var newValue;
            if (
              calculatorField.Expression &&
              calculatorField.Expression.indexOf(";")
            ) {
              $.each(compareKey, (key, field) => {
                $.each(arrResult, (k, item) => {
                  if (item.name == field) {
                    if (!this.$Utils.isEmpty(newValue)) {
                      newValue = item.value;
                    } else if (
                      calculatorField.FormValue == "Max" &&
                      item.value > newValue
                    ) {
                      newValue = item.value;
                    } else if (
                      calculatorField.FormValue == "Min" &&
                      item.value < newValue
                    ) {
                      newValue = item.value;
                    }
                  }
                });
              });
            }
            switch (calculatorField.FieldColumnType) {
              case "String":
                /** trường hợp là string thì loại bỏ các dấu toán học*/
                object.value = newValue;
                break;
              case "Integer":
                /** trường hợp là integer chuyển các phần từ rỗng thành 0, cộng chuỗi
                 * các phần tử để tạo thành biểu thức toán học*/
                object.value = 0;
                if (newValue !== "") {
                  /** gọi hàm tính toán biểu thức toán học*/
                  object.value = this.$Utils.calculator(newValue);
                }
                if (
                  !isNaN(calculatorField.Min) &&
                  object.value < calculatorField.Min
                ) {
                  object.value = calculatorField.Min;
                }
                break;
              case "Double":
                /** trường hợp là double chuyển các phần từ rỗng thành 0, cộng chuỗi
                 * các phần tử để tạo thành biểu thức toán học*/
                object.value = 0.0;
                if (newValue !== "") {
                  /** gọi hàm tính toán biểu thức toán học, bổ sung thêm số sau dấu , */
                  object.value = this.$Utils.calculator(newValue).toFixed(2);
                  if (object.value + "" == "NaN") {
                    object.value = 0.0;
                  }
                }
                if (
                  !isNaN(calculatorField.Min) &&
                  object.value < calculatorField.Min
                ) {
                  object.value = calculatorField.Min.toFixed(2);
                }
                break;
            }
            break;
          case "ConditionalStatement":
            /**
             * trường hợp kết hợp dữ liệu từ arrResult và this.objSourceData, thế gán giá trị vào value
             *
             * arrExpress: dãy khởi tạo từ Expression trong calculatorField, dùng để lưu lại danh sách
             * các phần tử trong biếu thức tính toán
             */
            object.submit = true;
            var replacedExpression = "";
            var obj = calculatorField.FormJsonExpression
              ? calculatorField.FormJsonExpression
              : "";
            var exp = JSON.stringify(obj);
            while (exp != "") {
              if (
                exp.indexOf("(!(") >= 0 &&
                exp.indexOf(")!)") > exp.indexOf("(!(")
              ) {
                replacedExpression += exp.substr(0, exp.indexOf("(!("));
                var key = exp.substr(
                  exp.indexOf("(!(") + 3,
                  exp.indexOf(")!)") - exp.indexOf("(!(") - 3
                );
                /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
                var name = this.$Lodash.cloneDeep(key),
                  value = "";
                if (name == "$Random") {
                  replacedExpression += ("0000" +
                    ((Math.random() * Math.pow(36, 6)) << 0).toString(36)
                  ).slice(-6);
                } else if (name.indexOf("Phase_") >= 0) {
                  replacedExpression += "(!(" + name + ")!)";
                } else {
                  var exist = false;
                  for (var i = 0; i < arrResult.length; i++) {
                    if (arrResult[i].name == name) {
                      if (value != "") {
                        if (this.$Utils.isEmpty(arrResult[i], "ori." + value)) {
                          replacedExpression = arrResult[i].ori[value];
                        } else if (
                          this.$Utils.isEmpty(
                            this.objSourceData,
                            calculatorField.Name
                          )
                        ) {
                          replacedExpression += this.objSourceData[
                            calculatorField.Name
                          ];
                        }
                      } else if (this.$Utils.isEmpty(arrResult[i].value)) {
                        replacedExpression += arrResult[i].value;
                      } else {
                        replacedExpression += 0;
                      }
                      exist = true;
                    }
                  }
                  if (!exist) {
                    if (this.$Utils.isEmpty(this.objSourceData, name)) {
                      replacedExpression += this.objSourceData[name];
                      exist = true;
                    }
                  }
                  /** kiểm tra nếu không tồn tại giá trị và đối với loại là số thì replace biến = 0*/
                  if (!exist) {
                    switch (calculatorField.FieldColumnType) {
                      case "Integer":
                        replacedExpression += 0;
                        break;
                      case "Double":
                        replacedExpression += 0;
                        break;
                    }
                  }
                }
                exp = exp.substr(exp.indexOf(")!)") + 3, exp.length);
              } else {
                replacedExpression += exp;
                exp = "";
              }
            }
            var arrExpression = [];
            var caseExpression = this.$Lodash.cloneDeep(
              JSON.parse(replacedExpression)
            );
            for (var j = 1; j <= caseExpression.NumberCase; j++) {
              if (this.$Utils.isEmpty(caseExpression["Case_" + j], "Option")) {
                arrExpression["Case_" + j] = caseExpression[
                  "Case_" + j
                ].Option.replaceAll(".SUP", "'");
              } else {
                arrExpression["Case_" + j] = true;
              }
              if (
                (eval(arrExpression["Case_" + j]) == true ||
                  !this.$Utils.isEmpty(caseExpression["Case_" + j].Option)) &&
                object.value == ""
              ) {
                if (typeof caseExpression["Case_" + j].Result === "string") {
                  if (caseExpression["Case_" + j].Result.indexOf("||")) {
                    object.value = caseExpression["Case_" + j].Result.split(
                      "||"
                    )[0];
                    var displayObject = {
                      name: calculatorField.DynamicText,
                      setting: calculatorField,
                      submit: calculatorField.IncludeSubmit == "true",
                      validate: true,
                      value: caseExpression["Case_" + j].Result.split("||")[1]
                    };
                    arrResult.push(displayObject);
                  } else {
                    object.value = caseExpression["Case_" + j].Result;
                  }
                } else {
                  var arrsuppExpression = [];
                  var objPhase = [];
                  $.each(caseExpression["Case_" + j].Result, (ekey, evalue) => {
                    objPhase[ekey] = "";
                    if (ekey != "TotalResult") {
                      for (var k = 1; k <= evalue.NumberCase; k++) {
                        if (
                          this.$Utils.isEmpty(evalue["Case_" + k], "Option")
                        ) {
                          arrsuppExpression["Case_" + k] = evalue[
                            "Case_" + k
                          ].Option.replaceAll(".SUP", "'");
                        } else {
                          arrsuppExpression["Case_" + k] = true;
                        }
                        if (
                          (eval(arrsuppExpression["Case_" + k]) == true ||
                            !this.$Utils.isEmpty(evalue["Case_" + k].Option)) &&
                          objPhase[ekey] == ""
                        ) {
                          if (typeof evalue["Case_" + k].Result === "string") {
                            objPhase[ekey] = evalue["Case_" + k].Result;
                          }
                        }
                      }
                    }
                  });
                  var supExp = this.$Lodash.cloneDeep(
                    caseExpression["Case_" + j].Result.TotalResult
                  );
                  var replacedSupExpression = "";
                  while (supExp != "") {
                    if (
                      supExp.indexOf("(!(") >= 0 &&
                      supExp.indexOf(")!)") > supExp.indexOf("(!(")
                    ) {
                      replacedSupExpression += supExp.substr(
                        0,
                        supExp.indexOf("(!(")
                      );
                      var skey = supExp.substr(
                        supExp.indexOf("(!(") + 3,
                        supExp.indexOf(")!)") - supExp.indexOf("(!(") - 3
                      );
                      /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
                      var sname = this.$Lodash.cloneDeep(skey),
                        svalue = "";
                      if (this.$Utils.isEmpty(objPhase, sname)) {
                        replacedSupExpression += objPhase[sname];
                        exist = true;
                      }
                      supExp = supExp.substr(
                        supExp.indexOf(")!)") + 3,
                        supExp.length
                      );
                    } else {
                      replacedSupExpression += supExp;
                      supExp = "";
                    }
                    object.value = eval(replacedSupExpression);
                  }
                }
              }
            }
            break;
          case "UserInfo":
            /**
             * get current log in user information
             */
            object.value = this.$Utils.getUserInfo(calculatorField.Value);
            break;
          case "CalculatorCondition":

          default:
            break;
        }
        /**
         * Kiểm tra giá trị phụ thuộc của calculatorField vào giá trị khác, dựa trên DataChangeType
         * ví dụ trong các trường hợp không muốn thay đổi giá trị khi tồn tại Id, hay giá trị đã có sẵn ....
         */
        var source = {};
        $.each(arrResult, (key, obj) => {
          source[obj.name] = obj.value;
        });
        if (
          this.$Utils.isEmpty(calculatorField.FormDependOn) &&
          calculatorField.FormDependOn != "" &&
          this.$Utils.isEmpty(source, calculatorField.FormDependOn)
        ) {
          if (
            source[calculatorField.FormDependOn] ==
            calculatorField.FormDependValue
          ) {
            object.value = this.$Utils.expressionToString(
              source,
              calculatorField.Expression
            );
          } else object.value = "1";
        }
        switch (calculatorField.DataChangeType) {
          case "DependEmpty":
            /**
             * trường hợp chỉ thay đổi khi giá  trị phụ thuộc không tồn tại
             * thuật toán: kiểm tra giá trị phụ thuộc có tồn tại, nếu có thì chuyển objec.value thành giá trị cũ
             */
            if (
              this.$Utils.isEmpty(
                this.objSourceData,
                calculatorField.DataDependOn
              )
            ) {
              object.value = this.objSourceData[object.name];
            }
            break;
          case "DependExist":
            /**
             *  trường hợp thay đổi khi giá trị phụ thuộc tồn tại
             *  thuật toán: kiểm tra giá trị phụ thuộc có tồn tại, nếu không có thì chuyển objec.value thành giá trị cũ
             */
            if (
              !this.$Utils.isEmpty(
                this.objSourceData,
                calculatorField.DataDependOn
              )
            ) {
              object.value = this.objSourceData[object.name];
            }
            break;
          case "DependOnSameAsValue":
            /**
             *  Chỉ thay đổi khi giá trị phụ thuộc trùng với 1 giá trị cho trước
             *  thuật toán: kiểm tra giá trị có khác với giá trị của denpendOn cho trước, nếu có thì chuyển về giá trị cũ
             */
            if (
              !this.$Utils.isEmpty(
                this.objSourceData,
                calculatorField.DataDependOn,
                true
              ) == this.listHidden[intCount].DependOnValue
            ) {
              object.value = this.objSourceData[object.name];
            }
            break;
          case "DependOnDifferentThanValue":
            /**
             *  Luôn thay đổi khi giá trị khác với giá trị cho trước
             *  thuật toán: kiểm tra giá trị có giống với giá trị của denpendOn cho trước, nếu có thì chuyển về giá trị cũ
             */
            if (
              this.$Utils.isEmpty(
                this.objSourceData,
                calculatorField.DataDependOn,
                true
              ) == this.listHidden[intCount].DependOnValue
            ) {
              object.value = this.objSourceData[object.name];
            }
            break;
          case "UsingOldData":
            /**
             *  Trường hợp chỉ thay đổi khi giá trị cũ chưa tồn tại
             *  thuật toán: kiểm tra giá trị giá trị cũ có tồn tại, nếu có thì chuyển về giá trị cũ
             */
            if (this.$Utils.isEmpty(this.objSourceData[calculatorField.Name])) {
              object.value = this.objSourceData[calculatorField.Name];
            }
            break;
        }

        /** add object to arrResult and call this function again with intCount + 1 */
        arrResult.push(object);
        this.calculatorFieldsData(intCount + 1, arrResult, callback);
      } else {
        if (
          this.$Utils.isEmpty(this.Setting.parentSetting, "isCall") &&
          this.Setting.Code == this.$rootScope.loggedOnUser.SupportForm
        ) {
          if (this.$Utils.isEmpty(this.Setting.parentSetting.object.CallId)) {
            var params = {
              RequestClass: "CallCenter",
              RequestAction: "GetCall",
              PhoneNumber: "",
              AgentCode: this.$rootScope.loggedOnUser.LoginName,
              UserID: this.$rootScope.loggedOnUser.UserId,
              CallType: "",
              CallService: "",
              ContactID: "",
              CallID: "",
              Group: "",
              Extension: "",
              CallURL: "https://api.ccall.vn/cdrs/json",
              api_key: this.$rootScope.loggedOnUser.ApiKey,
              api_secret: this.$rootScope.loggedOnUser.ApiSecret,
              source: "",
              call_id: this.Setting.parentSetting.object.CallId,
              cid_name: "",
              date_range: "",
              destination: "",
              direction: "",
              hangup_cause: "",
              limit: "",
              page: ""
            };
            this.$Utils.post(params).then(data => {
              data = this.$Utils.getDataWithRoot(data, "response.0.Cdr")[0];
              if (this.$Utils.isEmpty(data, "recording_file")) {
                this.objSourceData.RecordFile = data.recording_file;
              }
              this.objSourceData.TimeSupport = this.$Utils.isEmpty(
                data,
                "duration"
              )
                ? moment.duration(data.duration, "HH:mm:ss").asSeconds()
                : "";
              this.objSourceData.Extension = this.$rootScope.loggedOnUser.Extension;
              this.objSourceData.TypeCall = data.direction;
              this.objSourceData.IsType = 1;
              if (typeof data === "object") {
                this.Setting.functions.saveValue(arrResult, callback);
              } else
                this.$Utils.showMessage(
                  "error",
                  "Chưa lấy được thông tin cuộc gọi"
                );
            });
          }
        } else this.saveValue(arrResult, callback);
        if (this.$Utils.isEmpty(this.Setting.parentSetting, "listTask")) {
          $.each(this.Setting.parentSetting.listTask, (key, value) => {
            var returnData = this.$Utils.isEmpty(this.objSourceData)
                ? this.$Lodash.cloneDeep(this.objSourceData)
                : {},
              requestTask = this.$Lodash.cloneDeep(this.$singleRequest);
            requestTask.R1_Id = value.Id;
            requestTask.R1_RequestDataGroup = this.Setting.DataGroup;
            /**
             * bổ sung requestTask insert hay update dựa trên tồn tại Id
             */
            requestTask.R1_RequestTemplate =
              this.Setting.DataSource + ".Update";
            this.Setting.SubmitType = "Update";

            requestTask.R1_RequestFields = "Id;";
            $.each(arrResult, (k, v) => {
              if (v.name != "Id") {
                requestTask["R1_" + v.name] = v.value;
                requestTask.R1_RequestFields += v.name + ";";
              }
            });
            this.$Utils.post(requestTask).then(taskdata => {
              if (taskdata.success) {
                this.$Utils.showMessage(
                  "success",
                  this.$toastMessage.updateItemPre +
                    this.$toastMessage.updateItemSuf
                );
                /**
                 * kiểm tra dựa trên directiveType, nếu là inside thì trả dữ liệu về cho form cha
                 * nếu không thì gọi đến hàm xử lý sau khi post
                 */
                this.objSourceData = this.$Lodash.cloneDeep(returnData);

                if (
                  this.Setting.directiveType == "inside" &&
                  this.Setting.place != "page"
                ) {
                  callback(returnData);
                  // this.$rootScope.$broadcast("reloadList");
                } else {
                  submitDefault(returnData);
                  // $rootScope.$broadcast("reloadList");
                }
              } else {
                this.$Utils.showMessage(
                  "error",
                  this.$toastMessage.updateItemFailed
                );
              }
            });
          });
        }
      }
    },

    /**
     * hàm post dữ liệu, tạo request dựa trên listResult, trả lại dữ liệu cho form cha hay cập nhật lại list ...
     *
     * @param arrSubmitData
     * @param callback
     */
    saveValue(arrSubmitData, callback) {
      /**
       * khởi tạo request post dữ liệu, và object dữ liệu trả về
       */
      var returnData = this.$Utils.isEmpty(this.objSourceData)
          ? this.$Lodash.cloneDeep(this.objSourceData)
          : {},
        request = this.$Lodash.cloneDeep(this.$singleRequest);
      /** thêm dữ liệu trong default data vào request*/
      request = this.$Utils.updateParamsSingleRequest(
        request,
        this.objSourceData
      );
      $.each(arrSubmitData, (key, val) => {
        if (this.$Utils.isEmpty(val, "value")) {
          returnData[val.name] = val.value;
          if (val.submit && this.$Utils.isEmpty(val.value)) {
            if (
              this.$Utils.isEmpty(val, "setting") &&
              val.setting.ElementType == "MultiTree"
            ) {
              var cat = val.value.split(";").length;
              $.each(val.value.split(";"), (key, divine) => {
                if (this.$Utils.isEmpty(divine) && divine != "") {
                  var level = key + 1;
                  request["R1_" + val.name + "Level" + level] = divine;
                }
              });
              while (
                this.$Utils.isEmpty(
                  request["R1_" + val.name + "Level" + cat]
                ) &&
                request["R1_" + val.name + "Level" + cat] != ""
              ) {
                delete request["R1_" + val.name + "Level" + cat];
                cat++;
              }
            }
            request["R1_" + val.name] = val.value;
            if (
              request.R1_RequestFields &&
              request.R1_RequestFields.indexOf(";" + val.name + ";") < 0 &&
              request.R1_RequestFields.indexOf(val.name + ";") != 0
            ) {
              request.R1_RequestFields += val.name + ";";
            }
          }
        }
      });
      if (
        this.$Utils.isEmpty(this.currentButtonSetting, "CreateNew") &&
        this.currentButtonSetting.CreateNew == "true"
      ) {
        $.each(arrSubmitData, (key, value) => {
          if (this.$Utils.isEmpty(value.oldDisplay) && value.oldDisplay != "") {
            arrSubmitData[key].oldDisplay = "";
          }
        });
      }
      /**
       * gọi hàm kiểm tra dữ liệu so với ban đầu, trả về danh sách các trường đã được thay đổi dữ liệu
       */
      this.compareChange(returnData, arrSubmitData).then(arrayChanged => {
        /**
         * nếu không có thay đổi gì hoặc setting không submit thì bỏ qua giai đoạn post dữ liệu
         */
        if (
          arrayChanged.length > 0 &&
          this.Setting.SaveElementData != "false"
        ) {
          this.arrayChanged = arrayChanged;
          request.R1_RequestDataGroup = this.Setting.DataGroup;
          /**
           * bổ sung request insert hay update dựa trên tồn tại Id
           */
          if (
            this.$Utils.isEmpty(returnData.Id) &&
            ((!this.$Utils.isEmpty(
              this.Setting,
              "parentSetting.object.ReferenceId"
            ) &&
              (this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value") &&
                this.Setting.parentSetting.set.Value.indexOf("ReferenceId") <
                  0)) ||
              !this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value"))
          ) {
            request.R1_RequestTemplate = this.Setting.DataSource + ".Update";
            this.Setting.SubmitType = "Update";
          } else {
            request.R1_RequestTemplate = this.Setting.DataSource + ".Insert";
            this.Setting.SubmitType = "Insert";

            /** thêm trường ngày tạo và người tạo*/
            request.R1_CreatedByName = this.$Utils.getUserInfo("Username");
            returnData.Created = this.$Utils.formatDateTime(
              new Date(),
              "DD/MM/YYYY"
            );
            if (
              this.$Utils.isEmpty(
                this.Setting,
                "parentSetting.object.ReferenceId"
              ) &&
              this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value") &&
              this.Setting.parentSetting.set.Value.indexOf("ReferenceId") >= 0
            ) {
              request.R1_RequestTemplate = this.Setting.DataSource + ".Insert";
              request.R1_ReferenceId = this.Setting.parentSetting.object.ReferenceId;
              request.R1_NestedSetType = this.Setting.parentSetting.object.NestedSetType;
            }
          }
          /** thêm trường người chỉnh sửa*/
          request.R1_ModifiedByName = this.$Utils.getUserInfo("Username");
          returnData.ModifiedByName = this.$Utils.getUserInfo("Username");
          /** thêm trường phiên bản vào bản ghi */
          returnData.Version = !isNaN(returnData.Version)
            ? parseInt(returnData.Version) + 1
            : 1;
          request.R1_Version = returnData.Version;
          /** Thêm điều kiện từ Setting.AdditionConditions */
          $.each(
            this.$Utils.stringToObject(
              this.$Utils.expressionToString(
                returnData,
                this.$Utils.objectToString(this.Setting.AdditionConditions)
              )
            ),
            (key, val) => {
              request["R1_" + key] = val;
              returnData[key] = val;
              request.R1_RequestFields += key + ";";
            }
          );
          /** thêm tên các field vào request */
          $.each(this.Setting.Fields, (k, field) => {
            if (
              request.R1_RequestFields.indexOf(";" + field.Name + ";") < 0 &&
              request.R1_RequestFields.indexOf(field.Name + ";") != 0
            ) {
              request.R1_RequestFields += field.Name + ";";
            }
            // delete field.Data;
          });
          $.each(returnData, (key, val) => {
            returnData[key] = this.$Utils.expressionToString(this, val + "");
          });
          /** replace các giá trị là biến trong parameter với giá trị */
          $.each(request, (key, val) => {
            request[key] = this.$Utils.expressionToString(returnData, val + "");
          });
          if (
            this.$Utils.isEmpty(
              this.Setting,
              "parentSetting.object.ReferenceId"
            ) &&
            this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value") &&
            this.Setting.parentSetting.set.Value.indexOf("ReferenceId") >= 0
          ) {
            request.R1_Id = "";
            request.R1_ParentId = "";
            delete request.R1_Id;
            delete request.R1_ParentId;
          }
          if (this.Setting.DataSource == "AG_Task_Task") {
            var user = [];
            user.push(this.$Utils.getUserInfo("UserId"));
            request.R1_UserList = JSON.stringify(user);
            delete request.R1_Index;
          }
          if (
            this.$Utils.isEmpty(this.currentButtonSetting, "CreateNew") &&
            this.currentButtonSetting.CreateNew == "true"
          ) {
            delete request.R1_Id;
            request.R1_RequestTemplate = this.Setting.DataSource + ".Insert";
          }
          if (this.$Utils.isEmpty(this.Setting.parentSetting, "change")) {
            $.each(this.Setting.parentSetting.change, (cKey, cItem) => {
              if (!this.$Utils.isEmpty(request["R1_" + cKey])) {
                request["R1_" + cKey] = cItem;
              }
            });
          }
          var sourceData = this.$Lodash.cloneDeep(returnData);
          var sourceSetting = this.$Lodash.cloneDeep(this.Setting);
          if (this.Setting.DataSource == "AG_Task_Task") {
            if (this.$Utils.isEmpty(sourceSetting, "parentSetting"))
              delete sourceSetting.parentSetting.object.Recurrence;
            if (this.$Utils.isEmpty(sourceSetting, "sendData"))
              delete sourceSetting.sendData.Recurrence;
          }
          $.each(sourceSetting.Fields, (key, element) => {
            if (
              element.ElementType === "Select" ||
              element.ElementType === "Multi" ||
              element.ElementType === "Radio" ||
              element.ElementType === "Tree" ||
              element.ElementType === "MultiTree"
            ) {
              delete element.Data;
              delete element.treeData;
              delete element.sourceData;
            }
          });
          $.each(sourceSetting.Permissions, (key, value) => {
            if (this.$Utils.isEmpty(value.Permissions)) {
              sourceSetting.Permissions[
                key
              ].Permissions = this.$Utils.stringToObject(value.Permissions);
              if (value.Name != "Script" && value.Name != "Static") {
                var i = 1;
                while (this.$Utils.isEmpty(value.Permissions["Value" + i])) {
                  sourceSetting.Permissions[key].Permissions["Value" + i] =
                    sourceData[value.Permissions["Value" + i]];
                  i++;
                }
              } else if (value.Name == "Script") {
                sourceSetting.Permissions[key].LeadershipDynamicOrganization =
                  sourceData[
                    sourceSetting.Permissions[key].LeadershipDynamicOrganization
                  ];
              }
            } else if (value.Name == "Replica") {
              var arrDP = this.$Lodash.cloneDeep(
                sourceSetting.Permissions[key].DynamicPermissions.split(";")
              );
              sourceSetting.Permissions[key].DynamicPermissions = "";
              $.each(arrDP, (k, val) => {
                if (val != "" && this.$Utils.isEmpty(sourceData[val])) {
                  sourceSetting.Permissions[key].DynamicPermissions +=
                    sourceData[val] + ";";
                }
              });
              if (
                this.$Utils.isEmpty(sourceSetting.Permissions[key].FormCode) &&
                this.$Utils.isEmpty(sourceData.StatusDisplay)
              ) {
                sourceSetting.Permissions[key].StatusDisplay =
                  sourceData.StatusDisplay;
              }
            }
          });
          request["R1_FormSetting"] = JSON.stringify(sourceSetting);
          request["R1_Changed"] = JSON.stringify(arrayChanged);
          if (returnData.Id == "undefined" || returnData.Id == "null") {
            delete returnData.Id;
          }
          if (request["R1_State"] == 1) request["R1_State"] = 0;
          if (this.Setting.DataSource == "AG_Task_Task") {
            delete request.R1_Recurrence;
            delete request.R2_Recurrence;
          }
          this.LoadStart = this.$Utils.showLoading("start");
          if (this.Setting.Attachment && !request.R1_TotalDownload) {
            request.R1_TotalDownload = 0;
            request.R1_RequestFields += "TotalDownload;";
            this.Setting.Attachment = this.Setting.Attachment.split(";");
            this.Setting.Attachment.forEach(val => {
              if (val && val != "") {
                request.R1_TotalDownload++;
              }
            });
          }
          request.R1_RequestFields += this.ChildFields + ';';
          this.$Utils.post(request).then(data => {
            if (data.success && data.R1.success) {
              /**
               * kiểm tra có cần thêm phân quyền cho object hay không
               * mặc định chỉ update khi đây là trường hợp insert hoặc có setting
               * yêu cầu thêm phân quyền khi update
               */
              if (this.Setting.Attachment) {
                var uploadFile = this.$Lodash.cloneDeep(
                  this.Setting.Attachment
                );
                delete this.Setting.Attachment;
                this.Setting.clearUploaded();
                uploadFile.forEach(val => {
                  if (val && val != "") {
                    var params = {
                      RequestClass: "xBase",
                      RequestAction: "UpdateBinary",
                      Parent: data.R1.Data,
                      Id: val,
                      StaticFields: "Parent;Id"
                    };
                    this.$Utils.post(params).then(data => {
                      // $scope.widgetViewModel.datasource = [];
                    });
                  }
                });
              }
              if (
                !this.$Utils.isEmpty(returnData.Id) ||
                ((this.$Utils.isEmpty(
                  this.Setting,
                  "parentSetting.object.ReferenceId"
                ) &&
                  (this.$Utils.isEmpty(
                    this.Setting,
                    "parentSetting.set.Value"
                  ) &&
                    this.Setting.parentSetting.set.Value.indexOf(
                      "ReferenceId"
                    ) < 0)) ||
                  this.$Utils.isEmpty(this.Setting, "parentSetting.set.Value"))
              ) {
                returnData.Id = data.R1.Data;
                if (this.$Utils.isEmpty(data.R1.msg.Index)) {
                  returnData.Index = data.R1.msg.Index;
                }
                if (
                  this.$Utils.isEmpty(this.Setting, "Tabs") &&
                  this.Setting.Tabs.indexOf("Attachment") >= 0
                ) {
                  this.attachFunction.updateId(returnData.Id);
                }
                returnData.Created = this.$Utils.formatDateTime();
                returnData.CreatedBy = this.$Utils.getUserInfo("UserId");
                if (Array.isArray(this.Setting.Permissions)) {
                  this.addPermissionToObject(returnData, request);
                }
                if (
                  this.$Utils.isEmpty(this.Setting.parentSetting, "isCall") &&
                  this.Setting.Code == this.$rootScope.loggedOnUser.CustomerForm
                ) {
                  returnData.CallId = this.Setting.parentSetting.object.CallId;
                  // $rootScope.$broadcast("createCustomer", returnData);
                }

                /** bắn quyền linkObject để làm báo cáo */
                var requestLink = this.$Lodash.cloneDeep(this.$singleRequest);
                requestLink = this.$Utils.updateParamsSingleRequest(
                  requestLink,
                  {
                    RequestTemplate: "Permission.Insert",
                    Parent: returnData.Id,
                    Child: this.$Utils.getUserInfo("GroupRoot"),
                    Code: "LinkObject",
                    Name:
                      returnData.Name +
                      " - " +
                      this.$Utils.getUserInfo("GroupRootName"),
                    RequestAction: "LinkGroupToObject",
                    ParentTable: "xObject",
                    ChildTable: "tblGroup"
                  }
                );
              } else {
                var updatePermission = false;
                $.each(this.Setting.Permissions, (key, permission) => {
                  if (permission.AlwaysUpdatePermission) {
                    updatePermission = true;
                  }
                });
                if (updatePermission) {
                  var taskRequest = {
                    RequestClass: "xBase",
                    RequestAction: "Request",
                    TotalRequests: 1,
                    R1_RequestFields: "Id;Subscribe",
                    R1_RequestTemplate: "AG_Task_Task.Search",
                    R1_RequestDataGroup: "DataGroup.danh-sach-cong-viec.04b66",
                    R1_Id: this.Setting.sendData.Id
                  };
                  this.$Utils.post(taskRequest).then(subData => {
                    subData = this.$Utils.getDataWithRoot(
                      subData,
                      "R1.Data.TasksDS.Task"
                    );
                    returnData.Subscribe = this.$Utils.isEmpty(subData, "0")
                      ? subData[0].Subscribe
                      : "";
                    this.addPermissionToObject(returnData, request);
                  });
                } else {
                  if(this.LoadStart){
                    this.$Utils.showLoading("stop", this.LoadStart);
                    this.LoadStart = undefined;
                  }
                }
                returnData.ModifiedBy = this.$Utils.getUserInfo("UserId");
              }
              arrSubmitData.push({
                name: "Id",
                submit: true,
                validate: true,
                value: returnData.Id
              });

              this.FinishLoading = {};
              /**
               * kiểm tra dựa trên directiveType, nếu là inside thì trả dữ liệu về cho form cha
               * nếu không thì gọi đến hàm xử lý sau khi post
               */

              this.objSourceData = this.$Lodash.cloneDeep(returnData);
              if (
                this.Setting.directiveType == "inside" &&
                this.Setting.place != "page"
              ) {
                callback(returnData);
              } else {
                this.submitDefault(returnData);
              }
              this.$hub.$emit("close-modal");
              // $rootScope.$broadcast("ReloadData");
            } else {
              this.$Utils.showMessage(
                "error",
                this.$toastMessage.updateItemFailed
              );
            }
          });
          /**
           * tạo request seach template để lấy danh sách các loại các trường là
           * Struct, Static hay Dynamic
           */
        } else {
          /**
           * kiểm tra dựa trên directiveType, nếu là inside thì trả dữ liệu về cho form cha
           * nếu không thì gọi đến hàm xử lý sau khi post
           */
          if (
            this.Setting.directiveType == "inside" &&
            this.Setting.place != "page"
          ) {
            callback(returnData);
          } else {
            this.submitDefault(returnData);
          }
        }
      });
    },

    /**
     * hàm xử lý sau khi cập nhật dữ liệu, tự động đóng modal nếu có,
     * trả lại dữ liệu cho directive cha và gọi đến CallExtraService
     *
     * @param objReturn
     */
    submitDefault(objReturn) {
      if (this.$Utils.isEmpty(this.Setting.parentSetting)) {
        if (
          this.$Utils.isEmpty(
            this.Setting,
            "parentSetting.callback." +
              this.Setting.parentSetting.set.AfterUpdate
          )
        ) {
          this.Setting.parentSetting.callback[
            this.Setting.parentSetting.set.AfterUpdate
          ](objReturn);
        }
      }
      if (this.$Utils.isEmpty(this.currentButtonSetting, "AfterUpdate")) {
        switch (this.currentButtonSetting.AfterUpdate) {
          case "Redirect":
            this.onRedirect(this.currentButtonSetting.Redirect, objReturn);
            break;
          case "ClearValue":
            var clearArr = [];
            if (
              !this.$Utils.isEmpty(this.Setting, "directiveType") ||
              this.Setting.directiveType != "inside"
            ) {
              $.each(this.Setting.Fields, (key, value) => {
                if (
                  this.$Utils.isEmpty(value, "ClearAfter") &&
                  value.ClearAfter == "true"
                ) {
                  clearArr.push(value);
                }
              });
            }
            $.each(clearArr, (k, key) => {
              //console.log(key)
              // if (this.$Utils.isEmpty(this.fields, key.Name + ".setVal")) {
              if (this.$Utils.isEmpty(key, "FormDefaultValue")) {
                this.fields[key.Name].dataToDefault();
              } else {
                this.fields[key.Name].clearData();
              }
              // }
            });
            var clearChild = this.currentButtonSetting.ClearChild
              ? this.currentButtonSetting.ClearChild.split(";")
              : [];
            $.each(clearChild, (k, key) => {
              $.each(
                this.$Utils.getDataWithRoot(this.subElementObject, "Module"),
                (k, m) => {
                  if (key == m.Code) {
                    m.functions.setData({});
                    m.Fields(f => {
                      if (this.$Utils.isEmpty(f, "clearData")) {
                        f.clearData();
                      }
                    });
                  }
                }
              );
            });
            this.objSourceData = {};
            this.autoLoad(true);
            break;
          case "UpdateAnother":
            var conditionObject = {};
            if (this.$Utils.isEmpty(this.currentButtonSetting.Request)) {
              $.each(this.currentButtonSetting.Request, (k, updateRequest) => {
                $.each(updateRequest.RequestConditions.split(";"), (k, key) => {
                  if (updateRequest[key]) {
                    conditionObject[key.trim()] = updateRequest[key];
                  }
                });
                var request = this.$Lodash.cloneDeep(this.$singleRequest);
                $.each(conditionObject, (key, condition) => {
                  request["R1_" + key] = condition;
                });
                this.Setting.functions.replaceExpression(request, objReturn);
                request.R1_RequestTemplate =
                  updateRequest.RequestTemplate + "Search";
                this.$Utils.postCheckResult(request).then(result => {
                  if (result.success && result.R1.success) {
                    var listRequest = [],
                      MultiRequest = this.$Lodash.cloneDeep(
                        this.$singleRequest
                      ),
                      monoRequest = {};
                    delete monoRequest.TotalRequests;
                    var objDataSearch = this.$Utils.getDataWithRoot(
                      result.R1,
                      updateRequest.RootData
                    );
                    $.each(objDataSearch, (dataIndex, dataSearch) => {
                      monoRequest.RequestDataGroup =
                        updateRequest.RequestDataGroup;
                      monoRequest.RequestFields = "Id;";
                      if (this.$Utils.isEmpty(dataSearch, "Id")) {
                        monoRequest.RequestTemplate =
                          updateRequest.RequestTemplate + "Update";
                        monoRequest.Id = dataSearch.Id;
                      }
                      if (
                        this.$Utils.isEmpty(updateRequest.ParentChild) &&
                        updateRequest.ParentChild == "true"
                      ) {
                        var Links = this.Setting.Link;
                        if (this.$Utils.isEmpty(Links)) {
                          var SubElementLinks =
                            Links[updateRequest.RequestDataGroup];
                          if (this.$Utils.isEmpty(SubElementLinks)) {
                            $.each(
                              updateRequest.RequestFields.split(";"),
                              (k, field) => {
                                $.each(SubElementLinks, (k, value) => {
                                  if (
                                    value.Target != "Id" &&
                                    this.$Utils.isEmpty(
                                      objReturn[value.Source]
                                    ) &&
                                    value.Target == field
                                  ) {
                                    monoRequest[value.Target] =
                                      objReturn[value.Source];
                                    monoRequest.RequestFields +=
                                      value.Target + ";";
                                  }
                                  if (
                                    this.$Utils.isEmpty(
                                      objReturn[value.Source + "Name"]
                                    ) &&
                                    value.Target == field
                                  ) {
                                    monoRequest[value.Target + "Name"] =
                                      objReturn[value.Source + "Name"];
                                    monoRequest.RequestFields +=
                                      value.Target + "Name;";
                                  }
                                });
                              }
                            );
                          }
                        }
                      } else {
                        $.each(objReturn, (key, val) => {
                          monoRequest[key] = val;
                        });
                      }
                      if (this.$Utils.isEmpty(updateRequest.Expression)) {
                        var expression = updateRequest.Expression;
                        $.each(expression, (item, exp) => {
                          var endLoop = false;
                          while (endLoop != true) {
                            if (exp.indexOf("}}") > exp.indexOf("{{")) {
                              var key = exp.substr(
                                exp.indexOf("{{") + 2,
                                exp.indexOf("}}") - exp.indexOf("{{") - 2
                              );
                              /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
                              var name = this.$Lodash.cloneDeep(key),
                                value = "";
                              if (key.indexOf(".") > 0) {
                                name = key.substr(0, key.indexOf(".")).trim();
                                value = key
                                  .substr(key.indexOf(".") + 1, key.length)
                                  .trim();
                              }
                              if (
                                name == "parent" &&
                                this.$Utils.isEmpty(objReturn, value)
                              ) {
                                exp = exp.replace(
                                  "{{" + name + "." + value + "}}",
                                  objReturn[value]
                                );
                              } else if (
                                name == "child" &&
                                this.$Utils.isEmpty(dataSearch, value)
                              ) {
                                exp = exp.replace(
                                  "{{" + name + "." + value + "}}",
                                  dataSearch[value]
                                );
                              } else {
                                exp = exp.replace(
                                  "{{" + name + "." + value + "}}",
                                  0
                                );
                              }
                            }
                            if (exp.indexOf("{{") < 0) {
                              exp = this.$Utils.calculator(exp);
                              endLoop = true;
                            }
                          }
                          if (
                            this.$Utils.isEmpty(exp) &&
                            !(typeof exp === "string")
                          ) {
                            monoRequest[item] = exp;
                          }
                        });
                      }
                      listRequest.push(monoRequest);
                      MultiRequest = this.$Utils.updateParamsSingleRequest(
                        MultiRequest,
                        monoRequest,
                        listRequest.length
                      );
                      if (dataIndex == objDataSearch.length - 1) {
                        MultiRequest.TotalRequests = listRequest.length;
                        this.$Utils.postCheckResult(MultiRequest).then(data => {
                          if (data.success && data.R1.success) {
                            this.$Utils.showMessage(
                              "success",
                              this.$toastMessage.updateItemPre +
                                (MultiRequest.Name ? MultiRequest.Name : "") +
                                this.$toastMessage.updateItemSuf
                            );
                          } else {
                            this.$Utils.showMessage(
                              "error",
                              this.$toastMessage.updateItemFailed
                            );
                          }
                        });
                      }
                    });
                  } else {
                    this.$Utils.showMessage(
                      "error",
                      this.$toastMessage.loadingDataFailed
                    );
                  }
                  if (this.currentButtonSetting.AfterAction == "Redirect") {
                    this.onRedirect(
                      this.currentButtonSetting.Redirect,
                      objReturn
                    );
                  } else if (
                    this.currentButtonSetting.AfterAction == "CloseModal"
                  ) {
                    this.$hub.$emit("close-modal");
                  }
                });
              });
            }
            break;
          default:
            /** close modal*/
            this.$hub.$emit("close-modal");
            break;
        }
      } else {
        /** close modal*/
          this.$hub.$emit("close-modal");
      }
    },

    replaceExpression(request, object) {
      /** replace các giá trị là biến trong parameter với giá trị */
      $.each(request, (paramName, strVal) => {
        strVal = strVal + "";
        if (
          strVal.indexOf("{{") >= 0 &&
          strVal.indexOf("}}") > strVal.indexOf("{{")
        ) {
          var exp = strVal,
            returnExpression = "";
          while (exp != "") {
            returnExpression += exp.substr(0, exp.indexOf("{{"));
            var key = exp.substr(
              exp.indexOf("{{") + 2,
              exp.indexOf("}}") - exp.indexOf("{{") - 2
            );
            /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
            if (key.indexOf("|") > 0) {
              var name = key.substr(0, key.indexOf("|")).trim();
              var value = this.$Utils.getDataWithRoot(object, name)[0];
              var filter = key
                .substr(key.indexOf("|") + 1, key.length)
                .split(":");
              var type = filter[0].trim();
              var format = filter[1];
              switch (type) {
                /** trường hợp ngày tháng, lấy giá trị ngày tháng hiện tại với định dạng*/
                case "Date":
                  value = this.$Utils.stringToDate(value);
                  returnExpression += this.$Utils.formatDateTime(value, format);
                  break;
                case "UserInfo":
                  /** trường hợp lấy thông tin người dùng*/
                  returnExpression += this.$Utils.getUserInfo(name);
                  break;
                case "Url":
                  /** trường hợp lấy thông tin từ đường dẫn*/
                  returnExpression += this.Setting.UrlData[name];
                  break;
                default:
                  returnExpression += value;
                  break;
              }
            } else if (this.$Utils.isEmpty(object[key])) {
              returnExpression += object[key];
            }
            exp = exp.substr(exp.indexOf("}}") + 2, exp.length);
          }
          request[paramName] = returnExpression;
        }
      });
      return request;
    },

    /**
     * hàm so sánh danh sách danh sách kết quả với dữ liệu bạn đầu, trả về danh sách các trường thay đổi
     *
     * @param objReturn
     * @param arrData
     */
    compareChange(objReturn, arrData) {
      return new Promise((resolve, reject) => {
        var arrChanged = [];
        /** using for loop compare each field in this.objSourceData with objReturn,
         * if different push a object with fields: ColumnCaption, ColumnName, OldValue, NewValue,
         * OldDisplayValue, NewDisplayValue to arrChanged
         */
        $.each(objReturn, (key, val) => {
          if (
            this.objSourceData[key] !== val &&
            !(!this.$Utils.isEmpty(this.objSourceData[key]) && val == "")
          ) {
            /** kiểm tra có tồn tại trường có Name tương úng hay không, nêu đây là combo select, sử dụng caption để hiển thị*/
            var caption = this.$Utils.isEmpty(this.fields, key + ".Caption")
              ? this.fields[key].Caption
              : key;
            if (key.length > 4 && key.indexOf("Name") > 0) {
              var name = key.substr(0, key.length - 4);
              if (this.$Utils.isEmpty(this.fields, name)) {
                caption = this.fields[name].Caption
                  ? this.fields[name].Caption
                  : name;
              }
            }
            var submit = {};
            $.each(arrData, (k, object) => {
              if (object.name == key) {
                submit = object;
              }
            });
            var changedObject = {
              ColumnCaption: caption,
              ColumnName: key,
              OldDisplayValue: submit.oldDisplay
                ? submit.oldDisplay
                : this.objSourceData[key],
              OldValue: this.objSourceData[key],
              NewDisplayValue: submit.display ? submit.display : val,
              NewValue: val
            };
            /**
             * so sánh dựa trên phân loại của dữ liệu trong trường hợp dữ liệu là ngày tháng hay số thực
             */
            if (this.$Utils.isEmpty(this.fields[key])) {
              switch (this.fields[key].FieldColumnType) {
                case "DateTime":
                  if (
                    this.$Utils.stringToDate(val).getTime() ==
                    this.$Utils.stringToDate(changedObject.OldValue).getTime()
                  ) {
                    changedObject = undefined;
                  }
                  break;
                case "Double":
                  if (parseFloat(val) == parseFloat(this.objSourceData[key])) {
                    changedObject = undefined;
                  }
                  break;
                case "Integer":
                  if (parseFloat(val) == parseFloat(this.objSourceData[key])) {
                    changedObject = undefined;
                  }
                  break;
              }
            }
            if (changedObject) {
              arrChanged.push(changedObject);
            }
          }
        });
        resolve(arrChanged);
      });
    },

    /**
     * hàm thay dổi giá trị trong mỗi element con, nếu không có element thì sẽ thay đổi toàn bộ giá trị trong
     * các element con
     *
     * @param data: input data
     */
    setDataToElement(data) {
      var ctrl = this;
      /** đặt lại giá trị mặc định*/
      ctrl.objSourceData = ctrl.$Utils.isEmpty(
        ctrl.Setting,
        "parentSetting.object"
      )
        ? ctrl.$Lodash.cloneDeep(ctrl.Setting.parentSetting.object)
        : {};
      $.each(data, (key, val) => {
        ctrl.objSourceData[key] = val;
      });
      ctrl.Setting.sendData = ctrl.$Lodash.cloneDeep(ctrl.objSourceData);
      $.each(ctrl.Setting.Fields, (k, field) => {
        if (ctrl.$Utils.isEmpty(field.setVal)) {
          console.log(field)
          field.setVal(ctrl.Setting.sendData);

        }
      });
      $.each(ctrl.subElementObject.Module, (k, module) => {
        // if (ctrl.$Utils.isEmpty(module, "functions.setData")) {
        //   var moduleSetting = {};
        //   $.each(ctrl.Setting.SubElements, (k, sub) => {
        //     if (sub.ModuleCode == module.Code) {
        //       moduleSetting = sub;
        //     }
        //   });
        //   if (moduleSetting.ParentChild) {
        //     var object = {};
        //     $.each(
        //       ctrl.$Utils.stringToObject(moduleSetting.ParentChild),
        //       (parentKey, childKey) => {
        //         if (ctrl.$Utils.isEmpty(ctrl.Setting.sendData[parentKey])) {
        //           object[childKey] = ctrl.Setting.sendData[parentKey];
        //         }
        //       }
        //     );
        //     module.functions.setData(object);
        //   } else {
        //     module.functions.setData(data);
        //   }
        // }
      });
    },

    /**
     * hàm lấy thêm dữ liệu object từ server trong trường hợp giá trị hiện tại chưa có đầy đủ
     */
    getFullData() {
      /** create search request */
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = this.Setting.DataSource + ".Search";
      /** Thêm điều kiện từ Setting.AdditionConditions */
      request.R1_Id = this.objSourceData.Id;
      request.R1_RequestFields = "";
      request.R1_RequestDataGroup = this.Setting.DataGroup;
      $.each(this.Setting.AdditionConditions, (key, val) => {
        request["R1_" + key] = val;
      });
      $.each(this.Setting.Fields, (k, field) => {
        request.R1_RequestFields += field.Name + ";";
        if (field.DynamicText) {
          request.R1_RequestFields += field.DynamicText + ";";
        }
      });
      /** chuyển các biến trong parameter sang giá trị*/
      $.each(request, (key, val) => {
        request[key] = this.$Utils.expressionToString(
          this.objSourceData,
          val + ""
        );
      });
      /** post search request */
      this.$Utils.postCheckResult(request).then(result => {
        if (result.success && result.R1.success) {
          var dataSearch = this.$Utils.getDataWithRoot(
            result.R1,
            this.Setting.RootData
          )[0];
          if (this.$Utils.isEmpty(dataSearch)) {
            /** đặt lại các giá trị mặc định */
            if (
              this.Setting.DataSource == "AG_Task_Task" &&
              this.$Utils.isEmpty(dataSearch, "Id")
            ) {
              this.saveUserList(dataSearch);
            }
            // this.Setting.functions.setTemplate();
            this.setupListElement();
            this.setDataToElement(dataSearch);
          }
        } else {
          this.$Utils.showMessage(
            "error",
            this.$toastMessage.loadingDataFailed
          );
        }
      });
    },

    /**
     * hàm set dữ liệu vào các element và module con
     *
     * @param item: dữ liệu dùng để set
     */
    setData(item) {
      this.objSourceData = this.$Utils.isEmpty(
        this.Setting,
        "parentSetting.object"
      )
        ? this.$Lodash.cloneDeep(this.Setting.parentSetting.object)
        : {};
      $.each(item, (key, val) => {
        this.objSourceData[key] = val;
      });
      if (this.$Utils.isEmpty(item.Id)) {
        this.getFullData();
      } else {
        this.setDataToElement(item);
      }
    },

    /**
     * hàm so sánh dữ liệu thay đổi với danh sách Dependencies, gửi thông báo đến tất cả các element có
     * DependOn tương ứng với data, đồng thời kiểm tra có tồn tại element có phải là directive không thì
     * thông báo thay dổi đến các element
     *
     * @param {type} data: new value
     */
    checkDependencies(data) {
      $.each(this.Setting.Dependencies, (k, depend) => {
        if (this.$Utils.isEmpty(data.name) && depend.Source == data.name) {
          if (
            this.$Utils.isEmpty(
              this.fields,
              depend.Target + ".dependencyChange"
            )
          ) {
            this.fields[depend.Target].dependencyChange(depend, data);
          } else if (
            depend.Source.indexOf(".") > 0 &&
            this.$Utils.isEmpty(
              this.Setting.Fields,
              depend.Source.substring(0, depend.Source.indexOf(".")) +
                ".dependencyChange"
            )
          ) {
            this.Setting.Fields[
              depend.Target.substring(0, depend.Target.indexOf("."))
            ].dependencyChange(data);
          }
        }
      });
      /**
       * gọi đến hàm quản lý dependency của form cha nếu đây là form con
       */
      if (this.Setting.directiveType === "inside") {
        if (
          this.$Utils.isEmpty(
            this.Setting,
            "passingData.callback.onDrtElementChange"
          )
        ) {
          this.Setting.passingData.callback.onDrtElementChange(data);
        }
      }
    },

    /**
     * Tạo permission cho object, khi khởi chạy bắt đầu từ count = 0, tạo danh sách các request tạo link
     * tương ứng với arrPermission[count], sau đó lại gọi lại chính hàm này với count + 1, cho đến khi
     * count = arrPermission.length, thì khởi tạo multi request bắn phân quyền
     * nếu có Setting Remove phân quyền sẽ xóa toàn bộ phân quyền cũ
     *
     * @param object: dữ liệu cần bắn phân quyền
     */
    sendNotifi(t, u, n) {
      switch (t) {
        case "System": {
          this.$hub.proxy.invoke("sendSystemNotification", u, n);
          break;
        }
        case "Group": {
          this.$hub.proxy.invoke("sendGroupNotification", u, n);
          break;
        }
        case "Individual": {
          this.$hub.proxy.invoke("sendIndividualNotification", u, n);
          break;
        }
        default:
          break;
      }
    },
    addPermissionToObject(object, request) {
      if (this.Repeat && this.ReType && this.ReEndDate) {
        var freq = "";
        switch (this.ReType) {
          case "Day":
            freq = "DAILY";
            break;
          case "Week":
            freq = "WEEKLY";
            break;
          case "Month":
            freq = "MONTHLY";
            break;
        }
        var obj = {
          RRULE: {
            FREQ: freq,
            START: request.R1_PlanStartDate,
            UNTIL: this.$Utils.formatDateTime(this.ReEndDate)
          }
        };
        if (this.$Utils.isEmpty(request, "R1_FormSetting")) {
          delete request.R1_FormSetting;
        }
        if (this.$Utils.isEmpty(request, "R1_Changed")) {
          delete request.R1_Changed;
        }
        request.R1_Id = object.Id;
        request.R1_RequestTemplate = "AG_Task_Task.InsertRecurrence";
        request.R1_Recurrence = JSON.stringify(obj);
        this.$Utils.post(request);
      }
      if(this.LoadStart){
        this.$Utils.showLoading("stop", this.LoadStart);
        this.LoadStart = undefined;
      }
      if (this.Setting.DataSource == "AG_Task_Task") {
        try {
          saveEventToGoogle(object, request);
        } catch (err) {
          console.log(JSON.stringify(err));
        }
      }
      this.$Utils.showMessage(
        "success",
        this.$toastMessage.updateItemPre +
          (this.objSourceData.Name ? this.objSourceData.Name : "") +
          this.$toastMessage.updateItemSuf
      );
      var strAction = this.$Utils.isEmpty(this.objSourceData, "Id")
        ? "updated"
        : "insert";
      var strDocumentId = "";
      if (this.$Utils.isEmpty(object, "Code") && object.Code === "Document") {
        strAction = "Document" + this.Setting.SubmitType;
        strDocumentId = object.Id;
      }
      /** gửi thông báo tạo mới/thay đổi khi có setting*/
      if (this.$Utils.isEmpty(this.Setting.parentSetting, "loadCalendar")) {
        // $rootScope.$broadcast("loadCalendar", object);
        this.$hub.$emit("loadCalendar", object);
      }
      if (this.$Utils.isEmpty(this.Setting.parentSetting, "loadScrumboard")) {
        // $rootScope.$broadcast("loadScrumboard", this.arrayChanged);
        this.$hub.$emit("loadScrumboard", object);
      }
      var paramsSearchLinked = {
        RequestAction: "SearchLinked",
        RequestClass: "Addition",
        ConditionFields: "Parent;Code",
        StaticFields: "Code;Child;Parent;Name;Created;Description;ChildTable",
        OrderFields: "Created DESC",
        Parent: object.Id,
        Code: "Notification"
      };
      this.$Utils.post(paramsSearchLinked).then(arrRequest => {
        arrRequest = this.$Utils.getDataWithRoot(
          arrRequest,
          "Data.DataDS.Linked"
        );
        var objNotification = [];
        var gid = this.$Utils.uuidv4();
        var allRequest = this.$Lodash.cloneDeep(arrRequest);
        $.each(allRequest, (k, item) => {
          if (item.Code == "Notification") objNotification.push(item);
        });
        if (objNotification.length > 0) {
          var baseURL =
            this.$appUri.BaseURL !== "/"
              ? this.$appUri.BaseURL.substring(0, this.$appUri.BaseURL.length - 1)
              : window.origin;
          console.log(this.$appUri.BaseURL);
          console.log(window.origin);
          console.log(baseURL);
          //   this.$appUri.BaseURL != "/"
          //     ? this.$appUri.BaseURL.substring(
          //         0,
          //         this.$appUri.BaseURL.length - 1
          //       )
          //     : this.$appUri.BaseURL.substring(
          //         0,
          //         this.$appUri.BaseURL.length - 1
          //       );
          // // : $location.$$protocol + "://" + $location.$$host;
          var SOA =
            baseURL +
            ":" +
            JSON.parse(
              this.$getItemLocalStorage(this.$localStorageConstant.Notification)
            ).Port;
          $.each(objNotification, (k, val) => {
            this.sender = JSON.stringify({
              i: this.$rootScope.loggedOnUser.UserId,
              a: this.$rootScope.loggedOnUser.LoginName,
              avatar: this.$rootScope.loggedOnUser.Avatar,
              n: this.$rootScope.loggedOnUser.Username,
              s: this.$getItemLocalStorage(
                this.$localStorageConstant.SessionId
              ),
              g: "",
              p: JSON.parse(
                this.$getItemLocalStorage(
                  this.$localStorageConstant.Notification
                )
              ).Port,
              c: "10",
              e: baseURL
            });
            if (this.$Utils.isEmpty(strDocumentId)) {
              this.content = JSON.stringify({
                id: gid,
                action: strAction,
                index: object.Index,
                DocumentId: strDocumentId,
                Name: object.Name
              });
            } else {
              this.content = JSON.stringify({
                id: gid,
                action: strAction,
                index: object.Index,
                Name: object.Name
              });
            }
            this.notification = JSON.stringify({
              i: gid,
              mt: 1,
              st: "3",
              s: this.sender,
              c: this.content,
              d: JSON.stringify(object)
            });
            if (val.ChildTable == "tblGroup") {
              this.toGroup = JSON.stringify({ i: val.Child, e: baseURL });
              this.sendNotifi("Group", this.toGroup, this.notification);
            } else {
              this.to = JSON.stringify({ i: val.Child, c: "10", e: baseURL });
              this.sendNotifi("Individual", this.to, this.notification);
            }
          });
        }
        // if (this.Setting.Notifications) {
        //   if (this.$Utils.isEmpty(object.Id)) {
        //     var requestSearch = this.$Lodash.cloneDeep(singleRequest);
        //     requestSearch.R1_RequestTemplate = this.Setting.DataSource + '.Search';
        //     requestSearch.R1_Id = object.Id;
        //     requestSearch.R1_RequestFields = 'Id;Modified';
        //     requestSearch.R1_RequestDataGroup = this.Setting.DataGroup;

        //     this.$Utils.post(requestSearch).then(function(result) {
        //       if (result.success && result.R1.success) {
        //         var dataSearch = this.$Utils.getDataWithRoot(result.R1, this.Setting.RootData)[0];
        //         if (this.$Utils.isEmpty(dataSearch)) {
        //           /** đặt lại các giá trị mặc định */
        //           object.Modified = dataSearch.Modified;
        //           sendNotification(arrRequest, object);
        //         } else {
        //           sendNotification(arrRequest, object);
        //         }
        //       } else {
        //         sendNotification(arrRequest, object);
        //       }
        //     })
        //   } else {
        //     sendNotification(arrRequest, object);
        //   }
        // }
      });
    },

    /**
     * hàm gửi email, tin nhắn cho người dùng sau khi tạo phân quyền, lấy ra danh sách có quyền tương ứng trong setting
     * search template mail, tin nhắn trên server và tạo ra request với nội dung tương ứng
     *
     * @param arrRequest: danh sách phân quyền
     * @param objReturn: dữ liệu được sử dụng để gửi thông tin
     * @returns {boolean}
     */
    sendNotification(arrRequest, objReturn, request) {

      /** get template sms, email... from setting*/
      var request = this.$Lodash.cloneDeep(this.$singleRequest),
        templateObject = {},
        userIds = "",
        requireOriginal = false;
      request["R1_Code"] = "";
      $.each(this.Setting.Notifications, (k, notificationSetting) => {
        /** thêm request search template
         *  templateObject: object lưu lại thông tin template
         */
        request["R" + request.TotalRequests + "_RequestTemplate"] =
          "SettingNew.SearchSetting";
        request["R" + request.TotalRequests + "_Code"] =
          notificationSetting.Template + ";";
        templateObject[notificationSetting.Name] = {
          TemplateCode: notificationSetting.Template,
          Template: "",
          Code: notificationSetting.NotificationType,
          Receivers: [],
          Title: "",
          From: "",
          EmailAccount: "",
          Static: notificationSetting.AdditionField
            ? notificationSetting.AdditionField
            : "",
          Dynamic: notificationSetting.NotifyFields
            ? notificationSetting.NotifyFields
            : ""
        };
        /**
         * Tạo danh sách userId tương ứng với mỗi templateObject
         * @type {string}
         */
        var code = notificationSetting.Permissions
          ? notificationSetting.Permissions
          : "";
        $.each(code.split(";"), (k, strCode) => {
          $.each(arrRequest, (k2, permissionRequest) => {
            if (
              permissionRequest.Code == strCode &&
              templateObject[notificationSetting.Name].Receivers
                .join(";")
                .indexOf(permissionRequest.Child) < 0
            ) {
              templateObject[notificationSetting.Name].Receivers.push(
                permissionRequest.Child
              );
              if (userIds.indexOf(permissionRequest.Child) < 0) {
                userIds += permissionRequest.Child + ";";
              }
            }
          });
        });
        if (notificationSetting.RequireOriginal == "true") {
          requireOriginal = true;
        }
      });
      if (userIds !== "") {
        /** thêm vào request seach thông tin người dùng*/
        request.TotalRequests++;
        request = this.$Utils.updateParamsSingleRequest(
          request,
          {
            UserId: userIds,
            RequestTemplate: "User",
            Status: 1
          },
          request.TotalRequests
        );
      }
      /** chuyển các biến trong parameter sang giá trị*/
      $.each(request, (key, val) => {
        request[key] = this.$Utils.expressionToString(objReturn, val + "");
      });
      /** post request search, return templateEmail/SMS, list user, Original info for returnObject... */
      this.$Utils.post(request).then(resultTemplate => {
        if (!resultTemplate.success) {
          return false;
        }
        /** fill data from result template to templateObject, userArray, and returnObject*/
        $.each(
          this.$Utils.getDataWithRoot(
            resultTemplate,
            "R1.Data.DynamicDS.Setting"
          ),
          (k, template) => {
            var notifiTemplate = JSON.parse(template.Description);
            for (var i = 0; i < this.Setting.Notifications.length; i++) {
              if (template.Code == this.Setting.Notifications[i].Template) {
                templateObject[
                  this.Setting.Notifications[i].Name
                ].Template = this.$Utils.decodeHtmlEntities(
                  notifiTemplate.Content
                );
                templateObject[
                  this.Setting.Notifications[i].Name
                ].EmailAccount =
                  notifiTemplate.EmailAccount;
                templateObject[this.Setting.Notifications[i].Name].From =
                  notifiTemplate.From;
                templateObject[this.Setting.Notifications[i].Name].Title =
                  notifiTemplate.Title;
                templateObject[this.Setting.Notifications[i].Name].TitleInsert =
                  notifiTemplate.TitleInsert;
                templateObject[this.Setting.Notifications[i].Name].TitleUpdate =
                  notifiTemplate.TitleUpdate;
              }
            }
          }
        );
        /** set arrayUser to templateObject*/
        var arrUser = this.$Utils.getDataWithRoot(
          resultTemplate,
          "R" + (this.Setting.Notifications.length + 1) + ".Data.UserDS.User"
        );
        /** set returnObject if get origin data is required*/
        if (this.$Utils.isEmpty(resultTemplate.R3)) {
          if (requireOriginal) {
            var object = this.$Utils.getDataWithRoot(
              resultTemplate["R" + (this.Setting.Notifications.length + 1)],
              this.Setting.RootData
            )[0];
            $.each(object, (key, val) => {
              objReturn[key] = val;
            });
          }
        }
        var arrayRequest = [];
        $.each(templateObject, (k, tps) => {
          /**
           * Kiểm tra trong template có yêu cầu hiển thị danh sách thay dổi hay không
           * nếu có replace {{ListChange với danh sách thay đổi
           */
          if (tps.Template.indexOf("{{ListChange") > 0) {
            var listChangekey = [];
            $.each(this.Setting.Fields, (k, field) => {
              if (field.History == "true") {
                listChangekey.push(field.Name);
              }
            });
            /**
             * Biểu thức trong ListChange có dạng {paraA} {paraB}
             * strReplace: chuỗi danh sách các thay đổi
             * @type {string}
             */
            var string = tps.Template.substring(
              tps.Template.indexOf("{{ListChange") + 2,
              tps.Template.length
            );
            var str = "{{" + string.substr(0, string.indexOf("}}") + 2);
            var template = string.substr(
              string.indexOf("|") + 1,
              string.indexOf("}}") - string.indexOf("|") - 2
            );
            var strReplace = "";
            /** chuyển thành dạng biểu thức thông thường để đưa vào hàm replace giá trị*/
            template = template.replaceAll("{", "{{").replaceAll("}", "}}");
            $.each(this.arrayChanged, (key, itemChanged) => {
              if (
                listChangekey.indexOf(itemChanged.ColumnName) >= 0 &&
                this.fields[itemChanged.ColumnName].History == "true" &&
                itemChanged.NewValue != itemChanged.OldValue
              ) {
                if (
                  this.$Utils.isEmpty(
                    this.fields[itemChanged.ColumnName],
                    "DynamicText"
                  )
                ) {
                  $.each(this.arrayChanged, (k, itemName) => {
                    if (
                      itemName.ColumnName ==
                      this.fields[itemChanged.ColumnName].DynamicText
                    ) {
                      this.arrayChanged[key].NewDisplayValue =
                        itemName.NewDisplayValue;
                      this.arrayChanged[key].OldDisplayValue =
                        itemName.OldDisplayValue;
                    }
                  });
                }
                /** gọi service replace giá trị và decode html nếu cần, thêm vào strReplace*/
                if (
                  this.$Utils.isEmpty(
                    this.Setting.Fields,
                    itemChanged.ColumnName + ".ElementType",
                    true
                  ) == "Html"
                ) {
                  strReplace += this.$Utils.decodeHtmlEntities(
                    this.$Utils.expressionToString(itemChanged, template)
                  );
                } else {
                  strReplace += this.$Utils.expressionToString(
                    itemChanged,
                    template
                  );
                }
              }
            });
            /** replace ListChange với chuỗi thu được*/
            tps.Template = tps.Template.replace(str, strReplace);
          }
          /** replace các biến giá trị trong template với giá trị trong objReturn*/
          tps.Template = this.$Utils.expressionToString(
            objReturn,
            tps.Template
          );
          if (
            this.$Utils.isEmpty(tps.TitleInsert) &&
            this.Setting.SubmitType == "Insert"
          )
            tps.Title = this.$Utils.expressionToString(
              objReturn,
              tps.TitleInsert
            );
          else if (
            this.$Utils.isEmpty(tps.TitleUpdate) &&
            this.Setting.SubmitType == "Update"
          )
            tps.Title = this.$Utils.expressionToString(
              objReturn,
              tps.TitleUpdate
            );
          else tps.Title = this.$Utils.expressionToString(objReturn, tps.Title);
          $.each(tps.Receivers, (k, userId) => {
            var user;
            for (var i = 0; i < arrUser.length; i++) {
              if (userId == arrUser[i].UserId) {
                user = arrUser[i];
                break;
              }
            }
            /** tạo request email từ template*/
            if (this.$Utils.isEmpty(user)) {
              arrayRequest.push({
                To: user.Email,
                Code: objReturn.Id,
                Subject: tps.Title,
                Body: this.$Utils.encodeHtmlEntities(tps.Template),
                Name: "Email",
                From: tps.From,
                EmailAccount: tps.EmailAccount,
                State: 2,
                Date: this.$Utils.formatDateTime(),
                Parent: this.$Utils.getUserInfo("UserId"),
                Sender: this.$Utils.getUserInfo("UserId"),
                SenderName: this.$Utils.getUserInfo("Username"),
                Receiver: user.UserId,
                ReceiverName: user.Username
              });
            }
          });
          /** tạo danh sách email từ setting bao gồm email động trong object, và email tĩnh setting trước*/
          var arrTo = [];
          if (typeof tps.Static === "string") {
            arrTo = arrTo.concat(tps.Static.split(";"));
          }
          if (typeof tps.Dynamic === "string") {
            $.each(tps.Static.split(";"), (k, field) => {
              if (this.$Utils.isEmpty(objReturn[field])) {
                arrTo.push(objReturn[field]);
              }
            });
          }
          $.each(arrTo, (k, to) => {
            arrayRequest.push({
              To: to,
              Code: objReturn.Id,
              Subject: tps.Title,
              Body: this.$Utils.encodeHtmlEntities(tps.Template),
              Name: "Email",
              From: tps.From,
              EmailAccount: tps.EmailAccount,
              State: 2,
              Date: this.$Utils.formatDateTime(),
              Parent: this.$Utils.getUserInfo("UserId"),
              Sender: this.$Utils.getUserInfo("UserId"),
              SenderName: this.$Utils.getUserInfo("Username"),
              Receiver: this.$defaultUndefined,
              ReceiverName: this.$defaultUndefined
            });
          });
        });
        var notificationRequest = this.$Lodash.cloneDeep(this.$singleRequest);
        /** convert to multi request before post to server  */
        notificationRequest.TotalRequests = 0;
        notificationRequest.RequestTemplate = "SendMessage";
        $.each(arrayRequest, (k, req) => {
          if (req.To) {
            notificationRequest.TotalRequests++;
            $.each(req, (key, val) => {
              notificationRequest[
                "R" + notificationRequest.TotalRequests + "_" + key
              ] = val;
            });
          }
        });
        /** if TotalRequests > 0, post to server */
        if (notificationRequest.TotalRequests > 0) {
          this.$Utils.post(notificationRequest);
        }
      });
    },

    /**
     * Tạo lịch sử thay đổi của object
     *
     * @param arrChanged: danh sách các trường thay đổi
     * @param objReturn: dữ liệu, dùng để lấy các thông tin
     */
    createHistoryLogs(arrChanged, objReturn, request) {
      var countHistory = this.$Utils.updateParamsSingleRequest(
        this.$Lodash.cloneDeep(this.$singleRequest),
        {
          RequestTemplate: "ChangedLogs.Count",
          SourceId: objReturn.Id,
          Code: "ChangedHistory"
        }
      );
      this.$Utils.post(countHistory).then(result => {
        if (this.$Utils.isEmpty(result, "R1.Data")) {
          var insertRequest = this.$Utils.updateParamsSingleRequest(
            countHistory,
            {
              RequestTemplate: "ChangedLogs.Insert",
              Version: parseInt(result.R1.Data) + 1,
              Changes: JSON.stringify(arrChanged),
              CreatedByName: this.$Utils.getUserInfo("Username")
            }
          );
          this.$Utils.post(insertRequest).then(insertResult => {
            if (insertResult.success && insertResult.R1.success) {
              this.historyFlag = true;
              if (this.Repeat && this.ReType && this.ReEndDate) {
                var freq = "";
                switch (this.ReType) {
                  case "Day":
                    freq = "DAILY";
                    break;
                  case "Week":
                    freq = "WEEKLY";
                    break;
                  case "Month":
                    freq = "MONTHLY";
                    break;
                }
                var obj = {
                  RRULE: {
                    FREQ: freq,
                    START: request.R1_PlanStartDate,
                    UNTIL: this.$Utils.formatDateTime(this.ReEndDate)
                  }
                };
                request.R1_RequestTemplate = "AG_Task_Task.InsertRecurrence";
                request.R1_Recurrence = JSON.stringify(obj);
                if (this.historyFlag && this.permissionFlag) {
                  this.$Utils.post(request);
                }
                if(this.LoadStart){
                  this.$Utils.showLoading("stop", this.LoadStart);
                  this.LoadStart = undefined;
                }
                this.$Utils.showMessage(
                  "success",
                  this.$toastMessage.updateItemPre +
                    (this.objSourceData.Name ? this.objSourceData.Name : "") +
                    this.$toastMessage.updateItemSuf
                );
              }
              /** do something after insert history success*/
            } else {
              this.$Utils.showMessage(
                "error",
                this.$toastMessage.insertHistoryFailed +
                  (objReturn.Name ? objReturn.Name : "")
              );
            }
          });
        } else {
          this.$Utils.showMessage(
            "error",
            this.$toastMessage.insertHistoryFailed +
              (objReturn.Name ? objReturn.Name : "")
          );
        }
      });
    },

    /**
     * Hàm xử lý sự kiện khi 1 button loại redirect đc click
     */
    onRedirect(link, data) {
      if (this.$Utils.isEmpty(link) && link != "") {
        this.$router.push("/" + this.$Utils.expressionToString(data, link));
      } else {
        this.$Utils.showMessage("error", this.$toastMessage.emptyRedirectLink);
      }
    },

    saveUserList(object) {
      var flag = false;
      if (this.$Utils.isEmpty(object, "UserList") && object.UserList != "") {
        if (object.UserList.indexOf(this.$Utils.getUserInfo("UserId")) == -1) {
          var userList = JSON.parse(object.UserList);
          userList.push(this.$Utils.getUserInfo("UserId"));
          flag = true;
        }
      } else {
        var userList = [];
        userList.push(this.$Utils.getUserInfo("UserId"));
        flag = true;
      }
      if (flag == true) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "AG_Task_Task.Update";
        request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R1_Id = object.Id;
        request.R1_UserList = JSON.stringify(userList);
        request.R1_RequestFields = "Id,UserList";
        this.$Utils.post(request).then(data => {
          if (this.$Utils.isEmpty(this.Setting.parentSetting, "research")) {
            this.Setting.parentSetting.research.function(
              this.Setting.parentSetting.research.Category,
              this.Setting.parentSetting.research.Condition
            );
          }
        });
      }
    },

    /**
     * Hàm mở pop-up phần quyền
     * @param event
     */
    permission(event) {
      if (this.$Utils.isEmpty(this.objSourceData.Id)) {
        this.$Utils.showPermission(event, this.objSourceData);
      }
    },

    toggle(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    },

    /**
     * Xóa giá trị hiển thị trong element, nếu có element truyền vào sẽ chỉ gọi đến hàm clear của element đó
     * nếu không, gọi đến hàm onClear của tất cả element
     */
    onClear(element) {
      if (this.$Utils.isEmpty(element)) {
        element.functions.onClear();
      } else {
        $.each(this.listElements, (k, e) => {
          e.functions.onClear();
        });
      }
    },

    IsSafari() {
      var browserInfo = msUtils.detectBrowser();
      if (browserInfo) {
        return browserInfo.browser == "safari";
      }
    },

    checkDate(type) {
      this.reFormatEndDate = this.$Utils.formatDateTime(
        this.ReEndDate,
        "DD-MM-YYYY"
      );
      if (this.Repeat) {
        if (type == "start" && !this.ReEndDate) {
          this.$Utils.showMessage("error", "Ngày kết thúc lặp bắt buộc nhập");
        }
      }
    },
    saveEventToGoogle(object, request) {
      var currentId = this.$rootScope.loggedOnUser.UserId;
      if (
        currentId &&
        object.Worker &&
        currentId.toLowerCase() == object.Worker.toLowerCase()
      ) {
        var event = this.$Utils.convertTaskToEvent(object);

        var dates = {
          start: moment.utc(object.PlanStartDate),
          end: moment.utc(object.Deadline)
        };

        if (!this.$Utils.isEmpty(request.R1_Id)) {
          googleService.insertEvent(event, "primary").then(data => {
            var response = {
              type: "add",
              calendarEvent: $.extend({}, event, dates),
              success: false
            };
            if (data.status == "confirmed") {
              response.success = true;
              response.calendarEvent.id = data.id;
            } else {
              var response = {
                type: "add",
                calendarEvent: "",
                success: false
              };
            }
          });
        } else {
          googleService.searchEventByExtraId(request.R1_Id).then(data => {
            if (data && data.length > 0) {
              event.id = data[0].id;
              googleService.updateEvent(event).then(
                resp => {
                  if (resp.status == "confirmed") {
                    var response = {
                      type: "edit",
                      calendarEvent: event,
                      success: true
                    };
                  } else {
                    var response = {
                      type: "edit",
                      calendarEvent: "",
                      success: false
                    };
                  }
                },
                error => {
                  console.log(JSON.stringify(err));
                }
              );
            } else {
              googleService.insertEvent(event, "primary").then(data => {
                var response = {
                  type: "add",
                  calendarEvent: $.extend({}, event, dates),
                  success: false
                };
                if (data.status == "confirmed") {
                  response.success = true;
                  response.calendarEvent.id = data.id;
                } else {
                  var response = {
                    type: "add",
                    calendarEvent: "",
                    success: false
                  };
                }
              });
            }
          });
        }
      } else if (
        request.R1_Id &&
        currentId.toLowerCase() != object.Worker.toLowerCase()
      ) {
        googleService.searchEventByExtraId(request.R1_Id).then(data => {
          if (data && data.length > 0) {
            var id = data[0].id;
            //console.log(data);
            if (id) {
              googleService.deleteEvent(id).then(
                resp => {
                  console.log(resp);
                  var response = {
                    type: "remove",
                    calendarEvent: "",
                    success: true
                  };
                  // $mdDialog.hide(response);
                },
                error => {
                  console.log(error);
                }
              );
            }
          }
        });
      }
    }
  },
  mounted() {
    this.init();
  },
  created() {
    this.Setting.functions = {
      autoLoad: this.autoLoad,
      getVal: this.getVal,
      getElementData: this.getElementData,
      getFieldsData: this.getFieldsData,
      setupListElement: this.setupListElement,
      calculatorFieldsData: this.calculatorFieldsData,
      saveValue: this.saveValue,
      replaceExpression: this.replaceExpression,
      submitDefault: this.submitDefault,
      compareChange: this.compareChange,
      setDataToElement: this.setDataToElement,
      getFullData: this.getFullData,
      setData: this.setData,
      checkDependencies: this.checkDependencies,
      addPermissionToObject: this.addPermissionToObject,
      sendNotification: this.sendNotification,
      createHistoryLogs: this.createHistoryLogs,
      permission: this.permission,
      sendData: {},
      PushServer: this.rootScopePushServer,
      BaseURL: this.$appUri.BaseURL
    };
    // parentSetting: { object: { Code: "" }, set: { Value: "" } },
    // Fields: [],
    // SubElements: {},
    // AdditionConditions: { Code: "" },
    // DataSource: "",
    // sendData: {}
    // }
  },
  beforeCreate() {
      // register the Comment component here!!!!
      this.$options.components.SubsDynamicPage = require('@/components/dynamic/DynamicPage.vue').default;
 },
  watch: {
    pSetting: function(setting) {
      //alert(this.$router.match(location));
      //if('knowhow-document' === newUrl) this.$router.push('/document')
      this.Setting = this.pSetting;
      // this.Setting.functions = {
      //    autoLoad: this.autoLoad,
      //    getVal: this.getVal,
      //    getElementData: this.getElementData,
      //    getFieldsData: this.getFieldsData,
      //    setupListElement: this.setupListElement,
      //    calculatorFieldsData: this.calculatorFieldsData,
      //    saveValue: this.saveValue,
      //    replaceExpression: this.replaceExpression,
      //    submitDefault: this.submitDefault,
      //    compareChange: this.compareChange,
      //    setDataToElement: this.setDataToElement,
      //    getFullData: this.getFullData,
      //    setData: this.setData,
      //    checkDependencies: this.checkDependencies,
      //    addPermissionToObject: this.addPermissionToObject,
      //    sendNotification: this.sendNotification,
      //    createHistoryLogs: this.createHistoryLogs,
      //    permission: this.permission,
      //    sendData: {},
      //    PushServer: this.rootScopePushServer,
      //    BaseURL: this.$appUri.BaseURL
      //  };
      this.init();
    }
  }
};
</script>
<style lang="scss">
.dynamic-form {
  .el-main {
    padding: 0px;
    padding-bottom: 15px;
    background-color: #fff;
    .demo-form-inline {
      .el-col {
        .el-form-item {
          margin: 0px;
          margin-bottom: 5px;
          label {
            width: 100%;
            text-align: left;
            line-height: 10px;
          }

          .el-form-item__content {
            .el-form-item__error {
              right: 0;
              left: auto;
            }

            .el-input__inner {
              border: none;
              border-bottom: 1px solid #d8dce5;
              border-radius: 0px;
            }


            width: 100%;
            input {
              width: 100%;
            }

            .el-select {
              width: 100%;
            }

            .el-cascader {
              width: 100%;
            }

            .el-date-editor {
              width: 100%;
            }

            .el-header {
              max-height: 30px;
              line-height: 30px;
              background-color: #20a8d8;
              font-size: 1.09375rem;
              color: #fff;
            }
          }
        }

        .header-ele {
          padding: 0px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .el-footer {
    padding: 0px;
    .el-collapse {
      //margin: 20px;
    }

    .card {
      border: none;
      margin-bottom: 0px;
    }

    .button-list {
      background-color: #f0f8ff;
    }
  }
}
</style>
