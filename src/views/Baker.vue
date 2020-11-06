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
                    <TxsTabList
                      :txs="txs"
                      :count="counts.txs"
                      :account="hash"
                      :current-page="page.txs"
                      :per-page="limit.txs"
                      :loaded="loaded.txs"
                      :loading="loading.txs"
                      @onReload="reload"
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
                    <DelegationsTabList
                      :delegations="delegations"
                      :count="counts.delegations"
                      :account="hash"
                      :current-page="page.delegations"
                      :per-page="limit.delegations"
                      :loaded="loaded.delegations"
                      :loading="loading.delegations"
                      @onReload="reload"
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
                    <OriginationsTabList
                      :originations="originations"
                      :count="counts.originations"
                      :account="hash"
                      :current-page="page.originations"
                      :per-page="limit.originations"
                      :loaded="loaded.originations"
                      :loading="loading.originations"
                      @onReload="reload"
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
                    <EndorsementsTabList
                      :endorsements="endorsements"
                      :count="counts.endorsements"
                      :account="hash"
                      :current-page="page.endorsements"
                      :per-page="limit.endorsements"
                      :loaded="loaded.endorsements"
                      :loading="loading.endorsements"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
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
                    <BakingTabList
                      :future="baking.future"
                      :loading="baking.loading"
                      :data="baking.data"
                      :total="baking.total"
                      :count="counts.baking"
                      :account="hash"
                      :current-page="page.baking"
                      :per-page="limit.baking"
                      :loaded="loaded.baking"
                      @onReload="reload"
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
                      :data="endorsing.data"
                      :count="counts.endorsing"
                      :account="hash"
                      :current-page="page.endorsing"
                      :per-page="limit.endorsing"
                      :loading="endorsing.loading"
                      :loaded="loaded.endorsing"
                      @onReload="reload"
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
                      :data="rewards"
                      :count="counts.rewards"
                      :account="hash"
                      :current-page="page.rewards"
                      :per-page="limit.rewards"
                      :loaded="loaded.rewards"
                      :loading="loading.rewards"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab :title="$t('common.bonds')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">{{
                          $t('listTypes.bondsList')
                        }}</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BondsTabList
                      :data="bonds"
                      :count="counts.bonds"
                      :account="hash"
                      :current-page="page.bonds"
                      :per-page="limit.bonds"
                      :loaded="loaded.bonds"
                      :loading="loading.bonds"
                      @onReload="reload"
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
  import TxsTabList from '@/components/partials/tabs/TxsTabList';
  import DelegationsTabList from '@/components/partials/tabs/DelegationsTabList';
  import OriginationsTabList from '@/components/partials/tabs/OriginationsTabList';
  import EndorsementsTabList from '@/components/partials/tabs/EndorsementsTabList';
  import BakingTabList from '@/components/partials/tabs/BakingTabList';
  import BondsTabList from '@/components/partials/tabs/BondsTabList';
  import BakerEndorsingList from '@/components/bakers/BakerEndorsingList';
  import BakerRewardsList from '@/components/bakers/BakerRewardsList';
  import reloadTabTables from '@/mixins/reloadTabulationList';

  export default {
    name: 'Baker',
    components: {
      Breadcrumbs,
      BakerSingle,
      TxsTabList,
      DelegationsTabList,
      OriginationsTabList,
      EndorsementsTabList,
      BakerRewardsList,
      BakingTabList,
      BakerEndorsingList,
      BondsTabList,
    },
    mixins: [reloadTabTables],
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
  };
</script>
