import { GET_PROPOSAL_PERIOD, GET_PERIODS } from "@/store/actions.types";
import { SET_PROPOSAL_PERIOD, SET_PERIODS, SET_VOTERS_COUNT, SET_NON_VOTERS_COUNT } from "@/store/mutations.types";

const initialState = {
  proposal: {
    period: {
      periodType: ''
    }
  },
  periods: [],
  counts: {
    voters: 0,
    nonVoters: 0
  }
};

export const state = { ...initialState };

export const actions = {
  async [GET_PROPOSAL_PERIOD]({ commit, rootGetters }, payload) {
    commit(SET_PROPOSAL_PERIOD, await rootGetters.API.getPeriod(payload));
  },
  async [GET_PERIODS]({ commit, rootGetters }, payload) {
    commit(SET_PERIODS, await rootGetters.API.getPeriods(payload));
  }
};

export const mutations = {
  [SET_PROPOSAL_PERIOD](state, payload) {
    state.proposal = payload.data;
  },
  [SET_PERIODS](state, payload) {
    state.periods = payload.data;
  },
  [SET_VOTERS_COUNT](state, payload) {
    state.counts.voters = payload;
  },
  [SET_NON_VOTERS_COUNT](state, payload) {
    state.counts.nonVoters = payload;
  }
};

export const getters = {
  getProposalPeriod: state => state.proposal,
  getPeriods: state => state.periods
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
