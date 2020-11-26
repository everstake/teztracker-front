import Vue from 'vue';
import App from './App.vue';
import './plugins/constants';
import './plugins/translation';
import './plugins/tezosApi';
import './plugins/vuePlugins';
import './plugins/helpers';
import './plugins/eventBus';
import './plugins/ws';
import './plugins/beacon';
import './filters';
import router from './router';
import store from './store';
import i18n from './plugins/i18n';

Vue.config.productionTip = false;

const a = new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
});
a.$mount('#app');
