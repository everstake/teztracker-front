<template>
  <div id="app">
    <TopMenu v-if="isNetworkInRouteParams" />
    <router-view></router-view>
    <Footer />
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
  },
  computed: {
    isNetworkInRouteParams() {
      return Boolean(this.$route.params.network);
    }
  }
};
</script>

<style></style>
