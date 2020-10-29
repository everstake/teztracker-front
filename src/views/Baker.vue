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
                      @onReload="reload"
                      :txs="txs"
                      :count="counts.txs"
                      :account="hash"
                      :currentPage="page.txs"
                      :perPage="limit.txs"
                      :loaded="loaded.txs"
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
                      @onReload="reload"
                      :delegations="delegations"
                      :count="counts.delegations"
                      :account="hash"
                      :currentPage="page.delegations"
                      :perPage="limit.delegations"
                      :loaded="loaded.delegations"
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
                      @onReload="reload"
                      :originations="originations"
                      :count="counts.originations"
                      :account="hash"
                      :currentPage="page.originations"
                      :perPage="limit.originations"
                      :loaded="loaded.originations"
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
                      @onReload="reload"
                      :endorsements="endorsements"
                      :count="counts.endorsements"
                      :account="hash"
                      :currentPage="page.endorsements"
                      :perPage="limit.endorsements"
                      :loaded="loaded.endorsements"
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
                    <BakingTabList
                      @onReload="reload"
                      :data="baking.data"
                      :future="baking.future"
                      :total="baking.total"
                      :count="counts.baking"
                      :account="hash"
                      :currentPage="page.baking"
                      :perPage="limit.baking"
                      :loading="baking.loading"
                      :loaded="loaded.baking"
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
                      :loaded="loaded.endorsing"
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
                      :loaded="loaded.rewards"
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
                    <BondsTabList
                      @onReload="reload"
                      :data="bonds"
                      :count="counts.bonds"
                      :account="hash"
                      :currentPage="page.bonds"
                      :perPage="limit.bonds"
                      :loaded="loaded.bonds"
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
  import reloadPartialTables from '@/mixins/reloadPartialTables';

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
    mixins: [reloadPartialTables],
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
