<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <BakerSingle :hash="hash" />
      </b-container>
    </section>

    <section class="mt-0">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <b-tabs lazy>
                <b-tab :title="$tc('opTypes.tx', 2)" active>
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.txsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerTxsList
                      @onReload="reload"
                      :txs="txs"
                      :count="counts.txs"
                      :account="hash"
                      :currentPage="page.txs"
                      :perPage="limit.txs"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('opTypes.delegation', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.delegationsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerDelegationsList
                      @onReload="reload"
                      :delegations="delegations"
                      :count="counts.delegations"
                      :account="hash"
                      :currentPage="page.delegations"
                      :perPage="limit.delegations"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('opTypes.origination', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.originationsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerOriginationsList
                      @onReload="reload"
                      :originations="originations"
                      :count="counts.originations"
                      :account="hash"
                      :currentPage="page.originations"
                      :perPage="limit.originations"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab :title="$tc('opTypes.endorsement', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{
                          $t('listTypes.endorsementsList')
                        }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerEndorsementsList
                      @onReload="reload"
                      :endorsements="endorsements"
                      :count="counts.endorsements"
                      :account="hash"
                      :currentPage="page.endorsements"
                      :perPage="limit.endorsements"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                      :is-baker="true"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab :title="$t('common.baking')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{
                          $t('listTypes.bakingList')
                        }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerBakingList
                      @onReload="reload"
                      :data="baking.data"
                      :future="baking.future"
                      :total="baking.total"
                      :count="counts.baking"
                      :account="hash"
                      :currentPage="page.baking"
                      :perPage="limit.baking"
                      :loading="baking.loading"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>

                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{
                          $t('listTypes.endorsementsList')
                        }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerEndorsingList
                      @onReload="reload"
                      :data="endorsing.data"
                      :count="counts.endorsing"
                      :account="hash"
                      :currentPage="page.endorsing"
                      :perPage="limit.endorsing"
                      :loading="endorsing.loading"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab :title="$tc('common.reward', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{
                          $t('listTypes.rewardsList')
                        }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerRewardsList
                      @onReload="reload"
                      :data="rewards"
                      :count="counts.rewards"
                      :account="hash"
                      :currentPage="page.rewards"
                      :perPage="limit.rewards"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab :title="$t('common.bonds')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{ $t('listTypes.bondsList') }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerBondsList
                      @onReload="reload"
                      :data="bonds"
                      :count="counts.bonds"
                      :account="hash"
                      :currentPage="page.bonds"
                      :perPage="limit.bonds"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import BakerSingle from '@/components/bakers/BakerSingle';
  import BakerTxsList from '@/components/bakers/BakerTxsList';
  import BakerDelegationsList from '@/components/bakers/BakerDelegationsList';
  import BakerOriginationsList from '@/components/bakers/BakerOriginationsList';
  import BakerEndorsementsList from '@/components/bakers/BakerEndorsementsList';
  import BakerRewardsList from '@/components/bakers/BakerRewardsList';
  import BakerBakingList from '@/components/bakers/BakerBakingList';
  import BakerEndorsingList from '@/components/bakers/BakerEndorsingList';
  import BakerBondsList from '@/components/bakers/BakerBondsList';

  export default {
    name: 'Baker',
    components: {
      Breadcrumbs,
      BakerSingle,
      BakerTxsList,
      BakerDelegationsList,
      BakerOriginationsList,
      BakerEndorsementsList,
      BakerRewardsList,
      BakerBakingList,
      BakerEndorsingList,
      BakerBondsList,
    },
    data() {
      return {
        txs: [],
        delegations: [],
        originations: [],
        endorsements: [],
        baking: {
          total: null,
          future: null,
          data: [],
          loading: false,
        },
        endorsing: {
          total: null,
          future: null,
          data: [],
          loading: false,
        },
        rewards: [],
        bonds: [],
        counts: {
          txs: 0,
          delegations: 0,
          originations: 0,
          endorsements: 0,
          baking: 0,
          rewards: 0,
          endorsing: 0,
          bonds: 0,
        },
        page: {
          txs: 1,
          delegations: 1,
          originations: 1,
          endorsements: 1,
          baking: 1,
          rewards: 1,
          endorsing: 1,
          bonds: 1,
        },
        limit: {
          txs: this.$constants.PER_PAGE,
          delegations: this.$constants.PER_PAGE,
          originations: this.$constants.PER_PAGE,
          endorsements: this.$constants.PER_PAGE,
          baking: this.$constants.PER_PAGE,
          endorsing: this.$constants.PER_PAGE,
          rewards: 20,
          bonds: 20,
        },
      };
    },
    computed: {
      hash() {
        return this.$route.params.baker;
      },
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'bakers', text: this.$t('pageTypes.bakersPage') },
          { toRouteName: 'baker', text: this.hash },
        ];
      },
    },
    methods: {
      async reloadTxs({ limit, page }) {
        const props = {
          page,
          limit,
          account_id: this.hash,
        };
        const data = await this.$api.getTransactions(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.txs = data.data;
        this.counts.txs = data.count;
      },
      async reloadDelegations({ limit, page }) {
        const props = {
          page,
          limit,
          account_id: this.hash,
        };
        const data = await this.$api.getDelegations(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.delegations = data.data;
        this.counts.delegations = data.count;
      },
      async reloadOriginations({ limit, page }) {
        const props = {
          page,
          limit,
          account_id: this.hash,
        };
        const data = await this.$api.getOriginations(props);
        this.originations = data.data;
        this.counts.originations = data.count;
      },
      async reloadEndorsements({ limit, page }) {
        const props = {
          page,
          limit,
          account_id: this.hash,
        };
        const data = await this.$api.getEndorsements(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.counts.endorsements = data.count;
        this.endorsements = data.data;
      },
      async reloadBaking({ limit, page }) {
        const props = {
          page,
          limit,
          account: this.hash,
        };

        if (page === 1) {
          const total = await this.$api.getAccountBakingTotal({
            account: this.hash,
          });
          const future = await this.$api.getAccountBakingFuture({
            account: this.hash,
          });
          const data = await this.$api.getAccountBaking(props);

          this.baking.total = { ...total.data, status: 'Total' };
          this.baking.future = future.data.map((item) => ({
            ...item,
            class: 'future',
          }));

          this.baking.data = [
            ...this.baking.future,
            { ...total.data, cycle: 'Total', class: 'total', status: 'Total' },
            ...data.data,
          ];

          this.counts.baking = data.count;
        } else {
          const data = await this.$api.getAccountBaking(props);
          this.baking.data = data.data;
        }
      },
      async reloadRewards({ limit, page }) {
        const props = {
          page,
          limit,
          account: this.hash,
        };

        const data = await this.$api.getAccountRewards(props);
        this.rewards = data.data;
        this.counts.rewards = data.count;
      },
      async reloadBonds({ limit, page }) {
        const props = {
          page,
          limit,
          account: this.hash,
        };

        const data = await this.$api.getAccountBonds(props);
        this.bonds = data.data;
        this.counts.bonds = data.count;
      },
      async reloadEndorsing({ limit, page }) {
        const props = {
          page,
          limit,
          account: this.hash,
        };

        if (page === 1) {
          const total = await this.$api.getAccountEndorsingTotal({
            account: this.hash,
          });
          const future = await this.$api.getAccountEndorsingFuture({
            account: this.hash,
          });
          const data = await this.$api.getAccountEndorsing(props);

          this.endorsing.total = { ...total.data, status: 'Total' };
          this.endorsing.future = future.data.map((item) => ({
            ...item,
            class: 'future',
          }));
          this.endorsing.data = [
            ...this.endorsing.future,
            { ...total.data, cycle: 'Total', class: 'total', status: 'Total' },
            ...data.data,
          ];

          this.counts.endorsing = data.count;
        } else {
          const data = await this.$api.getAccountEndorsing(props);
          this.endorsing.data = data.data;
        }
      },
      async reload({ type, limit, page = 1 }) {
        if (type === 'txs') {
          await this.reloadTxs({ limit, page });
        }

        if (type === 'delegations') {
          await this.reloadDelegations({ limit, page });
        }

        if (type === 'originations') {
          await this.reloadOriginations({ limit, page });
        }

        if (type === 'endorsements') {
          await this.reloadEndorsements({ limit, page });
        }

        if (type === 'baking') {
          await this.reloadBaking({ limit, page });
        }

        if (type === 'rewards') {
          await this.reloadRewards({ limit, page });
        }

        if (type === 'bonds') {
          await this.reloadBonds({ limit, page });
        }

        if (type === 'endorsing') {
          await this.reloadEndorsing({ limit, page });
        }
      },
      handlePageChange({ type, page }) {
        const limit = this.limit[type];
        this.page[type] = page;
        this.reload({ type, limit, page });
      },
      handleLimitChange({ type, limit }) {
        this.page[type] = 1;
        const page = this.page[type];
        this.limit[type] = limit;
        this.reload({ type, limit, page });
      },
    },
  };
</script>
