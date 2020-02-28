import Vue from "vue";

const constants = {
  COUNT_HEADER: "x-total-count", // what's this for ?
  BLOCKS_IN_ROW: 6,
  INITIAL_CURRENT_PAGE: 1,
  PER_PAGE: 10,
  PER_PAGE_SNAPSHOTS: 6,
  PAGE_OPTIONS: [10, 15, 20, 25, 30],
  STATUS_SUCCESS: 200,
  USD_PRECISION: 2,
  TIME_FORMAT: "HH:mm:ss DD.MM.YY",
  ENDORSEMENTS_LIMIT: 32, // why 32?
  MAX_HASH_LENGTH: 20,
  ALL_ICO_ACTIVE_ADDRESSES: 30317,
  XTZ: 1000000,
  THOUSAND_MILLISECONDS: 1000,
  // 1000 (one second in milliseconds)
  // * 60 (seconds)
  // * 60 (minutes)
  // * 24 (hours)
  DAY_IN_MILLISECONDS: 86400000,
  BLOCKS_IN_CYCLE_MAINNET: 4096,
  BLOCKS_IN_CYCLE_TESTNET: 2048, // twice lesser than in mainnet
  CYCLES_IN_VOTING_PERIOD: 8,
  API_BASE_URLS: {
    mainnet: "https://api-teztracker.everstake.one/v2/data/tezos/mainnet/",
    babylonnet: "https://api-teztracker.everstake.one/v2/data/tezos/babylonnet/",
    carthagenet: "https://api-teztracker.everstake.one/v2/data/tezos/carthagenet/"
  },
  SEARCH_PREFIXES: {
    account: ["tz", "KT"],
    operation: ["o"],
    block: ["B"]
  },
};

Vue.use({
  install() {
    Vue.prototype.$constants = constants;
  }
});
