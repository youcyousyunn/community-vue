<template>
    <div class="head-logo-container">
        <transition>
            <router-link class="sidebar-logo-link" to="/">
                <!-- <img :src="logo" class="sidebar-logo"> -->
                <h1 class="sidebar-title">{{ title }}<span>社区</span></h1>
            </router-link>
        </transition>
    </div>
</template>
<script>
import logo from '@/assets/logo.png'
export default {
  name: 'Logo',
  data () {
    return {
      title: 'CodePorter',
      logo: logo
    }
  }
}
</script>
<style lang="scss" scoped>
h1 {
    margin: 0;
}
.head-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    overflow: hidden;
    .sidebar-logo-link {
        height: 100%;
        width: 100%;
        .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }
        .sidebar-title {
            padding-top: calc(30px - 15px);
            display: inline-block;
            margin: 0;
            color: #757575;
            color: #009a61;
            font-size: 36px;
            font-weight: 600;
            font-size: 18px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
            span {
                color: #141414;
            }
        }
    }
}
</style>
