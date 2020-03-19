import Vue from "vue";
import { GET_APP_INFO } from "@/store/actions.types";
import { SET_APP_INFO, SET_APP_NETWORK, SET_APP_NETWORK_CHANGABLE, SET_DATE_FORMAT } from "@/store/mutations.types";

const initialState = {
  platform: "tezos",
  network: "mainnet",
  networkList: ['mainnet', 'babylonnet', 'carthagenet'],
  networkChangable: true,
  priceInfo: {},
  dateFormat: Vue.prototype.$constants.DATE_FORMAT
};

export const state = { ...initialState };

export const actions = {
  async [GET_APP_INFO]({ commit, rootGetters }) {
    commit(SET_APP_INFO, await rootGetters.API.getInfo());
  }
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
      console.log(123213, info)
      localStorage.setItem("defaultDateFormat", info);
    }
    state.dateFormat = info;
  }
};

export const getters = {
  getAppNetwork: (state) => state.network,
  getAppNetworkList: (state) => state.networkList,
  getAppNetworkChangable: (state) => state.networkChangable
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
