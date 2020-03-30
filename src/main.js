import Vue from "vue";
import App from "./App.vue";
// Constants
import "./plugins/constants";
// API
import "./plugins/tezosApi";
// Vue plugins
import "./plugins/vuePlugins";
// Helper functions
import "./plugins/helpers";
// Filters
import "./filters";
import router from "./router";
import store from "./store";
import i18n from './i18n'

Vue.config.productionTip = false;

const a = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
});
a.$mount("#app");
