<template>
  <div class="download">
    <el-table :data="this.datasource"
              stripe
              style="width: 100%">
      <el-table-column type="index"
                       label="STT"
                       width="50">
      </el-table-column>
      <!--         <el-table-column
          prop="name"
          label="Người cập nhật"
          width="180">
        </el-table-column> -->
      <el-table-column prop="FileName"
                       label="Tên file">
        <template slot-scope="scope">
          <a :href="base + 'Download.ashx?Id=' + scope.row.Id" target="_blank">{{scope.row.FileName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="CreatedByName"
                       label="Người Tạo">
      </el-table-column>
      <el-table-column prop="FileExtension"
                       label="Loại">
      </el-table-column>
      <el-table-column label="Dung lượng">
        <template slot-scope="scope">
          {{parseFloat(scope.row.FileSize/(1024 * 1000)).toFixed(2)}} MB
        </template>
      </el-table-column>
      <el-table-column label="Hành động">
        <template slot-scope="scope">
          <a :href="base + 'Download.ashx?Id=' + scope.row.Id" target="_blank">
            <el-button type="primary" icon="el-icon-download">
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  // import WeekTaskData from "@/temp/WeekTaskData.json"
  export default {
    props: ['data'],
    data() {
      return {
        datasource: this.data,
        base: this.$appUri.BaseURL,
        currentUser: JSON.parse(localStorage.getItem("LoggedOnUser")).UserId,
      };
    },
    methods: {

    },
    created() {
      // console.log(this.data)
    }

  }
</script>
<style>

</style>
