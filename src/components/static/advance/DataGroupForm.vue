<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="Tên" prop="name">
      <el-col :span="11">
        <el-input v-model="model.Description.Caption"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="Mô tả" prop="more">
      <el-col :span="11">
        <el-input v-model="ruleForm.desc"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="Nguồn dữ liệu">
      <el-select v-model="model.Description.DataSource" value-key="Id" @change="onDataSourceChange">
        <el-option v-for="item  in viewModel.DataSource" :key="item.Id" :label="item.Caption" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Dữ liệu gốc" required>
      <el-col :span="11">
        <el-input v-model="model.Description.RootData" disabled></el-input>
      </el-col>
    </el-form-item>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Mở rộng điều kiện truyền thêm" name="extenField1">
        <el-form-item label="Khóa" prop="name">
          <el-col :span="11">
            <el-input v-model="viewModel.Key"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="Giá trị" prop="name">
          <el-col :span="11">
            <el-input v-model="viewModel.Value"></el-input>
          </el-col>
        </el-form-item>
        <el-button @click="addConditions">Thêm</el-button>
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
              <el-button @click="confirmDelete($event,'filter',scope.row,scope.$index)"
                         size="mini">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Mở rộng các trường liên quan" name="extenField2">
        <el-button @click="excuteSubDirective($event,'dependency','insert')">Thêm</el-button>
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
              <el-button @click="confirmDelete($event,'filter',scope.row,scope.$index)"
                         size="mini">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Mở rộng các khối liên kết" name="extenField3">
        <el-form-item label="Khối dữ liệu liên kết" prop="name">
          <el-col :span="11">
            <el-select v-model="viewModel.LinkDataGroup" value-key="Id">
              <el-option v-for="item  in viewModel.ListDataGroups" :key="item.Id" :label="item.Caption"
                         :value="item"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-button @click="excuteLink($event,'insert')">Thêm</el-button>
        {{Object.keys(model.Description.Link)}}
        <el-table
          :data="Object.keys(model.Description.Link)"
          style="width: 100%">
          <el-table-column type="index"
                           label="Stt"
                           width="180">
          </el-table-column>
          <el-table-column prop=""
                           label="Khối liên kết"
                           width="180">
          </el-table-column>
          <el-table-column prop=""
                           label="Xử lý">
            <template slot-scope="scope">
              <el-button @click="excuteSubDirective($event,'dependency','edit',scope.row,scope.$index)"
                         size="mini">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button @click="confirmDelete($event,'filter',scope.row,scope.$index)"
                         size="mini">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

  </el-form>
</template>
<script>
  import utilsLibrary from "@/services/utils";
  import DependencyDialog from '@/components/static/advance/DependencyDialog'

  export default {
    props: ['selectedItem', 'selectedModel'],
    data() {
      return {
        communication: {action: "", item: {}, index: "", scope: this},
        model: this.$Lodash.cloneDeep(this.selectedItem),
        viewModel: this.$Lodash.cloneDeep(this.selectedModel),
        activeNames: ['extenField1', 'extenField2', 'extenField3'],

        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: 'Please input Activity name', trigger: 'blur'},
            {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
          ],
          region: [
            {required: true, message: 'Please select Activity zone', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: 'Please pick a date', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: 'Please pick a time', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: 'Please select at least one activity type', trigger: 'change'}
          ],
          resource: [
            {required: true, message: 'Please select activity resource', trigger: 'change'}
          ],
          desc: [
            {required: true, message: 'Please input activity form', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      excuteLink(ev, action, key) {
        var ctrl = this;
        // console.log('ctrl.model.Description.Link  ', ctrl.model.Description.Link);
        // console.log('ctrl.viewModel.LinkDataGroup.Code ', ctrl.viewModel.LinkDataGroup.Code);
        if (action == "insert") {
          if (

            ctrl.model.Description.Link[ctrl.viewModel.LinkDataGroup.Code] ==
            undefined
          ) {
            ctrl.model.Description.Link[ctrl.viewModel.LinkDataGroup.Code] = [];
            //console.log(Array.from(ctrl.model.Description.Link))
          }
          else
            this.excuteSubDirective(
              ev,
              "link",
              "edit",
              ctrl.viewModel.LinkDataGroup.Code
            );
        } else if (action == "edit") this.excuteSubDirective(ev, "link", action, key);
        else if (action == "delete") {
          utilsLibrary
            .showConfirm(
              "Cảnh báo",
              toastMessage.oneWayAction + toastMessage.deleteSettingWarning
            )
            .then(function () {
              delete ctrl.model.Description.Link[key];
            });
        }
      },
      excuteSubDirective(ev, type, action, item, index) {
        var ctrl = this;
        ctrl.communication.action = action;
        if (action == "edit") {
          ctrl.communication.item = this.$Lodash.cloneDeep(this.$item);
          if (item.FormJsonExpression != undefined)
            ctrl.communication.item.FormJsonExpression = JSON.stringify(
              item.FormJsonExpression
            );
          ctrl.communication.index = index;
        }
        var data = {
          model: ctrl.communication,
          viewModel: ctrl.viewModel
        }
        this.$hub.$emit(
          "set-modal-data",
          "Thông tin các trường liên quan",
          "60%",
          true,
          "center",
          DependencyDialog,
          true, '', data
        );

        /*
        $mdDialog.show({
          controller:
            type.capitalizeFirstLetter() + "DataGroupDialogController as ctrl",
          templateUrl:
            "app/main/configuration/data-groups/dialogs/" +
            type +
            "/" +
            type +
            "-dialog.html",
          targetEvent: ev,
          disableParentScroll: false,
          locals: { dataToPass: ctrl.communication }
        });
        */
      },
      confirmDelete(ev, type, item, index) {
        utilsLibrary
          .showConfirm(
            "Cảnh báo",
            this.$toastMessage.oneWayAction + this.$toastMessage.deleteSettingWarning
          )
          .then(() => {
            var listType =
              type == "dependency"
                ? "Dependencies"
                : type.capitalizeFirstLetter() + "s";
            // console.log(listType)
            // console.log(this.model.Description)
            this.model.Description[listType].splice(index, 1);

            if (["field", "button"].indexOf(type) != -1) ;
            // requestByAction("update");
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
        this.model.Description.RootData = this.model.Description.DataSource.Value;
      },
      handleChange(value) {
        //console.log(value);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    watch: {

      selectedItem: function (newVal) {
        //console.log('watch selectedItem', newVal);
        this.model = this.$Lodash.cloneDeep(newVal);
      },
      selectedModel: function (newVal) {
        //console.log('watch selectedModel', newVal);
        this.viewModel = this.$Lodash.cloneDeep(newVal);
      }


    }
  }
</script>
