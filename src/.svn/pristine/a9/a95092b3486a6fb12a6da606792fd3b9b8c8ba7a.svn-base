<!--suppress ALL -->
<template>
  <div class="form-config">
    <el-form :rules="ruleForm" label-width="100px" :model="model">
      <el-col :span="24" style="margin-top: 15px;">
        <el-form-item label="Tên" prop="Caption">
          <el-input v-model="model.Caption" placeholder="Tên"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Mô tả">
          <el-input placeholder="Mô tả" v-model="model.Description.More"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Cho phép:">
          <el-checkbox v-model="model.Description.HasPermissionTab">Cấp phép</el-checkbox>
          <el-checkbox v-model="model.Description.HasCommentTab">Bình luận</el-checkbox>
          <el-checkbox v-model="model.Description.HasFileTab">File đính kèm</el-checkbox>
          <el-checkbox v-model="model.Description.HasHistoryTab">Lịch sử cập nhật</el-checkbox>
          <el-checkbox v-model="model.Description.HasSubscribe">Theo dõi</el-checkbox>
          <el-checkbox v-model="model.Description.History">Lịch sử thay đổi</el-checkbox>
          <el-checkbox v-model="model.Description.Repeat">Lặp nội dung</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-form-item label="Khối dữ liệu">
          <el-cascader expand-trigger="hover" :options="DataGroupTree" placeholder="" v-model="selectedDataGroups"
                       @change="handleChange"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-form-item label="Kiểu hiển thị">
          <el-radio v-for="item in DisplayType" v-model="selectedDisplayType" :label="item.Code">{{item.Name}}
          </el-radio>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="24">
        <el-form-item label="Trường dữ liệu">
          <el-col :xs="12" :md="4">
            <el-select v-model="selectedField" placeholder="Chọn" filterable clearable>
              <el-option v-for="item in CurrentDataGroup.Fields" :key="item.Name"
                         :label="item.Caption+'('+item.Name+')'"
                         :value="item.Name" v-if="item.FormFieldType != 'Hidden'"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :md="4">
            <el-select v-model="selectedGroups" placeholder="Nhóm" clearable>
              <el-option v-for="item in model.Description.Groups" :key="item.Caption" :label="item.Caption"
                         :value="item.Caption"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :md="2">
            <el-button type="primary" :disabled="selectedGroups === '' || selectedField === ''" @click="insertField">
              Thêm
            </el-button>
          </el-col>
          <el-col :xs="12" :md="2">
            <el-button type="primary" @click="centerDialogVisible=true; catModel.action ='insert' ">Thêm nhóm
            </el-button>
          </el-col>
          <el-col :md="2">&ensp;</el-col>
          <el-col :md="4" class="hidden-xs-only">
            Nút hiển thị
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="13">
        <el-card class="box-card">
          <sortable-tree :data="treeFullData"
                           :dragEnable="true" closeStateKey="$foldClose" mixinParentKey="$parent" @changePosition="positionChanged">
              <template slot-scope="{item}">
                <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
                  <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i
                    :class='item.collapseIcon'></i></span>
                  <span v-else-if="!item['$foldClose'] && item.children && item.children.length"
                        @click="changeState(item)"><i :class='item.expandIcon'></i></span>
                  <span class="mr-3">
                    <a v-if="item.level ==='-1' ">{{item.Caption}}</a>
                    <a v-else href="javascript:void(0)" @click="editTreeNode(item)">{{item.Caption}}</a>
                  </span>
                  <span>
                      <a v-if="item.level !=='-1' " href="javascript:void(0)" @click="deleteField(item)">
                        <i class="fa fa-trash"></i>
                      </a>
                  </span>
                </div>
              </template>
            </sortable-tree>
        </el-card>
      </el-col>
      <el-col :md="1" class="hidden-xs-only">&ensp;</el-col>
      <el-col :xs="24" class="hidden-sm-and-up">
        Nút hiển thị
      </el-col>
      <el-col :xs="24" :md="10">
        <el-card class="box-card">
            <el-checkbox-group v-model="listSelectedButtons">
              <div v-dragula="CurrentDataGroup.Buttons" bag="btnFieldsFormbag">
                <el-checkbox style="margin-left: 0px" v-for="(item, key) in CurrentDataGroup.Buttons" class="row" :key="item.Code"
                             :label="item.Code" @change="changeStatus($event, item.Code, key)"></el-checkbox>
              </div>
            </el-checkbox-group>
        </el-card>
      </el-col>
      <el-collapse>
        <el-col :span="24">
          <el-collapse-item name="1">
            <template slot="title">
              Phần tử trực thuộc &ensp;&ensp;<i class="header-icon el-icon-news"></i>
            </template>
            <el-button type="primary" icon="el-icon-circle-plus"
                       @click="excuteSubElement('sub-element',model.Description.SubElements,'insert')"
                       :disabled="selectedDataGroups.length <= 0">Thêm
            </el-button>
            <br>
            <el-table :data="model.Description.SubElements" style="width: 100%">
              <el-table-column label="STT" type="index"></el-table-column>
              <el-table-column property="SubElementType" label="Loại phần tử"></el-table-column>
              <el-table-column property="SubElement" label="Phần tử"></el-table-column>
              <el-table-column property="DataGroupCaption" label="Khối dữ liệu"></el-table-column>
              <el-table-column label="Xử lý">
                <template slot-scope="scope">
                  <el-button
                    @click="excuteSubElement('sub-element',model.Description.SubElements,'edit',scope.row, scope.$index)"
                    size="small">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button   type="danger" @click="deleteSubElement(model.Description.SubElements,scope.$index)" size="small">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-col>
        <el-col :span="24">
          <el-collapse-item name="2">
            <template slot="title">
              &ensp;Thông báo &ensp;&ensp;<i class="header-icon el-icon-bell"></i>
            </template>
            <el-button type="primary" icon="el-icon-circle-plus"
                       @click="excuteSubElement('sub-notification',model.Description.Notifications,'insert')"
                       :disabled="selectedDataGroups.length <= 0">Thêm
            </el-button>
            <br>
            <el-table :data="model.Description.Notifications" style="width: 100%">
              <el-table-column label="STT" type="index"></el-table-column>
              <el-table-column label="Loại" prop="NotificationType"></el-table-column>
              <el-table-column label="Quản trị" prop="Permissions"></el-table-column>
              <el-table-column label="Template" prop="Template"></el-table-column>
              <el-table-column label="Xử lý">
                <template slot-scope="scope">
                  <el-button
                    @click="excuteSubElement('sub-notification',model.Description.Notifications,'edit',scope.row, scope.$index)"
                    size="small">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button   type="danger" @click="deleteSubElement(model.Description.Notifications, scope.$index)" size="small">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-col>
      </el-collapse>
      <el-dialog title="Thông tin nhóm" :visible.sync="centerDialogVisible" width="30%" center @close="clearModel">
        <el-form :rules="rulesForGroup">
          <el-form-item label="Tên nhóm" prop="Caption">
            <el-input placeholder="Nhập tên nhóm" v-model="catModel.Caption"></el-input>
          </el-form-item>
          <el-form-item label="Giao diện">
            <el-select clearable v-model="catModel.GroupDisplayType">
              <el-option value="Default" label="Mặc định"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="saveGroup(catModel)"
                       :disabled="catModel.Caption.trim() == tmpGroup.Caption.trim() && catModel.GroupDisplayType==tmpGroup.GroupDisplayType">Lưu</el-button>
            <el-button @click="centerDialogVisible = false">Đóng</el-button>
          </span>
      </el-dialog>
    </el-form>
  </div>

</template>
<script>
  import Vue from 'vue';
  import VueDragula from 'vue-dragula';

  import SelectTree from '@/components/dynamic/SelectTree';
  import ElementDependent from '@/components/static/ElementDependent';
  import NotificationDialog from '@/components/static/NotificationDialog';
  import ExtendNotify from '@/components/static/ExtendNotify';
  import FieldInfoDialog from '@/components/static/advance/FieldInfoDialog';
  import SortableTree from 'vue-sortable-tree';
  import 'element-ui/lib/theme-chalk/display.css'

  Vue.use(VueDragula);

  export default {
    props: ['data'],
    components: {
      VueDragula, SelectTree, SortableTree, ElementDependent, ExtendNotify, FieldInfoDialog
    },
    data() {
      var dat = this.data;
      dat.treeFullData = {
        collapseIcon : 'fa fa-plus-square',
        expandIcon : 'fa fa-minus-square',
        level : '-1',
        Level : '-1',
        Caption : 'Các nhóm',
        children: [],
      };
      dat.treeFullDataCache = {};
      dat.rulesForGroup = {
        Caption: [
          { required: true, message: 'Tên bắt buộc nhập', trigger: 'blur' },
          { min: 5, message: 'Tên ngắn nhất phải có 5 kí tự', trigger: 'blur' }
        ],
      };
      dat.ruleForm={
        Caption: [
          { required: true, message: 'Tên bắt buộc nhập', trigger: 'blur' },
          { min: 5, message: 'Tên ngắn nhất phải có 5 kí tự', trigger: 'blur' }
        ],
      }
      dat.communication = {action: '', item: {},Notifications: [], SubElements: [], index: '', scope: this}
      return dat;
    },

    created() {
      this.$hub.$on('forceUpdate', (id) => {
        this.searchSettingById(id);
      })
      if (this.passedItem.Id)
        this.searchSettingById(this.passedItem.Id);
      else {
        this.searchDataGroup();
        this.searchDisplayType();
        if (this.action == '') {
          this.bindParentSetting();
        }
      }
    },
    mounted() {
      Vue.vueDragula.eventBus.$on('dragend', args => {
        if(args[0]==='btnFieldsFormbag'){
          this.model.Description.Buttons = this.CurrentDataGroup.Buttons.filter(item=>{
            return this.listSelectedButtons.indexOf(item.Code) > -1;
          })
        }
      })
    },
    watch: {
      "communication.Notifications" : function(newVal) {
        this.$set(this.model.Description,'Notifications',newVal);
      },
      "communication.SubElements" : function(newVal) {
         this.$set(this.model.Description,'SubElements',newVal);
      }

  },
    methods: {
      positionChanged(option){
        if((option.data.level === option.afterParent.level) || (option.data.level==='1' && option.afterParent.level ==='-1')){
          this.treeFullData = this.$Lodash.cloneDeep(this.treeFullDataCache);
        }else{
          this.treeFullDataCache = this.$Lodash.cloneDeep(this.treeFullData);
        }
        var tmpTreeData = this.$Lodash.cloneDeep(this.treeFullData);
        this.treeFullData = tmpTreeData;
        this.model.Description.Groups = this.treeFullData.children;
        this.$forceUpdate();
      },
      changeStatus(status, code, index) {
        this.model.Description.Buttons = this.CurrentDataGroup.Buttons.filter(item=>{
          return this.listSelectedButtons.indexOf(item.Code) > -1;
        })
      },
      deleteSubElement(arrSubForms, index) {
        arrSubForms.splice(index, 1);
      },
      clearModel() {
        this.catModel = {
          Caption: '',
          GroupDisplayType: '',
          action: '',
        }
        this.tmpGroup = {
          Caption: '',
          GroupDisplayType: '',
        }
      },
      bindParentSetting() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_Code = 'xSetting.Project.Form';
        this.$Utils.post(request).then((data) => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.parentSetting = data[0];
        })
      },
      AddNotify() {
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin chi tiết thông báo",
          "40%",
          true,
          "center",
          ExtendNotify,
          false,
          ''
        );
      },
      changeState(item) {
        this.$set(item, '$foldClose', !item['$foldClose']);
        var tmpTreeData = this.$Lodash.cloneDeep(this.treeFullData);
        this.treeFullData = tmpTreeData;
        this.model.Description.Groups = this.treeFullData.children;
        this.$forceUpdate();
      },
      searchSettingById(id) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_Id = id;
        this.$Utils.post(request).then(response => {
          response = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");

          if (response.length > 0) {
            this.action = 'edit';
            var currentForm = response[0];
            currentForm.Description = JSON.parse(currentForm.Description);
            currentForm.ObjectFields = '';
            for (var i = 1; i <= currentForm.Description.OFCount; i++) {
              if (currentForm['OF' + i] != undefined) {
                currentForm.ObjectFields += currentForm['OF' + i];
                delete currentForm['F' + i];
                delete currentForm['OF' + i];
              }
            }

            currentForm.ObjectFields = JSON.parse(currentForm.ObjectFields || null);
            if (this.$Utils.equals(currentForm.ObjectFields, {})) {
              currentForm.ObjectFields = [];
            }
            $.each(currentForm.Description, (key, value) => {
              if (value == 'true')
                currentForm.Description[key] = true;
              else if (value == 'false')
                currentForm.Description[key] = false;
            });
            this.model = currentForm;
            this.passedItem.Description = this.model.Description;
            this.selectedDisplayType = this.model.Description.DisplayType;
            var tm = {
              Fields: this.$Lodash.cloneDeep(this.model.ObjectFields),
              Buttons: []
            }

            this.CurrentDataGroup = Object.assign({}, tm);
            this.ObjectFields = this.$Lodash.cloneDeep(this.model.ObjectFields);
            this.treeFullData = {
              collapseIcon : 'fa fa-plus-square',
              expandIcon : 'fa fa-minus-square',
              level : '-1',
              Level : '-1',
              Caption : 'Các nhóm',
              children: [],
            };
            $.each(this.model.Description.Groups, (k, item) => {

              var tempListField = item.ListFields;
              var temp = tempListField.split(";");
              item.children = [];
              $.each(temp, (m, data) => {
                $.each(this.model.ObjectFields, (l, field) => {
                  if (field.Name === data) {
                    field.level = '1';
                    item.children.push(field);
                  }
                })
              })
              item.collapseIcon = 'fa fa-plus-square';
              item.expandIcon = 'fa fa-minus-square';
              item.level = '0';
              item.Level = '5';
              item.Name = item.Caption;
              item.index = k;
              this.treeFullData.children.push(item);
            });
            $.each(this.model.Description.Buttons, (i, item) =>{
              this.listSelectedButtons.push(item.Code);
            })
          } else {
            this.action = '';
          }
          this.searchDataGroup();
          this.searchDisplayType();

          if (this.action == '') {
            this.model = {
              Description: {
                Groups: [],
                Buttons: [],
                SubElements: [],
                Notifications: [],
                Permissions: [],
                Dependencies: [],
                Link: {},
                DisplayType: 'ThreeColumn',
                HasHistoryTab: true
              },
              ObjectFields: []
            };
            this.bindParentSetting();
          }
          this.treeFullDataCache = this.$Lodash.cloneDeep(this.treeFullData);
        });
      },
      insertField() {
        var ctrl = this;
        if (ctrl.selectedField != '' && ctrl.selectedField != null) {
          var selectedField = '';
          ctrl.CurrentDataGroup.Fields.forEach((field) => {
            if (field.Name == ctrl.selectedField) {
              selectedField = {Caption: field.Caption, Name: field.Name, DisplayType: 'LeftLabel', level: '1'};
              return false;
            }
          });

          var exist = false;
          ctrl.model.ObjectFields.forEach((field) => {
            if (field.Name == selectedField.Name) {
              exist = true;
              return false;
            }
          });

          if (!exist) {
            ctrl.model.Description.Groups.forEach(group => {
              if (group.children == undefined) {
                group.children = [];
              }
              if (group.Caption === ctrl.selectedGroups) {
                selectedField.$parent = group;
                group.children.push(selectedField);
                ctrl.model.ObjectFields.push(selectedField);
              }
            })
            var tmp = ctrl.$Lodash.cloneDeep(ctrl.model.Description.Groups);
            ctrl.model.Description.Groups = tmp;
            var tmpTreeData = this.$Lodash.cloneDeep(this.treeFullData);
            this.treeFullData = tmpTreeData;
            this.treeFullData.children = this.model.Description.Groups;
            this.treeFullDataCache = this.$Lodash.cloneDeep(this.treeFullData);
            this.$forceUpdate();
          }
          else {
            ctrl.$message.error('Trường đã có trong biểu mẫu')
          }
          ctrl.viewModel.Field = '';
        }
      },
      deleteField(item) {
        var ctrl = this;
        ctrl.$Utils.showConfirm('Cảnh báo', this.$toastMessage.deleteSettingWarning).then(() => {

          if (item.level == 0) {
            $.each(ctrl.treeFullData.children, (k, group)=>{
              if(group.Name == item.Name){
                ctrl.treeFullData.children.splice(k, 1);
                return false;
              }
            }
          );
            var tmpTree = ctrl.$Utils.rotateDementionArr(ctrl.model.ObjectFields, 'Name');
            var arr = item.children;
            arr.push(item)
            $.each(arr, (i, v) => {
              delete tmpTree[v.Name];
            });
            ctrl.model.ObjectFields = [];
            $.each(tmpTree, (i, v) => {
              ctrl.model.ObjectFields.push(v);
            });
          } else {
            $.each(ctrl.treeFullData.children, (k, group)=>{
              if(group.Name == item.$parent.Name) {
                $.each(group.children, (key, value) => {
                  if (item.Name === value.Name) {
                    ctrl.model.Description.Groups[k].children.splice(key, 1);
                    return false;
                  }
                });
                $.each(this.model.ObjectFields, (i, value) => {
                  if (item.Name === value.Name) {
                    ctrl.model.ObjectFields.splice(i, 1);
                    return false;
                  }
                });
                var tmp = ctrl.$Lodash.cloneDeep(ctrl.model.Description.Groups);
                ctrl.model.Description.Groups = tmp;
              }
            });
          }
          var tmpTreeData = this.$Lodash.cloneDeep(this.treeFullData);
          this.treeFullData = tmpTreeData;
          this.model.Description.Groups = this.treeFullData.children;
          this.treeFullDataCache = this.$Lodash.cloneDeep(this.treeFullData);
          this.$forceUpdate();
        });
      },
      saveGroup(selectedEle) {

        var ctrl = this;
        var isExist = false;
        $.each(ctrl.model.Description.Groups, (index, item) => {
          isExist = item.Caption === selectedEle.Caption;
          if (selectedEle.action == 'edit') {
            isExist = isExist && (item.GroupDisplayType === selectedEle.GroupDisplayType);
          }
          return !isExist;
        });
        if (!isExist) {
          if (selectedEle.action == 'edit') {
            ctrl.$set(ctrl.tmpGroup, 'Caption', ctrl.catModel.Caption);
            ctrl.$set(ctrl.tmpGroup, 'GroupDisplayType', ctrl.catModel.GroupDisplayType);
            ctrl.centerDialogVisible = false
          } else if (selectedEle.action == 'insert') {
            var newGroupNode = {
              Caption: selectedEle.Caption,
              Name: selectedEle.Caption,
              GroupDisplayType: selectedEle.GroupDisplayType
            };
            newGroupNode.collapseIcon = 'fa fa-plus-square';
            newGroupNode.expandIcon = 'fa fa-minus-square';
            newGroupNode.level = '0';
            newGroupNode.Level = '5';
            ctrl.model.Description.Groups.push(newGroupNode);
            ctrl.model.ObjectFields.push(newGroupNode);
            var tmp = ctrl.$Lodash.cloneDeep(ctrl.model.Description.Groups);
            ctrl.model.Description.Groups = tmp;
            ctrl.centerDialogVisible = false

            this.treeFullData.children = ctrl.model.Description.Groups;
            var tmpTreeData = this.$Lodash.cloneDeep(this.treeFullData);
            this.treeFullData = tmpTreeData;
            this.$forceUpdate();
          }
        } else {
          ctrl.$message.error('Nhóm đã tồn tại');
        }

      },
      excuteSubElement(type, lst, action, item, index) {
        var ctrl = this;
        ctrl.communication.action = action;
        if(!lst) lst = [];
        if(type === 'sub-element') ctrl.communication.SubElements = lst;
        else  ctrl.communication.Notifications = lst;
        //ctrl.communication.list = lst;
        if (action == 'edit') {
          ctrl.communication.item = item;
          ctrl.communication.index = index;
        }

        var template = type === 'sub-element' ? ElementDependent : NotificationDialog;

        ctrl.communication.type = 'Form';
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin chi tiết",
          "40%",
          true,
          "center",
          template,
          false,
          "",
          ctrl.communication
        );

      },
      handleChange(itemIds) {
        this.selectedDataGroups = itemIds;
        $.each(this.DataGroup, (indexx, datagroup) => {
          if (datagroup.Id === itemIds[itemIds.length - 1]) {
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
               this.CurrentDataGroup = {
                Fields: response.Fields,
                Buttons: []
              }
              var tmpBtArr =  response.Description.Buttons.filter( item=>{
                  return item.ParentObject == 'Form';
                }
              );
              this.CurrentDataGroup.Buttons = this.$Lodash.cloneDeep(tmpBtArr);
              tmpBtArr.forEach(item =>{
                var index = this.listSelectedButtons.indexOf(item.Code);
                if(index ==-1){
                  index = tmpBtArr.length-1;
                  this.CurrentDataGroup.Buttons.splice(index,1);
                  this.CurrentDataGroup.Buttons.push(item)
                }else{
                  this.CurrentDataGroup.Buttons.splice(index,0,item);
                  this.CurrentDataGroup.Buttons.splice(index+1,1);
                }
              });
            })
            return false;
          }
        })
      },
      searchDataGroup() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Project.DataGroup";
        this.$Utils.post(request).then(response => {
          this.DataGroup = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
          this.DataGroupTree = this.$Utils.createCustomTreeFromList(
            this.$Lodash.cloneDeep(this.DataGroup),
            "Id",
            "ParentId",
            "children",
            {"Caption": "label", Id: "value"},
            {}
          );
          $.each(this.DataGroup, (k, item) => {
            if (item.Code === this.passedItem.DataGroup) {
              var tmp = [item.ParentId, item.Id];
              // this.$set(this, 'selectedDataGroups', tmp);
              this.selectedDataGroups = tmp;
              this.handleChange(this.selectedDataGroups);
              return false;
            }
          })
        });
      },
      searchDisplayType() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Default.Project.Form.DisplayType";
        this.$Utils.post(request).then(response => {
          this.DisplayType = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        });
      },
      searchSystem() {
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'jsontree',
          ConditionFields: 'GroupType',
          GroupType: '0',
          StaticFields: 'GroupId;GroupName;Description;GroupParent'
        }

        this.$Utils.post(request).then(response => {
        });
      },
      searchGroup() {
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'GroupType',
          GroupType: '1',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        }

        this.$Utils.post(request).then(response => {
        });
      },
      searchGroupRole() {
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'GroupType',
          GroupType: '2',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        }

        this.$Utils.post(request).then(response => {
        });
      },
      searchRoleTemplate() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Default.Permissions.RoleTemplate";
        this.$Utils.post(request).then(response => {
        });
      },
      searchUserWithGroup() {
        var request = {
          RequestAction: 'SearchUserWithGroups',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields: 'IncludedGroupManager;Group;Status',
          Status: '1',
          GroupType: '1',
          StaticFields: 'UserId;Username;LoginName',
          OrderFields: 'LoginName ASC'
        }

        this.$Utils.post(request).then(response => {
        });
      },
      searchPermission() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentCode = "xSetting.Template.Permissions";
        this.$Utils.post(request).then(response => {
        });
      },
      addGroupFields() {
        this.data.push({
          key: this.data.length,
          label: `grouped-fields`,
          type: "GROUPFIELD",
          disabled: true
        });
        this.value3.push(this.data.length);
      },
      renderFunc(h, option) {
        return ( < span > {option.type
      }
        -{option.key
      }
        -{option.label
      }<
        /span>);
      },
      editTreeNode(selectedItem) {
        var ctrl = this;
        if (selectedItem.level == 0) {
          ctrl.catModel = ctrl.$Lodash.cloneDeep(selectedItem);
          ctrl.tmpGroup = selectedItem
          ctrl.catModel.action = 'edit';
          ctrl.centerDialogVisible = true;
        } else {
          var communication = {
            item: selectedItem,
            action: 'edit',
            type: 'Form',
          };
          ctrl.$hub.$emit(
            "set-modal-data",
            "Thông tin trường dữ liệu",
            "50%",
            true,
            "center",
            FieldInfoDialog,
            false,
            "",
            communication
          );
        }

      },
    }
  };
</script>
<style scoped lang="scss">
  .form-config {

    /*.el-form-item--mini.el-form-item {*/
      /*margin-bottom: 7px;*/
    /*}*/

    .box-card {
      //height: 400px;
      overflow: scroll;
    }
    .custom-tree-content {
      position: relative;
      top: 2px;
      z-index: 1;
      &.exitChild {
        margin-left: -7px;
      }
    }
    .el-dialog .el-select {
      width: 100%;
    }
  }
</style>
