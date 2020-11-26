import { SET_BEACON_ACCOUNT } from '@/store/mutations.types';

const initialState = {
  beaconAccount: null,
};

export const state = { ...initialState };

export const getters = {
  isBeaconAccountSet(state) {
    return Boolean(
      state.beaconAccount && Object.keys(state.beaconAccount).length,
    );
  },
};

export const mutations = {
  [SET_BEACON_ACCOUNT](state, beaconAccount) {
    state.beaconAccount = beaconAccount;
  },
};

export const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
