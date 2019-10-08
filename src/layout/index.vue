<template>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'" class="drawer-bg" />
        <div class="main-container" >
          <div :class="{'fixed-header':fixedHeader}">
            <navbar />
          </div>
          <app-main />
        </div>
    </div>
</template>
<script>
import { AppMain, Navbar } from './components'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar
  },
  data () {
    return {
      // url: require('@/images/bg.jpg')
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj () {
      return {
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100%);
    transition: width 0.28s;
  }
  .mobile .fixed-header {
    width: 100%;
  }
</style>
