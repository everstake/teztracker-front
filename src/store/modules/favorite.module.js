import { FAVORITE_SET, FAVORITE_DELETE } from '@/store/mutations.types';

let initialState;
const favoritesFromStorage = localStorage.getItem('favorites');

if (favoritesFromStorage) {
  initialState = JSON.parse(favoritesFromStorage);
} else {
  initialState = {
    account: [],
    contract: [],
    baker: [],
    publicBaker: [],
  };
}

export const state = { ...initialState };

export const actions = {};

export const mutations = {
  [FAVORITE_SET](state, payload) {
    const key = Object.keys(payload);
    const value = payload[key];
    state[key].push(value);
    localStorage.setItem('favorites', JSON.stringify(state));
  },
  [FAVORITE_DELETE](state, payload) {
    const key = Object.keys(payload);
    const value = payload[key];
    const foundFavoriteIndex = state[key].findIndex((favorite) => favorite === value);

    if (foundFavoriteIndex !== -1) {
      state[key].splice(foundFavoriteIndex, 1);
      localStorage.setItem('favorites', JSON.stringify(state));
    }
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
