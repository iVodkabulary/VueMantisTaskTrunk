<template>
  <div>
    <el-form name="eventForm" label-width="120px">
      <el-form-item label="Tên công việc">
        <el-input name="title" v-model="calendarEvent.summary"/>
      </el-form-item>
      <el-form-item label="Ngày bắt đầu">
        <el-date-picker v-model="calendarEvent.date" type="datetimerange" format="dd/MM/yyyy HH:mm"
                        range-separator="-"
                        start-placeholder="Bắt đầu" end-placeholder="Kết thúc"></el-date-picker>
      </el-form-item>
      <el-form-item label="Địa điểm">
        <el-input v-model="calendarEvent.location"/>
      </el-form-item>
      <el-form-item label="Nhắc nhở">
        <div class="row" v-for="(item,index) in calendarEvent.reminders.overrides">
          <el-select v-model="item.method">
            <el-option v-for="opt in notificationstype" :value="opt.value" :label="opt.name"/>
          </el-select>
          <el-input-number v-model="item.minutes" size="small" controls-position="right" :min="1"/>
          <el-button @click.prevent="removeNoti(index)" type="danger">Xóa</el-button>
        </div>
        <div class="row">
          <el-button @click="addNoti()">Thêm</el-button>
        </div>
      </el-form-item>

      <el-form-item label="Ghi chú">
        <el-input type="textarea" v-model="calendarEvent.description" :rows="4"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveEvent()">Lưu</el-button>
        <el-button type="danger" v-if="data.type === 'edit'" @click="removeEvent()">Xóa</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import googleService from "@/services/googleService.js";

  export default {
    props: ['data'],
    name: "google-calendar-dialog",
    data() {
      return {
        calendarEvent: {},
        notificationstype: [
          {name: 'Email', value: 'email'},
          {name: 'Thông báo', value: 'popup'},
        ]
      }
    },
    methods: {
      addNoti() {
        this.calendarEvent.reminders.overrides.push(
          {method: 'popup', minutes: 1}
        );
      },
      removeNoti(index) {
        this.calendarEvent.reminders.overrides.splice(index, 1);
      },
      saveEvent() {
        var vm = this;
        var event = this.$Lodash.cloneDeep(this.data);
        event.summary = vm.calendarEvent.summary;
        event.location = vm.calendarEvent.location;
        event.description = vm.calendarEvent.description;

        if (this.$Utils.isEmpty(vm.calendarEvent.date[0])) {
          event.start = {
            'dateTime': this.$Utils.formatDateTime(vm.calendarEvent.date[0], 'YYYY-MM-DDTHH:mm:ss+07:00'),
          };
        } else {
          this.$Utils.showMessage('error', "Ngày bắt đầu bắt buộc phải chọn");
        }
        if (this.$Utils.isEmpty(vm.calendarEvent.date[1])) {
          event.end = {
            'dateTime': this.$Utils.formatDateTime(vm.calendarEvent.date[1], 'YYYY-MM-DDTHH:mm:ss+07:00'),//+ "+07:00",
          };
        } else {
          this.$Utils.showMessage('error', "Ngày kết thúc bắt buộc phải chọn");
        }
        if (vm.calendarEvent.reminders !== "" && vm.calendarEvent.reminders.overrides.length > 0) {
          event.reminders = this.$Lodash.cloneDeep(vm.calendarEvent.reminders)
        } else {
          event.reminders = {
            'useDefault': false
          };
          if (this.$Utils.isEmpty(vm.calendarEvent.taskId)) {
            event.extendedProperties = {
              'private': {
                'xTaskId': vm.calendarEvent.taskId
              }
            }
          }
        }

        var dates = {
          start: this.$moment.utc(vm.calendarEvent.date[0]),
          end: this.$moment.utc(vm.calendarEvent.date[1])
        };
        if (vm.data.type === 'add') {
          //console.log(event);
          googleService.insertEvent(event, 'primary').then((data) => {
            var response = {
              type: vm.data.type,
              calendarEvent: this.$Lodash.extend({}, vm.calendarEvent, dates),
              success: false,
            };
            if (data.status === 'confirmed') {
              response.success = true;
              response.calendarEvent.id = data.id;
              this.$Utils.showMessage('success', 'Thêm sự kiện thành công');
            } else {
              response = {
                type: vm.data.type,
                calendarEvent: '',
                success: false,
              };
              this.$Utils.showMessage('error', 'Thêm sự kiện không thành công');
            }
            vm.closeDialog(response);
          }, function (error) {
            console.log(error);
            this.$Utils.showMessage('error', 'Cập nhật sự kiện không thành công');
          });
        }
        if (vm.data.type === "edit") {
          event.id = vm.calendarEvent.id;
          //console.log(event);
          googleService.updateEvent(event).then((data) => {
            var response = {};
            if (data.status === 'confirmed') {
              response = {
                type: vm.data.type,
                calendarEvent: vm.calendarEvent,
                success: true,
              };
              this.$Utils.showMessage('success', 'Cập nhật sự kiện thành công');
            } else {
              response = {
                type: vm.data.type,
                calendarEvent: '',
                success: false,
              };
              this.$Utils.showMessage('error', 'Cập nhật sự kiện không thành công');
            }
            vm.closeDialog();
          },
          function (error) {
            console.log(error);
            this.$Utils.showMessage('error', 'Cập nhật sự kiện không thành công');
          });
        }
      },
      removeEvent() {
        var vm = this;
        if (this.$Utils.isEmpty(vm.calendarEvent.id)) {
          googleService.deleteEvent(vm.calendarEvent.id).then( (data) => {
            var response = {
              type: 'remove',
              calendarEvent: vm.calendarEvent,
              success: true,
            };
            this.$Utils.showMessage('success', 'Xóa sự kiện thành công');
            this.closeDialog();
          },
          function (error) {
            console.log(error);
            this.$Utils.showMessage('error', 'Xóa sự kiện không thành công');
          })
        }
      },
      closeDialog() {
        this.$hub.$emit("close-modal");
        this.$hub.$emit('refreshGoogleCalendar');
      }
    },
    created() {
      var vm = this;
      // Figure out the title
      switch (vm.data.type) {
        case 'add':
          vm.dialogTitle = 'Thêm mới';
          break;

        case 'edit':
          vm.dialogTitle = 'Chỉnh sửa';
          break;

        default:
          break;
      }
      // Edit
      // Clone the calendarEvent object before doing anything
      // to make sure we are not going to brake FullCalendar

      vm.calendarEvent = vm.$Lodash.cloneDeep(vm.data.calendarEvent);
      // Convert moment.js dates to javascript date object
      vm.calendarEvent.date = [vm.calendarEvent.start.dateTime, vm.calendarEvent.end.dateTime];

      if(!vm.calendarEvent.reminders.overrides){
        vm.$set(vm.calendarEvent.reminders, 'overrides', []);
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-range-editor {
    max-width: 300px;
  }

  .row {
    padding: 5px 0 0 0;
    margin: 0;
  }
</style>
