<template>
  <div>
<el-tabs :tab-position="tabPosition" v-model="activeName">
    <el-tab-pane label="Phòng ban" name="Groups">
      <Groups v-if="activeName=='Groups'"/>
    </el-tab-pane>
    <el-tab-pane label="Dự án" name="Project">
      <Project v-if="activeName=='Project'"/>
    </el-tab-pane>
    <el-tab-pane label="Nghiệp vụ" name="GroupCategories">
      <GroupCategories v-if="activeName=='GroupCategories'"/>
    </el-tab-pane>
    <el-tab-pane label="Danh mục tài liệu" name="DocumentCategories">
     <DocumentCategories v-if="activeName=='DocumentCategories'"/>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

 <script>

import Groups from "@/components/static/Groups.vue";
import GroupCategories from "@/components/static/GroupCategories.vue";
import Project  from "@/components/static/Project.vue";
import DocumentCategories from "@/components/static/DocumentCategories.vue";


 export default {
   components: {
    Groups,GroupCategories,Project,DocumentCategories
   },
   data() {
     return {
       activeName: 'first',
       tabPosition: 'top',
       activeName: "Groups",
     }
   },
   methods: {

   },
   created: function() {

   },
 }
 </script>

  <style scoped>

  </style>
