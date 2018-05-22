<template>
    <div>
      <div class="headerMenu">{{title}}</div>
      <el-card class="box-card" v-for="item in vList" :key="item.Id">
        <div slot="header" class="clearfix">
          <a href="javaScript:void(0)" @click="fnOpenDetail(item, false)">{{item.Name}}</a>
          <div class="owner">
            <i v-if="item.TargetType == 1" class="fa fa-users fa-lg mt-4"> {{item.GroupName}}</i>
            <i v-if="item.TargetType != 1" class="fa fa-user fa-lg mt-4">{{item.OwnerName}}</i>
          </div>
        </div>
        <div class="bdCt text item">
          <div v-if="item.TargetType" class="tgSt"><b>Loại:</b> {{item.TargetTypeName}}</div>
          <div v-if="item.TargetType != 1" class="tgSt"><b>Phòng:</b> {{item.GroupName}}</div>
          <div v-if="item.TargetType == 1" class="tgSt"><b>Quản lý:</b> {{item.OwnerName}}</div>
          <div layout="row">
                <span>
                  <b style="white-space: nowrap">Tỉ lệ:</b>
                </span>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="parseFloat(item.Progress)"
                         :status=" item.Progress? (parseFloat(item.Progress) >= 100 ? 'success' : parseFloat(item.Progress) === 0 ? 'exception': '') : 'exception' "></el-progress>
          </div>
          <div class="tgSt"><b>Người thực hiện:</b> {{item.AssignedName}}</div>
          <div class="tgSt"><b>Cập nhật:</b> {{item.Modified}}</div>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
      props: ["title", "vList", "fnOpenDetail"],
      data(){return {
        list:[]
      }},
      watch: {
      "vList":function(newVal){
        //this.list = newVal;
        //console.log('newVal==>>', newVal)
      }
    }
    }

</script>

<style scoped>

</style>
