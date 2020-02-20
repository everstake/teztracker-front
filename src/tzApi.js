import axios from "axios";
import _ from "lodash";
import querystring from "querystring";

const COUNT_HEADER = "x-total-count";

function formatURL(api, path, query) {
  return `${api}${path}?${querystring.stringify(query)}`;
}

async function get(api, path, query) {
  const { page = 1, limit = 10 } = query;
  const offset = limit * (page - 1);
  let data;
  try {
    data = await axios.get(
      formatURL(api, path, Object.assign({}, query, { limit, offset }))
    );
  } catch (e) {
    data = e.response;
  }
  const result = { data: data.data, status: data.status };
  if (data.headers[COUNT_HEADER]) {
    result.count = parseInt(data.headers[COUNT_HEADER]);
  }
  return result;
}

export default class TzAPI {
  constructor(opts = {}) {
    this.api = opts.API_URL;
  }
  setAPIURL(url) {
    this.api = url;
  }
  API_URL() {
    return this.api;
  }

  getAccounts(opts = {}) {
    return get(this.API_URL(), "accounts", opts);
  }
  getAccount(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/${account}`, opts);
  }
  getContracts(opts = {}) {
    return get(this.API_URL(), "contracts", opts);
  }
  getBakers(opts = {}) {
    return get(this.API_URL(), "bakers", opts);
  }
  getTransactions(opts = {}) {
    const options = { ...opts };
    if (!options.operation_id) {
      options.operation_kind = "transaction";
    }
    return get(this.API_URL(), "operations", options);
  }
  getEndorsements(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "endorsement",
      ...opts
    });
  }
  getDelegations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "delegation",
      ...opts
    });
  }
  getOriginations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "origination",
      ...opts
    });
  }
  getActivations(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "activate_account",
      ...opts
    });
  }
  getDoubleBaking(opts = {}) {
    return get(this.API_URL(), "double_bakings", {
      ...opts
    });
  }
  getDoubleEndorsement(opts = {}) {
    return get(this.API_URL(), "operations", {
      operation_kind: "double_endorsement_evidence",
      ...opts
    });
  }
  getBlockHead(opts = {}) {
    return get(this.API_URL(), "blocks/head", opts);
  }
  getInfo(opts = {}) {
    return get(this.API_URL(), "info", opts);
  }
  getBlock(opts = {}) {
    const { block = "head" } = opts;
    return get(this.API_URL(), `blocks/${block}`, opts);
  }
  getBlockEndorsements(opts = {}) {
    const { block_id } = opts;
    return get(this.API_URL(), `blocks/${block_id}/endorsements`, opts);
  }
  getBlocks(opts = {}) {
    return get(this.API_URL(), "blocks", opts);
  }
  getSnapshots(opts = {}) {
    return get(this.API_URL(), "snapshots", opts);
  }
  getBakingRights(opts = {}) {
    return get(this.API_URL(), "baking_rights", opts);
  }
  getFutureBakingRights(opts = {}) {
    return get(this.API_URL(), "future_baking_rights", opts);
  }
}
