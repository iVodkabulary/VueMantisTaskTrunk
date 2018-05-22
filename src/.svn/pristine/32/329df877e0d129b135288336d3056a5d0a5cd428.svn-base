<template>
  <div class="block">
    <el-pagination
      :small="isMobile"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currPage"
      :page-size="pagesize"
      :layout="layout"
      :total="totalPage">
    </el-pagination>
  </div>


</template>
<script>
  export default {
    props: ['totalPage', 'currentPage', 'pagesize' , 'callback' ],

    methods: {
      handleSizeChange(val) {
       // console.log(`${val} items per page`);
      },
      handleCurrentChange(val) {
        if(this.callback) this.callback(val)
        //console.log(`current page: ${val}`);
      }
    },
    data() {
      return {
        isMobile: this.$isMobileDevice,
        //layout: this.isMobile ? "total, prev, pager, next" : "total, prev, pager, next, jumper"
        layout: "total, prev, pager, next",
        currPage: 1,
      };
    },
    mounted() {
      this.currPage = this.currentPage
    },
    created() {

    },
    watch: {
      currentPage: function(newIndex){
        this.currPage = newIndex;
      }
    }
  }
</script>

<style lang="scss">
  .el-pagination {
    float: right;
  }
</style>
