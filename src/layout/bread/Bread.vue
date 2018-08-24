<template>
  <div class='bread' v-if="$route.path!='/g-situation/home'">
    <el-breadcrumb separator=">" class='el-bread'>
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <span>
        <i class="iconfont icon-weizhi" style='font-size:18px;'></i>您当前所在的位置是：</span>
      <el-breadcrumb-item v-for='(item,index) in $route.matched' :key='index'>{{item.name}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "bread",
  data() {
    return {
      strong: ""
    };
  },
  methods: {
    getPageText(name) {
      return name.replace("编辑", this.$route.query.id ? "修改" : "添加");
    }
  },
  mounted() {},
  created() {},
  watch: {
    $route(to, from) {
      to.name && (this.strong = this.getPageText(to.name));
    }
  }
};
</script>

<style scoped lang='less'>
.bread {
  height: 3.8vh;
  line-height: 26px;
  display: inline-block;
  .el-bread {
    display: inline-block;
    // float: right;
    text-align: right;
    vertical-align: top;
    span {
      color: #666;
    }
    .el-breadcrumb__item {
      float: inherit;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__item__inner {
      color: blue !important;
    }
  }
}
</style>
