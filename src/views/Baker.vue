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
              <b-tabs>
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
                    <TxsList :account="hash" />
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
                    <DelegationsList :account="hash" />
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
                    <OriginationsList :account="hash" />
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
                    <EndorsementsList
                      :is-baker="true"
                      :account="hash"
                    ></EndorsementsList>
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
                    <BakerBakingList :account="hash"></BakerBakingList>
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
                    <BakerEndorsingList :account="hash"></BakerEndorsingList>
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
                    <BakerRewardsList :account="hash"></BakerRewardsList>
                  </b-card-body>
                </b-tab>

                <b-tab title="Bonds">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">Bonds list</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <BakerBondsList :account="hash"></BakerBondsList>
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
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import BakerSingle from '../components/bakers/BakerSingle';
  import TxsList from '../components/transactions/TxsList';
  import DelegationsList from '../components/delegations/DelegationsList';
  import OriginationsList from '../components/originations/OriginationsList';
  import EndorsementsList from '../components/endorsements/EndorsementsList';
  import BakerRewardsList from '@/components/bakers/BakerRewardsList';
  import BakerBakingList from '../components/bakers/BakerBakingList';
  import BakerEndorsingList from '../components/bakers/BakerEndorsingList';
  import BakerBondsList from '../components/bakers/BakerBondsList';

  export default {
    name: 'Baker',
    components: {
      Breadcrumbs,
      BakerSingle,
      TxsList,
      DelegationsList,
      OriginationsList,
      EndorsementsList,
      BakerRewardsList,
      BakerBakingList,
      BakerEndorsingList,
      BakerBondsList,
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
