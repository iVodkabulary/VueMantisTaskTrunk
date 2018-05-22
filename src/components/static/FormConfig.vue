<template>
  <div class="form-config">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Tên" >
        <el-col :span="19">
          <el-input :v-model="model.Caption" placeholder="Tên" :value="model.Caption"></el-input>
        </el-col>
        <el-col :span="1">&ensp;</el-col>
        <el-col :span="4">
          <el-button type="primary">Cấp phép</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input v-model="form.name" placeholder="Mô tả"></el-input>
      </el-form-item>
      <el-form-item label="Cho phép:">
        <el-checkbox v-model="Description.HasPermissionTab" @change="checkBoxChange">Cấp phép</el-checkbox>
        <el-checkbox v-model="Description.HasCommentTab" @change="checkBoxChange">Bình luận</el-checkbox>
        <el-checkbox v-model="Description.HasFileTab" @change="checkBoxChange">File đính kèm</el-checkbox>
        <el-checkbox v-model="Description.HasHistoryTab" @change="checkBoxChange">Lịch sử cập nhật</el-checkbox>
        <el-checkbox v-model="Description.HasSubscribe" @change="checkBoxChange">Theo dõi</el-checkbox>
        <el-checkbox v-model="Description.History" @change="checkBoxChange">Lịch sử thay đổi</el-checkbox>
        <el-checkbox v-model="Description.Repeat" @change="checkBoxChange">Lặp nội dung</el-checkbox>
      </el-form-item>
      <el-form-item label="Khối dữ liệu">
        <el-col :span="12">
          <SelectTree :datasource="DataGroup" :nameField="['Caption','Code']" :selectedValue="selectedDataGroup" :callback="handleChange"/>
        </el-col>
        <el-col :span="12">
          Kiểu hiển thị: &ensp;&ensp;
          <el-radio-group v-model="selectedDisplayType">
            <el-radio v-for="item in DisplayType" :label="item.Code">{{item.Name}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="Trường dữ liệu">
        <el-col :span="4">
          <el-select v-model="selectedField" placeholder="Chọn" clearable>
            <el-option
              v-for="item in ObjectFields"
              :key="item.Name"
              :label="item.Caption"
              :value="item.Name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedGroups" placeholder="Nhóm" clearable>
            <el-option
              v-for="item in Description.Groups"
              :key="item.Caption"
              :label="item.Caption"
              :value="item.Caption">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :disabled="selectedGroups === '' || Description.Groups.length === 0">Thêm</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="centerDialogVisible=true">Thêm nhóm</el-button>
        </el-col>
        <el-col :span="2">&ensp;</el-col>
        <el-col :span="4">
          Nút hiển thị
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="13">
          <el-card class="box-card">
            <sortable-tree v-for="item in Description.Groups" :data="item" mixinParentKey="$parent" :dragEnable="true" closeStateKey="$foldClose">
              <template slot-scope="{item}">
                <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
                  <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.collapseIcon'></i></span>
                  <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.expandIcon'></i></span>
                  <span class="mr-3"><a href="javascript:void(0)" @click="editCategory(item)">{{item.Caption}}</a></span>
                </div>
              </template>
            </sortable-tree>
          </el-card>
        </el-col>
        <el-col :span="1">&ensp;</el-col>
        <el-col :span="10">
          <el-card class="box-card">
            <el-row v-for="item in CurrentDataGroup.Buttons" :key="item.Code">
              <el-checkbox v-model="btnChecked[item.Code]">{{item.Code}}</el-checkbox>
            </el-row>
          </el-card>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-collapse accordion >
          <el-collapse-item name="1">
            <template slot="title">
              &ensp;Phần tử trực thuộc &ensp;&ensp;<i class="header-icon el-icon-news"></i>
            </template>
            &ensp; <el-button type="primary" icon="el-icon-circle-plus" @click="AddEle">Thêm</el-button> <br>
             <!--table-->
            <el-table
              :data="elements"
              style="width: 100%">
              <el-table-column
                label="STT"
                width="100">
              </el-table-column>
              <el-table-column
                property="ModuleType"
                label="Loại phần tử"
                width="180">
              </el-table-column>
              <el-table-column
                property="Code"
                label="Phần tử"
                width="190">
              </el-table-column>
              <el-table-column
                property="DataGroupCaption"
                label="Khối dữ liệu"
                width="190">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="Xử lý"
                width="150">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent=""
                    size="small">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, elements)"
                    size="small">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          &ensp;
          <el-collapse-item name="2">
            <template slot="title">
              &ensp;Thông báo &ensp;&ensp;<i class="header-icon el-icon-bell"></i>
            </template>
            <el-button type="primary" icon="el-icon-circle-plus" @click="AddNotify">Thêm</el-button> <br>
            <!--table-->
            <el-table
              :data="notifitions"
              style="width: 100%">
              <el-table-column
                label="STT"
                width="100">
              </el-table-column>
              <el-table-column
                label="Loại"
                width="150">
              </el-table-column>
              <el-table-column
                label="Quản trị"
                width="180">
              </el-table-column>
              <el-table-column
                label="Template"
                width="180">
              </el-table-column>
              <el-table-column
                label="Xử lý"
                width="180">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-dialog
        title="Thêm nhóm"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>
          <el-input placeholder="Nhập tên nhóm" v-model="input"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">Lưu</el-button>
          <el-button @click="centerDialogVisible = false">Đóng</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>

  import SelectTree from '@/components/dynamic/SelectTree';
  import ElementDependent from '@/components/static/ElementDependent';
  import ExtendNotify from '@/components/static/ExtendNotify';
  import SortableTree from 'vue-sortable-tree';
  import{bus} from '@/main';
  export default {
    props: ['code'],
    components: {SelectTree, SortableTree,ElementDependent,ExtendNotify},
    name: "HelloWorld",
    data() {
      return {
        activeCol:['1','2'],
        selectedGroups: '',
        selectedField: '',
        centerDialogVisible: false,
        elements:[],
        notifitions:[],
        btnChecked : {},
        input:'',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        value: '',
        selectedDisplayType: 'OneColumn',
        TaskDetail: {},
        DataGroup: [],
        selectedDataGroup: ["32b69161-65a1-4363-813c-286b7b4c1954", "9f9ed100-9193-4c14-a3e1-8853d7aeeb3e"],
        DisplayType: [],
        action: '',
        model: {},
        permission : {},
        viewModel: {},
        permissionModel: {},
        communication: { action: '', item: {}, index: '', scope: this },
        AddLines : {
          Group: [],
          Role: [],
          User: [],
          Field: []
        },
        administrator: this.$Lodash.cloneDeep(this.$administrator),
        Description: {},
        checkBoxGroup: ["Cấp phép", "Bình luận", "File đính kèm", "Lịch sử cập nhật", "Lịch sử thay đổi", "Lặp nội dung", "Theo dõi"],
        ObjectFields: [],
        CurrentDataGroup : {
          Fields: [],
          Buttons: []
        },
        permissionModel: {
          listDropdownRoles: {
            source: [],
            checkboxes: true,
            displayMember: 'Name',
            valueMember: 'Code'
          },
          listDropdownFields: {
            source: [],
            checkboxes: true,
            displayMember: 'Caption',
            valueMember: 'Name'
          },
          listStaticPermissions: [],
          listScriptPermissions: [],
          listDynamicPermissions: [],
          listUserPermissions: [],
          listUserGroups: [],
          listRoles: [],
          listUsers: [],
          listGroupRoles: {}
        }
      }
    },
    methods: {
      AddEle(){
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin chi tiết trực thuộc",
          "40%",
          true,
          "center",
          ElementDependent,
          false,
          ''
        );
      },
      AddNotify(){
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
      changeState (item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
      },
      checkBoxChange(){
        console.log(this.Description);
      },
      onSubmit() {
        console.log('submit!');
      },
      searchSettingByCode(code){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_Code = code;
        this.$Utils.post(request).then(response=>{
          this.TaskDetail = this.$Utils.getDataWithRoot(response.R1, "Data.DynamicDS.Setting");
          console.log(this.TaskDetail);
          if (this.TaskDetail.length > 0) {
            this.action = 'edit';
            var currentForm = this.TaskDetail[0];
            currentForm.Description = JSON.parse(currentForm.Description);
            currentForm.ObjectFields = '';
            for (var i = 1; i <= currentForm.Description.OFCount; i++) {
              if (currentForm['OF' + i] != undefined) {
                currentForm.ObjectFields += currentForm['OF' + i];
                delete currentForm['F' + i];
                delete currentForm['OF' + i];
              }
            }
            currentForm.ObjectFields = JSON.parse(currentForm.ObjectFields);
            $.each(currentForm.Description, (key, value) => {
              if (value == 'true')
                currentForm.Description[key] = true;
              else if (value == 'false')
                currentForm.Description[key] = false;
            });
            this.model = currentForm;
            this.Description = this.$Lodash.cloneDeep(currentForm.Description);
            this.selectedDisplayType = this.Description.DisplayType;
            this.CurrentDataGroup.Fields = this.$Lodash.cloneDeep(this.model.ObjectFields);
            this.ObjectFields = this.$Lodash.cloneDeep(this.model.ObjectFields);
            this.Description.Groups.forEach(item => {
              var tempListField = item.ListFields;
              var temp = tempListField.split(";");
              item.children = [];
              this.ObjectFields.forEach(field =>{
                temp.forEach(data => {
                  if(field.Name === data){
                    item.children.push(field);

                  }
                })
              })
              item.collapseIcon = 'fa fa-cog';
              item.expandIcon = 'fa fa-cog';
              item.level = '0';
              item.Level = '5';
              item.Name = item.Caption;
            });
            this.Description.Buttons.forEach(item => {
              if(item.ParentObject === 'Form'){
                item.checked = true;
                this.CurrentDataGroup.Buttons.push(item);
              }
            });
          } else {
            this.action = '';
          }
          this.searchDataGroup();
          this.searchDisplayType();
        });
      },
      handleChange(item){
        this.selectedDataGroup = item;
        console.log(this.selectedDataGroup);
      },
      searchDataGroup(){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Project.DataGroup";
        this.$Utils.post(request).then(response=>{
          this.DataGroup = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        });
      },
      searchDisplayType(){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Default.Project.Form.DisplayType";
        this.$Utils.post(request).then(response=>{
          this.DisplayType = this.$Utils.getDataWithRoot(response.R1, 'Data.DynamicDS.Setting');
        });
      },
      searchSystem(){
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'jsontree',
          ConditionFields:'GroupType',
          GroupType: '0',
          StaticFields: 'GroupId;GroupName;Description;GroupParent'
        }

        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      },
      searchGroup(){
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields:'GroupType',
          GroupType: '1',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        }

        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      },
      searchGroupRole(){
        var request = {
          RequestAction: 'SearchGroup',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields:'GroupType',
          GroupType: '2',
          StaticFields: 'GroupId;GroupName;Description;GroupParent;Status;GroupPath',
          StructFields: 'ParentName',
          OrderFields: 'GroupName ASC'
        }

        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      },
      searchRoleTemplate(){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "SettingNew.SearchSetting";
        request.R1_ParentCode = "xSetting.Default.Permissions.RoleTemplate";
        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      },
      searchUserWithGroup(){
        var request = {
          RequestAction: 'SearchUserWithGroups',
          RequestClass: 'BPM',
          RequestDataType: 'json',
          ConditionFields:'IncludedGroupManager;Group;Status',
          Status: '1',
          GroupType: '1',
          StaticFields: 'UserId;Username;LoginName',
          OrderFields: 'LoginName ASC'
        }

        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      },
      searchPermission(){
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = "Setting.SearchBase";
        request.R1_ParentCode = "xSetting.Template.Permissions";
        this.$Utils.post(request).then(response=>{
          console.log(response);
        });
      }
    },
    mounted() {
      this.searchSettingByCode(this.code);
      bus.$on('ele',data=>{
        this.elements.push(data)
      });

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .form-config {
    .box-card {
      height: 400px;
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
  }
</style>
