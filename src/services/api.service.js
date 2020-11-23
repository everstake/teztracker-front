import Vue from 'vue';
import http from './http.service';
import querystring from 'querystring';
import { state } from '@/store/modules/app.module';
import handleError from '@/utils/errorsHandler';

function formatURL(api, path, query) {
  return `${api}${path}?${querystring.stringify(query)}`;
}

async function get(api, path, query, isStandard = true) {
  const { page = 1, limit = 10 } = query;
  const offset = limit * (page - 1);
  delete query.page;
  let data = {};
  let result = {};
  try {
    data = await http.get(
      isStandard
        ? formatURL(api, path, Object.assign({}, query, { limit, offset }))
        : formatURL(api, path, Object.assign({}, query)),
    );

    result.data = data.data;
    result.status = data.status;

    if (data.headers && data.headers[Vue.prototype.$constants.COUNT_HEADER]) {
      result.count = parseInt(
        data.headers[Vue.prototype.$constants.COUNT_HEADER],
      );
    }

    result = { ...result, data: data.data, status: data.status };
    return result;
  } catch (e) {
    const responseNotDefined = !e.response;
    const requestHasBeenCancelled = e.message === 'Request cancelled';

    if (responseNotDefined && requestHasBeenCancelled) {
      return;
    }
    handleError(e);

    data = e.response;

    if (data.headers && data.headers[Vue.prototype.$constants.COUNT_HEADER]) {
      result.count = parseInt(
        data.headers[Vue.prototype.$constants.COUNT_HEADER],
      );
    }

    result = { ...result, data: data.data, status: data.status };
    return result;
  }
}

const TzAPI = {
  API_URL() {
    return Vue.prototype.$constants.API_BASE_URLS[state.network];
  },
  API_URL_WITHOUT_PLATFORM() {
    return Vue.prototype.$constants.API_BASE_URLS.mainnetWithoutPlatform;
  },
  getAccounts(opts = {}) {
    return get(this.API_URL(), 'accounts', opts);
  },
  getTopAccounts(opts = {}) {
    return get(this.API_URL(), 'accounts/top_balance', opts);
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
        to: opts.to,
      },
      false,
    );
  },
  getAccountRewards(opts = {}) {
    const { account } = opts;
    delete opts.account;
    return get(this.API_URL(), `accounts/rewards/${account}`, opts);
  },
  getAccountBaking(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/baking/${account}`, opts);
  },
  getAccountBakingItem(opts = {}) {
    const { account, cycleId } = opts;
    return get(
      this.API_URL(),
      `accounts/baking/${account}/blocks/${cycleId}`,
      opts,
      true,
    );
  },
  getAccountBakingRightsFuture(opts = {}) {
    const { account, cycleId } = opts;
    return get(
      this.API_URL(),
      `accounts/baking/${account}/future_baking_rights/${cycleId}`,
      opts,
      true,
    );
  },
  getAccountRewardsDelegators(opts = {}) {
    const { account, cycleId } = opts;
    return get(
      this.API_URL(),
      `accounts/${account}/delegators/${cycleId}`,
      opts,
      true,
    );
  },
  getAccountBakingTotal(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/baking/${account}/total`, opts);
  },
  getAccountBakingFuture(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/baking/${account}/future`, opts);
  },
  getAccountEndorsing(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/endorsing/${account}`, opts);
  },
  getAccountEndorsingItem(opts = {}) {
    const { account, cycleId } = opts;
    return get(
      this.API_URL(),
      `accounts/endorsing/${account}/endorsements/${cycleId}`,
      opts,
    );
  },
  getAccountEndorsingRightsFuture(opts = {}) {
    const { account, cycleId } = opts;
    return get(
      this.API_URL(),
      `accounts/endorsing/${account}/future_endorsement_rights/${cycleId}`,
      opts,
      true,
    );
  },
  getAccountEndorsingTotal(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/endorsing/${account}/total`, opts);
  },
  getAccountEndorsingFuture(opts = {}) {
    const { account } = opts;
    return get(this.API_URL(), `accounts/endorsing/${account}/future`, opts);
  },
  getAccountBonds(opts = {}) {
    const { account } = opts;
    return get(
      this.API_URL(),
      `accounts/security_deposit/${account}/future`,
      opts,
    );
  },
  getAccountReport(opts = {}) {
    const { account } = opts;
    delete opts.account;
    return get(this.API_URL(), `accounts/${account}/report`, opts, false);
  },
  getContracts(opts = {}) {
    return get(this.API_URL(), 'contracts', opts);
  },
  getBakers(opts = {}) {
    return get(this.API_URL(), 'bakers', opts);
  },
  getPublicBakers(opts = {}) {
    return get(this.API_URL(), 'public_bakers', opts);
  },
  getPublicBakersSearch(opts = {}) {
    return get(this.API_URL(), 'public_bakers/search', opts);
  },
  getTransactions(opts = {}) {
    const options = { ...opts };
    if (!options.operation_id) {
      options.operation_kind = 'transaction';
    }
    return get(this.API_URL(), 'operations', options);
  },
  getEndorsements(opts = {}) {
    return get(this.API_URL(), 'operations', {
      operation_kind: 'endorsement',
      ...opts,
    });
  },
  getDelegations(opts = {}) {
    return get(this.API_URL(), 'operations', {
      operation_kind: 'delegation',
      ...opts,
    });
  },
  getOperations(opts = {}) {
    return get(this.API_URL(), 'operations', opts, false);
  },
  getOriginations(opts = {}) {
    return get(this.API_URL(), 'operations', {
      operation_kind: 'origination',
      ...opts,
    });
  },
  getActivations(opts = {}) {
    return get(this.API_URL(), 'operations', {
      operation_kind: 'activate_account',
      ...opts,
    });
  },
  getDoubleBaking(opts = {}) {
    return get(this.API_URL(), 'double_bakings', {
      ...opts,
    });
  },
  getDoubleEndorsement(opts = {}) {
    return get(this.API_URL(), 'double_endorsements', {
      ...opts,
    });
  },
  getBlockHead(opts = {}) {
    return get(this.API_URL(), 'blocks/head', opts);
  },
  getInfo(opts = {}) {
    return get(this.API_URL(), 'info', opts);
  },
  getBlock(opts = {}) {
    const { block = 'head' } = opts;
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
    return get(this.API_URL(), 'blocks', opts);
  },
  getSnapshots(opts = {}) {
    return get(this.API_URL(), 'snapshots', opts);
  },
  getBakingRights(opts = {}) {
    return get(this.API_URL(), 'baking_rights', opts);
  },
  getFutureBakingRights(opts = {}) {
    return get(this.API_URL(), 'future_baking_rights', opts);
  },
  getPeriod(opts = {}) {
    return get(this.API_URL_WITHOUT_PLATFORM(), 'period', opts);
  },
  getPeriods(opts = {}) {
    return get(this.API_URL_WITHOUT_PLATFORM(), 'periods', opts);
  },
  getProposals(opts = {}) {
    return get(this.API_URL_WITHOUT_PLATFORM(), `proposals`, opts);
  },
  getBallots(opts = {}) {
    const { id } = opts;
    return get(this.API_URL_WITHOUT_PLATFORM(), `ballots/${id}`, opts);
  },
  getBallot(opts = {}) {
    return get(this.API_URL(), 'operations', {
      ...opts,
    });
  },
  getVoters(opts = {}) {
    const { id } = opts;
    return get(this.API_URL_WITHOUT_PLATFORM(), `proposal_votes/${id}`, opts);
  },
  getNonVoters(opts = {}) {
    const { id } = opts;
    return get(this.API_URL_WITHOUT_PLATFORM(), `non_voters/${id}`, opts);
  },
  getProtocols(opts = {}) {
    return get(this.API_URL_WITHOUT_PLATFORM(), `protocols`, opts);
  },
  getCharts(opts = {}) {
    return get(this.API_URL(), 'charts', opts, false);
  },
  getBakersRollsChart(opts = {}) {
    return get(this.API_URL(), 'charts/bakers', opts, false);
  },
  getBlocksPriorityChart(opts = {}) {
    return get(this.API_URL(), 'charts/blocks_priority', opts, false);
  },
  getAssets(opts = {}) {
    return get(this.API_URL_WITHOUT_PLATFORM(), 'assets', opts);
  },
  getAssetsById(opts = {}) {
    const { asset_id } = opts;
    return get(this.API_URL_WITHOUT_PLATFORM(), `assets/${asset_id}`, opts);
  },
  getAssetsOperationsById(opts = {}) {
    const { assets_id } = opts;
    return get(
      this.API_URL_WITHOUT_PLATFORM(),
      `assets/${assets_id}/operations`,
      opts,
    );
  },
  getAssetsHoldersById(opts = {}) {
    const { assets_id } = opts;
    return get(
      this.API_URL_WITHOUT_PLATFORM(),
      `assets/${assets_id}/holders`,
      opts,
    );
  },
  checkHealth(opts = {}) {
    return get(this.API_URL(), 'health', opts, false);
  },
  getMempool(opts = {}) {
    return get(this.API_URL(), 'mempool', opts, false);
  },
};

export default TzAPI;
