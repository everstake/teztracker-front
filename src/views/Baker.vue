<template>
  <PageContentContainer page-name="Baker page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
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
                            {{ $t("listTypes.txsList") }}
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
                            {{ $t("listTypes.delegationsList") }}
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
                            {{ $t("listTypes.originationsList") }}
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
                          <span class="text">Endorsements</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <EndorsementsList :is-baker="true" :account="hash"></EndorsementsList>
                    </b-card-body>
                  </b-tab>
  
                  <b-tab :title="$tc('common.reward', 2)">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">{{ $t('listTypes.rewardsList') }}</span>
                        </h3>
                      </div>
                    </b-card-header>
    
                    <b-card-body>
                      <BakerRewardsList :account="hash"></BakerRewardsList>
                    </b-card-body>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
import PageContentContainer from "../layouts/PageContentContainer";
import Breadcrumbs from "../components/partials/Breadcrumbs";
import BakerSingle from "../components/bakers/BakerSingle";
import TxsList from "../components/transactions/TxsList";
import DelegationsList from "../components/delegations/DelegationsList";
import OriginationsList from "../components/originations/OriginationsList";
import EndorsementsList from "../components/endorsements/EndorsementsList";
import BakerRewardsList from "@/components/bakers/BakerRewardsList";

export default {
  name: "Baker",
  components: {
    PageContentContainer,
    Breadcrumbs,
    BakerSingle,
    TxsList,
    DelegationsList,
    OriginationsList,
    EndorsementsList,
    BakerRewardsList
  },
  computed: {
    hash() {
      return this.$route.params.baker;
    },
    crumbs() {
      return [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "bakers", text: this.$t("pageTypes.bakersPage") },
        { toRouteName: "baker", text: this.hash }
      ];
    }
  }
};
</script>
