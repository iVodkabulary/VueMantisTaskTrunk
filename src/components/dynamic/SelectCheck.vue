<template>
  <el-select
    v-model="values"
    multiple
    filterable
    allow-create
    collapse-tags
    value-key="GroupId"
    :placeholder="placeholder" @change="handleChange">
    <el-option
      v-for="item in datasource"
      :key="item.GroupId"
      :label="item.GroupName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
  export default {
     props: ['datasource','placeholder', 'callback'],  
    data() {
      return {
        source: this.datasource,
        values: []
      }
    },
    methods: {
      handleChange(value) {
        if(this.callback)(this.callback(value))
       // console.log(value);
      }
    }
  }
</script>