<template>
  <div id="app" :key="$route.path || getAppNetwork">
    <TopMenu />
    <router-view :key="langChangeKey"></router-view>
    <Footer showLogo />
  </div>
</template>

<script>
import TopMenu from "./components/partials/menus/TopMenu";
import Footer from "./components/partials/menus/Footer";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    TopMenu,
    Footer
  },
  computed: {
    ...mapGetters("app", ["getAppNetwork"])
  },
  data() {
    return {
      langChangeKey: null
    };
  },
  created() {
    this.$eventBus.$on("lang-change", val => {
      if (this.langChangeKey !== val) {
        this.langChangeKey = val;
      }
    });
  }
};
</script>

<style lang="scss">
@import "assets/scss/index";
</style>
