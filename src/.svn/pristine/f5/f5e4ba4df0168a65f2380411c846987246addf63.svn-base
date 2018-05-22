<template>
 <div>
   <el-row>
     <el-radio v-show="isSystemAdmin" @change="chooseSelect" size="mini" v-model="radio" label="1">Phòng ban</el-radio>
     <el-radio v-if="isSystemAdmin" @change="chooseSelect" size="mini" v-model="radio" label="2">Vai trò</el-radio>
     <router-link to="/settings/xSetting.Default.Permissions.RoleTemplate">
      <el-radio v-if="isSystemAdmin" @change="chooseSelect" size="mini" v-model="radio" label="3">Quyền</el-radio>
      </router-link>
   </el-row>
   <GroupTreeGrid :datasource="groups" :groupRole="groupRole" :group="groupP" :checkRadio="radio" :title="title"/>
</div>
</template>


<script>
import ShowCrDepartment from "@/components/static/ShowCrDepartment";
import CreateGroupForm from "@/components/static/CreateGroupForm";
import GroupTreeGrid from "@/components/static/GroupTreeGrid";
import index from "vue";
export default {
  components: { CreateGroupForm, GroupTreeGrid },
  data() {
    return {
      radio: "1",
      isSystemAdmin: this.$isSystemAdmin(),
      isMantisAdmin: this.$isMantisAdmin(),
      groups: [],
      title: "phòng ban",
      groupt: [],
      groupType: "1",
      groupOri: [],
      groupP: [],
      groupRole: [],
      TreeGrid: [],
      parentgroups: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.init();
    this.$on("reload", data => {
      this.init();
    });
    this.$on("search", data => {
      this.init(data);
    });
  },
  methods: {
    chooseSelect() {
      if (this.radio !== "3") {
        if (this.radio === "1") {
          this.title = "phòng ban";
          this.groupType = "1";
        } else if (this.radio === "2") {
          this.groupType = "0";
          this.title = "vai trò";
        }
        this.init();
      } else {
      }
    },
    init(data) {
      var ctrl = this;
      var request = this.$Lodash.cloneDeep(this.$singleRequest);
      request.RequestClass = "xBase";
      request.RequestAction = "Request";
      request.TotalRequests = 1;
      request.R1_RequestTemplate = "OrgnizationList";
      //request.R1_GroupType = this.groupType;
      this.$Utils.post(request).then(
        response => {
          if (response.success) {
            var fullGroup = this.$Utils.getDataWithRoot(
              response.R1,
              "Data.UserDS.Group"
            ); //response.data.R1.Data.UserDS.Group;
            var groupRole = [];
            var group = [];
            fullGroup.forEach(ele => {
              if (ele.GroupType == this.groupType) group.push(ele);
              else if (ele.GroupType == 2) groupRole.push(ele);
            });
            group.forEach(val2 => {
              val2.GroupRole = [];
              groupRole.forEach(val => {


                if (val2.GroupId === val.GroupParent) {
                  val.Name = val.GroupName;
                  val2.GroupRole.push(val);
                }
              });
            });
            var groupRoleTemplate = [];



                if (!data) {
                  $.each(group, function(k, v) {
                    v.text = "";
                    v.text = v.GroupName;
                  });
                }
                this.groupP = group;
                if (!this.$Utils.isEmpty(group, "length")) {
                  group = [group];
                }
                if (data) {
                  var group = group.filter(function(el) {
                    return (
                      el.GroupName.toLowerCase().indexOf(data.toLowerCase()) !==
                      -1
                    );
                  });
                }
                this.groupOri = $.makeArray(
                  $.map(group, function(val, i) {
                    if (!val) return {};
                    else
                      return {
                        Id: val.GroupId,
                        ParentId: val.GroupParent,
                        value: val.GroupId,
                        status: val.Status,
                        label: val.GroupName,
                        code: val.GroupPath,
                        des: val.Description,
                        level: val.Level,
                        text: val.GroupName,
                        groupRole: val.GroupRole
                        // children: []
                      };
                  })
                );
                this.groups = this.$Utils.createCustomTreeFromList(
                  this.groupOri,
                  "Id",
                  "ParentId",
                  "children",
                  { Name: "label", Id: "value" },
                  { type: "group"}
                );
                this.parentgroups = this.$Lodash.cloneDeep(this.groups);

          }
        },
        function(error) {
           console.log(error)
        }
      );
    }
  }
};
</script>
