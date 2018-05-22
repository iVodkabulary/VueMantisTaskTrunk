<template>
   <div>
      <el-form>
         <el-form-item >
            <span slot="label">Tên nghiệp vụ</span>
            <el-input v-model="model.Name" placeholder="Tên nghiệp vụ"  ></el-input>
         </el-form-item>
         <el-form-item>
               <el-button type="primary" @click="checkExits()" >Lưu</el-button>
               <el-button @click="closeForm()">Đóng</el-button>
         </el-form-item>
      </el-form>
   </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      textarea: "",
      model: this.$Lodash.cloneDeep(this.data.model),
      ListStatus: [],
      ListUser: [],
      ListGroup: [],
      users:[{
        label:"Administrator",
        value:"Administrator"
      },{
        label:"Phạm Bá Nam",
        value:"Phạm Bá Nam"
      },{
        label:"Đỗ Qúy Anh",
        value:"Đỗ Qúy Anh"
      },
      {
        label:"Phạm Tuân",
        value:"Phạm Tuân"
      },
      {
        label:"Anh Nhật",
        value:"Anh Nhật"
      },
      {
        label:"Anh Dũng",
        value:"Anh Dũng"
      }
      ]
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    closeForm(){
      this.$hub.$emit('close-child-modal')
    },
    checkExits(){
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = 'Setting.SearchSetting';
      request.R1_Value = this.model.Value;
      request.R1_ParentCode = 'xSetting.Project.Parameter.Project.Category';
      this.$Utils.post(request).then((data) => {
        var listExitsCate = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
        listExitsCate = listExitsCate.filter((el) => {
          return el.Name == this.model.Name;
        });
        if (listExitsCate.length > 0) {
          console.log('Chuyên mục đã tồn tại')
          // if ($rootScope.application.versionName == 'Professional') {
          //   this.$Utils.showMessage('error', 'Danh mục nghiệp vụ đã tồn tại');
          // } else if ($rootScope.application.versionName == 'Enterprise') {
          //   this.$Utils.showMessage('error', 'Chuyên mục đã tồn tại');
          // }
        } else {
          this.updateSetting()
        }

      });
    },
    updateSetting() {
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.R1_RequestTemplate = "Setting.Update";
      request.R1_Name = this.model.Name;
      request.R1_Id = this.model.Id;
      this.$Utils.postCheckResult(request).then((dData) => {
        this.data.function.getSetting();
        this.closeForm();
      })
    },

  },
  created(){

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
