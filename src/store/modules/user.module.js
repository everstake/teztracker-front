import { USER_SET_EMAIL, SET_BEACON_ACCOUNT } from '@/store/mutations.types';

let initialState;
const settingsLocalStorage = localStorage.getItem('settings');

if (settingsLocalStorage) {
  initialState = JSON.parse(settingsLocalStorage);
} else {
  initialState = {
    email: '',
    beaconAccount: null,
  };
}

export const state = { ...initialState };

export const actions = {};

export const mutations = {
  [USER_SET_EMAIL](state, email) {
    state.email = email;
    localStorage.setItem('settings', JSON.stringify(state));
  },
  [SET_BEACON_ACCOUNT](state, beaconAccount) {
    state.beaconAccount = beaconAccount;
  },
};

export const getters = {
  isBeaconAccountSet(state) {
    return Boolean(
      state.beaconAccount && Object.keys(state.beaconAccount).length,
    );
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
