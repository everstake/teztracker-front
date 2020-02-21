import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
// Constants
import './plugins/constants';
import './plugins/TezosApi';
import store from "@/store";
import routes from "./routes";
import "./filters";
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from "@fortawesome/vue-fontawesome";
import { faSearch, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb, faStar, faFolder, faUser, faChartBar, faBookmark, faGem, faHourglass } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { LinkPlugin } from 'bootstrap-vue';
import { TablePlugin } from 'bootstrap-vue';
import { PaginationPlugin } from 'bootstrap-vue';
import { ProgressPlugin } from 'bootstrap-vue';

dom.watch();
library.add(faSearch, faCaretUp, faCaretDown);
library.add(faLightbulb, faStar, faFolder, faUser, faChartBar, faBookmark, faGem, faHourglass);

Vue.config.productionTip = false;

Vue.use(LinkPlugin);
Vue.use(TablePlugin);
Vue.use(PaginationPlugin);
Vue.use(ProgressPlugin);

Vue.use(VueRouter);

let router = new VueRouter({
  mode: "history",
  routes
});

// router.beforeEach(async (to, from, next) => {
//   await store.commit("app/setAppNetwork", to.params.network);
//   return next()
// });

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

const a = new Vue({
  store,
  router,
  render: h => h(App)
});
a.$mount("#app");
