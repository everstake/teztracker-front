import { GET_PROPOSAL_PERIOD, GET_PERIODS, GET_PROPOSALS, GET_VOTERS, GET_NON_VOTERS, GET_BALLOTS } from "@/store/actions.types";
import { SET_PROPOSAL_PERIOD, SET_PERIODS, SET_VOTERS_COUNT, SET_NON_VOTERS_COUNT, SET_PROPOSALS, SET_VOTERS, SET_NON_VOTERS, SET_BALLOTS, SET_PROTOCOLS_COUNT } from "@/store/mutations.types";
import getPercentage from "@/utils/getPercentage";

const initialState = {
  period: {
    period: {},
    voteStats: {},
    ballots: {}
  },
  periods: [],
  proposals: [],
  voters: [],
  nonVoters: [],
  counts: {
    voters: 0,
    nonVoters: 0,
    protocols: 0
  }
};

export const state = { ...initialState };

export const actions = {
  async [GET_PROPOSAL_PERIOD]({ commit, rootGetters }, payload) {
    commit(SET_PROPOSAL_PERIOD, await rootGetters.API.getPeriod(payload));
  },
  async [GET_PERIODS]({ commit, rootGetters }, payload) {
    commit(SET_PERIODS, await rootGetters.API.getPeriods(payload));
  },
  async [GET_PROPOSALS]({ commit, rootGetters }, payload) {
    commit(SET_PROPOSALS, await rootGetters.API.getProposals(payload));
  },
  async [GET_VOTERS]({ commit, rootGetters }, payload) {
    commit(SET_VOTERS, await rootGetters.API.getVoters(payload));
  },
  async [GET_NON_VOTERS]({ commit, rootGetters }, payload) {
    commit(SET_NON_VOTERS, await rootGetters.API.getNonVoters(payload));
  },
  async [GET_BALLOTS]({ commit, rootGetters }, payload) {
    commit(SET_BALLOTS, await rootGetters.API.getBallots(payload));
  }
};

export const mutations = {
  [SET_PROPOSAL_PERIOD](state, payload) {
    state.period = payload.data;
  },
  [SET_PERIODS](state, payload) {
    state.periods = payload.data;
  },
  [SET_VOTERS_COUNT](state, payload) {
    state.counts.voters = payload;
  },
  [SET_NON_VOTERS_COUNT](state, payload) {
    state.counts.nonVoters = payload;
  },
  [SET_PROPOSALS](state, payload) {
    const { votesAvailable } = state.period.voteStats;

    payload.data.map(proposal => {
      proposal.upvote = getPercentage(votesAvailable, proposal.votesCasted).toFixed(2);
    });

    state.proposals = payload.data;
  },
  [SET_VOTERS](state, payload) {
    state.counts.voters = payload.count;
    state.voters = payload.data;
  },
  [SET_NON_VOTERS](state, payload) {
    state.counts.nonVoters = payload.count;
    state.nonVoters = payload.data;
  },
  [SET_BALLOTS](state, payload) {
    state.counts.voters = payload.count;
    state.voters = payload.data;
  },
  [SET_PROTOCOLS_COUNT](state, payload) {
    state.counts.protocols = payload;
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
