import { GET_ACCOUNTS, GET_BAKERS, GET_CONTRACTS } from "@/store/actions.types";
import { SET_ACCOUNTS, SET_BAKERS, SET_CONTRACTS } from "@/store/mutations.types";

const initialState = {
  accounts: [],
  bakers: [],
  contracts: [],
  counts: {
    bakers: 0,
    accounts: 0,
    contracts: 0
  }
};

export const state = { ...initialState };

export const actions = {
  async [GET_BAKERS]({ commit, rootGetters }, params) {
    commit(SET_BAKERS, await rootGetters.API.getBakers(params));
  },
  async [GET_ACCOUNTS]({ commit, rootGetters }, params) {
    commit(SET_ACCOUNTS, await rootGetters.API.getAccounts(params));
  },
  async [GET_CONTRACTS]({ commit, rootGetters }, params) {
    commit(SET_CONTRACTS, await rootGetters.API.getContracts(params));
  }
};

export const mutations = {
  [SET_BAKERS](state, data) {
    state.bakers = data.data;
    state.counts.bakers = data.count;
  },
  [SET_ACCOUNTS](state, data) {
    state.accounts = data.data;
    state.counts.accounts = data.count;
  },
  [SET_CONTRACTS](state, data) {
    state.contracts = data.data;
    state.counts.contracts = data.count;
  }
};

export const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
