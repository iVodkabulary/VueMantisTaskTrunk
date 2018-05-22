
<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
  <el-form-item label="Phòng ban">
    <el-input v-model="formInline.Name" placeholder="Tên"></el-input>
  </el-form-item>
  <el-form-item label="Phòng ban cha">
    <SelectCheck :datasource="datasource"  :value="formInline.Group" @update="childUpdate" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">Lưu</el-button>
  </el-form-item>
</el-form>
</template>

<script>
  import SelectCheck from '@/components/dynamic/SelectCheck'
  export default {
    props: ["datasource"],
    data() {
      return {
        formInline: {
          Name: '',
          Group: ''
        }
         //groups: [ ]


      }
    },
    components:{
        SelectCheck
    },
    methods: {
      childUpdate(value){
        this.Group = value;
      },
      onSubmit() {
        //console.log('submit!');
        this.formInline.Group = SelectCheck.value;
        this.$hub.$emit('update-category-callback', SelectCheck)
      }
    }
  }
</script>
