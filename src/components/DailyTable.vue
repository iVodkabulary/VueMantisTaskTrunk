<template>
   <el-table v-if="tblData.length > 0"
                      border
                      :id="id"
                      :data="tblData"
                      style="width: 100%;"
                      show-summary sum-text="Tổng" empty-text="Không có dữ liệu"
                      >
                      <el-table-column prop="Index" label="Mã" width="65">
                         <template slot-scope="scope">
                           
                         <router-link :to="'/dynamic/view/Index='+scope.row.Index"> 
                          <span :style="'color:red;text-decoration:' + (taskDone.indexOf(scope.row.Status) >-1 ? 'line-through' : '')">
                           {{scope.row.Index}}
                           </span>
                            <i v-if="scope.row.PriorityId && $isMobileDevice" class="fa fa-square" :style="'color:' + priorityColors[scope.row.PriorityId.toUpperCase()]" ></i>
                            <i v-if="$isMobileDevice" class="fa fa-clock-o" :style="'color:' + (parseFloat(overHours(scope.row)+ '')<0?'red':'blue')"></i>
                            <i v-if="scope.row.TotalDownload" class="fa fa-paperclip" >{{scope.row.TotalDownload}}</i>
                            <i v-if="scope.row.TotalComment" class="fa fa-comments-o" >{{scope.row.TotalComment}}</i>
                         </router-link>
                        </template>
                      </el-table-column>
                      <el-table-column label="Tên công việc" min-width="200"> 
                        <template slot-scope="scope">
                          
                           <router-link :to="'/dynamic/view/Index='+scope.row.Index">
                            <span :style="'text-decoration:' + (taskDone.indexOf(scope.row.Status) >-1 ? 'line-through' : '')">
                              {{scope.row.Name}} 
                            </span>
                           </router-link>
                         </template>
                      </el-table-column>
                      <el-table-column  label="Trạng thái">
                         <template slot-scope="scope">
                           <div class="text-center" :style="'margin:0px; background-color:' + statusColors[scope.row.Status.toUpperCase()]" >{{scope.row.StatusName}}</div>
                         </template>
                      </el-table-column>

                      <el-table-column prop="PlanManHour" label="Ước tính"/>
                     
                      <el-table-column prop="RemainingManHour" label="Thực tế"/>
                      <el-table-column  label="Quá hạn">
                        <template slot-scope="scope" >
                         <i class="fa fa-clock-o" :style="'color:' + (parseFloat(overHours(scope.row)+ '')<0?'red':'blue')"></i>
                         <span> {{overHours(scope.row)}}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="Ngày thực hiện">
                        <template slot-scope="scope">
                          <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.PlanStartDate, 'DD/MM/YYYY HH:mm')}} </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Ngày kết thúc">
                        <template slot-scope="scope">
                          <span style="text-align: center"> {{$Utils.formatDateTime(scope.row.Deadline, 'DD/MM/YYYY HH:mm')}} </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Ưu tiên">
                         <template slot-scope="scope">
                            <div class="text-center" :style="'margin:0px; background-color:' + priorityColors[scope.row.PriorityId.toUpperCase()]" >{{scope.row.PriorityIdName}}</div>
                         </template>
                      </el-table-column>
                       <el-table-column v-if="$isMantisAdmin() || $isSystemAdmin()" prop="WorkerName" label="Thực hiện"/>
                      <el-table-column prop="TypeName" label="Tính chất"/>
                    </el-table>
                    <span v-else>Không có dữ liệu</span>
</template>

<script>
  
  export default {
    inject:[
     'statusColors',
     'priorityColors',
     'taskDone'
    ], 
    props : ['tblData', 'id'],
    data(){
      return {
        statusColor: {}
      }
    },
    methods: {
      overHours(item) {
      var temp = this.$Utils.expressionToString(
              item,
              "{{Deadline|DateTime:toNows}}"
      );
       if (this.taskDone.indexOf(item.Status) == -1 && 
              eval(new Date() > new Date(item.PlanStartDate))){
              return parseFloat(temp).toFixed(2);
            }
            return "0.00";
      }
    }
  }
</script>
<style lang="scss" scoped>
  
</style>


 