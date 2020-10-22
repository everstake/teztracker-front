import Vue from 'vue';

const constants = {
  COUNT_HEADER: 'x-total-count', // custom request header
  BLOCKS_IN_ROW: 6,
  INITIAL_CURRENT_PAGE: 1,
  PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 20, 50, 100, 200],
  PER_PAGE_SNAPSHOTS: 6,
  STATUS_SUCCESS: 200,
  USD_PRECISION: 2,
  DATE_FORMAT: 'DD.MM.YYYY HH:mm:ss',
  DATE_FORMAT_US: 'MM.DD.YYYY HH:mm:ss',
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
    mainnet: process.env.VUE_APP_ROOT_API + '/v2/data/tezos/mainnet/',
    carthagenet: process.env.VUE_APP_ROOT_API + '/v2/data/tezos/carthagenet/',
    mainnetWithoutPlatform: process.env.VUE_APP_ROOT_API + '/v2/data/mainnet/',
  },
  SEARCH_PREFIXES: {
    account: ['KT', 'tz'],
    operation: ['o'],
    block: ['B'],
  },
  DEFAULT_LANGUAGE: process.env.VUE_APP_I18N_LOCALE,
  FALLBACK_LANGUAGE: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  SUPPORTED_LANGUAGES: process.env.VUE_APP_I18N_SUPPORTED_LOCALES.split(','),
};

Vue.use({
  install() {
    Vue.prototype.$constants = constants;
  },
});

export { constants };
