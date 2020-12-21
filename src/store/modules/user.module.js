import { USER_SET_EMAIL } from '@/store/mutations.types';

let initialState;
const settingsLocalStorage = localStorage.getItem('settings');

if (settingsLocalStorage) {
  initialState = JSON.parse(settingsLocalStorage);
} else {
  initialState = {
    email: '',
  };
}

export const state = { ...initialState };

export const actions = {};

export const mutations = {
  [USER_SET_EMAIL](state, email) {
    state.email = email;
    localStorage.setItem('settings', JSON.stringify(state));
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
