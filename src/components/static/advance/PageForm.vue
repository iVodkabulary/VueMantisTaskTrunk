<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
  <el-form-item label="Tên" prop="name">
     <el-col :span="11">
    <el-input v-model="ruleForm.name"></el-input>
     </el-col>
  </el-form-item>
  <el-form-item label="Mô tả" prop="name">
     <el-col :span="11">
    <el-input v-model="ruleForm.desc"></el-input>
     </el-col>
  </el-form-item>
  <el-form-item label="Nguồn dữ liệu" prop="region">
    <el-select v-model="ruleForm.region" placeholder="Activity zone">
      <el-option label="Zone one" value="shanghai"></el-option>
      <el-option label="Zone two" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="Dữ liệu gốc" required>
    <el-col :span="11">
       <el-input v-model="ruleForm.source"></el-input>
    </el-col>
  </el-form-item>

  <el-collapse v-model="activeNames">
        <el-collapse-item title="Mở rộng điều kiện truyền thêm" name="extenField1">
           <el-form-item label="Khóa" prop="name">
          <el-col :span="11">
          <el-input v-model="ruleForm.name"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label="Giá trị" prop="name">
            <el-col :span="11">
            <el-input v-model="ruleForm.desc"></el-input>
            </el-col>
          </el-form-item>
           <el-button @click="resetForm('ruleForm')">Thêm</el-button>
           <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Xử lý"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Khóa"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Giá trị">
      </el-table-column>
    </el-table>
        </el-collapse-item>
  </el-collapse>
   <el-collapse v-model="activeNames">
        <el-collapse-item title="Mở rộng các trường liên quan" name="extenField2">
         <el-form-item label="Khóa" prop="name">
          <el-col :span="11">
          <el-input v-model="ruleForm.name"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label="Giá trị" prop="name">
            <el-col :span="11">
            <el-input v-model="ruleForm.desc"></el-input>
            </el-col>
          </el-form-item>
           <el-button @click="resetForm('ruleForm')">Thêm</el-button>
           <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Nguồn"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Đích"
        width="180">
      </el-table-column>
       <el-table-column
        prop="name"
        label="Loại"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Loại xử lý">
      </el-table-column>
    </el-table>
        </el-collapse-item>
  </el-collapse>
   <el-collapse v-model="activeNames">
        <el-collapse-item title="Mở rộng các khối liên kết" name="extenField3">
           <el-form-item label="Khóa" prop="name">
          <el-col :span="11">
          <el-input v-model="ruleForm.name"></el-input>
          </el-col>
          </el-form-item>
         <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Stt"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Khối liên kết"
        width="180">
      </el-table-column>
       <el-table-column
        prop="name"
        label="Xử lý"
        width="180">
      </el-table-column>

    </el-table>

        </el-collapse-item>
  </el-collapse>


</el-form>
</template>
<script>
  export default {
    data() {
      return {
        activeNames: ['extenField1', 'extenField2', 'extenField3'],

        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          region: [
            { required: true, message: 'Please select Activity zone', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: 'Please pick a time', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: 'Please select at least one activity type', trigger: 'change' }
          ],
          resource: [
            { required: true, message: 'Please select activity resource', trigger: 'change' }
          ],
          desc: [
            { required: true, message: 'Please input activity form', trigger: 'blur' }
          ]
        },
        tableData:[],

      };
    },
    created(){

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
