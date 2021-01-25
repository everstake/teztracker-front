import {
  SET_ACCOUNT_EMAIL,
  SET_BEACON_ACCOUNT,
  SET_ACCOUNT_USERNAME,
  SET_ACCOUNT_NOTIFICATION,
  DELETE_ACCOUNT_NOTIFICATION,
  NOTE_ADD,
  NOTE_EDIT,
  NOTE_DELETE,
  FAVORITE_SET,
  FAVORITE_DELETE,
  EDIT_ACCOUNT_NOTIFICATION,
  INIT_EMAIL_RESEND_TIMER,
  SET_ACCOUNTS_NOTIFICATIONS,
  SET_EMAIL_VERIFICATION,
  SET_USER_PROFILE,
  SET_USER_NOTES,
} from '@/store/mutations.types';
import {
  GET_USER_EMAIL,
  GET_ACCOUNTS_NOTIFICATIONS,
  GET_EMAIL_VERIFICATION,
  GET_USER_PROFILE,
  GET_USER_NOTES,
} from '@/store/actions.types';

let favorites = [];

if (localStorage.getItem('favorites') !== null) {
  const storageFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (!Array.isArray(storageFavorites)) {
    localStorage.setItem('favorites', null);
  } else {
    favorites = storageFavorites;
  }
}

let initialState = {
  username: '',
  email: '',
  emailVerified: false,
  emailResendTimer: 300,
  beaconAccount: {},
  notifications: [],
  notes: [],
  favorites: [...favorites],
};

export const state = { ...initialState };

export const actions = {
  async [GET_USER_EMAIL]({ commit, rootGetters }, payload) {
    commit(SET_ACCOUNT_EMAIL, await rootGetters.API.getAccountEmail(payload));
  },
  async [GET_ACCOUNTS_NOTIFICATIONS]({ commit, rootGetters }, payload) {
    commit(
      SET_ACCOUNTS_NOTIFICATIONS,
      await rootGetters.API.getUserNotifications(payload),
    );
  },
  async [GET_EMAIL_VERIFICATION]({ commit, rootGetters }, payload) {
    commit(SET_EMAIL_VERIFICATION, await rootGetters.API.verifyEmail(payload));
  },
  async [GET_USER_PROFILE]({ commit, rootGetters }, payload) {
    commit(SET_USER_PROFILE, await rootGetters.API.getUserProfile(payload));
  },
  async [GET_USER_NOTES]({ commit, rootGetters }, payload) {
    commit(SET_USER_NOTES, await rootGetters.API.getUserNotes(payload));
  },
};

export const mutations = {
  [SET_ACCOUNT_EMAIL](state, payload) {
    state.email = payload;
    state.emailVerified = false;
  },
  [SET_BEACON_ACCOUNT](state, beaconAccount) {
    if (beaconAccount) {
      state.beaconAccount = beaconAccount;
    }
  },
  [SET_ACCOUNT_USERNAME](state, username) {
    state.username = username;
  },
  [SET_ACCOUNT_NOTIFICATION](state, payload) {
    state.notifications.push(payload.data);
  },
  [EDIT_ACCOUNT_NOTIFICATION](state, payload) {
    const foundIndex = state.notifications.findIndex(
      (notification) => notification.accountId === payload.accountId,
    );
    if (foundIndex > -1) {
      state.notifications = [
        ...state.notifications.slice(0, foundIndex),
        payload,
        ...state.notifications.slice(foundIndex + 1),
      ];
    }
  },
  [DELETE_ACCOUNT_NOTIFICATION](state, index) {
    state.notifications = [
      ...state.notifications.slice(0, index),
      ...state.notifications.slice(index + 1),
    ];
  },
  [NOTE_ADD](state, note) {
    const foundIndex = state.notes.findIndex(({ text }) => text === note.text);

    if (foundIndex > -1) {
      state.notes = [
        ...state.notes.slice(0, foundIndex),
        note,
        ...state.notes.slice(foundIndex + 1),
      ];
    } else {
      state.notes.push(note);
    }
  },
  [NOTE_EDIT](state, note) {
    const index = state.notes.findIndex(({ text }) => text === note.text);
    state.notes = [
      ...state.notes.slice(0, index),
      note,
      ...state.notes.slice(index + 1),
    ];
  },
  [NOTE_DELETE](state, note) {
    const index = state.notes.findIndex(
      ({ accountId }) => accountId === note.accountId,
    );
    state.notes = [
      ...state.notes.slice(0, index),
      ...state.notes.slice(index + 1),
    ];
  },
  [FAVORITE_SET](state, accountId) {
    state.favorites.push(accountId);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  },
  [FAVORITE_DELETE](state, accountId) {
    const foundFavoriteIndex = state.favorites.findIndex(
      (favorite) => favorite === accountId,
    );

    if (foundFavoriteIndex !== -1) {
      state.favorites.splice(foundFavoriteIndex, 1);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  },
  [INIT_EMAIL_RESEND_TIMER](state) {
    if (state.emailResendTimer > 0) {
      setInterval(() => {
        state.emailResendTimer--;
      }, 1000);
    }
  },
  [SET_ACCOUNTS_NOTIFICATIONS](state, data) {
    state.notifications = data.data;
  },
  [SET_EMAIL_VERIFICATION](state, payload) {
    state.emailVerified = payload;
  },
  [SET_USER_PROFILE](state, payload) {
    const { data } = payload;
    state.email = data.email;
    state.username = data.username;
    state.emailVerified = data.verified;
  },
  [SET_USER_NOTES](state, data) {
    state.notes = data.data;
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
