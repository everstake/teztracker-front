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
  const toRouteName = String(to.name);
  const isRouteNetworkValid = appState.app.networkList.some(
    network => network === to.params.network
  );

  if (toRouteName.includes('protocol') || toRouteName.includes('period')) {
    if (appState.app.networkChangable) store.commit("app/setAppNetworkChangable", false);
  } else {
    if (!appState.app.networkChangable) store.commit("app/setAppNetworkChangable", true);
  }

  if (isRouteNetworkValid) {
    store.commit("app/setAppNetwork", to.params.network);
    return next();
  } else {
    next({
      name: to.name,
      params: {
        ...to.params,
        network: appState.app.network
      }
    });
  }
});

export default router;
