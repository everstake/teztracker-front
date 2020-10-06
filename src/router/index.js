import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import { state as appState } from '@/store/modules/app.module';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

router.beforeEach((to, from, next) => {
  const { networkList } = appState;
  const toRouteName = String(to.name);
  const networkValid = networkList.some((network) => network === to.params.network);
  const routesNoChangableNetwork = ['protocol', 'period', 'charts', 'vote'];
  const networkNotChangable = routesNoChangableNetwork.some((route) => toRouteName.includes(route));

  if (networkNotChangable) {
    if (appState.networkChangable)
      store.commit('app/setAppNetworkChangable', false);
  } else {
    if (!appState.networkChangable)
      store.commit('app/setAppNetworkChangable', true);
  }

  if (networkValid) {
    store.commit('app/setAppNetwork', to.params.network);
    return next();
  } else {
    next({
      name: to.name,
      params: {
        ...to.params,
        network: appState.network,
      },
    });
  }
});

export default router;
