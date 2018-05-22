<template>
  <el-cascader
    :expand-trigger="changeSelectable ?'click': 'hover'"
    :options="options"
    :change-on-select="changeSelectable"
    filterable
    :placeholder="pSetting && pSetting.PlaceHolder ? pSetting.PlaceHolder : pSetting ? pSetting.Caption : ''"
    :show-all-levels="showAll"
    v-model="selectedOptions"
    @change="handleChange"  :clearable="clearable">
  </el-cascader>
</template>
<script>
export default {
  props: ["nameField", "datasource", "selectedValue", "pSetting", "callback", "data", 'source', 'changeOnSelect', 'clearable'],
  data() {
    return {
      options: [],
      selectedOptions: [],
      changeSelectable: this.changeOnSelect != undefined ?this.changeOnSelect:false,
      showAll: true,
    };
  },
  watch: {
    datasource: function(newSource) {
      if(!this.nameField){
        this.options = this.$Utils.createCustomTreeFromList(
          this.$Lodash.cloneDeep(newSource),
          "Id",
          "ParentId",
          "children",
          { Name: "label", Id: "value" },
          {}
        );
      }else{
        var bindingObj = {};
        bindingObj[this.nameField[0]] = "label";
        bindingObj[this.nameField[1]] = "value";

        this.options = this.$Utils.createCustomTreeFromList(
          this.$Lodash.cloneDeep(newSource),
          "Id",
          "ParentId",
          "children",
          { "Caption" : "label", Id : "value" },
          {}
        );
      }
    },
    selectedValue: function(newVal) {
      if(this.selectedOptions != newVal){
        this.selectedOptions = newVal;
      }
    },
  },
  methods: {
    handleChange(value) {
      if (this.callback) {
        if(this.source && this.source.length > 0){
          var obj = this.source.filter((el) => {
            return el.Id == value[0];
          })[0];
          this.checkParent(obj)
        } else
          this.callback(value);
      }
    },
    checkParent(selectedItem){
      this.source.forEach((value) =>{
        if (this.$Utils.isEmpty(selectedItem, 'ParentId') && selectedItem.ParentId === value.Id){
          if(eval(selectedItem.Level) > 6){
            this.selectedOptions.unshift(value.Id)
            this.checkParent(value)
          }
        } else if(!this.$Utils.isEmpty(selectedItem, 'ParentId')) {
          this.callback(this.selectedOptions);
        } else
        if(value.Level === '6' && selectedItem.Id === value.Id) {
          this.callback(this.selectedOptions);
        }
      })
    }
  },
  created() {
    if(this.pSetting && this.pSetting.ParentType == 'Form'){
      var expression = this.$Utils.stringToObject(this.$Utils.expressionToString(this.data, this.pSetting.Code));
      if(expression.ParentCode == 'xSetting.Project.Parameter.Organization.Target'){
        this.showAll = false;
        this.changeSelectable = true;
      } else{
        this.changeSelectable = false;
      }
      this.$nextTick();
    }
    if(this.selectedValue && this.selectedValue.length > 0){
      this.selectedOptions = this.selectedValue;
      // this.$nextTick();
    }
  }
};
</script>
