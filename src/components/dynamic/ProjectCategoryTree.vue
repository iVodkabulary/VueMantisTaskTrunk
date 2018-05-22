<template>
  <div>
<el-tree
  :data="datasource"
  :props="defaultProps"

  node-key="id"
  default-expand-all
  :expand-on-click-node="false"
   :render-content="renderContent" >
</el-tree>


  </div>
</template>

<script>
 import CreateGroupCategoryForm from '@/components/static/CreateGroupCategoryForm'
  let id = 1000;

  export default {
    props: ['datasource'],
    data() {
      return {
       // source: this.datasource,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      append(data) {

      this.$hub.$emit(
        "set-modal-data",
        "Thêm nghiệp vụ",
        "50%",
        true,
        "center",
        CreateGroupCategoryForm,
        false
      );
      this.$hub.$emit("open-modal");
        /*
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        */
      },

      remove(node, data) {

        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
          return ( <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span><i class=""></i>{node.label}</span>
            </span>
            <span><el-progress text-inside={true} stroke-width={18} percentage={70} ></el-progress></span>
            <span>

              <el-button style="font-size: 12px; display: none;" type="text" on-click={ () => this.append(data) }>Thêm nghiệp vụ con</el-button>

              <el-button style="font-size: 12px;" type="text" on-click={ () => this.confirmationToDelte(node, data) }>Xóa</el-button>
            </span>
          </span>);

      },
       confirmationToDelte(node, data) {
        this.$confirm('Hành động này không thể hoàn tác. Bạn thực sự muốn xóa bản ghi này?', 'Cảnh Báo', {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Bỏ qua',
          type: 'warning'
        }).then(() => {
          this.$hub.$emit('updateCategoryList', {node, data});
        }).catch(() => {
          /* this.$message({
            type: 'info',
            message: 'Delete canceled'
          }); */
        });
      }
    }
  };
</script>
