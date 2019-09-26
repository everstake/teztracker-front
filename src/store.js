import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import TzAPI from "./tzApi";
Vue.use(Vuex);
export const XTZ = 1000000;

export const ACTIONS = {
  BLOCK_ADD: "BLOCK_ADD",
  BLOCK_SET_HEAD: "BLOCK_SET_HEAD",

  BLOCK_GET_BY_LEVEL: "BLOCK_GET_BY_LEVEL",
  BLOCK_GET_BY_HASH: "BLOCK_GET_BY_HASH",

  BLOCK_SET_SINGLE: "BLOCK_SET_SINGLE",
  BLOCK_GET_HEAD: "BLOCK_GET_HEAD",
  BLOCKS_GET: "BLOCKS_GET",
  BLOCKS_SET: "BLOCKS_SET",
  BLOCKS_REPLACE: "BLOCKS_REPLACE",
  //OPERATIONS
  TRANSACTIONS_SET: "TRANSACTIONS_SET",
  TRANSACTIONS_GET: "TRANSACTIONS_GET",
  SET_TX_COUNT: "SET_TX_COUNT",

  ENDORSEMENTS_SET: "ENDORSEMENTS_ADD",
  SET_ENDORSEMENTS_COUNT: "SET_ENDORSEMENTS_COUNT",


  DELEGATIONS_SET: "DELEGATIONS_ADD",
  DELEGATIONS_GET: "DELEGATIONS_GET",
  SET_DELEGATIONS_COUNT: "SET_DELEGATIONS_COUNT",
  BAKERS_GET: "BAKERS_GET",
  BAKERS_SET: "BAKERS_SET",

  ACCOUNTS_GET: "ACCOUNTS_GET",
  ACCOUNTS_SET: "ACCOUNTS_SET",

  INFO_NEW: "INFO_NEW",
  INFO_GET: "INFO_GET"
};

const API_URL = "https://api-teztracker.everstake.one/v2/data/tezos/mainnet/";

export const api = new TzAPI({ API_URL })



export default new Vuex.Store({
  state: {
    txs: [],
    blocks: [],
    endorsements: [],
    delegations: [],
    bakers: [],
    accounts: [],
    priceInfo: {},
    headBlock: {},
    viewBlock: {},
    app: {
      platform: "tezos",
      network: "mainnet",
      actions: ACTIONS
    },
    counts: {
      txs: 0,
      blocks: 0,
      endorsements: 0,
      delegations: 0,
      bakers: 0,
      accounts: 0
    }
  },
  mutations: {
    [ACTIONS.SET_TX_COUNT]: function (state, count) {
      state.counts.txs = count;
    },
    [ACTIONS.SET_ENDORSEMENTS_COUNT]: function (state, count) {
      state.counts.endorsements = count;
    },
    [ACTIONS.SET_DELEGATIONS_COUNT]: function (state, count) {
      state.counts.delegations = count;
    },
    [ACTIONS.BLOCKS_SET]: function (state, blocks) {
      state.blocks = blocks.data;
      state.counts.blocks = blocks.count;
    },
    [ACTIONS.TRANSACTIONS_SET]: function (state, txs) {
      state.txs = txs.data;
      state.counts.txs = txs.count;
    },
    [ACTIONS.ENDORSEMENTS_SET]: function (state, txs) {
      state.endorsements = txs.data;
      state.counts.endorsements = txs.count;
    },
    [ACTIONS.DELEGATIONS_SET]: function (state, txs) {
      state.delegations = txs.data;
      state.counts.delegations = txs.count;
    },
    [ACTIONS.INFO_NEW]: function (state, info) {
      state.priceInfo = info.data;
    },
    [ACTIONS.BLOCK_SET_HEAD]: function (state, block) {
      state.headBlock = block.data;
    },
    [ACTIONS.BLOCK_SET_SINGLE]: function (state, block) {
      state.viewBlock = block.data.block;
    },
    [ACTIONS.BAKERS_SET]: function (state, data) {
      state.bakers = data.data;
      state.counts.bakers = data.count;
    },
    [ACTIONS.ACCOUNTS_SET]: function (state, data) {
      state.accounts = data.data;
      state.counts.accounts = data.count;
    }
  },
  actions: {
    async [ACTIONS.BLOCKS_GET]({ commit }, params = {}) {
      commit(ACTIONS.BLOCKS_SET, await api.getBlocks(params));
    },
    async [ACTIONS.BLOCK_GET_BY_LEVEL]({ commit }, params = {}) {
      commit(ACTIONS.BLOCK_SET_SINGLE, await api.getBlock({ block: params.block }));
    },
    async [ACTIONS.INFO_GET]({ commit }) {
      commit(ACTIONS.INFO_NEW, await api.getInfo());
    },
    async [ACTIONS.BLOCK_GET_HEAD]({ commit }) {
      commit(ACTIONS.BLOCK_SET_HEAD, await api.getBlockHead());
    },
    async [ACTIONS.TRANSACTIONS_GET]({ commit }, params = {}) {
      commit(ACTIONS.TRANSACTIONS_SET, await api.getTransactions(params));
    },
    async [ACTIONS.DELEGATIONS_GET]({ commit }, params) {
      commit(ACTIONS.DELEGATIONS_SET, await api.getDelegations(params));
    },
    async [ACTIONS.BAKERS_GET]({ commit }, params) {
      commit(ACTIONS.BAKERS_SET, await api.getBakers(params));
    },
    async [ACTIONS.ACCOUNTS_GET]({ commit }, params) {
      commit(ACTIONS.ACCOUNTS_SET, await api.getAccounts(params));
    }
  },
  getters: {
    getBlockById(state) {
      return id => state.blocks.find(el => el.level === id);
    },
    getTransactionById(state) {
      return id => state.txs.find(el => el.hash === id);
    },
    getActions(state) {
      return () => state.app.actions;
    }
  }
});
