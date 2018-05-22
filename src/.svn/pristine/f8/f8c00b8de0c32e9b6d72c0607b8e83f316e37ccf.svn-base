<template>
  <el-form :model="viewModel" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item label="Trường nguồn" prop="Source">
      <el-select v-model="viewModel.Source" filterable>
        <el-option v-for="item in viewModel.ListSourceFields" :key="item.Caption" :value="item.Name"
                   :label="item.Caption +'( '+ item.Name +' )'"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Trường đích" prop="Target">
      <el-select v-model="viewModel.Target" filterable>
        <el-option v-for="item in viewModel.ListTargetFields" :key="item.Caption" :value="item.Name"
                   :label="item.Caption +'( '+ item.Name +' )'"/>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="submitForm('ruleForm')">Thêm</el-button>

    </el-form-item>
    <el-table :data="model">
      <el-table-column type="index">

      </el-table-column>
      <el-table-column label="Nguồn" prop="Source">

      </el-table-column>
      <el-table-column label="Đích" prop="Target">

      </el-table-column>
      <el-table-column label="Hành động">
        <template slot-scope="scope">
          <el-button @click="removeLink(scope.row.Index)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button type="primary" @click="save">Lưu</el-button>
      <el-button @click="cancel">Đóng</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import utilsLibrary from "@/services/utils";

  export default {
    props: ["data"],
    data() {
      return {
        viewModel: {
          Source: '',
          Target: '',
          ListSourceFields: [],
          ListTargetFields: [], ListLinks: []
        },
        model: [],
        rules: {
          Source: [
            {
              required: true,
              message: "Hãy chọn trường nguồn",
              trigger: 'blur'

            }
            //{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          Target: [
            {
              required: true,
              message: "Hãy chọn trường đích",
              trigger: 'blur'
            }
            //{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ]
        },

      };
    },
    created() {
      // console.log(this.data);
      //this.model = this.data.model;
      //this.viewModel = this.data.viewModel;
    },
    mounted() {
      this.init();
    },
    watch: {

    },
    methods: {
      bindTargetFields() {
        var ctrl = this;
        var strFields = '';
        var targetDataGroup = {};

        $.each(this.data.scope.viewModel.ListDataGroups, (key, dataGroup) => {
          if (dataGroup.Code === this.data.item){
            targetDataGroup = dataGroup;
          }
        })
        if (targetDataGroup.Description.FCount)
          for (var i = 1; i <= targetDataGroup.Description.FCount; i++) {
            if (targetDataGroup['F' + i] !== undefined){
              strFields += targetDataGroup['F' + i];
            }
          }
        ctrl.viewModel.ListTargetFields = JSON.parse(strFields)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addLink();
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      addLink() {
        var ctrl = this;
        ctrl.model.push({
          Source: ctrl.viewModel.Source,
          Target: ctrl.viewModel.Target
        });
        ctrl.viewModel.Source = '';
        ctrl.viewModel.Target = '';
      },

      removeLink(index) {
        this.model.splice(index, 1);
      },

      showPermission(ev) {
        utilsLibrary.showPermission(ev, this.model.Id);
      },
      bindEditor() {
        var ctrl = this;
        if (this.data.action === 'edit') {
          ctrl.action = 'edit';
          ctrl.model = this.$Lodash.cloneDeep(this.data.scope.model.Description.Link[this.data.item]);
          this.bindTargetFields();
        }
        else
          ctrl.model = {};
      },

      save() {
        var ctrl = this;
        $.each(ctrl.model, (key, item) => {
          utilsLibrary.deleteAutoValue(item);
        })
        ctrl.communication = {
          action: ctrl.action,
          item: ctrl.model,
          code: this.data.item
        }
        this.data.scope.bindLink(this.$Lodash.cloneDeep(ctrl.communication));
        //$mdDialog.hide();
        this.cancel();
      },

      cancel() {
        //$mdDialog.hide();
        this.$hub.$emit('close-modal');
      },
      init() {
        var ctrl = this;
        //console.log(this.data.scope.model.Description)
        ctrl.viewModel = {
          ListSourceFields: this.data.scope.model.Description.Fields,
          ListTargetFields: [], ListLinks: []
        }
        this.bindEditor();
        /*
        $timeout(function () {
          angular.element(document).find('input').on('keydown', function (ev) {
            ev.stopPropagation();
          });
        })
        */
      }
    }
  };
</script>
