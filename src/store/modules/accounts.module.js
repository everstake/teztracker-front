import { GET_ACCOUNTS, GET_BAKERS, GET_PUBLIC_BAKERS, GET_CONTRACTS, GET_PUBLIC_BAKERS_SEARCH, GET_ASSETS } from "@/store/actions.types";
import { SET_ACCOUNTS, SET_BAKERS, SET_PUBLIC_BAKERS, SET_CONTRACTS, SET_ASSETS, SET_PUBLIC_BAKERS_SEARCH } from "@/store/mutations.types";

const initialState = {
  accounts: [],
  bakers: [],
  publicBakers: [],
  publicBakersSearch: [],
  contracts: [],
  assets: [],
  counts: {
    bakers: 0,
    publicBakers: 0,
    accounts: 0,
    contracts: 0,
    assets: 0,
  },
};

export const state = { ...initialState };

export const actions = {
  async [GET_BAKERS]({ commit, rootGetters }, params) {
    commit(SET_BAKERS, await rootGetters.API.getBakers(params));
  },
  async [GET_PUBLIC_BAKERS]({ commit, rootGetters }, params) {
    commit(SET_PUBLIC_BAKERS, await rootGetters.API.getPublicBakers(params));
  },
  async [GET_PUBLIC_BAKERS_SEARCH]({ commit, rootGetters }, params) {
    commit(SET_PUBLIC_BAKERS_SEARCH, await rootGetters.API.getPublicBakersSearch(params));
  },
  async [GET_ACCOUNTS]({ commit, rootGetters }, params) {
    commit(SET_ACCOUNTS, await rootGetters.API.getAccounts(params));
  },
  async [GET_CONTRACTS]({ commit, rootGetters }, params) {
    commit(SET_CONTRACTS, await rootGetters.API.getContracts(params));
  },
  async [GET_ASSETS]({ commit, rootGetters }, params) {
    commit(SET_ASSETS, await rootGetters.API.getAssets(params));
  },
};

export const mutations = {
  [SET_BAKERS](state, data) {
    state.bakers = data.data;
    state.counts.bakers = data.count;
  },
  [SET_PUBLIC_BAKERS](state, data) {
    state.publicBakers = data.data;
    state.counts.publicBakers = data.count;
  },
  [SET_PUBLIC_BAKERS_SEARCH](state, data) {
    state.publicBakersSearch = data.data;
  },
  [SET_ACCOUNTS](state, data) {
    state.accounts = data.data;
    state.counts.accounts = data.count;
  },
  [SET_CONTRACTS](state, data) {
    state.contracts = data.data;
    state.counts.contracts = data.count;
  },
  [SET_ASSETS](state, data) {
    state.assets = data.data.map((assets, index) => ({ ...assets, id: index + 1 }));

    state.counts.assets = data.count;
  },
};

export const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
