import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import { state as applicationState } from '@/store/modules/app.module';
import { translation } from '@/plugins/translation'
import {lang} from 'moment'
import { constants } from '@/plugins/constants'
import i18n from '@/plugins/i18n'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

router.beforeEach((to, from, next) => {
  const routerLanguage = to.params.language;
  const routerNetwork = to.params.network;
  const applicationLanguage = translation.getUserLang().langNoISO;
  const { SUPPORTED_LANGUAGES } = constants;
  const { networkList, network } = applicationState;

  if (!routerLanguage || !routerNetwork) {
    return next({
      name: to.name,
      params: {
        language: applicationLanguage,
        network: network,
      },
    });
  }

  if (!SUPPORTED_LANGUAGES.includes(routerLanguage) || !networkList.includes(routerNetwork)) {
    return next({
      name: to.name,
      params: {
        language: applicationLanguage,
        network: network,
      },
    });
  } else {
    if (i18n.locale !== to.params.language) {
      translation.currentLanguage = to.params.language;
    }

    next();
  }
});

export default router;
