<template>
  <div id="app" :key="getAppNetwork">
    <TopMenu />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import TopMenu from "./components/menus/TopMenu.vue";
import Footer from "./components/menus/Footer.vue";
import TopMenu from "./components/menu/top.vue";
import Footer from "./components/menu/footer.vue";
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

<style></style>
