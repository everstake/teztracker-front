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

const votingEndpoint = "https://api-teztracker.everstake.one/v2/data/mainnet/";

const TzAPI = {
  API_URL() {
    return Vue.prototype.$constants.API_BASE_URLS[state.app.network];
  },
  getVotingUrl() {
    return votingEndpoint;
  },
  getAccounts(opts = {}) {
    return get(this.API_URL(), "accounts", opts);
  },
  getAccount(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/${account}`, opts);
  },
  getContracts(opts = {}) {
    return get(this.API_URL(), "contracts", opts);
  },
  getBakers(opts = {}) {
    return get(this.API_URL(), "bakers", opts);
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
    return get(this.getVotingUrl(), 'period', opts);
  },
  getPeriods(opts = {}) {
    return get(this.getVotingUrl(), 'periods', opts);
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
  }
};

export default TzAPI;
