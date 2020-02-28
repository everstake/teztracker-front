import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes";
import { state as appState } from "@/store/modules/app.module";
import store from "@/store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes
});

router.beforeEach((to, from, next) => {
  const isRouteNetworkValid = appState.app.networkList.some(
    network => network === to.params.network
  );

  if (isRouteNetworkValid) {
    store.commit("app/setAppNetwork", to.params.network);
    return next();
  } else {
    next({
      name: to.name,
      params: {
        network: appState.app.network
      }
    });
  }
});

export default router;
