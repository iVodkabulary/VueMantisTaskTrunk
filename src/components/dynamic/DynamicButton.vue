<template>
  <el-button :class="itemSetting.Class" @click="onClick" type="default">
    {{itemSetting.Caption? itemSetting.Caption: itemSetting.Default}}
  </el-button>
 </template>

 <script>
   // import SelectTree from '@/components/dynamic/SelectTree'
 export default {
   // components: {SelectTree},
   props: ['setting','data', 'callback'],
   data(){
    return { 
      mName:'',
      itemSetting: this.setting,
      itemData: this.data
    }
   },
   created() {
    this.setTemplate();
    /** call setting attribute function*/
    this.setAttr();
   },
   watch: {
     // mName : function (newVal) {
     //   if(this.callback) this.callback({name:this.name, values: newVal, model:this.item});
     // }
   },
   mounted(){
   },
   methods: {
     setTemplate() {
        /** create template parameter using setting or run default code*/
        if (this.itemSetting.DisplayType == "LeftLabel") {
          this.itemSetting.DisplayType = "Default";
        }
        // this.htmlTemplate = ('Control.' + template.replace(/[^a-zA-Z0-9]+/g, "") + '.Button').toLowerCase();
        /** add show/hide in case */
        if (this.itemSetting.DisplayDependOn) {
          switch (this.itemSetting.DisplayDependType) {
            case 'DependEmpty':
              if (this.$Utils.isEmpty(this.itemData, this.itemSetting.DisplayDependOn)) {
                this.itemSetting.displayControl('hidden');
              }
              break;
            case 'DependExist':
              if (!this.$Utils.isEmpty(this.itemData, this.itemSetting.DisplayDependOn)) {
                this.itemSetting.displayControl('hidden');
              }
              break;
            case 'DateTimeRange':
              if (this.$Utils.isEmpty(this.itemData, this.itemSetting.DisplayDependOn) && this.itemData[this.itemSetting.DisplayDependOn] != '') {
                var defaultDateTimeObject = {
                  Second: 1,
                  Minute: 60,
                  Hour: 3600,
                  Day: 86400,
                  Week: 86400 * 7,
                  Month: 86400 * 30,
                  Year: 86400 * 365,
                  Now: new Date().getTime() / 1000
                };
                defaultDateTimeObject[this.itemSetting.DisplayDependOn] = this.$Utils.stringToDate(this.itemData[this.itemSetting.DisplayDependOn]).getTime() / 1000;
                var exp = this.$Utils.expressionToString(defaultDateTimeObject, this.itemSetting.DateTimeExpression);
                var display = this.$Utils.compareStringExpression(exp);
                if (!display) {
                  this.itemSetting.displayControl('hidden');
                }
              }
              break;
          }
        }
      },
      setAttr() {
        /** check if itemSetting.Attr is empty, add default class setting*/
        if (!this.$Utils.isEmpty(this.itemSetting, 'Class') || this.itemSetting.Class == '') {
          this.itemSetting.Class = 'md-raised md-primary';
        }
      },
      onClick () {
        this.itemSetting.onClick(this.itemSetting);
      }
   }
 }
 </script>

  <style lang="sass">

  </style>
