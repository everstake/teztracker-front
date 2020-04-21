import Vue from "vue";
import http from "./http.service";
import querystring from "querystring";
import { state } from "@/store/modules/app.module";

function formatURL(api, path, query) {
  return `${api}${path}?${querystring.stringify(query)}`;
}

async function get(api, path, query, isStandard = true) {
  const { page = 1, limit = 10 } = query;
  const offset = limit * (page - 1);
  let data;
  try {
    data = await http.get(
      isStandard
        ? formatURL(api, path, Object.assign({}, query, { limit, offset }))
        : formatURL(api, path, Object.assign({}, query))
    );
  } catch (e) {
    data = e.response;
  }
  const result = { data: data.data, status: data.status };
  if (data.headers[Vue.prototype.$constants.COUNT_HEADER]) {
    result.count = parseInt(
      data.headers[Vue.prototype.$constants.COUNT_HEADER]
    );
  }
  return result;
}

const TzAPI = {
  API_URL() {
    return Vue.prototype.$constants.API_BASE_URLS[state.network];
  },
  getVotingUrl() {
    return Vue.prototype.$constants.API_BASE_URLS.voting;
  },
  getAccounts(opts = {}) {
    return get(this.API_URL(), "accounts", opts);
  },
  getAccount(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/${account}`, opts);
  },
  getAccountBalance(opts = {}) {
    const { account } = opts;
    return get(
      this.API_URL(),
      `accounts/balances/${account}`,
      {
        from: opts.from,
        to: opts.to
      },
      false
    );
  },
  getContracts(opts = {}) {
    return get(this.API_URL(), "contracts", opts);
  },
  getBakers(opts = {}) {
    return get(this.API_URL(), "bakers", opts);
  },
  getPublicBakers(opts = {}) {
    return get(this.API_URL(), "public_bakers", opts);
  },
  getTransactions(opts = {}) {
    const options = { ...opts };
    if (!options.operation_id) {
      options.operation_kind = "transaction";
    }
    return get(this.API_URL(), "operations", options);
  },
  getEndorsements(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "endorsement",
      ...opts
    });
  },
  getDelegations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "delegation",
      ...opts
    });
  },
  getOperations(opts = {}) {
    return get(this.API_URL(), "operations", opts, false);
  },
  getOriginations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "origination",
      ...opts
    });
  },
  getActivations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "activate_account",
      ...opts
    });
  },
  getDoubleBaking(opts = {}) {
    return get(this.API_URL(), "double_bakings", {
      ...opts
    });
  },
  getDoubleEndorsement(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "double_endorsement_evidence",
      ...opts
    });
  },
  getBlockHead(opts = {}) {
    return get(this.API_URL(), "blocks/head", opts);
  },
  getInfo(opts = {}) {
    return get(this.API_URL(), "info", opts);
  },
  getBlock(opts = {}) {
    const { block = "head" } = opts;
    // TODO: Refactor API service
    delete opts.block;
    return get(this.API_URL(), `blocks/${block}`, opts, false);
  },
  getBlockEndorsements(opts = {}) {
    const { block_id } = opts;
    // TODO: Refactor API service
    delete opts.block_id;
    return get(this.API_URL(), `blocks/${block_id}/endorsements`, opts, false);
  },
  getBlocks(opts = {}) {
    return get(this.API_URL(), "blocks", opts);
  },
  getSnapshots(opts = {}) {
    return get(this.API_URL(), "snapshots", opts);
  },
  getBakingRights(opts = {}) {
    return get(this.API_URL(), "baking_rights", opts);
  },
  getFutureBakingRights(opts = {}) {
    return get(this.API_URL(), "future_baking_rights", opts);
  },
  getPeriod(opts = {}) {
    return get(this.getVotingUrl(), "period", opts);
  },
  getPeriods(opts = {}) {
    return get(this.getVotingUrl(), "periods", opts);
  },
  getProposals(opts = {}) {
    return get(this.getVotingUrl(), `proposals`, opts);
  },
  getBallots(opts = {}) {
    const { id } = opts;
    return get(this.getVotingUrl(), `ballots/${id}`, opts);
  },
  getBallot(opts = {}) {
    return get(this.API_URL(), "operations", {
      ...opts
    });
  },
  getVoters(opts = {}) {
    const { id } = opts;
    return get(this.getVotingUrl(), `proposal_votes/${id}`, opts);
  },
  getNonVoters(opts = {}) {
    const { id } = opts;
    return get(this.getVotingUrl(), `non_voters/${id}`, opts);
  },
  getProtocols(opts = {}) {
    return get(this.getVotingUrl(), `protocols`, opts);
  },
  // getOperations(opts = {}) {
  //   return get(this.API_URL(), "operations", opts);
  // },
  getCharts(opts = {}) {
    // return get(this.API_URL(), "charts", opts, false);
    return Promise.resolve({
      status: 200,
      data: [
        // { timestamp: 1584921600000, blocks: 20 },
        // { timestamp: 1585008000000, blocks: 2 },
        // { timestamp: 1585094400000, blocks: 4 },
        // { timestamp: 1585267200000, blocks: 10 },
        // { timestamp: 1585353600000, blocks: 1 },
        // { timestamp: 1585526400000, blocks: 12 },
        // { timestamp: 1585612800000, blocks: 21 },
        // { timestamp: 1585699200000, blocks: 14 },
        // { timestamp: 1585785600000, blocks: 22 },
        // { timestamp: 1586131200000, blocks: 79 },
        // { timestamp: 1586217600000, blocks: 37 },
        // { timestamp: 1586304000000, blocks: 39 },
        // { timestamp: 1586390400000, blocks: 112 },
        // { timestamp: 1586563200000, blocks: 44 },
        // { timestamp: 1586649600000, blocks: 99 },
        // { timestamp: 1586736000000, blocks: 100 }
  
        { timestamp: 1584921600000, blocks: 60 },
        { timestamp: 1585008000000, blocks: 70 },
        { timestamp: 1585094400000, blocks: 90 },
        { timestamp: 1585267200000, blocks: 120 },
        { timestamp: 1585353600000, blocks: 62 },
        { timestamp: 1585526400000, blocks: 65 },
        { timestamp: 1585612800000, blocks: 60 },
        { timestamp: 1585699200000, blocks: 61 },
        { timestamp: 1585785600000, blocks: 80 },
        { timestamp: 1586131200000, blocks: 75 },
        { timestamp: 1586217600000, blocks: 63 },
        { timestamp: 1586304000000, blocks: 64 },
        { timestamp: 1586390400000, blocks: 60 },
        { timestamp: 1586563200000, blocks: 60 },
        { timestamp: 1586649600000, blocks: 60 },
        { timestamp: 1586736000000, blocks: 67 }
      ]
    });
  }
};

export default TzAPI;
