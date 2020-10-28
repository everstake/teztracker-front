import Vue from 'vue';
import { CANCEL_PENDING_REQUESTS, GET_APP_INFO } from '@/store/actions.types';
import {
  ADD_CANCEL_TOKEN,
  CLEAR_CANCEL_TOKENS,
  SET_APP_INFO,
  SET_APP_NETWORK,
  SET_APP_NETWORK_CHANGABLE,
  SET_DATE_FORMAT,
  SET_CURRENT_CURRENCY,
} from '@/store/mutations.types';

const initialState = {
  platform: 'tezos',
  network: 'mainnet',
  networkList: ['mainnet', 'carthagenet'],
  networkChangable: true,
  priceInfo: {},
  dateFormat: Vue.prototype.$constants.DATE_FORMAT,
  cancelTokens: [],
  currentCurrency: '',
};

export const state = { ...initialState };

export const actions = {
  async [GET_APP_INFO]({ commit, rootGetters }) {
    commit(SET_APP_INFO, await rootGetters.API.getInfo());
  },
  [CANCEL_PENDING_REQUESTS]({ commit, state }) {
    state.cancelTokens.forEach((request) => {
      if (request.cancel) {
        request.cancel('Request cancelled');
      }
    });

    commit(CLEAR_CANCEL_TOKENS);
  },
};

export const mutations = {
  [SET_APP_NETWORK](state, network) {
    state.network = network;
  },
  [SET_APP_NETWORK_CHANGABLE](state, payload) {
    state.networkChangable = payload;
  },
  [SET_APP_INFO](state, info) {
    state.priceInfo = info.data;
  },
  [SET_DATE_FORMAT](state, info) {
    if (Vue.prototype.$helpers.isLocalStorageAvailable()) {
      localStorage.setItem('defaultDateFormat', info);
    }
    state.dateFormat = info;
  },
  [ADD_CANCEL_TOKEN](state, token) {
    state.cancelTokens.push(token);
  },
  [CLEAR_CANCEL_TOKENS](state) {
    state.cancelTokens = [];
  },
  [SET_CURRENT_CURRENCY](state, currency) {
    state.currentCurrency = currency;
  },
};

export const getters = {
  getAppNetwork: (state) => state.network,
  getAppNetworkList: (state) => state.networkList,
  getAppNetworkChangable: (state) => state.networkChangable,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
