<template>
  <div>
    <el-form>
      <el-form-item>
        <el-select v-model="value" placeholder="Loại" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value" placeholder="Quyền" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value" placeholder="Mẫu gửi" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="Trường bổ sung"
          v-model="input10"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="Thêm"
          v-model="input10"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-col :span="8">&ensp;</el-col>
        <el-col :span="8">
          <el-button type="primary">Lưu</el-button>
          <el-button @click="closeForm">Đóng</el-button>
        </el-col>
        <el-col :span="8">&ensp;</el-col>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from "vue";
  import UserDropdown from "@/components/static/UserDropdown";
  import ActivityDropdown from "@/components/static/ActivityDropdown";
  export default {
    data() {
      return {
        input10: '',
        options: [{
          value: 'Option1',
          label: 'Option1'
        }, {
          value: 'Option2',
          label: 'Option2'
        }, {
          value: 'Option3',
          label: 'Option3'
        }, {
          value: 'Option4',
          label: 'Option4'
        }, {
          value: 'Option5',
          label: 'Option5'
        }],
        value: ''
      };
    },
    methods: {
      closeForm(){
        this.$hub.$emit('close-modal')
      }
    },
    destroyed() {
    },
    mounted() {

    },
    created(){

    },
    watch: {

    }
  };
</script>
