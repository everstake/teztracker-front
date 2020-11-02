import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import store from '@/store';
import { state as applicationState, mutations as applicationMutations } from '@/store/modules/app.module';
import { SET_APP_NETWORK } from '@/store/mutations.types';
import { CANCEL_PENDING_REQUESTS } from '@/store/actions.types';
import { translation } from '@/plugins/translation';
import { constants } from '@/plugins/constants';
import i18n from '@/plugins/i18n';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const routerNameFalsy = !to.name;
  const routerLanguage = to.params.language;
  const routerNetwork = to.params.network;
  const applicationLanguage = translation.getUserLang().langNoISO;
  const { SUPPORTED_LANGUAGES } = constants;
  const { networkList, network } = applicationState;
  store.dispatch(`app/${CANCEL_PENDING_REQUESTS}`);

  if (routerNameFalsy) {
    next({
      name: 'index',
      params: {
        language: applicationLanguage,
        network: network,
      },
    });
  }

  if (!routerLanguage || !routerNetwork) {
    return next({
      name: to.name,
      params: {
        ...to.params,
        language: applicationLanguage,
        network: network,
      },
    });
  }

  if (!SUPPORTED_LANGUAGES.includes(routerLanguage) || !networkList.includes(routerNetwork)) {
    return next({
      name: to.name,
      params: {
        ...to.params,
        language: applicationLanguage,
        network: network,
      },
    });
  } else {
    if (i18n.locale !== to.params.language) {
      translation.currentLanguage = to.params.language;
    }

    if (applicationState.network !== to.params.network) {
      applicationMutations[SET_APP_NETWORK](applicationState, to.params.network);
    }

    next();
  }
});

export default router;
