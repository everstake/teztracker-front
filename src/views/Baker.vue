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
                    <TxsTabList :hash="hash" />
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
                    <DelegationsTabList :hash="hash" />
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
                    <OriginationsTabList :account="hash" />
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
                    <EndorsementsTabList :hash="hash" />
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
                    <BakingTabList :hash="hash" />
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
                    <BakerEndorsingList :hash="hash" />
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
                    <BakerRewardsList :hash="hash" />
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
                    <BondsTabList :hash="hash" />
                  </b-card-body>
                </b-tab>
                <template #tabs-end>
                  <ExportAccountReport />
                </template>
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
  import ExportAccountReport from '@/components/partials/ExportAccountReport';

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
      ExportAccountReport,
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
  };
</script>
