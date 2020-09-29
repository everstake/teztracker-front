import Vue from 'vue';
import Vuex from 'vuex';
import TzAPI from '@/services/api.service';
import app from './modules/app.module';
import blocks from './modules/blocks.module';
import operations from './modules/operations.module';
import accounts from './modules/accounts.module';
import period from './modules/period.module';

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    API() {
      return TzAPI;
    },
  },
  modules: {
    app,
    blocks,
    accounts,
    operations,
    period,
  },
});
