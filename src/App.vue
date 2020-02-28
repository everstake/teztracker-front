<template>
  <div id="app" :key="getAppNetwork">
    <TopMenu />
    <router-view></router-view>
    <Footer showLogo />
  </div>
</template>

<script>
import TopMenu from "./components/partials/menus/TopMenu";
import Footer from "./components/partials/menus/Footer";
import { mapGetters } from 'vuex';

export default {
  name: "app",
  components: {
    TopMenu,
    Footer
  },
  computed: {
    ...mapGetters('app', ['getAppNetwork'])
  }
};
</script>

<style lang="scss">
@import "assets/scss/index";
</style>
