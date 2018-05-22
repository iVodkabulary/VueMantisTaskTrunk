<template>
  <div class="history">
    <el-container v-for="item in tableData">
      <el-header>v.{{item.Version}}.0 <b>{{item.CreatedByName}}</b>, {{item.Created}}</el-header>
      <el-table
        :data="item.DataSource"
        stripe
        style="width: 100%">
        <el-table-column
          prop="ColumnCaption"
          label="Tên thuộc tính"
          width="180">
        </el-table-column>
<!--         <el-table-column
          prop="name"
          label="Người cập nhật"
          width="180">
        </el-table-column> -->
        <el-table-column
          prop="OldDisplayValue"
          label="Giá trị cũ">
          <template slot-scope="scope">
            <span v-html="scope.row.OldDisplayValue"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="NewDisplayValue"
          label="Giá trị mới">
          <template slot-scope="scope">
            <div v-html="scope.row.NewDisplayValue"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </div>
</template>

<script>
  export default {
    props: ['parent', 'idSetting'],
    data() {
      return {
        Setting: this.idSetting,
        tableData: []
      }
    },
    created() {
      var countHistory = this.$Utils.updateParamsSingleRequest(
        this.$Lodash.cloneDeep(this.$singleRequest),
        {
          RequestTemplate: "ChangedLogs",
          // SourceId: objReturn.Id,
          SourceId: this.parent.Id,
          Code: "ChangedHistory"
        }
      );
      var arrShowField = [];
      if (this.$Utils.getDataWithRoot(this.Setting, 'Fields')) {
        this.Setting.Fields.forEach((field) =>
         {
          if (field.History == 'true') {
            arrShowField.push(field);
          }
        });
      }
      if(this.$Utils.isEmpty(this.parent, 'Id')){
        this.$Utils.post(countHistory).then((result) => {
          this.tableData = this.$Utils.getDataWithRoot(result.R1, 'Data.DataDS.Logs');
          this.tableData.forEach((val) => {
            val.Changes = JSON.parse(val.Changes)
            val.DataSource = [];
            val.Changes.forEach((change) => {
              
              /**
               * Kiểm tra có trường $scope.showFields không
               * Nếu có trường $scope.showFields thì xem các trường lấy từ lịch sử có trong $scope.showFields
               * Nếu có trong $scope.showFields thì đẩy vào $scope.viewModel.dataSource để hiển thị ra trên danh sách
               */
              if (arrShowField.length > 0) {
                if (change.ColumnName == "Comment" || change.ColumnName == "Reply") {
                  var object = this.$Lodash.cloneDeep(change);
                  // if (field.ElementType == 'Html') {
                  object.OldDisplayValue = this.$Utils.decodeHtmlEntities(change.OldDisplayValue);
                  object.NewDisplayValue = this.$Utils.decodeHtmlEntities(change.NewDisplayValue);
                  // }
                  val.DataSource.push(object);
                }
                arrShowField.forEach((field) => {
                  var object = this.$Lodash.cloneDeep(change);
                  var checkField = field.DynamicText ? field.DynamicText : field.Name
                  if (checkField == change.ColumnName) {
                    if (field.ElementType == 'Html') {
                      object.OldDisplayValue = this.$Utils.decodeHtmlEntities(change.OldDisplayValue);
                      object.NewDisplayValue = this.$Utils.decodeHtmlEntities(change.NewDisplayValue);
                    }
                    val.DataSource.push(object);
                  }
                });
              } else {
                val.DataSource.push(change)
              }
              // console.log(val.DataSource)
            })
            val.Created = this.$Utils.formatDateTime(val.Created, 'DD/MM/YYYY HH:mm')
          })
        })
      }
      
    },
    methods: {

    }
  }
</script>
<style lang="scss">
  .history{
    .el-header {
      background-color: #e1f5fe;
      color: #333;
      // text-align: center;
      line-height: 20px;
      height: 20px !important;
    }
  }
</style>