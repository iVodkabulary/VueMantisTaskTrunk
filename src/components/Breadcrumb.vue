<template>
  <el-row v-show="isShowBreadScrum">
    <!--
    <el-col :span="6" class="d-none d-sm-block">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" v-for="(item, index) in list" :key="index">
          <span class="active" v-if="isLast(index)">{{ showName(item) }}</span>
          <router-link :to="item" v-else>{{ showName(item) }}</router-link>
        </li>
      </ol>
    </el-col>
    -->
    <el-col :span="24" v-if="!isMobile" class="breadcrumbEq d-none d-sm-block">
      <el-row type="flex" justify="end">
        <div v-show="isShowViewOption" class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
          <router-link to="/timeline" class=""><i class="fa fa-list-alt"> </i> <span > Timeline</span>
          </router-link>
          <router-link
            :to="{ path: '/dynamic/view-all-task-page', query: {PlanStartDateStartValue: dateValString[0], PlanStartDateEndValue: dateValString[1] }}"
            class=""><i class="fa fa-table"></i><span > List</span></router-link>
          <router-link to="/scrumboard" class=""><i class="fa fa-trello"></i><span >  Scrumboard</span>
          </router-link>
        </div>
        <div class="rightaligndiv col-xs-9 col-sm-9 col-md-9 col-lg-9">
          <el-date-picker
            size="mini"
            v-model="dateVal"
            type="daterange"
            :clearable="false"
            start-placeholder="Bắt đầu"
            end-placeholder="Kết thúc"
            format="dd/MM/yyyy"
            :picker-options="dateOptions">
          </el-date-picker>
          <!--
          <el-select v-model="selectedProjects" placeholder="Lọc dự án" size="mini" multiple collapse-tags>
            <el-option
              v-for="w in projects"
              :key="w.Id"
              :label="w.Name"
              :value="w.Id">
            </el-option>
          </el-select>
          -->
          <el-select v-if="this.$router.currentRoute.path != '/my-view-page'" v-model="selectedWorkers" placeholder="Lọc nhân sự" size="mini" multiple collapse-tags>
            <el-option
              v-for="w in workers"
              :key="w.UserId"
              :label="w.Username"
              :value="w.UserId">
            </el-option>
          </el-select>
        </div>
      </el-row>
    </el-col>

    <el-col v-else class="breadcrumbEq d-md-none d-lg-none d-xl-none">
      <el-row >

        <el-col :span="2" v-if="isShowViewOption" class="tac" style="margin-top: 3px;">
          <el-dropdown   trigger="click" size="mini">
            <span class="el-dropdown-link">
              <i class="fa fa-list-alt" v-if="$route.name === 'TimeLine'"></i>
              <i class="fa fa-trello" v-if="$route.name === 'scrumboard'"></i>
              <i class="fa fa-table" v-if="$route.name === 'DynamicMain2'"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
               <router-link  to="/timeline" class=""><i class="fa fa-list-alt"> </i> <span > Timeline</span>
          </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link
            :to="{ path: '/dynamic/view-all-task-page', query: {PlanStartDateStartValue: dateValString[0], PlanStartDateEndValue: dateValString[1] }}"
            class=""><i class="fa fa-table"></i><span > List</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/scrumboard" class=""><i class="fa fa-trello"></i><span >  Scrumboard</span>
          </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <!-- <router-link style="padding-right: 10px;" to="/timeline" class=""><i class="fa fa-list-alt"> </i> <span > Timeline</span>
          </router-link>
          <router-link style="padding-right: 10px;"
            :to="{ path: '/dynamic/view-all-task-page', query: {PlanStartDateStartValue: dateValString[0], PlanStartDateEndValue: dateValString[1] }}"
            class=""><i class="fa fa-table"></i><span > List</span></router-link>
          <router-link style="padding-right: 10px;" to="/scrumboard" class=""><i class="fa fa-trello"></i><span >  Scrumboard</span>
          </router-link> -->

        </el-col>

           <el-col v-if="this.$router.currentRoute.path != '/my-view-page'" :span="11"  >
             <el-select v-model="selectedWorkers" placeholder="Nhân sự" size="mini" multiple collapse-tags>
            <el-option
              v-for="w in workers"
              :key="w.UserId"
              :label="w.Username"
              :value="w.UserId">
            </el-option>
          </el-select>
           </el-col>

           <el-col :span="11"  >
             <el-date-picker popper-class="MobileDateRange"
            size="mini"
            v-model="dateVal"
            type="daterange"
            start-placeholder="Bắt đầu"
            end-placeholder="Kết thúc"
            format="dd/MM/yyyy"
            :picker-options="dateOptions">
          </el-date-picker>
           </el-col>

      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import Vue from "vue";
Vue.use(require("vue-moment"));

export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    dateValString() {
      if (this.dateVal == null) return this.$rootScope.dateFilter;
      return [
        Vue.moment(this.dateVal[0]).format('YYYY-MM-DD') + 'T00:00:00',
        Vue.moment(this.dateVal[1]).format('YYYY-MM-DD') + 'T23:59:59'
        /* Vue.moment(this.dateVal[0]).format(this.requestDatetimeFormat),
        Vue.moment(this.dateVal[1]).format(this.requestDatetimeFormat) */
      ];
      //else return
    }
  },
  watch: {
    "$route.fullPath": function(fullPath) {
      this.isShowBreadScrum =
        this.showBreadScrumList.filter(item => {
          return this.$route.fullPath.indexOf(item) > -1;
        }).length > 0;
      this.isShowViewOption =
        fullPath.indexOf("dynamic/view-all-task-page") > -1 ||
        fullPath.indexOf("scrumboard") > -1 ||
        fullPath.indexOf("timeline") > -1;
    },
    dateVal(val, old) {
      var start, end, type;
      if (val !== null) {
        start = val[0];
        end = val[1];
      } else {
        start = new Date();
        end = new Date();
      }

      start = new Date(
        start.getFullYear() +
          "/" +
          (start.getMonth() + 1) +
          "/" +
          start.getDate() +
          " 00:00:00"
      );
      end = new Date(
        end.getFullYear() +
          "/" +
          (end.getMonth() + 1) +
          "/" +
          end.getDate() +
          " 23:59:59"
      );
      this.$set(this.$rootScope, "dateFilter", [start, end, this.type]);
      //this.$store.commit("setFilter", [start, end, this.type]);
      this.$hub.$emit("datePicked", [start, end, this.type]);
      this.type = "";
    },
    selectedWorkers(val, old) {
      this.$hub.$emit("workerPicked", val);
      this.$set(this.$rootScope, 'selectedWorkerId', val);
    },
    selectedProjects(val, old) {
      this.$hub.$emit("projectPicked", val);
      this.$set(this.$rootScope, 'selectedProjectId', val);
    }
  },
  data() {
    var vm = this;
    var firstDayOfWeekCfg = this.$getItemLocalStorage('firstDayOfWeekCfg')? parseInt(JSON.parse(this.$getItemLocalStorage('firstDayOfWeekCfg')).Value): 1;
    return {
      projects: [],
      selectedProjects:[],
      firstDayOfWeekCfg: firstDayOfWeekCfg,
      showBreadScrumList: [
        "/daily-report",
        "/dynamic/view-all-task-page",
        // '/task-block-view',
        "/my-view-page",
        "/timeline",
        "/scrumboard",
        "/dynamic/view-all-task-page"
      ],
      isMobile: false,
      isShowBreadScrum: false,
      isShowViewOption: true,
      type: "thisweek",
      dateFilter: "",
      selectedWorkers: [],
      workers: [],
      requestDatetimeFormat: "YYYY-MM-DDThh:mm:ss",
      dateOptions: {
        shortcuts: [
          {
            text: "Hôm trước",
            onClick(picker) {
              var yesterday = Vue.moment().subtract(1, "days")._d;
              picker.$emit("pick", [yesterday, yesterday]);
              vm.type = "yesterday";
            }
          },
          {
            text: "Hôm nay",
            onClick(picker) {
              var now = new Date();
              picker.$emit("pick", [now, now]);
              vm.type = "today";
            }
          },
          {
            text: "Hôm sau",
            onClick(picker) {
              var tomorrow = Vue.moment().add(1, "days")._d;
              picker.$emit("pick", [tomorrow, tomorrow]);
              vm.type = "tomorrow";
            }
          },
          {
            text: "Tuần trước",
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() - 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              picker.$emit("pick", [monday, sunday]);
              vm.type = "lastweek";
            }
          },
          {
            text: "Tuần này",
            onClick(picker) {
              var dateVal = new Date();
              var monday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              picker.$emit("pick", [monday, sunday]);
              vm.type = "thisweek";
            }
          },
          {
            text: "Tuần sau",
            onClick(picker) {
              var dateVal = new Date();
              dateVal.setTime(dateVal.getTime() + 3600 * 1000 * 24 * 7);
              var monday = Vue.moment(dateVal)
                .isoWeekday(1)
                .startOf("isoweek")._d;
              var sunday = Vue.moment(dateVal)
                .isoWeekday(firstDayOfWeekCfg)
                .endOf("isoweek")._d;
              picker.$emit("pick", [monday, sunday]);
              vm.type = "nextweek";
            }
          },
          {
            text: "Tháng trước",
            onClick(picker) {
              var dateVal = new Date();
              var start = new Vue.moment().subtract(1, "months").date(1)._d;
              var end = Vue.moment(start).endOf("month")._d;
              picker.$emit("pick", [start, end]);
              vm.type = "lastmonth";
            }
          },
          {
            text: "Tháng này",
            onClick(picker) {
              var dateVal = new Date();
              var start = Vue.moment([
                dateVal.getFullYear(),
                dateVal.getMonth()
              ])._d;
              var end = Vue.moment(start).endOf("month")._d;
              picker.$emit("pick", [start, end]);
              vm.type = "thismonth";
            }
          },
          {
            text: "Tháng sau",
            onClick(picker) {
              var dateVal = new Date();
              var start = new Vue.moment().add(1, "months").date(1)._d;
              var end = Vue.moment(start).endOf("month")._d;
              picker.$emit("pick", [start, end]);
              vm.type = "nextmonth";
            }
          }
        ],
        firstDayOfWeek: firstDayOfWeekCfg,
        onPick(data) {}
      },

      dateVal: ""
    };
  },
  methods: {
    isLast(index) {
      return index === this.list.length - 1;
    },
    showName(item) {
      if (item.meta && item.meta.label) {
        item = item.meta && item.meta.label;
      }
      if (item.name) {
        item = item.name;
      }
      return item;
    },
    datePicked() {},
    selectedRange(data) {},
    getProject(filter) {
       var request = this.$Lodash.cloneDeep(this.$singleRequest);
       request.R1_RequestTemplate = "xDocument_Document.Search";
       request.R1_RequestDataGroup = "DataGroup.quan-ly-du-an.053gf";
       request.R1_RequestFields = "Id;Tool;TypeName;Name;ManagerName;StatusName;StateName;PermitName;Progress;DepartmentName;PlanManHour;ActualManHour;FinishDate;PriorityName;ProductName;StartDate;Version;Code;CreatedBy;Department;Id;Manager;ModifiedBy;Priority;PriorityDescription;PriorityId;State;Status;Type;Permit;Describe;Active;ActiveName;ProjectCode;Department;DepartmentName;Manager;ManagerName;Worker;WorkerName";
       request.R1_Code = "Project";
       this.$Utils.postCheckResult(request).then((data) => {
         this.projects = this.$Utils.getDataWithRoot(data.R1, 'Data.DocumentDS.Document');
         if(filter){
           this.projects =  this.projects.filter(function (item) {
             return item.Name.toLocaleLowerCase().indexOf(filter.toLowerCase()) >-1;
           })
         }
       });
     }
  },
  destroyed() {
    this.$hub.$off("update-default-date-range");
  },
  mounted() {

    this.$rootScope.application = JSON.parse(
                    this.$getItemLocalStorage(
                      this.$localStorageConstant.Application
                    )
                  );
    var start = Vue.moment().isoWeekday(this.firstDayOfWeekCfg).startOf("isoweek")._d;
    var end = Vue.moment().isoWeekday(this.firstDayOfWeekCfg).endOf("isoweek")._d;

    this.isMobile = this.$isMobileDevice;
    this.$set(this.$rootScope, "dateFilter", [start, end, this.type]);
    this.dateVal = [start, end];
    this.isShowViewOption =
      this.$route.fullPath.indexOf("dynamic/view-all-task-page") > -1 ||
      this.$route.fullPath.indexOf("scrumboard") > -1 ||
      this.$route.fullPath.indexOf("timeline") > -1;
  },
  created() {
    this.isShowBreadScrum =
      this.showBreadScrumList.filter(item => {
        return this.$route.fullPath.indexOf(item) > -1;
      }).length > 0;
    this.$hub.$on("update-default-date-range", data => {});
    var request = {
      RequestAction: "SearchUsers",
      RequestClass: "BPM",
      RequestDataType: "json",
      ConditionFields: "Status;LoginName;UserId",
      StaticFields: "UserId;Username;LoginName;Status;",
      OrderFields: "LoginName ASC",
      Status: 1
    };
    this.$Utils.post(request).then(data => {
      this.workers = this.$Utils.getDataWithRoot(data, "Data.UserDS.User");
      var user = JSON.parse(
        this.$getItemLocalStorage(this.$localStorageConstant.LoggedOnUser)
      );
      if (user.LoginName !== "superadmin") {
                  this.workers = this.workers.filter((el)=> {
              return el.LoginName.indexOf("superadmin") === -1;
          });
      }
      var selectedWorkers = {
        UserId: this.workers
          .map(function(elem) {
            return elem.UserId;
          })
          .join(";"),
        Username: "Tất cả nhân sự"
      };
      this.workers.unshift(selectedWorkers);
    });
    //this.getProject()
  },
  destroyed() {
    // this.$hub.$off("currentUrl");
  }
};
</script>
<style lang="scss">
.breadcrumbEq {
  background-color: white;
  padding: 1.5px;
  border-bottom: 1px solid #c2cfd6;

  .rightaligndiv {
    text-align: right;
    padding-right: 5px;
  }
  .naviCenter {
    text-align: right;
    padding-right: 5px;
  }

  @media screen and (max-width: 768px) {
  }
}
</style>
