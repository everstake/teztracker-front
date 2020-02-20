import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store from "./store";
import routes from "./routes";
import BootstrapVue from "bootstrap-vue";
import "./filters";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();

library.add(fas);
library.add(far);

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(BootstrapVue);

let router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach(async (to, from, next) => {
  await store.commit("setNetwork", to.params.network);
  return next();
});

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

const a = new Vue({
  store,
  router,
  render: h => h(App)
});
a.$mount("#app");
