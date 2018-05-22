<template>
  <div>
    <el-row>
       <el-col :span="22"><strong>Công việc: {{task.Name}}</strong></el-col>
        <el-col :span="2">
        <el-button  icon="el-icon-edit" @click="showTaskDetail">
        </el-button>
        </el-col>
    </el-row>
      <el-tabs v-model="activeName">
         <el-tab-pane label="Thông tin" name="0">
          <div>
            <div><i class="mr-1 fa fa-calendar-times-o" aria-hidden="true"></i><span>Bắt đầu:</span> {{!data.dataToPass ? formatDate(task.PlanStartDate) : task.PlanStartDate}}</div>
            <div><i class="mr-1 fa fa-calendar-check-o" aria-hidden="true"></i><span>Kết thúc:</span> {{!data.dataToPass ? formatDate(task.Deadline) : task.Deadline}}</div>
            <div><i class="mr-1 fa fa-calendar-minus-o" aria-hidden="true"></i><span>Ước tính: {{task.PlanManHour}}</span></div>
            <div><i class="mr-1 fa fa-clock-o" aria-hidden="true"></i><span>Thực tế: {{task.RemainingManHour}}</span></div>
            <div><i class="mr-1 fa fa-clock-o" aria-hidden="true"></i><span>Còn lại: {{task.RestTime}}</span></div>
            <div><i class="mr-1 fa fa-window-restore" aria-hidden="true"></i><span>Trạng thái: {{task.StatusName}}</span></div>
            <div><i class="mr-1 fa fa-user" aria-hidden="true"></i><span>Nhân viên: {{task.WorkerName}}</span></div>
            <div><i class="mr-1 fa fa-user-secret" aria-hidden="true"></i><span>Giám sát: {{task.ManagerName}}</span></div>
          </div>
        </el-tab-pane>
         <el-tab-pane label="Thảo luận" name="1">
          <Comment :parent="data.dataToPass ? task : data" :idSetting="SettingForm" />
       </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
  import Vue from "vue";
  import UploadFile from "@/components/static/UploadFile";
  import Comment from '@/components/dynamic/Comment'
  import DynamicPage from "@/components/dynamic/DynamicPage";
  export default {
    name: 'Showtaskdetails',
    props: ['data'],
    components: {
      UploadFile,
      Comment
    },
    data() {
      return {
        activeName: '0',
        task: {},
        SettingForm: []
      }
    },
    created() {
      if(this.$Utils.isEmpty(this.data, 'dataToPass')){
        this.task = this.data.dataToPass
      } else {
        //this.task = this.data;
        var request = this.$Lodash.cloneDeep(this.$singleRequest);
        request.RequestClass = "xBase";
        request.RequestAction = "Request";
        request.TotalRequests = 1;
        request.R1_RequestTemplate = "AG_Task_Task.Search";
        request.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
        request.R1_RequestFields =
          'Id;Name;Index;ActualStartDate;ActualFinishDate;PlanStartDate;Deadline;StatusName;WorkerName;' +
          'ManagerName;PlanManHour;RemainingManHour;RestTime;VersionProject;Action;Categories;CategoryProjectLevel1;' +
          'CategoryProjectLevel2;CategoryProjectLevel3;ChosenOne;Code;CreatedBy;GroupRoot;Manager;Milestone;' +
          'ModifiedBy;PriorityId;Project;ProjectType;Quality;Status;TaskQualityResult;TaskRequest;TaskResult;' +
          'TaskState;TotalComment;TotalDownload;Type;Version;Worker;TagName;StatusDisplayName;SeverityName;' +
          'VersionProjectName;CategoriesLevel1;CategoriesLevel2;CategoriesLevel3;CategoriesLevel4;TargetsLevel1;' +
          'TargetsLevel2;TargetsLevel3;TargetsLevel4;TargetsName;ProjectCategoriesLevel1;ProjectCategoriesName;' +
          'ProjectCategoriesLevel2;ProjectCategoriesLevel3;';
        request.R1_Id = this.data.Id;
        this.$Utils.postCheckResult(request).then(data => {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.TasksDS.Task');
          this.task = this.$Lodash.cloneDeep(data[0]);
          this.$forceUpdate();
        });
      }
      if(this.data.activeName){
        this.activeName = '1'
      }
      this.loadSetting();
      //console.log(this.SettingForm.functions);
    },
    methods: {
      showTaskDetail(){
        if(this.$Utils.isEmpty(this.data, 'setting')){
          // var dataToPass = this.data.setting
          var url = "/dynamic/view/Index=" + this.task.Index;
          this.close();
          this.$router.push(url)
        } else {
          //var dataToPass = { DataSource: 'AG_Task_Task', Code: 'Form.task.0d1c1', DataGroup: 'DataGroup.danh-sach-cong-viec.04b66' };

          var data = {
            "url": 'task-report-page',
            "RootData": 'AG_Task_Task',
            "DataSource": 'Form.task.0d1c1',
            "DataGroup": 'DataGroup.danh-sach-cong-viec.04b66',
            "ElementType": "Popup",
            "ModuleCode": 'Form.task.0d1c1',
            "parentSetting": {
              "object": this.task,
              "set": {
                "ElementType": "Popup",
                "GetFullData": "true"
              },
              "isCall": true,
              "loadScrumboard": true,
              "loadCalendar": true,
            },
            "ModuleType": "Form"
          }
          this.$hub.$emit(
            "set-modal-data",
            "Chỉnh sửa công việc",
            "100%",
            true,
            "center",
            DynamicPage,
            true,
            '', {
            Template: 'Modal',
            Module: [data]
          }, false
          );

        }
      },
      loadSetting() {
        var vm = this;
        var setFilterSetting = false;
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1,
          R1_RequestTemplate: "Setting.SearchBase",
          R1_ParentCode: 'xSetting.Project.Form',
          R1_Code: "Form.task.0d1c1"
        }
        vm.$Utils.post(request).then(data => {
          var SettingForm = vm.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting')[0];
          if (vm.$Utils.isEmpty(SettingForm, 'Description') && vm.$Lodash.isString(SettingForm.Description))
            SettingForm.Description = JSON.parse(SettingForm.Description);
          $.each(SettingForm.Description, (fKey, fData)=> {
            SettingForm[fKey] = fData;
          })
          this.SettingForm = SettingForm;
        });
      },
      close() {
        this.$hub.$emit('close-modal');
      },
      moment: function (date) {
        return Vue.moment(date);
      },
      formatDate: function (date) {
        return Vue.moment(date).format('DD/MM/YYYY  h:mm');
      },
    }
  }
</script>
<style>
  .taskDetail {
    font-size: 16px;
  }

  .btnEditTask {
    position: absolute;
    right: 36px;
    top: 27px;
    border-radius: 50%;
    height: 50px;
  }

    .btnEditTask i {
      font-size: 20px;
    }

  .showDetailScrumboard .el-dialog__header {
    color: #fff;
    font-size: 16px;
  }
</style>
