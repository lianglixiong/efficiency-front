<template v-loading.fullscreen.lock="$store.state.global.ajax_loading">
  <div class="home">
    <head-nav></head-nav>
    <div class="left-fixed-right-auto">
      <div class="content">
        <bread></bread>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import HeadNav from "../head-nav/HeadNav.vue";
import Foot from "../footer/footer.vue";
import Bread from "../bread/Bread.vue";

export default {
  name: "home",
  components: {
    HeadNav,
    Foot,
    Bread
  },
  data() {
    return {
      showFoot: true
    };
  }
};
</script>
<style scoped lang='less'>
.left-fixed-right-auto {
  width: 100%;
  overflow: hidden;
  .content {
    /*background: #f1f2f7;*/
    background: #eee;
    padding: 0.6vw;
    // display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
