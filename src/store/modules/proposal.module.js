import { GET_PROPOSAL_PERIOD } from "@/store/actions.types";
import { SET_PROPOSAL_PERIOD } from "@/store/mutations.types";

const initialState = {
  proposal: {}
};

export const state = { ...initialState };

export const actions = {
  async [GET_PROPOSAL_PERIOD]({ commit, rootGetters }, payload) {
    commit(SET_PROPOSAL_PERIOD, await rootGetters.API.getProposalPeriod(payload));
  }
};

export const mutations = {
  [SET_PROPOSAL_PERIOD](state, payload) {
    state.proposal = payload.data;
  }
};

export const getters = {
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
