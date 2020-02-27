import { GET_APP_INFO } from "@/store/actions.types";
import { SET_APP_INFO, SET_APP_NETWORK } from "@/store/mutations.types";

const initialState = {
  app: {
    platform: "tezos",
    network: "mainnet",
    networkList: ['mainnet', 'babylonnet', 'carthagenet']
  },
  priceInfo: {}
};

export const state = { ...initialState };

export const actions = {
  async [GET_APP_INFO]({ commit, rootGetters }) {
    commit(SET_APP_INFO, await rootGetters.API.getInfo());
  }
};

export const mutations = {
  [SET_APP_NETWORK](state, network) {
    state.app.network = network;
  },
  [SET_APP_INFO](state, info) {
    state.priceInfo = info.data;
  }
};

export const getters = {
  getAppNetwork: (state) => state.app.network,
  getAppNetworkList: (state) => state.app.networkList
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
