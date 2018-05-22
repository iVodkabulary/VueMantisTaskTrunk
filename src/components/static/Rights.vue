<template>
  <div id="b">
    <el-form>
      <el-form-item>
        <el-button type="primary" style="float: right" >Lưu</el-button>
      </el-form-item>
      <el-form-item>
    <el-tabs type="border-card">
      <el-tab-pane label="Cấu hình Form"><FormConfig :code="code"/></el-tab-pane>
      <el-tab-pane label="Phân Quyền"><SubRights/></el-tab-pane>
    </el-tabs>
      </el-form-item>
    </el-form>
</div>
</template>

<script>
  import FormConfig from "@/components/static/advance/FormForm.vue";
  import SubRights from "@/components/static/SubRights.vue";

export default {
  components: {
    FormConfig,SubRights
  },
  props:["code"],
  data() {
    return {
      taskCode: 'Form.task.0d1c1'
    }
  },
  methods: {

  },
  mounted() {

  },
  created(){
   // console.log(this.code);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-tabs--border-card>.el-tabs__content{
    padding: 0px ;
  }
</style>
