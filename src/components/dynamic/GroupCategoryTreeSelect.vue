<<template>
  <div class="block">

  <el-cascader
    expand-trigger="hover"
    :options="datasource"
    change-on-select
    v-model="selectedOptions2"
    @change="handleChange">
  </el-cascader>
</div>
</template>
<script>
  export default {
    props:['datasource'],
    data() {
      return {
       // options:  this.datasource,
        selectedOptions: [],
        selectedOptions2: []
      };
    },
    methods: {
      handleChange(value) {
       // console.log(value);
      }
    }
  };
</script>
