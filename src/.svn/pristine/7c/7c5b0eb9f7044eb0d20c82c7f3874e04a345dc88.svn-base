<template>
  <el-form>
    <el-form-item label="Quyền hiển thị" flex-gt-sm>
      <el-select v-model="model.UserPermissions" multiple>
        <el-option v-for="item in viewModel.UserPermissions " :value="item.GroupId"
                   :label="item.Description"></el-option>
        <hr>
        <div v-for="item in viewModel.GroupPermissions ">
          <el-option :value="item.GroupId" :label="item.GroupName"></el-option>
          <el-option v-for="child in viewModel.RolePermissions[item.GroupId]" :value="child.GroupId"
                     :label="'-- ' + child.Description"></el-option>
        </div>
      </el-select>
    </el-form-item>
    <el-form-item label="Quyền nhân sự">
      <el-select v-model="model.listUsers" multiple>
        <el-option v-for="item in viewModel.listUsers " :value="item.UserId" :label="item.LoginName">
          <span style="float: left">{{ item.LoginName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Username }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Loại">
      <el-select v-model="viewModel.Type">
        <el-option value="Field" label="Trường dữ liệu"></el-option>
        <el-option value="Other" label="Khác"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Trường">
      <el-select v-model="viewModel.Key" filterable>
        <el-option :value="item.Name" v-for="item in viewModel.Fields" :label="item.Caption">
          <span style="float: left">{{ item.Caption }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="viewModel.Type=='Other'" label="Trường">
      <el-input v-model="viewModel.Key"/>
    </el-form-item>
    <el-form-item label="Giá trị">
      <el-input v-model="viewModel.Value"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="addFilter()"
                 :disabled="viewModel.Key == undefined || viewModel.Key == ''|| viewModel.Value == undefined || viewModel.Value == ''">
        Thêm
      </el-button>
    </el-form-item>

    <el-form-item>
      <table class="el-table__body-wrapper el-table--border is-scroll-left">
        <thead>
        <tr>
          <td>XỬ LÝ</td>
          <td>LOẠI</td>
          <td>TRƯỜNG</td>
          <td>GIÁ TRỊ</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in viewModel.ListFilters">
          <td>
            <el-button @click="removeFilter(index)">
              <i class="fa fa-trash"></i>
            </el-button>
          </td>
          <td>{{item.Type}}</td>
          <td>{{item.Key}}</td>
          <td>{{item.Value}}</td>
        </tr>
        </tbody>
      </table>
      <br/>
    </el-form-item>
    <el-form-item>
      <el-button @click="save()">Lưu</el-button>
      <el-button @click="cancel()">Đóng</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "page-field-info-dialog",
    props: ['data'],
    data() {
      var dat = {};
      dat.viewModel = {
        Fields: [],
        Type: 'Field',
        Key: '',
        ListFilters: []
      };
      dat.model = {
        action: '',
        UserPermissions: [],
        listUsers: [],
        DefaultFilter : {},
      };
      dat.treeLst = this.data.scope.model.ObjectFields?this.data.scope.model.ObjectFields:[];

      dat.viewModel.UserPermissions = this.data.scope.viewModel.UserPermissions ;
      dat.viewModel.GroupPermissions = this.data.scope.viewModel.GroupPermissions;
      dat.viewModel.RolePermissions = this.data.scope.viewModel.RolePermissions;
      dat.viewModel.listUsers = this.data.scope.viewModel.listUsers;
      dat.dataToPass = this.data.scope;
      return dat;
    },
    methods: {
      save() {
        var ctrl = this;
        if (ctrl.data.scope.model.Description.IsDashboard)
          ctrl.model.DefaultFilter[ctrl.treeLst[this.data.index].Caption] = ctrl.viewModel.ListFilters;
        else
          ctrl.model.DefaultFilter = ctrl.viewModel.ListFilters;

        if (this.data.action == 'edit') {
          $.each(ctrl.dataToPass.model.Value, (i, v)=>{
            if(ctrl.model.ModuleCode == v.ModuleCode){
              ctrl.dataToPass.model.Value.splice(i, 1);
              ctrl.dataToPass.model.Value.splice(i, 0, ctrl.model);
              ctrl.$hub.$emit('reloadFieldTree');
              return false;
            }
          })
          if(ctrl.treeLst[ctrl.data.index]){
            $.each(ctrl.treeLst[ctrl.data.index].children, (i, v)=>{
              if(ctrl.model.ModuleCode == v.ModuleCode){
                ctrl.treeLst[ctrl.data.index].children.splice(i, 1);
                ctrl.treeLst[ctrl.data.index].children.splice(i, 0, ctrl.model);
                ctrl.$hub.$emit('reloadFieldTree');
                return false;
              }
            });
          }
        }else{
          ctrl.treeLst[ctrl.data.index].children.push(ctrl.model);
          ctrl.dataToPass.mode.Value.push(ctrl.model);
          ctrl.$hub.$emit('reloadFieldTree', ctrl.data.index);
        }
        ctrl.cancel();
      },
      cancel() {
        this.$hub.$emit('close-modal');
      },
      addFilter() {
        this.viewModel.ListFilters.push({
          Key: this.viewModel.Key,
          Value: this.viewModel.Value,
          Type: this.viewModel.Type
        });
        this.viewModel.Key = '';
        this.viewModel.Value = '';
      },
      removeFilter(index) {
        this.viewModel.ListFilters.splice(index, 1);
      },
      bindDataGroupFields() {
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_Code = this.model.ModuleCode;
        this.$Utils.post(request).then( (data)=> {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          this.model.DataGroup = data[0].Name;

          request = this.$Lodash.cloneDeep(this.$singleRequest);
          request.R1_RequestTemplate = 'SettingNew.SearchSetting';
          request.R1_Code = this.model.DataGroup;
          this.$Utils.post(request).then( (data)=> {
            data = this.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting')[0];
            data.Description = JSON.parse(data.Description);
            data.Fields = '';
            for (var i = 1; i <= data.Description.FCount; i++) {
              if (data['F' + i] != undefined)
                data.Fields += data['F' + i];
            }
            this.viewModel.Fields = JSON.parse(data.Fields);
          });
        })
      }
    },
    created() {
      var ctrl = this;
      if (ctrl.data.action == 'edit') {
        ctrl.action = 'edit';
        var model = ctrl.$Lodash.cloneDeep(ctrl.data.item);
        $.each(model, (k, v)=>{
          ctrl.$set(ctrl.model,k,v);
        })
        if (ctrl.data.scope.model.Description.IsDashboard) {
          if (ctrl.model.DefaultFilter[ctrl.treeLst[ctrl.data.index].Caption] == undefined){
            ctrl.$set( ctrl.model.DefaultFilter, ctrl.treeLst[this.data.index].Caption, []);
          }
          ctrl.viewModel.ListFilters = ctrl.model.DefaultFilter[ctrl.treeLst[this.data.index].Caption];
        } else {
          if (ctrl.$Utils.equals(ctrl.model.DefaultFilter, {}))
            ctrl.model.DefaultFilter = [];
          ctrl.viewModel.ListFilters = ctrl.model.DefaultFilter;
        }
        this.bindDataGroupFields();
      }
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
</style>
