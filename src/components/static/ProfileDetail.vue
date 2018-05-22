<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{data.type ==='employee'?'Nhân viên': 'Khách hàng'}} : {{profile.Name}}</span>
      </div>
      <div class="text item">
        <span><i class="fa fa-birthday-cake"></i>
        {{profile.Birthday}}</span>
      </div>
      <div class="text item" v-if="profile.type === 'customer'">
        <span>
          <i class="fa fa-male"></i>
          <i class="fa fa-female"></i>&nbsp;&nbsp;
        {{profile.GenderName}}</span>
      </div>
      <div class="text item">
         <span>
           <i class="fa fa-mobile"></i>&nbsp;&nbsp;
            {{profile.Phone}}</span>
      </div>
      <div class="text item">
         <span><i class="fa fa-envelope"></i>&nbsp;&nbsp;
       {{profile.Email}}</span>
      </div>
      <div class="text item">
         <span><i class="fa fa-facebook-square"></i>&nbsp;&nbsp;
       {{profile.Facebook}}</span>
      </div>
      <div class="text item">
        <i class="fa fa-facebook"></i>&nbsp;&nbsp;
        <a v-if="profile.FacebookLink === 'Đang cập nhật'" target="_blank">
          {{profile.FacebookLink}}</a>
        <a v-else :href="((profile.FacebookLink && (profile.FacebookLink.indexOf('https') === -1 || profile.FacebookLink.indexOf('http') === -1)) ? 'https://' : '') + profile.FacebookLink" target="_blank">
        {{profile.FacebookLink}}</a>
      </div>
      <div class="text item" v-if="data.type === 'customer'">
         <span><i class="fa fa-building"></i>&nbsp;&nbsp;
       {{profile.Company}}</span>
      </div>
      <div class="text item">
         <span><i class="fa fa-group" v-if="data.type === 'customer'"></i>&nbsp;&nbsp;
       {{profile.Position}}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
  import Vue from "vue";
  import UploadFile from "@/components/static/UploadFile";
  import Comment from '@/components/dynamic/Comment'
  export default {
    name: 'profile-detail',
    props: ['data'],
    data() {
      return {
        profile: {},
      }
    },
    created() {
      if(this.data.type ==='employee'){
        var request = {
            RequestAction: 'SearchUsers',
            RequestClass: 'BPM',
            StaticFields: "UserId;Username;LoginName;Description;Status;",
            DynamicFields: "Avatar;Facebook;Email;Skype;Birthday;Biography;WorkProcess;Telephone",
            ConditionFields: 'UserId',
            Status: 1,
            ConditionFields: 'Status',
            UserId: this.data.Id,
        }
        this.$Utils.post(request).then((data)=> {
          data =this.$Utils.getDataWithRoot(data, 'Data.UserDS.User');
          if(data.length >0){
            data[0].Description = JSON.parse(data[0].Description);
            this.profile = {
              Name: data[0].Username,
              Birthday: this.$Utils.formatDateTime(data[0].Birthday, 'DD-MM-YYYY'),
              GenderName: data[0].GenderName,
              Phone: data[0].Telephone,
              Email: data[0].Email,
              Facebook: data[0].Facebook,
              FacebookLink: data[0].FacebookLink,
              Company: data[0].Company,
              Position: data[0].TitleContactName,
            }
          }
        });
      }else if(this.data.type ==='customer'){
        var request = {
          RequestClass:'xBase',
          RequestAction:'Request',
          TotalRequests:1,
          R1_RequestTemplate:'xProfile_Profile.Search',
          R1_Id: this.data.Id,
          R1_RequestDataGroup:'DataGroup.khach-hang.0c3b1',
          R1_RequestFields:'Address;BankName;Birthday;CompanyName;CustomerTypeName;DisplayImage;DisplayImageName;DoctorNetwork;DoctorNetworkName;Email;EmailSubscriptionStatus;EmailSubscriptionStatusName;Gender;GenderName;Industry;IndustryName;Location;LocationName;Major;MajorName;MemberNetworkType;MemberNetworkTypeName;Name;NumberEmployees;NumberEmployeesName;PatientNetworkType;PatientNetworkTypeName;Phone;TitleContact;TitleContactName;TotalDebt;TotalDiscount;TotalInteractiveSale;TotalNumberOfLead;TotalPaid;TotalPurchase;TotalRevenueAfterDiscount;TotalRevenueBeforeDiscount;TotalSupport;TypeOperation;TypeOperationName;Website;YearsOfExperience;YearsOfExperienceName;CategoryName;Code;CompanyAddressName;CreatedByName;CustomerTypeName;DisplayImageName;DoctorNetworkName;EmailSubscriptionStatusName;GenderName;IndustryName;LocationName;MajorName;MemberNetworkTypeName;Modified;ModifiedByName;NumberEmployeesName;PatientNetworkTypeName;TitleContactName;TypeOperationName;YearsOfExperienceName;Id;FacebookId;',
          R1_Code:'Customer'
        }
        this.$Utils.post(request).then((data)=> {
          data = this.$Utils.getDataWithRoot(data.R1, 'Data.ProfileDS.Profile');
          this.profile = {
            Name: data[0].Name,
            Birthday: this.$Utils.formatDateTime(data[0].Birthday, 'DD-MM-YYYY'),
            GenderName: data[0].GenderName,
            Phone: data[0].Phone,
            Email: data[0].Email,
            Facebook: data[0].Address,
            FacebookLink: data[0].BankName,
            Company: data[0].CompanyName,
            Position: data[0].TitleContactName,

          }
        })
      }
    },
    methods: {
      close() {
        this.$hub.$emit('close-modal');
      },
    }
  }
</script>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  /*.box-card {*/
    /*width: 480px;*/
  /*}*/
</style>
