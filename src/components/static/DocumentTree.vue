<template>
  <div class="document-tree">

    <el-input placeholder="Tìm kiếm"
              v-model="filterText">
    </el-input>
    <div class="px-2 bg-white">
      <button class="btn btn-link" @click="expandAll">Mở rộng</button>
      <button class="btn btn-link" @click="collapseAll">Thu gọn</button>
    </div>
    <el-tree :data="source"
             :props="defaultProps"
             show-checkbox
             ref="tree"
             node-key="value"
             @node-click="handleNodeClick"
             @check-change="handleCheckChange"
             :default-expand-all="(!$isMobileDevice || $isMobile.iPad()) ? true : false"
             check-strictly
             :expand-on-click-node="true"
             :filter-node-method="filterNode"
             :render-content="renderContent">
    </el-tree>

  </div>
</template>
<script>
export default {
  props: ["datasource"],
  data() {
    return {
      source: this.datasource,
      defaultProps: {
        children: "children",
        label: "label",
        type: "type"
      },
      filterText: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    handleNodeClick(data) {
      var lst = this.$refs.tree.getCheckedKeys();
      if (lst.indexOf(data.value) === -1) {
        lst.push(data.value);
        this.$refs.tree.setCheckedKeys(lst);
      } else {
        lst.splice(lst.indexOf(data.value), 1);
        this.$refs.tree.setCheckedKeys(lst);
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      var lst = this.$refs.tree.getCheckedNodes();
      this.$hub.$emit("update-document-list", lst);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    expandAll() {
      this.$refs["tree"].$data.store.defaultExpandAll = true;
      this.source = JSON.parse(JSON.stringify(this.source));
    },
    collapseAll() {
      this.$refs["tree"].$data.store.defaultExpandAll = false;
      this.source = JSON.parse(JSON.stringify(this.source));
    },

    renderContent(h, { node, data, store }) {
      //console.log(node)
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>
              <i class={node.data.icon} />
              {node.label}
            </span>
          </span>
          <span>
            {this.$Utils.isEmpty(node.data.total)
              ? "(" + node.data.total + ")"
              : ""}
          </span>
        </span>
      );
    }
  }
};
</script>
<style scope lang="scss">
  .document-tree {

    .el-tree-node__expand-icon {
      font-size: 24px;
    }

    .el-checkbox {
      margin-bottom: 0px;
    }
  }
</style>
