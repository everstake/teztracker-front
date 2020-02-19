<template>
  <div id="app">
    <TopMenu />
    <router-view></router-view>
    <Footer showLogo />
  </div>
</template>

<script>
import TopMenu from "./components/menu/top.vue";
import Footer from "./components/menu/footer.vue";

export default {
  name: "app",
  components: {
    TopMenu,
    Footer
  }
};
</script>

<style></style>
