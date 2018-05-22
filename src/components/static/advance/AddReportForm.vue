<template>
	<el-form ref="form" :rules="rules" :model="form">
		<el-form-item label="Tên báo cáo" prop="name">
    		<el-input v-model="form.name"></el-input>
  		</el-form-item>
  		 <el-form-item>
    		<el-button type="primary" @click="save">Lưu</el-button>
    		<el-button @click="close">Đóng</el-button>
  		</el-form-item>
	</el-form>
</template>
<script>
  export default {
  	props:["data"],
    data() {
      return {
      	communication:{},
        form: {
          name: '',
        },
        rules: {
        	name: [
            { required: true, message: 'Tên báo cáo không được để trống', trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
    	reload(){
    		//console.log("Reload");
    		 this.$hub.$emit('reload');
    	},
    	close(){
    		this.$hub.$emit('close-modal');
    	},
      save() {
      	var ctrl = this;
      var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
      var arrCaption = ctrl.form.name.split(';');
      var arrItems = [];
      request.TotalRequests = 0;
      $.each(arrCaption, function(index,caption){
      	if (caption != '') {
      		request.TotalRequests++;
      		var item = {
      			Code: 'Report.' + ctrl.$Utils.removeVNCharacters(caption) + '.' + Math.random().toString(18).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 5),
      			Description: JSON.stringify({
              	Caption: caption, ModuleType: 'Report',
              	ReportProportion: '65', ReportType: 'Column', TableProportion: '30', EnableDataSeries: 'false',
              	ShowReport: 'true', ShowReportHeader: 'true', ShowTable: 'true', AssignedUser: 'false',
              	Fields: {X: [], Y: [], V: [], T: [], Table: [], Series: [], Calculators: []}
            	}),
            	Caption: caption, Value: '[]'
      		}
      		ctrl.$Utils.updateParamsSingleRequest(request, item, request.TotalRequests);
      		ctrl.$Utils.updateParamsSingleRequest(request, {
      			RequestTemplate: 'SettingNew.Insert',
            	NestedSetType: 'InsertLastChildNode',
            	ReferenceId: ctrl.data.data
      		},request.TotalRequests);
      		arrItems.push(item);
      	}
      });
      ctrl.$Utils.post(request).then(function (data) {
      	if (data.success) {
      		ctrl.$Utils.showMessage('success', "Thêm mới thành công.");
      		ctrl.communication = {action: 'insert', items: []};
      		var arrLinked = [];
      		$.each(arrItems,function(index,item){
      			arrLinked.push({
      				Id: data['R' + (index + 1)].Data,
              		Caption: item.Caption,
              		Name: 'Report'
      			});
      			item.Id = data['R' + (index + 1)].Data;
            	ctrl.communication.items.push(item);
      		});
      		ctrl.$Utils.linkToRoleEveryone(arrLinked);
      		ctrl.reload();
      		ctrl.close();
      	}else{
      		ctrl.$Utils.showMessage('error', "Đã xảy ra lỗi.");
      		ctrl.reload();
      		ctrl.close();
      	}
      });

      }
    },
    created() {
    	//console.log(this);
    }
  }
</script>
