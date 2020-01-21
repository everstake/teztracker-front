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

  SNAPSHOTS_GET: "SNAPSHOTS_GET",
  SET_SNAPSHOTS_COUNT: "SET_SNAPSHOTS_COUNT",
  SNAPSHOTS_SET: "SNAPSHOTS_SET",

  BAKINGRIGHTS_GET: "BAKINGRIGHTS_GET",
  SET_BAKINGRIGHTS_COUNT: "SET_BAKINGRIGHTS_COUNT",
  BAKINGRIGHTS_SET: "BAKINGRIGHTS_SET",

  FUTUREBAKINGRIGHTS_GET: "FUTUREBAKINGRIGHTS_GET",
  SET_FUTUREBAKINGRIGHTS_COUNT: "SET_FUTUREBAKINGRIGHTS_COUNT",
  FUTUREBAKINGRIGHTS_SET: "FUTUREBAKINGRIGHTS_SET",
  //OPERATIONS
  TRANSACTIONS_SET: "TRANSACTIONS_SET",
  TRANSACTIONS_GET: "TRANSACTIONS_GET",
  SET_TX_COUNT: "SET_TX_COUNT",

  ENDORSEMENTS_SET: "ENDORSEMENTS_ADD",
  SET_ENDORSEMENTS_COUNT: "SET_ENDORSEMENTS_COUNT",

  ORIGINATIONS_SET: "ORIGINATIONS_SET",
  SET_ORIGINATIONS_COUNT: "SET_ORIGINATIONS_COUNT",
  ORIGINATIONS_GET: "ORIGINATIONS_GET",

  ACTIVATIONS_SET: "ACTIVATIONS_SET",
  SET_ACTIVATIONS_COUNT: "SET_ACTIVATIONS_COUNT",
  ACTIVATIONS_GET: "ACTIVATIONS_GET",

  DOUBLEBAKING_SET: "DOUBLEBAKING_SET",
  SET_DOUBLEBAKING_COUNT: "SET_DOUBLEBAKING_COUNT",
  DOUBLEBAKING_GET: "DOUBLEBAKING_GET",

  DOUBLEENDORSEMENT_SET: "DOUBLEENDORSEMENT_SET",
  SET_DOUBLEENDORSEMENT_COUNT: "SET_DOUBLEENDORSEMENT_COUNT",
  DOUBLEENDORSEMENT_GET: "DOUBLEENDORSEMENT_GET",

  DELEGATIONS_SET: "DELEGATIONS_ADD",
  DELEGATIONS_GET: "DELEGATIONS_GET",
  SET_DELEGATIONS_COUNT: "SET_DELEGATIONS_COUNT",
  BAKERS_GET: "BAKERS_GET",
  BAKERS_SET: "BAKERS_SET",

  ACCOUNTS_GET: "ACCOUNTS_GET",
  ACCOUNTS_SET: "ACCOUNTS_SET",

  CONTRACTS_GET: "CONTRACTS_GET",
  CONTRACTS_SET: "CONTRACTS_SET",

  INFO_NEW: "INFO_NEW",
  INFO_GET: "INFO_GET"
};

const API_URL_MAIN = "https://api-teztracker.everstake.one/v2/data/tezos/mainnet/";
const API_URL_BABYLON = "https://api-teztracker.everstake.one/v2/data/tezos/babylonnet/";


const API = {
  mainnet: new TzAPI({ API_URL: API_URL_MAIN }),
  babylonnet: new TzAPI({ API_URL: API_URL_BABYLON })
};


export default new Vuex.Store({
  state: {
    txs: [],
    blocks: [],
    snapshots: [],
    baking_rights: [],
    future_baking_rights: [],
    endorsements: [],
    delegations: [],
    originations: [],
    activations: [],
    double_baking: [],
    double_endorsement: [],
    bakers: [],
    accounts: [],
    contracts: [],
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
      snapshots: 0,
      baking_rights: 0,
      future_baking_rights: 0,
      endorsements: 0,
      delegations: 0,
      originations: 0,
      activations: 0,
      double_baking: 0,
      double_endorsement: 0,
      bakers: 0,
      accounts: 0,
      contracts: 0
    }
  },
  mutations: {
    setNetwork(state, network) {
      state.app.network = network;
    },
    [ACTIONS.SET_TX_COUNT]: function (state, count) {
      state.counts.txs = count;
    },
    [ACTIONS.SET_ENDORSEMENTS_COUNT]: function (state, count) {
      state.counts.endorsements = count;
    },
    [ACTIONS.SET_DELEGATIONS_COUNT]: function (state, count) {
      state.counts.delegations = count;
    },
    [ACTIONS.SET_ORIGINATIONS_COUNT]: function (state, count) {
      state.counts.originations = count;
    },
    [ACTIONS.SET_ACTIVATIONS_COUNT]: function (state, count) {
      state.counts.activations = count;
    },
    [ACTIONS.SET_DOUBLEBAKING_COUNT]: function (state, count) {
      state.counts.double_baking = count;
    },
    [ACTIONS.SET_DOUBLEENDORSEMENT_COUNT]: function (state, count) {
      state.counts.double_endorsement = count;
    },
    [ACTIONS.SET_SNAPSHOTS_COUNT]: function (state, count) {
      state.counts.snapshots = count;
    },
    [ACTIONS.SET_BAKINGRIGHTS_COUNT]: function (state, count) {
      state.counts.baking_rights = count;
    },
    [ACTIONS.SET_FUTUREBAKINGRIGHTS_COUNT]: function (state, count) {
      state.counts.future_baking_rights = count;
    },
    [ACTIONS.BLOCKS_SET]: function (state, blocks) {
      state.blocks = blocks.data;
      state.counts.blocks = blocks.count;
    },
    [ACTIONS.SNAPSHOTS_SET]: function (state, snapshots) {
      state.snapshots = snapshots.data;
      state.counts.snapshots = snapshots.count;
    },
    [ACTIONS.BAKINGRIGHTS_SET]: function (state, baking_rights) {
      state.baking_rights = baking_rights.data;
      state.counts.baking_rights = baking_rights.count;
    },
    [ACTIONS.FUTUREBAKINGRIGHTS_SET]: function (state, future_baking_rights) {
      state.future_baking_rights = future_baking_rights.data;
      state.counts.future_baking_rights = future_baking_rights.count;
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
    [ACTIONS.ORIGINATIONS_SET]: function (state, originations) {
      state.originations = originations.data;
      state.counts.originations = originations.count;
    },
    [ACTIONS.ACTIVATIONS_SET]: function (state, activations) {
      state.activations = activations.data;
      state.counts.activations = activations.count;
    },
    [ACTIONS.DOUBLEBAKING_SET]: function (state, double_baking) {
      state.double_baking = double_baking.data;
      state.counts.double_baking = double_baking.count;
    },
    [ACTIONS.DOUBLEENDORSEMENT_SET]: function (state, double_endorsement) {
      state.double_endorsement = double_endorsement.data;
      state.counts.double_endorsement = double_endorsement.count;
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
    },
    [ACTIONS.CONTRACTS_SET]: function (state, data) {
      state.contracts = data.data;
      state.counts.contracts = data.count;
    }
  },
  actions: {
    async [ACTIONS.BLOCKS_GET]({ commit, getters }, params = {}) {
      commit(ACTIONS.BLOCKS_SET, await getters.API.getBlocks(params));
    },
    async [ACTIONS.BLOCK_GET_BY_LEVEL]({ commit, getters }, params = {}) {
      commit(ACTIONS.BLOCK_SET_SINGLE, await getters.API.getBlock({ block: params.block }));
    },
    async [ACTIONS.SNAPSHOTS_GET]({ commit, getters }, params = {}) {
      commit(ACTIONS.SNAPSHOTS_SET, await getters.API.getSnapshots(params));
    },
    async [ACTIONS.BAKINGRIGHTS_GET]({ commit, getters }, params = {}) {
      commit(ACTIONS.BAKINGRIGHTS_SET, await getters.API.baking_rights(params));
    },
    async [ACTIONS.FUTUREBAKINGRIGHTS_GET]({ commit, getters }, params = {}) {
      commit(ACTIONS.FUTUREBAKINGRIGHT_SET, await getters.API.future_baking_rights(params));
    },
    async [ACTIONS.INFO_GET]({ commit, getters }) {
      commit(ACTIONS.INFO_NEW, await getters.API.getInfo());
    },
    async [ACTIONS.BLOCK_GET_HEAD]({ commit, getters }) {
      commit(ACTIONS.BLOCK_SET_HEAD, await getters.API.getBlockHead());
    },
    async [ACTIONS.TRANSACTIONS_GET]({ commit, getters }, params = {}) {
      commit(ACTIONS.TRANSACTIONS_SET, await getters.API.getTransactions(params));
    },
    async [ACTIONS.DELEGATIONS_GET]({ commit, getters }, params) {
      commit(ACTIONS.DELEGATIONS_SET, await getters.API.getDelegations(params));
    },
    async [ACTIONS.ORIGINATIONS_GET]({ commit, getters }, params) {
      commit(ACTIONS.ORIGINATIONS_SET, await getters.API.getOriginations(params));
    },
    async [ACTIONS.ACTIVATIONS_GET]({ commit, getters }, params) {
      commit(ACTIONS.ACTIVATIONS_SET, await getters.API.getActivations(params));
    },
    async [ACTIONS.DOUBLEBAKING_GET]({ commit, getters }, params) {
      commit(ACTIONS.DOUBLEBAKING_SET, await getters.API.getDoubleBaking(params));
    },
    async [ACTIONS.DOUBLEENDORSEMENT_GET]({ commit, getters }, params) {
      commit(ACTIONS.DOUBLEENDORSEMENT_SET, await getters.API.getDoubleEndorsement(params));
    },
    async [ACTIONS.BAKERS_GET]({ commit, getters }, params) {
      commit(ACTIONS.BAKERS_SET, await getters.API.getBakers(params));
    },
    async [ACTIONS.ACCOUNTS_GET]({ commit, getters }, params) {
      commit(ACTIONS.ACCOUNTS_SET, await getters.API.getAccounts(params));
    },
    async [ACTIONS.CONTRACTS_GET]({ commit, getters }, params) {
      commit(ACTIONS.CONTRACTS_SET, await getters.API.getContracts(params));
    },
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
    },
    API(state) {
      return API[state.app.network] || API.mainnet;
    }
  }
});
