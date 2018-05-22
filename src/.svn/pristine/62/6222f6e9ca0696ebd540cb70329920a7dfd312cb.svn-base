<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="float: left;">Thông tin mục tiêu</span>
        <div style="float: right; padding: 3px 0">
          <el-button v-if="data.disabled==false && ruleForm.Permission && ruleForm.Permission !=='View' " @click="submitForm('ruleForm')" icon="fa fa-save"/>
          <el-button v-if="data.disabled==true && ruleForm.Permission && ruleForm.Permission !=='View' " @click="changeEditState" icon="el-icon-edit"/>
          <el-button v-if="data.isEditable==true && data.item.Permission ==undefined " @click="resetForm('ruleForm')" icon="fa fa-eraser"/>
          <el-button v-if="ruleForm.Permission && ruleForm.Permission ==='Manage'" @click="deleteTarget()" icon="el-icon-delete"/>
        </div>
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="$isMobileDevice?'top':'right'" label-width="150px">
          <el-form-item label="Tên:" prop="Name" >
            <el-input v-model="ruleForm.Name" :disabled="data.disabled"></el-input>
          </el-form-item>
          <el-form-item label="Hiển thị:" prop="IsPublic">
            <el-switch :disabled="data.disabled" style="display: block" v-model="ruleForm.IsPublic" active-color="#13ce66"
                       inactive-color="#ff4949" active-text="Công khai" inactive-text="Riêng tư">
            </el-switch>
          </el-form-item>
          <el-form-item label="Thời gian:" prop="startEndDate" class="demo-form-inline">
            <el-date-picker format = "dd-MM-yyyy" :disabled="data.disabled" v-model="ruleForm.ActualStartDate"
                            type="date" placeholder="Bắt đầu">
            </el-date-picker>
            <el-date-picker format = "dd-MM-yyyy" :disabled="data.disabled"
                            v-model="ruleForm.ActualFinishDate" type="date" placeholder="Kết thúc">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Loại mục tiêu:" prop="TargetType" >
            <el-radio-group v-model="ruleForm.TargetType" :disabled="!data.isEditable" @change="changeType(ruleForm.TargetType)">
              <el-radio size="mini" v-for="t in typeLst" :label="t.Id" :key="t.Id" border ng-show="data.disabled?true:(t.Id ===ruleForm.TargetType) ">{{t.Name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Mục tiêu cha:" prop="ParentId" v-if="dataCopied.targetLst.length !=undefined && ruleForm.TargetType!=='1' ">
            <el-select v-if="isShowAllTarget || !data.isEditable" v-model="ruleForm.ParentId" placeholder="--Chọn--"  :disabled="ruleForm.Id!==undefined" @change="setParent(ruleForm.ParentId)">
              <el-option v-for="t in dataCopied.targetFullLst" :key="t.Id" :label="t.Name" :value="t.Id"/>
            </el-select>
            <el-select v-else v-model="ruleForm.ParentId" placeholder="--Chọn--"  :disabled="!data.isEditable" @change="setParent(ruleForm.ParentId)">
              <el-option v-for="t in dataCopied.targetLst" :key="t.Id" :label="t.Name" :value="t.Id"/>
            </el-select>
            &nbsp;&nbsp;&nbsp;
            <el-tooltip v-if="ruleForm.Id===undefined" class="item" effect="dark" content="Bộ lọc thời gian sẽ ảnh hưởng tới số lượng mục tiêu cha hiển thị. Để hiển thị tất cả mục tiêu, hãy chọn 'Hiển thị tất cả'" placement="top">
              <i class="fa fa-lg fa-info-circle"></i>
            </el-tooltip>
            &nbsp;&nbsp;&nbsp;
            <el-checkbox  v-if="ruleForm.Id===undefined" label="Hiển thị tất cả" v-model="isShowAllTarget"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="data.departmentLst.length >0" label="Thuộc phòng ban:" prop="Value">
            <el-select v-model="ruleForm.Value" filterable placeholder="--Chọn--" :disabled="data.disabled">
              <el-option v-for="t in data.departmentLst" :key="t.GroupId" :label="t.GroupName" :value="t.GroupId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Quản lý:" prop="Owner">
            <el-select v-model="ruleForm.Owner" filterable clearable placeholder="--Chọn--" :disabled="data.disabled">
              <el-option v-for="t in data.workers" v-if="t.UserId.indexOf(';') == -1" :key="t.UserId" :label="t.Username" :value="t.UserId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Nhân sự thực hiện:" prop="Assigned">
            <el-select v-model="ruleForm.Assigned" filterable multiple placeholder="--Chọn--" :disabled="data.disabled">
              <el-option v-for="t in data.workers" :key="t.UserId" :label="t.Username" :value="t.UserId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="KPIs kế hoạch:" prop="Plan">
            <el-input v-model="ruleForm.Plan" @change="autoCal()" :disabled="data.disabled"/>
          </el-form-item>
          <el-form-item label="KPIs đạt:" prop="Done">
            <el-input v-model="ruleForm.Done" @change="autoCal()" :disabled="data.disabled"/>
          </el-form-item>
          <el-form-item label="Đơn vị tính:" prop="Unit">
            <el-input v-model="ruleForm.Unit" :disabled="data.disabled"></el-input>
          </el-form-item>
          <el-form-item label="Tính % Hoàn thành:" prop="autoCal">
            <el-switch v-model="ruleForm.autoCal" @change="autoCal()" :disabled="data.disabled"/>
          </el-form-item>
          <el-form-item label="Tỉ lệ hoành thành:" prop="Progress">
            <el-input v-model="ruleForm.Progress" :disabled="data.disabled"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <HistoryGrid v-if="!data.isEditable" :dtSource=viewHistoryModel :dtHeader="['Mục', 'Giá trị cũ', 'Giá trị mới']" />
  </div>
</template>

<script>
  import HistoryGrid from '@/components/dynamic/HistoryGrid'
  export default {
    components: {
      HistoryGrid
    },
    props:["data"],
    data() {
      var user = JSON.parse(this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser));
      var isLeader= !this.$isMantisAdmin()
        && !this.$isMantisAdmin()
        && user.GroupRoles && user.GroupRoles.Leader && user.GroupRoles.Leader.indexOf(user.Project.GroupId)>-1;
      var ruleForm = {};
      if(this.data.item.Name !=undefined){
        ruleForm = this.$Lodash.cloneDeep(this.data.item);
        if(this.data.item.Assigned != undefined && !this.$Utils.equals(this.data.item.Assigned, '')){
          ruleForm.Assigned = this.data.item.Assigned.split(';').filter(item=>{
            return !this.$Utils.equals(item, '')
          });
        }else {
          ruleForm.Assigned =[];
        }
        ruleForm.autoCal = false;
        ruleForm.oldName = this.data.item.Name+"";
        ruleForm.IsPublic=ruleForm.IsPublic==='0'?false: true;
      }else{
        ruleForm.Name='';
        ruleForm.Value='';
        ruleForm.TargetType='';
        ruleForm.IsPublic=true;
        ruleForm.ActualStartDate='';
        ruleForm.ActualFinishDate='';
        ruleForm.Assigned = [];
        ruleForm.ParentId = '';
        ruleForm.Owner = '';
        ruleForm.Plan = '';
        ruleForm.Done = '';
        ruleForm.Unit = '';
        ruleForm.Progress = 0;
        ruleForm.autoCal = true;
        ruleForm.oldName = "";
      }
      return {
        isShowAllTarget: false,
        oldObject: this.$Lodash.cloneDeep(ruleForm),
        typeLst : [{
          "Id": "1",
          "Name": "Mục tiêu công ty"
        }, {
          "Id": "2",
          "Name": "Mục tiêu phòng ban"
        }, {
          "Id": "3",
          "Name": "Mục tiêu cá nhân"
        }
        ],
        ruleForm: ruleForm,
        isLeader: isLeader,
        dataCopied: this.$Lodash.cloneDeep(this.data),
        viewHistoryModel: [],
        rules: {
          Name: [
            { required: true, message: 'Tên bắt buộc phải điền', trigger: 'blur' },
          ],
          Value: [
            { required: true, message: 'Phòng ban bắt buộc phải chọn', trigger: 'change' }
          ],
          ParentId: [
            { required: true, message: 'Mục tiêu cha bắt buộc phải chọn', trigger: 'change' }
          ]
        }
      };
    },
    watch: {
    },
    methods: {
      submitForm(formName) {
        var ctrl = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            ctrl.checkExits();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      autoCal() {
        if (this.ruleForm.autoCal == true) {
          var tmp = Math.round(Number(this.ruleForm.Done) / Number(this.ruleForm.Plan) * 100);
          this.ruleForm.Progress = isNaN(tmp)?this.ruleForm.Progress:tmp;
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      close() {
        this.$hub.$emit('close-modal');
      },
      deleteTarget() {
        var ctrl = this;
        this.$confirm('Mục tiêu sẽ bị xóa hoàn toàn. Tiếp tục?', 'Cảnh báo', {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Bỏ qua',
          type: 'warning'
        }).then(() => {
          ctrl.recursiveDeleteTarget({"Id":ctrl.data.item.Id, "Level":ctrl.data.item.Level});
          ctrl.close();
          //update tasks
          var tRequest = this.$Utils.clone(this.$singleRequest);
          tRequest.R1_RequestTemplate = "AG_Task_Task.Search";
          tRequest.R1_RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
          tRequest.R1_RequestFields = "Id;Targets;TargetsName;";
          for(var i=1; i <= eval(ctrl.data.item.Level - 5); i++){
            tRequest.R1_RequestFields += 'TargetsLevel' + i + ";";
          }
          tRequest['R1_TargetsLevel' + [ctrl.model.Level - 5]] = ctrl.model.Id;
          ctrl.$Utils.post(tRequest).then(function(response) {
            response = ctrl.$Utils.getDataWithRoot(response.R1, 'Data.TasksDS.Task');
            var updateRequest = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
            $.each(response, function(index, value){
              var fVal = {};
              fVal.Id = ctrl.$Lodash.cloneDeep(value.Id)
              fVal.Targets = "";
              fVal.TargetsName = "";
              fVal.RequestTemplate = "AG_Task_Task.Update";
              fVal.RequestDataGroup = "DataGroup.danh-sach-cong-viec.04b66";
              fVal.RequestFields = "Id;Targets;TargetsName;";
              $.each(value.Targets.split(';'), function(key, val){
                if(key < eval(ctrl.data.item.Level - 6)){
                  fVal.Targets += val + ";";
                  fVal['TargetsLevel' + [key + 1]] = val;
                  fVal.RequestFields += 'TargetsLevel' + [key + 1] + ";";
                }
              })
              $.each(value.TargetsName.split(';'), function(key, val){
                if(key < eval(ctrl.data.item.Level - 6)){
                  fVal.TargetsName += val + ";";
                }
              })
              updateRequest.TotalRequests = index + 1;
              updateRequest = ctrl.$Utils.updateParamsSingleRequest(updateRequest, fVal, index + 1)
            })
            ctrl.$Utils.post(updateRequest);
          })
        }).catch(() => {

        });
      },
      recursiveDeleteTarget(data) {
        var ctrl = this;
        if (ctrl.$Utils.isEmpty(data)) {
          var request = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
          request.R1_RequestTemplate = "Setting.Delete";
          request.R1_Id = data.Id;
          ctrl.$Utils.post(request).then(function(dData) {
            $.each(ctrl.data.targetLst, function(key,value) {
              if (data.Id == value.ParentId) {
                ctrl.recursiveDeleteTarget(value);
              }
            })
            ctrl.data.getTargets();
            ctrl.data.getObject();
          })
        };
      },
      loadHistory(id) {
        var ctrl = this;
        var request = {
          RequestAction: 'Request',
          RequestClass: 'xBase',
          TotalRequests: '1',
          R1_RequestTemplate: 'ChangedLogs',
          R1_Code: 'ChangedHistory',
          R1_SourceId: id
        }

        var arrShowField = [];
        arrShowField= ctrl.data.targetFields.filter((field)=>{
          return field.History == 'true'
        });

        ctrl.$Utils.post(request).then(function(result) {
          if (result.success && result.R1.success) {
            var logData = ctrl.$Utils.getDataWithRoot(result, 'R1.Data.DataDS.Logs');
            /**
             * tạo vòng lặp để lấy từng bản ghi
             * Dùng JSON.parse để decode dữ liệu lưu trong lịch sử thay đổi
             */
            $.each(logData, function(k,log) {
              try {
                ctrl.viewHistoryModel.push({ type: 'head', value: log });
                var logChanges = JSON.parse(log.Changes);
                $.each(logChanges, function(k, change) {
                  if (arrShowField.length > 0 && change.ColumnName !== 'Assigned' && change.ColumnName !== 'Id') {
                    if (change.ColumnName === "ActualStartDate" || change.ColumnName === "ActualFinishDate" || change.ColumnName ==="Created") {
                      var format = "DD/MM/YYYY";
                      var date = ctrl.$Utils.stringToDate(change.OldDisplayValue);
                      change.OldDisplayValue = log.Version === '1'?"":ctrl.$Utils.formatDateTime(date, format);
                      date = ctrl.$Utils.stringToDate(change.NewDisplayValue);
                      change.NewDisplayValue = ctrl.$Utils.formatDateTime(date, format);
                    }
                    if ((change.ColumnName === "AssignedName" && !change.OldDisplayValue && change.NewDisplayValue === "")==false) {
                      arrShowField.forEach(function(field) {
                        var object = { type: 'body', value: change };
                        var checkField = field.DynamicText!=undefined && field.DynamicText!='' ? field.DynamicText : field.Name;
                        if (change.ColumnName == checkField) {
                          if (change.ColumnName === 'TargetType') {
                            ctrl.typeLst.filter((item)=>{
                              if(item.Id === change.OldDisplayValue)
                                change.OldDisplayValue= log.Version === '1'?"":item.Name;
                              if(item.Id === change.NewDisplayValue)
                                change.NewDisplayValue= item.Name;
                            });
                          }else if (change.ColumnName === 'IsPublic') {
                            change.OldDisplayValue=log.Version === '1'?"":(change.OldDisplayValue==='0'||change.OldDisplayValue==false?'Riêng tư':'Công khai');
                            change.NewDisplayValue=change.NewDisplayValue==='0'||change.OldDisplayValue==false?'Riêng tư':'Công khai';
                          }
                          ctrl.viewHistoryModel.push(object);

                        }
                      })
                    }
                  }
                })
              } catch (ex) {
                console.log(ex);
              }
            });
          }
        });
      },
      checkExits() {
        var ctrl = this;
        var request = ctrl.$Lodash.cloneDeep(this.$singleRequest);
        request.R1_RequestTemplate = 'xDynamicData_Setting.Search';
        request.R1_RequestFields = 'Name;ParentId;';
        request.R1_Name = ctrl.ruleForm.Name;
        request.R1_RequestDataGroup = 'DataGroup.muc-tieu.091fb';
        request.R1_ParentId = ctrl.ruleForm.Parent ? ctrl.ruleForm.Parent.Id : ctrl.ruleForm.ParentId;
        ctrl.$Utils.post(request).then(function (data) {
          var listExitsTar = ctrl.$Utils.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          listExitsTar = listExitsTar.filter(function (el) {
            return el.Name != ctrl.ruleForm.oldName;
          });
          if (listExitsTar.length != 0) {
            ctrl.$message.error('Tên mục tiêu đã có');
          }
          else {
            ctrl.saveOrUpdate();
          }
        });
      },
      saveOrUpdate() {
        var ctrl = this;

        var request = ctrl.$Lodash.cloneDeep(this.$singleRequest);
        if (!ctrl.ruleForm.Id) {
          request.R1_RequestTemplate = 'xDynamicData_Setting.Insert';
          request.R1_ReferenceId = ctrl.ruleForm.ParentId ? ctrl.ruleForm.ParentId : ctrl.data.rootId;
          request.R1_NestedSetType = 'InsertLastChildNode';
        }
        else {
          request.R1_RequestTemplate = 'xDynamicData_Setting.Update';
          request.R1_Id = ctrl.ruleForm.Id;
        }
        request.R1_RequestFields = 'Plan;Done;Progress;Unit;Assigned;AssignedName;Owner;OwnerName;TargetType;Id;Index;Code;Name;Value;Description;LeftIndex;ParentId;Level;Value;RightIndex;Created;CreatedBy;Modified;IsPublic;ActualStartDate;ActualFinishDate;ValueName';
        request.R1_RequestDataGroup= 'DataGroup.muc-tieu.091fb';
        request.R1_Name = ctrl.ruleForm.Name;
        request.R1_Plan = ctrl.ruleForm.Plan;
        request.R1_Done = ctrl.ruleForm.Done;
        request.R1_Owner = ctrl.ruleForm.Owner;
        request.R1_TargetType = ctrl.ruleForm.TargetType;
        if(!isNaN(parseFloat(ctrl.ruleForm.Progress+''))){
          request.R1_Progress = ctrl.ruleForm.Progress;
        }else{
          delete ctrl.ruleForm.Progress;
        }
        request.R1_Unit = ctrl.ruleForm.Unit;
        request.R1_IsPublic = ctrl.ruleForm.IsPublic == true?1:0;
        request.R1_Value = ctrl.ruleForm.Value;
        $.each(ctrl.departmentLst, (k, val)=>{
          var res = val.GroupId !== ctrl.ruleForm.Value;
          if(!res){
            request.R1_ValueName = val.GroupName;
          }
          return res;
        })

        request.R1_Assigned = "";
        request.R1_AssignedName = "";
        $.each(ctrl.ruleForm.Assigned, function (k,Id) {
          request.R1_Assigned += Id + ";";
          ctrl.data.workers.filter(function (user) {
            if (user.UserId && user.UserId === Id) {
              request.R1_AssignedName += user.Username + ',';
            }
          });
        });
        ctrl.data.workers.filter(function (user) {
          if(user.UserId && user.UserId === ctrl.ruleForm.Owner){
            request.R1_OwnerName = user.Username;
          }
        });
        if(ctrl.$Utils.isEmpty(ctrl.ruleForm.ActualStartDate))
          request.R1_ActualStartDate = ctrl.$Utils.formatDateTime(ctrl.ruleForm.ActualStartDate);
        if(ctrl.$Utils.isEmpty(ctrl.ruleForm.ActualFinishDate))
          request.R1_ActualFinishDate =  ctrl.$Utils.formatDateTime(ctrl.ruleForm.ActualFinishDate);
        ctrl.$Utils.post(request).then(function (data) {
          ctrl.objectReturn = ctrl.$Lodash.cloneDeep(ctrl.ruleForm);
          ctrl.objectReturn.Id = data.R1.Data;
          if (ctrl.$Utils.isEmpty(ctrl.objectReturn, 'autoCals'))
            delete ctrl.objectReturn.autoCals;
          if (ctrl.$Utils.isEmpty(ctrl.objectReturn, 'oldName'))
            delete ctrl.objectReturn.oldName;
          ctrl.data.item = ctrl.$Lodash.cloneDeep(ctrl.objectReturn);
          ctrl.objectReturn.AssignedName = request.R1_AssignedName;
          ctrl.objectReturn.OwnerName = request.R1_OwnerName;
          ctrl.objectReturn.Assigned = request.R1_Assigned;
          ctrl.objectReturn.Value = request.R1_Value;
          var arrChanged = ctrl.compareChange(ctrl.objectReturn, ctrl.oldObject);
          if (ctrl.$Utils.isEmpty(arrChanged) && arrChanged.length>0) {
            if (request.R1_RequestTemplate, 'xDynamicData_Setting.Insert') {
              ctrl.createHistoryLogs(arrChanged);
            } else {
              arrChanged = arrChanged.filter(function(ele) {
                return ctrl.$Utils.isEmpty(ele.OldDisplayValue);
              })
              if (ctrl.$Utils.equals(arrChanged, []) == false) {
                ctrl.createHistoryLogs(arrChanged);
              }
            }
          }
          var target = ctrl.$Lodash.cloneDeep(ctrl.ruleForm);
          target.Id = data.R1.Data;
          ctrl.saveOrUpdatePermissions(ctrl.ruleForm.oldName!=="", target);
          ctrl.close();
        });
      },
      compareChange(objReturn, objOld) {
        var ctrl = this;
        var arrChanged = [];
        ctrl.objTemp = ctrl.$Lodash.cloneDeep(ctrl.oldObject);
        $.each(objReturn, function(key, val) {
          if (ctrl.$Utils.isEmpty(val)) {
            var valueReturn = val;
            var caption = "";
            var field = {};
            $.each(ctrl.data.targetFields, function(k, values) {
              if (values.Name === key && values.History == "true") {
                caption = values.Caption;
                field = values;
              }
            });
            var obj = {};

            $.each(objOld, function(key1, value) {
              if (key == key1 && ctrl.$Utils.equals(value, valueReturn) == false) {
                obj[key1] = value;
              }
            });
            var changedObject = {
              ColumnCaption: caption,
              ColumnName: key,
              OldDisplayValue: obj[key],
              OldValue: obj[key],
              NewDisplayValue: objReturn[key] ? objReturn[key] : valueReturn,
              NewValue: valueReturn
            };
            if (ctrl.$Utils.isEmpty(field)) {
              switch (field.FieldColumnType) {
                case 'DateTime':
                  if (ctrl.$Utils.stringToDate(val).getTime() == ctrl.$Utils.stringToDate(changedObject.OldValue).getTime()) {
                    changedObject = undefined;
                  }
                  break;
                case 'Double':
                  if (!ctrl.$Utils.isEmpty(ctrl.objTemp[key]) && ctrl.$Utils.isEmpty(objReturn[key])) {
                    changedObject.OldDisplayValue = 0;
                    changedObject.OldValue = 0;
                  }
                  break;
                case 'Integer':
                  if (!ctrl.$Utils.isEmpty(ctrl.objTemp[key]) && ctrl.$Utils.isEmpty(objReturn[key])) {
                    changedObject.OldDisplayValue = 0;
                    changedObject.OldValue = 0;
                  }
                  break;
              }
            }

            if (changedObject && ctrl.$Utils.isEmpty(caption) && caption != "") {
              arrChanged.push(changedObject);
            }
          }
        });
        return arrChanged;
      },
      createHistoryLogs(arrChanged) {
        var ctrl = this;
        var countHistory = ctrl.$Utils.updateParamsSingleRequest(ctrl.$Lodash.cloneDeep(ctrl.$singleRequest), {
          RequestTemplate: 'ChangedLogs.Count',
          SourceId: ctrl.objectReturn.Id,
          Code: 'ChangedHistory'
        });
        // ctrl.$Utils.showLoading('start');
        ctrl.$Utils.post(countHistory).then(function(result) {
          if (ctrl.$Utils.isEmpty(result, 'R1.Data')) {
            var insertRequest = ctrl.$Utils.updateParamsSingleRequest(countHistory, {
              RequestTemplate: 'ChangedLogs.Insert',
              Version: parseInt(result.R1.Data) + 1,
              Changes: JSON.stringify(arrChanged),
              CreatedByName: ctrl.$Utils.getUserInfo('Username')
            });
            ctrl.$Utils.post(insertRequest).then(function(insertResult) {
              // ctrl.$Utils.showLoading('stop');
            });
          }
        });
      },
      saveOrUpdatePermissions(isUpdate, target) {
        var ctrl = this;
        // ctrl.$Utils.showLoading('start');
        var req = ctrl.$Lodash.cloneDeep(ctrl.$singleRequest);
        if (isUpdate == true) {
          var paramsSearchLinked = {
            RequestAction: 'SearchLinked',
            RequestClass: 'Addition',
            ConditionFields: 'Parent;',
            StaticFields: 'Code;Child;Parent;Name;Created;Description',
            OrderFields: 'Created DESC',
            Parent: target.Id
          };
          ctrl.$Utils.post(paramsSearchLinked).then(function(result) {
            if (result.TotalCount > 0) {
              var arrLink = result.TotalCount == 1 ? [result.Data.DataDS.Linked] : result.Data.DataDS.Linked;
              var removeLinks = {
                RequestClass: 'xBase',
                RequestAction: 'Request',
                TotalRequests: arrLink.length,
                RequestTemplate: 'Permission.Remove'
              };
              $.each(arrLink, function(link, key) {
                removeLinks['R' + (key + 1) + '_Id'] = link.Id;
              });
              ctrl.savePermission(target, removeLinks);
            }
          });
        }else {
          ctrl.savePermission(target);
        }
      },
      savePermission(target, removeLinks) {
        var ctrl = this;
        if (target.IsPublic == true) {
          ctrl.$Utils.linkToRoleEveryone([{
            Id: target.Id
            , Caption: target.Name
          }]);
          //ntn load target again
          ctrl.data.getTargets();
          ctrl.data.getObject();

        }else{
          var permissons = [];
          var leaders = [];
          var groups = [];
          groups.push(target.Value);
          if (groups && groups.length>0) {
            var req = {};
            groups.filter(function (gro, key) {
              req['R' + ctrl.ix + '_RequestTemplate'] = 'OrgnizationList';
              req['R' + ctrl.ix + '_GroupName'] = 'Leader';
              req['R' + ctrl.ix + '_GroupParent'] = gro.GroupId;
              req['R' + ctrl.ix + '_RequestDataType'] = 'json';
              req['R' + ctrl.ix + '_GroupType'] = '2';
              ctrl.ix++;
            });
            req.TotalRequests = ctrl.ix-1;
            req.RequestClass = 'xBase';
            req.RequestAction = 'Request';
            ctrl.$Utils.post(req).then(function (data1) {
              for (var k = 1; k < ctrl.ix; k++) {
                var ele = ctrl.$Utils.getDataWithRoot(data1, 'R' + k + '.Data.UserDS.Group');
                if (ele[0] !=undefined) {
                  if ( ele[0].GroupName==='Leader') {
                    leaders = leaders.concat(ele);
                  }
                }
              }
              var strLeaders = '';
              leaders.filter(function (ele, key) {
                if(ele.GroupParent == groups[0].GroupId){
                  strLeaders += ele.GroupId + ';';
                  if (target.TargetType == '2' || target.TargetType == '1') {
                    var p = {
                      Parrent: target.Id
                      , Code: 'Edit'
                      , Name: target.Name + ' - Edit'
                      , Child: ele.GroupId
                      , ChildTable: 'tblGroup'
                    };
                    permissons.push(p);
                  }else if (target.TargetType == '3') {
                    var p1 = {
                      Parrent: target.Id
                      , Code: 'Manage'
                      , Name: target.Name + ' - Manage'
                      , Child: ele.GroupId
                      , ChildTable: 'tblGroup'
                    }
                    permissons.push(p1);
                  }
                }
              });
              if (target.Owner  && strLeaders.indexOf(target.Owner) ==-1) {
                var p = {
                  Parrent: target.Id
                  , Code: 'Edit'
                  , Name: target.Name + ' - Edit'
                  , Child: target.Owner
                  , ChildTable: 'tblUser'
                }
                permissons.push(p);
              }
              if (target.Assigned) {
                target.Assigned.filter(function (user, key) {
                  if (user !== '' && strLeaders.indexOf(user) ==-1) {
                    var p = {
                      Parrent: target.Id
                      , Code: 'Edit'
                      , Name: target.Name + ' - Edit'
                      , Child: user
                      , ChildTable: 'tblUser'
                    }
                    permissons.push(p);
                  }
                });
              }
              //
              //
              var p10 = {
                Parrent: target.Id
                , Code: 'Manage'
                , Name: target.Name + ' - Manage'
                , Child: ctrl.$administrator
                , ChildTable: 'tblGroup'
              }
              permissons.push(p10);
              var p11 = {
                Parrent: target.Id
                , Code: 'Manage'
                , Name: target.Name + ' - Manage'
                , Child: ctrl.$supervisor
                , ChildTable: 'tblGroup'
              }
              permissons.push(p11);
              //
              //
              var persReadyToInsert = {};
              var index = 1;
              permissons.filter(function (p,k) {
                persReadyToInsert['R' + index + '_RequestClass'] = 'xBase';
                persReadyToInsert['R' + index + '_RequestAction'] = 'LinkUserToObject';
                persReadyToInsert['R' + index + '_ParentTable'] = 'xObject';
                persReadyToInsert['R' + index + '_RequestTemplate'] = 'Permission.Insert';
                persReadyToInsert['R' + index + '_Parent'] = p.Parrent;
                persReadyToInsert['R' + index + '_Child'] = p.Child;
                persReadyToInsert['R' + index + '_Code'] = p.Code;
                persReadyToInsert['R' + index + '_Name'] = p.Name;
                persReadyToInsert['R' + index + '_ChildTable'] = p.ChildTable;
                index++;
              });
              persReadyToInsert.TotalRequests = permissons.length;
              persReadyToInsert.RequestClass = 'xBase';
              persReadyToInsert.RequestAction = 'Request';
              if(removeLinks == undefined){
                ctrl.$Utils.post(persReadyToInsert).then(function (data3) {
                  // ntn load target again
                  ctrl.data.getObject();
                  ctrl.data.getTargets();
                });
              }else{
                ctrl.$Utils.post(removeLinks).then(function (data2) {
                  ctrl.$Utils.post(persReadyToInsert).then(function (data3) {
                    // ntn load target again
                    ctrl.data.getTargets();
                    ctrl.data.getObject();
                  });
                });

              }
            });
          }
        }
      },
      changeEditState(){
        this.data.disabled =!this.data.disabled;
      },
      changeType(type) {
        this.dataCopied.targetLst = this.data.targetLst.filter(function(ele) {
          return ele!=undefined && ((eval(type) -1)  + "" === ele.TargetType);
        });
        this.$set(this.dataCopied, 'targetFullLst', this.data.targetSavedLst.filter(function(ele) {
          return ele!=undefined && ((eval(type) -1)  + "" === ele.TargetType);
        }));
      },
      setParent(parent) {
        var ctrl = this;
        if (ctrl.ruleForm.TargetType ==3) {
          // ctrl.model.Value = '';
          $.each(ctrl.departmentLst, function (k, group) {
            if (ctrl.$Utils.isEmpty(parent) && group.GroupId == parent) {
              ctrl.ruleForm.Value= group;
            }
          })
        }
      }
    },
    created() {
      var ctrl = this;
      if(ctrl.ruleForm.Id){
        ctrl.loadHistory(ctrl.ruleForm.Id);
        ctrl.changeType(ctrl.ruleForm.TargetType);
        if(ctrl.ruleForm.IsPublic ==undefined){
          ctrl.ruleForm.IsPublic = true;
        }
        $.each(ctrl.data.targetLst,(k, v)=>{
          if(ctrl.ruleForm.Id === v.Id){
            ctrl.ruleForm.Permission = v.Permission;
            return false;
          }
        });
      }else {
        ctrl.ruleForm.Permission = 'Edit';
        if(ctrl.isLeader){
          ctrl.ruleForm.TargetType = ctrl.typeLst[2].Id;
          ctrl.changeType(ctrl.typeLst[2].Id);
        }else{
          ctrl.ruleForm.TargetType = ctrl.typeLst[0].Id;
          ctrl.changeType(ctrl.typeLst[0].Id);
        }
        ctrl.ruleForm.IsPublic = true;
      }
      var user = JSON.parse(ctrl.$getItemLocalStorage(ctrl.$localStorageConstant.LoggedOnUser));
      if (user.LoginName !== 'superadmin') {
        ctrl.data.workers = ctrl.data.workers.filter((el)=> {
          return (el.LoginName && el.LoginName.indexOf('superadmin') === -1);
        });
      }

    }
  }
</script>
<style lang="scss" scoped>
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    .el-input, .el-select, .el-radio {
      width: 100%;
    }
    .el-radio {
      margin-left: 0px !important;
    }
  }
</style>
