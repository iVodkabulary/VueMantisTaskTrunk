 <template>
   <div class="tasks">
    <router-view></router-view>
      <!--
     <el-col :span="24">
       <el-col :span="2">
         <el-container direction="vertical" class="vertical-menu">
           <router-link to="/timeline" class="">Timeline</router-link>
           <router-link to="/list" class="">List</router-link>
           <router-link to="/scrumboard" class="">Scrumboard</router-link>
         </el-container>
       </el-col>
       <el-col :span="22">

       </el-col>
     </el-col>
     -->
   </div>
</template>
<script>
import TimeLine from "@/components/Timeline";
import ScrumBoard from "@/components/Scrumboard";
export default {
  components: {
    ScrumBoard,
    TimeLine
  }
};
</script>

<style>

</style>
