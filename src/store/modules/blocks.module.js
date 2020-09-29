import {
  GET_BLOCKS,
  GET_BLOCK_HEAD,
  GET_BLOCK_BY_LEVEL,
  GET_BAKING_RIGHTS,
  GET_FUTURE_BAKING_RIGHTS,
  GET_SNAPSHOTS,
} from '@/store/actions.types';

import {
  SET_BLOCK,
  SET_BLOCK_HEAD,
  SET_BLOCK_SINGLE,
  SET_BAKING_RIGHTS,
  SET_BAKING_RIGHTS_COUNT,
  SET_ENDORSEMENTS,
  SET_ENDORSEMENTS_COUNT,
  SET_FUTURE_BAKING_RIGHTS,
  SET_FUTURE_BAKING_RIGHTS_COUNT,
  SET_SNAPSHOTS,
  SET_SNAPSHOTS_COUNT,
} from '@/store/mutations.types';

const initialState = {
  headBlock: {},
  blocks: [],
  snapshots: [],
  baking_rights: [],
  future_baking_rights: [],
  endorsements: [],
  counts: {
    blocks: 0,
    snapshots: 0,
    baking_rights: 0,
    future_baking_rights: 0,
    endorsements: 0,
  },
};

export const state = { ...initialState };

export const actions = {
  async [GET_BLOCK_HEAD]({ commit, rootGetters }) {
    commit(SET_BLOCK_HEAD, await rootGetters.API.getBlockHead());
  },
  async [GET_BLOCKS]({ commit, rootGetters }, params = {}) {
    commit(SET_BLOCK, await rootGetters.API.getBlocks(params));
  },
  async [GET_BLOCK_BY_LEVEL]({ commit, rootGetters }, params = {}) {
    commit(
      SET_BLOCK_SINGLE,
      await rootGetters.API.getBlock({ block: params.block }),
    );
  },
  async [GET_SNAPSHOTS]({ commit, rootGetters }, params = {}) {
    commit(SET_SNAPSHOTS, await rootGetters.API.getSnapshots(params));
  },
  async [GET_BAKING_RIGHTS]({ commit, rootGetters }, params = {}) {
    commit(SET_BAKING_RIGHTS, await rootGetters.API.baking_rights(params));
  },
  async [GET_FUTURE_BAKING_RIGHTS]({ commit, rootGetters }, params = {}) {
    commit(
      SET_FUTURE_BAKING_RIGHTS,
      await rootGetters.API.future_baking_rights(params),
    );
  },
};
export const mutations = {
  [SET_BLOCK_HEAD](state, block) {
    state.headBlock = block.data;
  },
  [SET_BLOCK](state, blocks) {
    state.blocks = blocks.data;
    state.counts.blocks = blocks.count;
  },
  [SET_SNAPSHOTS](state, snapshots) {
    state.snapshots = snapshots.data;
    state.counts.snapshots = snapshots.count;
  },
  [SET_BAKING_RIGHTS](state, baking_rights) {
    state.baking_rights = baking_rights.data;
    state.counts.baking_rights = baking_rights.count;
  },
  [SET_FUTURE_BAKING_RIGHTS](state, future_baking_rights) {
    state.future_baking_rights = future_baking_rights.data;
    state.counts.future_baking_rights = future_baking_rights.count;
  },
  [SET_ENDORSEMENTS](state, txs) {
    state.endorsements = txs.data;
    state.counts.endorsements = txs.count;
  },
  [SET_BLOCK_SINGLE](state, block) {
    state.viewBlock = block.data.block;
  },
  [SET_SNAPSHOTS_COUNT](state, count) {
    state.counts.snapshots = count;
  },
  [SET_BAKING_RIGHTS_COUNT](state, count) {
    state.counts.baking_rights = count;
  },
  [SET_FUTURE_BAKING_RIGHTS_COUNT](state, count) {
    state.counts.future_baking_rights = count;
  },
  [SET_ENDORSEMENTS_COUNT](state, count) {
    state.counts.endorsements = count;
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
