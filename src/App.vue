<template>
  <div id="app">
    <TopMenu />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import TopMenu from "./components/menus/TopMenu.vue";
import Footer from "./components/menus/Footer.vue";

export default {
  name: "app",
  components: {
    TopMenu,
    Footer
  }
};
</script>

<style></style>
