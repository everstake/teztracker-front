import { FAVORITE_SET, FAVORITE_DELETE } from '@/store/mutations.types';

let initialState;
const favoritesLocalStorage = localStorage.getItem('favorites');

if (favoritesLocalStorage) {
  initialState = JSON.parse(favoritesLocalStorage);
} else {
  initialState = {
    favoriteList: [],
  };
}

export const state = { ...initialState };

export const actions = {};

export const mutations = {
  [FAVORITE_SET](state, accountId) {
    state.favoriteList.push(accountId);
    localStorage.setItem('favorites', JSON.stringify(state));
  },
  [FAVORITE_DELETE](state, accountId) {
    const foundFavoriteIndex = state.favoriteList.findIndex((favorite) => favorite === accountId);

    if (foundFavoriteIndex !== -1) {
      state.favoriteList.splice(foundFavoriteIndex, 1);
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
