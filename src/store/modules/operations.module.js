import {
  SET_ACTIVATIONS,
  SET_ACTIVATIONS_COUNT,
  SET_DELEGATIONS,
  SET_DELEGATIONS_COUNT,
  SET_DOUBLE_BAKING,
  SET_DOUBLE_BAKING_COUNT,
  SET_DOUBLE_ENDORSEMENT,
  SET_DOUBLE_ENDORSEMENT_COUNT,
  SET_ORIGINATIONS,
  SET_ORIGINATIONS_COUNT,
  SET_TRANSACTIONS,
  SET_TX_COUNT,
} from '@/store/mutations.types';

import {
  GET_ACTIVATIONS,
  GET_DELEGATIONS,
  GET_DOUBLE_BAKING,
  GET_DOUBLE_ENDORSEMENT,
  GET_ORIGINATIONS,
  GET_TRANSACTIONS,
} from '@/store/actions.types';

const initialState = {
  txs: [],
  delegations: [],
  originations: [],
  activations: [],
  double_baking: [],
  double_endorsement: [],
  counts: {
    txs: 0,
    delegations: 0,
    originations: 0,
    activations: 0,
    double_baking: 0,
    double_endorsement: 0,
  },
};

const state = { ...initialState };

export const actions = {
  async [GET_TRANSACTIONS]({ commit, rootGetters }, params = {}) {
    commit(SET_TRANSACTIONS, await rootGetters.API.getTransactions(params));
  },
  async [GET_DELEGATIONS]({ commit, rootGetters }, params) {
    commit(SET_DELEGATIONS, await rootGetters.API.getDelegations(params));
  },
  async [GET_ORIGINATIONS]({ commit, rootGetters }, params) {
    commit(SET_ORIGINATIONS, await rootGetters.API.getOriginations(params));
  },
  async [GET_ACTIVATIONS]({ commit, rootGetters }, params) {
    commit(SET_ACTIVATIONS, await rootGetters.API.getActivations(params));
  },
  async [GET_DOUBLE_BAKING]({ commit, rootGetters }, params) {
    commit(SET_DOUBLE_BAKING, await rootGetters.API.getDoubleBaking(params));
  },
  async [GET_DOUBLE_ENDORSEMENT]({ commit, getters }, params) {
    commit(
      SET_DOUBLE_ENDORSEMENT,
      await getters.API.getDoubleEndorsement(params),
    );
  },
};

export const mutations = {
  [SET_TX_COUNT](state, count) {
    state.counts.txs = count;
  },
  [SET_DELEGATIONS_COUNT](state, count) {
    state.counts.delegations = count;
  },
  [SET_ORIGINATIONS_COUNT](state, count) {
    state.counts.originations = count;
  },
  [SET_ACTIVATIONS_COUNT](state, count) {
    state.counts.activations = count;
  },
  [SET_DOUBLE_BAKING_COUNT](state, count) {
    state.counts.double_baking = count;
  },
  [SET_DOUBLE_ENDORSEMENT_COUNT](state, count) {
    state.counts.double_endorsement = count;
  },
  [SET_TRANSACTIONS](state, txs) {
    state.txs = txs.data;
    state.counts.txs = txs.count;
  },
  [SET_DELEGATIONS](state, txs) {
    state.delegations = txs.data;
    state.counts.delegations = txs.count;
  },
  [SET_ORIGINATIONS](state, originations) {
    state.originations = originations.data;
    state.counts.originations = originations.count;
  },
  [SET_ACTIVATIONS](state, activations) {
    state.activations = activations.data;
    state.counts.activations = activations.count;
  },
  [SET_DOUBLE_BAKING](state, double_baking) {
    state.double_baking = double_baking.data;
    state.counts.double_baking = double_baking.count;
  },
  [SET_DOUBLE_ENDORSEMENT](state, double_endorsement) {
    state.double_endorsement = double_endorsement.data;
    state.counts.double_endorsement = double_endorsement.count;
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
