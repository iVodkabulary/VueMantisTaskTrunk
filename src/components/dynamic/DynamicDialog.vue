<template>
  <el-dialog :title="title"
             :visible.sync="visible"
             :width="width"
             :class="customerclass"
             :before-close="handleClose"
             :close-on-click-modal="clickOutsideToClose"
             center>
              <el-dialog
                  :width="childWidth"
                  :title="childTitle"
                  :visible.sync="innerVisible"
                  :before-close="handleChildClose"
                  :close-on-click-modal="clickOutsideToCloseChild"
                  append-to-body>
                  <span slot="childTitle" class="dialog-header">{{childTitle}}</span>
                  <span>
                    <component v-bind:is="childComponent" v-bind:data="childData"></component>
                  </span>
                  <span slot="footer" class="dialog-footer" v-if="isShowChildFooter">
                    <el-button @click="visible = false">Close</el-button>
                <el-button type="primary" @click="visible = false">Confirm</el-button>
              </span>
              </el-dialog>
    <span slot="title" class="dialog-header">{{title}}</span>
    <span > <component v-bind:is="component" v-bind:data="data"></component></span>
    <!--<span slot="footer" class="dialog-footer" v-if="isShowFooter">-->

      <!--<el-button @click="visible = false">Close</el-button>-->
      <!--<el-button type="primary" @click="visible = false">Confirm</el-button>-->
    <!--</span>-->
  </el-dialog>
</template>
<script>
  export default {
    name: "DynamicDialog",
    //props:['title','width','visible','position', 'component', 'isShowFooter'],
    data() {
      return {
        title: '',
        width: '',
        visible: false,
        position: 'center',
        component: null,
        childComponent: null,
        isShowFooter: true,
        customerclass: '',
        data: '',
        childData: '',
        childTitle: '',
        childWidth: '',
        isShowChildFooter: false,
        customerChildClass: '',
        innerVisible: false,
        isMobile: false,
        clickOutsideToClose: true,
        clickOutsideToCloseChild: true,
        openedLocation: ''
      };
    },
    destroyed() {
      this.$hub.$off("set-modal-data", this.set);
      this.$hub.$off("open-modal", this.open);
      this.$hub.$off("open-child-modal", this.openChild);
      this.$hub.$off("set-child-modal-data", this.setChild);
      this.$hub.$off("close-modal", this.close);
      this.$hub.$off("close-child-modal", this.closeChild);
    },
    methods: {
      handleClose(){
        this.close();
      },
      handleChildClose(){
        this.closeChild()
      } ,
      close() {
        this.data = {};
        this.component = null;
        this.visible = false;
        this.closeChild();
      },
      closeChild() {
        this.childData = {};
        this.childComponent = null;
        this.innerVisible = false;
      },

      open() {
        this.visible = true;
      },
      openChild() {
        this.innerVisible = true;
      },
      set(title, width, visible, position, component, isShowFooter, customerClass, data, clickOutsideToClose) {
        this.data = data;
        this.title = title;
        this.width = width;
        this.visible = visible;
        this.position = position;
        this.component = component;
        this.isShowFooter = isShowFooter;
        this.customerclass = customerClass;
        this.clickOutsideToClose = clickOutsideToClose;
        this.isMobile = this.$isMobileDevice;
        if(this.isMobile) this.width = '100%';
      },
      setChild(title, width, visible, position, component, isShowFooter, customerClass, data, clickOutsideToClose) {
        this.childData = data;
        this.childTitle = title;
        this.childWidth = width;
        this.innerVisible = visible;
        this.childPosition = position;
        this.childComponent = component;
        this.isShowChildFooter = isShowFooter;
        this.customerChildClass = customerClass;
        this.isMobile = this.$isMobileDevice;
        if(this.isMobile) this.childWidth = '100%';
        this.clickOutsideToCloseChild = clickOutsideToClose;
      }
    },
    watch : {
       '$route': function(to, from) {
         this.close()
       },
    },
    mounted() {
      this.openedLocation = window.location.href;
      this.$nextTick(
        function () {
          this.$hub.$on("set-modal-data", this.set);
          this.$hub.$on("set-child-modal-data", this.setChild);
          this.$hub.$on("open-modal", this.open);
          this.$hub.$on("open-child-modal", this.openChild);
          this.$hub.$on("close-modal", this.close);
           this.$hub.$on("close-child-modal", this.closeChild);
        }.bind(this)
      )
      }
  };
</script>
<style lang="scss">

   @media (max-width: 599px){
     .el-dialog {
        .el-dialog__body {
          padding: 10px !important;
         }
          .el-dialog__header {
            .el-dialog__headerbtn {
              top: 0px;
            }
          padding-top: 0px !important;
        }

     }

    }
</style>
