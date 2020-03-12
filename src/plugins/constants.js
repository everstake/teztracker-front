import Vue from "vue";

const constants = {
  COUNT_HEADER: "x-total-count", // custom request header
  BLOCKS_IN_ROW: 6,
  INITIAL_CURRENT_PAGE: 1,
  PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 20, 50, 100],
  PER_PAGE_SNAPSHOTS: 6,
  STATUS_SUCCESS: 200,
  USD_PRECISION: 2,
  DATE_FORMAT: "DD.MM.YY HH:mm:ss",
  DATE_FORMAT_US: "MM.DD.YY HH:mm:ss",
  ENDORSEMENTS_LIMIT: 32, // Max number of endorsements for a block
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
  DEV_API_BASE_URLS: {
    mainnet: "http://144.76.66.20:8085/v2/data/tezos/mainnet/",
    babylonnet: "http://144.76.66.20:8085/v2/data/tezos/babylonnet/",
    carthagenet: "http://144.76.66.20:8085/v2/data/tezos/carthagenet/"
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
