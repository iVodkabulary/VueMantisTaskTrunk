<template>
  <div>
    <el-dialog title="Thêm nghiệp vụ" v-if="centerDialogVisible" :visible.sync="centerDialogVisible" :width="$isMobileDevice ? '100%':'30%'" center @close="closeDialog">
        <span>
           <CreateGroupCategoryForm :groupcategories="categoriesTree" :grcategories="categories" :rootId="rootId"
                                    :callback="loadCategories" :parent="item"/>
        </span>
    </el-dialog>
    <CreateGroupCategoryForm :groupcategories="categoriesTree" :grcategories="categories" :rootId="rootId"
                             :callback="loadCategories"/>
    <GroupCategoryTree :callback="loadCategories" :rootId.sync="rootId"/>
  </div>
</template>
<script>
import GroupCategoryTree from "@/components/dynamic/GroupCategoryTree";
import CreateGroupCategoryForm from "@/components/static/CreateGroupCategoryForm";

export default {
  components: { GroupCategoryTree, CreateGroupCategoryForm },
  data() {
    return {
      categories: [],
      categoriesTree: [],
      rootId: '',
      centerDialogVisible:false,
      item: {},
      treeData: {
          Name: 'Danh mục nghiệp vụ',
          children: [],
          level: '0',
          Level: '5',
          collapseIcon:'fa fa-cog',
          expandIcon: 'fa fa-cog'
        }
    };
  },

  methods: {
    delete(dataToPass) {},
    loadCategories() {
      var request = {
        RequestClass: "xBase",
        RequestAction: "Request",
        TotalRequests: 1,
        R1_RequestTemplate: "SettingNew.SearchSetting",
        R1_ParentCode: "xSetting.Project.Parameter.Organization.Category",
        R1_IncludedNestedSetParent : true
      };
       this.$Utils.post(request).then(response => {

               var category = [];
                category = this.$Utils.getDataWithRoot(
                  response.R1,
                  "Data.DynamicDS.Setting"
                );
              this.categories =this.$Lodash.cloneDeep(category) ; // = this.$Utils.createCustomTreeFromList(category, 'Id', 'ParentId', 'children', {Name: 'label', Id: 'value'}, {});
              this.rootId = this.$Lodash.cloneDeep(category[0].Id);
              this.categories.shift();
            });

    },
    closeDialog(){
      this.item= {}
    }
  },
  destroyed(){
   this.$hub.$off('update-category-tree');
   this.$hub.$off('update-category-tree-form');
   this.$hub.$off('addNewCat');
  },
  created() {
  },
  mounted() {
    this.loadCategories();

   this.$hub.$on('update-category-tree',()=>{
    this.loadCategories()
     this.centerDialogVisible = false;
    } );

    this.$hub.$on('addNewCat',(item)=>{
      this.item = item;
      this.centerDialogVisible = true;
    } );

    this.$hub.$on('update-category-tree-form',()=>{
    this.loadCategories()
    } );
  },
  watch: {
    categories: function(newCat){
      this.categoriesTree = this.$Utils.createCustomTreeFromList(
      this.$Lodash.cloneDeep(newCat),
      "Id",
      "ParentId",
      "children",
      { Name: "label", Id: "value" },
      {}
      );
    }
  }
};
</script>
