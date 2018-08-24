<template>
  <div :class="'tree-menu'">
    <el-tabs v-if="option.leftTopNav" v-model="option.leftTopNav" @tab-click='changeWaterEle'>
      <el-tab-pane v-for="pane in option.leftTopNavArr" :key="pane.id" :label="pane.label" :name="pane.name"></el-tab-pane>
    </el-tabs>
    <el-tabs :type="option.leftTopNav?'border-card':''" v-model="option.leftBotNav" @tab-click='changePart'>
      <el-tab-pane v-for="pane in option.leftBotNavArr" :key="pane.id" :label="pane.label" :name="pane.name">
        <template v-if="pane.list">
          <el-tree v-show="show(paneChild)" v-for="paneChild in pane.list" :key="paneChild.id" :data="option[paneChild.dataName]" :props="option[paneChild.propsName]" @node-click="handleNodeClick" :highlight-current="highlightCurrent" :accordion="accordion" :default-expanded-keys="option[paneChild.exKeysName]" :show-checkbox="showCheckbox" :default-checked-keys="option[paneChild.checkKey]" :default-expand-all='defaultExpandAll' :check-strictly="checkStrictly" style="height:72.2vh;overflow:auto;" :ref="paneChild.refName" :node-key="paneChild.nodeKey"></el-tree>
        </template>
        <template v-else>
          <el-tree :data="option[pane.dataName]" :props="option[pane.propsName]" @node-click="handleNodeClick" :highlight-current="highlightCurrent" :accordion="accordion" :default-expanded-keys="option[pane.exKeysName]" :show-checkbox="showCheckbox" :default-checked-keys="option[pane.checkKey]" :default-expand-all='defaultExpandAll' :check-strictly="checkStrictly" style="height:72.2vh;overflow:auto;" :ref="pane.refName" :node-key="pane.nodeKey"></el-tree>
        </template>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import treeMenuJS from "./treeMenu.js";

export default treeMenuJS;
</script>

<style lang="less">
.tree-menu {
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .el-tabs__header {
    border-bottom: 1px solid #ddd;
    padding: 0 5%;
  }
  .el-tabs--border-card > .el-tabs__header {
    background: #fff;
    border: none;
    .el-tabs__item.is-active {
      background: #20a0ff;
      border-radius: 1vh;
      color: #fff;
    }
    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        .el-tabs__nav {
          border: none;
        }
      }
    }
    .el-tabs__item {
      height: 4vh;
      line-height: 4vh;
    }
  }
  .el-tabs__nav-wrap {
    .el-tabs__nav-scroll {
      .el-tabs__nav {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ddd;
        display: flex;
      }
    }
  }
  .el-tabs__item {
    height: 5vh;
    line-height: 5vh;
    padding: 0 1vw;
    font-size: 2.2vh;
    text-align: center;
    flex: 1;
  }
  .el-tree {
    border: none;
  }
  .el-tree--highlight-current {
    .el-tree-node.is-current > .el-tree-node__content {
      color: #20a0ff;
      background: #fff;
    }
  }
  .el-tree-node__content {
    line-height: 4vh;
    height: 4vh;
  }
  .el-tree-node__label {
    font-size: 2vh;
  }
}
</style>



