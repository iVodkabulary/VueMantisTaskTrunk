<template>
  <el-form :model="model" :rules="rules" ref="createForm" label-width="120px">
    <el-form-item label="Tên" prop="Caption">
      <el-input v-model="model.Caption"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('createForm')">Lưu</el-button>
      <el-button @click="closeForm()">Đóng</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import utilsLibrary from "@/services/utils";
  export default {
    props: ['data'],
    data() {
      return {
        rules: {
          Caption: [
            { required: true, message: 'Hãy nhập tên khối dữ liệu', trigger: 'blur' },
            //{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ]
        },
        model: {Caption:''},
        communication : { action: 'insert', items: [] }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.save();
            //this.$hub.$emit('update-data-group-tree', this.ruleForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closeForm() {
        this.$hub.$emit('close-modal');
      },

     save() {
       var ctrl = this;
      var selectedDataGroup = this.data.data;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      var arrCaption = ctrl.model.Caption.split(';');
      var arrItems = [];
      request.TotalRequests = 0;
      //console.log(utilsLibrary)
      $.each(arrCaption, (index, caption)=> {
        if (caption != '') {
          request.TotalRequests++;
          var item = {
            Caption: caption,
            Code: 'DataGroup.' + utilsLibrary.removeVNCharacters(caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
            Description: JSON.stringify({
              Caption: caption,
              Filters: [],
              Buttons: [],
              Dependencies: [],
              Permissions: [],
              Link: {}
            }),
            Name: utilsLibrary.removeVNCharacters(caption),
            Value: '[]'
          }
          utilsLibrary.updateParamsSingleRequest(request, item, request.TotalRequests);
          utilsLibrary.updateParamsSingleRequest(request, {
            RequestTemplate: 'SettingNew.Insert',
            NestedSetType: 'InsertLastChildNode',
            ReferenceId: selectedDataGroup.value
          }, request.TotalRequests);
          arrItems.push(item);
        }
      });
      utilsLibrary.post(request).then((data)=> {
        if (data.success) {
          utilsLibrary.showMessage('success', this.$toastMessage.updateItemPre + this.$toastMessage.updateItemSuf);
          ctrl.communication = { action: 'insert', items: [] };
          var arrLinked = [];

          $.each(arrItems, (index, item)=> {
            arrLinked.push({
              Id: data['R' + (index + 1)].Data,
              Caption: item.Caption,
              Name: 'DataGroup'
            });
            item.Id = data['R' + (index + 1)].Data;
            item.label = item.Caption;
            item.value = item.Id;
            ctrl.communication.items.push(item);
          });
          utilsLibrary.linkToRoleEveryone(arrLinked);
          this.$hub.$emit('update-data-group-tree');
          this.closeForm();
        } else
          utilsLibrary.showMessage('error', toastMessage.updateItemFailed);
      });
    }


    }
  }
</script>
