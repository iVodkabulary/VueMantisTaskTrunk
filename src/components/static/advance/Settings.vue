<template>
    <div>
      <el-form :inline="true" :rules="rules" ref="ruleForm"  :model="ruleForm" class="demo-form-inline">
          <el-form-item label="Mã" prop="name">
            <el-input  size="medium" v-model="paramCode" placeholder="" @keyup.enter="submitForm('ruleForm')" ></el-input>
          </el-form-item>
          <el-form-item label="">
           <el-radio-group v-model="ruleForm.radio">
          <el-radio :label="1">Mặc định</el-radio>
          <el-radio :label="0">Request</el-radio>

        </el-radio-group>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Tìm kiếm</el-button>
            <!-- <el-button type="primary"  >Liên kết</el-button> -->
          </el-form-item>
        </el-form>
      <div class="project-categories">
        <b-card>
          <!-- <button @click="consoleData">consoleData</button> -->
          <sortable-tree :data="treeData" mixinParentKey="$parent" @changePosition="changePosition" :dragEnable="true" closeStateKey="$foldClose">
            <template slot-scope="{item}">
              <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length}">
                <span v-if="item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.collapseIcon'></i></span>
                <span v-else-if="!item['$foldClose'] && item.children && item.children.length" @click="changeState(item)"><i :class='item.expandIcon'></i></span>
                <span class="mr-3"><a href="javascript:void(0)" @click="changeState(item)">{{item.Name}}</a></span><span v-if="item.level!='0'">
                     <a href="javascript:void(0)" @click="addPara(item)"><i class="fa fa-plus" aria-hidden="true"></i></a> |
                    <a href="javascript:void(0)" @click="editPara(item)"><i class="el-icon-edit" aria-hidden="true"></i></a> |
                    <a href="javascript:void(0)" @click="deletePara(item)"><i class="fa fa-trash" aria-hidden="true"></i></a>
                </span>
              </div>
            </template>
          </sortable-tree>
        </b-card>
        <el-dialog
          title="Xóa"
          :visible.sync="DialogVisible"
          width="30%"
          center>
          <span>Bạn có chắc muốn xóa không ?</span>
          <el-button type="primary" @click="DialogVisible = false">Lưu</el-button>
          <el-button @click="DialogVisible = false">Đóng</el-button>
        </el-dialog>
      </div>
  </div>
</template>
<script>
let id = 1000;
  import Vue from 'vue'
  import SortableTree from 'vue-sortable-tree'
  import ParameterForm from '@/components/static/advance/ParameterForm'
  Vue.component(SortableTree.name, SortableTree)

export default {
    components:{ParameterForm},
    data(){
        return {
            isEditParam: false,
            paramCode:'',
            ruleForm: {
                name: '',
                radio:1
            },
            rules: {
              name: [
                // { required: true, message: 'Mã cần có', trigger: 'blur' }
              ]
            },
            Name: '',
            Parent: '',
            ListData: [],
            treeData: {

            },
            tempTree: {
                Name: 'Các tham số',
                children: [],
                level: '0',
                Level: '5',
                collapseIcon:'fa fa-cog',
                expandIcon: 'fa fa-cog'
            },
            viewModel: {},
            DialogVisible:false
        }
    },
    destroyed(){
      this.$hub.$off('update-param-tree');
    },
    created(){
        this.paramCode = this.$route.params.param;
        this.isEditParam = (this.paramCode != null &&  this.paramCode != '');
        //alert(this.paramCode);
        if(!this.isEditParam) this.paramCode='xSetting.Default';
        this.ruleForm.name = this.paramCode;
        this.init();
    },
    mounted(){
        this.$hub.$on('update-param-tree', code =>{
          this.paramCode = code;
          this.init()
        });
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           // alert('submit!');
           //this.code = this.ruleForm.name;
           this.$hub.$emit('update-param-tree', this.paramCode);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      init() {
        //console.log(this.$getItemLocalStorage(this.$localStorageConstant.ListPages))
        var sessionID = this.$getItemLocalStorage(
          this.$localStorageConstant.SessionId
        )
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: 'SettingNew.SearchSetting',
          R1_ParentCode: this.paramCode,//'xSetting.Project.Parameter',
          R1_IncludedNestedSetParent: true,
          SessionId: sessionID
        }


        this.$Utils.post(request).then(data => {
          //console.log(data);
          var arrPages = [];
          arrPages = this.$Utils.getDataWithRoot(
            data.R1,
            "Data.DynamicDS.Setting"
          );
          var tree = this.$Utils.createCustomTreeFromList(
            arrPages,
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
              $foldClose: true
            }
          );
          //console.log('abcc',tree);
          if(this.$Utils.isEmpty(this.paramCode) && this.paramCode.trim() != '') {
            this.treeData = tree[0];
          } else {
            this.treeData = this.$Lodash.cloneDeep(this.tempTree);
            this.treeData.children = tree;
             //this.$set(this.treeData,'children',tree);
            // console.log('this.treeData',this.treeData);
          }
        });

      },
      getSetting() {

      },
      consoleData(item) {
        //console.log(this.treeData)
        //console.log(item)
      },
      changeState(item) {
        this.$set(item, '$foldClose', !item['$foldClose'])
      },
      changePosition(option) {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'Setting.MoveNode';
        request.R1_Id = option.data.Id;
        if (option.afterParent.children && option.afterParent.children.length > 1) {
          var index = 0;
          $.each(option.afterParent.children, (key, value) => {
            if (value.Id == option.data.Id && key > 0) {
              index = key - 1;
              request.R1_ReferenceId = option.afterParent.children[index].Id;
              request.R1_NestedSetType = 'MoveToAfterAnother';
            } else if (value.Id == option.data.Id && key == 0) {
              index = 1;
              request.R1_ReferenceId = option.afterParent.children[index].Id;
              request.R1_NestedSetType = 'MoveToBeforeAnother';
            }
          })
        } else {
          request.R1_ReferenceId = option.afterParent.Id;
          request.R1_NestedSetType = 'MoveToLastChildNode';
        }
        this.$Utils.post(request).then((data) => {
          // this.$Utils.showLoading('stop');
          // this.getAllLevel(option.afterParent.Level, option.data);
          // this.inputData.push()

        });
      },
      editPara(item) {
        var dataToPass = {
          data: item,
          radio: this.ruleForm.radio,
          loadData: this.init
        }
        var formWidth = "40%";
        if(this.ruleForm.radio != 1) {
            formWidth = "80%"
        }
        this.$hub.$emit(
          "set-modal-data",
          "Sửa khối dữ liệu",
          formWidth,
          true,
          "center",
          ParameterForm,
          false,
          '',
          dataToPass
        );
        // alert(item);
        //console.log(item);
        //this.$hub.$emit('fill-data-to-data-group', item);
      },
      addPara(item) {
        var pass = { ParentId: item.Id }
        var dataToPass = {
          data: pass,
          radio: this.ruleForm.radio,
          loadData: this.init
        }
        var formWidth = "40%";
        if(this.ruleForm.radio != 1) {
            formWidth = "80%"
        }
        this.$hub.$emit(
          "set-modal-data",
          "Thêm khối dữ liệu",
          formWidth,
          true,
          "center",
          ParameterForm,
          false,
          '',
          dataToPass
        );
      },
      deletePara(data) {
        // return;
        var ctrl = this;
        if (ctrl.$Utils.isEmpty(data)) {
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = "Setting.SearchBase";
          request.R1_ParentId = data.Id;
          request.R1_IncludedNestedSetParent = true;
          ctrl.$Utils.post(request).then((dData) => {
            dData = ctrl.$Utils.getDataWithRoot(dData.R1, 'Data.DynamicDS.Setting');
            request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            var strListId = '';
            request.TotalRequests = 0;
            dData.forEach((setting) => {
              request.TotalRequests++;
              request['R' + request.TotalRequests + '_RequestTemplate'] = 'SettingNew.Delete';
              request['R' + request.TotalRequests + '_Id'] = setting.Id;
              strListId += setting.Id + ';'
            });
            if (request.TotalRequests > 0) {
              ctrl.$Utils.postCheckResult(request).then(() => {
                ctrl.$Utils.showMessage('success', ctrl.$toastMessage.deleteItemPre + ctrl.$toastMessage.deleteItemSuf);
                ctrl.$Utils.removeAllLink(strListId);
                ctrl.init();
              });
            }
          })
        }
        ;
      },
    }
}
</script>
<style lang="scss" scoped>
  .project-categories{
    .card{
      margin-bottom: 0px;
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
